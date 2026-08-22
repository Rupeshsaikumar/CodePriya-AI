import React, { useState } from 'react';
import { History, Search, ArrowUpRight, Folder, Github, FileCode, Award, Clock, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import { AnalysisResult } from '../types';

interface AnalysisHistoryProps {
  historyList: any[];
  onSelectHistoryItem: (id: string) => void;
  onRefreshHistory: () => void;
  isLoading: boolean;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  historyList,
  onSelectHistoryItem,
  onRefreshHistory,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = historyList.filter(item =>
    (item.projectName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.repositoryUrl || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-200 via-indigo-100 to-white bg-clip-text text-transparent">
                Project Analysis History & Store
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                View, reload, and compare all past analyzed repositories and folder submissions
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefreshHistory}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-2 transition-all hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Refresh History</span>
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-3 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search past project names, GitHub URLs, or file records..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
          <span className="text-slate-400">Total Analyzed Projects</span>
          <span className="font-extrabold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
            {historyList.length}
          </span>
        </div>
      </div>

      {/* History Grid */}
      {filteredHistory.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center">
          <Folder className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No project analysis found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Upload a local code folder or import a GitHub repository from the Project Ingestion tab to record your first analysis.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {item.uploadType === 'github' ? (
                      <div className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        <Github className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Folder className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {item.projectName}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium capitalize">
                        {item.uploadType} upload • {item.totalFiles} files
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20">
                      Grade {item.overallGrade || 'A+'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1">
                      Score {item.totalScore || 90}/100
                    </span>
                  </div>
                </div>

                {item.repositoryUrl && (
                  <p className="text-[11px] text-indigo-400 font-mono line-clamp-1 mb-3 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800/80">
                    {item.repositoryUrl}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 text-[11px]">
                    <span className="text-slate-500 block text-[10px]">Total Lines</span>
                    <span className="font-bold text-slate-200">~{item.totalLines} lines</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 text-[11px]">
                    <span className="text-slate-500 block text-[10px]">Analyzed At</span>
                    <span className="font-medium text-slate-300">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectHistoryItem(item.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-semibold text-xs transition-all flex items-center justify-center space-x-2 group-hover:shadow-lg group-hover:shadow-indigo-500/20"
              >
                <span>Inspect Saved Report</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
