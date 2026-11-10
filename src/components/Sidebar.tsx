import React from 'react';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Trophy,
  Users,
  Bot,
  CreditCard,
  User,
  Sparkles,
  X,
  FileText,
  Presentation,
  TrendingUp,
  PlusCircle,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';
import { LanguageCode, UserRole } from '../types';
import { getTranslation } from '../i18n/translations';
import { soundFx } from '../utils/sound';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  activeCoursesCount: number;
  dailyRequestsRemaining: number;
  language: LanguageCode;
  userRole?: UserRole;
  articlesCount?: number;
  onOpenTour?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpen,
  onClose,
  activeCoursesCount,
  dailyRequestsRemaining,
  language,
  userRole = 'student',
  articlesCount = 4,
  onOpenTour,
}) => {
  const t = getTranslation(language);
  const isTeacher = userRole === 'teacher';

  const teacherNavItems = [
    { id: 'dashboard', label: 'Faculty Studio', icon: LayoutDashboard },
    { id: 'articles', label: 'Faculty Blog & Posts', icon: FileText, badge: articlesCount },
    { id: 'explore', label: 'Course Catalog', icon: Compass },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const studentNavItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'articles', label: 'Faculty Articles', icon: FileText, badge: articlesCount },
    { id: 'explore', label: t.navExplore, icon: Compass },
    { id: 'my-courses', label: t.navMyCourses, icon: BookOpen, badge: activeCoursesCount },
    { id: 'ai-tutor', label: t.navAiTutor, icon: Bot, highlight: true },
    { id: 'leaderboard', label: t.navLeaderboard, icon: Trophy },
    { id: 'teams', label: t.navTeams, icon: Users },
  ];

  const mainNavItems = isTeacher ? teacherNavItems : studentNavItems;

  const bottomNavItems = [
    { id: 'pricing', label: t.navPricing, icon: CreditCard },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  const handleSelect = (id: string) => {
    soundFx.playClick(680);
    setCurrentTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#090E1D] border-r border-[#19233A] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 flex items-center justify-between px-6 border-b border-[#182238]/70">
          <button
            onClick={() => handleSelect('dashboard')}
            className="flex items-center gap-3 text-left group focus:outline-hidden cursor-pointer"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-colors duration-200 ${
              isTeacher
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-600/30'
                : 'bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-600 shadow-purple-600/30'
            }`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white leading-tight font-display group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                <span>MindSphere</span>
              </div>
              <div className="text-[11px] font-medium text-slate-400 tracking-wide flex items-center gap-1">
                {isTeacher ? (
                  <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                    <Presentation className="w-3 h-3" /> Teacher Portal
                  </span>
                ) : (
                  <span className="text-purple-300 font-mono font-semibold flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Scholar Workspace
                  </span>
                )}
              </div>
            </div>
          </button>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? isTeacher
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 font-semibold'
                      : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-600/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#131C32]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4.5 h-4.5 transition-colors duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-purple-300'
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#18243E] text-slate-300 group-hover:bg-[#1E2E4E]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.id === 'ai-tutor' && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Daily Quota / Session pill */}
        <div className="px-4 py-3 mx-3.5 mb-4 rounded-xl bg-[#0F162A] border border-[#1E2944] hover:border-purple-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Daily Queries</span>
            <span className="text-purple-400 font-mono font-semibold">
              {dailyRequestsRemaining} {t.left}
            </span>
          </div>
          <div className="w-full bg-[#18233C] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isTeacher
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-r from-purple-500 to-fuchsia-500'
              }`}
              style={{ width: `${Math.min(100, (dailyRequestsRemaining / 50) * 100)}%` }}
            />
          </div>
        </div>

        {/* Bottom Nav: Pricing & Profile */}
        <div className="p-3.5 border-t border-[#182238]/70 space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-600/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#131C32]'
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-300'
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}

          {onOpenTour && (
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
                onOpenTour();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/20 hover:bg-purple-900/40 border border-purple-500/30 transition-colors cursor-pointer mt-1.5"
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Interactive Guide</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
