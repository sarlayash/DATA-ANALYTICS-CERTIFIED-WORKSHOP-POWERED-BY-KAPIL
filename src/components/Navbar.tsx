import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './UserAvatar';
import {
  GraduationCap,
  Sparkles,
  Bell,
  ShieldCheck,
  User,
  LogOut,
  Database,
  Menu,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    learners,
    logout,
    loginWithGoogle,
    isAuthLoading,
    authError,
    clearAuthError,
    setIsAdminLoginOpen,
    setIsAiDrawerOpen,
    activeView,
    setActiveView,
    switchUser,
    notifications,
    settings
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView(currentUser ? 'dashboard' : 'landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-tight text-base sm:text-lg">
                DATA ANALYTICS
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                12-Day Certified
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Powered by Kapil • Enterprise Learning Experience
            </p>
          </div>
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Button */}
          <button
            id="btn-open-ai-assistant"
            onClick={() => setIsAiDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors cursor-pointer"
            title="Open Gemini AI Learning Coach"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="hidden md:inline">AI Coach</span>
          </button>

          {currentUser ? (
            <>
              {/* Notification Center */}
              <div className="relative">
                <button
                  id="btn-notifications-toggle"
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
                      <span className="font-semibold text-slate-200">Notifications</span>
                      <span className="text-[11px] text-slate-400">{notifications.length} updates</span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="p-2 rounded bg-slate-900/60 border border-slate-750">
                          <p className="font-medium text-slate-200">{n.title}</p>
                          <p className="text-slate-400 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{n.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Persona & Role Selector */}
              <div className="relative">
                <button
                  id="btn-user-profile-menu"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 transition cursor-pointer"
                >
                  <UserAvatar
                    src={currentUser.photoURL || currentUser.profilePhoto}
                    name={currentUser.name}
                    size="sm"
                    showBorder
                  />
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-semibold text-slate-200 leading-tight flex items-center gap-1.5">
                      {currentUser.name}
                      {currentUser.role === 'admin' ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          ADMIN
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          LEARNER
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[120px]">{currentUser.email}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-700 mb-2 flex items-center gap-3">
                      <UserAvatar
                        src={currentUser.photoURL || currentUser.profilePhoto}
                        name={currentUser.name}
                        size="md"
                        showBorder
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-100 truncate">{currentUser.name}</p>
                        <p className="text-xs text-indigo-400 font-mono">{currentUser.role.toUpperCase()}</p>
                      </div>
                    </div>

                    {learners.length > 1 && (
                      <div className="px-2 py-1 mb-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                          Enrolled Cohort Members ({learners.length})
                        </p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {learners.map(l => (
                            <button
                              key={l.uid}
                              onClick={() => {
                                switchUser(l.uid);
                                setShowUserMenu(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                                currentUser.uid === l.uid ? 'bg-indigo-600/30 text-indigo-200 font-medium' : 'text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <UserAvatar src={l.photoURL || l.profilePhoto} name={l.name} size="xs" />
                                <span className="truncate">{l.name}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0 ml-2">{l.overallProgress}%</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-slate-700 pt-1">
                      {currentUser.role !== 'admin' && (
                        <button
                          onClick={() => {
                            setIsAdminLoginOpen(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-amber-300 hover:bg-slate-700 rounded-lg flex items-center gap-2 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Portal</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-slate-700 rounded-lg flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-admin-login-trigger"
                onClick={() => setIsAdminLoginOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
              >
                Admin
              </button>
              <button
                id="btn-google-login"
                onClick={() => loginWithGoogle()}
                disabled={isAuthLoading}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                {isAuthLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                      <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.6.4-2.4L1.6 7c-.7 1.5-1.1 3.2-1.1 5s.4 3.5 1.1 5l3.7-2.3z" />
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 15.3C3.5 19.1 7.4 23 12 23z" />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
