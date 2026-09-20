import React, { useState } from 'react';
import { Bike, Navigation, MapPin, Store, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { RiderKpiCards } from './components/RiderKpiCards';
import { LiveDeliveryTrackingModal } from '../../../components/tracking/LiveDeliveryTrackingModal';

export const DeliveryBoyDashboard = () => {
  const [tripStatus, setTripStatus] = useState('ASSIGNED'); // ASSIGNED -> PICKED_UP -> OUT_FOR_DELIVERY -> DELIVERED
  const [showRadar, setShowRadar] = useState(false);

  const activeTrip = {
    _id: 'trip-ord-9021',
    orderNumber: 'ORD-9021',
    status: tripStatus === 'ASSIGNED' ? 'READY_FOR_PICKUP' : tripStatus,
    shopName: 'Aroma Spice Bistro & Bakery',
    customerName: 'Ananya Roy',
    deliveryPartnerName: 'You (Rahul Kumar)',
    deliveryPartnerPhone: '+91 98765 43210',
    totalAmount: 620,
    deliveryOtp: '4829',
    deliveryAddress: {
      street: '12th Main Road, HAL 2nd Stage, Indiranagar',
      city: 'Bengaluru',
    },
    items: [
      { name: 'Paneer Butter Masala', quantity: 1, price: 320 },
      { name: 'Garlic Butter Naan (2 pcs)', quantity: 2, price: 150 },
    ],
  };

  const handleConfirmPickup = () => {
    setTripStatus('OUT_FOR_DELIVERY');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="theme-card p-6 flex items-center space-x-3">
        <span className="p-2 rounded-2xl bg-emerald-50 text-emerald-600">
          <Bike className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
            Delivery Partner Fleet App
          </h2>
          <p className="text-xs text-[#8a87a6]">
            Live route navigation, order pickup verification, and daily compensation tracking.
          </p>
        </div>
      </div>

      {/* Active Trip Dispatch Card */}
      <div className="theme-card p-6 border-2 border-emerald-400/50 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <Bike className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                  Active Dispatch Trip #{activeTrip.orderNumber}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  tripStatus === 'OUT_FOR_DELIVERY' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {tripStatus === 'OUT_FOR_DELIVERY' ? 'En Route to Customer' : 'At Merchant Location'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Earnings on delivery: <span className="font-bold text-emerald-600">₹65.00</span> • Est. Distance: <span className="font-bold">2.4 km</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {tripStatus !== 'OUT_FOR_DELIVERY' ? (
              <button
                onClick={handleConfirmPickup}
                className="px-4 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-white text-xs font-black flex items-center space-x-2 shadow-lg shadow-[#6339f4]/30 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Pickup & Start Delivery</span>
              </button>
            ) : (
              <span className="px-3 py-2 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Items Picked Up • Customer Tracking Active</span>
              </span>
            )}

            <button
              onClick={() => setShowRadar(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#fc8019] to-[#e66c0d] hover:opacity-90 text-white text-xs font-black flex items-center space-x-2 shadow-md shadow-[#fc8019]/25 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Live Radar Map</span>
            </button>
          </div>
        </div>

        {/* Route Details Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-500 font-bold uppercase text-[10px]">
              <Store className="w-3.5 h-3.5 text-[#6339f4]" />
              <span>Pickup Merchant</span>
            </div>
            <p className="font-black text-[#181829]">{activeTrip.shopName}</p>
            <p className="text-slate-500 text-[11px]">100 Feet Road, Indiranagar, Bengaluru</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-500 font-bold uppercase text-[10px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dropoff Destination</span>
            </div>
            <p className="font-black text-[#181829]">{activeTrip.customerName}</p>
            <p className="text-slate-500 text-[11px]">{activeTrip.deliveryAddress.street}</p>
          </div>
        </div>
      </div>

      <RiderKpiCards />

      <div className="theme-card p-6 text-center py-12 space-y-2">
        <Navigation className="w-8 h-8 text-emerald-600 mx-auto opacity-70" />
        <h3 className="text-xs font-semibold text-[#181829]">Fleet Navigation Standby</h3>
        <p className="text-xs text-[#8a87a6] max-w-md mx-auto">
          Delivery partners receive automated proximity trip dispatches and manage doorstep OTP deliveries.
        </p>
      </div>

      {/* Swiggy Radar Modal */}
      <LiveDeliveryTrackingModal
        isOpen={showRadar}
        order={activeTrip}
        onClose={() => setShowRadar(false)}
      />
    </div>
  );
};
