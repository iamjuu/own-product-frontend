import React from 'react';
import { Bike, IndianRupee, Star, Compass, TrendingUp, PackageCheck } from 'lucide-react';

export const RiderKpiCards = ({ overview, isOnline = true }) => {
  const completedTrips = overview?.completedTrips ?? 0;
  const todaysEarnings = overview?.todaysEarnings ?? 0;
  const rating = overview?.partner?.rating ?? 4.9;
  const activeTrips = overview?.activeTrips ?? 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Completed Trips */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#FF7622] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              {completedTrips} <span className="text-xs font-bold text-slate-400">Trips</span>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center space-x-0.5">
          <TrendingUp className="w-3 h-3" />
          <span>Live</span>
        </span>
      </div>

      {/* 2. Today's Earnings */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Today's Earnings</p>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              ₹{Number(todaysEarnings).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          +Pauyouts
        </span>
      </div>

      {/* 3. Rider Rating */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Partner Rating</p>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              {Number(rating).toFixed(1)} <span className="text-amber-500 text-sm">★</span>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
          Verified
        </span>
      </div>

      {/* 4. Radar & Fleet Status */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
        <div className="flex items-center space-x-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
            isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
          }`}>
            <Compass className={`w-5 h-5 ${isOnline ? 'animate-spin-slow' : ''}`} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fleet Radar</p>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
              {isOnline ? (activeTrips > 0 ? 'On Trip' : 'Online • Ready') : 'Offline'}
            </div>
          </div>
        </div>
        {isOnline ? (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        ) : (
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
        )}
      </div>
    </div>
  );
};
