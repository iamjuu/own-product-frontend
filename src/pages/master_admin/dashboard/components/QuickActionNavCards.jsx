import React from 'react';
import { ChevronRight, MoreVertical } from 'lucide-react';

export const QuickActionNavCards = ({ overview = {}, finance = {}, onNavigate }) => {
  return (
    <div className="lg:col-span-4 space-y-4">
      {/* Card 1: Pending Orders */}
      <div
        onClick={() => onNavigate?.('orders-pending')}
        className="theme-card p-5 flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all"
      >
        <div>
          <p className="text-[14px] font-normal text-[#8a87a6] leading-snug">Pending Action Orders</p>
          <div className="text-[10px] font-normal text-[#181829] mt-1">
            {overview.pendingOrders ?? 500}
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#6339f4] text-white flex items-center justify-center shadow-md shadow-[#6339f4]/30">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* Card 2: Fulfilled Deliveries */}
      <div
        onClick={() => onNavigate?.('orders-completed')}
        className="theme-card p-5 flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all"
      >
        <div>
          <p className="text-[14px] font-normal text-[#8a87a6] leading-snug">Successfully Fulfilled</p>
          <div className="text-[10px] font-normal text-[#181829] mt-1">
            {overview.completedOrders ?? 3502}
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#6339f4] text-white flex items-center justify-center shadow-md shadow-[#6339f4]/30">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* Card 3: Merchants Settlement */}
      <div
        onClick={() => onNavigate?.('analytics')}
        className="theme-card p-5 flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all"
      >
        <div>
          <p className="text-[14px] font-normal text-[#8a87a6] leading-snug">Merchants Settlement</p>
          <div className="text-[10px] font-normal text-[#181829] mt-1">
            ₹{(finance.shopSettlement ?? 523001).toLocaleString('en-IN')}
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#6339f4] text-white flex items-center justify-center shadow-md shadow-[#6339f4]/30">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* Mini Analytics & Week Strip Card */}
      <div className="theme-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-[#181829]">Analytics & Fleet Active</span>
          <MoreVertical className="w-4 h-4 text-[#8a87a6] cursor-pointer" />
        </div>

        {/* Mini bar columns */}
        <div className="flex items-end justify-around h-16 pt-2 border-b border-slate-100">
          <div className="flex flex-col items-center">
            <div className="w-4 h-8 bg-[#ece8ff] rounded-t-lg"></div>
            <span className="text-[10px] text-[#8a87a6] mt-1 font-normal">23 Mar</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-12 bg-[#6339f4] rounded-t-lg"></div>
            <span className="text-[10px] text-[#8a87a6] mt-1 font-normal">30 Aug</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-9 bg-[#ece8ff] rounded-t-lg"></div>
            <span className="text-[10px] text-[#8a87a6] mt-1 font-normal">25 Sep</span>
          </div>
        </div>

        {/* Week Days Strip */}
        <div className="flex justify-between text-center pt-1 text-[11px] font-normal">
          <div><div className="text-[#8a87a6]">Mo</div><div className="text-[#181829] mt-0.5">12</div></div>
          <div className="bg-[#ece8ff] text-[#6339f4] px-2 py-0.5 rounded-lg font-medium"><div>Tu</div><div className="mt-0.5">13°</div></div>
          <div><div className="text-[#8a87a6]">We</div><div className="text-[#181829] mt-0.5">14</div></div>
          <div><div className="text-[#8a87a6]">Th</div><div className="text-[#181829] mt-0.5">15</div></div>
          <div><div className="text-[#8a87a6]">Fr</div><div className="text-[#181829] mt-0.5">16</div></div>
          <div><div className="text-[#8a87a6]">Sa</div><div className="text-[#181829] mt-0.5">17</div></div>
          <div><div className="text-[#8a87a6]">Su</div><div className="text-[#181829] mt-0.5">18</div></div>
        </div>
      </div>
    </div>
  );
};
