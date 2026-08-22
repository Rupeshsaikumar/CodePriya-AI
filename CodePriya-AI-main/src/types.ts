export type SupportedLanguage = 'telugu' | 'english' | 'hindi' | 'tamil' | 'kannada' | 'spanish' | 'bilingual';

export interface ProjectFile {
  path: string;
  name: string;
  size: number;
  language: string;
  content: string;
  lineCount: number;
  complexity?: {
    time: string;
    space: string;
    cyclomatic: number;
  };
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  repositoryUrl?: string;
  uploadType: 'github' | 'folder' | 'demo';
  files: ProjectFile[];
  folders?: { path: string; name: string }[];
  fileTree: Record<string, any>;
  totalFiles: number;
  totalFolders?: number;
  totalLines: number;
  languages: Record<string, number>; // language -> percentage
  problemStatement?: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  iconName: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  currentTask: string;
  summary?: string;
}

export interface QualityMetrics {
  overallHealth: number; // 0-100
  codeQualityScore: number; // 0-100
  securityScore: number; // 0-100
  performanceScore: number; // 0-100
  maintainabilityScore: number; // 0-100
  aiInvolvementPercent: number; // 0-100 (estimated AI vs Human ratio)
  humanCodePercent: number;
  primaryTimeComplexity: string;
  primarySpaceComplexity: string;
  languageBreakdown: { language: string; percentage: number; color: string }[];
}

export interface SecurityAlert {
  id: string;
  severity: 'high' | 'medium' | 'low' | 'critical';
  file: string;
  line?: number;
  title: string;
  description: string;
  recommendation: string;
  cwe?: string;
}

export interface JudgeEvaluation {
  overallGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  totalScore: number; // 0 - 100
  scores: {
    innovation: number;
    codeStructure: number;
    uiUxCompleteness: number;
    technicalDepth: number;
    aiHumanBalance: number;
  };
  verdictTitle: string;
  judgeFeedbackEnglish: string;
  judgeFeedbackTelugu: string;
  judgeFeedbackMultilingual?: Record<string, string>;
  strengths: string[];
  areasForImprovement: string[];
  hackathonRankingRecommendation: string;
  certificateEligible: boolean;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'folder' | 'file' | 'module' | 'service' | 'database' | 'api' | 'ui';
  position3D: { x: number; y: number; z: number };
  connections: string[]; // target node ids
  description: string;
  fileCount?: number;
  linesOfCode?: number;
  techStack?: string;
  advantages?: string[];
  disadvantages?: string[];
}

export interface SpoonFeedStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  targetFolderOrFile: string;
  isNewFile: boolean;
  conceptDescriptionEnglish: string;
  conceptDescriptionTelugu: string;
  multilingualDescriptions?: Record<string, string>;
  codeSnippet: string;
  lineByLineExplanation: { lineRange: string; explanation: string }[];
  optimizationNotes: string;
  keyTakeaways: string[];
}

export interface ProblemStatementMatch {
  requirement: string;
  status: 'fulfilled' | 'partial' | 'missing';
  matchedFiles: string[];
  evidenceSummary: string;
  score: number; // 0-100
}

export interface ProblemStatementAnalysis {
  problemStatement: string;
  overallMatchScore: number; // 0-100%
  matchGrade: 'Perfect Match' | 'Strong Fit' | 'Partial Implementation' | 'Low Match' | 'Mismatch';
  executiveSummary: string;
  fulfilledRequirements: ProblemStatementMatch[];
  missingOrPartialRequirements: ProblemStatementMatch[];
  unrequestedAdditions: string[];
  alignmentRecommendations: string[];
}

export interface AnalysisResult {
  id?: string;
  projectData: ProjectData;
  qualityMetrics: QualityMetrics;
  securityAlerts: SecurityAlert[];
  judgeEvaluation: JudgeEvaluation;
  architectureNodes: ArchitectureNode[];
  spoonFeedSteps: SpoonFeedStep[];
  problemStatementAnalysis?: ProblemStatementAnalysis;
  timestamp: string;
}

export type UserRole = 'student' | 'developer' | 'judge' | 'auditor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organization?: string;
  preferredLanguage?: SupportedLanguage;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentName?: string;
  text: string;
  codeSnippet?: string;
  language?: string;
  timestamp: string;
}

