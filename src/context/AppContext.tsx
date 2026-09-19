import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  CurriculumDay,
  Assignment,
  AssignmentSubmission,
  AttendanceRecord,
  SkillItem,
  CapstoneSubmission,
  CertificateRecord,
  Announcement,
  PortalNotification,
  PortalSettings,
  AttendanceStatus,
  SkillProficiency,
  DailyCheckinRecord,
  CloudSyncStatus
} from '../types';
import { CURRICULUM_DAYS } from '../data/curriculumData';
import {
  DEMO_LEARNERS,
  INITIAL_SKILLS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SETTINGS,
  INITIAL_ATTENDANCE,
  INITIAL_SUBMISSIONS
} from '../data/initialData';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot
} from 'firebase/firestore';

interface AppContextType {
  currentUser: UserProfile | null;
  learners: UserProfile[];
  curriculum: CurriculumDay[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  attendance: AttendanceRecord[];
  skills: SkillItem[];
  capstone: CapstoneSubmission | null;
  certificates: CertificateRecord[];
  announcements: Announcement[];
  notifications: PortalNotification[];
  settings: PortalSettings;
  activeView: string;
  selectedDay: number;
  isProfileSetupOpen: boolean;
  isAdminLoginOpen: boolean;
  isFirebaseSetupOpen: boolean;
  isAiDrawerOpen: boolean;
  currentVerifyingCertId: string | null;

  // Firebase Firestore Check-ins & Cloud Status
  checkins: DailyCheckinRecord[];
  cloudSyncStatus: CloudSyncStatus;
  submitCheckin: (checkinData: Omit<DailyCheckinRecord, 'id' | 'learnerId' | 'learnerName' | 'date' | 'status' | 'timestamp'>) => Promise<void>;
  syncFromCloud: () => Promise<void>;

  // Actions
  setActiveView: (view: string) => void;
  setSelectedDay: (day: number) => void;
  setIsProfileSetupOpen: (open: boolean) => void;
  setIsAdminLoginOpen: (open: boolean) => void;
  setIsFirebaseSetupOpen: (open: boolean) => void;
  setIsAiDrawerOpen: (open: boolean) => void;
  setCurrentVerifyingCertId: (id: string | null) => void;

  loginWithGoogle: (demoUser?: UserProfile) => void;
  loginAsAdmin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  completeProfileSetup: (profileData: Partial<UserProfile>) => void;
  switchUser: (uid: string) => void;

  // Learner Actions
  markDayComplete: (day: number) => void;
  completedDays: number[];
  submitQuizResult: (day: number, score: number, maxScore: number) => void;
  submitAssignment: (assignmentId: string, type: string, content: string, url?: string) => void;
  submitCapstone: (capstoneData: Partial<CapstoneSubmission>) => void;
  updateSkillLevel: (skillId: string, level: SkillProficiency) => void;

  // Admin Actions
  markAttendance: (learnerId: string, day: number, status: AttendanceStatus) => void;
  gradeAssignment: (submissionId: string, marks: number, feedback: string) => void;
  gradeCapstone: (learnerId: string, score: number, feedback: string) => void;
  issueCertificate: (learnerId: string) => CertificateRecord;
  revokeCertificate: (certId: string) => void;
  addAnnouncement: (title: string, content: string, category: any, pinned: boolean) => void;
  updateSettings: (newSettings: PortalSettings) => void;
  exportCSV: (type: 'learners' | 'attendance' | 'assessments' | 'assignments' | 'progress' | 'certificates' | 'readiness') => void;

  // Dynamic Metrics
  calculateAttendancePercent: (learnerId: string) => number;
  calculateOverallProgress: (learnerId: string) => number;
  calculateJobReadiness: (learnerId: string) => {
    score: number;
    breakdown: {
      sql: number;
      python: number;
      excel: number;
      powerBi: number;
      visualization: number;
      businessCommunication: number;
      capstone: number;
    };
  };
  checkCertificateEligibility: (learnerId: string) => {
    eligible: boolean;
    reasons: string[];
    attendanceMet: boolean;
    modulesMet: boolean;
    assessmentsMet: boolean;
    capstoneMet: boolean;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults with automatic data migration (clean legacy demo_ prefixes)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('da_current_user');
    if (saved) {
      const user = JSON.parse(saved);
      if (user?.uid?.startsWith('demo_')) {
        user.uid = user.uid.replace(/^demo_/, 'learner_');
      }
      return user;
    }
    return DEMO_LEARNERS[0]; // Start logged in with Aarav Sharma for immediate preview
  });

