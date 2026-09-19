import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceStatus } from '../types';
import {
  BarChart3,
  Users,
  CalendarCheck,
  FileText,
  Megaphone,
  Sliders,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Award,
  Trash2,
  Edit,
  Send,
  Plus,
  Filter,
  ShieldCheck,
  ExternalLink,
  Clock,
  Smile,
  Cloud
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    learners,
    attendance,
    submissions,
    assignments,
    certificates,
    announcements,
    settings,
    checkins,
    cloudSyncStatus,
    markAttendance,
    gradeAssignment,
    issueCertificate,
    revokeCertificate,
    addAnnouncement,
    updateSettings,
    exportCSV,
    calculateAttendancePercent,
    calculateOverallProgress,
    calculateJobReadiness,
    activeView,
    setActiveView
  } = useApp();

  // Internal sub-tab: 'overview' | 'learners' | 'attendance' | 'grading' | 'checkins' | 'announcements' | 'settings'
  const [adminTab, setAdminTab] = useState<string>(
    activeView.startsWith('admin-') ? activeView.replace('admin-', '') : 'overview'
  );

  // Keep adminTab in sync when navigating from sidebar
  React.useEffect(() => {
    if (activeView.startsWith('admin-')) {
      setAdminTab(activeView.replace('admin-', ''));
    } else if (activeView === 'admin') {
      setAdminTab('overview');
    }
  }, [activeView]);

  // Search & Filters for Learners table
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCollege, setFilterCollege] = useState('all');
  const [filterCertStatus, setFilterCertStatus] = useState('all');

  // Attendance tab selection
  const [attendanceDay, setAttendanceDay] = useState(1);

  // Grading modal/state
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradeMarks, setGradeMarks] = useState(85);
  const [gradeFeedback, setGradeFeedback] = useState('Clean logic and robust execution.');

  // New announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPinned, setAnnPinned] = useState(false);

  // Filtered learners
  const filteredLearners = learners.filter(l => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.college && l.college.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.phone && l.phone.includes(searchQuery));

    const matchesCollege = filterCollege === 'all' || l.college === filterCollege;
    const matchesCert = filterCertStatus === 'all' || l.certificateStatus === filterCertStatus;

    return matchesSearch && matchesCollege && matchesCert;
  });

  const colleges = Array.from(new Set(learners.map(l => l.college).filter(Boolean)));

  // Cohort Stats
  const totalLearners = learners.length;
  const certifiedCount = certificates.length;
  const avgProgress = Math.round(
    learners.reduce((acc, l) => acc + calculateOverallProgress(l.uid), 0) / (totalLearners || 1)
  );
  const avgAttendance = Math.round(
    learners.reduce((acc, l) => acc + calculateAttendancePercent(l.uid), 0) / (totalLearners || 1)
  );

  const handleSaveGrade = (subId: string) => {
    gradeAssignment(subId, gradeMarks, gradeFeedback);
    setGradingSubId(null);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    addAnnouncement(annTitle, annContent, 'academic', annPinned);
    setAnnTitle('');
    setAnnContent('');
    setAnnPinned(false);
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrative Command Center • Instructor Role</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cohort Management & Academic Administration
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Full control over curriculum pacing, attendance audits, assignment grading, and authenticated certificate issuance.
            </p>
          </div>

          {/* Export Center */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportCSV('learners')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Export Full Learner Roster CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" /> Export Learners
            </button>
            <button
              onClick={() => exportCSV('attendance')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Export Attendance Grid CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Attendance
            </button>
            <button
              onClick={() => exportCSV('readiness')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Export Job Readiness Audit CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" /> Export Readiness
            </button>
          </div>
        </div>
      </div>

      {/* Admin Subtabs Bar */}
      <div className="flex border-b border-slate-800 text-xs sm:text-sm font-semibold gap-1 sm:gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Cohort Metrics', icon: BarChart3 },
          { id: 'learners', label: 'Learner Roster', icon: Users },
          { id: 'attendance', label: 'Attendance Manager', icon: CalendarCheck },
          { id: 'grading', label: 'Assignment Grading', icon: FileText },
          { id: 'checkins', label: `Daily Check-Ins (${checkins.length})`, icon: Clock },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'settings', label: 'Grading Weights', icon: Sliders }
        ].map(t => {
          const Icon = t.icon;
          const isActive = adminTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setAdminTab(t.id)}
              className={`px-4 py-3 border-b-2 transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'border-rose-500 text-rose-300 bg-rose-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Cohort Overview & KPI Metrics */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-750">
              <span className="text-[11px] uppercase font-bold text-slate-400">Total Enrolled</span>
              <p className="text-3xl font-extrabold text-white mt-1">{totalLearners}</p>
              <span className="text-xs text-indigo-400 mt-1 block">Active Workshop Cohort</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-750">
              <span className="text-[11px] uppercase font-bold text-slate-400">Avg Progress</span>
              <p className="text-3xl font-extrabold text-cyan-300 mt-1">{avgProgress}%</p>
              <span className="text-xs text-slate-400 mt-1 block">Weighted Syllabus Metric</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-750">
              <span className="text-[11px] uppercase font-bold text-slate-400">Cohort Attendance</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">{avgAttendance}%</p>
              <span className="text-xs text-slate-400 mt-1 block">Min 80% Requirement</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-750">
              <span className="text-[11px] uppercase font-bold text-slate-400">Certificates Issued</span>
              <p className="text-3xl font-extrabold text-amber-400 mt-1">{certifiedCount}</p>
              <span className="text-xs text-slate-400 mt-1 block">Authenticated Records</span>
            </div>
          </div>

          {/* Quick Roster Snippet */}
          <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Top Performing Learners in Cohort
              </h3>
              <button
                onClick={() => setAdminTab('learners')}
                className="text-xs text-rose-400 hover:underline font-semibold"
              >
                View Complete Roster →
              </button>
            </div>

            {learners.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No Learners Enrolled Yet</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  The cohort has started clean with 0 enrolled learners. As students register and onboard through the portal, their live progress and academic performance will display here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {learners.slice(0, 4).map(l => (
                  <div key={l.uid} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <img src={l.photoURL} alt={l.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white truncate max-w-[130px]">{l.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{l.college}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Progress:</span>
                      <span className="font-mono text-cyan-300 font-bold">{calculateOverallProgress(l.uid)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Learner Roster & Table */}
      {adminTab === 'learners' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search name, email, college, phone..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <select
                value={filterCollege}
                onChange={e => setFilterCollege(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">All Colleges</option>
                {colleges.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={filterCertStatus}
                onChange={e => setFilterCertStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">All Cert Statuses</option>
                <option value="issued">Issued</option>
                <option value="eligible">Eligible</option>
                <option value="not_started">In Progress</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-750">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-750">
                <tr>
                  <th className="p-3.5">Learner</th>
                  <th className="p-3.5">College / Degree</th>
                  <th className="p-3.5">Progress</th>
                  <th className="p-3.5">Attendance</th>
                  <th className="p-3.5">Readiness</th>
                  <th className="p-3.5">Certificate</th>
                  <th className="p-3.5 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredLearners.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      <Users className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <p className="font-semibold text-slate-300">No Learners Found</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {learners.length === 0
                          ? "The workshop currently has 0 registered learners. When new students enroll, their records will populate here."
                          : "No learners match your search query or selected filters."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLearners.map(l => {
                    const prog = calculateOverallProgress(l.uid);
                    const att = calculateAttendancePercent(l.uid);
                    const ready = calculateJobReadiness(l.uid);
                    const hasCert = certificates.some(c => c.learnerId === l.uid && c.status === 'VALID');

                    return (
                      <tr key={l.uid} className="hover:bg-slate-800/60 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img src={l.photoURL} alt={l.name} className="w-7 h-7 rounded-full object-cover" />
                            <div>
                              <p className="font-semibold text-white">{l.name}</p>
                              <p className="text-[11px] text-slate-400">{l.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-300">
                          <p className="truncate max-w-[150px]">{l.college || 'Enterprise'}</p>
                          <p className="text-[10px] text-slate-500">{l.course || 'Degree'}</p>
                        </td>
                        <td className="p-3.5 font-mono text-cyan-300 font-bold">{prog}%</td>
                        <td className="p-3.5 font-mono text-emerald-400 font-bold">{att}%</td>
                        <td className="p-3.5 font-mono text-indigo-300 font-bold">{ready.score}/100</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            hasCert
                              ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
                              : 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                          }`}>
                            {hasCert ? 'Issued' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          {!hasCert ? (
                            <button
                              onClick={() => issueCertificate(l.uid)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-[11px] font-semibold transition"
                            >
                              Issue Cert
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const c = certificates.find(cert => cert.learnerId === l.uid);
                                if (c) revokeCertificate(c.certificateId);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 text-[11px] font-semibold transition"
                            >
                              Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Attendance Manager (Section 19) */}
      {adminTab === 'attendance' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Daily Live Attendance Roster</h3>
              <p className="text-xs text-slate-400">Mark student presence for live hands-on sessions.</p>
            </div>

            {/* Day Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Select Day:</span>
              <select
                value={attendanceDay}
                onChange={e => setAttendanceDay(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-750 text-xs text-white focus:outline-none font-bold"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>Day {d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-750">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-750">
                <tr>
                  <th className="p-3.5">Learner</th>
                  <th className="p-3.5">Day {attendanceDay} Status</th>
                  <th className="p-3.5 text-right">Quick Mark Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {learners.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-400">
                      <CalendarCheck className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <p className="font-semibold text-slate-300">No Learners to Mark Attendance</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Attendance registers will be populated automatically when learners enroll.
                      </p>
                    </td>
                  </tr>
                ) : (
                  learners.map(l => {
                    const record = attendance.find(a => a.learnerId === l.uid && a.day === attendanceDay);
                    const currentStatus = record?.status || 'present';

                    return (
                      <tr key={l.uid} className="hover:bg-slate-800/60 transition">
                        <td className="p-3.5 font-semibold text-white">{l.name}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            currentStatus === 'present'
                              ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
                              : currentStatus === 'late'
                              ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                              : 'text-rose-300 bg-rose-500/10 border-rose-500/30'
                          }`}>
                            {currentStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map(st => (
                            <button
                              key={st}
                              onClick={() => markAttendance(l.uid, attendanceDay, st)}
                              className={`px-2 py-1 rounded text-[10px] font-semibold uppercase transition ${
                                currentStatus === st
                                  ? 'bg-indigo-600 text-white font-bold'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Assignment Grading (Section 21) */}
      {adminTab === 'grading' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Submitted Practical Deliverables</h3>
              <p className="text-xs text-slate-400">Evaluate code, provide rubric scores and constructive feedback.</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{submissions.length} Total Submissions</span>
          </div>

          <div className="space-y-3">
            {submissions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No Submissions Awaiting Grading</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  When learners submit practical deliverables or Capstone projects, their work will appear here with instant rubric scoring and feedback tools.
                </p>
              </div>
            ) : (
              submissions.map(sub => {
              const isGrading = gradingSubId === sub.id;
              return (
                <div key={sub.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300">
                          DAY {sub.day}
                        </span>
                        <span className="font-bold text-white text-xs sm:text-sm">{sub.learnerName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Type: {sub.submissionType.toUpperCase()} • Submitted: {sub.submittedAt.slice(0, 10)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        sub.status === 'evaluated'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      }`}>
                        {sub.status === 'evaluated' ? `Graded (${sub.marks}/100)` : 'Pending Grading'}
                      </span>
                      <button
                        onClick={() => {
                          setGradingSubId(isGrading ? null : sub.id);
                          setGradeMarks(sub.marks || 88);
                          setGradeFeedback(sub.feedback || 'Excellent data modeling and clear documentation.');
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 transition"
                      >
                        {isGrading ? 'Cancel' : 'Grade / Edit'}
                      </button>
                    </div>
                  </div>

                  {sub.url && (
                    <div className="text-xs">
                      <span className="text-slate-400">Deliverable Link: </span>
                      <a href={sub.url} target="_blank" rel="noreferrer" className="text-cyan-400 font-mono underline">
                        {sub.url}
                      </a>
                    </div>
                  )}

                  {sub.content && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {sub.content}
                    </div>
                  )}

                  {/* Inline Grading Form */}
                  {isGrading && (
                    <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-3 pt-3">
                      <div className="flex items-center gap-4">
                        <label className="text-xs font-semibold text-slate-300">Marks (0-100):</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={gradeMarks}
                          onChange={e => setGradeMarks(Number(e.target.value))}
                          className="w-24 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Feedback:</label>
                        <textarea
                          rows={2}
                          value={gradeFeedback}
                          onChange={e => setGradeFeedback(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <button
                        onClick={() => handleSaveGrade(sub.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer"
                      >
                        Save Evaluation
                      </button>
                    </div>
                  )}
                </div>
              );
            }))}
          </div>
        </div>
      )}

      {/* Tab 5: Announcements (Section 22) */}
      {adminTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Announcement */}
          <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-rose-400" /> Broadcast New Announcement
            </h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Announcement Title</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  placeholder="e.g. Day 8 Live Session Zoom Link & Dataset Update"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Message Content</label>
                <textarea
                  rows={4}
                  value={annContent}
                  onChange={e => setAnnContent(e.target.value)}
                  placeholder="Please download the retail multi-store dataset before today's 7:00 PM session..."
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-750 text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ann-pinned"
                  checked={annPinned}
                  onChange={e => setAnnPinned(e.target.checked)}
                  className="rounded border-slate-700 text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="ann-pinned" className="text-slate-300 font-semibold">
                  Pin to top of all learner dashboards
                </label>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md transition cursor-pointer"
              >
                Broadcast to Cohort
              </button>
            </form>
          </div>

          {/* Active Announcements */}
          <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-3">
            <h3 className="text-base font-bold text-white">Active Cohort Announcements</h3>
            <div className="space-y-2.5">
              {announcements.map(ann => (
                <div key={ann.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{ann.title}</span>
                    {ann.pinned && (
                      <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                        PINNED
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 leading-relaxed">{ann.content}</p>
                  <p className="text-[10px] text-slate-500 pt-1">
                    By {ann.authorName} • {ann.createdAt.slice(0, 10)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Daily Progress Check-Ins Audit Ledger (Firebase Firestore) */}
      {adminTab === 'checkins' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold border border-cyan-500/30 mb-2">
                <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>Real-Time Firestore Ledger • {cloudSyncStatus === 'synced' ? 'Cloud Synced' : 'Syncing...'}</span>
              </div>
              <h3 className="text-xl font-bold text-white">Learner Daily Check-Ins & Self-Efficacy</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentic logs of study hours, concept takeaways, confidence ratings, and learner blockers.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-750 text-xs text-slate-300">
                <span className="text-slate-400">Total Check-Ins:</span>{' '}
                <span className="font-bold text-white">{checkins.length}</span>
              </div>
            </div>
          </div>

          {checkins.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-800/40 border border-slate-750 space-y-2">
              <Clock className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No daily check-ins recorded yet</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Learners can submit their daily study hours, takeaways, and confidence ratings from the Learner Dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checkins.map(ck => (
                <div key={ck.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-750 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-750">
                    <div>
                      <h4 className="font-bold text-white text-sm">{ck.learnerName}</h4>
                      <span className="text-[11px] text-indigo-400 font-mono">Day {ck.day} • {ck.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                        {ck.hoursSpent} hrs
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                        {ck.confidenceRating}/5 Confidence
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Topics Practiced:</span>
                    <p className="text-xs text-slate-200 mt-0.5 font-medium">{ck.topicsCovered}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Key Takeaway:</span>
                    <p className="text-xs text-slate-300 mt-0.5 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-750">
                      "{ck.keyTakeaway}"
                    </p>
                  </div>

                  {ck.blockersOrDoubts && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[11px]">Learner Query / Blocker:</span>
                        <span>{ck.blockersOrDoubts}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Grading Weights & Portal Settings (Section 23) */}
      {adminTab === 'settings' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-750">
            <div>
              <h3 className="text-lg font-bold text-white">Dynamic Weighted Scoring Configuration</h3>
              <p className="text-xs text-slate-400">
                Adjust the dynamic formula weights governing the learner Overall Progress and certification eligibility.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Daily Learning Weight</label>
              <input
                type="number"
                value={settings.weights.dailyLearning}
                onChange={e =>
                  updateSettings({
                    ...settings,
                    weights: { ...settings.weights, dailyLearning: Number(e.target.value) }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assignments Weight</label>
              <input
                type="number"
                value={settings.weights.assignments}
                onChange={e =>
                  updateSettings({
                    ...settings,
                    weights: { ...settings.weights, assignments: Number(e.target.value) }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Daily Assessments Weight</label>
              <input
                type="number"
                value={settings.weights.assessments}
                onChange={e =>
                  updateSettings({
                    ...settings,
                    weights: { ...settings.weights, assessments: Number(e.target.value) }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hands-On Labs Weight</label>
              <input
                type="number"
                value={settings.weights.handsOnLabs}
                onChange={e =>
                  updateSettings({
                    ...settings,
                    weights: { ...settings.weights, handsOnLabs: Number(e.target.value) }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Capstone Weight</label>
              <input
                type="number"
                value={settings.weights.capstone}
                onChange={e =>
                  updateSettings({
                    ...settings,
                    weights: { ...settings.weights, capstone: Number(e.target.value) }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Attendance Weight</label>
              <input
                type="number"
                value={settings.weights.attendance}
                onChange={e =>
                  updateSettings({
                    ...settings,
                    weights: { ...settings.weights, attendance: Number(e.target.value) }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-750">
            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minimum Attendance for Certificate (%)
              </label>
              <input
                type="number"
                value={settings.minAttendanceForCert}
                onChange={e =>
                  updateSettings({
                    ...settings,
                    minAttendanceForCert: Number(e.target.value)
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
