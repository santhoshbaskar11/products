-- SQL Script to enable Row Level Security (RLS) and configure policies for all tables
-- Run this script in the SQL Editor of your Supabase Dashboard (https://supabase.com/)

-- list of tables:
-- 1. products
-- 2. customers
-- 3. reviews
-- 4. orders
-- 5. order_items
-- 6. contact_messages
-- 7. custom_grooming_orders
-- 8. offers
-- 9. cart
-- 10. wishlist

--------------------------------------------------------------------------------
-- 1. Ensure user_id column exists on all tables and references auth.users(id)
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
-- 2. Enable Row Level Security (RLS) on all tables
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
-- 3. Configure Policies
-- Each user can only select, insert, update, or delete their own records where
-- user_id matches their authenticated auth.uid().
--------------------------------------------------------------------------------

-- Helper Macro to safely drop and recreate policies
-- PRODUCTS
DROP POLICY IF EXISTS "Allow user select on products" ON public.products;
DROP POLICY IF EXISTS "Allow user insert on products" ON public.products;
DROP POLICY IF EXISTS "Allow user update on products" ON public.products;
DROP POLICY IF EXISTS "Allow user delete on products" ON public.products;

CREATE POLICY "Allow user select on products" ON public.products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update on products" ON public.products FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user delete on products" ON public.products FOR DELETE USING (auth.uid() = user_id);

-- CUSTOMERS
DROP POLICY IF EXISTS "Allow user select on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow user insert on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow user update on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow user delete on customers" ON public.customers;

CREATE POLICY "Allow user select on customers" ON public.customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on customers" ON public.customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update on customers" ON public.customers FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user delete on customers" ON public.customers FOR DELETE USING (auth.uid() = user_id);

-- REVIEWS
DROP POLICY IF EXISTS "Allow user select on reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow user insert on reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow user update on reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow user delete on reviews" ON public.reviews;

CREATE POLICY "Allow user select on reviews" ON public.reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update on reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user delete on reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- ORDERS
DROP POLICY IF EXISTS "Allow user select on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow user insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow user update on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow user delete on orders" ON public.orders;

CREATE POLICY "Allow user select on orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update on orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user delete on orders" ON public.orders FOR DELETE USING (auth.uid() = user_id);

-- ORDER_ITEMS
DROP POLICY IF EXISTS "Allow user select on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow user insert on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow user update on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow user delete on order_items" ON public.order_items;

CREATE POLICY "Allow user select on order_items" ON public.order_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on order_items" ON public.order_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update on order_items" ON public.order_items FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user delete on order_items" ON public.order_items FOR DELETE USING (auth.uid() = user_id);

-- CONTACT_MESSAGES
DROP POLICY IF EXISTS "Allow user select on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow user insert on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow user update on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow user delete on contact_messages" ON public.contact_messages;

CREATE POLICY "Allow user select on contact_messages" ON public.contact_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update on contact_messages" ON public.contact_messages FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user delete on contact_messages" ON public.contact_messages FOR DELETE USING (auth.uid() = user_id);

-- CUSTOM_GROOMING_ORDERS
DROP POLICY IF EXISTS "Allow user select on custom_grooming_orders" ON public.custom_grooming_orders;
DROP POLICY IF EXISTS "Allow user insert on custom_grooming_orders" ON public.custom_grooming_orders;
DROP POLICY IF EXISTS "Allow user update on custom_grooming_orders" ON public.custom_grooming_orders;
DROP POLICY IF EXISTS "Allow user delete on custom_grooming_orders" ON public.custom_grooming_orders;

CREATE POLICY "Allow user select on custom_grooming_orders" ON public.custom_grooming_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on custom_grooming_orders" ON public.custom_grooming_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update on custom_grooming_orders" ON public.custom_grooming_orders FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user delete on custom_grooming_orders" ON public.custom_grooming_orders FOR DELETE USING (auth.uid() = user_id);

-- OFFERS
DROP POLICY IF EXISTS "Allow user select on offers" ON public.offers;
DROP POLICY IF EXISTS "Allow user insert on offers" ON public.offers;
DROP POLICY IF EXISTS "Allow user update on offers" ON public.offers;
DROP POLICY IF EXISTS "Allow user delete on offers" ON public.offers;

CREATE POLICY "Allow user select on offers" ON public.offers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on offers" ON public.offers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update on offers" ON public.offers FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user delete on offers" ON public.offers FOR DELETE USING (auth.uid() = user_id);

-- CART
DROP POLICY IF EXISTS "Allow user select on cart" ON public.cart;
DROP POLICY IF EXISTS "Allow user insert on cart" ON public.cart;
DROP POLICY IF EXISTS "Allow user update on cart" ON public.cart;
DROP POLICY IF EXISTS "Allow user delete on cart" ON public.cart;

CREATE POLICY "Allow user select on cart" ON public.cart FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on cart" ON public.cart FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update on cart" ON public.cart FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user delete on cart" ON public.cart FOR DELETE USING (auth.uid() = user_id);

-- WISHLIST
DROP POLICY IF EXISTS "Allow user select on wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Allow user insert on wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Allow user update on wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Allow user delete on wishlist" ON public.wishlist;

CREATE POLICY "Allow user select on wishlist" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert on wishlist" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update on wishlist" ON public.wishlist FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user delete on wishlist" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);
