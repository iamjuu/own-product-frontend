import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  List,
  Sliders,
  Sparkles
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { StatusBadge } from '../../../components/common/MetricCard';
import { Pagination } from '../../../components/common/Pagination';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const FeaturesList = () => {
  const [features, setFeatures] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchFeatures = async () => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get('/master-admin/features');
      if (response.success) {
        setFeatures(response.data);
      }
    } catch (err) {
      console.error('Failed to load feature flags:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleToggleFeature = async (feature) => {
    setUpdatingKey(feature.key);
    const newStatus = !feature.isEnabled;

    try {
      const response = await ApiClient.patch(`/master-admin/features/${feature.key}`, {
        isEnabled: newStatus,
      });

      if (response.success) {
        setFeatures((prev) =>
          prev.map((f) => (f.key === feature.key ? { ...f, isEnabled: newStatus } : f))
        );
        setNotification({
          type: 'success',
          title: 'Feature flag updated successfully',
          description: `Feature flag '${feature.name}' (${feature.key}) has been set to ${newStatus ? 'ENABLED (ON)' : 'DISABLED (OFF)'}. Changes are active immediately.`,
        });
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        title: 'Failed to update feature flag',
        description: err.message || 'An unexpected error occurred while toggling the flag.',
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setUpdatingKey(null);
    }
  };

  const pageSize = 7;
  const totalPages = Math.ceil(features.length / pageSize) || 1;
  const paginatedFeatures = features.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Section */}
      <div className="theme-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
              Global Platform Feature Flags
            </h2>
            <p className="text-xs text-[#8a87a6] mt-0.5">
              Enable or disable platform-wide features dynamically with shadcn switches. Changes are enforced on both API and client layers.
            </p>
          </div>

          <button
            onClick={fetchFeatures}
            className="px-4 py-2 rounded-2xl bg-[#f0f2fb] hover:bg-[#ece8ff] text-xs font-medium text-[#6339f4] flex items-center space-x-2 transition-all self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Flags</span>
          </button>
        </div>

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

      {/* 2. Sub-Section with Telemetry & Grid/List View Toggles */}
      <div className="theme-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#ece8ff] text-[#6339f4] font-medium">
            <Sliders className="w-4 h-4" />
            <span>Total Flags: <strong className="font-semibold text-[#181829]">{features.length}</strong></span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active: {features.filter((f) => f.isEnabled).length}</span>
          </div>
        </div>

        {/* Right side Grid and List View Toggle Icons */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#8a87a6] mr-1">View:</span>
          <div className="flex items-center bg-[#f0f2fb] p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                viewMode === 'grid'
                  ? 'bg-[#6339f4] text-white shadow-md shadow-[#6339f4]/30'
                  : 'text-[#8a87a6] hover:text-[#181829]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List / Table View"
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                viewMode === 'list'
                  ? 'bg-[#6339f4] text-white shadow-md shadow-[#6339f4]/30'
                  : 'text-[#8a87a6] hover:text-[#181829]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Feature Flags Content (Grid or Table) */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#8a87a6]">Loading feature flags...</div>
      ) : features.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#8a87a6]">No feature flags registered.</div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {paginatedFeatures.map((feature) => {
            const isUpdating = updatingKey === feature.key;

            return (
              <div
                key={feature._id}
                className="theme-card p-5 space-y-4 flex flex-col justify-between hover:border-purple-200 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-[#181829]">{feature.name}</h3>
                      <span className="font-mono text-[10px] text-[#6339f4] font-medium uppercase tracking-wider">
                        {feature.key}
                      </span>
                    </div>

                    <StatusBadge status={feature.isEnabled ? 'ON' : 'OFF'} />
                  </div>

                  <p className="text-xs text-[#8a87a6] leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-[#8a87a6] font-mono font-medium uppercase">
                    Category: {feature.category}
                  </span>

                  {/* shadcn Switch & Label */}
                  <div className="flex items-center space-x-2.5">
                    <Switch
                      id={`switch-grid-${feature.key}`}
                      checked={feature.isEnabled}
                      onCheckedChange={() => handleToggleFeature(feature)}
                      disabled={isUpdating}
                    />
                    <Label
                      htmlFor={`switch-grid-${feature.key}`}
                      className={`cursor-pointer select-none text-xs font-normal ${
                        feature.isEnabled ? 'text-[#6339f4]' : 'text-[#8a87a6]'
                      }`}
                    >
                      {feature.isEnabled ? 'Active' : 'Disabled'}
                    </Label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="theme-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[12px] font-normal text-[#8a87a6] bg-[#f0f2fb]/50">
                  <th className="p-4">Feature Name & Key</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Switch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#181829]">
                {paginatedFeatures.map((feature) => {
                  const isUpdating = updatingKey === feature.key;

                  return (
                    <tr key={feature._id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="p-4">
                        <div className="text-xs font-semibold text-[#181829]">{feature.name}</div>
                        <div className="text-[10px] text-[#6339f4] font-mono">{feature.key}</div>
                      </td>
                      <td className="p-4 max-w-xs text-xs text-[#8a87a6] font-normal">
                        {feature.description}
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-mono text-[#8a87a6] uppercase">
                          {feature.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={feature.isEnabled ? 'ON' : 'OFF'} />
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center space-x-2.5">
                          <Switch
                            id={`switch-table-${feature.key}`}
                            checked={feature.isEnabled}
                            onCheckedChange={() => handleToggleFeature(feature)}
                            disabled={isUpdating}
                          />
                          <Label
                            htmlFor={`switch-table-${feature.key}`}
                            className={`cursor-pointer select-none text-xs font-normal ${
                              feature.isEnabled ? 'text-[#6339f4]' : 'text-[#8a87a6]'
                            }`}
                          >
                            {feature.isEnabled ? 'ON' : 'OFF'}
                          </Label>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination (7 items per page) */}
      {!isLoading && features.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={features.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemName="feature flags"
        />
      )}

      {/* Info Notice */}
      <div className="theme-card p-4 flex items-center space-x-3 text-xs text-[#8a87a6]">
        <ShieldCheck className="w-5 h-5 text-[#6339f4] shrink-0" />
        <span className="font-normal">
          When a feature flag is disabled, backend APIs reject unsupported operations and frontend views gracefully adapt in real-time.
        </span>
      </div>
    </div>
  );
};
