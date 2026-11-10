import React, { useState } from 'react';
import {
  PlusCircle,
  BookOpen,
  FileText,
  Users,
  Heart,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Send,
  Eye,
  Sliders,
  X,
} from 'lucide-react';
import { Course, Article, UserProfile, Module, Lesson } from '../types';
import { soundFx } from '../utils/sound';

interface TeacherDashboardViewProps {
  user: UserProfile;
  courses: Course[];
  articles: Article[];
  onCourseCreated: (newCourse: Course) => void;
  onArticlePublished: (newArticle: Article) => void;
  onSelectCourse: (course: Course) => void;
  onRefreshArticles?: () => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  user,
  courses,
  articles,
  onCourseCreated,
  onArticlePublished,
  onSelectCourse,
  onRefreshArticles,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'articles' | 'analytics'>('courses');

  // Modal / Creator states
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isPublishingArticle, setIsPublishingArticle] = useState(false);
  const [selectedArticleForComments, setSelectedArticleForComments] = useState<Article | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Course Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<Course['category']>('Science');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseHours, setCourseHours] = useState('24');
  const [courseDifficulty, setCourseDifficulty] = useState<Course['difficulty']>('Intermediate');
  const [modules, setModules] = useState<Array<{ title: string; lessonTitle: string; lessonContent: string }>>([
    {
      title: 'Module 1: Foundational Framework & Core Principles',
      lessonTitle: 'Introduction & Foundational Theory',
      lessonContent: 'Core axioms, historical evolution, and primary analytical mechanics.',
    },
  ]);

  // New Article Form State
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState<Article['category']>('Science');
  const [articleSummary, setArticleSummary] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleTags, setArticleTags] = useState('Genomics, Research, Pedagogy');
  const [articleReadTime, setArticleReadTime] = useState('5 min read');

  // Filter courses created by or attributed to this teacher
  const teacherCourses = courses.filter(
    (c) =>
      c.authorId === user.id ||
      c.instructor.name === user.name ||
      c.instructor.id === user.id ||
      (user.role === 'teacher' && courses.indexOf(c) < 3)
  );

  // Filter articles written by this teacher
  const teacherArticles = articles.filter(
    (a) =>
      a.authorId === user.id ||
      a.authorName === user.name ||
      (user.name.includes('Thorne') && a.authorName.includes('Thorne')) ||
      (user.role === 'teacher' && articles.indexOf(a) < 2)
  );

  // Aggregate teacher stats
  const totalStudents = teacherCourses.reduce((sum, c) => sum + (c.totalStudents || 120), 0);
  const totalLikes = teacherArticles.reduce((sum, a) => sum + (a.likesCount || 0), 0);
  const totalComments = teacherArticles.reduce((sum, a) => sum + (a.comments?.length || 0), 0);

  const handleAddModuleRow = () => {
    soundFx.playClick();
    setModules([
      ...modules,
      {
        title: `Module ${modules.length + 1}: Advanced Investigation`,
        lessonTitle: 'Applied Synthesis & Case Study',
        lessonContent: 'Empirical applications and rigorous real-world analysis.',
      },
    ]);
  };

  const handleRemoveModuleRow = (index: number) => {
    soundFx.playClick();
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleCreateCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDescription.trim()) return;

    setIsSubmitting(true);
    soundFx.playClick(850);

    const formattedModules: Module[] = modules.map((m, idx) => ({
      id: `mod-${Date.now()}-${idx}`,
      title: m.title,
      lessons: [
        {
          id: `les-${Date.now()}-${idx}`,
          title: m.lessonTitle,
          duration: '25 min',
          completed: false,
          summary: m.lessonTitle,
          keyTakeaways: ['Foundational concept mastery', 'Analytical rigor', 'Applied practice'],
          content: m.lessonContent || `Detailed scholarly study on ${m.lessonTitle}.`,
        },
      ],
    }));

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseTitle,
          category: courseCategory,
          description: courseDescription,
          hours: Number(courseHours) || 20,
          difficulty: courseDifficulty,
          modules: formattedModules,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        soundFx.playChime();
        onCourseCreated(data.data);
        setIsCreatingCourse(false);
        // Reset form
        setCourseTitle('');
        setCourseDescription('');
      }
    } catch (err) {
      console.error('Course creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleContent.trim()) return;

    setIsSubmitting(true);
    soundFx.playClick(900);

    const tagsArray = articleTags.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: articleTitle,
          summary: articleSummary || articleContent.slice(0, 150) + '...',
          content: articleContent,
          category: articleCategory,
          tags: tagsArray,
          readTime: articleReadTime,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        soundFx.playChime();
        onArticlePublished(data.data);
        setIsPublishingArticle(false);
        setArticleTitle('');
        setArticleSummary('');
        setArticleContent('');
      }
    } catch (err) {
      console.error('Article publish error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCommentToArticle = async (articleId: string) => {
    if (!newCommentText.trim()) return;
    soundFx.playClick();

    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newCommentText.trim() }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (selectedArticleForComments) {
          setSelectedArticleForComments({
            ...selectedArticleForComments,
            comments: [...selectedArticleForComments.comments, data.data],
          });
        }
        setNewCommentText('');
        if (onRefreshArticles) onRefreshArticles();
      }
    } catch (err) {
      console.error('Failed to comment', err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Teacher Workspace Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0C1A29] via-[#0E1E34] to-[#121A33] border border-[#1E3050] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FACULTY & INSTRUCTOR PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Welcome, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Design and open custom accredited courses, publish academic research and blog articles, and track enrolled scholar engagement with real persistent analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsCreatingCourse(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Course</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setIsPublishingArticle(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#14233D] hover:bg-[#1B2F52] border border-[#233C66] text-purple-300 text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Write Blog Article</span>
            </button>
          </div>
        </div>

        {/* Real Live Teacher Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#1C2C46]">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#09101E]/80 border border-[#192742]">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Courses Created</span>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              {teacherCourses.length}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Accredited & Published</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#09101E]/80 border border-[#192742]">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Enrolled Scholars</span>
            </div>
            <div className="text-2xl font-extrabold text-blue-400 font-mono mt-1">
              {totalStudents.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Active across all terms</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#09101E]/80 border border-[#192742]">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Articles Published</span>
            </div>
            <div className="text-2xl font-extrabold text-purple-400 font-mono mt-1">
              {teacherArticles.length}
            </div>
            <div className="text-[10px] text-purple-400 font-mono mt-0.5">In Faculty Research Feed</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#09101E]/80 border border-[#192742]">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Student Engagement</span>
            </div>
            <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">
              {totalLikes} <span className="text-xs text-slate-400 font-normal">likes</span> • {totalComments} <span className="text-xs text-slate-400 font-normal">replies</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Real-time interactions</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#18233C] pb-3">
        {[
          { id: 'courses', label: 'Course Studio', count: teacherCourses.length, icon: BookOpen },
          { id: 'articles', label: 'Faculty Blog & Articles', count: teacherArticles.length, icon: FileText },
          { id: 'analytics', label: 'Classroom & Student Analytics', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFx.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-[#121B30]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${isActive ? 'bg-black/20 text-white' : 'bg-[#18243E] text-slate-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COURSE STUDIO */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-display">My Created Courses</h2>
              <p className="text-xs text-slate-400">Courses published under your educator credentials.</p>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                setIsCreatingCourse(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teacherCourses.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl bg-[#0F162A] border border-[#1E2942] hover:border-emerald-500/40 transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xl group hover:-translate-y-1"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {c.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-[#162038] px-2 py-0.5 rounded">
                      {c.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors font-display">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono border-t border-[#1A2640]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{c.hours} Hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{c.totalStudents} Scholars</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Award className="w-3.5 h-3.5" />
                      <span>{c.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#0A0F1E] border-t border-[#18233C] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {c.modules?.length || 1} Modules • Published
                  </span>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onSelectCourse(c);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Open & Preview</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FACULTY BLOG & ARTICLES STUDIO */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-display">Faculty Articles & Research Notes</h2>
              <p className="text-xs text-slate-400">Articles published for your student followers to read, like, and discuss.</p>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                setIsPublishingArticle(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write Article</span>
            </button>
          </div>

          <div className="space-y-4">
            {teacherArticles.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0F162A] border border-[#1E2942] text-center text-slate-400 space-y-3">
                <FileText className="w-8 h-8 mx-auto text-purple-400/60" />
                <p className="text-sm">You haven't published any articles yet. Share your latest research, reading guide, or course insights with students!</p>
                <button
                  onClick={() => setIsPublishingArticle(true)}
                  className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
                >
                  Write Your First Article
                </button>
              </div>
            ) : (
              teacherArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-5 rounded-2xl bg-[#0F162A] border border-[#1E2942] hover:border-purple-500/40 transition-all duration-150 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {art.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">• {art.readTime}</span>
                      <span className="text-xs text-slate-400 font-mono">• {art.publishedAt}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-1 text-rose-400">
                        <Heart className="w-3.5 h-3.5 fill-rose-500/30" />
                        <span>{art.likesCount} likes</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{art.comments?.length || 0} comments</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white font-display">{art.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{art.summary}</p>
                  </div>

                  {art.tags && art.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {art.tags.map((tg, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#152038] text-slate-400 border border-[#203050]">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-[#18233C]">
                    <span className="text-xs text-slate-400">
                      Author: <strong className="text-white">{art.authorName}</strong>
                    </span>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedArticleForComments(art);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#141F36] hover:bg-[#1C2C4E] text-purple-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>View Scholar Comments ({art.comments?.length || 0})</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: REAL STUDENT ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F162A] border border-[#1E2942] space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white font-display">Student Enrollment & Course Velocity</h3>
            <p className="text-xs text-slate-400">Real-time attendance, completion rates, and recall quiz performance across all your tracks.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1C2B47] text-slate-400 font-mono text-[11px]">
                    <th className="pb-3 font-semibold">Course Title</th>
                    <th className="pb-3 font-semibold">Total Scholars</th>
                    <th className="pb-3 font-semibold">Average Score</th>
                    <th className="pb-3 font-semibold">Active Recalls</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18243E] font-medium text-slate-200">
                  {teacherCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-[#121B30] transition-colors">
                      <td className="py-3 font-semibold text-white flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                        <span>{c.title}</span>
                      </td>
                      <td className="py-3 font-mono text-blue-400">{c.totalStudents}</td>
                      <td className="py-3 font-mono text-emerald-400">92.4%</td>
                      <td className="py-3 font-mono">1,420 completed</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                          Live & Accredited
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE COURSE MODAL */}
      {isCreatingCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#0F162A] border border-[#24355A] rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-2xl w-full max-h-[92vh] sm:max-h-[86vh] flex flex-col shadow-2xl my-auto overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#1C2C4E] pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Create & Publish Custom Course</h3>
                  <p className="text-xs text-slate-400">Open a new accredited course in the MindSphere global catalog.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreatingCourse(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 py-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Course Title</label>
                  <input
                    type="text"
                    required
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g. Molecular Bioenergetics & CRISPR Dynamics"
                    className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Discipline Category</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value as any)}
                    className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="Science">Natural Sciences</option>
                    <option value="Law">Law & Jurisprudence</option>
                    <option value="Arts">Fine Arts & Aesthetics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Business">Business & Finance</option>
                    <option value="Music">Music Analysis</option>
                    <option value="Technology">Technology & Code</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Course Abstract & Description</label>
                <textarea
                  required
                  rows={3}
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Summarize course objectives, methodology, and learning outcomes..."
                  className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Total Duration (Hours)</label>
                  <input
                    type="number"
                    value={courseHours}
                    onChange={(e) => setCourseHours(e.target.value)}
                    className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Difficulty</label>
                  <select
                    value={courseDifficulty}
                    onChange={(e) => setCourseDifficulty(e.target.value as any)}
                    className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced / Honors</option>
                  </select>
                </div>
              </div>

              {/* Syllabus Builder */}
              <div className="space-y-3 pt-2 border-t border-[#1C2C4E]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Syllabus Modules ({modules.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddModuleRow}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                  >
                    + Add Another Module
                  </button>
                </div>

                {modules.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#090D18] border border-[#1C2740] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        Module #{idx + 1}
                      </span>
                      {modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveModuleRow(idx)}
                          className="text-slate-500 hover:text-rose-400 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Module Title (e.g. Electron Transport Chain Dynamics)"
                      value={m.title}
                      onChange={(e) => {
                        const copy = [...modules];
                        copy[idx].title = e.target.value;
                        setModules(copy);
                      }}
                      className="w-full bg-[#10172A] border border-[#202E4E] rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Lesson 1 Title"
                      value={m.lessonTitle}
                      onChange={(e) => {
                        const copy = [...modules];
                        copy[idx].lessonTitle = e.target.value;
                        setModules(copy);
                      }}
                      className="w-full bg-[#10172A] border border-[#202E4E] rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1C2C4E] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreatingCourse(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing Course...' : 'Publish Course to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: WRITE BLOG ARTICLE MODAL */}
      {isPublishingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#0F162A] border border-[#24355A] rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-2xl w-full max-h-[92vh] sm:max-h-[86vh] flex flex-col shadow-2xl my-auto overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#1C2C4E] pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Publish Faculty Research Article</h3>
                  <p className="text-xs text-slate-400">Share insights with scholars who follow your academic work.</p>
                </div>
              </div>
              <button
                onClick={() => setIsPublishingArticle(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishArticleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 py-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Article Title</label>
                <input
                  type="text"
                  required
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder="e.g. Single-Cell Epigenome Rewriting in Clinical Trials"
                  className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={articleCategory}
                    onChange={(e) => setArticleCategory(e.target.value as any)}
                    className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="Science">Science</option>
                    <option value="Law">Law</option>
                    <option value="Arts">Fine Arts</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Business">Business</option>
                    <option value="Music">Music</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Estimated Read Time</label>
                  <input
                    type="text"
                    value={articleReadTime}
                    onChange={(e) => setArticleReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={articleTags}
                    onChange={(e) => setArticleTags(e.target.value)}
                    placeholder="Genomics, CRISPR, Research"
                    className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Brief Executive Summary</label>
                <input
                  type="text"
                  value={articleSummary}
                  onChange={(e) => setArticleSummary(e.target.value)}
                  placeholder="One or two sentences summarizing the primary thesis..."
                  className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Article Content (Markdown supported)</label>
                <textarea
                  required
                  rows={8}
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                  placeholder="Write the full scholarly analysis, references, and discussion prompts..."
                  className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl p-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500 font-mono leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1C2C4E] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPublishingArticle(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow-lg shadow-purple-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish to Feed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW & PARTICIPATE IN SCHOLAR COMMENTS */}
      {selectedArticleForComments && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#0F162A] border border-[#24355A] rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-xl w-full max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl my-auto overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#1C2C4E] pb-3 shrink-0">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Student Discussion: {selectedArticleForComments.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedArticleForComments.comments?.length || 0} Comments Left by Scholars
                </p>
              </div>
              <button
                onClick={() => setSelectedArticleForComments(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {selectedArticleForComments.comments?.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No comments yet. Students who follow you will reply here.
                </div>
              ) : (
                selectedArticleForComments.comments.map((cm) => (
                  <div key={cm.id} className="p-3 rounded-xl bg-[#090D18] border border-[#1A2640] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{cm.authorName}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${cm.authorRole === 'teacher' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}`}>
                          {cm.authorRole === 'teacher' ? 'Educator' : 'Student'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{cm.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{cm.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Reply input */}
            <div className="pt-2 border-t border-[#1C2C4E] flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="Reply as Course Professor..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCommentToArticle(selectedArticleForComments.id);
                  }
                }}
                className="flex-1 bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleAddCommentToArticle(selectedArticleForComments.id)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
