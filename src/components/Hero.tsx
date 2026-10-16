import React from 'react';
import { ArrowRight, BookOpen, Terminal, Sparkles, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Screen 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Domain Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Data Science · Deep Learning · Academic Research</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              Pioneering Machine Learning, Deep Neural Architectures & Scalable AI Systems
            </h1>

            {/* Lead Prose */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              I am an AI researcher and Senior Data Scientist specializing in self-supervised latent representation learning, transformer parameter optimization, computer vision, and probabilistic time series modeling with Python. I engineer full-stack machine learning architectures spanning mathematical PyTorch implementations, robust MySQL data stores, and high-performance PHP/FastAPI backend APIs.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#research"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Research Papers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#interactive-labs"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
              >
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>Launch Interactive ML Lab</span>
              </a>
            </div>

            {/* Quiet Credentials text with typographic separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-3">
              <span>Ph.D. in Computer Science (AI/ML)</span>
              <span aria-hidden="true">·</span>
              <span>IEEE & ACM Member</span>
              <span aria-hidden="true">·</span>
              <span>NeurIPS & ICML Reviewer</span>
            </div>
          </div>

          {/* Right Column: Visual Anchor */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              <img
                src="/src/assets/images/hero_ai_researcher_1792126162026.jpg"
                alt="Abdul Kayum in the Cognitive Computing & Deep Learning Laboratory"
                className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              
              {/* Bottom Meta Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs">
                <div className="flex items-center justify-between text-slate-200">
                  <span className="font-semibold">Abdul Kayum</span>
                  <span className="font-mono text-[11px] text-blue-400">Lab Lead & Primary Investigator</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-1">
                  <span>Deep Learning & Data Science</span>
                  <span aria-hidden="true">·</span>
                  <span>Python · PHP · MySQL</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Full-Width 4-Column Metric Ribbon Below Split */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              14+
            </span>
            <span className="text-xs text-slate-400 font-medium mt-1 block">
              Peer-Reviewed Publications (NeurIPS, TPAMI, ICML)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="block text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono tabular-nums">
              2,400+
            </span>
            <span className="text-xs text-slate-400 font-medium mt-1 block">
              Total Academic Citations (Google Scholar)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              110 FPS
            </span>
            <span className="text-xs text-slate-400 font-medium mt-1 block">
              TensorRT Real-Time 4K Vision Inference
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="block text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono tabular-nums">
              99.4%
            </span>
            <span className="text-xs text-slate-400 font-medium mt-1 block">
              SOTA Robustness & Clinical Agreement Benchmark
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
