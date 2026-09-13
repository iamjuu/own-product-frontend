import React from 'react';
import { Calendar } from 'lucide-react';

export const DateRangePicker = ({ selectedRange, onRangeChange }) => {
  const ranges = [
    { label: 'Today', value: 'today' },
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
  ];

  return (
    <div className="flex items-center space-x-1 p-1 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
      <div className="flex items-center space-x-1.5 px-3 text-[#8a87a6] text-xs">
        <Calendar className="w-3.5 h-3.5 text-[#6339f4]" />
        <span className="hidden sm:inline font-semibold">Period:</span>
      </div>
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => onRangeChange(r.value)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedRange === r.value
              ? 'bg-[#6339f4] text-white shadow-md shadow-[#6339f4]/25'
              : 'text-[#8a87a6] hover:text-[#181829] hover:bg-slate-50'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
};
