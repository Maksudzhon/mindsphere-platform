export type UserRole = 'student' | 'teacher';

export interface LessonVideoSubtitle {
  timeSec: number;
  text: string;
}

export interface LessonVideoChapter {
  timeSec: number;
  title: string;
}

export interface LessonVideo {
  url: string;
  thumbnail?: string;
  durationSec?: number;
  quality?: '1080p' | '720p' | '480p' | 'Auto';
  fileName?: string;
  fileSizeMb?: number;
  subtitles?: LessonVideoSubtitle[];
  chapters?: LessonVideoChapter[];
  sourceType?: 'uploaded' | 'url' | 'academic_stream';
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  content: string;
  summary: string;
  keyTakeaways: string[];
  video?: LessonVideo;
  videoUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Course {
  id: string;
  title: string;
  category: 'Science' | 'Law' | 'Arts' | 'Mathematics' | 'Business' | 'Music' | 'Technology';
  description: string;
  hours: number;
  progress: number; // 0 - 100
  color: string; // Tailwind color class or hex
  bgGradient: string;
  iconName: 'biology' | 'law' | 'arts' | 'math' | 'business' | 'music' | 'code' | 'general';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: {
    id?: string;
    name: string;
    role: string;
    avatar?: string;
  };
  authorId?: string;
  totalStudents: number;
  rating: number;
  modules: Module[];
  sampleQuiz: QuizQuestion[];
}

export type LanguageCode = 'uz' | 'ru' | 'en' | 'es' | 'zh';

export interface ArticleComment {
  id: string;
  articleId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  category: 'Science' | 'Law' | 'Arts' | 'Mathematics' | 'Business' | 'Music' | 'Technology';
  tags: string[];
  readTime: string;
  publishedAt: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  likesCount: number;
  likedBy: string[]; // array of user emails or IDs who liked
  comments: ArticleComment[];
  courseId?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  bio?: string;
  specialization?: string;
  institution?: string;
  website?: string;
  language?: LanguageCode;
  plan: 'Free Plan' | 'MindSphere Pro' | 'Campus Enterprise';
  avatarBg: string;
  avatarUrl?: string;
  followedTeachers: string[];
  stats: {
    activeCourses: number;
    studyHours: number;
    completionRate: number;
    achievements: number;
    streakDays: number;
    totalXp: number;
    dailyRequestsUsed: number;
    dailyRequestsLimit: number;
    // Teacher metrics
    coursesCreated?: number;
    totalStudentsEnrolled?: number;
    articlesPublished?: number;
    totalArticleLikes?: number;
    followersCount?: number;
  };
  achievementsList: {
    id: string;
    title: string;
    description: string;
    category: string;
    unlockedAt: string;
    icon: string;
  }[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  role: string;
  institution: string;
  bio: string;
  avatar: string;
  specialization: string;
  coursesCount: number;
  articlesCount: number;
  followersCount: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  coursesCompleted: number;
  role?: UserRole;
  isCurrentUser?: boolean;
}

export interface StudyTeam {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  weeklyXp: number;
  description: string;
  isJoined?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  courseContext?: string;
  quizPrompt?: boolean;
  suggestedQuestions?: string[];
}

export interface PlatformSettings {
  // Video Watching Comfort:
  defaultPlaybackSpeed: number; // 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2
  defaultVideoQuality: '1080p' | '720p' | '480p' | 'Auto';
  autoPlayNextVideo: boolean;
  theaterModeDefault: boolean;
  enableCaptionsDefault: boolean;
  saveVideoWatchHistory: boolean;
  defaultVolume: number; // 0.0 - 1.0
  autoPipOnTabLeave: boolean;
  showKeyboardShortcutsGuide: boolean;

  // Platform & Interface:
  themeAccent: 'purple' | 'emerald' | 'blue' | 'amber' | 'rose';
  tactileSoundEnabled: boolean;
  reducedMotion: boolean;
  highContrastMode: boolean;
  compactSidebar: boolean;

  // Pedagogical & AI Settings:
  socraticStrictness: 'gentle' | 'standard' | 'rigorous';
  autoQuizAfterVideo: boolean;
  learningLanguage: LanguageCode;

  // Notifications & Privacy:
  emailDigestFrequency: 'daily' | 'weekly' | 'never';
  notifyOnNewArticles: boolean;
  notifyOnCourseMilestones: boolean;
  profileVisibility: 'public' | 'campus_only' | 'private';
}


