import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Bot,
  BookOpen,
  Trophy,
  Volume2,
  Globe,
  Compass,
  Zap,
  Flame,
  MousePointer,
  Dna,
  Scale,
  Palette,
  Binary,
  TrendingUp,
  Music,
  Activity,
  Maximize2,
  Minimize2,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/sound';
import { LanguageCode } from '../types';

export interface TourStep {
  targetId: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  stepType: 'tutor' | 'courses' | 'stats' | 'lang-sound' | 'synergy';
  color: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-ai-tutor',
    badge: 'Step 1 of 5 • Socrates AI Tutor',
    title: 'Socrates AI Interactive Tutor',
    subtitle: 'Neural Socratic dialogue & instant concept synthesis',
    description:
      'Hit a roadblock in CRISPR biology, constitutional law, or multivariable calculus? Tap "Ask AI Tutor". The pedagogical engine deconstructs complex theorems with intuitive analogies and provides personalized follow-up quizzes.',
    icon: <Bot className="w-5 h-5 text-purple-400" />,
    stepType: 'tutor',
    color: '#A855F7',
  },
  {
    targetId: 'tour-my-courses',
    badge: 'Step 2 of 5 • Multi-Disciplinary Tracks',
    title: 'Multi-Disciplinary Curricula',
    subtitle: 'Biology, Law, Arts, Math, Business & Music',
    description:
      'Click on any course card to inspect the interactive syllabus, read bite-sized conceptual lessons, and test your retention with active-recall quizzes. Each card tracks your exact study hours and progress.',
    icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
    stepType: 'courses',
    color: '#10B981',
  },
  {
    targetId: 'tour-stat-cards',
    badge: 'Step 3 of 5 • Real-Time Metrics & Streak',
    title: 'Real-Time Mastery & Metrics',
    subtitle: 'Quantify study hours, velocity, and league rank',
    description:
      'Monitor active courses, logged study hours, completion percentage, and earned achievements. Keep your daily study streak alive to protect your standing in the Diamond Polymath League.',
    icon: <Trophy className="w-5 h-5 text-amber-400" />,
    stepType: 'stats',
    color: '#F59E0B',
  },
  {
    targetId: 'tour-lang-sound',
    badge: 'Step 4 of 5 • Polyglot System & Audio',
    title: 'Polyglot Engine & Tactile Audio',
    subtitle: 'English, Uzbek, Russian, Spanish, Chinese',
    description:
      'Switch your interface language at any moment in the top bar. You can also toggle subtle physical click sound effects for that responsive, satisfying tactile feedback.',
    icon: <Globe className="w-5 h-5 text-blue-400" />,
    stepType: 'lang-sound',
    color: '#38BDF8',
  },
  {
    targetId: 'tour-synergy-matrix',
    badge: 'Step 5 of 5 • Cross-Disciplinary Synthesis',
    title: 'Polymath Synergy Matrix',
    subtitle: 'Where multi-disciplinary innovation happens',
    description:
      'Explore how cross-pollinating disciplines generates intellectual breakthroughs—such as Computational Genomics (Biology + Math) or Algorithmic Venture Law (Law + Business).',
    icon: <Compass className="w-5 h-5 text-fuchsia-400" />,
    stepType: 'synergy',
    color: '#EC4899',
  },
];

interface SpotlightTourProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onNavigateTab?: (tab: string) => void;
  onOpenQuickAsk?: () => void;
}

