import React from 'react';
import { UtensilsCrossed, Clock, CheckCircle2, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';

export const ShopOwnerOrders = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="theme-card p-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#181829]">Live Kitchen & Incoming Orders</h1>
          <p className="text-xs text-[#8a87a6] mt-0.5">
            Accept orders, assign prep status, and alert delivery partners when food is ready.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
          Auto-Refresh Active
        </span>
      </div>

      <div className="theme-card p-12 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#6339f4] mx-auto">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-[#181829]">All Caught Up!</h3>
        <p className="text-xs text-[#8a87a6] max-w-sm mx-auto">
          No pending orders in the queue right now. As customers place orders, tickets will immediately ping here with acoustic alerts.
        </p>
      </div>
    </div>
  );
};
