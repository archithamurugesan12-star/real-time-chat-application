import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">CONNECT</span>
              <span className="font-bold text-lg text-brand-600 tracking-tight">HUB</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-1">
              Real-Time Chat
            </p>
          </div>
        </Link>

        {/* Navigation Links & User Menu */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-3 sm:gap-4">
            {isAdmin && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}

            <Link
              to="/chat"
              className="p-2 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition-all"
            >
              <Avatar src={user.avatar} name={user.name} size="sm" isOnline={true} showStatus={true} />
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline max-w-[120px] truncate">
                {user.name}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
