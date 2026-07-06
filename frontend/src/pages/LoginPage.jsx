import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

const LoginPage = ({ setView }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  const [localErr, setLocalErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalErr('Please enter both email and password.');
      return;
    }

    setLoadingState(true);
    setLocalErr('');
    
    const result = await login(email, password);
    setLoadingState(false);
    
    if (result.success) {
      setView('dashboard');
    } else {
      setLocalErr(result.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/5 blur-[100px] rounded-full -z-10"></div>
      
      <div className="glass-panel p-8 rounded-3xl border border-neutral-200/10 w-full max-w-md space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-indigo-600/10 text-indigo-500 items-center justify-center shadow-inner">
            <Sparkles size={20} />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-xs text-neutral-400">Enter your credentials to manage your resumes</p>
        </div>

        {localErr && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold text-center animate-shake">
            {localErr}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
              <Mail size={12} /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl bg-neutral-200/5 dark:bg-neutral-900/40 border border-neutral-200/10 focus:border-indigo-500 focus:outline-none text-sm transition"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
              <Lock size={12} /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-neutral-200/5 dark:bg-neutral-900/40 border border-neutral-200/10 focus:border-indigo-500 focus:outline-none text-sm transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loadingState}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 glow-btn"
          >
            {loadingState ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="border-t border-neutral-200/10 pt-4 flex flex-col items-center gap-2 text-xs text-neutral-500">
          <p>
            Don't have an account?{' '}
            <button 
              onClick={() => setView('signup')} 
              className="text-indigo-500 hover:underline font-semibold"
            >
              Sign up here
            </button>
          </p>
          <div className="flex items-center gap-1.5 text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/10">
            <ShieldCheck size={10} />
            <span>Admin Demo: admin@resumeiq.com / AdminPass123!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
