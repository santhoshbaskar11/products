import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Check, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#050507] border-t border-white/5 pt-20 pb-8 text-left relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#C9A84C]/2 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section: Branding & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          
          {/* Logo / Brand Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 cursor-pointer group">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-black font-extrabold shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                👑
              </span>
              <div>
                <span className="text-xl font-bold tracking-widest text-white block font-serif">
                  SOVEREIGN
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#C9A84C] block -mt-1 font-semibold uppercase">
                  Grooming Co.
                </span>
              </div>
            </div>
            
            <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-sm">
              Crafting premium organic products tailored for the discerning gentleman. Empowering your style, beard, hair, and skin health daily with botanical science.
            </p>

            <div className="flex gap-4">
              {['facebook', 'instagram', 'twitter', 'youtube'].map((platform) => (
                <a
                  key={platform}
                  href={`#${platform}`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 border border-white/5 text-gray-400 hover:text-[#C9A84C] hover:border-[#C9A84C]/40 transition-all duration-300"
                >
                  <span className="text-xs uppercase font-bold tracking-wider">{platform[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Box (7 Cols) */}
          <div className="lg:col-span-7 bg-zinc-900/25 border border-white/5 rounded-3xl p-8 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-[#E8C97E]">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Join the Sovereign Club</span>
            </div>
            <h3 className="text-xl font-bold text-white font-serif">
              Subscribe to unlock 15% off your next purchase
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              Get notified of new special edition scents, barber tips, and member-only secret sales.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md pt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-xl bg-zinc-950 border border-white/10 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A84C] transition-colors"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="flex h-11 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-black font-bold transition-all duration-300 hover:brightness-110 shrink-0"
              >
                {subscribed ? <Check className="h-5 w-5" /> : <Send className="h-5 w-5" />}
              </button>
            </form>
          </div>

        </div>

        {/* Middle Section: Site Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E8C97E]">Collections</h4>
            <ul className="space-y-2.5">
              <li><Link to="/beard-care" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Beard Grooming</Link></li>
              <li><Link to="/hair-care" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Hair Care & Styling</Link></li>
              <li><Link to="/skincare" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Skincare Essentials</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E8C97E]">About Us</h4>
            <ul className="space-y-2.5">
              <li><a href="#story" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Our Heritage</a></li>
              <li><a href="#ingredients" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Ingredients Source</a></li>
              <li><a href="#barber" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">The Barber Program</a></li>
              <li><a href="#careers" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Careers</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E8C97E]">Customer Care</h4>
            <ul className="space-y-2.5">
              <li><a href="#shipping" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Shipping & Delivery</a></li>
              <li><a href="#returns" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Returns & Exchanges</a></li>
              <li><a href="#faq" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">FAQ Help Center</a></li>
              <li><a href="#contact" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Contact Support</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E8C97E]">Quality Standard</h4>
            <div className="bg-zinc-950 p-4 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <ShieldCheck className="h-4 w-4 text-[#C9A84C]" />
                FDA Approved Lab
              </div>
              <p className="text-[10px] text-zinc-500 font-light">
                All formulations are tested and dermatologically approved, manufactured in standard clean-room laboratories.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 flex items-center gap-1">
            &copy; {new Date().getFullYear()} Sovereign Grooming Co. Handcrafted with <Heart className="h-3 w-3 text-red-500 fill-current" /> for modern gents.
          </p>
          <div className="flex gap-6">
            <a href="#privacy" className="text-xs text-zinc-500 hover:text-zinc-300">Privacy Policy</a>
            <a href="#terms" className="text-xs text-zinc-500 hover:text-zinc-300">Terms of Service</a>
            <a href="#accessibility" className="text-xs text-zinc-500 hover:text-zinc-300">Accessibility</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
