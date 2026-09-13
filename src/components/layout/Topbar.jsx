import React from 'react';
import { Search, Bell, Clock, Activity, LogOut, Menu, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

export const Topbar = ({ currentRoute, onRefresh }) => {
  const { user, logout } = useAuth();
  const { settings, appearance } = usePlatform();

  return (
    <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-20 bg-[#f0f2fb]/80 backdrop-blur-md">
      {/* Search Capsule matching the top design */}
      <div className="relative w-72 sm:w-96">
        <Search className="w-4 h-4 text-[#8a87a6] absolute left-4 top-3" />
        <input
          type="text"
          placeholder="Search orders, shops, analytics..."
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] shadow-sm focus:outline-none focus:border-[#6339f4] focus:ring-2 focus:ring-[#6339f4]/10 transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Marketplace Hours Capsule */}
        <div className="hidden lg:flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 text-xs shadow-sm">
          <Clock className="w-3.5 h-3.5 text-[#6339f4]" />
          <span className="text-[#8a87a6] font-medium">Hours:</span>
          <span className="font-bold text-[#181829]">
            {settings.openingTime} - {settings.closingTime}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#ece8ff] text-[#6339f4] font-bold text-[10px]">
            {settings.timezone || 'Asia/Kolkata'}
          </span>
        </div>

        {/* User Profile Card (Matching top right in image) */}
        <div className="flex items-center space-x-3 bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80'
            }
            alt={user?.name || 'Master Admin'}
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#ece8ff]"
          />
          <div className="text-left">
            <div className="text-xs font-extrabold text-[#181829] leading-tight">
              {user?.name || 'Mike Lock'}
            </div>
            <div className="text-[10px] text-[#8a87a6] font-medium">
              {user?.role === 'ADMIN' ? 'Operations Admin' : (user?.role === 'MASTER_ADMIN' ? 'Master Controller' : user?.role || 'Admin')}
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 rounded-xl hover:bg-rose-50 text-[#8a87a6] hover:text-rose-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
