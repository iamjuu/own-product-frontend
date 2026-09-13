import React from 'react';
import { ShoppingBag, Truck, IndianRupee, TrendingUp } from 'lucide-react';

export const KpiSummaryCards = ({ overview = {}, finance = {} }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Orders */}
      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6] leading-snug">Total Orders</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">
              {overview.totalOrders || '24k'}
            </div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          +33.45%
        </span>
      </div>

      {/* Active Deliveries */}
      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6] leading-snug">Active Deliveries</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">
              {overview.inProgressOrders ?? '18'}
            </div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-[#6339f4] bg-[#ece8ff] px-2.5 py-0.5 rounded-full">
          In Transit
        </span>
      </div>

      {/* Gross GMV */}
      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6] leading-snug">Gross GMV</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">
              ₹{(finance.gmv ?? 2400).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          +62.10%
        </span>
      </div>

      {/* Platform Revenue */}
      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6] leading-snug">Platform Revenue</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">
              ₹{(finance.platformRevenue ?? 450).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          +4.46%
        </span>
      </div>
    </div>
  );
};
