import React, { useState, useEffect, useRef } from 'react';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Bell,
  Volume2,
  VolumeX,
  ChefHat,
  Bike,
  Sparkles,
  Phone,
  Flame,
  ArrowRight,
  RefreshCw,
  PackageCheck,
  Check
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { playOrderChime } from '../../../utils/soundAlert';

export const ShopOwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'preparing' | 'ready' | 'completed'
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const knownOrderIdsRef = useRef(new Set());
  const initialLoadRef = useRef(true);

  const fetchOrders = async (silenceChime = false) => {
    try {
      const res = await ApiClient.get('/shop-owner/orders', { limit: 50 });
      if (res.success && res.data) {
        const orderList = res.data.orders || [];
        setOrders(orderList);

        // Detect newly arrived incoming orders to trigger acoustic kitchen chime
        const incomingOrders = orderList.filter((o) => o.status === 'PLACED' || o.status === 'PENDING');
        let hasNewOrder = false;

        for (const order of incomingOrders) {
          if (!knownOrderIdsRef.current.has(order._id)) {
            knownOrderIdsRef.current.add(order._id);
            if (!initialLoadRef.current) {
              hasNewOrder = true;
            }
          }
        }

        if (hasNewOrder && isAudioEnabled && !silenceChime) {
          playOrderChime();
        }

        initialLoadRef.current = false;
      }
    } catch (err) {
      console.warn('Failed to load shop orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
    // Polling interval: live kitchen telemetry every 3.5 seconds
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 3500);

    return () => clearInterval(interval);
  }, [isAudioEnabled]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setProcessingId(orderId);
    try {
      const res = await ApiClient.patch(`/shop-owner/orders/${orderId}/status`, { status: newStatus });
      if (res.success) {
        await fetchOrders(true);
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setProcessingId(null);
    }
  };

  // Group orders into Kitchen pipeline categories
  const incomingOrders = orders.filter((o) => ['PLACED', 'PENDING'].includes(o.status));
  const preparingOrders = orders.filter((o) => ['ACCEPTED', 'CONFIRMED', 'PREPARING'].includes(o.status));
  const readyOrders = orders.filter((o) => ['READY_FOR_PICKUP', 'DELIVERY_PARTNER_ASSIGNED'].includes(o.status));
  const completedOrders = orders.filter((o) => ['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status));

  const filteredOrders = {
    incoming: incomingOrders,
    preparing: preparingOrders,
    ready: readyOrders,
    completed: completedOrders,
  }[activeTab] || [];

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* 1. Header Banner & Audio Chime Toggle */}
      <div className="theme-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF7622] flex items-center justify-center font-bold shadow-inner">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black text-[#181829] tracking-tight">
                Live Kitchen Display & Order Control
              </h1>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-[#8a87a6] mt-0.5 font-medium">
              Real-time restaurant tickets: accept orders, mark in-progress cooking, and signal delivery partners for pickup.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Audio Chime Test & Toggle */}
          <button
            onClick={() => {
              playOrderChime();
              setIsAudioEnabled(true);
            }}
            className="px-3.5 py-2 rounded-2xl bg-[#FFF4EC] hover:bg-[#FFE8D6] text-[#FF7622] border border-[#FF7622]/30 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs"
            title="Test Kitchen Alert Sound"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Test Bell Sound</span>
          </button>

          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
              isAudioEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isAudioEnabled ? 'Chime Alert: ON' : 'Chime Alert: MUTED'}</span>
          </button>

          <button
            onClick={() => fetchOrders(true)}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Kitchen Status Pipeline Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden ${
            activeTab === 'incoming'
              ? 'bg-[#FF7622] text-white border-[#FF7622] shadow-lg shadow-orange-500/25 ring-2 ring-orange-200'
              : 'bg-white text-[#181829] hover:bg-slate-50 border-slate-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">1. Incoming</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${activeTab === 'incoming' ? 'bg-white text-[#FF7622]' : 'bg-orange-100 text-[#FF7622]'}`}>
              {incomingOrders.length}
            </span>
          </div>
          <div className="text-base font-black mt-2">New Orders</div>
          <p className={`text-[11px] mt-0.5 ${activeTab === 'incoming' ? 'text-white/80' : 'text-slate-400'}`}>
            Needs kitchen acceptance
          </p>
        </button>

        <button
          onClick={() => setActiveTab('preparing')}
          className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden ${
            activeTab === 'preparing'
              ? 'bg-[#6339f4] text-white border-[#6339f4] shadow-lg shadow-purple-500/25 ring-2 ring-purple-200'
              : 'bg-white text-[#181829] hover:bg-slate-50 border-slate-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">2. In Progress</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${activeTab === 'preparing' ? 'bg-white text-[#6339f4]' : 'bg-purple-100 text-[#6339f4]'}`}>
              {preparingOrders.length}
            </span>
          </div>
          <div className="text-base font-black mt-2">Cooking / Prep</div>
          <p className={`text-[11px] mt-0.5 ${activeTab === 'preparing' ? 'text-white/80' : 'text-slate-400'}`}>
            Kitchen is preparing food
          </p>
        </button>

        <button
          onClick={() => setActiveTab('ready')}
          className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden ${
            activeTab === 'ready'
              ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/25 ring-2 ring-amber-200'
              : 'bg-white text-[#181829] hover:bg-slate-50 border-slate-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">3. Ready</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${activeTab === 'ready' ? 'bg-white text-amber-600' : 'bg-amber-100 text-amber-700'}`}>
              {readyOrders.length}
            </span>
          </div>
          <div className="text-base font-black mt-2">Ready for Pickup</div>
          <p className={`text-[11px] mt-0.5 ${activeTab === 'ready' ? 'text-white/80' : 'text-slate-400'}`}>
            Awaiting rider arrival
          </p>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-200'
              : 'bg-white text-[#181829] hover:bg-slate-50 border-slate-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">4. Dispatched</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${activeTab === 'completed' ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-700'}`}>
              {completedOrders.length}
            </span>
          </div>
          <div className="text-base font-black mt-2">Completed / Transit</div>
          <p className={`text-[11px] mt-0.5 ${activeTab === 'completed' ? 'text-white/80' : 'text-slate-400'}`}>
            Handed over to rider
          </p>
        </button>
      </div>

      {/* 3. Live Order Tickets Grid */}
      {filteredOrders.length === 0 ? (
        <div className="theme-card p-14 text-center space-y-3 border border-slate-100">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-[#181829]">
            No {activeTab.replace('-', ' ')} orders in the queue
          </h3>
          <p className="text-xs text-[#8a87a6] max-w-sm mx-auto">
            {activeTab === 'incoming'
              ? 'All incoming tickets have been processed. New customer orders will ring the bell immediately.'
              : 'Tickets will move here as order status transitions.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => {
            const isProcessing = processingId === order._id;

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Ticket Top Header */}
                <div className="p-5 border-b border-slate-100 bg-[#FAFAFC] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-black text-[#6339f4] bg-[#ece8ff] px-2.5 py-0.5 rounded-xl">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === 'PLACED'
                          ? 'bg-rose-100 text-rose-600 animate-pulse'
                          : order.status === 'PREPARING'
                          ? 'bg-purple-100 text-[#6339f4]'
                          : order.status === 'READY_FOR_PICKUP'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#8a87a6]">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#FF7622]" />
                      <span>
                        {new Date(order.placedAt || order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span className="font-bold text-[#181829]">₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Customer & Items Details */}
                <div className="p-5 space-y-4 flex-1">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#181829] flex items-center justify-between">
                      <span>{order.customerName}</span>
                      <span className="text-[11px] text-slate-400 font-normal">{order.customerPhone}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {order.deliveryAddress?.street || 'Customer Address'}
                    </p>
                  </div>

                  {/* Order Items List */}
                  <div className="bg-[#F8F9FD] rounded-2xl p-3.5 space-y-2 border border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#8a87a6] block">
                      Kitchen Items ({order.items?.length || 0})
                    </span>
                    <div className="divide-y divide-slate-200/60 max-h-36 overflow-y-auto">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#181829] flex items-center space-x-1.5">
                            <span className="text-[#FF7622] font-black">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </span>
                          <span className="font-bold text-slate-600">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rider Assignment Info */}
                  {order.deliveryPartnerName && (
                    <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Bike className="w-4 h-4 text-[#6339f4]" />
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Assigned Rider</span>
                          <span className="font-bold text-[#181829]">{order.deliveryPartnerName}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-[#6339f4] font-bold">
                        {order.deliveryPartnerPhone || '+91 98765 43210'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Interactive Status Action Buttons */}
                <div className="p-5 border-t border-slate-100 bg-[#FAFAFC] space-y-2">
                  {order.status === 'PLACED' && (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleUpdateStatus(order._id, 'ACCEPTED')}
                      className="w-full py-3 rounded-2xl bg-[#FF7622] hover:bg-[#E56314] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Order Ticket</span>
                    </button>
                  )}

                  {order.status === 'ACCEPTED' && (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleUpdateStatus(order._id, 'PREPARING')}
                      className="w-full py-3 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Start Food Cooking / Prep (In Progress)</span>
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleUpdateStatus(order._id, 'READY_FOR_PICKUP')}
                      className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Complete Food & Mark Ready for Pickup</span>
                    </button>
                  )}

                  {order.status === 'READY_FOR_PICKUP' && (
                    <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-center text-xs font-bold flex items-center justify-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Broadcasting to Delivery Boys...</span>
                    </div>
                  )}

                  {['DELIVERY_PARTNER_ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.status) && (
                    <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-[#6339f4] text-center text-xs font-bold flex items-center justify-center space-x-1.5">
                      <Bike className="w-3.5 h-3.5" />
                      <span>Rider Dispatched ({order.status.replace(/_/g, ' ')})</span>
                    </div>
                  )}

                  {order.status === 'DELIVERED' && (
                    <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-center text-xs font-bold flex items-center justify-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Delivered Successfully</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
