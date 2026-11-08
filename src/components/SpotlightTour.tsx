import React, { useState, useEffect, useCallback } from 'react';
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
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-ai-tutor',
    badge: 'Step 1 of 5 • Socrates AI Tutor',
    title: 'Socrates AI Interactive Tutor',
    subtitle: 'Instant analogies, Socratic questions & deep explanations',
    description:
      'Hit a roadblock in CRISPR biology, constitutional law, or multivariable calculus? Tap "Ask AI Tutor". Gemini 3.8 Flash deconstructs complex theorems with intuitive analogies and provides personalized follow-up quizzes.',
    icon: <Bot className="w-5 h-5 text-purple-400" />,
    stepType: 'tutor',
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
  },
  {
    targetId: 'tour-stat-cards',
    badge: 'Step 3 of 5 • Real-Time Metrics & Streak',
    title: 'Real-Time Mastery & Metrics',
    subtitle: 'Quantify your study hours, velocity, and league rank',
    description:
      'Monitor active courses, logged study hours, completion percentage, and earned achievements. Keep your daily study streak alive to protect your standing in the Diamond Polymath League.',
    icon: <Trophy className="w-5 h-5 text-amber-400" />,
    stepType: 'stats',
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
    width: number;
    height: number;
    bottom: number;
  } | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const currentStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];

  // Measure rect without triggering scroll loops
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
          return prev; // Identical: do not trigger state change / re-render
        }
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
        };
      });
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStepIndex]);

  // Scroll target element into view once per step change
  useEffect(() => {
    if (!isOpen) return;
    const targetId = TOUR_STEPS[currentStepIndex]?.targetId;
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    // Update rect immediately and after smooth scroll settles
    updateRect();
    const t = setTimeout(updateRect, 350);
    return () => clearTimeout(t);
  }, [isOpen, currentStepIndex, updateRect]);

  // Handle window resize and scroll events safely
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

  if (!isOpen) return null;

  const handleNext = () => {
    soundFx.playClick(780);
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      soundFx.playChime();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#EC4899', '#38BDF8', '#10B981'],
      });
      onClose();
    }
  };

  const handlePrev = () => {
    soundFx.playClick(550);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleFinish = () => {
    soundFx.playChime();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
    onClose();
  };

  // Dimensions & Layout calculations
  const padding = 12;
  const isMobile = windowSize.width < 768;

  let tooltipPos = {
    top: 0,
    left: 0,
    width: isMobile ? windowSize.width - 24 : 450,
  };

  let targetCenter = { x: windowSize.width / 2, y: windowSize.height / 2 };

  if (targetRect) {
    targetCenter = {
      x: targetRect.left + targetRect.width / 2,
      y: targetRect.top + targetRect.height / 2,
    };

    const spaceBelow = windowSize.height - targetRect.bottom;
    const spaceAbove = targetRect.top;

    if (isMobile) {
      // Mobile positioning: stay securely on-screen
      if (spaceBelow < 340 && spaceAbove > 340) {
        tooltipPos.top = Math.max(12, targetRect.top - 340);
      } else {
        tooltipPos.top = Math.max(12, windowSize.height - 350);
      }
      tooltipPos.left = 12;
    } else if (spaceBelow > 380) {
      // Position below target on desktop
      tooltipPos.top = Math.min(windowSize.height - 380, targetRect.bottom + padding + 24);
      tooltipPos.left = Math.max(24, Math.min(windowSize.width - 470, targetRect.left));
    } else {
      // Position above target on desktop
      tooltipPos.top = Math.max(24, targetRect.top - padding - 360);
      tooltipPos.left = Math.max(24, Math.min(windowSize.width - 470, targetRect.left));
    }
  } else {
    tooltipPos.top = Math.max(20, (windowSize.height - 360) / 2);
    tooltipPos.left = Math.max(12, (windowSize.width - tooltipPos.width) / 2);
  }

  // Laser Guide Trajectory calculation
  const tooltipCenter = {
    x: tooltipPos.left + tooltipPos.width / 2,
    y: tooltipPos.top + 20,
  };

  const laserPath = targetRect && !isMobile
    ? `M ${tooltipCenter.x} ${tooltipCenter.y} Q ${(tooltipCenter.x + targetCenter.x) / 2} ${(tooltipCenter.y + targetCenter.y) / 2 - 30} ${targetCenter.x} ${targetCenter.y}`
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-fadeIn">
      {/* AnyDesk Darkened Backdrop with Smooth SVG Spotlight Cutout */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-40 transition-all duration-300">
        <defs>
          <mask id="spotlight-mask">
            {/* White fills everything (darkened) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black hole cuts out spotlight on target element */}
            {targetRect && (
              <rect
                x={Math.max(0, targetRect.left - padding)}
                y={Math.max(0, targetRect.top - padding)}
                width={targetRect.width + padding * 2}
                height={targetRect.height + padding * 2}
                rx="16"
                ry="16"
                fill="black"
              />
            )}
          </mask>

          <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#D946EF" stopOpacity="1" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Shaded backdrop with mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(5, 8, 18, 0.84)"
          mask="url(#spotlight-mask)"
        />

        {/* AnyDesk Dynamic Laser Beam Trajectory */}
        {targetRect && laserPath && (
          <g>
            {/* Faint ambient laser glow */}
            <path
              d={laserPath}
              stroke="url(#laserBeamGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />
            {/* Sharp pulsing laser core with moving energy packets */}
            <path
              d={laserPath}
              stroke="url(#laserBeamGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="animate-laser-energy"
            />
            {/* Radar ring at target arrival point */}
            <circle cx={targetCenter.x} cy={targetCenter.y} r="8" fill="none" stroke="#38BDF8" strokeWidth="2" className="animate-ping" />
            <circle cx={targetCenter.x} cy={targetCenter.y} r="4" fill="#38BDF8" />
          </g>
        )}
      </svg>

      {/* AnyDesk Animated Neon Spotlight Bezel with Precision Crosshairs */}
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
          {/* Animated neon pulsing frame */}
          <div className="absolute inset-0 rounded-2xl border-2 border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.7)] animate-pulse" />
          <div className="absolute -inset-1 rounded-3xl border border-cyan-400/40 animate-ping pointer-events-none" />

          {/* Precision L-Bracket Corners */}
          <div className="absolute -top-1.5 -left-1.5 w-4.5 h-4.5 border-t-2 border-l-2 border-white rounded-tl-sm shadow-[0_0_8px_white]" />
          <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 border-t-2 border-r-2 border-white rounded-tr-sm shadow-[0_0_8px_white]" />
          <div className="absolute -bottom-1.5 -left-1.5 w-4.5 h-4.5 border-b-2 border-l-2 border-white rounded-bl-sm shadow-[0_0_8px_white]" />
          <div className="absolute -bottom-1.5 -right-1.5 w-4.5 h-4.5 border-b-2 border-r-2 border-white rounded-br-sm shadow-[0_0_8px_white]" />

          {/* Animated Cursor with Tactile Click Ripples */}
          <div className="absolute -top-11 left-4 sm:left-6 flex items-center gap-2">
            <div className="relative">
              {/* Expanding click ripple ring */}
              <div className="absolute -inset-2 rounded-full border-2 border-purple-400 animate-click-ripple" />
              {/* Animated precision mouse pointer */}
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-900/80 animate-hand-tap border border-purple-300">
                <MousePointer className="w-4 h-4 text-white -rotate-12 fill-white/20" />
              </div>
            </div>

            <div className="bg-purple-600/95 backdrop-blur-md text-white text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full shadow-lg border border-purple-400/50 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Focus Target</span>
            </div>
          </div>
        </div>
      )}

      {/* Transparent Click Interceptor */}
      <div
        className="fixed inset-0 z-50 pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />

      {/* AnyDesk Lovable Instruction Tooltip Card */}
      <div
        style={{
          position: 'fixed',
          top: tooltipPos.top,
          left: tooltipPos.left,
          width: tooltipPos.width,
          maxHeight: 'calc(100vh - 30px)',
          overflowY: 'auto',
          zIndex: 60,
        }}
        className="pointer-events-auto bg-[#0C1222]/95 border-2 border-purple-500/70 rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_-15px_rgba(139,92,246,0.5)] text-left space-y-3 sm:space-y-4 animate-fadeIn backdrop-blur-2xl"
      >
        {/* Header with Step Counter & Dismiss */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0 shadow-md shadow-purple-900/30">
              {currentStep.icon}
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                {currentStep.badge}
              </div>
              <div className="text-xs text-slate-400">MindSphere Platform Guide</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#16213A] transition-colors cursor-pointer"
            aria-label="Skip tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#141C34] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* AnyDesk Animated Feature Demonstration Screen */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#080D1A] border border-[#1A2644] overflow-hidden relative">
          {currentStep.stepType === 'tutor' && (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1.5 border-b border-[#141F38]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-purple-300 font-semibold">Gemini 3.8 Flash Neural Session</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Live Synthesis</span>
              </div>
              {/* Simulated chat exchange with animated typing */}
              <div className="space-y-2">
                <div className="bg-[#10172C] p-2 rounded-xl text-[11px] text-slate-300 border border-purple-900/30">
                  <span className="font-bold text-purple-400">Prompt:</span> "What is the biological function of the 5'-NGG-3' PAM motif?"
                </div>
                <div className="bg-purple-950/40 p-2.5 rounded-xl text-[11px] text-purple-200 border border-purple-500/30 flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-purple-600/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="leading-relaxed">
                    <span>"Think of PAM as a physical molecular keyhole. Without NGG, Cas9 cannot unwind the double helix..."</span>
                    <span className="inline-block w-1.5 h-3 bg-purple-400 ml-1 animate-pulse align-middle" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep.stepType === 'courses' && (
            <div className="space-y-2 animate-fadeIn">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Integrated Curricula</span>
                <span className="text-emerald-400 font-bold">6 Disciplines Ready</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="bg-[#06281D] border border-emerald-500/40 p-2 rounded-xl flex items-center gap-1.5 text-[11px] text-emerald-300">
                  <Dna className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold truncate">Biology</span>
                </div>
                <div className="bg-[#0B1E3F] border border-blue-500/40 p-2 rounded-xl flex items-center gap-1.5 text-[11px] text-blue-300">
                  <Scale className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold truncate">Law</span>
                </div>
                <div className="bg-[#2E0824] border border-pink-500/40 p-2 rounded-xl flex items-center gap-1.5 text-[11px] text-pink-300">
                  <Palette className="w-3.5 h-3.5 text-pink-400" />
                  <span className="font-semibold truncate">Fine Arts</span>
                </div>
                <div className="bg-[#1E0E3E] border border-purple-500/40 p-2 rounded-xl flex items-center gap-1.5 text-[11px] text-purple-300">
                  <Binary className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-semibold truncate">Math</span>
                </div>
                <div className="bg-[#2E1205] border border-orange-500/40 p-2 rounded-xl flex items-center gap-1.5 text-[11px] text-orange-300">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-semibold truncate">Business</span>
                </div>
                <div className="bg-[#051E28] border border-cyan-500/40 p-2 rounded-xl flex items-center gap-1.5 text-[11px] text-cyan-300">
                  <Music className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold truncate">Music</span>
                </div>
              </div>
            </div>
          )}

          {currentStep.stepType === 'stats' && (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Real-Time Mastery Engine</span>
                <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>14 Day Streak</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#0F162A] p-2 rounded-xl border border-[#1E2942]">
                  <div className="text-sm font-mono font-bold text-white">218h</div>
                  <div className="text-[10px] text-slate-400">Study Time</div>
                </div>
                <div className="bg-[#0F162A] p-2 rounded-xl border border-[#1E2942]">
                  <div className="text-sm font-mono font-bold text-emerald-400">62%</div>
                  <div className="text-[10px] text-slate-400">Completed</div>
                </div>
                <div className="bg-[#0F162A] p-2 rounded-xl border border-[#1E2942]">
                  <div className="text-sm font-mono font-bold text-purple-400">#4</div>
                  <div className="text-[10px] text-slate-400">Diamond League</div>
                </div>
              </div>
            </div>
          )}

          {currentStep.stepType === 'lang-sound' && (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Multi-Language & Audio Feedback</span>
                <div className="flex items-end gap-1 h-5 px-2 bg-[#121B32] rounded-lg">
                  <div className="w-1 bg-cyan-400 rounded-full animate-sound-eq-1" />
                  <div className="w-1 bg-purple-400 rounded-full animate-sound-eq-2" />
                  <div className="w-1 bg-fuchsia-400 rounded-full animate-sound-eq-3" />
                  <div className="w-1 bg-emerald-400 rounded-full animate-sound-eq-4" />
                  <div className="w-1 bg-blue-400 rounded-full animate-sound-eq-5" />
                </div>
              </div>
              <div className="flex items-center justify-around gap-1.5 bg-[#0F162A] p-2 rounded-xl border border-[#1E2942]">
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-purple-600/30 border border-purple-500/40 text-white">EN English</span>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md text-slate-400">UZ O'zbek</span>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md text-slate-400">RU Русский</span>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md text-slate-400">ES Español</span>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md text-slate-400">ZH 中文</span>
              </div>
            </div>
          )}

          {currentStep.stepType === 'synergy' && (
            <div className="space-y-2 animate-fadeIn">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Cross-Domain Synthesis</span>
                <span className="text-fuchsia-400 font-bold">Interdisciplinary</span>
              </div>
              <div className="bg-[#121630] border border-purple-500/40 p-2.5 rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-white">
                  <span className="flex items-center gap-1"><Dna className="w-3.5 h-3.5 text-emerald-400" /> Biology</span>
                  <span className="text-purple-400 font-bold">+</span>
                  <span className="flex items-center gap-1"><Binary className="w-3.5 h-3.5 text-purple-400" /> Mathematics</span>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span>Genomics</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Title & Body */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-white font-display">
            {currentStep.title}
          </h3>
          <p className="text-xs font-semibold text-purple-300">
            {currentStep.subtitle}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
            {currentStep.description}
          </p>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#18233C] gap-3">
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
              className="px-4 py-2 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer btn-tactile"
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
