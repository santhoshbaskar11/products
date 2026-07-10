/**
 * src/services/razorpayService.js
 * ───────────────────────────────
 * Reusable Razorpay payment service.
 *
 * Key fixes vs previous version:
 *  1. Passes amount_rupees + amount_paise + customer details to /api/payment/verify
 *  2. Returns full verified payload (including amount) to onSuccess callback
 *  3. Validates amount before creating an order
 *  4. Logs every step clearly in the browser console
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-grooming-1.onrender.com';

// ── Load Razorpay CDN script ───────────────────────────────────
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script    = document.createElement('script');
    script.src      = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async    = true;
    script.onload   = () => resolve(true);
    script.onerror  = () => {
      console.error('❌ Failed to load Razorpay checkout.js');
      resolve(false);
    };
    document.body.appendChild(script);
  });

/**
 * initiateRazorpayPayment
 *
 * @param {Object} params
 * @param {number}   params.amount          - Amount in ₹ (e.g. 499.00)
 * @param {string}   [params.currency]      - 'INR' (default)
 * @param {string}   [params.receipt]       - Receipt identifier
 * @param {string}   [params.customerName]  - Pre-fill name in checkout
 * @param {string}   [params.customerEmail] - Pre-fill email in checkout
 * @param {string}   [params.customerPhone] - Pre-fill phone in checkout
 * @param {Array}    [params.cartItems]     - Cart items for DB storage
 * @param {Function} params.onSuccess       - Called with full verified payload
 * @param {Function} params.onFailure       - Called with Error
 */
export const initiateRazorpayPayment = async ({
  amount,
  currency      = 'INR',
  receipt       = `rcpt_${Date.now()}`,
  customerName  = '',
  customerEmail = '',
  customerPhone = '',
  cartItems     = [],
  onSuccess,
  onFailure,
}) => {

  // ── Guard: validate amount before anything ──────────────────
  if (amount === undefined || amount === null || isNaN(amount) || Number(amount) <= 0) {
    const err = new Error(`Invalid payment amount: "${amount}". Amount must be a positive number in ₹.`);
    console.error('❌', err.message);
    if (onFailure) onFailure(err);
    return;
  }

  const amountRupees = Number(amount);
  console.log(`💳 Initiating payment of ₹${amountRupees.toFixed(2)} for ${customerName || 'customer'}`);

  // ── Step 1: Load Razorpay script ────────────────────────────
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    const err = new Error('Razorpay SDK failed to load. Check your internet connection.');
    if (onFailure) onFailure(err);
    return;
  }

  // ── Step 2: Create order on backend ─────────────────────────
  let orderData;
  try {
    console.log(`📤 Sending create-order → ₹${amountRupees}`);
    const response = await fetch(`${API_URL}/api/payment/create-order`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ amount: amountRupees, currency, receipt }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || `HTTP ${response.status}`);
    }

    orderData = await response.json();
    console.log('📦 Order created:', {
      order_id:      orderData.order_id,
      amount_rupees: orderData.amount_rupees,
      amount_paise:  orderData.amount,
      currency:      orderData.currency,
    });

  } catch (error) {
    console.error('❌ create-order failed:', error.message);
    if (onFailure) onFailure(error);
    return;
  }

  // ── Step 3: Open Razorpay checkout modal ────────────────────
  const options = {
    key:         orderData.key_id,
    amount:      orderData.amount,     // paise — required by Razorpay
    currency:    orderData.currency,
    name:        'Sovereign Grooming',
    description: "Premium Men's Grooming Products",
    order_id:    orderData.order_id,
    prefill: {
      name:    customerName,
      email:   customerEmail,
      contact: customerPhone,
    },
    theme: { color: '#C9A84C' },

    // ── ✅ Payment success: verify on backend ─────────────────
    handler: async (rzpResponse) => {
      // rzpResponse = { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      console.log('🔐 Verifying payment signature…', {
        payment_id: rzpResponse.razorpay_payment_id,
        order_id:   rzpResponse.razorpay_order_id,
      });

      try {
        const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id:   rzpResponse.razorpay_order_id,
            razorpay_payment_id: rzpResponse.razorpay_payment_id,
            razorpay_signature:  rzpResponse.razorpay_signature,
            // ── Pass amount so backend can log & return it ──────
            amount_rupees:  orderData.amount_rupees,   // ₹ e.g. 499
            amount_paise:   orderData.amount,          // paise e.g. 49900
            currency:       orderData.currency,
            customer_name:  customerName,
            customer_email: customerEmail,
          }),
        });

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
          throw new Error(verifyData.message || 'Payment verification failed.');
        }

        // ── Build complete payload for frontend to save to DB ──
        const successPayload = {
          // Razorpay IDs
          razorpay_payment_id: rzpResponse.razorpay_payment_id,
          razorpay_order_id:   rzpResponse.razorpay_order_id,
          razorpay_signature:  rzpResponse.razorpay_signature,
          // Verified amounts
          amount_rupees:  verifyData.amount_rupees,  // ₹
          amount_paise:   verifyData.amount_paise,   // paise
          currency:       verifyData.currency,
          // Customer
          customer_name:  verifyData.customer_name,
          customer_email: verifyData.customer_email,
          // Status
          payment_status: 'Paid',
          payment_method: 'Razorpay',
          verified:       true,
          verified_at:    verifyData.verified_at,
          // Cart snapshot for DB insert
          cartItems,
        };

        console.log('✅ Payment verified successfully:', {
          payment_id:    successPayload.razorpay_payment_id,
          order_id:      successPayload.razorpay_order_id,
          amount_rupees: successPayload.amount_rupees,
          currency:      successPayload.currency,
        });

        if (onSuccess) onSuccess(successPayload);

      } catch (verifyError) {
        console.error('❌ Payment verification error:', verifyError.message);
        if (onFailure) onFailure(verifyError);
      }
    },

    modal: {
      ondismiss: () => {
        console.warn('⚠️  Razorpay checkout closed by user.');
        if (onFailure) onFailure(new Error('Payment cancelled by user.'));
      },
    },
  };

  const rzp = new window.Razorpay(options);

  rzp.on('payment.failed', (response) => {
    const desc = response?.error?.description || 'Payment failed.';
    console.error('❌ Razorpay payment.failed event:', response?.error);
    if (onFailure) onFailure(new Error(desc));
  });

  rzp.open();
};
