import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { ChartSkeleton } from '../components/Skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { AreaChart, Area } from 'recharts';
import { FileText, TrendingUp, Layers, HelpCircle, Activity } from 'lucide-react';

const Analytics = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/resumes');
        if (res.data.success) {
          setResumes(res.data.data);
        }
      } catch (err) {
        console.error('[Analytics] Fetch error:', err.message);
        setError('Failed to fetch detailed analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ChartSkeleton />
          </div>
          <div className="md:col-span-2">
            <ChartSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Construct charts data
  const totalUploads = resumes.length;

  // 1. Line / Area Chart - ATS Score Over Time
  const timeData = [...resumes]
    .reverse()
    .map((r, i) => ({
      name: `v${i + 1}`,
      Score: r.atsScore,
      date: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

  // 2. Bar Chart - Skill counts & metrics
  // Group skill metrics for comparison
  const skillsData = resumes.slice(0, 5).map((r, idx) => ({
    name: r.filename.replace(/\.[^/.]+$/, "").substring(0, 10),
    Technical: r.technicalSkills?.length || 0,
    Soft: r.softSkills?.length || 0
  }));

  // 3. Radar Chart - Quality parameter dimensions (latest resume details)
  const latestResume = resumes[0];
  const radarData = latestResume 
    ? [
        { subject: 'Grammar', A: Math.max(25, 100 - (latestResume.grammarSuggestions?.length || 0) * 15), fullMark: 100 },
        { subject: 'Keywords', A: Math.min(100, (latestResume.technicalSkills?.length || 0) * 10), fullMark: 100 },
        { subject: 'ATS Formatting', A: latestResume.atsScore >= 80 ? 95 : latestResume.atsScore >= 60 ? 75 : 55, fullMark: 100 },
        { subject: 'Strengths', A: Math.min(100, (latestResume.strengths?.length || 0) * 30), fullMark: 100 },
        { subject: 'Experience rating', A: latestResume.experienceLevel.includes('Senior') ? 95 : latestResume.experienceLevel.includes('Mid') ? 75 : 55, fullMark: 100 }
      ]
    : [
        { subject: 'Grammar', A: 80, fullMark: 100 },
        { subject: 'Keywords', A: 70, fullMark: 100 },
        { subject: 'ATS Formatting', A: 75, fullMark: 100 },
        { subject: 'Strengths', A: 85, fullMark: 100 },
        { subject: 'Experience rating', A: 60, fullMark: 100 }
      ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">Analytics Dashboard</h1>
        <p className="text-sm text-neutral-400">Deep telemetry view of your optimization metrics</p>
      </div>

      {totalUploads === 0 ? (
        <GlassCard className="text-center py-16 space-y-3">
          <Activity className="mx-auto text-neutral-500" size={32} />
          <h3 className="font-semibold text-sm">Telemetry History Empty</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Upload resumes to populate the telemetry reports, radar ratings, and skill gap lists.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          
          {/* Top Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* ATS Score Improvement */}
            <GlassCard className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm">ATS Rating Progression</h3>
                <p className="text-xs text-neutral-400">Growth curve across uploaded versions</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(18, 18, 18, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#fff'
                      }} 
                    />
                    <Area type="monotone" dataKey="Score" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Radar quality parameters */}
            <GlassCard className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm">Resume Quality Distribution</h3>
                <p className="text-xs text-neutral-400">Current layout capabilities dimensions</p>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" r="80%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.04)" />
                    <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.2)" fontSize={8} />
                    <Radar name="Resume Value" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(18, 18, 18, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#fff'
                      }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

          </div>

          {/* Bottom Skills distribution */}
          <GlassCard className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm">Skills Volume Mapped</h3>
              <p className="text-xs text-neutral-400">Count of technical vs soft skills across recent versions</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(18, 18, 18, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="Technical" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Soft" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

        </div>
      )}
    </div>
  );
};

export default Analytics;
