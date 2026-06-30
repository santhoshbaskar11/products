import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('sovereign_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    if (username.toLowerCase() === 'admin' && password === 'password') {
      const user = { username: 'Admin', role: 'Administrator' };
      setAdminUser(user);
      localStorage.setItem('sovereign_admin', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('sovereign_admin');
  };

  return (
    <AuthContext.Provider value={{ adminUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
