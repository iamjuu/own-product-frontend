import React, { useState, useEffect } from 'react';
import {
  Bike,
  Search,
  CheckCircle2,
  Clock,
  Star,
  FileText,
  Eye,
  ShieldCheck
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { StatusBadge } from '../../../components/common/MetricCard';
import { Modal, EmptyState } from '../../../components/common/Modal';
import { Pagination } from '../../../components/common/Pagination';

export const DeliveryPartnersList = ({ defaultTab = 'pending' }) => {
  const [tab, setTab] = useState(defaultTab);
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 7 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);

  useEffect(() => {
    setTab(defaultTab);
    setCurrentPage(1);
  }, [defaultTab]);

  const fetchPartners = async (currentTab = tab, searchQuery = search, page = currentPage) => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get('/master-admin/delivery-partners', {
        tab: currentTab,
        search: searchQuery,
        page: page,
        limit: 7,
      });
      if (response.success) {
        setPartners(response.data.partners);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load delivery partners:', err);
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Sub-Tabs */}
      <div className="theme-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
              Delivery Fleet & Verification Monitoring
            </h2>
            <p className="text-xs text-[#8a87a6] mt-0.5">
              Monitor active riders, document verification pipelines, and fleet compensation metrics.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rider name, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
            />
          </form>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <button
            onClick={() => setTab('pending')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
              tab === 'pending'
                ? 'bg-[#6339f4] text-white shadow-md shadow-[#6339f4]/25'
                : 'text-[#8a87a6] hover:text-[#181829] bg-[#f0f2fb]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Verification Pipeline</span>
          </button>

          <button
            onClick={() => setTab('verified')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
              tab === 'verified'
                ? 'bg-[#6339f4] text-white shadow-md shadow-[#6339f4]/25'
                : 'text-[#8a87a6] hover:text-[#181829] bg-[#f0f2fb]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Active Fleet</span>
          </button>
        </div>
      </div>

      {/* Partners List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#8a87a6]">Loading delivery fleet...</div>
      ) : partners.length === 0 ? (
        <EmptyState
          title={`No ${tab === 'pending' ? 'pending verification' : 'verified'} partners found`}
          message="No rider applications or verified partners matching criteria."
          icon={Bike}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {partners.map((partner) => {
            const isVerified = partner.verificationStatus === 'VERIFIED';

            return (
              <div
                key={partner._id}
                className="theme-card p-5 space-y-4 flex flex-col justify-between hover:border-purple-200"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#181829]">{partner.name}</h3>
                      <p className="text-[11px] text-[#8a87a6] font-medium">{partner.phone}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <StatusBadge status={partner.verificationStatus} />
                      {isVerified && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            partner.isOnline
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {partner.isOnline ? 'Online • On Duty' : 'Offline'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#f0f2fb]/70 border border-slate-100 grid grid-cols-2 gap-2 text-xs text-[#181829]">
                    <div>
                      <span className="text-[10px] text-[#8a87a6] font-semibold uppercase">Vehicle:</span>
                      <p className="font-bold text-[11px] mt-0.5">
                        {partner.vehicleType} {partner.vehicleNumber ? `(${partner.vehicleNumber})` : ''}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8a87a6] font-semibold uppercase">Applied:</span>
                      <p className="text-[#8a87a6] font-medium text-[11px] mt-0.5">
                        {new Date(partner.applicationDate || partner.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {isVerified ? (
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-2xl bg-[#f0f2fb]">
                        <span className="text-[10px] text-[#8a87a6] font-bold uppercase">Trips</span>
                        <p className="text-[#181829] font-black text-sm mt-0.5">
                          {partner.completedDeliveries}
                        </p>
                      </div>

                      <div className="p-2 rounded-2xl bg-[#f0f2fb]">
                        <span className="text-[10px] text-[#8a87a6] font-bold uppercase">Rating</span>
                        <div className="flex items-center justify-center space-x-1 text-amber-500 mt-0.5 font-black">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{partner.rating}</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-2xl bg-[#f0f2fb]">
                        <span className="text-[10px] text-[#8a87a6] font-bold uppercase">Earnings</span>
                        <p className="text-emerald-600 font-black text-sm mt-0.5">
                          ₹{partner.totalEarnings}
                        </p>
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
                          <div key={idx} className="flex justify-between">
                            <span>• {doc.name}</span>
                            <span className="font-mono text-amber-700 font-bold">{doc.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedPartner(partner)}
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

      {/* Pagination (7 items per page) */}
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
        onClose={() => setSelectedPartner(null)}
        title={`Delivery Partner — ${selectedPartner?.name}`}
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
                <p className="text-[10px] uppercase font-bold text-[#8a87a6]">Rider ID</p>
                <p className="font-mono text-[#181829] font-bold text-[11px] mt-1">{selectedPartner._id}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f0f2fb] space-y-2">
              <h4 className="font-bold text-[#181829] uppercase text-[11px]">Submitted Documents</h4>
              <div className="space-y-2 pt-1">
                {selectedPartner.documents?.map((doc, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[#6339f4]" />
                      <span className="font-bold text-[#181829]">{doc.name}</span>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#ece8ff] flex items-center space-x-2 text-[11px] text-[#6339f4]">
              <ShieldCheck className="w-4 h-4 text-[#6339f4] shrink-0" />
              <span className="font-semibold">
                Master Admin monitors rider compliance and verification pipeline. Admin Operations manages document approvals.
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
