import React from 'react';

export const AuditComplianceRing = () => {
  return (
    <div className="lg:col-span-4 theme-card p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[14px] font-normal text-[#181829]">Audit & Compliance</span>
        <span className="text-[11px] font-normal text-[#8a87a6] bg-[#f0f2fb] px-2.5 py-0.5 rounded-full">
          Realtime
        </span>
      </div>

      <div className="flex flex-col items-center justify-center my-4">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#ece8ff"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#6339f4"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset="62.8"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-normal text-[#181829]">75%</span>
            <span className="text-[10px] font-normal text-[#8a87a6] uppercase tracking-wider">
              SLA Health
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <div className="flex justify-between text-xs font-normal text-[#181829]">
          <span>38%</span>
          <span className="text-[#8a87a6] text-[11px]">Privilege Verification</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#ece8ff] overflow-hidden">
          <div className="w-[38%] h-full bg-[#6339f4] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
