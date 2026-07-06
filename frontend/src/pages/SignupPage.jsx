import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, Mail, Lock, Loader2 } from 'lucide-react';

const SignupPage = ({ setView }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  const [localErr, setLocalErr] = useState('');

  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', color: 'bg-neutral-800', width: 'w-0' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-rose-500', width: 'w-1/3' };
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[$&+,:;=?@#|'<>.^*()%!-]/.test(password);
    if (hasNumbers && hasSymbols && password.length >= 8) {
      return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
    }
    return { label: 'Fair', color: 'bg-amber-500', width: 'w-2/3' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setLocalErr('Please fill out all fields.');
      return;
    }
    if (password.length < 6) {
      setLocalErr('Password must be at least 6 characters.');
      return;
    }

    setLoadingState(true);
    setLocalErr('');
    
    const result = await signup(name, email, password);
    setLoadingState(false);
    
    if (result.success) {
      setView('dashboard');
    } else {
      setLocalErr(result.error);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/5 blur-[100px] rounded-full -z-10"></div>
      
      <div className="glass-panel p-8 rounded-3xl border border-neutral-200/10 w-full max-w-md space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-indigo-600/10 text-indigo-500 items-center justify-center shadow-inner">
            <Sparkles size={20} />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Create Account</h2>
          <p className="text-xs text-neutral-400">Optimize and score your resume automatically</p>
        </div>

        {localErr && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold text-center">
            {localErr}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
              <User size={12} /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              className="w-full px-4 py-3 rounded-xl bg-neutral-200/5 dark:bg-neutral-900/40 border border-neutral-200/10 focus:border-indigo-500 focus:outline-none text-sm transition"
              required
            />
          </div>

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
            
            {/* Password strength meter */}
            {password && (
              <div className="space-y-1 pt-1">
                <div className="h-1 w-full bg-neutral-200/10 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`}></div>
                </div>
                <p className="text-[10px] text-neutral-500 text-right">
                  Strength: <span className="font-semibold">{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loadingState}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 glow-btn"
          >
            {loadingState ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="border-t border-neutral-200/10 pt-4 text-center text-xs text-neutral-500">
          <p>
            Already have an account?{' '}
            <button 
              onClick={() => setView('login')} 
              className="text-indigo-500 hover:underline font-semibold"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
