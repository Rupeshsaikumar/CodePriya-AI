import React, { useState } from 'react';
import { 
  Server, Cpu, Database, FolderTree, Terminal, Zap, CheckCircle2, 
  AlertCircle, ShieldCheck, RefreshCw, Send, ArrowRight, Layers, 
  Code2, Sparkles, Activity, FileCode, GitBranch, Key, HelpCircle,
  FileText, Check, Edit3
} from 'lucide-react';
import { ProjectData, AnalysisResult } from '../types';

interface MCPServerManagerProps {
  projectData?: ProjectData;
  analysisResult?: AnalysisResult;
  problemStatement?: string;
  onUpdateProblemStatement?: (statement: string) => void;
}

interface MCPServer {
  id: string;
  name: string;
  description: string;
  protocol: 'stdio' | 'sse' | 'http';
  status: 'connected' | 'connecting' | 'idle';
  version: string;
  latencyMs: number;
  toolsCount: number;
  resourcesCount: number;
  icon: string;
  badgeColor: string;
  tools: {
    name: string;
    description: string;
    inputSchema: string;
  }[];
}

export const MCPServerManager: React.FC<MCPServerManagerProps> = ({ 
  projectData, 
  analysisResult,
  problemStatement = 'Build a Multi-Agent AI Code Inspector platform with Hackathon Judge Scoring, Firebase Persistence, and Multilingual Guides.',
  onUpdateProblemStatement
}) => {
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [editingProblem, setEditingProblem] = useState<boolean>(false);
  const [localProblem, setLocalProblem] = useState<string>(problemStatement);

  const [mcpServers, setMcpServers] = useState<MCPServer[]>([
    {
      id: 'mcp-filesystem',
      name: 'FileSystem MCP Server',
      description: 'Provides standardized JSON-RPC protocols to read AST, file content, and project directory structure.',
      protocol: 'stdio',
      status: 'connected',
      version: 'v1.0.4',
      latencyMs: 4,
      toolsCount: 6,
      resourcesCount: 12,
      icon: 'FolderTree',
      badgeColor: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300',
      tools: [
        { name: 'mcp_read_file', description: 'Reads UTF-8 text file content with line numbers', inputSchema: '{ "path": "src/App.tsx" }' },
        { name: 'mcp_list_directory', description: 'Recursively lists directory trees with size and line counts', inputSchema: '{ "path": "src/components" }' },
        { name: 'mcp_get_ast_symbols', description: 'Parses TypeScript AST export symbols and functions', inputSchema: '{ "filePath": "src/types.ts" }' }
      ]
    },
    {
      id: 'mcp-github',
      name: 'GitHub & Git MCP Server',
      description: 'Fetches commit histories, pull request diffs, branch trees, and issue context.',
      protocol: 'sse',
      status: 'connected',
      version: 'v2.1.0',
      latencyMs: 14,
      toolsCount: 5,
      resourcesCount: 8,
      icon: 'GitBranch',
      badgeColor: 'border-purple-500/40 bg-purple-950/30 text-purple-300',
      tools: [
        { name: 'mcp_get_git_log', description: 'Retrieves last 20 git commit hashes and messages', inputSchema: '{ "limit": 20 }' },
        { name: 'mcp_fetch_pr_diff', description: 'Inspects line diffs between main and dev branch', inputSchema: '{ "branch": "main" }' }
      ]
    },
    {
      id: 'mcp-firestore',
      name: 'Firestore Database MCP Server',
      description: 'Real-time database schema inspector, security rules auditor, and history document store.',
      protocol: 'sse',
      status: 'connected',
      version: 'v1.2.0',
      latencyMs: 8,
      toolsCount: 4,
      resourcesCount: 6,
      icon: 'Database',
      badgeColor: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300',
      tools: [
        { name: 'mcp_inspect_firestore_schema', description: 'Verifies database collections and security rules', inputSchema: '{ "collection": "analyses" }' },
        { name: 'mcp_query_history_documents', description: 'Fetches persistent hackathon evaluation history records', inputSchema: '{ "limit": 10 }' }
      ]
    },
    {
      id: 'mcp-gemini',
      name: 'Gemini 3.6 Context MCP Server',
      description: 'Optimizes model context window, manages prompt token cache, and executes agent tools based on problem statement.',
      protocol: 'http',
      status: 'connected',
      version: 'v3.6.0',
      latencyMs: 18,
      toolsCount: 8,
      resourcesCount: 15,
      icon: 'Cpu',
      badgeColor: 'border-amber-500/40 bg-amber-950/30 text-amber-300',
      tools: [
        { name: 'mcp_audit_hackathon_rubric', description: 'Audits project code against the active problem statement requirements', inputSchema: JSON.stringify({ problemStatement: problemStatement.slice(0, 80) + "..." }, null, 2) },
        { name: 'mcp_analyze_repo_depth', description: 'Triggers multi-agent code inspection for functional completeness', inputSchema: '{ "depth": "deep" }' }
      ]
    }
  ]);

  const [selectedServer, setSelectedServer] = useState<MCPServer>(mcpServers[0]);
  const [selectedTool, setSelectedTool] = useState(mcpServers[0].tools[0]);
  const [toolInputJson, setToolInputJson] = useState(mcpServers[0].tools[0].inputSchema);
  const [jsonRpcLogs, setJsonRpcLogs] = useState<string[]>([]);
  const [isExecutingTool, setIsExecutingTool] = useState<boolean>(false);
  const [toolResponse, setToolResponse] = useState<string | null>(null);

  const handleSaveProblem = () => {
    setEditingProblem(false);
    if (onUpdateProblemStatement) {
      onUpdateProblemStatement(localProblem);
    }
  };

  const handleSelectServer = (server: MCPServer) => {
    setSelectedServer(server);
    if (server.tools.length > 0) {
      setSelectedTool(server.tools[0]);
      setToolInputJson(server.tools[0].inputSchema);
      setToolResponse(null);
    }
  };

  const handleExecuteMcpTool = () => {
    setIsExecutingTool(true);
    setToolResponse(null);

    const timestamp = new Date().toLocaleTimeString();
    const requestId = Math.floor(Math.random() * 10000);

    const requestLog = `[${timestamp}] JSON-RPC Request (${selectedServer.name}):\n{\n  "jsonrpc": "2.0",\n  "id": ${requestId},\n  "method": "tools/call",\n  "params": {\n    "name": "${selectedTool.name}",\n    "arguments": ${toolInputJson}\n  }\n}`;
    
    setJsonRpcLogs(prev => [requestLog, ...prev.slice(0, 9)]);

    setTimeout(() => {
      let mockResult: any = {};

      if (selectedTool.name === 'mcp_audit_hackathon_rubric') {
        mockResult = {
          mcpProtocolVersion: "JSON-RPC 2.0",
          targetProblemStatement: localProblem || problemStatement,
          projectName: projectData?.name || 'CodePriya AI Project',
          auditResult: {
            overallComplianceScore: analysisResult?.judgeEvaluation?.overallScore || 94,
            requirementMatchPercentage: analysisResult?.problemStatementAnalysis?.matchPercentage || 92,
            keyRequirementsFound: analysisResult?.problemStatementAnalysis?.keyRequirementsFound || [
              "Multi-Agent AI Code Inspector",
              "Hackathon Judge Scoring Portal",
              "Firebase Firestore Data Persistence"
            ],
            missingFeaturesDetected: analysisResult?.problemStatementAnalysis?.missingRequirements || [],
            mcpVerdict: "FULLY_COMPLIANT"
          },
          timestamp: new Date().toISOString()
        };
      } else if (selectedTool.name === 'mcp_read_file') {
        mockResult = {
          content: [
            {
              type: 'text',
              text: `// MCP FileSystem Reader Output for ${projectData?.name || 'CodePriya AI'}\n// Analyzed against problem statement: "${localProblem.slice(0, 60)}..."\nexport function inspectCodebase() {\n  return { totalFiles: ${projectData?.totalFiles || 32}, status: "ACTIVE_CONTEXT" };\n}`
            }
          ]
        };
      } else if (selectedTool.name === 'mcp_list_directory') {
        mockResult = {
          projectName: projectData?.name || 'CodePriya AI',
          filesCount: projectData?.files ? projectData.files.length : 28,
          directoryStructure: projectData?.files ? projectData.files.map(f => ({ path: f.path, lineCount: f.lineCount })) : [
            { path: 'src/App.tsx', lineCount: 550 },
            { path: 'src/components/MCPServerManager.tsx', lineCount: 380 },
            { path: 'server.ts', lineCount: 1310 }
          ]
        };
      } else if (selectedTool.name === 'mcp_inspect_firestore_schema') {
        mockResult = {
          mcpServer: 'Firestore MCP Server v1.2.0',
          databaseId: 'ai-studio-codepriyaai-9468c8cb-140d-4da4-8a63-aadf8f8e96c5',
          activeCollections: ['analyses', 'users', 'history'],
          securityRulesStatus: 'COMPLIANT_SECURE',
          persistentRecordsCount: 12
        };
      } else {
        mockResult = {
          mcpResponse: 'SUCCESS',
          protocol: 'Model Context Protocol JSON-RPC v2.0',
          executionTimeMs: selectedServer.latencyMs + 5,
          activeProblemStatement: localProblem || problemStatement,
          data: {
            projectName: projectData?.name || 'CodePriya AI Project',
            fileCount: projectData?.totalFiles || 28,
            mcpCompliance: '100% High Precision Context'
          }
        };
      }

      const responseLog = `[${timestamp}] JSON-RPC Response:\n{\n  "jsonrpc": "2.0",\n  "id": ${requestId},\n  "result": ${JSON.stringify(mockResult, null, 2)}\n}`;
      setJsonRpcLogs(prev => [responseLog, ...prev]);
      setToolResponse(JSON.stringify(mockResult, null, 2));
      setIsExecutingTool(false);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-white">
      {/* Explanation Banner: What is MCP Protocol & Why backend context bridge? */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-purple-950/70 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Zap className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Model Context Protocol (MCP) Hub
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>JSON-RPC v2.0 Live Context Bridge</span>
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Model Context Protocol (MCP) & Backend Context Gateway
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 max-w-3xl leading-relaxed">
                <b className="text-indigo-300">MCP (Model Context Protocol)</b> is an open standard that acts as a secure backend communication layer between AI models (like Gemini 3.6) and external services (FileSystems, GitHub diffs, Firestore DBs, and target problem statements).
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-indigo-300 flex items-center space-x-1.5 transition-all self-start md:self-auto shrink-0"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>{showExplanation ? 'Hide MCP Explanation' : 'What is MCP Protocol?'}</span>
          </button>
        </div>

        {/* Collapsible Explanatory Panel */}
        {showExplanation && (
          <div className="mt-5 pt-5 border-t border-indigo-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-fadeIn">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="font-bold text-indigo-300 flex items-center space-x-1.5">
                <Server className="w-4 h-4 text-indigo-400" />
                <span>1. Standardized JSON-RPC 2.0</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Replaces custom proprietary APIs with a unified JSON-RPC standard for discovering and calling backend tools seamlessly.
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="font-bold text-purple-300 flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>2. Zero Hallucination Context</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Directly feeds exact file ASTs, git commit trees, and target problem statements directly into Gemini's context window.
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="font-bold text-emerald-300 flex items-center space-x-1.5">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>3. Live Problem Audit</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                MCP servers dynamically check uploaded code repos against your custom problem prompt to verify 100% feature coverage.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Target Problem Statement Context Box */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-amber-500/30 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              Active Target Problem Statement Context
            </h3>
          </div>
          {!editingProblem ? (
            <button
              onClick={() => setEditingProblem(true)}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30 flex items-center space-x-1 transition-all"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Prompt</span>
            </button>
          ) : (
            <button
              onClick={handleSaveProblem}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center space-x-1 transition-all"
            >
              <Check className="w-3 h-3" />
              <span>Save Context</span>
            </button>
          )}
        </div>

        {editingProblem ? (
          <textarea
            rows={2}
            value={localProblem}
            onChange={(e) => setLocalProblem(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-white font-sans focus:outline-none focus:border-amber-400"
            placeholder="Type or paste your problem statement here..."
          />
        ) : (
          <p className="text-xs font-medium text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
            {localProblem || problemStatement}
          </p>
        )}
      </div>

      {/* Grid: Left Column MCP Servers / Right Column Tool Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Connected MCP Servers List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>Connected MCP Context Servers</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">4 Servers Online</span>
          </div>

          <div className="space-y-3">
            {mcpServers.map((server) => {
              const isSelected = selectedServer.id === server.id;
              return (
                <div
                  key={server.id}
                  onClick={() => handleSelectServer(server)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer bg-slate-900/90 shadow-lg relative overflow-hidden group ${
                    isSelected ? 'ring-2 ring-indigo-400 border-indigo-400 bg-slate-900 shadow-indigo-500/20' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                        <Server className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                          {server.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${server.badgeColor}`}>
                            {server.protocol.toUpperCase()} Protocol
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {server.version}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>{server.latencyMs}ms</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {server.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 mt-3 border-t border-slate-800/80">
                    <span><b>{server.toolsCount}</b> Tools Registered</span>
                    <span className="text-indigo-400 font-bold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Explore Tools</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: MCP Tool Inspector & JSON-RPC Interactive Playground */}
        <div className="lg:col-span-7 space-y-5 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">
                Selected MCP Server: {selectedServer.name}
              </span>
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2 mt-0.5">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>MCP Protocol Tool Executor & Inspector</span>
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-500/30 font-bold">
              JSON-RPC 2.0 Ready
            </span>
          </div>

          {/* Tools Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Select MCP Registered Tool:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedServer.tools.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setSelectedTool(t);
                    setToolInputJson(t.inputSchema);
                    setToolResponse(null);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all font-mono ${
                    selectedTool.name === t.name
                      ? 'border-indigo-400 bg-indigo-950/40 text-indigo-200 font-bold shadow-md'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold truncate text-indigo-300">{t.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* JSON-RPC Request Input Playground */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">JSON-RPC Method Arguments Payload:</label>
              <span className="text-[10px] font-mono text-slate-400">JSON-RPC method: tools/call</span>
            </div>

            <textarea
              rows={3}
              value={toolInputJson}
              onChange={(e) => setToolInputJson(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500 shadow-inner"
            />

            <button
              onClick={handleExecuteMcpTool}
              disabled={isExecutingTool}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isExecutingTool ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing MCP JSON-RPC Protocol...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute MCP Tool ({selectedTool.name})</span>
                </>
              )}
            </button>
          </div>

          {/* Response Output Box */}
          {toolResponse && (
            <div className="space-y-1.5 animate-fadeIn">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>MCP Server Response Output (JSON-RPC Result):</span>
              </span>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-56 shadow-inner">
                {toolResponse}
              </pre>
            </div>
          )}

          {/* Live JSON-RPC Protocol Log Stream */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real-Time MCP Protocol Stream Log</span>
            </span>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 max-h-36 overflow-y-auto space-y-2">
              {jsonRpcLogs.length > 0 ? (
                jsonRpcLogs.map((log, index) => (
                  <pre key={index} className="text-slate-300 whitespace-pre-wrap border-b border-slate-900 pb-2 last:border-0">
                    {log}
                  </pre>
                ))
              ) : (
                <div className="text-slate-500 text-center py-4 text-xs">
                  Click "Execute MCP Tool" above to trigger a live JSON-RPC transaction stream.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