export const SpotlightTour: React.FC<SpotlightTourProps> = ({
  isOpen,
  onClose,
  language,
  onNavigateTab,
  onOpenQuickAsk,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<{
    top: number;
    left: number;
    right: number;
    width: number;
    height: number;
    bottom: number;
  } | null>(null);

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const cardRef = useRef<HTMLDivElement>(null);

  const currentStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];
  const isMobile = windowSize.width < 768;

  // Measure target element rect safely
  const updateRect = useCallback(() => {
    if (!isOpen) return;
    const targetId = TOUR_STEPS[currentStepIndex]?.targetId;
    if (!targetId) {
      setTargetRect(null);
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect((prev) => {
        if (
          prev &&
          Math.abs(prev.top - rect.top) < 1 &&
          Math.abs(prev.left - rect.left) < 1 &&
          Math.abs(prev.width - rect.width) < 1 &&
          Math.abs(prev.height - rect.height) < 1
        ) {
          return prev;
        }
        return {
          top: rect.top,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
        };
      });
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStepIndex]);

  // Smooth scroll target element into safe area when step changes
  useEffect(() => {
    if (!isOpen) return;
    const targetId = TOUR_STEPS[currentStepIndex]?.targetId;
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        if (window.innerWidth < 768) {
          // On mobile: scroll target into top 30% of viewport so bottom HUD never covers it
          const rect = el.getBoundingClientRect();
          const targetY = window.scrollY + rect.top - 80;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        } else {
          // On laptop/desktop: center element nicely
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    updateRect();
    const t = setTimeout(updateRect, 300);
    return () => clearTimeout(t);
  }, [isOpen, currentStepIndex, updateRect]);

  // Handle window resize and scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      updateRect();
    };

    const handleScroll = () => {
      updateRect();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, updateRect]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    soundFx.playClick(820);
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#38BDF8', '#10B981'],
      });
      onClose();
    }
  };

  const handlePrev = () => {
    soundFx.playClick(580);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleFinish = () => {
    onClose();
  };

  // Dimensions & Clamped Layout Calculations
  const padding = isMobile ? 8 : 14;
  const cardWidth = isMobile ? windowSize.width - 24 : Math.min(500, windowSize.width - 48);
  const cardMaxHeight = isMobile ? Math.min(windowSize.height * 0.54, 420) : Math.min(windowSize.height - 60, 520);

  let tooltipPos: { top: number; left: number; width: number } = {
    top: 20,
    left: 12,
    width: cardWidth,
  };

  let targetCenter = { x: windowSize.width / 2, y: windowSize.height / 2 };

  if (targetRect) {
    targetCenter = {
      x: targetRect.left + targetRect.width / 2,
      y: targetRect.top + targetRect.height / 2,
    };

    if (isMobile) {
      // Mobile: Fixed ergonomic bottom HUD drawer
      tooltipPos = {
        top: Math.max(12, windowSize.height - cardMaxHeight - 16),
        left: 12,
        width: windowSize.width - 24,
      };
    } else {
      // Desktop / Laptop: Smart Viewport-Clamped HUD
      const spaceBelow = windowSize.height - targetRect.bottom;
      const spaceAbove = targetRect.top;
      const estimatedCardH = 430;

      let top = 20;
      let left = Math.max(24, Math.min(windowSize.width - cardWidth - 24, targetRect.left));

      if (spaceBelow >= estimatedCardH + 30) {
        // Place below target
        top = targetRect.bottom + padding + 20;
      } else if (spaceAbove >= estimatedCardH + 30) {
        // Place above target
        top = Math.max(20, targetRect.top - estimatedCardH - padding - 20);
      } else {
        // Target is centered or laptop screen has tight height: place on the opposite side
        if (targetRect.left > windowSize.width / 2) {
          // Target is on right: place card on left
          left = Math.max(24, targetRect.left - cardWidth - 30);
          top = Math.max(20, Math.min(windowSize.height - estimatedCardH - 24, targetRect.top));
        } else {
          // Target is on left: place card on right
          left = Math.min(windowSize.width - cardWidth - 24, targetRect.right + 30);
          top = Math.max(20, Math.min(windowSize.height - estimatedCardH - 24, targetRect.top));
        }
      }

      // Hard clamp inside viewport bounds so modal is NEVER cut off
      top = Math.max(20, Math.min(windowSize.height - estimatedCardH - 20, top));
      left = Math.max(24, Math.min(windowSize.width - cardWidth - 24, left));

      tooltipPos = {
        top,
        left,
        width: cardWidth,
      };
    }
  } else {
    // Fallback if target element not found in DOM
    tooltipPos = {
      top: Math.max(20, (windowSize.height - 440) / 2),
      left: Math.max(12, (windowSize.width - cardWidth) / 2),
      width: cardWidth,
    };
  }

  // Laser trajectory path
  const tooltipCenter = {
    x: tooltipPos.left + tooltipPos.width / 2,
    y: isMobile ? tooltipPos.top : tooltipPos.top + 24,
  };

  const laserPath = targetRect
    ? `M ${tooltipCenter.x} ${tooltipCenter.y} Q ${(tooltipCenter.x + targetCenter.x) / 2} ${(tooltipCenter.y + targetCenter.y) / 2 - (isMobile ? 15 : 35)} ${targetCenter.x} ${targetCenter.y}`
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-fadeIn">
      {/* High-Tech Cyber Shaded Backdrop with Mask */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-40 transition-all duration-300">
        <defs>
          <mask id="spotlight-mask-pro">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={Math.max(0, targetRect.left - padding)}
                y={Math.max(0, targetRect.top - padding)}
                width={targetRect.width + padding * 2}
                height={targetRect.height + padding * 2}
                rx="20"
                ry="20"
                fill="black"
              />
            )}
          </mask>

          <linearGradient id="cyberLaserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#EC4899" stopOpacity="1" />
            <stop offset="80%" stopColor="#38BDF8" stopOpacity="1" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
          </linearGradient>

          <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shaded Backdrop */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(4, 7, 16, 0.88)"
          mask="url(#spotlight-mask-pro)"
        />

        {/* Clean Architectural Connecting Guide Line */}
        {targetRect && laserPath && (
          <g>
            <path
              d={laserPath}
              stroke="rgba(168, 85, 247, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              fill="none"
            />
            <circle cx={targetCenter.x} cy={targetCenter.y} r="3" fill="#A855F7" />
          </g>
        )}
      </svg>

      {/* Refined Target Focus Frame */}
      {targetRect && (
        <div
          className="fixed pointer-events-none z-40 transition-all duration-300 ease-out"
          style={{
            left: Math.max(0, targetRect.left - padding),
            top: Math.max(0, targetRect.top - padding),
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
          }}
        >
          {/* Subtle Ambient Focus Frame */}
          <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/70 shadow-[0_0_24px_rgba(168,85,247,0.25)]" />

          {/* 4 Precision Corner Accents */}
          <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-purple-300 rounded-tl-xs shadow-sm" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-purple-300 rounded-tr-xs shadow-sm" />
          <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-purple-300 rounded-bl-xs shadow-sm" />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-purple-300 rounded-br-xs shadow-sm" />

          {/* Clean Context Status Tag */}
          <div className="absolute -top-8 left-2 sm:left-3 flex items-center gap-1.5">
            <div className="bg-[#090E1F]/95 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1.5 tracking-wider backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ACTIVE TARGET // {currentStep.targetId.replace('tour-', '').toUpperCase()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Transparent Click Interceptor to prevent unintended page interactions */}
      <div
        className="fixed inset-0 z-50 pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />

      {/* Cybernetic HUD Instruction Card (Fully responsive for Mobile & Laptop) */}
      <div
        ref={cardRef}
        style={{
          position: 'fixed',
          top: tooltipPos.top,
          left: tooltipPos.left,
          width: tooltipPos.width,
          maxHeight: `${cardMaxHeight}px`,
          zIndex: 60,
        }}
        className="pointer-events-auto bg-[#0A0F20]/95 border-2 border-purple-500/80 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(139,92,246,0.5)] text-left flex flex-col justify-between animate-fadeIn backdrop-blur-2xl overflow-y-auto"
      >
        {/* Top Bar: Step Badge & Close */}
        <div className="flex items-center justify-between gap-3 shrink-0 pb-2 border-b border-[#18233C]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/50 flex items-center justify-center shrink-0 shadow-md shadow-purple-900/40">
              {currentStep.icon}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>{currentStep.badge}</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">Interactive System Guide</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#16213A] transition-colors cursor-pointer shrink-0"
            aria-label="Exit tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#141C34] h-1.5 rounded-full overflow-hidden my-2.5 shrink-0">
          <div
            className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Scrollable Content Body */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-0.5">
          {/* Animated Mini Demonstration Simulation */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#060914] border border-[#1C2846] overflow-hidden relative shadow-inner">
            {/* STEP 1: AI TUTOR SIMULATION */}
            {currentStep.stepType === 'tutor' && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1.5 border-b border-[#141F38]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono text-purple-300 font-semibold text-[11px]">Neural Socratic Engine</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                    <Activity className="w-3 h-3 text-purple-400" />
                    <span>Real-Time Recall</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="bg-[#0F162A] p-2 rounded-xl text-[11px] text-slate-200 border border-purple-900/30 flex items-start gap-1.5">
                    <span className="text-purple-400 font-bold font-mono">Q:</span>
                    <span>"Explain how CRISPR Cas9 cuts DNA with PAM sequence"</span>
                  </div>
                  <div className="bg-purple-950/40 p-2.5 rounded-xl text-[11px] text-purple-100 border border-purple-500/30 flex items-start gap-2">
                    <Bot className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <span>"Think of PAM (5'-NGG-3') as a safety keyhole. Cas9 verifies the key before unwinding and introducing blunt double-strand cleavage..."</span>
                      <span className="inline-block w-1.5 h-3 bg-purple-400 ml-1 animate-pulse align-middle" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: MULTI-DISCIPLINARY 3D ORBIT SIMULATION */}
            {currentStep.stepType === 'courses' && (
              <div className="space-y-2 animate-fadeIn">
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>6 Interconnected Disciplines</span>
                  <span className="text-emerald-400 font-bold text-[10px]">Universal Curricula</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <div className="bg-[#06281D] border border-emerald-500/40 p-2 rounded-xl flex items-center gap-1.5 text-[11px] text-emerald-300">
                    <Dna className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-bold truncate">Biology</span>
                  </div>
                  <div className="bg-[#0B1E3F] border border-blue-500/40 p-2 rounded-xl flex items-center gap-1.5 text-[11px] text-blue-300">
                    <Scale className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="font-bold truncate">Law</span>
                  </div>
                  <div className="bg-[#2E0824] border border-pink-500/40 p-2 rounded-xl flex items-center gap-1.5 text-[11px] text-pink-300">
                    <Palette className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span className="font-bold truncate">Arts</span>
                  </div>
                  <div className="bg-[#1E0E3E] border border-purple-500/40 p-2 rounded-xl flex items-center gap-1.5 text-[11px] text-purple-300">
                    <Binary className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="font-bold truncate">Math</span>
                  </div>
                  <div className="bg-[#2E1205] border border-orange-500/40 p-2 rounded-xl flex items-center gap-1.5 text-[11px] text-orange-300">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="font-bold truncate">Business</span>
                  </div>
                  <div className="bg-[#051E28] border border-cyan-500/40 p-2 rounded-xl flex items-center gap-1.5 text-[11px] text-cyan-300">
                    <Music className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-bold truncate">Music</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: REAL-TIME STATS & STREAK */}
            {currentStep.stepType === 'stats' && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium">Mastery Metrics</span>
                  <div className="flex items-center gap-1.5 text-orange-400 font-mono font-semibold">
                    <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-400" />
                    <span>18-Day Active Streak</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-[#0F162A] p-2 rounded-xl border border-[#1E2942]">
                    <div className="text-sm font-mono font-bold text-white">218h</div>
                    <div className="text-[10px] text-slate-400">Study Time</div>
                  </div>
                  <div className="bg-[#0F162A] p-2 rounded-xl border border-[#1E2942]">
                    <div className="text-sm font-mono font-bold text-emerald-400">62%</div>
                    <div className="text-[10px] text-slate-400">Mastery</div>
                  </div>
                  <div className="bg-[#0F162A] p-2 rounded-xl border border-[#1E2942]">
                    <div className="text-sm font-mono font-bold text-purple-400">4,820</div>
                    <div className="text-[10px] text-slate-400">Total XP</div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: POLYGLOT SIMULATION */}
            {currentStep.stepType === 'lang-sound' && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium">Academic Localization</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    5 Global Languages
                  </span>
                </div>
                <div className="flex items-center justify-around gap-1 bg-[#0F162A] p-1.5 rounded-xl border border-[#1E2942]">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-600/30 border border-purple-500/40 text-white">EN</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-slate-400">UZ</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-slate-400">RU</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-slate-400">ES</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-slate-400">ZH</span>
                </div>
              </div>
            )}

            {/* STEP 5: CROSS-DOMAIN COLLIDER SIMULATION */}
            {currentStep.stepType === 'synergy' && (
              <div className="space-y-2 animate-fadeIn">
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Particle Synthesis Collider</span>
                  <span className="text-fuchsia-400 font-bold text-[10px]">Interdisciplinary Moat</span>
                </div>
                <div className="bg-[#10142C] border border-purple-500/40 p-2.5 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-white">
                    <span className="flex items-center gap-1 text-[11px]"><Dna className="w-3.5 h-3.5 text-emerald-400" /> Biology</span>
                    <span className="text-purple-400 font-bold">+</span>
                    <span className="flex items-center gap-1 text-[11px]"><Binary className="w-3.5 h-3.5 text-purple-400" /> Math</span>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span>Genomics</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step Text Information */}
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white font-display leading-tight">
              {currentStep.title}
            </h3>
            <p className="text-xs font-semibold text-purple-300">
              {currentStep.subtitle}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
              {currentStep.description}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#18233C] gap-3 shrink-0 mt-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              currentStepIndex === 0
                ? 'opacity-30 cursor-not-allowed text-slate-600'
                : 'text-slate-300 hover:text-white hover:bg-[#16213A]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFinish}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 font-medium transition-colors cursor-pointer"
            >
              Skip
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Start Learning' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
