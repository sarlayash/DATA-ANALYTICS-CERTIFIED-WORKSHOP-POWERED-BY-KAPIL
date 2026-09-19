import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Target,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export const JobReadinessView: React.FC = () => {
  const { currentUser, calculateJobReadiness, setActiveView } = useApp();
  const [selectedRole, setSelectedRole] = useState<'da' | 'ba' | 'bi' | 'ra'>('da');

  if (!currentUser) return null;

  const readiness = calculateJobReadiness(currentUser.uid);
  const score = readiness.score;
  const b = readiness.breakdown;

  // Role benchmarks
  const roleBenchmarks = {
    da: {
      title: 'Data Analyst',
      reqScore: 82,
      sql: 85,
      python: 80,
      excel: 85,
      powerBi: 80,
      visualization: 85,
      comm: 75,
      capstone: 85
    },
    ba: {
      title: 'Business Analyst',
      reqScore: 80,
      sql: 75,
      python: 65,
      excel: 90,
      powerBi: 85,
      visualization: 85,
      comm: 90,
      capstone: 80
    },
    bi: {
      title: 'BI Analyst / Developer',
      reqScore: 85,
      sql: 85,
      python: 70,
      excel: 80,
      powerBi: 95,
      visualization: 90,
      comm: 80,
      capstone: 90
    },
    ra: {
      title: 'Reporting & Operations Analyst',
      reqScore: 78,
      sql: 80,
      python: 60,
      excel: 95,
      powerBi: 80,
      visualization: 80,
      comm: 75,
      capstone: 75
    }
  };

  const targetBenchmark = roleBenchmarks[selectedRole];
  const meetsRequirement = score >= targetBenchmark.reqScore;

  const diagnosticChecklist = [
    { label: 'Can write complex multi-table SQL with CTEs & Window Functions', ok: b.sql >= 80 },
    { label: 'Can clean, transform, and merge dirty datasets with Python Pandas', ok: b.python >= 75 },
    { label: 'Can model star schemas and write DAX measures in Power BI', ok: b.powerBi >= 75 },
    { label: 'Can build executive dashboards in Power BI and automated ETL in Excel Power Query', ok: b.excel >= 80 },
    { label: 'Can translate technical data insights into boardroom business presentations', ok: b.businessCommunication >= 75 },
    { label: 'Has a public GitHub portfolio repository with documented READMEs', ok: score >= 75 },
    { label: 'Submitted the comprehensive 8-stage Business Intelligence Capstone', ok: b.capstone >= 80 }
  ];

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Multi-Pillar Employability Index</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Job Readiness Score & Competency Audit
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Dynamic multi-domain diagnostic benchmarking your technical outputs directly against commercial hiring standards.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-750 shrink-0">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Readiness Score</p>
              <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                {score} <span className="text-sm text-slate-400 font-normal">/ 100</span>
              </p>
            </div>
            <div className="w-px h-10 bg-slate-750" />
            <div className="text-xs">
              <span className={`font-bold px-2 py-0.5 rounded border ${
                score >= 80
                  ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
                  : score >= 65
                  ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                  : 'text-rose-300 bg-rose-500/10 border-rose-500/30'
              }`}>
                {score >= 80 ? 'Interview Ready' : score >= 65 ? 'Competitive Candidate' : 'Foundations Phase'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Role Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase mr-2 shrink-0">Benchmark Target Role:</span>
        {(Object.keys(roleBenchmarks) as Array<keyof typeof roleBenchmarks>).map(key => (
          <button
            key={key}
            onClick={() => setSelectedRole(key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              selectedRole === key
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
            }`}
          >
            {roleBenchmarks[key].title} (Target: {roleBenchmarks[key].reqScore})
          </button>
        ))}
      </div>

      {/* Breakdown Grid: Technical Pillar Bars (Left) + Benchmark Audit & Checklist (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 7 Pillars Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-750">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" /> Pillar-by-Pillar Technical Assessment
            </h3>
            <span className="text-xs font-mono text-slate-400">Score vs. Benchmark</span>
          </div>

          <div className="space-y-4 pt-1">
            {/* SQL */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-200">1. SQL & BigQuery Analytics (20%)</span>
                <span className="font-mono text-cyan-300">{b.sql} / {targetBenchmark.sql} req</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${b.sql}%` }} />
              </div>
            </div>

            {/* Python */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-200">2. Python (Pandas & NumPy) (20%)</span>
                <span className="font-mono text-cyan-300">{b.python} / {targetBenchmark.python} req</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${b.python}%` }} />
              </div>
            </div>

            {/* Advanced Excel */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-200">3. Advanced Excel & Power Query (15%)</span>
                <span className="font-mono text-cyan-300">{b.excel} / {targetBenchmark.excel} req</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${b.excel}%` }} />
              </div>
            </div>

            {/* Power BI & DAX */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-200">4. Power BI & DAX Data Modeling (15%)</span>
                <span className="font-mono text-cyan-300">{b.powerBi} / {targetBenchmark.powerBi} req</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${b.powerBi}%` }} />
              </div>
            </div>

            {/* Visualization */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-200">5. Data Visualization & UI Principles (10%)</span>
                <span className="font-mono text-cyan-300">{b.visualization} / {targetBenchmark.visualization} req</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${b.visualization}%` }} />
              </div>
            </div>

            {/* Business Communication */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-200">6. Executive Business Storytelling (10%)</span>
                <span className="font-mono text-cyan-300">{b.businessCommunication} / {targetBenchmark.comm} req</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${b.businessCommunication}%` }} />
              </div>
            </div>

            {/* Capstone */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-200">7. Capstone BI Project Execution (10%)</span>
                <span className="font-mono text-cyan-300">{b.capstone} / {targetBenchmark.capstone} req</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: `${b.capstone}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: "Am I Job Ready?" Diagnostic Checklist */}
        <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-750">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" /> "Am I Job Ready?" Diagnostic Checklist
            </h3>
            <span className="text-xs text-slate-400">
              {diagnosticChecklist.filter(c => c.ok).length} / {diagnosticChecklist.length} Met
            </span>
          </div>

          <div className="space-y-2.5">
            {diagnosticChecklist.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition ${
                  item.ok
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-slate-900/60 border-slate-750 text-slate-400'
                }`}
              >
                {item.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-750 space-y-3">
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300">
              <p className="font-bold text-white mb-0.5">Recommendations for Next Level:</p>
              <p>
                {score < 80
                  ? 'Focus on completing Day 8-10 Power BI DAX labs and submit the Business Intelligence Capstone to boost your readiness score above 85%.'
                  : 'You exceed baseline commercial thresholds for entry to mid-level Data Analyst roles! Head to the Career Center to prep for technical interviews.'}
              </p>
            </div>

            <button
              onClick={() => setActiveView('career')}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Go to Career Center & Interview Bank</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
