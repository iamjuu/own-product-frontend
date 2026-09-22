import React, { useState, useEffect } from 'react';
import ApiClient from '../../../api/client';
import { KpiSummaryCards } from './components/KpiSummaryCards';
import { GrowthTrajectoryChart } from './components/GrowthTrajectoryChart';
import { QuickActionNavCards } from './components/QuickActionNavCards';
import { PlatformActorOverview } from './components/PlatformActorOverview';
import { RecentTransactionsTable } from './components/RecentTransactionsTable';
import { AuditComplianceRing } from './components/AuditComplianceRing';

export const Dashboard = ({ onNavigate }) => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async (selectedRange = range) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiClient.get('/master-admin/dashboard', { range: selectedRange });
      if (response.success) {
        setData(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(range);
  }, [range]);

  const overview = data?.marketplaceOverview || {};
  const finance = data?.financialOverview || {};
  const trends = data?.trends || [];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP QUICK KPI ROW */}
      <KpiSummaryCards overview={overview} finance={finance} />

      {/* 2. MAIN SECTION: TRAJECTORY CHART (Left) + QUICK ACTION NAV CARDS (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <GrowthTrajectoryChart
          trends={trends}
          finance={finance}
          range={range}
          setRange={setRange}
        />
        <QuickActionNavCards
          overview={overview}
          finance={finance}
          onNavigate={onNavigate}
        />
      </div>

      {/* 3. BOTTOM SECTION: ACTORS + TRANSACTIONS TABLE (Left) + AUDIT RING (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <PlatformActorOverview overview={overview} finance={finance} />
          <RecentTransactionsTable recentOrders={data?.recentOrders} />
        </div>
        <AuditComplianceRing />
      </div>
    </div>
  );
};
