/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResearchSection } from './components/ResearchSection';
import { ProjectsSection } from './components/ProjectsSection';
import { InteractiveMLLab } from './components/InteractiveMLLab';
import { HostingKitSection } from './components/HostingKitSection';
import { VitaeSection } from './components/VitaeSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AddEntryModal } from './components/AddEntryModal';
import {
  RESEARCH_PAPERS as initialPapers,
  ML_PROJECTS as initialProjects,
  ResearchPaper,
  MLProject
} from './data/portfolioData';

export default function App() {
  const [papers, setPapers] = useState<ResearchPaper[]>(() => {
    try {
      const saved = localStorage.getItem('abdulkayum_papers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialPapers;
  });

  const [projects, setProjects] = useState<MLProject[]>(() => {
    try {
      const saved = localStorage.getItem('abdulkayum_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialProjects;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('abdulkayum_papers', JSON.stringify(papers));
    } catch (e) {
      console.error(e);
    }
  }, [papers]);

  useEffect(() => {
    try {
      localStorage.setItem('abdulkayum_projects', JSON.stringify(projects));
    } catch (e) {
      console.error(e);
    }
  }, [projects]);

  const handleAddPaper = (newPaper: ResearchPaper) => {
    setPapers((prev) => [newPaper, ...prev]);
  };

  const handleAddProject = (newProject: MLProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 3-Zone Header */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenContact={scrollToContact}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <ResearchSection papers={papers} />
        <ProjectsSection projects={projects} />
        <InteractiveMLLab />
        <HostingKitSection />
        <VitaeSection />
        <ContactSection />
      </main>

      {/* Clean Footer */}
      <Footer />

      {/* Add Paper/Project Modal */}
      <AddEntryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPaper={handleAddPaper}
        onAddProject={handleAddProject}
      />
    </div>
  );
}
