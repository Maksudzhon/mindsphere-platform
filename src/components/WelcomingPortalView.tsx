import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Globe,
  Dna,
  Scale,
  Palette,
  Binary,
  TrendingUp,
  Music,
  Check,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../i18n/translations';

interface WelcomingPortalViewProps {
  initialLanguage: LanguageCode;
  onContinueToAuth: (selectedLanguage: LanguageCode) => void;
}

export const WelcomingPortalView: React.FC<WelcomingPortalViewProps> = ({
  initialLanguage,
  onContinueToAuth,
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(initialLanguage);
  const [isWarping, setIsWarping] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const t = getTranslation(selectedLang);
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) || SUPPORTED_LANGUAGES[2];

  // Mouse parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientWidth, clientHeight } = document.documentElement;
    const x = (e.clientX / clientWidth - 0.5) * 20;
    const y = (e.clientY / clientHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleLanguagePick = (lang: LanguageCode) => {
    setSelectedLang(lang);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.35 },
      colors: ['#8B5CF6', '#D946EF', '#38BDF8'],
    });
  };

  const handleBegin = () => {
    setIsWarping(true);
    setTimeout(() => {
      onContinueToAuth(selectedLang);
    }, 850);
  };

  // Localized hero titles
  const heroTitles: Record<LanguageCode, { headline: string; sub: string; cta: string }> = {
    en: {
      headline: 'Next-Generation Multi-Disciplinary Academy',
      sub: 'Synthesizing natural sciences, jurisprudence, modern arts, and quantitative mathematics with 24/7 AI tutoring.',
      cta: 'Enter MindSphere Portal',
    },
    uz: {
      headline: "Yangi Avlod Ko'p Tarmoqli Neyron Akademiyasi",
      sub: "Tabiiy fanlar, huquqshunoslik, zamonaviy san'at va yuqori matematika 24/7 AI repetitor bilan birgalikda.",
      cta: "MindSphere Portaliga Kirish",
    },
    ru: {
      headline: 'Междисциплинарная Академия Нового Поколения',
      sub: 'Синтез естественных наук, юриспруденции, визуального искусства и высшей математики с AI-тьютором 24/7.',
      cta: 'Войти в Портал MindSphere',
    },
    es: {
      headline: 'Academia Multidisciplinaria de Nueva Generación',
      sub: 'Sintetizando ciencias naturales, jurisprudencia, artes visuales y matemáticas con tutoría de IA 24/7.',
      cta: 'Entrar al Portal MindSphere',
    },
    zh: {
      headline: '新一代跨学科全知神经认知学院',
      sub: '融合自然科学、法理学、现代视觉艺术与严谨高等数学，由全天候 Gemini 智能导师实时辅导。',
      cta: '进入 MindSphere 门户',
    },
  };

  const currentHero = heroTitles[selectedLang] || heroTitles.en;

  // Floating Discipline Orbs
  const disciplines = [
    { name: 'Biology & CRISPR', icon: Dna, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/40', pos: 'top-12 left-[10%]' },
    { name: 'Constitutional Law', icon: Scale, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-950/40', pos: 'top-20 right-[12%]' },
    { name: 'Modern Fine Arts', icon: Palette, color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-950/40', pos: 'bottom-24 left-[8%]' },
    { name: 'Spectral Mathematics', icon: Binary, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-950/40', pos: 'bottom-16 right-[14%]' },
    { name: 'Platform Economics', icon: TrendingUp, color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-950/40', pos: 'top-1/2 left-[4%]' },
    { name: 'Harmonic Music', icon: Music, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-950/40', pos: 'top-1/2 right-[5%]' },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`min-h-screen bg-[#070A14] flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans transition-all duration-700 ${
        isWarping ? 'scale-110 opacity-0 filter blur-md' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic Starfield / Particle Warp Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-purple-600/20 via-fuchsia-600/15 to-blue-600/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-fuchsia-500/10 rounded-full blur-[130px]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating Interactive Discipline Orbs (Hidden on very small screens) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        {disciplines.map((d, i) => {
          const Icon = d.icon;
          return (
            <div
              key={d.name}
              className={`absolute ${d.pos} pointer-events-auto cursor-pointer flex items-center gap-2.5 px-4 py-2.5 rounded-2xl ${d.bg} ${d.border} border backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-900/30 group`}
              style={{
                transform: `translate(${mousePos.x * (i % 2 === 0 ? 1 : -1)}px, ${mousePos.y * (i % 2 === 0 ? -1 : 1)}px)`,
              }}
            >
              <Icon className={`w-4 h-4 ${d.color} group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">{d.name}</span>
            </div>
          );
        })}
      </div>

      {/* Top Header: Brand Wordmark & Language Selector Pill */}
      <header className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 z-20 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/40 hover:scale-105 hover:rotate-6 transition-all duration-300 cursor-pointer">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2 font-display">
              <span>MindSphere</span>
            </div>
            <div className="text-[11px] font-medium text-slate-400">
              {t.brandSubtitle}
            </div>
          </div>
        </div>

        {/* 5-Language Selector Interactive Strip */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#0F1528]/90 border border-[#202C4B] rounded-2xl backdrop-blur-md shadow-xl max-w-full overflow-x-auto">
          <div className="hidden md:flex items-center gap-1.5 pl-3 pr-2 text-xs font-semibold text-slate-400 shrink-0">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>Language:</span>
          </div>

          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguagePick(lang.code)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-900/40 scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-[#151D36]'
                }`}
              >
                <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-[#18233D] text-slate-400'}`}>
                  {lang.flag}
                </span>
                <span className="hidden sm:inline">{lang.nativeName}</span>
                {isSelected && <Check className="w-3 h-3 text-white hidden sm:inline" />}
              </button>
            );
          })}
        </div>
      </header>

      {/* Centerpiece: Welcoming Portal Core & Hero Content */}
      <main className="w-full max-w-4xl mx-auto my-auto text-center z-20 space-y-6 sm:space-y-8 py-6 sm:py-8 animate-fadeIn">
        {/* Hypnotic Multi-Orbital MindSphere Core */}
        <div className="relative w-36 h-36 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
          {/* Outer ring 1 */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30 animate-[spin_18s_linear_infinite]" />

          {/* Counter-rotating ring 2 */}
          <div className="absolute inset-2 sm:inset-3 rounded-full border border-fuchsia-500/40 animate-[spin_12s_linear_infinite_reverse]" />

          {/* Tilted Ring 3 */}
          <div
            className="absolute inset-4 sm:inset-6 rounded-full border border-cyan-400/30 animate-[spin_8s_linear_infinite]"
            style={{ transform: 'rotateX(55deg) rotateY(15deg)' }}
          />

          {/* Glowing central sphere */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-500 flex items-center justify-center shadow-2xl shadow-purple-600/60 ring-4 ring-purple-400/20 group hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-9 h-9 sm:w-12 sm:h-12 text-white animate-pulse" />
          </div>

          {/* Orbiting particle dots */}
          <div className="absolute w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80 animate-ping top-2 left-6" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-fuchsia-400 shadow-lg shadow-fuchsia-400/80 animate-ping bottom-4 right-8" />
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-4 max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">{currentLangObj.flag}</span>
            <span>{currentLangObj.nativeName} Mode Active</span>
          </div>


          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {currentHero.headline}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {currentHero.sub}
          </p>
        </div>

        {/* Big Interactive "Enter MindSphere Portal" CTA */}
        <div className="pt-2 flex flex-col items-center justify-center gap-3">
          <button
            onClick={handleBegin}
            disabled={isWarping}
            className="group relative px-8 sm:px-10 py-4 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-700 hover:from-purple-500 hover:via-fuchsia-500 hover:to-purple-600 text-white font-bold text-sm sm:text-base rounded-2xl shadow-2xl shadow-purple-600/40 hover:shadow-purple-600/60 transition-all duration-200 cursor-pointer flex items-center gap-3 hover:scale-105 active:scale-95"
          >
            <span className="tracking-wide">{currentHero.cta}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />

            {/* Shimmer light effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </div>
          </button>

          <div className="text-xs text-slate-400">
            Selected: <span className="text-white font-semibold">{currentLangObj.nativeName}</span> ({currentLangObj.name})
          </div>
        </div>
      </main>

      {/* Footer Credentials */}
      <footer className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 z-20 pb-2 border-t border-[#162038] pt-4">
        <div>© 2026 MindSphere Learning Platform. High-Performance Architecture.</div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span>AI Tutor: Gemini 3.8 Flash</span>
          <span>•</span>
          <span>6 Multi-Disciplinary Tracks</span>
        </div>
      </footer>
    </div>
  );
};
