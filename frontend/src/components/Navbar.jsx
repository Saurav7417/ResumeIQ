import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';

const Navbar = ({ currentView, setView }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="glass-panel sticky top-0 z-40 border-b border-neutral-200/10 px-6 py-4 flex items-center justify-between">
      <div 
        className="flex items-center space-x-3 cursor-pointer" 
        onClick={() => setView('landing')}
      >
        <span className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
          R
        </span>
        <span className="font-display font-bold text-xl tracking-tight hidden sm:inline-block">
          Resume<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-400">IQ</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-neutral-200/10 hover:bg-neutral-200/5 dark:hover:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 transition"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <div className="flex items-center space-x-3 border-l border-neutral-200/10 pl-4">
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => setView('profile')}
            >
              <div className="h-8 w-8 rounded-full bg-neutral-200/10 dark:bg-neutral-800/60 border border-neutral-200/10 flex items-center justify-center text-indigo-500 group-hover:border-indigo-500 transition">
                <UserIcon size={14} />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold leading-tight">{user.name}</p>
                <p className="text-[10px] text-neutral-400 leading-none">{user.role}</p>
              </div>
            </div>
            
            {user.role === 'admin' && (
              <button
                onClick={() => setView('admin')}
                className={`p-2 rounded-xl text-amber-500 hover:bg-amber-500/10 transition ${
                  currentView === 'admin' ? 'bg-amber-500/10' : ''
                }`}
                title="Admin Control Center"
              >
                <ShieldAlert size={18} />
              </button>
            )}

            <button
              onClick={logout}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setView('login')}
              className="px-4 py-2 text-sm font-medium hover:text-indigo-500 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => setView('signup')}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition shadow-sm"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
