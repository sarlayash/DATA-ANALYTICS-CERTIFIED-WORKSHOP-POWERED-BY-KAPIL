import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { X, User, Briefcase, GraduationCap, Link2, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

export const ProfileSetupModal: React.FC = () => {
  const { isProfileSetupOpen, setIsProfileSetupOpen, completeProfileSetup } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    course: '',
    graduationYear: '2025',
    currentRole: 'Student / Aspiring Data Analyst',
    experienceLevel: 'Entry-Level (0-1 Years)',
    careerGoal: 'Data Analyst at Tech or Financial Services',
    city: '',
    linkedin: '',
    github: '',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isProfileSetupOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid Email is required';
    if (!formData.phone.trim()) errs.phone = 'Mobile Number is required';
    if (!formData.college.trim()) errs.college = 'College or Organization is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    completeProfileSetup(formData as Partial<UserProfile>);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left">
        <button
          onClick={() => setIsProfileSetupOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Learner Onboarding</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Complete Your Professional Learner Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            This information configures your personalized curriculum track, skills matrix, and official Certificate of Completion records.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className={`w-full px-3.5 py-2 rounded-lg bg-slate-800 border ${
                  errors.name ? 'border-rose-500' : 'border-slate-700'
                } text-white focus:outline-none focus:border-indigo-500`}
              />
              {errors.name && <p className="text-rose-400 text-[11px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Google Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@gmail.com"
                className={`w-full px-3.5 py-2 rounded-lg bg-slate-800 border ${
                  errors.email ? 'border-rose-500' : 'border-slate-700'
                } text-white focus:outline-none focus:border-indigo-500`}
              />
              {errors.email && <p className="text-rose-400 text-[11px] mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Row 2: Phone & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" /> Mobile Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className={`w-full px-3.5 py-2 rounded-lg bg-slate-800 border ${
                  errors.phone ? 'border-rose-500' : 'border-slate-700'
                } text-white focus:outline-none focus:border-indigo-500`}
              />
              {errors.phone && <p className="text-rose-400 text-[11px] mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" /> City / Location *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. New Delhi / Bengaluru / Mumbai"
                className={`w-full px-3.5 py-2 rounded-lg bg-slate-800 border ${
                  errors.city ? 'border-rose-500' : 'border-slate-700'
                } text-white focus:outline-none focus:border-indigo-500`}
              />
              {errors.city && <p className="text-rose-400 text-[11px] mt-1">{errors.city}</p>}
            </div>
          </div>

          {/* Row 3: College / Org & Course */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> College / Organization *
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={e => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. Delhi Technological University or Cognizant"
                className={`w-full px-3.5 py-2 rounded-lg bg-slate-800 border ${
                  errors.college ? 'border-rose-500' : 'border-slate-700'
                } text-white focus:outline-none focus:border-indigo-500`}
              />
              {errors.college && <p className="text-rose-400 text-[11px] mt-1">{errors.college}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Graduation Year</label>
              <input
                type="text"
                value={formData.graduationYear}
                onChange={e => setFormData({ ...formData, graduationYear: e.target.value })}
                placeholder="2025"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 4: Course / Degree & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Course / Degree</label>
              <input
                type="text"
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
                placeholder="e.g. B.Tech / B.Sc Stats / MBA / B.Com"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Current Role / Background
              </label>
              <input
                type="text"
                value={formData.currentRole}
                onChange={e => setFormData({ ...formData, currentRole: e.target.value })}
                placeholder="e.g. Final Year Student / Operations Associate"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 5: Experience & Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={e => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Student (Final Year)">Student (Final Year)</option>
                <option value="Entry-Level (0-1 Years)">Entry-Level (0-1 Years)</option>
                <option value="Mid-Level (1-3 Years)">Mid-Level (1-3 Years)</option>
                <option value="Career Switcher">Career Switcher</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Primary Career Goal</label>
              <input
                type="text"
                value={formData.careerGoal}
                onChange={e => setFormData({ ...formData, careerGoal: e.target.value })}
                placeholder="e.g. Data Analyst / BI Analyst"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 6: LinkedIn & GitHub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-indigo-400" /> LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-indigo-400" /> GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={e => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * Note: No separate password required. Authentication is secured via Google OAuth credentials.
          </p>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsProfileSetupOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Launch Dashboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