  const [learners, setLearners] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('da_learners');
    if (saved) {
      const list: UserProfile[] = JSON.parse(saved);
      // If list has stale demo_ IDs, migrate them
      let migrated = false;
      const updated = list.map(l => {
        if (l.uid.startsWith('demo_')) {
          migrated = true;
          return { ...l, uid: l.uid.replace(/^demo_/, 'learner_') };
        }
        return l;
      });
      if (migrated) {
        localStorage.setItem('da_learners', JSON.stringify(updated));
        return updated;
      }
      return list;
    }
    return DEMO_LEARNERS;
  });

  const [curriculum, setCurriculum] = useState<CurriculumDay[]>(CURRICULUM_DAYS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem('da_submissions');
    if (saved) {
      const list: AssignmentSubmission[] = JSON.parse(saved);
      let migrated = false;
      const updated = list.map(s => {
        if (s.learnerId.startsWith('demo_')) {
          migrated = true;
          return { ...s, learnerId: s.learnerId.replace(/^demo_/, 'learner_') };
        }
        return s;
      });
      if (migrated) {
        localStorage.setItem('da_submissions', JSON.stringify(updated));
        return updated;
      }
      return list;
    }
    return INITIAL_SUBMISSIONS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('da_attendance');
    if (saved) {
      const list: AttendanceRecord[] = JSON.parse(saved);
      let migrated = false;
      const updated = list.map(a => {
        if (a.learnerId.startsWith('demo_')) {
          migrated = true;
          return { ...a, learnerId: a.learnerId.replace(/^demo_/, 'learner_') };
        }
        return a;
      });
      if (migrated) {
        localStorage.setItem('da_attendance', JSON.stringify(updated));
        return updated;
      }
      return list;
    }
    return INITIAL_ATTENDANCE;
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    const saved = localStorage.getItem('da_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('da_completed_days');
    return saved ? JSON.parse(saved) : [1, 2, 3, 4, 5, 6, 7];
  });

  const [capstone, setCapstone] = useState<CapstoneSubmission | null>(() => {
    const saved = localStorage.getItem('da_capstone');
    return saved ? JSON.parse(saved) : null;
  });

  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => {
    const saved = localStorage.getItem('da_certificates');
    if (saved) return JSON.parse(saved);
    return [
      {
        certificateId: 'SY-DA-2026-0001',
        learnerId: 'learner_ananya_singh',
        learnerName: 'Ananya Singh',
        courseName: '12-Day Job-Oriented Data Analytics Certified Workshop Powered by Kapil',
        duration: '12 Days (Hands-On + Industry Oriented)',
        completionDate: '2026-03-18',
        verificationUrl: '/verify/SY-DA-2026-0001',
        status: 'VALID',
        signerName: 'Kapil Narula',
        signerTitle: 'Lead Analytics Instructor & Platform Director',
        skillsCertified: ['SQL', 'BigQuery', 'Python', 'Pandas', 'Excel', 'Power BI', 'DAX', 'Storytelling', 'GenAI']
      }
    ];
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('da_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<PortalNotification[]>([
    {
      id: 'notif-1',
      title: 'Day 8 Assignment Available',
      message: 'Automated Multi-Store ETL in Power Query has been published.',
      timestamp: '2 hours ago',
      type: 'assignment',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Feedback Received',
      message: 'Your Day 2 SQL reconciliation assignment received 88/100.',
      timestamp: '1 day ago',
      type: 'feedback',
      read: true
    }
  ]);

  const [settings, setSettings] = useState<PortalSettings>(() => {
    const saved = localStorage.getItem('da_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Daily Check-ins State
  const [checkins, setCheckins] = useState<DailyCheckinRecord[]>(() => {
    const saved = localStorage.getItem('da_checkins');
    return saved ? JSON.parse(saved) : [];
  });
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('synced');

  // UI Navigation & Modals State
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isFirebaseSetupOpen, setIsFirebaseSetupOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [currentVerifyingCertId, setCurrentVerifyingCertId] = useState<string | null>(null);

  // Firestore Real-time Sync for Checkins
  useEffect(() => {
    try {
      const checkinsCol = collection(db, 'checkins');
      const unsubscribe = onSnapshot(
        checkinsCol,
        snapshot => {
          const remoteCheckins: DailyCheckinRecord[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            remoteCheckins.push({
              id: docSnap.id,
              learnerId: data.learnerId,
              learnerName: data.learnerName,
              day: data.day,
              date: data.date,
              topicsCovered: data.topicsCovered,
              keyTakeaway: data.keyTakeaway,
              hoursSpent: data.hoursSpent,
              confidenceRating: data.confidenceRating,
              blockersOrDoubts: data.blockersOrDoubts,
              status: data.status || 'submitted',
              timestamp: data.timestamp
            });
          });

          if (remoteCheckins.length > 0) {
            setCheckins(prev => {
              // Merge remote and local by id
              const map = new Map<string, DailyCheckinRecord>();
              prev.forEach(item => map.set(item.id, item));
              remoteCheckins.forEach(item => map.set(item.id, item));
              const merged = Array.from(map.values()).sort((a, b) => b.day - a.day);
              localStorage.setItem('da_checkins', JSON.stringify(merged));
              return merged;
            });
            setCloudSyncStatus('synced');
          }
        },
        error => {
          console.warn('Firestore real-time subscription notice:', error.message);
          setCloudSyncStatus('offline');
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.warn('Firestore checkins init note:', err.message);
    }
  }, []);

  const syncFromCloud = async () => {
    setCloudSyncStatus('syncing');
    try {
      const checkinsCol = collection(db, 'checkins');
      const snapshot = await getDocs(checkinsCol);
      const remoteCheckins: DailyCheckinRecord[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        remoteCheckins.push({
          id: docSnap.id,
          learnerId: data.learnerId,
          learnerName: data.learnerName,
          day: data.day,
          date: data.date,
          topicsCovered: data.topicsCovered,
          keyTakeaway: data.keyTakeaway,
          hoursSpent: data.hoursSpent,
          confidenceRating: data.confidenceRating,
          blockersOrDoubts: data.blockersOrDoubts,
          status: data.status || 'submitted',
          timestamp: data.timestamp
        });
      });

      if (remoteCheckins.length > 0) {
        setCheckins(prev => {
          const map = new Map<string, DailyCheckinRecord>();
          prev.forEach(item => map.set(item.id, item));
          remoteCheckins.forEach(item => map.set(item.id, item));
          const merged = Array.from(map.values()).sort((a, b) => b.day - a.day);
          localStorage.setItem('da_checkins', JSON.stringify(merged));
          return merged;
        });
      }
      setCloudSyncStatus('synced');
    } catch (err: any) {
      console.warn('Manual cloud sync note:', err.message);
      setCloudSyncStatus('offline');
    }
  };

  const submitCheckin = async (
    checkinData: Omit<DailyCheckinRecord, 'id' | 'learnerId' | 'learnerName' | 'date' | 'status' | 'timestamp'>
  ) => {
    const learnerId = currentUser?.uid || 'learner_aarav_sharma';
    const learnerName = currentUser?.name || 'Aarav Sharma';
    const checkinId = `checkin_${learnerId}_day_${checkinData.day}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const timestampStr = new Date().toISOString();

    const record: DailyCheckinRecord = {
      id: checkinId,
      learnerId,
      learnerName,
      day: checkinData.day,
      date: dateStr,
      topicsCovered: checkinData.topicsCovered,
      keyTakeaway: checkinData.keyTakeaway,
      hoursSpent: checkinData.hoursSpent,
      confidenceRating: checkinData.confidenceRating,
      blockersOrDoubts: checkinData.blockersOrDoubts,
      status: 'submitted',
      timestamp: timestampStr
    };

    // Update local state and localStorage immediately
    setCheckins(prev => {
      const filtered = prev.filter(c => c.id !== checkinId);
      const updated = [record, ...filtered];
      localStorage.setItem('da_checkins', JSON.stringify(updated));
      return updated;
    });

    // Persist to Firebase Firestore
    setCloudSyncStatus('syncing');
    try {
      const docRef = doc(db, 'checkins', checkinId);
      await setDoc(docRef, {
        learnerId,
        learnerName,
        day: checkinData.day,
        date: dateStr,
        topicsCovered: checkinData.topicsCovered,
        keyTakeaway: checkinData.keyTakeaway,
        hoursSpent: checkinData.hoursSpent,
        confidenceRating: checkinData.confidenceRating,
        blockersOrDoubts: checkinData.blockersOrDoubts || '',
        status: 'submitted',
        timestamp: timestampStr
      }, { merge: true });

      setCloudSyncStatus('synced');
    } catch (err: any) {
      console.warn('Firestore setDoc checkin note (saved locally):', err.message);
      setCloudSyncStatus('offline');
    }
  };

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('da_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('da_learners', JSON.stringify(learners));
  }, [learners]);

  useEffect(() => {
    localStorage.setItem('da_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('da_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('da_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('da_completed_days', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem('da_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('da_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('da_settings', JSON.stringify(settings));
  }, [settings]);

  // Calculations
  const calculateAttendancePercent = (learnerId: string): number => {
    const records = attendance.filter(a => a.learnerId === learnerId);
    if (records.length === 0) return 100;
    const score = records.reduce((acc, r) => {
      if (r.status === 'present') return acc + 1;
      if (r.status === 'late') return acc + 0.5;
      return acc;
    }, 0);
    return Math.min(100, Math.round((score / 12) * 100));
  };

  const calculateOverallProgress = (learnerId: string): number => {
    const isCurrentUser = currentUser?.uid === learnerId;
    const daysDone = isCurrentUser ? completedDays.length : (learners.find(l => l.uid === learnerId)?.overallProgress ? Math.round((learners.find(l => l.uid === learnerId)!.overallProgress * 12) / 100) : 6);
    const learnerSubs = submissions.filter(s => s.learnerId === learnerId);
    const subRate = Math.min(100, (learnerSubs.length / 12) * 100);
    const attRate = calculateAttendancePercent(learnerId);

    const w = settings.weights;
    const totalWeights = w.dailyLearning + w.assignments + w.assessments + w.handsOnLabs + w.capstone + w.attendance;

    const dailyScore = (daysDone / 12) * 100;
    const labScore = (daysDone / 12) * 100;
    const assessmentScore = (daysDone / 12) * 90;
    const capstoneScore = capstone?.status === 'submitted' || capstone?.status === 'evaluated' ? 100 : (daysDone >= 11 ? 50 : 0);

    const weighted =
      (dailyScore * w.dailyLearning +
        subRate * w.assignments +
        assessmentScore * w.assessments +
        labScore * w.handsOnLabs +
        capstoneScore * w.capstone +
        attRate * w.attendance) / totalWeights;

    return Math.min(100, Math.round(weighted));
  };

  const calculateJobReadiness = (learnerId: string) => {
    // Component breakdown: SQL, Python, Excel, Power BI, Visualization, Business Communication, Capstone
    const att = calculateAttendancePercent(learnerId);
    const daysDone = currentUser?.uid === learnerId ? completedDays.length : 8;
    const learnerSubs = submissions.filter(s => s.learnerId === learnerId);

    const sqlScore = Math.min(100, Math.round(75 + (daysDone >= 3 ? 12 : 0) + (learnerSubs.some(s => s.day === 2) ? 8 : 0)));
    const pythonScore = Math.min(100, Math.round(70 + (daysDone >= 6 ? 16 : 0) + (learnerSubs.some(s => s.day === 5) ? 7 : 0)));
    const excelScore = Math.min(100, Math.round(80 + (daysDone >= 8 ? 14 : 0) + (learnerSubs.some(s => s.day === 7) ? 5 : 0)));
    const powerBiScore = Math.min(100, Math.round(65 + (daysDone >= 10 ? 18 : 0) + (learnerSubs.some(s => s.day === 10) ? 8 : 0)));
    const visualizationScore = Math.min(100, Math.round(72 + (daysDone >= 11 ? 16 : 0)));
    const businessCommunicationScore = Math.min(100, Math.round(78 + (daysDone >= 9 ? 12 : 0)));
    const capstoneScore = capstone?.status === 'evaluated' ? (capstone.score || 90) : (capstone?.status === 'submitted' ? 85 : (daysDone === 12 ? 60 : 40));

    const overall = Math.round(
      sqlScore * 0.20 +
      pythonScore * 0.20 +
      excelScore * 0.15 +
      powerBiScore * 0.15 +
      visualizationScore * 0.10 +
      businessCommunicationScore * 0.10 +
      capstoneScore * 0.10
    );

    return {
      score: Math.min(100, overall),
      breakdown: {
        sql: sqlScore,
        python: pythonScore,
        excel: excelScore,
        powerBi: powerBiScore,
        visualization: visualizationScore,
        businessCommunication: businessCommunicationScore,
        capstone: capstoneScore
      }
    };
  };

  const checkCertificateEligibility = (learnerId: string) => {
    const att = calculateAttendancePercent(learnerId);
    const isCurrentUser = currentUser?.uid === learnerId;
    const daysDone = isCurrentUser ? completedDays.length : 12;
    const attendanceMet = att >= settings.minAttendanceForCert;
    const modulesMet = daysDone >= 12;
    const assessmentsMet = daysDone >= 10;
    const capstoneMet = isCurrentUser ? (capstone?.status === 'submitted' || capstone?.status === 'evaluated') : true;

    const reasons: string[] = [];
    if (!attendanceMet) reasons.push(`Attendance is ${att}%, minimum required is ${settings.minAttendanceForCert}%.`);
    if (!modulesMet) reasons.push(`Completed ${daysDone}/12 daily learning modules.`);
    if (!assessmentsMet) reasons.push(`Daily quizzes and assessments must be cleared.`);
    if (!capstoneMet) reasons.push(`Final Business Intelligence Capstone must be submitted.`);

    return {
      eligible: attendanceMet && modulesMet && assessmentsMet && capstoneMet,
      reasons,
      attendanceMet,
      modulesMet,
      assessmentsMet,
      capstoneMet
    };
  };

  // Auth Handlers
  const loginWithGoogle = (demoUser?: UserProfile) => {
    if (demoUser) {
      setCurrentUser(demoUser);
      setActiveView('dashboard');
      return;
    }
    // New user profile onboarding
    setIsProfileSetupOpen(true);
  };

  const completeProfileSetup = (profileData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      uid: 'user_' + Date.now(),
      name: profileData.name || 'New Learner',
      email: profileData.email || 'learner@example.com',
      photoURL: profileData.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'learner',
      phone: profileData.phone || '',
      college: profileData.college || '',
      course: profileData.course || '',
      graduationYear: profileData.graduationYear || '',
      experienceLevel: profileData.experienceLevel || '',
      careerGoal: profileData.careerGoal || '',
      city: profileData.city || '',
      linkedin: profileData.linkedin || '',
      github: profileData.github || '',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      overallProgress: 0,
      jobReadinessScore: 65,
      certificateStatus: 'not_started',
      isDemo: false
    };

    setLearners(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCompletedDays([1]); // First day accessible
    setIsProfileSetupOpen(false);
    setActiveView('dashboard');
  };

  const loginAsAdmin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const adminUser: UserProfile = {
          uid: 'admin_kapil',
          name: data.user.name || 'Kapil Narula (Admin)',
          email: data.user.email || 'kapiladmin@analyticsmastery.internal',
          role: 'admin',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          overallProgress: 100,
          jobReadinessScore: 100,
          certificateStatus: 'issued'
        };
        setCurrentUser(adminUser);
        setIsAdminLoginOpen(false);
        setActiveView('admin');
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch (err: any) {
      // Fallback for offline/preview mode if network fails
      if (username === 'kapiladmin' && password === 'admin123') {
        const adminUser: UserProfile = {
          uid: 'admin_kapil',
          name: 'Kapil Narula (Instructor & Admin)',
          email: 'kapiladmin@analyticsmastery.internal',
          role: 'admin',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          overallProgress: 100,
          jobReadinessScore: 100,
          certificateStatus: 'issued'
        };
        setCurrentUser(adminUser);
        setIsAdminLoginOpen(false);
        setActiveView('admin');
        return { success: true };
      }
      return { success: false, error: 'Invalid admin username or password' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('landing');
  };

  const switchUser = (uid: string) => {
    const user = learners.find(l => l.uid === uid);
    if (user) {
      setCurrentUser(user);
    }
  };

  const markDayComplete = (day: number) => {
    if (!completedDays.includes(day)) {
      setCompletedDays(prev => [...prev, day].sort((a, b) => a - b));
    }
    // Update current user progress
    if (currentUser && currentUser.role === 'learner') {
      const updatedProg = Math.min(100, Math.round(((completedDays.length + 1) / 12) * 100));
      setCurrentUser(prev => prev ? { ...prev, overallProgress: updatedProg } : null);
    }
  };

  const submitQuizResult = (day: number, score: number, maxScore: number) => {
    if (score >= maxScore * 0.7) {
      markDayComplete(day);
    }
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: `Day ${day} Quiz Result`,
        message: `You scored ${score}/${maxScore} (${Math.round((score / maxScore) * 100)}%).`,
        timestamp: 'Just now',
        type: 'assessment',
        read: false
      },
      ...prev
    ]);
  };

  const submitAssignment = (assignmentId: string, type: string, content: string, url?: string) => {
    const newSub: AssignmentSubmission = {
      id: 'sub_' + Date.now(),
      assignmentId,
      learnerId: currentUser?.uid || 'anonymous',
      learnerName: currentUser?.name || 'Learner',
      day: assignments.find(a => a.id === assignmentId)?.day || 1,
      submissionType: type,
      content,
      url,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };
    setSubmissions(prev => [newSub, ...prev.filter(s => !(s.assignmentId === assignmentId && s.learnerId === newSub.learnerId))]);
  };

  const gradeAssignment = (submissionId: string, marks: number, feedback: string) => {
    setSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId
          ? { ...s, status: 'evaluated', marks, feedback, evaluatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  const submitCapstone = (capstoneData: Partial<CapstoneSubmission>) => {
    const fullCapstone: CapstoneSubmission = {
      id: 'cap_' + Date.now(),
      learnerId: currentUser?.uid || 'anonymous',
      learnerName: currentUser?.name || 'Learner',
      title: capstoneData.title || 'Data Analytics Business Intelligence Capstone',
      problemStatement: capstoneData.problemStatement || '',
      dataset: capstoneData.dataset || '',
      sqlWork: capstoneData.sqlWork || '',
      pythonNotebookUrl: capstoneData.pythonNotebookUrl || '',
      excelAnalysisNotes: capstoneData.excelAnalysisNotes || '',
      powerBiDashboardUrl: capstoneData.powerBiDashboardUrl || '',
      businessInsights: capstoneData.businessInsights || '',
      presentationUrl: capstoneData.presentationUrl || '',
      githubUrl: capstoneData.githubUrl || '',
      demoUrl: capstoneData.demoUrl || '',
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };
    setCapstone(fullCapstone);
  };

  const gradeCapstone = (learnerId: string, score: number, feedback: string) => {
    if (capstone && capstone.learnerId === learnerId) {
      setCapstone({ ...capstone, status: 'evaluated', score, feedback });
    }
  };

  const updateSkillLevel = (skillId: string, level: SkillProficiency) => {
    setSkills(prev => prev.map(s => s.id === skillId ? { ...s, level } : s));
  };

  const markAttendance = (learnerId: string, day: number, status: AttendanceStatus) => {
    setAttendance(prev => {
      const filtered = prev.filter(a => !(a.learnerId === learnerId && a.day === day));
      const learnerName = learners.find(l => l.uid === learnerId)?.name || 'Learner';
      return [
        ...filtered,
        {
          id: `att_${learnerId}_${day}_${Date.now()}`,
          learnerId,
          learnerName,
          day,
          status,
          markedAt: new Date().toISOString().split('T')[0]
        }
      ];
    });
  };

  const issueCertificate = (learnerId: string): CertificateRecord => {
    const targetLearner = learners.find(l => l.uid === learnerId) || currentUser;
    const certNumber = (certificates.length + 1).toString().padStart(4, '0');
    const newCert: CertificateRecord = {
      certificateId: `SY-DA-2026-${certNumber}`,
      learnerId,
      learnerName: targetLearner?.name || 'Graduate Learner',
      courseName: '12-Day Job-Oriented Data Analytics Certified Workshop Powered by Kapil',
      duration: '12 Days (Hands-On + Industry Oriented)',
      completionDate: new Date().toISOString().split('T')[0],
      verificationUrl: `/verify/SY-DA-2026-${certNumber}`,
      status: 'VALID',
      signerName: 'Kapil Narula',
      signerTitle: 'Lead Analytics Instructor & Platform Director',
      skillsCertified: ['SQL', 'BigQuery', 'Python', 'Pandas', 'Excel', 'Power BI', 'DAX', 'Storytelling', 'GenAI']
    };

    setCertificates(prev => [newCert, ...prev]);

    // Update learner record
    setLearners(prev =>
      prev.map(l =>
        l.uid === learnerId
          ? { ...l, certificateStatus: 'issued', certificateId: newCert.certificateId }
          : l
      )
    );

    if (currentUser?.uid === learnerId) {
      setCurrentUser(prev => prev ? { ...prev, certificateStatus: 'issued', certificateId: newCert.certificateId } : null);
    }

    return newCert;
  };

  const revokeCertificate = (certId: string) => {
    setCertificates(prev => prev.map(c => c.certificateId === certId ? { ...c, status: 'REVOKED' } : c));
  };

  const addAnnouncement = (title: string, content: string, category: any, pinned: boolean) => {
    const newAnn: Announcement = {
      id: 'ann_' + Date.now(),
      title,
      content,
      category,
      authorName: currentUser?.name || 'Kapil Narula (Admin)',
      createdAt: new Date().toISOString(),
      pinned
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const updateSettings = (newSettings: PortalSettings) => {
    setSettings(newSettings);
  };

  // CSV Export utility
  const exportCSV = (type: 'learners' | 'attendance' | 'assessments' | 'assignments' | 'progress' | 'certificates' | 'readiness') => {
    let filename = `data_analytics_workshop_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (type === 'learners') {
      headers = ['UID', 'Name', 'Email', 'Phone', 'College', 'GraduationYear', 'Progress%', 'JobReadinessScore', 'CertificateStatus'];
      rows = learners.map(l => [
        l.uid,
        `"${l.name}"`,
        l.email,
        l.phone || '',
        `"${l.college || ''}"`,
        l.graduationYear || '',
        calculateOverallProgress(l.uid),
        calculateJobReadiness(l.uid).score,
        l.certificateStatus
      ]);
    } else if (type === 'attendance') {
      headers = ['RecordID', 'LearnerName', 'LearnerID', 'Day', 'Status', 'MarkedDate'];
      rows = attendance.map(a => [a.id, `"${a.learnerName}"`, a.learnerId, a.day, a.status, a.markedAt]);
    } else if (type === 'assignments') {
      headers = ['SubmissionID', 'AssignmentID', 'LearnerName', 'Day', 'Type', 'Status', 'Marks', 'SubmittedAt'];
      rows = submissions.map(s => [s.id, s.assignmentId, `"${s.learnerName}"`, s.day, s.submissionType, s.status, s.marks || 0, s.submittedAt]);
    } else if (type === 'certificates') {
      headers = ['CertificateID', 'LearnerName', 'Course', 'CompletionDate', 'Status', 'Signer'];
      rows = certificates.map(c => [c.certificateId, `"${c.learnerName}"`, `"${c.courseName}"`, c.completionDate, c.status, `"${c.signerName}"`]);
    } else if (type === 'readiness') {
      headers = ['LearnerName', 'OverallReadiness', 'SQL', 'Python', 'Excel', 'PowerBI', 'Visualization', 'Communication', 'Capstone'];
      rows = learners.map(l => {
        const r = calculateJobReadiness(l.uid);
        return [
          `"${l.name}"`,
          r.score,
          r.breakdown.sql,
          r.breakdown.python,
          r.breakdown.excel,
          r.breakdown.powerBi,
          r.breakdown.visualization,
          r.breakdown.businessCommunication,
          r.breakdown.capstone
        ];
      });
    } else {
      headers = ['LearnerName', 'OverallProgress%', 'DaysCompleted', 'Attendance%'];
      rows = learners.map(l => [
        `"${l.name}"`,
        calculateOverallProgress(l.uid),
        currentUser?.uid === l.uid ? completedDays.length : 8,
        calculateAttendancePercent(l.uid)
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        learners,
        curriculum,
        assignments,
        submissions,
        attendance,
        skills,
        capstone,
        certificates,
        announcements,
        notifications,
        settings,
        activeView,
        selectedDay,
        isProfileSetupOpen,
        isAdminLoginOpen,
        isFirebaseSetupOpen,
        isAiDrawerOpen,
        currentVerifyingCertId,

        checkins,
        cloudSyncStatus,
        submitCheckin,
        syncFromCloud,

        setActiveView,
        setSelectedDay,
        setIsProfileSetupOpen,
        setIsAdminLoginOpen,
        setIsFirebaseSetupOpen,
        setIsAiDrawerOpen,
        setCurrentVerifyingCertId,

        loginWithGoogle,
        loginAsAdmin,
        logout,
        completeProfileSetup,
        switchUser,

        markDayComplete,
        completedDays,
        submitQuizResult,
        submitAssignment,
        submitCapstone,
        updateSkillLevel,

        markAttendance,
        gradeAssignment,
        gradeCapstone,
        issueCertificate,
        revokeCertificate,
        addAnnouncement,
        updateSettings,
        exportCSV,

        calculateAttendancePercent,
        calculateOverallProgress,
        calculateJobReadiness,
        checkCertificateEligibility
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
