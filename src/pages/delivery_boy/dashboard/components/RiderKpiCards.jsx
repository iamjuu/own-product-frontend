import React from 'react';
import { Bike, IndianRupee, Star, Compass, TrendingUp } from 'lucide-react';

export const RiderKpiCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF7622] shrink-0 shadow-inner">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#646982]">Completed Trips</p>
            <div className="text-lg font-black text-[#181C2E] mt-0.5">8 Trips</div>
          </div>
        </div>
        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center space-x-0.5">
          <TrendingUp className="w-3 h-3" />
          <span>+2</span>
        </span>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF7622] shrink-0 shadow-inner">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#646982]">Today's Earnings</p>
            <div className="text-lg font-black text-[#181C2E] mt-0.5">₹1,140</div>
          </div>
        </div>
        <span className="text-[10px] font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
          +Tips
        </span>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#646982]">Rider Rating</p>
            <div className="text-lg font-black text-[#181C2E] mt-0.5">4.92 ★</div>
          </div>
        </div>
        <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
          Top Rated
        </span>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#646982]">Fleet Status</p>
            <div className="text-sm font-black text-emerald-600 mt-0.5">Active • Radar On</div>
          </div>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
      </div>
    </div>
  );
};
