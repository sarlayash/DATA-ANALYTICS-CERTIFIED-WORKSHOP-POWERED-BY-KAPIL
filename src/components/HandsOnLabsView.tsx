import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FlaskConical,
  Database,
  Code2,
  FileSpreadsheet,
  BarChart3,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Download
} from 'lucide-react';

export const HandsOnLabsView: React.FC = () => {
  const { curriculum, setSelectedDay, setActiveView } = useApp();
  const [selectedLabDay, setSelectedLabDay] = useState(1);

  const labData = curriculum.find(c => c.day === selectedLabDay)?.handsOnLab || curriculum[0].handsOnLab;
  const currentDayInfo = curriculum.find(c => c.day === selectedLabDay) || curriculum[0];

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>90% Hands-On Practical Component</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hands-On Industry Labs Repository
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Every day features an enterprise scenario using authentic datasets, production scripts, and commercial deliverables.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-750">
            <span className="text-xs text-slate-400">Labs Available:</span>
            <span className="text-lg font-bold text-cyan-400">12 Real-World Projects</span>
          </div>
        </div>
      </div>

      {/* Grid: 12 Labs Selector + Expanded Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 12 Labs Selector */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Choose Laboratory:</p>
          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {curriculum.map(c => {
              const isSelected = c.day === selectedLabDay;
              return (
                <button
                  key={c.day}
                  onClick={() => setSelectedLabDay(c.day)}
                  className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500/50 shadow-md'
                      : 'bg-slate-800/50 border-slate-750 hover:border-slate-650'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-cyan-400 font-bold">DAY {c.day} LAB</span>
                    <span className="text-slate-400 text-[10px] truncate max-w-[120px]">{c.domain}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-100 line-clamp-1">
                    {c.handsOnLab.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{c.handsOnLab.businessScenario}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Lab Detail Card (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-750">
              <div>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  DAY {selectedLabDay} PRACTICAL
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                  {labData.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedDay(selectedLabDay);
                  setActiveView('curriculum');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Open Full Day Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Business Scenario */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" /> Commercial Business Context
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-750">
                {labData.businessScenario}
              </p>
            </div>

            {/* Dataset Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Production Dataset Specification
              </h4>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 font-mono text-xs text-cyan-300">
                {labData.datasetDescription}
              </div>
            </div>

            {/* Step by Step Execution Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Tasks & Implementation Guide
              </h4>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {labData.task}
              </div>
            </div>

            {/* Expected Output & Submission Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-1.5">
                <p className="text-xs font-bold uppercase text-emerald-400">Target Commercial Output</p>
                <p className="text-xs text-slate-300 leading-relaxed">{labData.expectedOutput}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-1.5">
                <p className="text-xs font-bold uppercase text-indigo-400">Submission Workflow</p>
                <p className="text-xs text-slate-300 leading-relaxed">{labData.submissionInstructions}</p>
              </div>
            </div>

            {/* Evaluation Criteria & Skills */}
            <div className="pt-2 border-t border-slate-750 space-y-3">
              <p className="text-xs text-slate-400">
                <strong className="text-slate-200">Evaluation Criteria:</strong> {labData.evaluationCriteria}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">Skills Tested:</span>
                {labData.skillsTested.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
