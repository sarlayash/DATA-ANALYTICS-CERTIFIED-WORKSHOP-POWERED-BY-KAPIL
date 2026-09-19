import React from 'react';
import { useApp } from '../context/AppContext';
import { CURRICULUM_DAYS } from '../data/curriculumData';
import { DEMO_LEARNERS } from '../data/initialData';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Database,
  LineChart,
  Code2,
  Table,
  FileSpreadsheet,
  Award,
  Layers,
  ShieldAlert,
  Users,
  Compass,
  Briefcase
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginWithGoogle, setIsAdminLoginOpen, setActiveView, setSelectedDay } = useApp();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-25">
          <div className="w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>POWERED BY KAPIL • ENTERPRISE LEARNING EXPERIENCE PLATFORM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          DATA ANALYTICS
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">
            JOB-ORIENTED CERTIFIED WORKSHOP
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Transform from beginner into an enterprise-ready Data Analytics professional through rigorous, 90% hands-on training built for modern high-performance careers.
        </p>

        {/* 3 Value Pillars */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 text-xs sm:text-sm font-semibold text-slate-300">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>12 DAYS INTENSIVE</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>10% THEORY / 90% HANDS-ON</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>INDUSTRY ORIENTED</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => loginWithGoogle()}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
              <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.6.4-2.4L1.6 7c-.7 1.5-1.1 3.2-1.1 5s.4 3.5 1.1 5l3.7-2.3z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 15.3C3.5 19.1 7.4 23 12 23z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <a
            href="#curriculum-preview"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-semibold text-base border border-slate-700 transition"
          >
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>Explore Program</span>
          </a>
        </div>

        {/* Quick Demo Persona Tester for Evaluators */}
        <div className="mt-12 p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl max-w-3xl mx-auto text-left">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Quick Demo Access (Section 38 Demo Cohort)
            </span>
            <span className="text-[11px] text-indigo-400">1-Click Instant Preview</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DEMO_LEARNERS.map(l => (
              <button
                key={l.uid}
                onClick={() => loginWithGoogle(l)}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-750 hover:border-indigo-500/50 text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <img src={l.photoURL} alt={l.name} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                    {l.name}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                  <span>Day {Math.round((l.overallProgress * 12) / 100)}/12</span>
                  <span className="font-mono text-cyan-400">{l.jobReadinessScore} Score</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mandatory Independent Training Disclaimer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 max-w-2xl mx-auto bg-slate-800/40 p-3 rounded-xl border border-slate-800">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>IMPORTANT NOTICE:</strong> This is an independent training platform. Do NOT claim affiliation, certification, partnership, endorsement, accreditation, or authorization from any Fortune 500 company.
          </span>
        </div>
      </section>

      {/* Why This Program */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Why This Program?</h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Engineered to bridge the divide between theoretical student coursework and high-impact commercial enterprise analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Full-Stack Modern Tooling</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Master SQL & BigQuery, Python (Pandas/NumPy), Advanced Excel & Power Query, PowerPoint Storytelling, and Power BI DAX.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">100% Career & Job Oriented</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Every day links directly to real role expectations: Data Analyst, Business Analyst, BI Specialist, and Reporting Analyst.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Verified Credential & Portfolio</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Complete the 8-stage Capstone, clear verifiable attendance & assessments, and obtain an authenticated Certificate of Completion.
            </p>
          </div>
        </div>
      </section>

      {/* 12-Day Curriculum Preview */}
      <section id="curriculum-preview" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Curriculum Matrix</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">12-Day Progressive Syllabus</h2>
          </div>
          <p className="text-xs text-slate-400 sm:text-right max-w-md">
            10% Theory • 90% Hands-On Exercises • Industry Datasets & Case Studies
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM_DAYS.map(day => (
            <div
              key={day.day}
              className="p-5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-750 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    DAY {day.day}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[150px]">{day.domain}</span>
                </div>
                <h4 className="font-bold text-slate-100 group-hover:text-cyan-300 transition text-sm sm:text-base">
                  {day.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {day.learningObjective}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-750 flex items-center justify-between text-xs">
                <span className="text-slate-400">{day.handsOnLab.title.split(':')[0]}</span>
                <button
                  onClick={() => {
                    setSelectedDay(day.day);
                    setActiveView('curriculum');
                  }}
                  className="text-indigo-400 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Capstone & Certification Highlight */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Major Capstone Project</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              DATA ANALYTICS BUSINESS INTELLIGENCE CAPSTONE
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Integrate the entire data stack in an executive 8-stage pipeline: Problem Definition → Data Understanding → Data Cleaning → SQL Analysis → Python Analysis → Excel Analysis → Power BI Dashboard → Business Insights & Executive Presentation.
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Submit SQL queries, Python notebooks, Power BI URL, and Executive deck</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instructor evaluation with personalized rubric feedback and score</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Adds directly to your professional portfolio for job interviews</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <span className="font-bold text-slate-100 text-sm">Certificate of Completion</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                VERIFIABLE
              </span>
            </div>
            <div className="py-4 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-white">Requirements to Qualify:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Minimum 80% attendance rate across 12 live sessions</li>
                <li>100% completion of daily learning modules</li>
                <li>Passing score on quizzes and assessments</li>
                <li>Submission of the Business Intelligence Capstone</li>
              </ul>
            </div>
            <div className="pt-3 border-t border-slate-750 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Sample ID: SY-DA-2026-0001</span>
              <span>QR Code Authenticated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 pt-8 pb-12 border-t border-slate-800 max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
        <p className="mb-2 font-medium text-slate-400">
          12-Day Job-Oriented Data Analytics Certified Workshop • Powered by Kapil
        </p>
        <p className="max-w-2xl mx-auto text-[11px] text-slate-500">
          Independent training platform for professional workforce capability building. This platform does not imply accreditation, sponsorship, or licensing from any Fortune 500 company.
        </p>
      </footer>
    </div>
  );
};
