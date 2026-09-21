import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  RefreshCw,
  Sparkles,
  LayoutGrid,
  List,
  Layers,
  Tag,
  Scale,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  SlidersHorizontal,
  Sliders,
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { ConfirmDialog, Modal } from '../../../components/common/Modal';

// Preset high quality product photography
const PRESET_PRODUCT_IMAGES = [
  {
    name: 'Spices / Powder',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Poultry / Meat',
    url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fresh Fish',
    url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Beverage / Juice',
    url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dairy / Milk',
    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rice & Grains',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fresh Veggies',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Bakery / Bread',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
  },
];

export const AdminProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);

  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState('ALL');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('');

  const [viewMode, setViewMode] = useState('table'); // 'grid' | 'table'
  const [pageMode, setPageMode] = useState('list'); // 'list' | 'add' | 'edit'
  const [isLoading, setIsLoading] = useState(true);

  // Active product being edited / having variants managed
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Variant Management Modal state
  const [variantModalProduct, setVariantModalProduct] = useState(null);
  const [variantsList, setVariantsList] = useState([]);
  const [isVariantsLoading, setIsVariantsLoading] = useState(false);
  const [variantForm, setVariantForm] = useState({ unitId: '', quantity: '', sku: '', isActive: true });
  const [variantError, setVariantError] = useState('');
  const [variantSuccess, setVariantSuccess] = useState('');
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [deleteVariantTarget, setDeleteVariantTarget] = useState(null);

  // Form State for Add / Edit Product
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    subcategoryId: '',
    brandId: '',
    description: '',
    image: '',
    isActive: true,
  });
  const [formSubcategories, setFormSubcategories] = useState([]);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = {
        categoryId: selectedCategoryFilter !== 'ALL' ? selectedCategoryFilter : undefined,
        subcategoryId: selectedSubcategoryFilter !== 'ALL' ? selectedSubcategoryFilter : undefined,
        brandId: selectedBrandFilter !== 'ALL' ? selectedBrandFilter : undefined,
        status: statusFilter || undefined,
        search: search || undefined,
      };
      const res = await ApiClient.get('/products', params);
      if (res?.success) {
        const list = Array.isArray(res.data) ? res.data : (res.data?.products || []);
        setProducts(list);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch Master Taxonomies (Categories, Subcategories, Brands, Units)
  const fetchMasterData = async () => {
    try {
      const [catRes, subRes, brandRes, unitRes] = await Promise.all([
        ApiClient.get('/categories'),
        ApiClient.get('/subcategories'),
        ApiClient.get('/brands'),
        ApiClient.get('/units'),
      ]);

      if (catRes?.success) setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data?.categories || []);
      if (subRes?.success) setSubcategories(Array.isArray(subRes.data) ? subRes.data : subRes.data?.subcategories || []);
      if (brandRes?.success) setBrands(Array.isArray(brandRes.data) ? brandRes.data : brandRes.data?.brands || []);
      if (unitRes?.success) setUnits(Array.isArray(unitRes.data) ? unitRes.data : unitRes.data?.units || []);
    } catch (err) {
      console.error('Failed to load catalog masters:', err);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryFilter, selectedSubcategoryFilter, selectedBrandFilter, statusFilter]);

  // Load Subcategories when Category is selected in Product Form
  const handleCategoryChange = (catId) => {
    setFormData((prev) => ({ ...prev, categoryId: catId, subcategoryId: '' }));
    if (!catId) {
      setFormSubcategories([]);
      return;
    }
    const filteredSubs = subcategories.filter(
      (s) => s.categoryId?._id === catId || s.categoryId === catId
    );
    setFormSubcategories(filteredSubs);
  };

  // Open Add Product Page
  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      categoryId: '',
      subcategoryId: '',
      brandId: '',
      description: '',
      image: '',
      isActive: true,
    });
    setFormSubcategories([]);
    setFormError('');
    setFormSuccess('');
    setPageMode('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Edit Product Page
  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    const catId = product.categoryId?._id || product.categoryId || '';
    const subcatId = product.subcategoryId?._id || product.subcategoryId || '';
    const brandId = product.brandId?._id || product.brandId || '';

    const matchingSubs = subcategories.filter(
      (s) => s.categoryId?._id === catId || s.categoryId === catId
    );
    setFormSubcategories(matchingSubs);

    setFormData({
      name: product.name,
      categoryId: catId,
      subcategoryId: subcatId,
      brandId: brandId,
      description: product.description || '',
      image: product.image || '',
      isActive: product.isActive !== undefined ? product.isActive : true,
    });
    setFormError('');
    setFormSuccess('');
    setPageMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!formData.categoryId) {
      setFormError('Please select a Category.');
      return;
    }
    if (!formData.subcategoryId) {
      setFormError('Please select a Subcategory.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      const payload = {
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId,
        brandId: formData.brandId || null,
        description: formData.description.trim(),
        image: formData.image.trim(),
        isActive: formData.isActive,
      };

      let res;
      if (pageMode === 'add') {
        res = await ApiClient.post('/products', payload);
      } else {
        res = await ApiClient.patch(`/products/${selectedProduct._id}`, payload);
      }

      if (res?.success) {
        setFormSuccess(
          pageMode === 'add'
            ? `Product '${formData.name}' created! You can now manage its variants.`
            : `Product '${formData.name}' updated successfully.`
        );
        setTimeout(() => {
          setPageMode('list');
          fetchProducts();
        }, 1200);
      } else {
        setFormError(res?.message || 'Failed to save product.');
      }
    } catch (err) {
      setFormError(err.message || 'An unexpected error occurred while saving product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      const res = await ApiClient.delete(`/products/${deleteTarget._id}`);
      if (res?.success) {
        setDeleteTarget(null);
        fetchProducts();
      } else {
        alert(res?.message || 'Failed to delete product.');
      }
    } catch (err) {
      alert(err.message || 'Error deleting product.');
    }
  };

  // ==========================================
  // VARIANT MANAGEMENT LOGIC
  // ==========================================
  const handleOpenVariantsModal = async (product) => {
    setVariantModalProduct(product);
    setVariantError('');
    setVariantSuccess('');
    setVariantForm({ unitId: '', quantity: '', sku: '', isActive: true });
    setIsVariantsLoading(true);

    try {
      const res = await ApiClient.get(`/products/${product._id}/variants`);
      if (res?.success) {
        setVariantsList(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load variants:', err);
    } finally {
      setIsVariantsLoading(false);
    }
  };

  // Get allowed units for the active product's subcategory
  const activeSubcategoryAllowedUnits = useMemo(() => {
    if (!variantModalProduct) return [];
    const subcatId = variantModalProduct.subcategoryId?._id || variantModalProduct.subcategoryId;
    const sub = subcategories.find((s) => s._id === subcatId);
    if (!sub) return [];

    // sub.allowedUnitIds contains array of Unit objects or ObjectIds
    const allowedIds = (sub.allowedUnitIds || []).map((u) => (typeof u === 'object' ? u._id : u));
    return units.filter((u) => allowedIds.includes(u._id) && u.isActive);
  }, [variantModalProduct, subcategories, units]);

  // Add Variant
  const handleAddVariant = async (e) => {
    e.preventDefault();
    if (!variantForm.unitId) {
      setVariantError('Please select an allowed unit.');
      return;
    }
    const q = Number(variantForm.quantity);
    if (!q || q <= 0) {
      setVariantError('Quantity must be greater than 0.');
      return;
    }

    setIsAddingVariant(true);
    setVariantError('');
    setVariantSuccess('');

    try {
      const res = await ApiClient.post(`/products/${variantModalProduct._id}/variants`, {
        unitId: variantForm.unitId,
        quantity: q,
        sku: variantForm.sku?.trim() || '',
        isActive: variantForm.isActive,
      });

      if (res?.success) {
        setVariantSuccess(`Variant added: ${q} ${res.data?.unitId?.symbol || ''}`);
        setVariantForm({ unitId: '', quantity: '', sku: '', isActive: true });
        // Refresh variants
        const refreshed = await ApiClient.get(`/products/${variantModalProduct._id}/variants`);
        if (refreshed?.success) setVariantsList(refreshed.data || []);
        fetchProducts(); // Refresh variant counts in table
      } else {
        setVariantError(res?.message || 'Failed to add variant.');
      }
    } catch (err) {
      setVariantError(err.message || 'Error creating variant.');
    } finally {
      setIsAddingVariant(false);
    }
  };

  // Delete Variant
  const handleDeleteVariant = async () => {
    if (!deleteVariantTarget) return;
    try {
      const res = await ApiClient.delete(`/variants/${deleteVariantTarget._id}`);
      if (res?.success) {
        setDeleteVariantTarget(null);
        // Refresh variants
        const refreshed = await ApiClient.get(`/products/${variantModalProduct._id}/variants`);
        if (refreshed?.success) setVariantsList(refreshed.data || []);
        fetchProducts();
      } else {
        alert(res?.message || 'Failed to delete variant.');
      }
    } catch (err) {
      alert(err.message || 'Error deleting variant.');
    }
  };

  // Toggle Variant Status
  const handleToggleVariantStatus = async (variant) => {
    try {
      const res = await ApiClient.patch(`/variants/${variant._id}`, {
        isActive: !variant.isActive,
      });
      if (res?.success) {
        const refreshed = await ApiClient.get(`/products/${variantModalProduct._id}/variants`);
        if (refreshed?.success) setVariantsList(refreshed.data || []);
        fetchProducts();
      }
    } catch (err) {
      alert(err.message || 'Failed to update variant status.');
    }
  };

  // Filter Subcategories by Category in main table filter
  const tableFilterSubcategories = useMemo(() => {
    if (selectedCategoryFilter === 'ALL') return subcategories;
    return subcategories.filter(
      (s) => s.categoryId?._id === selectedCategoryFilter || s.categoryId === selectedCategoryFilter
    );
  }, [selectedCategoryFilter, subcategories]);

  // ==========================================
  // VIEW: ADD / EDIT PRODUCT FORM
  // ==========================================
  if (pageMode === 'add' || pageMode === 'edit') {
    const activeSubcat = formSubcategories.find((s) => s._id === formData.subcategoryId);
    const subcatAllowedUnitObjects = activeSubcat
      ? units.filter((u) => (activeSubcat.allowedUnitIds || []).some((id) => (typeof id === 'object' ? id._id === u._id : id === u._id)))
      : [];

    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-200">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPageMode('list')}
            className="flex items-center space-x-2 text-sm text-[#6030ea] hover:text-[#4b22c2] font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products Catalog</span>
          </button>
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <span>Catalog</span>
            <ChevronRight className="w-3 h-3" />
            <span>Products</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-gray-800">
              {pageMode === 'add' ? 'Create Product' : 'Edit Product'}
            </span>
          </div>
        </div>

        {/* Header Card */}
        <div className="bg-gradient-to-r from-[#6030ea] to-[#8050f5] p-6 rounded-3xl text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-2 inline-block">
              {pageMode === 'add' ? 'Master Catalog Addition' : 'Master Catalog Modification'}
            </span>
            <h1 className="text-2xl font-black">
              {pageMode === 'add' ? 'Create Master Product' : `Edit '${formData.name}'`}
            </h1>
            <p className="text-white/80 text-xs mt-1">
              Select Category, Subcategory, and Brand. Product variants (units & quantities) will be configured after creation.
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 border border-white/30 backdrop-blur-md">
            <Package className="w-9 h-9" />
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSaveProduct} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6">
          {formError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
              <span>{formSuccess}</span>
            </div>
          )}

          {/* Section 1: Dependent Hierarchy Selection */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6030ea]" />
              <span>1. Category, Subcategory & Brand Selection</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Dropdown (Dependent) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Subcategory <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.subcategoryId}
                  onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                  disabled={!formData.categoryId}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium disabled:opacity-50"
                >
                  <option value="">
                    {formData.categoryId ? '-- Select Subcategory --' : '-- First Select Category --'}
                  </option>
                  {formSubcategories.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Dropdown (Independent Master) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Brand <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium"
                >
                  <option value="">-- No Specific Brand / Generic --</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Allowed Units Preview Banner for Subcategory */}
            {activeSubcat && (
              <div className="mt-3 p-3.5 rounded-2xl bg-purple-50 border border-purple-200/60 flex items-center justify-between text-xs text-purple-900">
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-[#6030ea] shrink-0" />
                  <span>
                    Allowed Units for <strong>{activeSubcat.name}</strong>:{' '}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {subcatAllowedUnitObjects.length > 0 ? (
                      subcatAllowedUnitObjects.map((u) => (
                        <span
                          key={u._id}
                          className="px-2 py-0.5 rounded-md bg-white text-[#6030ea] font-bold border border-purple-200 shadow-2xs"
                        >
                          {u.name} ({u.symbol})
                        </span>
                      ))
                    ) : (
                      <span className="text-rose-600 font-bold">None configured. Please add allowed units in Categories.</span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-purple-600 font-medium">Variants can only use these units</span>
              </div>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Product Details */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#6030ea]" />
              <span>2. Product Details</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Turmeric Powder, Whole Chicken, Sardine, Orange Juice"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the product features, quality standards, or preparation instructions..."
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Product Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium mb-3"
                />

                {/* Preset Suggestions */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-600 mb-2 block">
                    Quick Preset Images:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_PRODUCT_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: img.url })}
                        className={`flex items-center space-x-2 p-1.5 rounded-xl border text-left transition-all ${
                          formData.image === img.url
                            ? 'border-[#6030ea] bg-[#6030ea]/10 ring-2 ring-[#6030ea]/30'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-[11px] font-medium text-gray-800 truncate">{img.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="pt-2 flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Catalog Visibility</h4>
                  <p className="text-[11px] text-gray-500">Active products are visible to Shop Owners for store listing.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6030ea]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setPageMode('list')}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#6030ea] hover:bg-[#4e22c7] rounded-xl shadow-lg shadow-[#6030ea]/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{pageMode === 'add' ? 'Save & Create Product' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN PRODUCTS LIST & FILTERS
  // ==========================================
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#6030ea]"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6030ea]">
              Master Catalog Governance
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Products & Product Variants</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Connect Category → Subcategory → Brand → Product → Product Variants (Unit & Quantity).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchProducts()}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#6030ea] hover:bg-[#4b22c2] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#6030ea]/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Master Product</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product by name..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea]"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => {
                setSelectedCategoryFilter(e.target.value);
                setSelectedSubcategoryFilter('ALL');
              }}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium text-gray-700"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          <div>
            <select
              value={selectedSubcategoryFilter}
              onChange={(e) => setSelectedSubcategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium text-gray-700"
            >
              <option value="ALL">All Subcategories</option>
              {tableFilterSubcategories.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <select
              value={selectedBrandFilter}
              onChange={(e) => setSelectedBrandFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium text-gray-700"
            >
              <option value="ALL">All Brands</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter & View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium text-gray-700"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>

            <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200 shrink-0">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'table' ? 'bg-white text-[#6030ea] shadow-xs font-bold' : 'text-gray-500 hover:text-gray-800'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'grid' ? 'bg-white text-[#6030ea] shadow-xs font-bold' : 'text-gray-500 hover:text-gray-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Table / Grid */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-200">
          <RefreshCw className="w-8 h-8 text-[#6030ea] animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-700">Loading master products catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 space-y-3">
          <div className="w-14 h-14 bg-purple-50 text-[#6030ea] rounded-2xl flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No Master Products Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            No products match the selected filters. Add a new product or reset your search criteria.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#6030ea] text-white text-xs font-bold rounded-xl shadow-md"
          >
            Create Product Now
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category & Subcategory</th>
                  <th className="py-3.5 px-4">Brand</th>
                  <th className="py-3.5 px-4">Variants (Allowed Units)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => {
                  const catName = prod.categoryId?.name || prod.categoryName || 'Unknown Category';
                  const subcatName = prod.subcategoryId?.name || prod.subcategoryName || 'Unknown Subcategory';
                  const brandName = prod.brandId?.name || prod.brandName || null;
                  const variants = prod.variants || [];

                  return (
                    <tr key={prod._id} className="hover:bg-purple-50/30 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                            {prod.image ? (
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{prod.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono">{prod.slug}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Subcategory */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 text-[#6030ea] font-semibold text-[10px] border border-purple-100">
                            {catName}
                          </span>
                          <span className="text-[11px] text-gray-600 block font-medium">
                            ↳ {subcatName}
                          </span>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="py-3 px-4">
                        {brandName ? (
                          <span className="inline-flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-semibold text-[11px]">
                            <Tag className="w-3 h-3 text-[#6030ea]" />
                            <span>{brandName}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">No Brand (Generic)</span>
                        )}
                      </td>

                      {/* Variants */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                          {variants.length > 0 ? (
                            variants.map((v) => (
                              <span
                                key={v._id}
                                className={`px-2 py-0.5 rounded-md font-bold text-[10px] border shadow-2xs ${
                                  v.isActive
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-gray-100 border-gray-200 text-gray-400 line-through'
                                }`}
                              >
                                {v.quantity} {v.unitId?.symbol || ''}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              No variants configured
                            </span>
                          )}

                          <button
                            onClick={() => handleOpenVariantsModal(prod)}
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-[#6030ea] hover:bg-[#6030ea]/10 transition-colors"
                          >
                            + Manage ({variants.length})
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {prod.isActive ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-600 font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-gray-400 font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                            <span>Inactive</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenVariantsModal(prod)}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 text-[#6030ea] hover:bg-purple-100 font-bold text-[11px] transition-colors"
                            title="Manage Variants"
                          >
                            Variants
                          </button>
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#6030ea] hover:bg-purple-50 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(prod)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((prod) => {
            const catName = prod.categoryId?.name || prod.categoryName || 'Category';
            const subcatName = prod.subcategoryId?.name || prod.subcategoryName || 'Subcategory';
            const brandName = prod.brandId?.name || prod.brandName || null;
            const variants = prod.variants || [];

            return (
              <div
                key={prod._id}
                className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
              >
                {/* Image Banner */}
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Package className="w-12 h-12" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                      {catName}
                    </span>
                  </div>

                  {brandName && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-bold shadow">
                        {brandName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] text-[#6030ea] font-semibold">↳ {subcatName}</span>
                    <h3 className="text-base font-bold text-gray-900 mt-0.5">{prod.name}</h3>
                    {prod.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{prod.description}</p>
                    )}
                  </div>

                  {/* Variants Pills */}
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                      Configured Variants ({variants.length})
                    </span>
                    <div className="flex items-center flex-wrap gap-1.5">
                      {variants.map((v) => (
                        <span
                          key={v._id}
                          className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6030ea] border border-purple-200 text-[11px] font-bold"
                        >
                          {v.quantity} {v.unitId?.symbol || ''}
                        </span>
                      ))}
                      {variants.length === 0 && (
                        <span className="text-[11px] text-amber-600 italic">No variants yet</span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenVariantsModal(prod)}
                      className="px-3 py-1.5 rounded-xl bg-[#6030ea] text-white text-xs font-bold shadow-sm hover:bg-[#4d22c4] transition-all flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Manage Variants</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-2 rounded-xl text-gray-500 hover:text-[#6030ea] hover:bg-purple-50 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(prod)}
                        className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==========================================
          MODAL: MANAGE PRODUCT VARIANTS (STRICT ENFORCEMENT)
          ========================================== */}
      {variantModalProduct && (
        <Modal
          isOpen={Boolean(variantModalProduct)}
          onClose={() => setVariantModalProduct(null)}
          title={`Product Variants: ${variantModalProduct.name}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Product & Subcategory Allowed Units Header */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-[#6030ea] uppercase tracking-wider block">
                  Category: {variantModalProduct.categoryId?.name || variantModalProduct.categoryName} ➔{' '}
                  {variantModalProduct.subcategoryId?.name || variantModalProduct.subcategoryName}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">
                  {variantModalProduct.name}{' '}
                  {variantModalProduct.brandId?.name ? `(${variantModalProduct.brandId.name})` : ''}
                </h3>
              </div>

              {/* Allowed Units Pill Bar */}
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-purple-900">Allowed Units:</span>
                {activeSubcategoryAllowedUnits.length > 0 ? (
                  activeSubcategoryAllowedUnits.map((u) => (
                    <span
                      key={u._id}
                      className="px-2 py-0.5 rounded-md bg-white border border-purple-300 text-[#6030ea] font-extrabold text-xs shadow-2xs"
                    >
                      {u.symbol}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-rose-600 font-bold">No units allowed for this subcategory</span>
                )}
              </div>
            </div>

            {/* Existing Variants Table */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                Current Variants ({variantsList.length})
              </h4>

              {isVariantsLoading ? (
                <div className="py-8 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#6030ea]" />
                  <span>Loading variants...</span>
                </div>
              ) : variantsList.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center text-xs text-gray-500">
                  No variants added yet for this product. Use the form below to create valid quantity + unit combinations.
                </div>
              ) : (
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 font-bold text-[10px] uppercase border-b border-gray-200">
                      <tr>
                        <th className="py-2.5 px-3">Variant (Quantity + Unit)</th>
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {variantsList.map((v) => (
                        <tr key={v._id} className="hover:bg-gray-50/50">
                          <td className="py-2.5 px-3 font-bold text-gray-900">
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-50 text-[#6030ea] border border-purple-200 text-xs">
                              <span>{v.quantity}</span>
                              <span className="font-extrabold">{v.unitId?.symbol}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500">
                            {v.sku || '—'}
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => handleToggleVariantStatus(v)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                                v.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                              }`}
                            >
                              {v.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => setDeleteVariantTarget(v)}
                              className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Variant"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Add New Variant Form */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-4">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Plus className="w-3.5 h-3.5 text-[#6030ea]" />
                <span>Add New Variant</span>
              </h4>

              {variantError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{variantError}</span>
                </div>
              )}

              {variantSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{variantSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAddVariant} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                {/* Unit Dropdown - STRICTLY FILTERED TO ALLOWED UNITS */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Allowed Unit <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={variantForm.unitId}
                    onChange={(e) => setVariantForm({ ...variantForm, unitId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium"
                  >
                    <option value="">-- Select Unit --</option>
                    {activeSubcategoryAllowedUnits.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity Input */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0.001"
                    value={variantForm.quantity}
                    onChange={(e) => setVariantForm({ ...variantForm, quantity: e.target.value })}
                    placeholder="e.g. 500, 100, 1"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium"
                  />
                </div>

                {/* Optional SKU */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">SKU (Optional)</label>
                  <input
                    type="text"
                    value={variantForm.sku}
                    onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                    placeholder="e.g. PROD-500G"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-medium"
                  />
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    disabled={isAddingVariant}
                    className="w-full py-2 bg-[#6030ea] hover:bg-[#4d22c4] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    {isAddingVariant ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>Add Variant</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Product Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Master Product?"
        message={`Are you sure you want to delete '${deleteTarget?.name}'? If variants exist without shop listings, they will also be removed.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Delete Variant Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteVariantTarget)}
        title="Delete Product Variant?"
        message={`Are you sure you want to delete this variant (${deleteVariantTarget?.quantity} ${deleteVariantTarget?.unitId?.symbol})? It cannot be deleted if active in shops.`}
        confirmText="Delete Variant"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDeleteVariant}
        onCancel={() => setDeleteVariantTarget(null)}
      />
    </div>
  );
};
