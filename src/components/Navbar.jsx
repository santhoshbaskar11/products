import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, User, Sparkles, Heart, ShieldAlert } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { getCartCount, wishlist, searchQuery, setSearchQuery } = useContext(ShopContext);
  const { adminUser, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAdmin = adminUser || (user?.email && (user.email === 'admin@sovereign.com' || user.email === 'seed-admin@sovereign.com' || user.email === 'admin-seed@example.com'));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // If we type search, navigate to shop page if we aren't already on a shop page
    const path = window.location.pathname;
    if (!['/beard-care', '/hair-care', '/skincare'].includes(path)) {
      navigate('/beard-care');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium tracking-wider transition-colors duration-300 ${
      isActive ? 'text-[#E8C97E] border-b-2 border-[#C9A84C]/50 pb-1' : 'text-gray-300 hover:text-[#E8C97E]'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `text-lg font-medium tracking-wide py-2 border-b border-white/5 transition-colors duration-300 block ${
      isActive ? 'text-[#E8C97E]' : 'text-gray-300 hover:text-[#E8C97E]'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08080a]/95 backdrop-blur-md border-b border-white/5 py-4 shadow-lg'
          : 'bg-[#08080a]/40 backdrop-blur-sm py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-sm text-black font-extrabold shadow-[0_0_10px_rgba(201,168,76,0.25)]">
              👑
            </span>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-base font-bold tracking-widest text-white block font-serif">
                SOVEREIGN
              </span>
              <span className="text-[8px] tracking-[0.25em] text-[#C9A84C] block font-semibold uppercase mt-0.5">
                Grooming Co.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/products" className={navLinkClass}>SHOP</NavLink>
            <NavLink to="/beard-care" className={navLinkClass}>BEARD</NavLink>
            <NavLink to="/hair-care" className={navLinkClass}>HAIR</NavLink>
            <NavLink to="/skincare" className={navLinkClass}>SKINCARE</NavLink>
            <NavLink to="/reviews" className={navLinkClass}>REVIEWS</NavLink>
            <NavLink to="/contact" className={navLinkClass}>CONTACT</NavLink>
            <NavLink to="/custom-grooming" className={navLinkClass}>CUSTOM GROOMING</NavLink>
          </div>

          {/* Icons / CTAs */}
          <div className="hidden lg:flex items-center gap-6">
            
            {/* Search Bar Collapsible */}
            <div className="relative flex items-center">
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="mr-2 rounded-xl bg-zinc-900 border border-white/10 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A84C] w-48 transition-all duration-300"
                />
              )}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="text-gray-300 hover:text-[#E8C97E] transition-colors duration-300 cursor-pointer"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative text-gray-300 hover:text-[#E8C97E] transition-colors duration-300">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="relative text-gray-300 hover:text-[#E8C97E] transition-colors duration-300">
              <ShoppingBag className="h-5 w-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A84C] text-[9px] font-bold text-black">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Admin / User Dropdown / Auth Links */}
            {adminUser ? (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9A84C] border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-3 py-1.5 rounded-xl hover:bg-[#C9A84C]/10"
              >
                <ShieldAlert className="h-4 w-4" />
                Admin
              </Link>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white border border-white/10 bg-zinc-900/60 px-4 py-2 rounded-xl hover:border-[#C9A84C]/50 cursor-pointer"
                >
                  <User className="h-4 w-4 text-[#C9A84C]" />
                  <span>{user.user_metadata?.full_name || user.email.split('@')[0]}</span>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl bg-zinc-950 border border-white/10 py-2 shadow-xl z-50 text-left">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full px-4 py-2.5 text-xs font-semibold hover:bg-zinc-900 hover:text-[#C9A84C] border-b border-white/5"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block w-full px-4 py-2.5 text-xs font-semibold hover:bg-zinc-900 hover:text-[#C9A84C]"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={async () => {
                        setDropdownOpen(false);
                        await logout();
                        navigate('/');
                      }}
                      className="block w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-zinc-900 hover:text-red-400 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-[#C9A84C] px-3 py-2 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-bold uppercase tracking-wider text-black bg-[#C9A84C] hover:brightness-110 px-4 py-2 rounded-xl transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            <a
              href="#offer"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-105"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Claim Offer
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative text-gray-300 hover:text-[#E8C97E] transition-colors duration-300">
              <Heart className="h-5.5 w-5.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="relative text-gray-300 hover:text-[#E8C97E]">
              <ShoppingBag className="h-5.5 w-5.5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A84C] text-[9px] font-bold text-black">
                  {getCartCount()}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-1 cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[72px] bg-[#0c0c0f] border-b border-white/5 py-6 px-4 transition-all duration-300 z-50 ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        {/* Mobile Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-xl bg-zinc-950 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <NavLink to="/products" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Shop Catalog</NavLink>
          <NavLink to="/beard-care" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Beard Care</NavLink>
          <NavLink to="/hair-care" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Hair Care</NavLink>
          <NavLink to="/skincare" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Skincare Essentials</NavLink>
          <NavLink to="/reviews" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Customer Reviews</NavLink>
          <NavLink to="/contact" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Contact Us</NavLink>
          <NavLink to="/custom-grooming" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Custom Grooming</NavLink>

          <div className="mt-6 border-t border-white/5 pt-4 flex flex-col gap-3">
            {isAdmin ? (
              <div className="space-y-3">
                <div className="text-zinc-400 text-xs font-semibold px-1">
                  Signed in as Administrator <span className="text-[#C9A84C]">{user?.user_metadata?.full_name || user?.email || 'Staff'}</span>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] text-black py-3 text-sm font-bold uppercase tracking-wider"
                  >
                    <ShieldAlert className="h-4 w-4" /> Admin Panel
                  </Link>
                  <button
                    onClick={async () => {
                      setIsOpen(false);
                      await logout();
                      navigate('/');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-950/40 border border-red-500/20 py-3 text-sm font-bold uppercase tracking-wider text-red-400 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : user ? (
              <div className="space-y-3">
                <div className="text-zinc-400 text-xs font-semibold px-1">
                  Signed in as <span className="text-[#C9A84C]">{user.user_metadata?.full_name || user.email}</span>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-white/10 py-3 text-sm font-bold uppercase tracking-wider text-white"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={async () => {
                      setIsOpen(false);
                      await logout();
                      navigate('/');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-950/40 border border-red-500/20 py-3 text-sm font-bold uppercase tracking-wider text-red-400 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-white/10 py-3 text-sm font-bold uppercase tracking-wider text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] text-black py-3 text-sm font-bold uppercase tracking-wider"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <a
              href="#offer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] py-3 text-sm font-bold uppercase tracking-wider text-black"
            >
              <Sparkles className="h-4 w-4" /> Get 20% Off
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
