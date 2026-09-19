import React, { useState } from 'react';
import { getSolvedExamplesForDay } from '../data/solvedExamplesData';
import { 
  CheckCircle2, 
  Terminal, 
  Database, 
  Copy, 
  Check, 
  ArrowRight, 
  Table, 
  HelpCircle,
  Play
} from 'lucide-react';

interface SolvedExamplesTabProps {
  dayNumber: number;
  onSendToIDE?: (code: string, language: 'sql' | 'python' | 'bash') => void;
}

export const SolvedExamplesTab: React.FC<SolvedExamplesTabProps> = ({ 
  dayNumber,
  onSendToIDE 
}) => {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const examples = getSolvedExamplesForDay(dayNumber);
  const activeExample = examples[selectedExampleIndex] || examples[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!examples || examples.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        No solved examples found for Day {dayNumber}.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Day {dayNumber} Practical Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              5 Solved Industry Examples
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              End-to-end solved problems with schemas, code solutions, step-by-step logic, and expected output previews.
            </p>
          </div>
        </div>

        {/* 5-Button Stepper Navigation */}
        <div className="grid grid-cols-5 gap-2 mt-6">
          {examples.map((ex, idx) => {
            const isActive = selectedExampleIndex === idx;
            return (
              <button
                key={ex.id}
                onClick={() => setSelectedExampleIndex(idx)}
                className={`py-2.5 px-3 rounded-xl text-left transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-80">
                  Example {idx + 1}
                </div>
                <div className="text-xs truncate font-medium mt-0.5">
                  {ex.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Example Deep-Dive Card */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Title & Metadata Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                Example #{activeExample.exampleNumber} of 5
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {activeExample.language}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                activeExample.difficulty === 'Beginner'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : activeExample.difficulty === 'Intermediate'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
              }`}>
                {activeExample.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {activeExample.title}
            </h3>
          </div>

          {/* Quick Action: Send to Integrated IDE */}
          {onSendToIDE && (
            <button
              onClick={() => {
                const targetLang = activeExample.language === 'python' 
                  ? 'python' 
                  : activeExample.language === 'bash' 
                  ? 'bash' 
                  : 'sql';
                onSendToIDE(activeExample.solutionCode, targetLang);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run in Integrated IDE</span>
            </button>
          )}
        </div>

        {/* Business Context & Problem Statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/50">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-500" />
              Business Scenario
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeExample.businessContext}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/50">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
              Objective / Problem Statement
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeExample.problemStatement}
            </p>
          </div>
        </div>

        {/* Input Dataset Schema (if available) */}
        {activeExample.inputDatasetSchema && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Table className="w-4 h-4 text-slate-400" />
              Input Table Schema: <span className="font-mono text-blue-600 dark:text-blue-400">{activeExample.inputDatasetSchema.tableName}</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {activeExample.inputDatasetSchema.columns.map((col, idx) => (
                      <th key={idx} className="p-2.5 font-mono text-[11px]">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  {activeExample.inputDatasetSchema.sampleRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      {activeExample.inputDatasetSchema!.columns.map((col, cIdx) => (
                        <td key={cIdx} className="p-2.5">{String(row[col] ?? 'NULL')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Solution Code with Copy Button */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              Complete Solved Program ({activeExample.language.toUpperCase()})
            </div>
            <button
              onClick={() => handleCopyCode(activeExample.solutionCode)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <div className="relative rounded-xl overflow-hidden bg-slate-950 text-slate-100 p-4 sm:p-5 font-mono text-xs leading-relaxed border border-slate-800 shadow-inner overflow-x-auto">
            <pre>{activeExample.solutionCode}</pre>
          </div>
        </div>

        {/* Step-by-Step Explanation */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Step-by-Step Logic Breakdown:
          </div>
          <div className="space-y-2">
            {activeExample.stepByStepExplanation.map((step, sIdx) => (
              <div key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
                <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Output Preview */}
        {activeExample.expectedOutputPreview && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Expected Execution Output:
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {activeExample.expectedOutputPreview.columns.map((col, idx) => (
                      <th key={idx} className="p-2.5 font-mono text-[11px]">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {activeExample.expectedOutputPreview.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2.5">{String(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {activeExample.expectedOutputPreview.summaryText && (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1.5">
                💡 {activeExample.expectedOutputPreview.summaryText}
              </p>
            )}
          </div>
        )}

        {/* Interview Relevance */}
        <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 text-xs text-slate-700 dark:text-slate-300">
          <strong className="text-emerald-700 dark:text-emerald-400">Why this matters in interviews: </strong>
          {activeExample.interviewRelevance}
        </div>
      </div>
    </div>
  );
};
