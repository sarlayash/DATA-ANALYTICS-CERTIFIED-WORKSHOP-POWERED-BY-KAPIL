export type UserRole = 'learner' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  college?: string;
  course?: string;
  graduationYear?: string;
  experienceLevel?: string;
  careerGoal?: string;
  city?: string;
  linkedin?: string;
  github?: string;
  profilePhoto?: string;
  createdAt: string;
  lastLoginAt: string;
  overallProgress: number; // 0 to 100
  jobReadinessScore: number; // 0 to 100
  certificateStatus: 'not_started' | 'in_progress' | 'eligible' | 'issued';
  certificateId?: string;
  isDemo?: boolean;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'multiple-select' | 'true-false' | 'sql-query' | 'python-code' | 'data-interpretation';
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface DayQuiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface CurriculumDay {
  day: number;
  title: string;
  domain: string;
  learningObjective: string;
  agenda: string[];
  concepts: {
    heading: string;
    description: string;
    codeExample?: string;
    businessNote?: string;
  }[];
  handsOnLab: {
    title: string;
    businessScenario: string;
    datasetDescription: string;
    task: string;
    expectedOutput: string;
    submissionInstructions: string;
    evaluationCriteria: string;
    skillsTested: string[];
  };
  businessCase: {
    title: string;
    companyContext: string;
    problem: string;
    deliverable: string;
  };
  practicalChallenge: string;
  quiz: DayQuiz;
  resources: {
    name: string;
    type: 'Cheatsheet' | 'Dataset' | 'Documentation' | 'Template';
    url: string;
  }[];
  expectedOutcomes: string[];
  skillMapping: string[];
  careerRelevance: {
    tool: string;
    usedInRoles: string[];
    salaryOutlook?: string;
  };
}

export interface Assignment {
  id: string;
  day: number;
  title: string;
  module: string;
  description: string;
  businessScenario?: string;
  instructions: string;
  tasks?: string[];
  deadline: string;
  maxMarks: number;
  submissionType: 'text' | 'file' | 'url' | 'github_url' | 'powerbi_url';
  skillsTested: string[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  learnerId: string;
  learnerName: string;
  day: number;
  submissionType: string;
  content: string;
  url?: string;
  status: 'submitted' | 'pending' | 'evaluated';
  marks?: number;
  feedback?: string;
  submittedAt: string;
  evaluatedAt?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  learnerId: string;
  learnerName: string;
  day: number;
  status: AttendanceStatus;
  markedAt: string;
}

export type SkillProficiency = 'Not Started' | 'Learning' | 'Practicing' | 'Proficient' | 'Job Ready';

export interface SkillItem {
  id: string;
  name: string;
  domain: string;
  category?: string;
  description: string;
  level: SkillProficiency;
  industryImportance: 'Critical' | 'High' | 'Medium';
}

export interface CapstoneSubmission {
  id: string;
  learnerId: string;
  learnerName: string;
  title: string;
  problemStatement: string;
  dataset: string;
  sqlWork: string;
  pythonNotebookUrl: string;
  excelAnalysisNotes: string;
  powerBiDashboardUrl: string;
  businessInsights: string;
  presentationUrl: string;
  githubUrl: string;
  demoUrl?: string;
  status: 'draft' | 'submitted' | 'evaluated';
  score?: number;
  feedback?: string;
  submittedAt?: string;
  evaluatedAt?: string;
}

export interface CertificateRecord {
  certificateId: string;
  learnerId: string;
  learnerName: string;
  courseName: string;
  duration: string;
  completionDate: string;
  verificationUrl: string;
  status: 'VALID' | 'REVOKED';
  qrCodeUrl?: string;
  signerName: string;
  signerTitle: string;
  skillsCertified: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Assignment' | 'Lab' | 'Capstone' | 'Urgent';
  authorName: string;
  createdAt: string;
  pinned: boolean;
}

export interface PortalNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'assignment' | 'assessment' | 'certificate' | 'announcement' | 'feedback';
  read: boolean;
}

export interface CompletionWeights {
  dailyLearning: number; // e.g. 20
  assignments: number;  // e.g. 20
  assessments: number;  // e.g. 20
  handsOnLabs: number;  // e.g. 15
  capstone: number;     // e.g. 15
  attendance: number;   // e.g. 10
}

export interface PortalSettings {
  programName: string;
  instructorName: string;
  organizationName: string;
  weights: CompletionWeights;
  leaderboardEnabled: boolean;
  minAttendanceForCert: number; // 80%
}

export interface DailyCheckinRecord {
  id: string;
  learnerId: string;
  learnerName: string;
  day: number;
  date: string;
  topicsCovered: string;
  keyTakeaway: string;
  hoursSpent: number;
  confidenceRating: number; // 1 to 5
  blockersOrDoubts?: string;
  status: 'submitted' | 'reviewed';
  timestamp: string;
}

export type CloudSyncStatus = 'synced' | 'syncing' | 'offline';

export interface DaySimpleNotes {
  day: number;
  domain: string;
  summary: string;
  cheatSheet: {
    category: string;
    items: string[];
  }[];
  keyFormulasAndSyntax: {
    name: string;
    syntax: string;
    usage: string;
  }[];
  commonMistakes: string[];
  proTips: string[];
}

export interface InterviewTipItem {
  id: string;
  question: string;
  category: 'Technical' | 'Business Scenario' | 'System & Logic' | 'Behavioral' | 'Design & Visual';
  difficulty: 'Junior' | 'Mid-Level' | 'Senior/Lead';
  interviewerMindset: string;
  answeringFramework: string;
  modelAnswer: string;
  codeSnippet?: string;
  trapsToAvoid: string[];
}

export interface DayInterviewGuide {
  day: number;
  domain: string;
  coreMindset: string;
  generalTips: string[];
  keyQuestions: InterviewTipItem[];
}

export interface SolvedExample {
  id: string;
  day: number;
  exampleNumber: number; // 1 to 5
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  businessContext: string;
  problemStatement: string;
  inputDatasetSchema?: {
    tableName: string;
    columns: string[];
    sampleRows: Record<string, any>[];
  };
  language: 'sql' | 'python' | 'excel' | 'powerbi' | 'bash';
  solutionCode: string;
  stepByStepExplanation: string[];
  expectedOutputPreview?: {
    columns: string[];
    rows: (string | number | boolean)[][];
    summaryText?: string;
  };
  interviewRelevance: string;
}

export interface IDEExecutionResult {
  status: 'success' | 'error';
  executionTimeMs: number;
  rowsAffected?: number;
  data?: {
    columns: string[];
    rows: Record<string, any>[];
  };
  logs?: string[];
  errorMessage?: string;
  success?: boolean;
  type?: 'sql' | 'python' | 'terminal' | 'bash';
  outputRows?: Record<string, any>[];
  columns?: string[];
  stdout?: string;
  stderr?: string;
  chartData?: { label: string; value: number }[];
}

export interface IDESampleSnippet {
  id: string;
  title: string;
  name?: string;
  language: 'sql' | 'python' | 'terminal' | 'bash';
  day?: number;
  code: string;
  description?: string;
}

export interface UserDayNote {
  day: number;
  userId: string;
  content: string;
  lastUpdated: string;
}

