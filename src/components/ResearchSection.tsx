import React, { useState } from 'react';
import { BookOpen, ExternalLink, Code2, Quote, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { ResearchPaper } from '../data/portfolioData';
import { BibtexModal } from './BibtexModal';

interface ResearchSectionProps {
  papers: ResearchPaper[];
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ papers }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBibtexPaper, setActiveBibtexPaper] = useState<ResearchPaper | null>(null);
  const [expandedPaperId, setExpandedPaperId] = useState<string | null>(null);

  const topics = [
    'All',
    'Self-Supervised Learning',
    'Foundation Models & LLMs',
    'Time Series',
    'Computer Vision',
    'Graph Neural Networks',
    'Explainable AI'
  ];

  const filteredPapers = papers.filter((p) => {
    const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      p.title.toLowerCase().includes(query) ||
      p.abstract.toLowerCase().includes(query) ||
      p.venue.toLowerCase().includes(query) ||
      p.authors.some((a) => a.toLowerCase().includes(query));
    return matchesTopic && matchesSearch;
  });

  return (
    <section id="research" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wider uppercase mb-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Academic Research Repository</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Peer-Reviewed Publications & Preprints
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
            Scholarly work in top-tier machine learning venues including IEEE TPAMI, NeurIPS, ICML, and CVPR, covering representation learning, efficient foundation models, and geometric graph architectures.
          </p>
        </div>

        {/* Search & Topic Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          
          {/* Topic Buttons (Interactive Filter Control) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedTopic === t
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, author, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Papers Grid */}
        <div className="space-y-6">
          {filteredPapers.map((paper) => {
            const isExpanded = expandedPaperId === paper.id;
            return (
              <article
                key={paper.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  
                  {/* Left Column: Details */}
                  <div className="space-y-3 flex-1">
                    
                    {/* Unboxed Metadata with Typographic Separators (Zero-Pill Discipline) */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
                      <span className="text-blue-400 font-semibold">{paper.venue}</span>
                      <span aria-hidden="true">·</span>
                      <span>{paper.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{paper.topic}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-300 tabular-nums">{paper.citations} Citations</span>
                      {paper.badge && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-semibold">{paper.badge}</span>
                        </>
                      )}
                    </div>

                    {/* Paper Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                      {paper.title}
                    </h3>

                    {/* Authors List */}
                    <div className="text-xs text-slate-300">
                      {paper.authors.map((author, idx) => (
                        <span key={idx}>
                          {author === 'Abdul Kayum' ? (
                            <strong className="text-white underline decoration-blue-500 underline-offset-2">
                              {author}
                            </strong>
                          ) : (
                            <span>{author}</span>
                          )}
                          {idx < paper.authors.length - 1 && ', '}
                        </span>
                      ))}
                    </div>

                    {/* Abstract (truncated or full) */}
                    <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
                      {isExpanded ? paper.abstract : `${paper.abstract.slice(0, 240)}...`}
                    </p>

                    {/* Expanded Methodology Box */}
                    {isExpanded && (
                      <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1 mt-3">
                        <span className="font-semibold text-blue-300 block">Methodology & Architecture:</span>
                        <p className="text-slate-400 leading-relaxed">{paper.methodologySummary}</p>
                      </div>
                    )}

                    {/* Metrics Row */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      {paper.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="text-xs">
                          <span className="text-slate-400 mr-1.5">{m.label}:</span>
                          <span className="font-bold font-mono text-slate-200 tabular-nums">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <button
                      onClick={() => setExpandedPaperId(isExpanded ? null : paper.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <span>{isExpanded ? 'Collapse' : 'Abstract & Method'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => setActiveBibtexPaper(paper)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-400 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 rounded-lg transition-colors"
                    >
                      <Quote className="w-3.5 h-3.5" />
                      <span>Cite (BibTeX)</span>
                    </button>

                    {paper.githubUrl && (
                      <a
                        href={paper.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Code Repo</span>
                      </a>
                    )}

                    {paper.pdfUrl && (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>arXiv / PDF</span>
                      </a>
                    )}
                  </div>

                </div>
              </article>
            );
          })}

          {filteredPapers.length === 0 && (
            <div className="text-center py-12 bg-slate-900/30 border border-slate-800 rounded-2xl">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No research papers found matching your criteria.</p>
            </div>
          )}
        </div>

      </div>

      {/* BibTeX Modal */}
      {activeBibtexPaper && (
        <BibtexModal
          paper={activeBibtexPaper}
          onClose={() => setActiveBibtexPaper(null)}
        />
      )}
    </section>
  );
};
