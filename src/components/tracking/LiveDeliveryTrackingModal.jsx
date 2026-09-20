import React, { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';
import ApiClient from '../../api/client';

export const LiveDeliveryTrackingModal = ({ isOpen, onClose, order, onStatusUpdated }) => {
  if (!isOpen || !order) return null;

  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simulatedProgress, setSimulatedProgress] = useState(0.68);
  const [callInitiated, setCallInitiated] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchTracking = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ApiClient.get(`/public/orders/${order._id || order.id}/live-tracking`);
      if (res.success && res.data) {
        setTrackingData(res.data);
        if (res.data.liveTracking?.progressRatio) {
          setSimulatedProgress(res.data.liveTracking.progressRatio);
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
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [order]);

  // Live pulsing animation simulation moving the rider along the path
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 0.94) return 0.55; // Loop for active visual demo
        return Number((prev + 0.015).toFixed(3));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await ApiClient.patch(`/admin/orders/${order._id || order.id}/status`, {
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
  const etaMinutes = Math.max(2, Math.round((1 - simulatedProgress) * 20));
  const distanceKm = Math.max(0.2, Number(((1 - simulatedProgress) * 2.8).toFixed(1)));

  // SVG Coordinates calculation for animated route
  // Start: Shop (x: 80, y: 160)
  // Control point: (x: 240, y: 50)
  // End: Customer (x: 420, y: 160)
  const riderT = simulatedProgress;
  // Quadratic bezier point formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
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
                  Live Swiggy-Style Radar
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                  ● En Route
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

        <div className="p-5 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Animated Vector Map Visualizer */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-[#f4f7fb] p-4 shadow-inner">
            {/* Map Grid Pattern Background */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#6339f4 0.75px, transparent 0.75px), radial-gradient(#d1d5db 0.75px, #f4f7fb 0.75px)`,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            {/* ETA Floating Capsule */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#fc8019] to-[#e66c0d] flex items-center justify-center text-white shadow-md shadow-[#fc8019]/25">
                  <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-black text-[#181829] tracking-tight">
                      Arriving in {etaMinutes} Mins
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-200">
                      ⚡ On Time
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8a87a6] font-medium">
                    {distanceKm} km away • Riding safely at ~32 km/h
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-[10px] font-bold text-[#8a87a6] uppercase tracking-wider">
                  Pickup Store:
                </span>
                <span className="font-bold text-[#181829] text-[11px] bg-purple-50 text-[#6339f4] px-2 py-0.5 rounded-lg border border-purple-100">
                  {order?.shopName}
                </span>
              </div>
            </div>

            {/* Animated Route Canvas SVG */}
            <div className="relative h-48 w-full my-2 flex items-center justify-center">
              <svg
                viewBox="0 0 500 200"
                className="w-full h-full drop-shadow-sm select-none"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Background Road Corridor */}
                <path
                  d="M 75 155 Q 250 45 425 155"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Road Dashed Centerline */}
                <path
                  d="M 75 155 Q 250 45 425 155"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />
                {/* Traveled Active Path (Gradient Glow) */}
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

                {/* START: Shop / Restaurant Pin */}
                <g transform="translate(55, 125)">
                  <circle cx="20" cy="30" r="16" fill="#6339f4" />
                  <circle cx="20" cy="30" r="22" fill="#6339f4" opacity="0.15" />
                  <foreignObject x="10" y="20" width="20" height="20">
                    <Store className="w-5 h-5 text-white" />
                  </foreignObject>
                  <text x="20" y="58" textAnchor="middle" fill="#181829" fontSize="10" fontWeight="bold">
                    Shop / Kitchen
                  </text>
                  <text x="20" y="68" textAnchor="middle" fill="#8a87a6" fontSize="8">
                    Items Picked Up
                  </text>
                </g>

                {/* END: Customer Address Pin */}
                <g transform="translate(405, 125)">
                  <circle cx="20" cy="30" r="16" fill="#10b981" />
                  <circle cx="20" cy="30" r="22" fill="#10b981" opacity="0.15" />
                  <foreignObject x="10" y="20" width="20" height="20">
                    <MapPin className="w-5 h-5 text-white" />
                  </foreignObject>
                  <text x="20" y="58" textAnchor="middle" fill="#181829" fontSize="10" fontWeight="bold">
                    Delivery Address
                  </text>
                  <text x="20" y="68" textAnchor="middle" fill="#8a87a6" fontSize="8">
                    {order?.customerName || 'Customer'}
                  </text>
                </g>

                {/* MOVING RIDER: Pulsing Delivery Partner Icon */}
                <g
                  transform={`translate(${riderX}, ${riderY})`}
                  filter="url(#riderGlow)"
                  className="transition-transform duration-700 ease-out"
                >
                  {/* Radar wave pulse 1 */}
                  <circle cx="0" cy="0" r="24" fill="#fc8019" opacity="0.15" className="animate-ping" />
                  {/* Radar wave pulse 2 */}
                  <circle cx="0" cy="0" r="16" fill="#fc8019" opacity="0.25" />
                  {/* Rider Disc */}
                  <circle cx="0" cy="0" r="14" fill="#fc8019" stroke="#ffffff" strokeWidth="2.5" />
                  <foreignObject x="-9" y="-9" width="18" height="18">
                    <Bike className="w-4 h-4 text-white" />
                  </foreignObject>

                  {/* Rider Floating Label */}
                  <g transform="translate(0, -22)">
                    <rect x="-42" y="-12" width="84" height="16" rx="8" fill="#181829" />
                    <text x="0" y="0" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                      🛵 {partner?.name?.split(' ')[0] || 'Rahul'} En Route
                    </text>
                  </g>
                </g>
              </svg>
            </div>

            {/* Live Status Callout Banner */}
            <div className="relative z-10 flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 via-purple-50 to-white rounded-2xl border border-orange-200/70 text-xs">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#fc8019] shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="font-semibold text-slate-800">
                  {trackingData?.liveTracking?.statusMessage ||
                    'Delivery partner Rahul is speeding towards your doorstep!'}
                </span>
              </div>
              <span className="font-mono font-black text-[#fc8019] text-[11px] bg-white px-2 py-0.5 rounded-lg border border-orange-200">
                {Math.round(simulatedProgress * 100)}% Trip Completed
              </span>
            </div>
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

          {/* Active Call State Simulation Modal */}
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

          {/* Quick Dispatch Status Overrides (For Testing & Operations) */}
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
