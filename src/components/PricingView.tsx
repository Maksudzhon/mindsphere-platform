import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { soundFx } from '../utils/sound';

interface PricingViewProps {
  user: UserProfile;
  onTogglePlan: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ user, onTogglePlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'Free Plan',
      name: 'Free Plan',
      tagline: 'Foundational multi-disciplinary exploration',
      price: '$0',
      period: 'forever',
      features: [
        'Access to all 6 foundational disciplines',
        '50 AI Tutor requests / day (Gemini 3.8 Flash)',
        'Standard practice quizzes and recall cards',
        'Global Diamond League leaderboard participation',
        'Join up to 2 study squads',
      ],
      isCurrent: user.plan === 'Free Plan',
    },
    {
      id: 'MindSphere Pro',
      name: 'MindSphere Pro',
      tagline: 'Accelerated mastery with high-frequency AI tutoring',
      price: billingCycle === 'monthly' ? '$14' : '$11',
      period: 'per month',
      popular: true,
      features: [
        'Everything in Free Plan',
        '200 AI Tutor requests / day with Gemini 3.8 Flash',
        'On-demand dynamic AI concept quiz generator',
        'Deep concept analogies and mathematical visualizations',
        'Unlimited study squad joins & leadership',
        'Verified certificates of mastery',
      ],
      isCurrent: user.plan === 'MindSphere Pro',
    },
    {
      id: 'Campus Enterprise',
      name: 'Campus Enterprise',
      tagline: 'For research laboratories and university squads',
      price: '$29',
      period: 'per student / mo',
      features: [
        'Everything in Pro Plan',
        'Unlimited AI inquiries & priority queue',
        'Custom curriculum module upload & indexing',
        'Institutional grading rubrics & export',
        'Dedicated pedagogical engineering support',
      ],
      isCurrent: user.plan === 'Campus Enterprise',
    },
  ];

  const handleAction = (planId: string) => {
    soundFx.playClick(850);
    if (planId === 'Free Plan' || planId === 'MindSphere Pro') {
      onTogglePlan();
      if (user.plan === 'Free Plan') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
          Flexible Scalable Plans
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
          Invest in Your Polymath Journey
        </h1>
        <p className="text-slate-400 text-sm">
          Unlock high-frequency AI tutoring, unlimited squad collaborations, and active recall mastery.
        </p>

        {/* Monthly / Annual toggle */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="p-1 bg-[#0F162A] border border-[#1E2942] rounded-xl flex items-center gap-1 shadow-md">
            <button
              onClick={() => {
                soundFx.playClick(600);
                setBillingCycle('monthly');
              }}
              onMouseEnter={() => soundFx.playHover()}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => {
                soundFx.playClick(600);
                setBillingCycle('annual');
              }}
              onMouseEnter={() => soundFx.playHover()}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                billingCycle === 'annual'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 rounded-md">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid with tactile lift */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((p) => (
          <div
            key={p.id}
            onMouseEnter={() => soundFx.playHover()}
            className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ease-out relative hover:-translate-y-2 shadow-xl shadow-black/20 ${
              p.popular
                ? 'bg-gradient-to-b from-[#181A3A] to-[#101529] border-2 border-purple-500 hover:border-purple-400 hover:shadow-[0_20px_50px_-10px_rgba(168,85,247,0.3)]'
                : 'bg-[#0F162A] border border-[#1E2942] hover:border-[#2C3B5E] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]'
            }`}
          >
            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                <Crown className="w-3 h-3" />
                <span>Most Popular</span>
              </div>
            )}

            <div>
              <div className="text-base font-bold text-white font-display">{p.name}</div>
              <p className="text-xs text-slate-400 mt-1 min-h-[32px] leading-relaxed">{p.tagline}</p>

              <div className="my-5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {p.price}
                </span>
                <span className="text-xs text-slate-400 font-medium">{p.period}</span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-3 border-t border-[#1C2742]">
                {p.features.map((f, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleAction(p.id)}
                onMouseEnter={() => soundFx.playHover()}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center btn-tactile ${
                  p.isCurrent
                    ? 'bg-[#18233C] text-slate-300 border border-[#233152] hover:bg-[#1E2B4A]'
                    : p.popular
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40'
                    : 'bg-[#162038] hover:bg-[#1F2C4E] text-slate-200'
                }`}
              >
                {p.isCurrent ? 'Current Plan (Click to Toggle)' : p.id === 'MindSphere Pro' ? 'Upgrade to Pro' : 'Contact Admissions'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
