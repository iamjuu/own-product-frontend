import React from 'react';
import { ShoppingBag, Wallet, Clock, Heart } from 'lucide-react';

export const UserKpiCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF7622] shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#646982]">My Orders</p>
            <div className="text-base font-black text-[#181C2E] mt-0.5">14 Total</div>
          </div>
        </div>
        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          Active
        </span>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF7622] shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#646982]">Wallet Balance</p>
            <div className="text-base font-black text-[#181C2E] mt-0.5">₹450.00</div>
          </div>
        </div>
        <span className="text-[10px] font-black text-[#FF7622] bg-orange-50 px-2 py-0.5 rounded-full">
          Cashback
        </span>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#646982]">Favorites</p>
            <div className="text-base font-black text-[#181C2E] mt-0.5">6 Stores</div>
          </div>
        </div>
        <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
          Saved
        </span>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#646982]">Avg. Delivery</p>
            <div className="text-base font-black text-[#181C2E] mt-0.5">~22 mins</div>
          </div>
        </div>
        <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
          Fast
        </span>
      </div>
    </div>
  );
};
