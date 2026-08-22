import React from 'react';
import { Target, CheckCircle2, AlertTriangle, XCircle, FileCode, Folder, Award, Sparkles, Layers, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { ProblemStatementAnalysis, ProblemStatementMatch } from '../types';

interface ProblemStatementComparisonProps {
  analysis?: ProblemStatementAnalysis;
  projectName: string;
  problemStatementText?: string;
  onEditProblemStatement?: () => void;
}

export const ProblemStatementComparison: React.FC<ProblemStatementComparisonProps> = ({
  analysis,
  projectName,
  problemStatementText,
  onEditProblemStatement
}) => {
  const statement = analysis?.problemStatement || problemStatementText || 'Multi-Agent AI Repository Inspector with Hackathon Judge Evaluation, Firebase Persistence, and Multilingual Guides.';
  const score = analysis?.overallMatchScore !== undefined ? analysis.overallMatchScore : 0;
  const grade = analysis?.matchGrade || (analysis ? 'Mismatch' : 'Not Audited');

  const getStatusBadge = (status: ProblemStatementMatch['status']) => {
    switch (status) {
      case 'fulfilled':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fulfilled</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Partial</span>
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Missing</span>
          </span>
        );
    }
  };

  const getGradeColor = (gradeStr: string) => {
    if (gradeStr.includes('Perfect') || gradeStr.includes('Strong')) {
      return 'from-emerald-400 via-teal-300 to-indigo-400';
    }
    if (gradeStr.includes('Partial')) {
      return 'from-amber-300 via-yellow-200 to-orange-400';
    }
    return 'from-rose-400 via-pink-300 to-red-400';
  };

  const fulfilledList: ProblemStatementMatch[] = analysis?.fulfilledRequirements || [];
  const missingList: ProblemStatementMatch[] = analysis?.missingOrPartialRequirements || [];

  const isMismatch = grade === 'Mismatch' || score < 35;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${isMismatch ? 'from-slate-900 via-rose-950 to-slate-900 border-rose-500/40' : 'from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30'} p-8 md:p-10 border shadow-2xl`}>
        <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 ${isMismatch ? 'bg-rose-500/10' : 'bg-indigo-500/10'} rounded-full blur-3xl pointer-events-none`} />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${isMismatch ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'} text-xs font-semibold border`}>
              <Target className={`w-4 h-4 ${isMismatch ? 'text-rose-400' : 'text-amber-400'}`} />
              <span>Problem Statement & Requirement Audit</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Problem Statement vs. Repository Alignment
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Evaluating uploaded folder and GitHub repository <span className="text-indigo-300 font-bold">"{projectName}"</span> against the defined problem statement & requirements.
            </p>
          </div>

          {/* Overall Match Score Gauge */}
          <div className={`bg-slate-950/90 p-5 rounded-2xl border ${isMismatch ? 'border-rose-500/50' : 'border-indigo-500/40'} shadow-inner flex items-center space-x-5 min-w-[240px]`}>
            <div className="text-center">
              <div className={`text-4xl font-black bg-gradient-to-r ${getGradeColor(grade)} bg-clip-text text-transparent`}>
                {score}%
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Match Score</p>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div>
              <p className={`text-xs font-extrabold ${isMismatch ? 'text-rose-400' : 'text-white'}`}>{grade}</p>
              <p className={`text-[10px] ${isMismatch ? 'text-rose-400' : 'text-emerald-400'} font-semibold flex items-center space-x-1 mt-0.5`}>
                {isMismatch ? <XCircle className="w-3 h-3 text-rose-400" /> : <ShieldCheck className="w-3 h-3" />}
                <span>{isMismatch ? 'Domain Mismatch' : 'Verified Solution'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Target Problem Statement Card */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Target Problem Statement / Challenge Prompt</h3>
              <p className="text-xs text-slate-400">The functional criteria used for auditing the repository</p>
            </div>
          </div>

          {onEditProblemStatement && (
            <button
              onClick={onEditProblemStatement}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors"
            >
              Change Statement
            </button>
          )}
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/20 text-slate-200 text-sm leading-relaxed font-mono">
          "{statement}"
        </div>
      </div>

      {/* Requirement Coverage Matrix */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Requirements vs. Code Evidence Matrix</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Fulfilled Requirements */}
          {fulfilledList.map((item, idx) => (
            <div key={`fulfilled-${idx}`} className="bg-slate-900/90 rounded-2xl p-5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all shadow-md space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.requirement}</h4>
                    <p className="text-[11px] text-slate-400">Requirement Score: <span className="font-bold text-emerald-400">{item.score}% Coverage</span></p>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <strong className="text-indigo-300">Code Evidence: </strong> {item.evidenceSummary}
              </p>

              {/* Matched Files Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-1">
                  <Folder className="w-3 h-3 text-indigo-400" />
                  <span>Matched Folder/GitHub Files:</span>
                </span>
                {item.matchedFiles.map((file, fIdx) => (
                  <span
                    key={fIdx}
                    className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-mono"
                  >
                    <FileCode className="w-3 h-3 text-indigo-400" />
                    <span>{file}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Missing / Partial Requirements */}
          {missingList.map((item, idx) => (
            <div key={`missing-${idx}`} className={`bg-slate-900/90 rounded-2xl p-5 border ${item.status === 'missing' ? 'border-rose-500/40' : 'border-amber-500/20'} transition-all shadow-md space-y-3`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.status === 'missing' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {item.status === 'missing' ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.requirement}</h4>
                    <p className="text-[11px] text-slate-400">Requirement Score: <span className={`font-bold ${item.status === 'missing' ? 'text-rose-400' : 'text-amber-400'}`}>{item.score}% {item.status === 'missing' ? 'Missing' : 'Partial'}</span></p>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <strong className={item.status === 'missing' ? 'text-rose-300' : 'text-amber-300'}>Audit Observation: </strong> {item.evidenceSummary}
              </p>

              {item.matchedFiles && item.matchedFiles.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-1">
                    <Folder className="w-3 h-3 text-amber-400" />
                    <span>Referenced Files:</span>
                  </span>
                  {item.matchedFiles.map((file, fIdx) => (
                    <span
                      key={fIdx}
                      className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono"
                    >
                      <FileCode className="w-3 h-3 text-slate-400" />
                      <span>{file}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {fulfilledList.length === 0 && missingList.length === 0 && (
            <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800 text-sm">
              No analysis data available yet. Please click "Analyze Repository" in Step 1 to trigger the multi-agent problem statement audit.
            </div>
          )}
        </div>
      </div>

      {/* Executive Verdict & Recommendations */}
      <div className={`p-6 rounded-2xl bg-gradient-to-br ${isMismatch ? 'from-slate-900 via-rose-950 to-slate-950 border-rose-500/40' : 'from-slate-900 via-slate-950 to-indigo-950 border-indigo-500/30'} border space-y-4 shadow-xl`}>
        <div className="flex items-center space-x-2 text-indigo-300 font-extrabold text-sm">
          <Zap className={`w-4 h-4 ${isMismatch ? 'text-rose-400' : 'text-amber-400'}`} />
          <span>Auditor Verdict & Scope Recommendations</span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          {analysis?.executiveSummary || `The uploaded repository/folder satisfies ${score}% of the defined problem statement.`}
        </p>

        {analysis?.alignmentRecommendations && analysis.alignmentRecommendations.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Actionable Recommendations:</span>
            <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-300">
              {analysis.alignmentRecommendations.map((rec, rIdx) => (
                <li key={rIdx}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
