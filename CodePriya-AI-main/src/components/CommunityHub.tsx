import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Sparkles, 
  Code, 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  Heart, 
  Send, 
  PlusCircle, 
  Search, 
  Filter, 
  Globe, 
  CheckCircle2, 
  Share2, 
  Laptop, 
  BookOpen, 
  Zap, 
  Tag, 
  Cpu,
  Layers,
  Flame
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface CommunityHubProps {
  currentUser: UserProfile | null;
  onOpenLoginModal: () => void;
}

export interface MatchBoxCard {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  organization: string;
  projectTitle: string;
  description: string;
  lookingFor: string[];
  techStack: string[];
  hackathonName: string;
  createdTime: string;
  connectedCount: number;
  isConnectedByMe?: boolean;
}

export interface CommunityChatMessage {
  id: string;
  channelId: 'students' | 'developers' | 'judges' | 'auditors' | 'general';
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  organization: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  content: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  timestamp: string;
  isLikedByMe?: boolean;
}

const INITIAL_CHAT_MESSAGES: CommunityChatMessage[] = [
  {
    id: 'chat-1',
    channelId: 'students',
    authorName: 'Rupesh Sai Kumar',
    authorRole: 'student',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    organization: 'Computer Science Dept',
    content: 'Namaste students! 🎓 Anyone working on HackIndia projects with Gemini 3.6? Check out the Telugu Spoon-Feeding Guide tab for line-by-line code explanation!',
    timestamp: '10:42 AM',
    likes: 12
  },
  {
    id: 'chat-2',
    channelId: 'developers',
    authorName: 'Alex Vance',
    authorRole: 'developer',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    organization: 'TechCorp AI Labs',
    content: '👨‍💻 Developers: Our Express + Vite server now supports MCP Protocol over JSON-RPC 2.0 with AST parsing. Let me know if you want to connect your LLM agents!',
    timestamp: '11:15 AM',
    likes: 19
  },
  {
    id: 'chat-3',
    channelId: 'judges',
    authorName: 'Dr. Anita Sharma',
    authorRole: 'judge',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    organization: 'Global Hackathon Jury Panel',
    content: '⚖️ Official HackIndia Judge Notice: Please ensure your project uses persistent storage (like Firebase Firestore) and handles 429 quota limits cleanly to receive full marks in Architecture!',
    timestamp: '11:30 AM',
    likes: 34
  },
  {
    id: 'chat-4',
    channelId: 'auditors',
    authorName: 'Marcus Sterling',
    authorRole: 'auditor',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    organization: 'Cyber Audit Group',
    content: '🛡️ Security tip: Always keep your API keys server-side in process.env. Never hardcode secrets in client bundles. We inspect secret leak risks in code health scans.',
    timestamp: '12:05 PM',
    likes: 15
  },
  {
    id: 'chat-5',
    channelId: 'general',
    authorName: 'HackIndia Bot',
    authorRole: 'judge',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    organization: 'HackIndia 2026 Admin',
    content: '🚀 Welcome to HackIndia 2026 Community Chat! Connect with Students, Developers, and Judges using match boxes or discuss in role channels.',
    timestamp: '09:00 AM',
    likes: 50
  }
];

