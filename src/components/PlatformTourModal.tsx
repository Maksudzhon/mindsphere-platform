import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Bot,
  BookOpen,
  Trophy,
  Flame,
  CheckCircle2,
  HelpCircle,
  Dna,
  Scale,
  Palette,
  Binary,
  TrendingUp,
  Music,
  Globe,
  Volume2,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/sound';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { LanguageCode } from '../types';

interface PlatformTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onNavigateTab: (tab: string) => void;
  onOpenQuickAsk: () => void;
}

export const PlatformTourModal: React.FC<PlatformTourModalProps> = ({
  isOpen,
  onClose,
  language,
  onNavigateTab,
  onOpenQuickAsk,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [interactiveQuizAnswer, setInteractiveQuizAnswer] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const steps = [
    {
      id: 'polymath',
      title: 'Welcome to MindSphere',
      subtitle: 'Why learn in isolated silos when you can become a Polymath?',
      badge: 'Step 1 of 5 • The Polymath Core',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-600 via-fuchsia-600 to-indigo-600',
      description:
        'MindSphere is designed around cross-disciplinary synthesis: connecting molecular biology, constitutional law, modernist fine arts, spectral mathematics, platform economics, and acoustic music. Groundbreaking discoveries occur at the intersections.',
      actionText: 'Explore The 6 Tracks',
      graphic: (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#070B18] border border-[#1A2644] space-y-3">
          <div className="text-xs font-semibold text-purple-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>6 Interconnected Disciplines</span>
            </span>
            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              Unified Node
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { name: 'Biology', color: '#10B981', tag: 'Genomics', icon: Dna },
              { name: 'Law & Justice', color: '#3B82F6', tag: 'Constitutional', icon: Scale },
              { name: 'Fine Arts', color: '#EC4899', tag: 'Visual Theory', icon: Palette },
              { name: 'Mathematics', color: '#8B5CF6', tag: 'Linear Algebra', icon: Binary },
              { name: 'Business', color: '#F97316', tag: 'Network Economics', icon: TrendingUp },
              { name: 'Music', color: '#06B6D4', tag: 'Harmonics', icon: Music },
            ].map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.name}
                  className="p-2 sm:p-2.5 rounded-xl bg-[#0F162A] border border-[#1E2B4A] hover:border-purple-500/50 text-left hover:scale-105 transition-all shadow-md group"
                >
                  <div
                    className="w-6 h-6 rounded-lg mb-1.5 flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: d.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] font-bold text-white leading-tight group-hover:text-purple-300 transition-colors">
                    {d.name}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">{d.tag}</div>
                </div>
              );
            })}
          </div>
        </div>
      ),
      tip: "Studying both Biology and Math concurrently unlocks the prestigious 'Cross-Domain Synthesis' milestone.",
    },
    {
      id: 'ai-tutor',
      title: '24/7 Socrates Pedagogical Tutor',
      subtitle: 'Neural concept deconstruction with real-time analogies',
      badge: 'Step 2 of 5 • Intelligent Mentorship',
      icon: <Bot className="w-5 h-5 text-purple-400" />,
      color: 'from-fuchsia-600 via-purple-600 to-cyan-600',
      description:
        "Whenever you're stuck on a concept—whether it's Cas9 PAM motifs, rational basis review, or matrix eigenvalues—tap 'Ask AI Tutor'. It deconstructs complex theorems with crystal-clear metaphors and generates custom active-recall quizzes.",
      actionText: 'Try AI Concept Spark',
      graphic: (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#070B18] border border-[#1A2644] space-y-2.5 text-left text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-[#141F38]">
            <div className="flex items-center gap-1.5 text-purple-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Socratic Neural Session</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">5 Languages Active</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0F162A] text-slate-200 border border-[#1E2C4C]">
            <span className="text-purple-400 font-bold font-mono">Scholar: </span>
            <span>How does the PAM motif prevent Cas9 from cutting the host's own genome?</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-950/40 text-purple-100 border border-purple-500/40 leading-relaxed flex items-start gap-2">
            <Bot className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>
              "Think of the PAM sequence (5'-NGG-3') like a physical safety keyhole. The bacterial host's own CRISPR array lacks this motif, so Cas9 is physically locked from self-cleavage."
            </span>
          </div>
        </div>
      ),
      tip: 'Daily inquiries reset every 24 hours. Pro scholars enjoy up to 200 daily queries.',
    },
    {
      id: 'active-recall',
      title: 'Active Recall & Interactive Quizzes',
      subtitle: 'No passive video watching. Test yourself to truly learn',
      badge: 'Step 3 of 5 • Cognitive Recall Engine',
      icon: <HelpCircle className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-600 via-teal-600 to-blue-600',
      description:
        'Cognitive science proves that actively retrieving knowledge from memory cements neural pathways 3x faster than passive watching. Every lesson includes interactive syllabus readers and practice quizzes with instant explanations.',
      actionText: 'Try This Recall Question',
      graphic: (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#070B18] border border-[#1A2644] space-y-2.5 text-left">
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>Active Recall: What is an Eigenvector?</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              +50 XP
            </span>
          </div>
          <div className="space-y-1.5">
            {[
              { idx: 0, text: 'A vector that changes direction by 90 degrees' },
              { idx: 1, text: 'A vector that preserves its direction and only scales by factor λ (Correct!)' },
            ].map((opt) => (
              <button
                key={opt.idx}
                onClick={() => {
                  soundFx.playClick(opt.idx === 1 ? 880 : 400);
                  setInteractiveQuizAnswer(opt.idx);
                  if (opt.idx === 1) {
                    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
                  }
                }}
                className={`w-full p-2.5 rounded-xl text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                  interactiveQuizAnswer === opt.idx
                    ? opt.idx === 1
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold shadow-sm'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                    : 'bg-[#0F162A] text-slate-300 hover:bg-[#16213A] border border-[#1E2B4A]'
                }`}
              >
                <span>{opt.text}</span>
                {interactiveQuizAnswer === opt.idx && (
                  <span>
                    {opt.idx === 1 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ),
      tip: "Score 100% on three quizzes in a row to earn the 'Perfect Recall' trophy.",
    },
    {
      id: 'community',
      title: 'Diamond League & Faculty Following',
      subtitle: 'Follow professors, read research articles, and climb the ranks',
      badge: 'Step 4 of 5 • Global Scholar Network',
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-600 via-orange-600 to-rose-600',
      description:
        "Learning is an adventure best shared. Check the Leaderboard to see where you rank in the Diamond League. Follow educators like Dr. Thorne to see their latest publications in your Community Feed.",
      actionText: 'Explore Leaderboards',
      graphic: (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#070B18] border border-[#1A2644] space-y-2.5 text-left text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-bold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Diamond Polymath League</span>
            </span>
            <span className="text-purple-400 font-mono text-[11px]">Rank #4 (You: 4,820 XP)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#0F162A] border border-[#1E2C4E]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                AJ
              </div>
              <span className="text-white font-semibold">Alex Johnson (You)</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-orange-400">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>18-Day Streak</span>
            </div>
          </div>
        </div>
      ),
      tip: 'Active streaks protect your league standings from dropping during weekly rank resets.',
    },
    {
      id: 'localization',
      title: 'Polyglot System & Tactile Sound FX',
      subtitle: 'Tailored workspace for global scholars and educators',
      badge: 'Step 5 of 5 • Polyglot Customization',
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      color: 'from-blue-600 via-indigo-600 to-purple-600',
      description:
        "Switch seamlessly between English, Uzbek (O'zbek), Russian (Русский), Spanish (Español), and Chinese (中文) at any time. Plus, toggle tactile audio for responsive physical clicks.",
      actionText: 'Enter MindSphere Workspace',
      graphic: (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#070B18] border border-[#1A2644] space-y-2.5 text-left">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Global Academic Localization</span>
            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              5 Languages Active
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {SUPPORTED_LANGUAGES.map((l) => (
              <div
                key={l.code}
                className="p-2 rounded-xl bg-[#0F162A] border border-[#1E2B4A] flex items-center gap-2 text-xs text-white"
              >
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {l.code.toUpperCase()}
                </span>
                <span className="font-medium truncate">{l.nativeName}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      tip: "You can reopen this guide anytime by clicking 'Guide' in the top bar.",
    },
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    soundFx.playClick(750);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setInteractiveQuizAnswer(null);
    } else {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      onClose();
    }
  };

  const handlePrev = () => {
    soundFx.playClick(500);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setInteractiveQuizAnswer(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Container: Strict Viewport Safe Bounds for Mobile & Laptop */}
      <div className="bg-[#0A0F20] border-2 border-purple-500/60 rounded-3xl w-full max-w-xl max-h-[90vh] sm:max-h-[85vh] flex flex-col p-4 sm:p-6 shadow-2xl shadow-purple-950/80 overflow-hidden">
        {/* Pinned Header */}
        <div className="flex items-center justify-between gap-3 shrink-0 pb-3 border-b border-[#18233C]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0">
              {current.icon}
            </div>
            <div>
              <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider font-mono">
                {current.badge}
              </div>
              <div className="text-xs text-slate-400">MindSphere Platform Walkthrough</div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#151E34] transition-colors cursor-pointer"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress dots */}
        <div className="flex items-center gap-1.5 py-2 shrink-0">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                soundFx.playClick(600);
                setCurrentStep(idx);
                setInteractiveQuizAnswer(null);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentStep === idx
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-fuchsia-500'
                  : idx < currentStep
                  ? 'w-4 bg-purple-500/50'
                  : 'w-2 bg-[#1C2640]'
              }`}
              title={`Jump to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Scrollable Middle Content (Never pushes buttons offscreen) */}
        <div className="overflow-y-auto flex-1 space-y-3.5 pr-1 py-1">
          <div className="space-y-1 text-left">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-purple-300">
              {current.subtitle}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
              {current.description}
            </p>
          </div>

          {/* Graphic Simulation */}
          <div>{current.graphic}</div>

          {/* Pro Tip */}
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/30 text-xs text-purple-200 text-left flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{current.tip}</span>
          </div>
        </div>

        {/* Pinned Footer (Always visible without scrolling!) */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#18233C] shrink-0 mt-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : 'text-slate-300 hover:text-white hover:bg-[#151E36]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Skip
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transition-all cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>{currentStep === steps.length - 1 ? 'Start Learning' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
