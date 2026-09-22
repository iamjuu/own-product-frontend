import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiClient from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const calculateDynamicDeliveryFee = (items) => {
  if (!items || items.length === 0) return 0;
  const categoryFees = new Map();
  for (const item of items) {
    const catKey = (item.categoryId || item.category || 'General').toString();
    const fee = typeof item.deliveryPrice === 'number' && item.deliveryPrice >= 0
      ? item.deliveryPrice
      : 30;
    if (!categoryFees.has(catKey) || categoryFees.get(catKey) < fee) {
      categoryFees.set(catKey, fee);
    }
  }
  let totalDelivery = 0;
  for (const fee of categoryFees.values()) {
    totalDelivery += fee;
  }
  return totalDelivery;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch user cart from DB when logged in, or use localStorage for guest
  const fetchCart = async () => {
    if (!isAuthenticated) {
      const saved = localStorage.getItem('localrun_guest_cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCart(parsed);
        } catch (e) {
          // ignore
        }
      } else {
        setCart({ items: [], subtotal: 0, deliveryFee: 0, discount: 0, totalAmount: 0 });
      }
      return;
    }

    try {
      setLoading(true);
      const res = await ApiClient.get('/user/cart');
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch cart from server, using local state:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user?._id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Add Item to Cart (Verifies authentication & calls POST /user/cart/items API)
  const addToCart = async (product, quantity = 1) => {
    // 1. Verify Login Authentication: If not logged in, trigger notification and redirect/prompt
    if (!isAuthenticated) {
      setToastMessage({
        type: 'error',
        title: 'Sign In Required',
        description: 'Please sign in to add items to your personal shopping cart.',
      });
      setTimeout(() => setToastMessage(null), 3500);
      return false;
    }

    const resolvedDeliveryPrice = typeof product.deliveryPrice === 'number' && product.deliveryPrice >= 0
      ? product.deliveryPrice
      : (typeof product.categoryDeliveryPrice === 'number' ? product.categoryDeliveryPrice : 30);

    const itemData = {
      productId: product._id || product.id,
      name: product.name,
      price: Number(product.price) || 0,
      originalPrice: Number(product.originalPrice || product.mrp) || (Number(product.price) * 1.25),
      image: product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
      quantity: Number(quantity) || 1,
      unit: product.unit || 'piece',
      category: product.categoryName || product.category || 'General',
      categoryId: product.categoryId || null,
      deliveryPrice: resolvedDeliveryPrice,
    };

    try {
      setLoading(true);
      const res = await ApiClient.post('/user/cart/items', itemData);
      if (res.success && res.data) {
        setCart(res.data);
        setToastMessage({
          type: 'success',
          title: 'Added to Cart Successfully',
          description: `${itemData.name} (Qty: ${itemData.quantity}) added to your shopping bag.`,
        });
        setTimeout(() => setToastMessage(null), 3500);
        return true;
      }
    } catch (err) {
      console.error('Failed to add to cart on server:', err);
      // Fallback update
      setCart((prev) => {
        const existingIdx = prev.items.findIndex(
          (i) => String(i.productId) === String(itemData.productId) || i.name === itemData.name
        );
        let updatedItems = [...prev.items];
        if (existingIdx > -1) {
          updatedItems[existingIdx] = {
            ...updatedItems[existingIdx],
            quantity: updatedItems[existingIdx].quantity + itemData.quantity,
          };
        } else {
          updatedItems.push({ ...itemData, _id: `item-${Date.now()}` });
        }

        const subtotal = updatedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
        const deliveryFee = calculateDynamicDeliveryFee(updatedItems);
        const totalAmount = subtotal + deliveryFee;
        return { ...prev, items: updatedItems, subtotal, deliveryFee, totalAmount };
      });
      setToastMessage({
        type: 'success',
        title: 'Added to Cart',
        description: `${itemData.name} added to bag.`,
      });
      setTimeout(() => setToastMessage(null), 3500);
      return true;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQty) => {
    if (isAuthenticated) {
      try {
        const res = await ApiClient.request(`/user/cart/items/${itemId}`, {
          method: 'PUT',
          body: JSON.stringify({ quantity: newQty }),
        });
        if (res.success && res.data) {
          setCart(res.data);
          return;
        }
      } catch (err) {
        console.error('Failed to update cart item:', err);
      }
    }

    // Local fallback
    setCart((prev) => {
      let updatedItems = prev.items
        .map((it) => (it._id === itemId || it.productId === itemId ? { ...it, quantity: newQty } : it))
        .filter((it) => it.quantity > 0);

      const subtotal = updatedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      const deliveryFee = calculateDynamicDeliveryFee(updatedItems);
      const totalAmount = subtotal + deliveryFee;
      const newCart = { ...prev, items: updatedItems, subtotal, deliveryFee, totalAmount };

      if (!isAuthenticated) {
        localStorage.setItem('localrun_guest_cart', JSON.stringify(newCart));
      }
      return newCart;
    });
  };

  // Remove item
  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const res = await ApiClient.delete(`/user/cart/items/${itemId}`);
        if (res.success && res.data) {
          setCart(res.data);
          showToast('Item removed from cart');
          return;
        }
      } catch (err) {
        console.error('Failed to remove cart item:', err);
      }
    }

    setCart((prev) => {
      const updatedItems = prev.items.filter((it) => it._id !== itemId && it.productId !== itemId);
      const subtotal = updatedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      const deliveryFee = calculateDynamicDeliveryFee(updatedItems);
      const totalAmount = subtotal + deliveryFee;
      const newCart = { ...prev, items: updatedItems, subtotal, deliveryFee, totalAmount };

      if (!isAuthenticated) {
        localStorage.setItem('localrun_guest_cart', JSON.stringify(newCart));
      }
      return newCart;
    });
    showToast('Item removed from cart');
  };

  // Clear entire cart
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await ApiClient.delete('/user/cart');
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      localStorage.removeItem('localrun_guest_cart');
    }
    setCart({ items: [], subtotal: 0, deliveryFee: 0, discount: 0, totalAmount: 0 });
  };

  // Create Razorpay Gateway Order from Backend
  const createRazorpayOrder = async () => {
    if (!isAuthenticated) {
      throw new Error('Please login to checkout.');
    }
    const res = await ApiClient.post('/user/orders/razorpay-order', {
      clientAmount: cart.subtotal || 0,
      clientDeliveryFee: cart.deliveryFee || 0,
      clientItems: (cart.items || []).map((i) => ({
        productId: i.productId || i._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        category: i.category,
        deliveryPrice: i.deliveryPrice,
      })),
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Could not initiate Razorpay transaction.');
  };

  // Checkout from Cart
  const checkout = async ({ paymentMethod = 'RAZORPAY', deliveryAddress, notes = '', razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
    if (!isAuthenticated) {
      throw new Error('Please login to checkout your order.');
    }
    const res = await ApiClient.post('/user/orders/checkout', {
      paymentMethod,
      deliveryAddress,
      notes,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      // Pass client cart as fallback in case server cart is empty
      clientItems: (cart.items || []).map((i) => ({
        productId: i.productId || i._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        category: i.category,
        deliveryPrice: i.deliveryPrice,
      })),
      clientTotal: cart.subtotal || 0,
      clientDeliveryFee: cart.deliveryFee || 0,
      clientDiscount: cart.discount || 0,
    });
    if (res.success) {
      await fetchCart();
      return res.data;
    }
    throw new Error(res.message || 'Checkout failed.');
  };

  const totalItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItemCount,
        loading,
        cartOpen,
        setCartOpen,
        toastMessage,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        createRazorpayOrder,
        checkout,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
