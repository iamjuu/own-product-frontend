import React, { useState, useEffect } from 'react';
import {
  Tag,
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
  Image as ImageIcon,
  AlertCircle,
  Copy,
  Check,
  Filter,
  Layers,
  ArrowLeft,
  Building,
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { Modal, ConfirmDialog } from '../../../components/common/Modal';

const PRESET_BRANDS = [
  {
    name: 'Amul',
    categoryMatch: 'dairy',
    logo: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&auto=format&fit=crop&q=80',
    description: 'The Taste of India - Milk, Butter, Cheese, Paneer & Ghee',
  },
  {
    name: 'Nestlé',
    categoryMatch: 'dairy',
    logo: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&auto=format&fit=crop&q=80',
    description: 'Dairy products, Maggi, Nescafe, Chocolates & Infant Nutrition',
  },
  {
    name: 'Britannia',
    categoryMatch: 'bakery',
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80',
    description: 'Good Day, Treat, Bourbon, Milk Bikis, Breads and Cakes',
  },
  {
    name: 'Tata Sampann',
    categoryMatch: 'grocery',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
    description: 'Unpolished pulses, organic spices, besan and poha',
  },
  {
    name: 'Aashirvaad',
    categoryMatch: 'grocery',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
    description: 'Superior Shuddh Chakki Whole Wheat Atta, Salt and Spices',
  },
  {
    name: 'Lay\'s',
    categoryMatch: 'snack',
    logo: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=200&auto=format&fit=crop&q=80',
    description: 'Gourmet potato chips in classic, cream & onion and spicy flavors',
  },
  {
    name: 'Coca-Cola',
    categoryMatch: 'snack',
    logo: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&auto=format&fit=crop&q=80',
    description: 'Soft drinks, Thums Up, Sprite, Fanta and Minute Maid juices',
  },
  {
    name: 'Organic Tattva',
    categoryMatch: 'fruit',
    logo: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&auto=format&fit=crop&q=80',
    description: '100% certified organic grains, flours, pulses and produce',
  },
  {
    name: 'Himalaya',
    categoryMatch: 'care',
    logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80',
    description: 'Pure herbal wellness, face washes, shampoos and healthcare',
  },
];

export const BrandsList = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [pageMode, setPageMode] = useState('list'); // 'list' | 'add' | 'edit'
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Target States
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    logo: '',
    description: '',
    isActive: true,
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await ApiClient.get('/admin/categories');
      if (response.success && response.data) {
        const catList = Array.isArray(response.data)
          ? response.data
          : (response.data.categories || []);
        setCategories(catList);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get('/admin/brands', {
        categoryId: selectedCategoryFilter || undefined,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      if (response.success && response.data) {
        const brandList = Array.isArray(response.data)
          ? response.data
          : (response.data.brands || []);
        setBrands(brandList);
      }
    } catch (err) {
      console.error('Failed to load brands:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [selectedCategoryFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBrands();
  };

  // Open Full Page Add Brand View (Replaces modal)
  const handleOpenAddPage = () => {
    setSelectedBrand(null);
    setFormData({
      name: '',
      categoryId: selectedCategoryFilter || (categories[0]?._id || ''),
      logo: '',
      description: '',
      isActive: true,
    });
    setFormError('');
    setFormSuccess('');
    setPageMode('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Full Page Edit Brand View (Replaces modal)
  const handleOpenEditPage = (brand) => {
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      categoryId: brand.categoryId || '',
      logo: brand.logo || '',
      description: brand.description || '',
      isActive: brand.isActive !== undefined ? brand.isActive : true,
    });
    setFormError('');
    setFormSuccess('');
    setPageMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setPageMode('list');
    setSelectedBrand(null);
    setFormError('');
    setFormSuccess('');
    fetchBrands();
  };

  // Save Brand (Create or Update)
  const handleSaveBrand = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Brand name is required.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      let response;
      if (pageMode === 'add') {
        response = await ApiClient.post('/admin/brands', formData);
      } else {
        response = await ApiClient.patch(`/admin/brands/${selectedBrand._id}`, formData);
      }

      if (response.success) {
        setFormSuccess(response.message || 'Brand saved successfully!');
        setTimeout(() => {
          handleBackToList();
        }, 600);
      } else {
        setFormError(response.message || 'Failed to save brand');
      }
    } catch (err) {
      setFormError(err.message || 'Error occurred while saving brand');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (brand) => {
    try {
      await ApiClient.patch(`/admin/brands/${brand._id}`, {
        isActive: !brand.isActive,
      });
      fetchBrands();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteBrand = async () => {
    if (!deleteTarget) return;
    try {
      await ApiClient.delete(`/admin/brands/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchBrands();
    } catch (err) {
      console.error('Failed to delete brand:', err);
    }
  };

  const handleAddPresetBrand = async (preset) => {
    const cat = categories.find((c) => c.slug.includes(preset.categoryMatch)) || categories[0];
    if (!cat) return;

    try {
      await ApiClient.post('/admin/brands', {
        name: preset.name,
        categoryId: cat._id,
        logo: preset.logo,
        description: preset.description,
        isActive: true,
      });
      fetchBrands();
    } catch (err) {
      console.error('Failed to add preset brand:', err);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(id);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const activeCount = brands.filter((b) => b.isActive).length;

  const selectedCategoryObj = categories.find((c) => c._id === formData.categoryId);

  // ==========================================
  // VIEW: FULL PAGE ADD / EDIT BRAND (NO MODAL)
  // ==========================================
  if (pageMode === 'add' || pageMode === 'edit') {
    const isEdit = pageMode === 'edit';
    return (
      <div className="space-y-6 pb-16">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToList}
              className="p-2.5 rounded-2xl bg-[#f0f2fb] hover:bg-[#e4e7f5] text-[#181829] transition-all"
              title="Back to Brands"
            >
              <ArrowLeft className="w-5 h-5 text-[#6339f4]" />
            </button>
            <div>
              <div className="flex items-center space-x-2 text-xs text-[#8a87a6]">
                <span className="hover:underline cursor-pointer" onClick={handleBackToList}>
                  Brand Directory
                </span>
                <span>/</span>
                <span className="text-[#6339f4] font-bold">
                  {isEdit ? `Edit: ${selectedBrand?.name}` : 'Create Brand'}
                </span>
              </div>
              <h1 className="text-lg font-black text-[#181829]">
                {isEdit ? `Brand: ${formData.name || 'Brand'}` : 'Configure New Commercial Brand'}
              </h1>
            </div>
          </div>

          <button
            onClick={handleBackToList}
            className="px-4 py-2 rounded-2xl bg-[#f0f2fb] hover:bg-[#e4e7f5] text-xs font-bold text-[#8a87a6] hover:text-[#181829] transition-all self-start sm:self-auto"
          >
            Back to Brands
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 cols): Brand Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h2 className="text-sm font-bold text-[#181829]">Brand Association & Identity</h2>
              <p className="text-xs text-[#8a87a6]">
                Link commercial brands to categories. When merchants add items, available brands automatically filter by category.
              </p>
            </div>

            {formError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs flex items-center space-x-2.5">
                <Check className="w-4 h-4 shrink-0" />
                <span className="font-medium">{formSuccess}</span>
              </div>
            )}

            {/* Quick Presets for New Brand */}
            {!isEdit && (
              <div>
                <span className="text-xs font-bold text-[#181829] block mb-2">
                  Quick Brand Suggestions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_BRANDS.slice(0, 7).map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        const matchCat = categories.find((c) => c.slug.includes(p.categoryMatch));
                        setFormData({
                          name: p.name,
                          categoryId: matchCat ? matchCat._id : (categories[0]?._id || ''),
                          logo: p.logo,
                          description: p.description,
                          isActive: true,
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#f0f2fb] hover:bg-[#ece8ff] text-[#6339f4] border border-slate-200/80 text-xs font-bold transition-all"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveBrand} className="space-y-4">
              {/* Category Association */}
              <div>
                <label className="block text-xs font-bold text-[#181829] mb-1.5">
                  Category Association <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
                >
                  <option value="">-- Standalone Master / All Categories --</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-xs font-bold text-[#181829] mb-1.5">
                  Brand Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Amul, Nestlé, Tata Sampann"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
                />
                {formData.name && (
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    Slug identifier: /
                    {formData.name
                      .toLowerCase()
                      .trim()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/[\s_-]+/g, '-')
                      .replace(/^-+|-+$/g, '')}
                  </p>
                )}
              </div>

              {/* Brand Logo URL */}
              <div>
                <label className="block text-xs font-bold text-[#181829] mb-1.5">
                  Brand Logo URL (Optional)
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#181829] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Primary product lines or brand summary..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4] resize-none"
                />
              </div>

              {/* Active Brand Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f0f2fb] border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-[#181829]">Active Brand Status</div>
                  <div className="text-[10px] text-[#8a87a6]">
                    Allows merchants to list products under this brand name.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-[#6339f4] rounded focus:ring-[#6339f4] accent-[#6339f4] cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleBackToList}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-[#8a87a6] hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isEdit ? 'Save Changes' : 'Create Brand'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column (1 col): Live Brand Preview Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 sticky top-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8a87a6] uppercase tracking-wider">
                  Live Brand Preview
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    formData.isActive
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}
                >
                  {formData.isActive ? 'Active' : 'Draft'}
                </span>
              </div>

              {/* Mock Brand Card */}
              <div className="rounded-2xl p-4 border border-slate-200/80 shadow-md bg-white space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden shadow-inner">
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Logo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Building className="w-6 h-6 text-[#6339f4]" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#181829] tracking-tight">
                      {formData.name || 'Brand Name'}
                    </h4>
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#6339f4]/10 text-[#6339f4] text-[10px] font-bold mt-1">
                      <Layers className="w-3 h-3" />
                      <span>{selectedCategoryObj?.name || 'Category'}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#8a87a6] line-clamp-3">
                  {formData.description || 'Brand description will appear here in the brand catalog.'}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono">
                    /
                    {formData.name
                      ? formData.name
                          .toLowerCase()
                          .trim()
                          .replace(/[^\w\s-]/g, '')
                          .replace(/[\s_-]+/g, '-')
                      : 'slug'}
                  </span>
                  <span className="text-emerald-600 font-bold">● Ready for listing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN BRANDS LIST (TABLE & GRID)
  // ==========================================
  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner & Actions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#6339f4]/10 text-[#6339f4] ring-4 ring-[#ece8ff]">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#181829] tracking-tight">
              Brand Directory & Category Association
            </h2>
            <p className="text-xs text-[#8a87a6] font-medium">
              Create and manage commercial brands linked to categories.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={() => setIsPresetsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-[#f0f2fb] hover:bg-[#e4e7f5] text-xs font-bold text-[#6339f4] transition-all border border-slate-200"
          >
            <Sparkles className="w-4 h-4" />
            <span>Preset Brands</span>
          </button>

          {/* "+ Add Brand" button switches to dedicated Full Page (Replaces modal) */}
          <button
            onClick={handleOpenAddPage}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand</span>
          </button>
        </div>
      </div>

      {/* 2. Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-[#8a87a6]">Total Brands</span>
          <div className="text-xl font-black text-[#181829]">{brands.length}</div>
          <span className="text-[10px] text-[#6339f4] font-medium">Across categories</span>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-[#8a87a6]">Categories in Use</span>
          <div className="text-xl font-black text-emerald-600">
            {new Set(brands.map((b) => b.categoryId)).size}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">● Categorized brands</span>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-[#8a87a6]">Active Brands</span>
          <div className="text-xl font-black text-slate-700">{activeCount}</div>
          <span className="text-[10px] text-slate-400 font-medium">Available to shops</span>
        </div>
      </div>

      {/* 3. Filter & View Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brand name or details..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
          />
        </form>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          {/* Table / Grid Toggle */}
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
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === 'table'
                  ? 'bg-[#6339f4] text-white shadow-sm'
                  : 'text-[#8a87a6] hover:text-[#181829]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={fetchBrands}
            className="p-2 rounded-2xl bg-[#f0f2fb] text-[#8a87a6] hover:text-[#181829] hover:bg-[#e4e7f5] transition-all"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#6339f4]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4. Brands Display (Grid vs Table) */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 space-y-3 border border-slate-200/80">
          <div className="w-8 h-8 rounded-full border-2 border-[#6339f4] border-t-transparent animate-spin mx-auto"></div>
          <p className="font-semibold text-slate-600">Loading brand directory...</p>
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200/80">
          <div className="w-14 h-14 rounded-2xl bg-[#f0f2fb] text-[#6339f4] flex items-center justify-center mx-auto">
            <Tag className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-[#181829]">No Brands Found</h3>
          <p className="text-xs text-[#8a87a6] max-w-sm mx-auto">
            No commercial brands match your criteria. Add custom brands or load popular presets.
          </p>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => setIsPresetsModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#f0f2fb] text-xs font-bold text-[#6339f4] hover:bg-[#e4e7f5]"
            >
              Browse Presets
            </button>
            <button
              onClick={handleOpenAddPage}
              className="px-5 py-2.5 rounded-2xl bg-[#6339f4] text-xs font-bold text-white hover:bg-[#5327ec] shadow-md shadow-[#6339f4]/25"
            >
              + Create Brand Page
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-[#6339f4]/40 hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200/80 overflow-hidden shadow-sm">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Building className="w-6 h-6 text-[#6339f4]" />
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleStatus(brand)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                      brand.isActive
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}
                  >
                    {brand.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#181829] tracking-tight">{brand.name}</h3>
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#6339f4]/10 text-[#6339f4] text-[10px] font-bold mt-1">
                    <Layers className="w-3 h-3" />
                    <span>{brand.categoryName || 'Category'}</span>
                  </span>
                  <p className="text-xs text-[#8a87a6] line-clamp-2 min-h-[32px] mt-2">
                    {brand.description || 'No brand summary provided.'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-slate-400">/{brand.slug}</span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEditPage(brand)}
                    className="p-1.5 rounded-xl hover:bg-[#ece8ff] text-[#8a87a6] hover:text-[#6339f4] transition-all"
                    title="Edit Brand"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(brand)}
                    className="p-1.5 rounded-xl hover:bg-rose-50 text-[#8a87a6] hover:text-rose-600 transition-all"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f0f2fb] text-[#8a87a6] uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Brand</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Slug Identifier</th>
                  <th className="py-3.5 px-4 font-bold">Description</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#181829]">
                {brands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/80">
                          {brand.logo ? (
                            <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building className="w-4 h-4 text-[#6339f4]" />
                          )}
                        </div>
                        <span className="font-bold text-[#181829]">{brand.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-[#f0f2fb] text-[#6339f4] font-bold text-[11px]">
                        {brand.categoryName || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{brand.slug}</td>
                    <td className="py-3.5 px-4 text-[#8a87a6] max-w-xs truncate">
                      {brand.description || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(brand)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                          brand.isActive
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                        }`}
                      >
                        {brand.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{brand.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenEditPage(brand)}
                          className="p-1.5 rounded-xl hover:bg-[#ece8ff] text-[#8a87a6] hover:text-[#6339f4] transition-all"
                          title="Edit Brand"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(brand)}
                          className="p-1.5 rounded-xl hover:bg-rose-50 text-[#8a87a6] hover:text-rose-600 transition-all"
                          title="Delete Brand"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preset Brands Modal */}
      <Modal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        title="Add Popular FMCG Brands"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#8a87a6]">
            Quickly add popular commercial brands linked to categories.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {PRESET_BRANDS.map((preset, idx) => {
              const alreadyExists = brands.some(
                (b) => b.name.toLowerCase() === preset.name.toLowerCase()
              );
              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#f0f2fb] border border-slate-200 flex items-center justify-between space-x-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={preset.logo}
                      alt={preset.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#181829] truncate">{preset.name}</h4>
                      <p className="text-[10px] text-[#8a87a6] truncate">{preset.description}</p>
                    </div>
                  </div>

                  <button
                    disabled={alreadyExists}
                    onClick={() => handleAddPresetBrand(preset)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                      alreadyExists
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-[#6339f4] text-white hover:bg-[#5327ec] shadow-sm'
                    }`}
                  >
                    {alreadyExists ? 'Added' : '+ Add'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsPresetsModalOpen(false)}
              className="px-4 py-2 rounded-2xl bg-[#f0f2fb] text-xs font-bold text-[#181829] hover:bg-[#e4e7f5]"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteBrand}
        title="Delete Brand"
        message={`Are you sure you want to delete brand "${deleteTarget?.name}"?`}
        confirmText="Yes, Delete Brand"
        isDestructive={true}
      />
    </div>
  );
};
