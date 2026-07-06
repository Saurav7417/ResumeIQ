import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { Shimmer } from '../components/Skeleton';
import { 
  Briefcase, 
  ChevronDown, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Award,
  BookOpen
} from 'lucide-react';

const JobMatching = ({ selectedResumeId, setSelectedResumeId }) => {
  const [resumes, setResumes] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [matchingState, setMatchingState] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localErr, setLocalErr] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/resumes');
        if (res.data.success) {
          setResumes(res.data.data);
          // Auto select latest if none selected
          if (!selectedResumeId && res.data.data.length > 0) {
            setSelectedResumeId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('[JobMatching] Failed to load list:', err.message);
        setLocalErr('Failed to retrieve upload history.');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) {
      setLocalErr('Please select or upload a resume to match.');
      return;
    }
    if (!jobDescription || jobDescription.trim() === '') {
      setLocalErr('Please paste a job description.');
      return;
    }

    setLocalErr('');
    setMatchingState(true);
    setMatchResult(null);

    try {
      const res = await api.post(`/resumes/${selectedResumeId}/match`, { jobDescription });
      if (res.data.success) {
        setMatchResult(res.data.data);
      }
    } catch (err) {
      console.error('[JobMatching] Failed matching:', err.message);
      setLocalErr('Failed to execute job matching analysis.');
    } finally {
      setMatchingState(false);
    }
  };

  const activeResume = resumes.find(r => r._id === selectedResumeId);

  if (loading) {
    return (
      <div className="space-y-6">
        <Shimmer className="h-10 w-1/4 bg-neutral-200/10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Shimmer className="h-64 w-full bg-neutral-200/10" />
          </div>
          <div className="space-y-4">
            <Shimmer className="h-64 w-full bg-neutral-200/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">Job Description Matching</h1>
        <p className="text-sm text-neutral-400">Evaluate alignment with target job specifications</p>
      </div>

      {localErr && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
          {localErr}
        </div>
      )}

      {resumes.length === 0 ? (
        <GlassCard className="text-center py-12 space-y-3">
          <Briefcase className="mx-auto text-neutral-500" size={32} />
          <h3 className="font-semibold text-sm">No Resume Uploads Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            You must upload and parse a resume before matching against job descriptions.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Match Form Side */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase">1. Select Target Resume</label>
                <div className="relative">
                  <select
                    value={selectedResumeId || ''}
                    onChange={(e) => {
                      setSelectedResumeId(e.target.value);
                      setMatchResult(null);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-200/5 dark:bg-neutral-900/40 border border-neutral-200/10 focus:border-indigo-500 focus:outline-none text-sm transition appearance-none cursor-pointer"
                  >
                    {resumes.map(r => (
                      <option key={r._id} value={r._id} className="dark:bg-neutral-950">
                        {r.filename} (ATS: {r.atsScore})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-neutral-400 pointer-events-none" size={16} />
                </div>
              </div>

              <form onSubmit={handleMatchSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase">2. Paste Job Description</label>
                  <textarea
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description details here to extract keyword weights..."
                    className="w-full px-4 py-3 rounded-xl bg-neutral-200/5 dark:bg-neutral-900/40 border border-neutral-200/10 focus:border-indigo-500 focus:outline-none text-xs transition leading-relaxed"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={matchingState}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold rounded-xl text-xs shadow transition glow-btn flex items-center justify-center gap-2"
                >
                  {matchingState ? 'Calculating Match Alignment...' : 'Scan Job Spec Match'}
                </button>
              </form>
            </GlassCard>

            {/* Display parsed match details */}
            {matchResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Missing Skills */}
                <GlassCard className="space-y-4 border border-rose-500/10">
                  <h3 className="font-semibold text-sm text-rose-500 flex items-center gap-2">
                    <AlertCircle size={16} /> Skills Mismatches
                  </h3>
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    These items are flagged in the job listing details but were not detected in your resume context:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.missingSkills?.map((skill, idx) => (
                      <span key={idx} className="text-xs bg-rose-500/5 text-rose-500 border border-rose-500/10 px-2.5 py-1 rounded-lg font-semibold">
                        {skill}
                      </span>
                    )) || <span className="text-xs text-neutral-500">None mapped</span>}
                  </div>
                </GlassCard>

                {/* Recommended Keywords */}
                <GlassCard className="space-y-4 border border-indigo-500/10">
                  <h3 className="font-semibold text-sm text-indigo-400 flex items-center gap-2">
                    <Sparkles size={16} /> Suggested Keywords
                  </h3>
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    Add these terms to descriptions or projects to trigger ATS keyword matching:
                  </p>
                  <ul className="space-y-2">
                    {matchResult.suggestedKeywords?.map((kw, idx) => (
                      <li key={idx} className="text-xs text-neutral-300 flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-indigo-400 shrink-0" />
                        <span>{kw}</span>
                      </li>
                    )) || <li>None mapped</li>}
                  </ul>
                </GlassCard>
              </div>
            )}
          </div>

          {/* Results Summary Gauge Side */}
          <div>
            {matchingState && (
              <GlassCard className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-xs text-neutral-400">Comparing skill matrices...</p>
              </GlassCard>
            )}

            {!matchResult && !matchingState && activeResume && (
              <GlassCard className="text-center py-12 space-y-3">
                <Target className="mx-auto text-neutral-500" size={32} />
                <h3 className="font-semibold text-xs text-neutral-400">Ready for Scan</h3>
                <p className="text-[10px] text-neutral-500">
                  Select a resume and paste a job specification details to begin comparison telemetry.
                </p>
              </GlassCard>
            )}

            {matchResult && !matchingState && (
              <div className="space-y-6">
                <GlassCard className="flex flex-col items-center justify-center text-center space-y-4">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Alignment Rating</span>
                  
                  <div className="relative h-28 w-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-neutral-200/10"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-indigo-500 transition-all duration-1000 ease-out"
                        strokeDasharray={`${matchResult.matchPercentage}, 100`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-2xl font-bold font-display">{matchResult.matchPercentage}%</div>
                  </div>

                  <p className={`text-xs font-semibold ${
                    matchResult.matchPercentage >= 80 ? 'text-emerald-500' :
                    matchResult.matchPercentage >= 60 ? 'text-amber-500' :
                    'text-rose-500'
                  }`}>
                    {matchResult.matchPercentage >= 80 ? 'High Compatibility' :
                     matchResult.matchPercentage >= 60 ? 'Moderate Compatibility' :
                     'Low Compatibility'}
                  </p>
                </GlassCard>

                {/* Recommended Certifications */}
                <GlassCard className="space-y-4">
                  <h3 className="font-semibold text-xs font-bold text-neutral-400 uppercase flex items-center gap-2">
                    <Award size={14} className="text-violet-400" /> Recommended Certifications
                  </h3>
                  <div className="space-y-3.5">
                    {matchResult.recommendedCertifications?.map((cert, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-neutral-200/5 dark:bg-neutral-800/10 border border-neutral-200/10 rounded-xl">
                        <BookOpen size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-neutral-200">{cert}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">Increases resume screening weight.</p>
                        </div>
                      </div>
                    )) || <span className="text-xs text-neutral-500">None suggested</span>}
                  </div>
                </GlassCard>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
};

export default JobMatching;
