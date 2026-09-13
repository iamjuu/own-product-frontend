import React from 'react';

export const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'purple', badge, actionIcon }) => {
  const colorMap = {
    purple: {
      border: 'border-purple-100/80',
      iconBg: 'bg-[#ece8ff] text-[#6339f4]',
      badge: 'text-[#6339f4] bg-[#ece8ff]',
    },
    indigo: {
      border: 'border-indigo-100/80',
      iconBg: 'bg-indigo-50 text-indigo-600',
      badge: 'text-indigo-600 bg-indigo-50',
    },
    emerald: {
      border: 'border-emerald-100/80',
      iconBg: 'bg-emerald-50 text-emerald-600',
      badge: 'text-emerald-600 bg-emerald-50',
    },
    amber: {
      border: 'border-amber-100/80',
      iconBg: 'bg-amber-50 text-amber-600',
      badge: 'text-amber-600 bg-amber-50',
    },
    blue: {
      border: 'border-blue-100/80',
      iconBg: 'bg-blue-50 text-blue-600',
      badge: 'text-blue-600 bg-blue-50',
    },
    rose: {
      border: 'border-rose-100/80',
      iconBg: 'bg-rose-50 text-rose-600',
      badge: 'text-rose-600 bg-rose-50',
    },
  };

  const scheme = colorMap[color] || colorMap.purple;

  return (
    <div className="theme-card theme-card-hover p-5 relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          {Icon && (
            <div className={`p-2.5 rounded-2xl ${scheme.iconBg} flex items-center justify-center font-bold`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          {badge && (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${scheme.badge}`}>
              {badge}
            </span>
          )}
        </div>

        <p className="text-[14px] font-normal text-[#8a87a6] tracking-tight">
          {title}
        </p>
        <div className="text-[10px] font-normal text-[#181829] tracking-tight mt-1">
          {value}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#8a87a6]">
        <span>{subtitle}</span>
        {trend && (
          <span className={`font-bold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const getBadgeStyle = (st) => {
    switch (st) {
      // Pending
      case 'PLACED':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'CONFIRMED':
        return 'bg-[#ece8ff] text-[#6339f4] border-[#d8cfff]';
      case 'PREPARING':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'READY_FOR_PICKUP':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse';

      // In Progress
      case 'DELIVERY_PARTNER_ASSIGNED':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'PICKED_UP':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'OUT_FOR_DELIVERY':
        return 'bg-[#ece8ff] text-[#6339f4] border-[#d8cfff] animate-pulse';

      // Completed / Terminal
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'REJECTED':
      case 'FAILED':
        return 'bg-red-50 text-red-600 border-red-200';

      // General
      case 'ACTIVE':
      case 'VERIFIED':
      case 'ON':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'PENDING_VERIFICATION':
      case 'TEMPORARILY_CLOSED':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'INACTIVE':
      case 'SUSPENDED':
      case 'OFF':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wide uppercase ${getBadgeStyle(
        status
      )}`}
    >
      {String(status || '').replace(/_/g, ' ')}
    </span>
  );
};
