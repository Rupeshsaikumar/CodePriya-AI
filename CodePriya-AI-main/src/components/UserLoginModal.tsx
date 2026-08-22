import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Code, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Mail, 
  Building, 
  Key,
  X,
  Zap,
  Globe
} from 'lucide-react';
import { UserProfile, UserRole, SupportedLanguage } from '../types';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
}

const PRESET_USERS: Record<UserRole, UserProfile> = {
  student: {
    id: 'user-student-1',
    name: 'Rupesh Sai Kumar',
    email: 'rupesh.student@code-priya.ai',
    role: 'student',
    organization: 'Computer Science Department',
    preferredLanguage: 'telugu',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  developer: {
    id: 'user-dev-2',
    name: 'Alex Vance',
    email: 'alex.vance@techcorp.io',
    role: 'developer',
    organization: 'Fullstack Dev Team',
    preferredLanguage: 'english',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  judge: {
    id: 'user-judge-3',
    name: 'Dr. Anita Sharma',
    email: 'judge.anita@hackathon-central.org',
    role: 'judge',
    organization: 'Global Hackathon Jury Panel',
    preferredLanguage: 'english',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  auditor: {
    id: 'user-auditor-4',
    name: 'Marcus Sterling',
    email: 'm.sterling@cyber-audit.com',
    role: 'auditor',
    organization: 'Enterprise Architecture & Security',
    preferredLanguage: 'english',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
};

export const UserLoginModal: React.FC<UserLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLang, setPreferredLang] = useState<SupportedLanguage>('english');
  const [loginMode, setLoginMode] = useState<'quick' | 'custom'>('quick');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: UserProfile = {
      id: `user-custom-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: selectedRole,
      organization: organization.trim() || 'CodePriya User',
      preferredLanguage: preferredLang,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
    };

    onLogin(newUser);
    onClose();
  };

  const handleQuickLogin = (role: UserRole) => {
    onLogin(PRESET_USERS[role]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Select Your User Persona & Login</h2>
              <p className="text-xs text-slate-400">Customized interface & tools for your specific role</p>
            </div>
          </div>
          {currentUser && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Current Active User Banner if logged in */}
        {currentUser && (
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-indigo-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full border border-indigo-400 object-cover"
              />
              <div>
                <p className="font-bold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-indigo-300 font-semibold capitalize">
                  Active Role: <span className="text-amber-400 font-extrabold">{currentUser.role}</span> ({currentUser.organization})
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              LOGGED IN
            </span>
          </div>
        )}

        {/* Role Selector Cards */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            1. Select User Type / Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Student */}
            <div
              onClick={() => setSelectedRole('student')}
              className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-2 relative ${
                selectedRole === 'student'
                  ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-emerald-400 text-sm">
                  <GraduationCap className="w-5 h-5" />
                  <span>Student / Learner</span>
                </div>
                {selectedRole === 'student' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] leading-relaxed">
                Highlights <strong>Spoon-Feeding Guide</strong>, line-by-line Telugu/English explanations, concept breakdowns & learning paths.
              </p>
              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">
                🎓 Best for Students & Beginners
              </span>
            </div>

            {/* Developer */}
            <div
              onClick={() => setSelectedRole('developer')}
              className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-2 relative ${
                selectedRole === 'developer'
                  ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-indigo-400 text-sm">
                  <Code className="w-5 h-5" />
                  <span>Software Developer</span>
                </div>
                {selectedRole === 'developer' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <p className="text-[11px] leading-relaxed">
                Highlights <strong>3D Architecture</strong>, Code Health Dashboard, complexity metrics, Git files & deep code analysis.
              </p>
              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">
                💻 Best for Programmers & Engineers
              </span>
            </div>

            {/* Hackathon Judge */}
            <div
              onClick={() => setSelectedRole('judge')}
              className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-2 relative ${
                selectedRole === 'judge'
                  ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-amber-400 text-sm">
                  <Award className="w-5 h-5" />
                  <span>Hackathon Judge</span>
                </div>
                {selectedRole === 'judge' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-[11px] leading-relaxed">
                Highlights <strong>AI vs Human Code Ratio</strong>, Innovation Scoring, Certificate eligibility & Judge evaluation card.
              </p>
              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                🏆 Best for Event Jury & Evaluators
              </span>
            </div>

            {/* Enterprise Auditor */}
            <div
              onClick={() => setSelectedRole('auditor')}
              className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-2 relative ${
                selectedRole === 'auditor'
                  ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg shadow-rose-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-rose-400 text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Enterprise Auditor</span>
                </div>
                {selectedRole === 'auditor' && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
              </div>
              <p className="text-[11px] leading-relaxed">
                Highlights <strong>Security Vulnerabilities</strong>, CWE Alerts, compliance metrics & PDF export reports.
              </p>
              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300">
                🛡️ Best for Security & Enterprise Lead
              </span>
            </div>
          </div>
        </div>

        {/* Login Mode Toggle */}
        <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setLoginMode('quick')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center space-x-1.5 ${
              loginMode === 'quick'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1-Click Persona Login</span>
          </button>
          <button
            onClick={() => setLoginMode('custom')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center space-x-1.5 ${
              loginMode === 'custom'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Custom Login / Credentials</span>
          </button>
        </div>

        {/* Quick Persona Login Button */}
        {loginMode === 'quick' ? (
          <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-3">
              <img
                src={PRESET_USERS[selectedRole].avatarUrl}
                alt={PRESET_USERS[selectedRole].name}
                className="w-12 h-12 rounded-full border-2 border-indigo-400 object-cover shadow-md"
              />
              <div>
                <p className="text-sm font-bold text-white">{PRESET_USERS[selectedRole].name}</p>
                <p className="text-xs text-slate-400">{PRESET_USERS[selectedRole].email}</p>
                <p className="text-[11px] text-indigo-300 font-semibold">{PRESET_USERS[selectedRole].organization}</p>
              </div>
            </div>

            <button
              onClick={() => handleQuickLogin(selectedRole)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Login Instantly as {selectedRole.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Custom Login Form */
          <form onSubmit={handleCustomSubmit} className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rupesh Sai Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="rupesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Organization / College</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. KL University / Google"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Preferred Explanation Language</label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <select
                    value={preferredLang}
                    onChange={(e) => setPreferredLang(e.target.value as SupportedLanguage)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="telugu">తెలుగు (Telugu)</option>
                    <option value="english">English</option>
                    <option value="hindi">हिन्दी (Hindi)</option>
                    <option value="tamil">தமிழ் (Tamil)</option>
                    <option value="kannada">கன்னட (Kannada)</option>
                    <option value="bilingual">Bilingual (English + Regional)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Password or Magic Security PIN</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Create Account & Access as {selectedRole.toUpperCase()}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
