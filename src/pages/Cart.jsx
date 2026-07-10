import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import SectionHeader from '../components/ui/SectionHeader';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Gift, Sparkles, CheckCircle2 } from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import PayNowButton from '../components/PayNowButton';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart, createOrderFromCart } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setShowCheckoutModal(true);
      
      const guestId = localStorage.getItem('sovereign_guest_customer_id') || Math.floor(Math.random() * 1000000).toString();
      const email = user?.email || `guest-${guestId.slice(0, 8)}@sovereign.com`;
      const name = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Guest Customer');
      
      createOrderFromCart(name, email);
    }, 1500);
  };

  // ── Razorpay payment handlers ─────────────────────────────────
  const handleCreateOrder = async () => {
    const guestId = localStorage.getItem('sovereign_guest_customer_id') || Math.floor(Math.random() * 1000000).toString();
    const email = user?.email || `guest-${guestId.slice(0, 8)}@sovereign.com`;
    const name  = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Guest Customer');
    
    // Call createOrderFromCart and get the created dbOrderId
    const dbOrderId = await createOrderFromCart(name, email);
    return dbOrderId;
  };

  const handlePaymentSuccess = (paymentData) => {
    // Show success modal immediately
    setShowCheckoutModal(true);

    // Log full verified payment details to browser console
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Razorpay Payment Success');
    console.log('   Payment ID   :', paymentData.razorpay_payment_id);
    console.log('   Order ID     :', paymentData.order_id);
    console.log('   Amount Paid  : ₹' + (paymentData.amount_rupees?.toFixed(2) ?? 'MISSING'));
    console.log('   Currency     :', paymentData.currency);
    console.log('   Customer     :', paymentData.customer_name, '|', paymentData.customer_email);
    console.log('   Status       :', paymentData.payment_status);
    console.log('   Verified At  :', paymentData.verified_at);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  };

  const handlePaymentFailure = (error) => {
    // Don't show modal — let user retry
    console.error('❌ Razorpay payment failed:', error.message);
  };

  return (
    <div className="py-28 bg-[#08080a] min-h-screen relative overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute bottom-20 left-[-10%] w-[400px] h-[400px] rounded-full bg-[#E8C97E]/3 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="Checkout Summary"
          title="Shopping Cart"
          subtitle="Confirm your selections and proceed to checkout. Standard shipping is free on all orders exceeding $50."
        />

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => {
                const { product, quantity } = item;
                const itemTotal = product.price * quantity;
                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-zinc-900/35 border border-white/5 rounded-3xl p-5 md:p-6 backdrop-blur-md hover:border-zinc-800 transition-all duration-300"
                  >
                    {/* Image & Title group */}
                    <div className="flex items-center gap-4 w-full sm:w-auto text-left">
                      <div className="h-16 w-16 rounded-xl bg-zinc-950 overflow-hidden border border-white/10 shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">{product.name}</h4>
                        <span className="text-[11px] text-[#C9A84C] font-medium uppercase tracking-wider block mt-0.5">{product.category} Care</span>
                        <span className="text-xs text-zinc-400 block mt-1">${product.price.toFixed(2)} each</span>
                      </div>
                    </div>

                    {/* Quantity selectors & item total price */}
                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                      
                      {/* Quantity box */}
                      <div className="flex items-center bg-zinc-950 border border-white/10 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-3 py-2 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-bold text-white min-w-8 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-3 py-2 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Total price & delete */}
                      <div className="flex items-center gap-4 text-right">
                        <span className="text-base font-bold text-white min-w-[70px]">
                          ${itemTotal.toFixed(2)}
                        </span>
                        
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}

              {/* Extra banner detailing rewards */}
              <div className="flex items-center gap-3 bg-zinc-900/10 border border-[#C9A84C]/20 border-dashed rounded-3xl p-5 text-left">
                <Gift className="h-6 w-6 text-[#C9A84C] shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Free Gift Wrap Eligible</h5>
                  <p className="text-[11px] text-zinc-400 font-light mt-0.5">Complementary premium magnetic box packaging will be added to your order automatically at checkout.</p>
                </div>
              </div>
            </div>

            {/* Order Summary Checkout Card (4 Cols) */}
            <div className="lg:col-span-4 bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 text-left shadow-2xl relative">
              <h3 className="text-lg font-bold text-white font-serif border-b border-white/5 pb-3">Order Summary</h3>
              
              <div className="py-6 space-y-3.5 border-b border-white/5">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Standard Delivery</span>
                  <span className="font-semibold text-white">
                    {shipping === 0 ? <strong className="text-green-500 font-bold uppercase">Free</strong> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-[10px] text-zinc-500 font-light italic">
                    Spend ${ (50 - subtotal).toFixed(2) } more to unlock free shipping!
                  </p>
                )}
              </div>

              <div className="py-6 flex justify-between items-center">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Grand Total</span>
                <span className="text-2xl font-extrabold text-[#C9A84C] font-serif">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3.5">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] py-4 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] disabled:opacity-50 cursor-pointer"
                >
                  {isCheckingOut ? (
                    'Processing Order...'
                  ) : (
                    <>
                      Proceed To Checkout
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* ── Razorpay Pay Now Button ── */}
                <PayNowButton
                  amount={total}
                  customerName={user?.user_metadata?.full_name || ''}
                  customerEmail={user?.email || ''}
                  cartItems={cart}
                  onCreateOrder={handleCreateOrder}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                  disabled={cart.length === 0}
                />


                <Link
                  to="/beard-care"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        ) : (
          /* Empty cart page styling */
          <div className="text-center py-20 bg-zinc-900/10 border border-white/5 rounded-3xl backdrop-blur-md max-w-xl mx-auto space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#C9A84C]/5 border border-[#C9A84C]/15 flex items-center justify-center text-[#C9A84C]">
              <ShoppingBag className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-serif">Your Bag is Empty</h3>
              <p className="text-sm text-zinc-400 font-light max-w-xs mx-auto leading-relaxed">
                You haven't added any products to your shopping bag yet. Upgrade your styling routine today.
              </p>
            </div>

            <Link
              to="/beard-care"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-105"
            >
              Shop Collections
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

      </div>

      {/* Mock Checkout Modal Success Popup */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 max-w-md text-center space-y-6 shadow-2xl relative">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-500/20 border border-green-500/35 flex items-center justify-center text-green-500 shadow-lg">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-serif">Order Successfully Placed!</h3>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold text-[#C9A84C]">Order: SOV-{Math.floor(100000 + Math.random() * 900000)}</p>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Thank you! Your payment was verified, and our warehouse has started preparing your premium grooming items. Check your inbox for tracking details.
              </p>
            </div>

            <button
              onClick={() => setShowCheckoutModal(false)}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] py-3 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110 cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Cart;
