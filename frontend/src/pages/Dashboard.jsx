import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { CardSkeleton, ListSkeleton } from '../components/Skeleton';
import { 
  FileText, 
  TrendingUp, 
  Percent, 
  UserCheck, 
  Plus, 
  ArrowUpRight, 
  ArrowRight,
  Sparkles,
  Calendar,
  Layers
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

const Dashboard = ({ setView, setSelectedResumeId }) => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/resumes');
        if (res.data.success) {
          setResumes(res.data.data);
        }
      } catch (err) {
        console.error('[Dashboard] Error fetching resume history:', err.message);
        setError('Could not fetch upload history.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalUploads = resumes.length;
  
  const avgAtsScore = totalUploads > 0 
    ? Math.round(resumes.reduce((acc, r) => acc + r.atsScore, 0) / totalUploads)
    : 0;

  const totalJobMatches = totalUploads > 0
    ? resumes.reduce((acc, r) => acc + (r.jobMatches?.length || 0), 0)
    : 0;

  const handleSelectResume = (id) => {
    setSelectedResumeId(id);
    setView('upload'); // Switch view to Resume Upload Detail tab
  };

  const handleMatchResume = (id) => {
    setSelectedResumeId(id);
    setView('matching'); // Switch to job matching view
  };

  // Convert resumes to timeline chart data (chronological order)
  const chartData = [...resumes]
    .reverse()
    .map((r, i) => ({
      name: `Upload ${i + 1}`,
      score: r.atsScore,
      date: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-[300px] bg-neutral-200/5 dark:bg-neutral-800/10 rounded-2xl animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <ListSkeleton rows={3} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">Hello, {user.name}</h1>
          <p className="text-sm text-neutral-400">Track and review your resume parser scores</p>
        </div>
        <button
          onClick={() => setView('upload')}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition-all glow-btn"
        >
          <Plus size={14} /> Upload New Resume
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="space-y-2">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-semibold">Total Resumes</span>
            <FileText size={18} className="text-indigo-500" />
          </div>
          <p className="text-3xl font-bold font-display">{totalUploads}</p>
          <p className="text-[10px] text-neutral-400">Parsed PDF and Word assets</p>
        </GlassCard>

        <GlassCard className="space-y-2">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-semibold">Average ATS Rating</span>
            <TrendingUp size={18} className={avgAtsScore >= 80 ? 'text-emerald-500' : 'text-amber-500'} />
          </div>
          <p className={`text-3xl font-bold font-display ${
            avgAtsScore >= 80 ? 'text-emerald-500' : avgAtsScore >= 60 ? 'text-amber-500' : 'text-neutral-300'
          }`}>
            {avgAtsScore || '—'} <span className="text-xs font-normal text-neutral-500">/ 100</span>
          </p>
          <p className="text-[10px] text-neutral-400">
            {avgAtsScore >= 80 ? '🎉 Optimal scanner clearance' : '⚠️ Refinements suggested'}
          </p>
        </GlassCard>

        <GlassCard className="space-y-2">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-semibold">Job Descriptions Matched</span>
            <Layers size={18} className="text-violet-500" />
          </div>
          <p className="text-3xl font-bold font-display">{totalJobMatches}</p>
          <p className="text-[10px] text-neutral-400">Target role overlap evaluations</p>
        </GlassCard>

        <GlassCard className="space-y-2">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-semibold">Profile Completion</span>
            <Percent size={18} className="text-indigo-500" />
          </div>
          <p className="text-3xl font-bold font-display">{user.profileCompletion}%</p>
          <div className="h-1.5 w-full bg-neutral-200/10 dark:bg-neutral-800 rounded-full overflow-hidden mt-1.5">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500" 
              style={{ width: `${user.profileCompletion}%` }}
            ></div>
          </div>
        </GlassCard>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATS Score Trend */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-semibold text-sm">ATS Parser Trend</h3>
              <p className="text-xs text-neutral-400">Chronological ATS score performance changes</p>
            </div>
            
            {chartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(18, 18, 18, 0.85)', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#fff'
                      }} 
                    />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border border-dashed border-neutral-200/10 rounded-xl space-y-3">
                <p className="text-xs text-neutral-400">No chart details. Upload resumes to map scores.</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Recent Uploads */}
        <div>
          <GlassCard className="h-full flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-sm">Recent Analyses</h3>
                <p className="text-xs text-neutral-400">Your latest uploads</p>
              </div>
              {totalUploads > 0 && (
                <button 
                  onClick={() => setView('analytics')} 
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
                >
                  All Details <ArrowRight size={12} className="group-hover:translate-x-0.5 transition" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[250px] pr-1">
              {resumes.length > 0 ? (
                resumes.slice(0, 4).map((resume) => (
                  <div
                    key={resume._id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-200/5 dark:bg-neutral-800/15 border border-neutral-200/10 hover:border-neutral-200/20 transition cursor-pointer group"
                    onClick={() => handleSelectResume(resume._id)}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate max-w-[120px] sm:max-w-[165px]">
                          {resume.filename}
                        </p>
                        <p className="text-[9px] text-neutral-400 flex items-center gap-1">
                          <Calendar size={8} /> {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        resume.atsScore >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                        resume.atsScore >= 60 ? 'bg-amber-500/10 text-amber-500' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        {resume.atsScore}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMatchResume(resume._id);
                        }}
                        className="p-1 rounded bg-neutral-200/10 dark:bg-neutral-800 hover:bg-indigo-600 hover:text-white transition"
                        title="Match with Job Description"
                      >
                        <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-8 text-center space-y-2 border border-dashed border-neutral-200/10 rounded-xl">
                  <Sparkles size={20} className="text-neutral-500" />
                  <p className="text-xs text-neutral-400 font-medium">No resumes found</p>
                  <button
                    onClick={() => setView('upload')}
                    className="text-[10px] text-indigo-500 hover:underline font-semibold"
                  >
                    Upload and get parsed rating
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
