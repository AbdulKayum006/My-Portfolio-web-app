import React from 'react';
import { Mail, Github, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-850">
          
          {/* Brand & Focus */}
          <div className="space-y-1 text-center md:text-left">
            <span className="text-sm font-bold text-white tracking-tight">
              Abdul Kayum
            </span>
            <p className="text-slate-400 text-xs">
              Senior Data Scientist & Deep Learning Researcher · Computational Intelligence
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 font-medium">
            <a href="#research" className="hover:text-slate-200 transition-colors">
              Research
            </a>
            <a href="#projects" className="hover:text-slate-200 transition-colors">
              Projects
            </a>
            <a href="#interactive-labs" className="hover:text-slate-200 transition-colors">
              Interactive Lab
            </a>
            <a href="#hosting-kit" className="hover:text-slate-200 transition-colors">
              Hosting Suite
            </a>
            <a href="#vitae" className="hover:text-slate-200 transition-colors">
              Curriculum Vitae
            </a>
            <a href="#contact" className="hover:text-slate-200 transition-colors">
              Contact
            </a>
          </div>

          {/* Direct Email Link */}
          <div className="text-center md:text-right">
            <a
              href="mailto:abdulkayumgpmcbd@gmail.com"
              className="text-blue-400 hover:text-blue-300 font-mono transition-colors"
            >
              abdulkayumgpmcbd@gmail.com
            </a>
          </div>

        </div>

        {/* Quiet Legal & Tech Spec */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-slate-400">
          <span>
            © 2026 Abdul Kayum. Research papers and open-source models distributed under MIT & Creative Commons.
          </span>
          <div className="flex items-center gap-2">
            <span>Powered by Python, PyTorch, PHP & MySQL Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
