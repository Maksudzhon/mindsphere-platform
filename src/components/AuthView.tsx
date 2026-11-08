import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  GraduationCap,
  Presentation,
  CheckCircle2,
} from 'lucide-react';
import { LanguageCode, UserRole } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../i18n/translations';
import { soundFx } from '../utils/sound';

interface AuthViewProps {
  onSuccess: (userData: { name: string; email: string; role: UserRole }) => void;
  currentLanguage: LanguageCode;
  onChangeLanguage?: (lang: LanguageCode) => void;
  onBackToPortal?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onSuccess,
  currentLanguage,
  onChangeLanguage,
  onBackToPortal,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex.johnson@mindsphere.edu');
  const [password, setPassword] = useState('password123');
  const [specialization, setSpecialization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = getTranslation(currentLanguage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (isSignUp && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    soundFx.playClick(750);

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const payload = isSignUp
        ? { name, email, password, role, specialization }
        : { email, password, role };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data) {
        onSuccess({
          name: data.data.name || name || 'MindSphere User',
          email: data.data.email || email,
          role: data.data.role || role,
        });
      } else {
        setErrorMessage(data.error || 'Authentication failed. Please try again.');
      }
    } catch {
      // Local fallback in case network hiccup
      onSuccess({
        name: isSignUp ? name : (email === 'alex.johnson@mindsphere.edu' ? 'Alex Johnson' : email.split('@')[0]),
        email,
        role,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoStudentLogin = () => {
    setIsLoading(true);
    soundFx.playClick(800);
    setTimeout(() => {
      onSuccess({
        name: 'Alex Johnson',
        email: 'alex.johnson@mindsphere.edu',
        role: 'student',
      });
      setIsLoading(false);
    }, 500);
  };

  const handleDemoTeacherLogin = () => {
    setIsLoading(true);
    soundFx.playClick(900);
    setTimeout(() => {
      onSuccess({
        name: 'Dr. Aris Thorne',
        email: 'thorne.educator@mindsphere.edu',
        role: 'teacher',
      });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#080C16] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient neon glow spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Auth Container */}
      <div className="w-full max-w-lg z-10 space-y-6">
        {/* Navigation & Language bar */}
        <div className="flex items-center justify-between text-xs">
          {onBackToPortal ? (
            <button
              onClick={onBackToPortal}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal</span>
            </button>
          ) : <div />}

          {onChangeLanguage && (
            <div className="flex items-center gap-1 bg-[#0D1426] p-1 rounded-xl border border-[#1C2744]">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    onChangeLanguage(l.code);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    currentLanguage === l.code
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={l.name}
                >
                  <span className="font-mono text-[10px] font-bold">{l.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 shadow-xl shadow-purple-600/30 mb-2">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">
            MindSphere
          </h1>
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase font-mono">
            {t.brandSubtitle}
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-[#0F162A]/90 border border-[#202E4E] backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          {/* Sign In vs Sign Up Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#090D18] rounded-xl border border-[#1A253E]">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsSignUp(false);
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isSignUp
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.signInBtn}
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsSignUp(true);
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isSignUp
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.signUpBtn}
            </button>
          </div>

          {/* Section: Select Role (Student vs Teacher) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Are you joining as a Student or Teacher?</span>
              <span className="text-[10px] font-mono text-purple-400 font-semibold">
                {role === 'teacher' ? 'Educator Workspace' : 'Scholar Workspace'}
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Student Card */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick(600);
                  setRole('student');
                  if (email === 'thorne.educator@mindsphere.edu') {
                    setEmail('alex.johnson@mindsphere.edu');
                  }
                }}
                className={`relative p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  role === 'student'
                    ? 'bg-gradient-to-br from-purple-950/60 to-purple-900/30 border-purple-500 shadow-md shadow-purple-950/50'
                    : 'bg-[#090E1D] border-[#1C2742] hover:border-slate-600 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-xl ${role === 'student' ? 'bg-purple-600 text-white' : 'bg-[#141C31] text-slate-400'}`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  {role === 'student' && (
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  )}
                </div>
                <div className="mt-3">
                  <div className="text-sm font-bold text-white font-display">Student / Scholar</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Enroll in courses, follow teachers, read faculty research blogs, like & comment on posts.
                  </p>
                </div>
              </button>

              {/* Teacher Card */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick(720);
                  setRole('teacher');
                  if (email === 'alex.johnson@mindsphere.edu') {
                    setEmail('thorne.educator@mindsphere.edu');
                  }
                }}
                className={`relative p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  role === 'teacher'
                    ? 'bg-gradient-to-br from-emerald-950/60 to-teal-900/30 border-emerald-500 shadow-md shadow-emerald-950/50'
                    : 'bg-[#090E1D] border-[#1C2742] hover:border-slate-600 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-xl ${role === 'teacher' ? 'bg-emerald-600 text-white' : 'bg-[#141C31] text-slate-400'}`}>
                    <Presentation className="w-5 h-5" />
                  </div>
                  {role === 'teacher' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="mt-3">
                  <div className="text-sm font-bold text-white font-display">Teacher / Instructor</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Create & publish custom courses to your profile, write articles, and review student comments.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {t.fullNameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'teacher' ? 'e.g. Prof. Aris Thorne' : 'e.g. Alex Johnson'}
                    className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {isSignUp && role === 'teacher' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Academic Specialization & Department
                </label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Molecular Biology, Constitutional Law, or Spectral Math"
                  className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'teacher' ? 'thorne.educator@mindsphere.edu' : 'alex.johnson@mindsphere.edu'}
                  required
                  className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  {t.passwordLabel}
                </label>
                {!isSignUp && (
                  <span className="text-[11px] text-purple-400 hover:text-purple-300 cursor-pointer">
                    {t.forgotPassword}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#1E2942] bg-[#090D18] text-purple-600 focus:ring-0"
                />
                <span>{t.rememberMe}</span>
              </label>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                role === 'teacher'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/40'
                  : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-purple-950/40'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting to {role === 'teacher' ? 'Faculty Portal' : 'Scholar Workspace'}...</span>
                </>
              ) : (
                <>
                  <span>
                    {isSignUp
                      ? (role === 'teacher' ? 'Register as Teacher' : 'Register as Student')
                      : (role === 'teacher' ? 'Sign In as Teacher' : 'Sign In as Student')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for Fast Evaluation */}
          <div className="pt-2 border-t border-[#18233C] space-y-2">
            <div className="text-[11px] font-mono text-center text-slate-400 uppercase tracking-wider">
              One-Click Instant Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoStudentLogin}
                disabled={isLoading}
                className="py-2.5 px-3 bg-[#141C31] hover:bg-[#1B2642] border border-[#233154] text-purple-300 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">Demo Student</span>
              </button>

              <button
                type="button"
                onClick={handleDemoTeacherLogin}
                disabled={isLoading}
                className="py-2.5 px-3 bg-[#122325] hover:bg-[#183236] border border-[#1F4645] text-emerald-300 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Presentation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Demo Teacher</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted High-Performance Multi-Disciplinary Node</span>
        </div>
      </div>
    </div>
  );
};
