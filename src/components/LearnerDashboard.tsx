import React from 'react';
import { useApp } from '../context/AppContext';
import { DailyProgressCheckin } from './DailyProgressCheckin';
import { UserAvatar } from './UserAvatar';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  FileText,
  CalendarCheck,
  BookOpen,
  Trophy,
  Target,
  Zap,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const LearnerDashboard: React.FC = () => {
  const {
    currentUser,
    completedDays,
    curriculum,
    assignments,
    submissions,
    quizResults,
    skills,
    calculateAttendancePercent,
    calculateOverallProgress,
    calculateJobReadiness,
    checkCertificateEligibility,
    setActiveView,
    setSelectedDay,
    setIsAiDrawerOpen,
    announcements
  } = useApp();

  if (!currentUser) return null;

  const currentLearnerId = currentUser.uid;
  const overallProgress = calculateOverallProgress(currentLearnerId);
  const attendanceRate = calculateAttendancePercent(currentLearnerId);
  const readiness = calculateJobReadiness(currentLearnerId);
  const eligibility = checkCertificateEligibility(currentLearnerId);

  // Submissions count
  const learnerSubs = submissions.filter(s => s.learnerId === currentLearnerId);
  const assignmentRate = Math.min(100, Math.round((learnerSubs.length / 12) * 100));

  // Average assessment score computed from real user quizzes
  const userQuizzes = quizResults ? quizResults.filter(q => q.learnerId === currentLearnerId) : [];
  const avgAssessmentScore = userQuizzes.length > 0
    ? Math.round(userQuizzes.reduce((acc, q) => acc + (q.score / (q.maxScore || 1)) * 100, 0) / userQuizzes.length)
    : 0;

  // Skills acquired count (proficient or job ready)
  const skillsAcquired = skills.filter(s => s.level === 'Proficient' || s.level === 'Job Ready').length;

  // Current Day & Module
  const currentDayNumber = Math.min(12, Math.max(1, completedDays.length + 1));
  const currentDayData = curriculum.find(c => c.day === currentDayNumber) || curriculum[0];
  const nextDayData = curriculum.find(c => c.day === Math.min(12, currentDayNumber + 1));

  // Pending assignments
  const pendingAssignments = assignments.filter(
    a => a.day <= currentDayNumber && !learnerSubs.some(s => s.assignmentId === a.id)
  );

  // Status text for certificate
  let certBadge = 'In Progress';
  let certColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  if (currentUser.certificateStatus === 'issued') {
    certBadge = 'Issued (Verified)';
    certColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  } else if (eligibility.eligible) {
    certBadge = 'Eligible for Claim';
    certColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
  }

  // Circular progress stroke calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Pinned Announcements if any */}
      {announcements.filter(a => a.pinned).length > 0 && (
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <span className="font-bold text-indigo-300 mr-2">
              ANNOUNCEMENT: {announcements.find(a => a.pinned)?.title}
            </span>
            <span className="text-slate-300">{announcements.find(a => a.pinned)?.content}</span>
          </div>
        </div>
      )}

      {/* Header Banner (Section 7) */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <UserAvatar
              src={currentUser.photoURL || currentUser.profilePhoto}
              name={currentUser.name}
              size="xl"
              showBorder
              className="ring-4 ring-indigo-500/20 shadow-2xl rounded-2xl"
            />
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Cohort 2026 • Professional Data Analytics</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome, {currentUser.name}
              </h1>
              <p className="text-base sm:text-lg font-medium text-slate-300 italic">
                "Your Journey From Learning To Employability"
              </p>
              <p className="text-xs text-slate-400 max-w-2xl pt-0.5">
                {currentUser.email} • Target: {currentUser.careerGoal || 'Data Analyst'}
              </p>
            </div>
          </div>

          {/* Progress Ring Card */}
          <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shrink-0">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-24 h-24 -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-700"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-white">{overallProgress}%</span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Complete</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-slate-400">Curriculum Cadence</span>
              <p className="text-sm font-bold text-white">Day {currentDayNumber} of 12</p>
              <p className="text-xs text-indigo-400 font-medium">
                {completedDays.length} Modules Cleared
              </p>
              <button
                onClick={() => {
                  setSelectedDay(currentDayNumber);
                  setActiveView('curriculum');
                }}
                className="mt-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
              >
                Resume Learning <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Executive Dashboard Cards (Section 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Overall Progress */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider">Overall Progress</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{overallProgress}%</p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${overallProgress}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Dynamic weighted score</span>
        </div>

        {/* 2. Current Day */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider">Current Day</span>
            <CalendarCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">Day {currentDayNumber}</p>
          <p className="text-xs text-slate-300 font-medium truncate mt-1">{currentDayData.title}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">12 Days Total</span>
        </div>

        {/* 3. Attendance % */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider">Attendance %</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{attendanceRate}%</p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${attendanceRate}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Min 80% for certificate</span>
        </div>

        {/* 4. Assignment Completion */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider">Assignments</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{assignmentRate}%</p>
          <p className="text-xs text-slate-300 mt-1">{learnerSubs.length} of 12 Submitted</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Hands-on practicals</span>
        </div>

        {/* 5. Assessment Score */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider">Avg Assessment</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-cyan-300">{avgAssessmentScore}%</p>
          <p className="text-xs text-slate-300 mt-1">Quizzes & Diagnostics</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Verified grading</span>
        </div>

        {/* 6. Job Readiness Score */}
        <div
          onClick={() => setActiveView('readiness')}
          className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-indigo-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider group-hover:text-indigo-300">
              Job Readiness
            </span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            {readiness.score} / 100
          </p>
          <p className="text-xs text-indigo-300 mt-1">Multi-Domain Breakdown</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Click to audit report</span>
        </div>

        {/* 7. Skills Acquired */}
        <div
          onClick={() => setActiveView('skills')}
          className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-cyan-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider group-hover:text-cyan-300">
              Skills Acquired
            </span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{skillsAcquired} / 18</p>
          <p className="text-xs text-slate-300 mt-1">Proficient or Job Ready</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Interactive Skill Matrix</span>
        </div>

        {/* 8. Certificate Status */}
        <div
          onClick={() => setActiveView('certification')}
          className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-amber-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider group-hover:text-amber-300">
              Certificate
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-1">
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${certColor}`}>
              {certBadge}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            {currentUser.certificateId ? currentUser.certificateId : 'Requirements Audit'}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Official Verification</span>
        </div>
      </div>

      {/* Daily Progress Check-in (Firebase Persisted) */}
      <DailyProgressCheckin />

      {/* Main Focus: Today's Mission & Next Learning Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Mission (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Today's Mission • Day {currentDayNumber}
            </span>
            <span className="text-xs font-mono text-slate-400">{currentDayData.domain}</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            {currentDayData.title}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed">
            {currentDayData.learningObjective}
          </p>

          {/* Agenda breakdown */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Today's Key Topics:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentDayData.agenda.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-750 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hands-On Lab Preview */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-2">
            <div className="flex items-center justify-between text-indigo-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                {currentDayData.handsOnLab.title}
              </span>
              <span className="text-[10px] text-slate-400">90% Practical</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{currentDayData.handsOnLab.businessScenario}</p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Career Relevance:</span>
              <span className="px-2 py-0.5 rounded bg-slate-700 text-xs text-slate-200">
                {currentDayData.careerRelevance.usedInRoles.join(' • ')}
              </span>
            </div>
            <button
              id="btn-launch-today-workspace"
              onClick={() => {
                setSelectedDay(currentDayNumber);
                setActiveView('curriculum');
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Enter Day {currentDayNumber} Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Pending Assignments & Upcoming Assessments */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" /> Pending Assignments
              </span>
              <span className="text-xs font-mono text-amber-400">{pendingAssignments.length} Open</span>
            </div>

            {pendingAssignments.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All assignments up to Day {currentDayNumber} submitted!</span>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingAssignments.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    onClick={() => setActiveView('assignments')}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-750 hover:border-slate-600 transition cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between text-[11px] text-indigo-400 font-mono">
                      <span>Day {task.day}</span>
                      <span className="text-slate-400">{task.deadline}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 mt-1 truncate">{task.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{task.skillsTested.join(', ')}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setActiveView('assignments')}
              className="w-full py-2 text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              View All 12 Assignments →
            </button>
          </div>

          {/* Next Learning Activity */}
          <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-3">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" /> Next Milestone
            </span>

            {nextDayData ? (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-750 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-cyan-400 font-mono">
                  <span>Day {nextDayData.day}</span>
                  <span className="text-[10px] text-slate-400">{nextDayData.domain}</span>
                </div>
                <p className="text-sm font-bold text-white">{nextDayData.title}</p>
                <p className="text-xs text-slate-400 line-clamp-2">{nextDayData.learningObjective}</p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-750 text-xs text-emerald-300">
                You have reached the final Capstone project milestone!
              </div>
            )}

            {/* Quick AI Assistance Trigger */}
            <div className="pt-1">
              <button
                onClick={() => setIsAiDrawerOpen(true)}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Ask AI Coach a Conceptual Question</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
