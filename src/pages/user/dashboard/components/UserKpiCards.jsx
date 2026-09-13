import React from 'react';
import { ShoppingBag, Wallet, Clock, Heart } from 'lucide-react';

export const UserKpiCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">My Orders</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">14 Total</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          Active
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Wallet Cash</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">₹450</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
          Cashback
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Favorites</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">6 Stores</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
          Saved
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-[#6339f4] shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Fast Delivery</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">~22 mins</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          Live
        </span>
      </div>
    </div>
  );
};
