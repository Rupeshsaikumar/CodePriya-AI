import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, Sparkles, Download, Copy, Check, Globe, Share2, ShieldCheck, Zap } from 'lucide-react';
import { JudgeEvaluation, QualityMetrics, SupportedLanguage } from '../types';

interface JudgeEvaluationCardProps {
  evaluation: JudgeEvaluation;
  metrics: QualityMetrics;
  projectName: string;
  activeLanguage: SupportedLanguage;
}

export const JudgeEvaluationCard: React.FC<JudgeEvaluationCardProps> = ({
  evaluation,
  metrics,
  projectName,
  activeLanguage
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    const reportText = `=== CODEPRIYA AI HACKATHON JUDGE EVALUATION REPORT ===
Project: ${projectName}
Overall Grade: ${evaluation.overallGrade} | Score: ${evaluation.totalScore}/100
Verdict: ${evaluation.verdictTitle}
Ranking: ${evaluation.hackathonRankingRecommendation}

CRITERIA BREAKDOWN:
- Innovation: ${evaluation.scores.innovation}/100
- Code Structure: ${evaluation.scores.codeStructure}/100
- UI/UX Completeness: ${evaluation.scores.uiUxCompleteness}/100
- Technical Depth: ${evaluation.scores.technicalDepth}/100
- AI vs Human Code Balance: ${evaluation.scores.aiHumanBalance}/100 (Estimated AI: ${metrics.aiInvolvementPercent}%)

JUDGE FEEDBACK (ENGLISH):
${evaluation.judgeFeedbackEnglish}

జడ్జ్ రివ్యూ (తెలుగు):
${evaluation.judgeFeedbackTelugu}

KEY STRENGTHS:
${evaluation.strengths.map(s => `• ${s}`).join('\n')}

IMPROVEMENT AREAS:
${evaluation.areasForImprovement.map(a => `• ${a}`).join('\n')}
`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-10 border border-amber-500/30 shadow-2xl">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Official Hackathon Judge Evaluation Certificate</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {evaluation.verdictTitle}
            </h2>

            <p className="text-slate-300 text-sm max-w-2xl">
              Project: <span className="font-bold text-white">{projectName}</span> • Recommended Status:{' '}
              <span className="font-bold text-amber-300">{evaluation.hackathonRankingRecommendation}</span>
            </p>
          </div>

          {/* Grade Badge */}
          <div className="flex items-center space-x-4 bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 shadow-inner">
            <div className="text-center">
              <span className="text-5xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                {evaluation.overallGrade}
              </span>
              <p className="text-[10px] text-amber-400/80 uppercase font-bold tracking-widest mt-0.5">Overall Grade</p>
            </div>
            <div className="h-12 w-px bg-slate-800" />
            <div className="text-center">
              <span className="text-3xl font-bold text-white">{evaluation.totalScore}<span className="text-sm text-slate-400">/100</span></span>
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Judge Score</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={handleCopyReport}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center space-x-2 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Full Judge Report!' : 'Copy Official Report'}</span>
          </button>

          <span className="text-xs text-slate-400 flex items-center space-x-1 ml-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Judge Accuracy Score: 98.4%</span>
          </span>
        </div>
      </div>

      {/* Scores Radar Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Innovation & Utility', score: evaluation.scores.innovation, color: 'from-amber-500 to-yellow-500' },
          { label: 'Code Architecture', score: evaluation.scores.codeStructure, color: 'from-indigo-500 to-purple-500' },
          { label: 'UI/UX Completeness', score: evaluation.scores.uiUxCompleteness, color: 'from-cyan-500 to-blue-500' },
          { label: 'Technical Depth', score: evaluation.scores.technicalDepth, color: 'from-emerald-500 to-teal-500' },
          { label: 'AI/Human Code Balance', score: evaluation.scores.aiHumanBalance, color: 'from-pink-500 to-rose-500' },
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-300">{item.label}</span>
              <span className="text-white font-mono">{item.score}/100</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI vs Human Code Ratio Indicator */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>AI Involvement vs Human Hand-Written Code Analysis</span>
            </h4>
            <p className="text-xs text-slate-400">Judges can verify if the code was purely prompt-generated or custom written</p>
          </div>
          <div className="text-xs font-mono font-bold text-indigo-300">
            {metrics.humanCodePercent}% Human • {metrics.aiInvolvementPercent}% AI Assisted
          </div>
        </div>

        <div className="w-full bg-slate-950 h-4 rounded-xl overflow-hidden flex p-0.5 border border-slate-800">
          <div
            className="bg-emerald-500 h-full rounded-l-lg flex items-center justify-center text-[10px] font-bold text-slate-950 transition-all duration-500"
            style={{ width: `${metrics.humanCodePercent}%` }}
          >
            Human ({metrics.humanCodePercent}%)
          </div>
          <div
            className="bg-purple-500 h-full rounded-r-lg flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
            style={{ width: `${metrics.aiInvolvementPercent}%` }}
          >
            AI ({metrics.aiInvolvementPercent}%)
          </div>
        </div>
      </div>

      {/* Multilingual Judge Written Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Language Feedback */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-amber-500/30 space-y-3">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span className="capitalize">
              Hackathon Judge Review ({activeLanguage === 'telugu' ? 'తెలుగు' : activeLanguage})
            </span>
          </div>
          <p className="text-slate-200 text-xs leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-amber-500/20 whitespace-pre-line">
            {evaluation.judgeFeedbackMultilingual?.[activeLanguage] ||
              (activeLanguage === 'telugu' ? evaluation.judgeFeedbackTelugu : evaluation.judgeFeedbackEnglish)}
          </p>
        </div>

        {/* Reference Feedback (English/Telugu) */}
        {activeLanguage !== 'english' && (
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
              <Globe className="w-4 h-4" />
              <span>Hackathon Judge Official Review (English)</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800/80 whitespace-pre-line">
              {evaluation.judgeFeedbackEnglish}
            </p>
          </div>
        )}
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-emerald-500/20 space-y-3">
          <h4 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Architectural Strengths</span>
          </h4>
          <ul className="space-y-2">
            {evaluation.strengths.map((str, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-6 border border-amber-500/20 space-y-3">
          <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Recommended Refactorings for Final Submission</span>
          </h4>
          <ul className="space-y-2">
            {evaluation.areasForImprovement.map((imp, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
