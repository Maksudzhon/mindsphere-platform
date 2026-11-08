import React, { useState } from 'react';
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

  if (!isOpen) return null;

  const steps = [
    {
      id: 'polymath',
      title: 'Welcome to MindSphere',
      subtitle: 'Why learn in silos when you can become a Polymath?',
      badge: 'Step 1 of 5 • The Polymath Core',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-600 via-fuchsia-600 to-indigo-600',
      borderColor: 'border-purple-500/50',
      description:
        'MindSphere is built on Polymath Learning: connecting empirical sciences, jurisprudence, modern visual arts, advanced mathematics, platform economics, and acoustic music. Breakthrough innovations always happen at the intersections.',
      actionText: 'See The 6 Disciplines',
      graphic: (
        <div className="p-4 rounded-2xl bg-[#090D1A] border border-[#1A2542] space-y-3">
          <div className="text-xs font-semibold text-purple-300 flex items-center justify-between">
            <span>6 Interconnected Disciplines</span>
            <span className="font-mono text-[10px] text-slate-400">All in One Workspace</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
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
                  className="p-2.5 rounded-xl bg-[#121A30] border border-[#202E52] text-left hover:scale-105 transition-transform"
                >
                  <div className="w-6 h-6 rounded-lg mb-1.5 flex items-center justify-center text-white" style={{ backgroundColor: d.color }}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] font-bold text-white leading-tight">{d.name}</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">{d.tag}</div>
                </div>
              );
            })}
          </div>
        </div>
      ),
      tip: "Studying both Biology and Math simultaneously unlocks the 'Cross-Domain Synthesis' badge.",
    },
    {
      id: 'ai-tutor',
      title: '24/7 Socrates AI Tutor',
      subtitle: 'Powered by Gemini 3.8 Flash with multilingual intelligence',
      badge: 'Step 2 of 5 • Intelligent Mentorship',
      icon: <Bot className="w-5 h-5 text-purple-400" />,
      color: 'from-fuchsia-600 via-purple-600 to-cyan-600',
      borderColor: 'border-fuchsia-500/50',
      description:
        "Whenever you're stuck on a concept—whether it's the Cas9 PAM sequence or strict scrutiny judicial review—just tap 'Ask AI Tutor'. It explains with intuitive metaphors, generates custom quizzes, and speaks 5 languages fluently.",
      actionText: 'Try AI Concept Spark',
      graphic: (
        <div className="p-4 rounded-2xl bg-[#090D1A] border border-[#1A2542] space-y-2.5 text-left text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Bot className="w-4 h-4 text-purple-400" />
            <span>AI Tutor Live Dialog Preview</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#141C34] text-slate-200 border border-[#223055]">
            <span className="text-purple-400 font-bold">Scholar: </span>
            <span>How does the PAM motif prevent Cas9 from cutting the host's own genome?</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-950/40 text-purple-200 border border-purple-800/40">
            <span className="text-fuchsia-400 font-bold">AI Tutor: </span>
            <span>Think of the PAM sequence (5'-NGG-3') like a physical safety keyhole. The bacterial CRISPR locus lacks this motif, so Cas9 only cleaves target viral DNA.</span>
          </div>
        </div>
      ),
      tip: "Free scholars get 50 inquiries daily; Pro scholars get 200 daily with instant custom quiz generation.",
    },
    {
      id: 'active-recall',
      title: 'Active Recall & Interactive Quizzes',
      subtitle: 'No passive video watching. Test yourself to truly learn',
      badge: 'Step 3 of 5 • Active Learning Engine',
      icon: <HelpCircle className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-600 via-teal-600 to-blue-600',
      borderColor: 'border-emerald-500/50',
      description:
        'Cognitive science proves that testing your recall cements knowledge 3x faster than passive watching. Every lesson features interactive syllabus readers, real-time key takeaways, and practice quizzes with explanations.',
      actionText: 'Try This Quick Question Below',
      graphic: (
        <div className="p-4 rounded-2xl bg-[#090D1A] border border-[#1A2542] space-y-3 text-left">
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>Mini Challenge: What is an Eigenvector?</span>
            <span className="text-[10px] font-mono text-emerald-400">+50 XP</span>
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
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                    : 'bg-[#121A32] text-slate-300 hover:bg-[#182342] border border-[#202E52]'
                }`}
              >
                <span>{opt.text}</span>
                {interactiveQuizAnswer === opt.idx && (
                  <span>
                    {opt.idx === 1 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <X className="w-4 h-4 text-rose-400" />
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
      title: 'Diamond League & Study Squads',
      subtitle: 'Compete globally and collaborate in research squads',
      badge: 'Step 4 of 5 • Global Scholar Network',
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-600 via-orange-600 to-rose-600',
      borderColor: 'border-amber-500/50',
      description:
        "Learning is an adventure best shared. Check the Leaderboard to see where you rank in the Diamond League. Join squads like 'BioTech Synthesizers' to pool study hours and tackle multi-disciplinary challenges together.",
      actionText: 'Explore Study Squads',
      graphic: (
        <div className="p-4 rounded-2xl bg-[#090D1A] border border-[#1A2542] space-y-2.5 text-left text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-bold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Diamond Polymath League</span>
            </span>
            <span className="text-purple-400 font-mono text-[11px]">Rank #4 (You: 4,820 XP)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#141D34] border border-[#1E2C4E]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                AJ
              </div>
              <span className="text-white font-semibold">Alex Johnson (You)</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-orange-400">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>18d streak</span>
            </div>
          </div>
        </div>
      ),
      tip: 'Active streaks protect your league standings from dropping during weekly rank resets.',
    },
    {
      id: 'localization',
      title: 'Polyglot Engine & Tactile Audio',
      subtitle: 'Your workspace, tailored to how you think and learn',
      badge: 'Step 5 of 5 • Polyglot Customization',
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      color: 'from-blue-600 via-indigo-600 to-purple-600',
      borderColor: 'border-blue-500/50',
      description:
        "Switch effortlessly between English, Uzbek (O'zbek), Russian (Русский), Spanish (Español), and Chinese (中文) at any time from the top bar. Plus, toggle tactile audio for physical, responsive feedback.",
      actionText: 'Enter MindSphere Workspace',
      graphic: (
        <div className="p-4 rounded-2xl bg-[#090D1A] border border-[#1A2542] space-y-3 text-left">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Supported Languages</span>
            <Volume2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SUPPORTED_LANGUAGES.map((l) => (
              <div
                key={l.code}
                className="p-2 rounded-xl bg-[#121A32] border border-[#223055] flex items-center gap-2 text-xs text-white"
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
      tip: "You can reopen this guide anytime by clicking 'How Platform Works' in the top bar.",
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
        particleCount: 80,
        spread: 70,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0C1222] border-2 border-purple-500/50 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col p-4 sm:p-6 shadow-2xl shadow-purple-950/70 space-y-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0">
              {current.icon}
            </div>
            <div>
              <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider font-mono">
                {current.badge}
              </div>
              <div className="text-xs text-slate-400">MindSphere Walkthrough</div>
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
        <div className="flex items-center gap-1.5">
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

        {/* Main Step Headline & Description */}
        <div className="space-y-1.5 text-left">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
            {current.title}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-purple-300">
            {current.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            {current.description}
          </p>
        </div>

        {/* Interactive Step Graphic / Demo */}
        <div>{current.graphic}</div>

        {/* Pro Tip Box */}
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/30 text-xs text-purple-200 text-left flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{current.tip}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#18233C]">
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
            <span className="hidden sm:inline">Previous</span>
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
