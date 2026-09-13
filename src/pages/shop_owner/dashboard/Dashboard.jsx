import React from 'react';
import { Store, Plus, Utensils } from 'lucide-react';
import { ShopKpiCards } from './components/ShopKpiCards';

export const ShopOwnerDashboard = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="theme-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="p-2 rounded-2xl bg-[#ece8ff] text-[#6339f4]">
            <Store className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
              Merchant Storefront Management
            </h2>
            <p className="text-xs text-[#8a87a6]">
              Real-time kitchen display, incoming order fulfillment, and menu management.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-medium text-white flex items-center space-x-2 shadow-md shadow-[#6339f4]/25 transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      <ShopKpiCards />

      <div className="theme-card p-6 text-center py-12 space-y-2">
        <Utensils className="w-8 h-8 text-[#6339f4] mx-auto opacity-70" />
        <h3 className="text-xs font-semibold text-[#181829]">Merchant Order Processing Active</h3>
        <p className="text-xs text-[#8a87a6] max-w-md mx-auto">
          Shop owners receive customer orders, update prep progress, and request delivery partner pickups.
        </p>
      </div>
    </div>
  );
};