const INITIAL_MATCH_BOXES: MatchBoxCard[] = [
  {
    id: 'match-1',
    authorName: 'Rupesh Sai Kumar',
    authorRole: 'student',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    organization: 'Computer Science Dept',
    projectTitle: 'CodePriya AI - Multi-Agent Inspector for HackIndia',
    description: 'Building an automated Gemini 3.6 LLM code auditor with Hackathon Chief Judge Scoring & Telugu Spoon-Feeding Guides. Need a frontend specialist!',
    lookingFor: ['Frontend UI Specialist', 'Gemini API Prompt Engineer'],
    techStack: ['Gemini 3.6', 'React 18', 'Tailwind', 'Express'],
    hackathonName: 'HackIndia 2026',
    createdTime: '10 mins ago',
    connectedCount: 14
  },
  {
    id: 'match-2',
    authorName: 'Alex Vance',
    authorRole: 'developer',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    organization: 'TechCorp AI Labs',
    projectTitle: 'Real-Time MCP Firestore Context Server',
    description: 'Looking for 2 AI Developers & 1 Student intern to integrate JSON-RPC 2.0 Model Context Protocol with live AST parsing for HackIndia.',
    lookingFor: ['Backend Node.js Dev', 'Firestore Rules Architect'],
    techStack: ['MCP Protocol', 'Node.js', 'Firestore', 'TypeScript'],
    hackathonName: 'HackIndia 2026',
    createdTime: '25 mins ago',
    connectedCount: 8
  },
  {
    id: 'match-3',
    authorName: 'Dr. Anita Sharma',
    authorRole: 'judge',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    organization: 'Global Hackathon Jury Panel',
    projectTitle: 'Office Hours & Pre-Submission Mock Audits',
    description: 'Offering 15-min live judge feedback sessions for HackIndia teams. Connect your project to check AI vs Human code ratio & innovation metrics.',
    lookingFor: ['HackIndia Teams', 'Student Innovators'],
    techStack: ['Judge Evaluation', 'Rubric Audit', 'Code Quality'],
    hackathonName: 'HackIndia 2026',
    createdTime: '1 hour ago',
    connectedCount: 29
  }
];

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Rupesh Sai Kumar',
    authorRole: 'student',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: '🔥 Just deployed CodePriya AI with MCP Server Hub & Gemini 3.6 LLM integration! Telugu spoon-feeding guide is line-by-line accurate. Check it out on HackIndia!',
    tags: ['#HackIndia2026', '#Gemini36', '#TeluguAI', '#CodePriya'],
    likes: 42,
    commentsCount: 9,
    timestamp: '15 mins ago'
  },
  {
    id: 'post-2',
    authorName: 'Dr. Anita Sharma',
    authorRole: 'judge',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    content: '💡 Tip for HackIndia Participants: Judges score higher on Zero Hallucinations, complete error handling, and robust persistence (Firebase Firestore) rather than plain UI prototypes.',
    tags: ['#JudgeTip', '#HackIndia2026', '#CodeQuality'],
    likes: 89,
    commentsCount: 18,
    timestamp: '2 hours ago'
  }
];

