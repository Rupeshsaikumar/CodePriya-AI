import React, { useState } from 'react';
import { BookOpen, Copy, Check, Sparkles, ChevronRight, Code2, Zap, ArrowDown, FolderPlus, FileCode, Globe } from 'lucide-react';
import { SpoonFeedStep, SupportedLanguage } from '../types';

interface SpoonFeedingGuideProps {
  steps: SpoonFeedStep[];
  projectName: string;
  activeLanguage: SupportedLanguage;
}

export const SpoonFeedingGuide: React.FC<SpoonFeedingGuideProps> = ({
  steps,
  projectName,
  activeLanguage
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const currentStep = steps[activeStepIndex] || steps[0];

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(idx);
    setTimeout(() => setCopiedCodeIndex(null), 2500);
  };

  const getExplanationForLanguage = (step: SpoonFeedStep, lang: SupportedLanguage): string => {
    if (step.multilingualDescriptions && step.multilingualDescriptions[lang]) {
      return step.multilingualDescriptions[lang];
    }
    if (lang === 'telugu') return step.conceptDescriptionTelugu || step.conceptDescriptionEnglish;
    if (lang === 'english') return step.conceptDescriptionEnglish;
    return step.conceptDescriptionTelugu || step.conceptDescriptionEnglish;
  };

  const languageLabels: Record<SupportedLanguage, string> = {
    telugu: 'తెలుగు (Telugu) సులభ వివరణ',
    english: 'English Concept Walkthrough',
    hindi: 'हिंदी (Hindi) विवरण',
    tamil: 'தமிழ் (Tamil) விளக்கம்',
    kannada: 'ಕನ್ನಡ (Kannada) ವಿವರಣೆ',
    spanish: 'Explicación en Español',
    bilingual: 'Multilingual Walkthrough'
  };

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-8 border border-emerald-500/30 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Spoon-Feeding Step-By-Step Developer Roadmap</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Learn & Build <span className="text-emerald-400">{projectName}</span> From Zero to Hero
            </h2>

            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
              Complete folder-by-folder, file-by-file walkthrough with line-by-line multilingual explanations (Telugu, English, Hindi, Tamil, Kannada, Spanish) and runnable code snippets!
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs font-mono font-bold text-emerald-300">
            <span>Step {activeStepIndex + 1} of {steps.length}</span>
          </div>
        </div>
      </div>

      {/* Step Selection Tabs / Horizontal Stepper */}
      <div className="flex overflow-x-auto py-2 space-x-3 scrollbar-none">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveStepIndex(idx)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl border transition-all text-left space-y-1 w-64 ${
                isActive
                  ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                  STEP {step.stepNumber || idx + 1}
                </span>
                {step.isNewFile ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">New File</span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Refactor</span>
                )}
              </div>
              <h4 className={`text-xs font-bold line-clamp-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                {step.title}
              </h4>
              <p className="text-[10px] text-slate-400 line-clamp-1 font-mono">
                {step.targetFolderOrFile}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Walkthrough */}
      {currentStep && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Multilingual Explanation & Line-by-Line Breakdown */}
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6 shadow-xl">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-bold mb-1">
                {currentStep.isNewFile ? <FolderPlus className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
                <span>Target: {currentStep.targetFolderOrFile}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-2">{currentStep.title}</h3>
              <p className="text-xs text-slate-400">{currentStep.subtitle}</p>
            </div>

            {/* Multilingual Explanation Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{languageLabels[activeLanguage] || 'Multi-Language Spoon-Feeding Explanation'}</span>
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {getExplanationForLanguage(currentStep, activeLanguage)}
              </p>
            </div>

            {/* Secondary English Card if Bilingual */}
            {activeLanguage === 'bilingual' && (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-indigo-300">
                  Concept Walkthrough (English Reference)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {currentStep.conceptDescriptionEnglish}
                </p>
              </div>
            )}

            {/* Line-by-Line Breakdown Table */}
            {currentStep.lineByLineExplanation && currentStep.lineByLineExplanation.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Line-by-Line Breakdown</h4>
                <div className="space-y-2">
                  {currentStep.lineByLineExplanation.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 text-xs">
                      <span className="font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap">
                        {item.lineRange}
                      </span>
                      <span className="text-slate-300">{item.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time & Space Complexity Optimization Notes */}
            {currentStep.optimizationNotes && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs space-y-1">
                <span className="font-bold text-cyan-300 flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Performance & Memory Optimization Note</span>
                </span>
                <p className="text-slate-300 font-mono text-[11px]">{currentStep.optimizationNotes}</p>
              </div>
            )}
          </div>

          {/* Right Column: Code Snippet Viewer with Copy Button */}
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-mono font-bold text-white">{currentStep.targetFolderOrFile}</span>
              </div>

              <button
                onClick={() => handleCopyCode(currentStep.codeSnippet, activeStepIndex)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
              >
                {copiedCodeIndex === activeStepIndex ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block */}
            <div className="relative bg-slate-950 p-4 rounded-2xl border border-slate-800/80 font-mono text-xs text-slate-200 overflow-x-auto max-h-[450px]">
              <pre><code>{currentStep.codeSnippet}</code></pre>
            </div>

            {/* Navigation Next Step */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex(prev => Math.max(prev - 1, 0))}
                className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 text-xs font-bold border border-slate-800 transition-all"
              >
                Previous Step
              </button>

              <button
                disabled={activeStepIndex === steps.length - 1}
                onClick={() => setActiveStepIndex(prev => Math.min(prev + 1, steps.length - 1))}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

