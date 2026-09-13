import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
  Truck,
  Zap,
  Info
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { usePlatform } from '../../../context/PlatformContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const MarketplaceSettings = () => {
  const { settings, setSettings } = usePlatform();
  const [formData, setFormData] = useState({ ...settings });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      const response = await ApiClient.patch('/master-admin/settings', formData);
      if (response.success) {
        setSettings(response.data);
        setNotification({
          type: 'success',
          title: 'Marketplace settings saved successfully',
          description: 'Operating windows, surge multipliers, and delivery pricing rules updated.',
        });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        title: 'Failed to update marketplace settings',
        description: err.message || 'An error occurred while saving marketplace settings.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="theme-card p-6 space-y-3">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-2xl bg-[#ece8ff] text-[#6339f4]">
            <Sliders className="w-5 h-5" />
          </span>
          <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
            Global Marketplace Hours & Pricing Rules
          </h2>
        </div>
        <p className="text-xs text-[#8a87a6]">
          Configure platform-level marketplace operating windows, timezone standards, delivery pricing formulas, and commission rates.
        </p>

        {/* shadcn Alert Component */}
        {notification && (
          <Alert
            variant={notification.type === 'success' ? 'success' : 'destructive'}
            className="transition-all animate-in fade-in slide-in-from-top-2"
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <AlertTitle>{notification.title}</AlertTitle>
            <AlertDescription>{notification.description}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Rules Notice Callout */}
      <div className="theme-card p-4 bg-[#ece8ff]/50 border border-[#d8cfff] flex items-start space-x-3 text-xs text-[#181829]">
        <Info className="w-5 h-5 text-[#6339f4] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#6339f4]">
            Marketplace Hours vs Individual Shop Hours Architecture:
          </span>
          <p className="text-[#8a87a6] leading-relaxed">
            Marketplace closing time does <strong>NOT</strong> shut down servers. Outside marketplace hours, customers can browse menus, background jobs process ledgers, and existing orders fulfill. However, new checkout orders and delivery assignments are halted until opening window.
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="theme-card p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#6339f4] flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Platform Operating Hours</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181829]">Opening Time</label>
                <input
                  type="text"
                  name="openingTime"
                  value={formData.openingTime || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
                  placeholder="07:00 AM"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181829]">Closing Time</label>
                <input
                  type="text"
                  name="closingTime"
                  value={formData.closingTime || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
                  placeholder="10:00 PM"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181829]">Marketplace Timezone</label>
                <input
                  type="text"
                  name="timezone"
                  value={formData.timezone || 'Asia/Kolkata'}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-mono font-bold"
                  placeholder="Asia/Kolkata"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#6339f4] flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span>Delivery Pricing Rules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181829]">Base Delivery Fee (₹)</label>
                <input
                  type="number"
                  name="baseDeliveryFee"
                  min="0"
                  value={formData.baseDeliveryFee ?? 30}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-bold focus:outline-none focus:border-[#6339f4]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181829]">Free Delivery Threshold (₹)</label>
                <input
                  type="number"
                  name="freeDeliveryThreshold"
                  min="0"
                  value={formData.freeDeliveryThreshold ?? 499}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-bold focus:outline-none focus:border-[#6339f4]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181829]">Max Delivery Radius (Km)</label>
                <input
                  type="number"
                  name="maxDeliveryRadiusKm"
                  min="1"
                  value={formData.maxDeliveryRadiusKm ?? 15}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-bold focus:outline-none focus:border-[#6339f4]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#6339f4] flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Platform Take Rates & Surge</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181829]">Platform Commission Take Rate (%)</label>
                <input
                  type="number"
                  name="platformCommissionPercent"
                  min="0"
                  max="100"
                  value={formData.platformCommissionPercent ?? 10}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181829]">Surge Pricing Multiplier</label>
                <input
                  type="number"
                  name="surgeMultiplier"
                  step="0.1"
                  min="1"
                  value={formData.surgeMultiplier ?? 1.2}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-white font-black text-xs shadow-lg shadow-[#6339f4]/30 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Enforce Marketplace Settings'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
