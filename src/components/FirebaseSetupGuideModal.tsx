import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ChevronRight,
  ExternalLink,
  Code2,
  Terminal,
  Server
} from 'lucide-react';

export const FirebaseSetupGuideModal: React.FC = () => {
  const { isFirebaseSetupOpen, setIsFirebaseSetupOpen } = useApp();
  const [activeStep, setActiveStep] = useState(1);
  const [copied, setCopied] = useState(false);

  if (!isFirebaseSetupOpen) return null;

  const steps = [
    { num: 1, title: 'Create Firebase Project', summary: 'Initialize new project in Firebase Console' },
    { num: 2, title: 'Enable Authentication', summary: 'Activate Google Sign-In provider' },
    { num: 3, title: 'Provision Cloud Firestore', summary: 'Create Firestore database in Production Mode' },
    { num: 4, title: 'Deploy Security Rules', summary: 'Configure the 8 Pillars RBAC rules' },
    { num: 5, title: 'Web App Registration', summary: 'Retrieve Firebase SDK API keys & config' },
    { num: 6, title: 'Environment Variables', summary: 'Configure secrets in .env or cloud environment' },
    { num: 7, title: 'Composite Indexes', summary: 'Index multi-field queries for submissions & attendance' },
    { num: 8, title: 'Production Deployment', summary: 'Build and deploy full-stack container on Cloud Run' },
    { num: 9, title: 'Post-Deployment Verification', summary: 'Run end-to-end authentication & write audits' },
    { num: 10, title: 'Security Hardening', summary: 'Custom claims, App Check & rate limiting' },
    { num: 11, title: 'Troubleshooting & Logs', summary: 'Resolve permission denied & CORS errors' },
    { num: 12, title: 'System Architecture', summary: 'End-to-end dataflow and credential boundaries' }
  ];

  const rulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    function isAdmin() {
      return isSignedIn() && (request.auth.token.role == 'admin' || request.auth.token.admin == true);
    }
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create, update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    match /curriculum/{dayId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /submissions/{subId} {
      allow read: if isOwner(resource.data.learnerId) || isAdmin();
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }
    match /certificates/{certId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}`;

  const copyRules = () => {
    navigator.clipboard.writeText(rulesCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] text-left overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Production Firebase & Cloud Architecture Guide
              </h2>
              <p className="text-xs text-slate-400">12-Step Deployment Checklist (Section 44)</p>
            </div>
          </div>

          <button
            onClick={() => setIsFirebaseSetupOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Step list (left) + Step Details (right) */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Steps selector */}
          <div className="border-r border-slate-800 overflow-y-auto p-3 space-y-1 bg-slate-950/40">
            {steps.map(s => (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-start gap-2.5 cursor-pointer ${
                  activeStep === s.num
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-750 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                  {s.num}
                </span>
                <div className="truncate">
                  <p className="truncate font-medium">{s.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">{s.summary}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Step Detail Content (2 Cols) */}
          <div className="md:col-span-2 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeStep === 1 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Step 1: Create a Firebase Project</h3>
                <p>1. Navigate to the Firebase Console: <code className="text-cyan-300 font-mono">console.firebase.google.com</code>.</p>
                <p>2. Click <strong>Add Project</strong> and name it <code className="text-amber-300 font-mono">analytics-mastery-workshop</code>.</p>
                <p>3. Enable or disable Google Analytics depending on organizational monitoring requirements.</p>
                <p>4. Provisioning finishes in under 30 seconds.</p>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Step 2: Enable Authentication (Google Provider)</h3>
                <p>1. In Firebase Console, select <strong>Build → Authentication</strong>.</p>
                <p>2. Click <strong>Get Started</strong> and navigate to the <strong>Sign-in method</strong> tab.</p>
                <p>3. Select <strong>Google</strong> from the provider list and toggle <strong>Enable</strong>.</p>
                <p>4. Configure the Project support email and save.</p>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Step 3: Enable Cloud Firestore</h3>
                <p>1. Select <strong>Build → Firestore Database</strong>.</p>
                <p>2. Click <strong>Create Database</strong> and select <strong>Production Mode</strong>.</p>
                <p>3. Choose your primary cloud region (e.g. <code className="text-cyan-300 font-mono">asia-south1</code> or <code className="text-cyan-300 font-mono">us-central1</code>).</p>
                <p>4. This provisions collections defined in <code className="text-amber-300 font-mono">firebase-blueprint.json</code>.</p>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Step 4: Security Rules Configuration</h3>
                  <button
                    onClick={copyRules}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy Rules'}</span>
                  </button>
                </div>
                <p>Ensure `firestore.rules` implements role-based access control (RBAC):</p>
                <pre className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-56">
                  <code>{rulesCode}</code>
                </pre>
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Step 5: Web App Registration & SDK Keys</h3>
                <p>1. In Project Settings, click <strong>Add app</strong> and select the Web icon (&lt;/&gt;).</p>
                <p>2. Register app name: <code className="text-cyan-300 font-mono">Workshop Portal Web</code>.</p>
                <p>3. Copy the <code className="text-amber-300 font-mono">firebaseConfig</code> object keys.</p>
              </div>
            )}

            {activeStep === 6 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Step 6: Environment Variables</h3>
                <p>Configure in your deployment platform or <code className="text-amber-300 font-mono">.env</code>:</p>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 space-y-1">
                  <p>GEMINI_API_KEY="your-gemini-api-key"</p>
                  <p>ADMIN_USERNAME="kapiladmin"</p>
                  <p>ADMIN_PASSWORD="admin123"</p>
                </div>
              </div>
            )}

            {activeStep >= 7 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">{steps[activeStep - 1].title}</h3>
                <p className="text-slate-300">{steps[activeStep - 1].summary}.</p>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <p>• All endpoints verify role claims against backend authentication services.</p>
                  <p>• Certificates are signed cryptographically with public lookup verification.</p>
                  <p>• Offline local-first caching preserves full functionality during preview.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Step {activeStep} of 12</span>
          <button
            onClick={() => setActiveStep(prev => (prev < 12 ? prev + 1 : 1))}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>{activeStep === 12 ? 'Restart Guide' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
