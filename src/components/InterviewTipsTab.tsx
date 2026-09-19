import React, { useState } from 'react';
import { INTERVIEW_TIPS_DATA } from '../data/interviewTipsData';
import { 
  Briefcase, 
  HelpCircle, 
  Target, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  ShieldCheck, 
  Sparkles,
  Compass,
  Copy,
  Check
} from 'lucide-react';

interface InterviewTipsTabProps {
  dayNumber: number;
}

export const InterviewTipsTab: React.FC<InterviewTipsTabProps> = ({ dayNumber }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const guide = INTERVIEW_TIPS_DATA.find(g => g.day === dayNumber) || INTERVIEW_TIPS_DATA[0];

  const categories = ['All', ...Array.from(new Set(guide.keyQuestions.map(q => q.category)))];

  const filteredQuestions = selectedCategory === 'All' 
    ? guide.keyQuestions 
    : guide.keyQuestions.filter(q => q.category === selectedCategory);

  const toggleQuestion = (id: string) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header Strategy Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              Day {dayNumber} Interview Masterclass
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Interview Tips, Tricks & Real Questions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Curated for top analytics interviews (FAANG, high-growth startups, and consulting). Master what interviewers listen for beneath the surface.
            </p>
          </div>
        </div>

        {/* Core Interviewer Mindset Card */}
        <div className="mt-6 bg-white/80 dark:bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
            <Target className="w-4 h-4" />
            Interviewer Mindset & Evaluation Criteria
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            "{guide.coreMindset}"
          </p>
        </div>
      </div>

      {/* General Quick-Fire Interview Tips */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-500" />
          Tactical Interview Rules of Engagement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {guide.generalTips.map((tip, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5 shadow-xs"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Real Interview Questions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-500" />
            Real Interview Questions & Model Solutions ({filteredQuestions.length})
          </h3>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Question Cards */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-xs hover:border-emerald-500/30 transition-all"
              >
                {/* Clickable Question Header */}
                <div 
                  onClick={() => toggleQuestion(q.id)}
                  className="p-5 cursor-pointer select-none flex items-start justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        {q.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        q.difficulty === 'Junior' 
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : q.difficulty === 'Mid-Level'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Answer Body */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-700/60 p-5 sm:p-6 space-y-5 bg-slate-50/40 dark:bg-slate-900/30">
                    {/* What Interviewer is Testing */}
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 text-xs">
                      <div className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        What the Interviewer is Really Testing
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">
                        {q.interviewerMindset}
                      </p>
                    </div>

                    {/* Answering Framework */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-emerald-500" />
                        Recommended Structure / Answering Framework
                      </div>
                      <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">
                        {q.answeringFramework}
                      </div>
                    </div>

                    {/* Model Answer */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                        High-Scoring Model Answer
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line shadow-xs">
                        {q.modelAnswer}
                      </div>
                    </div>

                    {/* Optional Code Snippet */}
                    {q.codeSnippet && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5 text-amber-500" />
                            Technical Solution Code
                          </div>
                          <button
                            onClick={() => handleCopyCode(q.codeSnippet!, q.id)}
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                          >
                            {copiedCodeId === q.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="relative rounded-xl overflow-hidden bg-slate-950 text-slate-100 p-4 font-mono text-xs leading-relaxed border border-slate-800 overflow-x-auto">
                          <pre>{q.codeSnippet}</pre>
                        </div>
                      </div>
                    )}

                    {/* Traps to Avoid */}
                    {q.trapsToAvoid && q.trapsToAvoid.length > 0 && (
                      <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 rounded-xl p-3.5">
                        <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-1.5 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Red Flag Traps to Avoid in this Question
                        </div>
                        <ul className="space-y-1">
                          {q.trapsToAvoid.map((trap, tIdx) => (
                            <li key={tIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                              <span className="text-rose-500 font-bold">•</span>
                              <span>{trap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
