import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  LogOut, 
  User as UserIcon, 
  LayoutGrid, 
  Menu as MenuIcon, 
  Plus, 
  Bell, 
  ChevronDown, 
  X, 
  Mail, 
  Sparkles,
  Phone,
  ArrowRight,
  Utensils,
  Check,
  Store,
  Clock,
  Home,
  Info,
  Newspaper,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { CartDrawer } from '../cart/CartDrawer';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

export const UserLayout = ({ currentRoute = 'home', onRouteChange, onRefresh, children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItemCount, cartOpen, setCartOpen, addToCart, toastMessage } = useCart();
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState('Indiranagar Express Hub');

  // Quick stores list for SELECT STORE modal
  const stores = [
    { id: 1, name: 'Indiranagar Express Hub', distance: '1.2 km', eta: '12-15 mins', address: '100ft Road, HAL 2nd Stage' },
    { id: 2, name: 'Koramangala Fresh Hub', distance: '3.4 km', eta: '18-20 mins', address: '4th Block, 80ft Road' },
    { id: 3, name: 'Central Halal & Fresh Market', distance: '5.1 km', eta: '25 mins', address: 'MG Road, Halal Tower' }
  ];

  // Search catalog items across the 5 core categories
  const searchableItems = [
    { id: 'prod-chk-1', name: 'Fresh Farm Chicken Breast', category: 'Chicken', price: '₹320', tag: 'Fresh 1kg' },
    { id: 'prod-chk-2', name: 'Whole Tender Spring Chicken', category: 'Chicken', price: '₹280', tag: 'Whole Bird' },
    { id: 'prod-veg-2', name: 'Organic Green Broccoli', category: 'Vegetables', price: '₹85', tag: '500g Fresh' },
    { id: 'prod-veg-1', name: 'Farm Roma Tomatoes', category: 'Vegetables', price: '₹48', tag: '1kg Farm' },
    { id: 'prod-fsh-1', name: 'Atlantic Salmon Fillet', category: 'Fish', price: '₹480', tag: '500g Cut' },
    { id: 'prod-fsh-2', name: 'White Pomfret Whole', category: 'Fish', price: '₹620', tag: 'Cleaned' },
    { id: 'prod-bef-1', name: 'Prime Beef Tenderloin Steak', category: 'Beef', price: '₹550', tag: '750g Premium' },
    { id: 'prod-bef-2', name: 'Lean Beef Mince (Keema)', category: 'Beef', price: '₹390', tag: '500g Fresh' },
    { id: 'prod-gro-1', name: 'Cold Pressed Virgin Olive Oil', category: 'Grocery', price: '₹650', tag: '1L Bottle' },
    { id: 'prod-gro-2', name: 'Pure Farm Wildflower Honey', category: 'Grocery', price: '₹290', tag: '500g Jar' }
  ];

  const filteredItems = searchQuery.trim() === ''
    ? []
    : searchableItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleTabClick = (tab) => {
    if (tab === 'profile' || tab === 'orders') {
      if (!isAuthenticated) {
        onRouteChange?.('login');
      } else {
        onRouteChange?.(tab);
      }
      return;
    }

    if (tab === 'plus') {
      setShowQuickAddModal(true);
      return;
    }

    if (tab === 'bell') {
      setShowNotificationToast(true);
      setTimeout(() => setShowNotificationToast(false), 3000);
      return;
    }

    onRouteChange?.(tab);
  };

  return (
    <div className="min-h-screen bg-white text-[#181C2E] flex flex-col font-sans selection:bg-[#FF7622]/20">
      
      {/* =============================================================
          1. DESKTOP HEADER (Visible only on md: and above)
          Matches the uploaded web design screenshot with orange theme
         ============================================================= */}
      <div className="hidden md:block">
        {/* Top Utility Bar */}
        <div className="bg-[#FBFBFB] border-b border-slate-200/60 text-[11px] text-slate-500 font-semibold py-2 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left: Address & Email */}
            <div className="flex items-center space-x-6">
              <div 
                onClick={() => setShowStoreModal(true)} 
                className="flex items-center space-x-1.5 hover:text-[#FF7622] cursor-pointer transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF7622]" />
                <span>Store: <strong>{selectedStore}</strong> (Change)</span>
              </div>
              <div className="flex items-center space-x-1.5 hover:text-[#FF7622] cursor-pointer transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#FF7622]" />
                <span>support@localrun.com</span>
              </div>
            </div>

            {/* Right: Language & Socials */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1 cursor-pointer hover:text-slate-800">
                <span>English (IN)</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <span className="hover:text-[#FF7622] cursor-pointer">f</span>
                <span className="hover:text-[#FF7622] cursor-pointer">t</span>
                <span className="hover:text-[#FF7622] cursor-pointer">in</span>
                <span className="hover:text-[#FF7622] cursor-pointer">p</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Desktop Navbar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Brand Logo */}
            <div 
              onClick={() => onRouteChange?.('home')} 
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FF7622] text-white flex items-center justify-center shadow-md shadow-[#FF7622]/30 group-hover:scale-105 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-[#1F2229] tracking-tight">
                Local Run<span className="text-[#FF7622]">.</span>
              </span>
            </div>

            {/* Center: Nav Links OR Clean Integrated Top Search Bar */}
            {showSearchOverlay ? (
              <div className="flex-1 max-w-xl mx-8 relative animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center bg-[#F4F6F8] rounded-2xl px-4 py-2 border border-[#FF7622] shadow-sm focus-within:bg-white transition-all">
                  <Search className="w-4 h-4 text-[#FF7622] shrink-0 mr-3" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fresh vegetables, chicken, fish, beef, or groceries..."
                    className="w-full text-xs font-semibold text-[#181C2E] bg-transparent placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-slate-600 mr-2 text-xs"
                    >
                      ✕
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowSearchOverlay(false);
                      setSearchQuery('');
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                    title="Close Search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Clean Dropdown Floating Results under the Top Bar */}
                {searchQuery.trim() !== '' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 max-h-80 overflow-y-auto space-y-1.5 animate-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Search Results ({filteredItems.length})
                    </div>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setShowSearchOverlay(false);
                            setSearchQuery('');
                            onRouteChange?.(`product/${item.id}`);
                          }}
                          className="p-2.5 rounded-xl hover:bg-orange-50 flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className="px-2 py-0.5 rounded-md bg-orange-100 text-[#FF7622] text-[10px] font-black">
                              {item.category}
                            </span>
                            <span className="text-xs font-bold text-[#181C2E]">{item.name}</span>
                          </div>
                          <span className="text-xs font-black text-[#FF7622]">{item.price}</span>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center text-xs text-slate-400">
                        No items found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <nav className="flex items-center space-x-8 text-xs font-bold text-[#1F2229]">
                <button 
                  onClick={() => onRouteChange?.('home')}
                  className={`transition-colors flex items-center space-x-1 ${
                    currentRoute === 'home' || currentRoute === 'dashboard'
                      ? 'text-[#FF7622] font-black'
                      : 'hover:text-[#FF7622]'
                  }`}
                >
                  <span>Home</span>
                </button>

                <button 
                  onClick={() => onRouteChange?.('about')}
                  className={`transition-colors flex items-center space-x-1 ${
                    currentRoute === 'about'
                      ? 'text-[#FF7622] font-black'
                      : 'hover:text-[#FF7622]'
                  }`}
                >
                  <span>About</span>
                </button>

                <button 
                  onClick={() => onRouteChange?.('shop')}
                  className={`transition-colors flex items-center space-x-1 ${
                    currentRoute === 'shop'
                      ? 'text-[#FF7622] font-black'
                      : 'hover:text-[#FF7622]'
                  }`}
                >
                  <span>Shop</span>
                </button>

                <button 
                  onClick={() => onRouteChange?.('news')}
                  className={`transition-colors flex items-center space-x-1 ${
                    currentRoute === 'news'
                      ? 'text-[#FF7622] font-black'
                      : 'hover:text-[#FF7622]'
                  }`}
                >
                  <span>News</span>
                </button>

                <button 
                  onClick={() => onRouteChange?.('contact')}
                  className={`transition-colors flex items-center space-x-1 ${
                    currentRoute === 'contact'
                      ? 'text-[#FF7622] font-black'
                      : 'hover:text-[#FF7622]'
                  }`}
                >
                  <span>Contact</span>
                </button>
              </nav>
            )}

            {/* Right CTA Button & Quick Icons */}
            <div className="flex items-center space-x-5">
              <button 
                onClick={() => setShowStoreModal(true)}
                className="px-5 py-2.5 rounded-md bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center space-x-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>SELECT STORE</span>
              </button>

              {!showSearchOverlay && (
                <button 
                  onClick={() => setShowSearchOverlay(true)}
                  className="p-2 text-slate-600 hover:text-[#FF7622] transition-colors" 
                  title="Search Products"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    onRouteChange?.('profile');
                  } else {
                    onRouteChange?.('login');
                  }
                }}
                className={`p-2 transition-colors relative ${
                  currentRoute === 'profile' ? 'text-[#FF7622]' : 'text-slate-600 hover:text-[#FF7622]'
                }`}
                title={isAuthenticated ? 'Account Profile' : 'Log In'}
              >
                <UserIcon className="w-4 h-4" />
                {isAuthenticated && (
                  <span className="w-2 h-2 rounded-full bg-[#FF7622] absolute top-1.5 right-1.5 border border-white"></span>
                )}
              </button>

              <button 
                onClick={() => setCartOpen(true)}
                className="p-2 text-slate-600 hover:text-[#FF7622] transition-colors relative"
                title="View Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalItemCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#FF7622] text-white font-black text-[9px] flex items-center justify-center absolute -top-0.5 -right-0.5 border border-white">
                    {totalItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* =============================================================
          2. MOBILE TOP HEADER (Visible only on < md)
          Figma Mobile Design with full store picker & navbar access
         ============================================================= */}
      <div className="block md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <header className="px-4 pt-3 pb-3 flex items-center justify-between">
          {/* Left Hamburger Icon Button -> Toggles Mobile Navigation Bar Menu */}
          <button
            onClick={() => setShowMobileMenu(prev => !prev)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-xs active:scale-90 ${
              showMobileMenu
                ? 'bg-[#FF7622] text-white shadow-md shadow-[#FF7622]/30'
                : 'bg-[#ECF0F4] text-[#181C2E] hover:bg-slate-200'
            }`}
            title="Toggle Navigation Menu"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5 text-white stroke-[2.5]" />
            ) : (
              <MenuIcon className="w-5 h-5 text-[#181C2E] stroke-[2.5]" />
            )}
          </button>

          {/* Center: DELIVER TO + selectedStore ▾ */}
          <div 
            onClick={() => setShowStoreModal(true)}
            className="flex flex-col items-center cursor-pointer group px-2"
          >
            <span className="text-[10px] font-black tracking-wider text-[#FF7622] uppercase">
              DELIVER TO
            </span>
            <div className="flex items-center space-x-1 text-xs font-black text-[#181C2E] group-hover:text-[#FF7622] transition-colors max-w-[170px] truncate">
              <span className="truncate">{selectedStore}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#181C2E] stroke-[2.5] shrink-0" />
            </div>
          </div>

          {/* Right: Search & Shopping Bag */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearchOverlay(true)}
              className="w-10 h-10 rounded-full bg-[#F0F5FA] flex items-center justify-center text-[#181C2E] active:scale-95"
              title="Search"
            >
              <Search className="w-4 h-4 text-[#FF7622]" />
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="w-11 h-11 rounded-full bg-[#181C2E] flex items-center justify-center text-white relative hover:bg-[#252a42] active:scale-95 transition-all shadow-sm"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {totalItemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#FF7622] text-white font-black text-[10px] flex items-center justify-center absolute -top-1 -right-1 border-2 border-white shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Navbars (Appears right below top header when icon is clicked) */}
        {showMobileMenu && (
          <>
            {/* Backdrop to close on tap outside */}
            <div 
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 top-[65px] bg-black/50 backdrop-blur-xs z-40 animate-in fade-in duration-200"
            />

            {/* Slide-down Navbar Panel */}
            <div className="relative z-50 bg-white border-t border-slate-100 shadow-2xl px-5 py-4 space-y-4 animate-in slide-in-from-top-4 duration-200 max-h-[80vh] overflow-y-auto">
              
              {/* Brand Header inside dropdown */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF7622] text-white flex items-center justify-center font-black">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-black text-sm text-[#181C2E] block leading-tight">
                      Local Run Navigation
                    </span>
                    <span className="text-[10px] text-slate-400">All Marketplace Pages</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowStoreModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-orange-50 text-[#FF7622] text-[11px] font-black flex items-center space-x-1"
                >
                  <Store className="w-3 h-3" />
                  <span>Change Store</span>
                </button>
              </div>

              {/* Main Nav Links (Matching desktop navbar items) */}
              <nav className="space-y-1">
                {[
                  { id: 'home', label: 'Home', icon: Home, desc: 'Storefront & Categories' },
                  { id: 'about', label: 'About', icon: Info, desc: 'Mission & Halal Farms' },
                  { id: 'shop', label: 'Shop', icon: ShoppingBag, badge: '5 Categories', desc: 'Veg, Meat, Seafood & Grocery' },
                  { id: 'news', label: 'News', icon: Newspaper, badge: 'Recipes', desc: 'Cooking guides & updates' },
                  { id: 'contact', label: 'Contact', icon: Phone, desc: 'Support & Store Hubs' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setShowMobileMenu(false);
                        onRouteChange?.(item.id);
                      }}
                      className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all ${
                        isActive
                          ? 'bg-[#FF7622] text-white shadow-sm'
                          : 'text-[#181C2E] hover:bg-[#FFF4EC] hover:text-[#FF7622]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isActive ? 'bg-white/20 text-white' : 'bg-orange-50 text-[#FF7622]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-black block">{item.label}</span>
                          <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                            {item.desc}
                          </span>
                        </div>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/25 text-white' : 'bg-orange-100 text-[#FF7622]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Action Buttons: SELECT STORE & Profile */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowStoreModal(true);
                  }}
                  className="w-full py-3 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center justify-center space-x-2 active:scale-95 transition-all"
                >
                  <Store className="w-4 h-4" />
                  <span>SELECT STORE ({selectedStore})</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      if (isAuthenticated) {
                        onRouteChange?.('profile');
                      } else {
                        onRouteChange?.('login');
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#F0F5FA] hover:bg-slate-200 text-[#181C2E] font-bold text-xs flex items-center justify-center space-x-1.5"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#FF7622]" />
                    <span>{isAuthenticated ? 'My Account' : 'Sign In'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowSearchOverlay(true);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#F0F5FA] hover:bg-slate-200 text-[#181C2E] font-bold text-xs flex items-center justify-center space-x-1.5"
                  >
                    <Search className="w-3.5 h-3.5 text-[#FF7622]" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* =============================================================
          3. MAIN CONTENT (Houses both Mobile & Desktop views)
         ============================================================= */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* =============================================================
          4. MOBILE CURVED BOTTOM NAVBAR (Visible ONLY on < md)
          Matches Figma 5-item curved bottom bar
         ============================================================= */}
      <div className="block md:hidden">
        <nav className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] border-t border-slate-100/90 px-6 py-3 flex items-center justify-between z-40">
          {/* 1. Grid Icon (Home Storefront) */}
          <button
            onClick={() => handleTabClick('home')}
            className={`p-2 transition-all active:scale-95 ${
              currentRoute === 'home' || currentRoute === 'dashboard'
                ? 'text-[#FF7622]'
                : 'text-[#A0A5BA] hover:text-[#181C2E]'
            }`}
            title="Home Storefront"
          >
            <LayoutGrid className="w-6 h-6 stroke-[2]" />
          </button>

          {/* 2. Shop / Catalog Icon */}
          <button
            onClick={() => handleTabClick('shop')}
            className={`p-2 transition-all active:scale-95 ${
              currentRoute === 'shop'
                ? 'text-[#FF7622]'
                : 'text-[#A0A5BA] hover:text-[#181C2E]'
            }`}
            title="Shop Catalog"
          >
            <ShoppingBag className="w-6 h-6 stroke-[2]" />
          </button>

          {/* 3. Center Floating Circular Orange Plus Button */}
          <button
            onClick={() => handleTabClick('plus')}
            className="w-12 h-12 rounded-full border border-[#FF7622] bg-[#FFF2EA] hover:bg-[#FFE6D7] active:scale-90 flex items-center justify-center text-[#FF7622] shadow-sm transition-all -my-2"
            title="Quick Order / Deals"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* 4. Orders / Tracking Icon */}
          <button
            onClick={() => handleTabClick('orders')}
            className={`p-2 transition-all active:scale-95 ${
              currentRoute === 'orders'
                ? 'text-[#FF7622]'
                : 'text-[#A0A5BA] hover:text-[#181C2E]'
            }`}
            title="Orders & Radar"
          >
            <Clock className="w-6 h-6 stroke-[2]" />
          </button>

          {/* 5. User Profile Icon */}
          <button
            onClick={() => handleTabClick('profile')}
            className={`p-2 transition-all active:scale-95 ${
              currentRoute === 'profile' || currentRoute === 'login'
                ? 'text-[#FF7622]'
                : 'text-[#A0A5BA] hover:text-[#181C2E]'
            }`}
            title={isAuthenticated ? 'My Profile' : 'Log In'}
          >
            <UserIcon className="w-6 h-6 stroke-[2]" />
          </button>
        </nav>
      </div>




      {/* =============================================================
          MODAL: SELECT STORE (Delivery Hub Picker)
         ============================================================= */}
      {showStoreModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-[#FF7622]" />
                <h3 className="text-base font-black text-[#181C2E]">Select Delivery Store</h3>
              </div>
              <button
                onClick={() => setShowStoreModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select your nearest Local Run fulfillment hub to enjoy 15-minute ultra-fast doorstep delivery:
            </p>

            <div className="space-y-3">
              {stores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => {
                    setSelectedStore(store.name);
                    setShowStoreModal(false);
                    setShowNotificationToast(true);
                    setTimeout(() => setShowNotificationToast(false), 2500);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedStore === store.name
                      ? 'border-[#FF7622] bg-[#FFF4EC]'
                      : 'border-slate-200 hover:border-[#FF7622]/40 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold text-[#181C2E]">{store.name}</p>
                      {selectedStore === store.name && (
                        <Check className="w-4 h-4 text-[#FF7622]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{store.address}</p>
                    <div className="flex items-center space-x-3 text-[10px] font-bold text-[#FF7622] pt-0.5">
                      <span>📍 {store.distance}</span>
                      <span>⚡ {store.eta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Action / Deals Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF2EA] border border-[#FF7622] flex items-center justify-center text-[#FF7622]">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="font-black text-sm text-[#181C2E]">Quick Add & Specials</h3>
              </div>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#646982]">
              Instant chef picks ready in under 15 minutes with doorstep delivery:
            </p>
            <div className="space-y-2">
              {[
                { name: 'Spicy Chicken Curry Cut (500g)', price: 160, category: 'Chicken', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&auto=format&fit=crop&q=80', time: '12 min' },
                { name: 'Fresh Roma Tomatoes (1kg)', price: 48, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80', time: '10 min' },
                { name: 'Pure Forest Honey (500g)', price: 290, category: 'Grocery', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80', time: '8 min' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#F0F5FA] hover:bg-orange-50 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-[#181C2E]">{item.name}</p>
                    <span className="text-[10px] text-[#646982]">{item.time} prep</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowQuickAddModal(false);
                      addToCart(item, 1);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FF7622] text-white text-xs font-black shadow-xs hover:bg-[#E56314]"
                  >
                    Add ₹{item.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart Slide-over Drawer */}
      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        onNavigate={onRouteChange} 
      />

      {/* Floating shadcn Alert Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-3 duration-200">
          <Alert variant={toastMessage.type === 'error' ? 'destructive' : 'success'} className="shadow-2xl border bg-white">
            <Sparkles className="w-4 h-4 text-[#FF7622]" />
            <div className="flex items-start justify-between">
              <div>
                <AlertTitle className="text-xs font-black">{toastMessage.title}</AlertTitle>
                <AlertDescription className="text-[11px] text-slate-600 font-medium">
                  {toastMessage.description}
                </AlertDescription>
              </div>
              {toastMessage.type === 'error' && (
                <button
                  onClick={() => onRouteChange?.('login')}
                  className="shrink-0 ml-3 px-2.5 py-1 rounded-lg bg-[#FF7622] hover:bg-[#E56314] text-white font-bold text-[10px] transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </Alert>
        </div>
      )}

      {/* Notification Toast */}
      {showNotificationToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#181C2E] text-white px-4 py-2 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-[#FF7622]" />
          <span>⚡ Selection updated successfully!</span>
        </div>
      )}
    </div>
  );
};
