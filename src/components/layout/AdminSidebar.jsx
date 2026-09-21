import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Layers,
  Tag,
  Users,
  History,
  Bell,
  Palette,
  Shield,
  Clock,
  MoreVertical,
  Bike,
  Smartphone,
  Scale,
  Package,
  FolderTree,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const AdminSidebar = ({ currentRoute, onRouteChange }) => {
  const { appearance } = usePlatform();

  const isActive = (route) => {
    let cleanRoute = currentRoute || 'dashboard';
    if (cleanRoute.startsWith('admin/')) {
      cleanRoute = cleanRoute.substring('admin/'.length);
    } else if (cleanRoute === 'admin') {
      cleanRoute = 'dashboard';
    }
    if (route === 'orders') return cleanRoute.startsWith('orders');
    if (route === 'delivery') return cleanRoute.startsWith('delivery');
    return cleanRoute === route;
  };

  return (
    <aside className="w-64 my-4 ml-4 flex flex-col h-[calc(100vh-2rem)] select-none shrink-0 z-30">
      {/* Floating Pill Container with Purple Gradient Header */}
      <div className="theme-sidebar flex-1 flex flex-col p-4 text-white overflow-hidden shadow-2xl relative">
        {/* Brand Header */}
        <div className="py-3 px-2 flex flex-col items-center justify-center text-center border-b border-white/10 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-inner border border-white/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-extrabold text-xs tracking-tight text-white uppercase">
            {appearance?.platformName || 'Marketplace Console'}
          </h1>
          <span className="text-[10px] text-white/70 font-medium">Operations Admin</span>
        </div>

        {/* Navigation Items */}
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

          {/* Categories */}
          <button
            onClick={() => onRouteChange('categories')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('categories')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>Categories</span>
          </button>

          {/* Subcategories */}
          <button
            onClick={() => onRouteChange('subcategories')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('subcategories')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <FolderTree className="w-4 h-4 shrink-0" />
            <span>Subcategories</span>
          </button>

          {/* Brands */}
          <button
            onClick={() => onRouteChange('brands')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('brands')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Tag className="w-4 h-4 shrink-0" />
            <span>Brands</span>
          </button>

          {/* Units */}
          <button
            onClick={() => onRouteChange('units')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('units')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Scale className="w-4 h-4 shrink-0" />
            <span>Units</span>
          </button>

          {/* Products & Variants */}
          <button
            onClick={() => onRouteChange('products')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('products')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span>Products</span>
          </button>

          {/* Orders */}
          <button
            onClick={() => onRouteChange('orders')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('orders')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Orders</span>
          </button>

          {/* Delivery Partners (Rider Fleet & Verification) */}
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
            <span>Activity Log</span>
          </button>

          {/* Notifications */}
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

          {/* iPhone 16 Mobile Apps Section */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-white/50 uppercase tracking-wider flex items-center justify-between">
            <span>iPhone 16 Mockup</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7622] animate-pulse"></span>
          </div>

          <button
            onClick={() => onRouteChange('preview-user')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('preview-user')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0 text-[#FFA767]" />
            <span>Customer App</span>
          </button>

          <button
            onClick={() => onRouteChange('preview-delivery')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('preview-delivery')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bike className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Delivery Boy App</span>
          </button>
        </nav>

        {/* Operational Oversight Card */}
        <div className="mt-3 theme-sidebar-card p-3.5 text-white">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-xs">Live Ops Stream</span>
            </div>
            <MoreVertical className="w-3.5 h-3.5 text-white/60 cursor-pointer" />
          </div>
          <p className="text-[10px] text-white/80 leading-tight">
            Active session with operations privileges. Order overrides & dispute resolution enabled.
          </p>
        </div>
      </div>
    </aside>
  );
};
