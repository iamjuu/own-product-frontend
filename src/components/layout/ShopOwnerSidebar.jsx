import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  Layers,
  Settings,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

export const ShopOwnerSidebar = ({ currentRoute, onRouteChange }) => {
  const { user } = useAuth();
  const { appearance } = usePlatform();

  const isActive = (route) => {
    if (route === 'orders') return currentRoute.startsWith('orders');
    return currentRoute === route;
  };

  return (
    <aside className="w-64 my-4 ml-4 flex flex-col h-[calc(100vh-2rem)] select-none shrink-0 z-30">
      <div className="theme-sidebar flex-1 flex flex-col p-4 text-white overflow-hidden shadow-2xl relative">
        {/* Brand Header */}
        <div className="py-3 px-2 flex flex-col items-center justify-center text-center border-b border-white/10 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-inner border border-white/30">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-extrabold text-xs tracking-tight text-white uppercase">
            {appearance?.platformName || 'Marketplace Console'}
          </h1>
          <span className="text-[10px] text-white/80 font-medium flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Restaurant / Merchant Portal
          </span>
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
            <span>Store Dashboard</span>
          </button>

          {/* Live Kitchen & Orders */}
          <button
            onClick={() => onRouteChange('orders')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('orders')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 shrink-0" />
            <span>Kitchen & Orders</span>
          </button>

          {/* Menu / Catalog */}
          <button
            onClick={() => onRouteChange('menu')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              isActive('menu')
                ? 'bg-white text-[#6030ea] font-bold shadow-lg shadow-black/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>Menu & Items</span>
          </button>
        </nav>

        {/* Live Status Badge */}
        <div className="mt-auto pt-3 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-emerald-300 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online & Accepting Orders</span>
            </div>
            <p className="text-[10px] text-white/70">
              Logged in as: <span className="font-semibold text-white">{user?.name || user?.email}</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
