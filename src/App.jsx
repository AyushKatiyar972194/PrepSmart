import React, { useState, useEffect } from 'react';
import { Layout, HelpCircle, FileText, Briefcase, Award, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import MockInterview from './components/MockInterview';
import ResumeBuilder from './components/ResumeBuilder';
import JobPortal from './components/JobPortal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Core stats for placement readiness
  const [stats, setStats] = useState({
    quizzesTaken: 0, // representing interviews completed
    resumeProgress: 0, // ATS score
    jobsApplied: 0,
    atsScore: 0,
    latestInterviewScore: 0,
    progress: 0
  });

  const [appliedJobs, setAppliedJobs] = useState({});
  const [resumeData, setResumeData] = useState(null);

  // Load state and force dark mode on mount
  useEffect(() => {
    window.document.documentElement.classList.add('dark');
    localStorage.setItem('prepsmart_theme', 'dark');
    try {
      const storedStats = localStorage.getItem('prepsmart_stats');
      const storedJobs = localStorage.getItem('prepsmart_jobs');
      const storedResume = localStorage.getItem('prepsmart_resume');

      if (storedStats) setStats(JSON.parse(storedStats));
      if (storedJobs) setAppliedJobs(JSON.parse(storedJobs));
      if (storedResume) setResumeData(JSON.parse(storedResume));
    } catch (e) {
      console.error("Local storage read error:", e);
    }
  }, []);

  // Header scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoized callback to complete interview
  const handleInterviewComplete = React.useCallback((averageScore) => {
    setStats((prevStats) => {
      const newStats = {
        ...prevStats,
        quizzesTaken: prevStats.quizzesTaken + 1,
        latestInterviewScore: averageScore
      };
      const quizProgress = newStats.quizzesTaken > 0 ? 30 : 0;
      const resumeProgressVal = Math.round((newStats.atsScore / 100) * 40);
      const jobsProgress = newStats.jobsApplied > 0 ? 30 : 0;
      newStats.progress = quizProgress + resumeProgressVal + jobsProgress;
      newStats.resumeProgress = newStats.atsScore;
      
      localStorage.setItem('prepsmart_stats', JSON.stringify(newStats));
      return newStats;
    });
  }, []);

  // Memoized callback to save resume
  const handleResumeSave = React.useCallback((resumeObj, score, showAlert = false) => {
    setResumeData(resumeObj);
    localStorage.setItem('prepsmart_resume', JSON.stringify(resumeObj));
    
    setStats((prevStats) => {
      const newStats = {
        ...prevStats,
        atsScore: score,
        resumeProgress: score
      };
      const quizProgress = newStats.quizzesTaken > 0 ? 30 : 0;
      const resumeProgressVal = Math.round((score / 100) * 40);
      const jobsProgress = newStats.jobsApplied > 0 ? 30 : 0;
      newStats.progress = quizProgress + resumeProgressVal + jobsProgress;
      
      localStorage.setItem('prepsmart_stats', JSON.stringify(newStats));
      return newStats;
    });

    if (showAlert) {
      alert('Resume details and ATS score saved successfully!');
    }
  }, []);

  // Memoized callback to apply to jobs
  const handleJobApply = React.useCallback((jobId, dateOrObj) => {
    setAppliedJobs((prevJobs) => {
      const updatedJobs = {
        ...prevJobs,
        [jobId]: typeof dateOrObj === 'string' ? { date: dateOrObj, stage: 'Applied' } : dateOrObj
      };
      localStorage.setItem('prepsmart_jobs', JSON.stringify(updatedJobs));

      setStats((prevStats) => {
        const newStats = {
          ...prevStats,
          jobsApplied: Object.keys(updatedJobs).length
        };
        const quizProgress = newStats.quizzesTaken > 0 ? 30 : 0;
        const resumeProgressVal = Math.round((newStats.atsScore / 100) * 40);
        const jobsProgress = newStats.jobsApplied > 0 ? 30 : 0;
        newStats.progress = quizProgress + resumeProgressVal + jobsProgress;
        newStats.resumeProgress = newStats.atsScore;

        localStorage.setItem('prepsmart_stats', JSON.stringify(newStats));
        return newStats;
      });

      return updatedJobs;
    });
  }, []);



  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout },
    { id: 'interview', label: 'AI Mock Interview', icon: Award },
    { id: 'resume', label: 'Resume Builder', icon: FileText },
    { id: 'jobs', label: 'Job Portal', icon: Briefcase }
  ];

  return (
    <div className="min-h-screen flex flex-col text-indigo-950 dark:text-indigo-100 transition-colors duration-300">
      {/* Header / Navbar */}
      <header className={`no-print fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/70 dark:bg-indigo-950/30 backdrop-blur-md border-b border-indigo-100/50 dark:border-indigo-900/30 py-3 shadow-sm' 
          : 'bg-transparent py-4'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-md shadow-brand-500/20 text-white font-extrabold text-lg">
                P
              </div>
              <div>
                <span className="font-extrabold text-indigo-950 dark:text-white text-lg block tracking-tight">PrepSmart</span>
                <span className="text-[10px] text-indigo-400 dark:text-indigo-300 font-bold uppercase tracking-widest block -mt-1">Placement Portal</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 bg-white/40 dark:bg-indigo-950/20 backdrop-blur-sm border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl p-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`nav-link-custom flex items-center gap-2 px-4 py-2 border-0 text-sm font-semibold cursor-pointer ${
                      isActive ? 'active' : ''
                    }`}
                  >
                    <IconComponent size={16} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Readiness bar */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-indigo-400 dark:text-indigo-300 font-bold uppercase block">Readiness</span>
                <span className="text-sm font-black text-indigo-950 dark:text-white">{stats.progress}%</span>
              </div>
              <div className="progress rounded-pill bg-indigo-100 dark:bg-indigo-950" style={{ width: '80px', height: '6px' }}>
                <div 
                  className="progress-bar bg-gradient-to-r from-indigo-500 to-pink-500 rounded-pill" 
                  style={{ width: `${stats.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Mobile Hamburger Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-white/70 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-indigo-950/95 backdrop-blur-md border-b border-indigo-100 dark:border-indigo-900/45 shadow-md p-4 space-y-2.5 animate-fadeIn">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-0 text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-pink-400 font-bold' 
                      : 'bg-transparent text-indigo-950 dark:text-indigo-200 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/45'
                  }`}
                >
                  <IconComponent size={18} />
                  {item.label}
                </button>
              );
            })}
            <div className="border-t border-indigo-100 dark:border-indigo-900/30 pt-3 flex items-center justify-between px-4">
              <span className="text-xs text-indigo-400 dark:text-indigo-350 font-bold">Readiness Score</span>
              <span className="text-sm font-black text-indigo-650 dark:text-pink-400">{stats.progress}%</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Body content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-24 pb-16">
        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} setActiveTab={setActiveTab} />
        )}
        
        {activeTab === 'interview' && (
          <MockInterview onComplete={handleInterviewComplete} />
        )}

        {activeTab === 'resume' && (
          <ResumeBuilder resumeData={resumeData} onSave={handleResumeSave} />
        )}

        {activeTab === 'jobs' && (
          <JobPortal appliedJobs={appliedJobs} onApply={handleJobApply} />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-indigo-100/30 dark:border-indigo-900/30 bg-white/70 dark:bg-indigo-950/25 py-8 text-center text-xs text-indigo-950/70 dark:text-indigo-250">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-indigo-100/20 dark:border-indigo-900/20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                P
              </div>
              <div className="text-left">
                <span className="font-extrabold text-indigo-950 dark:text-white text-sm block">PrepSmart</span>
                <span className="text-[9px] text-indigo-400 dark:text-indigo-400 font-bold uppercase tracking-wider block -mt-1">Smart Placement Hub</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold">
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-indigo-600 dark:hover:text-pink-400 bg-transparent border-0 cursor-pointer p-0 text-indigo-950/70 dark:text-indigo-250 transition-colors">Dashboard</button>
              <button onClick={() => setActiveTab('interview')} className="hover:text-indigo-600 dark:hover:text-pink-400 bg-transparent border-0 cursor-pointer p-0 text-indigo-950/70 dark:text-indigo-250 transition-colors">AI Interview</button>
              <button onClick={() => setActiveTab('resume')} className="hover:text-indigo-600 dark:hover:text-pink-400 bg-transparent border-0 cursor-pointer p-0 text-indigo-950/70 dark:text-indigo-250 transition-colors">Resume Builder</button>
              <button onClick={() => setActiveTab('jobs')} className="hover:text-indigo-600 dark:hover:text-pink-400 bg-transparent border-0 cursor-pointer p-0 text-indigo-950/70 dark:text-indigo-250 transition-colors">Opportunities</button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-indigo-400 dark:text-indigo-400">
            <div>
              &copy; {new Date().getFullYear()} PrepSmart Inc. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:underline text-indigo-450 dark:text-indigo-400">Privacy Policy</a>
              <span>•</span>
              <a href="#terms" className="hover:underline text-indigo-450 dark:text-indigo-400">Terms of Service</a>
              <span>•</span>
              <a href="#support" className="hover:underline text-indigo-450 dark:text-indigo-400">Student Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
