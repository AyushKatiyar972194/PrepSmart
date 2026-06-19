import React, { useState, useEffect } from 'react';
import { Award, Briefcase, FileText, CheckCircle, ArrowRight, Star, TrendingUp } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do.", author: "Lou Holtz" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

export default function Dashboard({ stats, setActiveTab }) {
  const [activeQuote, setActiveQuote] = useState(0);

  // Quote carousel rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const progressPercent = stats.progress;

  // Dynamic coordinates calculations for the Trend Chart
  const x1 = 40;
  const x2 = 180;
  const x3 = 320;
  const x4 = 460;

  // Percentage values: Baseline (25), Resume ATS (atsScore), AI Mock Interview (latestInterviewScore), Overall (progress)
  const val1 = 25;
  const val2 = stats.atsScore || 0;
  const val3 = stats.latestInterviewScore || 0;
  const val4 = stats.progress || 0;

  // Convert percentages to SVG y-coordinates (range 130 representing 0% to 20 representing 100%)
  const y1 = 130 - (val1 / 100) * 110;
  const y2 = 130 - (val2 / 100) * 110;
  const y3 = 130 - (val3 / 100) * 110;
  const y4 = 130 - (val4 / 100) * 110;

  // Smooth Bezier Curve Path Calculation (Hermite spline approximation)
  const pathD = `M ${x1},${y1} ` +
    `C ${x1 + 70},${y1} ${x2 - 70},${y2} ${x2},${y2} ` +
    `C ${x2 + 70},${y2} ${x3 - 70},${y3} ${x3},${y3} ` +
    `C ${x3 + 70},${y3} ${x4 - 70},${y4} ${x4},${y4}`;

  const areaD = `${pathD} L ${x4},130 L ${x1},130 Z`;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-950 dark:via-purple-950 dark:to-indigo-900 text-white p-6 sm:p-8 relative overflow-hidden shadow-lg border border-indigo-500/10 dark:border-indigo-500/5">
        <div className="absolute inset-0 bg-gradient-brand opacity-10 pointer-events-none"></div>
        <div className="absolute -top-24 -left-20 w-64 h-64 rounded-full bg-brand-500/30 blur-3xl"></div>
        <div className="absolute top-10 -right-24 w-80 h-80 rounded-full bg-pink-500/30 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="badge-premium-apply bg-white/10 text-indigo-100 border border-white/10 mb-3 backdrop-blur-sm">
              Premium Placement Dashboard
            </span>
            <h2 className="text-3xl font-black text-white mt-1">Ready for Placements, {stats.quizzesTaken > 0 ? "Qualified" : "Future"} Engineer!</h2>
            <p className="text-white/80 mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
              Track your preparation readiness index. Complete mock recruiter interviews, refine your technical skills, and manage your job applications pipeline.
            </p>
          </div>
          
          {/* Progress Circular Gauge */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4 min-w-[200px] shadow-sm">
            <div className="relative flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-white/10 fill-none" strokeWidth="6" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  className="stroke-pink-400 fill-none transition-all duration-1000 ease-out" 
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - progressPercent / 100)}
                />
              </svg>
              <span className="absolute text-sm font-black text-white">{progressPercent}%</span>
            </div>
            <div>
              <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Readiness index</div>
              <div className="text-sm font-black text-white">Placement Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Preparedness Trend Graph */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* SVG Analytics Trend Chart */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 border shadow-sm dark:text-white flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-indigo-950 dark:text-indigo-100 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-500" />
              Preparedness Trend (Weekly)
            </h3>
            <p className="text-xs text-indigo-400/80 dark:text-indigo-300/80 mt-1">Visual progression of mock interview results and resume scores.</p>
          </div>

          <div className="my-6 relative h-40 w-full flex items-center justify-center">
            {/* Custom SVG Line Chart */}
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" className="stroke-indigo-100/50 dark:stroke-indigo-950/40" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="75" x2="500" y2="75" className="stroke-indigo-100/50 dark:stroke-indigo-950/40" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="130" x2="500" y2="130" className="stroke-indigo-100/50 dark:stroke-indigo-950/40" strokeWidth="1" strokeDasharray="4" />

              {/* Goal Guidelines */}
              <line x1={x1} y1="102.5" x2={x4} y2="102.5" className="stroke-indigo-300/30 dark:stroke-indigo-800/20" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x={x4 + 10} y="105" className="text-[8px] fill-indigo-400 dark:fill-indigo-300 font-bold" textAnchor="start">Baseline (25%)</text>

              <line x1={x1} y1="47.5" x2={x4} y2="47.5" className="stroke-pink-500/30 dark:stroke-pink-400/20" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x={x4 + 10} y="50" className="text-[8px] fill-pink-500 dark:fill-pink-400 font-bold" textAnchor="start">Tier-1 Target (75%)</text>

              {/* Area under the path */}
              <path 
                d={areaD} 
                fill="url(#grad)" 
                opacity="0.15" 
              />
              
              {/* Trend Path */}
              <path 
                d={pathD} 
                fill="none" 
                className="stroke-brand-500" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
              />

              {/* Interactive nodes */}
              <circle cx={x1} cy={y1} r="5.5" className="fill-white stroke-indigo-500 dark:fill-indigo-950 dark:stroke-indigo-500" strokeWidth="3" />
              <circle cx={x2} cy={y2} r="5.5" className="fill-white stroke-indigo-500 dark:fill-indigo-950 dark:stroke-indigo-500" strokeWidth="3" />
              <circle cx={x3} cy={y3} r="5.5" className="fill-white stroke-indigo-500 dark:fill-indigo-950 dark:stroke-indigo-500" strokeWidth="3" />
              <circle cx={x4} cy={y4} r="5.5" className="fill-white stroke-pink-500 dark:fill-indigo-950 dark:stroke-pink-500" strokeWidth="3" />

              {/* Numerical Value Labels above the nodes */}
              <text x={x1} y={y1 - 10} className="text-[9px] fill-indigo-600 dark:fill-indigo-300 font-extrabold" textAnchor="middle">{val1}%</text>
              <text x={x2} y={y2 - 10} className="text-[9px] fill-indigo-600 dark:fill-indigo-300 font-extrabold" textAnchor="middle">{val2}%</text>
              <text x={x3} y={y3 - 10} className="text-[9px] fill-indigo-600 dark:fill-indigo-300 font-extrabold" textAnchor="middle">{val3}%</text>
              <text x={x4} y={y4 - 10} className="text-[9px] fill-pink-500 dark:fill-pink-400 font-extrabold" textAnchor="middle">{val4}%</text>

              {/* Labels below the nodes */}
              <text x={x1} y="148" className="text-[9px] sm:text-[10px] fill-indigo-400 dark:fill-indigo-300 font-bold" textAnchor="middle">W1: Baseline</text>
              <text x={x2} y="148" className="text-[9px] sm:text-[10px] fill-indigo-400 dark:fill-indigo-300 font-bold" textAnchor="middle">W2: Resume ATS</text>
              <text x={x3} y="148" className="text-[9px] sm:text-[10px] fill-indigo-400 dark:fill-indigo-300 font-bold" textAnchor="middle">W3: AI Interview</text>
              <text x={x4} y="148" className="text-[9px] sm:text-[10px] fill-indigo-500 dark:fill-pink-400 font-extrabold" textAnchor="middle">Active Readiness</text>

              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex justify-between text-xs text-indigo-400 dark:text-indigo-300 pt-2 border-t border-indigo-100/50 dark:border-indigo-950/40">
            <span>Baseline Evaluation: 25%</span>
            <span>Target Tier-1 Eligibility: &gt;75%</span>
          </div>
        </div>

        {/* Study Tasks checklist card */}
        <div className="glass rounded-3xl p-6 border shadow-sm dark:text-white flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-indigo-950 dark:text-white">Readiness Checklist</h3>
            <p className="text-xs text-indigo-400/80 dark:text-indigo-300/80 mt-1">Complete these actions to qualify for tier-1 job listings.</p>
            
            <div className="space-y-4 mt-5">
              <div className="flex items-center gap-3">
                <CheckCircle className={stats.quizzesTaken > 0 ? "text-emerald-500" : "text-indigo-200 dark:text-indigo-900"} size={18} />
                <span className={`text-sm ${stats.quizzesTaken > 0 ? 'text-indigo-300 dark:text-indigo-750 line-through' : 'text-indigo-950 dark:text-indigo-200 font-medium'}`}>
                  Finish AI mock interview
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className={stats.resumeProgress >= 80 ? "text-emerald-500" : "text-indigo-200 dark:text-indigo-900"} size={18} />
                <span className={`text-sm ${stats.resumeProgress >= 80 ? 'text-indigo-300 dark:text-indigo-750 line-through' : 'text-indigo-950 dark:text-indigo-200 font-medium'}`}>
                  Achieve ATS Score &ge; 80%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className={stats.jobsApplied > 0 ? "text-emerald-500" : "text-indigo-200 dark:text-indigo-900"} size={18} />
                <span className={`text-sm ${stats.jobsApplied > 0 ? 'text-indigo-300 dark:text-indigo-750 line-through' : 'text-indigo-950 dark:text-indigo-200 font-medium'}`}>
                  Apply to first job posting
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('interview')}
            className="mt-6 btn-custom btn-brand-custom w-full text-sm border-0 cursor-pointer"
          >
            Start AI Mock Interview
          </button>
        </div>
      </div>

      {/* Stats Cards (Bootstrap Grid & Tailwind Spacing) */}
      <div className="row g-4">
        {/* Mock Interview Stat */}
        <div className="col-12 col-md-4">
          <div className="cardish-custom glass rounded-3xl p-5 border h-full flex flex-col justify-between dark:text-white">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-600 dark:text-pink-400 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                <Star size={24} />
              </div>
              <span className="px-3 py-1 font-bold text-xs rounded-full bg-indigo-50/70 text-indigo-700 border border-indigo-100/30 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50">
                AI Recruiter
              </span>
            </div>
            <div className="mt-4">
              <div className="text-sm text-indigo-400/80 dark:text-indigo-300 font-medium">Interviews Completed</div>
              <div className="text-3xl font-black text-indigo-950 dark:text-white mt-1">{stats.quizzesTaken}</div>
            </div>
            <button 
              onClick={() => setActiveTab('interview')}
              className="mt-4 flex items-center gap-1 text-sm font-extrabold text-indigo-600 dark:text-pink-400 hover:opacity-80 bg-transparent border-0 self-start cursor-pointer p-0"
            >
              Start Interview <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Resume Stat */}
        <div className="col-12 col-md-4">
          <div className="cardish-custom glass rounded-3xl p-5 border h-full flex flex-col justify-between dark:text-white">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-purple-50/50 dark:bg-indigo-950/50 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-100/50 dark:border-indigo-900/30">
                <FileText size={24} />
              </div>
              <span className="px-3 py-1 font-bold text-xs rounded-full bg-purple-50/70 text-purple-700 border border-purple-100/30 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50">
                ATS Checked
              </span>
            </div>
            <div className="mt-4">
              <div className="text-sm text-indigo-400/80 dark:text-indigo-300 font-medium">Resume ATS Score</div>
              <div className="text-3xl font-black text-indigo-950 dark:text-white mt-1">{stats.atsScore}%</div>
            </div>
            <button 
              onClick={() => setActiveTab('resume')}
              className="mt-4 flex items-center gap-1 text-sm font-extrabold text-purple-600 dark:text-purple-450 hover:opacity-80 bg-transparent border-0 self-start cursor-pointer p-0"
            >
              Edit Resume <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Jobs Stat */}
        <div className="col-12 col-md-4">
          <div className="cardish-custom glass rounded-3xl p-5 border h-full flex flex-col justify-between dark:text-white">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-50/50 dark:bg-indigo-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100/50 dark:border-indigo-900/30">
                <Briefcase size={24} />
              </div>
              <span className="px-3 py-1 font-bold text-xs rounded-full bg-emerald-50/70 text-emerald-700 border border-emerald-100/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50">
                Pipeline
              </span>
            </div>
            <div className="mt-4">
              <div className="text-sm text-indigo-400/80 dark:text-indigo-300 font-medium">Applied Jobs</div>
              <div className="text-3xl font-black text-indigo-950 dark:text-white mt-1">{stats.jobsApplied}</div>
            </div>
            <button 
              onClick={() => setActiveTab('jobs')}
              className="mt-4 flex items-center gap-1 text-sm font-extrabold text-emerald-600 dark:text-emerald-400 hover:opacity-80 bg-transparent border-0 self-start cursor-pointer p-0"
            >
              Track Pipeline <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Quote Carousel */}
      <div className="bg-gradient-to-br from-indigo-650 via-purple-600 to-pink-500 text-white rounded-3xl p-6 shadow-lg flex flex-col justify-between relative overflow-hidden min-h-[180px] border border-indigo-500/10">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-6 translate-y-6 pointer-events-none">
          <Star size={180} />
        </div>
        <div>
          <span className="badge bg-white/20 text-white rounded-pill px-2.5 py-0.5 text-xs font-semibold uppercase">
            Recruiter Tip
          </span>
          <div className="mt-4 text-lg font-medium italic leading-relaxed">
            "{MOTIVATIONAL_QUOTES[activeQuote].text}"
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-indigo-200 font-semibold">— {MOTIVATIONAL_QUOTES[activeQuote].author}</span>
          <div className="flex gap-1.5">
            {MOTIVATIONAL_QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveQuote(i)}
                className={`w-2 h-2 rounded-full border-0 p-0 transition-all cursor-pointer ${
                  activeQuote === i ? 'bg-white w-4' : 'bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
