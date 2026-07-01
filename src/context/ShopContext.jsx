import React, { createContext, useState, useEffect } from 'react';
import { ALL_PRODUCTS, REVIEWS as INITIAL_REVIEWS } from '../data/products';
import { supabase } from '../supabaseClient';

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
  // State definitions
  const [products, setProducts] = useState(ALL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
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

      // Verify guest customer exists in DB, if not insert it
      try {
        const { data: existingCust } = await supabase.from('customers').select('id').eq('id', guestId);
        if (!existingCust || existingCust.length === 0) {
          await supabase.from('customers').insert({
            id: guestId,
            full_name: 'Guest Customer',
            email: `guest-${guestId.slice(0, 8)}@sovereign.com`
          });
        }
      } catch (err) {
        console.error("Guest customer sync failed", err);
      }

      // Fetch all tables
      await loadProducts();
      await loadCustomers();
      await loadReviews();
      await loadOrders();
      await loadContactMessages();
      await loadCustomOrders();
      await loadCartAndWishlist(guestId);
    };

    initializeDatabase();
  }, []);

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
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      if (data && data.length > 0) {
        setCustomers(data.map(c => ({
          id: c.id,
          name: c.full_name,
          email: c.email,
          phone: c.phone || 'N/A',
          address: c.address || 'N/A',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          ordersCount: 0, // computed dynamic below
          totalSpent: 0,
          tier: 'Standard'
        })));
      }
    } catch (e) {
      console.error("Customers load failed:", e);
    }
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, customers(*), order_items(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;

      if (data && data.length > 0) {
        const mapped = data.map(o => ({
          id: o.id,
          customer: o.customers?.full_name || 'Guest Customer',
          email: o.customers?.email || 'N/A',
          date: o.created_at?.slice(0, 10),
          amount: Number(o.total_amount),
          status: o.order_status,
          paymentStatus: o.payment_status,
          items: o.order_items || []
        }));
        setOrders(mapped);
      }
    } catch (e) {
      console.error("Orders load failed:", e);
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
      await supabase.from('products').insert({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        rating: product.rating,
        reviews_count: product.reviewsCount || 0,
        tag: product.tag,
        category: product.category,
        image_url: product.id
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
      // Find or insert mock customer for review visibility
      let custId = guestCustomerId;
      const { data: existing } = await supabase.from('customers').select('id').eq('email', review.name.toLowerCase().replace(/\s+/g, '') + '@example.com');
      if (existing && existing.length > 0) {
        custId = existing[0].id;
      } else {
        const { data: newCust } = await supabase.from('customers').insert({
          full_name: review.name,
          email: review.name.toLowerCase().replace(/\s+/g, '') + '@example.com'
        }).select();
        if (newCust && newCust.length > 0) custId = newCust[0].id;
      }

      await supabase.from('reviews').insert({
        customer_id: custId,
        product_id: review.product_id || 'b1',
        rating: review.rating,
        review: review.comment
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
      await supabase.from('contact_messages').insert({
        id: msg.id || generateUUID(),
        name: msg.name,
        email: msg.email,
        message: msg.message
      });
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
      const custId = guestCustomerId || localStorage.getItem('sovereign_guest_customer_id');
      if (custId) {
        const { data: existing } = await supabase.from('cart').select('*').eq('customer_id', custId).eq('product_id', productId).limit(1);
        if (existing && existing.length > 0) {
          await supabase.from('cart').update({ quantity: existing[0].quantity + qty }).eq('id', existing[0].id);
        } else {
          await supabase.from('cart').insert({ customer_id: custId, product_id: productId, quantity: qty });
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
      const custId = guestCustomerId || localStorage.getItem('sovereign_guest_customer_id');
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
      const custId = guestCustomerId || localStorage.getItem('sovereign_guest_customer_id');
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
      const custId = guestCustomerId || localStorage.getItem('sovereign_guest_customer_id');
      if (custId) {
        await supabase.from('cart').delete().eq('customer_id', custId);
      }
    } catch (err) {
      console.error("Supabase clear cart error:", err);
    }
  };

  const createOrderFromCart = async (customerName, customerEmail) => {
    if (cart.length === 0) return;

    const email = customerEmail || 'guest@example.com';
    const name = customerName || 'Guest Customer';
    
    // Local Order Insertion mock logic
    const orderId = `ORD-${Date.now().toString().slice(-4)}`;
    const orderItems = cart.map(item => ({
      name: item.product.name,
      qty: item.quantity,
      price: item.product.price
    }));

    const newOrder = {
      id: orderId,
      customer: name,
      email: email,
      date: new Date().toISOString().slice(0, 10),
      amount: getCartTotal() + (getCartTotal() > 50 ? 0 : 5.99),
      items: orderItems,
      status: 'Processing',
      paymentStatus: 'Paid'
    };

    setOrders(prev => [newOrder, ...prev]);

    // Handle Custom Kit orders inside cart locally
    cart.forEach(item => {
      if (item.isCustom) {
        const customOrderObj = {
          id: `CST-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 90 + 10)}`,
          customer: name,
          email: email,
          category: item.product.category,
          brand: item.product.brand,
          fragrance: item.product.fragrance,
          packaging: item.product.packaging,
          notes: item.product.notes,
          price: item.product.price,
          quantity: item.quantity,
          status: 'Processing',
          date: new Date().toISOString().slice(0, 10)
        };
        setCustomOrders(prev => [customOrderObj, ...prev]);
      }
    });

    addToast(`Order ${orderId} successfully placed!`);
    setCart([]);

    // Sync checkout process to Supabase database
    try {
      // Find or insert customer details
      let customerUuid;
      const { data: cust } = await supabase.from('customers').select('id').eq('email', email).limit(1);
      if (cust && cust.length > 0) {
        customerUuid = cust[0].id;
        await supabase.from('customers').update({ full_name: name }).eq('id', customerUuid);
      } else {
        const { data: newCust } = await supabase.from('customers').insert({
          full_name: name,
          email: email
        }).select();
        if (newCust && newCust.length > 0) customerUuid = newCust[0].id;
      }

      if (customerUuid) {
        // Insert main order record
        const { data: newOrd } = await supabase.from('orders').insert({
          customer_id: customerUuid,
          total_amount: newOrder.amount,
          payment_status: 'Paid',
          order_status: 'Processing'
        }).select();

        if (newOrd && newOrd.length > 0) {
          const mainOrderId = newOrd[0].id;
          
          // Insert order line items
          for (const item of cart) {
            // Note: If it is a custom kit, it's not a preloaded product. So we fall back to 'b1' or another product ID,
            // or we insert the custom kit details. We will insert custom kits with product_id = 'b1' for relation checks
            // and log detailed custom grooming specifications.
            const prodId = item.isCustom ? 'b1' : item.product.id;
            await supabase.from('order_items').insert({
              order_id: mainOrderId,
              product_id: prodId,
              quantity: item.quantity,
              price: item.product.price
            });

            // Insert custom orders details in custom_grooming_orders if applicable
            if (item.isCustom) {
              await supabase.from('custom_grooming_orders').insert({
                customer_id: customerUuid,
                product_type: item.product.category,
                brand: item.product.brand,
                fragrance: item.product.fragrance,
                quantity: item.quantity,
                gift_packaging: item.product.packaging,
                custom_note: item.product.notes,
                estimated_price: item.product.price
              });
            }
          }
        }
      }

      // Clear remote cart
      const guestId = guestCustomerId || localStorage.getItem('sovereign_guest_customer_id');
      if (guestId) {
        await supabase.from('cart').delete().eq('customer_id', guestId);
      }

      // Refresh data
      await loadOrders();
      await loadCustomOrders();
      await loadCustomers();
    } catch (err) {
      console.error("Supabase checkout order error:", err);
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
      const custId = guestCustomerId || localStorage.getItem('sovereign_guest_customer_id');
      if (custId) {
        if (exists) {
          await supabase.from('wishlist').delete().eq('customer_id', custId).eq('product_id', product.id);
        } else {
          await supabase.from('wishlist').insert({ customer_id: custId, product_id: product.id });
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
      const custId = guestCustomerId || localStorage.getItem('sovereign_guest_customer_id');
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
        customers,
        contactMessages,
        customOrders,
        toasts,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
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
        updateCustomOrder,
        updateCustomOrderStatus,
        deleteCustomOrder,
        addToCart,
        addCustomKitToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        createOrderFromCart,
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
