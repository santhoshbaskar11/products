import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext(null);

// Create or upsert a customer profile record immediately after auth
const provisionCustomerRecord = async (user) => {
  if (!user) return;
  try {
    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('id', user.id)
      .limit(1);

    if (!existing || existing.length === 0) {
      const name = user.user_metadata?.full_name || user.email.split('@')[0];
      const { error } = await supabase.from('customers').insert({
        id: user.id,
        full_name: name,
        email: user.email,
        user_id: user.id,
        created_at: new Date().toISOString()
      });
      if (error) console.error('provisionCustomerRecord insert error:', error.message);
    }
  } catch (err) {
    console.error('provisionCustomerRecord error:', err);
  }
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin fallback state
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('sovereign_admin');
    return saved ? JSON.parse(saved) : null;
  });

  // Track session status on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);
      if (u) provisionCustomerRecord(u);
    });

    // Listen for auth changes (login, logout, token refresh, signup)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);
      if (u) provisionCustomerRecord(u);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    // provisionCustomerRecord is called by onAuthStateChange automatically
    return data.user;
  };

  const signup = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });
    if (error) throw error;
    // Immediately provision customer record after signup
    if (data.user) {
      await provisionCustomerRecord(data.user);
    }
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
    localStorage.removeItem('sovereign_admin');
  };

  // Keep admin login fallback
  const adminLogin = (username, password) => {
    if (username.toLowerCase() === 'admin' && password === 'password') {
      const userObj = { username: 'Admin', role: 'Administrator' };
      setAdminUser(userObj);
      localStorage.setItem('sovereign_admin', JSON.stringify(userObj));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, adminUser, loading, login, signup, logout, adminLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
