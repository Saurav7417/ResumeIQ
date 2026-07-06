import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Page components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import JobMatching from './pages/JobMatching';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

import { Loader2 } from 'lucide-react';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [view, setView] = useState('landing');
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  // Route Guard / private routing controller
  const renderView = () => {
    // Public routes accessible to everyone
    if (view === 'landing') return <LandingPage setView={setView} />;
    if (view === 'login') return <LoginPage setView={setView} />;
    if (view === 'signup') return <SignupPage setView={setView} />;

    // Protected views - redirect to login if no authenticated context
    if (!user) {
      return <LoginPage setView={setView} />;
    }

    // Authenticated views
    switch (view) {
      case 'dashboard':
        return <Dashboard setView={setView} setSelectedResumeId={setSelectedResumeId} />;
      case 'upload':
        return <ResumeUpload selectedResumeId={selectedResumeId} setSelectedResumeId={setSelectedResumeId} />;
      case 'matching':
        return <JobMatching selectedResumeId={selectedResumeId} setSelectedResumeId={setSelectedResumeId} />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return user.role === 'admin' ? <AdminPanel /> : <Dashboard setView={setView} setSelectedResumeId={setSelectedResumeId} />;
      default:
        return <LandingPage setView={setView} />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-neutral-950 text-indigo-500 space-y-4">
        <Loader2 size={36} className="animate-spin" />
        <p className="text-xs text-neutral-400 font-semibold tracking-wider uppercase">Loading ResumeIQ...</p>
      </div>
    );
  }

  // Dashboard layout configuration if authenticated and not on landing/login screens
  const isDashboardLayout = user && !['landing', 'login', 'signup'].includes(view);

  return (
    <div className="min-h-screen bg-primary text-primary transition-colors duration-300">
      <Navbar currentView={view} setView={setView} />
      
      {isDashboardLayout ? (
        <div className="flex">
          <Sidebar currentView={view} setView={setView} />
          <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-hidden">
            {renderView()}
          </main>
        </div>
      ) : (
        <main className="w-full">
          {renderView()}
        </main>
      )}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
