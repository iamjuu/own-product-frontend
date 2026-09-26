import React, { useState, useEffect, useRef } from 'react';
import {
  Bike,
  Store,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Navigation,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Map,
  Compass,
  Radio,
  Play,
  Pause
} from 'lucide-react';
import ApiClient from '../../api/client';
import { RealtimeLiveMap } from './RealtimeLiveMap';
import { getSocket } from '../../api/socket';

// Haversine formula for exact distance between two GPS coordinates (in km)
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 1.2;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
};

export const LiveDeliveryTrackingModal = ({ isOpen, onClose, order, onStatusUpdated }) => {
  if (!isOpen || !order) return null;

  const orderId = order._id || order.id;

  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('MAP'); // 'MAP' | 'RADAR'
  const [simulatedProgress, setSimulatedProgress] = useState(0.68);
  const [callInitiated, setCallInitiated] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Real-time GPS state
  const [liveLocation, setLiveLocation] = useState(null);
  const [isLiveGpsActive, setIsLiveGpsActive] = useState(false);
  const [isSimulatingGps, setIsSimulatingGps] = useState(false);
  const simulationTimerRef = useRef(null);
  const simulationStepRef = useRef(0.45);

  const fetchTracking = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ApiClient.get(`/public/orders/${orderId}/live-tracking`);
      if (res.success && res.data) {
        setTrackingData(res.data);
        if (res.data.liveTracking?.progressRatio) {
          setSimulatedProgress(res.data.liveTracking.progressRatio);
        }
        if (res.data.liveTracking?.riderLocation) {
          setLiveLocation(res.data.liveTracking.riderLocation);
        }
        if (res.data.liveTracking?.isLiveGps) {
          setIsLiveGpsActive(true);
        }
      }
    } catch (err) {
      console.warn('Using order fallback for tracking:', err);
      // Fallback telemetry if network issue
      setTrackingData({
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status || 'OUT_FOR_DELIVERY',
          items: order.items || [],
          totalAmount: order.totalAmount,
          deliveryOtp: order.deliveryOtp || '4829',
        },
        pickupLocation: {
          title: order.shopName || 'Merchant Store',
          address: '100 Feet Road, Indiranagar',
          city: 'Bengaluru',
          lat: 12.9784,
          lng: 77.6408,
        },
        dropLocation: {
          title: order.customerName,
          address: order.deliveryAddress?.street || '5th Block, Koramangala',
          city: order.deliveryAddress?.city || 'Bengaluru',
          lat: order.deliveryAddress?.lat || 12.9352,
          lng: order.deliveryAddress?.lng || 77.6245,
        },
        deliveryPartner: {
          name: order.deliveryPartnerName || 'Rahul Kumar',
          phone: order.deliveryPartnerPhone || '+91 98765 43210',
          vehicleType: 'BIKE',
          vehicleNumber: 'KA-01-EA-4521',
          rating: 4.88,
          totalDeliveries: 1420,
          safetyStatus: 'Vaccinated • Helmet Verified',
        },
        liveTracking: {
          step: order.status === 'DELIVERED' ? 5 : 4,
          progressRatio: 0.72,
          etaMinutes: 8,
          distanceRemainingKm: 0.9,
          statusMessage: 'Delivery partner is on the way with your order! Riding safely.',
          isLiveGps: false,
          riderLocation: {
            lat: 12.9568,
            lng: 77.6326,
            heading: 145,
            speed: 32,
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Initial Load & Background Polling Fallback
  useEffect(() => {
    fetchTracking();
    if (!isOpen) return;
    const pollInterval = setInterval(() => {
      fetchTracking();
    }, 4000);
    return () => clearInterval(pollInterval);
  }, [orderId, isOpen]);

  // 2. Real-Time Socket.IO GPS & Telemetry Subscription
  useEffect(() => {
    if (!isOpen || !orderId) return;

    const socket = getSocket();

    // Join order-specific room for direct live tracking
    socket.emit('join_order', { orderId });

    // Handle real-time GPS coordinate broadcasts from rider
    const handleLocationUpdate = (payload) => {
      if (payload && payload.lat != null && payload.lng != null) {
        setLiveLocation({
          lat: payload.lat,
          lng: payload.lng,
          heading: payload.heading || 0,
          speed: payload.speed || 0,
          accuracy: payload.accuracy,
        });
        setIsLiveGpsActive(true);
      }
    };

    // Handle real-time status changes
    const handleStatusUpdate = (updatedOrder) => {
      if (updatedOrder && (updatedOrder._id === orderId || updatedOrder.id === orderId)) {
        fetchTracking();
        if (onStatusUpdated) onStatusUpdated(updatedOrder.status);
      }
    };

    socket.on('order:location_updated', handleLocationUpdate);
    socket.on(`order:${orderId}:location`, handleLocationUpdate);
    socket.on('order:status_updated', handleStatusUpdate);

    return () => {
      socket.emit('leave_order', { orderId });
      socket.off('order:location_updated', handleLocationUpdate);
      socket.off(`order:${orderId}:location`, handleLocationUpdate);
      socket.off('order:status_updated', handleStatusUpdate);
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    };
  }, [isOpen, orderId]);

  // 3. Fallback pulsing animation simulation for radar arc view
  useEffect(() => {
    if (!isOpen || isLiveGpsActive) return;
    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 0.94) return 0.55;
        return Number((prev + 0.015).toFixed(3));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen, isLiveGpsActive]);

  // 4. Interactive Live GPS Telemetry Simulator (For instant browser testing)
  const toggleGpsSimulation = () => {
    if (isSimulatingGps) {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      setIsSimulatingGps(false);
      return;
    }

    setIsSimulatingGps(true);
    const socket = getSocket();

    const startLat = trackingData?.pickupLocation?.lat || 12.9784;
    const startLng = trackingData?.pickupLocation?.lng || 77.6408;
    const endLat = trackingData?.dropLocation?.lat || 12.9352;
    const endLng = trackingData?.dropLocation?.lng || 77.6245;

    simulationTimerRef.current = setInterval(() => {
      simulationStepRef.current += 0.035;
      if (simulationStepRef.current > 0.98) {
        simulationStepRef.current = 0.15; // Loop for continuous live demonstration
      }

      const fraction = simulationStepRef.current;
      // Interpolate with realistic slight curve
      const curve = Math.sin(fraction * Math.PI) * 0.004;
      const currentLat = Number((startLat + (endLat - startLat) * fraction + curve).toFixed(6));
      const currentLng = Number((startLng + (endLng - startLng) * fraction).toFixed(6));

      // Calculate bearing angle
      const y = endLng - startLng;
      const x = endLat - startLat;
      const heading = Math.round((Math.atan2(y, x) * (180 / Math.PI) + 360) % 360);
      const simulatedSpeed = Math.round(28 + Math.random() * 8);

      const payload = {
        orderId,
        lat: currentLat,
        lng: currentLng,
        heading,
        speed: simulatedSpeed,
        accuracy: 4,
      };

      // Broadcast through live WebSocket so entire app receives real GPS events
      if (socket && socket.connected) {
        socket.emit('rider:location_update', payload);
      } else {
        setLiveLocation(payload);
        setIsLiveGpsActive(true);
      }
    }, 1500);
  };

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await ApiClient.patch(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      await fetchTracking();
      if (onStatusUpdated) onStatusUpdated(newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const partner = trackingData?.deliveryPartner;
  const currentStep = trackingData?.liveTracking?.step || 4;

  // Real-time calculation of remaining distance and dynamic ETA
  const dropLat = trackingData?.dropLocation?.lat || 12.9352;
  const dropLng = trackingData?.dropLocation?.lng || 77.6245;
  const curRiderLat = liveLocation?.lat || trackingData?.liveTracking?.riderLocation?.lat || 12.9568;
  const curRiderLng = liveLocation?.lng || trackingData?.liveTracking?.riderLocation?.lng || 77.6326;

  const realDistanceKm = calculateDistanceKm(curRiderLat, curRiderLng, dropLat, dropLng);
  // Average city delivery speed ~ 26 km/h
  const currentSpeed = liveLocation?.speed || 30;
  const realEtaMinutes = Math.max(2, Math.round((realDistanceKm / (currentSpeed || 26)) * 60));

  // Dynamic ETA & Distance: use real GPS calculations if live GPS active
  const distanceKm = isLiveGpsActive ? realDistanceKm : Math.max(0.2, Number(((1 - simulatedProgress) * 2.8).toFixed(1)));
  const etaMinutes = isLiveGpsActive ? realEtaMinutes : Math.max(2, Math.round((1 - simulatedProgress) * 20));

  // SVG Coordinates calculation for animated route (Radar view)
  const riderT = simulatedProgress;
  const p0 = { x: 75, y: 155 };
  const p1 = { x: 250, y: 45 };
  const p2 = { x: 425, y: 155 };

  const riderX = (1 - riderT) * (1 - riderT) * p0.x + 2 * (1 - riderT) * riderT * p1.x + riderT * riderT * p2.x;
  const riderY = (1 - riderT) * (1 - riderT) * p0.y + 2 * (1 - riderT) * riderT * p1.y + riderT * riderT * p2.y;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-[#181829] via-[#221f3d] to-[#181829] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6339f4] to-[#fc8019] flex items-center justify-center shadow-md">
              <Bike className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#fc8019]">
                  Live Delivery Radar
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping" />
                  {isLiveGpsActive ? '● Real-time GPS' : '● Live Stream'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Order #{order?.orderNumber} • {order?.shopName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchTracking}
              disabled={isLoading}
              title="Refresh telemetry"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs flex items-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* View Mode Switcher & Real-time GPS Telemetry Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#f4f7fb] rounded-2xl border border-slate-200/90 text-xs">
            <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl shadow-xs border border-slate-200/70">
              <button
                onClick={() => setViewMode('MAP')}
                className={`px-3 py-1.5 rounded-lg font-black text-xs flex items-center space-x-1.5 transition-all ${
                  viewMode === 'MAP'
                    ? 'bg-[#6339f4] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Live Street Map (GPS)</span>
              </button>
              <button
                onClick={() => setViewMode('RADAR')}
                className={`px-3 py-1.5 rounded-lg font-black text-xs flex items-center space-x-1.5 transition-all ${
                  viewMode === 'RADAR'
                    ? 'bg-[#fc8019] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Swiggy Radar Arc</span>
              </button>
            </div>

            {/* Test GPS Simulator Button */}
            <button
              onClick={toggleGpsSimulation}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border shadow-xs ${
                isSimulatingGps
                  ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
              title="Test real-time WebSocket GPS movement"
            >
              {isSimulatingGps ? <Pause className="w-3 h-3 text-amber-700" /> : <Play className="w-3 h-3 text-[#6339f4]" />}
              <span>{isSimulatingGps ? 'Pause GPS Drive' : 'Test Real-Time GPS'}</span>
            </button>
          </div>

          {/* ETA Floating Capsule */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#fc8019] to-[#e66c0d] flex items-center justify-center text-white shadow-md shadow-[#fc8019]/25">
                <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-black text-[#181829] tracking-tight">
                    Arriving in {etaMinutes} Mins
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                    ⚡ Live GPS Feed
                  </span>
                </div>
                <p className="text-[11px] text-[#8a87a6] font-medium">
                  {distanceKm} km away • {isLiveGpsActive ? `Riding at ~${currentSpeed || 32} km/h` : 'Tracking live movement'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-[10px] font-bold text-[#8a87a6] uppercase tracking-wider">
                Pickup Store:
              </span>
              <span className="font-bold text-[#181829] text-[11px] bg-purple-50 text-[#6339f4] px-2.5 py-0.5 rounded-lg border border-purple-100">
                {order?.shopName}
              </span>
            </div>
          </div>

          {/* MAIN VISUALIZER: REAL-TIME LEAFLET MAP vs SWIGGY RADAR */}
          {viewMode === 'MAP' ? (
            <div className="h-64 sm:h-72 w-full">
              <RealtimeLiveMap
                pickupLocation={trackingData?.pickupLocation}
                dropLocation={trackingData?.dropLocation}
                riderLocation={liveLocation || trackingData?.liveTracking?.riderLocation}
                deliveryPartner={partner}
                isLiveGps={isLiveGpsActive}
              />
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-[#f4f7fb] p-4 shadow-inner">
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#6339f4 0.75px, transparent 0.75px), radial-gradient(#d1d5db 0.75px, #f4f7fb 0.75px)`,
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px',
                }}
              />

              {/* Animated Route Canvas SVG */}
              <div className="relative h-48 w-full my-2 flex items-center justify-center">
                <svg
                  viewBox="0 0 500 200"
                  className="w-full h-full drop-shadow-sm select-none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M 75 155 Q 250 45 425 155"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 75 155 Q 250 45 425 155"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 75 155 Q 250 45 425 155"
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="8"
                    strokeDasharray="400"
                    strokeDashoffset={400 * (1 - simulatedProgress)}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />

                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6339f4" />
                      <stop offset="60%" stopColor="#fc8019" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <filter id="riderGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#fc8019" floodOpacity="0.4" />
                    </filter>
                  </defs>

                  {/* START: Shop */}
                  <g transform="translate(55, 125)">
                    <circle cx="20" cy="30" r="16" fill="#6339f4" />
                    <circle cx="20" cy="30" r="22" fill="#6339f4" opacity="0.15" />
                    <foreignObject x="10" y="20" width="20" height="20">
                      <Store className="w-5 h-5 text-white" />
                    </foreignObject>
                    <text x="20" y="58" textAnchor="middle" fill="#181829" fontSize="10" fontWeight="bold">
                      Shop / Kitchen
                    </text>
                  </g>

                  {/* END: Customer */}
                  <g transform="translate(405, 125)">
                    <circle cx="20" cy="30" r="16" fill="#10b981" />
                    <circle cx="20" cy="30" r="22" fill="#10b981" opacity="0.15" />
                    <foreignObject x="10" y="20" width="20" height="20">
                      <MapPin className="w-5 h-5 text-white" />
                    </foreignObject>
                    <text x="20" y="58" textAnchor="middle" fill="#181829" fontSize="10" fontWeight="bold">
                      Delivery Address
                    </text>
                  </g>

                  {/* MOVING RIDER */}
                  <g
                    transform={`translate(${riderX}, ${riderY})`}
                    filter="url(#riderGlow)"
                    className="transition-transform duration-700 ease-out"
                  >
                    <circle cx="0" cy="0" r="24" fill="#fc8019" opacity="0.15" className="animate-ping" />
                    <circle cx="0" cy="0" r="16" fill="#fc8019" opacity="0.25" />
                    <circle cx="0" cy="0" r="14" fill="#fc8019" stroke="#ffffff" strokeWidth="2.5" />
                    <foreignObject x="-9" y="-9" width="18" height="18">
                      <Bike className="w-4 h-4 text-white" />
                    </foreignObject>
                    <g transform="translate(0, -22)">
                      <rect x="-42" y="-12" width="84" height="16" rx="8" fill="#181829" />
                      <text x="0" y="0" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                        🛵 {partner?.name?.split(' ')[0] || 'Rahul'} En Route
                      </text>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          )}

          {/* Live Status Callout Banner */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 via-purple-50 to-white rounded-2xl border border-orange-200/70 text-xs">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#fc8019] shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="font-semibold text-slate-800">
                {isLiveGpsActive
                  ? `Live GPS coordinates streaming: ${Number(curRiderLat).toFixed(4)}, ${Number(curRiderLng).toFixed(4)}`
                  : (trackingData?.liveTracking?.statusMessage || 'Delivery partner is on the way with your order!')}
              </span>
            </div>
            <span className="font-mono font-black text-[#fc8019] text-[11px] bg-white px-2.5 py-0.5 rounded-lg border border-orange-200 shadow-xs">
              {isLiveGpsActive ? '● REAL-TIME GPS' : `${Math.round(simulatedProgress * 100)}% Completed`}
            </span>
          </div>

          {/* Delivery Partner Profile Card (Swiggy Style) */}
          <div className="p-4 rounded-3xl bg-[#f0f2fb] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#6339f4] to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md">
                  {partner?.name?.slice(0, 2).toUpperCase() || 'RK'}
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-black">
                  ✓
                </span>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className="font-black text-sm text-[#181829]">
                    {partner?.name || 'Rahul Kumar'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-800 text-[10px] font-black flex items-center space-x-0.5">
                    <span>★</span>
                    <span>{partner?.rating || '4.9'}</span>
                  </span>
                </div>
                <p className="text-xs text-[#8a87a6] font-medium">
                  {partner?.vehicleType || 'Motorbike'} • <span className="font-mono font-bold text-slate-700">{partner?.vehicleNumber || 'KA-01-EA-4521'}</span>
                </p>
                <div className="flex items-center space-x-1.5 text-[10px] text-emerald-700 font-semibold pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{partner?.safetyStatus || 'Vaccinated • Mask & Helmet Verified'}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCallInitiated(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Rider</span>
              </button>

              <button
                onClick={() => alert(`Direct SMS to ${partner?.phone || '+91 98765 43210'}: "Please ring bell upon arrival"`)}
                className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center space-x-1.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#6339f4]" />
                <span>Instructions</span>
              </button>
            </div>
          </div>

          {/* Active Call State Simulation */}
          {callInitiated && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center animate-pulse">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Calling {partner?.name} ({partner?.phone || '+91 98765 43210'})...</p>
                  <p className="text-[10px] text-emerald-600">Masked VoIP bridge connected via marketplace router</p>
                </div>
              </div>
              <button
                onClick={() => setCallInitiated(false)}
                className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[10px]"
              >
                End Call
              </button>
            </div>
          )}

          {/* Swiggy 5-Step Order Timeline */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-[#8a87a6]">
              Order Journey Milestone Tracker
            </h4>

            <div className="grid grid-cols-5 gap-1 text-center">
              {[
                { title: 'Confirmed', step: 1, icon: '✓', done: currentStep >= 1 },
                { title: 'Prepared', step: 2, icon: '🍲', done: currentStep >= 2 },
                { title: 'Picked Up', step: 3, icon: '📦', done: currentStep >= 3 },
                { title: 'On The Way', step: 4, icon: '🛵', done: currentStep >= 4, active: currentStep === 4 },
                { title: 'Delivered', step: 5, icon: '🏠', done: currentStep >= 5 },
              ].map((m, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      m.done
                        ? m.active
                          ? 'bg-[#fc8019] text-white shadow-lg shadow-[#fc8019]/40 ring-4 ring-[#fc8019]/20 animate-pulse'
                          : 'bg-[#6339f4] text-white'
                        : 'bg-[#f0f2fb] text-slate-400 border border-slate-200'
                    }`}
                  >
                    {m.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      m.active ? 'text-[#fc8019]' : m.done ? 'text-[#181829]' : 'text-slate-400'
                    }`}
                  >
                    {m.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Doorstep Handover Verification OTP Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#ece8ff] to-[#f4f2ff] border border-[#d8cfff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#6339f4]" />
                <span className="text-xs font-black text-[#181829]">Doorstep Delivery OTP</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Share this secure 4-digit code with <span className="font-bold">{partner?.name}</span> to verify food handover.
              </p>
            </div>

            <div className="flex items-center space-x-1.5 self-start sm:self-auto">
              {(trackingData?.order?.deliveryOtp || '4829').split('').map((char, i) => (
                <span
                  key={i}
                  className="w-8 h-9 rounded-xl bg-white border border-[#6339f4]/40 font-mono font-black text-base text-[#6339f4] flex items-center justify-center shadow-sm"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* Operations Dispatch Controls */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[10px] text-[#8a87a6] font-bold uppercase">
              Operations Dispatch Controls:
            </span>
            <div className="flex items-center space-x-2">
              {order.status !== 'PICKED_UP' && (
                <button
                  onClick={() => handleUpdateStatus('PICKED_UP')}
                  disabled={isUpdatingStatus}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 transition-all"
                >
                  Set: Picked Up
                </button>
              )}
              {order.status !== 'OUT_FOR_DELIVERY' && (
                <button
                  onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
                  disabled={isUpdatingStatus}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6339f4] text-[11px] font-bold border border-purple-200 transition-all"
                >
                  Set: Out For Delivery
                </button>
              )}
              {order.status !== 'DELIVERED' && (
                <button
                  onClick={() => handleUpdateStatus('DELIVERED')}
                  disabled={isUpdatingStatus}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 transition-all"
                >
                  Set: Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
