import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  Award,
  Medal,
  Flame,
  Zap,
  Star,
  CheckCircle2
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { learners, calculateOverallProgress, calculateAttendancePercent, calculateJobReadiness } = useApp();

  // Compute leaderboard ranks
  const ranked = [...learners]
    .map(l => {
      const prog = calculateOverallProgress(l.uid);
      const att = calculateAttendancePercent(l.uid);
      const ready = calculateJobReadiness(l.uid);
      const points = Math.round(prog * 10 + att * 5 + ready.score * 8);
      return {
        ...l,
        calculatedPoints: points,
        prog,
        att,
        readyScore: ready.score
      };
    })
    .sort((a, b) => b.calculatedPoints - a.calculatedPoints);

  const getBadge = (index: number) => {
    if (index === 0) return { label: 'SQL & BI Maestro', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    if (index === 1) return { label: 'DAX Virtuoso', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
    if (index === 2) return { label: 'Streak Master', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    return { label: 'Active Learner', color: 'bg-slate-800 text-slate-400 border-slate-700' };
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Gamified Engagement Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cohort Leaderboard & Points Ranking
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Points rewarded dynamically for daily learning completion, lab submissions, quiz streaks, and attendance diligence.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-750 shrink-0">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Cohort Cadence</p>
              <p className="text-sm font-bold text-white">Daily Streak Bonus Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ranked.slice(0, 3).map((learner, idx) => {
          const rankColors = [
            'border-amber-500/60 bg-gradient-to-b from-amber-500/10 to-slate-900',
            'border-slate-400/60 bg-gradient-to-b from-slate-400/10 to-slate-900',
            'border-amber-700/60 bg-gradient-to-b from-amber-700/10 to-slate-900'
          ];
          const badge = getBadge(idx);

          return (
            <div
              key={learner.uid}
              className={`p-6 rounded-3xl border-2 ${rankColors[idx]} space-y-3 relative text-center flex flex-col items-center justify-between`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-750 flex items-center justify-center font-bold text-sm font-mono text-white">
                #{idx + 1}
              </div>

              <img
                src={learner.photoURL}
                alt={learner.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500 mt-1"
              ></img>

              <div>
                <h3 className="font-bold text-white text-base">{learner.name}</h3>
                <p className="text-xs text-slate-400 truncate max-w-[180px]">{learner.college}</p>
                <span className={`inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              <div className="w-full pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Points:</span>
                <span className="font-mono text-amber-400 font-extrabold text-sm">
                  {learner.calculatedPoints} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete Leaderboard Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-4">
        <h3 className="text-base font-bold text-white">Full Cohort Standings</h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-750">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-750">
              <tr>
                <th className="p-3.5">Rank</th>
                <th className="p-3.5">Learner</th>
                <th className="p-3.5">Points</th>
                <th className="p-3.5">Progress</th>
                <th className="p-3.5">Attendance</th>
                <th className="p-3.5">Job Readiness</th>
                <th className="p-3.5 text-right">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ranked.map((l, index) => {
                const badge = getBadge(index);
                return (
                  <tr key={l.uid} className="hover:bg-slate-800/60 transition">
                    <td className="p-3.5 font-mono font-bold text-slate-400">#{index + 1}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img src={l.photoURL} alt={l.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-white">{l.name}</p>
                          <p className="text-[10px] text-slate-400">{l.college || 'Enterprise'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-amber-400 font-extrabold">{l.calculatedPoints} pts</td>
                    <td className="p-3.5 font-mono text-cyan-300 font-bold">{l.prog}%</td>
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">{l.att}%</td>
                    <td className="p-3.5 font-mono text-indigo-300 font-bold">{l.readyScore}/100</td>
                    <td className="p-3.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
