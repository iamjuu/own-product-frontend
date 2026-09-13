import React from 'react';
import { Shield, AlertCircle, ShoppingBag, Truck } from 'lucide-react';

export const OpsKpiCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Dispute Queue</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">3 Open</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
          Review
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Active Orders</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">42 Live</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          Fulfilling
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">Rider KYC Pipeline</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">7 Pending</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
          Action Req.
        </span>
      </div>

      <div className="theme-card p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-[#6339f4] shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-normal text-[#8a87a6]">SLA Compliance</p>
            <div className="text-[10px] font-normal text-[#181829] mt-0.5">99.2%</div>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          Normal
        </span>
      </div>
    </div>
  );
};
