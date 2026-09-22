import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlatformProvider } from './context/PlatformContext';
import { CartProvider } from './context/CartContext';
import { Login } from './pages/auth/Login';

// User / Customer Components
import { UserLayout } from './components/layout/UserLayout';
import { UserDashboard } from './pages/user/dashboard/Dashboard';
import { AboutPage } from './pages/user/about/AboutPage';
import { ShopCatalogPage } from './pages/user/shop/ShopCatalogPage';
import { NewsPage } from './pages/user/news/NewsPage';
import { ContactPage } from './pages/user/contact/ContactPage';
import { UserProfilePage } from './pages/user/profile/UserProfilePage';
import { ProductDetailPage } from './pages/user/product/ProductDetailPage';

// Delivery Boy / Partner Components
import { DeliveryBoyLayout } from './components/layout/DeliveryBoyLayout';
import { DeliveryBoyDashboard } from './pages/delivery_boy/dashboard/Dashboard';

// Shop / Restaurant Owner Components
import { ShopOwnerLayout } from './components/layout/ShopOwnerLayout';
import { ShopOwnerDashboard } from './pages/shop_owner/dashboard/Dashboard';
import { ShopOwnerOrders } from './pages/shop_owner/orders/ShopOwnerOrders';
import { ShopOwnerMenu } from './pages/shop_owner/menu/ShopOwnerMenu';

// Operations Admin Components
import { AdminRoutes } from './pages/admin';

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

import { ShieldAlert } from 'lucide-react';

