import React, { useState } from 'react';
import { Mail, Send, Check, Copy, MessageSquare, Building2, User, HelpCircle } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [inquiryType, setInquiryType] = useState('Research Collaboration');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const directEmail = 'abdulkayumgpmcbd@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;

    setIsSubmitting(true);
    // Simulate API call to PHP/MySQL backend
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Reset form
      setFullName('');
      setEmail('');
      setAffiliation('');
      setSubject('');
      setMessage('');
    }, 700);
  };

  return (
    <section id="contact" className="py-20 border-t border-slate-800 bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wider uppercase">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>Academic & Industry Collaboration</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Let's Build Intelligent Systems Together
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Open to sponsored research collaborations, machine learning consulting, guest lectures, doctoral peer reviews, and scalable AI infrastructure partnerships.
              </p>
            </div>

            {/* Email Contact Card */}
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Primary Research Dispatch
              </span>
              <div className="flex items-center justify-between gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-xs sm:text-sm font-mono text-white select-all truncate">
                  {directEmail}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/60 rounded-lg transition-colors shrink-0"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Response Time: Typically within 24–48 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Location: Available for global remote & onsite engagements</span>
                </div>
              </div>
            </div>

            {/* Academic Profiles & Repositories */}
            <div className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Scholarly Indices & Repositories
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <a
                  href="https://scholar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                  Google Scholar (2.4k+)
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                  GitHub (38+ Repos)
                </a>
                <a
                  href="https://orcid.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                  ORCID Profile
                </a>
                <a
                  href="https://arxiv.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                  arXiv Author Index
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interaction Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-500/80 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Inquiry Transmitted Successfully</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Thank you for reaching out. Your proposal has been cataloged into the research database and Abdul Kayum will review your message promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Julian Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. j.vance@stanford.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Affiliation */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Institution / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Deep Learning Lab, University"
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Research Collaboration">Academic Research Collaboration</option>
                      <option value="Industry Consulting">Enterprise Machine Learning Consulting</option>
                      <option value="Reviewer / Keynote">Peer Review / Keynote Speaking</option>
                      <option value="Data Science Project">Full-Stack Data Science & Hosting</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Subject / Project Scope
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Joint Paper on Latent Representation & Edge Inference"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Proposal Summary & Objectives *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your research objective, dataset requirements, or engineering collaboration proposal..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-xl shadow-lg transition-colors cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Recording Inquiry to Database...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Collaboration Proposal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
