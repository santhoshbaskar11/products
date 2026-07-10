/**
 * src/services/razorpayService.js
 * ───────────────────────────────
 * Reusable Razorpay payment service for the React frontend.
 *
 * Usage:
 *   import { initiateRazorpayPayment } from '../services/razorpayService';
 *
 *   await initiateRazorpayPayment({
 *     amount:      499,          // amount in ₹ (will be converted to paise on backend)
 *     currency:    'INR',
 *     customerName:  user.name,
 *     customerEmail: user.email,
 *     onSuccess:   (paymentData) => { ... },
 *     onFailure:   (error)       => { ... },
 *   });
 */

// Backend base URL from .env — set to https://backend-grooming-1.onrender.com
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-grooming-1.onrender.com';

/**
 * Dynamically load the Razorpay checkout script.
 * Razorpay must be loaded from their CDN — it cannot be bundled.
 *
 * @returns {Promise<boolean>} true if loaded, false on failure
 */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    // If already loaded, resolve immediately
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload  = () => resolve(true);
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay checkout script.');
      resolve(false);
    };

    document.body.appendChild(script);
  });

/**
 * initiateRazorpayPayment
 * ───────────────────────
 * Main function: creates a Razorpay order on the backend,
 * opens the Razorpay checkout modal, and handles success/failure.
 *
 * @param {Object} params
 * @param {number}   params.amount        - Amount in ₹ (e.g. 499)
 * @param {string}   [params.currency]    - Currency code (default: 'INR')
 * @param {string}   [params.receipt]     - Receipt ID (default: auto-generated)
 * @param {string}   [params.customerName]  - Pre-fill name in checkout
 * @param {string}   [params.customerEmail] - Pre-fill email in checkout
 * @param {string}   [params.customerPhone] - Pre-fill phone in checkout
 * @param {Function} params.onSuccess     - Called with payment data on success
 * @param {Function} params.onFailure     - Called with error on failure
 */
export const initiateRazorpayPayment = async ({
  amount,
  currency    = 'INR',
  receipt     = `receipt_${Date.now()}`,
  customerName  = '',
  customerEmail = '',
  customerPhone = '',
  onSuccess,
  onFailure,
}) => {
  // ── Step 1: Load the Razorpay script ──────────────────────────
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    const err = new Error('Razorpay SDK failed to load. Check your internet connection.');
    if (onFailure) onFailure(err);
    return;
  }

  // ── Step 2: Create an order on the backend ─────────────────────
  let orderData;
  try {
    const response = await fetch(`${API_URL}/api/payment/create-order`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ amount, currency, receipt }),
    });

    if (!response.ok) {
      const errBody = await response.json();
      throw new Error(errBody.message || `HTTP ${response.status}`);
    }

    orderData = await response.json();
  } catch (error) {
    console.error('❌ create-order failed:', error.message);
    if (onFailure) onFailure(error);
    return;
  }

  // ── Step 3: Open the Razorpay checkout modal ───────────────────
  const options = {
    key:      orderData.key_id,     // Public Razorpay key (safe in frontend)
    amount:   orderData.amount,     // In paise
    currency: orderData.currency,
    name:     'Sovereign Grooming',
    description: 'Premium Men\'s Grooming Products',
    order_id: orderData.order_id,

    // Pre-fill customer details if available
    prefill: {
      name:    customerName,
      email:   customerEmail,
      contact: customerPhone,
    },

    // Branding
    theme: { color: '#C9A84C' }, // Gold accent matching the app theme

    // ── ✅ Payment Success Handler ─────────────────────────────
    handler: async (response) => {
      // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
      try {
        // Verify the signature on our backend before confirming success
        const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          console.log('✅ Payment verified:', response.razorpay_payment_id);
          if (onSuccess) onSuccess({ ...response, verified: true });
        } else {
          throw new Error('Payment signature verification failed.');
        }
      } catch (verifyError) {
        console.error('❌ Payment verification error:', verifyError.message);
        if (onFailure) onFailure(verifyError);
      }
    },

    // ── ❌ Payment Failure / Modal Dismissed Handler ─────────────
    modal: {
      ondismiss: () => {
        console.warn('⚠️  Razorpay checkout was closed by the user.');
        if (onFailure) onFailure(new Error('Payment cancelled by user.'));
      },
    },
  };

  // Open the checkout modal
  const rzp = new window.Razorpay(options);

  // Handle payment errors thrown by Razorpay internally
  rzp.on('payment.failed', (response) => {
    console.error('❌ Razorpay payment failed:', response.error);
    if (onFailure) onFailure(new Error(response.error.description || 'Payment failed.'));
  });

  rzp.open();
};
