import React, { useState } from 'react';
import { X, Plus, BookOpen, Layers, Check, Database, Copy } from 'lucide-react';
import { ResearchPaper, MLProject } from '../data/portfolioData';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPaper: (paper: ResearchPaper) => void;
  onAddProject: (project: MLProject) => void;
}

export const AddEntryModal: React.FC<AddEntryModalProps> = ({
  isOpen,
  onClose,
  onAddPaper,
  onAddProject
}) => {
  const [entryType, setEntryType] = useState<'paper' | 'project'>('paper');

  // Paper form states
  const [paperTitle, setPaperTitle] = useState('');
  const [paperAuthors, setPaperAuthors] = useState('Abdul Kayum');
  const [paperVenue, setPaperVenue] = useState('NeurIPS 2026');
  const [paperYear, setPaperYear] = useState(2026);
  const [paperTopic, setPaperTopic] = useState<ResearchPaper['topic']>('Foundation Models & LLMs');
  const [paperAbstract, setPaperAbstract] = useState('');
  const [paperArxiv, setPaperArxiv] = useState('');

  // Project form states
  const [projTitle, setProjTitle] = useState('');
  const [projDomain, setProjDomain] = useState<MLProject['domain']>('Deep Learning');
  const [projSummary, setProjSummary] = useState('');
  const [projArchitecture, setProjArchitecture] = useState('');
  const [projDataset, setProjDataset] = useState('');
  const [projTags, setProjTags] = useState('Python, PyTorch, CUDA');

  const [generatedSql, setGeneratedSql] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handlePaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperTitle || !paperAbstract) return;

    const newPaper: ResearchPaper = {
      id: `paper-${Date.now()}`,
      title: paperTitle,
      authors: paperAuthors.split(',').map((a) => a.trim()),
      venue: paperVenue,
      venueType: 'Conference',
      year: Number(paperYear),
      citations: 0,
      arxivId: paperArxiv || undefined,
      topic: paperTopic,
      abstract: paperAbstract,
      methodologySummary: 'Custom neural architecture with optimized loss function and empirical ablation benchmarks.',
      metrics: [
        { label: 'Evaluation Metric', value: 'SOTA Result' },
        { label: 'Status', value: 'Published / Verified' }
      ],
      bibtex: `@inproceedings{kayum${paperYear}${paperTitle.slice(0, 10).toLowerCase().replace(/[^a-z]/g, '')},
  author    = {${paperAuthors}},
  title     = {${paperTitle}},
  booktitle = {${paperVenue}},
  year      = {${paperYear}}
}`
    };

    const sql = `INSERT INTO \`research_papers\` (\`paper_slug\`, \`title\`, \`authors\`, \`venue\`, \`year\`, \`topic\`, \`abstract\`, \`bibtex\`) 
VALUES ('${newPaper.id}', '${paperTitle.replace(/'/g, "''")}', '${paperAuthors.replace(/'/g, "''")}', '${paperVenue.replace(/'/g, "''")}', ${paperYear}, '${paperTopic}', '${paperAbstract.replace(/'/g, "''")}', '${newPaper.bibtex.replace(/'/g, "''")}');`;
    setGeneratedSql(sql);

    onAddPaper(newPaper);
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projSummary) return;

    const newProject: MLProject = {
      id: `proj-${Date.now()}`,
      title: projTitle,
      domain: projDomain,
      summary: projSummary,
      architecture: projArchitecture || 'Deep Neural Network with Custom Attention Layers',
      dataset: projDataset || 'Standardized Open Benchmark Dataset',
      metrics: [
        { label: 'Accuracy', value: '96.5%' },
        { label: 'Latency', value: '8.2 ms' },
        { label: 'Framework', value: 'PyTorch / Python' }
      ],
      tags: projTags.split(',').map((t) => t.trim()),
      image: '/src/assets/images/project_deep_learning_vision_1792126163516.jpg',
      featured: false,
      githubUrl: 'https://github.com/abdulkayum',
      dockerReady: true,
      pythonSnippet: `# Python Implementation for ${projTitle}
import torch
import torch.nn as nn

class CustomModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(128, 256),
            nn.ReLU(),
            nn.Linear(256, 64)
        )
    def forward(self, x):
        return self.encoder(x)`
    };

    const sql = `INSERT INTO \`ml_projects\` (\`project_slug\`, \`title\`, \`domain\`, \`summary\`, \`architecture\`, \`dataset\`, \`tags_json\`, \`metrics_json\`) 
VALUES ('${newProject.id}', '${projTitle.replace(/'/g, "''")}', '${projDomain}', '${projSummary.replace(/'/g, "''")}', '${(projArchitecture || 'Custom Architecture').replace(/'/g, "''")}', '${(projDataset || 'Open Dataset').replace(/'/g, "''")}', '${JSON.stringify(newProject.tags)}', '${JSON.stringify(newProject.metrics)}');`;
    setGeneratedSql(sql);

    onAddProject(newProject);
  };

  const copySql = () => {
    if (!generatedSql) return;
    navigator.clipboard.writeText(generatedSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
              Portfolio Content Manager (CMS)
            </span>
            <h3 className="text-lg font-bold text-white">
              Add New Research Paper or ML Project
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Switch Type */}
        <div className="flex items-center gap-2 my-4">
          <button
            onClick={() => {
              setEntryType('paper');
              setGeneratedSql(null);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              entryType === 'paper'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 bg-slate-900 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Research Paper</span>
          </button>

          <button
            onClick={() => {
              setEntryType('project');
              setGeneratedSql(null);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              entryType === 'project'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 bg-slate-900 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Machine Learning Project</span>
          </button>
        </div>

        {/* Paper Form */}
        {entryType === 'paper' && !generatedSql && (
          <form onSubmit={handlePaperSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Paper Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Diffusion-Guided Latent Alignment for Semi-Supervised Learning"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Authors (comma separated)</label>
                <input
                  type="text"
                  value={paperAuthors}
                  onChange={(e) => setPaperAuthors(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Venue / Journal *</label>
                <input
                  type="text"
                  required
                  value={paperVenue}
                  onChange={(e) => setPaperVenue(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Research Field / Topic</label>
                <select
                  value={paperTopic}
                  onChange={(e) => setPaperTopic(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Self-Supervised Learning">Self-Supervised Learning</option>
                  <option value="Foundation Models & LLMs">Foundation Models & LLMs</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="Time Series">Time Series</option>
                  <option value="Graph Neural Networks">Graph Neural Networks</option>
                  <option value="Explainable AI">Explainable AI</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Publication Year</label>
                <input
                  type="number"
                  value={paperYear}
                  onChange={(e) => setPaperYear(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Abstract *</label>
              <textarea
                rows={4}
                required
                placeholder="Comprehensive abstract describing motivation, proposed architecture, and empirical findings..."
                value={paperAbstract}
                onChange={(e) => setPaperAbstract(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors cursor-pointer"
            >
              Add Paper & Generate MySQL Insert
            </button>
          </form>
        )}

        {/* Project Form */}
        {entryType === 'project' && !generatedSql && (
          <form onSubmit={handleProjectSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Video Feature Tokenizer in PyTorch"
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Technical Domain</label>
                <select
                  value={projDomain}
                  onChange={(e) => setProjDomain(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="Deep Learning">Deep Learning</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="NLP & LLMs">NLP & LLMs</option>
                  <option value="Data Science">Data Science</option>
                  <option value="MLOps & Systems">MLOps & Systems</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={projTags}
                  onChange={(e) => setProjTags(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Project Summary *</label>
              <textarea
                rows={3}
                required
                placeholder="Brief summary of the engineering challenge, performance improvements, and real-world deployment..."
                value={projSummary}
                onChange={(e) => setProjSummary(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Model Architecture</label>
                <input
                  type="text"
                  placeholder="e.g. Vision Transformer (ViT-H/14) + FlashAttention-2"
                  value={projArchitecture}
                  onChange={(e) => setProjArchitecture(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Dataset Used</label>
                <input
                  type="text"
                  placeholder="e.g. ImageNet-21k, Kinetics-700"
                  value={projDataset}
                  onChange={(e) => setProjDataset(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors cursor-pointer"
            >
              Add Project & Generate MySQL Insert
            </button>
          </form>
        )}

        {/* Success / SQL Generator Output */}
        {generatedSql && (
          <div className="space-y-4 my-2">
            <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Added to local portfolio state! Below is the ready SQL query for your MySQL database:</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>MySQL Query:</span>
                <button
                  onClick={copySql}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-emerald-300 overflow-x-auto p-2 bg-slate-950 rounded-lg">
                <code>{generatedSql}</code>
              </pre>
            </div>

            <button
              onClick={() => {
                setGeneratedSql(null);
                onClose();
              }}
              className="w-full py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Done & Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
