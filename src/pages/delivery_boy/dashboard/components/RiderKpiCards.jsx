import React from 'react';
import { Bike, IndianRupee, Star, Navigation } from 'lucide-react';

export const RiderKpiCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Completed Trips</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">8 Trips Today</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          +2
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Today's Earnings</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">₹1,140</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          +Tips
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Rider Rating</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">4.92 / 5.0</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
          Top Rated
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Duty Status</p>
            <div className="text-[10px] font-normal text-emerald-600 mt-0.5">Online • GPS Ready</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          Active
        </span>
      </div>
    </div>
  );
};
