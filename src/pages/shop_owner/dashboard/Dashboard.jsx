import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Utensils,
  Clock,
  ShoppingBag,
  IndianRupee,
  CheckCircle2,
  ChefHat,
  Truck,
  AlertCircle,
  RefreshCw,
  Eye,
  MapPin,
  Phone,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { get } from '../../../api/client';
import { ShopKpiCards } from './components/ShopKpiCards';

export const ShopOwnerDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get('/shop-owner/dashboard');
      if (response?.success) {
        setData(response.data);
        if (response.data?.shop?.isOpen !== undefined) {
          setIsStoreOpen(response.data.shop.isOpen);
        }
      }
    } catch (err) {
      console.warn('Dashboard fetch note:', err.message);
      // Graceful fallback for newly registered shop owners
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const shop = data?.shop;

  return (
    <div className="space-y-6 pb-12">
      {/* Store Header Banner */}
      <div className="theme-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] shrink-0 overflow-hidden ring-4 ring-[#ece8ff]/50">
            {shop?.logoUrl ? (
              <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
            ) : (
              <Store className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-[#181829] tracking-tight">
                {shop?.name || `${user?.name || 'Restaurant'} Storefront`}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isStoreOpen
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border border-rose-200'
                }`}
              >
                {isStoreOpen ? 'Accepting Orders' : 'Store Paused'}
              </span>
            </div>
            <p className="text-xs text-[#8a87a6] mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{shop?.category || 'Multi-Cuisine Restaurant'}</span>
              {shop?.address?.city && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#8a87a6]" />
                    {shop.address.city}
                  </span>
                </>
              )}
              <span>•</span>
              <span className="text-[#6339f4] font-medium">{user?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={() => setIsStoreOpen(!isStoreOpen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              isStoreOpen
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isStoreOpen ? 'Pause Store' : 'Resume Store'}
          </button>

          <button
            onClick={fetchDashboard}
            className="p-2.5 rounded-xl bg-[#f0f2fb] hover:bg-slate-200 text-slate-700 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <ShopKpiCards
        activeOrders={data?.activeOrders}
        preparingOrders={data?.preparingOrders}
        totalRevenue={data?.totalRevenue}
      />

      {/* Main Grid: Kitchen Display / Incoming Orders & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Kitchen & Order Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="theme-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <ChefHat className="w-5 h-5 text-[#6339f4]" />
                <h2 className="text-sm font-bold text-[#181829]">Live Kitchen Display (KDS)</h2>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#6339f4] font-bold">
                {data?.activeOrders || 0} In Progress
              </span>
            </div>

            <div className="p-8 text-center rounded-2xl bg-[#f8f9fe] border border-dashed border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#6339f4] mx-auto">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-[#181829]">Kitchen Terminal Ready</h3>
              <p className="text-xs text-[#8a87a6] max-w-sm mx-auto">
                Customer orders placed for your restaurant will appear here automatically with kitchen tickets, item modifiers, and delivery rider assignments.
              </p>
            </div>
          </div>
        </div>

        {/* Store Highlights & Quick Actions */}
        <div className="space-y-4">
          <div className="theme-card p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#181829] flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#6339f4]" />
              <span>Quick Merchant Actions</span>
            </h2>

            <div className="space-y-2">
              <div
                onClick={() => onNavigate && onNavigate('menu')}
                className="p-3.5 rounded-2xl bg-[#f0f2fb] hover:bg-[#ece8ff] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-[#6339f4] flex items-center justify-center text-[#6339f4] group-hover:text-white transition-all shadow-sm">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#181829] group-hover:text-[#6339f4] transition-colors">Add New Dish / Item</h4>
                    <p className="text-[10px] text-[#8a87a6]">Update pricing, photos, and veg/non-veg</p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f0f2fb] hover:bg-[#ece8ff] transition-all cursor-pointer flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#6339f4] shadow-sm">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#181829]">Operating Hours</h4>
                    <p className="text-[10px] text-[#8a87a6]">
                      {shop?.openingTime || '09:00 AM'} - {shop?.closingTime || '11:00 PM'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f0f2fb] hover:bg-[#ece8ff] transition-all cursor-pointer flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#6339f4] shadow-sm">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#181829]">Delivery Radius</h4>
                    <p className="text-[10px] text-[#8a87a6]">{shop?.deliveryRadiusKm || 10} km radius</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
