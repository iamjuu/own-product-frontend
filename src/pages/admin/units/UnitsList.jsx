import React, { useState, useEffect } from 'react';
import {
  Scale,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  RefreshCw,
  LayoutGrid,
  List,
  AlertCircle,
  Check,
  Info,
  ShieldCheck,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import ApiClient from '../../../api/client';
import { ConfirmDialog } from '../../../components/common/Modal';

export const UnitsList = () => {
  const [units, setUnits] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [pageMode, setPageMode] = useState('list'); // 'list' | 'add' | 'edit'
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    isActive: true,
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Unit Suggestions for Admin
  const QUICK_UNIT_PRESETS = [
    { name: 'Kilogram', symbol: 'kg', description: 'Mass for vegetables, fruits, rice, meat' },
    { name: 'Gram', symbol: 'g', description: 'Small mass for spices, seasonings and herbs' },
    { name: 'Litre', symbol: 'litre', description: 'Volume for milk, cooking oils and juices' },
    { name: 'Millilitre', symbol: 'ml', description: 'Volume for beverages and small liquids' },
    { name: 'Piece', symbol: 'piece', description: 'Single countable item (whole bird, fish, fruit)' },
    { name: 'Pack', symbol: 'pack', description: 'Sealed packet or bundle' },
    { name: 'Dozen', symbol: 'dozen', description: 'Set of 12 items (eggs, bananas)' },
    { name: 'Box', symbol: 'box', description: 'Box packaging' },
    { name: 'Bundle', symbol: 'bundle', description: 'Tied bunch (leafy greens, herbs)' },
  ];

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get('/admin/units', {
        search: search || undefined,
        status: statusFilter || undefined,
      });
      if (response.success && response.data) {
        setUnits(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load units:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUnits();
  };

  const handleOpenAdd = () => {
    setSelectedUnit(null);
    setFormData({
      name: '',
      symbol: '',
      description: '',
      isActive: true,
    });
    setFormError('');
    setFormSuccess('');
    setPageMode('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEdit = (unit) => {
    setSelectedUnit(unit);
    setFormData({
      name: unit.name,
      symbol: unit.symbol,
      description: unit.description || '',
      isActive: unit.isActive !== undefined ? unit.isActive : true,
    });
    setFormError('');
    setFormSuccess('');
    setPageMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setPageMode('list');
    setFormError('');
    setFormSuccess('');
    setSelectedUnit(null);
  };

  const handleSaveUnit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Unit name is required (e.g. Kilogram).');
      return;
    }
    if (!formData.symbol.trim()) {
      setFormError('Unit symbol is required (e.g. kg).');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      let response;
      if (pageMode === 'add') {
        response = await ApiClient.post('/admin/units', formData);
      } else {
        response = await ApiClient.patch(`/admin/units/${selectedUnit._id}`, formData);
      }

      if (response.success) {
        setFormSuccess(response.message || 'Unit saved successfully!');
        setTimeout(() => {
          setPageMode('list');
          fetchUnits();
        }, 600);
      } else {
        setFormError(response.message || 'Failed to save unit');
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred while saving unit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (unit) => {
    try {
      await ApiClient.patch(`/admin/units/${unit._id}`, {
        isActive: !unit.isActive,
      });
      fetchUnits();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteUnit = async () => {
    if (!deleteTarget) return;
    try {
      const res = await ApiClient.delete(`/admin/units/${deleteTarget._id}`);
      if (res.success) {
        setDeleteTarget(null);
        fetchUnits();
      } else {
        alert(res.message || 'Cannot delete unit');
      }
    } catch (err) {
      alert(err.message || 'Cannot delete unit');
    }
  };

  const activeCount = units.filter((u) => u.isActive).length;

  // ==========================================
  // VIEW: FULL PAGE ADD / EDIT UNIT
  // ==========================================
  if (pageMode === 'add' || pageMode === 'edit') {
    const isEdit = pageMode === 'edit';
    return (
      <div className="space-y-6 pb-16">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToList}
              className="p-2.5 rounded-2xl bg-[#f0f2fb] hover:bg-[#e4e7f5] text-[#181829] transition-all"
              title="Back to Units"
            >
              <ArrowLeft className="w-5 h-5 text-[#6339f4]" />
            </button>
            <div>
              <div className="flex items-center space-x-2 text-xs text-[#8a87a6]">
                <span className="hover:underline cursor-pointer" onClick={handleBackToList}>
                  Unit Directory
                </span>
                <span>/</span>
                <span className="text-[#6339f4] font-bold">
                  {isEdit ? `Edit Unit: ${selectedUnit?.name}` : 'Create New Unit'}
                </span>
              </div>
              <h1 className="text-lg font-black text-[#181829]">
                {isEdit ? `Edit Unit: ${formData.name || 'Unit'}` : 'Configure New Unit Type'}
              </h1>
            </div>
          </div>

          <button
            onClick={handleBackToList}
            className="px-4 py-2 rounded-2xl bg-[#f0f2fb] hover:bg-[#e4e7f5] text-xs font-bold text-[#8a87a6] hover:text-[#181829] transition-all self-start sm:self-auto"
          >
            Cancel & Back
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h2 className="text-sm font-bold text-[#181829]">Unit Details</h2>
              <p className="text-xs text-[#8a87a6]">
                Configure standardized measurement units. Subcategories will select from these units to govern shop product listings.
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

            {/* Quick Presets for New Unit */}
            {!isEdit && (
              <div>
                <span className="text-xs font-bold text-[#181829] block mb-2">
                  Quick Presets (Click to autofill):
                </span>
                <div className="flex flex-wrap gap-2">
                  {QUICK_UNIT_PRESETS.map((p) => {
                    const alreadyExists = units.some(
                      (u) => u.symbol.toLowerCase() === p.symbol.toLowerCase()
                    );
                    return (
                      <button
                        key={p.symbol}
                        type="button"
                        onClick={() => {
                          setFormData({
                            name: p.name,
                            symbol: p.symbol,
                            description: p.description,
                            isActive: true,
                          });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          alreadyExists
                            ? 'bg-slate-50 text-slate-400 border-slate-200'
                            : 'bg-[#f0f2fb] hover:bg-[#ece8ff] text-[#6339f4] border-slate-200/80 hover:border-[#6339f4]/40'
                        }`}
                      >
                        {p.name} ({p.symbol})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveUnit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Unit Name */}
                <div>
                  <label className="block text-xs font-bold text-[#181829] mb-1.5">
                    Unit Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Kilogram, Litre, Piece"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
                  />
                </div>

                {/* Unit Symbol */}
                <div>
                  <label className="block text-xs font-bold text-[#181829] mb-1.5">
                    Unit Symbol / Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.symbol}
                    onChange={(e) =>
                      setFormData({ ...formData, symbol: e.target.value.toLowerCase().trim() })
                    }
                    placeholder="e.g. kg, ml, piece, pack"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs font-mono text-[#181829] focus:outline-none focus:border-[#6339f4]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#181829] mb-1.5">
                  Usage Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describes what grocery or food types typically use this unit..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4] resize-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f0f2fb] border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-[#181829]">Active Unit Status</div>
                  <div className="text-[11px] text-[#8a87a6]">
                    When active, Admin can attach this unit to subcategories and Shop Owners can use it.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-[#6339f4] rounded focus:ring-[#6339f4] accent-[#6339f4] cursor-pointer"
                />
              </div>

              {/* Buttons */}
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
                      <span>{isEdit ? 'Save Changes' : 'Create Unit'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Live Preview Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8a87a6] uppercase tracking-wider">
                  Live Unit Preview
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6339f4]/10 text-[#6339f4]">
                  Subcategory Selector
                </span>
              </div>

              {/* Mock Subcategory Tag Badge */}
              <div className="p-4 rounded-2xl bg-[#f0f2fb] border border-slate-200/80 space-y-3">
                <div className="text-[11px] font-bold text-slate-500">How it appears to Admin:</div>
                <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-[#6339f4] shadow-sm text-xs font-bold text-[#6339f4]">
                  <Check className="w-3.5 h-3.5 text-[#6339f4]" />
                  <span>{formData.symbol || 'unit'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({formData.name || 'Unit Name'})
                  </span>
                </div>

                <div className="pt-2 text-[11px] font-bold text-slate-500">
                  How it appears to Shop Owners:
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-600">Unit</span>
                  <span className="font-bold text-[#181829] font-mono">
                    {formData.symbol || 'unit'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-amber-800 text-xs space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Governance Rule</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Only units configured here can be linked to Subcategories. Shop Owners cannot enter arbitrary custom units.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: UNITS CATALOG (LIST / GRID)
  // ==========================================
  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner & Main Actions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#6339f4]/10 text-[#6339f4] ring-4 ring-[#ece8ff]">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#181829] tracking-tight">
              Unit Type Governance
            </h2>
            <p className="text-xs text-[#8a87a6] font-medium">
              Admin-controlled measurement units (kg, g, litre, ml, piece, pack). Shop Owners can only select units configured for their subcategory.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Unit Type</span>
        </button>
      </div>

      {/* 2. Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-[#8a87a6]">Configured Units</span>
          <div className="text-xl font-black text-[#181829]">{units.length}</div>
          <span className="text-[10px] text-[#6339f4] font-medium">Standard measurement types</span>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-[#8a87a6]">Active In Marketplace</span>
          <div className="text-xl font-black text-emerald-600">{activeCount}</div>
          <span className="text-[10px] text-emerald-600 font-medium">● Available for subcategories</span>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-[#8a87a6]">Inactive Units</span>
          <div className="text-xl font-black text-slate-400">{units.length - activeCount}</div>
          <span className="text-[10px] text-slate-400 font-medium">Disabled from catalog</span>
        </div>
      </div>

      {/* 3. Search & View Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search unit by name or symbol..."
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

          {/* Grid / Table Toggle */}
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
            onClick={fetchUnits}
            className="p-2 rounded-2xl bg-[#f0f2fb] text-[#8a87a6] hover:text-[#181829] hover:bg-[#e4e7f5] transition-all"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#6339f4]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4. Units List (Grid vs Table) */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 space-y-3 border border-slate-200/80">
          <div className="w-8 h-8 rounded-full border-2 border-[#6339f4] border-t-transparent animate-spin mx-auto"></div>
          <p className="font-semibold text-slate-600">Loading units...</p>
        </div>
      ) : units.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200/80">
          <div className="w-14 h-14 rounded-2xl bg-[#f0f2fb] text-[#6339f4] flex items-center justify-center mx-auto">
            <Scale className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-[#181829]">No Units Found</h3>
          <p className="text-xs text-[#8a87a6] max-w-sm mx-auto">
            No measurement units match your search. Create units to assign them to subcategories.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-2xl bg-[#6339f4] text-xs font-bold text-white hover:bg-[#5327ec] shadow-md shadow-[#6339f4]/25"
          >
            + Create First Unit
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {units.map((unit) => (
            <div
              key={unit._id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-[#6339f4]/40 hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black px-3 py-1 rounded-xl bg-[#6339f4]/10 text-[#6339f4] border border-[#6339f4]/20">
                    {unit.symbol}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(unit)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                      unit.isActive
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}
                  >
                    {unit.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#181829] tracking-tight">{unit.name}</h3>
                  <p className="text-xs text-[#8a87a6] line-clamp-2 min-h-[32px] mt-1">
                    {unit.description || 'Standard measurement unit.'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  Used in <span className="font-bold text-[#6339f4]">{unit.usageCount || 0}</span> subcategories
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(unit)}
                    className="p-1.5 rounded-xl hover:bg-[#ece8ff] text-[#8a87a6] hover:text-[#6339f4] transition-all"
                    title="Edit Unit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(unit)}
                    className="p-1.5 rounded-xl hover:bg-rose-50 text-[#8a87a6] hover:text-rose-600 transition-all"
                    title="Delete Unit"
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
                  <th className="py-3.5 px-4 font-bold">Unit Name</th>
                  <th className="py-3.5 px-4 font-bold">Symbol</th>
                  <th className="py-3.5 px-4 font-bold">Description</th>
                  <th className="py-3.5 px-4 font-bold">Subcategories Assigned</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#181829]">
                {units.map((unit) => (
                  <tr key={unit._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#181829]">{unit.name}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#6339f4]">
                      {unit.symbol}
                    </td>
                    <td className="py-3.5 px-4 text-[#8a87a6] max-w-xs truncate">
                      {unit.description || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#181829]">
                      <span className="px-2 py-0.5 rounded-lg bg-[#f0f2fb] text-slate-700 text-[11px]">
                        {unit.usageCount || 0} subcategories
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(unit)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          unit.isActive
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                        }`}
                      >
                        {unit.isActive ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{unit.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenEdit(unit)}
                          className="p-1.5 rounded-xl hover:bg-[#ece8ff] text-[#8a87a6] hover:text-[#6339f4] transition-all"
                          title="Edit Unit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(unit)}
                          className="p-1.5 rounded-xl hover:bg-rose-50 text-[#8a87a6] hover:text-rose-600 transition-all"
                          title="Delete Unit"
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteUnit}
        title="Delete Unit"
        message={`Are you sure you want to delete unit '${deleteTarget?.name} (${deleteTarget?.symbol})'? This cannot be undone.`}
        confirmText="Yes, Delete Unit"
        isDestructive={true}
      />
    </div>
  );
};
