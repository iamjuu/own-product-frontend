import React, { useState } from 'react';
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

export const UserProfilePage = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'wallet'

  const mockOrders = [
    {
      id: 'ORD-8924',
      date: 'Today, 2:45 PM',
      status: 'Out for Delivery',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
      otp: '4829',
      rider: 'Vikram Rider',
      riderPhone: '+91 98765 43210',
      items: [
        { name: 'Fresh Farm Chicken Breast (1kg)', qty: 1, price: '₹320' },
        { name: 'Organic Roma Tomatoes (1kg)', qty: 1, price: '₹48' },
        { name: 'Organic Green Broccoli (500g)', qty: 1, price: '₹85' }
      ],
      total: '₹453',
      address: 'Halal Lab office, 542 Halal Tower, Indiranagar'
    },
    {
      id: 'ORD-8710',
      date: 'Yesterday, 11:30 AM',
      status: 'Delivered',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      otp: 'COMPLETED',
      rider: 'Rahul Kumar',
      riderPhone: '+91 98451 22345',
      items: [
        { name: 'Fresh Atlantic Salmon Fillet (500g)', qty: 1, price: '₹480' },
        { name: 'Farm Fresh Milk (1L)', qty: 2, price: '₹130' }
      ],
      total: '₹610',
      address: 'Halal Lab office, 542 Halal Tower, Indiranagar'
    }
  ];

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
            { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: 2 },
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#181C2E]">Recent Orders</h2>
                <p className="text-xs text-slate-500">Track current in-flight delivery and view receipt history</p>
              </div>
              <button 
                onClick={() => onNavigate?.('shop')}
                className="text-xs font-black text-[#FF7622] hover:underline flex items-center space-x-1"
              >
                <span>Order More Items</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {mockOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 hover:border-[#FF7622]/40 transition-colors"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7622] flex items-center justify-center font-black">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm font-black text-[#181C2E]">{order.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{order.date}</p>
                      </div>
                    </div>

                    {/* Doorstep OTP Badge if out for delivery */}
                    {order.otp !== 'COMPLETED' ? (
                      <div className="bg-[#FFF4EC] border border-[#FF7622]/30 rounded-2xl px-4 py-2 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#FF7622] text-white flex items-center justify-center">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#646982] uppercase tracking-wider">DOORSTEP OTP</p>
                          <p className="text-base font-black text-[#FF7622] tracking-widest">{order.otp}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed & Rated 5★</span>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <span className="text-slate-700 font-semibold">
                          {item.name} <span className="text-slate-400">× {item.qty}</span>
                        </span>
                        <span className="font-bold text-[#181C2E]">{item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Summary Bar */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <Truck className="w-4 h-4 text-[#FF7622]" />
                      <span>Delivery Partner: <strong className="text-slate-800">{order.rider}</strong> ({order.riderPhone})</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Paid</span>
                        <span className="text-base font-black text-[#FF7622]">{order.total}</span>
                      </div>
                      <button 
                        onClick={() => onNavigate?.('orders')}
                        className="px-4 py-2 rounded-xl bg-[#181C2E] hover:bg-[#2c324e] text-white text-xs font-bold transition-all"
                      >
                        Live Tracking Radar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
};
