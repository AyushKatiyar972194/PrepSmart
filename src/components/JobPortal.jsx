import React, { useState } from 'react';
import { Briefcase, Search, MapPin, Check, ArrowRight, Send } from 'lucide-react';

const MOCK_JOBS = [
  {
    id: 'job-1',
    title: 'Frontend React Developer (Intern)',
    company: 'TechNovus Solutions',
    location: 'Bangalore / Remote',
    type: 'Internship',
    description: 'We are looking for a React Intern with basic understanding of state, hooks, and responsive design (Tailwind/Bootstrap).',
    tags: ['React', 'Tailwind', 'JavaScript'],
    stipend: '₹15,000 / month'
  },
  {
    id: 'job-2',
    title: 'Associate Software Engineer',
    company: 'AppSagas Inc.',
    location: 'Hyderabad, India',
    type: 'Full-time',
    description: 'Entry-level SDE role focusing on JavaScript development, problem-solving, and REST API integration.',
    tags: ['JavaScript', 'Data Structures', 'REST APIs'],
    stipend: '₹6.5 LPA'
  },
  {
    id: 'job-3',
    title: 'UI/UX Specialist & Web Designer',
    company: 'PixelPerfect Studio',
    location: 'Pune / Remote',
    type: 'Full-time',
    description: 'Build premium responsive layout designs using Tailwind CSS, Bootstrap, and advanced HTML/CSS styling systems.',
    tags: ['Tailwind', 'Bootstrap', 'Web Design'],
    stipend: '₹5 LPA'
  },
  {
    id: 'job-4',
    title: 'Full Stack JavaScript Intern',
    company: 'CloudVantage',
    location: 'Noida, India',
    type: 'Internship',
    description: 'Work with Node.js, Express, and React.js to build dynamic dashboards and database integrations.',
    tags: ['React', 'Node.js', 'JavaScript'],
    stipend: '₹20,000 / month'
  }
];

const PIPELINE_STAGES = ['Applied', 'Shortlisted', 'Interview', 'Offer'];

