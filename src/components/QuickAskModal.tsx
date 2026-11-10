import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Course, LanguageCode } from '../types';
import { getTranslation } from '../i18n/translations';

interface QuickAskModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  language: LanguageCode;
  onOpenFullTutor: (initialPrompt?: string, courseContext?: string) => void;
  onUseRequest: () => void;
}

export const QuickAskModal: React.FC<QuickAskModalProps> = ({
  isOpen,
  onClose,
  courses,
  language,
  onOpenFullTutor,
  onUseRequest,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(language);
  const [prompt, setPrompt] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('General');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const quickChips = [
    'Explain CRISPR-Cas9 mechanism with an analogy',
    'Summarize Marbury v. Madison judicial review doctrine',
    'Why do eigenvectors maintain directional invariance in linear algebra?',
    'What is Caravaggio\'s tenebrism technique in Fine Arts?',
  ];

  const handleAsk = async (textToSend?: string) => {
    const q = textToSend || prompt;
    if (!q.trim() || loading) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          courseContext: selectedCourse !== 'General' ? selectedCourse : undefined,
          language,
        }),
      });

      const data = await res.json();
      onUseRequest();
      if (data.success && data.answer) {
        setResponse(data.answer);
      } else {
        setResponse(data.error || 'Unable to retrieve answer.');
      }
    } catch (err) {
      setResponse('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0D1324] border border-[#223050] rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] sm:max-h-[82vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1A2644] flex items-center justify-between bg-[#10172B] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Quick AI Tutor Inquiry</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </h2>
              <p className="text-xs text-slate-400">Powered by Gemini 3.8 Flash</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#18233D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Course select & Quick Chips */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Focus:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-[#101728] border border-[#1E2942] rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-hidden"
            >
              <option value="General">All Disciplines</option>
              {courses.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quick prompt suggestions */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Concept Starters
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(chip);
                    handleAsk(chip);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#11182B] hover:bg-[#19243E] text-slate-300 hover:text-white border border-[#1A253E] transition-colors text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Response Container */}
          {loading && (
            <div className="p-4 rounded-xl bg-[#11182B] border border-[#1E2942] flex items-center gap-3 text-xs text-slate-400">
              <Bot className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Analyzing curriculum and formulating explanation...</span>
            </div>
          )}

          {response && (
            <div className="p-4 rounded-xl bg-[#11182B] border border-[#1E2942] space-y-3">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center justify-between">
                <span>Tutor Response</span>
                <span className="text-[10px] text-slate-400">Just now</span>
              </div>
              <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
                {response}
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-4 bg-[#10172B] border-t border-[#1A2644] flex flex-col gap-3 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAsk();
                }
              }}
              placeholder="Ask anything or clarify a concept..."
              className="flex-1 bg-[#0C1221] border border-[#1E2942] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500"
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading || !prompt.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400 text-[11px]">
              Want a deeper conversation or interactive quiz?
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenFullTutor(prompt, selectedCourse);
              }}
              className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <span>Open Full Tutor Workspace</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
