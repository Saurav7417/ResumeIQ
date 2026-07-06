import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { Shimmer, ListSkeleton } from '../components/Skeleton';
import { 
  ShieldAlert, 
  Users, 
  Layers, 
  TrendingUp, 
  Cpu, 
  Key,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.stats);
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error('[Admin] Telemetry load error:', err.message);
        setError('Unauthorized: Admin access credentials required.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Shimmer className="h-8 w-1/4 bg-neutral-200/10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Shimmer className="h-28 bg-neutral-200/10" />
          <Shimmer className="h-28 bg-neutral-200/10" />
          <Shimmer className="h-28 bg-neutral-200/10" />
        </div>
        <ListSkeleton rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard className="border border-rose-500/20 text-center py-12 space-y-3">
        <ShieldAlert className="mx-auto text-rose-500 animate-bounce" size={36} />
        <h3 className="font-bold text-sm text-rose-500">Access Denied</h3>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">{error}</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="flex items-center space-x-3.5">
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/15">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display flex items-center gap-2">
            Admin Telemetry Control
          </h1>
          <p className="text-sm text-neutral-400">Monitoring application registries, parsed file telemetry, and token metrics</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="space-y-2">
            <div className="flex justify-between items-center text-neutral-400">
              <span className="text-xs font-semibold">Total Registered Users</span>
              <Users size={18} className="text-indigo-500" />
            </div>
            <p className="text-3xl font-bold font-display">{stats.totalUsers}</p>
            <p className="text-[10px] text-neutral-400">Active account directories</p>
          </GlassCard>

          <GlassCard className="space-y-2">
            <div className="flex justify-between items-center text-neutral-400">
              <span className="text-xs font-semibold">Total Parsed Resumes</span>
              <Layers size={18} className="text-indigo-500" />
            </div>
            <p className="text-3xl font-bold font-display">{stats.totalAnalyses}</p>
            <p className="text-[10px] text-neutral-400">Total document uploads parsed</p>
          </GlassCard>

          <GlassCard className="space-y-2">
            <div className="flex justify-between items-center text-neutral-400">
              <span className="text-xs font-semibold">Global ATS Score Avg</span>
              <TrendingUp size={18} className="text-emerald-500" />
            </div>
            <p className="text-3xl font-bold font-display text-emerald-500">{stats.averageAtsScore} <span className="text-xs font-normal text-neutral-500">/ 100</span></p>
            <p className="text-[10px] text-neutral-400">System database average rating</p>
          </GlassCard>
        </div>
      )}

      {/* API Usage & Users list Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Users list table */}
        <div className="lg:col-span-2">
          <GlassCard className="space-y-4">
            <h3 className="font-semibold text-sm">Registered Users Directory</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200/10 text-neutral-400">
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3 text-right">Completeness</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id || u._id} className="border-b border-neutral-200/5 hover:bg-neutral-200/5 dark:hover:bg-neutral-800/10 transition">
                      <td className="py-3 px-3 font-semibold text-neutral-200">{u.name}</td>
                      <td className="py-3 px-3 text-neutral-400 font-mono">{u.email}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' 
                            ? 'bg-amber-500/10 text-amber-500' 
                            : 'bg-neutral-200/10 text-neutral-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-indigo-400">{u.profileCompletion}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* API Usage telemetry graph */}
        {stats?.apiUsage && (
          <div className="space-y-6">
            <GlassCard className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm">Gemini Token Traffic</h3>
                <p className="text-xs text-neutral-400">AI api usage tokens processed monthly</p>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.apiUsage.trend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tokenColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(18, 18, 18, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#fff'
                      }} 
                    />
                    <Area type="monotone" dataKey="tokens" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#tokenColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="border-t border-neutral-200/10 pt-3.5 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-neutral-400 font-medium flex items-center gap-1.5"><Cpu size={12} /> API Hits</p>
                  <p className="font-bold text-neutral-200 mt-0.5">{stats.apiUsage.totalRequests.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-neutral-400 font-medium flex items-center gap-1.5"><Key size={12} /> Total Tokens</p>
                  <p className="font-bold text-neutral-200 mt-0.5">{(stats.apiUsage.totalTokens / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4 border border-emerald-500/10 flex items-center gap-3">
              <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
              <div className="text-xs">
                <p className="font-semibold text-emerald-500 leading-none">Security Audits Active</p>
                <p className="text-neutral-400 mt-1">All data traffic runs under SSL encryption standards.</p>
              </div>
            </GlassCard>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
