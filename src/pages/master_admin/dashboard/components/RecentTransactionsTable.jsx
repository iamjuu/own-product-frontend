import React from 'react';
import { MoreVertical } from 'lucide-react';

export const RecentTransactionsTable = () => {
  return (
    <div className="theme-card p-5 overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-100 text-[12px] font-normal text-[#8a87a6]">
            <th className="pb-3">Transaction</th>
            <th className="pb-3">Merchant / Party</th>
            <th className="pb-3">Role</th>
            <th className="pb-3">Date</th>
            <th className="pb-3">Status</th>
            <th className="pb-3 text-right">Options</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-normal text-[#181829]">
          <tr>
            <td className="py-3">Commission Settlement</td>
            <td className="py-3">Rahman Restaurant</td>
            <td className="py-3 text-[#8a87a6]">Merchant</td>
            <td className="py-3 text-[#8a87a6]">13-09-2026</td>
            <td className="py-3">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[11px] font-normal">
                Pending
              </span>
            </td>
            <td className="py-3 text-right">
              <MoreVertical className="w-4 h-4 text-[#8a87a6] inline cursor-pointer" />
            </td>
          </tr>
          <tr>
            <td className="py-3">Fleet Payout Batch</td>
            <td className="py-3">Muhammed Rider</td>
            <td className="py-3 text-[#8a87a6]">Delivery Partner</td>
            <td className="py-3 text-[#8a87a6]">12-09-2026</td>
            <td className="py-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-normal">
                Done
              </span>
            </td>
            <td className="py-3 text-right">
              <MoreVertical className="w-4 h-4 text-[#8a87a6] inline cursor-pointer" />
            </td>
          </tr>
          <tr>
            <td className="py-3">Customer Cashback</td>
            <td className="py-3">Ajmal</td>
            <td className="py-3 text-[#8a87a6]">Customer</td>
            <td className="py-3 text-[#8a87a6]">11-09-2026</td>
            <td className="py-3">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6339f4] text-[11px] font-normal">
                Settled
              </span>
            </td>
            <td className="py-3 text-right">
              <MoreVertical className="w-4 h-4 text-[#8a87a6] inline cursor-pointer" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
