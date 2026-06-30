import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Lock, User, AlertTriangle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, adminUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, redirect directly to admin panel
  useEffect(() => {
    if (adminUser) {
      navigate('/admin');
    }
  }, [adminUser, navigate]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    const success = login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid admin credentials. Please use admin / password.');
    }
  };

  return (
    <div className="py-28 bg-[#08080a] min-h-screen flex items-center justify-center relative overflow-hidden">
      
      {/* Background decoration glows */}
      <div className="absolute top-[10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[#C9A84C]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#E8C97E]/3 blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full px-4 relative z-10">
        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
          
          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-black flex items-center justify-center font-extrabold shadow-lg">
              🔑
            </div>
            <h2 className="text-2xl font-bold text-white font-serif tracking-wide pt-2">Admin Portal Login</h2>
            <p className="text-xs text-zinc-500 font-light">Authorized administration staff credentials required.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6 text-left">
            {error && (
              <div className="flex gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs items-center leading-relaxed">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                Authenticate Account
              </button>
            </div>
          </form>

          {/* Quick instructions for helper convenience */}
          <div className="mt-8 border-t border-white/5 pt-4 text-center">
            <p className="text-[10px] text-zinc-500 font-light">
              Demo Credentials: <strong className="text-zinc-400">admin</strong> / <strong className="text-zinc-400">password</strong>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
