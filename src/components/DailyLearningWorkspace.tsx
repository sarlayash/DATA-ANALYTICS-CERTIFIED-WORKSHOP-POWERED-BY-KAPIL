import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Database,
  FlaskConical,
  HelpCircle,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  FileText,
  Send,
  Target,
  Briefcase,
  Play,
  Terminal
} from 'lucide-react';
import { SimpleNotesTab } from './SimpleNotesTab';
import { InterviewTipsTab } from './InterviewTipsTab';
import { SolvedExamplesTab } from './SolvedExamplesTab';
import { IntegratedIDEView } from './IntegratedIDEView';

export const DailyLearningWorkspace: React.FC = () => {
  const {
    curriculum,
    selectedDay,
    setSelectedDay,
    completedDays,
    markDayComplete,
    submitQuizResult,
    setIsAiDrawerOpen,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'concepts' | 'notes' | 'interview' | 'examples' | 'ide' | 'lab' | 'business' | 'quiz' | 'reflection'
  >('concepts');
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // Cross-tab IDE transfer state
  const [ideInitialCode, setIdeInitialCode] = useState<string | undefined>(undefined);
  const [ideInitialLanguage, setIdeInitialLanguage] = useState<'sql' | 'python' | 'bash'>('sql');

  const handleSendToIDE = (code: string, language: 'sql' | 'python' | 'bash') => {
    setIdeInitialCode(code);
    setIdeInitialLanguage(language);
    setActiveTab('ide');
  };

  // Quiz interactive state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const dayData = curriculum.find(c => c.day === selectedDay) || curriculum[0];
  const isCompleted = completedDays.includes(dayData.day);
  const quizQuestions = dayData.quiz?.questions || [];

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const isOptionCorrect = (q: any, optIndex: number, optText: string) => {
    if (typeof q.correctAnswer === 'number') return q.correctAnswer === optIndex;
    if (typeof q.correctAnswer === 'string') {
      return q.correctAnswer === optText || q.correctAnswer === String(optIndex);
    }
    if (Array.isArray(q.correctAnswer)) return q.correctAnswer.includes(optText);
    return false;
  };

  const handleGradeQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q: any, idx: number) => {
      const selectedOptIdx = selectedAnswers[idx];
      const selectedOptText = q.options ? q.options[selectedOptIdx] : '';
      if (selectedOptIdx !== undefined && isOptionCorrect(q, selectedOptIdx, selectedOptText)) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    submitQuizResult(dayData.day, score, quizQuestions.length || 1);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Top 12-Day Selector Carousel */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {curriculum.map(d => {
            const isDone = completedDays.includes(d.day);
            const isCurrent = selectedDay === d.day;
            return (
              <button
                key={d.day}
                id={`day-selector-btn-${d.day}`}
                onClick={() => {
                  setSelectedDay(d.day);
                  setActiveTab('concepts');
                  setQuizSubmitted(false);
                  setSelectedAnswers({});
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : isDone
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
                }`}
              >
                <span>Day {d.day}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                DAY {dayData.day} OF 12
              </span>
              <span className="text-xs text-slate-400 font-mono">Domain: {dayData.domain}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {dayData.title}
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {dayData.learningObjective}
            </p>
          </div>

          {/* Mark Day Complete Button */}
          <div className="shrink-0 flex flex-col sm:items-end gap-2">
            <button
              id="btn-mark-day-complete"
              onClick={() => markDayComplete(dayData.day)}
              className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-lg ${
                isCompleted
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Day Marked Complete ✓' : 'Mark Day Complete'}</span>
            </button>
            {isCompleted && (
              <span className="text-[11px] text-emerald-400 font-mono">Verified in learner profile</span>
            )}
          </div>
        </div>

        {/* Today's Agenda list */}
        <div className="pt-4 border-t border-slate-750">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Today's Agenda:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {dayData.agenda.map((ag, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="truncate">{ag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex border-b border-slate-800 text-xs sm:text-sm font-semibold gap-1 sm:gap-2 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('concepts')}
          className={`px-3.5 py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'concepts'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Concepts & Code</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3.5 py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'notes'
              ? 'border-amber-500 text-amber-300 bg-amber-500/10 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Simple Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className={`px-3.5 py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'interview'
              ? 'border-emerald-500 text-emerald-300 bg-emerald-500/10 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>Interview Tips & Tricks</span>
        </button>

        <button
          onClick={() => setActiveTab('examples')}
          className={`px-3.5 py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'examples'
              ? 'border-blue-500 text-blue-300 bg-blue-500/10 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>5 Solved Examples</span>
        </button>

        <button
          onClick={() => setActiveTab('ide')}
          className={`px-3.5 py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'ide'
              ? 'border-purple-500 text-purple-300 bg-purple-500/10 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>Integrated IDE</span>
        </button>

        <button
          onClick={() => setActiveTab('lab')}
          className={`px-3.5 py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'lab'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Hands-On Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('business')}
          className={`px-3.5 py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'business'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Business Challenge</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-3.5 py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'quiz'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Assessment</span>
        </button>

        <button
          onClick={() => setActiveTab('reflection')}
          className={`px-3.5 py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'reflection'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reflection</span>
        </button>
      </div>

      {/* Tab: Simple Notes */}
      {activeTab === 'notes' && (
        <SimpleNotesTab dayNumber={dayData.day} />
      )}

      {/* Tab: Interview Tips & Tricks */}
      {activeTab === 'interview' && (
        <InterviewTipsTab dayNumber={dayData.day} />
      )}

      {/* Tab: 5 Solved Examples per Day */}
      {activeTab === 'examples' && (
        <SolvedExamplesTab 
          dayNumber={dayData.day} 
          onSendToIDE={handleSendToIDE}
        />
      )}

      {/* Tab: Integrated IDE for running programs & commands */}
      {activeTab === 'ide' && (
        <IntegratedIDEView 
          dayNumber={dayData.day}
          initialCode={ideInitialCode}
          initialLanguage={ideInitialLanguage}
        />
      )}

      {/* Tab 1: Concepts & Code */}
      {activeTab === 'concepts' && (
        <div className="space-y-6">
          {dayData.concepts.map((concept, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  {concept.heading}
                </h3>
                <span className="text-xs font-mono text-cyan-400 uppercase">Production Grade</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{concept.description}</p>

              {concept.codeExample && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
                    <span>CODE</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(concept.codeExample!)}
                      className="hover:text-indigo-300 transition text-[11px]"
                    >
                      Copy Snippet
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
                    <code>{concept.codeExample}</code>
                  </pre>
                </div>
              )}

              {concept.businessNote && (
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-750 text-xs text-slate-300 flex items-start gap-2">
                  <span className="font-bold text-indigo-400 shrink-0">Business Impact:</span>
                  <span>{concept.businessNote}</span>
                </div>
              )}
            </div>
          ))}

          {/* Quick AI Explanation helper */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">Need a deeper explanation or code variation?</p>
                <p className="text-xs text-slate-400">Ask the Gemini AI assistant to debug or break down these concepts line-by-line.</p>
              </div>
            </div>
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition cursor-pointer"
            >
              Consult AI Coach
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Hands-On Lab (Section 13) */}
      {activeTab === 'lab' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-750">
            <div>
              <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                Hands-On Practical Lab (90% Component)
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {dayData.handsOnLab.title}
              </h3>
            </div>
            <button
              onClick={() => setActiveView('assignments')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
            >
              Go To Submission Form →
            </button>
          </div>

          {/* Business Scenario */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" /> Commercial Business Scenario
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-750">
              {dayData.handsOnLab.businessScenario}
            </p>
          </div>

          {/* Dataset Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase text-slate-300 tracking-wider">Dataset Description</h4>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-750 font-mono">
              {dayData.handsOnLab.datasetDescription}
            </p>
          </div>

          {/* Specific Tasks */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase text-slate-300 tracking-wider">Core Deliverables & Tasks</h4>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {dayData.handsOnLab.task}
            </div>
          </div>

          {/* Expected Output & Submission Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-2">
              <p className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Expected Output:</p>
              <p className="text-xs text-slate-300 leading-relaxed">{dayData.handsOnLab.expectedOutput}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-2">
              <p className="text-xs font-bold uppercase text-indigo-400 tracking-wider">Submission Instructions:</p>
              <p className="text-xs text-slate-300 leading-relaxed">{dayData.handsOnLab.submissionInstructions}</p>
            </div>
          </div>

          {/* Skills Tested */}
          <div className="pt-2">
            <p className="text-xs text-slate-400 mb-2">Skills Verified In This Lab:</p>
            <div className="flex flex-wrap gap-2">
              {dayData.handsOnLab.skillsTested.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Business Problem & Challenge */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Target className="w-5 h-5" />
              <span className="text-xs uppercase font-bold tracking-wider">Business Problem of the Day</span>
            </div>
            <h3 className="text-xl font-bold text-white">{dayData.businessCase?.title || 'Executive Stakeholder Brief'}</h3>
            <p className="text-xs font-mono text-cyan-300">{dayData.businessCase?.companyContext}</p>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-5 rounded-2xl border border-slate-750">
              {dayData.businessCase?.problem}
            </p>
            {dayData.businessCase?.deliverable && (
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200">
                <span className="font-bold">Required Deliverable: </span>
                <span>{dayData.businessCase.deliverable}</span>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs uppercase font-bold tracking-wider">Data Analyst Challenge</span>
            </div>
            <h3 className="text-xl font-bold text-white">Complex Technical Edge Case</h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-5 rounded-2xl border border-slate-750">
              {dayData.practicalChallenge}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-3">
            <h4 className="text-sm font-bold uppercase text-slate-300 tracking-wider">Curated Resources & Datasets</h4>
            <div className="space-y-2">
              {dayData.resources.map((res, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-750 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200">{res.name}</span>
                    <span className="ml-2 text-slate-500">({res.type.toUpperCase()})</span>
                  </div>
                  <span className="text-indigo-400 font-mono">{res.url}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Daily Assessment / Quiz */}
      {activeTab === 'quiz' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-750">
            <div>
              <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                Daily Diagnostic Assessment
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Day {dayData.day} Knowledge Check</h3>
            </div>

            {quizSubmitted && (
              <div className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-xs sm:text-sm">
                Score: {quizScore} / {quizQuestions.length} ({Math.round((quizScore / (quizQuestions.length || 1)) * 100)}%)
              </div>
            )}
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q: any, qIndex: number) => {
              const selected = selectedAnswers[qIndex];
              return (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-3 text-left">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase font-mono">
                      Question {qIndex + 1}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {q.type.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-100">{q.question}</p>

                  <div className="space-y-2 pt-1">
                    {(q.options || []).map((opt: string, optIndex: number) => {
                      const isCorrect = isOptionCorrect(q, optIndex, opt);
                      let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-750';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-medium';
                        } else if (selected === optIndex) {
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                        }
                      } else if (selected === optIndex) {
                        btnStyle = 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-medium';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSelectAnswer(qIndex, optIndex)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
                      <p className="font-bold text-slate-200 mb-0.5">Explanation:</p>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-750 flex items-center justify-between">
            {quizSubmitted ? (
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 border border-slate-700 transition"
              >
                Retake Assessment
              </button>
            ) : (
              <div />
            )}

            {!quizSubmitted ? (
              <button
                id="btn-submit-day-quiz"
                onClick={handleGradeQuiz}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer disabled:opacity-40"
              >
                Submit & Grade Answers
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-mono">
                {quizScore >= quizQuestions.length * 0.7
                  ? 'Passed! Day progress recorded.'
                  : 'Review concepts and try again.'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Reflection & Notes */}
      {activeTab === 'reflection' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-6">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
              Metacognitive Learning Practice
            </span>
            <h3 className="text-xl font-bold text-white mt-1">Daily Reflection Prompt</h3>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 text-sm text-slate-200 italic">
            "{dayData.practicalChallenge || `Reflect on how ${dayData.title} strengthens your core data analytics career portfolio.`}"
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Your Professional Notes & Insights for Today:
            </label>
            <textarea
              rows={6}
              value={reflectionText}
              onChange={e => {
                setReflectionText(e.target.value);
                setReflectionSaved(false);
              }}
              placeholder="Record how this relates to your career goals, what challenged you the most, and key syntax or formulas to remember..."
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-750 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            {reflectionSaved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Reflection stored in local learner journal
              </span>
            )}
            <button
              onClick={() => setReflectionSaved(true)}
              className="ml-auto px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              Save Reflection Notes
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation between Days */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          disabled={selectedDay <= 1}
          onClick={() => {
            setSelectedDay(Math.max(1, selectedDay - 1));
            setActiveTab('concepts');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Day
        </button>

        <span className="text-xs font-mono text-slate-400">
          Module {selectedDay} of 12
        </span>

        <button
          disabled={selectedDay >= 12}
          onClick={() => {
            setSelectedDay(Math.min(12, selectedDay + 1));
            setActiveTab('concepts');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Next Day <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
