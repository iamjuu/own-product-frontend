import React from 'react';
import { ShoppingBag, Search, Compass } from 'lucide-react';
import { UserKpiCards } from './components/UserKpiCards';

export const UserDashboard = () => {
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

      <UserKpiCards />

      <div className="theme-card p-6 text-center py-12 space-y-2">
        <Compass className="w-8 h-8 text-[#6339f4] mx-auto opacity-70" />
        <h3 className="text-xs font-semibold text-[#181829]">Marketplace Customer App Live</h3>
        <p className="text-xs text-[#8a87a6] max-w-md mx-auto">
          Customers place multi-vendor orders, apply vouchers, pay via integrated gateways or wallet cash.
        </p>
      </div>
    </div>
  );
};
