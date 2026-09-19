import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  CheckCircle2,
  Database,
  Code2,
  FileSpreadsheet,
  BarChart3,
  Presentation,
  Github,
  Link2,
  Send,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const CapstoneView: React.FC = () => {
  const { capstone, submitCapstone, currentUser, checkCertificateEligibility, setActiveView } = useApp();

  const [formData, setFormData] = useState({
    title: capstone?.title || 'OmniChannel E-Commerce & Retail Intelligence Engine',
    problemStatement: capstone?.problemStatement || 'Identify multi-channel margin leakage across 50,000 transactions, evaluate customer churn dynamics, and engineer a predictive cohort LTV model.',
    dataset: capstone?.dataset || 'Synthesized multi-table enterprise schema: orders (50k rows), order_items (120k rows), customers, products, return_logs, ad_spend.',
    sqlWork: capstone?.sqlWork || 'WITH customer_rfm AS (\n  SELECT customer_id, MAX(order_date) as last_order, COUNT(order_id) as total_orders, SUM(revenue) as ltv\n  FROM orders GROUP BY customer_id\n)\nSELECT customer_id, NTILE(5) OVER(ORDER BY ltv DESC) as ltv_tier FROM customer_rfm;',
    pythonNotebookUrl: capstone?.pythonNotebookUrl || 'https://github.com/analytics-mastery/capstone-retail-python-eda',
    excelAnalysisNotes: capstone?.excelAnalysisNotes || 'Built dynamic Power Query financial model with What-If data tables and scenario reconciliations.',
    powerBiDashboardUrl: capstone?.powerBiDashboardUrl || 'https://app.powerbi.com/groups/me/reports/retail-executive-bi',
    businessInsights: capstone?.businessInsights || 'Top 10% customers generate 54% of gross margin. Return rates in apparel exceed 22%, driven by vendor sizing discrepancies. Recommending inventory phase-out of 3 underperforming SKUs.',
    presentationUrl: capstone?.presentationUrl || 'https://docs.google.com/presentation/d/retail-executive-deck',
    githubUrl: capstone?.githubUrl || 'https://github.com/username/data-analytics-capstone-retail'
  });

  const [submittedMessage, setSubmittedMessage] = useState(false);

  const stages = [
    { num: 1, title: 'Problem Definition', icon: Database, desc: 'Scope business hypothesis, stakeholder goals & target metrics.' },
    { num: 2, title: 'Data Understanding', icon: Database, desc: 'Assess schemas, data dictionaries, anomalies & cardinality.' },
    { num: 3, title: 'Data Cleaning', icon: Code2, desc: 'Address missing values, duplicates, datetime parsing & formatting.' },
    { num: 4, title: 'SQL Deep Dive', icon: Code2, desc: 'Execute CTEs, window rankings, cohort retention & RFM matrices.' },
    { num: 5, title: 'Python Analytics', icon: Code2, desc: 'Exploratory data analysis, distributions, correlation & statistical test.' },
    { num: 6, title: 'Excel Financials', icon: FileSpreadsheet, desc: 'Power Query transformations, scenario modeling & dynamic pivots.' },
    { num: 7, title: 'Power BI Dashboard', icon: BarChart3, desc: 'Star schema, DAX measures, executive KPIs & interactive storytelling.' },
    { num: 8, title: 'Board Presentation', icon: Presentation, desc: 'Synthesize actionable recommendations for C-suite executive buy-in.' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCapstone(formData);
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Culminating Milestone Project</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              DATA ANALYTICS BUSINESS INTELLIGENCE CAPSTONE
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              End-to-end multi-tool commercial project integrating SQL, Python, Excel, Power BI, and Boardroom Storytelling.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-750 shrink-0">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Capstone Status</p>
              <p className={`text-base font-extrabold ${
                capstone?.status === 'evaluated'
                  ? 'text-emerald-400'
                  : capstone?.status === 'submitted'
                  ? 'text-cyan-300'
                  : 'text-amber-400'
              }`}>
                {capstone?.status ? capstone.status.toUpperCase() : 'NOT SUBMITTED'}
              </p>
              {capstone?.score && (
                <span className="text-xs text-slate-400">Score: {capstone.score}/100</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 8-Stage Pipeline Visualization (Section 14) */}
      <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          The 8-Stage Enterprise Analytics Pipeline
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {stages.map(st => {
            const Icon = st.icon;
            return (
              <div key={st.num} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-750 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold font-mono">
                    {st.num}
                  </span>
                  <Icon className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="font-bold text-white">{st.title}</h4>
                <p className="text-[11px] text-slate-400 leading-tight">{st.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Capstone Submission Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-750">
          <div>
            <h3 className="text-lg font-bold text-white">Capstone Submission Dossier</h3>
            <p className="text-xs text-slate-400">Submit your code repositories, cloud dashboard links, and executive presentation.</p>
          </div>
          {capstone?.evaluatedAt && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
              Graded by Kapil Narula • Feedback: {capstone.feedback || 'Outstanding rigor and clean star-schema design.'}
            </div>
          )}
        </div>

        {submittedMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Capstone Dossier successfully submitted for instructor review and certification qualification!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-indigo-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Business Problem Statement</label>
            <textarea
              rows={2}
              value={formData.problemStatement}
              onChange={e => setFormData({ ...formData, problemStatement: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-indigo-400" /> GitHub Repository URL *
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username/capstone-analytics"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> Power BI Live Service Dashboard URL *
              </label>
              <input
                type="url"
                value={formData.powerBiDashboardUrl}
                onChange={e => setFormData({ ...formData, powerBiDashboardUrl: e.target.value })}
                placeholder="https://app.powerbi.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Python / Jupyter Notebook Colab URL
              </label>
              <input
                type="url"
                value={formData.pythonNotebookUrl}
                onChange={e => setFormData({ ...formData, pythonNotebookUrl: e.target.value })}
                placeholder="https://colab.research.google.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Presentation className="w-3.5 h-3.5 text-indigo-400" /> Executive Slide Deck (Drive / Slides)
              </label>
              <input
                type="url"
                value={formData.presentationUrl}
                onChange={e => setFormData({ ...formData, presentationUrl: e.target.value })}
                placeholder="https://docs.google.com/presentation/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Key SQL Queries & Logic (Sample)</label>
            <textarea
              rows={4}
              value={formData.sqlWork}
              onChange={e => setFormData({ ...formData, sqlWork: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-750 text-cyan-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Actionable Business Insights & Commercial Recommendations
            </label>
            <textarea
              rows={3}
              value={formData.businessInsights}
              onChange={e => setFormData({ ...formData, businessInsights: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-750 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * Required to unlock Certificate of Completion.
            </span>
            <button
              type="submit"
              id="btn-submit-capstone-project"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{capstone ? 'Update Capstone Submission' : 'Submit Capstone Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
