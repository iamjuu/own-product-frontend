import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronRight, 
  Star, 
  Truck, 
  Clock, 
  Bike, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  ShoppingBag, 
  Plus, 
  ShieldCheck, 
  Flame, 
  Check, 
  Filter,
  Store,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { LiveDeliveryTrackingModal } from '../../../components/tracking/LiveDeliveryTrackingModal';
import { DesktopStorefront } from './components/DesktopStorefront';

export const UserDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [cartToast, setCartToast] = useState(null);

  // Live ticking countdown timer for Honey Combo deal
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 8,
    minutes: 9,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Active simulated in-transit order for customer live experience
  const activeOrder = {
    _id: 'ord-customer-live-01',
    orderNumber: 'ORD-8924',
    status: 'OUT_FOR_DELIVERY',
    shopName: 'Local Run Indiranagar Express Hub',
    customerName: user?.name || 'Halal (Halal Lab office)',
    deliveryPartnerName: 'Rahul Kumar (Rider Partner)',
    deliveryPartnerPhone: '+91 98765 43210',
    totalAmount: 485,
    deliveryOtp: '4829',
    deliveryAddress: {
      street: 'Halal Lab office, HAL 2nd Stage, Indiranagar',
      city: 'Bengaluru',
    },
    items: [
      { name: 'Fresh Farm Chicken Breast Fillet (1kg)', quantity: 1, price: 320 },
      { name: 'Organic Vine Red Tomatoes (1kg)', quantity: 1, price: 48 },
      { name: 'Crisp Garden Broccoli Head (500g)', quantity: 1, price: 85 },
    ],
  };

  // 5 CORE CATEGORIES (identical on mobile & desktop)
  const categories = [
    {
      id: 'all',
      name: 'All',
      tag: '100+ Items',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'vegetables',
      name: 'Vegetables',
      tag: '38+ Items',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'chicken',
      name: 'Chicken',
      tag: '24+ Cuts',
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'fish',
      name: 'Fish',
      tag: '19+ Varieties',
      image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'beef',
      name: 'Beef',
      tag: '15+ Cuts',
      image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'grocery',
      name: 'Grocery',
      tag: '120+ Staples',
      image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=240&auto=format&fit=crop&q=80',
    },
  ];

  // 10 REAL PRODUCTS ACROSS THE 5 CORE CATEGORIES
  const allProducts = [
    // VEGETABLES
    {
      id: 'prod-veg-1',
      name: 'Organic Vine Red Tomatoes (1 kg)',
      category: 'Vegetables',
      price: '₹48.00',
      originalPrice: '₹60.00',
      discount: '-20%',
      rating: '4.9',
      deliveryTime: '15 min',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80',
      description: 'Plump, naturally ripened farm tomatoes harvested within 12 hours.'
    },
    {
      id: 'prod-veg-2',
      name: 'Crisp Garden Broccoli Head (500g)',
      category: 'Vegetables',
      price: '₹85.00',
      originalPrice: '₹110.00',
      discount: '-22%',
      rating: '4.8',
      deliveryTime: '12 min',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
      description: 'Tender florets and crunchy stalks packed with fiber and vitamins.'
    },
    {
      id: 'prod-veg-3',
      name: 'Crisp English Cucumber (500g)',
      category: 'Vegetables',
      price: '₹35.00',
      originalPrice: '₹45.00',
      discount: '-22%',
      rating: '4.7',
      deliveryTime: '12 min',
      image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&auto=format&fit=crop&q=80',
      description: 'Hydrating, crunchy organic cucumbers from certified greenhouse farms.'
    },
    // CHICKEN
    {
      id: 'prod-chk-1',
      name: 'Fresh Farm Chicken Breast Fillet (1 kg)',
      category: 'Chicken',
      price: '₹320.00',
      originalPrice: '₹390.00',
      discount: '-18%',
      rating: '5.0',
      deliveryTime: '15 min',
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&auto=format&fit=crop&q=80',
      description: '100% Halal certified, boneless, skinless tender cuts with zero antibiotics.'
    },
    {
      id: 'prod-chk-2',
      name: 'Whole Farm Spring Chicken Curry Cut (1 kg)',
      category: 'Chicken',
      price: '₹280.00',
      originalPrice: '₹340.00',
      discount: '-17%',
      rating: '4.9',
      deliveryTime: '15 min',
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&auto=format&fit=crop&q=80',
      description: 'Cleaned, skin-off precision cuts ideal for homestyle aromatic curries.'
    },
    // FISH
    {
      id: 'prod-fsh-1',
      name: 'Fresh Atlantic Pink Salmon Fillet (500g)',
      category: 'Fish',
      price: '₹480.00',
      originalPrice: '₹590.00',
      discount: '-18%',
      rating: '4.9',
      deliveryTime: '18 min',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80',
      description: 'Rich in Omega-3 oils, sashimi grade, deboned and packed on dry ice.'
    },
    {
      id: 'prod-fsh-2',
      name: 'White Pomfret Whole Cleaned (500g)',
      category: 'Fish',
      price: '₹620.00',
      originalPrice: '₹750.00',
      discount: '-17%',
      rating: '4.8',
      deliveryTime: '18 min',
      image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&auto=format&fit=crop&q=80',
      description: 'Delicate taste and soft texture, cleaned and ready for pan frying.'
    },
    // BEEF
    {
      id: 'prod-bf-1',
      name: 'Prime Halal Beef Tenderloin Steak (750g)',
      category: 'Beef',
      price: '₹550.00',
      originalPrice: '₹680.00',
      discount: '-19%',
      rating: '4.9',
      deliveryTime: '20 min',
      image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=400&auto=format&fit=crop&q=80',
      description: 'Melt-in-your-mouth halal beef cut from pasture-raised, grass-fed cattle.'
    },
    {
      id: 'prod-bf-2',
      name: 'Lean Halal Beef Mince Keema (500g)',
      category: 'Beef',
      price: '₹390.00',
      originalPrice: '₹480.00',
      discount: '-18%',
      rating: '4.8',
      deliveryTime: '18 min',
      image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&auto=format&fit=crop&q=80',
      description: 'Double-ground fine lean beef mince ideal for kebabs, burgers and curries.'
    },
    // GROCERY
    {
      id: 'prod-gro-1',
      name: 'Cold Pressed Virgin Olive Oil (1L)',
      category: 'Grocery',
      price: '₹650.00',
      originalPrice: '₹820.00',
      discount: '-20%',
      rating: '4.9',
      deliveryTime: '15 min',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
      description: 'First cold pressed, unfiltered, rich in polyphenols and vitamins.'
    },
    {
      id: 'prod-gro-2',
      name: 'Pure Wildflower Organic Honey (500g)',
      category: 'Grocery',
      price: '₹290.00',
      originalPrice: '₹360.00',
      discount: '-19%',
      rating: '5.0',
      deliveryTime: '15 min',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80',
      description: 'Raw, unpasteurized forest honey with natural beeswax and pollen traces.'
    }
  ];

  // Filtering products based on category & search query
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (id, name, e) => {
    e?.stopPropagation();
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setCartToast(`Added ${name} to bag!`);
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
      setCartToast(null);
    }, 2200);
  };

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {cartToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#181C2E] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-[#FF7622]" />
          <span>⚡ {cartToast}</span>
        </div>
      )}

      {/* =============================================================
          1. DESKTOP VIEW (Visible ONLY on md: and above)
          Matches user's uploaded web design screenshot
         ============================================================= */}
      <div className="hidden md:block">
        <DesktopStorefront onNavigate={onNavigate} />
      </div>

      {/* =============================================================
          2. MOBILE VIEW (Visible ONLY on < md)
          UNIFIED DATA & ALL FEATURES (Vegetables, Chicken, Fish, Beef, Grocery)
         ============================================================= */}
      <div className="block md:hidden px-4 pt-1 pb-28 space-y-5">
        
        {/* Figma Greeting & Store Hub */}
        <div className="mt-1 flex items-center justify-between">
          <div>
            <h2 className="text-base text-[#181C2E]">
              Hey {user?.name || 'Halal'},{' '}
              <span className="font-extrabold text-[#181C2E]">Good Afternoon!</span>
            </h2>
            <p className="text-[11px] text-[#646982] flex items-center space-x-1 font-medium mt-0.5">
              <span>📍 Halal Lab office • 15 min express delivery</span>
            </p>
          </div>
        </div>

        {/* Live Search Bar for Fresh Foods & Groceries */}
        <div className="relative flex items-center bg-[#F6F6F6] rounded-2xl px-4 py-3.5 gap-3 border border-transparent focus-within:border-[#FF7622] focus-within:bg-white transition-all shadow-2xs">
          <Search className="w-5 h-5 text-[#FF7622] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vegetables, chicken, fish, beef, grocery..."
            className="bg-transparent text-xs text-[#181C2E] placeholder:text-[#A0A5BA] outline-none w-full font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live In-Transit Order Banner (Live Delivery Radar & OTP 4829) */}
        <div className="rounded-2xl bg-gradient-to-r from-[#FF7622] to-[#FF9344] p-3.5 text-white flex items-center justify-between shadow-md shadow-orange-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <Bike className="w-5 h-5 animate-bounce" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                  LIVE RADAR
                </span>
                <span className="text-[10px] font-mono bg-white/30 text-white px-1.5 py-0.5 rounded font-bold">
                  OTP 4829
                </span>
              </div>
              <p className="text-xs font-bold text-white mt-1">
                Rider Rahul Kumar arriving in ~11 mins
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLiveTracking(true)}
            className="px-3 py-2 rounded-xl bg-white text-[#FF7622] font-black text-[11px] flex items-center space-x-1 shadow-sm active:scale-95 transition-all shrink-0"
          >
            <span>Track</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Mobile Feature Navigation Badges */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onNavigate?.('shop')}
            className="px-3 py-1.5 rounded-xl bg-orange-100 text-[#FF7622] text-xs font-black shrink-0 hover:bg-orange-200 transition-colors flex items-center space-x-1"
          >
            <span>🛍️ Full Shop</span>
          </button>
          <button
            onClick={() => onNavigate?.('about')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold shrink-0 hover:bg-slate-200 transition-colors"
          >
            ℹ️ About Us
          </button>
          <button
            onClick={() => onNavigate?.('news')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold shrink-0 hover:bg-slate-200 transition-colors"
          >
            📰 Recipes
          </button>
          <button
            onClick={() => onNavigate?.('contact')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold shrink-0 hover:bg-slate-200 transition-colors"
          >
            📞 Contact
          </button>
        </div>

        {/* 5 CORE CATEGORIES CAROUSEL */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-extrabold text-[#181C2E] tracking-tight">
              All Categories
            </h3>
            <button 
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-semibold text-[#646982] flex items-center gap-0.5 hover:text-[#FF7622] transition-colors"
            >
              <span>{selectedCategory === 'All' ? 'Showing All' : 'Reset Filter'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5 Categories Carousel (Vegetables, Chicken, Fish, Beef, Grocery) */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`rounded-2xl p-2.5 flex flex-col items-center justify-center min-w-[85px] border transition-all cursor-pointer group active:scale-95 ${
                  selectedCategory === cat.name
                    ? 'bg-orange-50 border-[#FF7622] shadow-sm ring-1 ring-[#FF7622]'
                    : 'bg-white border-slate-100/90 hover:border-slate-200 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-slate-50 shadow-inner group-hover:scale-105 transition-transform">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
                <span className={`text-xs font-bold mt-2 text-center transition-colors ${
                  selectedCategory === cat.name ? 'text-[#FF7622] font-black' : 'text-[#181C2E]'
                }`}>
                  {cat.name}
                </span>
                <span className="text-[9px] text-[#A0A5BA] font-semibold">
                  {cat.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Special Honey Deal Countdown Banner on Mobile */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1F2229] to-[#2B314F] text-white p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF7622] text-white px-2.5 py-0.5 rounded-full">
              ⚡ DAILY DEAL
            </span>
            <span className="text-[11px] text-amber-300 font-bold">Save 25% Off</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white leading-snug">
                Pure Honey & Virgin Olive Oil Combo
              </h4>
              <p className="text-[11px] text-slate-300">
                100% Raw Forest Honey (500g) + Cold Pressed Oil (1L)
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-base font-black text-[#FF7622]">₹840</span>
                <span className="text-xs text-slate-400 line-through">₹1,180</span>
              </div>
            </div>

            {/* Countdown timer blocks */}
            <div className="grid grid-cols-2 gap-1.5 shrink-0 text-center">
              <div className="bg-white/10 px-2 py-1 rounded-xl">
                <span className="text-xs font-black text-white">{timeLeft.hours}</span>
                <span className="text-[8px] block text-slate-300">HRS</span>
              </div>
              <div className="bg-white/10 px-2 py-1 rounded-xl">
                <span className="text-xs font-black text-white">{timeLeft.minutes}</span>
                <span className="text-[8px] block text-slate-300">MIN</span>
              </div>
              <div className="bg-white/10 px-2 py-1 rounded-xl col-span-2">
                <span className="text-xs font-black text-[#FF7622]">{timeLeft.seconds}s</span>
                <span className="text-[8px] block text-slate-300">SECS LEFT</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleAddToCart('deal-honey-combo', 'Honey & Olive Oil Combo')}
            className="w-full py-2.5 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            {addedItems['deal-honey-combo'] ? '✓ Added Combo!' : 'Claim Combo Deal'}
          </button>
        </div>

        {/* PRODUCTS LIST SECTION (Matching the 5 Categories on Mobile) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-extrabold text-[#181C2E] tracking-tight">
                {selectedCategory === 'All' ? 'Popular Fresh Items' : `${selectedCategory} Items`}
              </h3>
              <p className="text-[11px] text-[#646982]">
                Showing {filteredProducts.length} items available for 15-min delivery
              </p>
            </div>
            <button 
              onClick={() => onNavigate?.('shop')}
              className="text-xs font-black text-[#FF7622] flex items-center gap-0.5 hover:underline"
            >
              <span>See Full Shop</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Product Cards List */}
          <div className="space-y-3.5">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl p-3 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5 relative"
              >
                {/* Product Image */}
                <div 
                  onClick={() => onNavigate?.(`product/${prod.id}`)}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0 cursor-pointer"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-[#FF7622] text-white">
                    {prod.discount}
                  </span>
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF7622] bg-orange-50 px-2 py-0.5 rounded-md">
                      {prod.category}
                    </span>
                    <button
                      onClick={(e) => toggleFavorite(prod.id, e)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          favorites[prod.id] ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <h4 
                    onClick={() => onNavigate?.(`product/${prod.id}`)}
                    className="text-xs font-extrabold text-[#181C2E] truncate cursor-pointer hover:text-[#FF7622]"
                  >
                    {prod.name}
                  </h4>

                  {/* Rating & ETA */}
                  <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center space-x-0.5 text-amber-600 font-black">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{prod.rating}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#FF7622]" />
                      <span>{prod.deliveryTime}</span>
                    </span>
                  </div>

                  {/* Price & Add to Cart Button */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-sm font-black text-[#FF7622]">{prod.price}</span>
                      <span className="text-[10px] text-slate-400 line-through">{prod.originalPrice}</span>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(prod.id, prod.name, e)}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center space-x-1 transition-all active:scale-95 ${
                        addedItems[prod.id]
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#FF7622] hover:bg-[#E56314] text-white shadow-xs'
                      }`}
                    >
                      {addedItems[prod.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2 bg-white rounded-3xl border border-slate-100 p-6">
              <p>No products found matching your search.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-orange-100 text-[#FF7622] font-black text-xs"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Value Services Strip on Mobile */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-slate-600 font-bold">
          <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
            <Truck className="w-4 h-4 text-[#FF7622] mx-auto" />
            <span>15-Min Free Delivery</span>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
            <span>100% Halal Verified</span>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
            <Sparkles className="w-4 h-4 text-[#FF7622] mx-auto" />
            <span>Doorstep OTP Safe</span>
          </div>
        </div>

      </div>

      {/* Live Swiggy Delivery Tracking Modal */}
      <LiveDeliveryTrackingModal
        isOpen={showLiveTracking}
        order={activeOrder}
        onClose={() => setShowLiveTracking(false)}
      />
    </div>
  );
};
