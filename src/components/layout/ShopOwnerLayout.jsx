import React, { useState, useEffect } from 'react';
import { ShopOwnerSidebar } from './ShopOwnerSidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../../context/AuthContext';
import { getSocket, joinSocketRole } from '../../api/socket';
import { playOrderChime, startRestaurantKitchenBeep, stopRestaurantKitchenBeep } from '../../utils/soundAlert';
import { Bell, ChefHat, ArrowRight, X } from 'lucide-react';

export const ShopOwnerLayout = ({ currentRoute, onRouteChange, onRefresh, children }) => {
  const { user } = useAuth();
  const [incomingAlertOrder, setIncomingAlertOrder] = useState(null);

  useEffect(() => {
    if (user) {
      joinSocketRole({
        role: 'SHOP_OWNER',
        userId: user._id || user.id,
        shopId: user.shopId,
      });
    }

    const socket = getSocket();

    const handleNewIncomingOrder = (newOrder) => {
      console.log('⚡ [ShopOwnerLayout received order:new_incoming]:', newOrder);
      playOrderChime();
      startRestaurantKitchenBeep();
      setIncomingAlertOrder(newOrder);
    };

    socket.on('order:new_incoming', handleNewIncomingOrder);

    return () => {
      socket.off('order:new_incoming', handleNewIncomingOrder);
    };
  }, [user]);

  return (
    <div className="flex h-screen w-screen bg-[#f0f2fb] text-[#181829] overflow-hidden font-sans relative">
      {/* Floating Global New Order Alert Toast */}
      {incomingAlertOrder && (
        <div className="fixed top-4 right-4 z-50 max-w-md w-full bg-[#181C2E] text-white p-4 rounded-2xl shadow-2xl border-2 border-[#FF7622] animate-in slide-in-from-top-4 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="w-10 h-10 rounded-xl bg-[#FF7622] flex items-center justify-center font-bold text-white shrink-0 shadow-md shadow-orange-500/30 animate-bounce">
              <Bell className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider block">
                Incoming Customer Order!
              </span>
              <p className="text-xs font-black">
                Order #{incomingAlertOrder.orderNumber} • ₹{incomingAlertOrder.totalAmount}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIncomingAlertOrder(null);
                stopRestaurantKitchenBeep();
                onRouteChange?.('orders');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white text-xs font-black transition-all flex items-center space-x-1 shadow-md shadow-orange-500/20"
            >
              <span>Accept</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setIncomingAlertOrder(null);
                stopRestaurantKitchenBeep();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Shop Owner Sidebar */}
      <ShopOwnerSidebar currentRoute={currentRoute} onRouteChange={onRouteChange} />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Topbar currentRoute={currentRoute} onRefresh={onRefresh} />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-6 py-2 pb-8">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
