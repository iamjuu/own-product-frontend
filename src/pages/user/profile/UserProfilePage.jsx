import React, { useState, useEffect } from 'react';
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
  Plus
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import ApiClient from '../../../api/client';
import { LiveDeliveryTrackingModal } from '../../../components/tracking/LiveDeliveryTrackingModal';

export const UserProfilePage = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'wallet'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      setLoadingOrders(true);
      ApiClient.get('/user/orders')
        .then((res) => {
          if (isMounted && res.data) {
            setOrders(res.data);
          }
        })
        .catch((err) => {
          console.warn('Could not fetch user orders:', err);
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

  const mockAddresses = [
    {
      id: 1,
      tag: 'Work (Default)',
      title: 'Halal Lab office',
      address: '542, Halal Tower, 100ft Road, HAL 2nd Stage, Indiranagar, Bangalore - 560038',
      phone: '+91 98765 43210',
      isDefault: true
    },
    {
      id: 2,
      tag: 'Home',
      title: 'Palm Grove Apartments',
      address: 'Flat 402, Tower B, Palm Grove Apts, Koramangala 4th Block, Bangalore - 560034',
      phone: '+91 98765 43210',
      isDefault: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 px-4 sm:px-6 lg:px-8 font-sans pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
          <button onClick={() => onNavigate?.('home')} className="hover:text-[#FF7622] transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-[#FF7622]">Customer Account</span>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF7622] to-[#FFA767] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-[#FF7622]/25">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl sm:text-2xl font-black text-[#181C2E]">
                  {user?.name || 'Customer Account'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-[#FF7622]">
                  {user?.isUser || 'user'}
                </span>
              </div>
              <p className="text-xs text-[#646982] flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#FF7622]" />
                <span>{user?.email || 'user@marketplace.com'}</span>
              </p>
              <div className="flex items-center space-x-4 pt-1 text-[11px] font-bold text-slate-500">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Customer</span>
                </span>
                <span>•</span>
                <span>Member since Sept 2026</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate?.('shop')}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-[#FFF4EC] text-[#FF7622] hover:bg-[#FFE8D9] font-black text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Shop</span>
            </button>
            <button
              onClick={() => {
                logout();
                onNavigate?.('home');
              }}
              className="px-5 py-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-black text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-2">
          {[
            { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: orders.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: 2 },
            { id: 'wallet', label: 'Wallet & Rewards', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl text-xs font-black flex items-center space-x-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#FF7622] text-white shadow-md shadow-[#FF7622]/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/70 shadow-2xs">
              <div>
                <h2 className="text-lg font-black text-[#181C2E]">Order History & In-Transit Deliveries</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time status, OTP security code, and delivery partner details</p>
              </div>
              <button 
                onClick={() => onNavigate?.('shop')}
                className="px-4 py-2 rounded-xl bg-[#FFF4EC] text-[#FF7622] hover:bg-[#FFE6D7] text-xs font-black transition-all flex items-center space-x-1.5 self-start sm:self-center"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loadingOrders ? (
              <div className="py-12 text-center text-xs font-bold text-slate-400">
                Loading orders from server...
              </div>
            ) : orders.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {orders.map((order) => {
                  const isOutForDelivery = order.status === 'OUT_FOR_DELIVERY' || order.status === 'CONFIRMED' || order.status === 'PREPARING';
                  const isDelivered = order.status === 'DELIVERED';
                  const displayDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Recent Order';

                  return (
                    <div 
                      key={order._id || order.id} 
                      className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-xs space-y-5 hover:shadow-md hover:border-[#FF7622]/40 transition-all"
                    >
                      {/* Order Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="flex items-center space-x-3.5">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black ${
                            isOutForDelivery ? 'bg-orange-50 text-[#FF7622]' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2.5">
                              <span className="font-mono text-sm font-black text-[#181C2E]">#{order.orderNumber || order.id}</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                isDelivered ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                              }`}>
                                {order.status?.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{displayDate}</p>
                          </div>
                        </div>

                        {/* Doorstep OTP Badge if out for delivery */}
                        {!isDelivered && order.deliveryOtp ? (
                          <div className="bg-[#FFF4EC] border border-[#FF7622]/30 rounded-2xl px-4 py-2 flex items-center space-x-3 shadow-2xs">
                            <div className="w-8 h-8 rounded-full bg-[#FF7622] text-white flex items-center justify-center shadow-xs">
                              <KeyRound className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-[#646982] uppercase tracking-wider">DOORSTEP OTP</p>
                              <p className="text-base font-black text-[#FF7622] tracking-widest leading-tight">{order.deliveryOtp}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Delivered & Verified</span>
                          </div>
                        )}
                      </div>

                      {/* Items List */}
                      <div className="space-y-2 bg-[#FAFBFD] p-4 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                          Order Items ({order.items?.length || 0})
                        </span>
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                            <span className="text-slate-700 font-medium flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7622]"></span>
                              <span>{item.name}</span>
                              <span className="text-slate-400 font-bold">× {item.quantity || item.qty}</span>
                            </span>
                            <span className="font-extrabold text-[#181C2E]">₹{(item.price * (item.quantity || item.qty || 1))}</span>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Summary Bar */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3 text-xs text-slate-600">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <Truck className="w-4 h-4 text-[#FF7622]" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Delivery Partner</span>
                            <span className="font-bold text-slate-800">{order.deliveryPartnerName || 'Rahul Kumar'}</span>
                            <span className="text-slate-400 ml-1 font-mono text-[11px]">({order.deliveryPartnerPhone || '+91 98765 43210'})</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Paid</span>
                            <span className="text-lg font-black text-[#FF7622]">₹{order.totalAmount || order.total}</span>
                          </div>

                          {!isDelivered ? (
                            <button 
                              onClick={() => setTrackingOrder(order)}
                              className="px-4 py-2.5 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white text-xs font-black transition-all shadow-sm active:scale-95 flex items-center space-x-1.5"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Live Radar</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => onNavigate?.('shop')}
                              className="px-4 py-2.5 rounded-xl bg-[#181C2E] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center space-x-1.5"
                            >
                              <span>Reorder</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF7622] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#181C2E]">No Orders Placed Yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    You haven't placed any fresh meat, seafood or grocery orders yet. Add items to cart for 15-minute doorstep delivery!
                  </p>
                </div>
                <button
                  onClick={() => onNavigate?.('shop')}
                  className="px-6 py-3 rounded-xl bg-[#FF7622] text-white font-black text-xs shadow-md shadow-orange-500/20 hover:bg-[#E56314] transition-all"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#181C2E]">Saved Addresses</h2>
                <p className="text-xs text-slate-500">Manage drop-off locations for quick 15-minute grocery deliveries</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all">
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mockAddresses.map((addr) => (
                <div 
                  key={addr.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover:border-[#FF7622]/40 transition-colors relative"
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

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">{addr.phone}</span>
                    <button className="text-xs font-bold text-[#FF7622] hover:underline">
                      Edit Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WALLET & REWARDS */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-[#181C2E]">Local Run Wallet & Credits</h2>
              <p className="text-xs text-slate-500">Your instantaneous cashbacks and reward points</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Wallet Card */}
              <div className="bg-gradient-to-tr from-[#181C2E] to-[#2B314F] text-white rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">Available Balance</span>
                  <Sparkles className="w-5 h-5 text-[#FF7622]" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black tracking-tight">₹450.00</p>
                  <p className="text-[11px] text-emerald-400 font-bold">● Active & ready to apply at checkout</p>
                </div>
                <button className="w-full py-2.5 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white text-xs font-bold transition-all">
                  + Add Funds to Wallet
                </button>
              </div>

              {/* Loyalty Points */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Local Points</span>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-[#181C2E]">1,240 <span className="text-xs font-bold text-[#FF7622]">PTS</span></p>
                  <p className="text-[11px] text-slate-500">Earn 5 points for every ₹100 spent</p>
                </div>
                <div className="p-3 rounded-2xl bg-orange-50 text-[11px] text-[#FF7622] font-bold">
                  Next milestone: 1,500 PTS unlocks ₹100 grocery voucher.
                </div>
              </div>

              {/* Promo Offers */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Vouchers</span>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-dashed border-[#FF7622] bg-[#FFF4EC] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-[#FF7622]">FRESHRUN50</p>
                      <p className="text-[10px] text-slate-600">50% off chicken & fish orders</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Exp 30 Sep</span>
                  </div>
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
