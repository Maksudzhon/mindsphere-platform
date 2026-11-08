import React, { useState } from 'react';
import { Users, Sparkles, Check, Plus, MessageSquare, Flame } from 'lucide-react';
import { StudyTeam } from '../types';

interface TeamsViewProps {
  teams: StudyTeam[];
  onToggleJoin: (teamId: string) => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({ teams, onToggleJoin }) => {
  const [discussionInput, setDiscussionInput] = useState('');
  const [discussions, setDiscussions] = useState([
    {
      id: 'd1',
      author: 'Amara Okafor',
      team: 'BioTech Synthesizers',
      content: 'Has anyone modeled the off-target frequency of Cas12a compared to SpCas9 using the new guide RNA length?',
      time: '2h ago',
    },
    {
      id: 'd2',
      author: 'Marcus Chen',
      team: 'Spectral Mathematics Group',
      content: 'The proof for symmetric matrix real eigenvalues via Rayleigh quotients is so much more intuitive than algebraic expansion.',
      time: '4h ago',
    },
  ]);

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;

    setDiscussions([
      {
        id: `d-${Date.now()}`,
        author: 'Alex Johnson',
        team: 'BioTech Synthesizers',
        content: discussionInput,
        time: 'Just now',
      },
      ...discussions,
    ]);
    setDiscussionInput('');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Study Squads & Teams
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Collaborate on multi-disciplinary research sprints and group challenges
        </p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
              team.isJoined
                ? 'bg-[#12192F] border-purple-500/40 shadow-lg shadow-purple-950/20'
                : 'bg-[#101728] border-[#1C263D] hover:border-[#2C3B5E]'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                    {team.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {team.name}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold font-mono text-purple-400">
                    {team.weeklyXp.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">Weekly XP</div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {team.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#1A253E] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="font-mono font-medium">{team.membersCount} members</span>
              </div>

              <button
                onClick={() => onToggleJoin(team.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  team.isJoined
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-rose-950/30 hover:text-rose-300 hover:border-rose-500/30'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                }`}
              >
                {team.isJoined ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Joined Squad</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Join Squad</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Squad Collaboration Board */}
      <div className="bg-[#101728] border border-[#1C263D] rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">
              Squad Collaboration Feed
            </h3>
          </div>
          <span className="text-xs text-slate-400">Active Discussions</span>
        </div>

        {/* Input Form */}
        <form onSubmit={handlePostDiscussion} className="flex gap-3">
          <input
            type="text"
            value={discussionInput}
            onChange={(e) => setDiscussionInput(e.target.value)}
            placeholder="Share an insight, question, or study paper with your squads..."
            className="flex-1 bg-[#0C1221] border border-[#1E2942] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Post
          </button>
        </form>

        {/* Discussions List */}
        <div className="space-y-3">
          {discussions.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-xl bg-[#0C1221] border border-[#1A253E] space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{d.author}</span>
                  <span className="text-[10px] text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded-md">
                    {d.team}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{d.time}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{d.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
