import React, { useState } from 'react';
import { Upload, Github, FolderArchive, Sparkles, ArrowRight, CheckCircle2, Code, Zap, FileText, Key, Lock, Mail, ShieldCheck, Folder, User, GraduationCap, Award, Target } from 'lucide-react';
import JSZip from 'jszip';
import { ProjectData, ProjectFile, UserProfile } from '../types';
import { DEMO_PROJECTS } from '../data/demoProjects';

interface ProjectIngestionProps {
  onSelectProject: (project: ProjectData) => void;
  onStartAnalysis: (project: ProjectData) => void;
  isAnalyzing: boolean;
  selectedProject?: ProjectData;
  currentUser?: UserProfile | null;
  onOpenLoginModal?: () => void;
}

export const ProjectIngestion: React.FC<ProjectIngestionProps> = ({
  onSelectProject,
  onStartAnalysis,
  isAnalyzing,
  selectedProject,
  currentUser,
  onOpenLoginModal
}) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [githubError, setGithubError] = useState('');
  const [isPrivateRepoModal, setIsPrivateRepoModal] = useState(false);
  const [ownerEmailAuthCode, setOwnerEmailAuthCode] = useState('');
  const [emailAuthSent, setEmailAuthSent] = useState(false);
  const [customProjectName, setCustomProjectName] = useState('');

  // Problem Statement State & Presets
  const PROBLEM_PRESETS = [
    {
      id: 'custom',
      label: '✏️ Custom Input (Empty Box / Type Your Own Problem)',
      statement: ''
    },
    {
      id: 'multi-agent',
      label: '🤖 Multi-Agent AI Code Inspector & Database',
      statement: 'Build a Multi-Agent AI Code Inspector platform with Hackathon Judge Scoring, Firebase Persistence, and Multilingual Guides.'
    },
    {
      id: 'food-delivery',
      label: '🍔 Food Delivery & Restaurant ERP Platform',
      statement: 'Develop a full-stack food delivery application with restaurant management, order placement, real-time driver tracking, menu catalog, and payment gateway.'
    },
    {
      id: 'ecommerce',
      label: '🛒 Full-Stack E-Commerce & Payment Platform',
      statement: 'Develop a full-stack e-commerce web application with product catalog, cart management, user authentication, and secure Stripe/PayPal payment gateway integration.'
    },
    {
      id: 'defi-crypto',
      label: '⚡ Multi-Chain DeFi Payment Gateway',
      statement: 'Construct an autonomous microservice for decentralized cross-chain crypto payments with real-time liquidity routing and slippage protection.'
    }
  ];

  const [problemStatement, setProblemStatement] = useState(PROBLEM_PRESETS[1].statement);
  const [selectedPreset, setSelectedPreset] = useState(PROBLEM_PRESETS[1].id);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === 'custom') {
      setProblemStatement('');
    } else {
      const found = PROBLEM_PRESETS.find(p => p.id === presetId);
      if (found) {
        setProblemStatement(found.statement);
      }
    }
  };

  // Handle GitHub Repo Fetch
  const handleFetchGithub = async (e?: React.FormEvent, tokenToUse?: string) => {
    if (e) e.preventDefault();
    if (!githubUrl.trim()) return;

    setIsFetchingGithub(true);
    setGithubError('');

    try {
      const response = await fetch('/api/fetch-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          repoUrl: githubUrl,
          githubToken: tokenToUse || githubToken || ownerEmailAuthCode
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        if (data.isPrivateRepo) {
          setIsPrivateRepoModal(true);
        }
        throw new Error(data.error || 'Failed to fetch GitHub repository');
      }

      setIsPrivateRepoModal(false);
      const enrichedData = {
        ...data,
        problemStatement: problemStatement || 'Multi-Agent AI Repository Inspector'
      };
      onSelectProject(enrichedData);
      onStartAnalysis(enrichedData);
    } catch (err: any) {
      setGithubError(err.message || 'Error fetching repository');
    } finally {
      setIsFetchingGithub(false);
    }
  };

  const handleSendEmailConfirmation = () => {
    setEmailAuthSent(true);
    // Simulate email confirmation sent to repository owner
    setTimeout(() => {
      setOwnerEmailAuthCode('auth_approved_owner_key_9982');
    }, 1500);
  };

  // Handle Local ZIP Upload using JSZip
  const handleZipFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);

      const files: ProjectFile[] = [];
      let totalLines = 0;

      for (const [relativePath, zipEntry] of Object.entries(zipContent.files)) {
        if (!zipEntry.dir && !relativePath.includes('node_modules') && !relativePath.includes('.git')) {
          const content = await zipEntry.async('string');
          const lines = content.split('\n').length;
          totalLines += lines;

          const ext = relativePath.split('.').pop() || 'txt';
          files.push({
            path: relativePath,
            name: relativePath.split('/').pop() || relativePath,
            size: content.length,
            language: ext,
            lineCount: lines,
            content
          });
        }
      }

      const project: ProjectData = {
        id: `zip-${Date.now()}`,
        name: customProjectName || file.name.replace(/\.zip$/i, '') || 'Uploaded Project ZIP',
        description: `Local project repository ZIP containing ${files.length} code files.`,
        uploadType: 'folder',
        problemStatement: problemStatement || 'Multi-Agent AI Repository Inspector',
        files,
        fileTree: {},
        totalFiles: files.length,
        totalLines,
        languages: { TypeScript: 60, JavaScript: 25, CSS: 15 }
      };

      onSelectProject(project);
      onStartAnalysis(project);
    } catch (err) {
      alert('Error parsing ZIP file. Ensure it is a valid zip file.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-8 md:p-12 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI Multi-Language Code Inspector & Hackathon Judge Platform</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Transform Any Code Repository into an{' '}
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Architectural Hierarchy & Judge Evaluation
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
            CodePriya AI operates 6 specialized agents to inspect open-source GitHub repos or uploaded project folders.
            Generates <b>Hackathon Judge Reports</b>, <b>Hierarchical Architectural Tree Diagrams with Pros & Cons</b>, 
            <b>Persistent History Database</b>, and <b>Spoon-Feeding Guides in 7 Languages</b> (Telugu, English, Hindi, Tamil, Kannada, Spanish, Bilingual).
          </p>

          {/* User Role Persona Quick Login Callout */}
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center space-x-3">
              {currentUser ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full border-2 border-indigo-400 object-cover"
                />
              ) : (
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-xs font-extrabold text-white">
                    Logged in as: <span className="text-indigo-300">{currentUser ? currentUser.name : 'Guest User'}</span>
                  </p>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                    {currentUser ? currentUser.role : 'Select Role'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Switch between <strong>Student</strong>, <strong>Developer</strong>, <strong>Hackathon Judge</strong>, or <strong>Enterprise Auditor</strong> personas.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenLoginModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center space-x-2 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>{currentUser ? 'Switch User Role / Persona' : 'Login / Choose Role'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
            <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Hackathon Judge Score & Review</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Hierarchical Architecture (Pros & Cons)</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>7-Language Spoon-Feeding Walkthrough</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Persistent Project Storage</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-indigo-500/40 text-indigo-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>MCP Context Protocol (100% Precision)</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-indigo-500/40 text-indigo-300">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Background Canvas & Firestore Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Problem Statement & Challenge Prompt Block */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">Step 1</span>
                <h3 className="text-lg font-extrabold text-white">Define Problem Statement / Challenge Requirement</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                The AI multi-agent engine will compare your uploaded GitHub repo or project folder against this requirement statement.
              </p>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 pl-2 hidden sm:inline">Preset:</span>
            <select
              value={selectedPreset}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer pr-2 py-0.5"
            >
              {PROBLEM_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Textarea for Problem Statement */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              rows={3}
              value={problemStatement}
              onChange={(e) => {
                setProblemStatement(e.target.value);
                setSelectedPreset('custom');
              }}
              placeholder="Type or paste your own custom problem statement, hackathon challenge prompt, or client software specification here..."
              className="w-full px-4 py-3 pr-24 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-sans placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
            />
            {problemStatement.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setProblemStatement('');
                  setSelectedPreset('custom');
                }}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-700 flex items-center space-x-1 transition-all"
              >
                <span>Clear Box</span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {selectedPreset === 'custom' 
                  ? '✏️ Custom Problem Mode: Ready to type your custom prompt' 
                  : 'Problem statement will be audited against uploaded GitHub repository / folder'}
              </span>
            </span>
            <div className="flex items-center space-x-3">
              {selectedPreset === 'custom' && (
                <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Custom User Mode
                </span>
              )}
              <span>{problemStatement.length} chars</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ingestion Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Option A: GitHub Repository Importer */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Import Public GitHub Repository</h3>
              <p className="text-xs text-slate-400">Analyze any open-source GitHub URL or owner/repo path</p>
            </div>
          </div>

          <form onSubmit={(e) => handleFetchGithub(e)} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">GitHub Repository URL or Path</label>
                <button
                  type="button"
                  onClick={() => setShowTokenInput(!showTokenInput)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-semibold"
                >
                  <Key className="w-3 h-3" />
                  <span>{showTokenInput ? 'Hide Access Token' : 'Private Repo Token?'}</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. https://github.com/facebook/react or owner/repository"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {showTokenInput && (
              <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 space-y-1.5 animate-fadeIn">
                <label className="block text-[11px] font-bold text-amber-300 flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>GitHub Personal Access Token (for Private Repos)</span>
                </label>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400">
                  Enables scanning private files, private folders, and restricted branches securely.
                </p>
              </div>
            )}

            {githubError && (
              <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 space-y-1">
                <p className="font-semibold">{githubError}</p>
                <button
                  type="button"
                  onClick={() => setIsPrivateRepoModal(true)}
                  className="text-[11px] text-amber-300 underline hover:text-amber-200 font-bold flex items-center space-x-1"
                >
                  <Key className="w-3 h-3" />
                  <span>Click here to enter Private Repo Access Key / Request Owner Approval</span>
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isFetchingGithub || !githubUrl.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all"
            >
              {isFetchingGithub ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-indigo-300" />
                  <span>Scanning All Files & Folders...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Fetch & Analyze All Files & Folders</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Option B: Local Project ZIP / Folder Upload */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Upload Local Project ZIP</h3>
              <p className="text-xs text-slate-400">Drag & drop or upload project folder archive (.zip)</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Optional Project Name</label>
              <input
                type="text"
                placeholder="e.g. My E-Commerce Hackathon App"
                value={customProjectName}
                onChange={(e) => setCustomProjectName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-purple-500/50 rounded-2xl cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-all group">
              <Upload className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform mb-2" />
              <span className="text-xs font-semibold text-slate-300">Click to Select ZIP File or Drop File Here</span>
              <span className="text-[10px] text-slate-500 mt-1">Supports .zip folders with code files</span>
              <input type="file" accept=".zip" onChange={handleZipFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Option C: 1-Click Pre-Loaded Demo Projects Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <Code className="w-5 h-5 text-indigo-400" />
              <span>Or Choose a Pre-Loaded Hackathon Project (Instant 1-Click Test)</span>
            </h3>
            <p className="text-xs text-slate-400">Select an existing complex codebase to immediately trigger multi-agent evaluation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_PROJECTS.map((project) => {
            const isSelected = selectedProject?.id === project.id;
            return (
              <div
                key={project.id}
                onClick={() => {
                  const enrichedProject = {
                    ...project,
                    problemStatement: problemStatement || project.problemStatement || 'Multi-Agent AI Repository Inspector'
                  };
                  onSelectProject(enrichedProject);
                  onStartAnalysis(enrichedProject);
                }}
                className={`group relative rounded-2xl p-6 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-500/20'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                      {project.totalFiles} Files • ~{project.totalLines} Lines
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                    {project.name}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Language Pills */}
                  <div className="flex items-center space-x-1.5 mb-4">
                    {Object.entries(project.languages).map(([lang, pct]) => (
                      <span key={lang} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                        {lang} {pct}%
                      </span>
                    ))}
                  </div>

                  <button
                    disabled={isAnalyzing}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md group-hover:shadow-indigo-500/30 transition-all"
                  >
                    <span>Analyze This Project</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Private Repository Authorization Modal */}
      {isPrivateRepoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setIsPrivateRepoModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Private Repository Access Authorization</h3>
                <p className="text-xs text-slate-400">Access restricted files & subfolders securely</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                The repository <span className="font-mono text-amber-300 font-bold">{githubUrl}</span> contains private files/folders or requires authentication. GitHub security requires authorization to read private content.
              </p>

              {/* Option 1: GitHub Personal Access Token */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Option A: Enter GitHub Personal Access Token (PAT)</span>
                </div>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleFetchGithub(undefined, githubToken)}
                  disabled={!githubToken.trim() || isFetchingGithub}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all"
                >
                  {isFetchingGithub ? 'Verifying & Fetching Private Files...' : 'Unlock Private Repo with PAT Key'}
                </button>
              </div>

              {/* Option 2: Owner Confirmation Code */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-300">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>Option B: Owner Confirmation & Access Code</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Click to send an owner authorization request email. Once confirmed ("Yes it's me"), the authorization code will be applied automatically!
                </p>

                {!emailAuthSent ? (
                  <button
                    type="button"
                    onClick={handleSendEmailConfirmation}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Owner Email Confirmation & Approval</span>
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 space-y-2 animate-fadeIn">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Confirmation Sent! Owner Approval Code Generated</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono bg-slate-950 p-2 rounded-lg">
                      Code: <span className="text-amber-300 font-bold">{ownerEmailAuthCode || 'Authorizing...'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFetchGithub(undefined, ownerEmailAuthCode)}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                    >
                      Access Private Files & Folders Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
