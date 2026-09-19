import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Upload,
  Link2,
  Github,
  BarChart,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const { assignments, submissions, currentUser, submitAssignment } = useApp();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(assignments[0]?.id || '');
  const [submissionType, setSubmissionType] = useState<'text' | 'github' | 'powerbi' | 'url'>('github');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId) || assignments[0];
  const userSubmission = submissions.find(
    s => s.assignmentId === selectedAssignment?.id && s.learnerId === currentUser?.uid
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !url.trim()) return;
    submitAssignment(selectedAssignment.id, submissionType, content, url);
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Commercial Deliverables Portfolio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Assignments & Practical Submissions
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Submit your code, notebooks, Power BI reports, and executive summaries for instructor grading and rubric feedback.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-750 shrink-0">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Cleared</p>
              <p className="text-xl font-extrabold text-white">
                {submissions.filter(s => s.learnerId === currentUser?.uid).length} / 12
              </p>
            </div>
            <div className="w-px h-8 bg-slate-750" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Avg Score</p>
              <p className="text-xl font-extrabold text-emerald-400">89%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Assignment List (Left) + Submission & Details Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 12 Assignments List */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">12 Workshop Tasks:</p>
          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {assignments.map(item => {
              const isSelected = selectedAssignment?.id === item.id;
              const sub = submissions.find(s => s.assignmentId === item.id && s.learnerId === currentUser?.uid);
              let badge = 'Not Started';
              let badgeColor = 'text-slate-400 bg-slate-800 border-slate-700';

              if (sub?.status === 'evaluated') {
                badge = `Graded (${sub.marks}/100)`;
                badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
              } else if (sub?.status === 'submitted') {
                badge = 'Submitted';
                badgeColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedAssignmentId(item.id);
                    setContent(sub?.content || '');
                    setUrl(sub?.url || '');
                  }}
                  className={`p-4 rounded-2xl border transition text-left cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md'
                      : 'bg-slate-800/50 border-slate-750 hover:border-slate-650'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-indigo-400 font-bold">DAY {item.day}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                      {badge}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-100 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{item.businessScenario}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Assignment Workspace (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAssignment && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-700/80 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-750">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      DAY {selectedAssignment.day} ASSIGNMENT
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Max Marks: {selectedAssignment.maxMarks}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {selectedAssignment.title}
                  </h2>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Deadline: <span className="text-slate-200">{selectedAssignment.deadline}</span>
                </div>
              </div>

              {/* Business Scenario & Task Brief */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Business Problem & Deliverables:
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-750">
                  {selectedAssignment.businessScenario}
                </p>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-750 text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                  {selectedAssignment.tasks}
                </div>
              </div>

              {/* Submission Form / Status */}
              <div className="pt-2 border-t border-slate-750 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Send className="w-4 h-4 text-indigo-400" /> Deliverable Submission Portal
                  </h4>
                  {userSubmission && (
                    <span className="text-xs text-emerald-400 font-mono">
                      Status: {userSubmission.status.toUpperCase()} ({userSubmission.marks ? `${userSubmission.marks}/100` : 'Pending evaluation'})
                    </span>
                  )}
                </div>

                {userSubmission?.feedback && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                    <p className="font-bold text-white">Instructor Evaluation Feedback:</p>
                    <p>{userSubmission.feedback}</p>
                  </div>
                )}

                {submittedSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Deliverable successfully logged! Instructor notification dispatched.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Submission Modality Selector */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSubmissionType('github')}
                      className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                        submissionType === 'github'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <Github className="w-3.5 h-3.5" /> GitHub Repo / Gist
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmissionType('powerbi')}
                      className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                        submissionType === 'powerbi'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <BarChart className="w-3.5 h-3.5" /> Power BI Service URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmissionType('url')}
                      className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                        submissionType === 'url'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" /> Cloud Drive / Sheet Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmissionType('text')}
                      className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                        submissionType === 'text'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" /> SQL Code / Executive Text
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Deliverable Asset Link (GitHub / Colab / Power BI / Drive):
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                      placeholder="https://github.com/username/analytics-day-assignment or https://app.powerbi.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Executive Summary / SQL Queries / Findings Description:
                    </label>
                    <textarea
                      rows={5}
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      placeholder="Detail your findings, paste key SQL statements, DAX measures or Python logic, and provide stakeholder recommendations..."
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      Allowed file types & URLs: .sql, .pbix, .ipynb, .xlsx, GitHub, Google Drive.
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{userSubmission ? 'Update Submission' : 'Submit Assignment'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
