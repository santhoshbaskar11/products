import React, { useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { supabase } from './supabaseClient';

// Pages
import CustomGrooming from './pages/CustomGrooming';
import BeardCare from './pages/BeardCare';
import HairCare from './pages/HairCare';
import Skincare from './pages/Skincare';

import ReviewsPage from './pages/ReviewsPage';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Login from './pages/Login';

// Admin Subpages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminMessages from './pages/admin/AdminMessages';
import AdminCustomOrders from './pages/admin/AdminCustomOrders';

// 404 Page
const NotFound = () => (
  <div className="py-36 bg-[#08080a] min-h-screen flex items-center justify-center text-center">
    <div className="space-y-6 max-w-md px-4">
      <span className="text-6xl block">⚠️</span>
      <h2 className="text-4xl font-bold font-serif text-white tracking-wide">Page Not Found</h2>
      <p className="text-sm text-zinc-400 font-light leading-relaxed">
        The premium page or resource you are looking for has been moved, removed, or is temporarily offline.
      </p>
      <Link
        to="/"
        className="inline-block rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:scale-105"
      >
        Return to Flagship Home
      </Link>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      console.log('Supabase products data:', data);
      if (error) {
        console.error('Supabase products error:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#08080a] text-[#f3f4f6] font-sans antialiased overflow-x-hidden selection:bg-[#C9A84C] selection:text-black flex flex-col justify-between">
      <div>
        {/* Global Navigation */}
        <Navbar />

        {/* Page Routes */}
        <Routes>
          {/* Public Shop Routes */}
          <Route path="/" element={<Navigate to="/custom-grooming" replace />} />
          <Route path="/beard-care" element={<BeardCare />} />
          <Route path="/hair-care" element={<HairCare />} />
          <Route path="/skincare" element={<Skincare />} />

          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/custom-grooming" element={<CustomGrooming />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="custom-orders" element={<AdminCustomOrders />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;
