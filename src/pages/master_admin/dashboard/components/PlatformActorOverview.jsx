import React from 'react';
import { Users, Store, Bike, Wallet } from 'lucide-react';

export const PlatformActorOverview = ({ overview = {}, finance = {} }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="theme-card p-4 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-[#6339f4] text-white flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[14px] font-normal text-[#8a87a6] leading-snug">Customers</p>
          <div className="text-[10px] font-normal text-[#181829] mt-0.5">
            {overview.totalCustomers ?? 5095}
          </div>
          <span className="text-[10px] font-normal text-emerald-600">+33.45%</span>
        </div>
      </div>

      <div className="theme-card p-4 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-[#6339f4] text-white flex items-center justify-center shrink-0">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[14px] font-normal text-[#8a87a6] leading-snug">Active Shops</p>
          <div className="text-[10px] font-normal text-[#181829] mt-0.5">
            {overview.activeShops ?? 47}
          </div>
          <span className="text-[10px] font-normal text-indigo-600">Online</span>
        </div>
      </div>

      <div className="theme-card p-4 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-[#6339f4] text-white flex items-center justify-center shrink-0">
          <Bike className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[14px] font-normal text-[#8a87a6] leading-snug">Online Fleet</p>
          <div className="text-[10px] font-normal text-[#181829] mt-0.5">
            {overview.onlineDeliveryPartners ?? 25}
          </div>
          <span className="text-[10px] font-normal text-emerald-600">+62.10%</span>
        </div>
      </div>

      <div className="theme-card p-4 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-[#6339f4] text-white flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[14px] font-normal text-[#8a87a6] leading-snug">Wallet Float</p>
          <div className="text-[10px] font-normal text-[#181829] mt-0.5">
            ₹{(finance.walletActivity ?? 4500).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] font-normal text-emerald-600">+4.46%</span>
        </div>
      </div>
    </div>
  );
};
