import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  ShoppingBag, 
  CreditCard, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  KeyRound, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Package,
  Heart,
  Plus,
  Search,
  Copy,
  Check,
  Store,
  ChefHat,
  Utensils,
  Receipt,
  Calendar,
  AlertCircle,
  Filter,
  ExternalLink,
  Bike
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import ApiClient from '../../../api/client';
import { LiveDeliveryTrackingModal } from '../../../components/tracking/LiveDeliveryTrackingModal';

export const UserProfilePage = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'wallet'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const [reorderingId, setReorderingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      setLoadingOrders(true);
      ApiClient.get('/user/orders')
        .then((res) => {
          if (isMounted && res.data) {
            const orderList = Array.isArray(res.data) 
              ? res.data 
              : (Array.isArray(res.data.orders) ? res.data.orders : []);
            setOrders(orderList);
          }
        })
        .catch((err) => {
          console.warn('Could not fetch user orders:', err);
          if (isMounted) setOrders([]);
        })
        .finally(() => {
          if (isMounted) setLoadingOrders(false);
        });
    } else {
      setLoadingOrders(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Copy order ID to clipboard
  const handleCopyOrderId = (orderNumber) => {
    if (!orderNumber) return;
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderId(orderNumber);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Reorder items
  const handleReorder = async (order) => {
    if (!order.items || order.items.length === 0) return;
    setReorderingId(order._id || order.id);
    for (const item of order.items) {
      await addToCart({
        _id: item.productId || item._id,
        name: item.name,
        price: item.price,
        image: item.image,
      }, item.quantity || 1);
    }
    setReorderingId(null);
  };

  // Genuine KPI Metrics calculated directly from the user's order data
  const activeOrdersCount = useMemo(() => {
    const safeOrders = Array.isArray(orders) ? orders : [];
    return safeOrders.filter((o) => !['DELIVERED', 'CANCELLED'].includes(o.status)).length;
  }, [orders]);

  const deliveredOrdersCount = useMemo(() => {
    const safeOrders = Array.isArray(orders) ? orders : [];
    return safeOrders.filter((o) => o.status === 'DELIVERED').length;
  }, [orders]);

  const totalSpent = useMemo(() => {
    const safeOrders = Array.isArray(orders) ? orders : [];
    return safeOrders
      .filter((o) => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + (Number(o.totalAmount || o.total) || 0), 0);
  }, [orders]);

  // Genuine account creation date
  const memberSince = useMemo(() => {
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    }
    const safeOrders = Array.isArray(orders) ? orders : [];
    if (safeOrders.length > 0 && safeOrders[safeOrders.length - 1]?.createdAt) {
      return new Date(safeOrders[safeOrders.length - 1].createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    }
    return null;
  }, [user, orders]);

  // Genuine saved addresses dynamically extracted from user profile & genuine placed orders
  const savedAddresses = useMemo(() => {
    const list = [];
    if (user?.address?.street) {
      const uAddr = [user.address.street, user.address.city, user.address.state, user.address.pincode].filter(Boolean).join(', ');
      list.push({
        id: 'primary',
        tag: 'Profile Address',
        title: user?.name ? `${user.name}'s Address` : 'Primary Address',
        address: uAddr,
        phone: user?.phone || '',
        isDefault: true,
      });
    }
    const safeOrders = Array.isArray(orders) ? orders : [];
    safeOrders.forEach((ord) => {
      if (ord.deliveryAddress?.street) {
        const fullAddr = [ord.deliveryAddress.street, ord.deliveryAddress.city, ord.deliveryAddress.state, ord.deliveryAddress.pincode].filter(Boolean).join(', ');
        if (fullAddr && !list.some((a) => a.address.toLowerCase() === fullAddr.toLowerCase())) {
          list.push({
            id: ord._id || ord.orderNumber,
            tag: 'Order Destination',
            title: ord.shopName ? `Delivered from ${ord.shopName}` : `Order #${ord.orderNumber || ''}`,
            address: fullAddr,
            phone: ord.customerPhone || user?.phone || '',
            isDefault: list.length === 0,
          });
        }
      }
    });
    return list;
  }, [user, orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    const safeOrders = Array.isArray(orders) ? orders : [];
    return safeOrders.filter((order) => {
      // 1. Status Filter
      if (statusFilter === 'ACTIVE') {
        if (['DELIVERED', 'CANCELLED'].includes(order.status)) return false;
      } else if (statusFilter === 'DELIVERED') {
        if (order.status !== 'DELIVERED') return false;
      } else if (statusFilter === 'CANCELLED') {
        if (order.status !== 'CANCELLED') return false;
      }

      // 2. Search Query (orderNumber, shopName, or item name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = (order.orderNumber || order._id || order.id || '').toLowerCase().includes(q);
        const matchesShop = (order.shopName || '').toLowerCase().includes(q);
        const matchesItem = order.items?.some((i) => (i.name || '').toLowerCase().includes(q));
        if (!matchesNum && !matchesShop && !matchesItem) return false;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Helper for Order Status Visuals
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return {
          label: 'Order Placed',
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          dot: 'bg-blue-500',
          stepIndex: 0,
        };
      case 'CONFIRMED':
        return {
          label: 'Order Confirmed',
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          dot: 'bg-indigo-500',
          stepIndex: 1,
        };
      case 'PREPARING':
        return {
          label: 'Cooking in Kitchen',
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
          stepIndex: 1,
        };
      case 'READY_FOR_PICKUP':
        return {
          label: 'Food Ready for Pickup',
          bg: 'bg-cyan-50',
          text: 'text-cyan-800',
          border: 'border-cyan-200',
          dot: 'bg-cyan-500 animate-pulse',
          stepIndex: 2,
        };
      case 'OUT_FOR_DELIVERY':
        return {
          label: 'Out for Delivery',
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          dot: 'bg-purple-500 animate-ping',
          stepIndex: 3,
        };
      case 'DELIVERED':
        return {
          label: 'Delivered',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500',
          stepIndex: 4,
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          dot: 'bg-rose-500',
          stepIndex: -1,
        };
      default:
        return {
          label: status?.replace(/_/g, ' ') || 'Processing',
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-slate-400',
          stepIndex: 0,
        };
    }
  };

  const stepsList = [
    { label: 'Placed', icon: Package },
    { label: 'Cooking', icon: ChefHat },
    { label: 'Food Ready', icon: Utensils },
    { label: 'On Route', icon: Bike },
    { label: 'Delivered', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-8 px-4 sm:px-6 lg:px-8 font-sans pb-28 md:pb-16 text-[#181C2E]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold">
          <button onClick={() => onNavigate?.('home')} className="hover:text-[#FF7622] transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-[#FF7622]">Customer Account & Orders</span>
        </div>

        {/* Profile Snapshot Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-100/40 via-transparent to-transparent pointer-events-none rounded-bl-full" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* User Info */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#FF7622] to-[#FF9344] text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shadow-orange-500/25 shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#181C2E] tracking-tight">
                    {user?.name || 'Customer Account'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-[#FF7622] border border-orange-200">
                    Verified Customer
                  </span>
                </div>
                {user?.email && (
                  <p className="text-xs text-slate-500 font-medium flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#FF7622]" />
                    <span>{user.email}</span>
                  </p>
                )}
                {memberSince && (
                  <div className="flex items-center space-x-2 pt-0.5 text-[11px] font-bold text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Member since {memberSince}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Genuine KPI Stats (Dynamically Computed) */}
            <div className="grid grid-cols-3 gap-3 bg-[#FAFBFD] p-3 rounded-2xl border border-slate-100/90 text-center">
              <div className="px-3 py-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Active</p>
                <p className="text-lg font-black text-[#FF7622]">{activeOrdersCount}</p>
              </div>
              <div className="px-3 py-1 border-x border-slate-200/60">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Delivered</p>
                <p className="text-lg font-black text-emerald-600">{deliveredOrdersCount}</p>
              </div>
              <div className="px-3 py-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Spent</p>
                <p className="text-lg font-black text-[#181C2E]">₹{totalSpent.toFixed(0)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onNavigate?.('shop')}
                className="px-4 py-2.5 rounded-xl bg-[#FFF4EC] text-[#FF7622] hover:bg-[#FFE6D7] font-black text-xs transition-all flex items-center space-x-1.5 shadow-2xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Fresh</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  onNavigate?.('home');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-black text-xs transition-all flex items-center space-x-1.5"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-200/80 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: orders.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: savedAddresses.length },
            { id: 'wallet', label: 'Wallet & Rewards', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#181C2E] text-white shadow-md shadow-slate-900/10'
                    : 'bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF7622]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-[#FF7622] text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">

            {/* Controls Bar: Search & Status Filters */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/70 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by order #, store, or food items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F8F9FC] border border-slate-200/70 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#FF7622] focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Status Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {[
                    { key: 'ALL', label: 'All Orders', count: orders.length },
                    { key: 'ACTIVE', label: 'Active Radar', count: activeOrdersCount },
                    { key: 'DELIVERED', label: 'Delivered', count: deliveredOrdersCount },
                    { key: 'CANCELLED', label: 'Cancelled', count: orders.filter((o) => o.status === 'CANCELLED').length },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setStatusFilter(f.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center space-x-1.5 border ${
                        statusFilter === f.key
                          ? 'bg-[#FF7622] text-white border-[#FF7622] shadow-xs'
                          : 'bg-[#FAFBFD] text-slate-600 border-slate-200/70 hover:bg-slate-100'
                      }`}
                    >
                      <span>{f.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        statusFilter === f.key ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                      }`}>
                        {f.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders Feed */}
            {loadingOrders ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-[#FF7622] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-400">Loading your genuine orders...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusBadge(order.status);
                  const isDelivered = order.status === 'DELIVERED';
                  const isCancelled = order.status === 'CANCELLED';
                  const isActive = !isDelivered && !isCancelled;
                  const currentStepIdx = statusInfo.stepIndex;

                  const orderIdString = order.orderNumber || order._id || order.id || '';
                  const displayDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : (order.placedAt ? new Date(order.placedAt).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  }) : '');

                  const paymentModeLabel = order.paymentMethod === 'COD' || order.paymentMethod === 'OFFLINE'
                    ? '💵 Cash on Delivery'
                    : (order.paymentMethod ? `💳 Paid Online (${order.paymentMethod})` : 'Payment Status: ' + (order.paymentStatus || 'Pending'));

                  // Genuine address resolution
                  const addrStreet = order.deliveryAddress?.street || order.deliveryAddress?.addressLine || '';
                  const addrCity = order.deliveryAddress?.city || '';
                  const addrPin = order.deliveryAddress?.pincode ? `, ${order.deliveryAddress.pincode}` : '';
                  const formattedAddress = [addrStreet, addrCity].filter(Boolean).join(', ') + addrPin;

                  return (
                    <div 
                      key={orderIdString}
                      className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden hover:border-[#FF7622]/40 transition-all hover:shadow-md"
                    >
                      {/* CARD TOP BAR: Identity, Status, Store, Date, and OTP */}
                      <div className="p-5 sm:p-6 border-b border-slate-100 bg-[#FCFDFE]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          {/* Left: Order Info & Store */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2.5">
                              {/* Order ID + Copy Button */}
                              <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded-xl">
                                <span className="font-mono text-xs font-black text-[#181C2E]">
                                  #{order.orderNumber || orderIdString.slice(-8)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyOrderId(order.orderNumber || orderIdString)}
                                  className="text-slate-400 hover:text-[#FF7622] transition-colors p-0.5"
                                  title="Copy Order ID"
                                >
                                  {copiedOrderId === (order.orderNumber || orderIdString) ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>

                              {/* Status Badge */}
                              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                                <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                                <span>{statusInfo.label}</span>
                              </span>

                              {/* Restaurant / Store Badge (Prominent) */}
                              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-black bg-orange-100/90 text-[#FF7622] border border-orange-200">
                                <Store className="w-3.5 h-3.5 text-[#FF7622]" />
                                <span>Restaurant: {order.shopName || 'Partner Restaurant'}</span>
                              </span>
                            </div>

                            {/* Date & Payment Mode */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                              {displayDate && (
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{displayDate}</span>
                                </span>
                              )}
                              <span>•</span>
                              <span className="font-bold text-slate-600">
                                {paymentModeLabel}
                              </span>
                            </div>
                          </div>

                          {/* Right: Genuine Doorstep OTP or Delivery Badge */}
                          <div className="flex items-center gap-3">
                            {isActive && order.deliveryOtp && (
                              <div className="bg-gradient-to-r from-orange-500 to-[#FF7622] text-white rounded-2xl px-4 py-2.5 flex items-center space-x-3 shadow-md shadow-orange-500/20">
                                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
                                  <KeyRound className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <span className="text-[9px] font-black uppercase tracking-wider text-orange-100 block">
                                    Doorstep OTP
                                  </span>
                                  <span className="text-xl font-black tracking-widest leading-none font-mono">
                                    {order.deliveryOtp}
                                  </span>
                                </div>
                              </div>
                            )}

                            {isDelivered && (
                              <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200 flex items-center space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Delivered Successfully</span>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Order Journey Stepper (Only for active / delivered orders) */}
                        {!isCancelled && (
                          <div className="mt-6 pt-5 border-t border-slate-100">
                            <div className="relative">
                              {/* Progress bar background line */}
                              <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-0 rounded-full" />
                              
                              {/* Filled progress bar */}
                              <div 
                                className="absolute top-4 left-6 h-1 bg-[#FF7622] -z-0 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, Math.max(0, (currentStepIdx / (stepsList.length - 1)) * 100))}%`
                                }}
                              />

                              {/* Stepper items */}
                              <div className="flex justify-between items-start relative z-10">
                                {stepsList.map((step, idx) => {
                                  const StepIcon = step.icon;
                                  const isPassed = currentStepIdx >= idx;
                                  const isCurrent = currentStepIdx === idx;

                                  return (
                                    <div key={step.label} className="flex flex-col items-center space-y-1.5 text-center">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                        isCurrent 
                                          ? 'bg-[#FF7622] text-white ring-4 ring-orange-100 shadow-sm scale-110' 
                                          : isPassed 
                                            ? 'bg-emerald-600 text-white' 
                                            : 'bg-white text-slate-300 border border-slate-200'
                                      }`}>
                                        <StepIcon className="w-4 h-4" />
                                      </div>
                                      <span className={`text-[10px] sm:text-xs font-black tracking-tight ${
                                        isCurrent 
                                          ? 'text-[#FF7622]' 
                                          : isPassed 
                                            ? 'text-slate-800' 
                                            : 'text-slate-400'
                                      }`}>
                                        {step.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Kitchen / Cooking Note Callout (ONLY if restaurant actually provided notes/duration) */}
                        {(order.kitchenMessage || (typeof order.cookingTimeMinutes === 'number' && order.cookingTimeMinutes > 0)) && order.status !== 'DELIVERED' && (
                          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                              <ChefHat className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              {order.kitchenMessage && (
                                <p className="text-xs font-black text-amber-900 flex items-center space-x-1.5">
                                  <span>Kitchen Message:</span>
                                  <span className="font-medium italic">"{order.kitchenMessage}"</span>
                                </p>
                              )}
                              {typeof order.cookingTimeMinutes === 'number' && order.cookingTimeMinutes > 0 && (
                                <p className="text-[11px] text-amber-700 font-bold">
                                  ⏱️ Estimated Prep Time: <span className="underline">{order.cookingTimeMinutes} minutes</span>
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CARD BODY: ORDERED ITEMS & DETAILS */}
                      <div className="p-5 sm:p-6 space-y-5">
                        
                        {/* Ordered Items Manifest */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                              Order Items ({order.items?.length || 0})
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                              Inclusive of all taxes
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100 bg-[#FAFBFD] rounded-2xl border border-slate-100 p-2 sm:p-3">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between py-3 px-2">
                                <div className="flex items-center space-x-3.5">
                                  {/* Item Photo / Icon */}
                                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                                    {item.image ? (
                                      <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                    ) : (
                                      <Package className="w-5 h-5 text-[#FF7622]" />
                                    )}
                                  </div>

                                  <div>
                                    <h4 className="text-xs sm:text-sm font-black text-[#181C2E]">
                                      {item.name}
                                    </h4>
                                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-bold mt-0.5">
                                      <span className="px-1.5 py-0.2 rounded-md bg-orange-100/70 text-[#FF7622] font-black">
                                        Qty: {item.quantity || 1}
                                      </span>
                                      <span>•</span>
                                      <span>₹{item.price} each</span>
                                    </div>
                                    {item.specialInstructions && (
                                      <p className="text-[10px] text-slate-500 italic mt-0.5">
                                        Note: {item.specialInstructions}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="text-right">
                                  <p className="text-xs sm:text-sm font-black text-[#181C2E]">
                                    ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Restaurant & Delivery Destination Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          
                          {/* Preparing Restaurant Card */}
                          <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/70 flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-[#FF7622] text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <Store className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF7622] block">
                                Preparing Restaurant
                              </span>
                              <p className="text-xs font-black text-[#181C2E]">
                                {order.shopName || 'Partner Restaurant'}
                              </p>
                              <p className="text-[11px] text-slate-500 font-medium">
                                Fresh preparation & cooking handled directly by the store
                              </p>
                            </div>
                          </div>

                          {/* Drop-off Address Card */}
                          <div className="p-4 rounded-2xl bg-white border border-slate-200/70 flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                              <MapPin className="w-4 h-4 text-[#FF7622]" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                Delivery Destination
                              </span>
                              {formattedAddress ? (
                                <>
                                  <p className="text-xs font-bold text-slate-800 leading-snug">
                                    {addrStreet}
                                  </p>
                                  {(addrCity || addrPin) && (
                                    <p className="text-[11px] text-slate-400">
                                      {addrCity}{addrPin}
                                    </p>
                                  )}
                                </>
                              ) : (
                                <p className="text-xs font-medium text-slate-500">
                                  Standard Delivery Address
                                </p>
                              )}
                            </div>
                          </div>

                        </div>

                        {/* Assigned Rider Card (ONLY SHOWN IF A DELIVERY BOY HAS ACTUALLY ACCEPTED THE ORDER) */}
                        {order.deliveryPartnerId && order.deliveryPartnerName && (
                          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <Bike className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5 flex-1">
                              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                                Assigned Delivery Partner
                              </span>
                              <p className="text-xs font-black text-slate-800">
                                {order.deliveryPartnerName}
                              </p>
                              {order.deliveryPartnerPhone && (
                                <a 
                                  href={`tel:${order.deliveryPartnerPhone}`}
                                  className="text-[11px] text-emerald-700 hover:underline font-bold inline-flex items-center space-x-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{order.deliveryPartnerPhone}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Bill Summary & Actions Row */}
                        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          
                          {/* Genuine Financial Summary */}
                          <div className="flex items-center space-x-6">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Items Subtotal
                              </span>
                              <span className="text-xs font-bold text-slate-600">
                                ₹{(order.subtotal || order.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0).toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Delivery Fee
                              </span>
                              <span className="text-xs font-bold text-emerald-600">
                                {typeof order.deliveryFee === 'number'
                                  ? (order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee.toFixed(2)}`)
                                  : 'FREE'}
                              </span>
                            </div>
                            <div className="pl-4 border-l border-slate-200">
                              <span className="text-[10px] uppercase font-black text-slate-400 block">
                                Total Amount
                              </span>
                              <span className="text-lg font-black text-[#FF7622]">
                                ₹{(order.totalAmount || order.total || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-3">
                            {isActive ? (
                              <button
                                type="button"
                                onClick={() => setTrackingOrder(order)}
                                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF7622] to-[#FF8C38] hover:from-[#E56314] hover:to-[#FF7622] text-white text-xs font-black transition-all shadow-md shadow-orange-500/20 flex items-center space-x-2 active:scale-95"
                              >
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                                </span>
                                <span>Track Live Radar</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={reorderingId === orderIdString}
                                onClick={() => handleReorder(order)}
                                className="px-4 py-2.5 rounded-2xl bg-[#181C2E] hover:bg-slate-800 text-white text-xs font-black transition-all shadow-sm flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
                              >
                                <Utensils className="w-3.5 h-3.5" />
                                <span>{reorderingId === orderIdString ? 'Adding...' : 'Reorder Items'}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => onNavigate?.('shop')}
                              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                            >
                              Explore Store
                            </button>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF7622] flex items-center justify-center mx-auto shadow-inner">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-[#181C2E]">No Orders Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {searchQuery 
                      ? `No orders matching "${searchQuery}". Try clearing search filters.`
                      : "You have not placed any orders in this view yet."}
                  </p>
                </div>
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('ALL');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                  >
                    Clear Search Filters
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate?.('shop')}
                    className="px-6 py-3 rounded-2xl bg-[#FF7622] hover:bg-[#E56314] text-white text-xs font-black shadow-md shadow-orange-500/20 transition-all active:scale-95"
                  >
                    Start Shopping Fresh
                  </button>
                )}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES (GENUINE DATA ONLY) */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200/70 shadow-xs">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#181C2E]">Saved Delivery Locations</h2>
                <p className="text-xs text-slate-400">Captured addresses from your genuine placed orders and profile</p>
              </div>
            </div>

            {savedAddresses.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF7622] flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-sm text-[#181C2E]">No Saved Addresses Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your delivery drop-off addresses will automatically be recorded here when you checkout.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => (
                  <div 
                    key={addr.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 hover:border-[#FF7622]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF7622] flex items-center justify-center">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <h3 className="font-extrabold text-sm text-[#181C2E]">{addr.title}</h3>
                      </div>
                      {addr.isDefault && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {addr.address}
                    </p>

                    {addr.phone && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">{addr.phone}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WALLET & REWARDS (GENUINE DATA ONLY) */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Genuine Wallet Card */}
              <div className="bg-gradient-to-tr from-[#181C2E] to-[#2B314F] text-white rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">Available Wallet Balance</span>
                  <Sparkles className="w-5 h-5 text-[#FF7622]" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black tracking-tight">₹{(user?.walletBalance || 0).toFixed(2)}</p>
                  <p className="text-[11px] text-slate-300">
                    {user?.walletBalance > 0 ? '● Active balance available at checkout' : 'No wallet credits added yet'}
                  </p>
                </div>
              </div>

              {/* Genuine Points Calculated from Delivered Orders */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Reward Points Earned</span>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-[#181C2E]">
                    {Math.floor(totalSpent * 0.1)} <span className="text-xs font-bold text-[#FF7622]">PTS</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Calculated from ₹{totalSpent.toFixed(0)} completed orders (10% reward credit)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Live Delivery Radar Modal */}
      {trackingOrder && (
        <LiveDeliveryTrackingModal
          isOpen={!!trackingOrder}
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}
    </div>
  );
};
