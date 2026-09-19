import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  Share2,
  QrCode,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CertificationView: React.FC = () => {
  const {
    currentUser,
    certificates,
    issueCertificate,
    checkCertificateEligibility,
    currentVerifyingCertId,
    setCurrentVerifyingCertId
  } = useApp();

  const [searchCertId, setSearchCertId] = useState(currentVerifyingCertId || '');
  const [searchedRecord, setSearchedRecord] = useState<any>(null);
  const [claimed, setClaimed] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  const eligibility = checkCertificateEligibility(currentUser.uid);
  const userCert = certificates.find(c => c.learnerId === currentUser.uid);

  const handleClaimCertificate = () => {
    const cert = issueCertificate(currentUser.uid);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    setClaimed(true);
  };

  const handleSearchVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCertId.trim()) return;
    const found = certificates.find(c => c.certificateId.toLowerCase() === searchCertId.trim().toLowerCase());
    setSearchedRecord(found || 'NOT_FOUND');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Verifiable Credential Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Certification of Completion & Public Verification
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Official accredited credentials authenticated by unique identifier and cryptographic verification standards.
            </p>
          </div>

          {userCert ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 font-semibold text-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          ) : eligibility.eligible ? (
            <button
              id="btn-claim-certificate"
              onClick={handleClaimCertificate}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white animate-spin" />
              <span>Claim Official Certificate Now</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Eligibility Audit Checklist */}
      {!userCert && (
        <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-750">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Certification Requirements Audit
            </h3>
            <span className={`text-xs font-bold font-mono ${eligibility.eligible ? 'text-emerald-400' : 'text-amber-400'}`}>
              {eligibility.eligible ? 'ALL REQUIREMENTS MET' : 'PENDING REQUIREMENTS'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 ${
              eligibility.attendanceMet ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-slate-900/60 border-slate-750 text-slate-400'
            }`}>
              {eligibility.attendanceMet ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              <span>Attendance ≥ 80% (Current: {eligibility.attendanceMet ? 'Verified' : 'Incomplete'})</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 ${
              eligibility.modulesMet ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-slate-900/60 border-slate-750 text-slate-400'
            }`}>
              {eligibility.modulesMet ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              <span>100% Daily Learning (12 Modules)</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 ${
              eligibility.assessmentsMet ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-slate-900/60 border-slate-750 text-slate-400'
            }`}>
              {eligibility.assessmentsMet ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              <span>Daily Quizzes & Diagnostic Tests Passed</span>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 ${
              eligibility.capstoneMet ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-slate-900/60 border-slate-750 text-slate-400'
            }`}>
              {eligibility.capstoneMet ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              <span>Business Intelligence Capstone Submitted</span>
            </div>
          </div>
        </div>
      )}

      {/* The Rendered Official Certificate (Section 16 & 40) */}
      {(userCert || claimed) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Official Authenticated Credential
            </span>
            <span className="text-xs font-mono text-slate-400">ID: {userCert?.certificateId}</span>
          </div>

          <div
            ref={certRef}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-amber-500/40 shadow-2xl relative overflow-hidden text-center space-y-6"
          >
            {/* Elegant Certificate Border Ornament */}
            <div className="absolute inset-3 border border-amber-500/20 rounded-2xl pointer-events-none" />

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-lg mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <p className="text-xs sm:text-sm uppercase tracking-widest text-amber-400 font-bold">
                CERTIFICATE OF COMPLETION
              </p>
              <p className="text-xs text-slate-400 mt-1">This is proudly awarded and presented to</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3 font-serif">
                {userCert?.learnerName || currentUser.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mt-3 leading-relaxed">
                for successfully completing the rigorous 12-day curriculum and meeting all commercial standards in
              </p>
              <h3 className="text-base sm:text-lg font-bold text-indigo-300 mt-2">
                12-Day Job-Oriented Data Analytics Certified Workshop Powered by Kapil
              </h3>
            </div>

            {/* Skills Certified */}
            <div className="pt-2">
              <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Certified Enterprise Competencies:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                {(userCert?.skillsCertified || ['SQL', 'BigQuery', 'Python', 'Pandas', 'Excel', 'Power BI', 'DAX', 'Storytelling', 'GenAI']).map(s => (
                  <span key={s} className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-200 border border-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Signer & Verification Footer */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs">
              <div className="text-left space-y-1">
                <p className="text-slate-400">Date Issued:</p>
                <p className="text-white font-mono font-bold">{userCert?.completionDate || new Date().toISOString().split('T')[0]}</p>
                <p className="text-[10px] text-slate-500">Duration: 12 Days (Hands-On)</p>
              </div>

              {/* QR Code representation */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="w-16 h-16 bg-white p-1.5 rounded-lg flex items-center justify-center shadow-md">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">Scan to Verify</span>
              </div>

              <div className="text-right space-y-1">
                <p className="text-white font-serif italic text-base border-b border-slate-700 pb-1 inline-block">
                  Kapil Narula
                </p>
                <p className="text-slate-300 font-semibold">{userCert?.signerName || 'Kapil Narula'}</p>
                <p className="text-[10px] text-slate-400">{userCert?.signerTitle || 'Lead Analytics Instructor & Platform Director'}</p>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono pt-2">
              Certificate ID: {userCert?.certificateId} • Status: {userCert?.status || 'VALID'}
            </div>
          </div>
        </div>
      )}

      {/* Public Verification Portal (Section 40) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-750 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Search className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">Public Certificate Verification Registry</h3>
        </div>
        <p className="text-xs text-slate-400">
          Recruiters, HR managers, and academic institutions can verify certificate authenticity by entering the unique Certificate ID.
        </p>

        <form onSubmit={handleSearchVerification} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchCertId}
            onChange={e => setSearchCertId(e.target.value)}
            placeholder="Enter Certificate ID (e.g. SY-DA-2026-0001)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition cursor-pointer shrink-0"
          >
            Verify Credential
          </button>
        </form>

        {searchedRecord === 'NOT_FOUND' && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>No certificate found matching ID "{searchCertId}". Please check the ID formatting.</span>
          </div>
        )}

        {searchedRecord && searchedRecord !== 'NOT_FOUND' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Credential Authenticated & Active
              </span>
              <span className="font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                {searchedRecord.status}
              </span>
            </div>
            <p><strong className="text-white">Awarded To:</strong> {searchedRecord.learnerName}</p>
            <p><strong className="text-white">Course:</strong> {searchedRecord.courseName}</p>
            <p><strong className="text-white">Completion Date:</strong> {searchedRecord.completionDate}</p>
            <p><strong className="text-white">Issuing Authority:</strong> {searchedRecord.signerName} ({searchedRecord.signerTitle})</p>
          </div>
        )}
      </div>
    </div>
  );
};