const AdminRouter = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  // URL pathname sync: supports /admin/*, /login, /about, /shop, /news, /contact, /profile, /orders, /product/:id, /
  const getRouteFromUrl = () => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.replace(/^\/+/, '');

    // 1. Check if path is a dedicated admin route (e.g. /admin, /admin/units, /admin/categories, etc.)
    if (path === 'admin' || path.startsWith('admin/')) {
      return path;
    }

    const validRoutes = ['login', 'about', 'shop', 'news', 'contact', 'profile', 'orders', 'home', 'dashboard'];
    if (validRoutes.includes(path.toLowerCase())) return path.toLowerCase();
    if (path.toLowerCase().startsWith('product/')) return path;
    if (path.toLowerCase() === 'product') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) return `product/${id}`;
      return 'product/prod-chk-2';
    }
    if (window.location.hash) {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash === 'admin' || hash.startsWith('admin/')) return hash;
      if (validRoutes.includes(hash.toLowerCase())) return hash.toLowerCase();
      if (hash.toLowerCase().startsWith('product/')) return hash;
    }
    return 'home';
  };

  const [currentRoute, setCurrentRoute] = useState(getRouteFromUrl);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getRouteFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route, params) => {
    let targetRoute = route;
    if (params?.id) {
      targetRoute = `product/${params.id}`;
    }
    
    // Normalize targetRoute if admin navigates to dashboard
    if (targetRoute === 'admin') {
      targetRoute = 'admin/dashboard';
    }

    setCurrentRoute(targetRoute);
    if (typeof window !== 'undefined') {
      if (targetRoute === 'login') {
        window.history.pushState(null, '', '/login');
      } else if (targetRoute === 'home') {
        window.history.pushState(null, '', '/');
      } else if (targetRoute === 'dashboard') {
        if (user?.role === 'ADMIN' || user?.isUser === 'admin') {
          targetRoute = 'admin/dashboard';
          setCurrentRoute('admin/dashboard');
          window.history.pushState(null, '', '/admin/dashboard');
        } else {
          window.history.pushState(null, '', '/');
        }
      } else {
        window.history.pushState(null, '', `/${targetRoute}`);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Determine user side by isUser attribute (with fallback to role)
  const isUserType = user?.isUser || (
    user?.role === 'CUSTOMER' ? 'user' :
    user?.role === 'DELIVERY_PARTNER' ? 'delivery_boy' :
    user?.role === 'ADMIN' ? 'admin' :
    user?.role === 'MASTER_ADMIN' ? 'master' :
    user?.role === 'SHOP_OWNER' ? 'shop_owner' : 'user'
  );

  // Auto-redirect authenticated users away from /login to their appropriate role portal
  useEffect(() => {
    if (isAuthenticated) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname.replace(/^\/+/, '') : '';
      if (currentRoute === 'login' || currentPath === 'login') {
        if (isUserType === 'admin' || user?.role === 'ADMIN') {
          navigateTo('admin/dashboard');
        } else if (isUserType === 'shop_owner' || user?.role === 'SHOP_OWNER') {
          navigateTo('dashboard');
        } else if (isUserType === 'master' || user?.role === 'MASTER_ADMIN') {
          navigateTo('dashboard');
        } else if (isUserType === 'delivery_boy' || user?.role === 'DELIVERY_PARTNER') {
          navigateTo('dashboard');
        } else {
          navigateTo('home');
        }
      }
    }
  }, [isAuthenticated, user?.role, isUserType, currentRoute]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center text-slate-500 text-xs">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#FF7622] border-t-transparent animate-spin"></div>
          <p className="font-semibold text-slate-700">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  // Renders customer pages based on route
  const renderUserContent = () => {
    if (currentRoute.startsWith('product/')) {
      const productId = currentRoute.substring('product/'.length);
      return <ProductDetailPage productId={productId} onNavigate={navigateTo} />;
    }
    if (currentRoute === 'product') {
      return <ProductDetailPage productId="prod-chk-2" onNavigate={navigateTo} />;
    }

    switch (currentRoute) {
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'shop':
        return <ShopCatalogPage onNavigate={navigateTo} />;
      case 'news':
        return <NewsPage onNavigate={navigateTo} />;
      case 'contact':
        return <ContactPage onNavigate={navigateTo} />;
      case 'profile':
      case 'orders':
        return <UserProfilePage onNavigate={navigateTo} />;
      case 'home':
      case 'dashboard':
      default:
        return <UserDashboard key={refreshKey} onNavigate={navigateTo} />;
    }
  };

  // 1. If NOT authenticated:
  // - If user accessed '/login', show Login screen
  // - If user accessed '/admin' or '/admin/*', require login
  // - Otherwise, show storefront pages wrapped in UserLayout!
  if (!isAuthenticated) {
    if (currentRoute === 'login' || currentRoute === 'admin' || currentRoute.startsWith('admin/') || currentRoute === 'profile' || currentRoute === 'orders') {
      return <Login onBackToHome={() => navigateTo('home')} />;
    }

    return (
      <UserLayout
        currentRoute={currentRoute}
        onRouteChange={navigateTo}
        onRefresh={handleRefresh}
      >
        {renderUserContent()}
      </UserLayout>
    );
  }

  // 2. USER / CUSTOMER SIDE
  if (isUserType === 'user' || user?.role === 'CUSTOMER') {
    return (
      <UserLayout
        currentRoute={currentRoute}
        onRouteChange={navigateTo}
        onRefresh={handleRefresh}
      >
        {renderUserContent()}
      </UserLayout>
    );
  }

  // 3. DELIVERY BOY / PARTNER SIDE
  if (isUserType === 'delivery_boy' || user?.role === 'DELIVERY_PARTNER') {
    return (
      <DeliveryBoyLayout
        currentRoute={currentRoute}
        onRouteChange={navigateTo}
        onRefresh={handleRefresh}
      >
        <DeliveryBoyDashboard key={refreshKey} onNavigate={navigateTo} />
      </DeliveryBoyLayout>
    );
  }

  // 4. RESTAURANT / SHOP OWNER SIDE
  if (isUserType === 'shop_owner' || user?.role === 'SHOP_OWNER') {
    const renderShopOwnerContent = () => {
      switch (currentRoute) {
        case 'dashboard':
          return <ShopOwnerDashboard key={refreshKey} onNavigate={setCurrentRoute} />;
        case 'orders':
          return <ShopOwnerOrders key={refreshKey} onNavigate={setCurrentRoute} />;
        case 'menu':
          return <ShopOwnerMenu key={refreshKey} onNavigate={setCurrentRoute} />;
        default:
          return <ShopOwnerDashboard key={refreshKey} onNavigate={setCurrentRoute} />;
      }
    };

    return (
      <ShopOwnerLayout
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        onRefresh={handleRefresh}
      >
        {renderShopOwnerContent()}
      </ShopOwnerLayout>
    );
  }

  // 5. OPERATIONS ADMIN SIDE (Dedicated paths under /admin/...)
  if (isUserType === 'admin' || user?.role === 'ADMIN') {
    return (
      <AdminRoutes
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onRefresh={handleRefresh}
        refreshKey={refreshKey}
        renderUserContent={renderUserContent}
      />
    );
  }

  // 6. MASTER ADMIN SIDE
  if (isUserType === 'master' || user?.role === 'MASTER_ADMIN') {
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
        case 'preview-user':
          return (
            <div className="py-2">
              <UserLayout currentRoute="home" onRouteChange={navigateTo}>
                {renderUserContent()}
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

  // Fallback
  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF7622] mx-auto flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#181C2E]">Unknown User Role</h2>
        <p className="text-xs text-[#646982] leading-relaxed">
          Your authenticated role is <code className="text-[#FF7622] font-bold">{user?.role}</code>.
        </p>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-xs font-bold text-white transition-all shadow-md"
        >
          Sign In Again
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PlatformProvider>
        <CartProvider>
          <AdminRouter />
        </CartProvider>
      </PlatformProvider>
    </AuthProvider>
  );
}
