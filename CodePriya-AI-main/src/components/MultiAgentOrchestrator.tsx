import React from 'react';
import { Cpu, CheckCircle2, Loader2, AlertCircle, ShieldAlert, Award, Layers, BookOpen, Sparkles } from 'lucide-react';
import { AgentInfo } from '../types';

interface MultiAgentOrchestratorProps {
  agents: AgentInfo[];
  isAnalyzing: boolean;
  onViewResults: () => void;
  projectName?: string;
}

export const MultiAgentOrchestrator: React.FC<MultiAgentOrchestratorProps> = ({
  agents,
  isAnalyzing,
  onViewResults,
  projectName
}) => {
  const completedCount = agents.filter(a => a.status === 'completed').length;
  const overallProgress = Math.round((completedCount / agents.length) * 100);

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'scanner': return <Layers className="w-5 h-5 text-indigo-400" />;
      case 'quality': return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'security': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'judge': return <Award className="w-5 h-5 text-amber-400" />;
      case '3d': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'guide': return <BookOpen className="w-5 h-5 text-emerald-400" />;
      default: return <Cpu className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-indigo-500/20 shadow-2xl space-y-6">
      {/* Top Header & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Autonomous Multi-Agent Orchestration Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Analyzing <span className="text-indigo-400">{projectName || 'Project Codebase'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            6 specialized AI Agents collaborating concurrently to evaluate code depth, complexity & judge scores.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-300">{overallProgress}%</span>
            <p className="text-[10px] text-slate-400 font-medium">Orchestration Progress</p>
          </div>
          {completedCount === agents.length && !isAnalyzing && (
            <button
              onClick={onViewResults}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 flex items-center space-x-2 animate-bounce"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>View Hackathon Judge Report & 3D Maps</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 shadow-md"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* Grid of 6 Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isRunning = agent.status === 'running';
          const isCompleted = agent.status === 'completed';

          return (
            <div
              key={agent.id}
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                isRunning
                  ? 'bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10'
                  : isCompleted
                  ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  {getAgentIcon(agent.iconName)}
                </div>

                <div>
                  {isRunning && (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/30">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Running</span>
                    </span>
                  )}
                  {isCompleted && (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completed</span>
                    </span>
                  )}
                  {agent.status === 'idle' && (
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                      Queued
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{agent.name}</h4>
              <p className="text-[11px] text-slate-400 font-medium mb-3">{agent.role}</p>

              {/* Agent Current Task / Output Summary */}
              <div className="text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-slate-300 font-mono min-h-[50px] flex items-center">
                {isRunning ? (
                  <span className="text-indigo-300 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    <span>{agent.currentTask}</span>
                  </span>
                ) : isCompleted ? (
                  <span className="text-slate-300">{agent.summary || 'Task completed successfully.'}</span>
                ) : (
                  <span className="text-slate-500">Waiting for dependency execution...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
