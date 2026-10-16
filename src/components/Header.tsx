import React from 'react';
import { Mail, PlusCircle } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddModal, onOpenContact }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="text-base sm:text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-blue-400 transition-colors"
          >
            Abdul Kayum · AI Lab
          </a>

          {/* Zone 2: 4-5 clean single-line nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a
              href="#research"
              className="hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Research Papers
            </a>
            <a
              href="#projects"
              className="hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Projects & Systems
            </a>
            <a
              href="#interactive-labs"
              className="hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Interactive ML Lab
            </a>
            <a
              href="#hosting-kit"
              className="hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Hosting & API Suite
            </a>
            <a
              href="#vitae"
              className="hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Curriculum Vitae
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
              title="Add Paper or Project to Portfolio"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Add Entry</span>
            </button>
            <button
              onClick={onOpenContact}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              Contact & Collaborate
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
