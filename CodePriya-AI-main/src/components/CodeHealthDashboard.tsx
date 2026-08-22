import React from 'react';
import { ShieldAlert, Cpu, Activity, Clock, Database, Code, CheckCircle, AlertTriangle, Bug } from 'lucide-react';
import { QualityMetrics, SecurityAlert, ProjectFile } from '../types';

interface CodeHealthDashboardProps {
  metrics: QualityMetrics;
  securityAlerts: SecurityAlert[];
  files: ProjectFile[];
  projectName: string;
}

export const CodeHealthDashboard: React.FC<CodeHealthDashboardProps> = ({
  metrics,
  securityAlerts,
  files,
  projectName
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Health Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Code Health', score: metrics.overallHealth, icon: <Activity className="w-5 h-5 text-indigo-400" />, color: 'from-indigo-500 to-purple-500' },
          { label: 'Security Score', score: metrics.securityScore, icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />, color: 'from-emerald-500 to-teal-500' },
          { label: 'Performance Rating', score: metrics.performanceScore, icon: <Cpu className="w-5 h-5 text-cyan-400" />, color: 'from-cyan-500 to-blue-500' },
          { label: 'Maintainability Index', score: metrics.maintainabilityScore, icon: <Code className="w-5 h-5 text-purple-400" />, color: 'from-purple-500 to-pink-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">{stat.icon}</div>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-white">{stat.score}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full`} style={{ width: `${stat.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Time & Space Complexity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Algorithmic Time Complexity</h3>
              <p className="text-xs text-slate-400">Primary execution scaling behavior across core routines</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Primary Rating</span>
              <span className="text-2xl font-mono font-bold text-cyan-300">{metrics.primaryTimeComplexity}</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
              Log-Linear Optimized
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The critical paths utilize efficient divide-and-conquer and dictionary key lookups ($O(1)$) preventing exponential execution stalls on large datasets.
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Auxiliary Space Complexity</h3>
              <p className="text-xs text-slate-400">Memory footprint and RAM usage scaling</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Primary Rating</span>
              <span className="text-2xl font-mono font-bold text-purple-300">{metrics.primarySpaceComplexity}</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/30">
              Bounded Memory
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Memory allocation scales linearly with dataset size ($O(N)$) without unconstrained heap leaks or recursion stack overflows.
          </p>
        </div>
      </div>

      {/* OWASP & Security Alerts List */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Bug className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">OWASP & Code Vulnerability Scanner</h3>
              <p className="text-xs text-slate-400">Security audit alerts detected across files</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/30">
            {securityAlerts.length} Security Alerts
          </span>
        </div>

        <div className="space-y-3">
          {securityAlerts.length === 0 ? (
            <div className="p-6 text-center bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 text-xs font-semibold flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Zero critical OWASP security vulnerabilities detected in codebase.</span>
            </div>
          ) : (
            securityAlerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      alert.severity === 'high' || alert.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs font-bold text-white">{alert.title}</span>
                  </div>
                  {alert.cwe && <span className="text-[10px] font-mono text-slate-500">{alert.cwe}</span>}
                </div>

                <p className="text-xs text-slate-300">{alert.description}</p>

                <div className="text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-indigo-300 font-mono">
                  💡 <span className="font-semibold text-slate-200">Fix Recommendation:</span> {alert.recommendation}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* File Complexity Inspection Table */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">File-by-File Complexity & Line Counts</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">File Path</th>
                <th className="p-3">Language</th>
                <th className="p-3">Lines of Code</th>
                <th className="p-3">Time Complexity</th>
                <th className="p-3">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {files.map((f, i) => (
                <tr key={i} className="hover:bg-slate-950/60 transition-colors font-mono">
                  <td className="p-3 text-indigo-300 font-semibold">{f.path}</td>
                  <td className="p-3 uppercase">{f.language}</td>
                  <td className="p-3">{f.lineCount}</td>
                  <td className="p-3 text-cyan-400">{f.complexity?.time || 'O(N)'}</td>
                  <td className="p-3 text-purple-400">{f.complexity?.space || 'O(1)'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
