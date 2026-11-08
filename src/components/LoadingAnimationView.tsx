import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Cpu, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../i18n/translations';

interface LoadingAnimationViewProps {
  language: LanguageCode;
  userName: string;
  onComplete: () => void;
}

export const LoadingAnimationView: React.FC<LoadingAnimationViewProps> = ({
  language,
  userName,
  onComplete,
}) => {
  const [progress, setProgress] = useState(12);
  const t = getTranslation(language);
  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        const delta = Math.floor(Math.random() * 14) + 8;
        return Math.min(100, prev + delta);
      });
    }, 180);

    return () => clearInterval(interval);
  }, [onComplete]);

  let statusText = t.syncingStatus1;
  if (progress >= 35 && progress < 75) {
    statusText = `${t.syncingStatus2} (${langObj?.nativeName || 'English'})`;
  } else if (progress >= 75 && progress < 100) {
    statusText = t.syncingStatus3;
  } else if (progress === 100) {
    statusText = t.syncingReady;
  }

  return (
    <div className="min-h-screen bg-[#080C16] flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md z-10 text-center space-y-8 animate-fadeIn">
        {/* Animated Orb with orbital rings */}
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/40 animate-[spin_8s_linear_infinite]" />

          {/* Reverse spinning thin ring */}
          <div className="absolute inset-2 rounded-full border border-fuchsia-500/50 animate-[spin_5s_linear_infinite_reverse]" />

          {/* Glowing central core */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-600/50 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title & Status */}
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            MindSphere Architecture
          </h2>
          <div className="text-xs text-purple-300 font-medium flex items-center justify-center gap-2 min-h-[20px]">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>{statusText}</span>
          </div>
        </div>

        {/* Progress bar container */}
        <div className="space-y-2">
          <div className="w-full bg-[#10172B] border border-[#1C2640] h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-400 h-full rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Neural Engine Sync</span>
            <span className="text-purple-400 font-bold">{progress}%</span>
          </div>
        </div>

        {/* Target language emblem indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F162A] border border-[#1E2942] text-xs text-slate-400">
          <span className="text-base">{langObj?.flag}</span>
          <span>{langObj?.nativeName} configured for {userName}</span>
        </div>
      </div>
    </div>
  );
};
