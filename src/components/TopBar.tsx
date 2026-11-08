import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  BookOpen,
  User,
  Crown,
  X,
  Globe,
  LogOut,
  Volume2,
  VolumeX,
  HelpCircle,
} from 'lucide-react';
import { Course, LanguageCode, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../i18n/translations';
import { soundFx } from '../utils/sound';

interface TopBarProps {
  onOpenMobileMenu: () => void;
  user: UserProfile;
  courses: Course[];
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  onSelectCourse: (course: Course) => void;
  onNavigateTab: (tab: string) => void;
  onTogglePlan: () => void;
  onSignOut: () => void;
  onOpenTour?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileMenu,
  user,
  courses,
  language,
  onChangeLanguage,
  onSelectCourse,
  onNavigateTab,
  onTogglePlan,
  onSignOut,
  onOpenTour,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(soundFx.isEnabled());

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const t = getTranslation(language);
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[2];

  // Global keyboard shortcut: cmd+k or '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close popups on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleSound = () => {
    const active = soundFx.toggle();
    setSoundEnabled(active);
  };

  const searchResults = searchQuery.trim() === ''
    ? []
    : courses.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.modules.some((m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.lessons.some((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );

  const notifications = [
    {
      id: 'n1',
      title: 'Biology Lesson Complete',
      desc: 'You completed The Electron Transport Chain Dynamics (+50 XP)',
      time: '10m ago',
    },
    {
      id: 'n2',
      title: 'Study Streak Active: Day 18',
      desc: 'Keep going! 3 more days to reach the 21-Day Habit Shield.',
      time: '2h ago',
    },
    {
      id: 'n3',
      title: 'BioTech Synthesizers Squad',
      desc: 'Elena shared new notes on Cas12 structural dynamics in team discussions.',
      time: '5h ago',
    },
  ];

  return (
    <header className="h-16 md:h-18 bg-[#090D18]/90 backdrop-blur-md border-b border-[#182136] px-3 sm:px-6 md:px-8 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30">
      {/* Left: Mobile hamburger & Search input */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl min-w-0">
        <button
          onClick={() => {
            soundFx.playClick();
            onOpenMobileMenu();
          }}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#131B2E] transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar Container with Cmd+K badge */}
        <div ref={searchContainerRef} className="relative flex-1 min-w-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                soundFx.playHover();
                setIsSearchFocused(true);
              }}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#101728] text-slate-200 placeholder:text-slate-500 text-xs sm:text-sm rounded-xl pl-9 pr-11 py-2 border border-[#1E2942] focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 focus:outline-hidden transition-all duration-150"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center absolute right-2.5 pointer-events-none text-[10px] font-mono text-slate-400 bg-[#162138] px-1.5 py-0.5 rounded border border-[#233152]">
                ⌘K
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F162A] border border-[#223050] rounded-xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto animate-fadeIn">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5 font-mono">
                Matching Courses ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-400">
                  No courses found for "{searchQuery}".
                </div>
              ) : (
                searchResults.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      soundFx.playClick();
                      onSelectCourse(course);
                      setIsSearchFocused(false);
                      setSearchQuery('');
                    }}
                    onMouseEnter={() => soundFx.playHover()}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#18233D] text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                        style={{ backgroundColor: course.color }}
                      >
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-purple-300 font-display">
                          {course.title}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-xs">
                          {course.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {course.progress}%
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Tour, Sound Toggle, Language, Notifications & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">
        {/* Platform Tour Guide Button */}
        {onOpenTour && (
          <button
            onClick={() => {
              soundFx.playChime();
              onOpenTour();
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/40 text-purple-300 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="How MindSphere Works (Tour)"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline">Guide</span>
          </button>
        )}

        {/* Audio and Language group for Tour spotlight */}
        <div id="tour-lang-sound" className="flex items-center gap-1.5 sm:gap-2">
          {/* Tactile Audio Feedback Switch */}
          <button
            onClick={handleToggleSound}
            onMouseEnter={() => soundFx.playHover()}
            className={`p-2 rounded-xl text-xs transition-all duration-200 cursor-pointer flex items-center justify-center ${
              soundEnabled
                ? 'text-purple-300 bg-purple-500/15 border border-purple-500/30 shadow-sm shadow-purple-900/40'
                : 'text-slate-400 hover:text-white bg-[#0F162A] border border-[#1E2942] hover:border-slate-600'
            }`}
            title={soundEnabled ? 'Tactile clicks enabled (Click to mute)' : 'Enable tactile audio micro-clicks'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Switcher Dropdown */}
          <div ref={langMenuRef} className="relative">
            <button
              onClick={() => {
                soundFx.playClick();
                setShowLangMenu(!showLangMenu);
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0F162A] border border-[#1E2942] hover:border-purple-500/60 text-slate-300 hover:text-white transition-all duration-200 text-xs font-semibold cursor-pointer hover:-translate-y-0.5 shadow-sm hover:shadow-md hover:shadow-purple-950/30"
              title="Change learning language"
            >
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {currentLangObj.code.toUpperCase()}
              </span>
              <span className="hidden md:inline font-medium">{currentLangObj.nativeName}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0F162A] border border-[#223050] rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1 mb-1 font-mono">
                  Language / Til / Язык
                </div>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      soundFx.playClick();
                      onChangeLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    onMouseEnter={() => soundFx.playHover()}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                      language === l.code
                        ? 'bg-purple-600 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:bg-[#18233D] hover:text-white hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#162038] text-purple-300 border border-purple-500/30">
                        {l.code.toUpperCase()}
                      </span>
                      <span>{l.nativeName}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>


        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              soundFx.playClick();
              setShowNotifications(!showNotifications);
              if (!showNotifications) setUnreadNotifications(0);
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="group p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#131B2E] transition-all duration-200 relative cursor-pointer active:scale-95"
            aria-label="View notifications"
          >
            <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:rotate-12 group-hover:text-purple-300" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-[#090D18] animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0F162A] border border-[#223050] rounded-xl shadow-2xl p-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1A253E]">
                <span className="text-xs font-semibold text-white tracking-wide">
                  Notifications
                </span>
                <span className="text-[11px] text-purple-400">All caught up</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onMouseEnter={() => soundFx.playHover()}
                    className="p-2.5 rounded-lg bg-[#141D33] hover:bg-[#1A2644] transition-all duration-150 group cursor-pointer hover:translate-x-1"
                  >
                    <div className="flex items-center justify-between text-xs font-medium text-slate-200">
                      <span className="group-hover:text-purple-300 transition-colors font-display">{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill matching screenshot */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => {
              soundFx.playClick();
              setShowUserMenu(!showUserMenu);
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="group flex items-center gap-2 sm:gap-3 pl-1.5 sm:pl-2.5 pr-1 py-1 rounded-xl hover:bg-[#131B2E] transition-all duration-200 cursor-pointer text-left focus:outline-hidden"
          >
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-sm font-semibold text-white leading-tight font-display group-hover:text-purple-300 transition-colors">
                  {user.name}
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                  user.role === 'teacher'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                }`}>
                  {user.role === 'teacher' ? 'TEACHER' : 'SCHOLAR'}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {user.plan}
              </div>
            </div>

            {/* Circular Avatar matching purple/magenta gradient circle */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-purple-500/30 group-hover:ring-purple-400/80 shadow-md group-hover:scale-110 transition-all duration-200">
              {user.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'AJ'}
            </div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0F162A] border border-[#223050] rounded-xl shadow-2xl py-2 z-50 text-sm animate-fadeIn">
              <div className="px-3 py-2 border-b border-[#1A253E]">
                <div className="font-semibold text-white font-display">{user.name}</div>
                <div className="text-xs text-slate-400">{user.email}</div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-purple-400 font-medium font-mono">
                  <Crown className="w-3.5 h-3.5" />
                  <span>{user.plan}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onNavigateTab('profile');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-[#18233D] text-left cursor-pointer transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>{t.navProfile}</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onNavigateTab('pricing');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-[#18233D] text-left cursor-pointer transition-colors"
              >
                <Crown className="w-4 h-4 text-purple-400" />
                <span>{t.navPricing}</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onTogglePlan();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-fuchsia-400 hover:bg-purple-950/40 text-left cursor-pointer transition-colors"
              >
                <span>Switch to {user.plan === 'Free Plan' ? 'MindSphere Pro' : 'Free Plan'}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={async () => {
                  soundFx.playClick();
                  const newRole = user.role === 'teacher' ? 'student' : 'teacher';
                  try {
                    await fetch('/api/user/profile', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ role: newRole }),
                    });
                    window.location.reload();
                  } catch (e) {
                    console.error(e);
                  }
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-950/40 text-left cursor-pointer transition-colors"
              >
                <span>Switch to {user.role === 'teacher' ? 'Scholar (Student)' : 'Educator (Teacher)'}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <div className="my-1 border-t border-[#1A253E]" />

              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowUserMenu(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-left cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.navSignOut}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
