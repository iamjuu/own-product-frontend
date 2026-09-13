import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShoppingBag,
  Users,
  Bike,
  Store,
  AlertTriangle,
  History,
  Bell,
  Palette,
  ArrowRight,
  Clock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import ApiClient from '../../../api/client';

export const AdminDashboard = ({ onNavigate }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiClient.get('/admin/dashboard');
      if (response.success) {
        setData(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="theme-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#6339f4]/10 text-[#6339f4] ring-4 ring-[#ece8ff]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#181829] tracking-tight">
              Operations Control Center
            </h2>
            <p className="text-xs text-[#8a87a6] font-medium">
              Live marketplace dispatch oversight, order pipeline, dispute handling & customer assistance.
            </p>
          </div>
        </div>

        <button
          onClick={fetchDashboard}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-[#181829] hover:bg-slate-50 transition-all shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#6339f4] ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* 2. Top KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Orders */}
        <div className="theme-card p-4 space-y-2 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8a87a6]">Total Orders</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-[#181829]">
            {data?.totalOrders ?? (isLoading ? '...' : 0)}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">● Active Pipeline</span>
        </div>

        {/* Live Riders */}
        <div className="theme-card p-4 space-y-2 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8a87a6]">Live Riders</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-[#181829]">
            {data?.liveRiders ?? (isLoading ? '...' : 0)}
          </div>
          <span className="text-[10px] text-cyan-600 font-bold">Online on field</span>
        </div>

        {/* Registered Customers */}
        <div className="theme-card p-4 space-y-2 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8a87a6]">Customers</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-[#181829]">
            {data?.totalCustomers ?? (isLoading ? '...' : 0)}
          </div>
          <span className="text-[10px] text-[#6339f4] font-bold">Platform users</span>
        </div>

        {/* Active Shops */}
        <div className="theme-card p-4 space-y-2 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8a87a6]">Active Shops</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-[#181829]">
            {data?.activeShops ?? (isLoading ? '...' : 0)}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">Open for orders</span>
        </div>

        {/* Pending Disputes */}
        <div className="theme-card p-4 space-y-2 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8a87a6]">Pending Claims</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-rose-600">
            {data?.pendingDisputes ?? (isLoading ? '...' : 0)}
          </div>
          <span className="text-[10px] text-rose-500 font-bold">Requires Action</span>
        </div>

        {/* Verification Queue */}
        <div className="theme-card p-4 space-y-2 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8a87a6]">KYC Pending</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-amber-600">
            {data?.pendingVerifications ?? (isLoading ? '...' : 0)}
          </div>
          <span className="text-[10px] text-amber-600 font-bold">Rider applications</span>
        </div>
      </div>

      {/* 3. Operational Quick Action Navigation Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Orders Card */}
        <div
          onClick={() => onNavigate && onNavigate('orders')}
          className="theme-card p-5 cursor-pointer hover:border-[#6339f4]/40 hover:shadow-lg transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#181829] group-hover:text-[#6339f4]">
              Order Management
            </h3>
            <p className="text-[11px] text-[#8a87a6] mt-0.5">
              Monitor live orders, updates & cancellations
            </p>
          </div>
          <div className="flex items-center text-[11px] font-bold text-[#6339f4] pt-1">
            <span>View Orders</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Customers Card */}
        <div
          onClick={() => onNavigate && onNavigate('customers')}
          className="theme-card p-5 cursor-pointer hover:border-[#6339f4]/40 hover:shadow-lg transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#181829] group-hover:text-[#6339f4]">
              Customer Directory
            </h3>
            <p className="text-[11px] text-[#8a87a6] mt-0.5">
              Customer profiles, addresses & spend
            </p>
          </div>
          <div className="flex items-center text-[11px] font-bold text-[#6339f4] pt-1">
            <span>View Customers</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Activity Logs Card */}
        <div
          onClick={() => onNavigate && onNavigate('activity-logs')}
          className="theme-card p-5 cursor-pointer hover:border-[#6339f4]/40 hover:shadow-lg transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#181829] group-hover:text-[#6339f4]">
              Activity Logs
            </h3>
            <p className="text-[11px] text-[#8a87a6] mt-0.5">
              Audit trails and administrative actions
            </p>
          </div>
          <div className="flex items-center text-[11px] font-bold text-[#6339f4] pt-1">
            <span>View Audit Log</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Notifications Card */}
        <div
          onClick={() => onNavigate && onNavigate('notifications')}
          className="theme-card p-5 cursor-pointer hover:border-[#6339f4]/40 hover:shadow-lg transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#181829] group-hover:text-[#6339f4]">
              Notifications
            </h3>
            <p className="text-[11px] text-[#8a87a6] mt-0.5">
              Broadcast announcements & platform alerts
            </p>
          </div>
          <div className="flex items-center text-[11px] font-bold text-[#6339f4] pt-1">
            <span>Broadcast Alerts</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Appearance Card */}
        <div
          onClick={() => onNavigate && onNavigate('appearance')}
          className="theme-card p-5 cursor-pointer hover:border-[#6339f4]/40 hover:shadow-lg transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#181829] group-hover:text-[#6339f4]">
              Appearance & Branding
            </h3>
            <p className="text-[11px] text-[#8a87a6] mt-0.5">
              Review marketplace branding & themes
            </p>
          </div>
          <div className="flex items-center text-[11px] font-bold text-[#6339f4] pt-1">
            <span>View Appearance</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 4. Recent Live Orders Feed */}
      <div className="theme-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#6339f4]" />
            <h3 className="text-xs font-bold text-[#181829]">Recent Marketplace Orders</h3>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('orders')}
            className="text-xs text-[#6339f4] hover:text-[#5327ec] font-bold flex items-center space-x-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {data?.recentOrders && data.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[#8a87a6] font-bold">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Shop</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Placed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#6339f4]">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 font-semibold text-[#181829]">
                      {order.customerName}
                    </td>
                    <td className="py-3 text-[#8a87a6]">{order.shopName}</td>
                    <td className="py-3 font-bold text-[#181829]">₹{order.totalAmount}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#8a87a6]">
                      {new Date(order.placedAt || order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-[#8a87a6] text-xs">
            {isLoading ? 'Loading live orders...' : 'No recent orders found.'}
          </div>
        )}
      </div>
    </div>
  );
};
