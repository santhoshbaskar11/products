import React, { createContext, useState, useEffect } from 'react';
import { ALL_PRODUCTS, REVIEWS as INITIAL_REVIEWS } from '../data/products';

export const ShopContext = createContext(null);

export const ShopContextProvider = ({ children }) => {
  // Load products from localStorage or initialize
  const [products, setProducts] = useState(() => {
    const local = localStorage.getItem('sovereign_products');
    return local ? JSON.parse(local) : ALL_PRODUCTS;
  });

  // Load cart from localStorage or initialize
  const [cart, setCart] = useState(() => {
    const local = localStorage.getItem('sovereign_cart');
    return local ? JSON.parse(local) : [];
  });

  // Load wishlist from localStorage or initialize
  const [wishlist, setWishlist] = useState(() => {
    const local = localStorage.getItem('sovereign_wishlist');
    return local ? JSON.parse(local) : [];
  });

  // Load reviews from localStorage or initialize
  const [reviews, setReviews] = useState(() => {
    const local = localStorage.getItem('sovereign_reviews');
    return local ? JSON.parse(local) : INITIAL_REVIEWS;
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load orders from localStorage or initialize
  const [orders, setOrders] = useState(() => {
    const local = localStorage.getItem('sovereign_orders');
    const initialOrders = [
      {
        id: 'ORD-5489',
        customer: 'Jonathan Sterling',
        email: 'jonathan@sterling.com',
        date: '2026-06-28',
        amount: 148.00,
        items: [
          { name: 'Imperial Beard Oil', qty: 2, price: 38 },
          { name: 'The Sovereign Grooming Kit', qty: 1, price: 89 }
        ],
        status: 'Delivered',
        paymentStatus: 'Paid'
      },
      {
        id: 'ORD-9021',
        customer: 'David Reynolds',
        email: 'david.r@gmail.com',
        date: '2026-06-29',
        amount: 60.00,
        items: [
          { name: 'Daily Hydration Shield SPF 20', qty: 1, price: 28 },
          { name: 'Caffeine Eye Rescue Cream', qty: 1, price: 32 }
        ],
        status: 'Processing',
        paymentStatus: 'Pending'
      },
      {
        id: 'ORD-1154',
        customer: 'Marcus Vance',
        email: 'marcus.v@barbershop.com',
        date: '2026-06-30',
        amount: 22.00,
        items: [
          { name: 'Matte Clay Pomade', qty: 1, price: 22 }
        ],
        status: 'Shipped',
        paymentStatus: 'Paid'
      }
    ];
    return local ? JSON.parse(local) : initialOrders;
  });

  // Load customers from localStorage or initialize
  const [customers, setCustomers] = useState(() => {
    const local = localStorage.getItem('sovereign_customers');
    const initialCustomers = [
      {
        id: 'CST-001',
        name: 'Jonathan Sterling',
        email: 'jonathan@sterling.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        ordersCount: 4,
        totalSpent: 388.00,
        tier: 'Sovereign VIP'
      },
      {
        id: 'CST-002',
        name: 'Marcus Vance',
        email: 'marcus.v@barbershop.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        ordersCount: 2,
        totalSpent: 98.00,
        tier: 'Pro Barber'
      },
      {
        id: 'CST-003',
        name: 'David Reynolds',
        email: 'david.r@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
        ordersCount: 5,
        totalSpent: 264.00,
        tier: 'Sovereign VIP'
      },
      {
        id: 'CST-004',
        name: 'Julian Vance',
        email: 'julian.v@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
        ordersCount: 1,
        totalSpent: 110.00,
        tier: 'Standard'
      }
    ];
    return local ? JSON.parse(local) : initialCustomers;
  });

  // Load contact messages from localStorage or initialize
  const [contactMessages, setContactMessages] = useState(() => {
    const local = localStorage.getItem('sovereign_messages');
    const initialMessages = [
      {
        id: 'MSG-8849',
        name: 'Liam Vance',
        email: 'liam@vance.com',
        message: 'Hi, I would like to inquire about bulk ordering custom kits for our corporate retreat. Do you offer custom branding on the wooden plate?',
        unread: true,
        date: '2026-06-30'
      },
      {
        id: 'MSG-3021',
        name: 'Arthur Pendragon',
        email: 'arthur@camelot.com',
        message: 'Sandalwood Beard Balm has transformed my stubble. Excellent hold and aroma. When will the Sovereign combs be back in stock?',
        unread: false,
        date: '2026-06-29'
      }
    ];
    return local ? JSON.parse(local) : initialMessages;
  });

  // Load custom kit orders from localStorage or initialize
  const [customOrders, setCustomOrders] = useState(() => {
    const local = localStorage.getItem('sovereign_custom_orders');
    const initialCustomOrders = [
      {
        id: 'CST-9041',
        customer: 'Jonathan Sterling',
        email: 'jonathan@sterling.com',
        category: 'beard',
        brand: 'Sovereign Lab',
        fragrance: 'Sandalwood Bourbon',
        packaging: true,
        notes: 'J.S. - Limited Edition',
        price: 54.99,
        quantity: 1,
        status: 'Delivered',
        date: '2026-06-28'
      },
      {
        id: 'CST-2309',
        customer: 'David Reynolds',
        email: 'david.r@gmail.com',
        category: 'skin',
        brand: 'Vanguard Botanicals',
        fragrance: 'Fresh Bergamot Mint',
        packaging: false,
        notes: 'D.R. Daily Pack',
        price: 42.00,
        quantity: 2,
        status: 'Processing',
        date: '2026-06-30'
      }
    ];
    return local ? JSON.parse(local) : initialCustomOrders;
  });

  // Floating Toast Notification States
  const [toasts, setToasts] = useState([]);

  const addToast = (text, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sovereign_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sovereign_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sovereign_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('sovereign_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sovereign_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sovereign_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('sovereign_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem('sovereign_custom_orders', JSON.stringify(customOrders));
  }, [customOrders]);

  // CRUD Product Handlers
  const addProduct = (product) => {
    setProducts((prev) => [product, ...prev]);
    addToast('Product successfully added to catalog!');
  };

  const updateProduct = (updatedProd) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    addToast('Product details updated successfully.');
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Product deleted from inventory catalog.', 'warning');
  };

  // CRUD Order Handlers
  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    addToast(`Order ${orderId} successfully deleted.`, 'warning');
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    addToast(`Order ${orderId} status updated to: ${status}.`);
  };

  const updateOrderPaymentStatus = (orderId, paymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
    );
    addToast(`Order ${orderId} payment updated to: ${paymentStatus}.`);
  };

  // CRUD Customer Handlers
  const updateCustomer = (updatedCust) => {
    setCustomers((prev) => prev.map((c) => (c.id === updatedCust.id ? updatedCust : c)));
    addToast(`Customer ${updatedCust.name} profile successfully updated.`);
  };

  const deleteCustomer = (custId) => {
    setCustomers((prev) => prev.filter((c) => c.id !== custId));
    addToast('Customer account deleted from records.', 'warning');
  };

  // CRUD Review Handlers
  const addReview = (review) => {
    setReviews((prev) => [review, ...prev]);
    addToast('Review submitted for moderation.');
  };

  const updateReview = (updatedRev) => {
    setReviews((prev) => prev.map((r) => (r.id === updatedRev.id ? updatedRev : r)));
    addToast('Review text and rating modified successfully.');
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

  const deleteReview = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    addToast('Review deleted from database.', 'warning');
  };

  // CRUD Message Handlers
  const addContactMessage = (msg) => {
    setContactMessages((prev) => [msg, ...prev]);
  };

  const toggleMessageRead = (msgId) => {
    setContactMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, unread: !m.unread } : m))
    );
  };

  const deleteMessage = (msgId) => {
    setContactMessages((prev) => prev.filter((m) => m.id !== msgId));
    addToast('Message deleted from inbox.', 'warning');
  };

  // CRUD Custom Orders Handlers
  const updateCustomOrder = (updatedOrder) => {
    setCustomOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    addToast(`Custom order ${updatedOrder.id} successfully updated.`);
  };

  const updateCustomOrderStatus = (orderId, status) => {
    setCustomOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    addToast(`Custom order ${orderId} status updated to: ${status}.`);
  };

  const deleteCustomOrder = (orderId) => {
    setCustomOrders((prev) => prev.filter((o) => o.id !== orderId));
    addToast(`Custom order ${orderId} deleted from database.`, 'warning');
  };

  // Cart actions
  const addToCart = (productId, qty = 1) => {
    const product = products.find((p) => p.id === productId);
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
  };

  const addCustomKitToCart = (kit) => {
    // Generate order item details
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

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Item removed from shopping bag.', 'warning');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrderFromCart = (customerName, customerEmail) => {
    if (cart.length === 0) return;

    const orderId = `ORD-${Date.now().toString().slice(-4)}`;
    const orderItems = cart.map(item => ({
      name: item.product.name,
      qty: item.quantity,
      price: item.product.price
    }));

    const newOrder = {
      id: orderId,
      customer: customerName || 'Guest Customer',
      email: customerEmail || 'guest@example.com',
      date: new Date().toISOString().slice(0, 10),
      amount: getCartTotal() + (getCartTotal() > 50 ? 0 : 5.99),
      items: orderItems,
      status: 'Processing',
      paymentStatus: 'Paid'
    };

    // Add to orders list
    setOrders(prev => [newOrder, ...prev]);

    // Check for any custom kits in cart and add them to customOrders list
    cart.forEach(item => {
      if (item.isCustom) {
        const customOrder = {
          id: `CST-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 90 + 10)}`,
          customer: customerName || 'Guest Customer',
          email: customerEmail || 'guest@example.com',
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
        setCustomOrders(prev => [customOrder, ...prev]);
      }
    });

    // Add customer to registered customers list if not exists
    setCustomers(prev => {
      const exists = prev.some(c => c.email.toLowerCase() === (customerEmail || 'guest@example.com').toLowerCase());
      if (exists) {
        return prev.map(c => {
          if (c.email.toLowerCase() === (customerEmail || 'guest@example.com').toLowerCase()) {
            return {
              ...c,
              ordersCount: c.ordersCount + 1,
              totalSpent: c.totalSpent + newOrder.amount
            };
          }
          return c;
        });
      }
      const newCust = {
        id: `CST-${Date.now().toString().slice(-3)}`,
        name: customerName || 'Guest Customer',
        email: customerEmail || 'guest@example.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        ordersCount: 1,
        totalSpent: newOrder.amount,
        tier: 'Standard'
      };
      return [newCust, ...prev];
    });

    addToast(`Order ${orderId} successfully placed!`);
    setCart([]);
  };

  // Wishlist actions
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        addToast('Removed from wishlist.', 'warning');
        return prev.filter((item) => item.id !== product.id);
      }
      addToast('Added to wishlist!');
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    addToast('Removed from wishlist.', 'warning');
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
