import React from 'react';
import { Cpu, Award, Sparkles, BookOpen, Layers, ShieldAlert, Globe, Code2, History, User, GraduationCap, Code, ShieldCheck, Sparkle, Palette, Target, Zap, Users } from 'lucide-react';
import { SupportedLanguage, UserProfile } from '../types';
import { BackgroundStyle } from './InteractiveBackground';

export type TabType = 'ingest' | 'agents' | 'judge' | 'health' | '3d' | 'guide' | 'chat' | 'history' | 'problem' | 'mcp' | 'community';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  hasAnalysis: boolean;
  activeLanguage: SupportedLanguage;
  setActiveLanguage: (lang: SupportedLanguage) => void;
  projectName?: string;
  historyCount?: number;
  currentUser?: UserProfile | null;
  onOpenLoginModal?: () => void;
  bgStyle?: BackgroundStyle;
  setBgStyle?: (style: BackgroundStyle) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasAnalysis,
  activeLanguage,
  setActiveLanguage,
  projectName,
  historyCount = 0,
  currentUser,
  onOpenLoginModal,
  bgStyle = 'particles',
  setBgStyle
}) => {
  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'student': return <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />;
      case 'developer': return <Code className="w-3.5 h-3.5 text-indigo-400" />;
      case 'judge': return <Award className="w-3.5 h-3.5 text-amber-400" />;
      case 'auditor': return <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />;
      default: return <User className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-indigo-500/20 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('ingest')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Code2 className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 bg-clip-text text-transparent tracking-tight">
                  CodePriya AI
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
                  v2.5 Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Multi-Agent Code Inspector & Hackathon Judge
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('ingest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'ingest'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Project Ingestion</span>
            </button>

            <button
              onClick={() => setActiveTab('judge')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'judge'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Hackathon Judge</span>
              {hasAnalysis && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('problem')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'problem'
                  ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-amber-300" />
              <span>Problem Match</span>
            </button>

            <button
              onClick={() => setActiveTab('3d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === '3d'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-300" />
              <span>3D Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'guide'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              <span>Spoon-Feeding Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('health')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'health'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />
              <span>Code Health</span>
            </button>

            <button
              onClick={() => setActiveTab('mcp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'mcp'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-indigo-300" />
              <span>MCP Protocol</span>
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'community'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-300" />
              <span>Community Hub</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500/30 text-emerald-200 font-bold border border-emerald-400/30">
                Match
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5 text-blue-300" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/30 text-blue-200 font-bold border border-blue-400/30">
                  {historyCount}
                </span>
              )}
            </button>
          </nav>

          {/* Background Style, Multi-Language Selector & User Login / Persona Button */}
          <div className="flex items-center space-x-2">
            {/* Interactive Background Canvas Selector */}
            {setBgStyle && (
              <div className="hidden sm:flex items-center bg-slate-950 px-2 py-1 rounded-lg border border-indigo-500/30 text-xs font-medium space-x-1 shadow-inner">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <select
                  value={bgStyle}
                  onChange={(e) => setBgStyle(e.target.value as BackgroundStyle)}
                  className="bg-transparent text-[11px] text-purple-200 font-bold focus:outline-none cursor-pointer py-0.5"
                  title="Switch Animated Canvas Background"
                >
                  <option value="particles" className="bg-slate-900 text-white">✨ Neural Particles</option>
                  <option value="grid" className="bg-slate-900 text-white">🌐 Cyber Grid</option>
                  <option value="code" className="bg-slate-900 text-white">💻 Matrix Stream</option>
                  <option value="cosmic" className="bg-slate-900 text-white">🌌 Cosmic Glow</option>
                  <option value="off" className="bg-slate-900 text-white">⏸ Static Dark</option>
                </select>
              </div>
            )}

            {/* Language Dropdown Selector */}
            <div className="flex items-center bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs font-medium space-x-1">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={activeLanguage}
                onChange={(e) => setActiveLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs text-indigo-200 font-semibold focus:outline-none cursor-pointer py-0.5"
              >
                <option value="telugu" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
                <option value="english" className="bg-slate-900 text-white">English</option>
                <option value="hindi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
                <option value="tamil" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
                <option value="kannada" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
                <option value="spanish" className="bg-slate-900 text-white">Español</option>
                <option value="bilingual" className="bg-slate-900 text-white">Bilingual (Multilingual)</option>
              </select>
            </div>

            {/* User Persona & Login Button */}
            <button
              onClick={onOpenLoginModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 hover:from-indigo-900 hover:to-purple-900 px-3 py-1.5 rounded-xl border border-indigo-400/50 text-xs transition-all shadow-lg shadow-indigo-500/20 group ring-1 ring-indigo-500/30"
            >
              {currentUser ? (
                <>
                  <div className="relative">
                    <img
                      src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full border-2 border-indigo-400 object-cover"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-slate-900 border border-slate-700">
                      {getRoleIcon(currentUser.role)}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-1">
                      <p className="text-[11px] font-bold text-white leading-tight truncate max-w-[100px]">{currentUser.name}</p>
                      <span className="text-[9px] text-indigo-300 font-semibold group-hover:underline">(Switch)</span>
                    </div>
                    <p className="text-[9px] font-extrabold text-amber-300 uppercase tracking-wider">{currentUser.role}</p>
                  </div>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span className="font-extrabold text-indigo-200">Login / Persona</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-2 border-t border-slate-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('ingest')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'ingest' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Ingestion
          </button>
          <button
            onClick={() => setActiveTab('judge')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'judge' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Judge
          </button>
          <button
            onClick={() => setActiveTab('3d')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === '3d' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            3D Architecture
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'guide' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Spoon-Feeding
          </button>
          <button
            onClick={() => setActiveTab('mcp')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'mcp' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            MCP Protocol
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'community' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Community
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            History ({historyCount})
          </button>
        </div>
      </div>
    </header>
  );
};

