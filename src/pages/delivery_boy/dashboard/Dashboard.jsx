import React, { useState } from 'react';
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
  Compass
} from 'lucide-react';
import { RiderKpiCards } from './components/RiderKpiCards';
import { LiveDeliveryTrackingModal } from '../../../components/tracking/LiveDeliveryTrackingModal';

export const DeliveryBoyDashboard = () => {
  const [tripStatus, setTripStatus] = useState('ASSIGNED'); // ASSIGNED -> OUT_FOR_DELIVERY -> DELIVERED
  const [showRadar, setShowRadar] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(null);
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);

  const activeTrip = {
    _id: 'trip-ord-9021',
    orderNumber: 'ORD-9021',
    status: tripStatus === 'ASSIGNED' ? 'READY_FOR_PICKUP' : tripStatus,
    shopName: 'Aroma Spice Bistro & Bakery',
    shopPhone: '+91 98450 11223',
    customerName: 'Ananya Roy',
    customerPhone: '+91 98453 99003',
    deliveryPartnerName: 'You (Muhammed Rider)',
    totalAmount: 620,
    deliveryFee: 65,
    deliveryOtp: '4829', // Required OTP to complete delivery
    deliveryAddress: {
      street: '12th Main Road, HAL 2nd Stage, Indiranagar',
      city: 'Bengaluru',
      landmark: 'Near Metro Station Pillar 140',
    },
    items: [
      { name: 'Paneer Butter Masala', quantity: 1, price: 320 },
      { name: 'Garlic Butter Naan (2 pcs)', quantity: 2, price: 150 },
    ],
  };

  const handleConfirmPickup = () => {
    setTripStatus('OUT_FOR_DELIVERY');
  };

  const handleCompleteDelivery = (e) => {
    e?.preventDefault();
    if (enteredOtp !== activeTrip.deliveryOtp) {
      setOtpError(`Incorrect OTP! Customer's test delivery OTP is ${activeTrip.deliveryOtp}`);
      return;
    }
    setOtpError(null);
    setTripStatus('DELIVERED');
    setShowOtpPrompt(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Fleet Greeting Banner in User Theme */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF7622] flex items-center justify-center shadow-inner">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#181C2E] tracking-tight">
              Rider Dispatch Console
            </h2>
            <p className="text-xs text-[#646982]">
              Real-time route navigation, restaurant pickup, and OTP doorstep handoffs.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-bold text-emerald-600">GPS Signal Strong</span>
        </div>
      </div>

      {/* KPI Stats in Figma Warm Orange */}
      <RiderKpiCards />

      {/* Active Trip Dispatch Card */}
      {tripStatus !== 'DELIVERED' ? (
        <div className="bg-white rounded-3xl border-2 border-[#FF7622]/40 shadow-xl shadow-orange-500/5 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#181C2E] text-white p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="w-10 h-10 rounded-xl bg-[#FF7622] text-white flex items-center justify-center font-bold">
                <Bike className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black tracking-wide uppercase text-white">
                    Trip #{activeTrip.orderNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    tripStatus === 'OUT_FOR_DELIVERY' ? 'bg-[#FF7622] text-white' : 'bg-amber-400 text-slate-900'
                  }`}>
                    {tripStatus === 'OUT_FOR_DELIVERY' ? 'En Route to Customer' : 'Ready at Merchant'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Trip Earnings: <span className="font-black text-[#FFA767]">₹{activeTrip.deliveryFee}.00</span> • Est. Distance: <span className="font-bold text-white">2.4 km</span>
                </p>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowRadar(true)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold flex items-center space-x-2 transition-all border border-white/20"
              >
                <Navigation className="w-4 h-4 text-[#FFA767]" />
                <span>Live Radar</span>
              </button>

              {tripStatus === 'ASSIGNED' ? (
                <button
                  onClick={handleConfirmPickup}
                  className="px-5 py-2.5 rounded-xl bg-[#FF7622] hover:bg-[#E56314] active:scale-95 text-white text-xs font-black flex items-center space-x-2 shadow-lg shadow-[#FF7622]/30 transition-all uppercase tracking-wider"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Pickup</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowOtpPrompt(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-black flex items-center space-x-2 shadow-lg shadow-emerald-500/30 transition-all uppercase tracking-wider"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Deliver with OTP</span>
                </button>
              )}
            </div>
          </div>

          {/* Route Milestones */}
          <div className="p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Point */}
              <div className="p-4 rounded-2xl bg-[#F0F5FA] border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-xs font-bold text-[#FF7622] uppercase tracking-wider">
                    <Store className="w-4 h-4" />
                    <span>Pickup Location</span>
                  </span>
                  <a
                    href={`tel:${activeTrip.shopPhone}`}
                    className="p-1.5 rounded-lg bg-white text-[#181C2E] hover:bg-[#FF7622] hover:text-white transition-colors"
                    title="Call Merchant"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
                <h4 className="font-extrabold text-sm text-[#181C2E]">{activeTrip.shopName}</h4>
                <p className="text-xs text-[#646982]">100 Feet Road, Indiranagar, Bengaluru</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-[#646982]">
                  <span>Items: <strong className="text-[#181C2E]">2 pkgs</strong></span>
                  <span className="text-emerald-600 font-bold">Food Prepared & Packed</span>
                </div>
              </div>

              {/* Drop-off Point */}
              <div className="p-4 rounded-2xl bg-[#F0F5FA] border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    <MapPin className="w-4 h-4" />
                    <span>Customer Destination</span>
                  </span>
                  <a
                    href={`tel:${activeTrip.customerPhone}`}
                    className="p-1.5 rounded-lg bg-white text-[#181C2E] hover:bg-emerald-600 hover:text-white transition-colors"
                    title="Call Customer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
                <h4 className="font-extrabold text-sm text-[#181C2E]">{activeTrip.customerName}</h4>
                <p className="text-xs text-[#646982]">{activeTrip.deliveryAddress.street}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-[#646982]">
                  <span>Payment: <strong className="text-emerald-700">Prepaid Online</strong></span>
                  <span className="text-[#FF7622] font-bold">OTP Required: 4 Digits</span>
                </div>
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <span className="text-xs font-bold text-[#646982] uppercase tracking-wider">
                Order Package Checklist
              </span>
              <div className="mt-2 divide-y divide-slate-200/60 text-xs font-medium text-[#181C2E]">
                {activeTrip.items.map((item, i) => (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-bold">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Completed Trip Success State */
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-[#181C2E]">Trip Completed Successfully!</h3>
          <p className="text-xs text-[#646982] max-w-sm mx-auto">
            Order #{activeTrip.orderNumber} was verified and delivered to customer. ₹{activeTrip.deliveryFee}.00 credited to your wallet ledger.
          </p>
          <button
            onClick={() => setTripStatus('ASSIGNED')}
            className="px-6 py-3 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-[#FF7622]/30 transition-all"
          >
            Standby for Next Dispatch
          </button>
        </div>
      )}

      {/* Doorstep Delivery OTP Verification Modal */}
      {showOtpPrompt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF7622] mx-auto flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#181C2E]">Customer Doorstep OTP</h3>
              <p className="text-xs text-[#646982]">
                Ask <span className="font-bold text-[#181C2E]">{activeTrip.customerName}</span> for the 4-digit order handoff OTP.
              </p>
              <p className="text-[11px] text-[#FF7622] font-semibold bg-orange-50 py-1 px-2 rounded-lg">
                Demo Test OTP: <strong>{activeTrip.deliveryOtp}</strong>
              </p>
            </div>

            {otpError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold text-center">
                {otpError}
              </div>
            )}

            <form onSubmit={handleCompleteDelivery} className="space-y-4">
              <input
                type="text"
                required
                maxLength={4}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="4-digit OTP"
                className="w-full text-center tracking-widest text-2xl font-black py-3 rounded-xl bg-[#F0F5FA] border border-transparent focus:border-[#FF7622] focus:bg-white text-[#181C2E] outline-none transition-all"
              />

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowOtpPrompt(false)}
                  className="w-1/2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#646982]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enteredOtp.length !== 4}
                  className="w-1/2 py-3 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-[#FF7622]/30 disabled:opacity-50"
                >
                  Confirm Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Swiggy Radar Modal */}
      <LiveDeliveryTrackingModal
        isOpen={showRadar}
        order={activeTrip}
        onClose={() => setShowRadar(false)}
      />
    </div>
  );
};
