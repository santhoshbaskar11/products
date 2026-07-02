import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, ShieldCheck, LogOut } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="py-32 bg-[#08080a] min-h-screen text-center flex items-center justify-center">
        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 max-w-sm w-full mx-4">
          <p className="text-gray-400 text-sm mb-4">Please log in to view your profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="rounded-xl bg-[#C9A84C] text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const name = user.user_metadata?.full_name || 'Valued Member';
  const createdDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A';

  return (
    <div className="py-28 bg-[#08080a] min-h-screen relative overflow-hidden text-gray-300">
      
      {/* Decorative Radial Background */}
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-[#C9A84C]/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 relative z-10">
        
        <SectionHeader
          badge="Member Club"
          title="Your Profile"
          subtitle="Manage your Sovereign member account details and preferences below."
        />

        <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-8 text-left mt-8">
          
          {/* Avatar and name section */}
          <div className="flex items-center gap-5 border-b border-white/5 pb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-black flex items-center justify-center text-2xl font-extrabold shadow-lg uppercase">
              {name.slice(0, 1)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-serif">{name}</h3>
              <p className="text-xs text-zinc-500 mt-1">Sovereign Club Member since {createdDate}</p>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-zinc-400">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Full Name</span>
                <span className="text-sm font-semibold text-white mt-0.5 block">{name}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-zinc-400">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Email Address</span>
                <span className="text-sm font-semibold text-white mt-0.5 block">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-[#C9A84C]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Account Status</span>
                <span className="text-xs font-semibold text-emerald-400 mt-0.5 block flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 block"></span>
                  Verified & Active
                </span>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="border-t border-white/5 pt-6 flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
