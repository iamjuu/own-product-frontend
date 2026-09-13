import React from 'react';
import { Store, ShoppingBag, IndianRupee, Clock } from 'lucide-react';

export const ShopKpiCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Today's Orders</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">18 Orders</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          +12%
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Daily Revenue</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">₹14,580</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          Settled
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Avg Prep Time</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">14 mins</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
          Fast
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-[#6339f4] shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Store Status</p>
            <div className="text-[10px] font-normal text-emerald-600 mt-0.5">Accepting Orders</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          Open
        </span>
      </div>
    </div>
  );
};
