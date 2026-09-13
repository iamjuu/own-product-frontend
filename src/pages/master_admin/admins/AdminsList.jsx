import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Search,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  Mail,
  Lock,
  User,
  Trash2,
  Calendar,
  Eye,
  EyeOff,
  Copy,
  Check,
  Key,
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { StatusBadge } from '../../../components/common/MetricCard';
import { Modal, EmptyState } from '../../../components/common/Modal';
import { Pagination } from '../../../components/common/Pagination';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const AdminsList = () => {
  const [admins, setAdmins] = useState([]);
  const [summary, setSummary] = useState({ totalAdmins: 0, masterAdmins: 0, opsAdmins: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 7 });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password visibility map (adminId -> boolean)
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
    avatar: '',
  });
  const [showModalPassword, setShowModalPassword] = useState(false);

  const fetchAdmins = async (page = currentPage, query = search, role = roleFilter) => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get('/master-admin/admins', {
        search: query,
        role: role,
        page: page,
        limit: 7,
      });
      if (response.success) {
        setAdmins(response.data.admins || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
      }
    } catch (err) {
      console.error('Failed to load admins:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchAdmins(1, search, roleFilter);
  }, [roleFilter]);

  useEffect(() => {
    fetchAdmins(currentPage, search, roleFilter);
  }, [currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAdmins(1, search, roleFilter);
  };

  const togglePasswordVisibility = (adminId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [adminId]: !prev[adminId],
    }));
  };

  const handleCopyPassword = (admin) => {
    const pwd = admin.displayPassword || '••••••••';
    navigator.clipboard.writeText(pwd);
    setCopiedId(admin._id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await ApiClient.post('/master-admin/admins', formData);
      if (response.success) {
        setNotification({
          type: 'success',
          title: 'Admin account created successfully',
          description: `Account '${formData.name}' (${formData.email}) created with role ${formData.role}. Password: "${formData.password}"`,
        });
        setIsCreateModalOpen(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'ADMIN',
          avatar: '',
        });
        fetchAdmins(1, search, roleFilter);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        title: 'Failed to create admin account',
        description: err.message || 'An unexpected error occurred during admin provisioning.',
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 6000);
    }
  };

  const handleToggleStatus = async (admin) => {
    const newStatus = !admin.isActive;
    try {
      const response = await ApiClient.patch(`/master-admin/admins/${admin._id}/status`, {
        isActive: newStatus,
      });
      if (response.success) {
        setAdmins((prev) =>
          prev.map((a) => (a._id === admin._id ? { ...a, isActive: newStatus } : a))
        );
        setNotification({
          type: 'success',
          title: 'Admin status updated successfully',
          description: `Account '${admin.name}' has been ${newStatus ? 'activated' : 'suspended'}.`,
        });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        title: 'Failed to update admin status',
        description: err.message || 'Unable to update admin status.',
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (!window.confirm(`Are you sure you want to permanently remove admin '${admin.name}'?`)) {
      return;
    }
    try {
      const response = await ApiClient.delete(`/master-admin/admins/${admin._id}`);
      if (response.success) {
        setNotification({
          type: 'success',
          title: 'Admin removed successfully',
          description: `Account '${admin.name}' was permanently deleted.`,
        });
        fetchAdmins(currentPage, search, roleFilter);
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        title: 'Failed to delete admin',
        description: err.message || 'Unable to remove admin account.',
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Section */}
      <div className="theme-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
              Platform Administrators & Access Governance
            </h2>
            <p className="text-xs text-[#8a87a6] mt-0.5">
              Create and oversee administrative accounts, view access credentials & passwords, and manage account statuses.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-medium text-white flex items-center space-x-2 shadow-md shadow-[#6339f4]/25 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Admin</span>
            </button>
          </div>
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

      {/* 2. Sub-Section with Dynamic Counts, Search & Grid/List View Toggles */}
      <div className="theme-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Dynamic Counts from Database */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#ece8ff] text-[#6339f4] font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Total Admins: <strong className="font-semibold text-[#181829]">{summary.totalAdmins || pagination.total}</strong></span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-medium">
            <span>Master Admins: <strong className="font-semibold text-purple-900">{summary.masterAdmins}</strong></span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-medium">
            <span>Operations Admins: <strong className="font-semibold text-indigo-900">{summary.opsAdmins}</strong></span>
          </div>
        </div>

        {/* Right Search, Role Filter, and Grid/List View Toggles */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-[#8a87a6] absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search admin..."
              className="w-full pl-9 pr-3 py-1.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
            />
          </form>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
          >
            <option value="">All Roles</option>
            <option value="MASTER_ADMIN">Master Admin</option>
            <option value="ADMIN">Operations Admin</option>
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

      {/* 3. Admins List (Grid or Table) */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#8a87a6]">Loading platform administrators...</div>
      ) : admins.length === 0 ? (
        <EmptyState
          title="No admin accounts found"
          message="No administrators matched the search and filter criteria."
          icon={Shield}
        />
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {admins.map((admin) => {
            const isMaster = admin.role === 'MASTER_ADMIN';
            const isPasswordVisible = !!visiblePasswords[admin._id];
            const displayPwd = admin.displayPassword || (isMaster ? 'MasterAdmin123!' : 'Admin123!');

            return (
              <div
                key={admin._id}
                className="theme-card p-5 space-y-4 flex flex-col justify-between hover:border-purple-200 transition-all shadow-sm"
              >
                <div className="space-y-3">
                  {/* Top Bar with Avatar & Status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ${
                          isMaster
                            ? 'bg-[#ece8ff] text-[#6339f4] ring-2 ring-[#ece8ff]'
                            : 'bg-indigo-50 text-indigo-600 ring-2 ring-indigo-100'
                        }`}
                      >
                        {admin.name?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#181829]">{admin.name}</h3>
                        <p className="text-xs text-[#8a87a6]">{admin.email}</p>
                      </div>
                    </div>

                    <StatusBadge status={admin.isActive ? 'ACTIVE' : 'SUSPENDED'} />
                  </div>

                  {/* Role, Password & Date Details */}
                  <div className="p-3 rounded-2xl bg-[#f0f2fb]/70 border border-slate-100 space-y-2 text-xs text-[#181829]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8a87a6] text-[11px]">System Role:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          isMaster
                            ? 'bg-[#ece8ff] text-[#6339f4]'
                            : 'bg-indigo-50 text-indigo-600'
                        }`}
                      >
                        {isMaster ? 'Platform Master Admin' : 'Operations Admin'}
                      </span>
                    </div>

                    {/* Password Row with Eye and Copy */}
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                      <span className="text-[#8a87a6] flex items-center space-x-1">
                        <Key className="w-3.5 h-3.5 text-[#6339f4]" />
                        <span>Password:</span>
                      </span>
                      <div className="flex items-center space-x-1.5 font-mono">
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[#181829] font-bold text-[11px]">
                          {isPasswordVisible ? displayPwd : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(admin._id)}
                          title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                          className="p-1 rounded-md text-[#8a87a6] hover:text-[#6339f4] hover:bg-white transition-colors"
                        >
                          {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyPassword(admin)}
                          title="Copy Password"
                          className="p-1 rounded-md text-[#8a87a6] hover:text-[#6339f4] hover:bg-white transition-colors"
                        >
                          {copiedId === admin._id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#8a87a6] pt-1 border-t border-slate-200/60">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Joined:</span>
                      </span>
                      <span className="text-[#181829] font-medium font-mono">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Toggle & Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`admin-grid-switch-${admin._id}`}
                      checked={admin.isActive}
                      onCheckedChange={() => handleToggleStatus(admin)}
                    />
                    <Label
                      htmlFor={`admin-grid-switch-${admin._id}`}
                      className={`cursor-pointer text-xs font-normal ${
                        admin.isActive ? 'text-[#6339f4]' : 'text-[#8a87a6]'
                      }`}
                    >
                      {admin.isActive ? 'Active' : 'Suspended'}
                    </Label>
                  </div>

                  {!isMaster && (
                    <button
                      onClick={() => handleDeleteAdmin(admin)}
                      title="Delete admin"
                      className="p-1.5 rounded-xl text-[#8a87a6] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="theme-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[12px] font-normal text-[#8a87a6] bg-[#f0f2fb]/50">
                  <th className="p-4">Administrator</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">System Role</th>
                  <th className="p-4">Access Password</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4">Account Access</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#181829]">
                {admins.map((admin) => {
                  const isMaster = admin.role === 'MASTER_ADMIN';
                  const isPasswordVisible = !!visiblePasswords[admin._id];
                  const displayPwd = admin.displayPassword || (isMaster ? 'MasterAdmin123!' : 'Admin123!');

                  return (
                    <tr key={admin._id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isMaster
                                ? 'bg-[#ece8ff] text-[#6339f4]'
                                : 'bg-indigo-50 text-indigo-600'
                            }`}
                          >
                            {admin.name?.charAt(0)?.toUpperCase() || 'A'}
                          </div>
                          <span className="font-semibold text-xs text-[#181829]">{admin.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[#8a87a6] text-xs">
                        {admin.email}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                            isMaster
                              ? 'bg-[#ece8ff] text-[#6339f4]'
                              : 'bg-indigo-50 text-indigo-600'
                          }`}
                        >
                          {isMaster ? 'Platform Master Admin' : 'Operations Admin'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center space-x-1.5 font-mono">
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[#181829] font-bold text-xs">
                            {isPasswordVisible ? displayPwd : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(admin._id)}
                            title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                            className="p-1 rounded text-[#8a87a6] hover:text-[#6339f4] hover:bg-slate-200 transition-colors"
                          >
                            {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyPassword(admin)}
                            title="Copy Password"
                            className="p-1 rounded text-[#8a87a6] hover:text-[#6339f4] hover:bg-slate-200 transition-colors"
                          >
                            {copiedId === admin._id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={admin.isActive ? 'ACTIVE' : 'SUSPENDED'} />
                      </td>
                      <td className="p-4 font-mono text-xs text-[#8a87a6]">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center space-x-2">
                          <Switch
                            id={`admin-table-switch-${admin._id}`}
                            checked={admin.isActive}
                            onCheckedChange={() => handleToggleStatus(admin)}
                          />
                          <Label
                            htmlFor={`admin-table-switch-${admin._id}`}
                            className={`cursor-pointer text-xs font-normal ${
                              admin.isActive ? 'text-[#6339f4]' : 'text-[#8a87a6]'
                            }`}
                          >
                            {admin.isActive ? 'Active' : 'Suspended'}
                          </Label>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {!isMaster && (
                          <button
                            onClick={() => handleDeleteAdmin(admin)}
                            title="Delete Admin"
                            className="p-1.5 rounded-xl text-[#8a87a6] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Pagination */}
      {!isLoading && admins.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          pageSize={7}
          onPageChange={setCurrentPage}
          itemName="administrators"
        />
      )}

      {/* 5. Create Admin Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Platform Administrator"
      >
        <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[#8a87a6] font-medium uppercase text-[10px]">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[#8a87a6] font-medium uppercase text-[10px]">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. sarah.ops@marketplace.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>
          </div>

          {/* Password with Eye Show/Hide Toggle */}
          <div className="space-y-1">
            <label className="text-[#8a87a6] font-medium uppercase text-[10px]">
              Initial Password * (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
              <input
                type={showModalPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter admin password"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-mono focus:outline-none focus:border-[#6339f4]"
              />
              <button
                type="button"
                onClick={() => setShowModalPassword(!showModalPassword)}
                className="absolute right-3.5 top-3 text-[#8a87a6] hover:text-[#181829]"
              >
                {showModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Admin Role Selector */}
          <div className="space-y-1">
            <label className="text-[#8a87a6] font-medium uppercase text-[10px]">
              Assign System Role *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.role === 'ADMIN'
                    ? 'border-[#6339f4] bg-[#ece8ff]/50'
                    : 'border-slate-200/80 bg-[#f0f2fb] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-xs text-[#181829]">Operations Admin</span>
                </div>
                <p className="text-[10px] text-[#8a87a6] mt-1">
                  Handles orders, dispute resolution & day-to-day operations.
                </p>
              </div>

              <div
                onClick={() => setFormData({ ...formData, role: 'MASTER_ADMIN' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.role === 'MASTER_ADMIN'
                    ? 'border-[#6339f4] bg-[#ece8ff]/50'
                    : 'border-slate-200/80 bg-[#f0f2fb] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#6339f4]" />
                  <span className="font-semibold text-xs text-[#181829]">Master Admin</span>
                </div>
                <p className="text-[10px] text-[#8a87a6] mt-1">
                  Full platform governance, settings, flags & branding.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-2xl border border-slate-200/80 text-xs font-medium text-[#8a87a6] hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-medium text-white shadow-md shadow-[#6339f4]/25 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Admin...' : 'Confirm & Create Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
