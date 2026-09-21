import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Tag,
  Sparkles,
  Check,
  Edit2,
  Trash2,
  AlertCircle,
  RefreshCw,
  Utensils,
  IndianRupee,
  Package,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { get, post, patch, del } from '../../../api/client';
import { Modal, ConfirmDialog } from '../../../components/common/Modal';

const PRESET_DISH_IMAGES = [
  {
    name: 'Biryani / Rice',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Burger & Fries',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Pizza',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Curry / Gravy',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Noodles & Asian',
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dessert & Cake',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cold Drink / Shake',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Salad & Healthy Bowl',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
  },
];

const INITIAL_FORM_STATE = {
  name: '',
  productId: '',
  categoryId: '',
  subcategoryId: '',
  unitId: '',
  unit: '',
  price: '',
  mrp: '',
  stockQuantity: '100',
  inStock: true,
  image: '',
  description: '',
};

export const ShopOwnerMenu = () => {
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, IN_STOCK, OUT_OF_STOCK
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Dynamic Catalog Listings (Multi-Vendor) States
  const [shopProducts, setShopProducts] = useState([]);
  const [catalogList, setCatalogList] = useState([]);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [selectedCatalogProduct, setSelectedCatalogProduct] = useState(null);
  const [selectedProductVariants, setSelectedProductVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [catalogForm, setCatalogForm] = useState({ sellingPrice: '', stock: '50', isAvailable: true });
  const [catalogError, setCatalogError] = useState('');
  const [catalogSuccess, setCatalogSuccess] = useState('');
  const [isSubmittingCatalog, setIsSubmittingCatalog] = useState(false);
  const [editingShopProduct, setEditingShopProduct] = useState(null);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [catalogSearch, setCatalogSearch] = useState('');

  // Dependent Dropdown States
  const [subcategories, setSubcategories] = useState([]);
  const [allowedUnits, setAllowedUnits] = useState([]);
  const [masterProducts, setMasterProducts] = useState([]);
  const [isSubcategoriesLoading, setIsSubcategoriesLoading] = useState(false);
  const [isUnitsLoading, setIsUnitsLoading] = useState(false);

  // Fetch Menu Items & Categories
  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const [menuRes, catRes, shopProdsRes, catalogRes] = await Promise.all([
        get('/shop-owner/menu'),
        get('/shop-owner/categories').catch(() => ({ data: [] })),
        get('/shop-products').catch(() => ({ data: [] })),
        get('/products').catch(() => ({ data: [] })),
      ]);

      if (menuRes?.success) {
        setItems(menuRes.data?.items || []);
        setShop(menuRes.data?.shop || null);
      }
      if (catRes?.success) {
        setCategories(catRes.data || []);
      }
      if (shopProdsRes?.success) {
        setShopProducts(Array.isArray(shopProdsRes.data) ? shopProdsRes.data : shopProdsRes.data?.listings || []);
      }
      if (catalogRes?.success) {
        setCatalogList(Array.isArray(catalogRes.data) ? catalogRes.data : catalogRes.data?.products || []);
      }
    } catch (err) {
      console.error('Failed to load menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  // Cascade Loaders
  const loadSubcategories = async (catId) => {
    if (!catId) {
      setSubcategories([]);
      setAllowedUnits([]);
      setMasterProducts([]);
      return;
    }
    setIsSubcategoriesLoading(true);
    try {
      const res = await get(`/shop-owner/subcategories?categoryId=${catId}`);
      if (res?.success) {
        setSubcategories(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load subcategories:', err);
    } finally {
      setIsSubcategoriesLoading(false);
    }
  };

  const loadUnitsAndProducts = async (subcatId) => {
    if (!subcatId) {
      setAllowedUnits([]);
      setMasterProducts([]);
      return;
    }
    setIsUnitsLoading(true);
    try {
      const [unitsRes, prodsRes] = await Promise.all([
        get(`/shop-owner/subcategories/${subcatId}/units`),
        get(`/shop-owner/master-products?subcategoryId=${subcatId}`),
      ]);
      if (unitsRes?.success) {
        const units = unitsRes.data || [];
        setAllowedUnits(units);
        if (units.length > 0 && !formData.unitId) {
          setFormData((prev) => ({
            ...prev,
            unitId: units[0]._id,
            unit: units[0].symbol,
          }));
        }
      }
      if (prodsRes?.success) {
        setMasterProducts(prodsRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load units and master products:', err);
    } finally {
      setIsUnitsLoading(false);
    }
  };

  const handleCategoryChange = (catId) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: catId,
      subcategoryId: '',
      productId: '',
      unitId: '',
      unit: '',
    }));
    setAllowedUnits([]);
    setMasterProducts([]);
    loadSubcategories(catId);
  };

  const handleSubcategoryChange = (subcatId) => {
    setFormData((prev) => ({
      ...prev,
      subcategoryId: subcatId,
      productId: '',
      unitId: '',
      unit: '',
    }));
    loadUnitsAndProducts(subcatId);
  };

  const handleUnitChange = (unitId) => {
    const found = allowedUnits.find((u) => u._id === unitId);
    setFormData((prev) => ({
      ...prev,
      unitId,
      unit: found?.symbol || '',
    }));
  };

  const handleMasterProductSelect = (prodId) => {
    if (!prodId) {
      setFormData((prev) => ({ ...prev, productId: '' }));
      return;
    }
    const master = masterProducts.find((p) => p._id === prodId);
    if (master) {
      const matchingUnit = allowedUnits.find(
        (u) => u._id === (master.unitId?._id || master.unitId) || u.symbol === master.unit
      );
      setFormData((prev) => ({
        ...prev,
        productId: prodId,
        name: master.name,
        image: master.image || prev.image,
        description: master.description || prev.description,
        price: master.price !== undefined ? String(master.price) : prev.price,
        mrp: master.mrp !== undefined ? String(master.mrp) : prev.mrp,
        unitId: matchingUnit ? matchingUnit._id : prev.unitId,
        unit: matchingUnit ? matchingUnit.symbol : prev.unit,
      }));
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    const defaultCatId = categories[0]?._id || '';
    setFormData({
      ...INITIAL_FORM_STATE,
      categoryId: defaultCatId,
      image: PRESET_DISH_IMAGES[0].url,
    });
    setFormError('');
    setIsAddModalOpen(true);
    if (defaultCatId) {
      loadSubcategories(defaultCatId);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setItemToEdit(item);
    setFormData({
      name: item.name || '',
      productId: item.masterProductId || '',
      categoryId: item.categoryId || categories[0]?._id || '',
      subcategoryId: item.subcategoryId || '',
      unitId: item.unitId || '',
      unit: item.unit || '',
      price: item.price !== undefined ? String(item.price) : '',
      mrp: item.mrp !== undefined ? String(item.mrp) : '',
      stockQuantity: item.stockQuantity !== undefined ? String(item.stockQuantity) : '100',
      inStock: item.inStock !== undefined ? item.inStock : true,
      image: item.image || '',
      description: item.description || '',
    });
    setFormError('');
    setIsEditModalOpen(true);
    if (item.categoryId) {
      loadSubcategories(item.categoryId);
    }
    if (item.subcategoryId) {
      loadUnitsAndProducts(item.subcategoryId);
    }
  };

  // Submit Add Dish
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Dish / Item name is required.');
      return;
    }
    if (subcategories.length > 0 && !formData.subcategoryId) {
      setFormError('Please select a Subcategory.');
      return;
    }
    if (formData.subcategoryId && allowedUnits.length === 0) {
      setFormError('No units configured for this subcategory. Please contact Admin.');
      return;
    }
    if (allowedUnits.length > 0 && !formData.unitId) {
      setFormError('Please select an authorized unit.');
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      setFormError('Please enter a valid selling price.');
      return;
    }

    setActionLoading(true);
    setFormError('');
    try {
      const selectedCategoryObj = categories.find((c) => c._id === formData.categoryId);
      const payload = {
        ...formData,
        price: Number(formData.price),
        mrp: formData.mrp ? Number(formData.mrp) : Number(formData.price),
        stockQuantity: Number(formData.stockQuantity) || 0,
        categoryName: selectedCategoryObj?.name || 'Restaurant & Hot Food',
      };

      const res = await post('/shop-owner/menu', payload);
      if (res?.success) {
        setIsAddModalOpen(false);
        await fetchMenuData();
      } else {
        setFormError(res?.message || 'Failed to create menu item.');
      }
    } catch (err) {
      setFormError(err.message || 'Error occurred while saving item.');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Update Dish
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Dish / Item name is required.');
      return;
    }
    if (subcategories.length > 0 && !formData.subcategoryId) {
      setFormError('Please select a Subcategory.');
      return;
    }
    if (allowedUnits.length > 0 && !formData.unitId) {
      setFormError('Please select an authorized unit.');
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      setFormError('Please enter a valid selling price.');
      return;
    }

    setActionLoading(true);
    setFormError('');
    try {
      const selectedCategoryObj = categories.find((c) => c._id === formData.categoryId);
      const payload = {
        ...formData,
        price: Number(formData.price),
        mrp: formData.mrp ? Number(formData.mrp) : Number(formData.price),
        stockQuantity: Number(formData.stockQuantity) || 0,
        categoryName: selectedCategoryObj?.name,
      };

      const res = await patch(`/shop-owner/menu/${itemToEdit._id}`, payload);
      if (res?.success) {
        setIsEditModalOpen(false);
        await fetchMenuData();
      } else {
        setFormError(res?.message || 'Failed to update menu item.');
      }
    } catch (err) {
      setFormError(err.message || 'Error occurred while updating item.');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Stock Availability
  const handleToggleStock = async (item) => {
    try {
      const updatedStatus = !item.inStock;
      // Optimistic update
      setItems((prev) =>
        prev.map((it) => (it._id === item._id ? { ...it, inStock: updatedStatus } : it))
      );

      const res = await patch(`/shop-owner/menu/${item._id}/stock`, {
        inStock: updatedStatus,
      });

      if (!res?.success) {
        // revert on failure
        fetchMenuData();
      }
    } catch (err) {
      console.error('Failed to toggle stock status:', err);
      fetchMenuData();
    }
  };

  // Delete Dish
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await del(`/shop-owner/menu/${itemToDelete._id}`);
      if (res?.success) {
        setItems((prev) => prev.filter((it) => it._id !== itemToDelete._id));
        setItemToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  // ==========================================
  // DYNAMIC CATALOG LISTING HANDLERS
  // ==========================================
  const handleOpenCatalogModal = () => {
    setSelectedCatalogProduct(null);
    setSelectedProductVariants([]);
    setSelectedVariantId('');
    setCatalogForm({ sellingPrice: '', stock: '50', isAvailable: true });
    setCatalogError('');
    setCatalogSuccess('');
    setIsCatalogModalOpen(true);
  };

  const handleSelectCatalogProduct = async (product) => {
    setSelectedCatalogProduct(product);
    setSelectedVariantId('');
    setCatalogError('');
    setCatalogSuccess('');

    try {
      const res = await get(`/products/${product._id}/variants`);
      if (res?.success) {
        setSelectedProductVariants(res.data || []);
        if (res.data?.length > 0) {
          setSelectedVariantId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load product variants:', err);
    }
  };

  const handleSubmitCatalogListing = async (e) => {
    e.preventDefault();
    if (!selectedCatalogProduct) {
      setCatalogError('Please select a product from the catalog.');
      return;
    }
    if (!selectedVariantId) {
      setCatalogError('Please select a product variant (unit + quantity).');
      return;
    }
    if (!catalogForm.sellingPrice || Number(catalogForm.sellingPrice) < 0) {
      setCatalogError('Please enter a valid selling price.');
      return;
    }
    if (catalogForm.stock === '' || Number(catalogForm.stock) < 0) {
      setCatalogError('Please enter a valid stock quantity.');
      return;
    }

    setIsSubmittingCatalog(true);
    setCatalogError('');
    setCatalogSuccess('');

    try {
      const res = await post('/shop-products', {
        shopId: shop?._id,
        productVariantId: selectedVariantId,
        sellingPrice: Number(catalogForm.sellingPrice),
        stock: Number(catalogForm.stock),
        isAvailable: catalogForm.isAvailable,
      });

      if (res?.success) {
        setCatalogSuccess('Product variant published to your store catalog!');
        setTimeout(() => {
          setIsCatalogModalOpen(false);
          fetchMenuData();
        }, 1000);
      } else {
        setCatalogError(res?.message || 'Failed to list product.');
      }
    } catch (err) {
      setCatalogError(err.message || 'Error publishing catalog product.');
    } finally {
      setIsSubmittingCatalog(false);
    }
  };

  const handleToggleShopProductStock = async (listing) => {
    try {
      const updatedAvail = !listing.isAvailable;
      setShopProducts((prev) =>
        prev.map((it) => (it._id === listing._id ? { ...it, isAvailable: updatedAvail } : it))
      );

      const res = await patch(`/shop-products/${listing._id}`, {
        isAvailable: updatedAvail,
        stock: updatedAvail && listing.stock === 0 ? 10 : listing.stock,
      });

      if (!res?.success) {
        fetchMenuData();
      }
    } catch (err) {
      console.error('Failed to toggle shop product status:', err);
      fetchMenuData();
    }
  };

  const handleConfirmDeleteShopProduct = async () => {
    if (!listingToDelete) return;
    try {
      const res = await del(`/shop-products/${listingToDelete._id}`);
      if (res?.success) {
        setShopProducts((prev) => prev.filter((it) => it._id !== listingToDelete._id));
        setListingToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete shop product listing:', err);
    }
  };

  // Summary counts
  const totalCount = items.length;
  const inStockCount = items.filter((i) => i.inStock).length;
  const outOfStockCount = totalCount - inStockCount;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Card */}
      <div className="theme-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h1 className="text-lg font-bold text-[#181829]">Menu & Inventory Management</h1>
              {shop?.name && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ece8ff] text-[#6339f4]">
                  {shop.name}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8a87a6] mt-0.5">
              Add restaurant dishes, adjust pricing, portion sizes, and instantly toggle kitchen availability.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto flex-wrap gap-y-2">
          <button
            onClick={fetchMenuData}
            className="p-2.5 rounded-xl bg-[#f0f2fb] hover:bg-slate-200 text-slate-700 transition-all"
            title="Refresh menu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#6339f4]' : ''}`} />
          </button>
          <button
            onClick={handleOpenCatalogModal}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#6030ea] to-[#8050f5] hover:opacity-95 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-[#6030ea]/20 transition-all"
          >
            <Package className="w-4 h-4" />
            <span>+ Select from Admin Catalog</span>
          </button>
          <button
            id="add-menu-item-btn"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Dish</span>
          </button>
        </div>
      </div>

      {/* ==========================================
          DYNAMIC CATALOG LISTINGS (MULTI-VENDOR MARKETPLACE)
          ========================================== */}
      <div className="theme-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#6030ea]"></span>
              <h2 className="text-sm font-bold text-[#181829] uppercase tracking-wider">
                Store Catalog Offerings (Multi-Vendor Listings)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#6030ea] font-extrabold text-[10px] border border-purple-200">
                {shopProducts.length} Listed
              </span>
            </div>
            <p className="text-xs text-[#8a87a6] mt-0.5">
              Admin master products linked to your store with independent selling prices and stock.
            </p>
          </div>

          <button
            onClick={handleOpenCatalogModal}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6030ea] border border-purple-200 text-xs font-bold transition-all self-start sm:self-auto"
          >
            <Package className="w-4 h-4" />
            <span>+ List Product Variant</span>
          </button>
        </div>

        {shopProducts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#f8f9fe] border border-dashed border-slate-200 space-y-2">
            <Package className="w-8 h-8 text-[#6030ea] mx-auto opacity-70" />
            <h4 className="text-xs font-bold text-[#181829]">No catalog products listed yet</h4>
            <p className="text-[11px] text-[#8a87a6] max-w-sm mx-auto">
              Select products from the admin catalog (e.g. Eastern Turmeric Powder, Farm Fresh Chicken, Sardines), choose your variants, and set your own price and stock.
            </p>
            <button
              onClick={handleOpenCatalogModal}
              className="mt-2 px-3.5 py-1.5 rounded-xl bg-[#6030ea] text-white text-xs font-bold shadow-sm"
            >
              Browse Admin Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {shopProducts.map((listing) => {
              const variant = listing.productVariantId;
              const product = variant?.productId;
              const unit = variant?.unitId;

              return (
                <div
                  key={listing._id}
                  className="rounded-2xl border border-slate-200/80 p-4 bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6030ea] font-extrabold text-[10px] border border-purple-200">
                        {product?.brandId?.name || 'Catalog Item'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          listing.isAvailable && listing.stock > 0
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {listing.isAvailable && listing.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 pt-1">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                        {product?.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-gray-900 truncate" title={product?.name}>
                          {product?.name || 'Product'}
                        </h4>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 text-gray-700 font-extrabold text-[10px]">
                          {variant?.quantity} {unit?.symbol}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Stock Details */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8a87a6] font-medium">Selling Price:</span>
                      <span className="font-extrabold text-gray-900 text-sm">₹{listing.sellingPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8a87a6] font-medium">Available Stock:</span>
                      <span className="font-bold text-gray-800">{listing.stock} units</span>
                    </div>
                  </div>

                  {/* Card Footer Toggle & Delete */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <div
                        onClick={() => handleToggleShopProductStock(listing)}
                        className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                          listing.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                            listing.isAvailable ? 'translate-x-3.5' : 'translate-x-0'
                          }`}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {listing.isAvailable ? 'Active' : 'Paused'}
                      </span>
                    </label>

                    <button
                      onClick={() => setListingToDelete(listing)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove listing from store"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="theme-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#8a87a6] block">Total Menu Dishes</span>
            <span className="text-xl font-black text-[#181829]">{totalCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4]">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className="theme-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#8a87a6] block">In Stock / Available</span>
            <span className="text-xl font-black text-emerald-600">{inStockCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="theme-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#8a87a6] block">Out of Stock</span>
            <span className="text-xl font-black text-rose-500">{outOfStockCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="theme-card p-5 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-[#8a87a6] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, drinks, ingredients, or categories..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f0f2fb] border border-slate-200 text-xs font-medium text-[#181829] focus:outline-none focus:border-[#6339f4]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            {/* Category Filter */}
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#f0f2fb] border border-slate-200 text-xs font-bold text-[#181829] focus:outline-none focus:border-[#6339f4]"
              >
                <option value="ALL">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}

            {/* Stock Filters */}
            <div className="flex items-center space-x-1.5 bg-[#f0f2fb] p-1 rounded-xl">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-[#6339f4] text-white shadow-sm'
                    : 'text-[#8a87a6] hover:text-[#181829]'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setStatusFilter('IN_STOCK')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'IN_STOCK'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[#8a87a6] hover:text-[#181829]'
                }`}
              >
                In Stock ({inStockCount})
              </button>
              <button
                onClick={() => setStatusFilter('OUT_OF_STOCK')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'OUT_OF_STOCK'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-[#8a87a6] hover:text-[#181829]'
                }`}
              >
                Out of Stock ({outOfStockCount})
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#6339f4] border-t-transparent animate-spin mx-auto"></div>
            <p className="text-xs text-[#8a87a6] mt-3">Loading restaurant menu...</p>
          </div>
        ) : items.length === 0 ? (
          /* Zero Catalog State */
          <div className="p-12 text-center rounded-2xl bg-[#f8f9fe] border border-dashed border-slate-200 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] mx-auto shadow-sm">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-[#181829]">Your Restaurant Menu Catalog</h3>
            <p className="text-xs text-[#8a87a6] max-w-md mx-auto">
              Configure your first restaurant dish, set pricing, choose portion sizes, select food photos, and classify by category.
            </p>
            <div className="pt-2">
              <button
                onClick={handleOpenAdd}
                className="px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-white text-xs font-bold inline-flex items-center space-x-2 shadow-lg shadow-[#6339f4]/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Your First Dish / Item</span>
              </button>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          /* Filter Returned Empty State */
          <div className="p-12 text-center rounded-2xl bg-[#f8f9fe] border border-slate-200/60 space-y-2">
            <Search className="w-8 h-8 text-[#8a87a6] mx-auto opacity-50" />
            <h3 className="text-xs font-bold text-[#181829]">No items matched your search</h3>
            <p className="text-xs text-[#8a87a6]">
              Try changing your search term or reset your stock/category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="mt-2 px-3 py-1.5 text-xs font-bold text-[#6339f4] bg-[#ece8ff] rounded-xl hover:bg-[#ded6ff]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Menu Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  item.inStock
                    ? 'bg-white border-slate-200/80 hover:shadow-md hover:border-[#6339f4]/30'
                    : 'bg-slate-50/60 border-slate-200 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  {/* Image & Badges */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Utensils className="w-10 h-10" />
                      </div>
                    )}

                    {/* Stock Status Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                          item.inStock
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Portion / Unit Badge */}
                    {item.unit && (
                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm">
                          {item.unit}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold text-[#181829] line-clamp-1" title={item.name}>
                        {item.name}
                      </h3>
                      {item.categoryName && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#ece8ff] text-[#6339f4] font-bold shrink-0">
                          {item.categoryName}
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-[11px] text-[#8a87a6] mt-1 line-clamp-2" title={item.description}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="text-sm font-black text-[#181829]">
                      ₹{item.price}
                    </span>
                    {item.mrp && item.mrp > item.price && (
                      <span className="text-xs text-[#8a87a6] line-through">
                        ₹{item.mrp}
                      </span>
                    )}
                    {item.mrp && item.mrp > item.price && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {/* Instant In-Stock Switch */}
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <div
                      onClick={() => handleToggleStock(item)}
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                        item.inStock ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          item.inStock ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></div>
                    </div>
                    <span className="text-[11px] font-bold text-[#8a87a6]">
                      {item.inStock ? 'Available' : 'Paused'}
                    </span>
                  </label>

                  {/* Edit / Delete Buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#6339f4] hover:bg-[#ece8ff] transition-all"
                      title="Edit dish"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setItemToDelete(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      title="Delete dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* ADD MENU ITEM MODAL */}
      {/* ========================================================= */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !actionLoading && setIsAddModalOpen(false)}
        title="Add New Dish to Restaurant Menu"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Category & Subcategory Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-[#6339f4]" />
                <span>1. Category <span className="text-rose-500">*</span></span>
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
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
                <Layers className="w-3.5 h-3.5 text-[#6339f4]" />
                <span>2. Subcategory <span className="text-rose-500">*</span></span>
              </label>
              <select
                required
                disabled={!formData.categoryId || isSubcategoriesLoading}
                value={formData.subcategoryId}
                onChange={(e) => handleSubcategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
              >
                <option value="">
                  {isSubcategoriesLoading ? 'Loading subcategories...' : '-- Select Subcategory --'}
                </option>
                {subcategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Master Catalog Product (Optional Quick Picker) */}
          {formData.subcategoryId && masterProducts.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5 flex items-center space-x-1">
                <Package className="w-3.5 h-3.5 text-[#6339f4]" />
                <span>Select from Catalog (Autofill details)</span>
              </label>
              <select
                value={formData.productId}
                onChange={(e) => handleMasterProductSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
              >
                <option value="">-- Custom Item / Custom Name --</option>
                {masterProducts.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (Suggested unit: {p.unit || 'Standard'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dish / Product Name & Admin-Governed Unit Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">
                3. Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Fresh Sardine, Masala Chai..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5 flex items-center justify-between">
                <span>4. Unit <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-slate-400 font-normal">Admin Allowed Units</span>
              </label>

              {formData.subcategoryId && allowedUnits.length === 0 && !isUnitsLoading ? (
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium leading-snug">
                  No units configured for this subcategory. Please contact Admin.
                </div>
              ) : (
                <select
                  required
                  disabled={!formData.subcategoryId || isUnitsLoading || allowedUnits.length === 0}
                  value={formData.unitId}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-bold focus:outline-none focus:border-[#6339f4]"
                >
                  <option value="">
                    {isUnitsLoading ? 'Loading allowed units...' : '-- Select Admin Authorized Unit --'}
                  </option>
                  {allowedUnits.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.symbol} ({u.name})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">
                Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="199"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-bold focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">
                MRP / Strike (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                placeholder="249"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">
                Kitchen Prep Stock
              </label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                placeholder="100"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>
          </div>

          {/* Quick Photo Selector */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">
              Photo (Pick a preset or paste image URL)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-2">
              {PRESET_DISH_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => setFormData({ ...formData, image: preset.url })}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    formData.image === preset.url
                      ? 'border-[#6339f4] ring-2 ring-[#6339f4]/30 scale-105'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                  title={preset.name}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Or paste any custom image URL (https://...)"
              className="w-full px-3.5 py-2 rounded-xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">
              Description & Ingredients
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Freshly prepared with aromatic spices, basmati rice, mint, and saffron..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
            />
          </div>

          {/* In Stock toggle */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="add-in-stock"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="w-4 h-4 rounded text-[#6339f4] focus:ring-[#6339f4]"
            />
            <label htmlFor="add-in-stock" className="text-xs font-bold text-[#181829] cursor-pointer">
              Item is currently In Stock and ready for customer ordering
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-[#8a87a6] hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25 disabled:opacity-50"
            >
              {actionLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding Item...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Restaurant Menu</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* EDIT MENU ITEM MODAL */}
      {/* ========================================================= */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !actionLoading && setIsEditModalOpen(false)}
        title={`Edit Dish: ${itemToEdit?.name || ''}`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitUpdate} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Category & Subcategory Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
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
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Subcategory</label>
              <select
                value={formData.subcategoryId}
                onChange={(e) => handleSubcategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-medium focus:outline-none focus:border-[#6339f4]"
              >
                <option value="">-- Select Subcategory --</option>
                {subcategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Item Name & Admin-Governed Unit Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Allowed Unit</label>
              {allowedUnits.length === 0 ? (
                <div className="p-2 rounded-xl bg-amber-50 text-amber-800 text-[11px]">
                  No units configured for this subcategory.
                </div>
              ) : (
                <select
                  value={formData.unitId}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-bold focus:outline-none focus:border-[#6339f4]"
                >
                  <option value="">-- Select Allowed Unit --</option>
                  {allowedUnits.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.symbol} ({u.name})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">
                Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] font-bold focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">MRP / Strike (₹)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181829] mb-1.5">Kitchen Prep Stock</label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
              />
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">Photo URL</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-2">
              {PRESET_DISH_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => setFormData({ ...formData, image: preset.url })}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    formData.image === preset.url
                      ? 'border-[#6339f4] ring-2 ring-[#6339f4]/30 scale-105'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                  title={preset.name}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#181829] mb-1.5">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
            />
          </div>

          {/* In Stock toggle */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="edit-in-stock"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="w-4 h-4 rounded text-[#6339f4] focus:ring-[#6339f4]"
            />
            <label htmlFor="edit-in-stock" className="text-xs font-bold text-[#181829] cursor-pointer">
              Item is currently In Stock and ready for customer ordering
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-[#8a87a6] hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-xs font-bold text-white transition-all shadow-md shadow-[#6339f4]/25 disabled:opacity-50"
            >
              {actionLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update Dish</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Dish from Catalog?"
        message={`Are you sure you want to remove "${itemToDelete?.name}" from your restaurant catalog? Customers will no longer be able to view or order this item.`}
        confirmText="Yes, Delete Dish"
        cancelText="Keep Item"
        isDestructive={true}
      />

      {/* ==========================================
          MODAL: SELECT & LIST PRODUCT FROM ADMIN CATALOG
          ========================================== */}
      {isCatalogModalOpen && (
        <Modal
          isOpen={isCatalogModalOpen}
          onClose={() => setIsCatalogModalOpen(false)}
          title="Select & List Product from Master Catalog"
          size="lg"
        >
          <div className="space-y-6">
            {catalogError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{catalogError}</span>
              </div>
            )}

            {catalogSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{catalogSuccess}</span>
              </div>
            )}

            {/* Step 1: Product Selection from Catalog */}
            {!selectedCatalogProduct ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Step 1: Choose Master Product
                  </h4>
                  <span className="text-[11px] text-gray-400">
                    {catalogList.length} products available
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search by name, category, or brand..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {catalogList
                    .filter((p) => {
                      if (!catalogSearch.trim()) return true;
                      const s = catalogSearch.toLowerCase();
                      const name = p.name?.toLowerCase() || '';
                      const cat = p.categoryId?.name?.toLowerCase() || '';
                      const brand = p.brandId?.name?.toLowerCase() || '';
                      return name.includes(s) || cat.includes(s) || brand.includes(s);
                    })
                    .map((prod) => (
                      <div
                        key={prod._id}
                        onClick={() => handleSelectCatalogProduct(prod)}
                        className="p-3.5 rounded-2xl border border-gray-200 hover:border-[#6030ea] hover:bg-purple-50/20 cursor-pointer transition-all flex items-center space-x-3 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#6030ea] transition-colors truncate">
                            {prod.name}
                          </h5>
                          <span className="text-[10px] text-gray-500 block truncate">
                            {prod.categoryId?.name} ➔ {prod.subcategoryId?.name}
                          </span>
                          {prod.brandId?.name && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[9px] font-bold">
                              {prod.brandId.name}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#6030ea] shrink-0" />
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              /* Step 2: Select Variant & Set Price/Stock */
              <form onSubmit={handleSubmitCatalogListing} className="space-y-5">
                {/* Selected Product Banner */}
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-white overflow-hidden shrink-0 border border-purple-200 flex items-center justify-center">
                      {selectedCatalogProduct.image ? (
                        <img
                          src={selectedCatalogProduct.image}
                          alt={selectedCatalogProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-[#6030ea]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-purple-950">
                        {selectedCatalogProduct.name}{' '}
                        {selectedCatalogProduct.brandId?.name ? `(${selectedCatalogProduct.brandId.name})` : ''}
                      </h4>
                      <span className="text-[10px] text-purple-700 font-medium">
                        {selectedCatalogProduct.categoryId?.name} ➔ {selectedCatalogProduct.subcategoryId?.name}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCatalogProduct(null);
                      setSelectedProductVariants([]);
                      setSelectedVariantId('');
                    }}
                    className="text-xs text-[#6030ea] hover:underline font-bold"
                  >
                    Change Product
                  </button>
                </div>

                {/* Variant Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Select Product Variant (Unit + Quantity) <span className="text-rose-500">*</span>
                  </label>

                  {selectedProductVariants.length === 0 ? (
                    <div className="p-4 rounded-xl bg-amber-50 text-amber-800 text-xs">
                      No variants exist yet for this product. Please ask Admin to configure variants for {selectedCatalogProduct.name}.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {selectedProductVariants.map((v) => {
                        const isSelected = selectedVariantId === v._id;
                        return (
                          <div
                            key={v._id}
                            onClick={() => setSelectedVariantId(v._id)}
                            className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#6030ea] bg-purple-50/70 ring-2 ring-[#6030ea]/20 shadow-xs'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <span className="text-sm font-black text-gray-900 block">
                              {v.quantity} {v.unitId?.symbol}
                            </span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              {v.unitId?.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Price and Stock Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Store Selling Price (₹) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={catalogForm.sellingPrice}
                      onChange={(e) => setCatalogForm({ ...catalogForm, sellingPrice: e.target.value })}
                      placeholder="e.g. 85"
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-extrabold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Initial Available Stock <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={catalogForm.stock}
                      onChange={(e) => setCatalogForm({ ...catalogForm, stock: e.target.value })}
                      placeholder="e.g. 50"
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6030ea]/20 focus:border-[#6030ea] font-bold"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCatalogModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCatalog || selectedProductVariants.length === 0}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#6030ea] to-[#8050f5] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#6030ea]/20 hover:opacity-95 disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    {isSubmittingCatalog ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Publish to Store Catalog</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}

      {/* Confirm Delete Shop Product Dialog */}
      <ConfirmDialog
        isOpen={Boolean(listingToDelete)}
        onClose={() => setListingToDelete(null)}
        onConfirm={handleConfirmDeleteShopProduct}
        title="Remove Listing from Store?"
        message={`Are you sure you want to remove this catalog listing from your store? Customers will no longer see this variant.`}
        confirmText="Remove Listing"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};
