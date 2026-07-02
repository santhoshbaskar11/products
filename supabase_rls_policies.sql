-- SQL Script to create tables (if missing), enable Row Level Security (RLS) and configure policies
-- Run this script in the SQL Editor of your Supabase Dashboard (https://supabase.com/)

--------------------------------------------------------------------------------
-- 1. Create Missing Tables (if they do not already exist)
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text,
  email text UNIQUE,
  phone text,
  address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.custom_grooming_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE,
  product_type text NOT NULL,
  brand text NOT NULL,
  fragrance text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  gift_packaging boolean NOT NULL DEFAULT false,
  custom_note text,
  estimated_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'Processing',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.offers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  discount_percent integer NOT NULL,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

--------------------------------------------------------------------------------
-- 2. Ensure user_id column exists on all tables and references auth.users(id)
--------------------------------------------------------------------------------

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.custom_grooming_orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.cart ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.wishlist ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

--------------------------------------------------------------------------------
-- 3. Enable Row Level Security (RLS) on all tables
--------------------------------------------------------------------------------

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_grooming_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- 4. Configure Policies
--------------------------------------------------------------------------------

-- Helper expression for admin emails:
-- auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com'

-- PRODUCTS (Public Select, Protected Write)
DROP POLICY IF EXISTS "Allow user select on products" ON public.products;
DROP POLICY IF EXISTS "Allow public select on products" ON public.products;
DROP POLICY IF EXISTS "Allow user insert on products" ON public.products;
DROP POLICY IF EXISTS "Allow user update on products" ON public.products;
DROP POLICY IF EXISTS "Allow user delete on products" ON public.products;

CREATE POLICY "Allow public select on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow user insert on products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');
CREATE POLICY "Allow user update on products" ON public.products FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com') WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');
CREATE POLICY "Allow user delete on products" ON public.products FOR DELETE USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');

-- OFFERS (Public Select, Protected Write)
DROP POLICY IF EXISTS "Allow user select on offers" ON public.offers;
DROP POLICY IF EXISTS "Allow public select on offers" ON public.offers;
DROP POLICY IF EXISTS "Allow user insert on offers" ON public.offers;
DROP POLICY IF EXISTS "Allow user update on offers" ON public.offers;
DROP POLICY IF EXISTS "Allow user delete on offers" ON public.offers;

CREATE POLICY "Allow public select on offers" ON public.offers FOR SELECT USING (true);
CREATE POLICY "Allow user insert on offers" ON public.offers FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');
CREATE POLICY "Allow user update on offers" ON public.offers FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com') WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');
CREATE POLICY "Allow user delete on offers" ON public.offers FOR DELETE USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');

-- REVIEWS (Public Select, Protected Write)
DROP POLICY IF EXISTS "Allow user select on reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow public select on reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow user insert on reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow user update on reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow user delete on reviews" ON public.reviews;

CREATE POLICY "Allow public select on reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow user insert on reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');
CREATE POLICY "Allow user update on reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com') WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');
CREATE POLICY "Allow user delete on reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');

-- CUSTOMERS
DROP POLICY IF EXISTS "Allow user select on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow user insert on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow user update on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow user delete on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated customers CRUD" ON public.customers;
DROP POLICY IF EXISTS "Allow anonymous customers CRUD" ON public.customers;

CREATE POLICY "Allow authenticated customers CRUD" ON public.customers
  FOR ALL TO authenticated
  USING (auth.uid() = id OR auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com')
  WITH CHECK (auth.uid() = id OR auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');

CREATE POLICY "Allow anonymous customers CRUD" ON public.customers
  FOR ALL TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- CART
DROP POLICY IF EXISTS "Allow user select on cart" ON public.cart;
DROP POLICY IF EXISTS "Allow user insert on cart" ON public.cart;
DROP POLICY IF EXISTS "Allow user update on cart" ON public.cart;
DROP POLICY IF EXISTS "Allow user delete on cart" ON public.cart;
DROP POLICY IF EXISTS "Allow authenticated cart CRUD" ON public.cart;
DROP POLICY IF EXISTS "Allow anonymous cart CRUD" ON public.cart;

CREATE POLICY "Allow authenticated cart CRUD" ON public.cart
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com')
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');

CREATE POLICY "Allow anonymous cart CRUD" ON public.cart
  FOR ALL TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- WISHLIST
DROP POLICY IF EXISTS "Allow user select on wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Allow user insert on wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Allow user update on wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Allow user delete on wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Allow authenticated wishlist CRUD" ON public.wishlist;
DROP POLICY IF EXISTS "Allow anonymous wishlist CRUD" ON public.wishlist;

CREATE POLICY "Allow authenticated wishlist CRUD" ON public.wishlist
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com')
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');

CREATE POLICY "Allow anonymous wishlist CRUD" ON public.wishlist
  FOR ALL TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- ORDERS
DROP POLICY IF EXISTS "Allow user select on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow user insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow user update on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow user delete on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated orders CRUD" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous orders CRUD" ON public.orders;

CREATE POLICY "Allow authenticated orders CRUD" ON public.orders
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com')
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');

CREATE POLICY "Allow anonymous orders CRUD" ON public.orders
  FOR ALL TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- ORDER_ITEMS
DROP POLICY IF EXISTS "Allow user select on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow user insert on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow user update on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow user delete on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow authenticated order_items CRUD" ON public.order_items;
DROP POLICY IF EXISTS "Allow anonymous order_items CRUD" ON public.order_items;

CREATE POLICY "Allow authenticated order_items CRUD" ON public.order_items
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com')
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');

CREATE POLICY "Allow anonymous order_items CRUD" ON public.order_items
  FOR ALL TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- CONTACT_MESSAGES
DROP POLICY IF EXISTS "Allow user select on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow user insert on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow user update on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow user delete on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated contact_messages CRUD" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow anonymous contact_messages CRUD" ON public.contact_messages;

CREATE POLICY "Allow authenticated contact_messages CRUD" ON public.contact_messages
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com')
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');

CREATE POLICY "Allow anonymous contact_messages CRUD" ON public.contact_messages
  FOR ALL TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- CUSTOM_GROOMING_ORDERS
DROP POLICY IF EXISTS "Allow user select on custom_grooming_orders" ON public.custom_grooming_orders;
DROP POLICY IF EXISTS "Allow user insert on custom_grooming_orders" ON public.custom_grooming_orders;
DROP POLICY IF EXISTS "Allow user update on custom_grooming_orders" ON public.custom_grooming_orders;
DROP POLICY IF EXISTS "Allow user delete on custom_grooming_orders" ON public.custom_grooming_orders;
DROP POLICY IF EXISTS "Allow authenticated custom_grooming_orders CRUD" ON public.custom_grooming_orders;
DROP POLICY IF EXISTS "Allow anonymous custom_grooming_orders CRUD" ON public.custom_grooming_orders;

CREATE POLICY "Allow authenticated custom_grooming_orders CRUD" ON public.custom_grooming_orders
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com')
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'seed-admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin@sovereign.com' OR auth.jwt() ->> 'email' = 'admin-seed@example.com');

CREATE POLICY "Allow anonymous custom_grooming_orders CRUD" ON public.custom_grooming_orders
  FOR ALL TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);
