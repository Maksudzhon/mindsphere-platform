import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { ExploreView } from './components/ExploreView';
import { MyCoursesView } from './components/MyCoursesView';
import { LeaderboardView } from './components/LeaderboardView';
import { TeamsView } from './components/TeamsView';
import { AITutorView } from './components/AITutorView';
import { PricingView } from './components/PricingView';
import { ProfileView } from './components/ProfileView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { ArticlesFeedView } from './components/ArticlesFeedView';
import { CourseModal } from './components/CourseModal';
import { QuickAskModal } from './components/QuickAskModal';
import { AuthView } from './components/AuthView';
import { WelcomingPortalView } from './components/WelcomingPortalView';
import { HyperspaceWelcomeAnimation } from './components/HyperspaceWelcomeAnimation';
import { PlatformTourModal } from './components/PlatformTourModal';
import { SpotlightTour } from './components/SpotlightTour';
import { LayoutDashboard, Compass, Trophy, Bot, BookOpen, FileText, User } from 'lucide-react';
import { soundFx } from './utils/sound';
import { Course, LanguageCode, LeaderboardUser, StudyTeam, UserProfile, UserRole, Article, TeacherProfile } from './types';

// Fallback initial state while loading or offline
const initialMockUser: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@mindsphere.edu',
  role: 'student',
  title: 'Undergraduate Polymath Scholar',
  bio: 'Interdisciplinary scholar focusing on computational biology, constitutional jurisprudence, and algebraic geometry.',
  specialization: 'Computational Biology & Applied Math',
  institution: 'MindSphere Global Academy',
  language: 'en',
  plan: 'Free Plan',
  avatarBg: 'bg-gradient-to-tr from-fuchsia-600 to-purple-600',
  followedTeachers: ['teacher-thorne', 'teacher-ramanujan'],
  stats: {
    activeCourses: 6,
    studyHours: 218,
    completionRate: 62,
    achievements: 24,
    streakDays: 18,
    totalXp: 4820,
    dailyRequestsUsed: 42,
    dailyRequestsLimit: 50,
    coursesCreated: 0,
    articlesPublished: 0,
  },
  achievementsList: [
    { id: 'ach-1', title: 'Polymath Velocity', description: 'Enrolled in 5+ distinct disciplines concurrently', category: 'Growth', unlockedAt: 'Nov 2026', icon: 'zap' },
    { id: 'ach-2', title: 'Deep Work Sprint', description: 'Surpassed 200 total hours of focused study', category: 'Mastery', unlockedAt: 'Oct 2026', icon: 'clock' },
    { id: 'ach-3', title: 'Pedagogical Dialogue', description: 'Completed 100+ deep conceptual tutor sessions', category: 'Recall', unlockedAt: 'Nov 2026', icon: 'bot' },
    { id: 'ach-4', title: '18-Day Streak', description: 'Daily active learning unbroken for nearly three weeks', category: 'Dedication', unlockedAt: 'Nov 2026', icon: 'flame' },
    { id: 'ach-5', title: 'Perfect Recall', description: 'Scored 100% on three consecutive practice quizzes', category: 'Accuracy', unlockedAt: 'Oct 2026', icon: 'award' },
    { id: 'ach-6', title: 'Cross-Domain Synthesis', description: 'Connected concepts across Biology and Mathematics', category: 'Insight', unlockedAt: 'Sep 2026', icon: 'sparkles' },
  ],
};

