import React, { useState, useEffect, useRef } from 'react';
import {
  Bike,
  Navigation,
  MapPin,
  Store,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Phone,
  KeyRound,
  AlertCircle,
  PackageCheck,
  Compass,
  RefreshCw,
  Bell,
  BellOff,
  Sparkles,
  ShoppingBag,
  Check,
  X,
  Volume2,
  VolumeX,
  Radio,
  Flame,
  UserCheck,
  ExternalLink,
  Play,
  Pause,
  Crosshair,
  Map
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { RiderKpiCards } from './components/RiderKpiCards';
import { LiveDeliveryTrackingModal } from '../../../components/tracking/LiveDeliveryTrackingModal';
import { RealtimeLiveMap } from '../../../components/tracking/RealtimeLiveMap';
import {
  playRadarPing,
  startDeliveryBoyContinuousAlarm,
  stopDeliveryBoyContinuousAlarm,
  isDeliveryAlarmSounding
} from '../../../utils/soundAlert';
import { getSocket } from '../../../api/socket';

// Smart coordinate resolver for exact street locations
const resolveLocationCoords = (title = '', address = '', defaultLat = 12.9784, defaultLng = 77.6408) => {
  const text = `${title} ${address}`.toLowerCase();
  if (text.includes('shivaji') || text.includes('poultry') || text.includes('chicken')) return { lat: 12.9856, lng: 77.6057 };
  if (text.includes('indiranagar') || text.includes('hal') || text.includes('100ft') || text.includes('priya')) return { lat: 12.9784, lng: 77.6408 };
  if (text.includes('koramangala')) return { lat: 12.9352, lng: 77.6245 };
  if (text.includes('frazer') || text.includes('beef') || text.includes('halal')) return { lat: 12.9972, lng: 77.6133 };
  if (text.includes('whitefield')) return { lat: 12.9698, lng: 77.7499 };
  if (text.includes('hsr')) return { lat: 12.9121, lng: 77.6446 };
  if (text.includes('jayanagar')) return { lat: 12.9298, lng: 77.5843 };
  if (text.includes('malleshwaram')) return { lat: 13.0031, lng: 77.5643 };
  return { lat: defaultLat, lng: defaultLng };
};

// Calculate geographic distance in km (Haversine formula)
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined || lat1 === null || lon1 === null || lat2 === null || lon2 === null) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((Number(lat2) - Number(lat1)) * Math.PI) / 180;
  const dLon = ((Number(lon2) - Number(lon1)) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((Number(lat1) * Math.PI) / 180) *
      Math.cos((Number(lat2) * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(1));
};

export const DeliveryBoyDashboard = () => {
  const [broadcastOrders, setBroadcastOrders] = useState([]);
  const [rejectedOrderIds, setRejectedOrderIds] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('rider_rejected_orders') || '[]');
    } catch {
      return [];
    }
  });
  const [activeTrip, setActiveTrip] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState(null);
  const [showRadar, setShowRadar] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [deliverySuccessMessage, setDeliverySuccessMessage] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Real-Time GPS Broadcaster State
  const [isBroadcastingGps, setIsBroadcastingGps] = useState(false);
  const [isSimulatingGps, setIsSimulatingGps] = useState(false);
  const [currentGpsInfo, setCurrentGpsInfo] = useState(null);
  const [riderDeviceLocation, setRiderDeviceLocation] = useState(null);
  const [riderMapMode, setRiderMapMode] = useState('MAP'); // 'MAP' | 'RADAR'
  const watchPositionIdRef = useRef(null);
  const riderSimTimerRef = useRef(null);
  const simStepRef = useRef(0.2);

  // Auto-acquire rider browser GPS on mount for alarm period distance calculations
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setRiderDeviceLocation({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          });
        },
        (err) => {
          console.log('Rider geolocation standby:', err.message);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  const stopAllGpsBroadcasting = () => {
    if (watchPositionIdRef.current !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchPositionIdRef.current);
      watchPositionIdRef.current = null;
    }
    if (riderSimTimerRef.current) {
      clearInterval(riderSimTimerRef.current);
      riderSimTimerRef.current = null;
    }
    setIsBroadcastingGps(false);
    setIsSimulatingGps(false);
  };

  const toggleDeviceGps = () => {
    if (isBroadcastingGps) {
      stopAllGpsBroadcasting();
      return;
    }

    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser or device.');
      return;
    }

    if (isSimulatingGps) {
      if (riderSimTimerRef.current) clearInterval(riderSimTimerRef.current);
      setIsSimulatingGps(false);
    }

    const socket = getSocket();

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const speed = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 30;
        const heading = pos.coords.heading ? Math.round(pos.coords.heading) : 0;
        const accuracy = Math.round(pos.coords.accuracy);

        const payload = {
          orderId: activeTrip?._id,
          lat,
          lng,
          speed,
          heading,
          accuracy,
        };

        setCurrentGpsInfo(payload);

        if (socket && socket.connected && activeTrip?._id) {
          socket.emit('rider:location_update', payload);
        }
      },
      (err) => {
        console.warn('Geolocation watch error:', err.message);
        alert(`Location permission required to stream real GPS: ${err.message}`);
        stopAllGpsBroadcasting();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 2000,
      }
    );

    watchPositionIdRef.current = watchId;
    setIsBroadcastingGps(true);
  };

  const toggleSimulatedGps = () => {
    if (isSimulatingGps) {
      stopAllGpsBroadcasting();
      return;
    }

    if (isBroadcastingGps) {
      if (watchPositionIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current);
        watchPositionIdRef.current = null;
      }
      setIsBroadcastingGps(false);
    }

    const socket = getSocket();
    const shopC = (activeTrip?.shopId?.address?.lat && activeTrip?.shopId?.address?.lng && activeTrip.shopId.address.lat !== 12.9716)
      ? { lat: activeTrip.shopId.address.lat, lng: activeTrip.shopId.address.lng }
      : resolveLocationCoords(activeTrip?.shopName || activeTrip?.shopId?.name, activeTrip?.shopId?.address?.street, 12.9856, 77.6057);

    const dropC = (activeTrip?.deliveryAddress?.lat && activeTrip?.deliveryAddress?.lng && activeTrip.deliveryAddress.lat !== 12.9716)
      ? { lat: activeTrip.deliveryAddress.lat, lng: activeTrip.deliveryAddress.lng }
      : resolveLocationCoords(activeTrip?.customerName, activeTrip?.deliveryAddress?.street, 12.9784, 77.6408);

    const startLat = shopC.lat;
    const startLng = shopC.lng;
    const endLat = dropC.lat;
    const endLng = dropC.lng;

    setIsSimulatingGps(true);

    riderSimTimerRef.current = setInterval(() => {
      simStepRef.current += 0.03;
      if (simStepRef.current > 0.96) {
        simStepRef.current = 0.2;
      }

      const fraction = simStepRef.current;
      const curve = Math.sin(fraction * Math.PI) * 0.0035;
      const lat = Number((startLat + (endLat - startLat) * fraction + curve).toFixed(6));
      const lng = Number((startLng + (endLng - startLng) * fraction).toFixed(6));
      const speed = Math.round(28 + Math.random() * 8);

      const y = endLng - startLng;
      const x = endLat - startLat;
      const heading = Math.round((Math.atan2(y, x) * (180 / Math.PI) + 360) % 360);

      const payload = {
        orderId: activeTrip?._id,
        lat,
        lng,
        heading,
        speed,
        accuracy: 4,
      };

      setCurrentGpsInfo(payload);

      if (socket && socket.connected && activeTrip?._id) {
        socket.emit('rider:location_update', payload);
      }
    }, 1500);
  };

  useEffect(() => {
    return () => {
      stopAllGpsBroadcasting();
    };
  }, [activeTrip?._id]);

  // Fetch complete real rider telemetry: overview metrics, active trip, and available tickets
  const fetchRiderData = async () => {
    try {
      const [broadcastRes, activeRes, overviewRes] = await Promise.all([
        ApiClient.get('/delivery-boy/broadcast-orders'),
        ApiClient.get('/delivery-boy/active-order'),
        ApiClient.get('/delivery-boy/dashboard'),
      ]);

      if (broadcastRes.success && Array.isArray(broadcastRes.data)) {
        setBroadcastOrders(broadcastRes.data);
      }

      if (activeRes.success) {
        setActiveTrip(activeRes.data);
      }

      if (overviewRes.success && overviewRes.data) {
        setOverviewData(overviewRes.data);
      }
    } catch (err) {
      console.warn('Failed to refresh rider console:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Initial Load & Background Polling Fallback
  useEffect(() => {
    fetchRiderData();
    const interval = setInterval(fetchRiderData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. Real-Time Socket.IO Integration
  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);

    if (socket.connected) {
      setIsSocketConnected(true);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Event 1: New order broadcast received via Socket.io
    const handleNewBroadcast = (newOrder) => {
      if (!newOrder || !newOrder._id) return;
      setBroadcastOrders((prev) => {
        // If not already in list, prepend
        if (prev.some((o) => o._id === newOrder._id)) return prev;
        return [newOrder, ...prev];
      });
    };

    // Event 2: Order claimed by another rider
    const handleOrderClaimed = ({ orderId }) => {
      setBroadcastOrders((prev) => prev.filter((o) => o._id !== orderId));
    };

    socket.on('order:new_broadcast', handleNewBroadcast);
    socket.on('order:claimed', handleOrderClaimed);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('order:new_broadcast', handleNewBroadcast);
      socket.off('order:claimed', handleOrderClaimed);
    };
  }, []);

  // 3. CONTINUOUS ALARM LOGIC
  // If there is an actionable broadcast order and rider has NO active trip:
  // Play continuous alarm until rider accepts OR rejects!
  const pendingOrders = broadcastOrders.filter(
    (order) => !rejectedOrderIds.includes(order._id)
  );

  useEffect(() => {
    const hasUnactedOrder = pendingOrders.length > 0 && !activeTrip;

    if (hasUnactedOrder && !isAudioMuted) {
      startDeliveryBoyContinuousAlarm();
    } else {
      stopDeliveryBoyContinuousAlarm();
    }

    return () => {
      stopDeliveryBoyContinuousAlarm();
    };
  }, [pendingOrders.length, activeTrip, isAudioMuted]);

  // Action: ACCEPT ORDER
  const handleAcceptOrder = async (orderId) => {
    setIsAccepting(true);
    setAcceptError(null);
    stopDeliveryBoyContinuousAlarm();

    try {
      const res = await ApiClient.post(`/delivery-boy/orders/${orderId}/accept`);
      if (res.success && res.data) {
        setActiveTrip(res.data);
        setBroadcastOrders((prev) => prev.filter((o) => o._id !== orderId));
        // Refresh overview
        fetchRiderData();
      }
    } catch (err) {
      setAcceptError(err.message || 'Order was already accepted by another rider!');
      fetchRiderData();
    } finally {
      setIsAccepting(false);
    }
  };

  // Action: REJECT / DECLINE ORDER (Stops alarm for this order)
  const handleRejectOrder = (orderId) => {
    stopDeliveryBoyContinuousAlarm();
    const updated = [...rejectedOrderIds, orderId];
    setRejectedOrderIds(updated);
    try {
      sessionStorage.setItem('rider_rejected_orders', JSON.stringify(updated));
    } catch (e) {
      // Ignore storage error
    }

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('rider:reject_order', { orderId });
    }
  };

  // Step 1: Reach restaurant -> Mark Picked Up
  const handleConfirmPickup = async () => {
    if (!activeTrip) return;
    setIsUpdatingStatus(true);
    try {
      const res = await ApiClient.patch(`/delivery-boy/orders/${activeTrip._id}/status`, {
        status: 'PICKED_UP',
      });
      if (res.success && res.data) {
        setActiveTrip(res.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to update pickup status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Step 2: Start transit to customer -> Mark Out for Delivery
  const handleStartTransit = async () => {
    if (!activeTrip) return;
    setIsUpdatingStatus(true);
    try {
      const res = await ApiClient.patch(`/delivery-boy/orders/${activeTrip._id}/status`, {
        status: 'OUT_FOR_DELIVERY',
      });
      if (res.success && res.data) {
        setActiveTrip(res.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to update transit status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Step 3: Customer doorstep delivery OTP completion
  const handleCompleteDelivery = async (e) => {
    e?.preventDefault();
    if (!activeTrip) return;
    if (!enteredOtp || enteredOtp.trim().length === 0) {
      setOtpError('Please enter the 4-digit doorstep OTP given by the customer');
      return;
    }

    setIsUpdatingStatus(true);
    setOtpError(null);
    try {
      const res = await ApiClient.patch(`/delivery-boy/orders/${activeTrip._id}/status`, {
        status: 'DELIVERED',
        otp: enteredOtp.trim(),
      });
      if (res.success) {
        setDeliverySuccessMessage(
          `Order #${activeTrip.orderNumber} successfully completed! ₹${activeTrip.deliveryFee || 50} added to today's earnings.`
        );
        setActiveTrip(null);
        setEnteredOtp('');
        fetchRiderData();
        setTimeout(() => setDeliverySuccessMessage(null), 6000);
      }
    } catch (err) {
      setOtpError(err.message || 'Incorrect OTP code! Please verify with customer.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const shopCoords = (activeTrip?.shopId?.address?.lat && activeTrip?.shopId?.address?.lng && activeTrip.shopId.address.lat !== 12.9716)
    ? { lat: activeTrip.shopId.address.lat, lng: activeTrip.shopId.address.lng }
    : resolveLocationCoords(activeTrip?.shopName || activeTrip?.shopId?.name, activeTrip?.shopId?.address?.street, 12.9856, 77.6057);

  const dropCoords = (activeTrip?.deliveryAddress?.lat && activeTrip?.deliveryAddress?.lng && activeTrip.deliveryAddress.lat !== 12.9716)
    ? { lat: activeTrip.deliveryAddress.lat, lng: activeTrip.deliveryAddress.lng }
    : resolveLocationCoords(activeTrip?.customerName, activeTrip?.deliveryAddress?.street, 12.9784, 77.6408);

  const riderCoords = currentGpsInfo || activeTrip?.riderLocation || riderDeviceLocation || {
    lat: Number(((shopCoords.lat * 0.45) + (dropCoords.lat * 0.55)).toFixed(6)),
    lng: Number(((shopCoords.lng * 0.45) + (dropCoords.lng * 0.55)).toFixed(6)),
    heading: 125,
    speed: 30,
  };

  const currentLeg = activeTrip?.status === 'DELIVERY_PARTNER_ASSIGNED' ? 'TO_STORE' : 'TO_CUSTOMER';
  const activeLegDist = currentLeg === 'TO_STORE'
    ? (calculateDistanceKm(riderCoords.lat, riderCoords.lng, shopCoords.lat, shopCoords.lng) || 1.2)
    : (calculateDistanceKm(riderCoords.lat, riderCoords.lng, dropCoords.lat, dropCoords.lng) || 2.4);

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* 1. RIDER CONSOLE HEADER & REAL-TIME STATUS BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-[#FF7622] flex items-center justify-center shrink-0 shadow-inner">
            <Bike className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Rider Dispatch Console
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-[#FF7622]">
                Instant Radar
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live route navigation, merchant pickup handoff, and doorstep delivery OTP validation.
            </p>
          </div>
        </div>

        {/* Real-time controls */}
        <div className="flex items-center space-x-2.5 self-start md:self-auto flex-wrap">
          {/* Socket connectivity badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
            <span
              className={`w-2 h-2 rounded-full ${
                isSocketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
            ></span>
            <span className="text-[11px] font-bold">
              {isSocketConnected ? 'Live Socket Connected' : 'Connecting...'}
            </span>
          </div>

          {/* Test Sound Button */}
          <button
            onClick={() => {
              playRadarPing();
            }}
            className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF7622] border border-orange-200 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs"
            title="Test Dispatch Sound Ping"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Test Sound</span>
          </button>

          {/* Mute Audio Toggle */}
          <button
            onClick={() => {
              if (!isAudioMuted) {
                stopDeliveryBoyContinuousAlarm();
              }
              setIsAudioMuted(!isAudioMuted);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border shadow-xs ${
              isAudioMuted
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isAudioMuted ? 'Muted' : 'Sound On'}</span>
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC KPI CARDS (Real Database Overview Data) */}
      <RiderKpiCards overview={overviewData} isOnline={true} />

      {/* Success Notification Banner */}
      {deliverySuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{deliverySuccessMessage}</span>
        </div>
      )}

      {/* Accept Conflict Error Alert */}
      {acceptError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{acceptError}</span>
          </div>
          <button
            onClick={() => setAcceptError(null)}
            className="text-amber-700 font-extrabold hover:underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. HIGH PRIORITY INCOMING ORDER POPUP / RADAR ALARM (CONTINUOUS ALARM SOUNDING) */}
      {!activeTrip && pendingOrders.length > 0 && (
        <div className="rounded-2xl border-2 border-[#FF7622] bg-gradient-to-br from-orange-50/90 via-white to-amber-50/60 p-5 shadow-lg shadow-orange-500/10 space-y-4 animate-in fade-in">
          {/* Pulsing Alarm Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-orange-200/80">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7622] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#FF7622]"></span>
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                  <span>🚨 NEW DELIVERY AVAILABLE!</span>
                  <span className="text-xs font-bold text-[#FF7622]">
                    ({pendingOrders.length} Waiting)
                  </span>
                </h3>
                <p className="text-[11px] text-slate-600">
                  Alarm sounding continuously until you <strong className="text-slate-900">Accept</strong> or{' '}
                  <strong className="text-slate-900">Reject</strong> this trip.
                </p>
              </div>
            </div>

            {/* Stop / Snooze alarm button */}
            <button
              onClick={() => {
                stopDeliveryBoyContinuousAlarm();
                setIsAudioMuted(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center space-x-1.5 self-start sm:self-auto shadow-xs"
            >
              <BellOff className="w-3.5 h-3.5 text-rose-500" />
              <span>Silence Alarm</span>
            </button>
          </div>

          {/* Cards for pending orders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOrders.map((order) => {
              const shopAddress =
                order.shopId?.address?.street ||
                order.shopId?.address?.city ||
                'Indiranagar Kitchen Hub';
              const customerAddress =
                order.deliveryAddress?.street ||
                order.deliveryAddress?.city ||
                'Customer Doorstep';

              const orderShopCoords = (order.shopId?.address?.lat && order.shopId?.address?.lng && order.shopId.address.lat !== 12.9716)
                ? { lat: order.shopId.address.lat, lng: order.shopId.address.lng }
                : resolveLocationCoords(order.shopName || order.shopId?.name, order.shopId?.address?.street || order.shopId?.address?.city, 12.9856, 77.6057);

              const orderDropCoords = (order.deliveryAddress?.lat && order.deliveryAddress?.lng && order.deliveryAddress.lat !== 12.9716)
                ? { lat: order.deliveryAddress.lat, lng: order.deliveryAddress.lng }
                : resolveLocationCoords(order.customerName, order.deliveryAddress?.street || order.deliveryAddress?.city, 12.9784, 77.6408);

              const riderPoint = currentGpsInfo || riderDeviceLocation || { lat: 12.9716, lng: 77.5946 };
              const distToKitchen = calculateDistanceKm(riderPoint.lat, riderPoint.lng, orderShopCoords.lat, orderShopCoords.lng) || 1.2;
              const distToCustomer = calculateDistanceKm(orderShopCoords.lat, orderShopCoords.lng, orderDropCoords.lat, orderDropCoords.lng) || 2.4;
              const totalTripDist = Number((distToKitchen + distToCustomer).toFixed(1));

              return (
                <div
                  key={order._id}
                  className="bg-white p-5 rounded-2xl border border-orange-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header: Order Number & Earnings */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-[#FF7622]">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Trip Pay: ₹{order.deliveryFee || 50}
                      </span>
                    </div>

                    {/* Merchant & Customer Destination */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start space-x-2 text-slate-900">
                        <Store className="w-4 h-4 text-[#FF7622] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">{order.shopName || order.shopId?.name || 'Local Kitchen'}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{shopAddress}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2 text-slate-700">
                        <MapPin className="w-4 h-4 text-[#6339f4] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">{order.customerName || 'Customer'}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{customerAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Exact Distance Telemetry During Alarm Period */}
                    <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-2.5 rounded-xl border border-orange-200/90 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                        <span className="flex items-center space-x-1.5 text-orange-700">
                          <Navigation className="w-3.5 h-3.5 fill-[#FF7622]/20 text-[#FF7622]" />
                          <span>Trip Route Distances:</span>
                        </span>
                        <span className="text-slate-900 bg-white font-black px-2 py-0.5 rounded-md border border-orange-200 shadow-2xs text-[11px] font-mono">
                          ⚡ ~{totalTripDist} km Total
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold">
                        <div className="bg-white/95 p-1.5 rounded-lg border border-orange-200/80 text-orange-900 flex items-center justify-between">
                          <span className="text-slate-500 font-sans font-medium">To Kitchen:</span>
                          <span className="font-black text-xs text-[#FF7622]">~{distToKitchen} km</span>
                        </div>
                        <div className="bg-white/95 p-1.5 rounded-lg border border-purple-200/80 text-purple-900 flex items-center justify-between">
                          <span className="text-slate-500 font-sans font-medium">To Customer:</span>
                          <span className="font-black text-xs text-[#6339f4]">~{distToCustomer} km</span>
                        </div>
                      </div>
                    </div>

                    {/* Items & Total & Kitchen Prep Time Summary */}
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between flex-wrap gap-1">
                      <span>{order.items?.length || 1} items • ₹{order.totalAmount}</span>
                      <span className="font-extrabold text-[#FF7622] bg-orange-100/80 px-2 py-0.5 rounded-md flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Prep Time: {order.cookingTimeMinutes || 20}m</span>
                      </span>
                    </div>
                  </div>

                  {/* Two Explicit Actions: ACCEPT or REJECT */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      disabled={isAccepting}
                      onClick={() => handleRejectOrder(order._id)}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 border border-slate-200 disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />
                      <span>Reject / Pass</span>
                    </button>

                    <button
                      disabled={isAccepting}
                      onClick={() => handleAcceptOrder(order._id)}
                      className="py-2.5 px-3 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>ACCEPT TRIP</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. BROADCAST SCANNER WHEN IDLE (NO PENDING ORDERS) */}
      {!activeTrip && pendingOrders.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF7622] flex items-center justify-center mx-auto shadow-inner">
            <Compass className="w-6 h-6 animate-spin text-[#FF7622]" />
          </div>
          <h4 className="text-sm font-black text-slate-900">
            Radar Active • Scanning for New Pickup Tickets...
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            As soon as a customer orders or a kitchen marks food ready, high-urgency alarms will sound on your console in real time via Socket.io.
          </p>
        </div>
      )}

      {/* 5. ACTIVE ASSIGNED TRIP CONSOLE */}
      {activeTrip && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Dark Modern Active Trip Header */}
          <div className="bg-[#181C2E] text-white p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5">
              <span className="w-10 h-10 rounded-xl bg-[#FF7622] text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/30">
                <Bike className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold text-orange-300 block tracking-wider uppercase">
                  ACTIVE ASSIGNED TRIP
                </span>
                <h3 className="text-base font-black font-mono">
                  Order #{activeTrip.orderNumber}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500 text-white shadow-xs">
                {activeTrip.status.replace(/_/g, ' ')}
              </span>
              <button
                onClick={() => setShowRadar(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all flex items-center space-x-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Open Live Radar</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Clean Modern 3-Step Timeline Tracker */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold">
              <div
                className={`py-2 px-3 rounded-xl text-center transition-all ${
                  activeTrip.status === 'DELIVERY_PARTNER_ASSIGNED'
                    ? 'bg-[#FF7622] text-white shadow-sm'
                    : 'text-emerald-700 bg-emerald-50'
                }`}
              >
                1. Pickup at Kitchen
              </div>
              <div
                className={`py-2 px-3 rounded-xl text-center transition-all ${
                  activeTrip.status === 'PICKED_UP'
                    ? 'bg-[#FF7622] text-white shadow-sm'
                    : activeTrip.status === 'OUT_FOR_DELIVERY' || activeTrip.status === 'DELIVERED'
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-400'
                }`}
              >
                2. Out for Delivery
              </div>
              <div
                className={`py-2 px-3 rounded-xl text-center transition-all ${
                  activeTrip.status === 'OUT_FOR_DELIVERY'
                    ? 'bg-[#FF7622] text-white shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                3. Customer OTP
              </div>
            </div>

            {/* LIVE REAL-TIME GPS TELEMETRY BROADCASTER (RIDER DISPATCH CONTROLS) */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 text-white shadow-md border border-slate-700 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#FF7622] flex items-center justify-center">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider flex items-center space-x-2">
                      <span>Real-Time GPS Broadcaster</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${isBroadcastingGps || isSimulatingGps ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-700 text-slate-300'}`}>
                        {isBroadcastingGps ? '● Phone GPS Streaming' : isSimulatingGps ? '● Simulation Active' : '○ Standby'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Streams live coordinates via WebSocket directly to the customer's radar map.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleDeviceGps}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm ${
                      isBroadcastingGps
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{isBroadcastingGps ? 'Stop Phone GPS' : 'Broadcast Phone GPS'}</span>
                  </button>

                  <button
                    onClick={toggleSimulatedGps}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border shadow-sm ${
                      isSimulatingGps
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
                    }`}
                  >
                    {isSimulatingGps ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isSimulatingGps ? 'Pause GPS Drive' : 'Simulate GPS Drive'}</span>
                  </button>
                </div>
              </div>

              {currentGpsInfo && (
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-700/60 flex flex-wrap items-center justify-between text-[11px] text-slate-300 font-mono">
                  <span>GPS: {currentGpsInfo.lat}, {currentGpsInfo.lng}</span>
                  <span>Speed: ~{currentGpsInfo.speed || 30} km/h</span>
                  <span>Heading: {currentGpsInfo.heading}°</span>
                  <span className="text-emerald-400 font-bold">● Streaming live to Customer</span>
                </div>
              )}
            </div>

            {/* SWIGGY LIVE ROUTE MAP RADAR PREVIEW (Visual map corridor & live turn guidance) */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-[#f4f7fb] p-4 shadow-inner space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Swiggy Live Route Radar
                  </span>
                  <span className="text-[10px] font-bold bg-[#FF7622]/15 text-[#FF7622] px-2 py-0.5 rounded-md">
                    {activeTrip.status === 'DELIVERY_PARTNER_ASSIGNED'
                      ? 'Leg 1: En Route to Kitchen'
                      : activeTrip.status === 'PICKED_UP'
                      ? 'Package Collected • Ready for Transit'
                      : 'Leg 2: En Route to Customer'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Google Maps Turn-by-turn Navigation for Current Active Leg */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      activeTrip.status === 'DELIVERY_PARTNER_ASSIGNED'
                        ? (activeTrip.shopId?.address?.street
                            ? `${activeTrip.shopId.address.street}, ${activeTrip.shopId.address.city || 'Bengaluru'}`
                            : activeTrip.shopName || 'Indiranagar Bengaluru')
                        : (activeTrip.deliveryAddress?.street
                            ? `${activeTrip.deliveryAddress.street}, ${activeTrip.deliveryAddress.city || 'Bengaluru'}`
                            : 'Koramangala Bengaluru')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shadow-sm transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {activeTrip.status === 'DELIVERY_PARTNER_ASSIGNED'
                        ? 'Google Maps to Kitchen'
                        : 'Google Maps to Customer'}
                    </span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>

                  <button
                    onClick={() => setShowRadar(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#181C2E] hover:bg-[#252a42] text-white text-[11px] font-bold transition-all flex items-center space-x-1"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#FF7622]" />
                    <span>Fullscreen Radar</span>
                  </button>
                </div>
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1 bg-white p-1 rounded-xl shadow-xs border border-slate-200">
                  <button
                    onClick={() => setRiderMapMode('MAP')}
                    className={`px-3 py-1.5 rounded-lg font-black text-xs flex items-center space-x-1.5 transition-all ${
                      riderMapMode === 'MAP'
                        ? 'bg-[#181C2E] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Map className="w-3.5 h-3.5 text-[#FF7622]" />
                    <span>Exact Street Map</span>
                  </button>
                  <button
                    onClick={() => setRiderMapMode('RADAR')}
                    className={`px-3 py-1.5 rounded-lg font-black text-xs flex items-center space-x-1.5 transition-all ${
                      riderMapMode === 'RADAR'
                        ? 'bg-[#FF7622] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Radar Arc</span>
                  </button>
                </div>
              </div>

              {/* Exact Real-Time Leaflet Street Map vs Radar Arc */}
              {riderMapMode === 'MAP' ? (
                <div className="h-72 sm:h-80 w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-white">
                  <RealtimeLiveMap
                    pickupLocation={{
                      title: activeTrip.shopName || activeTrip.shopId?.name || 'Chicken Shop',
                      address: activeTrip.shopId?.address?.street || 'Poultry Lane, Shivaji Nagar, Bengaluru',
                      lat: shopCoords.lat,
                      lng: shopCoords.lng,
                    }}
                    dropLocation={{
                      title: activeTrip.customerName || 'Priya Sharma (Customer)',
                      address: activeTrip.deliveryAddress?.street || 'Indiranagar 100ft Road, HAL 2nd Stage, Bangalore',
                      lat: dropCoords.lat,
                      lng: dropCoords.lng,
                    }}
                    riderLocation={riderCoords}
                    deliveryPartner={{
                      name: 'Rider Partner',
                      vehicleNumber: 'KA-01-EA-4521',
                    }}
                    isLiveGps={isBroadcastingGps || isSimulatingGps || Boolean(activeTrip.riderLocation?.lat)}
                    activeLeg={currentLeg}
                  />
                </div>
              ) : (
                <div className="relative h-28 w-full bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200/80 p-2 flex items-center justify-center">
                  <svg viewBox="0 0 460 100" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
                    {/* Road */}
                    <path d="M 60 55 Q 230 15 400 55" fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
                    <path d="M 60 55 Q 230 15 400 55" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
                    {/* Active Traveled Glow */}
                    <path
                      d="M 60 55 Q 230 15 400 55"
                      fill="none"
                      stroke="#FF7622"
                      strokeWidth="6"
                      strokeDasharray="360"
                      strokeDashoffset={activeTrip.status === 'DELIVERY_PARTNER_ASSIGNED' ? 240 : activeTrip.status === 'PICKED_UP' ? 180 : 80}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />

                    {/* Kitchen Pin */}
                    <g transform="translate(45, 30)">
                      <circle cx="15" cy="25" r="14" fill="#FF7622" />
                      <foreignObject x="7" y="17" width="16" height="16">
                        <Store className="w-4 h-4 text-white" />
                      </foreignObject>
                      <text x="15" y="48" textAnchor="middle" fill="#181C2E" fontSize="8" fontWeight="bold">
                        Kitchen (Pickup)
                      </text>
                    </g>

                    {/* Customer Pin */}
                    <g transform="translate(385, 30)">
                      <circle cx="15" cy="25" r="14" fill="#6339f4" />
                      <foreignObject x="7" y="17" width="16" height="16">
                        <MapPin className="w-4 h-4 text-white" />
                      </foreignObject>
                      <text x="15" y="48" textAnchor="middle" fill="#181C2E" fontSize="8" fontWeight="bold">
                        Customer (Drop)
                      </text>
                    </g>

                    {/* Moving Bike Icon */}
                    <g
                      transform={
                        activeTrip.status === 'DELIVERY_PARTNER_ASSIGNED'
                          ? 'translate(130, 24)'
                          : activeTrip.status === 'PICKED_UP'
                          ? 'translate(225, 20)'
                          : 'translate(320, 26)'
                      }
                      className="transition-all duration-700"
                    >
                      <circle cx="12" cy="12" r="12" fill="#181C2E" stroke="#FF7622" strokeWidth="2" />
                      <foreignObject x="4" y="4" width="16" height="16">
                        <Bike className="w-4 h-4 text-[#FF7622]" />
                      </foreignObject>
                    </g>
                  </svg>
                </div>
              )}

              {/* Turn-by-Turn Instruction Banner */}
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-orange-50 border border-orange-200/60 text-xs">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-[#FF7622] shrink-0" />
                  <span className="font-bold text-slate-800">
                    {currentLeg === 'TO_STORE'
                      ? `Stage 1: Head to "${activeTrip.shopName || activeTrip.shopId?.name || 'Kitchen'}" for order pickup`
                      : activeTrip.status === 'PICKED_UP'
                      ? `Restaurant reached! Click 'Start Transit' to route to customer doorstep`
                      : `Stage 2: En route to ${activeTrip.customerName || 'Customer'} • Request 4-digit OTP at doorstep`}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-black text-[#FF7622] bg-white px-2 py-0.5 rounded-md border border-orange-200 whitespace-nowrap shadow-2xs">
                  ~{activeLegDist} km away
                </span>
              </div>
            </div>

            {/* DYNAMIC Restaurant & Drop Locations (Real dynamic data) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Point (Kitchen) */}
              <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 text-xs transition-all ${
                currentLeg === 'TO_STORE'
                  ? 'bg-orange-50/80 border-[#FF7622] shadow-sm ring-1 ring-orange-200'
                  : 'bg-emerald-50/40 border-emerald-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider block px-2 py-0.5 rounded-md ${
                    currentLeg === 'TO_STORE'
                      ? 'bg-[#FF7622] text-white shadow-2xs'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {currentLeg === 'TO_STORE' ? '📍 1. ACTIVE TARGET: GO TO RESTAURANT' : '✓ 1. RESTAURANT REACHED & PICKED UP'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    Store Order #{activeTrip.orderNumber}
                  </span>
                </div>

                <div className="flex items-center space-x-2 font-bold text-slate-900">
                  <Store className="w-4 h-4 text-[#FF7622] shrink-0" />
                  <span className="text-sm">
                    {activeTrip.shopName || activeTrip.shopId?.name || 'Partner Kitchen'}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {activeTrip.shopId?.address?.street ||
                    activeTrip.shopId?.address?.city ||
                    'Indiranagar Kitchen Hub, Bengaluru'}
                </p>

                <div className="pt-1 flex flex-wrap gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      shopCoords.lat && shopCoords.lng
                        ? `${shopCoords.lat},${shopCoords.lng}`
                        : (activeTrip.shopId?.address?.street
                            ? `${activeTrip.shopId.address.street}, ${activeTrip.shopId.address.city || 'Bengaluru'}`
                            : activeTrip.shopName || 'Indiranagar Bengaluru')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white font-bold text-[11px] shadow-sm transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-current" />
                    <span>Navigate to Restaurant (Google Maps)</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>

                  <a
                    href={`tel:${activeTrip.shopId?.phone || activeTrip.shopPhone || '+919876543210'}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-[11px] hover:bg-slate-50 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#FF7622]" />
                    <span>
                      Call Kitchen ({activeTrip.shopId?.phone || activeTrip.shopPhone || '+91 98765 43210'})
                    </span>
                  </a>
                </div>
              </div>

              {/* Delivery Destination (Customer) */}
              <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 text-xs transition-all ${
                currentLeg === 'TO_CUSTOMER'
                  ? 'bg-purple-50/80 border-[#6339f4] shadow-sm ring-1 ring-purple-200'
                  : 'bg-slate-50/60 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider block px-2 py-0.5 rounded-md ${
                    currentLeg === 'TO_CUSTOMER'
                      ? 'bg-[#6339f4] text-white shadow-2xs'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {currentLeg === 'TO_CUSTOMER' ? '🛵 2. ACTIVE TARGET: DELIVER TO CUSTOMER' : '⏳ 2. NEXT: CUSTOMER DOORSTEP'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    Doorstep Drop
                  </span>
                </div>

                <div className="flex items-center space-x-2 font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-[#6339f4] shrink-0" />
                  <span className="text-sm">{activeTrip.customerName || 'Valued Customer'}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {activeTrip.deliveryAddress?.street ||
                    activeTrip.deliveryAddress?.city ||
                    'Customer Address, HAL 2nd Stage, Bengaluru'}
                </p>

                <div className="pt-1 flex flex-wrap gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      dropCoords.lat && dropCoords.lng
                        ? `${dropCoords.lat},${dropCoords.lng}`
                        : (activeTrip.deliveryAddress?.street
                            ? `${activeTrip.deliveryAddress.street}, ${activeTrip.deliveryAddress.city || 'Bengaluru'}`
                            : 'Koramangala Bengaluru')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#6339f4] hover:bg-[#5327ec] text-white font-bold text-[11px] shadow-sm transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-current" />
                    <span>Navigate to Customer (Google Maps)</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>

                  <a
                    href={`tel:${activeTrip.customerPhone || '+919876543210'}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-[11px] hover:bg-slate-50 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#6339f4]" />
                    <span>
                      Call Customer ({activeTrip.customerPhone || '+91 98765 43210'})
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Stage Action Execution Buttons */}
            <div className="pt-2 space-y-4">
              {/* Step 1: Reach restaurant and confirm pickup -> switches view to customer directions */}
              {activeTrip.status === 'DELIVERY_PARTNER_ASSIGNED' && (
                <div className="space-y-2">
                  <div className="p-3 bg-orange-50 border border-orange-200/80 rounded-xl text-xs text-orange-950 font-bold flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-[#FF7622] shrink-0" />
                    <span>Follow the route to the restaurant. Once you reach the restaurant, tap the button below to switch to customer directions.</span>
                  </div>
                  <button
                    disabled={isUpdatingStatus}
                    onClick={handleConfirmPickup}
                    className="w-full py-4 px-6 rounded-2xl bg-[#FF7622] hover:bg-[#E56314] text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <PackageCheck className="w-5 h-5 stroke-[2.5]" />
                    <span>📍 I Have Reached Restaurant (Show Customer Directions)</span>
                  </button>
                </div>
              )}

              {/* Step 2: Start transit to customer */}
              {activeTrip.status === 'PICKED_UP' && (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Restaurant arrival confirmed! Map directions have switched to the customer doorstep. Click below to begin transit.</span>
                  </div>
                  <button
                    disabled={isUpdatingStatus}
                    onClick={handleStartTransit}
                    className="w-full py-4 px-6 rounded-2xl bg-[#6339f4] hover:bg-[#5229db] text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Navigation className="w-5 h-5 stroke-[2.5]" />
                    <span>🛵 Start Transit to Customer Doorstep (Out for Delivery)</span>
                  </button>
                </div>
              )}

              {/* Step 3: Enter Customer Doorstep OTP (FIXED, SPACIOUS & NO TRUNCATION) */}
              {activeTrip.status === 'OUT_FOR_DELIVERY' && (
                <div className="p-6 rounded-2xl bg-orange-50/40 border border-orange-200 space-y-4">
                  <div className="flex items-center space-x-2 text-slate-900">
                    <KeyRound className="w-5 h-5 text-[#FF7622]" />
                    <h4 className="text-sm font-black">Customer Doorstep OTP Verification</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Ask customer for their 4-digit security OTP code (visible on customer order tracking screen).
                  </p>

                  <form onSubmit={handleCompleteDelivery} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                      <div className="relative sm:w-60">
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          placeholder="Enter 4-Digit OTP"
                          className="w-full px-5 py-3 rounded-xl bg-white border-2 border-slate-300 font-mono text-base font-black tracking-widest text-slate-900 focus:outline-none focus:border-[#FF7622] text-center shadow-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isUpdatingStatus}
                        className="flex-1 py-3 px-6 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify OTP & Complete Delivery</span>
                      </button>
                    </div>

                    {otpError && (
                      <p className="text-xs font-bold text-rose-600 flex items-center space-x-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{otpError}</span>
                      </p>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Map Radar Modal */}
      {showRadar && activeTrip && (
        <LiveDeliveryTrackingModal
          isOpen={showRadar}
          onClose={() => setShowRadar(false)}
          order={activeTrip}
          onStatusUpdated={() => fetchRiderData()}
        />
      )}
    </div>
  );
};
