import React, { useState } from 'react';
import { ShoppingBag, Search, Compass, Bike, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserKpiCards } from './components/UserKpiCards';
import { LiveDeliveryTrackingModal } from '../../../components/tracking/LiveDeliveryTrackingModal';

export const UserDashboard = () => {
  const [showLiveTracking, setShowLiveTracking] = useState(false);

  // Active simulated in-transit order for customer live experience
  const activeOrder = {
    _id: 'ord-customer-live-01',
    orderNumber: 'ORD-8924',
    status: 'OUT_FOR_DELIVERY',
    shopName: 'Green Valley Organic & Superstore',
    customerName: 'You (Current Address)',
    deliveryPartnerName: 'Rahul Kumar',
    deliveryPartnerPhone: '+91 98765 43210',
    totalAmount: 485,
    deliveryOtp: '4829',
    deliveryAddress: {
      street: 'Flat 402, Sunshine Heights, Koramangala',
      city: 'Bengaluru',
    },
    items: [
      { name: 'Organic Farm Fresh Milk', quantity: 2, price: 65 },
      { name: 'Whole Wheat Multigrain Bread', quantity: 1, price: 55 },
      { name: 'Himalayan Pink Salt', quantity: 1, price: 95 },
    ],
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="theme-card p-6 flex items-center space-x-3">
        <span className="p-2 rounded-2xl bg-[#ece8ff] text-[#6339f4]">
          <ShoppingBag className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
            Customer Marketplace Storefront
          </h2>
          <p className="text-xs text-[#8a87a6]">
            Browse multi-shop merchants, explore trending products, and track live deliveries.
          </p>
        </div>
      </div>

      {/* Swiggy-Style Active Delivery Live Tracker Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fc8019] via-[#f7750c] to-[#e66c0d] p-5 text-white shadow-xl shadow-[#fc8019]/25">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Bike className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded-full text-white">
                  ● En Route Now
                </span>
                <span className="text-xs font-bold text-orange-100 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Arriving in ~11 mins</span>
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                Delivery partner Rahul Kumar has picked up your items!
              </h3>
              <p className="text-xs text-orange-100/90 font-medium">
                From <span className="font-bold text-white">{activeOrder.shopName}</span> • OTP: <span className="font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">{activeOrder.deliveryOtp}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLiveTracking(true)}
            className="px-5 py-3 rounded-2xl bg-white text-[#fc8019] hover:bg-orange-50 font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
          >
            <Bike className="w-4 h-4" />
            <span>Track Live Delivery (Swiggy Radar)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <UserKpiCards />

      <div className="theme-card p-6 text-center py-12 space-y-2">
        <Compass className="w-8 h-8 text-[#6339f4] mx-auto opacity-70" />
        <h3 className="text-xs font-semibold text-[#181829]">Marketplace Customer App Live</h3>
        <p className="text-xs text-[#8a87a6] max-w-md mx-auto">
          Customers place multi-vendor orders, apply vouchers, pay via integrated gateways or wallet cash.
        </p>
      </div>

      {/* Live Swiggy Tracking Modal */}
      <LiveDeliveryTrackingModal
        isOpen={showLiveTracking}
        order={activeOrder}
        onClose={() => setShowLiveTracking(false)}
      />
    </div>
  );
};
