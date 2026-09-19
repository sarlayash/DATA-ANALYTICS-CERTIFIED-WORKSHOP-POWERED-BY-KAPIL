import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './UserAvatar';
import {
  UserCheck,
  Award,
  Github,
  Linkedin,
  Mail,
  Copy,
  CheckCircle2,
  ExternalLink,
  Code2,
  Database,
  BarChart3,
  FileSpreadsheet,
  Share2
} from 'lucide-react';

export const PortfolioBuilderView: React.FC = () => {
  const { currentUser, skills, capstone, certificates, calculateJobReadiness, calculateOverallProgress } = useApp();
  const [copied, setCopied] = useState(false);

  if (!currentUser) return null;

  const readiness = calculateJobReadiness(currentUser.uid);
  const progress = calculateOverallProgress(currentUser.uid);
  const cert = certificates.find(c => c.learnerId === currentUser.uid);

  const copyPortfolioMarkdown = () => {
    const markdown = `# ${currentUser.name} - Professional Data Analyst Portfolio
Email: ${currentUser.email} | City: ${currentUser.city || 'Remote / Hybrid'}
LinkedIn: ${currentUser.linkedin || 'N/A'} | GitHub: ${currentUser.github || 'N/A'}

## Certified Program
12-Day Job-Oriented Data Analytics Certified Workshop (Powered by Kapil)
Status: ${cert ? `Certified (${cert.certificateId})` : 'In Progress (Cohort 2026)'}
Job Readiness Score: ${readiness.score}/100

## Core Technical Skills
- SQL & BigQuery: CTEs, Window Functions, Aggregate Analysis, Query Optimization
- Python: Pandas, NumPy, Data Cleaning, Exploratory Data Analysis
- Advanced Excel: Power Query ETL, Scenario Modeling, Financial Tables, Dynamic Pivots
- Business Intelligence: Power BI, Star Schema Modeling, DAX Measures, Storytelling

## Capstone Project
Title: ${capstone?.title || 'OmniChannel Retail Analytics Engine'}
Repository: ${capstone?.githubUrl || 'https://github.com'}
Dashboard: ${capstone?.powerBiDashboardUrl || 'https://app.powerbi.com'}
Summary: ${capstone?.problemStatement || 'Enterprise multi-channel margin and retention intelligence.'}
`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Executive Profile Showcase</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Professional Data Analyst Portfolio
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Consolidated portfolio view summarizing verified skills, practical projects, capstone deliverables, and credentials for recruiters.
            </p>
          </div>

          <button
            onClick={copyPortfolioMarkdown}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Markdown Dossier!' : 'Export Recruiter Summary'}</span>
          </button>
        </div>
      </div>

      {/* Main Portfolio Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-6">
        {/* Profile Info Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-755">
          <div className="flex items-center gap-4">
            <UserAvatar
              src={currentUser.photoURL || currentUser.profilePhoto}
              name={currentUser.name}
              size="xl"
              showBorder
              className="ring-2 ring-indigo-500 rounded-2xl"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{currentUser.name}</h2>
              <p className="text-xs text-indigo-400 font-medium">{currentUser.careerGoal || 'Data Analyst / BI Specialist'}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.college || 'Enterprise Track'} • {currentUser.city || 'India'}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {currentUser.linkedin && (
              <a
                href={currentUser.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-750 text-cyan-400 hover:text-white transition"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {currentUser.github && (
              <a
                href={currentUser.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-750 text-slate-300 hover:text-white transition"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-750 text-xs text-slate-300 font-mono">
              Score: <span className="text-indigo-400 font-bold">{readiness.score}/100</span>
            </div>
          </div>
        </div>

        {/* Skills & Verified Credentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Verified Skills */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Technical Competencies:
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills
                .filter(s => s.level === 'Proficient' || s.level === 'Job Ready')
                .map(s => (
                  <span
                    key={s.id}
                    className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-medium"
                  >
                    {s.name} ({s.level})
                  </span>
                ))}
            </div>
          </div>

          {/* Certification Card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Workshop Credential
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                AUTHENTICATED
              </span>
            </div>
            <p className="text-xs font-bold text-white">
              12-Day Job-Oriented Data Analytics Certified Workshop
            </p>
            <p className="text-[11px] text-slate-400">
              ID: <span className="text-slate-300 font-mono">{cert ? cert.certificateId : 'SY-DA-2026-PENDING'}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Signed by Kapil Narula • Lead Analytics Instructor
            </p>
          </div>
        </div>

        {/* Capstone Project Showcase */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Featured Capstone Project
            </span>
            <span className="text-xs text-slate-400 font-mono">Status: {capstone?.status || 'Active'}</span>
          </div>
          <h4 className="text-base font-bold text-white">
            {capstone?.title || 'OmniChannel E-Commerce & Retail Intelligence Engine'}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {capstone?.problemStatement || 'Architected an end-to-end data pipeline evaluating margin leakage, customer RFM tiers, and cohort churn dynamics across 50,000 transaction records.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {capstone?.githubUrl && (
              <a
                href={capstone.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
              >
                <Github className="w-3.5 h-3.5" /> Repository <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {capstone?.powerBiDashboardUrl && (
              <a
                href={capstone.powerBiDashboardUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
              >
                <BarChart3 className="w-3.5 h-3.5" /> Live Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