export const CommunityHub: React.FC<CommunityHubProps> = ({
  currentUser,
  onOpenLoginModal
}) => {
  const [matchBoxes, setMatchBoxes] = useState<MatchBoxCard[]>(() => {
    const saved = localStorage.getItem('codepriya_matchBoxes');
    return saved ? JSON.parse(saved) : INITIAL_MATCH_BOXES;
  });

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('codepriya_communityPosts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [chatMessages, setChatMessages] = useState<CommunityChatMessage[]>(() => {
    const saved = localStorage.getItem('codepriya_communityChatMessages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [activeTab, setActiveTab] = useState<'match' | 'feed' | 'chat' | 'create'>('match');
  const [activeChannel, setActiveChannel] = useState<'students' | 'developers' | 'judges' | 'auditors' | 'general'>('students');
  const [newChatMessage, setNewChatMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  // Form states for creating new Match Box card
  const [newProjectTitle, setNewProjectTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newLookingFor, setNewLookingFor] = useState<string>('');
  const [newTechStack, setNewTechStack] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('codepriya_matchBoxes', JSON.stringify(matchBoxes));
  }, [matchBoxes]);

  useEffect(() => {
    localStorage.setItem('codepriya_communityPosts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('codepriya_communityChatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    const msg: CommunityChatMessage = {
      id: `chat-${Date.now()}`,
      channelId: activeChannel,
      authorName: currentUser?.name || 'CodePriya Community Member',
      authorRole: currentUser?.role || 'student',
      authorAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      organization: currentUser?.organization || 'HackIndia Member',
      content: newChatMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      likes: 0
    };

    setChatMessages([...chatMessages, msg]);
    setNewChatMessage('');
  };

  const handleLikeChatMessage = (id: string) => {
    setChatMessages(prev => prev.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m));
  };

  const getRoleSymbolBadge = (role: UserRole) => {
    switch (role) {
      case 'student':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <GraduationCap className="w-3 h-3 text-emerald-400" />
            <span>🎓 Student Developer</span>
          </span>
        );
      case 'developer':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Code className="w-3 h-3 text-indigo-400" />
            <span>👨‍💻 Software Engineer</span>
          </span>
        );
      case 'judge':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Award className="w-3 h-3 text-amber-400" />
            <span>⚖️ Hackathon Chief Judge</span>
          </span>
        );
      case 'auditor':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <ShieldCheck className="w-3 h-3 text-rose-400" />
            <span>🛡️ Enterprise Security Lead</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Users className="w-3 h-3 text-purple-400" />
            <span>🚀 Hackathon Innovator</span>
          </span>
        );
    }
  };

  const handleConnectMatch = (id: string) => {
    setMatchBoxes(prev => prev.map(box => {
      if (box.id === id) {
        const isConnected = !box.isConnectedByMe;
        return {
          ...box,
          isConnectedByMe: isConnected,
          connectedCount: isConnected ? box.connectedCount + 1 : box.connectedCount - 1
        };
      }
      return box;
    }));
  };

  const handleLikePost = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const liked = !p.isLikedByMe;
        return {
          ...p,
          isLikedByMe: liked,
          likes: liked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  const handleCreateMatchBox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || !newDescription.trim()) return;

    const newBox: MatchBoxCard = {
      id: `match-${Date.now()}`,
      authorName: currentUser?.name || 'Anonymous Innovator',
      authorRole: currentUser?.role || 'student',
      authorAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      organization: currentUser?.organization || 'HackIndia Participant',
      projectTitle: newProjectTitle.trim(),
      description: newDescription.trim(),
      lookingFor: newLookingFor ? newLookingFor.split(',').map(s => s.trim()) : ['AI Specialist', 'Frontend Dev'],
      techStack: newTechStack ? newTechStack.split(',').map(s => s.trim()) : ['Gemini 3.6', 'React', 'TypeScript'],
      hackathonName: 'HackIndia 2026',
      createdTime: 'Just now',
      connectedCount: 1,
      isConnectedByMe: true
    };

    setMatchBoxes([newBox, ...matchBoxes]);
    setNewProjectTitle('');
    setNewDescription('');
    setNewLookingFor('');
    setNewTechStack('');
    setActiveTab('match');
  };

  const handleCreateCommunityPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: currentUser?.name || 'CodePriya Innovator',
      authorRole: currentUser?.role || 'developer',
      authorAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      content: newPostContent.trim(),
      tags: ['#HackIndia2026', '#CodePriyaAI', '#GeminiLLM'],
      likes: 1,
      commentsCount: 0,
      timestamp: 'Just now',
      isLikedByMe: true
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setActiveTab('feed');
  };

  const filteredMatchBoxes = matchBoxes.filter(box => {
    const matchesQuery = box.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         box.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         box.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || box.authorRole === selectedRoleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="space-y-6 text-white animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-purple-950/80 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Globe className="w-7 h-7 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                HackIndia & AI Developer Hub
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Live Role Sync Active</span>
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Community Matchmaking & Hackathon Teammate Hub
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Connect with fellow developers, students, and hackathon judges across India. Match skills, find project collaborators, and share Gemini LLM innovations.
            </p>
          </div>
        </div>

        {/* Current User Role Identity Pill */}
        <div className="bg-slate-950/90 p-4 rounded-2xl border border-indigo-500/30 space-y-2 shrink-0">
          <div className="text-xs text-slate-400 font-medium">Logged in Active Persona:</div>
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full border-2 border-indigo-400 object-cover"
              />
              <div>
                <p className="text-xs font-extrabold text-white">{currentUser.name}</p>
                <div className="mt-0.5">{getRoleSymbolBadge(currentUser.role)}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              <span>Login to Create Match Boxes</span>
            </button>
          )}
        </div>
      </div>

      {/* Role Symbols Legend Card */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/20 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-emerald-300 text-xs">🎓 Student / Learner</div>
            <div className="text-[10px] text-slate-400">Spoon-feeding guides & learning</div>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-indigo-500/20 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-indigo-300 text-xs">👨‍💻 Software Developer</div>
            <div className="text-[10px] text-slate-400">Architecture & fullstack code</div>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/20 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-amber-300 text-xs">⚖️ Hackathon Judge</div>
            <div className="text-[10px] text-slate-400">Jury scoring & rubric feedback</div>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-rose-500/20 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-rose-300 text-xs">🛡️ Enterprise Lead</div>
            <div className="text-[10px] text-slate-400">Security audits & compliance</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('match')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'match'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-300" />
            <span>Match Boxes ({filteredMatchBoxes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            <span>Live Role Communities Chat</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-400/30 text-emerald-200 font-extrabold border border-emerald-400/40">
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'feed'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-purple-300" />
            <span>HackIndia Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>Post Match Box</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search tech stack or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="relative">
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-bold rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="student">🎓 Students</option>
              <option value="developer">👨‍💻 Developers</option>
              <option value="judge">⚖️ Judges</option>
              <option value="auditor">🛡️ Auditors</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content View Switcher */}
      {activeTab === 'match' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMatchBoxes.map((box) => (
            <div
              key={box.id}
              className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all shadow-xl space-y-4 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-3">
                {/* Author Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={box.authorAvatar}
                      alt={box.authorName}
                      className="w-11 h-11 rounded-full border-2 border-indigo-400 object-cover shadow-md"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                        {box.authorName}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">{box.organization}</p>
                      <div className="mt-1">{getRoleSymbolBadge(box.authorRole)}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    {box.hackathonName}
                  </span>
                </div>

                {/* Project Title & Description */}
                <div>
                  <h3 className="text-base font-extrabold text-indigo-200 mt-1">
                    {box.projectTitle}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {box.description}
                  </p>
                </div>

                {/* Looking For Badge Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Looking For Teammates:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {box.lookingFor.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1"
                      >
                        <UserPlus className="w-2.5 h-2.5 text-indigo-400" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Tech Stack:</span>
                  <div className="flex flex-wrap gap-1">
                    {box.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Match Connect Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-400">
                  <b>{box.connectedCount}</b> Hackers Matched
                </span>

                <button
                  onClick={() => handleConnectMatch(box.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md ${
                    box.isConnectedByMe
                      ? 'bg-emerald-600 text-white border border-emerald-400'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
                  }`}
                >
                  {box.isConnectedByMe ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Request Sent!</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Connect / Match</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Role Community Chat View */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-slate-900/90 rounded-3xl border border-slate-800 p-4 md:p-6 shadow-2xl">
          {/* Left Column: Role Channel Selector */}
          <div className="lg:col-span-1 space-y-3 border-b lg:border-b-0 lg:border-r border-slate-800 pb-4 lg:pb-0 lg:pr-4">
            <div className="text-xs font-mono font-extrabold uppercase text-slate-400 tracking-wider px-2">
              Role Channels ({['students', 'developers', 'judges', 'auditors', 'general'].length})
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => setActiveChannel('students')}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center space-x-3 border ${
                  activeChannel === 'students'
                    ? 'bg-emerald-950/80 border-emerald-500/50 shadow-lg text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold flex items-center justify-between">
                    <span>🎓 #students-hub</span>
                    <span className="text-[9px] font-mono bg-emerald-500/20 px-1.5 py-0.2 rounded text-emerald-300">
                      {chatMessages.filter(m => m.channelId === 'students').length}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Spoon-feeding & beginner QA</div>
                </div>
              </button>

              <button
                onClick={() => setActiveChannel('developers')}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center space-x-3 border ${
                  activeChannel === 'developers'
                    ? 'bg-indigo-950/80 border-indigo-500/50 shadow-lg text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                  <Code className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold flex items-center justify-between">
                    <span>👨‍💻 #developers-lounge</span>
                    <span className="text-[9px] font-mono bg-indigo-500/20 px-1.5 py-0.2 rounded text-indigo-300">
                      {chatMessages.filter(m => m.channelId === 'developers').length}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">React, Node, Express, MCP</div>
                </div>
              </button>

              <button
                onClick={() => setActiveChannel('judges')}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center space-x-3 border ${
                  activeChannel === 'judges'
                    ? 'bg-amber-950/80 border-amber-500/50 shadow-lg text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold flex items-center justify-between">
                    <span>⚖️ #judges-portal</span>
                    <span className="text-[9px] font-mono bg-amber-500/20 px-1.5 py-0.2 rounded text-amber-300">
                      {chatMessages.filter(m => m.channelId === 'judges').length}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Jury scoring & feedback</div>
                </div>
              </button>

              <button
                onClick={() => setActiveChannel('auditors')}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center space-x-3 border ${
                  activeChannel === 'auditors'
                    ? 'bg-rose-950/80 border-rose-500/50 shadow-lg text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold flex items-center justify-between">
                    <span>🛡️ #auditors-sec-room</span>
                    <span className="text-[9px] font-mono bg-rose-500/20 px-1.5 py-0.2 rounded text-rose-300">
                      {chatMessages.filter(m => m.channelId === 'auditors').length}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Security scans & OWASP</div>
                </div>
              </button>

              <button
                onClick={() => setActiveChannel('general')}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center space-x-3 border ${
                  activeChannel === 'general'
                    ? 'bg-purple-950/80 border-purple-500/50 shadow-lg text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold flex items-center justify-between">
                    <span>🚀 #hackindia-general</span>
                    <span className="text-[9px] font-mono bg-purple-500/20 px-1.5 py-0.2 rounded text-purple-300">
                      {chatMessages.filter(m => m.channelId === 'general').length}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">All hackathon participants</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Area: Active Channel Live Chat Stream */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-4 min-h-[450px]">
            {/* Active Channel Header */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">
                  {activeChannel === 'students' && '🎓'}
                  {activeChannel === 'developers' && '👨‍💻'}
                  {activeChannel === 'judges' && '⚖️'}
                  {activeChannel === 'auditors' && '🛡️'}
                  {activeChannel === 'general' && '🚀'}
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-white capitalize">
                    #{activeChannel} Live Community Chat
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Real-time conversation between HackIndia members with verified role badges
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Stream</span>
              </span>
            </div>

            {/* Chat Messages Container */}
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {chatMessages.filter(m => m.channelId === activeChannel).length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-medium">
                  No messages in #{activeChannel} yet. Be the first to start the conversation!
                </div>
              ) : (
                chatMessages.filter(m => m.channelId === activeChannel).map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={msg.authorAvatar}
                          alt={msg.authorName}
                          className="w-8 h-8 rounded-full border border-indigo-400 object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-extrabold text-white">{msg.authorName}</span>
                            {getRoleSymbolBadge(msg.authorRole)}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{msg.organization}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed pl-10 font-sans">
                      {msg.content}
                    </p>

                    <div className="flex items-center justify-end space-x-2 pl-10 pt-1">
                      <button
                        onClick={() => handleLikeChatMessage(msg.id)}
                        className="text-[10px] font-mono text-slate-400 hover:text-pink-400 flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition-colors"
                      >
                        <Heart className="w-3 h-3 text-pink-400" />
                        <span>{msg.likes}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Message Input Form */}
            <form onSubmit={handleSendChatMessage} className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder={`Type message in #${activeChannel} as ${currentUser?.name || 'Guest'}...`}
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                className="flex-1 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
      {activeTab === 'feed' && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {/* Quick Post Box */}
          <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
            <textarea
              rows={2}
              placeholder="Share your HackIndia idea, Gemini API question, or project showcase..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="text-indigo-400 font-bold">Posting as:</span>
                <span>{currentUser?.name || 'Guest User'}</span>
              </div>
              <button
                onClick={handleCreateCommunityPost}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Post</span>
              </button>
            </div>
          </div>

          {/* Posts List */}
          {posts.map((post) => (
            <div key={post.id} className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full border border-indigo-400 object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-white">{post.authorName}</h4>
                    <div className="mt-0.5">{getRoleSymbolBadge(post.authorRole)}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{post.timestamp}</span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">{post.content}</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center space-x-1 font-bold transition-colors ${
                    post.isLikedByMe ? 'text-pink-400' : 'hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLikedByMe ? 'fill-pink-400' : ''}`} />
                  <span>{post.likes} Likes</span>
                </button>

                <div className="flex items-center space-x-1 font-bold">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>{post.commentsCount} Comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create New Match Box Tab */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-2xl">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Create a Teammate Match Box Card</h3>
              <p className="text-xs text-slate-400">Post your project idea or skills to find HackIndia collaborators</p>
            </div>
          </div>

          <form onSubmit={handleCreateMatchBox} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Project / Hackathon Title</label>
              <input
                type="text"
                required
                placeholder="e.g. CodePriya AI - Multi-Agent Inspector"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Project Description & Goal</label>
              <textarea
                rows={3}
                required
                placeholder="Describe what your project does and what kind of teammate you are searching for..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Looking For (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Gemini AI Specialist, Frontend Dev"
                  value={newLookingFor}
                  onChange={(e) => setNewLookingFor(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Gemini 3.6, React, Firestore"
                  value={newTechStack}
                  onChange={(e) => setNewTechStack(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Publish Match Box Card to HackIndia Hub</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
