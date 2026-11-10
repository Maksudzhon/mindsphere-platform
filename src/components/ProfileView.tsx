import React, { useState } from 'react';
import {
  Award,
  Clock,
  BookOpen,
  TrendingUp,
  Flame,
  Zap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Presentation,
  GraduationCap,
  Users,
  FileText,
  Heart,
  Globe,
  Building,
} from 'lucide-react';
import { UserProfile, Course, Article } from '../types';
import { ProfileEditModal } from './ProfileEditModal';
import { soundFx } from '../utils/sound';

interface ProfileViewProps {
  user: UserProfile;
  courses?: Course[];
  articles?: Article[];
  onProfileUpdated?: (updated: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  courses = [],
  articles = [],
  onProfileUpdated,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const weeklyHours = [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 6.0 },
    { day: 'Wed', hours: 5.2 },
    { day: 'Thu', hours: 7.1 },
    { day: 'Fri', hours: 4.8 },
    { day: 'Sat', hours: 8.4 },
    { day: 'Sun', hours: 6.8 },
  ];

  const maxHours = Math.max(...weeklyHours.map((d) => d.hours));
  const isTeacher = user.role === 'teacher';

  const teacherCourses = courses.filter(
    (c) => c.authorId === user.id || c.instructor.name === user.name
  );
  const teacherArticles = articles.filter(
    (a) => a.authorId === user.id || a.authorName === user.name
  );

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Profile Card */}
      <div className="bg-[#0F162A] border border-[#1E2942] rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${isTeacher ? 'bg-emerald-500/10' : 'bg-purple-600/10'}`} />

        <div className={`w-24 h-24 rounded-full ${user.avatarBg || 'bg-gradient-to-tr from-fuchsia-600 to-purple-600'} flex items-center justify-center text-white text-3xl font-extrabold ring-4 ring-purple-500/30 shadow-xl shrink-0 group hover:scale-105 transition-transform duration-300 font-display`}>
          {user.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'AJ'}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2.5 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold text-white font-display truncate">{user.name}</h1>
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isTeacher
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                }`}>
                  {isTeacher ? <Presentation className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                  <span>{isTeacher ? 'Teacher / Educator' : 'Student / Scholar'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
            </div>

            <div className="flex items-center gap-2 self-center sm:self-auto">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                {user.plan}
              </span>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsEditModalOpen(true);
                }}
                className="px-3 py-1 rounded-xl bg-[#141F36] hover:bg-[#1E2E4E] border border-[#23355A] text-purple-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Configure Profile</span>
              </button>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {user.title && <span className="text-purple-300">{user.title}</span>}
            {user.institution && (
              <span className="text-slate-400 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>{user.institution}</span>
              </span>
            )}
            {user.specialization && (
              <span className="text-slate-400 font-mono">
                Focus: <strong className="text-slate-200">{user.specialization}</strong>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {user.bio || 'Interdisciplinary scholar exploring multi-disciplinary intersections across biology, constitutional law, fine arts, and mathematical geometry.'}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-orange-400 font-mono font-semibold">
              <Flame className="w-4 h-4" />
              <span>{user.stats.streakDays}-Day Streak</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5 text-purple-400 font-mono font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{user.stats.totalXp.toLocaleString()} Total XP</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="text-slate-400 font-mono">
              {isTeacher
                ? `${user.stats.followersCount || 120} Scholar Followers`
                : `Following ${user.followedTeachers?.length || 2} Teachers`}
            </div>
          </div>
        </div>
      </div>

      {/* METRICS GRID: SPECIFIC TO TEACHER VS STUDENT */}
      {isTeacher ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0F162A] border border-[#1E2942] hover:border-emerald-500/40 transition-all shadow-md">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Courses Created</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {user.stats.coursesCreated || teacherCourses.length || 1}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Live in catalog</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F162A] border border-[#1E2942] hover:border-blue-500/40 transition-all shadow-md">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Total Scholars</span>
            </div>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
              {(user.stats.totalStudentsEnrolled || 1420).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Enrolled across terms</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F162A] border border-[#1E2942] hover:border-purple-500/40 transition-all shadow-md">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Articles Published</span>
            </div>
            <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
              {user.stats.articlesPublished || teacherArticles.length || 2}
            </div>
            <div className="text-[10px] text-purple-400 font-mono mt-0.5">In research feed</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F162A] border border-[#1E2942] hover:border-rose-500/40 transition-all shadow-md">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Article Likes</span>
            </div>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
              {user.stats.totalArticleLikes || 420}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">From student followers</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0F162A] border border-[#1E2942] hover:border-purple-500/40 transition-all shadow-md">
            <div className="text-xs text-slate-400 font-medium">Active Courses</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {user.stats.activeCourses}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F162A] border border-[#1E2942] hover:border-blue-500/40 transition-all shadow-md">
            <div className="text-xs text-slate-400 font-medium">Total Study Hours</div>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
              {user.stats.studyHours}h
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F162A] border border-[#1E2942] hover:border-emerald-500/40 transition-all shadow-md">
            <div className="text-xs text-slate-400 font-medium">Average Mastery</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {user.stats.completionRate}%
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F162A] border border-[#1E2942] hover:border-amber-500/40 transition-all shadow-md">
            <div className="text-xs text-slate-400 font-medium">Achievements</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {user.stats.achievements}
            </div>
          </div>
        </div>
      )}

      {/* Study Velocity Chart */}
      <div className="bg-[#0F162A] border border-[#1E2942] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display">Weekly Activity & Velocity</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged engagement across all academic tracks this week
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-500/30">
            +18% vs last week
          </span>
        </div>

        <div className="pt-4 flex items-end justify-between gap-3 h-44">
          {weeklyHours.map((item) => {
            const heightPercent = (item.hours / maxHours) * 100;
            return (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
              >
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-purple-300 font-semibold transition-colors">
                  {item.hours}h
                </span>
                <div className="w-full bg-[#18233C] h-32 rounded-lg flex items-end p-1 group-hover:bg-[#1E2E4E] transition-colors">
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 via-fuchsia-500 to-indigo-400 rounded-md transition-all duration-300 group-hover:scale-y-105 origin-bottom shadow-sm group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlocked Achievements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-display">
            Academic Honors & Badges ({user.achievementsList?.length || 6})
          </h3>
          <span className="text-xs text-slate-400 font-mono">Recognized milestones</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.achievementsList?.map((ach) => (
            <div
              key={ach.id}
              className="p-4 rounded-xl bg-[#0F162A] border border-[#1E2942] hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-200 flex items-start gap-3.5 group cursor-pointer shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-115 group-hover:rotate-6 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-display group-hover:text-purple-300 transition-colors">
                  {ach.title}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {ach.description}
                </p>
                <div className="text-[10px] font-mono text-purple-400/80 mt-1">
                  Unlocked {ach.unlockedAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdated={(updated) => {
          if (onProfileUpdated) onProfileUpdated(updated);
        }}
      />
    </div>
  );
};
