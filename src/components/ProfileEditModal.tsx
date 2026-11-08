import React, { useState } from 'react';
import {
  X,
  User,
  GraduationCap,
  Presentation,
  CheckCircle2,
  Sparkles,
  Building,
  Globe,
  FileText,
  Save,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { soundFx } from '../utils/sound';

interface ProfileEditModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (updatedUser: UserProfile) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  user,
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<UserRole>(user.role);
  const [title, setTitle] = useState(user.title || '');
  const [bio, setBio] = useState(user.bio || '');
  const [specialization, setSpecialization] = useState(user.specialization || '');
  const [institution, setInstitution] = useState(user.institution || '');
  const [website, setWebsite] = useState(user.website || '');
  const [avatarBg, setAvatarBg] = useState(user.avatarBg || 'bg-gradient-to-tr from-fuchsia-600 to-purple-600');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const colorOptions = [
    { label: 'Fuchsia Purple', class: 'bg-gradient-to-tr from-fuchsia-600 to-purple-600' },
    { label: 'Emerald Teal', class: 'bg-gradient-to-tr from-emerald-600 to-teal-600' },
    { label: 'Royal Blue', class: 'bg-gradient-to-tr from-blue-600 to-indigo-600' },
    { label: 'Sunset Amber', class: 'bg-gradient-to-tr from-amber-600 to-rose-600' },
    { label: 'Violet Indigo', class: 'bg-gradient-to-tr from-purple-600 to-indigo-700' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setIsSaving(true);
    soundFx.playClick(850);
    setError(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role,
          title: title.trim(),
          bio: bio.trim(),
          specialization: specialization.trim(),
          institution: institution.trim(),
          website: website.trim(),
          avatarBg,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        soundFx.playChime();
        onProfileUpdated(data.data);
        onClose();
      } else {
        setError(data.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      console.error('Profile update failed:', err);
      // Fallback local update
      onProfileUpdated({
        ...user,
        name,
        role,
        title,
        bio,
        specialization,
        institution,
        website,
        avatarBg,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0F162A] border border-[#24355A] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 my-8 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-[#1C2C4E] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Configure Profile & Role</h3>
              <p className="text-xs text-slate-400">Update your scholar credentials and workspace role.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Switcher */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Academic Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick(600);
                  setRole('student');
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  role === 'student'
                    ? 'bg-purple-950/60 border-purple-500 text-white'
                    : 'bg-[#090D18] border-[#1C2740] text-slate-400'
                }`}
              >
                <GraduationCap className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Student</div>
                  <div className="text-[10px] text-slate-400">Enroll & study</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClick(750);
                  setRole('teacher');
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  role === 'teacher'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white'
                    : 'bg-[#090D18] border-[#1C2740] text-slate-400'
                }`}
              >
                <Presentation className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Teacher / Instructor</div>
                  <div className="text-[10px] text-slate-400">Create courses & articles</div>
                </div>
              </button>
            </div>
          </div>

          {/* Full Name & Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Headline / Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={role === 'teacher' ? 'Professor of Genomic Biology' : 'Polymath Scholar'}
                className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>

          {/* Specialization & Institution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Molecular Genetics & Linear Algebra"
                className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Institution / Academy</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Harvard / MindSphere Academy"
                className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other scholars about your research focus, courses, and interests..."
              className="w-full bg-[#090D18] border border-[#1E2942] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
            />
          </div>

          {/* Avatar Color Scheme */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Avatar Accent Gradient</label>
            <div className="flex items-center gap-2">
              {colorOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarBg(opt.class)}
                  className={`w-7 h-7 rounded-full ${opt.class} transition-transform cursor-pointer ${
                    avatarBg === opt.class ? 'ring-2 ring-white scale-115' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={opt.label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1C2C4E]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow-lg shadow-purple-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
