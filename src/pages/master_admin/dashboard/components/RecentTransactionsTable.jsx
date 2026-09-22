import React from 'react';
import { MoreVertical } from 'lucide-react';

export const RecentTransactionsTable = ({ recentOrders = [] }) => {
  return (
    <div className="theme-card p-5 overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-[#181829] uppercase tracking-wider">Recent Live Orders & Settlements</h4>
        <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Live Pipeline</span>
      </div>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-100 text-[12px] font-normal text-[#8a87a6]">
            <th className="pb-3">Order / ID</th>
            <th className="pb-3">Merchant</th>
            <th className="pb-3">Customer</th>
            <th className="pb-3">Amount</th>
            <th className="pb-3">Status</th>
            <th className="pb-3 text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-normal text-[#181829]">
          {recentOrders && recentOrders.length > 0 ? (
            recentOrders.slice(0, 5).map((order) => {
              const getStatusBadge = (status) => {
                switch (status) {
                  case 'DELIVERED':
                    return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
                  case 'OUT_FOR_DELIVERY':
                  case 'PICKED_UP':
                    return 'bg-blue-50 text-blue-600 border border-blue-200';
                  case 'READY_FOR_PICKUP':
                  case 'PREPARING':
                    return 'bg-purple-50 text-purple-600 border border-purple-200';
                  case 'ACCEPTED':
                  case 'PLACED':
                    return 'bg-amber-50 text-amber-600 border border-amber-200';
                  case 'CANCELLED':
                    return 'bg-rose-50 text-rose-600 border border-rose-200';
                  default:
                    return 'bg-slate-50 text-slate-600 border border-slate-200';
                }
              };

              return (
                <tr key={order._id || order.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 font-semibold text-[#181829]">
                    #{order.orderNumber || (order._id ? order._id.slice(-6).toUpperCase() : 'ORD')}
                  </td>
                  <td className="py-3 text-slate-700">{order.shopName || 'Local Merchant'}</td>
                  <td className="py-3 text-[#8a87a6]">{order.customerName || 'Registered User'}</td>
                  <td className="py-3 font-semibold text-slate-900">₹{order.totalAmount || order.subtotal || 0}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${getStatusBadge(order.status)}`}>
                      {order.status?.replace(/_/g, ' ') || 'PLACED'}
                    </span>
                  </td>
                  <td className="py-3 text-right text-[#8a87a6]">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Today'}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="py-6 text-center text-slate-400">
                No orders placed yet. As soon as orders are placed, they will appear here in real-time.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

