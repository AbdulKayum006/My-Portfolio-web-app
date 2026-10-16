import React, { useState } from 'react';
import { Layers, Code2, ExternalLink, Database, Activity, Sparkles } from 'lucide-react';
import { MLProject } from '../data/portfolioData';
import { CodeViewerModal } from './CodeViewerModal';

interface ProjectsSectionProps {
  projects: MLProject[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [activeCodeProject, setActiveCodeProject] = useState<MLProject | null>(null);

  const domains = ['All', 'Computer Vision', 'NLP & LLMs', 'Data Science', 'MLOps & Systems'];

  const filteredProjects = projects.filter(
    (p) => selectedDomain === 'All' || p.domain === selectedDomain
  );

  return (
    <section id="projects" className="py-20 border-t border-slate-800 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wider uppercase mb-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Production AI Systems & Open Source</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Machine Learning & Data Science Engineering
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
              Industrial-grade machine learning pipelines, deep convolutional and transformer architectures, and scalable full-stack hosting infrastructure built with Python, PyTorch, PHP, and MySQL.
            </p>
          </div>

          {/* Domain Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedDomain === dom
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid: 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl group"
            >
              <div>
                {/* Visual Media Container */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 border-b border-slate-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Subtle Unboxed Domain Over Image */}
                  <div className="absolute top-4 left-4 text-xs font-mono font-medium text-slate-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800">
                    {project.domain}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                    {project.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Architecture & Dataset Info */}
                  <div className="space-y-1.5 text-xs text-slate-400 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                    <div>
                      <strong className="text-slate-300 font-medium">Architecture: </strong>
                      <span>{project.architecture}</span>
                    </div>
                    <div>
                      <strong className="text-slate-300 font-medium">Dataset: </strong>
                      <span>{project.dataset}</span>
                    </div>
                  </div>

                  {/* Metrics Row with Tabular Figures */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                        <span className="block text-[11px] text-slate-400">{m.label}</span>
                        <span className="text-xs sm:text-sm font-bold font-mono text-blue-400 tabular-nums">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Clean Unboxed Tags with Typographic Separator */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1 font-mono">
                    <span className="text-slate-500 text-[11px]">Stack:</span>
                    {project.tags.map((tag, tIdx) => (
                      <React.Fragment key={tIdx}>
                        <span className="text-slate-300">{tag}</span>
                        {tIdx < project.tags.length - 1 && <span className="text-slate-600" aria-hidden="true">/</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                <button
                  onClick={() => setActiveCodeProject(project)}
                  className="flex items-center gap-1.5 font-semibold text-blue-400 hover:text-blue-300 transition-colors py-1"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Inspect Python Script</span>
                </button>

                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Live Lab</span>
                    </a>
                  )}
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>

      {/* Code Modal */}
      {activeCodeProject && (
        <CodeViewerModal
          project={activeCodeProject}
          onClose={() => setActiveCodeProject(null)}
        />
      )}
    </section>
  );
};
