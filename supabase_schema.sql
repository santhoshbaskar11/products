-- SQL script to create the missing custom_grooming_orders table in Supabase
-- Run this script in the SQL Editor of your Supabase Dashboard (https://supabase.com/)

CREATE TABLE IF NOT EXISTS public.custom_grooming_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  product_type text NOT NULL,
  brand text NOT NULL,
  fragrance text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  gift_packaging boolean NOT NULL DEFAULT false,
  custom_note text,
  estimated_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'Processing',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.custom_grooming_orders ENABLE ROW LEVEL SECURITY;

-- Enable public select, insert, update, and delete access policies
CREATE POLICY "Allow public select" ON public.custom_grooming_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.custom_grooming_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.custom_grooming_orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.custom_grooming_orders FOR DELETE USING (true);