export default function App() {
  const [appStage, setAppStage] = useState<'welcome' | 'auth' | 'hyperspace' | 'dashboard'>('welcome');
  const [language, setLanguage] = useState<LanguageCode>('en');

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(initialMockUser);
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [teams, setTeams] = useState<StudyTeam[]>([]);

  // Modals
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);
  const [isQuickAskOpen, setIsQuickAskOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);
  const [tutorInitialCourse, setTutorInitialCourse] = useState<string | undefined>(undefined);

  // Initial persistent data load from Express API
  const refreshAllData = () => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) {
          setUser(d.data);
          if (d.data.language) setLanguage(d.data.language);
        }
      })
      .catch(() => {});

    fetch('/api/courses')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) setCourses(d.data);
      })
      .catch(() => {});

    fetch('/api/articles')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) setArticles(d.data);
      })
      .catch(() => {});

    fetch('/api/teachers')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) setTeachers(d.data);
      })
      .catch(() => {});

    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) setLeaderboard(d.data);
      })
      .catch(() => {});

    fetch('/api/teams')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) setTeams(d.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleAuthSuccess = (userData: { name: string; email: string; role: UserRole }) => {
    setUser((prev) => ({
      ...prev,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    }));
    refreshAllData();
    // Launch the post-login welcoming animation
    setAppStage('hyperspace');
  };

  const handleSignOut = () => {
    setAppStage('welcome');
  };

  const handleChangeLanguageDirectly = async (newLang: LanguageCode) => {
    setLanguage(newLang);
    setUser((prev) => ({ ...prev, language: newLang }));

    try {
      await fetch('/api/user/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: newLang }),
      });
    } catch (e) {
      console.warn('Could not persist language', e);
    }
  };

  const handleUpdateCourseProgress = async (
    courseId: string,
    delta: number,
    lessonId?: string,
    hoursAdded?: number
  ) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const newProg = Math.min(100, Math.max(0, c.progress + delta));
          const updatedHours = c.hours + (hoursAdded || 0);
          const updatedModules = c.modules.map((m) => ({
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId ? { ...l, completed: true } : l
            ),
          }));
          return {
            ...c,
            progress: newProg,
            hours: updatedHours,
            modules: updatedModules,
          };
        }
        return c;
      })
    );

    setUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        studyHours: prev.stats.studyHours + (hoursAdded || 0),
        totalXp: prev.stats.totalXp + 50,
      },
    }));

    try {
      await fetch(`/api/courses/${courseId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progressDelta: delta, lessonId, hoursAdded }),
      });
    } catch (e) {
      console.warn('Could not persist course progress to server', e);
    }
  };

  const handleTogglePlan = async () => {
    try {
      const res = await fetch('/api/user/toggle-plan', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
      }
    } catch {
      setUser((prev) => ({
        ...prev,
        plan: prev.plan === 'Free Plan' ? 'MindSphere Pro' : 'Free Plan',
        stats: {
          ...prev.stats,
          dailyRequestsLimit: prev.plan === 'Free Plan' ? 200 : 50,
        },
      }));
    }
  };

  const handleToggleJoinTeam = async (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              isJoined: !t.isJoined,
              membersCount: t.isJoined ? t.membersCount - 1 : t.membersCount + 1,
            }
          : t
      )
    );

    try {
      await fetch('/api/teams/toggle-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId }),
      });
    } catch (e) {
      console.warn('Could not persist team join', e);
    }
  };

  const handleUseDailyRequest = () => {
    setUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        dailyRequestsUsed: Math.min(
          prev.stats.dailyRequestsLimit,
          prev.stats.dailyRequestsUsed + 1
        ),
      },
    }));
  };

  const handleOpenFullTutor = (prompt?: string, courseContext?: string) => {
    setTutorInitialPrompt(prompt);
    setTutorInitialCourse(courseContext);
    setCurrentTab('ai-tutor');
  };

  const requestsRemaining = Math.max(
    0,
    user.stats.dailyRequestsLimit - user.stats.dailyRequestsUsed
  );

  // STAGE 1: WELCOMING TRANSITION PORTAL WITH 5-LANGUAGE CONFIGURATION
  if (appStage === 'welcome') {
    return (
      <WelcomingPortalView
        initialLanguage={language}
        onContinueToAuth={(selectedLang) => {
          setLanguage(selectedLang);
          setUser((prev) => ({ ...prev, language: selectedLang }));
          setAppStage('auth');
        }}
      />
    );
  }

  // STAGE 2: SIGN IN / LOGIN PAGE (WITH STUDENT VS TEACHER SELECTION)
  if (appStage === 'auth') {
    return (
      <AuthView
        onSuccess={handleAuthSuccess}
        currentLanguage={language}
        onChangeLanguage={handleChangeLanguageDirectly}
        onBackToPortal={() => setAppStage('welcome')}
      />
    );
  }

  // STAGE 3: CRAZY WELCOMING HYPERSPACE WARP ANIMATION
  if (appStage === 'hyperspace') {
    return (
      <HyperspaceWelcomeAnimation
        userName={user.name}
        language={language}
        onFinished={() => {
          setAppStage('dashboard');
          setIsTourOpen(true);
        }}
      />
    );
  }

  // STAGE 4: MAIN PLATFORM
  return (
    <div className="min-h-screen bg-[#080C16] text-[#F1F5F9] flex flex-col font-sans selection:bg-purple-600/30">
      {/* Sidebar Navigation (Tailored to Student vs Teacher) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setTutorInitialPrompt(undefined);
          setTutorInitialCourse(undefined);
        }}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeCoursesCount={user.stats.activeCourses}
        dailyRequestsRemaining={requestsRemaining}
        language={language}
        userRole={user.role}
        articlesCount={articles.length}
        onOpenTour={() => {
          setCurrentTab('dashboard');
          setIsTourOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <TopBar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          user={user}
          courses={courses}
          language={language}
          onChangeLanguage={handleChangeLanguageDirectly}
          onSelectCourse={(c) => setSelectedCourseForModal(c)}
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onTogglePlan={handleTogglePlan}
          onSignOut={handleSignOut}
          onOpenTour={() => {
            setCurrentTab('dashboard');
            setIsTourOpen(true);
          }}
        />

        <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {/* TAB: DASHBOARD */}
          {currentTab === 'dashboard' && (
            user.role === 'teacher' ? (
              <TeacherDashboardView
                user={user}
                courses={courses}
                articles={articles}
                onCourseCreated={(newCourse) => {
                  setCourses((prev) => [newCourse, ...prev]);
                  setUser((prev) => ({
                    ...prev,
                    stats: {
                      ...prev.stats,
                      coursesCreated: (prev.stats.coursesCreated || 0) + 1,
                      activeCourses: prev.stats.activeCourses + 1,
                      totalXp: prev.stats.totalXp + 200,
                    },
                  }));
                }}
                onArticlePublished={(newArticle) => {
                  setArticles((prev) => [newArticle, ...prev]);
                  setUser((prev) => ({
                    ...prev,
                    stats: {
                      ...prev.stats,
                      articlesPublished: (prev.stats.articlesPublished || 0) + 1,
                      totalXp: prev.stats.totalXp + 150,
                    },
                  }));
                }}
                onSelectCourse={(c) => setSelectedCourseForModal(c)}
                onRefreshArticles={refreshAllData}
              />
            ) : (
              <DashboardView
                user={user}
                courses={courses}
                language={language}
                onSelectCourse={(course) => setSelectedCourseForModal(course)}
                onOpenQuickAsk={() => setIsQuickAskOpen(true)}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onOpenTour={() => setIsTourOpen(true)}
              />
            )
          )}

          {/* TAB: ARTICLES & RESEARCH BLOG FEED */}
          {currentTab === 'articles' && (
            <ArticlesFeedView
              user={user}
              articles={articles}
              teachers={teachers}
              onArticleLiked={(articleId, updatedLikes, liked) => {
                setArticles((prev) =>
                  prev.map((a) => {
                    if (a.id === articleId) {
                      const normEmail = user.email.toLowerCase();
                      const likedBy = liked
                        ? [...a.likedBy.filter((e) => e !== normEmail), normEmail]
                        : a.likedBy.filter((e) => e !== normEmail);
                      return { ...a, likesCount: updatedLikes, likedBy };
                    }
                    return a;
                  })
                );
              }}
              onCommentAdded={(articleId, comment) => {
                setArticles((prev) =>
                  prev.map((a) =>
                    a.id === articleId
                      ? { ...a, comments: [...(a.comments || []), comment] }
                      : a
                  )
                );
              }}
              onToggleFollowTeacher={(teacherId, isFollowing) => {
                setUser((prev) => {
                  const followed = isFollowing
                    ? [...(prev.followedTeachers || []).filter((id) => id !== teacherId), teacherId]
                    : (prev.followedTeachers || []).filter((id) => id !== teacherId);
                  return { ...prev, followedTeachers: followed };
                });
                setTeachers((prev) =>
                  prev.map((t) =>
                    t.id === teacherId
                      ? { ...t, followersCount: Math.max(0, t.followersCount + (isFollowing ? 1 : -1)) }
                      : t
                  )
                );
              }}
            />
          )}

          {/* TAB: EXPLORE COURSES */}
          {currentTab === 'explore' && (
            <ExploreView
              courses={courses}
              onSelectCourse={(c) => setSelectedCourseForModal(c)}
              onEnrollCourse={(courseId) => {
                const course = courses.find((c) => c.id === courseId);
                if (course) setSelectedCourseForModal(course);
              }}
            />
          )}

          {/* TAB: MY COURSES */}
          {currentTab === 'my-courses' && (
            <MyCoursesView
              courses={courses}
              onSelectCourse={(c) => setSelectedCourseForModal(c)}
            />
          )}

          {/* TAB: LEADERBOARD */}
          {currentTab === 'leaderboard' && (
            <LeaderboardView
              leaderboard={
                leaderboard.length > 0
                  ? leaderboard
                  : [
                      { rank: 1, name: 'Dr. Sophie Lin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', xp: 7420, streak: 34, coursesCompleted: 12 },
                      { rank: 2, name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', xp: 6180, streak: 26, coursesCompleted: 9 },
                      { rank: 3, name: 'Amara Okafor', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', xp: 5540, streak: 21, coursesCompleted: 8 },
                      { rank: 4, name: user.name, avatar: '', xp: user.stats.totalXp, streak: user.stats.streakDays, coursesCompleted: 6, isCurrentUser: true },
                      { rank: 5, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', xp: 4310, streak: 15, coursesCompleted: 5 },
                      { rank: 6, name: 'Liam Gallagher', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', xp: 3950, streak: 12, coursesCompleted: 4 },
                    ]
              }
            />
          )}

          {/* TAB: STUDY TEAMS */}
          {currentTab === 'teams' && (
            <TeamsView teams={teams} onToggleJoin={handleToggleJoinTeam} />
          )}

          {/* TAB: PEDAGOGICAL SOCRATIC TUTOR */}
          {currentTab === 'ai-tutor' && (
            <AITutorView
              courses={courses}
              initialPrompt={tutorInitialPrompt}
              initialContext={tutorInitialCourse}
              dailyRequestsRemaining={requestsRemaining}
              dailyRequestsTotal={user.stats.dailyRequestsLimit}
              language={language}
              onUseRequest={handleUseDailyRequest}
            />
          )}

          {/* TAB: PRICING */}
          {currentTab === 'pricing' && (
            <PricingView user={user} onTogglePlan={handleTogglePlan} />
          )}

          {/* TAB: PROFILE & CONFIGURATION */}
          {currentTab === 'profile' && (
            <ProfileView
              user={user}
              courses={courses}
              articles={articles}
              onProfileUpdated={(updated) => setUser(updated)}
            />
          )}
        </main>
      </div>

      {/* Mobile-First Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090D18]/95 backdrop-blur-lg border-t border-[#182136] px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'articles', label: 'Articles', icon: FileText },
          { id: 'explore', label: 'Explore', icon: Compass },
          { id: 'ai-tutor', label: 'Tutor', icon: Bot, highlight: true },
          { id: 'profile', label: 'Profile', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundFx.playClick(650);
                setCurrentTab(item.id);
                setTutorInitialPrompt(undefined);
                setTutorInitialCourse(undefined);
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-purple-600/30 text-purple-300 scale-110' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Course Detail Modal */}
      <CourseModal
        course={selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
        onUpdateProgress={handleUpdateCourseProgress}
        onAskAIAboutCourse={(courseTitle, initialPrompt) => {
          handleOpenFullTutor(initialPrompt, courseTitle);
        }}
      />

      {/* Quick Ask Modal */}
      <QuickAskModal
        isOpen={isQuickAskOpen}
        onClose={() => setIsQuickAskOpen(false)}
        courses={courses}
        language={language}
        onOpenFullTutor={(p, c) => handleOpenFullTutor(p, c)}
        onUseRequest={handleUseDailyRequest}
      />

      {/* Animated Spotlight Tour Guide */}
      <SpotlightTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        language={language}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setIsTourOpen(false);
        }}
        onOpenQuickAsk={() => {
          setIsQuickAskOpen(true);
          setIsTourOpen(false);
        }}
      />
    </div>
  );
}
