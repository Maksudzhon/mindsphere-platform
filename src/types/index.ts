export type UserRole = 'student' | 'teacher';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  content: string;
  summary: string;
  keyTakeaways: string[];
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

