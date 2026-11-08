import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  UserCheck,
  UserPlus,
  Sparkles,
  BookOpen,
  Send,
  Eye,
  Filter,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';
import { Article, ArticleComment, UserProfile, TeacherProfile } from '../types';
import { soundFx } from '../utils/sound';

interface ArticlesFeedViewProps {
  user: UserProfile;
  articles: Article[];
  teachers: TeacherProfile[];
  onArticleLiked: (articleId: string, updatedLikes: number, liked: boolean) => void;
  onCommentAdded: (articleId: string, comment: ArticleComment) => void;
  onToggleFollowTeacher: (teacherId: string, isFollowing: boolean) => void;
  onOpenTeacherProfile?: (teacherId: string) => void;
}

export const ArticlesFeedView: React.FC<ArticlesFeedViewProps> = ({
  user,
  articles,
  teachers,
  onArticleLiked,
  onCommentAdded,
  onToggleFollowTeacher,
  onOpenTeacherProfile,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'following' | 'science' | 'law' | 'arts' | 'math'>('all');
  const [selectedArticleForReading, setSelectedArticleForReading] = useState<Article | null>(null);
  const [expandedCommentsArticleId, setExpandedCommentsArticleId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isLiking, setIsLiking] = useState<string | null>(null);

  // Filtered articles
  const filteredArticles = articles.filter((art) => {
    if (filterMode === 'following') {
      return user.followedTeachers?.includes(art.authorId);
    }
    if (filterMode === 'science') return art.category === 'Science';
    if (filterMode === 'law') return art.category === 'Law';
    if (filterMode === 'arts') return art.category === 'Arts';
    if (filterMode === 'math') return art.category === 'Mathematics';
    return true;
  });

  const handleLike = async (art: Article) => {
    if (isLiking === art.id) return;
    setIsLiking(art.id);
    soundFx.playClick(850);

    const isCurrentlyLiked = art.likedBy?.includes(user.email.toLowerCase());
    const nextCount = isCurrentlyLiked ? Math.max(0, art.likesCount - 1) : art.likesCount + 1;

    // Optimistic UI update
    onArticleLiked(art.id, nextCount, !isCurrentlyLiked);

    try {
      const res = await fetch(`/api/articles/${art.id}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onArticleLiked(art.id, data.likesCount, data.liked);
      }
    } catch (e) {
      console.warn('Like toggle failed', e);
    } finally {
      setIsLiking(null);
    }
  };

  const handleAddComment = async (articleId: string) => {
    const text = commentInputs[articleId]?.trim();
    if (!text) return;
    soundFx.playClick(700);

    // Clear input
    setCommentInputs((prev) => ({ ...prev, [articleId]: '' }));

    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        onCommentAdded(articleId, data.data);
      }
    } catch (e) {
      console.error('Comment submission error', e);
    }
  };

  const handleFollowToggle = async (teacherId: string) => {
    soundFx.playClick(750);
    const isCurrentlyFollowing = user.followedTeachers?.includes(teacherId);

    // Optimistic toggle
    onToggleFollowTeacher(teacherId, !isCurrentlyFollowing);

    try {
      const res = await fetch(`/api/teachers/${teacherId}/follow`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onToggleFollowTeacher(teacherId, data.isFollowing);
      }
    } catch (e) {
      console.warn('Follow toggle failed', e);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0C1527] via-[#101C36] to-[#181534] border border-[#1E2E50] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FACULTY RESEARCH & THOUGHT LEADERSHIP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Scholarly Articles & Community Feed
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Read essays, monographs, and research breakthroughs published by professors and verified educators. Follow your instructors, like insightful analysis, and join the academic discourse.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30 px-3 py-1.5 rounded-xl">
              Following {user.followedTeachers?.length || 0} Educators
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Faculty Bar (Teachers You Can Follow) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Featured Faculty & Educators
          </h3>
          <span className="text-xs text-slate-500 font-mono">Click to follow or view publications</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {teachers.map((tch) => {
            const isFollowing = user.followedTeachers?.includes(tch.id);
            return (
              <div
                key={tch.id}
                className="p-3.5 rounded-2xl bg-[#0F162A] border border-[#1E2942] hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={tch.avatar}
                    alt={tch.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate font-display">{tch.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{tch.specialization}</div>
                    <div className="text-[10px] text-purple-400 font-mono mt-0.5">
                      {tch.followersCount} Followers
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#18233C] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">{tch.articlesCount} Articles</span>
                  <button
                    onClick={() => handleFollowToggle(tch.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      isFollowing
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-500/40'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#18233C] pb-3">
        {[
          { id: 'all', label: 'All Articles' },
          { id: 'following', label: `Following (${user.followedTeachers?.length || 0})` },
          { id: 'science', label: 'Biology & Science' },
          { id: 'law', label: 'Law & Justice' },
          { id: 'arts', label: 'Fine Arts' },
          { id: 'math', label: 'Mathematics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playClick();
              setFilterMode(tab.id as any);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterMode === tab.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                : 'text-slate-400 hover:text-white hover:bg-[#121B30]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Articles Feed */}
      <div className="space-y-6">
        {filteredArticles.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#0F162A] border border-[#1E2942] text-center text-slate-400 space-y-3">
            <FileText className="w-10 h-10 mx-auto text-purple-400/50" />
            <p className="text-sm">No articles match your selected filter.</p>
            {filterMode === 'following' && (
              <p className="text-xs text-slate-500">
                You haven't followed any teachers with published articles in this view yet. Follow Dr. Thorne, Hon. Rostova, or Dr. Ramanujan above!
              </p>
            )}
          </div>
        ) : (
          filteredArticles.map((art) => {
            const isLiked = art.likedBy?.includes(user.email.toLowerCase());
            const isFollowingAuthor = user.followedTeachers?.includes(art.authorId);
            const isCommentsExpanded = expandedCommentsArticleId === art.id;

            return (
              <article
                key={art.id}
                className="p-6 sm:p-7 rounded-3xl bg-[#0F162A] border border-[#1E2942] hover:border-purple-500/30 transition-all duration-200 space-y-4 shadow-xl group"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={art.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                      alt={art.authorName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-display group-hover:text-purple-300 transition-colors">
                          {art.authorName}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Instructor
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">{art.authorRole}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleFollowToggle(art.authorId)}
                      className={`text-xs font-semibold px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                        isFollowingAuthor
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                          : 'bg-[#18233D] hover:bg-purple-600 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isFollowingAuthor ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                      <span>{isFollowingAuthor ? 'Following' : 'Follow'}</span>
                    </button>
                  </div>
                </div>

                {/* Article Header & Category */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {art.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">• {art.readTime}</span>
                    <span className="text-xs text-slate-400 font-mono">• {art.publishedAt}</span>
                  </div>

                  <h2
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedArticleForReading(art);
                    }}
                    className="text-lg sm:text-xl font-bold text-white cursor-pointer hover:text-purple-300 transition-colors font-display leading-snug"
                  >
                    {art.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                {/* Tags */}
                {art.tags && art.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {art.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131C32] text-slate-400 border border-[#1F2D4E]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Bar: Like, Comments Toggle, Read Full */}
                <div className="pt-3 border-t border-[#18233C] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    {/* Interactive Like Button */}
                    <button
                      onClick={() => handleLike(art)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                          : 'bg-[#131C32] text-slate-400 hover:text-rose-400 hover:bg-[#1A2644]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                      <span className="font-mono">{art.likesCount}</span>
                    </button>

                    {/* Comments Toggle */}
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setExpandedCommentsArticleId(isCommentsExpanded ? null : art.id);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                        isCommentsExpanded
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                          : 'bg-[#131C32] text-slate-400 hover:text-white hover:bg-[#1A2644]'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-mono">{art.comments?.length || 0} Comments</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedArticleForReading(art);
                    }}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read Full Monograph</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Inline Expandable Comment Stream */}
                {isCommentsExpanded && (
                  <div className="pt-4 border-t border-[#18233C] space-y-3 animate-fadeIn">
                    <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                      Scholarly Discussion & Reflections ({art.comments?.length || 0})
                    </div>

                    {art.comments?.length === 0 ? (
                      <p className="text-xs text-slate-500 py-2">
                        Be the first student to reflect or ask a question on this publication!
                      </p>
                    ) : (
                      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                        {art.comments.map((cm) => (
                          <div key={cm.id} className="p-3 rounded-xl bg-[#090D18] border border-[#19253E] space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white">{cm.authorName}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${cm.authorRole === 'teacher' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}`}>
                                  {cm.authorRole === 'teacher' ? 'Educator' : 'Scholar'}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">{cm.createdAt}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{cm.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment submission input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add your scholarly reflection or question..."
                        value={commentInputs[art.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [art.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(art.id);
                        }}
                        className="flex-1 bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500"
                      />
                      <button
                        onClick={() => handleAddComment(art.id)}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* FULL ARTICLE READER MODAL */}
      {selectedArticleForReading && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F162A] border border-[#24355A] rounded-3xl p-6 sm:p-9 max-w-3xl w-full shadow-2xl space-y-6 my-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#1C2C4E] pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedArticleForReading.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                  alt={selectedArticleForReading.authorName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/30"
                />
                <div>
                  <div className="text-sm font-bold text-white font-display">
                    {selectedArticleForReading.authorName}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {selectedArticleForReading.authorRole}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedArticleForReading(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {selectedArticleForReading.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">• {selectedArticleForReading.readTime}</span>
                <span className="text-xs text-slate-400 font-mono">• {selectedArticleForReading.publishedAt}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display leading-tight">
                {selectedArticleForReading.title}
              </h1>

              <div className="p-4 rounded-xl bg-[#090E1D] border border-[#19243E] text-xs text-slate-300 italic border-l-4 border-l-purple-500">
                "{selectedArticleForReading.summary}"
              </div>

              {/* Monograph Body */}
              <div className="text-slate-200 text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-wrap font-sans pt-2">
                {selectedArticleForReading.content}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1C2C4E] flex items-center justify-between">
              <button
                onClick={() => handleLike(selectedArticleForReading)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold text-xs cursor-pointer hover:bg-purple-600 hover:text-white transition-colors"
              >
                <Heart className="w-4 h-4 fill-purple-400/30" />
                <span>Like this Monograph ({selectedArticleForReading.likesCount})</span>
              </button>

              <button
                onClick={() => setSelectedArticleForReading(null)}
                className="px-4 py-2 rounded-xl bg-[#141F36] text-slate-300 hover:text-white text-xs font-semibold"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
