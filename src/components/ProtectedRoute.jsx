import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center text-gray-300">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and keep track of where the user was heading
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
