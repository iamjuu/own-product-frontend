import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  AlertCircle,
  Truck,
  CheckCircle2,
  Clock,
  Store,
  User,
  Eye,
  ShieldAlert
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../../components/common/MetricCard';
import { Modal, EmptyState } from '../../../components/common/Modal';
import { Pagination } from '../../../components/common/Pagination';

export const OrdersList = ({ defaultTab = 'pending' }) => {
  const { user } = useAuth();
  const apiPrefix = user?.role === 'ADMIN' ? '/admin' : '/master-admin';
  const [tab, setTab] = useState(defaultTab);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 7 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setTab(defaultTab);
    setCurrentPage(1);
  }, [defaultTab]);

  const fetchOrders = async (currentTab = tab, searchQuery = search, page = currentPage) => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get(`${apiPrefix}/orders`, {
        tab: currentTab,
        search: searchQuery,
        page: page,
        limit: 7,
      });
      if (response.success) {
        setOrders(response.data.orders);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchOrders(tab, search, 1);
  }, [tab]);

  useEffect(() => {
    fetchOrders(tab, search, currentPage);
  }, [currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders(tab, search, 1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Sub-Tabs */}
      <div className="theme-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[14px] font-normal text-[#181829] tracking-tight">
              Platform Orders Telemetry
            </h2>
            <p className="text-xs text-[#8a87a6] mt-0.5">
              Live monitoring of customer orders across all marketplace shops. Order transitions are strictly domain-managed.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, customer..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
            />
          </form>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <button
            onClick={() => setTab('pending')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
              tab === 'pending'
                ? 'bg-[#6339f4] text-white shadow-md shadow-[#6339f4]/25'
                : 'text-[#8a87a6] hover:text-[#181829] bg-[#f0f2fb]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Pending (Awaiting Pickup)</span>
          </button>

          <button
            onClick={() => setTab('in-progress')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
              tab === 'in-progress'
                ? 'bg-[#6339f4] text-white shadow-md shadow-[#6339f4]/25'
                : 'text-[#8a87a6] hover:text-[#181829] bg-[#f0f2fb]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>In Progress (Active Transit)</span>
          </button>

          <button
            onClick={() => setTab('completed')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
              tab === 'completed'
                ? 'bg-[#6339f4] text-white shadow-md shadow-[#6339f4]/25'
                : 'text-[#8a87a6] hover:text-[#181829] bg-[#f0f2fb]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed & Historical</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#8a87a6]">Loading orders...</div>
      ) : orders.length === 0 ? (
        <EmptyState
          title={`No ${tab.replace('-', ' ')} orders found`}
          message="No active orders matching this criteria at this moment."
          icon={ShoppingBag}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map((order) => {
            const isUnassigned = !order.deliveryPartnerName;
            return (
              <div
                key={order._id}
                className="theme-card p-5 space-y-4 flex flex-col justify-between hover:border-purple-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-black text-[#6339f4]">
                        {order.orderNumber}
                      </span>
                      <div className="text-[11px] text-[#8a87a6] flex items-center space-x-1 mt-0.5 font-medium">
                        <Clock className="w-3 h-3 text-[#6339f4]" />
                        <span>
                          {new Date(order.placedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#f0f2fb]/70 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-[#181829]">
                      <User className="w-3.5 h-3.5 text-[#6339f4] shrink-0" />
                      <span className="font-bold">{order.customerName}</span>
                      <span className="text-[#8a87a6] text-[11px]">({order.customerPhone})</span>
                    </div>

                    <div className="flex items-center space-x-2 text-[#181829]">
                      <Store className="w-3.5 h-3.5 text-[#6339f4] shrink-0" />
                      <span className="font-medium text-[#181829]">{order.shopName}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a87a6]">
                      Items Ordered ({order.items?.length || 0})
                    </p>
                    <div className="space-y-1">
                      {order.items?.map((item, i) => (
                        <div key={i} className="text-xs text-[#181829] flex justify-between font-medium">
                          <span>
                            {item.quantity} × {item.name}
                          </span>
                          <span className="font-bold text-[#8a87a6]">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a87a6] mb-1.5">
                      Delivery Fleet Status
                    </p>
                    {isUnassigned ? (
                      <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0 animate-pulse text-amber-600" />
                        <span className="font-bold">No delivery partner assigned</span>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-2xl bg-[#ece8ff] border border-[#d8cfff] text-xs flex items-center justify-between text-[#6339f4]">
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-[#6339f4]" />
                          <span className="font-bold">{order.deliveryPartnerName}</span>
                        </div>
                        {order.deliveryDurationMinutes && (
                          <span className="text-[10px] text-[#8a87a6] font-mono font-bold">
                            {order.deliveryDurationMinutes} mins
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8a87a6] uppercase font-bold">Total Amount</span>
                    <div className="text-base font-black text-emerald-600">
                      ₹{order.totalAmount}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3.5 py-2 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white flex items-center space-x-1.5 shadow-md shadow-[#6339f4]/20 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination (7 items per page) */}
      {!isLoading && orders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          pageSize={7}
          onPageChange={setCurrentPage}
          itemName="orders"
        />
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Telemetry — ${selectedOrder?.orderNumber}`}
      >
        {selectedOrder && (
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-[#f0f2fb] flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#8a87a6]">Current Status</p>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-[#8a87a6]">Placed Timestamp</p>
                <p className="font-bold text-[#181829] font-mono mt-1">
                  {new Date(selectedOrder.placedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#f0f2fb]">
                <span className="text-[10px] text-[#8a87a6] font-bold uppercase">Customer</span>
                <p className="font-black text-[#181829] text-xs mt-1">{selectedOrder.customerName}</p>
                <p className="text-[#8a87a6] text-[11px]">{selectedOrder.customerPhone}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f0f2fb]">
                <span className="text-[10px] text-[#8a87a6] font-bold uppercase">Shop</span>
                <p className="font-black text-[#181829] text-xs mt-1">{selectedOrder.shopName}</p>
                <p className="text-[#8a87a6] text-[11px]">Merchant Fulfillment</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f0f2fb]">
                <span className="text-[10px] text-[#8a87a6] font-bold uppercase">Delivery Partner</span>
                <p className="font-black text-[#181829] text-xs mt-1">
                  {selectedOrder.deliveryPartnerName || 'Unassigned'}
                </p>
                <p className="text-[#8a87a6] text-[11px]">{selectedOrder.deliveryPartnerPhone || 'Pending'}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f0f2fb] space-y-2">
              <h4 className="font-bold text-[#181829] uppercase tracking-wider text-[11px]">
                Financial Settlement
              </h4>
              <div className="space-y-1.5 pt-1 text-[#181829]">
                <div className="flex justify-between text-[#8a87a6]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#181829]">₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-[#8a87a6]">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-[#181829]">₹{selectedOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-[#8a87a6]">
                  <span>Tax</span>
                  <span className="font-bold text-[#181829]">₹{selectedOrder.tax}</span>
                </div>
                <div className="h-px bg-slate-200 my-1"></div>
                <div className="flex justify-between text-[#181829] font-black text-sm">
                  <span>Customer Paid Total</span>
                  <span className="text-emerald-600">₹{selectedOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#6339f4] pt-1 font-bold">
                  <span>Platform Commission Cut (10%)</span>
                  <span>₹{selectedOrder.platformCommission}</span>
                </div>
                <div className="flex justify-between text-[11px] text-purple-700 font-bold">
                  <span>Merchant Net Settlement</span>
                  <span>₹{selectedOrder.shopSettlement}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#ece8ff] flex items-center space-x-2 text-[11px] text-[#6339f4]">
              <ShieldAlert className="w-4 h-4 text-[#6339f4] shrink-0" />
              <span className="font-semibold">
                Master Admin is in monitoring mode. Order status transitions are controlled exclusively by the Order domain service.
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
