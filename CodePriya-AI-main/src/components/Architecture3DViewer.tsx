import React, { useState } from 'react';
import { 
  Cpu, Database, Server, Layers, Code, Zap, ZoomIn, ZoomOut, RefreshCw, 
  ArrowRight, GitFork, ThumbsUp, ThumbsDown, ShieldCheck, CheckCircle, 
  XCircle, FolderTree, FileCode, ChevronRight, Box, Activity, Sparkles
} from 'lucide-react';
import { ArchitectureNode } from '../types';

interface Architecture3DViewerProps {
  nodes: ArchitectureNode[];
  projectName: string;
}

export const Architecture3DViewer: React.FC<Architecture3DViewerProps> = ({
  nodes,
  projectName
}) => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(nodes[0] || null);
  const [viewMode, setViewMode] = useState<'tree' | 'graph' | 'isometric'>('tree');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNodes = filterType === 'all' ? nodes : nodes.filter(n => n.type === filterType);

  // Group nodes into Hierarchical Architecture Tree Tiers
  const hierarchyLevels = [
    {
      levelNumber: 1,
      title: 'Tier 1: Client UI & Presentation Layer',
      badge: 'Frontend Entrypoint',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      accentColor: 'border-pink-500/50 bg-pink-950/20 text-pink-300',
      subtitle: 'React Single Page Application, responsive components, user interaction flows',
      nodes: nodes.filter(n => n.type === 'ui' || n.type === 'module')
    },
    {
      levelNumber: 2,
      title: 'Tier 2: Server API & Ingestion Gateway',
      badge: 'REST Router / Express',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      accentColor: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
      subtitle: 'Express backend endpoints, repo fetchers, payload validation, ZIP file unpackers',
      nodes: nodes.filter(n => n.type === 'api')
    },
    {
      levelNumber: 3,
      title: 'Tier 3: Core AI Multi-Agent Engine',
      badge: 'Gemini 3.6 / Evaluator',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      accentColor: 'border-indigo-500/50 bg-indigo-950/20 text-indigo-300',
      subtitle: 'Code inspection engine, AST analyzers, Judge score generator, Gemini 3.6 SDK',
      nodes: nodes.filter(n => n.type === 'service')
    },
    {
      levelNumber: 4,
      title: 'Tier 4: Database & Persistence Layer',
      badge: 'Firestore / Disk DB',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      accentColor: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
      subtitle: 'Firestore cloud database & local JSON store for persistent history logs',
      nodes: nodes.filter(n => n.type === 'database')
    }
  ].filter(level => level.nodes.length > 0);

  // Fallback if type filtering leaves levels empty
  if (hierarchyLevels.length === 0) {
    hierarchyLevels.push({
      levelNumber: 1,
      title: 'Tier 1: Core System Architecture Tree',
      badge: 'Primary Modules',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      accentColor: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300',
      subtitle: 'Parsed code modules and components in project hierarchy',
      nodes: nodes
    });
  }

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'api': return 'from-amber-500/20 to-orange-600/20 border-amber-500/40 text-amber-300 hover:border-amber-400';
      case 'service': return 'from-indigo-600/20 to-purple-600/20 border-indigo-500/40 text-indigo-300 hover:border-indigo-400';
      case 'database': return 'from-emerald-600/20 to-teal-600/20 border-emerald-500/40 text-emerald-300 hover:border-emerald-400';
      case 'module': return 'from-cyan-600/20 to-blue-600/20 border-cyan-500/40 text-cyan-300 hover:border-cyan-400';
      case 'ui': return 'from-pink-600/20 to-rose-600/20 border-pink-500/40 text-pink-300 hover:border-pink-400';
      default: return 'from-slate-800 to-slate-900 border-slate-700 text-slate-300';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Server className="w-4 h-4 text-amber-300" />;
      case 'service': return <Cpu className="w-4 h-4 text-indigo-300" />;
      case 'database': return <Database className="w-4 h-4 text-emerald-300" />;
      case 'module': return <Layers className="w-4 h-4 text-cyan-300" />;
      case 'ui': return <Code className="w-4 h-4 text-pink-300" />;
      default: return <Zap className="w-4 h-4 text-slate-300" />;
    }
  };

  // Pros/Cons helper
  const getNodeAdvantages = (node: ArchitectureNode): string[] => {
    if (node.advantages && node.advantages.length > 0) return node.advantages;
    if (node.type === 'api') return ['Decoupled REST API contract', 'Fast JSON serialization', 'Centralized error handler middleware'];
    if (node.type === 'service') return ['High cohesion and single responsibility', 'Asynchronous non-blocking execution', 'Easy to unit test in isolation'];
    if (node.type === 'database') return ['Persistent storage across restarts', 'Low read latencies', 'ACID compliance for critical data'];
    if (node.type === 'ui') return ['Responsive layout adapting across viewports', 'Modular component reuse', 'Fast state updates using React hooks'];
    return ['Modular abstraction', 'Clean interface boundary', 'Low cyclomatic complexity'];
  };

  const getNodeDisadvantages = (node: ArchitectureNode): string[] => {
    if (node.disadvantages && node.disadvantages.length > 0) return node.disadvantages;
    if (node.type === 'api') return ['Slight network latency overhead on remote calls', 'Requires strict payload schema validation'];
    if (node.type === 'service') return ['Memory footprint scales with parallel requests', 'Requires graceful exception catching'];
    if (node.type === 'database') return ['Disk write I/O lock overhead under heavy concurrency', 'Requires indexing for large query sets'];
    if (node.type === 'ui') return ['Client-side render overhead on low-end devices', 'Requires memoization for large lists'];
    return ['Initial setup overhead', 'Requires explicit type definition maintenance'];
  };

  return (
    <div className="space-y-6 animate-fadeIn text-white">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-2 border border-cyan-500/30">
            <FolderTree className="w-3.5 h-3.5 text-cyan-300" />
            <span>Visual Tree Architecture Diagram & Module Inspector</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Architecture Tree for <span className="text-cyan-400">{projectName}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tree-structured component hierarchy diagram with layer color-coding, module breakdown, pros & cons, and connections.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Switcher: Visual Tree vs Node Graph vs Blueprint */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                viewMode === 'tree' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5 text-cyan-300" />
              <span>Tree Diagram View</span>
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                viewMode === 'graph' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Node Graph</span>
            </button>
            <button
              onClick={() => setViewMode('isometric')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                viewMode === 'isometric' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Blueprint Stack</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Architecture View */}
        <div className="lg:col-span-2 space-y-6">
          {viewMode === 'tree' ? (
            /* VISUAL CARD TREE ARCHITECTURE DIAGRAM */
            <div className="bg-slate-950 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
              
              {/* TREE ROOT HEADER CARD */}
              <div className="relative z-10 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-5 rounded-2xl border border-cyan-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                    <FolderTree className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        System Architecture Root
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Parsed & Verified</span>
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white mt-1">
                      {projectName} • Project Root Hierarchy
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono text-slate-300 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span><b>{nodes.length}</b> Architecture Modules</span>
                </div>
              </div>

              {/* TREE BRANCH CONNECTOR ROOT LINE */}
              <div className="flex justify-center -my-4 relative z-0">
                <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-indigo-500 animate-pulse" />
              </div>

              {/* HIERARCHICAL TREE BRANCH TIERS */}
              <div className="space-y-8 relative z-10">
                {hierarchyLevels.map((lvl, index) => (
                  <div key={lvl.levelNumber} className="relative">
                    {/* Connecting Vertical Line between Levels */}
                    {index < hierarchyLevels.length - 1 && (
                      <div className="absolute left-6 top-16 bottom-0 w-1 bg-gradient-to-b from-cyan-500/60 via-indigo-500/40 to-slate-800 pointer-events-none z-0" />
                    )}

                    <div className="relative z-10 space-y-4">
                      {/* Level Title Header Card */}
                      <div className="flex items-center justify-between bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-md">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-xs shadow-md ${lvl.badgeColor}`}>
                            L{lvl.levelNumber}
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                              <span>{lvl.title}</span>
                            </h3>
                            <p className="text-[11px] text-slate-400">{lvl.subtitle}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg border hidden sm:inline-block ${lvl.badgeColor}`}>
                          {lvl.badge}
                        </span>
                      </div>

                      {/* Level Nodes Grid (Visual Image Cards) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 md:pl-10">
                        {lvl.nodes.map((node, nodeIdx) => {
                          const isSelected = selectedNode?.id === node.id;
                          return (
                            <div
                              key={node.id}
                              onClick={() => setSelectedNode(node)}
                              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer bg-slate-900/80 shadow-lg group relative overflow-hidden ${
                                isSelected ? 'ring-2 ring-cyan-400 scale-[1.02] bg-slate-900 border-cyan-400 shadow-cyan-500/20' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                              }`}
                            >
                              {/* Visual Top Decorative Gradient Strip */}
                              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getNodeColor(node.type)}`} />

                              <div className="flex items-start justify-between mb-2 pt-1">
                                <div className="flex items-center space-x-2.5">
                                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                                    {getNodeIcon(node.type)}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-extrabold text-white group-hover:text-cyan-300 transition-colors flex items-center space-x-1.5">
                                      <span>{node.label}</span>
                                    </h4>
                                    <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[180px]">
                                      {node.description ? node.description.slice(0, 35) + '...' : node.label}
                                    </span>
                                  </div>
                                </div>

                                <span className="text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                                  {node.type}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-300 line-clamp-2 my-2.5 leading-relaxed bg-slate-950/60 p-2 rounded-xl border border-slate-800/60 font-mono">
                                {node.description}
                              </p>

                              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                                <span className="flex items-center space-x-1 text-slate-300">
                                  <FileCode className="w-3 h-3 text-cyan-400" />
                                  <span>{node.techStack || 'TypeScript'}</span>
                                </span>

                                <span className="text-cyan-400 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform font-bold">
                                  <span>Inspect Pros/Cons</span>
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : viewMode === 'graph' ? (
            /* NODE GRAPH CANVAS VIEW */
            <div className="bg-slate-950 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl min-h-[500px] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                  Interactive Node Canvas Perspective
                </span>
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2))} className="p-1.5 hover:bg-slate-800 rounded text-slate-300"><ZoomIn className="w-4 h-4" /></button>
                  <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))} className="p-1.5 hover:bg-slate-800 rounded text-slate-300"><ZoomOut className="w-4 h-4" /></button>
                  <button onClick={() => setZoomLevel(1)} className="p-1.5 hover:bg-slate-800 rounded text-slate-300"><RefreshCw className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="my-auto py-8 flex flex-wrap items-center justify-center gap-6 transition-transform duration-300" style={{ transform: `scale(${zoomLevel})` }}>
                {filteredNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all w-60 bg-gradient-to-br ${getNodeColor(node.type)} ${
                        isSelected ? 'ring-2 ring-cyan-400 scale-105' : 'hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-1.5 rounded-lg bg-slate-950">{getNodeIcon(node.type)}</div>
                        <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-slate-950">{node.type}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1">{node.label}</h4>
                      <p className="text-[11px] text-slate-300 line-clamp-2">{node.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ISOMETRIC BLUEPRINT STACK VIEW */
            <div className="bg-slate-950 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center space-x-2">
                  <Box className="w-5 h-5 text-cyan-400 animate-bounce" />
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    3D Layered Isometric Architecture Blueprint
                  </span>
                </div>
              </div>

              <div className="relative py-8 px-4 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 rounded-2xl border border-slate-800/60 overflow-hidden flex flex-col items-center justify-center min-h-[460px]">
                <div className="w-full max-w-xl space-y-6">
                  {hierarchyLevels.map((lvl) => (
                    <div key={lvl.levelNumber} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                        <span>{lvl.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">Layer {lvl.levelNumber}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {lvl.nodes.map(n => (
                          <div key={n.id} onClick={() => setSelectedNode(n)} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 cursor-pointer hover:border-cyan-400 truncate font-mono">
                            {n.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM-WIDE ADVANTAGES & DISADVANTAGES CARD */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Overall Architecture Advantages & Trade-Offs (Pros & Cons)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Overall Advantages */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-xs">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Key Architectural Advantages (Pros)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc marker:text-emerald-400">
                  <li>Clear multi-tier separation of concerns between UI, Express router, and AI Agents.</li>
                  <li>Loose coupling facilitates fast unit testing and easy replacement of modules.</li>
                  <li>Persistent disk & memory storage ensures zero data loss across restarts.</li>
                  <li>Asynchronous non-blocking AI pipeline prevents UI freezing during analysis.</li>
                </ul>
              </div>

              {/* Overall Disadvantages */}
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-xs">
                  <ThumbsDown className="w-4 h-4" />
                  <span>System Disadvantages & Trade-Offs (Cons)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc marker:text-amber-400">
                  <li>Large ZIP file extractions require sufficient RAM during parsing.</li>
                  <li>Single Node.js runtime process requires load balancing for high-concurrency production deployments.</li>
                  <li>Requires valid Gemini API key for real-time deep AI code reviews.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Selected Module Inspector + Specific Pros & Cons */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-5">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-extrabold uppercase text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                    {selectedNode.type}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{selectedNode.label}</h3>
                </div>
              </div>

              <div className="space-y-4">
                {/* Module Description */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Module Function</span>
                  <p className="text-xs text-slate-200 leading-relaxed">{selectedNode.description}</p>
                </div>

                {/* Tech Stack */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400">Tech Stack / Engine</span>
                  <div className="text-xs font-mono text-cyan-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    {selectedNode.techStack || 'TypeScript / Node.js'}
                  </div>
                </div>

                {/* Module-Specific Advantages (Pros) */}
                <div className="bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Module Advantages (Pros)</span>
                  </span>
                  <ul className="text-xs text-slate-200 space-y-1 pl-4 list-disc marker:text-emerald-400">
                    {getNodeAdvantages(selectedNode).map((pro, idx) => (
                      <li key={idx}>{pro}</li>
                    ))}
                  </ul>
                </div>

                {/* Module-Specific Disadvantages (Cons) */}
                <div className="bg-amber-950/30 p-4 rounded-2xl border border-amber-500/30 space-y-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                    <XCircle className="w-4 h-4 text-amber-400" />
                    <span>Module Disadvantages & Trade-offs (Cons)</span>
                  </span>
                  <ul className="text-xs text-slate-200 space-y-1 pl-4 list-disc marker:text-amber-400">
                    {getNodeDisadvantages(selectedNode).map((con, idx) => (
                      <li key={idx}>{con}</li>
                    ))}
                  </ul>
                </div>

                {/* Connections */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400">Dependencies & Connections</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.connections && selectedNode.connections.length > 0 ? (
                      selectedNode.connections.map((connId) => (
                        <span key={connId} className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                          → {connId}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">Root / Independent Component</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a module from the hierarchy on the left to inspect detailed Pros and Cons.
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 mt-4">
            💡 <b className="text-slate-300 font-semibold">Pro Tip:</b> Maintaining strict boundary interfaces between Tier 2 API routers and Tier 3 AI Services prevents cascade failures.
          </div>
        </div>
      </div>
    </div>
  );
};
