import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User, X, Bug, Loader2, MessageSquare, Terminal, RefreshCw, HelpCircle, ChevronUp, Code, ArrowRight } from 'lucide-react';
import { ChatMessage, ProjectData, SupportedLanguage, AnalysisResult } from '../types';

interface AskGeminiFloatingWidgetProps {
  projectContext?: ProjectData;
  analysisResult?: AnalysisResult;
  activeLanguage: SupportedLanguage;
  activeTab: string;
}

export const AskGeminiFloatingWidget: React.FC<AskGeminiFloatingWidgetProps> = ({
  projectContext,
  analysisResult,
  activeLanguage,
  activeTab
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'fixer'>('chat');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-widget-1',
      sender: 'agent',
      agentName: 'CodePriya Assistant',
      text: `నమస్తే! I am CodePriya AI Assistant. I have live context of your project "${projectContext?.name || 'Uploaded Repository'}". Ask me any doubts, code explanations in Telugu/English, architecture details, or bug fixes!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bugCode, setBugCode] = useState('');
  const [bugError, setBugError] = useState('');
  const [fixedCodeResult, setFixedCodeResult] = useState('');
  const [isFixing, setIsFixing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll messages to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Context-aware dynamic suggestion chips based on the active tab
  const getContextualSuggestions = () => {
    const projName = projectContext?.name || 'this project';
    switch (activeTab) {
      case 'judge':
        return [
          `ఈ ప్రాజెక్ట్ జడ్జ్ ఫీడ్‌బ్యాక్ ని తెలుగు లో వివరించు (Explain judge review in Telugu)`,
          `How can I improve my hackathon score for ${projName}?`,
          `What are the main strengths found in my code?`
        ];
      case '3d':
        return [
          `ఈ ఆర్కిటెక్చర్ హెయిరార్కీ లో Level 2 API & Level 3 Service ఎలా కనెక్ట్ అయ్యాయి?`,
          `What are the advantages (pros) and disadvantages (cons) of this design?`,
          `Explain the top-level system modules in Telugu`
        ];
      case 'guide':
        return [
          `ఈ ప్రాజెక్ట్ ని లోకల్ గా ఎగ్జిక్యూట్ చేయడానికి step-by-step ఆదేశాలు చెప్పు`,
          `Explain Step 1 code line-by-line in Telugu`,
          `What dependencies are needed in package.json?`
        ];
      case 'health':
        return [
          `ఈ ప్రాజెక్ట్ సెక్యూరిటీ మరియు OWASP అలర్ట్స్ ని ఎలా ఫిక్స్ చేయాలి?`,
          `Explain time complexity ${analysisResult?.qualityMetrics?.primaryTimeComplexity || 'O(N)'} optimization`,
          `How is the AI vs Human code percentage calculated?`
        ];
      default:
        return [
          `ఈ ప్రాజెక్ట్ "${projName}" ఆర్కిటెక్చర్ ని తెలుగు లో వివరంగా చెప్పు`,
          `Explain ${projName} source code line-by-line in English`,
          `What is the main purpose and tech stack of this repository?`
        ];
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          projectContext,
          preferredLanguage: activeLanguage === 'telugu' ? 'Telugu' : activeLanguage === 'english' ? 'English' : 'Telugu and English'
        })
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'agent',
        agentName: 'CodePriya AI Assistant',
        text: data.reply || 'Unable to generate response from CodePriya AI.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          agentName: 'CodePriya AI Assistant',
          text: `Connecting to CodePriya AI Assistant: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFixCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugCode.trim()) return;

    setIsFixing(true);
    setFixedCodeResult('');

    try {
      const res = await fetch('/api/fix-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: bugCode, errorMessage: bugError })
      });
      const data = await res.json();
      setFixedCodeResult(data.fixedCodeAndExplanation || 'Code review completed.');
    } catch (err: any) {
      setFixedCodeResult(`Error during code fix: ${err.message}`);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <>
      {/* 1. Sticky Floating Toggle Button (Always visible on bottom right across all pages) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce hover:animate-none">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 text-white font-bold text-xs shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-all duration-300 border border-white/20"
            title="Ask CodePriya AI Assistant about this repository"
          >
            <div className="p-1 rounded-full bg-slate-950/40">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <span className="tracking-wide flex items-center space-x-1.5">
              <span>Ask CodePriya</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md uppercase">
                AI Live
              </span>
            </span>
          </button>
        </div>
      )}

      {/* 2. Expanded Floating Chat Drawer / Overlay */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 flex flex-col bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden ${
          isExpanded ? 'w-[92vw] sm:w-[650px] h-[85vh]' : 'w-[90vw] sm:w-[420px] h-[560px]'
        }`}>
          {/* Top Bar Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-purple-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-extrabold text-white">Ask CodePriya Assistant</h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Live Context
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  Project: <span className="text-amber-300 font-semibold">{projectContext?.name || 'Active Repo'}</span>
                </p>
              </div>
            </div>

            {/* Controls (Subtab, Expand, Close) */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
                <button
                  onClick={() => setActiveSubTab('chat')}
                  className={`px-2 py-1 rounded-md transition-all ${activeSubTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveSubTab('fixer')}
                  className={`px-2 py-1 rounded-md transition-all ${activeSubTab === 'fixer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Fixer
                </button>
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <Code className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Close Ask Gemini"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {activeSubTab === 'chat' ? (
            <>
              {/* Dynamic Context Suggestions */}
              <div className="p-2.5 bg-slate-950/80 border-b border-slate-800/80 flex overflow-x-auto space-x-2 scrollbar-none">
                {getContextualSuggestions().map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 hover:bg-indigo-950/80 text-slate-300 hover:text-indigo-300 text-[10px] font-medium border border-slate-800 transition-all flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate max-w-[220px]">{sug}</span>
                  </button>
                ))}
              </div>

              {/* Chat Message List */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs">
                {messages.map((m) => {
                  const isUser = m.sender === 'user';
                  return (
                    <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] rounded-2xl p-3 space-y-1 ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                      }`}>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 space-x-2">
                          <span className="font-bold flex items-center space-x-1 text-slate-300">
                            {isUser ? <User className="w-3 h-3 text-indigo-200" /> : <Bot className="w-3 h-3 text-amber-400" />}
                            <span>{isUser ? 'You' : m.agentName || 'CodePriya AI'}</span>
                          </span>
                          <span className="text-[9px] text-slate-500">{m.timestamp}</span>
                        </div>

                        <div className="whitespace-pre-line leading-relaxed text-[11px]">
                          {m.text}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-amber-300 text-[11px] flex items-center space-x-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>CodePriya AI is inspecting code context and generating response...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Ask CodePriya anything (తెలుగు or English)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 disabled:opacity-50 text-white transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            /* Bug Fixer Subtab */
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              <form onSubmit={handleFixCode} className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1 text-[11px]">Paste Code Snippet to Debug</label>
                  <textarea
                    rows={4}
                    placeholder="Paste code snippet..."
                    value={bugCode}
                    onChange={(e) => setBugCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-white text-[11px] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1 text-[11px]">Error Message or Desired Fix</label>
                  <input
                    type="text"
                    placeholder="e.g. Cannot read property of undefined..."
                    value={bugError}
                    onChange={(e) => setBugError(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white text-[11px] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isFixing || !bugCode.trim()}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5"
                >
                  {isFixing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing & Resolving...</span>
                    </>
                  ) : (
                    <>
                      <Bug className="w-3.5 h-3.5 text-amber-300" />
                      <span>Fix Code & Get Telugu Explanation</span>
                    </>
                  )}
                </button>
              </form>

              {fixedCodeResult && (
                <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 space-y-1.5">
                  <span className="font-bold text-emerald-400 text-[11px]">Refactored Output & Explanation</span>
                  <pre className="font-mono text-[10px] text-slate-200 bg-slate-900 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {fixedCodeResult}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
