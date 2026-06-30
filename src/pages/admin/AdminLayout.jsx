import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ShopContext } from '../../context/ShopContext';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminLayout = () => {
  const { adminUser } = useContext(AuthContext);
  const { toasts } = useContext(ShopContext);

  // If not logged in, redirect to login page
  if (!adminUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="pt-20 bg-[#08080a] min-h-screen text-gray-300 relative">
      {/* Toast Alert Popups */}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-2xl flex items-center gap-2 pointer-events-auto border transition-all duration-300 ${
              toast.type === 'warning'
                ? 'bg-amber-400 border-amber-500'
                : toast.type === 'error'
                ? 'bg-rose-500 border-rose-600 text-white'
                : 'bg-[#C9A84C] border-[#E8C97E]'
            }`}
          >
            <span>{toast.type === 'warning' ? '⚠️' : toast.type === 'error' ? '❌' : '✨'}</span>
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-8 items-stretch">
        
        {/* Navigation Sidebar */}
        <AdminSidebar />
        
        {/* Main nested content pages outlet */}
        <main className="flex-1 bg-zinc-900/10 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl min-h-[calc(100vh-140px)]">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
