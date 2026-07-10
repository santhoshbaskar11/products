-- ─────────────────────────────────────────────────────────────────
-- payments table migration (v2)
-- Updates the payments table to support both the previous columns and
-- the new columns required by the backend insert query.
-- Run in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ─────────────────────────────────────────────────────────────────

-- 1. Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.payments (
  id                   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id          uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  order_id             uuid REFERENCES public.orders(id)   ON DELETE SET NULL,
  razorpay_order_id    text,
  razorpay_payment_id  text UNIQUE,
  razorpay_signature   text,
  amount               numeric(10,2) NOT NULL,
  currency             text NOT NULL DEFAULT 'INR',
  payment_method       text NOT NULL DEFAULT 'Razorpay',
  payment_status       text NOT NULL DEFAULT 'Success',
  transaction_date     timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  created_at           timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  updated_at           timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- 2. Add any missing columns to match all requirements
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS payment_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Success',
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- 3. Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 4. Re-create policies to make sure they are correct
DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
CREATE POLICY "payments_select_own"
  ON public.payments FOR SELECT
  USING (customer_id::text = auth.uid()::text OR (customer_email = auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "payments_select_admin" ON public.payments;
CREATE POLICY "payments_select_admin"
  ON public.payments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "payments_insert" ON public.payments;
CREATE POLICY "payments_insert"
  ON public.payments FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "payments_update" ON public.payments;
CREATE POLICY "payments_update"
  ON public.payments FOR UPDATE
  USING (true);
