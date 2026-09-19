import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';

import { LearnerDashboard } from './components/LearnerDashboard';
import { DailyLearningWorkspace } from './components/DailyLearningWorkspace';
import { AssignmentsView } from './components/AssignmentsView';
import { HandsOnLabsView } from './components/HandsOnLabsView';
import { AssessmentsView } from './components/AssessmentsView';
import { SkillMatrixView } from './components/SkillMatrixView';
import { JobReadinessView } from './components/JobReadinessView';
import { CareerCenterView } from './components/CareerCenterView';
import { CapstoneView } from './components/CapstoneView';
import { PortfolioBuilderView } from './components/PortfolioBuilderView';
import { CertificationView } from './components/CertificationView';
import { LeaderboardView } from './components/LeaderboardView';
import { AdminDashboardView } from './components/AdminDashboardView';

const MainAppContent: React.FC = () => {
  const { currentUser, activeView, setActiveView, setCurrentVerifyingCertId } = useApp();

  // Listen to URL query params for public certificate verification e.g. ?verify=SY-DA-2026-0001
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verifyId = urlParams.get('verify');
    if (verifyId) {
      setCurrentVerifyingCertId(verifyId);
      setActiveView('certification');
    }
  }, [setCurrentVerifyingCertId, setActiveView]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <LandingPage />
        <AdminLoginModal />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <LearnerDashboard />;
      case 'curriculum':
        return <DailyLearningWorkspace />;
      case 'assignments':
        return <AssignmentsView />;
      case 'labs':
        return <HandsOnLabsView />;
      case 'assessments':
        return <AssessmentsView />;
      case 'matrix':
        return <SkillMatrixView />;
      case 'readiness':
        return <JobReadinessView />;
      case 'career':
        return <CareerCenterView />;
      case 'capstone':
        return <CapstoneView />;
      case 'portfolio':
        return <PortfolioBuilderView />;
      case 'certification':
        return <CertificationView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'admin':
      case 'admin-overview':
      case 'admin-learners':
      case 'admin-attendance':
      case 'admin-grading':
      case 'admin-checkins':
      case 'admin-announcements':
      case 'admin-settings':
        return <AdminDashboardView />;
      default:
        return <LearnerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Fixed / Sticky Navigation Bar */}
      <Navbar />

      {/* Main Structural Layout: Sidebar + Scrollable View Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6 relative">
        {/* Responsive Desktop/Tablet Sidebar (Hidden on small screens) */}
        <Sidebar />

        {/* Dynamic Center View Container */}
        <main className="flex-1 min-w-0 w-full overflow-hidden pb-16 md:pb-6">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & AI Coach Assistant Drawer */}
      <AdminLoginModal />
      <AIAssistantDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
