import React, { useState } from 'react';
import { 
  Bike, 
  MapPin, 
  DollarSign, 
  Clock, 
  Bell, 
  LogOut, 
  ShieldCheck, 
  Power, 
  Navigation, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DeliveryBoyLayout = ({ currentRoute, onRouteChange, onRefresh, children }) => {
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#181C2E] flex flex-col font-sans selection:bg-[#FF7622]/20">
      {/* Rider Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo & Platform Fleet */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF7622] text-white flex items-center justify-center shadow-md shadow-[#FF7622]/30">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-[#181C2E]">
                  Local Run Fleet
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-100 text-[#FF7622]">
                  Rider Partner
                </span>
              </div>
              <p className="text-[11px] text-[#646982] hidden sm:block">
                Hyperlocal Delivery Partner Console
              </p>
            </div>
          </div>

          {/* Right Controls: Online Toggle, Profile, Logout */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Duty Online/Offline Switch */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center space-x-2 transition-all shadow-sm ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-emerald-500/10'
                  : 'bg-slate-100 text-slate-600 border border-slate-300'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{isOnline ? 'ON DUTY • Online' : 'OFF DUTY'}</span>
            </button>

            {/* Rider Info */}
            <div className="hidden md:flex items-center space-x-2 border-l border-slate-200 pl-3">
              <div className="w-8 h-8 rounded-full bg-[#181C2E] text-white flex items-center justify-center font-bold text-xs">
                {user?.name?.[0] || 'R'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#181C2E] leading-none">
                  {user?.name || 'Delivery Partner'}
                </p>
                <p className="text-[10px] text-[#646982] mt-0.5">
                  ID: <span className="font-mono font-semibold">RID-4091</span>
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl text-[#646982] hover:text-rose-600 hover:bg-rose-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Sub-nav for Rider Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center space-x-1 border-t border-slate-100 overflow-x-auto py-1">
          <button
            onClick={() => onRouteChange?.('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              currentRoute === 'dashboard'
                ? 'bg-[#FF7622] text-white shadow-sm'
                : 'text-[#646982] hover:text-[#181C2E] hover:bg-slate-100'
            }`}
          >
            Active Orders & Dispatch
          </button>
          <button
            onClick={() => onRouteChange?.('earnings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              currentRoute === 'earnings'
                ? 'bg-[#FF7622] text-white shadow-sm'
                : 'text-[#646982] hover:text-[#181C2E] hover:bg-slate-100'
            }`}
          >
            Daily Earnings & Ledger
          </button>
          <button
            onClick={() => onRouteChange?.('history')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              currentRoute === 'history'
                ? 'bg-[#FF7622] text-white shadow-sm'
                : 'text-[#646982] hover:text-[#181C2E] hover:bg-slate-100'
            }`}
          >
            Trip History
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-12">
        {children}
      </main>

      {/* Mobile Footer Safe Area */}
      <footer className="text-center py-4 text-xs text-[#646982] border-t border-slate-200/60 bg-white">
        <p>© 2026 Local Run Logistics • Real-Time Partner Dispatch</p>
      </footer>
    </div>
  );
};
