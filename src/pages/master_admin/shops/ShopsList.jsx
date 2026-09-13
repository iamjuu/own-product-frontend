import React, { useState, useEffect } from 'react';
import {
  Store,
  Search,
  Star,
  Clock,
  MapPin,
  Eye,
  ShieldAlert,
  LayoutGrid,
  List
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { StatusBadge } from '../../../components/common/MetricCard';
import { Modal, EmptyState } from '../../../components/common/Modal';
import { Pagination } from '../../../components/common/Pagination';
import { usePlatform } from '../../../context/PlatformContext';

export const ShopsList = () => {
  const { settings } = usePlatform();
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 7 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);

  const fetchShops = async (page = currentPage, query = search, status = statusFilter) => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get('/master-admin/shops', {
        search: query,
        status: status,
        page: page,
        limit: 7,
      });
      if (response.success) {
        setShops(response.data.shops);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load shops:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchShops(1, search, statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    fetchShops(currentPage, search, statusFilter);
  }, [currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchShops(1, search, statusFilter);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Controls Section */}
      <div className="theme-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
              Platform Shops Monitoring
            </h2>
            <p className="text-xs text-[#8a87a6] mt-0.5">
              Platform-level merchant oversight. Product & catalog management is isolated to Shop Owners & Operations Admin.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search shop or owner..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
              />
            </form>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="TEMPORARILY_CLOSED">Temporarily Closed</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Sub-Section with Telemetry & Grid/List View Toggles */}
      <div className="theme-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#ece8ff] text-[#6339f4] font-medium">
            <Store className="w-4 h-4" />
            <span>Total Shops: <strong className="font-semibold text-[#181829]">{shops.length}</strong></span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active: {shops.filter((s) => s.status === 'ACTIVE').length}</span>
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

      {/* 3. Shops Content (Grid or Table) */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#8a87a6]">Loading shops telemetry...</div>
      ) : shops.length === 0 ? (
        <EmptyState
          title="No shops found"
          message="No active shops matching the filter criteria."
          icon={Store}
        />
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shops.map((shop) => (
            <div
              key={shop._id}
              className="theme-card p-5 space-y-4 flex flex-col justify-between hover:border-purple-200"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        shop.logoUrl ||
                        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80'
                      }
                      alt={shop.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#ece8ff]"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-[#181829]">
                        {shop.name}
                      </h3>
                      <p className="text-[11px] text-[#6339f4]">{shop.category}</p>
                    </div>
                  </div>
                  <StatusBadge status={shop.status} />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f0f2fb]/70 border border-slate-100 space-y-1.5 text-xs text-[#181829]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8a87a6] text-[11px]">Merchant Owner:</span>
                    <span className="font-medium">{shop.ownerName}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[#8a87a6] text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-[#6339f4] shrink-0" />
                    <span className="truncate">{shop.address?.street}, {shop.address?.city}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-2xl bg-[#f0f2fb] text-center">
                    <span className="text-[10px] text-[#8a87a6] uppercase">Hours</span>
                    <p className="text-[#181829] font-medium text-[11px] mt-0.5">
                      {shop.openingTime} - {shop.closingTime}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-[#f0f2fb] text-center">
                    <span className="text-[10px] text-[#8a87a6] uppercase">Coverage</span>
                    <p className="text-[#181829] font-medium text-[11px] mt-0.5">
                      {shop.deliveryRadiusKm} km radius
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center space-x-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-[#181829] font-semibold">{shop.rating}</span>
                    <span className="text-[#8a87a6] text-[11px]">({shop.totalOrders} orders)</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#8a87a6] uppercase">Sales</span>
                    <p className="text-emerald-600 font-semibold text-xs">
                      ₹{shop.totalSales?.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedShop(shop)}
                  className="px-4 py-2 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-medium text-white flex items-center space-x-1.5 shadow-md shadow-[#6339f4]/20 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Store</span>
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
                  <th className="p-4">Store / Merchant</th>
                  <th className="p-4">Owner & Contact</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Operating Hours</th>
                  <th className="p-4">Coverage</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Total Sales</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#181829]">
                {shops.map((shop) => (
                  <tr key={shop._id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            shop.logoUrl ||
                            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80'
                          }
                          alt={shop.name}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#ece8ff] shrink-0"
                        />
                        <div>
                          <div className="text-xs font-semibold text-[#181829]">{shop.name}</div>
                          <div className="text-[11px] text-[#6339f4]">{shop.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-[#181829]">{shop.ownerName}</div>
                      <div className="text-[11px] text-[#8a87a6]">{shop.phone || shop.ownerEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1 text-[#8a87a6] text-[11px] max-w-[180px] truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#6339f4] shrink-0" />
                        <span className="truncate">{shop.address?.street}, {shop.address?.city}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-medium text-[#181829]">
                        {shop.openingTime} - {shop.closingTime}
                      </div>
                    </td>
                    <td className="p-4 text-[11px] text-[#8a87a6]">
                      {shop.deliveryRadiusKm} km radius
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-[#181829] font-semibold text-xs">{shop.rating}</span>
                        <span className="text-[#8a87a6] text-[10px]">({shop.totalOrders})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-semibold text-emerald-600">
                        ₹{shop.totalSales?.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={shop.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedShop(shop)}
                        className="px-3 py-1.5 rounded-xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-medium text-white inline-flex items-center space-x-1 shadow-sm transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
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
      {!isLoading && shops.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          pageSize={7}
          onPageChange={setCurrentPage}
          itemName="shops"
        />
      )}

      {/* Shop Detail Modal */}
      <Modal
        isOpen={!!selectedShop}
        onClose={() => setSelectedShop(null)}
        title={`Shop Details — ${selectedShop?.name}`}
      >
        {selectedShop && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#ece8ff] space-y-2">
              <h4 className="font-medium text-[#6339f4] text-xs flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Operating Windows Comparison</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-[#181829] pt-1 font-normal">
                <div>
                  <span className="text-[10px] text-[#8a87a6] uppercase font-normal">
                    Marketplace Platform Window:
                  </span>
                  <p className="text-[#181829] font-medium mt-0.5">
                    {settings.openingTime} - {settings.closingTime}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-[#8a87a6] uppercase font-normal">
                    Shop Operational Window:
                  </span>
                  <p className="text-[#6339f4] font-medium mt-0.5">
                    {selectedShop.openingTime} - {selectedShop.closingTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f0f2fb] space-y-2">
              <h4 className="font-medium text-[#181829] uppercase text-[11px]">Merchant Contact & Address</h4>
              <div className="grid grid-cols-2 gap-3 text-[#181829]">
                <div>
                  <span className="text-[10px] text-[#8a87a6] font-normal">Owner Email:</span>
                  <p className="font-mono font-medium mt-0.5">{selectedShop.ownerEmail}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#8a87a6] font-normal">Phone:</span>
                  <p className="font-mono font-medium mt-0.5">{selectedShop.phone}</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#ece8ff] flex items-center space-x-2 text-[11px] text-[#6339f4]">
              <ShieldAlert className="w-4 h-4 text-[#6339f4] shrink-0" />
              <span className="font-normal">
                Master Admin monitors store metrics and compliance. Product inventories and menus are controlled by the Shop Owner.
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
