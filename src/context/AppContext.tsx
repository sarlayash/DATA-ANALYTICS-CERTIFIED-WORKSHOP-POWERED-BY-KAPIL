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
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
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
  isAiDrawerOpen: boolean;
  currentVerifyingCertId: string | null;

  // Firebase Auth & Cloud Sync
  isAuthLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  checkins: DailyCheckinRecord[];
  cloudSyncStatus: CloudSyncStatus;
  submitCheckin: (checkinData: Omit<DailyCheckinRecord, 'id' | 'learnerId' | 'learnerName' | 'date' | 'status' | 'timestamp'>) => Promise<void>;
  syncFromCloud: () => Promise<void>;

  // Actions
  setActiveView: (view: string) => void;
  setSelectedDay: (day: number) => void;
  setIsProfileSetupOpen: (open: boolean) => void;
  setIsAdminLoginOpen: (open: boolean) => void;
  setIsAiDrawerOpen: (open: boolean) => void;
  setCurrentVerifyingCertId: (id: string | null) => void;

  loginWithGoogle: (demoUser?: UserProfile) => Promise<void>;
  loginAsAdmin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeProfileSetup: (profileData: Partial<UserProfile>) => void;
  switchUser: (uid: string) => void;

  // Learner Actions
  markDayComplete: (day: number) => void;
  completedDays: number[];
  quizResults: { learnerId: string; day: number; score: number; maxScore: number }[];
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
      try {
        const user = JSON.parse(saved);
        if (
          user &&
          !user.uid?.includes('aarav') &&
          !user.uid?.includes('priya') &&
          !user.uid?.includes('rahul') &&
          !user.uid?.includes('ananya') &&
          !user.uid?.startsWith('demo_')
        ) {
          return user;
        }
      } catch (e) {
        // ignore
      }
    }
    return null; // Start with no logged-in demo user; prompt genuine enrollment or login
  });

  const [learners, setLearners] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('da_learners');
    if (saved) {
      try {
        const list: UserProfile[] = JSON.parse(saved);
        const filtered = list.filter(
          l =>
            !l.uid?.includes('aarav') &&
            !l.uid?.includes('priya') &&
            !l.uid?.includes('rahul') &&
            !l.uid?.includes('ananya') &&
            !l.uid?.startsWith('demo_')
        );
        return filtered;
      } catch (e) {
        return [];
      }
    }
    return []; // Start from 0 learners
  });

  const [curriculum, setCurriculum] = useState<CurriculumDay[]>(CURRICULUM_DAYS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem('da_submissions');
    if (saved) {
      try {
        const list: AssignmentSubmission[] = JSON.parse(saved);
        return list.filter(
          s =>
            !s.learnerId?.includes('aarav') &&
            !s.learnerId?.includes('priya') &&
            !s.learnerId?.startsWith('demo_')
        );
      } catch (e) {
        return [];
      }
    }
    return []; // No fake submissions
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('da_attendance');
    if (saved) {
      try {
        const list: AttendanceRecord[] = JSON.parse(saved);
        return list.filter(
          a =>
            !a.learnerId?.includes('aarav') &&
            !a.learnerId?.includes('priya') &&
            !a.learnerId?.includes('ananya') &&
            !a.learnerId?.startsWith('demo_')
        );
      } catch (e) {
        return [];
      }
    }
    return []; // No fake attendance
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    const saved = localStorage.getItem('da_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('da_completed_days');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clear legacy fake array [1,2,3,4,5,6,7]
        if (Array.isArray(parsed) && parsed.length === 7 && parsed[0] === 1 && parsed[6] === 7) {
          localStorage.removeItem('da_completed_days');
          return [];
        }
        return parsed;
      } catch (e) {
        return [];
      }
    }
    return []; // Starts from Day 1 (0 days completed)
  });

  const [quizResults, setQuizResults] = useState<{ learnerId: string; day: number; score: number; maxScore: number }[]>(() => {
    const saved = localStorage.getItem('da_quiz_results');
    return saved ? JSON.parse(saved) : [];
  });

  const [capstone, setCapstone] = useState<CapstoneSubmission | null>(() => {
    const saved = localStorage.getItem('da_capstone');
    return saved ? JSON.parse(saved) : null;
  });

  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => {
    const saved = localStorage.getItem('da_certificates');
    if (saved) {
      try {
        const list: CertificateRecord[] = JSON.parse(saved);
        return list.filter(c => !c.learnerId?.includes('ananya') && !c.learnerId?.includes('aarav'));
      } catch (e) {
        return [];
      }
    }
    return []; // No fake certificates pre-issued
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('da_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<PortalNotification[]>([
    {
      id: 'notif-welcome',
      title: 'Welcome to Day 1',
      message: 'Welcome to the 12-Day Job-Oriented Data Analytics Certified Workshop! Start Day 1 module.',
      timestamp: 'Just now',
      type: 'announcement',
      read: false
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

  // Firebase Auth Loading & Error State
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const clearAuthError = () => setAuthError(null);

  // UI Navigation & Modals State
  const [activeView, setActiveView] = useState<string>('landing');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [currentVerifyingCertId, setCurrentVerifyingCertId] = useState<string | null>(null);

  // Firebase Authentication State Listener (Keeps session in sync automatically)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          const isAdminUser = firebaseUser.email === 'kapilnarula27july@gmail.com';

          let profile: UserProfile;
          if (userSnap.exists()) {
            profile = userSnap.data() as UserProfile;
            profile.name = profile.name || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Learner');
            profile.photoURL = profile.photoURL || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
            if (isAdminUser) profile.role = 'admin';
            await setDoc(userRef, { lastLoginAt: new Date().toISOString() }, { merge: true });
          } else {
            // Immediately initialize user document in Firestore without any profile filling forms
            profile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Learner'),
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              role: isAdminUser ? 'admin' : 'learner',
              phone: firebaseUser.phoneNumber || '',
              college: '',
              course: '',
              graduationYear: '',
              experienceLevel: '',
              careerGoal: '',
              city: '',
              linkedin: '',
              github: '',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              overallProgress: 0,
              jobReadinessScore: 0,
              certificateStatus: 'not_started',
              isDemo: false
            };
            await setDoc(userRef, profile);
          }

          setCurrentUser(profile);
          localStorage.setItem('da_current_user', JSON.stringify(profile));
          setLearners(prev => {
            const exists = prev.some(l => l.uid === profile.uid);
            if (exists) return prev.map(l => l.uid === profile.uid ? profile : l);
            return [profile, ...prev];
          });
          setIsProfileSetupOpen(false);
          setActiveView(prev => (prev === 'landing' ? (profile.role === 'admin' ? 'admin' : 'dashboard') : prev));
        } catch (e) {
          console.warn('Firebase user sync on auth state change note:', e);
        }
      } else {
        setCurrentUser(prev => {
          if (prev && !prev.uid.startsWith('admin_')) {
            localStorage.removeItem('da_current_user');
            return null;
          }
          return prev;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time sync for enrolled learners from Firestore
  useEffect(() => {
    try {
      const usersCol = collection(db, 'users');
      const unsubscribe = onSnapshot(
        usersCol,
        snapshot => {
          const remoteUsers: UserProfile[] = [];
          snapshot.forEach(docSnap => {
            const d = docSnap.data() as UserProfile;
            if (d && d.role === 'learner') {
              remoteUsers.push(d);
            }
          });
          if (remoteUsers.length > 0) {
            setLearners(prev => {
              const map = new Map<string, UserProfile>();
              prev.forEach(p => map.set(p.uid, p));
              remoteUsers.forEach(r => map.set(r.uid, r));
              const merged = Array.from(map.values());
              localStorage.setItem('da_learners', JSON.stringify(merged));
              return merged;
            });
          }
        },
        error => {
          console.warn('Firestore learners subscription notice:', error.message);
        }
      );

      return () => unsubscribe();
    } catch (e: any) {
      console.warn('Firestore learners init note:', e.message);
    }
  }, []);

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
    const learnerId = currentUser?.uid || 'guest';
    const learnerName = currentUser?.name || 'Enrolled Learner';
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
    if (records.length === 0) return 0;
    const score = records.reduce((acc, r) => {
      if (r.status === 'present') return acc + 1;
      if (r.status === 'late') return acc + 0.5;
      return acc;
    }, 0);
    return Math.min(100, Math.round((score / 12) * 100));
  };

  const calculateOverallProgress = (learnerId: string): number => {
    const isCurrentUser = currentUser?.uid === learnerId;
    const daysDone = isCurrentUser ? completedDays.length : (learners.find(l => l.uid === learnerId)?.overallProgress ? Math.round((learners.find(l => l.uid === learnerId)!.overallProgress * 12) / 100) : 0);
    const learnerSubs = submissions.filter(s => s.learnerId === learnerId);
    const subRate = Math.min(100, (learnerSubs.length / 12) * 100);
    const attRate = calculateAttendancePercent(learnerId);

    const w = settings.weights;
    const totalWeights = w.dailyLearning + w.assignments + w.assessments + w.handsOnLabs + w.capstone + w.attendance;

    const dailyScore = (daysDone / 12) * 100;
    const labScore = (daysDone / 12) * 100;
    const learnerQuizzes = quizResults.filter(q => q.learnerId === learnerId);
    const assessmentScore = learnerQuizzes.length > 0 
      ? Math.round(learnerQuizzes.reduce((acc, q) => acc + (q.score / (q.maxScore || 1)) * 100, 0) / 12)
      : 0;
    const capstoneScore = isCurrentUser
      ? (capstone?.status === 'evaluated' ? (capstone.score || 90) : (capstone?.status === 'submitted' ? 80 : 0))
      : 0;

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
    const isCurrentUser = currentUser?.uid === learnerId;
    const daysDone = isCurrentUser ? completedDays.length : 0;
    const learnerSubs = submissions.filter(s => s.learnerId === learnerId);

    if (daysDone === 0 && learnerSubs.length === 0) {
      return {
        score: 0,
        breakdown: {
          sql: 0,
          python: 0,
          excel: 0,
          powerBi: 0,
          visualization: 0,
          businessCommunication: 0,
          capstone: 0
        }
      };
    }

    const sqlSubs = learnerSubs.filter(s => s.day === 2 || s.day === 3).length;
    const sqlScore = Math.min(100, Math.round((daysDone >= 2 ? 40 : 0) + (daysDone >= 3 ? 30 : 0) + (sqlSubs * 15)));

    const pySubs = learnerSubs.filter(s => s.day === 4 || s.day === 5 || s.day === 6).length;
    const pythonScore = Math.min(100, Math.round((daysDone >= 4 ? 30 : 0) + (daysDone >= 5 ? 30 : 0) + (daysDone >= 6 ? 20 : 0) + (pySubs * 10)));

    const excelSubs = learnerSubs.filter(s => s.day === 7 || s.day === 8).length;
    const excelScore = Math.min(100, Math.round((daysDone >= 7 ? 40 : 0) + (daysDone >= 8 ? 40 : 0) + (excelSubs * 10)));

    const pbiSubs = learnerSubs.filter(s => s.day === 9 || s.day === 10).length;
    const powerBiScore = Math.min(100, Math.round((daysDone >= 9 ? 40 : 0) + (daysDone >= 10 ? 40 : 0) + (pbiSubs * 10)));

    const visualizationScore = Math.min(100, Math.round((daysDone >= 11 ? 80 : 0) + (learnerSubs.some(s => s.day === 11) ? 20 : 0)));

    const businessCommunicationScore = Math.min(100, Math.round((daysDone >= 1 ? 40 : 0) + (daysDone >= 12 ? 60 : 0)));

    const capstoneScore = isCurrentUser && capstone?.status === 'evaluated'
      ? (capstone.score || 90)
      : (isCurrentUser && capstone?.status === 'submitted' ? 80 : 0);

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
    const daysDone = isCurrentUser ? completedDays.length : 0;
    const attendanceMet = att >= settings.minAttendanceForCert;
    const modulesMet = daysDone >= 12;
    const assessmentsMet = daysDone >= 10;
    const capstoneMet = isCurrentUser ? (capstone?.status === 'submitted' || capstone?.status === 'evaluated') : false;

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
  const loginWithGoogle = async (demoUser?: UserProfile) => {
    if (demoUser) {
      setCurrentUser(demoUser);
      setActiveView('dashboard');
      return;
    }

    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const isAdminUser = firebaseUser.email === 'kapilnarula27july@gmail.com';
        let profile: UserProfile;

        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            profile = userSnap.data() as UserProfile;
            profile.name = profile.name || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Learner');
            profile.photoURL = profile.photoURL || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
            if (isAdminUser) profile.role = 'admin';
            await setDoc(userRef, { lastLoginAt: new Date().toISOString() }, { merge: true });
          } else {
            // New user enrolled via Firebase Google Auth - NO PROFILE FILLING REQUIRED
            profile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Learner'),
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              role: isAdminUser ? 'admin' : 'learner',
              phone: firebaseUser.phoneNumber || '',
              college: '',
              course: '',
              graduationYear: '',
              experienceLevel: '',
              careerGoal: '',
              city: '',
              linkedin: '',
              github: '',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              overallProgress: 0,
              jobReadinessScore: 0,
              certificateStatus: 'not_started',
              isDemo: false
            };
            await setDoc(userRef, profile);
          }
        } catch (dbErr: any) {
          console.warn('Firestore write warning during Google login:', dbErr);
          profile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Learner'),
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            role: isAdminUser ? 'admin' : 'learner',
            phone: firebaseUser.phoneNumber || '',
            college: '',
            course: '',
            graduationYear: '',
            experienceLevel: '',
            careerGoal: '',
            city: '',
            linkedin: '',
            github: '',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            overallProgress: 0,
            jobReadinessScore: 0,
            certificateStatus: 'not_started',
            isDemo: false
          };
        }

        setCurrentUser(profile);
        localStorage.setItem('da_current_user', JSON.stringify(profile));
        setLearners(prev => {
          const exists = prev.some(l => l.uid === profile.uid);
          if (exists) return prev.map(l => l.uid === profile.uid ? profile : l);
          return [profile, ...prev];
        });

        // ABSOLUTELY NO PROFILE FILLING
        setIsProfileSetupOpen(false);

        if (profile.role === 'admin') {
          setActiveView('admin');
        } else {
          setActiveView('dashboard');
        }
      }
    } catch (err: any) {
      console.error('Firebase Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // User closed popup; no loud alert needed
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('Google sign-in popup was blocked by your browser. Please allow popups for this site or open in a new tab.');
      } else {
        setAuthError(err.message || 'Google Authentication failed. Please try again.');
      }
    } finally {
      setIsAuthLoading(false);
    }
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
      jobReadinessScore: 0,
      certificateStatus: 'not_started',
      isDemo: false
    };

    setLearners(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCompletedDays([]); // Clean start from Day 1 with 0 completed
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

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
    setCurrentUser(null);
    localStorage.removeItem('da_current_user');
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
    const learnerId = currentUser?.uid || 'guest';
    const newRecord = { learnerId, day, score, maxScore };
    setQuizResults(prev => {
      const filtered = prev.filter(p => !(p.learnerId === learnerId && p.day === day));
      const updated = [...filtered, newRecord];
      try {
        localStorage.setItem('da_quiz_results', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });

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
        currentUser?.uid === l.uid ? completedDays.length : (l.overallProgress ? Math.round((l.overallProgress * 12) / 100) : 0),
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
        isAiDrawerOpen,
        currentVerifyingCertId,

        // Firebase Auth & Cloud Sync
        isAuthLoading,
        authError,
        clearAuthError,
        checkins,
        cloudSyncStatus,
        submitCheckin,
        syncFromCloud,

        setActiveView,
        setSelectedDay,
        setIsProfileSetupOpen,
        setIsAdminLoginOpen,
        setIsAiDrawerOpen,
        setCurrentVerifyingCertId,

        loginWithGoogle,
        loginAsAdmin,
        logout,
        completeProfileSetup,
        switchUser,

        markDayComplete,
        completedDays,
        quizResults,
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
