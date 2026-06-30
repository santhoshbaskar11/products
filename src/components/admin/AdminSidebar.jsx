import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Truck, Users, MessageSquare, LogOut, ArrowLeft, Mail, ClipboardList } from 'lucide-react';

const AdminSidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
      isActive
        ? 'bg-[#C9A84C] text-black shadow-[0_0_15px_rgba(201,168,76,0.35)] scale-[1.02]'
        : 'text-zinc-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <aside className="w-full md:w-64 shrink-0 bg-zinc-950 border-r border-white/5 py-8 px-4 flex flex-col justify-between min-h-[calc(100vh-72px)] md:h-[calc(100vh-72px)] md:sticky md:top-[72px] text-left">
      <div className="space-y-8">
        
        {/* Title branding */}
        <div className="px-4">
          <span className="text-[10px] font-bold text-[#C9A84C] tracking-[0.25em] uppercase block">Control Hub</span>
          <h3 className="text-lg font-bold text-white font-serif tracking-wide mt-1">Management Panel</h3>
        </div>

        {/* Sidebar Nav links */}
        <div className="flex flex-col gap-2">
          <NavLink to="/admin" end className={navClass}>
            <LayoutDashboard className="h-4.5 w-4.5" />
            Dashboard
          </NavLink>

          <NavLink to="/admin/products" className={navClass}>
            <ShoppingBag className="h-4.5 w-4.5" />
            Products
          </NavLink>

          <NavLink to="/admin/orders" className={navClass}>
            <Truck className="h-4.5 w-4.5" />
            Orders
          </NavLink>

          <NavLink to="/admin/customers" className={navClass}>
            <Users className="h-4.5 w-4.5" />
            Customers
          </NavLink>

          <NavLink to="/admin/reviews" className={navClass}>
            <MessageSquare className="h-4.5 w-4.5" />
            Reviews
          </NavLink>

          <NavLink to="/admin/messages" className={navClass}>
            <Mail className="h-4.5 w-4.5" />
            Messages
          </NavLink>

          <NavLink to="/admin/custom-orders" className={navClass}>
            <ClipboardList className="h-4.5 w-4.5" />
            Custom Orders
          </NavLink>
        </div>
      </div>

      {/* Return to site & Sign Out buttons */}
      <div className="space-y-2 pt-6 border-t border-white/5">
        <button
          onClick={() => navigate('/')}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Return to Site
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5" />
          Sign Out
        </button>
      </div>

    </aside>
  );
};

export default AdminSidebar;
