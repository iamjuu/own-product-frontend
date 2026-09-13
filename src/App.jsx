import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlatformProvider } from './context/PlatformContext';
import { Login } from './pages/auth/Login';

// Master Admin Components
import { MasterAdminLayout } from './components/layout/MasterAdminLayout';
import { Dashboard as MasterDashboard } from './pages/master_admin/dashboard/Dashboard';
import { OrdersList } from './pages/master_admin/orders/OrdersList';
import { ShopsList } from './pages/master_admin/shops/ShopsList';
import { DeliveryPartnersList } from './pages/master_admin/delivery_partners/DeliveryPartnersList';
import { CustomersList } from './pages/master_admin/customers/CustomersList';
import { AnalyticsDashboard } from './pages/master_admin/analytics/AnalyticsDashboard';
import { ActivityLogsList } from './pages/master_admin/activity_logs/ActivityLogsList';
import { FeaturesList } from './pages/master_admin/features/FeaturesList';
import { AdminsList } from './pages/master_admin/admins/AdminsList';
import { NotificationsList } from './pages/master_admin/notifications/NotificationsList';
import { AppearanceSettings } from './pages/master_admin/appearance/AppearanceSettings';
import { MarketplaceSettings } from './pages/master_admin/settings/MarketplaceSettings';

// Operations Admin Components
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/dashboard/Dashboard';
import { ShieldAlert } from 'lucide-react';

const AdminRouter = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2fb] flex items-center justify-center text-slate-500 text-xs">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#6339f4] border-t-transparent animate-spin"></div>
          <p className="font-semibold text-slate-700">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // 1. MASTER ADMIN PORTAL
  if (user?.role === 'MASTER_ADMIN') {
    const renderMasterContent = () => {
      switch (currentRoute) {
        case 'dashboard':
          return <MasterDashboard key={refreshKey} onNavigate={setCurrentRoute} />;
        case 'orders':
        case 'orders-pending':
          return <OrdersList key={refreshKey} defaultTab="pending" />;
        case 'orders-in-progress':
          return <OrdersList key={refreshKey} defaultTab="in-progress" />;
        case 'orders-completed':
          return <OrdersList key={refreshKey} defaultTab="completed" />;
        case 'shops':
          return <ShopsList key={refreshKey} />;
        case 'delivery':
        case 'delivery-pending':
          return <DeliveryPartnersList key={refreshKey} defaultTab="pending" />;
        case 'delivery-verified':
          return <DeliveryPartnersList key={refreshKey} defaultTab="verified" />;
        case 'customers':
          return <CustomersList key={refreshKey} />;
        case 'analytics':
          return <AnalyticsDashboard key={refreshKey} />;
        case 'activity-logs':
          return <ActivityLogsList key={refreshKey} />;
        case 'features':
          return <FeaturesList key={refreshKey} />;
        case 'admins':
          return <AdminsList key={refreshKey} />;
        case 'notifications':
          return <NotificationsList key={refreshKey} />;
        case 'appearance':
          return <AppearanceSettings key={refreshKey} />;
        case 'settings':
          return <MarketplaceSettings key={refreshKey} />;
        default:
          return <MasterDashboard key={refreshKey} onNavigate={setCurrentRoute} />;
      }
    };

    return (
      <MasterAdminLayout
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        onRefresh={handleRefresh}
      >
        {renderMasterContent()}
      </MasterAdminLayout>
    );
  }

  // 2. OPERATIONS ADMIN PORTAL (Requested Tabs: Orders, Customers, Activity Logs, Notifications, Appearance)
  if (user?.role === 'ADMIN') {
    const renderAdminContent = () => {
      switch (currentRoute) {
        case 'dashboard':
          return <AdminDashboard key={refreshKey} onNavigate={setCurrentRoute} />;
        case 'orders':
        case 'orders-pending':
          return <OrdersList key={refreshKey} defaultTab="pending" />;
        case 'orders-in-progress':
          return <OrdersList key={refreshKey} defaultTab="in-progress" />;
        case 'orders-completed':
          return <OrdersList key={refreshKey} defaultTab="completed" />;
        case 'customers':
          return <CustomersList key={refreshKey} />;
        case 'activity-logs':
          return <ActivityLogsList key={refreshKey} />;
        case 'notifications':
          return <NotificationsList key={refreshKey} />;
        case 'appearance':
          return <AppearanceSettings key={refreshKey} />;
        default:
          return <AdminDashboard key={refreshKey} onNavigate={setCurrentRoute} />;
      }
    };

    return (
      <AdminLayout
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        onRefresh={handleRefresh}
      >
        {renderAdminContent()}
      </AdminLayout>
    );
  }

  // Unauthorized fallback for non-admin roles
  return (
    <div className="min-h-screen bg-[#f0f2fb] flex items-center justify-center p-4">
      <div className="theme-card p-8 rounded-3xl border border-rose-200 text-center max-w-md space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-200">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#181829]">Access Restricted</h2>
        <p className="text-xs text-[#8a87a6] leading-relaxed">
          Your authenticated role is <code className="text-[#6339f4] font-bold">{user?.role}</code>.
          This console is exclusively configured for Master Administrators and Operations Admins.
        </p>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md"
        >
          Sign In with Admin Account
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PlatformProvider>
        <AdminRouter />
      </PlatformProvider>
    </AuthProvider>
  );
}
