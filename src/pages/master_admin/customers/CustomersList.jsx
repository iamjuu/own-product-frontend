import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Wallet,
  ShoppingBag,
  Eye,
  ShieldCheck
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../../components/common/MetricCard';
import { Modal, EmptyState } from '../../../components/common/Modal';
import { Pagination } from '../../../components/common/Pagination';

export const CustomersList = () => {
  const { user } = useAuth();
  const apiPrefix = user?.role === 'ADMIN' ? '/admin' : '/master-admin';
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 7 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async (currentFilter = filter, searchQuery = search, page = currentPage) => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get(`${apiPrefix}/customers`, {
        filter: currentFilter,
        search: searchQuery,
        page: page,
        limit: 7,
      });
      if (response.success) {
        setCustomers(response.data.customers);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchCustomers(filter, search, 1);
  }, [filter]);

  useEffect(() => {
    fetchCustomers(filter, search, currentPage);
  }, [currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers(filter, search, 1);
  };

  const filterTabs = [
    { label: 'All Customers', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'High Activity', value: 'high_activity' },
    { label: 'New', value: 'new' },
    { label: 'Inactive', value: 'inactive' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Controls */}
      <div className="theme-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
              Customer Accounts & Wallets
            </h2>
            <p className="text-xs text-[#8a87a6] mt-0.5">
              Platform-wide customer telemetry, cumulative spendings, and wallet balances.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer name..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
            />
          </form>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {filterTabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilter(t.value)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                filter === t.value
                  ? 'bg-[#6339f4] text-white shadow-md shadow-[#6339f4]/25'
                  : 'text-[#8a87a6] hover:text-[#181829] bg-[#f0f2fb]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#8a87a6]">Loading customers...</div>
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers found"
          message="No customers matching the current filter criteria."
          icon={Users}
        />
      ) : (
        <div className="theme-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-[#f0f2fb]/60 text-[11px] font-black uppercase tracking-wider text-[#8a87a6]">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Orders</th>
                  <th className="p-4">Total Spending</th>
                  <th className="p-4">Wallet Balance</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-[#181829]">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-black text-[#181829] text-xs">{customer.name}</div>
                      <div className="text-[11px] text-[#8a87a6]">{customer.email}</div>
                    </td>

                    <td className="p-4">
                      <StatusBadge status={customer.status} />
                    </td>

                    <td className="p-4 font-bold text-[#181829]">
                      {customer.orderCount} orders
                    </td>

                    <td className="p-4 font-black text-emerald-600">
                      ₹{customer.totalSpending?.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4">
                      <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#ece8ff] text-[#6339f4] font-black">
                        <Wallet className="w-3.5 h-3.5" />
                        <span>₹{customer.walletBalance}</span>
                      </div>
                    </td>

                    <td className="p-4 text-[#8a87a6] font-mono text-[11px]">
                      {new Date(customer.registrationDate || customer.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#ece8ff] hover:bg-[#6339f4] hover:text-white text-[#6339f4] font-bold text-[11px] transition-all"
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
      {!isLoading && customers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          pageSize={7}
          onPageChange={setCurrentPage}
          itemName="customers"
        />
      )}

      {/* Customer Detail Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={`Customer Profile — ${selectedCustomer?.name}`}
      >
        {selectedCustomer && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#f0f2fb] grid grid-cols-2 gap-3 text-[#181829]">
              <div>
                <span className="text-[10px] text-[#8a87a6] font-semibold uppercase">Email:</span>
                <p className="font-mono font-bold mt-0.5">{selectedCustomer.email}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#8a87a6] font-semibold uppercase">Phone:</span>
                <p className="font-mono font-bold mt-0.5">{selectedCustomer.phone}</p>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-[#8a87a6] font-semibold uppercase">Registered Address:</span>
                <p className="font-medium mt-0.5">{selectedCustomer.address?.street}, {selectedCustomer.address?.city}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#ece8ff]">
                <span className="text-[10px] text-[#6339f4] font-black uppercase">Lifetime Spending</span>
                <p className="text-xl font-black text-[#181829] mt-1">₹{selectedCustomer.totalSpending}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#ece8ff]">
                <span className="text-[10px] text-[#6339f4] font-black uppercase">Wallet Balance</span>
                <p className="text-xl font-black text-[#181829] mt-1">₹{selectedCustomer.walletBalance}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#ece8ff] flex items-center space-x-2 text-[11px] text-[#6339f4]">
              <ShieldCheck className="w-4 h-4 text-[#6339f4] shrink-0" />
              <span className="font-semibold">Customer PII data is encrypted and masked on the platform.</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
