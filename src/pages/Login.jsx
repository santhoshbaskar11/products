import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, User, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, adminLogin, user, adminUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect directly to original page or products catalog
  useEffect(() => {
    if (user) {
      const origin = location.state?.from?.pathname || '/products';
      navigate(origin);
    } else if (adminUser) {
      navigate('/admin');
    }
  }, [user, adminUser, navigate, location]);

  const handleUserLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      const origin = location.state?.from?.pathname || '/products';
      navigate(origin);
    } catch (err) {
      console.error('User login error:', err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    const success = adminLogin(adminUsername, adminPassword);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid admin credentials. Please use admin / password.');
    }
  };

  return (
    <div className="py-28 bg-[#08080a] min-h-screen flex items-center justify-center relative overflow-hidden text-gray-300">
      
      {/* Background decoration glows */}
      <div className="absolute top-[10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[#C9A84C]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#E8C97E]/3 blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full px-4 relative z-10">
        <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-black flex items-center justify-center font-extrabold shadow-lg">
              🔑
            </div>
            <h2 className="text-2xl font-bold text-white font-serif tracking-wide pt-2">
              {isAdminMode ? 'Admin Portal Login' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-zinc-500 font-light">
              {isAdminMode 
                ? 'Authorized administration staff credentials required.' 
                : 'Sign in to access your orders, cart, and premium club benefits.'
              }
            </p>
          </div>

          {error && (
            <div className="flex gap-2.5 p-4 mb-5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs items-center leading-relaxed">
              <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Standard User Login Form */}
          {!isAdminMode ? (
            <form onSubmit={handleUserLoginSubmit} className="space-y-5 text-left">
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-500" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <span>Authenticating...</span> : 'Sign In'}
                </button>
              </div>

              <div className="mt-8 border-t border-white/5 pt-4 text-center">
                <p className="text-xs text-zinc-500">
                  New to Sovereign?{' '}
                  <Link to="/signup" className="text-[#C9A84C] hover:underline font-semibold ml-1">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            /* Admin staff login form */
            <form onSubmit={handleAdminLoginSubmit} className="space-y-5 text-left">
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="admin"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Authenticate Staff
                </button>
              </div>

              <div className="mt-4 border-t border-white/5 pt-4 text-center">
                <p className="text-[10px] text-zinc-500 font-light">
                  Demo Credentials: <strong className="text-zinc-400">admin</strong> / <strong className="text-zinc-400">password</strong>
                </p>
              </div>
            </form>
          )}

          {/* Toggle administrative bypass view */}
          <div className="mt-6 border-t border-white/5 pt-4 flex justify-center">
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setError('');
              }}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C9A84C]/80 hover:text-[#C9A84C] cursor-pointer"
            >
              {isAdminMode ? (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Customer Access Sign In
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Administrative Portal Access
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
