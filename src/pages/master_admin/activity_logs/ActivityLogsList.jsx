import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Shield,
  Eye
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../../components/common/MetricCard';
import { Modal, EmptyState } from '../../../components/common/Modal';
import { Pagination } from '../../../components/common/Pagination';

export const ActivityLogsList = () => {
  const { user } = useAuth();
  const apiPrefix = user?.role === 'ADMIN' ? '/admin' : '/master-admin';
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 7 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async (
    query = search,
    action = actionFilter,
    role = roleFilter,
    page = currentPage
  ) => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get(`${apiPrefix}/activity-logs`, {
        search: query,
        action: action,
        actorRole: role,
        page: page,
        limit: 7,
      });
      if (response.success) {
        setLogs(response.data.logs);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchLogs(search, actionFilter, roleFilter, 1);
  }, [actionFilter, roleFilter]);

  useEffect(() => {
    fetchLogs(search, actionFilter, roleFilter, currentPage);
  }, [currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLogs(search, actionFilter, roleFilter, 1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Controls */}
      <div className="theme-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
              Immutable Platform Audit Logs
            </h2>
            <p className="text-xs text-[#8a87a6] mt-0.5">
              Cryptographic and chronological audit trail of all platform-wide operational and administrative activities.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search action or actor..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
            />
          </form>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-semibold focus:outline-none focus:border-[#6339f4]"
          >
            <option value="">All Actions</option>
            <option value="FEATURE_ENABLED">FEATURE_ENABLED</option>
            <option value="FEATURE_DISABLED">FEATURE_DISABLED</option>
            <option value="SETTINGS_UPDATED">SETTINGS_UPDATED</option>
            <option value="APPEARANCE_UPDATED">APPEARANCE_UPDATED</option>
            <option value="ORDER_CREATED">ORDER_CREATED</option>
            <option value="ORDER_STATUS_CHANGED">ORDER_STATUS_CHANGED</option>
            <option value="DELIVERY_ASSIGNED">DELIVERY_ASSIGNED</option>
            <option value="SHOP_CREATED">SHOP_CREATED</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-semibold focus:outline-none focus:border-[#6339f4]"
          >
            <option value="">All Actor Roles</option>
            <option value="MASTER_ADMIN">MASTER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SHOP_OWNER">SHOP_OWNER</option>
            <option value="SYSTEM">SYSTEM</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#8a87a6]">Loading audit trail...</div>
      ) : logs.length === 0 ? (
        <EmptyState
          title="No audit logs found"
          message="No activity records matching criteria."
          icon={History}
        />
      ) : (
        <div className="theme-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-[#f0f2fb]/60 text-[11px] font-black uppercase tracking-wider text-[#8a87a6]">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Resource Type</th>
                  <th className="p-4">Resource ID</th>
                  <th className="p-4 text-right">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[#181829]">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-[#8a87a6] text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="p-4 font-sans">
                      <span className="font-black text-[#6339f4] text-[11px]">
                        {log.action}
                      </span>
                    </td>

                    <td className="p-4 font-sans font-bold text-[#181829]">
                      {log.actorName || 'System'}
                    </td>

                    <td className="p-4 font-sans">
                      <StatusBadge status={log.actorRole} />
                    </td>

                    <td className="p-4 font-sans font-medium text-[#181829]">
                      {log.resourceType}
                    </td>

                    <td className="p-4 text-[#8a87a6] text-[11px] truncate max-w-[120px]">
                      {log.resourceId || '—'}
                    </td>

                    <td className="p-4 text-right font-sans">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-3 py-1 rounded-xl bg-[#ece8ff] hover:bg-[#6339f4] hover:text-white text-[#6339f4] font-bold text-[11px] transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination (7 items per page) */}
      {!isLoading && logs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          pageSize={7}
          onPageChange={setCurrentPage}
          itemName="audit logs"
        />
      )}

      {/* Metadata Detail Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={`Audit Log Record — ${selectedLog?.action}`}
      >
        {selectedLog && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#f0f2fb] grid grid-cols-2 gap-2 text-[#181829]">
              <div>
                <span className="text-[10px] text-[#8a87a6] font-semibold uppercase">Actor Name:</span>
                <p className="font-bold">{selectedLog.actorName}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#8a87a6] font-semibold uppercase">Role:</span>
                <p className="text-[#6339f4] font-bold">{selectedLog.actorRole}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#8a87a6] font-semibold uppercase">IP Address:</span>
                <p className="font-mono text-[#181829]">{selectedLog.ipAddress || '127.0.0.1'}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#8a87a6] font-semibold uppercase">Timestamp:</span>
                <p className="font-mono text-[#181829]">{new Date(selectedLog.timestamp).toISOString()}</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#181829] uppercase tracking-wider">
                Raw JSON Metadata:
              </span>
              <pre className="p-4 rounded-2xl bg-[#f0f2fb] text-[#6339f4] font-mono text-[11px] overflow-x-auto mt-1.5 border border-slate-200">
                {JSON.stringify(selectedLog.metadata || {}, null, 2)}
              </pre>
            </div>

            <div className="p-3 rounded-2xl bg-[#ece8ff] flex items-center space-x-2 text-[11px] text-[#6339f4]">
              <Shield className="w-4 h-4 text-[#6339f4] shrink-0" />
              <span className="font-semibold">
                Activity logs are strictly append-only and immutable from application interfaces.
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
