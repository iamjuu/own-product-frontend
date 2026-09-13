import React from 'react';

export const GrowthTrajectoryChart = ({ trends = [], finance = {}, range = '30d', setRange }) => {
  return (
    <div className="lg:col-span-8 theme-card p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-normal text-[#181829]">Platform Growth & Orders</h3>
          <p className="text-[11px] font-normal text-[#8a87a6]">Overall Marketplace Information</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-[#f0f2fb] p-1 rounded-2xl">
            <button
              onClick={() => setRange('7d')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
                range === '7d' ? 'bg-white text-[#6339f4] shadow-sm' : 'text-[#8a87a6]'
              }`}
            >
              Days
            </button>
            <button
              onClick={() => setRange('30d')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
                range === '30d' ? 'bg-[#6339f4] text-white shadow-sm' : 'text-[#8a87a6]'
              }`}
            >
              Months
            </button>
            <button
              onClick={() => setRange('90d')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
                range === '90d' ? 'bg-white text-[#6339f4] shadow-sm' : 'text-[#8a87a6]'
              }`}
            >
              Years
            </button>
          </div>
        </div>
      </div>

      {/* Floating Purple Tooltip Banner */}
      <div className="flex justify-center my-2">
        <div className="bg-[#6030ea] text-white px-5 py-2 rounded-2xl text-center shadow-xl shadow-[#6030ea]/20">
          <div className="text-[10px] text-white/80 font-normal">Platform GMV Active Run</div>
          <div className="text-[14px] font-normal tracking-tight">
            ₹{(finance.gmv ?? 123001).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Vertical Two-Tone Bar Chart */}
      <div className="h-56 flex items-end justify-between space-x-2 pt-6 pb-2 px-2">
        {trends.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#8a87a6]">
            Loading telemetry chart...
          </div>
        ) : (
          trends.map((item, idx) => {
            const maxOrders = Math.max(...trends.map((t) => t.orders), 1);
            const heightPercent = Math.max((item.orders / maxOrders) * 100, 20);
            const isAlternate = idx % 2 === 0;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative">
                <div className="absolute -top-10 bg-[#181829] text-white text-[11px] py-1 px-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg font-normal">
                  {item.date}: {item.orders} orders
                </div>

                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[14px] rounded-full transition-all duration-300 group-hover:scale-110 ${
                    isAlternate ? 'bg-[#6339f4]' : 'bg-[#b4a5f8]'
                  }`}
                ></div>
                <span className="text-[11px] text-[#8a87a6] mt-3 font-normal truncate">
                  {item.date?.slice(5)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
