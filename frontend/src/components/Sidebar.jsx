import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Briefcase, 
  BarChart3, 
  User, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ currentView, setView }) => {
  const { user } = useAuth();

  if (!user) return null;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Resume Analyzer', icon: UploadCloud },
    { id: 'matching', label: 'Job Matching', icon: Briefcase },
    { id: 'analytics', label: 'Analytics Hub', icon: BarChart3 },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  if (user.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin Telemetry', icon: ShieldCheck });
  }

  return (
    <aside className="w-64 border-r border-neutral-200/10 min-h-[calc(100vh-73px)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        <div className="px-3">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Workspace Nav
          </p>
        </div>
        
        <nav className="space-y-1.5">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/5 dark:hover:bg-neutral-800/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-neutral-500 group-hover:text-indigo-500 transition'} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight 
                  size={14} 
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-white/60' : 'text-neutral-400'}`} 
                />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-neutral-200/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">ATS Score Peak</span>
          <span className="text-xs font-bold bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded">PRO</span>
        </div>
        <p className="text-xs text-neutral-400">Upgrade to analyze resumes using full-scale GPT-4/Claude models.</p>
        <button className="w-full text-center py-2 bg-neutral-200/5 dark:bg-neutral-800/40 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold transition border border-neutral-200/10">
          Upgrade Now
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
