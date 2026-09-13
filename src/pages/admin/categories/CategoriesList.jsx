import React, { useState, useEffect } from 'react';
import {
  Layers,
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
  Tag,
  AlertCircle,
  Copy,
  Check,
  Apple,
  Milk,
  ShoppingBag,
  Coffee,
  Utensils,
  Cake,
  Fish,
  Flame,
  Zap,
  Package,
  Boxes,
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { Modal, ConfirmDialog } from '../../../components/common/Modal';

// Preset icon options for quick selection
const ICON_OPTIONS = [
  { label: 'Boxes / General', value: 'Boxes', icon: Boxes },
  { label: 'Fruits & Veggies', value: 'Apple', icon: Apple },
  { label: 'Dairy & Bakery', value: 'Milk', icon: Milk },
  { label: 'Grocery & Staples', value: 'ShoppingBag', icon: ShoppingBag },
  { label: 'Snacks & Drinks', value: 'Coffee', icon: Coffee },
  { label: 'Hot Food / Meals', value: 'Utensils', icon: Utensils },
  { label: 'Cakes & Desserts', value: 'Cake', icon: Cake },
  { label: 'Meat & Seafood', value: 'Fish', icon: Fish },
  { label: 'Trending / Deals', value: 'Flame', icon: Flame },
  { label: 'Express / Fresh', value: 'Zap', icon: Zap },
  { label: 'Packages / Bundles', value: 'Package', icon: Package },
  { label: 'Tag / Specials', value: 'Tag', icon: Tag },
];

const PRESET_CATEGORIES = [
  {
    name: 'Beverages & Soft Drinks',
    icon: 'Coffee',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format&fit=crop&q=80',
    description: 'Refreshing cold drinks, juices, energy beverages and soda',
  },
  {
    name: 'Chocolates & Candies',
    icon: 'Cake',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop&q=80',
    description: 'Premium dark chocolates, milk chocolates and sweet gummies',
  },
  {
    name: 'Baby & Infant Care',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop&q=80',
    description: 'Diapers, wipes, baby food and gentle infant skincare',
  },
  {
    name: 'Home & Kitchen Cleaning',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80',
    description: 'Detergents, floor cleaners, dishwash and fresheners',
  },
  {
    name: 'Pet Care & Supplies',
    icon: 'Boxes',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80',
    description: 'Nutritious dog food, cat treats, toys and grooming',
  },
  {
    name: 'Stationery & Office',
    icon: 'Tag',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&auto=format&fit=crop&q=80',
    description: 'Notebooks, pens, adhesives, envelopes and workspace items',
  },
];

export const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Boxes',
    image: '',
    isActive: true,
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get('/admin/categories', {
        search: search || undefined,
        status: statusFilter || undefined,
      });
      if (response.success && response.data) {
        setCategories(response.data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCategories();
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'Boxes',
      image: '',
      isActive: true,
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setSelectedCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon || 'Boxes',
      image: cat.image || '',
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    try {
      const response = await ApiClient.post('/admin/categories', formData);
      if (response.success) {
        setIsAddModalOpen(false);
        fetchCategories();
      } else {
        setFormError(response.message || 'Failed to create category');
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred while creating category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    try {
      const response = await ApiClient.patch(`/admin/categories/${selectedCategory._id}`, formData);
      if (response.success) {
        setIsEditModalOpen(false);
        fetchCategories();
      } else {
        setFormError(response.message || 'Failed to update category');
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred while updating category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (cat) => {
    try {
      await ApiClient.patch(`/admin/categories/${cat._id}`, {
        isActive: !cat.isActive,
      });
      fetchCategories();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;
    try {
      await ApiClient.delete(`/admin/categories/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const handleAddPreset = async (preset) => {
    try {
      await ApiClient.post('/admin/categories', {
        name: preset.name,
        description: preset.description,
        icon: preset.icon,
        image: preset.image,
        isActive: true,
      });
      fetchCategories();
    } catch (err) {
      console.error('Failed to add preset category:', err);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(id);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const getIconComponent = (iconName) => {
    const found = ICON_OPTIONS.find((opt) => opt.value === iconName);
    const IconComp = found ? found.icon : Boxes;
    return <IconComp className="w-5 h-5" />;
  };

  const activeCount = categories.filter((c) => c.isActive).length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner & Main Actions */}
      <div className="theme-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#6339f4]/10 text-[#6339f4] ring-4 ring-[#ece8ff]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#181829] tracking-tight">
              Product Category Catalog
            </h2>
            <p className="text-xs text-[#8a87a6] font-medium">
              Organize marketplace items into intuitive categories for search, store catalogs & customer browsing.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={() => setIsPresetsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-[#f0f2fb] hover:bg-[#e4e7f5] text-xs font-bold text-[#6339f4] transition-all border border-slate-200"
          >
            <Sparkles className="w-4 h-4" />
            <span>Add More Presets</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* 2. Metrics & Search Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="theme-card p-4 space-y-1">
          <span className="text-[11px] font-bold text-[#8a87a6]">Total Categories</span>
          <div className="text-xl font-black text-[#181829]">{categories.length}</div>
          <span className="text-[10px] text-[#6339f4] font-medium">Catalog taxonomy</span>
        </div>

        <div className="theme-card p-4 space-y-1">
          <span className="text-[11px] font-bold text-[#8a87a6]">Active In App</span>
          <div className="text-xl font-black text-emerald-600">{activeCount}</div>
          <span className="text-[10px] text-emerald-600 font-medium">● Visible to shoppers</span>
        </div>

        <div className="theme-card p-4 space-y-1">
          <span className="text-[11px] font-bold text-[#8a87a6]">Inactive / Drafts</span>
          <div className="text-xl font-black text-slate-400">
            {categories.length - activeCount}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Hidden from catalog</span>
        </div>
      </div>

      {/* 3. Search & View Toggle Filter Bar */}
      <div className="theme-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category name or details..."
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
            onClick={fetchCategories}
            className="p-2 rounded-2xl bg-[#f0f2fb] text-[#8a87a6] hover:text-[#181829] hover:bg-[#e4e7f5] transition-all"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#6339f4]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4. Categories List / Grid Display */}
      {isLoading ? (
        <div className="theme-card p-12 text-center text-xs text-slate-400 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#6339f4] border-t-transparent animate-spin mx-auto"></div>
          <p className="font-semibold text-slate-600">Loading category taxonomy...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="theme-card p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#f0f2fb] text-[#6339f4] flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-[#181829]">No Categories Found</h3>
          <p className="text-xs text-[#8a87a6] max-w-sm mx-auto">
            No product categories match your search. Create custom categories or load popular presets.
          </p>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => setIsPresetsModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#f0f2fb] text-xs font-bold text-[#6339f4] hover:bg-[#e4e7f5]"
            >
              Browse Presets
            </button>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-2xl bg-[#6339f4] text-xs font-bold text-white hover:bg-[#5327ec]"
            >
              + Create Category
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="theme-card overflow-hidden hover:border-[#6339f4]/40 hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              {/* Card Image Banner */}
              <div className="h-32 bg-slate-100 relative overflow-hidden group">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#6339f4]/10 to-[#8a87a6]/10 flex items-center justify-center text-[#6339f4]">
                    {getIconComponent(cat.icon)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                {/* Top Floating Badges */}
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#6339f4] shadow-md">
                    {getIconComponent(cat.icon)}
                  </div>
                </div>

                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleToggleStatus(cat)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md transition-all shadow-sm ${
                      cat.isActive
                        ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
                        : 'bg-rose-500/90 text-white hover:bg-rose-600'
                    }`}
                  >
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div className="absolute bottom-2 left-3 right-3">
                  <h3 className="text-white font-bold text-sm tracking-tight drop-shadow-md truncate">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-[#8a87a6] line-clamp-2 min-h-[32px]">
                  {cat.description || 'No description provided for this category.'}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <span className="font-mono text-[11px] text-slate-500">/{cat.slug}</span>
                    <button
                      onClick={() => copyToClipboard(cat.slug, cat._id)}
                      className="p-1 hover:text-[#6339f4] transition-colors"
                      title="Copy Slug"
                    >
                      {copiedSlug === cat._id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="p-1.5 rounded-xl hover:bg-[#ece8ff] text-[#8a87a6] hover:text-[#6339f4] transition-all"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-[#8a87a6] hover:text-rose-600 transition-all"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Slug Identifier</th>
                  <th className="py-3.5 px-4 font-bold">Description</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#181829]">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/80 text-[#6339f4]">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            getIconComponent(cat.icon)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[#181829]">{cat.name}</div>
                          <span className="text-[10px] text-[#8a87a6]">Icon: {cat.icon || 'Boxes'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-4 text-[#8a87a6] max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                        }`}
                      >
                        {cat.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{cat.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 rounded-xl hover:bg-[#ece8ff] text-[#8a87a6] hover:text-[#6339f4] transition-all"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="p-1.5 rounded-xl hover:bg-rose-50 text-[#8a87a6] hover:text-rose-600 transition-all"
                          title="Delete Category"
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

      {/* 5. ADD CATEGORY MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !isSubmitting && setIsAddModalOpen(false)}
        title="Create New Category"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Category Name */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Organic Dairy & Bakery"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
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

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief overview of items contained in this category..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4] resize-none"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">
              Select Category Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 bg-[#f0f2fb] rounded-2xl border border-slate-200">
              {ICON_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = formData.icon === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: opt.value })}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center space-y-1 transition-all ${
                      isSelected
                        ? 'bg-[#6339f4] text-white shadow-md'
                        : 'bg-white text-slate-600 hover:text-[#6339f4] border border-slate-200/60'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span className="text-[9px] font-medium truncate w-full text-center">
                      {opt.value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Banner URL */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">
              Image Banner URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>
            {formData.image && (
              <div className="mt-2 h-20 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            )}
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f0f2fb] border border-slate-200">
            <div>
              <div className="text-xs font-bold text-[#181829]">Active & Published</div>
              <div className="text-[10px] text-[#8a87a6]">
                Make this category immediately discoverable in marketplace search and navigation.
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
                  <span>Create Category</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* 6. EDIT CATEGORY MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !isSubmitting && setIsEditModalOpen(false)}
        title="Edit Category"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleUpdateCategory} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Category Name */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4] resize-none"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">Select Icon</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 bg-[#f0f2fb] rounded-2xl border border-slate-200">
              {ICON_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = formData.icon === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: opt.value })}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center space-y-1 transition-all ${
                      isSelected
                        ? 'bg-[#6339f4] text-white shadow-md'
                        : 'bg-white text-slate-600 hover:text-[#6339f4] border border-slate-200/60'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span className="text-[9px] font-medium truncate w-full text-center">
                      {opt.value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Banner URL */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">
              Image Banner URL
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f0f2fb] border border-slate-200">
            <div>
              <div className="text-xs font-bold text-[#181829]">Category Active Status</div>
              <div className="text-[10px] text-[#8a87a6]">Toggle whether this category is active in store feeds.</div>
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
                  <span>Updating...</span>
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

      {/* 7. PRESET / BULK CATEGORIES MODAL */}
      <Modal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        title="Add Popular Marketplace Categories"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#8a87a6]">
            Quickly expand your store catalog with these curated popular categories. Click "Add Category" to add any preset to your database.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {PRESET_CATEGORIES.map((preset, idx) => {
              const alreadyExists = categories.some(
                (c) => c.name.toLowerCase() === preset.name.toLowerCase()
              );
              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#f0f2fb] border border-slate-200 flex items-center justify-between space-x-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={preset.image}
                      alt={preset.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#181829] truncate">{preset.name}</h4>
                      <p className="text-[10px] text-[#8a87a6] truncate">{preset.description}</p>
                    </div>
                  </div>

                  <button
                    disabled={alreadyExists}
                    onClick={() => handleAddPreset(preset)}
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

      {/* 8. DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${deleteTarget?.name}"? Items linked to this category may lose their categorization.`}
        confirmText="Yes, Delete Category"
        isDestructive={true}
      />
    </div>
  );
};
