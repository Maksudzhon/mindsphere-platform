import React from 'react';
import {
  Target,
  Clock,
  TrendingUp,
  Award,
  Bot,
  ArrowRight,
  Flame,
  ArrowUpRight,
  Sparkles,
  Play,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { Course, LanguageCode, UserProfile } from '../types';
import { getTranslation } from '../i18n/translations';
import { soundFx } from '../utils/sound';
import {
  DisciplineSynergyMatrix,
  CourseDisciplineBadge,
  DisciplineWatermark,
} from './DisciplineGraphics';

interface DashboardViewProps {
  user: UserProfile;
  courses: Course[];
  language: LanguageCode;
  onSelectCourse: (course: Course) => void;
  onOpenQuickAsk: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenTour?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  courses,
  language,
  onSelectCourse,
  onOpenQuickAsk,
  onNavigateTab,
  onOpenTour,
}) => {
  const t = getTranslation(language);

  const statCards = [
    {
      id: 'active-courses',
      label: t.activeCourses,
      value: user.stats.activeCourses.toString(),
      icon: Target,
      iconColor: 'text-purple-400',
      badgeBg: 'bg-purple-500/15 border border-purple-500/25',
      glowHover: 'hover:border-purple-500/40 hover:shadow-[0_16px_36px_-8px_rgba(168,85,247,0.22)]',
    },
    {
      id: 'study-hours',
      label: t.studyHours,
      value: `${user.stats.studyHours}h`,
      icon: Clock,
      iconColor: 'text-blue-400',
      badgeBg: 'bg-blue-500/15 border border-blue-500/25',
      glowHover: 'hover:border-blue-500/40 hover:shadow-[0_16px_36px_-8px_rgba(59,130,246,0.22)]',
    },
    {
      id: 'completion-rate',
      label: t.completionRate,
      value: `${user.stats.completionRate}%`,
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/15 border border-emerald-500/25',
      glowHover: 'hover:border-emerald-500/40 hover:shadow-[0_16px_36px_-8px_rgba(16,185,129,0.22)]',
    },
    {
      id: 'achievements',
      label: t.achievements,
      value: user.stats.achievements.toString(),
      icon: Award,
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/15 border border-amber-500/25',
      glowHover: 'hover:border-amber-500/40 hover:shadow-[0_16px_36px_-8px_rgba(245,158,11,0.22)]',
    },
  ];

  // Specific course hover glows matching screenshot colors with tactile depth
  const courseHoverStyles: Record<string, string> = {
    'bio-101': 'hover:border-emerald-500/60 hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.28)]',
    'law-101': 'hover:border-blue-500/60 hover:shadow-[0_20px_45px_-12px_rgba(59,130,246,0.28)]',
    'art-101': 'hover:border-pink-500/60 hover:shadow-[0_20px_45px_-12px_rgba(236,72,153,0.28)]',
    'math-101': 'hover:border-purple-500/60 hover:shadow-[0_20px_45px_-12px_rgba(139,92,246,0.28)]',
    'bus-101': 'hover:border-orange-500/60 hover:shadow-[0_20px_45px_-12px_rgba(249,115,22,0.28)]',
    'mus-101': 'hover:border-cyan-500/60 hover:shadow-[0_20px_45px_-12px_rgba(6,182,212,0.28)]',
  };

  const requestsRemaining = Math.max(0, user.stats.dailyRequestsLimit - user.stats.dailyRequestsUsed);

  // Quick concept sparks for the AI Tutor banner (clean professional copy)
  const quickSparks = [
    { label: 'Cas9 PAM Sequence', prompt: 'Explain the 5-NGG-3 PAM motif requirement in CRISPR SpCas9 with real-world examples.' },
    { label: 'Strict Scrutiny Review', prompt: 'Walk me through the three prongs of constitutional strict scrutiny review.' },
    { label: 'Eigenvectors & PCA', prompt: 'Give me an intuitive geometric explanation of how eigenvectors compress variance in PCA.' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Welcome Banner + Platform Guide Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
            {t.welcomeBack}, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-normal tracking-wide">
            {t.continueJourney}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Platform Teaching Tour CTA */}
          {onOpenTour && (
            <button
              onClick={() => {
                soundFx.playChime();
                onOpenTour();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/40 text-xs font-semibold text-purple-300 flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>How Platform Works</span>
            </button>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-[#0F162A] border border-[#1E2942] text-xs font-mono text-purple-300 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>Diamond League Rank #4</span>
          </div>
        </div>
      </div>


      {/* 4 Stat Cards in a row matching screenshot */}
      <div id="tour-stat-cards" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          // Artisanal subtle SVG mini-sparkline for each stat card
          const sparklines = [
            'M 0 16 Q 15 14 30 10 T 60 4',
            'M 0 18 Q 15 12 30 14 T 60 2',
            'M 0 16 Q 20 8 40 12 T 60 3',
            'M 0 18 Q 20 16 35 8 T 60 2',
          ];

          return (
            <div
              key={stat.id}
              onMouseEnter={() => soundFx.playHover()}
              className={`bg-[#0F162A] border border-[#1E2942] rounded-2xl p-4 sm:p-5 transition-all duration-300 ease-out group hover:-translate-y-1.5 cursor-pointer shadow-lg shadow-black/20 relative overflow-hidden ${stat.glowHover}`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6 ${stat.badgeBg}`}
                >
                  <Icon className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${stat.iconColor}`} />
                </div>

                {/* Subtle Mini Sparkline SVG */}
                <div className="opacity-40 group-hover:opacity-80 transition-opacity">
                  <svg width="48" height="20" viewBox="0 0 60 20" fill="none">
                    <path
                      d={sparklines[idx % 4]}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className={stat.iconColor}
                    />
                  </svg>
                </div>
              </div>

              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-mono tabular-nums tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium group-hover:text-slate-200 transition-colors">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Tutor Active Banner matching screenshot with interactive quick sparks */}
      <div id="tour-ai-tutor" className="relative group bg-gradient-to-r from-[#171B36] via-[#1A1C3C] to-[#14182E] border border-[#2B2956] hover:border-purple-500/50 rounded-2xl p-4 sm:p-6 shadow-xl shadow-purple-950/20 hover:shadow-[0_20px_45px_-10px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out overflow-hidden">
        {/* Subtle neural circuit background */}
        <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
          <svg viewBox="0 0 200 100" fill="none" className="w-full h-full stroke-purple-400">
            <path d="M10 50 H60 L80 20 H120 L140 80 H190" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="80" cy="20" r="3" fill="#A855F7" />
            <circle cx="140" cy="80" r="3" fill="#C084FC" />
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md shadow-purple-900/30">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-display">
                <span>{t.aiTutorActive}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse" />
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                {t.aiTutorReady} •{' '}
                <span className="font-mono text-purple-300 font-semibold">
                  {requestsRemaining}/{user.stats.dailyRequestsLimit}
                </span>{' '}
                {t.dailyRequestsRemaining}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick(720);
              onOpenQuickAsk();
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.03] active:scale-95 shrink-0 cursor-pointer text-center flex items-center justify-center gap-2 btn-tactile"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.askAiTutor}</span>
          </button>
        </div>

        {/* Quick prompt spark chips */}
        <div className="mt-4 pt-4 border-t border-purple-900/30 flex flex-wrap items-center gap-2 relative z-10">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>Instant Concept Sparks:</span>
          </span>
          {quickSparks.map((spark, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundFx.playClick(650);
                onOpenQuickAsk();
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-[#0F1426] hover:bg-purple-950/60 text-slate-300 hover:text-white border border-[#242F50] hover:border-purple-400/40 transition-all duration-150 cursor-pointer hover:scale-105 active:scale-95"
            >
              {spark.label}
            </button>
          ))}
        </div>
      </div>

      {/* Polymath Learning Streak Badge Strip */}
      <div className="bg-[#0E1526] border border-[#1A253E] hover:border-orange-500/40 hover:shadow-[0_10px_30px_-5px_rgba(249,115,22,0.15)] rounded-xl px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs transition-all duration-200 group">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-115 group-hover:rotate-6 transition-transform">
            <Flame className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-semibold text-white">
              {t.streakTitle.replace('{days}', user.stats.streakDays.toString())}
            </span>
            <span className="text-slate-400 ml-2 hidden sm:inline">
              {t.streakDesc}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onNavigateTab('leaderboard');
          }}
          onMouseEnter={() => soundFx.playHover()}
          className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer group-hover:translate-x-1.5 transition-transform"
        >
          <span>{t.viewRank} #4</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Graphics: Polymath Synergy Matrix */}
      <div id="tour-synergy-matrix">
        <DisciplineSynergyMatrix
          onSelectPair={(d1, d2) => {
            soundFx.playClick(800);
            onNavigateTab('explore');
          }}
        />
      </div>

      {/* My Courses Section matching screenshot */}
      <div id="tour-my-courses" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display flex items-center gap-2">
            <span>{t.myCourses}</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              ({courses.length} enrolled)
            </span>
          </h2>
          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateTab('my-courses');
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="text-xs font-semibold text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-1 cursor-pointer hover:translate-x-1 transition-transform"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Course Cards Grid - Responsive: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {courses.map((course) => {
            const glowClass = courseHoverStyles[course.id] || 'hover:border-purple-500/40 hover:shadow-lg';

            return (
              <div
                key={course.id}
                onClick={() => {
                  soundFx.playClick(800);
                  onSelectCourse(course);
                }}
                onMouseEnter={() => soundFx.playHover()}
                className={`bg-[#0F162A] border border-[#1E2942] rounded-2xl p-5 sm:p-5.5 transition-all duration-300 ease-out cursor-pointer group flex flex-col justify-between hover:-translate-y-2 shadow-md shadow-black/30 relative overflow-hidden ${glowClass}`}
              >
                {/* Architectural Discipline Watermark in Card Background */}
                <div className="absolute -right-3 -bottom-3 w-28 h-28 pointer-events-none select-none">
                  <DisciplineWatermark courseId={course.id} />
                </div>

                <div className="relative z-10">
                  {/* Top: Bespoke Hand-Crafted Discipline Emblem */}
                  <div className="flex items-center justify-between mb-4">
                    <CourseDisciplineBadge courseId={course.id} color={course.color} size={42} />

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-200 transition-colors font-mono">
                        {course.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors font-display">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0">
                      <span className="text-[10px] text-purple-400 font-semibold">Resume</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                  </div>

                  {/* Duration meta */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 mb-6">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono">{course.hours}h</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500 text-[11px]">{course.category}</span>
                  </div>
                </div>

                {/* Bottom: Progress Bar & Percentage */}
                <div className="space-y-2 pt-2 border-t border-[#18233C]/80 relative z-10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                      {t.progress}
                    </span>
                    <span className="font-mono font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {course.progress}%
                    </span>
                  </div>

                  <div className="w-full bg-[#1A253E] h-1.5 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out group-hover:brightness-110 relative"
                      style={{
                        width: `${course.progress}%`,
                        backgroundColor: course.color,
                      }}
                    >
                      {/* Active light sheen on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-progress-sheen pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
