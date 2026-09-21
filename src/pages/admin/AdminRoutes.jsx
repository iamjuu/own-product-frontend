import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminDashboard } from './dashboard/Dashboard';
import { AdminShopsList } from './shops/AdminShopsList';
import { CategoriesList } from './categories/CategoriesList';
import { BrandsList } from './brands/BrandsList';
import { UnitsList } from './units/UnitsList';
import { AdminProductsList } from './products/AdminProductsList';

// Shared Master Admin views reused by Operations Admin
import { OrdersList } from '../master_admin/orders/OrdersList';
import { DeliveryPartnersList } from '../master_admin/delivery_partners/DeliveryPartnersList';
import { CustomersList } from '../master_admin/customers/CustomersList';
import { ActivityLogsList } from '../master_admin/activity_logs/ActivityLogsList';
import { NotificationsList } from '../master_admin/notifications/NotificationsList';
import { AppearanceSettings } from '../master_admin/appearance/AppearanceSettings';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

// Preview layouts
import { UserLayout } from '../../components/layout/UserLayout';
import { DeliveryBoyLayout } from '../../components/layout/DeliveryBoyLayout';
import { DeliveryBoyDashboard } from '../delivery_boy/dashboard/Dashboard';

export const AdminRoutes = ({
  currentRoute = 'admin/dashboard',
  onNavigate,
  onRefresh,
  refreshKey = 0,
  renderUserContent,
}) => {
  // Normalize route to get subRoute (e.g., 'admin/units' -> 'units', 'admin' -> 'dashboard')
  const normalizeSubRoute = (route) => {
    if (!route || route === 'admin' || route === 'dashboard') return 'dashboard';
    if (route.startsWith('admin/')) {
      const sub = route.replace(/^admin\//, '').trim();
      return sub || 'dashboard';
    }
    return route;
  };

  const subRoute = normalizeSubRoute(currentRoute);

  // Centralized navigation handler ensuring admin routes have '/admin/<subRoute>' URL path
  const handleAdminNavigate = (target) => {
    if (!onNavigate) return;
    if (target.startsWith('admin/')) {
      onNavigate(target);
    } else if (target === 'admin' || target === 'dashboard') {
      onNavigate('admin/dashboard');
    } else {
      onNavigate(`admin/${target}`);
    }
  };

  // Render view corresponding to subRoute
  const renderContent = () => {
    switch (subRoute) {
      case 'dashboard':
        return <AdminDashboard key={refreshKey} onNavigate={handleAdminNavigate} />;
      case 'shops':
        return <AdminShopsList key={refreshKey} />;
      case 'categories':
        return <CategoriesList key={refreshKey} defaultTab="categories" />;
      case 'subcategories':
      case 'categories-sub':
        return <CategoriesList key={refreshKey} defaultTab="subcategories" />;
      case 'brands':
        return <BrandsList key={refreshKey} />;
      case 'units':
        return <UnitsList key={refreshKey} />;
      case 'products':
        return <AdminProductsList key={refreshKey} />;
      case 'orders':
      case 'orders-pending':
        return <OrdersList key={refreshKey} defaultTab="pending" />;
      case 'orders-in-progress':
        return <OrdersList key={refreshKey} defaultTab="in-progress" />;
      case 'orders-completed':
        return <OrdersList key={refreshKey} defaultTab="completed" />;
      case 'delivery':
      case 'delivery-pending':
        return <DeliveryPartnersList key={refreshKey} defaultTab="pending" />;
      case 'delivery-verified':
        return <DeliveryPartnersList key={refreshKey} defaultTab="verified" />;
      case 'customers':
        return <CustomersList key={refreshKey} />;
      case 'activity-logs':
        return <ActivityLogsList key={refreshKey} />;
      case 'notifications':
        return <NotificationsList key={refreshKey} />;
      case 'appearance':
        return <AppearanceSettings key={refreshKey} />;
      case 'preview-user':
        return (
          <div className="py-2">
            <UserLayout currentRoute="home" onRouteChange={onNavigate}>
              {renderUserContent ? renderUserContent() : null}
            </UserLayout>
          </div>
        );
      case 'preview-delivery':
        return (
          <div className="py-2">
            <DeliveryBoyLayout>
              <DeliveryBoyDashboard />
            </DeliveryBoyLayout>
          </div>
        );
      default:
        return <AdminDashboard key={refreshKey} onNavigate={handleAdminNavigate} />;
    }
  };

  return (
    <AdminLayout
      currentRoute={subRoute}
      onRouteChange={handleAdminNavigate}
      onRefresh={onRefresh}
    >
      <ErrorBoundary key={`${subRoute}-${refreshKey}`}>
        {renderContent()}
      </ErrorBoundary>
    </AdminLayout>
  );
};
