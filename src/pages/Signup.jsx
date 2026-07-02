import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, ShieldCheck, AlertTriangle } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, redirect directly to products catalog
  useEffect(() => {
    if (user) {
      navigate('/products');
    }
  }, [user, navigate]);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      // Automatically redirect to home after successful signup
      navigate('/products');
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-28 bg-[#08080a] min-h-screen flex items-center justify-center relative overflow-hidden text-gray-300">
      
      {/* Background decorative glows */}
      <div className="absolute top-[10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[#C9A84C]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#E8C97E]/3 blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full px-4 relative z-10">
        <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative">
          
          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-black flex items-center justify-center font-extrabold shadow-lg">
              👑
            </div>
            <h2 className="text-2xl font-bold text-white font-serif tracking-wide pt-2">Create Account</h2>
            <p className="text-xs text-zinc-500 font-light">Join Sovereign Grooming Co. to elevate your style routine.</p>
          </div>

          <form onSubmit={handleSignupSubmit} className="space-y-5 text-left">
            {error && (
              <div className="flex gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs items-center leading-relaxed">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-500" />
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-white/5 pt-4 text-center">
            <p className="text-xs text-zinc-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#C9A84C] hover:underline font-semibold ml-1">
                Log In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
