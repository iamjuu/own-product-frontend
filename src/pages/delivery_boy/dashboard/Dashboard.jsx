import React from 'react';
import { Bike, Navigation, MapPin } from 'lucide-react';
import { RiderKpiCards } from './components/RiderKpiCards';

export const DeliveryBoyDashboard = () => {
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

      <RiderKpiCards />

      <div className="theme-card p-6 text-center py-12 space-y-2">
        <Navigation className="w-8 h-8 text-emerald-600 mx-auto opacity-70" />
        <h3 className="text-xs font-semibold text-[#181829]">Fleet Navigation Standby</h3>
        <p className="text-xs text-[#8a87a6] max-w-md mx-auto">
          Delivery partners receive automated proximity trip dispatches and manage doorstep OTP deliveries.
        </p>
      </div>
    </div>
  );
};
