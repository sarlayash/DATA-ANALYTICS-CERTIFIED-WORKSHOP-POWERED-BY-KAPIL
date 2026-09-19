import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  FileText,
  CheckSquare,
  Grid3X3,
  TrendingUp,
  Briefcase,
  Award,
  UserCheck,
  Trophy,
  BarChart3,
  Users,
  CalendarCheck,
  Megaphone,
  Sliders,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC<{ collapsed?: boolean; setCollapsed?: (c: boolean) => void }> = ({
  collapsed: propCollapsed,
  setCollapsed: propSetCollapsed
}) => {
  const [localCollapsed, setLocalCollapsed] = React.useState(false);
  const collapsed = propCollapsed !== undefined ? propCollapsed : localCollapsed;
  const setCollapsed = propSetCollapsed || setLocalCollapsed;

  const { currentUser, activeView, setActiveView, setIsAiDrawerOpen } = useApp();

  const learnerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'curriculum', label: '12-Day Curriculum', icon: BookOpen },
    { id: 'labs', label: 'Hands-On Labs', icon: FlaskConical },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'assessments', label: 'Assessments & Quizzes', icon: CheckSquare },
    { id: 'matrix', label: 'Skills Matrix', icon: Grid3X3 },
    { id: 'readiness', label: 'Job Readiness', icon: TrendingUp },
    { id: 'career', label: 'Career Center', icon: Briefcase },
    { id: 'capstone', label: 'Capstone Project', icon: Award },
    { id: 'certification', label: 'Certification', icon: Award },
    { id: 'portfolio', label: 'My Portfolio', icon: UserCheck },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Analytics', icon: BarChart3 },
    { id: 'admin-learners', label: 'Learners Roster', icon: Users },
    { id: 'admin-attendance', label: 'Attendance Manager', icon: CalendarCheck },
    { id: 'admin-grading', label: 'Assignments Grading', icon: FileText },
    { id: 'admin-announcements', label: 'Announcements', icon: Megaphone },
    { id: 'admin-settings', label: 'Weights & Settings', icon: Sliders }
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Toggle Collapse */}
        <div className="flex items-center justify-between p-3 border-b border-slate-800 text-slate-400">
          {!collapsed && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {currentUser?.role === 'admin' ? 'Administrative Suite' : 'Learner Journey'}
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-slate-800 hover:text-white transition ml-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {currentUser?.role === 'admin' && (
            <div className="mb-4">
              {!collapsed && (
                <p className="px-3 text-[10px] uppercase font-bold text-rose-400 tracking-wider mb-1">
                  Admin Controls
                </p>
              )}
              {adminNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                      isActive
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
              <div className="my-3 border-t border-slate-800" />
            </div>
          )}

          {!collapsed && currentUser?.role === 'admin' && (
            <p className="px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Preview Learner Views
            </p>
          )}

          {learnerNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/25 text-indigo-200 border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* AI Learning Coach trigger */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 text-cyan-300 hover:bg-indigo-500/20 text-xs font-medium transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
            {!collapsed && <span className="truncate font-semibold">Gemini AI Assistant</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Section 31: Home, Learn, Assignments, Progress, Profile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-lg flex items-center justify-around py-2 px-1">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg ${
            activeView === 'dashboard' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveView('curriculum')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg ${
            activeView === 'curriculum' || activeView === 'labs' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Learn</span>
        </button>

        <button
          onClick={() => setActiveView('assignments')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg ${
            activeView === 'assignments' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Tasks</span>
        </button>

        <button
          onClick={() => setActiveView('readiness')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg ${
            activeView === 'readiness' || activeView === 'skills' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span>Progress</span>
        </button>

        <button
          onClick={() => setActiveView('portfolio')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg ${
            activeView === 'portfolio' || activeView === 'certification' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>
    </>
  );
};
