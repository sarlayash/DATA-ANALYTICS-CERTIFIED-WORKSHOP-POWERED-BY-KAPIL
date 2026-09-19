import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, User, AlertCircle, CheckCircle2, X } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginOpen, setIsAdminLoginOpen, loginAsAdmin } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminLoginOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await loginAsAdmin(username, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 text-left">
        <button
          onClick={() => setIsAdminLoginOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Enterprise Admin Login</h3>
            <p className="text-xs text-slate-400">Restricted Instructor & Platform Administration</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-400" /> Admin Username
            </label>
            <input
              type="text"
              id="admin-username-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400" /> Admin Password
            </label>
            <input
              type="password"
              id="admin-password-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500 font-mono"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAdminLoginOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-admin-submit-login"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-lg shadow-rose-600/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Verifying...' : 'Authorize as Admin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
