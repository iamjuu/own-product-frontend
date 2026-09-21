import React, { useState, useEffect } from 'react';
import {
  Bike,
  Search,
  CheckCircle2,
  Clock,
  Star,
  FileText,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  Copy,
  Mail,
  ExternalLink,
  ShieldAlert,
  AlertCircle,
  Plus,
  Phone,
  User,
  Lock,
  Hash,
  Key,
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../../components/common/MetricCard';
import { Modal, EmptyState } from '../../../components/common/Modal';
import { Pagination } from '../../../components/common/Pagination';

export const DeliveryPartnersList = ({ defaultTab = 'pending' }) => {
  const { user } = useAuth();
  const isOperationsAdmin = user?.role === 'ADMIN';
  const apiPrefix = isOperationsAdmin ? '/admin' : '/master-admin';

  const [tab, setTab] = useState(defaultTab);
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 7 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  // Add Delivery Partner Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'BIKE',
    vehicleNumber: '',
    autoApprove: true,
    password: '',
  });
  const [isSubmittingPartner, setIsSubmittingPartner] = useState(false);
  const [addError, setAddError] = useState('');

  useEffect(() => {
    setTab(defaultTab);
    setCurrentPage(1);
  }, [defaultTab]);

  const fetchPartners = async (currentTab = tab, searchQuery = search, page = currentPage) => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get(`${apiPrefix}/delivery-partners`, {
        tab: currentTab,
        search: searchQuery,
        page: page,
        limit: 7,
      });
      if (response.success) {
        const partnersList = Array.isArray(response.data)
          ? response.data
          : (response.data?.partners || []);
        setPartners(partnersList);
        if (response.data?.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        setPartners([]);
      }
    } catch (err) {
      console.error('Failed to load delivery partners:', err);
      setPartners([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchPartners(tab, search, 1);
  }, [tab]);

  useEffect(() => {
    fetchPartners(tab, search, currentPage);
  }, [currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPartners(tab, search, 1);
  };

  const handleAddPartnerSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingPartner(true);
    setAddError('');
    try {
      const response = await ApiClient.post(`${apiPrefix}/delivery-partners`, addFormData);
      if (response.success) {
        setIsAddModalOpen(false);
        setAddFormData({
          name: '',
          phone: '',
          email: '',
          vehicleType: 'BIKE',
          vehicleNumber: '',
          autoApprove: true,
          password: '',
        });
        if (response.credentials) {
          setGeneratedCredentials(response.credentials);
        }
        if (response.data) {
          setSelectedPartner(response.data);
        }
        fetchPartners(tab, search, 1);
      } else {
        setAddError(response.message || 'Failed to register delivery partner');
      }
    } catch (err) {
      setAddError(err.message || 'Failed to register delivery partner');
    } finally {
      setIsSubmittingPartner(false);
    }
  };

  const handleApprovePartner = async (partnerId) => {
    setIsUpdatingStatus(true);
    try {
      const response = await ApiClient.patch(`/admin/delivery-partners/${partnerId}/verify`);
      if (response.success) {
        setSelectedPartner(response.data);
        if (response.credentials) {
          setGeneratedCredentials(response.credentials);
        }
        fetchPartners(tab, search, currentPage);
      }
    } catch (err) {
      console.error('Failed to verify partner:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRejectPartner = async (partnerId) => {
    setIsUpdatingStatus(true);
    try {
      const response = await ApiClient.patch(`/admin/delivery-partners/${partnerId}/reject`, {
        reason: 'KYC documents could not be verified by Operations Admin.',
      });
      if (response.success) {
        setSelectedPartner(response.data);
        fetchPartners(tab, search, currentPage);
      }
    } catch (err) {
      console.error('Failed to reject partner:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const [showPasswordIds, setShowPasswordIds] = useState({});
  const [copiedPartnerId, setCopiedPartnerId] = useState(null);

  const toggleShowPassword = (partnerId) => {
    setShowPasswordIds((prev) => ({
      ...prev,
      [partnerId]: !prev[partnerId],
    }));
  };

  const handleCopyRiderCredentials = (partner) => {
    const password = partner.displayPassword || partner.generatedPassword || 'Rider@123';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    const text = `Email: ${partner.email}\nPassword: ${password}\nPortal: ${origin}`;
    navigator.clipboard.writeText(text);
    setCopiedPartnerId(partner._id);
    setTimeout(() => setCopiedPartnerId(null), 2000);
  };

  const handleCopyCredentials = () => {
    if (!generatedCredentials) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    const text = `Email: ${generatedCredentials.email}\nPassword: ${generatedCredentials.password}\nPortal: ${origin}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="theme-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
                Delivery Fleet & KYC Pipeline
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                isOperationsAdmin ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-[#6339f4]'
              }`}>
                {isOperationsAdmin ? 'Operations Admin (Approval Authority)' : 'Master Admin (Executive Monitoring)'}
              </span>
            </div>
            <p className="text-xs text-[#8a87a6] mt-0.5">
              {isOperationsAdmin
                ? 'Review submitted KYC documents (Aadhaar, Driving License, RC) and approve riders with automated Nodemailer credentials.'
                : 'Executive telemetry of on-field delivery riders and compliance pipeline status.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64 md:w-72">
              <Search className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rider name, phone, email..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
              />
            </form>

            <button
              onClick={() => {
                setAddError('');
                setIsAddModalOpen(true);
              }}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5225e6] text-white text-xs font-bold shadow-md shadow-[#6339f4]/25 transition-all shrink-0 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Delivery Partner</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {[
            { id: 'pending', label: 'Pending Verification' },
            { id: 'verified', label: 'Active & Verified Fleet' },
            { id: 'all', label: 'All Registered Partners' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                tab === t.id
                  ? 'bg-[#6339f4] text-white shadow-md shadow-[#6339f4]/20'
                  : 'bg-[#f0f2fb] text-[#8a87a6] hover:text-[#181829]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Partners Grid */}
      {isLoading ? (
        <div className="py-24 text-center text-slate-400 text-xs">
          <div className="w-6 h-6 rounded-full border-2 border-[#6339f4] border-t-transparent animate-spin mx-auto mb-2" />
          <p>Loading delivery partners...</p>
        </div>
      ) : partners.length === 0 ? (
        <EmptyState
          title="No Delivery Partners Found"
          description={
            search
              ? `No partners match search term "${search}".`
              : tab === 'pending'
              ? 'No pending verification applications right now.'
              : 'No delivery partners registered in this filter.'
          }
          icon={Bike}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {partners.map((partner) => {
            const isVerified = partner.verificationStatus === 'VERIFIED';
            return (
              <div
                key={partner._id}
                className="theme-card p-5 space-y-4 flex flex-col justify-between hover:border-purple-200 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#181829]">{partner.name}</h3>
                      <p className="text-xs text-[#8a87a6] mt-0.5">{partner.phone}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{partner.email}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <StatusBadge status={partner.verificationStatus} />
                      {isVerified && (
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            partner.isOnline
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 animate-pulse'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {partner.isOnline ? 'Online • On Duty' : 'Offline'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#f0f2fb]/70 border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#8a87a6] text-[10px] uppercase font-bold">Vehicle:</span>
                      <span className="font-mono text-[#181829] font-bold">
                        {partner.vehicleType} ({partner.vehicleNumber || 'N/A'})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8a87a6] text-[10px] uppercase font-bold">Applied:</span>
                      <span className="text-[#181829]">
                        {new Date(partner.applicationDate || partner.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Rider Login Credentials Box */}
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[#f8f6ff] via-[#f2eeff] to-[#ebe5ff] border border-[#dcd3ff] text-xs space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-[#181829]">
                        <Key className="w-3.5 h-3.5 text-[#6339f4]" />
                        <span>Login Credentials</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyRiderCredentials(partner);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-white border border-[#d8ceff] hover:border-[#6339f4] text-[10px] font-bold text-[#6339f4] flex items-center space-x-1 shadow-2xs transition-all active:scale-95"
                        title="Copy login credentials"
                      >
                        {copiedPartnerId === partner._id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/95 p-2.5 rounded-xl border border-[#ece8ff]">
                      <div className="truncate">
                        <span className="text-[9px] uppercase font-bold text-[#8a87a6] block">Email / Username</span>
                        <span className="font-mono text-[#181829] font-bold text-xs truncate block" title={partner.email}>
                          {partner.email}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-bold text-[#8a87a6] block">Password</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleShowPassword(partner._id);
                            }}
                            className="text-slate-400 hover:text-[#6339f4] p-0.5 rounded transition-colors"
                            title={showPasswordIds[partner._id] ? 'Hide password' : 'Show password'}
                          >
                            {showPasswordIds[partner._id] ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="font-mono font-bold text-[#6339f4] text-xs block truncate mt-0.5">
                          {showPasswordIds[partner._id]
                            ? (partner.displayPassword || partner.generatedPassword || 'Rider@123')
                            : '••••••••••••'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isVerified ? (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                      <div className="p-2 rounded-xl bg-slate-50">
                        <p className="text-[9px] text-[#8a87a6] uppercase font-bold">Trips</p>
                        <p className="font-bold text-xs text-[#181829] mt-0.5">{partner.completedDeliveries}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <p className="text-[9px] text-[#8a87a6] uppercase font-bold">Rating</p>
                        <p className="font-bold text-xs text-[#181829] mt-0.5 flex items-center justify-center space-x-0.5">
                          <span className="text-amber-500">★</span>
                          <span>{partner.rating}</span>
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <p className="text-[9px] text-[#8a87a6] uppercase font-bold">Earnings</p>
                        <p className="font-bold text-xs text-emerald-600 mt-0.5">₹{partner.totalEarnings}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1.5">
                      <div className="font-bold flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>Submitted Verification KYC:</span>
                      </div>
                      <div className="text-[11px] space-y-1 font-semibold">
                        {partner.documents?.map((doc, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="truncate max-w-[150px]">• {doc.name}</span>
                            <span className="font-mono text-amber-700 font-bold text-[10px]">{doc.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedPartner(partner);
                      setGeneratedCredentials(null);
                    }}
                    className="px-4 py-2 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white flex items-center space-x-1.5 shadow-md shadow-[#6339f4]/20 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Rider</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && partners.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          pageSize={7}
          onPageChange={setCurrentPage}
          itemName="riders"
        />
      )}

      {/* Partner Detail Modal */}
      <Modal
        isOpen={!!selectedPartner}
        onClose={() => {
          setSelectedPartner(null);
          setGeneratedCredentials(null);
        }}
        title={`Delivery Partner KYC Inspection — ${selectedPartner?.name}`}
      >
        {selectedPartner && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#f0f2fb] flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#8a87a6]">Verification Status</p>
                <div className="mt-1">
                  <StatusBadge status={selectedPartner.verificationStatus} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-[#8a87a6]">Applicant Email</p>
                <p className="font-mono text-[#181829] font-bold text-[11px] mt-1">{selectedPartner.email}</p>
              </div>
            </div>

            {/* Generated Credentials Callout (When Approved) */}
            {generatedCredentials && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/25 to-emerald-500/15 border-2 border-emerald-500 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-black text-sm text-emerald-950">
                      Rider Approved & Credentials Dispatched via Nodemailer!
                    </h4>
                  </div>
                  <button
                    onClick={handleCopyCredentials}
                    className="px-3 py-1 rounded-xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold text-[11px] flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Credentials'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-white/90 border border-emerald-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[#8a87a6] uppercase">Username / Email:</span>
                    <p className="font-mono font-bold text-[#181829]">{generatedCredentials.email}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#8a87a6] uppercase">Generated Password:</span>
                    <p className="font-mono font-bold text-[#6339f4]">{generatedCredentials.password}</p>
                  </div>
                </div>

                <p className="text-[10px] text-emerald-800 font-medium">
                  📧 An onboarding email with these credentials and fleet login portal instructions has been sent to <strong>{generatedCredentials.email}</strong>.
                </p>
              </div>
            )}

            {/* Rider Login Credentials Box inside Modal */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f8f6ff] via-[#f2eeff] to-[#ebe5ff] border border-[#dcd3ff] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-xl bg-[#6339f4] text-white">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#181829]">Delivery Partner Login Credentials</h4>
                    <p className="text-[10px] text-[#8a87a6]">Rider credentials for the Delivery Boy App & Web Portal</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyRiderCredentials(selectedPartner)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#d8ceff] hover:border-[#6339f4] text-xs font-bold text-[#6339f4] flex items-center space-x-1.5 shadow-2xs transition-all active:scale-95"
                >
                  {copiedPartnerId === selectedPartner._id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Credentials</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-[#ece8ff]">
                <div>
                  <span className="text-[10px] font-bold text-[#8a87a6] uppercase block">Username / Email</span>
                  <p className="font-mono font-bold text-xs text-[#181829] mt-0.5 select-all">{selectedPartner.email}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#8a87a6] uppercase block">Password</span>
                    <button
                      type="button"
                      onClick={() => toggleShowPassword(selectedPartner._id)}
                      className="text-slate-400 hover:text-[#6339f4] text-[11px] flex items-center space-x-1"
                    >
                      {showPasswordIds[selectedPartner._id] ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Show</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono font-bold text-xs text-[#6339f4] mt-0.5 select-all">
                    {showPasswordIds[selectedPartner._id]
                      ? (selectedPartner.displayPassword || selectedPartner.generatedPassword || 'Rider@123')
                      : '••••••••••••'}
                  </p>
                </div>
              </div>
            </div>

            {/* Submitted KYC Documents */}
            <div className="p-4 rounded-2xl bg-[#f0f2fb] space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#181829] uppercase text-[11px]">
                  Submitted Mandatory KYC Documents ({selectedPartner.documents?.length || 0})
                </h4>
                <span className="text-[10px] font-bold text-[#6339f4]">
                  Vehicle: {selectedPartner.vehicleType} ({selectedPartner.vehicleNumber || 'N/A'})
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {selectedPartner.documents?.map((doc, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-4 h-4 text-[#6339f4]" />
                      <div>
                        <p className="font-bold text-[#181829] text-xs">{doc.name}</p>
                        {doc.fileName && (
                          <p className="text-[10px] text-[#8a87a6] font-mono">
                            {doc.fileName} {doc.fileSize ? `(${doc.fileSize})` : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <StatusBadge status={doc.status} />
                      {doc.url && doc.url !== '' && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#6339f4]"
                          title="Open attached document"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role-Based Decision Controls */}
            {selectedPartner.verificationStatus === 'PENDING_VERIFICATION' && (
              isOperationsAdmin ? (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8a87a6] block">
                      Operations Admin Decision:
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Approval automatically provisions user account & dispatches email.
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleRejectPartner(selectedPartner._id)}
                      className="px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all disabled:opacity-50"
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleApprovePartner(selectedPartner._id)}
                      className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isUpdatingStatus ? 'Provisioning...' : 'Approve & Verify Rider'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center space-x-2 text-[11px] text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Master Admin Monitoring Mode:</strong> KYC document approval and credential provisioning is strictly executed by <strong>Operations Admin</strong>.
                  </span>
                </div>
              )
            )}

            <div className="p-3 rounded-2xl bg-[#ece8ff] flex items-center space-x-2 text-[11px] text-[#6339f4]">
              <ShieldCheck className="w-4 h-4 text-[#6339f4] shrink-0" />
              <span className="font-semibold">
                Approved delivery partners receive encrypted credentials and must be online to receive dispatch trips.
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* ADD DELIVERY PARTNER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          if (!isSubmittingPartner) {
            setIsAddModalOpen(false);
            setAddError('');
          }
        }}
        title="Register New Delivery Partner"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddPartnerSubmit} className="space-y-4">
          {addError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{addError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">
              Rider Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Arjun Kumar"
                value={addFormData.name}
                onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
              />
            </div>
          </div>

          {/* Phone & Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+91 98455 00000"
                  value={addFormData.phone}
                  onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="arjun.rider@marketplace.com"
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Type & Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">
                Vehicle Type
              </label>
              <select
                value={addFormData.vehicleType}
                onChange={(e) => setAddFormData({ ...addFormData, vehicleType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              >
                <option value="BIKE">Motorcycle / Bike</option>
                <option value="SCOOTER">Scooter / Moped</option>
                <option value="EV_BIKE">Electric Bike (EV)</option>
                <option value="CYCLE">Bicycle</option>
                <option value="CAR">Car / Delivery Van</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">
                Vehicle Registration Plate
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. KA-01-AB-1234"
                  value={addFormData.vehicleNumber}
                  onChange={(e) => setAddFormData({ ...addFormData, vehicleNumber: e.target.value.toUpperCase() })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] uppercase placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
                />
              </div>
            </div>
          </div>

          {/* Instant Verification & Account Provisioning Toggle */}
          <div className="p-3.5 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="pr-3">
                <span className="text-xs font-bold text-[#181829] block">
                  Instant Verification & Login Provisioning
                </span>
                <span className="text-[11px] text-[#8a87a6]">
                  Activate partner immediately and generate login credentials for Delivery Boy App
                </span>
              </div>
              <input
                type="checkbox"
                checked={addFormData.autoApprove}
                onChange={(e) => setAddFormData({ ...addFormData, autoApprove: e.target.checked })}
                className="w-5 h-5 accent-[#6339f4] rounded cursor-pointer shrink-0"
              />
            </label>

            {addFormData.autoApprove && (
              <div className="pt-2 border-t border-slate-200/80">
                <label className="block text-[11px] font-bold text-[#181829] mb-1">
                  Custom Password <span className="text-[10px] text-[#8a87a6] font-normal">(Optional — defaults to auto-generated password)</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#8a87a6] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Leave blank to auto-generate (e.g. Arjun@Rider2026)"
                    value={addFormData.password}
                    onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-2 flex items-center justify-end space-x-2.5 border-t border-slate-100">
            <button
              type="button"
              disabled={isSubmittingPartner}
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-[#8a87a6] hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingPartner}
              className="px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5225e6] text-white text-xs font-bold shadow-md shadow-[#6339f4]/25 transition-all flex items-center space-x-2 disabled:opacity-50 active:scale-95"
            >
              {isSubmittingPartner ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Delivery Partner</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DeliveryPartnersList;
