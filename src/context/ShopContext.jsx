import React, { createContext, useState, useEffect, useContext } from 'react';
import { ALL_PRODUCTS, REVIEWS as INITIAL_REVIEWS } from '../data/products';
import { supabase } from '../supabaseClient';
import { AuthContext } from './AuthContext';

export const ShopContext = createContext(null);

// Utility to generate UUIDs locally for guest session tracking
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const ShopContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  // State definitions
  const [products, setProducts] = useState(ALL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);   // ← Razorpay payment records
  const [customers, setCustomers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);


  // Seeding/loading helper
  const [guestCustomerId, setGuestCustomerId] = useState(null);

  const addToast = (text, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const getUserIdPayload = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      return data?.user ? { user_id: data.user.id } : {};
    } catch (e) {
      return {};
    }
  };

  // Helper to ensure customer record exists
  const ensureCustomerRecord = async (id, name, email) => {
    try {
      const { data, error } = await supabase.from('customers').select('id').eq('id', id).limit(1);
      if (error) {
        console.error("ensureCustomerRecord select error:", error.message);
        return;
      }
      if (!data || data.length === 0) {
        // Always include user_id so RLS policy (auth.uid() = user_id) passes
        const userPayload = await getUserIdPayload();
        const insertPayload = {
          id,
          full_name: name,
          email,
          created_at: new Date().toISOString(),
          ...userPayload
        };
        const { error: insertErr } = await supabase.from('customers').insert(insertPayload);
        if (insertErr) console.error("ensureCustomerRecord insert error:", insertErr.message);
      }
    } catch (err) {
      console.error("Error ensuring customer record exists:", err);
    }
  };

  // Helper to get active customer ID
  const getActiveCustomerId = () => {
    return user?.id || guestCustomerId || localStorage.getItem('sovereign_guest_customer_id');
  };

  // 1. Initialize Guest Customer ID and load all tables
  useEffect(() => {
    const initializeDatabase = async () => {
      // Setup Guest Customer ID
      let guestId = localStorage.getItem('sovereign_guest_customer_id');
      if (!guestId) {
        guestId = generateUUID();
        localStorage.setItem('sovereign_guest_customer_id', guestId);
      }
      setGuestCustomerId(guestId);

      // Load products, reviews, and offers (public catalog elements)
      await loadProducts();
      await loadReviews();
      await loadOffers();

      // Ensure customer record exists in DB for either user or guest
      const activeId = user?.id || guestId;
      if (user) {
        await ensureCustomerRecord(user.id, user.user_metadata?.full_name || user.email.split('@')[0], user.email);
      } else {
        await ensureCustomerRecord(guestId, 'Guest Customer', `guest-${guestId.slice(0, 8)}@sovereign.com`);
      }

      // Reset cart/wishlist before loading so data doesn't leak between logouts
      setCart([]);
      setWishlist([]);

      // Load user-specific data
      await loadCustomers();
      await loadOrders();
      await loadPayments();
      await loadContactMessages();
      await loadCustomOrders();
      await loadCartAndWishlist(activeId);

    };

    initializeDatabase();
  }, [user]);

  // Database Load Handlers
  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;

      if (data && data.length > 0) {
        const dbProds = data.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          rating: Number(p.rating),
          reviewsCount: p.reviews_count || 0,
          tag: p.tag,
          category: p.category,
          image: ALL_PRODUCTS.find(ap => ap.id === p.id)?.image || p.image_url,
          image_url: p.image_url
        }));
        
        // Seed any missing products from ALL_PRODUCTS (the new JPEGs)
        const missing = ALL_PRODUCTS.filter(ap => !data.some(dbP => dbP.id === ap.id));
        if (missing.length > 0) {
          const insertPayload = missing.map(ap => ({
            id: ap.id,
            name: ap.name,
            description: ap.description,
            price: ap.price,
            rating: ap.rating,
            reviews_count: ap.reviewsCount,
            tag: ap.tag,
            category: ap.category,
            image_url: ap.id
          }));
          await supabase.from('products').insert(insertPayload);
          
          // Re-fetch all products
          const { data: updatedData } = await supabase.from('products').select('*');
          if (updatedData) {
            setProducts(updatedData.map(p => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: Number(p.price),
              rating: Number(p.rating),
              reviewsCount: p.reviews_count || 0,
              tag: p.tag,
              category: p.category,
              image: ALL_PRODUCTS.find(ap => ap.id === p.id)?.image || p.image_url,
              image_url: p.image_url
            })));
            return;
          }
        }
        setProducts(dbProds);
      } else {
        // Seed entire products catalog
        const insertPayload = ALL_PRODUCTS.map(ap => ({
          id: ap.id,
          name: ap.name,
          description: ap.description,
          price: ap.price,
          rating: ap.rating,
          reviews_count: ap.reviewsCount,
          tag: ap.tag,
          category: ap.category,
          image_url: ap.id
        }));
        await supabase.from('products').insert(insertPayload);
        setProducts(ALL_PRODUCTS);
      }
    } catch (e) {
      console.error("Products load failed, using fallbacks:", e);
      setProducts(ALL_PRODUCTS);
    }
  };

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, customers(full_name, email)')
        .order('created_at', { ascending: false });
      if (error) throw error;

      if (data && data.length > 0) {
        const mapped = data.map(r => ({
          id: r.id,
          name: r.customers?.full_name || 'Anonymous',
          role: 'Verified Buyer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          rating: Number(r.rating || 5),
          title: 'Verified Customer Review',
          comment: r.review || '',
          date: r.created_at?.slice(0, 10),
          approved: true,
          product_id: r.product_id
        }));
        setReviews(mapped);
      } else {
        setReviews(INITIAL_REVIEWS);
      }
    } catch (e) {
      console.error("Reviews load failed, using fallbacks:", e);
      setReviews(INITIAL_REVIEWS);
    }
  };

  const loadCustomers = async () => {
    try {
      // Fetch all customers
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Customers load failed:", error.message);
        return;
      }

      if (data && data.length > 0) {
        // Also fetch orders to compute per-customer stats
        const { data: ordersData } = await supabase
          .from('orders')
          .select('customer_id, total_amount');

        setCustomers(data.map(c => {
          const custOrders = (ordersData || []).filter(o => o.customer_id === c.id);
          const totalSpent = custOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
          return {
            id: c.id,
            name: c.full_name || 'Unknown',
            email: c.email || 'N/A',
            phone: c.phone || 'N/A',
            address: c.address || 'N/A',
            avatar: c.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            joinDate: c.created_at?.slice(0, 10) || 'N/A',
            ordersCount: custOrders.length,
            totalSpent,
            tier: totalSpent > 200 ? 'Sovereign VIP' : totalSpent > 50 ? 'Pro Barber' : 'Standard'
          };
        }));
      } else {
        setCustomers([]);
      }
    } catch (e) {
      console.error("Customers load failed:", e);
    }
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, customer_id, total_amount, payment_status, order_status,
          payment_method, razorpay_payment_id, razorpay_order_id, created_at,
          customers ( id, full_name, email, phone ),
          order_items ( id, product_id, quantity, price )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders load failed:', error.message, error.details, error.hint);
        return;
      }

      if (data && data.length > 0) {
        const mapped = data.map(o => ({
          id: o.id,
          customerId: o.customer_id,
          customer: o.customers?.full_name || 'Guest Customer',
          email: o.customers?.email || 'N/A',
          phone: o.customers?.phone || 'N/A',
          date: o.created_at?.slice(0, 10),
          amount: Number(o.total_amount || 0),
          status: o.order_status || 'Processing',
          paymentStatus: o.payment_status || 'Pending',
          paymentMethod: o.payment_method || 'N/A',
          razorpayPaymentId: o.razorpay_payment_id || null,
          razorpayOrderId:   o.razorpay_order_id   || null,
          items: (o.order_items || []).map(item => ({
            product: { id: item.product_id, price: Number(item.price || 0) },
            quantity: item.quantity
          }))
        }));
        setOrders(mapped);
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.error('Orders load failed:', e);
    }
  };

  // ── Load all payments from Supabase ──────────────────────────────
  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id, customer_id, order_id, razorpay_order_id, razorpay_payment_id,
          razorpay_signature, amount, currency, payment_method, payment_status,
          transaction_date, created_at, updated_at,
          customers ( id, full_name, email )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Payments load failed:', error.message);
        return;
      }

      if (data && data.length > 0) {
        setPayments(data.map(p => ({
          id:                  p.id,
          customerId:          p.customer_id,
          orderId:             p.order_id,
          razorpayOrderId:     p.razorpay_order_id,
          razorpayPaymentId:   p.razorpay_payment_id,
          razorpaySignature:   p.razorpay_signature,
          amount:              Number(p.amount || 0),
          currency:            p.currency,
          paymentMethod:       p.payment_method,
          paymentStatus:       p.payment_status,
          customerName:        p.customers?.full_name || 'Guest',
          customerEmail:       p.customers?.email     || 'N/A',
          transactionDate:     p.transaction_date,
          createdAt:           p.created_at,
          updatedAt:           p.updated_at,
        })));
      } else {
        setPayments([]);
      }
    } catch (e) {
      console.error('Payments load failed:', e);
    }
  };


  const loadContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      if (data && data.length > 0) {
        setContactMessages(data.map(m => ({
          id: m.id,
          name: m.name || 'Anonymous',
          email: m.email || 'N/A',
          message: m.message || '',
          unread: false,
          date: m.created_at?.slice(0, 10)
        })));
      }
    } catch (e) {
      console.error("Messages load failed:", e);
    }
  };

  const loadCustomOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_grooming_orders')
        .select('*, customers(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;

      if (data && data.length > 0) {
        const mapped = data.map(o => ({
          id: o.id,
          customer: o.customers?.full_name || 'Guest Customer',
          email: o.customers?.email || 'N/A',
          category: o.product_type,
          brand: o.brand,
          fragrance: o.fragrance,
          packaging: o.gift_packaging,
          notes: o.custom_note || '',
          price: Number(o.estimated_price || 0),
          quantity: o.quantity || 1,
          status: o.status || 'Processing',
          date: o.created_at?.slice(0, 10),
          image: ALL_PRODUCTS.find(p => p.category === o.product_type)?.image
        }));
        setCustomOrders(mapped);
      }
    } catch (e) {
      console.error("Custom orders load failed:", e);
    }
  };

  const loadOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      if (data && data.length > 0) {
        const mapped = data.map(o => ({
          id: o.id,
          code: o.code,
          discountPercent: Number(o.discount_percent || 0),
          active: o.active !== undefined ? o.active : true,
          expiresAt: o.expires_at || '',
          createdAt: o.created_at?.slice(0, 10)
        }));
        setOffers(mapped);
      } else {
        setOffers([
          {
            id: 'off-demo-1',
            code: 'SOVEREIGN20',
            discountPercent: 20,
            active: true,
            expiresAt: '2026-12-31',
            createdAt: '2026-07-01'
          }
        ]);
      }
    } catch (e) {
      console.error("Offers load failed, using local mock:", e);
      setOffers([
        {
          id: 'off-demo-1',
          code: 'SOVEREIGN20',
          discountPercent: 20,
          active: true,
          expiresAt: '2026-12-31',
          createdAt: '2026-07-01'
        }
      ]);
    }
  };

  const loadCartAndWishlist = async (custId) => {
    try {
      // Cart
      const { data: cartData } = await supabase.from('cart').select('*').eq('customer_id', custId);
      if (cartData && cartData.length > 0) {
        const mappedCart = cartData.map(item => {
          const prod = ALL_PRODUCTS.find(p => p.id === item.product_id);
          return {
            product: prod || { id: item.product_id, name: 'Grooming Product', price: 0 },
            quantity: item.quantity
          };
        });
        setCart(mappedCart);
      }

      // Wishlist
      const { data: wishData } = await supabase.from('wishlist').select('*').eq('customer_id', custId);
      if (wishData && wishData.length > 0) {
        const mappedWish = wishData.map(item => {
          return ALL_PRODUCTS.find(p => p.id === item.product_id);
        }).filter(Boolean);
        setWishlist(mappedWish);
      }
    } catch (e) {
      console.error("Cart/Wishlist load failed:", e);
    }
  };

  // CRUD Product Handlers
  const addProduct = async (product) => {
    setProducts((prev) => [product, ...prev]);
    addToast('Product successfully added to catalog!');

    try {
      const userPayload = await getUserIdPayload();
      await supabase.from('products').insert({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        rating: product.rating,
        reviews_count: product.reviewsCount || 0,
        tag: product.tag,
        category: product.category,
        image_url: product.id,
        ...userPayload
      });
    } catch (err) {
      console.error("Supabase insert product error:", err);
    }
  };

  const updateProduct = async (updatedProd) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    addToast('Product details updated successfully.');

    try {
      await supabase.from('products').update({
        name: updatedProd.name,
        description: updatedProd.description,
        price: updatedProd.price,
        rating: updatedProd.rating,
        tag: updatedProd.tag,
        category: updatedProd.category
      }).eq('id', updatedProd.id);
    } catch (err) {
      console.error("Supabase update product error:", err);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Product deleted from inventory catalog.', 'warning');

    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.error("Supabase delete product error:", err);
    }
  };

  const addOrder = async (order) => {
    setOrders((prev) => [order, ...prev]);
    addToast(`Manual order ${order.id} registered.`);
    try {
      const userPayload = await getUserIdPayload();
      // Insert order — let DB generate UUID, do NOT pass string order.id as PK
      const { data: newOrd, error: ordErr } = await supabase.from('orders').insert({
        customer_id: order.customerId,
        total_amount: order.amount || order.total || 0,
        payment_status: order.paymentStatus || 'Pending',
        order_status: order.status || 'Processing',
        ...userPayload
      }).select();
      if (ordErr) {
        console.error("Supabase add order error:", ordErr.message);
        return;
      }
      if (newOrd && newOrd.length > 0 && order.items && order.items.length > 0) {
        const mainOrderId = newOrd[0].id;
        const itemsPayload = order.items.map(item => ({
          order_id: mainOrderId,
          product_id: item.product?.id || 'b1',
          quantity: item.quantity,
          price: item.product?.price || 0,
          ...userPayload
        }));
        await supabase.from('order_items').insert(itemsPayload);
      }
      // Refresh orders from DB so admin panel shows real UUID
      await loadOrders();
    } catch (err) {
      console.error("Supabase add order error:", err);
    }
  };

  // CRUD Order Handlers
  const deleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    addToast(`Order ${orderId} successfully deleted.`, 'warning');

    try {
      await supabase.from('order_items').delete().eq('order_id', orderId);
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (err) {
      console.error("Supabase delete order error:", err);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    addToast(`Order ${orderId} status updated to: ${status}.`);

    try {
      await supabase.from('orders').update({
        order_status: status
      }).eq('id', orderId);
    } catch (err) {
      console.error("Supabase update order status error:", err);
    }
  };

  const updateOrderPaymentStatus = async (orderId, paymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
    );
    addToast(`Order ${orderId} payment updated to: ${paymentStatus}.`);

    try {
      await supabase.from('orders').update({
        payment_status: paymentStatus
      }).eq('id', orderId);
    } catch (err) {
      console.error("Supabase update order payment error:", err);
    }
  };

  // CRUD Customer Handlers
  const addCustomer = async (cust) => {
    setCustomers((prev) => [cust, ...prev]);
    addToast(`Customer ${cust.name} added to database.`);
    try {
      const userPayload = await getUserIdPayload();
      await supabase.from('customers').insert({
        id: cust.id || generateUUID(),
        full_name: cust.name,
        email: cust.email,
        phone: cust.phone || null,
        address: cust.address || null,
        ...userPayload
      });
    } catch (err) {
      console.error("Supabase add customer error:", err);
    }
  };

  const updateCustomer = async (updatedCust) => {
    setCustomers((prev) => prev.map((c) => (c.id === updatedCust.id ? updatedCust : c)));
    addToast(`Customer ${updatedCust.name} profile successfully updated.`);

    try {
      await supabase.from('customers').update({
        full_name: updatedCust.name,
        email: updatedCust.email,
        phone: updatedCust.phone,
        address: updatedCust.address
      }).eq('id', updatedCust.id);
    } catch (err) {
      console.error("Supabase update customer error:", err);
    }
  };

  const deleteCustomer = async (custId) => {
    setCustomers((prev) => prev.filter((c) => c.id !== custId));
    addToast('Customer account deleted from records.', 'warning');

    try {
      await supabase.from('customers').delete().eq('id', custId);
    } catch (err) {
      console.error("Supabase delete customer error:", err);
    }
  };

  // CRUD Review Handlers
  const addReview = async (review) => {
    setReviews((prev) => [review, ...prev]);
    addToast('Review submitted for moderation.');

    try {
      const activeId = getActiveCustomerId();
      const userPayload = await getUserIdPayload();
      
      // Ensure customer record exists in DB
      await ensureCustomerRecord(activeId, review.name, review.name.toLowerCase().replace(/\s+/g, '') + '@example.com');

      await supabase.from('reviews').insert({
        customer_id: activeId,
        product_id: review.product_id || 'b1',
        rating: review.rating,
        review: review.comment,
        ...userPayload
      });
    } catch (err) {
      console.error("Supabase add review error:", err);
    }
  };

  const updateReview = async (updatedRev) => {
    setReviews((prev) => prev.map((r) => (r.id === updatedRev.id ? updatedRev : r)));
    addToast('Review text and rating modified successfully.');

    try {
      await supabase.from('reviews').update({
        rating: updatedRev.rating,
        review: updatedRev.comment
      }).eq('id', updatedRev.id);
    } catch (err) {
      console.error("Supabase update review error:", err);
    }
  };

  const approveReview = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, approved: true } : r))
    );
    addToast('Review approved for site visibility!');
  };

  const hideReview = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, approved: false } : r))
    );
    addToast('Review hidden from site display.', 'warning');
  };

  const deleteReview = async (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    addToast('Review deleted from database.', 'warning');

    try {
      await supabase.from('reviews').delete().eq('id', reviewId);
    } catch (err) {
      console.error("Supabase delete review error:", err);
    }
  };

  // CRUD Message Handlers
  const addContactMessage = async (msg) => {
    setContactMessages((prev) => [msg, ...prev]);

    try {
      const userPayload = await getUserIdPayload();
      // user_id may be null for anonymous contact form submissions - that's ok
      const { error } = await supabase.from('contact_messages').insert({
        name: msg.name,
        email: msg.email,
        message: msg.message,
        ...(userPayload.user_id ? userPayload : {})
      });
      if (error) console.error("Supabase add contact message error:", error.message);
    } catch (err) {
      console.error("Supabase add contact message error:", err);
    }
  };

  const toggleMessageRead = (msgId) => {
    setContactMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, unread: !m.unread } : m))
    );
  };

  const deleteMessage = async (msgId) => {
    setContactMessages((prev) => prev.filter((m) => m.id !== msgId));
    addToast('Message deleted from inbox.', 'warning');

    try {
      await supabase.from('contact_messages').delete().eq('id', msgId);
    } catch (err) {
      console.error("Supabase delete contact message error:", err);
    }
  };

  // CRUD Custom Orders Handlers
  const addCustomOrder = async (order) => {
    setCustomOrders((prev) => [order, ...prev]);
    addToast(`Bespoke custom order created.`);
    try {
      const activeId = getActiveCustomerId();
      const userPayload = await getUserIdPayload();
      await supabase.from('custom_grooming_orders').insert({
        id: order.id || generateUUID(),
        customer_id: order.customerId || activeId,
        product_type: order.category,
        brand: order.brand,
        fragrance: order.fragrance,
        quantity: order.quantity || 1,
        gift_packaging: order.packaging || false,
        custom_note: order.notes,
        estimated_price: order.price,
        status: order.status || 'Processing',
        created_at: order.date ? `${order.date}T00:00:00Z` : new Date().toISOString(),
        ...userPayload
      });
    } catch (err) {
      console.error("Supabase add custom order error:", err);
    }
  };

  const updateCustomOrder = async (updatedOrder) => {
    setCustomOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    addToast(`Custom order ${updatedOrder.id} successfully updated.`);

    try {
      await supabase.from('custom_grooming_orders').update({
        product_type: updatedOrder.category,
        brand: updatedOrder.brand,
        fragrance: updatedOrder.fragrance,
        gift_packaging: updatedOrder.packaging,
        custom_note: updatedOrder.notes,
        status: updatedOrder.status
      }).eq('id', updatedOrder.id);
    } catch (err) {
      console.error("Supabase update custom order error:", err);
    }
  };

  const updateCustomOrderStatus = async (orderId, status) => {
    setCustomOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    addToast(`Custom order ${orderId} status updated to: ${status}.`);

    try {
      await supabase.from('custom_grooming_orders').update({
        status: status
      }).eq('id', orderId);
    } catch (err) {
      console.error("Supabase update custom order status error:", err);
    }
  };

  const deleteCustomOrder = async (orderId) => {
    setCustomOrders((prev) => prev.filter((o) => o.id !== orderId));
    addToast(`Custom order ${orderId} deleted from database.`, 'warning');

    try {
      await supabase.from('custom_grooming_orders').delete().eq('id', orderId);
    } catch (err) {
      console.error("Supabase delete custom order error:", err);
    }
  };

  // CRUD Offers Handlers
  const addOffer = async (offer) => {
    setOffers((prev) => [offer, ...prev]);
    addToast(`Coupon code ${offer.code} created!`);
    try {
      const userPayload = await getUserIdPayload();
      await supabase.from('offers').insert({
        id: offer.id || generateUUID(),
        code: offer.code,
        discount_percent: offer.discountPercent,
        active: offer.active !== undefined ? offer.active : true,
        expires_at: offer.expiresAt ? `${offer.expiresAt}T00:00:00Z` : null,
        ...userPayload
      });
    } catch (err) {
      console.error("Supabase add offer error:", err);
    }
  };

  const updateOffer = async (updatedOffer) => {
    setOffers((prev) => prev.map((o) => (o.id === updatedOffer.id ? updatedOffer : o)));
    addToast(`Coupon code ${updatedOffer.code} updated.`);
    try {
      await supabase.from('offers').update({
        code: updatedOffer.code,
        discount_percent: updatedOffer.discountPercent,
        active: updatedOffer.active,
        expires_at: updatedOffer.expiresAt ? `${updatedOffer.expiresAt}T00:00:00Z` : null
      }).eq('id', updatedOffer.id);
    } catch (err) {
      console.error("Supabase update offer error:", err);
    }
  };

  const deleteOffer = async (offerId) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
    addToast('Coupon code deleted.', 'warning');
    try {
      await supabase.from('offers').delete().eq('id', offerId);
    } catch (err) {
      console.error("Supabase delete offer error:", err);
    }
  };

  // Cart actions
  const addToCart = async (productId, qty = 1) => {
    const product = ALL_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    addToast('Product added to shopping bag!');

    try {
      const custId = getActiveCustomerId();
      if (custId) {
        const { data: existing } = await supabase.from('cart').select('*').eq('customer_id', custId).eq('product_id', productId).limit(1);
        if (existing && existing.length > 0) {
          await supabase.from('cart').update({ quantity: existing[0].quantity + qty }).eq('id', existing[0].id);
        } else {
          const userPayload = await getUserIdPayload();
          await supabase.from('cart').insert({ 
            customer_id: custId, 
            product_id: productId, 
            quantity: qty,
            ...userPayload
          });
        }
      }
    } catch (err) {
      console.error("Supabase sync cart error:", err);
    }
  };

  const addCustomKitToCart = (kit) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => 
        item.isCustom &&
        item.product.category === kit.category &&
        item.product.brand === kit.brand &&
        item.product.fragrance === kit.fragrance &&
        item.product.packaging === kit.packaging &&
        item.product.notes === kit.notes
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) => 
          idx === existingIndex
            ? { ...item, quantity: item.quantity + kit.quantity }
            : item
        );
      }

      const customProduct = {
        id: `custom-${Date.now()}`,
        name: `Custom ${kit.category.charAt(0).toUpperCase() + kit.category.slice(1)} Kit`,
        description: `${kit.brand} • Scent: ${kit.fragrance} • Notes: ${kit.notes || 'None'}`,
        price: kit.price,
        image: kit.image,
        category: kit.category,
        brand: kit.brand,
        fragrance: kit.fragrance,
        packaging: kit.packaging,
        notes: kit.notes,
      };

      return [...prev, { product: customProduct, quantity: kit.quantity, isCustom: true }];
    });
    addToast('Customized kit added to shopping bag!');
  };

  const removeFromCart = async (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Item removed from shopping bag.', 'warning');

    try {
      const custId = getActiveCustomerId();
      if (custId) {
        await supabase.from('cart').delete().eq('customer_id', custId).eq('product_id', productId);
      }
    } catch (err) {
      console.error("Supabase remove cart error:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );

    try {
      const custId = getActiveCustomerId();
      if (custId) {
        await supabase.from('cart').update({ quantity }).eq('customer_id', custId).eq('product_id', productId);
      }
    } catch (err) {
      console.error("Supabase update cart quantity error:", err);
    }
  };

  const clearCart = async () => {
    setCart([]);

    try {
      const custId = getActiveCustomerId();
      if (custId) {
        await supabase.from('cart').delete().eq('customer_id', custId);
      }
    } catch (err) {
      console.error("Supabase clear cart error:", err);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // savePaymentToDb
  // Saves verified Razorpay payment details to the `payments` table.
  // Uses upsert on razorpay_payment_id to prevent duplicates.
  // Also updates the related order status to Confirmed + payment_status to Paid.
  // ─────────────────────────────────────────────────────────────────
  const savePaymentToDb = async ({ paymentData, dbOrderId }) => {
    if (!paymentData?.razorpay_payment_id) {
      console.error('savePaymentToDb: missing razorpay_payment_id');
      return null;
    }

    const activeId    = getActiveCustomerId();
    const amountRupees = Number(paymentData.amount_rupees || 0);

    if (amountRupees <= 0) {
      console.warn('savePaymentToDb: amount is 0 or missing', paymentData.amount_rupees);
    }

    try {
      // ── Upsert into payments table ────────────────────────────
      // ON CONFLICT on razorpay_payment_id → update instead of duplicate
      const { data: payRow, error: payErr } = await supabase
        .from('payments')
        .upsert({
          customer_id:          activeId || null,
          order_id:             dbOrderId || null,
          razorpay_order_id:    paymentData.razorpay_order_id,
          razorpay_payment_id:  paymentData.razorpay_payment_id,
          razorpay_signature:   paymentData.razorpay_signature,
          amount:               amountRupees,
          currency:             paymentData.currency || 'INR',
          payment_method:       'Razorpay',
          payment_status:       'Success',
          transaction_date:     paymentData.verified_at || new Date().toISOString(),
          created_at:           new Date().toISOString(),
          updated_at:           new Date().toISOString(),
        }, { onConflict: 'razorpay_payment_id' })
        .select()
        .single();

      if (payErr) {
        console.error('❌ payments insert/upsert error:', payErr.message);
      } else {
        console.log('✅ Payment saved to DB:', {
          id:                 payRow?.id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          amount:              amountRupees,
        });
      }

      // ── Update linked order → Confirmed + Paid ────────────────
      if (dbOrderId) {
        const { error: orderUpdateErr } = await supabase
          .from('orders')
          .update({
            order_status:        'Confirmed',
            payment_status:      'Paid',
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_order_id:   paymentData.razorpay_order_id,
            payment_method:      'Razorpay',
            updated_at:          new Date().toISOString(),
          })
          .eq('id', dbOrderId);

        if (orderUpdateErr) {
          console.error('❌ order update error after payment:', orderUpdateErr.message);
        } else {
          console.log('✅ Order updated → Confirmed + Paid:', dbOrderId);
        }
      }

      return payRow;
    } catch (err) {
      console.error('❌ savePaymentToDb error:', err);
      return null;
    }
  };

  const createOrderFromCart = async (customerName, customerEmail, paymentData = null) => {

    if (cart.length === 0) return;

    const email = customerEmail || 'guest@example.com';
    const name  = customerName  || 'Guest Customer';

    // ── Capture cart snapshot BEFORE clearing ──────────────────
    // (cart state is cleared below; we need the items for DB insert)
    const cartSnapshot = [...cart];

    // ── Determine total amount ──────────────────────────────────
    // If payment was via Razorpay, use the verified amount from the backend.
    // Otherwise fall back to local calculation.
    const calculatedTotal  = getCartTotal() + (getCartTotal() > 50 ? 0 : 5.99);
    const verifiedAmount   = paymentData?.amount_rupees;
    const finalAmount      = (verifiedAmount && verifiedAmount > 0)
      ? verifiedAmount
      : calculatedTotal;

    // ── Local order state update ────────────────────────────────
    const orderId    = `ORD-${Date.now().toString().slice(-4)}`;
    const orderItems = cartSnapshot.map(item => ({
      name:  item.product.name,
      qty:   item.quantity,
      price: item.product.price,
    }));

    const newOrder = {
      id:            orderId,
      customer:      name,
      email:         email,
      date:          new Date().toISOString().slice(0, 10),
      amount:        finalAmount,
      items:         orderItems,
      status:        'Processing',
      paymentStatus: paymentData ? 'Paid' : 'Pending',
      // Razorpay IDs (if paid via Razorpay)
      razorpay_payment_id: paymentData?.razorpay_payment_id || null,
      razorpay_order_id:   paymentData?.razorpay_order_id   || null,
      payment_method:      paymentData ? 'Razorpay' : 'Cash on Delivery',
    };

    setOrders(prev => [newOrder, ...prev]);

    // Handle Custom Kit orders inside cart locally
    cartSnapshot.forEach(item => {
      if (item.isCustom) {
        const customOrderObj = {
          id:        `CST-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 90 + 10)}`,
          customer:  name,
          email:     email,
          category:  item.product.category,
          brand:     item.product.brand,
          fragrance: item.product.fragrance,
          packaging: item.product.packaging,
          notes:     item.product.notes,
          price:     item.product.price,
          quantity:  item.quantity,
          status:    'Processing',
          date:      new Date().toISOString().slice(0, 10),
        };
        setCustomOrders(prev => [customOrderObj, ...prev]);
      }
    });

    addToast(`Order ${orderId} successfully placed!`);
    // Clear cart AFTER capturing snapshot (already done above)
    setCart([]);

    // ── Sync to Supabase ────────────────────────────────────────
    try {
      const activeId   = getActiveCustomerId();
      const userPayload = await getUserIdPayload();

      // Ensure customer record exists
      await ensureCustomerRecord(activeId, name, email);

      // Build the order row — include Razorpay IDs and verified amount
      const orderRow = {
        customer_id:    activeId,
        total_amount:   finalAmount,            // ← verified ₹ amount
        payment_status: newOrder.paymentStatus,
        order_status:   'Processing',
        payment_method: newOrder.payment_method,
        ...userPayload,
      };

      // Store Razorpay IDs if columns exist (add them to your Supabase table if missing)
      if (paymentData?.razorpay_payment_id) {
        orderRow.razorpay_payment_id = paymentData.razorpay_payment_id;
      }
      if (paymentData?.razorpay_order_id) {
        orderRow.razorpay_order_id = paymentData.razorpay_order_id;
      }

      console.log('💾 Saving order to Supabase:', {
        customer_id:         activeId,
        total_amount:        finalAmount,
        payment_status:      orderRow.payment_status,
        razorpay_payment_id: orderRow.razorpay_payment_id,
        razorpay_order_id:   orderRow.razorpay_order_id,
      });

      const { data: newOrd, error: orderError } = await supabase
        .from('orders')
        .insert(orderRow)
        .select();

      if (orderError) {
        console.error('❌ Supabase orders insert error:', orderError.message);
      }

      if (newOrd && newOrd.length > 0) {
        const mainOrderId = newOrd[0].id;
        console.log('✅ Order saved to DB. DB order ID:', mainOrderId);

        // Insert order line items using the snapshot (NOT the cleared cart)
        for (const item of cartSnapshot) {
          const prodId = item.isCustom ? 'b1' : item.product.id;
          const { error: itemError } = await supabase.from('order_items').insert({
            order_id:   mainOrderId,
            product_id: prodId,
            quantity:   item.quantity,
            price:      item.product.price,
            ...userPayload,
          });
          if (itemError) {
            console.error('❌ order_items insert error:', itemError.message, { prodId, quantity: item.quantity });
          }

          // Insert custom grooming orders if applicable
          if (item.isCustom) {
            await supabase.from('custom_grooming_orders').insert({
              customer_id:    activeId,
              product_type:   item.product.category,
              brand:          item.product.brand,
              fragrance:      item.product.fragrance,
              quantity:       item.quantity,
              gift_packaging: item.product.packaging,
              custom_note:    item.product.notes,
              estimated_price: item.product.price,
              ...userPayload,
            });
          }
        }
        
        // Clear remote cart after successful DB insert
        if (activeId) {
          await supabase.from('cart').delete().eq('customer_id', activeId);
        }

        // Refresh dashboard data
        await loadOrders();
        await loadPayments();
        await loadCustomOrders();
        await loadCustomers();

        return mainOrderId;
      }
      return null;
    } catch (err) {
      console.error('❌ Supabase checkout order error:', err);
      return null;
    }
  };


  // Wishlist actions
  const toggleWishlist = async (product) => {
    let exists = false;
    setWishlist((prev) => {
      exists = prev.some((item) => item.id === product.id);
      if (exists) {
        addToast('Removed from wishlist.', 'warning');
        return prev.filter((item) => item.id !== product.id);
      }
      addToast('Added to wishlist!');
      return [...prev, product];
    });

    try {
      const custId = getActiveCustomerId();
      if (custId) {
        if (exists) {
          await supabase.from('wishlist').delete().eq('customer_id', custId).eq('product_id', product.id);
        } else {
          const userPayload = await getUserIdPayload();
          await supabase.from('wishlist').insert({ 
            customer_id: custId, 
            product_id: product.id,
            ...userPayload
          });
        }
      }
    } catch (err) {
      console.error("Supabase toggle wishlist error:", err);
    }
  };

  const removeFromWishlist = async (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    addToast('Removed from wishlist.', 'warning');

    try {
      const custId = getActiveCustomerId();
      if (custId) {
        await supabase.from('wishlist').delete().eq('customer_id', custId).eq('product_id', productId);
      }
    } catch (err) {
      console.error("Supabase remove wishlist error:", err);
    }
  };

  const moveToCart = (product) => {
    addToCart(product.id, 1);
    removeFromWishlist(product.id);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        reviews,
        orders,
        payments,
        customers,
        contactMessages,
        customOrders,
        offers,
        toasts,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        deleteOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addReview,
        updateReview,
        approveReview,
        hideReview,
        deleteReview,
        addContactMessage,
        toggleMessageRead,
        deleteMessage,
        addCustomOrder,
        updateCustomOrder,
        updateCustomOrderStatus,
        deleteCustomOrder,
        addOffer,
        updateOffer,
        deleteOffer,
        addToCart,
        addCustomKitToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        createOrderFromCart,
        savePaymentToDb,
        loadPayments,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        getCartCount,
        getCartTotal,

      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
