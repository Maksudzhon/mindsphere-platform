import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  Award,
  ChevronRight,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChatMessage, Course, LanguageCode, QuizQuestion } from '../types';

interface AITutorViewProps {
  courses: Course[];
  initialContext?: string;
  initialPrompt?: string;
  dailyRequestsRemaining: number;
  dailyRequestsTotal: number;
  language: LanguageCode;
  onUseRequest: () => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  courses,
  initialContext,
  initialPrompt,
  dailyRequestsRemaining,
  dailyRequestsTotal,
  language,
  onUseRequest,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>(initialContext || 'General');
  const [inputPrompt, setInputPrompt] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic Quiz State
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion[] | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `### Welcome to MindSphere AI Tutor, Alex!

I am your 24/7 personalized pedagogical companion. Whether you need an intuitive mental model for **CRISPR Cas9 gene editing**, legal jurisprudence behind **Judicial Review**, geometric intuition of **Eigenvalues**, or **Baroque Tenebrism**, I am here to break it down.

Select any course focus or pick a high-yield exploration topic below to begin.`,
      timestamp: 'Just now',
      suggestedQuestions: [
        'Explain CRISPR-Cas9 with a simple real-world analogy',
        'Break down Marbury v. Madison judicial review doctrine',
        'Why do eigenvectors maintain directional invariance in linear algebra?',
        'How does Caravaggio use tenebrism to manipulate emotional tension?',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeQuiz]);

  // If initialPrompt was provided, trigger send
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '') {
      handleSendMessage(initialPrompt);
    }
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
      courseContext: selectedCourse,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          courseContext: selectedCourse !== 'General' ? selectedCourse : undefined,
          language,
        }),
      });

      const data = await res.json();
      onUseRequest();

      if (data.success && data.answer) {
        // Parse suggested follow-ups if present
        let cleanAnswer = data.answer;
        let followUps: string[] = [];

        if (cleanAnswer.includes('### Suggested Follow-ups')) {
          const parts = cleanAnswer.split('### Suggested Follow-ups');
          cleanAnswer = parts[0].trim();
          const listText = parts[1] || '';
          followUps = listText
            .split('\n')
            .map((s: string) => s.replace(/^[-*•0-9.]+\s*/, '').trim())
            .filter((s: string) => s.length > 5);
        }

        const tutorMsg: ChatMessage = {
          id: `t-${Date.now()}`,
          sender: 'tutor',
          text: cleanAnswer,
          timestamp: 'Just now',
          courseContext: selectedCourse,
          suggestedQuestions: followUps.length > 0 ? followUps : undefined,
        };

        setMessages((prev) => [...prev, tutorMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'tutor',
            text: data.error || 'I encountered an issue processing your request. Please try again.',
            timestamp: 'Just now',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'tutor',
          text: 'Unable to connect to the tutor service. Please check your connection and try again.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setActiveQuiz(null);
    setQuizAnswers({});
    setQuizSubmitted(false);

    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: selectedCourse !== 'General' ? selectedCourse : 'Multi-disciplinary Science & Arts',
          topic: selectedCourse !== 'General' ? selectedCourse : 'Core Polymath Concepts',
        }),
      });

      const data = await res.json();
      if (data.success && data.quiz && data.quiz.length > 0) {
        setActiveQuiz(data.quiz);
      }
    } catch (err) {
      console.error('Quiz generation failed', err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOptionPick = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let correct = 0;
    if (activeQuiz) {
      activeQuiz.forEach((q, idx) => {
        if (quizAnswers[idx] === q.correctIndex) correct++;
      });
      if (correct === activeQuiz.length) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9.5rem)] lg:h-[calc(100vh-6rem)] max-w-5xl mx-auto space-y-3 sm:space-y-4">
      {/* Top Banner / Controls */}
      <div className="p-4 rounded-2xl bg-[#101728] border border-[#1C263D] flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>MindSphere AI Tutor</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Gemini 3.8 Flash
              </span>
            </div>
            <div className="text-xs text-slate-400">
              <span className="font-mono text-purple-400 font-semibold">
                {dailyRequestsRemaining}
              </span>{' '}
              of {dailyRequestsTotal} daily requests remaining
            </div>
          </div>
        </div>

        {/* Right filters: Course Select & Generate Quiz button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#0C1221] px-3 py-1.5 rounded-xl border border-[#1E2942]">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="General" className="bg-[#0F162A]">All Disciplines</option>
              {courses.map((c) => (
                <option key={c.id} value={c.title} className="bg-[#0F162A]">
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateQuiz}
            disabled={isGeneratingQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-md shadow-purple-900/30 cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isGeneratingQuiz ? 'animate-spin' : ''}`} />
            <span>{isGeneratingQuiz ? 'Generating...' : 'Dynamic Quiz'}</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-[#0B101E] border border-[#18233C]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4.5 space-y-2 transition-all ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-purple-700 to-fuchsia-700 text-white rounded-br-xs shadow-md'
                  : 'bg-[#11182B] border border-[#1E2842] text-slate-200 rounded-bl-xs'
              }`}
            >
              {/* Header inside bubble */}
              <div className="flex items-center justify-between text-xs opacity-75 pb-1 border-b border-white/10">
                <span className="font-semibold flex items-center gap-1.5">
                  {msg.sender === 'user' ? 'Alex Johnson' : 'MindSphere Tutor'}
                  {msg.courseContext && msg.courseContext !== 'General' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/15">
                      {msg.courseContext}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px]">{msg.timestamp}</span>
                  {msg.sender === 'tutor' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-white transition-colors"
                      title="Copy text"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Message text with basic markdown formatting */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-normal">
                {msg.text}
              </div>

              {/* Suggested Follow-up chips */}
              {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="pt-3 border-t border-[#1C2744] space-y-1.5">
                  <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                    Suggested Exploration Questions
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {msg.suggestedQuestions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSendMessage(q)}
                        className="text-xs text-left px-3 py-1.5 rounded-lg bg-[#0E1528] hover:bg-[#18233C] text-slate-300 hover:text-white border border-[#1C2844] transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#11182B] border border-[#1E2842] text-slate-400 text-xs w-64">
            <Bot className="w-4 h-4 text-purple-400 animate-bounce" />
            <span>MindSphere AI is formulating guidance...</span>
          </div>
        )}

        {/* Dynamic Quiz Card (if generated) */}
        {activeQuiz && (
          <div className="max-w-2xl bg-[#131B30] border border-purple-500/40 rounded-2xl p-6 space-y-5 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <h4 className="text-base font-bold text-white">
                  Active Recall: {selectedCourse}
                </h4>
              </div>
              <span className="text-xs font-mono text-purple-300">
                3 Questions
              </span>
            </div>

            <div className="space-y-5">
              {activeQuiz.map((q, qIdx) => (
                <div key={q.id || qIdx} className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-300">
                    {qIdx + 1}. {q.question}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      let btnStyle = 'bg-[#0E1528] border-[#1C2742] text-slate-300 hover:bg-[#16203A]';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 line-through';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-purple-950/60 border-purple-500 text-purple-200 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleOptionPick(qIdx, optIdx)}
                          className={`text-xs text-left p-3 rounded-xl border transition-all cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <div className="text-[11px] text-slate-400 bg-[#0B101E] p-2.5 rounded-lg border border-[#162038]">
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-[#1C2742]">
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-md cursor-pointer"
                >
                  Grade Quiz
                </button>
              ) : (
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-[#162038] hover:bg-[#1E2B4A] transition-colors cursor-pointer"
                >
                  Close Quiz
                </button>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Deck */}
      <div className="p-3 bg-[#101728] border border-[#1C263D] rounded-2xl flex items-center gap-3 shrink-0 shadow-lg">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={`Ask anything about ${selectedCourse === 'General' ? 'any discipline' : selectedCourse}...`}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-hidden px-2"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputPrompt.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-40 text-white transition-all shadow-md shadow-purple-900/30 cursor-pointer"
          aria-label="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
