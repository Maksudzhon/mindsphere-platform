import React, { useState } from 'react';
import {
  Settings,
  Film,
  Sliders,
  Volume2,
  VolumeX,
  Maximize2,
  Tv,
  Subtitles,
  Sparkles,
  Bot,
  User,
  Shield,
  Download,
  RotateCcw,
  Check,
  Zap,
  Globe,
  Bell,
  Palette,
  Eye,
  Keyboard,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
} from 'lucide-react';
import { PlatformSettings, UserProfile, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { soundFx } from '../utils/sound';

interface SettingsViewProps {
  user: UserProfile;
  settings: PlatformSettings;
  onUpdateSettings: (newSettings: PlatformSettings) => Promise<void>;
  onUpdateUserRole: (newRole: 'student' | 'teacher') => Promise<void>;
  onExportData: () => void;
  onResetAIQuota: () => void;
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  settings: initialSettings,
  onUpdateSettings,
  onUpdateUserRole,
  onExportData,
  onResetAIQuota,
  language,
  onChangeLanguage,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'appearance' | 'ai' | 'account' | 'data'>('video');
  const [settings, setSettings] = useState<PlatformSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [clearedHistoryToast, setClearedHistoryToast] = useState(false);

  const handleToggle = (key: keyof PlatformSettings) => {
    soundFx.playClick(650);
    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(updated);
    saveSettingsToServer(updated);

    // Sync sound setting directly with soundFx utility
    if (key === 'tactileSoundEnabled') {
      soundFx.setEnabled(!settings.tactileSoundEnabled);
    }
  };

  const handleChange = <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => {
    soundFx.playClick(720);
    const updated = {
      ...settings,
      [key]: value,
    };
    setSettings(updated);
    saveSettingsToServer(updated);
  };

  const saveSettingsToServer = async (payload: PlatformSettings) => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdateSettings(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2200);
    } catch (e) {
      console.error('Failed to save settings:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearWatchHistory = () => {
    soundFx.playClick(500);
    try {
      localStorage.removeItem('mindsphere_watch_history');
      localStorage.removeItem('mindsphere_video_progress');
      setClearedHistoryToast(true);
      setTimeout(() => setClearedHistoryToast(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl mx-auto pb-16">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0C1428] via-[#0E1A36] to-[#141A38] border border-[#1C2C4E] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
              <Settings className="w-3.5 h-3.5" />
              <span>PLATFORM CONFIGURATION & PREFERENCES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Platform Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Customize lecture video watching comfort, interface ergonomics, pedagogical rigor, and campus privacy to match your optimal scholarly rhythm.
            </p>
          </div>

          {/* Quick status badge */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {saveSuccess ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Preferences Saved</span>
              </div>
            ) : isSaving ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                <span>Synchronizing...</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-[#1C2C48] scrollbar-none">
          {[
            { id: 'video', label: 'Video Watching Comfort', icon: Film },
            { id: 'appearance', label: 'Appearance & UI', icon: Palette },
            { id: 'ai', label: 'AI Tutor & Rigor', icon: Bot },
            { id: 'account', label: 'Role & Privacy', icon: Shield },
            { id: 'data', label: 'Data & Storage', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick(600);
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                    : 'bg-[#0B1020] text-slate-400 hover:text-white hover:bg-[#131D38] border border-[#1A2744]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: VIDEO WATCHING COMFORT */}
      {/* ============================================================== */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-7 rounded-3xl bg-[#0D1426] border border-[#1F2E50] space-y-6 shadow-xl">
            <div className="border-b border-[#1A2644] pb-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-display">
                <Film className="w-5 h-5 text-purple-400" />
                <span>Lecture Video Watching Comfort & Ergonomics</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Fine-tune the course video player defaults so lectures start precisely at your preferred resolution, speed, and viewing style without repeated clicks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Default Playback Speed */}
              <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    <span>Default Playback Speed</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30">
                    {settings.defaultPlaybackSpeed}x
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Initial speed applied when starting any course lecture.
                </p>
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleChange('defaultPlaybackSpeed', spd)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        settings.defaultPlaybackSpeed === spd
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 font-bold'
                          : 'bg-[#121B30] text-slate-300 hover:bg-[#1A2642] hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Video Quality */}
              <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Tv className="w-4 h-4 text-cyan-400" />
                    <span>Default Video Quality</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30">
                    {settings.defaultVideoQuality}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Preferred streaming resolution based on your network bandwidth.
                </p>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {(['1080p', '720p', '480p', 'Auto'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => handleChange('defaultVideoQuality', q)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        settings.defaultVideoQuality === q
                          ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40 font-bold'
                          : 'bg-[#121B30] text-slate-300 hover:bg-[#1A2642] hover:text-white'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Master Volume Slider */}
              <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    {settings.defaultVolume > 0 ? (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    )}
                    <span>Default Audio Level</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    {Math.round(settings.defaultVolume * 100)}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Initial audio amplitude applied across all lesson video lectures.
                </p>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.defaultVolume}
                  onChange={(e) => handleChange('defaultVolume', parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-[#17223B] rounded-lg"
                />
              </div>

              {/* Theater Mode by Default */}
              <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-fuchsia-400" />
                    <span>Default Theater Mode</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Expand video player to full modal width automatically upon opening lectures.
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('theaterModeDefault')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    settings.theaterModeDefault ? 'bg-fuchsia-600' : 'bg-[#1C263D]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.theaterModeDefault ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Closed Captions by Default */}
              <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Subtitles className="w-4 h-4 text-blue-400" />
                    <span>Always Show Subtitles / CC</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Display synchronized closed captions on all lecture videos automatically.
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('enableCaptionsDefault')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    settings.enableCaptionsDefault ? 'bg-blue-600' : 'bg-[#1C263D]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.enableCaptionsDefault ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Auto-Play Next Lecture */}
              <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Auto-Play Next Lecture</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    When a lecture video completes, automatically advance to the next syllabus module.
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('autoPlayNextVideo')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    settings.autoPlayNextVideo ? 'bg-amber-600' : 'bg-[#1C263D]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.autoPlayNextVideo ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Keyboard Shortcuts Reference Guide */}
            <div className="p-4 rounded-2xl bg-[#070B16] border border-[#18233C] space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-purple-400" />
                <span>Player Keyboard Shortcuts Cheat Sheet</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { key: 'Space / K', action: 'Play / Pause video' },
                  { key: 'Left / J', action: 'Skip backward 10s' },
                  { key: 'Right / L', action: 'Skip forward 10s' },
                  { key: 'M', action: 'Mute / Unmute audio' },
                  { key: 'F', action: 'Toggle Fullscreen' },
                  { key: 'T', action: 'Toggle Theater Mode' },
                  { key: 'C', action: 'Toggle Captions (CC)' },
                  { key: 'Up / Down', action: 'Volume ±10%' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-[#0F162A] border border-[#1B2742] flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">
                      {item.key}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: APPEARANCE & UI */}
      {/* ============================================================== */}
      {activeTab === 'appearance' && (
        <div className="p-5 sm:p-7 rounded-3xl bg-[#0D1426] border border-[#1F2E50] space-y-6 shadow-xl">
          <div className="border-b border-[#1A2644] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-display">
              <Palette className="w-5 h-5 text-purple-400" />
              <span>Platform Appearance & Visual Ergonomics</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your academic visual accent, motion dynamics, tactile audio micro-clicks, and high-contrast accessibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Theme Accent */}
            <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] space-y-3">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Primary Scholar Theme Accent</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'purple', name: 'Royal Purple', hex: '#9333ea', bg: 'bg-purple-600' },
                  { id: 'emerald', name: 'Bio Emerald', hex: '#10b981', bg: 'bg-emerald-600' },
                  { id: 'blue', name: 'Oxford Blue', hex: '#3b82f6', bg: 'bg-blue-600' },
                  { id: 'amber', name: 'Solar Amber', hex: '#f59e0b', bg: 'bg-amber-600' },
                  { id: 'rose', name: 'Ruby Rose', hex: '#e11d48', bg: 'bg-rose-600' },
                ].map((col) => (
                  <button
                    key={col.id}
                    onClick={() => handleChange('themeAccent', col.id as any)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                      settings.themeAccent === col.id
                        ? 'border-white bg-[#151F36] scale-105 shadow-md'
                        : 'border-[#1C263E] hover:border-slate-500 bg-[#0E1528]'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full ${col.bg} shadow-sm`} />
                    <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">
                      {col.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tactile Audio Feedback Switch */}
            <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span>Tactile Audio Micro-clicks</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Subtle synthetic sound effects on button taps and lesson completion.
                </p>
              </div>
              <button
                onClick={() => handleToggle('tactileSoundEnabled')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  settings.tactileSoundEnabled ? 'bg-purple-600' : 'bg-[#1C263D]'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.tactileSoundEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Reduced Motion Dynamics</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Minimize card floating transforms and ambient backdrop animations.
                </p>
              </div>
              <button
                onClick={() => handleToggle('reducedMotion')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  settings.reducedMotion ? 'bg-cyan-600' : 'bg-[#1C263D]'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.reducedMotion ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* High Contrast Mode */}
            <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>High Contrast Scholarly Mode</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Boost font weights and border definitions for heightened readability.
                </p>
              </div>
              <button
                onClick={() => handleToggle('highContrastMode')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  settings.highContrastMode ? 'bg-emerald-600' : 'bg-[#1C263D]'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.highContrastMode ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: AI TUTOR & PEDAGOGICAL RIGOR */}
      {/* ============================================================== */}
      {activeTab === 'ai' && (
        <div className="p-5 sm:p-7 rounded-3xl bg-[#0D1426] border border-[#1F2E50] space-y-6 shadow-xl">
          <div className="border-b border-[#1A2644] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-display">
              <Bot className="w-5 h-5 text-purple-400" />
              <span>AI Pedagogical Calibration & Socrates Rigor</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Calibrate how strictly the 24/7 AI Tutor interrogates your reasoning, and whether recall assessments trigger after lectures.
            </p>
          </div>

          <div className="space-y-5">
            {/* Socratic Strictness */}
            <div className="p-5 rounded-2xl bg-[#090E1C] border border-[#192642] space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>Socratic Inquiry Strictness Level</span>
                </div>
                <span className="text-xs font-mono font-bold text-purple-300 capitalize">
                  {settings.socraticStrictness}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'gentle',
                    title: 'Gentle & Explanatory',
                    desc: 'Provides direct intuitive analogies, warm encouragement, and foundational scaffolding.',
                  },
                  {
                    id: 'standard',
                    title: 'Standard Academic Rigor',
                    desc: 'Balances theoretical deconstruction with targeted follow-up questions and real-world synthesis.',
                  },
                  {
                    id: 'rigorous',
                    title: 'Strict Socratic Cross-Exam',
                    desc: 'Challenges underlying assumptions with counter-examples and demands mathematical/doctrinal proof.',
                  },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => handleChange('socraticStrictness', tier.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      settings.socraticStrictness === tier.id
                        ? 'border-purple-500 bg-purple-950/30 shadow-md shadow-purple-950/40'
                        : 'border-[#1B2742] bg-[#0E1528] hover:border-slate-500'
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-1">{tier.title}</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Quiz After Lesson Video */}
            <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Auto-Prompt Active Recall Quiz After Video Lecture</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Immediately open a 3-question conceptual check when a video ends to cement active retention.
                </p>
              </div>
              <button
                onClick={() => handleToggle('autoQuizAfterVideo')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  settings.autoQuizAfterVideo ? 'bg-emerald-600' : 'bg-[#1C263D]'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.autoQuizAfterVideo ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Language Selector */}
            <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Primary Learning & Curriculum Language</span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-300 uppercase">
                  {language}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      soundFx.playClick();
                      onChangeLanguage(l.code);
                      handleChange('learningLanguage', l.code);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      language === l.code
                        ? 'border-blue-500 bg-blue-950/40 text-white font-bold'
                        : 'border-[#1B2742] bg-[#0E1528] text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-semibold">{l.nativeName}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{l.code.toUpperCase()}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: ROLE & PRIVACY */}
      {/* ============================================================== */}
      {activeTab === 'account' && (
        <div className="p-5 sm:p-7 rounded-3xl bg-[#0D1426] border border-[#1F2E50] space-y-6 shadow-xl">
          <div className="border-b border-[#1A2644] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-display">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>Academic Role & Campus Privacy</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Switch your active persona between Course Faculty (Teacher) and Enrolled Scholar (Student), and manage communications.
            </p>
          </div>

          <div className="space-y-5">
            {/* Active Academic Role Card */}
            <div className="p-5 rounded-2xl bg-[#090E1C] border border-[#192642] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Active Academic Role</div>
                  <div className="text-[11px] text-slate-400">
                    Determines whether you access the Faculty Course & Video Creator or Scholar Learning Deck.
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                  user.role === 'teacher'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                }`}>
                  {user.role === 'teacher' ? 'Faculty (Teacher)' : 'Scholar (Student)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => onUpdateUserRole('student')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    user.role === 'student'
                      ? 'border-purple-500 bg-purple-950/30 shadow-lg'
                      : 'border-[#1C2844] bg-[#0C1222] hover:border-slate-500 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-white">
                    <User className="w-4 h-4 text-purple-400" />
                    <span>Enrolled Scholar (Student)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Watch lecture videos with full cinema controls, take active recall quizzes, and consult the AI Tutor.
                  </p>
                </button>

                <button
                  onClick={() => onUpdateUserRole('teacher')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    user.role === 'teacher'
                      ? 'border-emerald-500 bg-emerald-950/30 shadow-lg'
                      : 'border-[#1C2844] bg-[#0C1222] hover:border-slate-500 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-white">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Faculty Member (Teacher)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Design accredited courses, upload and attach lecture videos, publish research blog articles, and track student analytics.
                  </p>
                </button>
              </div>
            </div>

            {/* Email Digest Frequency */}
            <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] space-y-2.5">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Academic Email Digest Frequency</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['daily', 'weekly', 'never'] as const).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => handleChange('emailDigestFrequency', freq)}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                      settings.emailDigestFrequency === freq
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40 font-bold'
                        : 'bg-[#121B30] text-slate-300 hover:bg-[#1A2642] hover:text-white'
                    }`}
                  >
                    {freq} Digest
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Visibility */}
            <div className="p-4 rounded-2xl bg-[#090E1C] border border-[#192642] space-y-2.5">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Scholar Profile Visibility</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'public', label: 'Public Campus' },
                  { id: 'campus_only', label: 'Study Teams Only' },
                  { id: 'private', label: 'Private (Stealth)' },
                ].map((vis) => (
                  <button
                    key={vis.id}
                    onClick={() => handleChange('profileVisibility', vis.id as any)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      settings.profileVisibility === vis.id
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40 font-bold'
                        : 'bg-[#121B30] text-slate-300 hover:bg-[#1A2642] hover:text-white'
                    }`}
                  >
                    {vis.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: DATA & STORAGE MANAGEMENT */}
      {/* ============================================================== */}
      {activeTab === 'data' && (
        <div className="p-5 sm:p-7 rounded-3xl bg-[#0D1426] border border-[#1F2E50] space-y-6 shadow-xl">
          <div className="border-b border-[#1A2644] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-display">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Data, Storage & Session Utilities</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Export your scholar achievements and courses, clear local video playback cache, or reset your daily session quotas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export Data */}
            <div className="p-5 rounded-2xl bg-[#090E1C] border border-[#192642] space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Export Scholar Portfolio (JSON)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Download a structured JSON archive of all your courses, enrolled progress, achievements, and notes.
                </p>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick(850);
                  onExportData();
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Data Archive</span>
              </button>
            </div>

            {/* Clear Video Watch History */}
            <div className="p-5 rounded-2xl bg-[#090E1C] border border-[#192642] space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Clear Local Video Watch Cache</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Resets remembered playback timestamps and video buffer cache across all lessons.
                </p>
              </div>
              <button
                onClick={handleClearWatchHistory}
                className="px-4 py-2.5 rounded-xl bg-[#1B253D] hover:bg-[#253352] text-amber-300 text-xs font-bold border border-[#2B3B60] cursor-pointer flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear Video Playback Cache</span>
              </button>
            </div>

            {/* Reset AI Quota */}
            <div className="p-5 rounded-2xl bg-[#090E1C] border border-[#192642] space-y-3 flex flex-col justify-between md:col-span-2">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Reset Daily Pedagogical Query Quota</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Instantly refresh your daily AI Tutor and concept inquiry counter back to the maximum {user.stats.dailyRequestsLimit} requests limit.
                </p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-mono text-purple-300">
                  Current: {user.stats.dailyRequestsLimit - (user.stats.dailyRequestsUsed || 0)} queries remaining
                </span>
                <button
                  onClick={() => {
                    soundFx.playChime();
                    onResetAIQuota();
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Reset Daily Quota</span>
                </button>
              </div>
            </div>
          </div>

          {clearedHistoryToast && (
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Local video playback cache cleared successfully.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
