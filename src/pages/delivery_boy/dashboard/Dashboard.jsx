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
  Sparkles,
  ShoppingBag,
  Check
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { RiderKpiCards } from './components/RiderKpiCards';
import { LiveDeliveryTrackingModal } from '../../../components/tracking/LiveDeliveryTrackingModal';
import { playRadarPing } from '../../../utils/soundAlert';

export const DeliveryBoyDashboard = () => {
  const [broadcastOrders, setBroadcastOrders] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState(null);
  const [showRadar, setShowRadar] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [deliverySuccessMessage, setDeliverySuccessMessage] = useState(null);

  const prevBroadcastCountRef = useRef(0);

  const fetchRiderData = async () => {
    try {
      const [broadcastRes, activeRes] = await Promise.all([
        ApiClient.get('/delivery-boy/broadcast-orders'),
        ApiClient.get('/delivery-boy/active-order'),
      ]);

      if (broadcastRes.success && broadcastRes.data) {
        setBroadcastOrders(broadcastRes.data);
        if (broadcastRes.data.length > prevBroadcastCountRef.current) {
          playRadarPing();
        }
        prevBroadcastCountRef.current = broadcastRes.data.length;
      }

      if (activeRes.success) {
        setActiveTrip(activeRes.data);
      }
    } catch (err) {
      console.warn('Failed to refresh rider console:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderData();
    const interval = setInterval(fetchRiderData, 3500);
    return () => clearInterval(interval);
  }, []);

  // First-to-Accept Order action
  const handleAcceptOrder = async (orderId) => {
    setIsAccepting(true);
    setAcceptError(null);
    try {
      const res = await ApiClient.post(`/delivery-boy/orders/${orderId}/accept`);
      if (res.success && res.data) {
        setActiveTrip(res.data);
        setBroadcastOrders((prev) => prev.filter((o) => o._id !== orderId));
      }
    } catch (err) {
      setAcceptError(err.message || 'Order was already accepted by another rider!');
      fetchRiderData();
    } finally {
      setIsAccepting(false);
    }
  };

  // Step 1: Rider reaches restaurant -> Marks Picked Up
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

  // Step 2: Rider starts transit to customer -> Marks Out for Delivery
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
        setDeliverySuccessMessage(`Order #${activeTrip.orderNumber} successfully completed! ₹${activeTrip.deliveryFee || 50} credited to your earnings.`);
        setActiveTrip(null);
        setEnteredOtp('');
        fetchRiderData();
        setTimeout(() => setDeliverySuccessMessage(null), 5000);
      }
    } catch (err) {
      setOtpError(err.message || 'Incorrect OTP code! Please verify with customer.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* 1. Rider Console Greeting Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF7622] flex items-center justify-center shadow-inner">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#181C2E] tracking-tight">
              Rider Dispatch Console
            </h2>
            <p className="text-xs text-[#646982]">
              Real-time route navigation, restaurant pickup handoff, and doorstep delivery OTP validation.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={() => {
              playRadarPing();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-orange-50 text-[#FF7622] border border-orange-200 text-xs font-bold flex items-center space-x-1.5"
            title="Test Dispatch Alert Ping"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Test Radar Ping</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-600">GPS Radar Active</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <RiderKpiCards />

      {/* Delivery Success Notification Toast */}
      {deliverySuccessMessage && (
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{deliverySuccessMessage}</span>
        </div>
      )}

      {/* Error Alert if concurrent rider took trip */}
      {acceptError && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{acceptError}</span>
          </div>
          <button onClick={() => setAcceptError(null)} className="text-amber-600 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. BROADCAST RADAR: Available Unassigned Orders ("First to Choose Gets It") */}
      {!activeTrip && (
        <div className="theme-card p-6 space-y-4 border-2 border-orange-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#FF7622] animate-ping" />
              <h3 className="text-sm font-black text-[#181C2E]">
                Available Orders Broadcast ({broadcastOrders.length})
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-[#FF7622]">
              First to Accept Wins
            </span>
          </div>

          {broadcastOrders.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF7622] flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="text-xs font-bold text-[#181C2E]">Scanning for nearby ready tickets...</h4>
              <p className="text-[11px] text-[#646982]">
                As soon as restaurants prepare food or mark orders ready for pickup, orders will sound on your radar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {broadcastOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-5 rounded-2xl bg-[#FFFBF8] border border-orange-200/80 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-[#FF7622]">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Trip Earning: ₹{order.deliveryFee || 50}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center space-x-2 text-[#181C2E]">
                        <Store className="w-4 h-4 text-[#FF7622] shrink-0" />
                        <span className="font-bold line-clamp-1">{order.shopName || 'Local Merchant'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-[#6339f4] shrink-0" />
                        <span className="line-clamp-1">{order.deliveryAddress?.street || 'Customer Indiranagar'}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span>Order Total: ₹{order.totalAmount}</span>
                      <span>{order.items?.length || 1} items to collect</span>
                    </div>
                  </div>

                  <button
                    disabled={isAccepting}
                    onClick={() => handleAcceptOrder(order._id)}
                    className="w-full py-3 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>ACCEPT TRIP (Claim Order Now)</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ACTIVE TRIP CONSOLE (Assigned to this Rider) */}
      {activeTrip && (
        <div className="bg-white rounded-3xl border-2 border-[#FF7622]/40 shadow-xl shadow-orange-500/5 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#181C2E] text-white p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="w-10 h-10 rounded-xl bg-[#FF7622] text-white flex items-center justify-center font-bold">
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
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500 text-white">
                {activeTrip.status.replace(/_/g, ' ')}
              </span>
              <button
                onClick={() => setShowRadar(true)}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all flex items-center space-x-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Open Live Radar</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Step Progress Tracker */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div
                className={`py-2 px-3 rounded-xl text-center text-xs font-bold transition-all ${
                  activeTrip.status === 'DELIVERY_PARTNER_ASSIGNED'
                    ? 'bg-[#FF7622] text-white shadow-xs'
                    : 'text-emerald-700 bg-emerald-50'
                }`}
              >
                1. Pickup at Kitchen
              </div>
              <div
                className={`py-2 px-3 rounded-xl text-center text-xs font-bold transition-all ${
                  activeTrip.status === 'PICKED_UP'
                    ? 'bg-[#FF7622] text-white shadow-xs'
                    : activeTrip.status === 'OUT_FOR_DELIVERY' || activeTrip.status === 'DELIVERED'
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-400'
                }`}
              >
                2. Out for Delivery
              </div>
              <div
                className={`py-2 px-3 rounded-xl text-center text-xs font-bold transition-all ${
                  activeTrip.status === 'OUT_FOR_DELIVERY'
                    ? 'bg-[#FF7622] text-white shadow-xs'
                    : 'text-slate-400'
                }`}
              >
                3. Customer OTP
              </div>
            </div>

            {/* Restaurant & Drop Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Point */}
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-2 text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF7622] block">
                  Pickup Location (Kitchen)
                </span>
                <div className="flex items-center space-x-2 font-bold text-[#181C2E]">
                  <Store className="w-4 h-4 text-[#FF7622]" />
                  <span>{activeTrip.shopName}</span>
                </div>
                <p className="text-slate-600 text-[11px]">Indiranagar 100 Feet Hub, Bengaluru</p>
                <div className="pt-2 flex items-center space-x-2">
                  <a
                    href="tel:+919876543210"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[#181C2E] font-bold text-[11px] hover:bg-slate-50"
                  >
                    <Phone className="w-3 h-3 text-[#FF7622]" />
                    <span>Call Restaurant</span>
                  </a>
                </div>
              </div>

              {/* Delivery Destination */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2 text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#6339f4] block">
                  Customer Delivery Destination
                </span>
                <div className="flex items-center space-x-2 font-bold text-[#181C2E]">
                  <MapPin className="w-4 h-4 text-[#6339f4]" />
                  <span>{activeTrip.customerName}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{activeTrip.deliveryAddress?.street || 'Indiranagar 2nd Stage'}</p>
                <div className="pt-2 flex items-center space-x-2">
                  <a
                    href={`tel:${activeTrip.customerPhone || '+919876543210'}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[#181C2E] font-bold text-[11px] hover:bg-slate-50"
                  >
                    <Phone className="w-3 h-3 text-[#6339f4]" />
                    <span>Call Customer ({activeTrip.customerPhone || '+91 98765 43210'})</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Stage Action Execution Buttons */}
            <div className="pt-2 space-y-4">
              {/* If newly assigned -> Reach restaurant and click Picked Up */}
              {activeTrip.status === 'DELIVERY_PARTNER_ASSIGNED' && (
                <button
                  disabled={isUpdatingStatus}
                  onClick={handleConfirmPickup}
                  className="w-full py-4 rounded-2xl bg-[#FF7622] hover:bg-[#E56314] text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <PackageCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>I Have Reached Restaurant & Picked Up Order</span>
                </button>
              )}

              {/* If Picked Up -> Start Transit / Out for Delivery */}
              {activeTrip.status === 'PICKED_UP' && (
                <button
                  disabled={isUpdatingStatus}
                  onClick={handleStartTransit}
                  className="w-full py-4 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Navigation className="w-5 h-5 stroke-[2.5]" />
                  <span>Start Transit to Customer Home (Out for Delivery)</span>
                </button>
              )}

              {/* If Out for Delivery -> Enter Customer Doorstep OTP */}
              {activeTrip.status === 'OUT_FOR_DELIVERY' && (
                <div className="p-6 rounded-3xl bg-[#FFF8F3] border-2 border-[#FF7622]/40 space-y-4">
                  <div className="flex items-center space-x-2 text-[#181C2E]">
                    <KeyRound className="w-5 h-5 text-[#FF7622]" />
                    <h4 className="text-sm font-black">Customer Doorstep OTP Verification</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Ask customer for their 4-digit security OTP code (visible on customer order tracking screen).
                  </p>

                  <form onSubmit={handleCompleteDelivery} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="Enter 4-Digit OTP"
                        className="px-5 py-3 rounded-2xl bg-white border-2 border-slate-300 font-mono text-lg font-black tracking-widest text-[#181C2E] focus:outline-none focus:border-[#FF7622] sm:w-48 text-center"
                      />
                      <button
                        type="submit"
                        disabled={isUpdatingStatus}
                        className="flex-1 py-3 px-6 rounded-2xl bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
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
