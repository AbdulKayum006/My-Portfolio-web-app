import React, { useState } from 'react';
import { Award, Briefcase, GraduationCap, CheckCircle2, Download, Printer } from 'lucide-react';
import { SKILL_CATEGORIES, RESUME_EXPERIENCE, EDUCATION_LIST } from '../data/portfolioData';

export const VitaeSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="vitae" className="py-20 border-t border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wider uppercase mb-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Academic Curriculum Vitae & Credentials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Research Experience & Technical Mastery
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
              Track record of doctoral research, industrial AI leadership, journal reviewing, and rigorous full-stack implementations across Python, PHP, and relational MySQL data systems.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Print / Save CV (PDF)</span>
            </button>
          </div>
        </div>

        {/* 2-Column Main Layout: Timeline (Left) & Skills Matrix (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Experience & Education Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Experience Group */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-slate-800">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span>Research & Professional Appointments</span>
              </div>

              <div className="space-y-6">
                {RESUME_EXPERIENCE.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-slate-800 pb-2">
                    <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-slate-950" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-base font-bold text-white">{exp.role}</h3>
                      <span className="text-xs font-mono text-slate-400 tabular-nums">{exp.period}</span>
                    </div>
                    <span className="text-xs font-medium text-blue-400 block mb-2">{exp.organization}</span>
                    <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Group */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-slate-800">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Academic Degrees & Honors</span>
              </div>

              <div className="space-y-6">
                {EDUCATION_LIST.map((edu, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-slate-800 pb-2">
                    <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-slate-950" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                      <span className="text-xs font-mono text-slate-400 tabular-nums">{edu.period}</span>
                    </div>
                    <span className="text-xs font-medium text-emerald-400 block mb-1">{edu.institution}</span>
                    <span className="text-xs text-slate-400 font-mono block">Honors: {edu.honors}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scholarly Services & Editorial Memberships */}
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Editorial & Conference Reviewing Service
              </span>
              <div className="text-xs text-slate-400 leading-relaxed">
                Regular reviewer for: <strong className="text-slate-200">NeurIPS (2023, 2024)</strong>, <strong className="text-slate-200">ICML (2024, 2025)</strong>, <strong className="text-slate-200">CVPR (2023–2025)</strong>, <strong className="text-slate-200">IEEE TPAMI</strong>, and <strong className="text-slate-200">ACM Transactions on Computing</strong>.
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Skills Matrix (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Technical Proficiency Matrix</h3>
              <p className="text-xs text-slate-400 mt-1">
                Quantitative self-assessment validated through codebases, production deployments, and academic benchmarks.
              </p>
            </div>

            {/* Category Selectors */}
            <div className="grid grid-cols-2 gap-2">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(idx)}
                  className={`p-2.5 text-xs font-medium text-left rounded-xl border transition-all ${
                    activeCategory === idx
                      ? 'bg-blue-950/60 border-blue-500/80 text-blue-200 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="block font-semibold">{cat.category}</span>
                </button>
              ))}
            </div>

            {/* Active Category Description */}
            <div className="text-xs text-slate-400 italic">
              {SKILL_CATEGORIES[activeCategory].description}
            </div>

            {/* Skills Bars */}
            <div className="space-y-4 pt-1">
              {SKILL_CATEGORIES[activeCategory].skills.map((skill, sIdx) => (
                <div key={sIdx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>{skill.name}</span>
                    <span className="font-mono text-blue-400 tabular-nums">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {skill.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono text-slate-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Multi-Stack Compatibility Badge */}
            <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Architecture Highlights:</span>
              <ul className="space-y-1 list-disc list-inside text-slate-400 text-[11px]">
                <li>Python asynchronous FastAPI microservices with PyTorch/TensorRT inference.</li>
                <li>MySQL 8 relational schema design, indexing, and high-concurrency connection pools.</li>
                <li>PHP 8.x PDO APIs for clean cPanel/LAMP server hosting without Node requirements.</li>
                <li>Docker containerization with NVIDIA runtime GPU acceleration.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
