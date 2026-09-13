import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Bike,
  Users,
  BarChart3,
  History,
  ToggleLeft,
  Palette,
  Sliders,
  Clock,
  MoreVertical,
  Bell
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const Sidebar = ({ currentRoute, onRouteChange }) => {
  const { appearance } = usePlatform();

  const isActive = (route) => {
    if (route === 'orders') return currentRoute.startsWith('orders');
    if (route === 'delivery') return currentRoute.startsWith('delivery');
    return currentRoute === route;
  };

  return (
    <aside className="w-64 my-4 ml-4 flex flex-col h-[calc(100vh-2rem)] select-none shrink-0 z-30">
      {/* Floating Purple Pill Container */}
      <div className="theme-sidebar flex-1 flex flex-col p-4 text-white overflow-hidden shadow-2xl relative">
        {/* Brand Header */}
        <div className="py-3 px-2 flex flex-col items-center justify-center text-center border-b border-white/10 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-inner border border-white/30">
            <svg
              className="w-7 h-7 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 17l6-10 6 10 6-10" />
            </svg>
          </div>
          <h1 className="font-extrabold text-xs tracking-tight text-white uppercase">
            {appearance.platformName || 'Virtual Dashboard'}
          </h1>
          <span className="text-[10px] text-white/70 font-medium">Master Controller</span>
        </div>

        {/* Navigation Items (Single Click Links) */}
        <nav className="flex-1 overflow-y-auto pr-1 space-y-1 text-xs">
          {/* Dashboard */}
          <button
            onClick={() => onRouteChange('dashboard')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('dashboard')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* Orders */}
          <button
            onClick={() => onRouteChange('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('orders')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Orders</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-[#181829] text-[9px] font-extrabold">
              3
            </span>
          </button>

          {/* Shops */}
          <button
            onClick={() => onRouteChange('shops')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('shops')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Store className="w-4 h-4 shrink-0" />
            <span>Shops</span>
          </button>

          {/* Delivery Partners */}
          <button
            onClick={() => onRouteChange('delivery')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('delivery')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bike className="w-4 h-4 shrink-0" />
            <span>Delivery Partners</span>
          </button>

          {/* Customers */}
          <button
            onClick={() => onRouteChange('customers')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('customers')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Customers</span>
          </button>

          {/* Analytics */}
          <button
            onClick={() => onRouteChange('analytics')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('analytics')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Analytics</span>
          </button>

          {/* Activity Logs */}
          <button
            onClick={() => onRouteChange('activity-logs')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('activity-logs')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <History className="w-4 h-4 shrink-0" />
            <span>Activity Logs</span>
          </button>

          <div className="pt-2 pb-1 px-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
              Platform
            </span>
          </div>

          {/* Features */}
          <button
            onClick={() => onRouteChange('features')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('features')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <ToggleLeft className="w-4 h-4 shrink-0" />
            <span>Features</span>
          </button>

          {/* Manage Admins / Create Admins */}
          <button
            onClick={() => onRouteChange('admins')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('admins')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Manage Admins</span>
          </button>

          {/* Notifications & Broadcast Alerts */}
          <button
            onClick={() => onRouteChange('notifications')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('notifications')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span>Notifications</span>
          </button>

          {/* Appearance */}
          <button
            onClick={() => onRouteChange('appearance')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('appearance')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Palette className="w-4 h-4 shrink-0" />
            <span>Appearance</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => onRouteChange('settings')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('settings')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sliders className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Bottom History / Controller Card */}
        <div className="mt-3 theme-sidebar-card p-3.5 text-white">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-xs">History available</span>
            </div>
            <MoreVertical className="w-3.5 h-3.5 text-white/60 cursor-pointer" />
          </div>
          <p className="text-[10px] text-white/80 leading-tight">
            Check your weekly marketplace transaction & activity reports.
          </p>
        </div>
      </div>
    </aside>
  );
};
