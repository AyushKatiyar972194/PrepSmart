import React, { useState, useEffect } from 'react';
import { FileText, Save, Plus, X, Award, Printer, LayoutTemplate } from 'lucide-react';

const INITIAL_RESUME = {
  fullName: '',
  email: '',
  phone: '',
  role: '',
  summary: '',
  education: '',
  projects: [
    { title: '', desc: '', tech: '' }
  ],
  skills: []
};

export default function ResumeBuilder({ resumeData, onSave }) {
  const [resume, setResume] = useState(resumeData || INITIAL_RESUME);
  const [skillInput, setSkillInput] = useState('');
  const [activeTemplate, setActiveTemplate] = useState('classic'); // classic, modern, minimalist

  // Calculate ATS Score dynamically
  const calculateATS = () => {
    const sections = [
      { field: resume.fullName, weight: 15 },
      { field: resume.email, weight: 10 },
      { field: resume.phone, weight: 10 },
      { field: resume.role, weight: 15 },
      { field: resume.summary, weight: 15 },
      { field: resume.education, weight: 15 },
    ];

    let score = sections.reduce((sum, sec) => {
      return sum + (sec.field && sec.field.trim().length > 0 ? sec.weight : 0);
    }, 0);

    const validProjects = resume.projects.filter(p => p.title.trim() && p.desc.trim()).length;
    if (validProjects > 0) score += 10;

    if (resume.skills.length >= 3) {
      score += 10;
    } else if (resume.skills.length > 0) {
      score += 5;
    }

    return score;
  };

  const atsScore = calculateATS();

  // Debounced auto-save progress on change (improves typing performance)
  useEffect(() => {
    const handler = setTimeout(() => {
      onSave(resume, atsScore, false);
    }, 400);

    return () => clearTimeout(handler);
  }, [resume, atsScore, onSave]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill && !resume.skills.includes(cleanSkill)) {
      setResume((prev) => ({
        ...prev,
        skills: [...prev.skills, cleanSkill]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  const handleProjectChange = (index, field, val) => {
    const updatedProjects = [...resume.projects];
    updatedProjects[index][field] = val;
    setResume((prev) => ({
      ...prev,
      projects: updatedProjects
    }));
  };

  const handleAddProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: '', desc: '', tech: '' }]
    }));
  };

  const handleRemoveProject = (index) => {
    if (resume.projects.length > 1) {
      setResume((prev) => ({
        ...prev,
        projects: prev.projects.filter((_, idx) => idx !== index)
      }));
    }
  };

  const handleSave = () => {
    onSave(resume, atsScore, true);
  };

  return (
    <div className="space-y-6 dark:text-white">
      {/* Overview Block */}
      <div className="row g-4 items-center no-print">
        <div className="col-12 col-lg-8">
          <h2 className="text-2xl font-black text-indigo-950 dark:text-white">ATS Resume Builder & Customizer</h2>
          <p className="text-indigo-400/80 dark:text-indigo-300 text-sm mt-1">
            Create a professional resume. Toggle templates (Classic LaTeX, Modern 2-Column, Minimalist) to reflow layout instantly. Aim for &ge; 80% score to qualify for mock placements.
          </p>
        </div>
        <div className="col-12 col-lg-4 text-end">
          <div className="inline-flex items-center gap-3 bg-white dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-3 shadow-sm">
            <div className="text-left">
              <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">ATS Score</div>
              <div className="text-2xl font-black text-indigo-600 dark:text-pink-400">{atsScore}%</div>
            </div>
            <div className="p-2.5 bg-indigo-50/50 dark:bg-indigo-900/30 text-indigo-500 rounded-xl">
              <Award size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection Switcher (no-print) */}
      <div className="no-print glass rounded-3xl p-4 border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <LayoutTemplate size={20} className="text-indigo-500" />
          <span className="text-sm font-bold text-indigo-950 dark:text-white">Select Print Template Style:</span>
        </div>
        <div className="flex gap-2">
          {[
            { id: 'classic', label: 'Classic LaTeX' },
            { id: 'modern', label: 'Modern 2-Column' },
            { id: 'minimalist', label: 'Elegant Minimalist' }
          ].map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setActiveTemplate(tpl.id)}
              className={`chip text-xs border-0 font-bold whitespace-nowrap cursor-pointer ${
                activeTemplate === tpl.id 
                  ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-600' 
                  : ''
              }`}
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="resume-grid-container grid lg:grid-cols-2 gap-6 items-start">
        {/* Form Inputs */}
        <div className="glass rounded-3xl p-5 sm:p-6 border shadow-sm space-y-6 no-print">
          <h3 className="text-lg font-bold border-b border-indigo-100/50 dark:border-indigo-900/30 pb-3 flex items-center gap-2 text-indigo-950 dark:text-white">
            <FileText size={20} className="text-indigo-500" />
            Resume Details
          </h3>

          <div className="space-y-4">
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="text-xs font-bold text-indigo-400 uppercase mb-1.5 block">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={resume.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Ayush Katiyar"
                  className="input-premium-apply"
                />
              </div>
              <div className="col-12 col-sm-6">
                <label className="text-xs font-bold text-indigo-400 uppercase mb-1.5 block">Target Role</label>
                <input 
                  type="text" 
                  name="role" 
                  value={resume.role}
                  onChange={handleChange}
                  placeholder="e.g. SDE Intern"
                  className="input-premium-apply"
                />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="text-xs font-bold text-indigo-400 uppercase mb-1.5 block">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={resume.email}
                  onChange={handleChange}
                  placeholder="e.g. ayush@example.com"
                  className="input-premium-apply"
                />
              </div>
              <div className="col-12 col-sm-6">
                <label className="text-xs font-bold text-indigo-400 uppercase mb-1.5 block">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={resume.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="input-premium-apply"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-indigo-400 uppercase mb-1.5 block">Professional Summary</label>
              <textarea 
                name="summary" 
                value={resume.summary}
                onChange={handleChange}
                rows="3"
                placeholder="Brief technical summary..."
                className="input-premium-apply"
              ></textarea>
            </div>

            <div>
              <label className="text-xs font-bold text-indigo-400 uppercase mb-1.5 block">Education</label>
              <input 
                type="text" 
                name="education" 
                value={resume.education}
                onChange={handleChange}
                placeholder="e.g. B.Tech in CSE, ABC University, 2026"
                className="input-premium-apply"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-indigo-400 uppercase mb-1.5 block">Skills</label>
              <form onSubmit={handleAddSkill} className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g. React, Node.js, Express"
                  className="input-premium-apply flex-1"
                />
                <button 
                  type="submit" 
                  className="btn-custom btn-brand-custom px-3.5 py-2.5 rounded-xl border-0 flex items-center justify-center cursor-pointer"
                >
                  <Plus size={18} />
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {resume.skills.length === 0 ? (
                  <span className="text-xs text-indigo-300 italic">No skills added yet.</span>
                ) : (
                  resume.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-200 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40"
                    >
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-indigo-400 hover:text-indigo-600 bg-transparent border-0 p-0 cursor-pointer inline-flex items-center"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-indigo-400 uppercase block">Projects</label>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="text-xs font-extrabold text-indigo-650 hover:text-indigo-800 border-0 bg-transparent cursor-pointer flex items-center gap-1 p-0"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>

              <div className="space-y-4">
                {resume.projects.map((proj, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/40 relative space-y-3">
                    {resume.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(index)}
                        className="absolute top-3 right-3 text-indigo-400 hover:text-indigo-600 border-0 bg-transparent cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    )}

                    <div className="row g-2">
                      <div className="col-12 col-sm-6">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={proj.title}
                          onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                          className="input-premium-apply py-1.5 text-sm"
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <input
                          type="text"
                          placeholder="Tech (e.g. React, CSS)"
                          value={proj.tech}
                          onChange={(e) => handleProjectChange(index, 'tech', e.target.value)}
                          className="input-premium-apply py-1.5 text-sm"
                        />
                      </div>
                    </div>

                    <textarea
                      placeholder="Project Description..."
                      value={proj.desc}
                      onChange={(e) => handleProjectChange(index, 'desc', e.target.value)}
                      rows="2"
                      className="input-premium-apply py-1.5 text-sm"
                    ></textarea>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-indigo-100/50 dark:border-indigo-900/30">
            <button 
              onClick={() => window.print()}
              className="flex-1 btn-custom btn-ghost border border-indigo-100 text-indigo-600 hover:bg-indigo-55 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-950/30 text-sm gap-1.5 bg-transparent cursor-pointer"
            >
              <Printer size={16} /> Print Resume
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 btn-custom btn-brand-custom text-sm gap-1.5 border-0 cursor-pointer"
            >
              <Save size={16} /> Save Progress
            </button>
          </div>
        </div>

        {/* Live Resume Sheet Previewer (Always White background for PDF/Print representation) */}
        <div id="resume-preview-section" className="bg-white text-black border border-slate-200 rounded-3xl p-8 shadow-sm print:p-0 print:border-0 print:shadow-none min-h-[640px] text-left">
          
          {/* CLASSIC LATEX TEMPLATE */}
          {activeTemplate === 'classic' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center pb-2 border-b border-slate-200">
                <h1 className="text-2xl font-bold tracking-tight m-0 uppercase text-slate-900">
                  {resume.fullName || 'YOUR FULL NAME'}
                </h1>
                <p className="text-slate-700 font-semibold text-xs uppercase tracking-wider mt-1">
                  {resume.role || 'Target Professional Role'}
                </p>
                <div className="flex justify-center gap-3 text-xs text-slate-600 mt-2 font-medium flex-wrap">
                  {resume.email && <span>{resume.email}</span>}
                  {resume.email && resume.phone && <span>|</span>}
                  {resume.phone && <span>{resume.phone}</span>}
                </div>
              </div>

              {resume.summary && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-0.5">
                    Professional Summary
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                    {resume.summary}
                  </p>
                </div>
              )}

              {resume.skills.length > 0 && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-0.5">
                    Technical Skills
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    <span className="font-semibold">Core Skills:</span> {resume.skills.join(', ')}
                  </p>
                </div>
              )}

              {resume.projects.some(p => p.title.trim()) && (
                <div className="space-y-2.5">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-0.5">
                    Projects
                  </h2>
                  <div className="space-y-3">
                    {resume.projects.map((proj, idx) => {
                      if (!proj.title.trim()) return null;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs font-bold text-slate-800">
                              {proj.title} {proj.tech && <span className="text-[11px] font-normal text-slate-600 italic">— {proj.tech}</span>}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                            {proj.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {resume.education && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-0.5">
                    Education
                  </h2>
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    {resume.education}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* MODERN TWO-COLUMN TECH TEMPLATE */}
          {activeTemplate === 'modern' && (
            <div className="grid grid-cols-3 gap-6 animate-fadeIn h-full -m-8 min-h-[640px]">
              {/* Left Side Info column */}
              <div className="bg-indigo-950 text-indigo-100 p-6 col-span-1 space-y-6 flex flex-col justify-between rounded-l-3xl print:rounded-none">
                <div className="space-y-6">
                  <div className="border-b border-indigo-800 pb-4">
                    <h1 className="text-xl font-black uppercase tracking-tight text-white">
                      {resume.fullName || 'FULL NAME'}
                    </h1>
                    <p className="text-pink-400 font-bold text-[10px] uppercase tracking-wider mt-1">
                      {resume.role || 'Target Role'}
                    </p>
                  </div>

                  {/* Contacts */}
                  <div className="space-y-3 text-[11px] text-indigo-200">
                    <div className="font-bold text-xs uppercase tracking-wider text-indigo-400">Contact</div>
                    {resume.email && <div className="break-all">{resume.email}</div>}
                    {resume.phone && <div>{resume.phone}</div>}
                  </div>

                  {/* Skills lists */}
                  {resume.skills.length > 0 && (
                    <div className="space-y-3">
                      <div className="font-bold text-xs uppercase tracking-wider text-indigo-400">Skills</div>
                      <div className="flex flex-col gap-1.5">
                        {resume.skills.map((s, idx) => (
                          <div key={idx} className="text-[11px] font-semibold flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-pink-400"></span>
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[9px] text-indigo-400 uppercase tracking-widest font-mono">Modern Tech PDF</div>
              </div>

              {/* Right main column details */}
              <div className="col-span-2 p-6 space-y-5 text-slate-800">
                {resume.summary && (
                  <div className="space-y-2">
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-slate-900 pb-1">
                      Profile
                    </h2>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                      {resume.summary}
                    </p>
                  </div>
                )}

                {resume.projects.some(p => p.title.trim()) && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-slate-900 pb-1">
                      Projects
                    </h2>
                    <div className="space-y-3">
                      {resume.projects.map((proj, idx) => {
                        if (!proj.title.trim()) return null;
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="font-bold text-xs text-slate-950 flex justify-between">
                              <span>{proj.title}</span>
                              {proj.tech && <span className="text-[10px] text-slate-500 italic font-normal">{proj.tech}</span>}
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                              {proj.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {resume.education && (
                  <div className="space-y-2">
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-slate-900 pb-1">
                      Education
                    </h2>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                      {resume.education}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ELEGANT MINIMALIST TEMPLATE */}
          {activeTemplate === 'minimalist' && (
            <div className="space-y-6 animate-fadeIn font-serif">
              {/* Header */}
              <div className="text-center space-y-1 pb-4">
                <h1 className="text-3xl font-light tracking-widest text-slate-900 uppercase">
                  {resume.fullName || 'YOUR NAME'}
                </h1>
                <p className="text-slate-600 font-serif italic text-xs tracking-wider">
                  {resume.role || 'Target Professional Role'}
                </p>
                <div className="flex justify-center gap-4 text-xs text-slate-500 mt-3 font-serif flex-wrap">
                  {resume.email && <span>{resume.email}</span>}
                  {resume.phone && <span>{resume.phone}</span>}
                </div>
              </div>

              {resume.summary && (
                <div className="space-y-1">
                  <div className="text-center font-bold text-[10px] tracking-widest uppercase text-slate-400 mb-1">— SUMMARY —</div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal text-center max-w-lg mx-auto whitespace-pre-line">
                    {resume.summary}
                  </p>
                </div>
              )}

              {resume.projects.some(p => p.title.trim()) && (
                <div className="space-y-3">
                  <div className="text-center font-bold text-[10px] tracking-widest uppercase text-slate-400 mb-1">— PROJECTS —</div>
                  <div className="space-y-3">
                    {resume.projects.map((proj, idx) => {
                      if (!proj.title.trim()) return null;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-baseline border-b border-slate-100 pb-0.5">
                            <span className="text-xs font-bold text-slate-800">{proj.title}</span>
                            {proj.tech && <span className="text-[10px] text-slate-500 italic">{proj.tech}</span>}
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                            {proj.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {resume.skills.length > 0 && (
                <div className="space-y-1">
                  <div className="text-center font-bold text-[10px] tracking-widest uppercase text-slate-400 mb-1">— TECHNICAL SKILLS —</div>
                  <p className="text-xs text-slate-700 text-center leading-relaxed font-normal max-w-lg mx-auto">
                    {resume.skills.join('  •  ')}
                  </p>
                </div>
              )}

              {resume.education && (
                <div className="space-y-1">
                  <div className="text-center font-bold text-[10px] tracking-widest uppercase text-slate-400 mb-1">— EDUCATION —</div>
                  <p className="text-xs text-slate-700 text-center font-semibold leading-relaxed">
                    {resume.education}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
