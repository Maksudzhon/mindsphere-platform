import React, { useState } from 'react';
import { Trophy, Medal, Flame, BookOpen, Crown, Sparkles } from 'lucide-react';
import { LeaderboardUser } from '../types';
import { soundFx } from '../utils/sound';

interface LeaderboardViewProps {
  leaderboard: LeaderboardUser[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ leaderboard }) => {
  const [filter, setFilter] = useState<'weekly' | 'alltime'>('weekly');

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Diamond Polymath League</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-1 font-display">
            Global Scholar Leaderboard
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Rankings reset in <span className="text-purple-300 font-mono font-medium">2 days, 8 hours</span>
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#101728] border border-[#1E2942] rounded-xl self-start shadow-md">
          <button
            onClick={() => {
              soundFx.playClick(600);
              setFilter('weekly');
            }}
            onMouseEnter={() => soundFx.playHover()}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'weekly'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly XP
          </button>
          <button
            onClick={() => {
              soundFx.playClick(600);
              setFilter('alltime');
            }}
            onMouseEnter={() => soundFx.playHover()}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'alltime'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All-Time Mastery
          </button>
        </div>
      </div>

      {/* Top 3 Podium with refined glow and hover lift */}
      <div className="grid grid-cols-3 gap-3 md:gap-5 items-end pt-4 pb-2">
        {/* 2nd Place */}
        {top3[1] && (
          <div
            onMouseEnter={() => soundFx.playHover()}
            className="bg-[#0F162A] border border-[#1C263D] hover:border-slate-400/50 rounded-2xl p-4 md:p-6 text-center flex flex-col items-center justify-end h-64 relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(148,163,184,0.2)] cursor-pointer"
          >
            <div className="absolute -top-3 w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-bold text-xs flex items-center justify-center shadow-md">
              2
            </div>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden ring-3 ring-slate-400/60 mb-3 shadow-lg group-hover:scale-110 transition-transform">
              <img
                src={top3[1].avatar}
                alt={top3[1].name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-xs md:text-sm font-bold text-white truncate max-w-full font-display">
              {top3[1].name}
            </div>
            <div className="text-xs font-mono font-bold text-slate-300 mt-1">
              {top3[1].xp.toLocaleString()} XP
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>{top3[1].streak}d streak</span>
            </div>
          </div>
        )}

        {/* 1st Place (Center, Tallest) */}
        {top3[0] && (
          <div
            onMouseEnter={() => soundFx.playHover()}
            className="bg-gradient-to-b from-[#1E1B3E] to-[#101528] border-2 border-amber-500/60 hover:border-amber-400 rounded-2xl p-4 md:p-6 text-center flex flex-col items-center justify-end h-74 relative shadow-xl shadow-amber-950/30 group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_50px_-10px_rgba(245,158,11,0.3)] cursor-pointer"
          >
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-amber-400 text-amber-950 font-black text-sm flex items-center justify-center shadow-lg shadow-amber-500/40 animate-bounce">
              <Crown className="w-5 h-5" />
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-4 ring-amber-400 mb-3 shadow-xl group-hover:scale-110 transition-transform">
              <img
                src={top3[0].avatar}
                alt={top3[0].name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-sm md:text-base font-extrabold text-white truncate max-w-full font-display">
              {top3[0].name}
            </div>
            <div className="text-xs md:text-sm font-mono font-bold text-amber-400 mt-1">
              {top3[0].xp.toLocaleString()} XP
            </div>
            <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-1 font-mono">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{top3[0].streak}d streak</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div
            onMouseEnter={() => soundFx.playHover()}
            className="bg-[#0F162A] border border-[#1C263D] hover:border-amber-700/60 rounded-2xl p-4 md:p-6 text-center flex flex-col items-center justify-end h-56 relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(180,83,9,0.2)] cursor-pointer"
          >
            <div className="absolute -top-3 w-7 h-7 rounded-full bg-amber-700 text-amber-100 font-bold text-xs flex items-center justify-center shadow-md">
              3
            </div>
            <div className="w-13 h-13 md:w-15 md:h-15 rounded-full overflow-hidden ring-3 ring-amber-700/60 mb-3 shadow-md group-hover:scale-110 transition-transform">
              <img
                src={top3[2].avatar}
                alt={top3[2].name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-xs md:text-sm font-bold text-white truncate max-w-full font-display">
              {top3[2].name}
            </div>
            <div className="text-xs font-mono font-bold text-slate-300 mt-1">
              {top3[2].xp.toLocaleString()} XP
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{top3[2].streak}d streak</span>
            </div>
          </div>
        )}
      </div>

      {/* Rankings Table with row hover slide */}
      <div className="bg-[#0F162A] border border-[#1E2942] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1A253E] text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Rank & Learner</span>
          <div className="flex items-center gap-8 pr-4">
            <span className="hidden sm:inline">Active Streak</span>
            <span>XP Gained</span>
          </div>
        </div>

        <div className="divide-y divide-[#18233C]">
          {leaderboard.map((u) => {
            const isUser = u.isCurrentUser;
            return (
              <div
                key={u.rank}
                onMouseEnter={() => soundFx.playHover()}
                className={`p-4 flex items-center justify-between transition-all duration-200 cursor-pointer ${
                  isUser
                    ? 'bg-purple-950/40 border-l-4 border-purple-500 shadow-inner'
                    : 'hover:bg-[#151F38] hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`font-mono font-bold text-sm w-6 text-center ${
                      u.rank <= 3 ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    #{u.rank}
                  </span>

                  <div className="flex items-center gap-3">
                    {u.avatar ? (
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-purple-500/30">
                        AJ
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-2 font-display">
                        <span>{u.name}</span>
                        {isUser && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        {u.coursesCompleted} courses completed
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 pr-4">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>{u.streak}d</span>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-purple-400">
                      {u.xp.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">XP</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
