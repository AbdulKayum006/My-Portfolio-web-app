import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Database } from 'lucide-react';
import { MLProject } from '../data/portfolioData';

interface CodeViewerModalProps {
  project: MLProject | null;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'python' | 'sql'>('python');
  const [copied, setCopied] = useState<boolean>(false);

  if (!project) return null;

  const currentCode = activeTab === 'python' ? project.pythonSnippet : (project.sqlQueryExample || '-- No SQL query specified');

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>Project Implementation Code</span>
            </div>
            <h3 className="text-base font-bold text-white line-clamp-1">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center justify-between my-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveTab('python')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'python'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Python / PyTorch Architecture</span>
            </button>

            {project.sqlQueryExample && (
              <button
                onClick={() => setActiveTab('sql')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'sql'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>MySQL Query Pattern</span>
              </button>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="relative bg-slate-900/90 border border-slate-800 rounded-xl p-4 overflow-hidden">
          <pre className="text-xs font-mono text-blue-200/90 overflow-x-auto max-h-[380px] leading-relaxed">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4 text-xs text-slate-400">
          <span>
            Architecture: <strong className="text-slate-200">{project.architecture.slice(0, 48)}...</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
