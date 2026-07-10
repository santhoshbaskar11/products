/**
 * src/components/PayNowButton.jsx
 * ─────────────────────────────────
 * Reusable "Pay Now" button component.
 * Wraps initiateRazorpayPayment and manages local loading/error state.
 *
 * Props:
 *   amount        {number}   - Amount in ₹
 *   customerName  {string}   - User's full name (pre-fills checkout)
 *   customerEmail {string}   - User's email  (pre-fills checkout)
 *   customerPhone {string}   - User's phone  (pre-fills checkout)
 *   onSuccess     {Function} - Called with payment data on success
 *   onFailure     {Function} - Called with error on failure
 *   disabled      {boolean}  - Disable the button (e.g. empty cart)
 *   className     {string}   - Extra Tailwind classes for the host page
 *
 * Usage:
 *   <PayNowButton
 *     amount={total}
 *     customerName={user?.user_metadata?.full_name}
 *     customerEmail={user?.email}
 *     onSuccess={(data) => console.log('Paid!', data)}
 *     onFailure={(err) => console.error('Failed', err)}
 *   />
 */

import React, { useState } from 'react';
import { initiateRazorpayPayment } from '../services/razorpayService';

const PayNowButton = ({
  amount,
  customerName  = '',
  customerEmail = '',
  customerPhone = '',
  cartItems     = [],  // cart snapshot for DB storage
  onSuccess,
  onFailure,
  disabled  = false,
  className = '',
}) => {
  const [loading, setLoading]   = useState(false);
  const [status,  setStatus]    = useState(null); // 'success' | 'error' | null

  const handlePay = async () => {
    if (!amount || amount <= 0) return;

    setLoading(true);
    setStatus(null);

    await initiateRazorpayPayment({
      amount,
      customerName,
      customerEmail,
      customerPhone,
      cartItems,

      onSuccess: (data) => {
        setLoading(false);
        setStatus('success');
        console.log('✅ Payment successful:', data);
        if (onSuccess) onSuccess(data);
      },

      onFailure: (error) => {
        setLoading(false);
        setStatus('error');
        console.error('❌ Payment failed:', error.message);
        if (onFailure) onFailure(error);
        // Auto-reset error state after 4 seconds
        setTimeout(() => setStatus(null), 4000);
      },
    });
  };

  // ── Derived UI state ─────────────────────────────────────────
  const isDisabled = disabled || loading || !amount || amount <= 0;

  const buttonText = () => {
    if (loading)              return '⏳ Opening Payment...';
    if (status === 'success') return '✅ Payment Successful!';
    if (status === 'error')   return '❌ Payment Failed — Retry';
    return `Pay ₹${Number(amount).toFixed(2)}`;
  };

  const buttonColor = () => {
    if (status === 'success') return 'bg-green-600 hover:bg-green-500';
    if (status === 'error')   return 'bg-red-600 hover:bg-red-500';
    return 'bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] hover:shadow-[0_0_20px_rgba(201,168,76,0.4)]';
  };

  const textColor = () => {
    if (status === 'success' || status === 'error') return 'text-white';
    return 'text-black';
  };

  return (
    <button
      id="razorpay-pay-now-btn"
      onClick={handlePay}
      disabled={isDisabled}
      className={`
        flex w-full items-center justify-center gap-2
        rounded-xl py-4 text-xs font-bold uppercase tracking-wider
        transition-all duration-300 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${buttonColor()} ${textColor()} ${className}
      `}
    >
      {/* Razorpay logo icon */}
      {!loading && !status && (
        <svg width="16" height="16" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path d="M20 0L0 34.6h14.5L20 25l5.5 9.6H40L20 0z" fill="currentColor" />
        </svg>
      )}
      {buttonText()}
    </button>
  );
};

export default PayNowButton;
