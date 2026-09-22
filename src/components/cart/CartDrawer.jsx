import React, { useState } from 'react';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  MapPin,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';

export const CartDrawer = ({ isOpen, onClose, onNavigate }) => {
  const { cart, totalItemCount, updateQuantity, removeFromCart, clearCart, createRazorpayOrder, checkout, loading } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('Indiranagar 100ft Road, HAL 2nd Stage, Bangalore');
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      onClose();
      onNavigate?.('login');
      return;
    }

    // 1. If RAZORPAY is selected, create backend order and trigger Razorpay Gateway
    if (paymentMethod === 'RAZORPAY' && window.Razorpay) {
      try {
        setIsCheckingOut(true);
        // Request official Razorpay Gateway Order from Node.js backend
        const gatewayOrder = await createRazorpayOrder();

        const options = {
          key: gatewayOrder.keyId || 'rzp_live_SRwvHvKaQG40S5',
          amount: gatewayOrder.amountInPaise,
          currency: gatewayOrder.currency || 'INR',
          name: 'Local Run Marketplace',
          description: `Order for ${totalItemCount} fresh items (${cart.items.map(i => i.name).slice(0, 2).join(', ')}...)`,
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=128&auto=format&fit=crop&q=80',
          order_id: gatewayOrder.razorpayOrderId,
          prefill: {
            name: user?.name || 'Customer Account',
            email: user?.email || 'customer@marketplace.com',
            contact: '+919876543210',
          },
          theme: {
            color: '#FF7622',
          },
          handler: async function (response) {
            // Payment success callback from Razorpay Gateway Modal
            try {
              const order = await checkout({
                paymentMethod: 'RAZORPAY',
                deliveryAddress: {
                  street: selectedAddress,
                  city: 'Bengaluru',
                },
                razorpayOrderId: response.razorpay_order_id || gatewayOrder.razorpayOrderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                notes: `Razorpay Payment Ref: ${response.razorpay_payment_id}`,
              });
              setOrderSuccess(order);
            } catch (err) {
              alert(err.message || 'Payment verified but order creation failed.');
            } finally {
              setIsCheckingOut(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsCheckingOut(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          alert(`Payment failed: ${resp.error?.description || 'Transaction declined'}`);
          setIsCheckingOut(false);
        });
        rzp.open();
        return;
      } catch (err) {
        console.warn('Razorpay Gateway error, proceeding with standard checkout:', err);
      }
    }

    // Standard fallback checkout for UPI, COD, Wallet or when offline
    try {
      setIsCheckingOut(true);
      const order = await checkout({
        paymentMethod,
        deliveryAddress: {
          street: selectedAddress,
          city: 'Bengaluru',
        },
      });
      setOrderSuccess(order);
    } catch (err) {
      alert(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#FBFBFB]">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF7622] flex items-center justify-center font-black">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-[#181C2E]">Your Shopping Bag</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} • Fast 15-min delivery
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Overlay if just ordered */}
          {orderSuccess ? (
            <div className="p-8 text-center space-y-6 flex-1 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 text-[#FF7622]">
                  ORDER CONFIRMED
                </span>
                <h2 className="text-2xl font-black text-[#181C2E]">
                  Order #{orderSuccess.orderNumber}
                </h2>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your order is confirmed! Delivery partner Rahul Kumar will arrive in ~15 mins.
                </p>
              </div>

              <div className="bg-[#FFF4EC] border border-[#FF7622]/30 rounded-2xl p-4 w-full text-left flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">DOORSTEP OTP</span>
                  <span className="text-xl font-black text-[#FF7622] font-mono tracking-widest">{orderSuccess.deliveryOtp}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">TOTAL AMOUNT</span>
                  <span className="text-base font-black text-[#181C2E]">₹{orderSuccess.totalAmount}</span>
                </div>
              </div>

              <div className="space-y-2.5 w-full pt-4">
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    onClose();
                    onNavigate?.('orders');
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all"
                >
                  Track Order Live
                </button>
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    onClose();
                    onNavigate?.('shop');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Item List or Empty state */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.items.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Cart Products
                      </span>
                      <button 
                        onClick={clearCart}
                        className="text-[11px] text-rose-500 hover:underline font-bold flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear All</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div
                          key={item._id || item.productId}
                          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-orange-200 transition-all flex items-center gap-3.5"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="text-xs font-black text-[#181C2E] truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] font-black text-[#FF7622]">
                              ₹{item.price}{' '}
                              {item.originalPrice > item.price && (
                                <span className="text-[10px] text-slate-400 line-through font-normal ml-1">
                                  ₹{item.originalPrice}
                                </span>
                              )}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2 pt-1">
                              <div className="inline-flex items-center bg-[#F4F6F8] rounded-lg p-0.5 border border-slate-200/60">
                                <button
                                  onClick={() => updateQuantity(item._id || item.productId, item.quantity - 1)}
                                  className="w-6 h-6 rounded-md bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-7 text-center text-xs font-black text-[#181C2E]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item._id || item.productId, item.quantity + 1)}
                                  className="w-6 h-6 rounded-md bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item._id || item.productId)}
                                className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Address selector */}
                    <div className="bg-[#FAFBFD] p-4 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-bold text-[#181C2E]">
                        <MapPin className="w-4 h-4 text-[#FF7622]" />
                        <span>Deliver To</span>
                      </div>
                      <input
                        type="text"
                        value={selectedAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="w-full text-xs bg-white p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF7622] font-medium"
                      />

                      {/* Payment Method Selector */}
                      <div className="pt-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                          Payment Mode
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { key: 'RAZORPAY', label: '💳 Razorpay', badge: 'Fast' },
                            { key: 'UPI', label: '⚡ UPI' },
                            { key: 'COD', label: '💵 COD' },
                            { key: 'WALLET', label: '👛 Wallet' },
                          ].map((method) => (
                            <button
                              key={method.key}
                              type="button"
                              onClick={() => setPaymentMethod(method.key)}
                              className={`py-2 px-1 rounded-xl text-[11px] font-black border transition-all flex flex-col items-center justify-center ${
                                paymentMethod === method.key
                                  ? 'border-[#FF7622] bg-[#FFF4EC] text-[#FF7622] shadow-2xs'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <span>{method.label}</span>
                              {method.badge && (
                                <span className="text-[8px] font-bold text-[#FF7622] uppercase tracking-tighter mt-0.5">
                                  {method.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF7622] flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-[#181C2E]">Your Bag is Empty</h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                        Explore organic vegetables, tender chicken, wild fish & pantry essentials!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate?.('shop');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs shadow-md shadow-orange-500/20 transition-all"
                    >
                      Shop Fresh Foods
                    </button>
                  </div>
                )}
              </div>

              {/* Bill Details & CTA Footer */}
              {cart.items.length > 0 && (
                <div className="p-5 border-t border-slate-100 bg-white space-y-4">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#181C2E]">₹{cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-1">
                        <Truck className="w-3.5 h-3.5 text-[#FF7622]" />
                        <span>Delivery Fee</span>
                      </span>
                      {cart.deliveryFee === 0 ? (
                        <span className="font-black text-emerald-600 uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">
                          FREE
                        </span>
                      ) : (
                        <span className="font-bold text-[#181C2E]">₹{cart.deliveryFee.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm font-black text-[#181C2E] pt-2 border-t border-slate-100">
                      <span>Total Amount</span>
                      <span className="text-base text-[#FF7622]">₹{cart.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {!isAuthenticated ? (
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => {
                        onClose();
                        onNavigate?.('login');
                      }}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <Lock className="w-4 h-4 mr-1.5" />
                      <span>LOG IN TO CHECKOUT • ₹{cart.totalAmount.toFixed(2)}</span>
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="lg"
                      disabled={isCheckingOut}
                      onClick={handleCheckout}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      {isCheckingOut ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <span>PLACE ORDER NOW • ₹{cart.totalAmount.toFixed(2)}</span>
                          <ArrowRight className="w-4 h-4 ml-1.5" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};
