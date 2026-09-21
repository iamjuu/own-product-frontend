import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  Clock, 
  RotateCcw, 
  Check, 
  ArrowLeft, 
  ChevronRight, 
  Sparkles, 
  Award, 
  Flame, 
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  ShoppingCart
} from 'lucide-react';
import { getProductById, getRelatedProducts } from '../../../data/productsData';
import ApiClient from '../../../api/client';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { cn } from '../../../lib/utils';

export const ProductDetailPage = ({ productId = 'prod-chk-2', onNavigate }) => {
  const [product, setProduct] = useState(() => getProductById(productId));
  const [selectedImage, setSelectedImage] = useState(product?.gallery?.[0] || product?.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToast, setAddedToast] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Sync whenever productId prop changes (Try DB API first, fallback to productsData)
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      // Immediate sync with local fallback so UI doesn't flicker
      const fallback = getProductById(productId);
      if (fallback && isMounted) {
        setProduct(fallback);
        setSelectedImage(fallback.gallery?.[0] || fallback.image);
        setRelatedProducts(getRelatedProducts(fallback.category, fallback.id));
      }

      // If productId could be an API ID or slug, fetch from backend
      try {
        const res = await ApiClient.get(`/products/${productId}`);
        if (isMounted && res.data) {
          const dbItem = res.data;
          const formatted = {
            id: dbItem._id,
            _id: dbItem._id,
            slug: dbItem.slug,
            name: dbItem.name,
            category: (dbItem.categoryName || 'GENERAL').toUpperCase(),
            categoryLabel: dbItem.categoryName || 'General',
            subcategoryName: dbItem.subcategoryName || '',
            brandName: dbItem.brandName || '',
            price: Number(dbItem.price) || 0,
            originalPrice: Number(dbItem.mrp) || Number(dbItem.price) * 1.25,
            discount: dbItem.mrp && dbItem.mrp > dbItem.price 
              ? `-${Math.round(((dbItem.mrp - dbItem.price) / dbItem.mrp) * 100)}%` 
              : '-20%',
            rating: 5.0,
            reviewsCount: 120,
            inStock: dbItem.inStock !== false,
            stockCount: dbItem.stockQuantity || 35,
            sku: dbItem.slug?.toUpperCase() || 'SKU-ITEM',
            weight: dbItem.unit ? `1 ${dbItem.unit}` : 'Standard pack',
            servings: '2 - 3 Persons',
            shelfLife: '3 Days refrigerated (0-4°C)',
            origin: 'Locally Sourced & Farm Certified',
            halalCertified: true,
            badge: 'Verified Fresh',
            image: dbItem.image || fallback?.image,
            gallery: fallback?.gallery || [dbItem.image],
            description: dbItem.description || fallback?.description || 'Fresh, hygienically packed product delivered to your doorstep.',
            highlights: fallback?.highlights || [
              '100% Quality Guaranteed & Freshly Handpicked',
              'Sourced directly from verified partner producers',
              'Vacuum sealed in food-grade packaging'
            ],
            nutrition: fallback?.nutrition || {
              servingSize: '100g',
              calories: '150 kcal',
              protein: '15g',
              fats: '4g',
              carbs: '2g',
            },
            storageGuide: fallback?.storageGuide || 'Store in cool, refrigerated conditions between 0°C to 4°C.',
            cookingTips: fallback?.cookingTips || 'Wash thoroughly before cooking. Cook fresh within 2-3 days.',
            reviews: fallback?.reviews || [],
          };

          setProduct(formatted);
          setSelectedImage(formatted.gallery?.[0] || formatted.image);
          setRelatedProducts(getRelatedProducts(formatted.category, formatted.id));
        }
      } catch (err) {
        // Fallback already in place
      }
    };

    loadProduct();
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleAddToCart = () => {
    setAddedToast(`Added ${quantity} × ${product.name} to cart!`);
    setTimeout(() => setAddedToast(null), 2500);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const savingsAmount = (product.originalPrice - product.price).toFixed(2);

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#1F2229] font-sans pb-24">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#181C2E] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">
            ✓
          </span>
          <span>{addedToast}</span>
        </div>
      )}

      {copiedLink && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#FF7622] text-white px-5 py-2.5 rounded-2xl shadow-2xl text-xs font-bold animate-in fade-in duration-150">
          Link copied to clipboard!
        </div>
      )}

      {/* Top Breadcrumbs & Back Bar */}
      <div className="bg-white border-b border-orange-100/60 sticky top-0 md:top-16 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold overflow-x-auto">
            <button 
              onClick={() => onNavigate?.('home')} 
              className="hover:text-[#FF7622] transition-colors shrink-0"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <button 
              onClick={() => onNavigate?.('shop')} 
              className="hover:text-[#FF7622] transition-colors shrink-0"
            >
              Shop
            </button>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="text-slate-400 shrink-0">{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="text-[#FF7622] font-bold truncate max-w-[180px] sm:max-w-xs">
              {product.name}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('shop')}
            className="flex items-center space-x-1.5 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Shop</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
      </div>

      {/* Main Product Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-orange-100/70 shadow-sm">
          
          {/* LEFT COLUMN: Gallery & Visuals (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Large Image Frame */}
            <div className="relative rounded-2xl bg-[#FFFDF9] border border-orange-100/80 p-6 flex items-center justify-center min-h-[340px] sm:min-h-[420px] overflow-hidden group">
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                <span className="px-3 py-1 rounded-full bg-[#FF7622] text-white font-black text-xs uppercase tracking-wider shadow-sm">
                  {product.discount} OFF
                </span>
                {product.halalCertified && (
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>100% Halal</span>
                  </span>
                )}
              </div>

              {product.badge && (
                <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-wider">
                  ⭐ {product.badge}
                </span>
              )}

              <img
                src={selectedImage}
                alt={product.name}
                className="max-h-72 sm:max-h-84 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Thumbnail Carousel */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-1 pt-1">
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-[#FFFDF9] border-2 p-1.5 shrink-0 transition-all ${
                      selectedImage === imgUrl 
                        ? 'border-[#FF7622] shadow-sm scale-105' 
                        : 'border-slate-200 hover:border-orange-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees Box */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#FFF9F5] p-3 rounded-xl border border-orange-100 flex items-center space-x-2.5">
                <Truck className="w-5 h-5 text-[#FF7622] shrink-0" />
                <div className="leading-tight">
                  <p className="text-xs font-bold text-stone-800">15-30 Min Delivery</p>
                  <p className="text-[10px] text-stone-500">Chilled cold-chain packaging</p>
                </div>
              </div>
              <div className="bg-[#F6FAF7] p-3 rounded-xl border border-emerald-100 flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="leading-tight">
                  <p className="text-xs font-bold text-stone-800">Freshness Guaranteed</p>
                  <p className="text-[10px] text-stone-500">Free replacement if not fresh</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Specs, Actions, Quantity (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Category & SKU */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF7622] bg-orange-50 px-3 py-1 rounded-md">
                {product.categoryLabel || product.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                SKU: <strong className="text-slate-600">{product.sku}</strong>
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1F2229] leading-snug tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs text-slate-500 font-normal mt-1">
                Delivered fresh from local partner farms &amp; certified butcheries
              </p>
            </div>

            {/* Star Rating & Verified Count */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-amber-600">{product.rating.toFixed(1)}</span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-slate-600 hover:text-[#FF7622] cursor-pointer">
                {product.reviewsCount} Verified Customer Ratings
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-emerald-600 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>In Stock ({product.stockCount} left)</span>
              </span>
            </div>

            {/* Price Box */}
            <div className="bg-[#FFF9F5] p-4 sm:p-4.5 rounded-2xl border border-orange-100/80 flex flex-wrap items-center gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#FF7622]">
                ₹{Number(product.price).toFixed(2)}
              </span>
              <span className="text-sm sm:text-base text-slate-400 line-through font-medium">
                ₹{Number(product.originalPrice).toFixed(2)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF7622] text-white text-[11px] font-bold">
                Save ₹{savingsAmount} ({product.discount})
              </span>
              <div className="w-full text-[11px] text-slate-500 font-normal pt-0.5">
                Inclusive of all taxes. Free 15-min delivery on orders over ₹299.
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Key Bullet Highlights */}
            {product.highlights && (
              <div className="space-y-2 bg-[#FBFBFB] p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-black text-[#1F2229] uppercase tracking-wider">
                  Product Highlights
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                  {product.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Weight / Unit</span>
                <strong className="text-stone-800">{product.weight}</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Servings</span>
                <strong className="text-stone-800">{product.servings || '2-3 Servings'}</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Shelf Life</span>
                <strong className="text-stone-800">{product.shelfLife || '3 Days Fresh'}</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Source Origin</span>
                <strong className="text-stone-800">{product.origin}</strong>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Quantity Counter */}
                <div className="flex items-center justify-between border-2 border-slate-200 rounded-xl px-3 py-2 bg-white w-full sm:w-36 shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-[#FF7622] font-black text-sm flex items-center justify-center transition-all disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="font-black text-sm text-[#1F2229] px-3">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-[#FF7622] font-black text-sm flex items-center justify-center transition-all"
                  >
                    +
                  </button>
                </div>

                {/* Add To Cart Button */}
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  <span>ADD TO CART • ₹{(product.price * quantity).toFixed(2)}</span>
                </Button>

                {/* Wishlist Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={cn(
                    'shrink-0',
                    isFavorite && 'border-rose-500 bg-rose-50 text-rose-500 hover:border-rose-500 hover:text-rose-500'
                  )}
                  title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={cn('w-4 h-4', isFavorite && 'fill-rose-500')} />
                </Button>

                {/* Share Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="shrink-0"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Buy Now Direct Button (Outline Variant from Image 2) */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => onNavigate?.('orders'), 300);
                }}
                className="w-full"
              >
                <span>⚡ BUY NOW WITH 1-CLICK CHECKOUT</span>
              </Button>
            </div>

            {/* Delivery Radar Status Notice */}
            <div className="flex items-center space-x-3 p-3.5 bg-orange-50/70 rounded-xl border border-orange-100 text-xs text-stone-700">
              <Clock className="w-4 h-4 text-[#FF7622] shrink-0" />
              <span>
                Order in the next <strong className="text-[#FF7622]">14 mins</strong> for doorstep delivery by <strong className="text-stone-900">Today, 10:45 PM</strong>.
              </span>
            </div>

          </div>
        </div>

        {/* -------------------------------------------------------------
            TABS SECTION: Overview, Nutrition, Storage, Reviews, Delivery
           ------------------------------------------------------------- */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-orange-100/70 shadow-sm">
          
          {/* Tab Headers */}
          <div className="flex items-center space-x-2 sm:space-x-8 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'overview', label: 'Overview & Highlights' },
              { id: 'nutrition', label: 'Nutritional Facts' },
              { id: 'storage', label: 'Storage & Culinary Tips' },
              { id: 'reviews', label: `Customer Reviews (${product.reviewsCount})` },
              { id: 'delivery', label: 'Delivery & Returns' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm font-black tracking-wider pb-3 transition-all shrink-0 -mb-[2px] border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#FF7622] text-[#FF7622]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pt-6 text-left">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-[#1F2229] mb-2">Detailed Product Description</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {product.description} Sourced ethically under strict hygiene and humane handling standards, ensuring tenderness, clean flavor, and maximum freshness from farm to table.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-[#FFFDFB] p-5 rounded-2xl border border-orange-100 space-y-3">
                    <h4 className="text-xs font-black uppercase text-[#FF7622] tracking-wider">Quality Assurance</h4>
                    <ul className="space-y-2 text-xs text-slate-600 font-medium">
                      <li>• 100% Halal Slaughtered according to authentic Islamic rites</li>
                      <li>• Vacuum sealed in food-safe anti-microbial barrier film</li>
                      <li>• Cold-chain strictly maintained below 4°C during transportation</li>
                      <li>• Cleaned, dressed, and ready for your recipes without washing needed</li>
                    </ul>
                  </div>

                  <div className="bg-[#FFFDFB] p-5 rounded-2xl border border-orange-100 space-y-3">
                    <h4 className="text-xs font-black uppercase text-[#FF7622] tracking-wider">Specifications</h4>
                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">SKU Code</span>
                        <span className="font-bold text-stone-800">{product.sku}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Net Weight</span>
                        <span className="font-bold text-stone-800">{product.weight}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Country of Origin</span>
                        <span className="font-bold text-stone-800">{product.origin}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Certification</span>
                        <span className="font-bold text-emerald-600">Certified Halal &amp; ISO 22000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-base font-black text-[#1F2229] mb-1">Nutrition Facts</h3>
                  <p className="text-xs text-slate-500">
                    Values based on a {product.nutrition?.servingSize || '100g'} standard edible portion
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="bg-slate-50 p-3 font-black text-stone-800 flex justify-between">
                    <span>Nutrient</span>
                    <span>Amount per Serving</span>
                  </div>
                  <div className="p-3 flex justify-between font-bold text-stone-800">
                    <span>Calories</span>
                    <span className="text-[#FF7622]">{product.nutrition?.calories || '200 kcal'}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-slate-600">Total Protein</span>
                    <span className="font-bold text-stone-800">{product.nutrition?.protein || '25g'}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-slate-600">Total Fats</span>
                    <span className="font-bold text-stone-800">{product.nutrition?.fats || '8g'}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-slate-600">Total Carbohydrates</span>
                    <span className="font-bold text-stone-800">{product.nutrition?.carbs || '0g'}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-slate-600">Sodium</span>
                    <span className="font-bold text-stone-800">{product.nutrition?.sodium || '70mg'}</span>
                  </div>
                  {product.nutrition?.iron && (
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-600">Iron</span>
                      <span className="font-bold text-stone-800">{product.nutrition.iron}</span>
                    </div>
                  )}
                  {product.nutrition?.omega3 && (
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-600">Omega-3 Fatty Acids</span>
                      <span className="font-bold text-emerald-600">{product.nutrition.omega3}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#FFF9F5] p-5 rounded-2xl border border-orange-100 space-y-3">
                    <h4 className="text-sm font-black text-[#1F2229] flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[#FF7622]" />
                      <span>Storage Guidelines</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {product.storageGuide || 'Store refrigerated at 0-4°C. Consume within 3 days.'}
                    </p>
                  </div>

                  <div className="bg-[#FFF9F5] p-5 rounded-2xl border border-orange-100 space-y-3">
                    <h4 className="text-sm font-black text-[#1F2229] flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-[#FF7622]" />
                      <span>Chef’s Preparation &amp; Cooking Tips</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {product.cookingTips || 'Season generously with sea salt and black pepper. Cook thoroughly before consuming.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating summary */}
                <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-center sm:text-left space-y-1">
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <span className="text-4xl font-black text-[#1F2229]">{product.rating.toFixed(1)}</span>
                      <span className="text-sm text-slate-400 font-bold">/ 5.0</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">Based on {product.reviewsCount} customer reviews</p>
                  </div>

                  <div className="text-center sm:text-right">
                    <button
                      onClick={() => alert('Review submitted! Thank you for your feedback.')}
                      className="px-5 py-2.5 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all"
                    >
                      Write a Review
                    </button>
                  </div>
                </div>

                {/* Review cards */}
                <div className="space-y-4">
                  {(product.reviews && product.reviews.length > 0 ? product.reviews : [
                    {
                      id: 'rev-default-1',
                      author: 'Shabbir Hassan',
                      date: '3 days ago',
                      rating: 5,
                      title: 'Remarkably fresh and well prepared',
                      comment: 'Delivered in under 20 minutes in a well-insulated chilled pouch. Quality matches gourmet butcher shops.'
                    },
                    {
                      id: 'rev-default-2',
                      author: 'Kavita Patel',
                      date: '1 week ago',
                      rating: 5,
                      title: 'Super fast delivery and great taste',
                      comment: 'Cooked perfectly tender and fresh. No strange odors or excess water weight. Very happy with the purchase!'
                    }
                  ]).map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-7 h-7 rounded-full bg-orange-100 text-[#FF7622] font-black text-xs flex items-center justify-center">
                            {rev.author.charAt(0)}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-[#1F2229]">{rev.author}</p>
                            <span className="text-[10px] text-emerald-600 font-semibold">✓ Verified Buyer</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs font-bold text-stone-800">{rev.title}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4 text-xs text-slate-600">
                <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-orange-100 space-y-3">
                  <h4 className="text-sm font-black text-[#1F2229] flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-[#FF7622]" />
                    <span>Instant Radar Delivery Network</span>
                  </h4>
                  <p className="leading-relaxed">
                    Orders are dispatched from our local temperature-controlled hub within 4 minutes of order confirmation. Our delivery partners use insulated thermal bags with dry ice gel packs to maintain optimal temperature until it reaches your kitchen.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-orange-100 space-y-3">
                  <h4 className="text-sm font-black text-[#1F2229] flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4 text-[#FF7622]" />
                    <span>Hassle-Free Freshness Guarantee</span>
                  </h4>
                  <p className="leading-relaxed">
                    If for any reason you are not 100% satisfied with the quality or freshness of your item, report it on your order tracking screen or via WhatsApp support within 4 hours of delivery for an instant replacement or immediate refund to your account wallet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------------
            RELATED PRODUCTS CAROUSEL / GRID
           ------------------------------------------------------------- */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 text-left space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-[#1F2229] tracking-tight">
                  Related Fresh Items
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Customers who viewed this item also loved these products
                </p>
              </div>
              <button
                onClick={() => onNavigate?.('shop')}
                className="text-xs font-bold text-[#FF7622] hover:underline"
              >
                View Catalog →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => {
                const defaultTags = {
                  VEGETABLES: ['Fresh Produce', 'Organic'],
                  CHICKEN: ['100% Halal', 'Tender Cut'],
                  FISH: ['Wild Catch', 'Omega-3'],
                  BEEF: ['Halal Beef', 'Grass-Fed'],
                  GROCERY: ['Pure Organic', 'Pantry Staple']
                };
                const tags = item.tags || defaultTags[item.category] || ['Fresh', 'Top Quality'];

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-[28px] p-4 border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Top Image Frame with Category Tab */}
                    <div 
                      onClick={() => onNavigate?.(`product/${item.id}`)}
                      className="relative rounded-[22px] overflow-hidden bg-[#FBF9F7] aspect-[4/3] flex items-center justify-center cursor-pointer"
                    >
                      {/* Top-Left Category Tab */}
                      <div className="absolute top-0 left-0 bg-white px-3.5 py-1.5 rounded-br-2xl text-[11px] font-bold text-slate-700 shadow-2xs z-10 capitalize tracking-tight">
                        {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase() : 'Category'}
                      </div>

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
                            className="font-extrabold text-sm sm:text-base text-[#181C2E] hover:text-[#FF7622] transition-colors cursor-pointer line-clamp-1 leading-snug flex-1"
                            title={item.name}
                          >
                            {item.name}
                          </h4>

                          <div className="shrink-0 px-3 py-1 rounded-full bg-[#FF7622] text-white font-extrabold text-xs shadow-2xs">
                            ₹{Number(item.price).toFixed(2)}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal mt-2">
                          {item.description || 'Farm-fresh harvest, tender cut, and cold-chain delivered.'}
                        </p>

                        {/* Tags */}
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

                      {/* Add to Cart Button (Image 2 Color #FF7622) */}
                      <Button
                        variant="default"
                        size="pill"
                        onClick={() => onNavigate?.(`product/${item.id}`)}
                        className="w-full mt-4"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1.5" />
                        <span>Add To Cart</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
