import React, { useState } from 'react';
import { X, Copy, Check, BookOpen, Quote } from 'lucide-react';
import { ResearchPaper } from '../data/portfolioData';

interface BibtexModalProps {
  paper: ResearchPaper | null;
  onClose: () => void;
}

export const BibtexModal: React.FC<BibtexModalProps> = ({ paper, onClose }) => {
  const [citationFormat, setCitationFormat] = useState<'bibtex' | 'apa' | 'mla' | 'ieee'>('bibtex');
  const [copied, setCopied] = useState<boolean>(false);

  if (!paper) return null;

  const getFormattedCitation = (): string => {
    const authorsStr = paper.authors.join(', ');
    if (citationFormat === 'bibtex') {
      return paper.bibtex;
    }
    if (citationFormat === 'apa') {
      return `${authorsStr} (${paper.year}). ${paper.title}. ${paper.venue}.${paper.doi ? ` https://doi.org/${paper.doi}` : ''}`;
    }
    if (citationFormat === 'mla') {
      return `${paper.authors[0]}, et al. "${paper.title}." ${paper.venue}, ${paper.year}.`;
    }
    // IEEE
    return `${authorsStr}, "${paper.title}," ${paper.venue}, ${paper.year}.`;
  };

  const textToCopy = getFormattedCitation();

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-400">
              <Quote className="w-3.5 h-3.5" />
              <span>Academic Citation Generator</span>
            </div>
            <h3 className="text-base font-bold text-white line-clamp-2">
              {paper.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-2 my-4">
          <span className="text-xs text-slate-400">Format:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {(['bibtex', 'apa', 'mla', 'ieee'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setCitationFormat(fmt)}
                className={`px-3 py-1 text-xs font-semibold uppercase rounded-md transition-colors ${
                  citationFormat === fmt
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Citation Body */}
        <div className="relative bg-slate-900/80 border border-slate-800 rounded-xl p-4 my-2">
          <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap break-all leading-relaxed max-h-60 overflow-y-auto">
            <code>{textToCopy}</code>
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4 text-xs">
          <span className="text-slate-400">
            Venue: <span className="text-slate-200 font-medium">{paper.venue}</span> ({paper.year})
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 font-medium text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied Citation!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Citation</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
