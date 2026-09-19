import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  Clock,
  Smile,
  CheckCircle2,
  Sparkles,
  Send,
  Cloud,
  Check,
  AlertCircle,
  HelpCircle,
  History,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export const DailyProgressCheckin: React.FC = () => {
  const {
    currentUser,
    checkins,
    submitCheckin,
    cloudSyncStatus,
    syncFromCloud,
    selectedDay,
    curriculum
  } = useApp();

  const activeDay = selectedDay || 1;
  const currentDayInfo = curriculum.find(c => c.day === activeDay) || curriculum[0];

  // Check if today already has a check-in for this user
  const userCheckins = checkins.filter(c => c.learnerId === currentUser?.uid);
  const existingForDay = userCheckins.find(c => c.day === activeDay);

  const [day, setDay] = useState<number>(activeDay);
  const [hoursSpent, setHoursSpent] = useState<number>(existingForDay?.hoursSpent || 3.5);
  const [confidenceRating, setConfidenceRating] = useState<number>(existingForDay?.confidenceRating || 4);
  const [topicsCovered, setTopicsCovered] = useState<string>(
    existingForDay?.topicsCovered || (currentDayInfo ? `${currentDayInfo.title} (${currentDayInfo.domain})` : '')
  );
  const [keyTakeaway, setKeyTakeaway] = useState<string>(existingForDay?.keyTakeaway || '');
  const [blockersOrDoubts, setBlockersOrDoubts] = useState<string>(existingForDay?.blockersOrDoubts || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Quick rating descriptors
  const confidenceLabels: Record<number, { label: string; color: string; desc: string }> = {
    1: { label: 'Struggling', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10', desc: 'Need conceptual clarification or mentor assistance' },
    2: { label: 'Developing', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10', desc: 'Grasping basics, finding hands-on labs challenging' },
    3: { label: 'Comfortable', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10', desc: 'Understand core logic and successfully executing labs' },
    4: { label: 'Confident', color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10', desc: 'Fluent with queries/scripts, solving edge cases independently' },
    5: { label: 'Job Ready', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10', desc: 'Can explain to stakeholders and implement in enterprise environment' }
  };

  const handleDaySelect = (d: number) => {
    setDay(d);
    const existing = userCheckins.find(c => c.day === d);
    const dayInfo = curriculum.find(c => c.day === d);
    if (existing) {
      setHoursSpent(existing.hoursSpent);
      setConfidenceRating(existing.confidenceRating);
      setTopicsCovered(existing.topicsCovered);
      setKeyTakeaway(existing.keyTakeaway);
      setBlockersOrDoubts(existing.blockersOrDoubts || '');
    } else {
      setHoursSpent(3.5);
      setConfidenceRating(4);
      setTopicsCovered(dayInfo ? `${dayInfo.title} (${dayInfo.domain})` : `Day ${d} Learning Topics`);
      setKeyTakeaway('');
      setBlockersOrDoubts('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicsCovered.trim() || !keyTakeaway.trim()) return;

    setIsSubmitting(true);
    try {
      await submitCheckin({
        day,
        topicsCovered: topicsCovered.trim(),
        keyTakeaway: keyTakeaway.trim(),
        hoursSpent: Number(hoursSpent),
        confidenceRating: Number(confidenceRating),
        blockersOrDoubts: blockersOrDoubts.trim()
      });

      setSuccessMessage(`Day ${day} check-in successfully logged & persisted to Firebase Firestore!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Check-in submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute aggregate stats across real check-ins
  const totalStudyHours = userCheckins.reduce((sum, c) => sum + (c.hoursSpent || 0), 0);
  const avgConfidence = userCheckins.length > 0
    ? (userCheckins.reduce((sum, c) => sum + (c.confidenceRating || 0), 0) / userCheckins.length).toFixed(1)
    : '0.0';

  return (
    <div id="daily-progress-checkin-component" className="p-6 sm:p-7 rounded-3xl bg-slate-800/60 border border-slate-700 shadow-xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <CalendarCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Daily Progress Reflection • Real-time Sync</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Daily Progress & Study Check-In
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Track your authentic daily study hours, hands-on practice, and concept confidence.
          </p>
        </div>

        {/* Cloud Sync Status Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => syncFromCloud()}
            title="Refresh from Firebase Firestore"
            className="p-2 rounded-xl bg-slate-900 border border-slate-750 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Refresh Cloud</span>
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-750 flex items-center gap-2 text-xs">
            <Cloud className={`w-3.5 h-3.5 ${cloudSyncStatus === 'synced' ? 'text-emerald-400' : cloudSyncStatus === 'syncing' ? 'text-cyan-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="font-semibold text-slate-200">
              {cloudSyncStatus === 'synced' ? 'Firebase Synced' : cloudSyncStatus === 'syncing' ? 'Saving to Firestore...' : 'Local Cache'}
            </span>
          </div>
        </div>
      </div>

      {/* Metric Quick Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-750">
          <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Total Logged Hours
          </span>
          <p className="text-xl font-extrabold text-white mt-1">{totalStudyHours.toFixed(1)} hrs</p>
          <span className="text-[10px] text-slate-500">Across verified sessions</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-750">
          <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Avg Confidence
          </span>
          <p className="text-xl font-extrabold text-emerald-400 mt-1">{avgConfidence} / 5.0</p>
          <span className="text-[10px] text-slate-500">Self-efficacy metric</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-750">
          <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Check-ins Submitted
          </span>
          <p className="text-xl font-extrabold text-cyan-300 mt-1">{userCheckins.length} of 12</p>
          <span className="text-[10px] text-slate-500">Syllabus progression</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-750">
          <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Active Session
          </span>
          <p className="text-xl font-extrabold text-amber-300 mt-1">Day {day}</p>
          <span className="text-[10px] text-slate-500">{currentDayInfo?.domain || 'Analytics'}</span>
        </div>
      </div>

      {/* Notification Banner upon submission */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Day Selector Tabs */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Select Workshop Day to Record / Update:
          </label>
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {curriculum.map(c => {
              const hasCheckedIn = userCheckins.some(ck => ck.day === c.day);
              const isCurrent = day === c.day;
              return (
                <button
                  type="button"
                  key={c.day}
                  onClick={() => handleDaySelect(c.day)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : hasCheckedIn
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-750 hover:text-slate-200'
                  }`}
                >
                  <span>Day {c.day}</span>
                  {hasCheckedIn && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hours Spent & Confidence Rating Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Study Hours Slider & Input */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-750 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Daily Study & Lab Time:
              </label>
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                {hoursSpent} Hours
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="12"
              step="0.5"
              value={hoursSpent}
              onChange={e => setHoursSpent(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5 hr</span>
              <span>3.5 hrs (Recommended)</span>
              <span>12 hrs</span>
            </div>
          </div>

          {/* Confidence / Mood Rating */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-750 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-emerald-400" /> Concept Confidence & Mood:
              </label>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${confidenceLabels[confidenceRating].color}`}>
                {confidenceLabels[confidenceRating].label} ({confidenceRating}/5)
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  type="button"
                  key={rating}
                  onClick={() => setConfidenceRating(rating)}
                  className={`py-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 cursor-pointer ${
                    confidenceRating === rating
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">
                    {rating === 1 ? '😟' : rating === 2 ? '😐' : rating === 3 ? '🙂' : rating === 4 ? '😊' : '🚀'}
                  </span>
                  <span className="text-[10px]">{rating}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 italic">
              {confidenceLabels[confidenceRating].desc}
            </p>
          </div>
        </div>

        {/* Topics Covered */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Topics, Queries & Tools Practiced Today:
          </label>
          <input
            type="text"
            value={topicsCovered}
            onChange={e => setTopicsCovered(e.target.value)}
            placeholder="e.g., SQL Window Functions (ROW_NUMBER, RANK), BigQuery Partitioning, Star Schema modeling..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        {/* Key Takeaways */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Key Conceptual Takeaway / "Aha!" Insight:
          </label>
          <textarea
            rows={3}
            value={keyTakeaway}
            onChange={e => setKeyTakeaway(e.target.value)}
            placeholder="Explain what clicked today (e.g., 'Understood why WHERE filters rows before aggregation while HAVING filters the post-grouped metric. Successfully cut BigQuery byte scan by 60% with date partitioning.')."
            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
            required
          />
        </div>

        {/* Doubts & Blockers (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Doubts or Blockers (Sent to Mentor Kapil for review):</span>
            </label>
            <span className="text-[10px] text-slate-500">Optional</span>
          </div>
          <input
            type="text"
            value={blockersOrDoubts}
            onChange={e => setBlockersOrDoubts(e.target.value)}
            placeholder="e.g., Need clarification on DAX CALCULATE context transition when mixing USERELATIONSHIP with inactive date tables."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500/70"
          />
        </div>

        {/* Submit & History Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>{showHistory ? 'Hide Previous Check-ins' : `View My Past Check-ins (${userCheckins.length})`}</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Persisting to Firestore...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{existingForDay ? `Update Day ${day} Check-In` : `Submit Day ${day} Check-In`}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Previous History Accordion */}
      {showHistory && (
        <div className="pt-4 border-t border-slate-750 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" /> Verified Submission Ledger
          </h3>

          {userCheckins.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-slate-900/60 border border-slate-750">
              No check-ins logged yet. Fill out the form above to record your first study entry.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {userCheckins.map(ck => (
                <div key={ck.id} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-750 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Day {ck.day}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ck.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 font-semibold">
                        {ck.hoursSpent} hrs
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${confidenceLabels[ck.confidenceRating]?.color || 'text-slate-300'}`}>
                        {confidenceLabels[ck.confidenceRating]?.label || `${ck.confidenceRating}/5`}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 font-medium">{ck.topicsCovered}</p>
                  <p className="text-slate-400 italic">"{ck.keyTakeaway}"</p>

                  {ck.blockersOrDoubts && (
                    <div className="pt-1 flex items-start gap-1.5 text-amber-300/90 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>Note for Mentor: {ck.blockersOrDoubts}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
