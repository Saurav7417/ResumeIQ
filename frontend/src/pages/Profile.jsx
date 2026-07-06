import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { User, Mail, Plus, X, Award, CheckCircle2, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Not Specified');
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setFeedback({ type: '', message: '' });

    const res = await updateProfile({ name, experienceLevel, skills });
    setIsUpdating(false);
    
    if (res.success) {
      setFeedback({ type: 'success', message: 'Profile details updated successfully.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update profile.' });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">Profile Settings</h1>
        <p className="text-sm text-neutral-400">Configure your target professional context and skill profile</p>
      </div>

      {feedback.message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
        }`}>
          <CheckCircle2 size={16} />
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Card: Summary completeness */}
        <div className="space-y-6">
          <GlassCard className="text-center space-y-4 flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/15 flex items-center justify-center font-bold text-2xl">
              {user.name.charAt(0)}
            </div>
            
            <div>
              <h3 className="font-semibold text-sm leading-snug">{user.name}</h3>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{user.email}</p>
            </div>

            <div className="w-full space-y-2 border-t border-neutral-200/10 pt-4 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Profile complete:</span>
                <span className="font-bold text-indigo-500">{user.profileCompletion}%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-200/10 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500" 
                  style={{ width: `${user.profileCompletion}%` }}
                ></div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase flex items-center gap-2">
              <Award size={14} className="text-violet-400" /> Account Context
            </h4>
            <div className="text-xs space-y-1.5 text-neutral-400">
              <p>Role Permission: <span className="font-semibold text-neutral-200 uppercase">{user.role}</span></p>
              <p>Member Since: <span className="font-semibold text-neutral-200">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span></p>
            </div>
          </GlassCard>
        </div>

        {/* Right Form Side */}
        <div className="md:col-span-2">
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                    <User size={12} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-200/5 dark:bg-neutral-900/40 border border-neutral-200/10 focus:border-indigo-500 focus:outline-none text-sm transition"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                    <Mail size={12} /> Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-200/5 dark:bg-neutral-800/40 border border-neutral-200/10 text-neutral-500 dark:text-neutral-500 cursor-not-allowed text-sm focus:outline-none"
                    disabled
                  />
                </div>
              </div>

              {/* Target experience level */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-400">Target Experience Rating</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-200/5 dark:bg-neutral-900/40 border border-neutral-200/10 focus:border-indigo-500 focus:outline-none text-sm transition"
                >
                  <option value="Not Specified">Not Specified</option>
                  <option value="Entry Level">Entry Level (0-2 Years)</option>
                  <option value="Mid-Level">Mid-Level (2-5 Years)</option>
                  <option value="Senior Level">Senior Level (5-10 Years)</option>
                  <option value="Executive">Executive / Director (10+ Years)</option>
                </select>
              </div>

              {/* Skill tag list */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-400">Core Professional Skills</label>
                
                {/* Form to add */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill (e.g. Docker, TypeScript)"
                    className="flex-1 px-4 py-2 rounded-xl bg-neutral-200/5 dark:bg-neutral-900/40 border border-neutral-200/10 focus:border-indigo-500 focus:outline-none text-xs transition"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-neutral-200/10 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-semibold transition border border-neutral-200/10 flex items-center gap-1 shrink-0"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>

                {/* Display list tags */}
                <div className="flex flex-wrap gap-1.5 p-3.5 bg-neutral-200/5 dark:bg-neutral-900/20 border border-neutral-200/10 rounded-xl min-h-[70px]">
                  {skills.length > 0 ? (
                    skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center gap-1 text-[11px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/15 px-2.5 py-1 rounded-lg font-medium"
                      >
                        {skill}
                        <button 
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-500 transition"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-500 self-center mx-auto">No skills added yet</span>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold rounded-xl text-xs shadow transition glow-btn flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Updating Profile...
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>

            </form>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default Profile;
