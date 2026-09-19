import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillProficiency } from '../types';
import {
  Grid3X3,
  CheckCircle2,
  Zap,
  TrendingUp,
  Database,
  Code2,
  FileSpreadsheet,
  BarChart3,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const SkillMatrixView: React.FC = () => {
  const { skills, updateSkillLevel, setActiveView } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All 18 Skills' },
    { id: 'Database & SQL', label: 'Database & SQL' },
    { id: 'Programming & Analytics', label: 'Python & Analytics' },
    { id: 'Spreadsheet & ETL', label: 'Excel & Power Query' },
    { id: 'Business Intelligence', label: 'Power BI & DAX' },
    { id: 'Storytelling & Visualization', label: 'Visualization' },
    { id: 'AI & Future of Analytics', label: 'GenAI & LLM Analytics' }
  ];

  const levels: SkillProficiency[] = ['Not Started', 'Learning', 'Practicing', 'Proficient', 'Job Ready'];

  const filteredSkills = selectedCategory === 'all'
    ? skills
    : skills.filter(s => (s.domain || s.category) === selectedCategory);

  const jobReadyCount = skills.filter(s => s.level === 'Job Ready').length;
  const proficientCount = skills.filter(s => s.level === 'Proficient').length;

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Job Competency Framework</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Interactive 18-Skill Capability Matrix
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Track your skill progression across each technology from foundation to verified enterprise job readiness.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-750 shrink-0">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Job Ready</p>
              <p className="text-xl font-extrabold text-emerald-400">{jobReadyCount} / 18</p>
            </div>
            <div className="w-px h-8 bg-slate-750" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Proficient</p>
              <p className="text-xl font-extrabold text-cyan-300">{proficientCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              selectedCategory === c.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map(skill => {
          return (
            <div
              key={skill.id}
              className="p-5 rounded-3xl bg-slate-800/50 border border-slate-750 hover:border-slate-650 transition space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider font-mono">
                    {skill.domain || skill.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{skill.name}</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    skill.level === 'Job Ready'
                      ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
                      : skill.level === 'Proficient'
                      ? 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30'
                      : skill.level === 'Practicing'
                      ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                      : 'text-slate-400 bg-slate-800 border-slate-700'
                  }`}
                >
                  {skill.level}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">{skill.description}</p>

              {/* 5-Stage Interactive Selector */}
              <div className="space-y-1.5 pt-2 border-t border-slate-750">
                <span className="text-[10px] font-semibold text-slate-400">Update Proficiency:</span>
                <div className="grid grid-cols-5 gap-1">
                  {levels.map((lvl, idx) => {
                    const isCurrent = skill.level === lvl;
                    return (
                      <button
                        key={lvl}
                        onClick={() => updateSkillLevel(skill.id, lvl)}
                        className={`py-1 text-[10px] font-semibold rounded transition cursor-pointer text-center ${
                          isCurrent
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
                        }`}
                        title={lvl}
                      >
                        L{idx + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 px-0.5">
                  <span>L1: Start</span>
                  <span>L3: Practice</span>
                  <span>L5: Job Ready</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA To Job Readiness Audit */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-750 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Wondering if your skills match target hiring bars?</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Run the multi-pillar Job Readiness score audit to benchmark against hiring requirements for Data Analyst roles.
          </p>
        </div>
        <button
          onClick={() => setActiveView('readiness')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Calculate Job Readiness Score</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
