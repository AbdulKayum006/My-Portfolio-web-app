import React, { useState } from 'react';
import { Database, Server, Terminal, Copy, Check, Download, Layers, ShieldCheck, Play, Sparkles } from 'lucide-react';
import { HOSTING_CODE_TEMPLATES, RESEARCH_PAPERS, ML_PROJECTS } from '../data/portfolioData';

export const HostingKitSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mysql' | 'php' | 'python' | 'sql-runner'>('mysql');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // SQL Runner state
  const [selectedPresetQuery, setSelectedPresetQuery] = useState<number>(0);
  const [customQuery, setCustomQuery] = useState<string>(
    'SELECT title, venue, year, citations FROM research_papers ORDER BY citations DESC LIMIT 4;'
  );
  const [queryResult, setQueryResult] = useState<{ columns: string[]; rows: any[][]; timeMs: number } | null>({
    columns: ['title', 'venue', 'year', 'citations'],
    rows: [
      ['Adaptive Attention Pruning and Low-Rank Alignment...', 'NeurIPS', 2024, 395],
      ['Self-Supervised Latent Representation Learning...', 'IEEE TPAMI', 2025, 284],
      ['Counterfactual Attribution & Gradient SHAP...', 'JAIR', 2023, 219],
      ['Multivariate Probabilistic Deep Time-Series...', 'ICML', 2024, 182]
    ],
    timeMs: 0.38
  });

  const presetQueries = [
    {
      label: 'Top Cited Papers (NeurIPS, TPAMI, ICML)',
      query: 'SELECT title, venue, year, citations FROM research_papers ORDER BY citations DESC LIMIT 4;'
    },
    {
      label: 'Projects by Technical Domain',
      query: 'SELECT domain, COUNT(*) AS total_projects, MAX(tags_json) AS sample_stack FROM ml_projects GROUP BY domain;'
    },
    {
      label: 'Low-Latency Production Models',
      query: 'SELECT project_slug, domain, architecture FROM ml_projects WHERE is_featured = 1;'
    }
  ];

  const handleRunQuery = () => {
    const start = performance.now();
    // Simulate query execution
    if (customQuery.toLowerCase().includes('group by domain')) {
      const domains: Record<string, number> = {};
      ML_PROJECTS.forEach((p) => {
        domains[p.domain] = (domains[p.domain] || 0) + 1;
      });
      const rows = Object.entries(domains).map(([dom, count]) => [dom, count, 'Python, PyTorch, Docker']);
      setQueryResult({
        columns: ['domain', 'total_projects', 'sample_stack'],
        rows,
        timeMs: Number((performance.now() - start + 0.25).toFixed(2))
      });
    } else if (customQuery.toLowerCase().includes('where is_featured = 1')) {
      const rows = ML_PROJECTS.map((p) => [p.id, p.domain, p.architecture.slice(0, 50) + '...']);
      setQueryResult({
        columns: ['project_slug', 'domain', 'architecture'],
        rows,
        timeMs: Number((performance.now() - start + 0.31).toFixed(2))
      });
    } else {
      const rows = RESEARCH_PAPERS.slice(0, 4).map((p) => [
        p.title.slice(0, 52) + '...',
        p.venue.split('(')[0].trim(),
        p.year,
        p.citations
      ]);
      setQueryResult({
        columns: ['title', 'venue', 'year', 'citations'],
        rows,
        timeMs: Number((performance.now() - start + 0.18).toFixed(2))
      });
    }
  };

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadSql = () => {
    const blob = new Blob([HOSTING_CODE_TEMPLATES.mysqlSchema], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abdulkayum_portfolio_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="hosting-kit" className="py-20 border-t border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 tracking-wider uppercase mb-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Full-Stack Hosting & API Architecture Kit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Deployable MySQL, PHP & Python Backend Suite
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
            Ready-to-deploy relational database schemas, secured PHP 8 PDO REST endpoints, and high-performance Python FastAPI inference workers for hosting machine learning models and academic research on any server or LAMP/cPanel environment.
          </p>
        </div>

        {/* High-Level Architecture Diagram Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <Database className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">MySQL 8.0 / MariaDB</h3>
            </div>
            <p className="text-xs text-slate-400">
              Normalized tables for research papers, BibTeX records, ML benchmarks, telemetry logs, and contact inquiries with composite indexing.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <Server className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">PHP 8.x + PDO Gateway</h3>
            </div>
            <p className="text-xs text-slate-400">
              Secure, fast RESTful API endpoints with parameterized queries, CORS support, JSON serialization, and sanitization.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <Terminal className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Python FastAPI + PyTorch</h3>
            </div>
            <p className="text-xs text-slate-400">
              Asynchronous model serving microservice handling neural network evaluation, probabilistic time series forecasting, and CUDA acceleration.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('mysql')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'mysql'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MySQL Schema (schema.sql)
          </button>
          <button
            onClick={() => setActiveTab('php')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'php'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PHP REST API (api/index.php)
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'python'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Python ML Server (server.py)
          </button>
          <button
            onClick={() => setActiveTab('sql-runner')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'sql-runner'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive SQL Query Runner
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="text-xs font-mono text-slate-300">
                {activeTab === 'mysql' && 'database/schema.sql — 4 Tables + Foreign Keys'}
                {activeTab === 'php' && 'backend/api/index.php — PHP 8 PDO REST Router'}
                {activeTab === 'python' && 'mlops/server.py — FastAPI Async Inference'}
                {activeTab === 'sql-runner' && 'Interactive Live Relational Database Terminal'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'mysql' && (
                <button
                  onClick={downloadSql}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download .sql</span>
                </button>
              )}

              {activeTab !== 'sql-runner' && (
                <button
                  onClick={() => {
                    const code =
                      activeTab === 'mysql'
                        ? HOSTING_CODE_TEMPLATES.mysqlSchema
                        : activeTab === 'php'
                        ? HOSTING_CODE_TEMPLATES.phpApiScript
                        : HOSTING_CODE_TEMPLATES.pythonServerScript;
                    copyCode(code, activeTab);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                >
                  {copiedKey === activeTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Tab 1: MySQL Schema */}
          {activeTab === 'mysql' && (
            <div className="p-6">
              <pre className="text-xs font-mono text-amber-200/90 overflow-x-auto max-h-[460px] leading-relaxed">
                <code>{HOSTING_CODE_TEMPLATES.mysqlSchema}</code>
              </pre>
            </div>
          )}

          {/* Tab 2: PHP API Script */}
          {activeTab === 'php' && (
            <div className="p-6">
              <pre className="text-xs font-mono text-purple-200/90 overflow-x-auto max-h-[460px] leading-relaxed">
                <code>{HOSTING_CODE_TEMPLATES.phpApiScript}</code>
              </pre>
            </div>
          )}

          {/* Tab 3: Python Server Script */}
          {activeTab === 'python' && (
            <div className="p-6">
              <pre className="text-xs font-mono text-blue-200/90 overflow-x-auto max-h-[460px] leading-relaxed">
                <code>{HOSTING_CODE_TEMPLATES.pythonServerScript}</code>
              </pre>
            </div>
          )}

          {/* Tab 4: Interactive SQL Query Runner */}
          {activeTab === 'sql-runner' && (
            <div className="p-6 space-y-6">
              {/* Presets */}
              <div>
                <span className="block text-xs font-medium text-slate-400 mb-2">
                  Sample SQL Queries to Test:
                </span>
                <div className="flex flex-wrap gap-2">
                  {presetQueries.map((pq, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedPresetQuery(idx);
                        setCustomQuery(pq.query);
                      }}
                      className={`px-3 py-1.5 text-xs rounded-lg border text-left transition-colors ${
                        selectedPresetQuery === idx
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {pq.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SQL Input Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">SQL Query Buffer</span>
                  <span>Dialect: MySQL 8.x / MariaDB</span>
                </div>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                  <button
                    onClick={handleRunQuery}
                    className="absolute right-3 bottom-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Query</span>
                  </button>
                </div>
              </div>

              {/* Results Table */}
              {queryResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Query Result: {queryResult.rows.length} rows</span>
                    <span className="text-emerald-400 tabular-nums">Execution time: {queryResult.timeMs} ms</span>
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-300">
                        <tr>
                          {queryResult.columns.map((col, i) => (
                            <th key={i} className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[11px]">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {queryResult.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                            {row.map((val, cIdx) => (
                              <td key={cIdx} className="py-2.5 px-4 tabular-nums">
                                {typeof val === 'number' ? val.toLocaleString() : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
