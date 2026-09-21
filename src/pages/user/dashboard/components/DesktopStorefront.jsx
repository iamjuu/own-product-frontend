import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User as UserIcon, 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  ArrowRight,
  Eye,
  Check,
  Truck,
  ShieldCheck,
  Headphones,
  Utensils,
  Mail,
  Calendar,
  ExternalLink,
  Flame,
  Filter,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Card } from '../../../../components/ui/card';
import { cn } from '../../../../lib/utils';
import ApiClient from '../../../../api/client';
import { masterProducts } from '../../../../data/productsData';

export const DesktopStorefront = ({ onNavigate, onAddToCart }) => {
  const { user, isAuthenticated } = useAuth();
  const [activeCategoryTab, setActiveCategoryTab] = useState('ALL PRODUCTS');
  const [addedItems, setAddedItems] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [allProducts, setAllProducts] = useState(masterProducts);

  // Live fetch from database API
  useEffect(() => {
    let isMounted = true;
    ApiClient.get('/products')
      .then((res) => {
        const productList = Array.isArray(res.data) ? res.data : (res.data?.products || []);
        if (isMounted && productList.length > 0) {
          const formatted = productList.map((p) => {
            let discount = null;
            if (p.mrp && p.mrp > p.price) {
              const diff = Math.round(((p.mrp - p.price) / p.mrp) * 100);
              discount = `-${diff}%`;
            }
            const rawCat = (p.categoryId?.name || p.categoryName || p.category || 'General').trim();
            return {
              id: p._id,
              _id: p._id,
              slug: p.slug,
              name: p.name,
              category: rawCat.toUpperCase(),
              categoryName: rawCat,
              price: Number(p.price) || 0,
              originalPrice: Number(p.mrp) || Number(p.price) * 1.25,
              discount: discount || '-20%',
              rating: 5,
              image: p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
              description: p.description || 'Farm-fresh quality guaranteed from certified producers.',
            };
          });
          setAllProducts(formatted);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleAddToCart = (id, name, price, image) => {
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    onAddToCart?.({ id, name, price, image });
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  // 5 Core Categories: Vegetables, Chicken, Fish, Beef, Grocery
  const categoryHighlights = [
    {
      id: 'veg',
      title: 'Fresh Vegetables',
      count: '38+ Items',
      category: 'VEGETABLES',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-orange-50/70',
      borderColor: 'border-orange-200/80',
    },
    {
      id: 'chicken',
      title: 'Fresh Chicken',
      count: '24+ Cuts',
      category: 'CHICKEN',
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-amber-50/70',
      borderColor: 'border-amber-200/80',
    },
    {
      id: 'fish',
      title: 'Wild Caught Fish',
      count: '19+ Varieties',
      category: 'FISH',
      image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-blue-50/70',
      borderColor: 'border-blue-200/80',
    },
    {
      id: 'beef',
      title: 'Halal Prime Beef',
      count: '15+ Cuts',
      category: 'BEEF',
      image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-rose-50/70',
      borderColor: 'border-rose-200/80',
    },
    {
      id: 'grocery',
      title: 'Daily Grocery',
      count: '120+ Staples',
      category: 'GROCERY',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
      bgColor: 'bg-emerald-50/70',
      borderColor: 'border-emerald-200/80',
    },
  ];

  const filteredProducts = activeCategoryTab === 'ALL PRODUCTS'
    ? allProducts
    : allProducts.filter((p) => p.category === activeCategoryTab);

  return (
    <div className="w-full bg-[#FFFFFF] font-sans selection:bg-[#FF7622]/20">
      
      {/* -------------------------------------------------------------
          1. HERO SLIDER BANNER (Tasty & Healthy Organic Food)
         ------------------------------------------------------------- */}
      <section className="relative bg-[#FFF9F5] overflow-hidden py-16 lg:py-24 border-b border-orange-100/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Hero Content */}
          <div className="lg:w-1/2 space-y-5 z-10 text-left">
            <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-[#FF7622]">
              <span className="w-2 h-2 rounded-full bg-[#FF7622]"></span>
              <span>100% Halal Certified &amp; Farm Fresh</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2229] leading-snug tracking-tight">
              Fresh Vegetables, <br />
              <span className="text-[#FF7622]">Meat, Fish &amp; Grocery</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed font-normal">
              Daily farm-fresh vegetables, organic poultry, fresh water fish, prime beef cuts, and all essential groceries delivered to your door in 30 minutes.
            </p>

            <div className="pt-2 flex items-center space-x-4">
              <Button 
                onClick={() => {
                  const el = document.getElementById('our-products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                variant="default"
                size="lg"
              >
                EXPLORE PRODUCTS
              </Button>

              <Button
                onClick={() => onNavigate?.('shop')}
                variant="outline"
                size="lg"
              >
                BROWSE SHOP
              </Button>
            </div>
          </div>

          {/* Right Hero Image (Fresh vegetables, poultry, and fish spread) */}
          <div className="lg:w-1/2 relative flex items-center justify-center">
            <div className="relative w-full max-w-xl">
              <img
                src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=900&auto=format&fit=crop&q=80"
                alt="Fresh Vegetables, Chicken, Fish, Beef and Grocery"
                className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button 
          aria-label="Previous Slide"
          className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 border border-slate-200 text-slate-600 hover:text-[#FF7622] hover:border-[#FF7622] flex items-center justify-center shadow-md transition-all hidden xl:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          aria-label="Next Slide"
          className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 border border-slate-200 text-slate-600 hover:text-[#FF7622] hover:border-[#FF7622] flex items-center justify-center shadow-md transition-all hidden xl:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#FF7622]"></span>
          <span className="w-3 h-3 rounded-full bg-slate-300"></span>
        </div>
      </section>

      {/* -------------------------------------------------------------
          FIVE CORE CATEGORIES ROW (Vegetables, Chicken, Fish, Beef, Grocery)
         ------------------------------------------------------------- */}
      <section className="py-12 bg-white max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 border-b border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-[#1F2229] tracking-tight">
              Featured Categories
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select a category to shop farm-fresh produce and premium meats
            </p>
          </div>
          <button
            onClick={() => onNavigate?.('shop')}
            className="text-xs font-bold text-[#FF7622] hover:text-[#E56314] flex items-center space-x-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categoryHighlights.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setActiveCategoryTab(cat.category);
                const el = document.getElementById('our-products-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`rounded-2xl p-5 border ${cat.borderColor} ${cat.bgColor} flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group`}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white p-1 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h4 className="font-extrabold text-sm text-[#1F2229] group-hover:text-[#FF7622] transition-colors">
                {cat.title}
              </h4>
              <span className="text-[11px] font-bold text-slate-400 mt-1">
                {cat.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------
          FEATURE SERVICES BAR (Free Shipping, Certified, 24/7 Support)
         ------------------------------------------------------------- */}
      <section className="py-8 bg-[#FDFDFD] border-b border-slate-100 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-orange-100 text-[#FF7622] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-800">Free Home Delivery</h4>
              <p className="text-[11px] text-stone-500 font-medium">On orders over ₹499.00</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-orange-100 text-[#FF7622] flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-800">100% Halal &amp; Organic</h4>
              <p className="text-[11px] text-stone-500 font-medium">Certified fresh cuts</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-orange-100 text-[#FF7622] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-800">Secure Payment</h4>
              <p className="text-[11px] text-stone-500 font-medium">100% secure checkout</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-orange-100 text-[#FF7622] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-800">24/7 Fast Support</h4>
              <p className="text-[11px] text-stone-500 font-medium">Dedicated support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          2. THREE PROMO BANNERS GRID
         ------------------------------------------------------------- */}
      <section className="py-16 bg-white max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Large Left Banner (Fresh Farm Chicken & Tender Cuts) */}
          <div className="rounded-2xl bg-[#FFF4EC] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between overflow-hidden border border-orange-100/70 shadow-xs hover:shadow-md transition-all group">
            <div className="space-y-3 sm:max-w-xs text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-[#1F2229] leading-tight">
                Fresh Farm Chicken <br />
                &amp; Tender Cuts
              </h3>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                100% HALAL CUTS <br />
                HYGIENICALLY PACKED <br />
                DOORSTEP DELIVERY
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => {
                    setActiveCategoryTab('CHICKEN');
                    const el = document.getElementById('our-products-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-md bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs flex items-center space-x-2 shadow-sm transition-all"
                >
                  <span>Shop Chicken</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-6 sm:mt-0 w-44 sm:w-56 shrink-0 group-hover:scale-105 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=80"
                alt="Fresh Farm Chicken"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Right Column: Two Stacked Cards */}
          <div className="space-y-6">
            
            {/* Top Right Card: Wild Caught Fish */}
            <div className="rounded-2xl bg-[#FFF8F3] p-6 sm:p-8 flex items-center justify-between border border-orange-100/70 shadow-xs hover:shadow-md transition-all group">
              <div className="w-36 sm:w-44 shrink-0 group-hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&auto=format&fit=crop&q=80"
                  alt="Wild Caught Salmon & Sea Fish"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
              <div className="space-y-2 text-right">
                <h4 className="text-lg sm:text-xl font-black text-[#1F2229]">
                  Up to 20% off Wild <br />
                  Atlantic Salmon
                </h4>
                <p className="text-xs font-bold text-slate-500">
                  From <span className="text-[#FF7622] font-black text-sm">₹350.00</span>
                </p>
                <button
                  onClick={() => {
                    setActiveCategoryTab('FISH');
                    const el = document.getElementById('our-products-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#FF7622] hover:underline inline-block mt-1"
                >
                  Shop Seafood →
                </button>
              </div>
            </div>

            {/* Bottom Right Card: Prime Beef & Grocery */}
            <div className="rounded-2xl bg-[#FFF8F3] p-6 sm:p-8 flex items-center justify-between border border-orange-100/70 shadow-xs hover:shadow-md transition-all group">
              <div className="space-y-2 text-left">
                <h4 className="text-lg sm:text-xl font-black text-[#1F2229]">
                  Fresh Halal Beef <br />
                  &amp; Daily Grocery
                </h4>
                <button 
                  onClick={() => {
                    setActiveCategoryTab('BEEF');
                    const el = document.getElementById('our-products-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-1.5 rounded-md bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs transition-all"
                >
                  Shop Now
                </button>
              </div>
              <div className="w-36 sm:w-44 shrink-0 group-hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1551028150-64b9f398f678?w=400&auto=format&fit=crop&q=80"
                  alt="Prime Halal Beef Cuts"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          3. "OUR PRODUCTS" SECTION (Vegetables, Chicken, Fish, Beef, Grocery)
         ------------------------------------------------------------- */}
      <section id="our-products-section" className="py-16 bg-[#FAFAFA] border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-8">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2229] tracking-tight">
              Our Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Explore our certified organic vegetables, farm chicken, wild fish, prime beef, and daily groceries
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 border-b border-slate-200/80 pb-4">
            {['ALL PRODUCTS', 'VEGETABLES', 'CHICKEN', 'FISH', 'BEEF', 'GROCERY'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategoryTab(tab)}
                className={`text-xs sm:text-sm font-black tracking-wider transition-all pb-2 -mb-4 ${
                  activeCategoryTab === tab
                    ? 'text-[#FF7622] border-b-2 border-[#FF7622]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 10 Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4 text-left">
            {filteredProducts.map((item) => {
              const defaultTags = {
                VEGETABLES: ['Fresh Produce', 'Organic', 'Farm Direct'],
                CHICKEN: ['100% Halal', 'Tender Cut', 'Antibiotic-Free'],
                FISH: ['Wild Catch', 'Omega-3', 'De-scaled'],
                BEEF: ['Halal Beef', 'Grass-Fed', 'Aged Cut'],
                GROCERY: ['Pure Organic', 'Unrefined', 'Pantry Staple']
              };

              const tags = item.tags || defaultTags[item.category] || ['Fresh', 'Top Quality', '15m Delivery'];

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-[28px] p-4 border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Top Image Frame with Category Tab Notch */}
                  <div 
                    onClick={() => onNavigate?.(`product/${item.id}`)}
                    className="relative rounded-[22px] overflow-hidden bg-[#FBF9F7] aspect-[4/3] flex items-center justify-center cursor-pointer"
                  >
                    {/* Top-Left Category Tab */}
                    <div className="absolute top-0 left-0 bg-white px-3.5 py-1.5 rounded-br-2xl text-[11px] font-bold text-slate-700 shadow-2xs z-10 capitalize tracking-tight">
                      {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase() : 'Category'}
                    </div>

                    {/* Top-Right Discount Badge */}
                    {item.discount && (
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-white text-[10px] font-bold z-10">
                        {item.discount}
                      </span>
                    )}

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="pt-4 flex-1 flex flex-col justify-between text-left">
                    <div>
                      {/* Title & Price Badge Row */}
                      <div className="flex items-start justify-between gap-2.5">
                        <h4 
                          onClick={() => onNavigate?.(`product/${item.id}`)}
                          className="font-extrabold text-base text-[#181C2E] hover:text-[#FF7622] transition-colors cursor-pointer line-clamp-1 leading-snug flex-1"
                          title={item.name}
                        >
                          {item.name}
                        </h4>

                        {/* Price Pill Badge */}
                        <div className="shrink-0 px-3.5 py-1.5 rounded-full bg-[#FF7622] text-white font-extrabold text-xs shadow-2xs">
                          ₹{Number(item.price).toFixed(2)}
                        </div>
                      </div>

                      {/* Multi-line Description */}
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal mt-2">
                        {item.description}
                      </p>

                      {/* Pill Tags Row */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        {tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFD7C7]/70 text-[#C84A20] border border-[#FF7622]/15"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Full-width Rounded Add to Cart Button (Color from Image 2: #FF7622) */}
                    <Button
                      variant="default"
                      size="pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item.id, item.name, item.price, item.image);
                      }}
                      className={cn(
                        'w-full mt-4',
                        addedItems[item.id] && 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                      )}
                    >
                      {addedItems[item.id] ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add To Cart</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          4. PROMO COMBO DEAL (Honey Package with Ticking Countdown)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FFF9F5] border-t border-b border-orange-100/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Honey Jar Image */}
          <div className="lg:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <img
                src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80"
                alt="Original Stock Honey Combo Package"
                className="w-full h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Honey Deal Content & Countdown */}
          <div className="lg:w-1/2 space-y-6 text-left">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF7622]">
              Today's Hot Deals
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F2229] leading-tight">
              Original Stock Honey <br />
              Combo Package
            </h2>

            <p className="text-sm text-slate-600 max-w-md leading-relaxed font-medium">
              100% pure raw unprocessed forest honey harvested from organic wildflower hives. Packed with natural antioxidants and vitamins.
            </p>

            {/* Live Countdown Circles */}
            <div className="flex items-center space-x-4 sm:space-x-6 pt-2">
              {[
                { val: String(timeLeft.days).padStart(2, '0'), label: 'DAYS' },
                { val: String(timeLeft.hours).padStart(2, '0'), label: 'HRS' },
                { val: String(timeLeft.minutes).padStart(2, '0'), label: 'MINS' },
                { val: String(timeLeft.seconds).padStart(2, '0'), label: 'SECS' }
              ].map((time, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-orange-100 flex items-center justify-center font-black text-lg sm:text-xl text-[#FF7622] shadow-sm font-mono">
                    {time.val}
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-400 mt-2 tracking-wider">
                    {time.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button 
                onClick={() => {
                  handleAddToCart('honey-combo', 'Original Stock Honey Combo', 48.00);
                  onNavigate?.('orders');
                }}
                className="px-8 py-4 rounded-md bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#FF7622]/25 active:scale-95 transition-all"
              >
                SHOP NOW
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          5. ORGANIC ARTICLES / RECIPES SECTION
         ------------------------------------------------------------- */}
      <section className="py-16 bg-white max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center space-y-4 mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-[#FF7622]">
            From Our Kitchen &amp; Stores
          </span>
          <h3 className="text-3xl font-black text-[#1F2229]">
            Latest News &amp; Recipes
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'How to Choose the Freshest Seasonal Organic Fruits',
              date: 'Sep 21, 2026',
              category: 'Healthy Living',
              image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'
            },
            {
              title: '5 Quick Healthy Breakfast Recipes for Busy Mornings',
              date: 'Sep 19, 2026',
              category: 'Recipes',
              image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80'
            },
            {
              title: 'The Superfood Benefits of Raw Forest Wildflower Honey',
              date: 'Sep 17, 2026',
              category: 'Nutrition',
              image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80'
            }
          ].map((article, idx) => (
            <div key={idx} className="rounded-2xl border border-stone-200/80 overflow-hidden hover:shadow-lg transition-all group bg-white">
              <div className="h-48 overflow-hidden bg-stone-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2.5 text-left">
                <div className="flex items-center space-x-2 text-[11px] text-stone-400 font-bold">
                  <span>{article.category}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>
                <h4 className="font-extrabold text-base text-[#1F2229] group-hover:text-[#FF7622] transition-colors leading-snug">
                  {article.title}
                </h4>
                <div className="pt-1">
                  <span 
                    onClick={() => onNavigate?.('news')}
                    className="text-xs font-bold text-[#FF7622] flex items-center space-x-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------
          6. FULL DESKTOP FOOTER & NEWSLETTER
         ------------------------------------------------------------- */}
      <footer className="bg-[#181C2E] text-stone-300 pt-16 pb-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            {/* Brand Col */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF7622] text-white flex items-center justify-center font-bold">
                  <Utensils className="w-4 h-4" />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">Local Run.</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Fresh farm-to-doorstep organic vegetables, halal chicken, sea fish, prime beef, and daily groceries delivered daily across the city.
              </p>
              <div className="text-xs text-stone-400">
                <p>📍 542, Halal Tower, New York, NY</p>
                <p className="mt-1">📞 +1 (800) 425-2500</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-white">Quick Links</h5>
              <ul className="space-y-2 text-xs text-stone-400 font-medium">
                <li onClick={() => onNavigate?.('about')} className="hover:text-[#FF7622] cursor-pointer">About Us</li>
                <li onClick={() => onNavigate?.('shop')} className="hover:text-[#FF7622] cursor-pointer">Shop Catalog</li>
                <li onClick={() => onNavigate?.('news')} className="hover:text-[#FF7622] cursor-pointer">News &amp; Recipes</li>
                <li onClick={() => onNavigate?.('contact')} className="hover:text-[#FF7622] cursor-pointer">Contact Us</li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-white">Categories</h5>
              <ul className="space-y-2 text-xs text-stone-400 font-medium">
                <li onClick={() => { setActiveCategoryTab('VEGETABLES'); onNavigate?.('shop'); }} className="hover:text-[#FF7622] cursor-pointer">Fresh Vegetables</li>
                <li onClick={() => { setActiveCategoryTab('CHICKEN'); onNavigate?.('shop'); }} className="hover:text-[#FF7622] cursor-pointer">Fresh Farm Chicken</li>
                <li onClick={() => { setActiveCategoryTab('FISH'); onNavigate?.('shop'); }} className="hover:text-[#FF7622] cursor-pointer">Wild Caught Fish</li>
                <li onClick={() => { setActiveCategoryTab('BEEF'); onNavigate?.('shop'); }} className="hover:text-[#FF7622] cursor-pointer">Halal Prime Beef</li>
                <li onClick={() => { setActiveCategoryTab('GROCERY'); onNavigate?.('shop'); }} className="hover:text-[#FF7622] cursor-pointer">Daily Grocery</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-white">Newsletter</h5>
              <p className="text-xs text-stone-400">
                Subscribe to get special discounts, weekly organic harvest recipes and promo codes.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-2.5 rounded-lg bg-stone-800/80 border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#FF7622]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#FF7622] hover:bg-[#E56314] text-white rounded-md text-[11px] font-bold"
                  >
                    Send
                  </button>
                </div>
                {newsletterSubscribed && (
                  <p className="text-[11px] text-[#FF7622] font-bold">
                    ✓ Thank you for subscribing!
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <p>© 2026 Local Run Marketplace • All rights reserved.</p>
            <div className="flex items-center space-x-4 font-semibold">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
              <span className="hover:text-white cursor-pointer">Security</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-40 h-40 rounded-2xl bg-[#FAFAFA] flex items-center justify-center p-4 shrink-0">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="max-h-36 w-auto object-contain"
                />
              </div>
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-[#FF7622] px-2 py-0.5 rounded-md">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-xl font-black text-stone-800">{quickViewProduct.name}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{quickViewProduct.description}</p>
                <div className="flex items-center space-x-2 pt-2">
                  <span className="text-lg font-black text-[#FF7622]">₹{Number(quickViewProduct.price).toFixed(2)}</span>
                  <span className="text-xs text-stone-400 line-through">₹{Number(quickViewProduct.originalPrice).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="default"
                onClick={() => {
                  handleAddToCart(quickViewProduct.id, quickViewProduct.name, quickViewProduct.price, quickViewProduct.image);
                  setQuickViewProduct(null);
                }}
                className="flex-1 w-full"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const id = quickViewProduct.id;
                  setQuickViewProduct(null);
                  onNavigate?.(`product/${id}`);
                }}
                className="w-full sm:w-auto"
              >
                Full Details →
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
