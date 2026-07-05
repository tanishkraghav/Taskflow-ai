import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, CheckSquare, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-panel sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 shadow-md">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-600/20 text-indigo-400 p-2 rounded-xl border border-indigo-500/30 flex items-center justify-center animate-pulse-slow">
          <CheckSquare className="w-6 h-6" />
        </div>
        <div>
          <span className="font-display font-bold text-lg tracking-wider bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent flex items-center gap-1.5">
            TaskFlow AI <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" /> v1.0</span>
          </span>
        </div>
      </div>

      {user && (
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-xs text-slate-400">Signed in as</span>
            <span className="text-sm font-medium text-slate-200">{user.name}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-300 text-xs px-3.5 py-2 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
