import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="w-20 h-20 rounded-3xl bg-brand-600 flex items-center justify-center shadow-xl shadow-brand-500/30 mb-6">
        <MessageSquare className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black tracking-tight text-white mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-200 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm mb-8">
        The page you are looking for doesn't exist or has been moved to another location.
      </p>
      <Link
        to="/chat"
        className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-2xl shadow-lg shadow-brand-500/25 transition-all"
      >
        <Home className="w-5 h-5" />
        <span>Return to ConnectHub</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
