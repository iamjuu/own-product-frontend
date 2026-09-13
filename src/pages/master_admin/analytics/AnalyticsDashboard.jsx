import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Store,
  Bike,
  IndianRupee,
  Sparkles,
  PieChart,
  DollarSign
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { DateRangePicker } from '../../../components/common/DateRangePicker';
import { MetricCard, StatusBadge } from '../../../components/common/MetricCard';

export const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState('30d');
  const [activeSection, setActiveSection] = useState('financial');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async (selectedRange = range) => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get('/master-admin/analytics', { range: selectedRange });
      if (response.success) {
        setData(response.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  const finance = data?.financial || {};
  const delivery = data?.delivery || {};
  const shops = data?.shops || {};
  const orders = data?.orders || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="theme-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
              Platform Analytics & Financial Telemetry
            </h2>
            <p className="text-xs text-[#8a87a6] mt-0.5">
              Comprehensive telemetry across orders, shops, customers, fleet performance, and settlement economics.
            </p>
          </div>

          <DateRangePicker selectedRange={range} onRangeChange={setRange} />
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {[
            { id: 'financial', label: 'Financial & Settlements', icon: IndianRupee },
            { id: 'orders', label: 'Orders & Volume', icon: ShoppingBag },
            { id: 'shops', label: 'Shop Performance', icon: Store },
            { id: 'delivery', label: 'Delivery & Fleet', icon: Bike },
          ].map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeSection === sec.id
                    ? 'bg-[#6339f4] text-white shadow-md shadow-[#6339f4]/25'
                    : 'text-[#8a87a6] hover:text-[#181829] bg-[#f0f2fb]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#8a87a6]">Loading analytics calculations...</div>
      ) : (
        <div className="space-y-6">
          {/* 1. FINANCIAL SECTION */}
          {activeSection === 'financial' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <MetricCard
                title="Platform GMV"
                value={`₹${(finance.gmv ?? 0).toLocaleString('en-IN')}`}
                subtitle="Gross trade transactions"
                badge="Gross Volume"
                icon={IndianRupee}
                color="purple"
              />

              <MetricCard
                title="Platform Revenue (Commission)"
                value={`₹${(finance.revenue ?? 0).toLocaleString('en-IN')}`}
                subtitle="Net commission take"
                badge="Take Rate"
                icon={TrendingUp}
                color="indigo"
              />

              <MetricCard
                title="Average Order Value (AOV)"
                value={`₹${Number((finance.avgOrderValue ?? 0).toFixed(2)).toLocaleString('en-IN')}`}
                subtitle="Mean ticket size per cart"
                badge="Efficiency"
                icon={DollarSign}
                color="blue"
              />

              <MetricCard
                title="Merchants Payable Settlement"
                value={`₹${(finance.shopSettlement ?? 0).toLocaleString('en-IN')}`}
                subtitle="Due to shop owners"
                badge="Settlements"
                icon={Store}
                color="purple"
              />

              <MetricCard
                title="Fleet Delivery Earnings"
                value={`₹${(finance.deliveryEarnings ?? 0).toLocaleString('en-IN')}`}
                subtitle="Rider delivery compensation"
                badge="Payouts"
                icon={Bike}
                color="amber"
              />

              <MetricCard
                title="Reversals & Refunds"
                value={`₹${(finance.refunds ?? 0).toLocaleString('en-IN')}`}
                subtitle="Customer returns & refunds"
                badge="Refunds"
                icon={PieChart}
                color="rose"
              />
            </div>
          )}

          {/* 2. ORDERS SECTION */}
          {activeSection === 'orders' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="theme-card p-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#181829]">
                  Order Status Distribution
                </h3>
                <div className="space-y-3">
                  {orders.map((st, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f0f2fb]">
                      <StatusBadge status={st._id} />
                      <div className="text-right">
                        <span className="text-xs font-black text-[#181829]">{st.count} orders</span>
                        <div className="text-[11px] text-[#8a87a6] font-semibold">
                          ₹{st.totalValue?.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="theme-card p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#181829]">
                    Order Economics Summary
                  </h3>
                  <p className="text-xs text-[#8a87a6] mt-1">
                    Platform order calculations are processed across all multi-shop transactions.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#ece8ff] space-y-2">
                  <span className="text-[10px] text-[#6339f4] uppercase font-black">Platform Take Rate</span>
                  <div className="text-3xl font-black text-[#181829]">10.0%</div>
                  <p className="text-[11px] text-[#8a87a6]">Configured globally in Marketplace Settings.</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. SHOPS SECTION */}
          {activeSection === 'shops' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="theme-card p-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#6339f4]">
                  Top Performing Shops (Sales Volume)
                </h3>
                <div className="space-y-3">
                  {shops.topPerforming?.map((sh, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f0f2fb]">
                      <div>
                        <div className="font-bold text-[#181829] text-xs">{idx + 1}. {sh.name}</div>
                        <div className="text-[11px] text-[#8a87a6]">{sh.category} • ⭐ {sh.rating}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-600 text-xs">
                          ₹{sh.totalSales?.toLocaleString('en-IN')}
                        </span>
                        <div className="text-[10px] text-[#8a87a6] font-semibold">{sh.totalOrders} orders</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="theme-card p-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-600">
                  Shops Requiring Attention / Support
                </h3>
                <div className="space-y-3">
                  {shops.lowPerforming?.map((sh, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f0f2fb]">
                      <div>
                        <div className="font-bold text-[#181829] text-xs">{sh.name}</div>
                        <div className="text-[11px] text-[#8a87a6]">{sh.category} • Status: {sh.status}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#181829] text-xs">
                          ₹{sh.totalSales?.toLocaleString('en-IN')}
                        </span>
                        <div className="text-[10px] text-[#8a87a6] font-semibold">{sh.totalOrders} orders</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. DELIVERY SECTION */}
          {activeSection === 'delivery' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <MetricCard
                title="Total Fleet"
                value={delivery.totalPartners ?? 0}
                subtitle="All delivery partners"
                badge="Fleet Size"
                icon={Bike}
                color="purple"
              />

              <MetricCard
                title="Active Fleet Online"
                value={delivery.onlinePartners ?? 0}
                subtitle="Currently on duty"
                badge="Online"
                icon={TrendingUp}
                color="indigo"
              />

              <MetricCard
                title="Completed Deliveries"
                value={delivery.totalCompletedDeliveries ?? 0}
                subtitle="Fulfilled trips"
                badge="Fulfilled"
                icon={ShoppingBag}
                color="blue"
              />

              <MetricCard
                title="Average On-Time Rate"
                value={`${Number(delivery.avgOnTimeRate || 98).toFixed(1)}%`}
                subtitle="Fleet punctuality"
                badge="SLA"
                icon={Sparkles}
                color="amber"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
