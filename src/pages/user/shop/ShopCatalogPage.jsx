import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Star, 
  Filter, 
  Check, 
  ArrowUpDown, 
  Eye, 
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ShoppingCart,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import ApiClient from '@/api/client';
import { useCart } from '@/context/CartContext';

export const ShopCatalogPage = ({ onNavigate, onAddToCart }) => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [addedItems, setAddedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

  // Fetch live products & categories from Database API
  useEffect(() => {
    let isMounted = true;

    const fetchCatalogData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.allSettled([
          ApiClient.get('/products'),
          ApiClient.get('/categories'),
        ]);

        if (!isMounted) return;

        if (productsRes.status === 'fulfilled' && productsRes.value?.data?.length > 0) {
          const fetchedProds = productsRes.value.data.map((p) => {
            // Compute discount percent if MRP exists
            let discount = null;
            if (p.mrp && p.mrp > p.price) {
              const diff = Math.round(((p.mrp - p.price) / p.mrp) * 100);
              discount = `-${diff}%`;
            }

            return {
              id: p._id,
              _id: p._id,
              slug: p.slug,
              name: p.name,
              category: (p.categoryName || 'GENERAL').toUpperCase(),
              categoryName: p.categoryName || 'General',
              subcategoryName: p.subcategoryName || '',
              brandName: p.brandName || '',
              shopName: p.shopName || p.shopId?.name || '',
              price: Number(p.price) || 0,
              originalPrice: Number(p.mrp) || Number(p.price) * 1.25,
              discount: discount || '-20%',
              rating: 5,
              image: p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
              description: p.description || '',
              unit: p.unit || 'piece',
            };
          });

          setCatalog(fetchedProds);
        }

        if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.data?.length > 0) {
          setDbCategories(categoriesRes.value.data);
        }
      } catch (err) {
        console.error('Failed to load catalog from DB, using fallback data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCatalogData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = async (id, name, price, image, category = 'General') => {
    const success = await addToCart({ _id: id, id, name, price, image, category }, 1);
    if (success) {
      setAddedItems((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    }
  };

  // Build dynamic category list with item counts from current catalog
  const categoriesList = React.useMemo(() => {
    const counts = {};
    catalog.forEach((item) => {
      const catKey = (item.categoryName || item.category || 'General').trim();
      counts[catKey] = (counts[catKey] || 0) + 1;
    });

    const list = [
      { id: 'ALL', label: 'All Products', count: catalog.length },
    ];

    // Priority category names to show cleanly
    const knownCategories = [
      'Fresh Vegetables',
      'Fresh Chicken',
      'Wild Fish & Seafood',
      'Halal Prime Beef',
      'Daily Grocery',
    ];

    knownCategories.forEach((catName) => {
      if (counts[catName] !== undefined) {
        list.push({
          id: catName.toUpperCase(),
          label: catName,
          count: counts[catName],
        });
      }
    });

    // Add any other categories dynamically present in catalog
    Object.keys(counts).forEach((catName) => {
      if (!knownCategories.includes(catName)) {
        list.push({
          id: catName.toUpperCase(),
          label: catName,
          count: counts[catName],
        });
      }
    });

    return list;
  }, [catalog]);

  // Filtering
  const filtered = catalog.filter((item) => {
    const itemCat = (item.categoryName || item.category || '').toUpperCase();
    const matchesCategory = 
      selectedCategory === 'ALL' || 
      itemCat === selectedCategory ||
      itemCat.includes(selectedCategory) ||
      selectedCategory.includes(itemCat);

    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPrice = item.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
    return 0; // default popular
  });

  return (
    <div className="w-full bg-[#FAFAFA] font-sans selection:bg-[#FF7622]/20 min-h-screen">
      
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80 py-6 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold mb-1">
              <span onClick={() => onNavigate?.('home')} className="hover:text-[#FF7622] cursor-pointer">Home</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-700">Shop Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2229]">
              Fresh Produce &amp; Groceries
            </h1>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 z-10" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chicken, fish, vegetables..."
              className="pl-10 h-11 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Filter Sidebar */}
          <div className="w-full lg:w-64 space-y-6 shrink-0 lg:sticky lg:top-24 lg:self-start">
            
            {/* Category Filter */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 font-black text-sm text-[#1F2229]">
                <Filter className="w-4 h-4 text-[#FF7622]" />
                <span>Categories</span>
              </div>
              
              <div className="space-y-1 text-xs font-bold">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#FF7622] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-orange-50 hover:text-[#FF7622]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider (INR ₹) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between font-black text-sm text-[#1F2229]">
                <span>Filter by Price</span>
                <span className="text-xs text-[#FF7622] font-black">₹{maxPrice}</span>
              </div>
              <Slider
                value={[maxPrice]}
                min={20}
                max={1000}
                step={10}
                onValueChange={(vals) => setMaxPrice(vals[0])}
                className="w-full py-1"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>₹20</span>
                <span>₹1,000</span>
              </div>
            </div>

          </div>

          {/* Right Product Grid */}
          <div className="flex-1 space-y-6">
            
            {/* Top Sort Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-bold">
                Showing <span className="text-[#1F2229] font-black">{sorted.length}</span> items
                {loading && <span className="ml-2 text-slate-400 font-normal">(Syncing with database...)</span>}
              </span>

              <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#FF7622]" />
                <span className="shrink-0">Sort by:</span>
                <div className="w-44">
                  <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Product Cards */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-[28px] p-4 border border-slate-200/90 shadow-2xs animate-pulse space-y-4">
                    <div className="rounded-[22px] bg-slate-100 aspect-[4/3] w-full" />
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                      <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                      <div className="h-3 bg-slate-100 rounded-md w-full" />
                    </div>
                    <div className="h-10 bg-slate-100 rounded-full w-full" />
                  </div>
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center space-y-3 border border-slate-200">
                <p className="text-sm font-bold text-slate-600">No products match your current filters.</p>
                <Button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                    setMaxPrice(1000);
                  }}
                  variant="default"
                  size="sm"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sorted.map((item) => {
                  const defaultDescriptions = {
                    VEGETABLES: 'Farm-fresh harvest, rich in vitamins & dietary fiber, harvested daily without synthetic additives.',
                    CHICKEN: 'Tender farm chicken, 100% halal certified hand-cut, hygienically packed for oven or pan cooking.',
                    FISH: 'Pristine ocean-fresh catch, rich in Omega-3 fatty acids, cleaned, de-boned and vacuum packed.',
                    BEEF: 'Prime halal grass-fed beef cut, aged to perfection with natural fine marbling and rich tenderness.',
                    GROCERY: 'Daily kitchen staple harvested ethically from partner farms, 100% pure and unadulterated.'
                  };

                  const defaultTags = {
                    VEGETABLES: ['Fresh Produce', 'Organic', 'Farm Direct'],
                    CHICKEN: ['100% Halal', 'Tender Cut', 'Antibiotic-Free'],
                    FISH: ['Wild Catch', 'Omega-3', 'De-scaled'],
                    BEEF: ['Halal Beef', 'Grass-Fed', 'Aged Cut'],
                    GROCERY: ['Pure Organic', 'Unrefined', 'Pantry Staple']
                  };

                  const catKey = (item.categoryName || item.category || 'GROCERY').toUpperCase();
                  const description = item.description || defaultDescriptions[catKey] || 'Fresh and premium quality guaranteed from local partner farms.';
                  const tags = item.tags || defaultTags[catKey] || ['Fresh', 'Top Quality', '15m Delivery'];

                  const navTargetId = item._id || item.id || item.slug;

                  return (
                    <div
                      key={item.id || item._id}
                      className="bg-white rounded-[28px] p-4 border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Top Image Frame with Category Cutout Tab */}
                      <div 
                        onClick={() => onNavigate?.(`product/${navTargetId}`)}
                        className="relative rounded-[22px] overflow-hidden bg-[#FBF9F7] aspect-[4/3] flex items-center justify-center cursor-pointer"
                      >
                        {/* Top-Left Category Tab */}
                        <div className="absolute top-0 left-0 bg-white px-3.5 py-1.5 rounded-br-2xl text-xs font-semibold text-slate-700 shadow-2xs z-10 capitalize tracking-tight flex items-center gap-1.5">
                          <span>{item.categoryName || item.category || 'Category'}</span>
                          {item.shopName && (
                            <span className="text-[10px] text-[#FF7622] font-semibold border-l border-slate-200 pl-1.5">
                              {item.shopName}
                            </span>
                          )}
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
                          {/* Title & Price Badge Row (INR ₹) */}
                          <div className="flex items-start justify-between gap-3">
                            <h4 
                              onClick={() => onNavigate?.(`product/${navTargetId}`)}
                              className="font-extrabold text-base text-[#181C2E] hover:text-[#FF7622] transition-colors cursor-pointer line-clamp-1 leading-snug flex-1"
                              title={item.name}
                            >
                              {item.name}
                            </h4>

                            {/* Price Pill Badge (INR ₹) */}
                            <Badge variant="default" className="shrink-0 px-3.5 py-1.5 text-xs font-extrabold shadow-2xs bg-[#FF7622] text-white hover:bg-[#E56314]">
                              ₹{Number(item.price).toFixed(2)}
                            </Badge>
                          </div>

                          {/* Multi-line Description */}
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal mt-2">
                            {description}
                          </p>

                          {/* Pill Tags Row */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-3">
                            {tags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="peach"
                                className="text-[10px] font-semibold"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Full-width Rounded Add to Cart Button */}
                        <Button
                          variant="default"
                          size="pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item.id || item._id, item.name, item.price, item.image);
                          }}
                          className={cn(
                            'w-full mt-4 bg-[#FF7622] hover:bg-[#E56314] text-white',
                            addedItems[item.id || item._id] && 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                          )}
                        >
                          {addedItems[item.id || item._id] ? (
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
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