export default function JobPortal({ appliedJobs, onApply }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  // JavaScript array filtering
  const filteredJobs = MOCK_JOBS.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesType = selectedType === 'All' || job.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleApplyClick = (job) => {
    setApplyModalJob(job);
    setCoverLetter('');
  };

  const handleConfirmApply = () => {
    if (applyModalJob) {
      const applyDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      onApply(applyModalJob.id, {
        date: applyDate,
        stage: 'Applied'
      });
      setApplyModalJob(null);
      alert(`Applied to ${applyModalJob.title} successfully!`);
    }
  };

  const handleAdvanceStage = (jobId) => {
    const currentApplication = appliedJobs[jobId];
    if (!currentApplication) return;

    // Determine next stage
    const currentStage = typeof currentApplication === 'string' ? 'Applied' : (currentApplication.stage || 'Applied');
    const currentIndex = PIPELINE_STAGES.indexOf(currentStage);
    const nextIndex = Math.min(PIPELINE_STAGES.length - 1, currentIndex + 1);

    if (nextIndex !== currentIndex) {
      onApply(jobId, {
        date: typeof currentApplication === 'string' ? currentApplication : currentApplication.date,
        stage: PIPELINE_STAGES[nextIndex]
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn dark:text-white">
      {/* Overview */}
      <div>
        <h2 className="text-2xl font-black text-indigo-950 dark:text-white">Interactive Job Board & Tracker</h2>
        <p className="text-indigo-450 dark:text-indigo-300 text-sm mt-1">
          Explore curated postings. Apply to simulate applications, then manage your pipeline progress (Applied ➔ Shortlisted ➔ Interview ➔ Offer) directly on each card.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass border rounded-3xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
          <input 
            type="text" 
            placeholder="Search roles, companies, tags..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-premium-apply"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['All', 'Full-time', 'Internship'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`chip text-xs border-0 font-bold whitespace-nowrap cursor-pointer ${
                selectedType === type 
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm' 
                  : ''
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Job Postings Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {filteredJobs.length === 0 ? (
          <div className="col-span-2 text-center py-10 glass border rounded-3xl">
            <Briefcase size={36} className="mx-auto text-indigo-300 dark:text-indigo-700 mb-2" />
            <div className="text-indigo-950 dark:text-indigo-200 font-bold">No placements matched your filters.</div>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const application = appliedJobs[job.id];
            const isApplied = !!application;
            const currentStage = isApplied 
              ? (typeof application === 'string' ? 'Applied' : (application.stage || 'Applied'))
              : null;

            return (
              <div 
                key={job.id} 
                className="cardish-custom glass rounded-3xl p-5 sm:p-6 border flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-extrabold text-lg leading-tight text-indigo-950 dark:text-white">
                        {job.title}
                      </h3>
                      <p className="text-indigo-600 dark:text-pink-400 font-bold text-xs uppercase tracking-wider mt-1">{job.company}</p>
                    </div>
                    <span className={`badge rounded-pill px-3 py-1 font-bold text-xs ${
                      job.type === 'Full-time' 
                        ? 'bg-indigo-50/50 text-indigo-700 dark:bg-purple-950/40 dark:text-purple-300 border border-indigo-100/30 dark:border-purple-900/30' 
                        : 'bg-amber-50/50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-100/30 dark:border-amber-900/30'
                    }`}>
                      {job.type}
                    </span>
                  </div>

                  <p className="text-indigo-900/80 dark:text-indigo-200 text-sm mt-3 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {job.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-xs font-semibold bg-indigo-50/40 dark:bg-indigo-950/40 border border-indigo-100/30 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-350 px-2.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Kanban Pipeline Stepper (Visible if Applied) */}
                  {isApplied && (
                    <div className="mt-5 p-3.5 bg-indigo-50/20 dark:bg-indigo-950/30 border border-indigo-100/30 dark:border-indigo-900/30 rounded-2xl space-y-3">
                      <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Application Tracking</div>
                      
                      {/* Timeline Steps */}
                      <div className="flex justify-between items-center text-[10px] font-bold text-indigo-500 dark:text-indigo-300 relative">
                        <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-indigo-100 dark:bg-indigo-900/50 -translate-y-1/2 -z-10"></div>
                        {PIPELINE_STAGES.map((stageName, sIdx) => {
                          const activeIdx = PIPELINE_STAGES.indexOf(currentStage);
                          const isDone = sIdx <= activeIdx;
                          const isCurrent = sIdx === activeIdx;

                          return (
                            <div key={sIdx} className="flex flex-col items-center gap-1">
                              <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                                isCurrent 
                                  ? 'bg-indigo-500 border-indigo-500 scale-110' 
                                  : isDone 
                                    ? 'bg-indigo-500 border-indigo-500' 
                                    : 'bg-white dark:bg-indigo-950 border-indigo-200 dark:border-indigo-900'
                              }`}></span>
                              <span className={isCurrent ? 'text-indigo-600 dark:text-pink-400 font-extrabold' : ''}>{stageName}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Advance Stage button */}
                      {currentStage !== 'Offer' && (
                        <button
                          onClick={() => handleAdvanceStage(job.id)}
                          className="w-full mt-2 btn-custom border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-pink-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 text-xs py-1.5 rounded-xl cursor-pointer bg-transparent"
                        >
                          Advance to {PIPELINE_STAGES[PIPELINE_STAGES.indexOf(currentStage) + 1]} <ArrowRight size={12} className="inline ml-1" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-indigo-100/50 dark:border-indigo-900/30 mt-5 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs text-indigo-400/80 dark:text-indigo-300 font-semibold flex items-center gap-1">
                      <MapPin size={12} /> {job.location}
                    </div>
                    <div className="text-xs text-indigo-950 dark:text-indigo-200 font-bold">
                      Stipend: {job.stipend}
                    </div>
                  </div>

                  {isApplied ? (
                    <div className="btn-custom bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-350 border border-emerald-500/25 text-xs gap-1.5 py-2">
                      <Check size={14} /> Registered
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApplyClick(job)}
                      className="btn-custom btn-brand-custom text-sm py-2 cursor-pointer border-0"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Application dialog modal */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setApplyModalJob(null)}
            className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm transition-opacity"
          ></div>

          <div className="bg-white dark:bg-indigo-950 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 shadow-xl max-w-lg w-full overflow-hidden relative z-10 animate-fadeIn text-indigo-950 dark:text-white">
            <div className="px-6 py-5 border-b border-indigo-100 dark:border-indigo-900/40">
              <h3 className="text-lg font-black text-indigo-950 dark:text-white">Job Application Simulator</h3>
              <p className="text-xs text-indigo-400/85 mt-1">Applying for {applyModalJob.title} at {applyModalJob.company}</p>
            </div>
            
            <div className="px-6 py-5 space-y-4">
              <div className="bg-indigo-50/30 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 space-y-1.5">
                <div className="text-xs text-indigo-400 font-bold uppercase">Estimated Package</div>
                <div className="font-extrabold text-indigo-950 dark:text-white text-lg">
                  {applyModalJob.stipend}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase mb-1.5 block">Statement of Purpose / Notes</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Why are you a good fit for this role? Mention your projects..."
                  rows="4"
                  className="input-premium-apply text-sm"
                ></textarea>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-indigo-100/50 dark:border-indigo-900/30 bg-indigo-50/10 dark:bg-indigo-950/10 flex justify-end gap-3">
              <button
                onClick={() => setApplyModalJob(null)}
                className="btn-custom btn-ghost border border-indigo-100 text-indigo-500 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-950/30 bg-transparent text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApply}
                className="btn-custom btn-brand-custom text-sm gap-1.5 border-0 cursor-pointer"
              >
                <Send size={14} /> Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
