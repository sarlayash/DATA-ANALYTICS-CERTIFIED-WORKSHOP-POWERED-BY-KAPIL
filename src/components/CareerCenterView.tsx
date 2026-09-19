import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  CheckCircle2,
  FileText,
  Linkedin,
  Github,
  Award,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

export const CareerCenterView: React.FC = () => {
  const { currentUser, calculateJobReadiness, setActiveView } = useApp();
  const [activeCategory, setActiveCategory] = useState<'all' | 'sql' | 'python' | 'excel' | 'powerbi' | 'behavioral' | 'business'>('all');
  const [expandedQId, setExpandedQId] = useState<string | null>('q-1');

  const readiness = calculateJobReadiness(currentUser?.uid || '');

  const interviewQuestions = [
    {
      id: 'q-1',
      category: 'sql',
      categoryLabel: 'SQL & Database',
      question: 'Explain the difference between RANK(), DENSE_RANK(), and ROW_NUMBER() in SQL. When would you use each in a business report?',
      answer: 'ROW_NUMBER() assigns a unique sequential integer to each row. RANK() assigns the same rank to identical values, but skips subsequent numbers (e.g., 1, 2, 2, 4). DENSE_RANK() assigns the same rank to ties without skipping numbers (e.g., 1, 2, 2, 3). In financial tiering or top customer sales rankings where ties should not create gaps, DENSE_RANK() is preferred.',
      difficulty: 'Intermediate'
    },
    {
      id: 'q-2',
      category: 'sql',
      categoryLabel: 'SQL & Database',
      question: 'How do you handle a scenario where LEFT JOIN results in duplicate rows?',
      answer: 'Duplicate rows occur when the right table has multiple matching records for a single left table key. Fixes: 1) Group or aggregate the right table in a CTE before joining, 2) Ensure the join condition includes all composite primary/foreign keys, or 3) Use DISTINCT or window functions with ROW_NUMBER() = 1 to select the primary record.',
      difficulty: 'Advanced'
    },
    {
      id: 'q-3',
      category: 'python',
      categoryLabel: 'Python & Pandas',
      question: 'What is the performance difference between .apply() and vectorized operations in Pandas?',
      answer: 'Vectorized operations in Pandas run on underlying C/NumPy arrays across the entire column simultaneously without Python interpreter loop overhead, making them 10x to 100x faster. .apply() invokes a Python function row-by-row or column-by-column, incurring substantial interpreter dispatch latency. Always prefer built-in vectorized methods or NumPy where possible.',
      difficulty: 'Intermediate'
    },
    {
      id: 'q-4',
      category: 'excel',
      categoryLabel: 'Advanced Excel',
      question: 'Why is XLOOKUP superior to VLOOKUP, and when should you choose Power Query over standard workbook formulas?',
      answer: 'XLOOKUP searches in any direction (left or right), defaults to exact match without requiring TRUE/FALSE, natively handles missing values with [if_not_found], and does not break when columns are inserted or deleted. Power Query should be used whenever datasets exceed 100k rows, involve recurring monthly files, require multi-step ETL, or need unpivoting.',
      difficulty: 'Intermediate'
    },
    {
      id: 'q-5',
      category: 'powerbi',
      categoryLabel: 'Power BI & DAX',
      question: 'What is the difference between Row Context and Filter Context in DAX?',
      answer: 'Row Context refers to the current row being evaluated (exists automatically in calculated columns and iterators like SUMX). Filter Context refers to any filters applied to the data model via slicers, visual interactions, page filters, or CALCULATE() statements. The CALCULATE() function transforms Row Context into equivalent Filter Context via context transition.',
      difficulty: 'Advanced'
    },
    {
      id: 'q-6',
      category: 'behavioral',
      categoryLabel: 'STAR Behavioral',
      question: 'Tell me about a time when your analysis contradicted a senior stakeholder\'s intuition. How did you navigate the conversation?',
      answer: 'Structure using STAR: Situation (e.g. leadership believed regional churn was driven by pricing), Task (conduct root-cause cohort analysis), Action (analyzed support tickets and user journey drop-offs in SQL, synthesized findings into an executive 3-slide visual deck with confidence intervals, scheduled a pre-meeting with their deputy to validate assumptions), Result (stakeholder accepted the data-backed root cause of checkout UX friction, redirecting engineering focus and saving $150k).',
      difficulty: 'Executive'
    },
    {
      id: 'q-7',
      category: 'business',
      categoryLabel: 'Business Case',
      question: 'Our e-commerce conversion rate dropped by 18% week-over-week. Walk me through your diagnostic framework.',
      answer: '1) Verify tracking and data pipeline integrity (any broken tags or schema shifts?), 2) Segment the drop: by device (iOS vs Android vs Desktop), browser, acquisition channel (paid ads vs organic), geographical region, and user cohort (new vs returning), 3) Funnel step analysis: where did drop-off occur? (Landing -> Product -> Cart -> Checkout -> Payment), 4) External factors (holidays, competitor promotions, website server latency).',
      difficulty: 'Advanced'
    }
  ];

  const filteredQuestions = activeCategory === 'all'
    ? interviewQuestions
    : interviewQuestions.filter(q => q.category === activeCategory);

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career & Interview Readiness Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Career Center & Interview Bank
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Curated assets, profile audit checklists, and commercial interview question breakdowns for Data Analyst placements.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-750 shrink-0">
            <span className="text-xs text-slate-400">Current Employability:</span>
            <span className="text-lg font-bold text-emerald-400">{readiness.score}% Prepared</span>
          </div>
        </div>
      </div>

      {/* 4 Career Readiness Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Resume */}
        <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-3">
          <div className="flex items-center justify-between">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Ready
            </span>
          </div>
          <h3 className="font-bold text-white text-sm">Resume Readiness</h3>
          <p className="text-xs text-slate-400">
            Quantify business impact (e.g. "reduced ETL runtimes by 35% using SQL window functions and Python").
          </p>
        </div>

        {/* LinkedIn */}
        <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-3">
          <div className="flex items-center justify-between">
            <Linkedin className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
              Optimized
            </span>
          </div>
          <h3 className="font-bold text-white text-sm">LinkedIn Readiness</h3>
          <p className="text-xs text-slate-400">
            Headline: "Data Analyst | SQL • Python • Advanced Excel • Power BI DAX | Business Intelligence".
          </p>
        </div>

        {/* GitHub */}
        <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-3">
          <div className="flex items-center justify-between">
            <Github className="w-5 h-5 text-purple-400" />
            <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
              Portfolio
            </span>
          </div>
          <h3 className="font-bold text-white text-sm">GitHub Readiness</h3>
          <p className="text-xs text-slate-400">
            Public repositories with structured READMEs: Problem Statement, Architecture, SQL scripts, Screenshots.
          </p>
        </div>

        {/* Portfolio */}
        <div
          onClick={() => setActiveView('portfolio')}
          className="p-5 rounded-3xl bg-slate-800/50 border border-slate-750 hover:border-amber-500/50 transition cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
              Verified
            </span>
          </div>
          <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition">
            Portfolio Builder →
          </h3>
          <p className="text-xs text-slate-400">
            Auto-generate your consolidated portfolio summary card with 1-click for recruiters and managers.
          </p>
        </div>
      </div>

      {/* Interview Question Bank */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-750">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
              Technical & Behavioral Masterclass
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Data Analyst Interview Question Bank
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'sql', label: 'SQL' },
              { id: 'python', label: 'Python' },
              { id: 'excel', label: 'Excel' },
              { id: 'powerbi', label: 'Power BI' },
              { id: 'behavioral', label: 'STAR Behavioral' },
              { id: 'business', label: 'Business Case' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Accordion */}
        <div className="space-y-3">
          {filteredQuestions.map(item => {
            const isExpanded = expandedQId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-slate-900/60 border border-slate-750 overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedQId(isExpanded ? null : item.id)}
                  className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-900/90 transition cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {item.categoryLabel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{item.difficulty}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-100">{item.question}</p>
                  </div>
                  <div className="text-slate-400 p-1 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-slate-800 bg-slate-950/40 text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
                    <p className="font-bold text-cyan-300 text-xs uppercase tracking-wider">
                      Model Industry Response:
                    </p>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
