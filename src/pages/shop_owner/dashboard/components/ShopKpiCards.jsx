import React from 'react';
import { Store, ShoppingBag, IndianRupee, Clock, Utensils } from 'lucide-react';

export const ShopKpiCards = ({ activeOrders, preparingOrders, totalRevenue }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Active Orders</p>
            <div className="text-[14px] font-bold text-[#181829] mt-0.5">
              {activeOrders !== undefined ? `${activeOrders} Orders` : '0 Orders'}
            </div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          Live
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">In Kitchen</p>
            <div className="text-[14px] font-bold text-[#181829] mt-0.5">
              {preparingOrders !== undefined ? `${preparingOrders} Preparing` : '0 Preparing'}
            </div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
          Cooking
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Store Earnings</p>
            <div className="text-[14px] font-bold text-[#181829] mt-0.5">
              ₹{(totalRevenue || 0).toLocaleString()}
            </div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          Settled
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-[#6339f4] shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Store Status</p>
            <div className="text-[14px] font-bold text-emerald-600 mt-0.5">Online</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          Open
        </span>
      </div>
    </div>
  );
};
