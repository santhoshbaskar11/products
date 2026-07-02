import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext(null);

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
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
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
