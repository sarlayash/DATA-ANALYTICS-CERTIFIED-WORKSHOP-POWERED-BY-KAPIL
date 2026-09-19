import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Code2,
  HelpCircle,
  Sparkles,
  Play
} from 'lucide-react';

export const AssessmentsView: React.FC = () => {
  const { curriculum, submitQuizResult } = useApp();
  const [selectedDayAssessment, setSelectedDayAssessment] = useState(1);
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [timerActive, setTimerActive] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const dayData = curriculum.find(c => c.day === selectedDayAssessment) || curriculum[0];
  const questions = dayData.quiz?.questions || [];

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleGrade();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const isOptionCorrect = (q: any, optIndex: number, optText: string) => {
    if (typeof q.correctAnswer === 'number') return q.correctAnswer === optIndex;
    if (typeof q.correctAnswer === 'string') {
      return q.correctAnswer === optText || q.correctAnswer === String(optIndex);
    }
    if (Array.isArray(q.correctAnswer)) return q.correctAnswer.includes(optText);
    return false;
  };

  const handleGrade = () => {
    let s = 0;
    questions.forEach((q: any, idx: number) => {
      const selectedOptIdx = selectedAnswers[idx];
      const selectedOptText = q.options ? q.options[selectedOptIdx] : '';
      if (selectedOptIdx !== undefined && isOptionCorrect(q, selectedOptIdx, selectedOptText)) {
        s += 1;
      }
    });
    setScore(s);
    setSubmitted(true);
    setTimerActive(false);
    submitQuizResult(selectedDayAssessment, s, questions.length || 1);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setTimeLeft(300);
    setTimerActive(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Assessment & Certification Exam Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Assessments, Quizzes & Diagnostic Tests
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Verify your technical proficiency across SQL, Python, Excel, Power BI, and Data Interpretation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTimedMode(!isTimedMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-2 ${
                isTimedMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{isTimedMode ? 'Timed Exam Mode (5m)' : 'Standard Practice Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {curriculum.map(d => (
            <button
              key={d.day}
              onClick={() => {
                setSelectedDayAssessment(d.day);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedDayAssessment === d.day
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
              }`}
            >
              Day {d.day} Assessment
            </button>
          ))}
        </div>
      </div>

      {/* Main Assessment Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-750">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
              Knowledge Diagnostic
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Day {dayData.day}: {dayData.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Passing threshold: 70% • Questions: {questions.length} • Instant automated scoring
            </p>
          </div>

          {isTimedMode && (
            <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-750 font-mono text-sm">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-white font-bold">{formatTime(timeLeft)}</span>
              {!timerActive && !submitted && (
                <button
                  onClick={() => setTimerActive(true)}
                  className="px-2 py-0.5 rounded bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
                >
                  Start
                </button>
              )}
            </div>
          )}
        </div>

        {/* Questions list */}
        <div className="space-y-6">
          {questions.map((q: any, qIndex: number) => {
            const selected = selectedAnswers[qIndex];
            return (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 font-mono">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {q.type.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-100 leading-relaxed">{q.question}</p>

                <div className="space-y-2 pt-1">
                  {(q.options || []).map((opt: string, optIndex: number) => {
                    const isCorrect = isOptionCorrect(q, optIndex, opt);
                    let style = 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-750';
                    if (submitted) {
                      if (isCorrect) {
                        style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                      } else if (selected === optIndex) {
                        style = 'bg-rose-500/20 border-rose-500 text-rose-300';
                      }
                    } else if (selected === optIndex) {
                      style = 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-medium';
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleSelect(qIndex, optIndex)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${style}`}
                      >
                        <span>{opt}</span>
                        {submitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-1">
                    <p className="font-bold text-slate-200">Instructor Rationale & Explanation:</p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom controls & results */}
        <div className="pt-4 border-t border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {submitted ? (
              <div className="space-y-1">
                <p className="text-base font-extrabold text-white">
                  Assessment Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
                </p>
                <p className={`text-xs font-medium ${score >= questions.length * 0.7 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {score >= questions.length * 0.7
                    ? '✓ Passed. Diagnostic verified in learner skills matrix.'
                    : '✗ Minimum 70% required to clear. Review day concepts and retake.'}
                </p>
              </div>
            ) : (
              <span className="text-xs text-slate-400">
                {Object.keys(selectedAnswers).length} of {questions.length} answered
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted && (
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake Test
              </button>
            )}

            {!submitted && (
              <button
                id="btn-submit-assessment-score"
                onClick={handleGrade}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer disabled:opacity-40"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
