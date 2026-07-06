import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { Shimmer } from '../components/Skeleton';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Info, 
  Layers, 
  ListTodo,
  Check,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const ResumeUpload = ({ selectedResumeId, setSelectedResumeId }) => {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeDetails, setResumeDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [localErr, setLocalErr] = useState('');

  // If a resume ID was passed from dashboard, load its details
  useEffect(() => {
    if (selectedResumeId) {
      loadResumeDetails(selectedResumeId);
    }
  }, [selectedResumeId]);

  const loadResumeDetails = async (id) => {
    setIsAnalyzing(true);
    setLocalErr('');
    try {
      const res = await api.get(`/resumes/${id}`);
      if (res.data.success) {
        setResumeDetails(res.data.data);
      }
    } catch (err) {
      console.error('[ResumeUpload] Load error:', err.message);
      setLocalErr('Failed to retrieve resume details.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (uploadedFile) => {
    const ext = uploadedFile.name.split('.').pop().toLowerCase();
    const acceptedTypes = ['pdf', 'docx', 'txt'];
    
    if (!acceptedTypes.includes(ext)) {
      setLocalErr('Invalid file. Please select a PDF, DOCX or TXT file.');
      setFile(null);
      return;
    }
    setLocalErr('');
    setFile(uploadedFile);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLocalErr('');
    setIsAnalyzing(true);
    setUploadProgress(10);
    
    // Simulate upload progress steps for rich premium UX animation
    const progressTimer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      clearInterval(progressTimer);
      setUploadProgress(100);

      if (res.data.success) {
        setResumeDetails(res.data.data);
        setSelectedResumeId(res.data.data._id);
        setFile(null);
      }
    } catch (err) {
      clearInterval(progressTimer);
      console.error('[Upload] Service failed:', err.message);
      setLocalErr(err.response?.data?.message || 'Error processing document file.');
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">Resume Analyzer</h1>
        <p className="text-sm text-neutral-400">Extract traits, rate ATS compatibility, and fix styling bottlenecks</p>
      </div>

      {localErr && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
          {localErr}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {!resumeDetails && !isAnalyzing && (
        <GlassCard className="p-0 border border-neutral-200/10">
          <form 
            onSubmit={handleUploadSubmit}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed transition ${
              isDragActive 
                ? 'border-indigo-500 bg-indigo-500/5' 
                : 'border-neutral-200/10 hover:border-neutral-200/25 bg-neutral-200/5 dark:bg-neutral-800/15'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.docx,.txt"
              onChange={handleChange}
              className="hidden"
            />
            
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 border border-indigo-500/20 shadow-inner">
              <UploadCloud size={24} />
            </div>

            <label 
              htmlFor="file-upload" 
              className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 cursor-pointer hover:text-indigo-500 transition"
            >
              Click to upload
            </label>
            <p className="text-xs text-neutral-400 mt-1">or drag and drop document file</p>
            <p className="text-[10px] text-neutral-500 mt-2">Accepted formats: PDF, DOCX, TXT (Max 10MB)</p>

            {file && (
              <div className="mt-6 flex items-center gap-3 p-3 bg-neutral-200/10 dark:bg-neutral-800/60 rounded-xl border border-neutral-200/10 text-xs font-semibold">
                <FileText size={16} className="text-indigo-400" />
                <span className="truncate max-w-[200px]">{file.name}</span>
                <span className="text-[10px] text-neutral-400">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            {file && (
              <button
                type="submit"
                className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition glow-btn"
              >
                Start AI Parser Analysis
              </button>
            )}
          </form>
        </GlassCard>
      )}

      {/* Loading Progress State */}
      {isAnalyzing && (
        <GlassCard className="py-12 flex flex-col items-center justify-center space-y-6">
          <div className="relative h-16 w-16 flex items-center justify-center">
            {/* Spinning Loader */}
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/15 border-t-indigo-500 animate-spin"></div>
            <FileText size={20} className="text-indigo-500 animate-bounce" />
          </div>

          <div className="text-center space-y-1.5 max-w-sm">
            <h3 className="font-semibold text-sm">Parsing & Running AI Analysis</h3>
            <p className="text-xs text-neutral-400">
              Evaluating compliance ratings, compiling grammar matrices, and parsing sections.
            </p>
          </div>

          {/* Progress Bar */}
          {uploadProgress > 0 && (
            <div className="w-64 space-y-1">
              <div className="h-1.5 w-full bg-neutral-200/10 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-neutral-500 text-right">{uploadProgress}% uploaded</p>
            </div>
          )}
        </GlassCard>
      )}

      {/* Analysis Output Layout */}
      {resumeDetails && !isAnalyzing && (
        <div className="space-y-6">
          {/* Header Dashboard info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-neutral-200/5 dark:bg-neutral-800/15 border border-neutral-200/10 rounded-2xl gap-4">
            <div className="flex items-center space-x-3">
              <div className="h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="font-bold text-sm truncate max-w-[200px] sm:max-w-md">{resumeDetails.filename}</h2>
                <p className="text-xs text-neutral-400">
                  Parsed: {new Date(resumeDetails.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setResumeDetails(null);
                setSelectedResumeId(null);
              }}
              className="px-4 py-2 border border-neutral-200/10 hover:bg-neutral-200/5 dark:hover:bg-neutral-800/40 rounded-xl text-xs font-semibold transition"
            >
              Analyze Another Document
            </button>
          </div>

          {/* Tabs Nav */}
          <div className="flex border-b border-neutral-200/10 gap-6 text-sm font-semibold">
            {[
              { id: 'summary', label: 'Evaluation Summary', icon: Info },
              { id: 'skills', label: 'Skills Mapping', icon: Layers },
              { id: 'strengths', label: 'Strengths & Weaknesses', icon: ListTodo },
              { id: 'improvements', label: 'Grammar & Improvements', icon: AlertCircle }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                    isActive 
                      ? 'border-indigo-500 text-indigo-500' 
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="space-y-6">
            
            {/* Tab 1: Summary */}
            {activeTab === 'summary' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="md:col-span-1 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">ATS Score</span>
                  
                  <div className="relative h-28 w-28 flex items-center justify-center">
                    {/* Circle rating indicator */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-neutral-200/10"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-indigo-500 transition-all duration-1000 ease-out"
                        strokeDasharray={`${resumeDetails.atsScore}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-2xl font-bold font-display">{resumeDetails.atsScore}</div>
                  </div>

                  <p className="text-xs font-semibold mt-2 text-indigo-400">
                    {resumeDetails.atsScore >= 80 ? 'Optimized for modern ATS' : 'Requires key revisions'}
                  </p>
                </GlassCard>

                <div className="md:col-span-2 space-y-4">
                  <GlassCard className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Predicted Job Role</span>
                      <p className="text-sm font-semibold">{resumeDetails.predictedRole}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Experience Index</span>
                      <p className="text-sm font-semibold">{resumeDetails.experienceLevel}</p>
                    </div>
                  </GlassCard>

                  <GlassCard className="space-y-3">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase">Extracted File Header Specs</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-mono max-h-[160px] overflow-y-auto p-3 bg-neutral-200/5 dark:bg-neutral-900/30 rounded-xl border border-neutral-200/10">
                      {resumeDetails.parsedText}
                    </p>
                  </GlassCard>
                </div>
              </div>
            )}

            {/* Tab 2: Skills */}
            {activeTab === 'skills' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="space-y-4">
                  <h3 className="font-semibold text-sm text-indigo-400">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeDetails.technicalSkills?.map((skill, idx) => (
                      <span key={idx} className="text-xs bg-neutral-200/10 dark:bg-neutral-800 text-neutral-300 border border-neutral-200/5 px-3 py-1.5 rounded-xl font-medium">
                        {skill}
                      </span>
                    )) || <span className="text-xs text-neutral-500">None extracted</span>}
                  </div>
                </GlassCard>

                <GlassCard className="space-y-4">
                  <h3 className="font-semibold text-sm text-violet-400">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeDetails.softSkills?.map((skill, idx) => (
                      <span key={idx} className="text-xs bg-neutral-200/10 dark:bg-neutral-800 text-neutral-300 border border-neutral-200/5 px-3 py-1.5 rounded-xl font-medium">
                        {skill}
                      </span>
                    )) || <span className="text-xs text-neutral-500">None extracted</span>}
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Tab 3: Strengths / Weaknesses */}
            {activeTab === 'strengths' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="space-y-4 border border-emerald-500/10">
                  <h3 className="font-semibold text-sm text-emerald-500 flex items-center gap-2">
                    <Check size={16} /> Strengths Keypoints
                  </h3>
                  <ul className="space-y-3">
                    {resumeDetails.strengths?.map((item, idx) => (
                      <li key={idx} className="text-xs text-neutral-300 leading-relaxed flex items-start gap-3">
                        <span className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 text-[10px] font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    )) || <li>No records</li>}
                  </ul>
                </GlassCard>

                <GlassCard className="space-y-4 border border-rose-500/10">
                  <h3 className="font-semibold text-sm text-rose-500 flex items-center gap-2">
                    <AlertTriangle size={16} /> Weaknesses Checkpoints
                  </h3>
                  <ul className="space-y-3">
                    {resumeDetails.weaknesses?.map((item, idx) => (
                      <li key={idx} className="text-xs text-neutral-300 leading-relaxed flex items-start gap-3">
                        <span className="h-5 w-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 text-[10px] font-bold">!</span>
                        <span>{item}</span>
                      </li>
                    )) || <li>No records</li>}
                  </ul>
                </GlassCard>
              </div>
            )}

            {/* Tab 4: Grammar / Suggestions */}
            {activeTab === 'improvements' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Missing keywords card */}
                  <GlassCard className="md:col-span-1 space-y-4 border border-amber-500/10 h-fit">
                    <h3 className="font-semibold text-sm text-amber-500 flex items-center gap-2">
                      <AlertTriangle size={16} /> Missing Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeDetails.missingKeywords?.map((word, idx) => (
                        <span key={idx} className="text-xs bg-amber-500/5 text-amber-500 border border-amber-500/10 px-2.5 py-1 rounded-lg font-semibold">
                          {word}
                        </span>
                      )) || <span className="text-xs text-neutral-500">None mapped</span>}
                    </div>
                  </GlassCard>

                  {/* General improvement points */}
                  <GlassCard className="md:col-span-2 space-y-4">
                    <h3 className="font-semibold text-sm text-indigo-400">Action Recommendations</h3>
                    <ul className="space-y-3">
                      {resumeDetails.improvements?.map((item, idx) => (
                        <li key={idx} className="text-xs text-neutral-300 leading-relaxed flex items-start gap-2.5">
                          <span className="h-5 w-5 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold">{idx + 1}</span>
                          <span>{item}</span>
                        </li>
                      )) || <li>No records</li>}
                    </ul>
                  </GlassCard>
                </div>

                {/* Grammar correction tables */}
                <GlassCard className="space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <HelpCircle className="text-indigo-400" size={16} /> Grammatical & Syntax Revisions
                  </h3>
                  
                  {resumeDetails.grammarSuggestions && resumeDetails.grammarSuggestions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-200/10 text-neutral-400">
                            <th className="py-2.5 px-3">Original Phrase</th>
                            <th className="py-2.5 px-3">Suggested Phrase</th>
                            <th className="py-2.5 px-3">Correction Rationale</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resumeDetails.grammarSuggestions.map((item, idx) => (
                            <tr key={idx} className="border-b border-neutral-200/5 hover:bg-neutral-200/5 dark:hover:bg-neutral-800/10 transition">
                              <td className="py-3 px-3 text-rose-500 font-mono italic">{item.original}</td>
                              <td className="py-3 px-3 text-emerald-500 font-semibold">{item.suggested}</td>
                              <td className="py-3 px-3 text-neutral-400 leading-relaxed">{item.explanation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 p-4 text-center border border-dashed border-neutral-200/10 rounded-xl">
                      🎉 No passive verbs or syntax errors flagged in document analysis!
                    </p>
                  )}
                </GlassCard>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
