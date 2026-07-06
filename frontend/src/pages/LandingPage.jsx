import React from 'react';
import { 
  Sparkles, 
  Upload, 
  Target, 
  LineChart, 
  Cpu, 
  CheckCircle,
  FileCheck2,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

const LandingPage = ({ setView }) => {
  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative py-12">
        {/* Glow Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>
        
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-semibold border border-indigo-500/20 shadow-sm animate-pulse">
          <Sparkles size={14} />
          <span>V2.0.0 Release - Now Powered by Gemini 1.5 Pro</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] text-gradient">
          Optimize Your Resume For The Modern AI Recruiting Era
        </h1>
        
        <p className="text-neutral-500 dark:text-neutral-400 text-lg sm:text-xl max-w-2xl mx-auto font-normal">
          Get instant ATS score analysis, skill gap extraction, custom grammar recommendations, and matching feedback tailored directly to target job specs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setView('signup')}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all text-base glow-btn"
          >
            Optimize For Free
          </button>
          <button
            onClick={() => setView('login')}
            className="w-full sm:w-auto px-8 py-4 bg-neutral-200/5 dark:bg-neutral-800/40 hover:bg-neutral-200/10 dark:hover:bg-neutral-800/60 text-neutral-900 dark:text-white font-semibold rounded-2xl border border-neutral-200/10 transition-all text-base"
          >
            Sign In Account
          </button>
        </div>

        {/* Dashboard Preview Widget */}
        <div className="pt-16 max-w-5xl mx-auto">
          <div className="glass-panel p-2 rounded-3xl border border-neutral-200/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
            <div className="bg-neutral-100/50 dark:bg-neutral-950/60 p-6 rounded-2xl border border-neutral-200/10 space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-200/10 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500"></span>
                  <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                  <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-xs text-neutral-500 bg-neutral-200/10 dark:bg-neutral-800/40 px-3 py-1 rounded-full">
                  demo_developer_resume_v2.pdf
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-5 rounded-2xl bg-neutral-200/5 dark:bg-neutral-900/30 border border-neutral-200/10 space-y-2">
                  <p className="text-xs text-neutral-400">ATS Rating Score</p>
                  <p className="text-3xl font-display font-extrabold text-emerald-500">89 / 100</p>
                  <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <TrendingUp size={10} /> +12% increase from v1
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-neutral-200/5 dark:bg-neutral-900/30 border border-neutral-200/10 space-y-2">
                  <p className="text-xs text-neutral-400">Target Role Match</p>
                  <p className="text-3xl font-display font-extrabold text-indigo-500">92% Match</p>
                  <p className="text-[10px] text-neutral-400">Senior Full-Stack Engineer</p>
                </div>
                <div className="p-5 rounded-2xl bg-neutral-200/5 dark:bg-neutral-900/30 border border-neutral-200/10 space-y-2">
                  <p className="text-xs text-neutral-400">Missing Key Skills</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-medium">Docker</span>
                    <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-medium">CI/CD</span>
                    <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-medium">AWS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-display text-3xl font-bold tracking-tight">Features Tailored For High-Impact Careers</h2>
          <p className="text-neutral-400 max-w-lg mx-auto text-sm">
            ResumeIQ uses generative models to crawl, score, and rebuild resume elements inside modern applicant systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-neutral-200/10 space-y-4 hover:border-indigo-500/40 transition">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Upload size={20} />
            </div>
            <h3 className="font-semibold text-lg">Instant File Parsing</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Drag and drop PDF or DOCX documents to extract formatting details and sections instantly.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-neutral-200/10 space-y-4 hover:border-indigo-500/40 transition">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Cpu size={20} />
            </div>
            <h3 className="font-semibold text-lg">ATS Optimization</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Compare structure, syntax, and formatting against standard patterns to identify scanner bugs.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-neutral-200/10 space-y-4 hover:border-indigo-500/40 transition">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Target size={20} />
            </div>
            <h3 className="font-semibold text-lg">Job Description Match</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Paste specific job descriptions to map missing keywords, skills, and certifications.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-neutral-200/10 space-y-4 hover:border-indigo-500/40 transition">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <LineChart size={20} />
            </div>
            <h3 className="font-semibold text-lg">Skill & ATS Analytics</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Track your average score, view technical-vs-soft skill distributions, and monitor growth.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-neutral-200/5 dark:bg-neutral-900/10 p-8 sm:p-12 rounded-3xl border border-neutral-200/10">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold">
            <BrainCircuit size={12} />
            <span>AI-Driven Analysis</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Stop Guessing What Recruiters Want To See
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Most companies use automated bots to score applications before a human reads them. If your resume lacks the right format or terminology, it gets discarded.
          </p>
          <ul className="space-y-3 pt-2 text-sm text-neutral-300">
            <li className="flex items-center gap-3">
              <CheckCircle size={16} className="text-indigo-500 shrink-0" />
              <span>Uncover hidden keyword filters automatically.</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle size={16} className="text-indigo-500 shrink-0" />
              <span>Correct passive grammar with high-impact revisions.</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle size={16} className="text-indigo-500 shrink-0" />
              <span>Receive custom cert recommendation cards.</span>
            </li>
          </ul>
        </div>
        <div className="flex justify-center">
          <div className="glass-panel p-6 rounded-2xl border border-neutral-200/10 w-full max-w-md space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <FileCheck2 className="text-indigo-500" /> Improvement Suggestion
            </h3>
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1">
              <p className="text-xs text-rose-500 font-semibold">Original Phrase:</p>
              <p className="text-xs text-neutral-400 italic">"Responsible for lead team and coordinate sprints."</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
              <p className="text-xs text-emerald-500 font-semibold">Suggested AI Revision:</p>
              <p className="text-xs text-neutral-200 font-semibold">"Orchestrated agile sprints and led a team of 6 engineers."</p>
            </div>
            <p className="text-[10px] text-neutral-400">
              💡 <strong>Why:</strong> Replacing passive tasks with action verbs increases score impact weight by 15%.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-display text-3xl font-bold tracking-tight">Flexible Plans For Career Growth</h2>
          <p className="text-neutral-400 max-w-sm mx-auto text-sm">
            Start for free and upgrade as your career search increases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="glass-panel p-8 rounded-3xl border border-neutral-200/10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Free Tier</h3>
              <p className="text-3xl font-display font-extrabold">$0 <span className="text-xs font-normal text-neutral-500">/ forever</span></p>
              <p className="text-xs text-neutral-400">Great for a quick checkpoint review.</p>
            </div>
            <ul className="space-y-3 text-xs text-neutral-300">
              <li className="flex items-center gap-2">✔ 3 Resume Uploads / Mo</li>
              <li className="flex items-center gap-2">✔ Core ATS Scoring</li>
              <li className="flex items-center gap-2">✔ Hard Skill Extraction</li>
              <li className="flex items-center gap-2">❌ Detailed Grammar Check</li>
            </ul>
            <button 
              onClick={() => setView('signup')}
              className="w-full py-3 rounded-xl bg-neutral-200/5 dark:bg-neutral-800/40 hover:bg-neutral-200/10 dark:hover:bg-neutral-800/60 font-semibold text-xs transition border border-neutral-200/10"
            >
              Get Started
            </button>
          </div>

          {/* Pro */}
          <div className="glass-panel p-8 rounded-3xl border-2 border-indigo-500 flex flex-col justify-between space-y-6 relative shadow-lg">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold tracking-wide uppercase">
              RECOMMENDED
            </span>
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Pro Tier</h3>
              <p className="text-3xl font-display font-extrabold">$12 <span className="text-xs font-normal text-neutral-500">/ month</span></p>
              <p className="text-xs text-neutral-400">Everything needed for serious optimization.</p>
            </div>
            <ul className="space-y-3 text-xs text-neutral-300">
              <li className="flex items-center gap-2">✔ Unlimited Uploads</li>
              <li className="flex items-center gap-2">✔ Advanced Gemini Pro AI</li>
              <li className="flex items-center gap-2">✔ Grammar corrections</li>
              <li className="flex items-center gap-2">✔ Job Description Matching</li>
            </ul>
            <button 
              onClick={() => setView('signup')}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md glow-btn"
            >
              Go Pro Now
            </button>
          </div>

          {/* Enterprise */}
          <div className="glass-panel p-8 rounded-3xl border border-neutral-200/10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Premium Hub</h3>
              <p className="text-3xl font-display font-extrabold">$29 <span className="text-xs font-normal text-neutral-500">/ month</span></p>
              <p className="text-xs text-neutral-400">For agencies, schools, and teams.</p>
            </div>
            <ul className="space-y-3 text-xs text-neutral-300">
              <li className="flex items-center gap-2">✔ Multitask User accounts</li>
              <li className="flex items-center gap-2">✔ Global Telemetry dashboard</li>
              <li className="flex items-center gap-2">✔ Custom API Key binding</li>
              <li className="flex items-center gap-2">✔ 24/7 Priority support</li>
            </ul>
            <button 
              onClick={() => setView('signup')}
              className="w-full py-3 rounded-xl bg-neutral-200/5 dark:bg-neutral-800/40 hover:bg-neutral-200/10 dark:hover:bg-neutral-800/60 font-semibold text-xs transition border border-neutral-200/10"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200/10 pt-8 text-center text-xs text-neutral-500 space-y-2">
        <p>© 2026 ResumeIQ Tech. Inspired by Linear & Notion.</p>
        <p>Built for automated scanning engines and high compliance careers.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
