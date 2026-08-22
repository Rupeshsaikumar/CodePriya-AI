import React, { useState } from 'react';
import { Sparkles, Send, Globe, Code2, Bug, Check, Copy, User, Bot, Loader2 } from 'lucide-react';
import { ChatMessage, ProjectData, SupportedLanguage } from '../types';

interface MultilingualChatBotProps {
  projectContext?: ProjectData;
  activeLanguage: SupportedLanguage;
}

export const MultilingualChatBot: React.FC<MultilingualChatBotProps> = ({
  projectContext,
  activeLanguage
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      agentName: 'CodePriya Assistant',
      text: `హలో! నేను CodePriya AI ని. మీ ప్రాజెక్ట్ గురించి నన్ను ఏ భాషలోనైనా (తెలుగు, English, हिंदी, தமிழ், ಕನ್ನಡ, Español) ప్రశ్నలు అడగొచ్చు! (Hello! I am CodePriya AI. Ask me any code questions, line-by-line explanations, or bug fixes in your preferred language!)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'fixer'>('chat');
  const [bugCode, setBugCode] = useState('');
  const [bugError, setBugError] = useState('');
  const [fixedCodeResult, setFixedCodeResult] = useState('');
  const [isFixing, setIsFixing] = useState(false);

  // Quick Chips
  const quickPrompts = [
    'ఈ ప్రాజెక్ట్ ఆర్కిటెక్చర్ ని తెలుగు లో విడమరిచి చెప్పు (Explain architecture in Telugu)',
    'इस प्रोजेक्ट का कोड स्ट्रक्चर हिंदी में समझाएं (Hindi explanation)',
    'Explain line-by-line payment/router logic in English',
    'What are the security flaws in this code?',
    'How do I optimize space complexity O(N)?'
  ];

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
        text: data.reply || 'No response received from AI engine.',
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
          text: `Error connecting to AI assistant: ${err.message}`,
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
      setFixedCodeResult(data.fixedCodeAndExplanation || 'Code analysis completed.');
    } catch (err: any) {
      setFixedCodeResult(`Error during code fix: ${err.message}`);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[650px] animate-fadeIn">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Multilingual Code Assistant</h3>
            <p className="text-[10px] text-slate-400">Ask in Telugu (తెలుగు) or English for line-by-line help</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 rounded-lg font-semibold ${activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            AI Chat
          </button>
          <button
            onClick={() => setActiveTab('fixer')}
            className={`px-3 py-1 rounded-lg font-semibold ${activeTab === 'fixer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Bug Resolver
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <>
          {/* Quick Prompts Bar */}
          <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex overflow-x-auto space-x-2 scrollbar-none">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 text-[11px] font-medium border border-slate-800 transition-all"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 space-y-1 ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 space-x-2">
                      <span className="font-bold flex items-center space-x-1">
                        {isUser ? <User className="w-3 h-3 text-indigo-200" /> : <Bot className="w-3 h-3 text-pink-400" />}
                        <span>{isUser ? 'You' : m.agentName || 'CodePriya AI'}</span>
                      </span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div className="whitespace-pre-line leading-relaxed">
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-indigo-400 text-xs flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
                  <span>CodePriya AI is thinking and analyzing project code...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask a question in Telugu (తెలుగు లో అడగొచ్చు) or English..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        /* Bug Resolver Tab */
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          <form onSubmit={handleFixCode} className="space-y-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Paste Problematic Code</label>
              <textarea
                rows={5}
                placeholder="Paste code snippet here..."
                value={bugCode}
                onChange={(e) => setBugCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Error Message / Desired Behavior</label>
              <input
                type="text"
                placeholder="e.g. TypeError: Cannot read property 'map' of undefined"
                value={bugError}
                onChange={(e) => setBugError(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isFixing || !bugCode.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold flex items-center justify-center space-x-2"
            >
              {isFixing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fixing Code & Resolving Errors...</span>
                </>
              ) : (
                <>
                  <Bug className="w-4 h-4 text-amber-300" />
                  <span>Resolve Code Errors & Get Telugu Explanation</span>
                </>
              )}
            </button>
          </form>

          {fixedCodeResult && (
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-2">
              <span className="font-bold text-emerald-400">Code Fix & Refactored Output</span>
              <pre className="font-mono text-[11px] text-slate-200 bg-slate-900 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {fixedCodeResult}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
