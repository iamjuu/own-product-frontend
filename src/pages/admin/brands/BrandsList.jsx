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
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    logo: '',
    description: '',
    isActive: true,
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await ApiClient.get('/admin/categories');
      if (response.success && response.data) {
        setCategories(response.data.categories || []);
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
        setBrands(response.data.brands || []);
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

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      categoryId: selectedCategoryFilter || (categories[0]?._id || ''),
      logo: '',
      description: '',
      isActive: true,
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (brand) => {
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      categoryId: brand.categoryId || '',
      logo: brand.logo || '',
      description: brand.description || '',
      isActive: brand.isActive !== undefined ? brand.isActive : true,
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Brand name is required.');
      return;
    }
    if (!formData.categoryId) {
      setFormError('Please select a Category for this brand.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    try {
      const response = await ApiClient.post('/admin/brands', formData);
      if (response.success) {
        setIsAddModalOpen(false);
        fetchBrands();
      } else {
        setFormError(response.message || 'Failed to create brand');
      }
    } catch (err) {
      setFormError(err.message || 'Error occurred while saving brand');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Brand name is required.');
      return;
    }
    if (!formData.categoryId) {
      setFormError('Please select a Category for this brand.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    try {
      const response = await ApiClient.patch(`/admin/brands/${selectedBrand._id}`, formData);
      if (response.success) {
        setIsEditModalOpen(false);
        fetchBrands();
      } else {
        setFormError(response.message || 'Failed to update brand');
      }
    } catch (err) {
      setFormError(err.message || 'Error occurred while updating brand');
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
    // Find matching category or fall back to first category
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

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="theme-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#6339f4]/10 text-[#6339f4] ring-4 ring-[#ece8ff]">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#181829] tracking-tight">
              Brand Directory & Category Association
            </h2>
            <p className="text-xs text-[#8a87a6] font-medium">
              Create and manage commercial brands linked to categories. When merchants add items, brands automatically filter by the chosen category.
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

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="theme-card p-4 space-y-1">
          <span className="text-[11px] font-bold text-[#8a87a6]">Total Brands</span>
          <div className="text-xl font-black text-[#181829]">{brands.length}</div>
          <span className="text-[10px] text-[#6339f4] font-medium">Across {categories.length} categories</span>
        </div>

        <div className="theme-card p-4 space-y-1">
          <span className="text-[11px] font-bold text-[#8a87a6]">Active Brands</span>
          <div className="text-xl font-black text-emerald-600">{activeCount}</div>
          <span className="text-[10px] text-emerald-600 font-medium">● Available for item listing</span>
        </div>

        <div className="theme-card p-4 space-y-1">
          <span className="text-[11px] font-bold text-[#8a87a6]">Category Links</span>
          <div className="text-xl font-black text-[#181829]">
            {new Set(brands.map((b) => b.categoryId)).size}
          </div>
          <span className="text-[10px] text-[#8a87a6] font-medium">Categorized</span>
        </div>
      </div>

      {/* 3. Search & Category Filter Bar */}
      <div className="theme-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
          {/* Category Filter Dropdown */}
          <div className="relative w-full sm:w-56">
            <Layers className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brand name..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] placeholder:text-[#8a87a6] focus:outline-none focus:border-[#6339f4]"
            />
          </form>
        </div>

        {/* Right view & refresh controls */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
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
            onClick={fetchBrands}
            className="p-2 rounded-2xl bg-[#f0f2fb] text-[#8a87a6] hover:text-[#181829] hover:bg-[#e4e7f5] transition-all"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#6339f4]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4. Brands Content */}
      {isLoading ? (
        <div className="theme-card p-12 text-center text-xs text-slate-400 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#6339f4] border-t-transparent animate-spin mx-auto"></div>
          <p className="font-semibold text-slate-600">Loading brands directory...</p>
        </div>
      ) : brands.length === 0 ? (
        <div className="theme-card p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#f0f2fb] text-[#6339f4] flex items-center justify-center mx-auto">
            <Tag className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-[#181829]">No Brands Found</h3>
          <p className="text-xs text-[#8a87a6] max-w-sm mx-auto">
            {selectedCategoryFilter
              ? 'No brands currently assigned to this category.'
              : 'Start by creating custom brands or loading popular brand presets.'}
          </p>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => setIsPresetsModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#f0f2fb] text-xs font-bold text-[#6339f4] hover:bg-[#e4e7f5]"
            >
              Add Popular Brands
            </button>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-2xl bg-[#6339f4] text-xs font-bold text-white hover:bg-[#5327ec]"
            >
              + Create Brand
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="theme-card p-5 hover:border-[#6339f4]/40 hover:shadow-xl transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#f0f2fb] border border-slate-200/80 flex items-center justify-center shrink-0 text-[#6339f4] group-hover:scale-105 transition-transform">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&q=80';
                        }}
                      />
                    ) : (
                      <Tag className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#181829] group-hover:text-[#6339f4] transition-colors">
                      {brand.name}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#ece8ff] text-[#6339f4] text-[10px] font-bold mt-1">
                      {brand.categoryName || 'General Category'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStatus(brand)}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold transition-all ${
                    brand.isActive
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {brand.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <p className="text-xs text-[#8a87a6] line-clamp-2 min-h-[32px]">
                {brand.description || 'No description added for this brand.'}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 font-mono text-[11px] text-slate-400">
                  <span>/{brand.slug}</span>
                  <button
                    onClick={() => copyToClipboard(brand.slug, brand._id)}
                    className="p-1 hover:text-[#6339f4]"
                    title="Copy Slug"
                  >
                    {copiedSlug === brand._id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEditModal(brand)}
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
        /* Table View */
        <div className="theme-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f0f2fb] text-[#8a87a6] uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Brand</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Identifier Slug</th>
                  <th className="py-3.5 px-4 font-bold">Description</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#181829]">
                {brands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/80 text-[#6339f4]">
                          {brand.logo ? (
                            <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                          ) : (
                            <Tag className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-bold text-xs text-[#181829]">{brand.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#ece8ff] text-[#6339f4] text-[11px] font-bold">
                        {brand.categoryName || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {brand.slug}
                    </td>
                    <td className="py-3 px-4 text-[#8a87a6] max-w-xs truncate">
                      {brand.description || '—'}
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(brand)}
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

      {/* 5. ADD BRAND MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !isSubmitting && setIsAddModalOpen(false)}
        title="Create New Brand"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateBrand} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Select Category */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">
              Category Association <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
            >
              <option value="">-- Choose Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
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
              placeholder="e.g. Amul or Nestlé"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
            />
          </div>

          {/* Logo URL */}
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
            <label className="block text-xs font-bold text-[#181829] mb-1.5">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Primary product lines or brand summary..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4] resize-none"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f0f2fb] border border-slate-200">
            <div>
              <div className="text-xs font-bold text-[#181829]">Active Brand</div>
              <div className="text-[10px] text-[#8a87a6]">
                Allows merchants to list products under this brand.
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-[#6339f4] rounded focus:ring-[#6339f4] accent-[#6339f4]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-[#8a87a6] hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Brand</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* 6. EDIT BRAND MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !isSubmitting && setIsEditModalOpen(false)}
        title="Edit Brand"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleUpdateBrand} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">
              Category Association <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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
            <label className="block text-xs font-bold text-[#181829] mb-1.5">Brand Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">Brand Logo URL</label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4] resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f0f2fb] border border-slate-200">
            <div>
              <div className="text-xs font-bold text-[#181829]">Active Status</div>
              <div className="text-[10px] text-[#8a87a6]">Toggle brand availability.</div>
            </div>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-[#6339f4] rounded focus:ring-[#6339f4] accent-[#6339f4]"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-[#8a87a6] hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25 disabled:opacity-50"
            >
              {isSubmitting ? (
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

      {/* 7. PRESET BRANDS MODAL */}
      <Modal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        title="Add Popular Marketplace Brands"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#8a87a6]">
            Quickly add established commercial consumer brands automatically linked to corresponding categories.
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

      {/* 8. DELETE CONFIRMATION */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteBrand}
        title="Delete Brand"
        message={`Are you sure you want to remove brand "${deleteTarget?.name}"? Existing products under this brand will still remain in catalog.`}
        confirmText="Yes, Delete Brand"
        isDestructive={true}
      />
    </div>
  );
};
