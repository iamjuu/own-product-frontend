import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Search,
  Megaphone,
  Radio,
  AlertTriangle,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  RefreshCw,
  Users,
  Store,
  Bike,
  Clock,
  Trash2,
  Smartphone,
  Mail,
  Flame
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../../components/common/MetricCard';
import { Modal, EmptyState } from '../../../components/common/Modal';
import { Pagination } from '../../../components/common/Pagination';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const NotificationsList = () => {
  const { user } = useAuth();
  const apiPrefix = user?.role === 'ADMIN' ? '/admin' : '/master-admin';
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 7 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Send Broadcast Form State
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetAudience: 'ALL',
    type: 'ANNOUNCEMENT',
    priority: 'MEDIUM',
    channels: ['IN_APP', 'PUSH'],
    totalRecipients: 5000,
  });

  const fetchNotifications = async (
    page = currentPage,
    query = search,
    audience = audienceFilter,
    type = typeFilter
  ) => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get(`${apiPrefix}/notifications`, {
        search: query,
        audience: audience,
        type: type,
        page: page,
        limit: 7,
      });
      if (response.success) {
        setNotifications(response.data.notifications);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchNotifications(1, search, audienceFilter, typeFilter);
  }, [audienceFilter, typeFilter]);

  useEffect(() => {
    fetchNotifications(currentPage, search, audienceFilter, typeFilter);
  }, [currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNotifications(1, search, audienceFilter, typeFilter);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await ApiClient.post(`${apiPrefix}/notifications`, formData);
      if (response.success) {
        setNotificationMsg({
          type: 'success',
          title: 'Broadcast dispatched successfully',
          description: `Broadcast '${formData.title}' dispatched to ${formData.targetAudience} audience over ${formData.channels.join(', ')} channels.`,
        });
        setIsSendModalOpen(false);
        setFormData({
          title: '',
          message: '',
          targetAudience: 'ALL',
          type: 'ANNOUNCEMENT',
          priority: 'MEDIUM',
          channels: ['IN_APP', 'PUSH'],
          totalRecipients: 5000,
        });
        fetchNotifications(1, search, audienceFilter, typeFilter);
      }
    } catch (err) {
      setNotificationMsg({
        type: 'error',
        title: 'Failed to dispatch broadcast',
        description: err.message || 'An unexpected error occurred while dispatching broadcast.',
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotificationMsg(null), 5000);
    }
  };

  const handleDeleteNotification = async (notif) => {
    if (!window.confirm(`Delete broadcast log '${notif.title}'?`)) return;
    try {
      const response = await ApiClient.delete(`/master-admin/notifications/${notif._id}`);
      if (response.success) {
        setNotificationMsg({
          type: 'success',
          title: 'Notification removed',
          description: 'Notification log removed from platform history.',
        });
        fetchNotifications(currentPage, search, audienceFilter, typeFilter);
        setTimeout(() => setNotificationMsg(null), 4000);
      }
    } catch (err) {
      setNotificationMsg({
        type: 'error',
        title: 'Failed to delete notification',
        description: err.message || 'Unable to remove notification log.',
      });
      setTimeout(() => setNotificationMsg(null), 4000);
    }
  };

  const toggleChannel = (channel) => {
    setFormData((prev) => {
      const exists = prev.channels.includes(channel);
      if (exists && prev.channels.length > 1) {
        return { ...prev, channels: prev.channels.filter((c) => c !== channel) };
      }
      if (!exists) {
        return { ...prev, channels: [...prev.channels, channel] };
      }
      return prev;
    });
  };

  const getAudienceIcon = (aud) => {
    switch (aud) {
      case 'SHOPS':
        return <Store className="w-3.5 h-3.5 text-indigo-600" />;
      case 'DELIVERY_PARTNERS':
        return <Bike className="w-3.5 h-3.5 text-emerald-600" />;
      case 'CUSTOMERS':
        return <Users className="w-3.5 h-3.5 text-blue-600" />;
      case 'ADMINS':
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-[#6339f4]" />;
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'ALERT':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PROMOTION':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'POLICY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SYSTEM':
        return 'bg-purple-50 text-[#6339f4] border-purple-200';
      default:
        return 'bg-[#ece8ff] text-[#6339f4] border-[#d8cfff]';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Section */}
      <div className="theme-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
              Platform Notifications & Broadcast Center
            </h2>
            <p className="text-xs text-[#8a87a6] mt-0.5">
              Broadcast platform-wide updates, emergency alerts, promotional cashback announcements, or targeted policy advisories.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSendModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-medium text-white flex items-center space-x-2 shadow-md shadow-[#6339f4]/25 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send New Broadcast</span>
            </button>
          </div>
        </div>

        {/* shadcn Alert Component */}
        {notificationMsg && (
          <Alert
            variant={notificationMsg.type === 'success' ? 'success' : 'destructive'}
            className="transition-all animate-in fade-in slide-in-from-top-2"
          >
            {notificationMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <AlertTitle>{notificationMsg.title}</AlertTitle>
            <AlertDescription>{notificationMsg.description}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* 2. Sub-Section with Counts, Search & Grid/List View Toggles */}
      <div className="theme-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#ece8ff] text-[#6339f4] font-medium">
            <Megaphone className="w-4 h-4" />
            <span>Total Broadcasts: <strong className="font-semibold text-[#181829]">{pagination.total}</strong></span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active Reach: 5,120+</span>
          </div>
        </div>

        {/* Right Search, Filters, and Grid/List View Toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-44">
            <Search className="w-3.5 h-3.5 text-[#8a87a6] absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alerts..."
              className="w-full pl-9 pr-3 py-1.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
            />
          </form>

          {/* Audience Filter */}
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
          >
            <option value="">All Audiences</option>
            <option value="ALL">Global (Everyone)</option>
            <option value="SHOPS">Shops & Merchants</option>
            <option value="DELIVERY_PARTNERS">Delivery Fleet</option>
            <option value="CUSTOMERS">Customers Only</option>
            <option value="ADMINS">Administrators</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
          >
            <option value="">All Categories</option>
            <option value="ANNOUNCEMENT">Announcement</option>
            <option value="PROMOTION">Promotion</option>
            <option value="ALERT">Alert</option>
            <option value="POLICY">Policy</option>
            <option value="SYSTEM">System</option>
          </select>

          {/* Grid and List Toggles */}
          <div className="flex items-center bg-[#f0f2fb] p-1 rounded-2xl border border-slate-200/80 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-xl transition-all flex items-center justify-center ${
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
              className={`p-1.5 rounded-xl transition-all flex items-center justify-center ${
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

      {/* 3. Notifications List (Grid or Table) */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#8a87a6]">Loading broadcast alerts...</div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications found"
          message="No broadcast alerts match the specified criteria."
          icon={Bell}
        />
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="theme-card p-5 space-y-4 flex flex-col justify-between hover:border-purple-200 transition-all"
            >
              <div className="space-y-3">
                {/* Category & Audience Pills */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getTypeStyle(
                        notif.type
                      )}`}
                    >
                      {notif.type}
                    </span>
                    <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#f0f2fb] text-[#181829] text-[10px] font-medium">
                      {getAudienceIcon(notif.targetAudience)}
                      <span>{notif.targetAudience}</span>
                    </span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      notif.priority === 'HIGH'
                        ? 'bg-rose-50 text-rose-600'
                        : notif.priority === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {notif.priority} Priority
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-sm font-semibold text-[#181829] leading-snug">
                    {notif.title}
                  </h3>
                  <p className="text-xs text-[#8a87a6] mt-1.5 leading-relaxed font-normal">
                    {notif.message}
                  </p>
                </div>

                {/* Dispatch Details Box */}
                <div className="p-3 rounded-2xl bg-[#f0f2fb]/70 border border-slate-100 grid grid-cols-2 gap-2 text-xs text-[#181829]">
                  <div>
                    <span className="text-[10px] text-[#8a87a6] uppercase">Read Rate:</span>
                    <div className="text-xs font-semibold text-[#6339f4] mt-0.5">
                      {notif.readCount} / {notif.totalRecipients || 100}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8a87a6] uppercase">Channels:</span>
                    <div className="flex items-center space-x-1 mt-0.5 text-[11px] text-[#181829]">
                      {notif.channels?.map((ch, idx) => (
                        <span key={idx} className="px-1.5 py-0.2 bg-white rounded-lg border border-slate-200/60 text-[10px]">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#8a87a6]">
                <div className="flex items-center space-x-1.5 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(notif.sentAt || notif.createdAt).toLocaleString()}</span>
                </div>

                <button
                  onClick={() => handleDeleteNotification(notif)}
                  title="Delete broadcast log"
                  className="p-1.5 rounded-xl text-[#8a87a6] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="theme-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[12px] font-normal text-[#8a87a6] bg-[#f0f2fb]/50">
                  <th className="p-4">Notification Title & Content</th>
                  <th className="p-4">Audience</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Read Rate</th>
                  <th className="p-4">Sent Time</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#181829]">
                {notifications.map((notif) => (
                  <tr key={notif._id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="p-4 max-w-sm">
                      <div className="text-xs font-semibold text-[#181829] leading-snug">{notif.title}</div>
                      <div className="text-[11px] text-[#8a87a6] line-clamp-1 mt-0.5 font-normal">{notif.message}</div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#f0f2fb] text-[#181829] text-[10px] font-medium w-fit">
                        {getAudienceIcon(notif.targetAudience)}
                        <span>{notif.targetAudience}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getTypeStyle(notif.type)}`}>
                        {notif.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          notif.priority === 'HIGH'
                            ? 'bg-rose-50 text-rose-600'
                            : notif.priority === 'MEDIUM'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {notif.priority}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-[#6339f4] font-medium">
                      {notif.readCount} / {notif.totalRecipients || 100}
                    </td>
                    <td className="p-4 text-xs text-[#8a87a6]">
                      {new Date(notif.sentAt || notif.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteNotification(notif)}
                        title="Delete log"
                        className="p-1.5 rounded-xl text-[#8a87a6] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Pagination (7 items per page) */}
      {!isLoading && notifications.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          pageSize={7}
          onPageChange={setCurrentPage}
          itemName="notifications"
        />
      )}

      {/* 5. Create / Send Broadcast Modal */}
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Broadcast Platform Notification"
      >
        <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
          {/* Notification Title */}
          <div className="space-y-1">
            <label className="text-[#8a87a6] font-medium uppercase text-[10px]">
              Notification Headline / Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Surge Pricing Activated for Koramangala Zone"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
            />
          </div>

          {/* Target Audience & Category Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Target Audience */}
            <div className="space-y-1">
              <label className="text-[#8a87a6] font-medium uppercase text-[10px]">
                Target Audience *
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
              >
                <option value="ALL">Global (All Users & Partners)</option>
                <option value="SHOPS">Shop Owners & Merchants</option>
                <option value="DELIVERY_PARTNERS">Delivery Riders Fleet</option>
                <option value="CUSTOMERS">Customers Only</option>
                <option value="ADMINS">Administrators</option>
              </select>
            </div>

            {/* Category Type */}
            <div className="space-y-1">
              <label className="text-[#8a87a6] font-medium uppercase text-[10px]">
                Notification Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
              >
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="ALERT">Emergency Alert</option>
                <option value="PROMOTION">Promotional Incentive</option>
                <option value="POLICY">Policy Update</option>
                <option value="SYSTEM">System Maintenance</option>
              </select>
            </div>
          </div>

          {/* Priority & Delivery Channels */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#8a87a6] font-medium uppercase text-[10px]">
                Priority Level *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High (Urgent Banner)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#8a87a6] font-medium uppercase text-[10px]">
                Delivery Channels
              </label>
              <div className="flex items-center space-x-2 pt-1.5">
                <button
                  type="button"
                  onClick={() => toggleChannel('IN_APP')}
                  className={`px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
                    formData.channels.includes('IN_APP')
                      ? 'bg-[#6339f4] text-white'
                      : 'bg-[#f0f2fb] text-[#8a87a6]'
                  }`}
                >
                  In-App
                </button>
                <button
                  type="button"
                  onClick={() => toggleChannel('PUSH')}
                  className={`px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
                    formData.channels.includes('PUSH')
                      ? 'bg-[#6339f4] text-white'
                      : 'bg-[#f0f2fb] text-[#8a87a6]'
                  }`}
                >
                  Push Notice
                </button>
              </div>
            </div>
          </div>

          {/* Message Body */}
          <div className="space-y-1">
            <label className="text-[#8a87a6] font-medium uppercase text-[10px]">
              Notification Message Body *
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter message details for platform users and partners..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsSendModalOpen(false)}
              className="px-4 py-2 rounded-2xl border border-slate-200/80 text-xs font-medium text-[#8a87a6] hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-medium text-white shadow-md shadow-[#6339f4]/25 transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Broadcast'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
