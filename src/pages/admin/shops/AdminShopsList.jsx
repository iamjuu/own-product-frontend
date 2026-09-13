import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Eye,
  Key,
  Copy,
  Check,
  Package,
  ArrowLeft,
  Tag,
  Layers,
  Edit2,
  Trash2,
  RefreshCw,
  LayoutGrid,
  List,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { Modal, ConfirmDialog } from '../../../components/common/Modal';

export const AdminShopsList = () => {
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Selected Shop for Viewing / Adding Products
  const [activeShop, setActiveShop] = useState(null);
  const [shopProducts, setShopProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  // Add Shop Modal State
  const [isAddShopModalOpen, setIsAddShopModalOpen] = useState(false);
  const [newShopForm, setNewShopForm] = useState({
    name: '',
    openingTime: '08:00 AM',
    closingTime: '10:00 PM',
    phone: '+91 98000 12345',
    category: 'Retail & Supermarket',
  });
  const [createdShopResult, setCreatedShopResult] = useState(null);
  const [isSubmittingShop, setIsSubmittingShop] = useState(false);
  const [shopFormError, setShopFormError] = useState('');

  // Add / Edit Product Modal State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: '',
    brandId: '',
    price: '',
    mrp: '',
    unit: '1 pc',
    stockQuantity: 50,
    inStock: true,
    image: '',
    description: '',
  });
  const [productFormError, setProductFormError] = useState('');
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);

  // Clipboard
  const [copiedId, setCopiedId] = useState(null);

  // 1. Fetch Shops
  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get('/admin/shops', {
        search: search || undefined,
        status: statusFilter || undefined,
      });
      if (response.success && response.data) {
        setShops(response.data.shops || []);
      }
    } catch (err) {
      console.error('Failed to load shops:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch Categories & Brands for Product Creation
  const fetchTaxonomy = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        ApiClient.get('/admin/categories'),
        ApiClient.get('/admin/brands'),
      ]);
      if (catRes.success && catRes.data) setCategories(catRes.data.categories || []);
      if (brandRes.success && brandRes.data) setBrands(brandRes.data.brands || []);
    } catch (err) {
      console.error('Failed to load taxonomy:', err);
    }
  };

  // 3. Fetch Products for Active Shop
  const fetchShopProducts = async (shopId) => {
    setIsProductsLoading(true);
    try {
      const response = await ApiClient.get('/admin/products', { shopId });
      if (response.success && response.data) {
        setShopProducts(response.data.products || []);
      }
    } catch (err) {
      console.error('Failed to load shop products:', err);
    } finally {
      setIsProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
    fetchTaxonomy();
  }, [statusFilter]);

  useEffect(() => {
    if (activeShop) {
      fetchShopProducts(activeShop._id);
    }
  }, [activeShop]);

  // Handle Search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchShops();
  };

  // Computed Auto Credentials Preview
  const getComputedSlug = (name) => {
    return name
      ? name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : 'shop-name';
  };

  const getComputedPassword = (name) => {
    const clean = name ? name.trim().replace(/[^a-zA-Z0-9]/g, '') : 'Shop';
    return `${clean || 'Shop'}@2026`;
  };

  // Open Add Shop
  const handleOpenAddShop = () => {
    setNewShopForm({
      name: '',
      openingTime: '08:00 AM',
      closingTime: '10:00 PM',
      phone: '+91 98000 12345',
      category: 'Retail & Supermarket',
    });
    setShopFormError('');
    setCreatedShopResult(null);
    setIsAddShopModalOpen(true);
  };

  // Submit Add Shop
  const handleCreateShop = async (e) => {
    e.preventDefault();
    if (!newShopForm.name.trim()) {
      setShopFormError('Shop name is required.');
      return;
    }

    setIsSubmittingShop(true);
    setShopFormError('');
    try {
      const response = await ApiClient.post('/admin/shops', newShopForm);
      if (response.success && response.data) {
        setCreatedShopResult(response.data);
        fetchShops();
      } else {
        setShopFormError(response.message || 'Failed to create shop');
      }
    } catch (err) {
      setShopFormError(err.message || 'An error occurred while creating shop');
    } finally {
      setIsSubmittingShop(false);
    }
  };

  // Open Add Product for Active Shop
  const handleOpenAddProduct = () => {
    const firstCat = categories[0]?._id || '';
    const filteredBrands = brands.filter((b) => b.categoryId === firstCat);
    setProductForm({
      name: '',
      categoryId: firstCat,
      brandId: filteredBrands[0]?._id || '',
      price: '',
      mrp: '',
      unit: '1 pc',
      stockQuantity: 50,
      inStock: true,
      image: '',
      description: '',
    });
    setProductFormError('');
    setIsAddProductModalOpen(true);
  };

  // When category changes in Add Product modal, filter brand options
  const handleProductCategoryChange = (catId) => {
    const filteredBrands = brands.filter((b) => b.categoryId === catId);
    setProductForm((prev) => ({
      ...prev,
      categoryId: catId,
      brandId: filteredBrands[0]?._id || '',
    }));
  };

  // Submit Add Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      setProductFormError('Product name is required.');
      return;
    }
    if (!productForm.categoryId) {
      setProductFormError('Please select a Category.');
      return;
    }
    if (!productForm.price || isNaN(productForm.price) || Number(productForm.price) < 0) {
      setProductFormError('Valid product price is required.');
      return;
    }

    setIsSubmittingProduct(true);
    setProductFormError('');
    try {
      const payload = {
        ...productForm,
        shopId: activeShop._id,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp) || Number(productForm.price),
        stockQuantity: Number(productForm.stockQuantity) || 0,
      };

      const response = await ApiClient.post('/admin/products', payload);
      if (response.success) {
        setIsAddProductModalOpen(false);
        fetchShopProducts(activeShop._id);
      } else {
        setProductFormError(response.message || 'Failed to add product');
      }
    } catch (err) {
      setProductFormError(err.message || 'Error occurred while creating product');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Open Edit Product
  const handleOpenEditProduct = (prod) => {
    setSelectedProduct(prod);
    setProductForm({
      name: prod.name,
      categoryId: prod.categoryId || '',
      brandId: prod.brandId || '',
      price: prod.price,
      mrp: prod.mrp || prod.price,
      unit: prod.unit || '1 pc',
      stockQuantity: prod.stockQuantity || 0,
      inStock: prod.inStock !== undefined ? prod.inStock : true,
      image: prod.image || '',
      description: prod.description || '',
    });
    setProductFormError('');
    setIsEditProductModalOpen(true);
  };

  // Submit Update Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      setProductFormError('Product name is required.');
      return;
    }
    if (!productForm.price || isNaN(productForm.price) || Number(productForm.price) < 0) {
      setProductFormError('Valid product price is required.');
      return;
    }

    setIsSubmittingProduct(true);
    setProductFormError('');
    try {
      const response = await ApiClient.patch(`/admin/products/${selectedProduct._id}`, {
        ...productForm,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp) || Number(productForm.price),
        stockQuantity: Number(productForm.stockQuantity) || 0,
      });
      if (response.success) {
        setIsEditProductModalOpen(false);
        fetchShopProducts(activeShop._id);
      } else {
        setProductFormError(response.message || 'Failed to update product');
      }
    } catch (err) {
      setProductFormError(err.message || 'Error occurred while updating product');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async () => {
    if (!deleteProductTarget) return;
    try {
      await ApiClient.delete(`/admin/products/${deleteProductTarget._id}`);
      setDeleteProductTarget(null);
      fetchShopProducts(activeShop._id);
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // Toggle Product In-Stock
  const handleToggleProductStock = async (prod) => {
    try {
      await ApiClient.patch(`/admin/products/${prod._id}`, {
        inStock: !prod.inStock,
      });
      fetchShopProducts(activeShop._id);
    } catch (err) {
      console.error('Failed to toggle stock status:', err);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeBrandsForSelectedCat = brands.filter(
    (b) => b.categoryId === productForm.categoryId
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ========================================================================= */}
      {/* VIEW A: SHOP PRODUCTS / INVENTORY DRILL-DOWN */}
      {/* ========================================================================= */}
      {activeShop ? (
        <div className="space-y-6">
          {/* Back Navigation Banner */}
          <div className="theme-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveShop(null)}
                className="p-2.5 rounded-2xl bg-[#f0f2fb] hover:bg-[#ece8ff] text-[#6339f4] transition-all"
                title="Back to All Shops"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-black text-[#181829] tracking-tight">
                    {activeShop.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                    {activeShop.status || 'ACTIVE'}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-[#8a87a6] mt-1 font-medium">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#6339f4]" />
                    <span>{activeShop.openingTime} - {activeShop.closingTime}</span>
                  </span>
                  <span>•</span>
                  <span>Owner Login: <code className="text-[#6339f4] font-mono">{activeShop.ownerEmail}</code></span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchShopProducts(activeShop._id)}
                className="p-2.5 rounded-2xl bg-[#f0f2fb] text-[#8a87a6] hover:text-[#181829] transition-all"
                title="Refresh products"
              >
                <RefreshCw className={`w-4 h-4 ${isProductsLoading ? 'animate-spin text-[#6339f4]' : ''}`} />
              </button>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product to Shop</span>
              </button>
            </div>
          </div>

          {/* Shop Inventory Telemetry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="theme-card p-4 space-y-1">
              <span className="text-[11px] font-bold text-[#8a87a6]">Listed Products</span>
              <div className="text-xl font-black text-[#181829]">{shopProducts.length}</div>
              <span className="text-[10px] text-[#6339f4] font-medium">Items in inventory</span>
            </div>
            <div className="theme-card p-4 space-y-1">
              <span className="text-[11px] font-bold text-[#8a87a6]">In Stock & Available</span>
              <div className="text-xl font-black text-emerald-600">
                {shopProducts.filter((p) => p.inStock).length}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">Ready for ordering</span>
            </div>
            <div className="theme-card p-4 space-y-1">
              <span className="text-[11px] font-bold text-[#8a87a6]">Categories Represented</span>
              <div className="text-xl font-black text-indigo-600">
                {new Set(shopProducts.map((p) => p.categoryId)).size}
              </div>
              <span className="text-[10px] text-indigo-600 font-medium">Department coverage</span>
            </div>
          </div>

          {/* Products List */}
          {isProductsLoading ? (
            <div className="theme-card p-12 text-center text-xs text-slate-400 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#6339f4] border-t-transparent animate-spin mx-auto"></div>
              <p className="font-semibold text-slate-600">Loading shop inventory...</p>
            </div>
          ) : shopProducts.length === 0 ? (
            <div className="theme-card p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#f0f2fb] text-[#6339f4] flex items-center justify-center mx-auto">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-[#181829]">No Products Listed Yet</h3>
              <p className="text-xs text-[#8a87a6] max-w-sm mx-auto">
                This shop has no products in its catalog. Add products by choosing Category, Brand, and pricing details.
              </p>
              <button
                onClick={handleOpenAddProduct}
                className="px-5 py-2.5 rounded-2xl bg-[#6339f4] text-xs font-bold text-white hover:bg-[#5327ec] shadow-md shadow-[#6339f4]/25"
              >
                + Add First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {shopProducts.map((prod) => (
                <div
                  key={prod._id}
                  className="theme-card overflow-hidden hover:border-[#6339f4]/40 hover:shadow-xl transition-all group flex flex-col justify-between"
                >
                  <div className="h-36 bg-slate-100 relative overflow-hidden">
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#6339f4] bg-[#f0f2fb]">
                        <Package className="w-8 h-8" />
                      </div>
                    )}

                    <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                        {prod.categoryName || 'General'}
                      </span>
                      {prod.brandName && (
                        <span className="px-2 py-0.5 rounded-lg bg-[#6339f4]/90 backdrop-blur-md text-white text-[10px] font-bold">
                          {prod.brandName}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleToggleProductStock(prod)}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold backdrop-blur-md transition-all shadow-sm ${
                          prod.inStock
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-[#181829] line-clamp-1">{prod.name}</h4>
                      <p className="text-[11px] text-[#8a87a6] line-clamp-1 mt-0.5">
                        {prod.description || 'Unit: ' + (prod.unit || '1 pc')}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="font-extrabold text-sm text-[#181829]">₹{prod.price}</span>
                          {prod.mrp > prod.price && (
                            <span className="text-[10px] text-slate-400 line-through">₹{prod.mrp}</span>
                          )}
                        </div>
                        <span className="text-[9px] text-[#8a87a6]">{prod.unit || '1 pc'} • Qty: {prod.stockQuantity}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 rounded-xl hover:bg-[#ece8ff] text-[#8a87a6] hover:text-[#6339f4] transition-all"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteProductTarget(prod)}
                          className="p-1.5 rounded-xl hover:bg-rose-50 text-[#8a87a6] hover:text-rose-600 transition-all"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW B: ALL SHOPS DIRECTORY */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Header */}
          <div className="theme-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-[#6339f4]/10 text-[#6339f4] ring-4 ring-[#ece8ff]">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#181829] tracking-tight">
                  Marketplace Shops Directory
                </h2>
                <p className="text-xs text-[#8a87a6] font-medium">
                  Add verified shops with opening/closing hours, auto-generate login credentials, and manage inventory.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenAddShop}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Shop</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="theme-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search shop name or owner..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
              />
            </form>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="TEMPORARILY_CLOSED">Temporarily Closed</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              <div className="flex items-center bg-[#f0f2fb] p-1 rounded-2xl border border-slate-200/80">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-xl transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#6339f4] text-white shadow-sm'
                      : 'text-[#8a87a6] hover:text-[#181829]'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-xl transition-all ${
                    viewMode === 'list'
                      ? 'bg-[#6339f4] text-white shadow-sm'
                      : 'text-[#8a87a6] hover:text-[#181829]'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={fetchShops}
                className="p-2 rounded-2xl bg-[#f0f2fb] text-[#8a87a6] hover:text-[#181829] hover:bg-[#e4e7f5] transition-all"
                title="Refresh list"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#6339f4]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Shops Grid */}
          {isLoading ? (
            <div className="theme-card p-12 text-center text-xs text-slate-400 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#6339f4] border-t-transparent animate-spin mx-auto"></div>
              <p className="font-semibold text-slate-600">Loading marketplace shops...</p>
            </div>
          ) : shops.length === 0 ? (
            <div className="theme-card p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#f0f2fb] text-[#6339f4] flex items-center justify-center mx-auto">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-[#181829]">No Shops Found</h3>
              <p className="text-xs text-[#8a87a6] max-w-sm mx-auto">
                Get started by clicking Add Shop. The system will automatically configure owner login credentials.
              </p>
              <button
                onClick={handleOpenAddShop}
                className="px-5 py-2.5 rounded-2xl bg-[#6339f4] text-xs font-bold text-white hover:bg-[#5327ec]"
              >
                + Add First Shop
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {shops.map((shop) => (
                <div
                  key={shop._id}
                  className="theme-card p-5 hover:border-[#6339f4]/40 hover:shadow-xl transition-all group flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6339f4]/20 to-purple-100 flex items-center justify-center text-[#6339f4] shrink-0 font-bold border border-purple-200/60 shadow-inner group-hover:scale-105 transition-transform">
                        <Store className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#181829] group-hover:text-[#6339f4] transition-colors">
                          {shop.name}
                        </h3>
                        <span className="text-[11px] text-[#8a87a6]">{shop.category || 'Store'}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        shop.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}
                    >
                      {shop.status || 'ACTIVE'}
                    </span>
                  </div>

                  {/* Hours & Owner info */}
                  <div className="p-3 rounded-2xl bg-[#f0f2fb] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[#181829]">
                      <span className="text-[#8a87a6] font-medium flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#6339f4]" />
                        <span>Hours:</span>
                      </span>
                      <span className="font-bold">{shop.openingTime || '08:00 AM'} – {shop.closingTime || '10:00 PM'}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#181829]">
                      <span className="text-[#8a87a6] font-medium">Owner:</span>
                      <span className="font-mono text-[11px] text-[#6339f4] truncate max-w-[170px]">
                        {shop.ownerEmail}
                      </span>
                    </div>
                  </div>

                  {/* Manage Products button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-[#8a87a6]">
                      {shop.totalOrders || 0} Total Orders
                    </span>

                    <button
                      onClick={() => setActiveShop(shop)}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#ece8ff] hover:bg-[#6339f4] text-[#6339f4] hover:text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Manage Products</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="theme-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f0f2fb] text-[#8a87a6] uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Shop</th>
                      <th className="py-3.5 px-4 font-bold">Hours (Open - Close)</th>
                      <th className="py-3.5 px-4 font-bold">Owner Account</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[#181829]">
                    {shops.map((shop) => (
                      <tr key={shop._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] shrink-0 font-bold">
                              <Store className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-[#181829]">{shop.name}</div>
                              <span className="text-[10px] text-[#8a87a6]">{shop.category || 'Retail'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {shop.openingTime || '08:00 AM'} – {shop.closingTime || '10:00 PM'}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#6339f4]">
                          {shop.ownerEmail}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              shop.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-amber-50 text-amber-600 border border-amber-200'
                            }`}
                          >
                            {shop.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setActiveShop(shop)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#6339f4] text-white text-xs font-bold hover:bg-[#5327ec] transition-all shadow-sm"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Catalog</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ADD SHOP MODAL (With Real-Time Auto-Generated Username & Password) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddShopModalOpen}
        onClose={() => !isSubmittingShop && setIsAddShopModalOpen(false)}
        title={createdShopResult ? 'Shop Created Successfully!' : 'Add New Marketplace Shop'}
        maxWidth="max-w-lg"
      >
        {createdShopResult ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">
                  Shop and Owner Account Configured!
                </h4>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Share these login credentials with the merchant to access their store dashboard.
                </p>
              </div>
            </div>

            {/* Credentials Card */}
            <div className="p-4 rounded-2xl bg-[#181829] text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[11px] font-bold text-white/70">Shop Name</span>
                <span className="text-xs font-black text-white">{createdShopResult.shop.name}</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[11px] font-bold text-white/70">Hours</span>
                <span className="text-xs font-semibold text-white">
                  {createdShopResult.shop.openingTime} – {createdShopResult.shop.closingTime}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[11px] font-bold text-white/70">Username / Email</span>
                <div className="flex items-center space-x-1.5 font-mono text-xs text-indigo-300">
                  <span>{createdShopResult.ownerCredentials.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/70">Initial Password</span>
                <div className="flex items-center space-x-1.5 font-mono text-xs text-amber-300 font-bold">
                  <span>{createdShopResult.ownerCredentials.displayPassword}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  const creds = `Marketplace Shop Login:\nShop: ${createdShopResult.shop.name}\nEmail: ${createdShopResult.ownerCredentials.email}\nPassword: ${createdShopResult.ownerCredentials.displayPassword}`;
                  copyToClipboard(creds, 'creds');
                }}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#ece8ff] text-[#6339f4] hover:bg-[#6339f4] hover:text-white text-xs font-bold transition-all shadow-sm"
              >
                {copiedId === 'creds' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Login Credentials</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsAddShopModalOpen(false);
                  setActiveShop(createdShopResult.shop);
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25"
              >
                Manage Shop Products →
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateShop} className="space-y-4">
            {shopFormError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{shopFormError}</span>
              </div>
            )}

            {/* Shop Name */}
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">
                Shop Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newShopForm.name}
                onChange={(e) => setNewShopForm({ ...newShopForm, name: e.target.value })}
                placeholder="e.g. Daily Fresh Supermarket"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            {/* Operating Times */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#181829] mb-1.5">
                  Opening Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newShopForm.openingTime}
                  onChange={(e) => setNewShopForm({ ...newShopForm, openingTime: e.target.value })}
                  placeholder="08:00 AM"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#181829] mb-1.5">
                  Ending / Closing Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newShopForm.closingTime}
                  onChange={(e) => setNewShopForm({ ...newShopForm, closingTime: e.target.value })}
                  placeholder="10:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
                />
              </div>
            </div>

            {/* Phone & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#181829] mb-1.5">Contact Phone</label>
                <input
                  type="text"
                  value={newShopForm.phone}
                  onChange={(e) => setNewShopForm({ ...newShopForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#181829] mb-1.5">Store Category</label>
                <input
                  type="text"
                  value={newShopForm.category}
                  onChange={(e) => setNewShopForm({ ...newShopForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
                />
              </div>
            </div>

            {/* REAL-TIME AUTO-GENERATED CREDENTIALS PREVIEW CARD */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#ece8ff] to-[#f0f2fb] border border-[#6339f4]/20 space-y-2">
              <div className="flex items-center space-x-2 text-[#6339f4]">
                <Key className="w-4 h-4" />
                <span className="font-bold text-xs">Auto-Generated Owner Credentials</span>
              </div>
              <div className="text-[11px] text-[#8a87a6]">
                These credentials will be automatically registered for the merchant:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-[#8a87a6] block font-sans">Username / Email:</span>
                  <span className="text-[#6339f4] font-bold truncate block">
                    {getComputedSlug(newShopForm.name)}@marketplace.com
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-[#8a87a6] block font-sans">Password:</span>
                  <span className="text-slate-700 font-bold block">
                    {getComputedPassword(newShopForm.name)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                disabled={isSubmittingShop}
                onClick={() => setIsAddShopModalOpen(false)}
                className="px-4 py-2 rounded-2xl text-xs font-bold text-[#8a87a6] hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingShop}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25 disabled:opacity-50"
              >
                {isSubmittingShop ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Shop...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Shop & Owner</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* 2. ADD PRODUCT MODAL (Shop -> Category -> Brand -> Details) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddProductModalOpen}
        onClose={() => !isSubmittingProduct && setIsAddProductModalOpen(false)}
        title={`Add Product to ${activeShop?.name || 'Shop'}`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          {productFormError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{productFormError}</span>
            </div>
          )}

          {/* Step 1 & Step 2: Category and Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-[#6339f4]" />
                <span>1. Choose Category</span>
                <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={productForm.categoryId}
                onChange={(e) => handleProductCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-[#6339f4]" />
                <span>2. Choose Brand</span>
              </label>
              <select
                value={productForm.brandId}
                onChange={(e) => setProductForm({ ...productForm, brandId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
              >
                <option value="">-- Generic / Store Brand --</option>
                {activeBrandsForSelectedCat.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">
              3. Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              placeholder="e.g. Amul Taaza Fresh Toned Milk"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
            />
          </div>

          {/* Pricing & Unit */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">
                Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                placeholder="28"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">MRP (₹)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={productForm.mrp}
                onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                placeholder="30"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Unit / Weight</label>
              <input
                type="text"
                value={productForm.unit}
                onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                placeholder="500 ml"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>
          </div>

          {/* Stock & Image */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={productForm.stockQuantity}
                onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Product Image URL</label>
              <input
                type="url"
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">Description</label>
            <textarea
              rows={2}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Product details, ingredients or key highlights..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4] resize-none"
            />
          </div>

          {/* In Stock toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f0f2fb] border border-slate-200">
            <div>
              <div className="text-xs font-bold text-[#181829]">Available for Ordering</div>
              <div className="text-[10px] text-[#8a87a6]">Customer can add this item to cart.</div>
            </div>
            <input
              type="checkbox"
              checked={productForm.inStock}
              onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
              className="w-4 h-4 text-[#6339f4] rounded focus:ring-[#6339f4] accent-[#6339f4]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              disabled={isSubmittingProduct}
              onClick={() => setIsAddProductModalOpen(false)}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-[#8a87a6] hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingProduct}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25 disabled:opacity-50"
            >
              {isSubmittingProduct ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 3. EDIT PRODUCT MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isEditProductModalOpen}
        onClose={() => !isSubmittingProduct && setIsEditProductModalOpen(false)}
        title="Edit Product Details"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleUpdateProduct} className="space-y-4">
          {productFormError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{productFormError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Category</label>
              <select
                value={productForm.categoryId}
                onChange={(e) => handleProductCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Brand</label>
              <select
                value={productForm.brandId}
                onChange={(e) => setProductForm({ ...productForm, brandId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
              >
                <option value="">-- Generic / Store Brand --</option>
                {activeBrandsForSelectedCat.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">Product Name</label>
            <input
              type="text"
              required
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">MRP (₹)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={productForm.mrp}
                onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Unit</label>
              <input
                type="text"
                value={productForm.unit}
                onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={productForm.stockQuantity}
                onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Image URL</label>
              <input
                type="url"
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f0f2fb] border border-slate-200">
            <div>
              <div className="text-xs font-bold text-[#181829]">In Stock Availability</div>
              <div className="text-[10px] text-[#8a87a6]">Toggle product availability in store.</div>
            </div>
            <input
              type="checkbox"
              checked={productForm.inStock}
              onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
              className="w-4 h-4 text-[#6339f4] rounded focus:ring-[#6339f4] accent-[#6339f4]"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              disabled={isSubmittingProduct}
              onClick={() => setIsEditProductModalOpen(false)}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-[#8a87a6] hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingProduct}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25 disabled:opacity-50"
            >
              {isSubmittingProduct ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* 4. DELETE PRODUCT CONFIRMATION */}
      <ConfirmDialog
        isOpen={!!deleteProductTarget}
        onClose={() => setDeleteProductTarget(null)}
        onConfirm={handleDeleteProduct}
        title="Remove Product"
        message={`Are you sure you want to remove "${deleteProductTarget?.name}" from ${activeShop?.name}?`}
        confirmText="Yes, Remove Product"
        isDestructive={true}
      />
    </div>
  );
};
