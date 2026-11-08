import React, { useState } from 'react';
import { Check, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../i18n/translations';

interface LanguageConfigViewProps {
  initialLanguage: LanguageCode;
  onConfirmLanguage: (selectedLang: LanguageCode) => void;
  userName: string;
}

export const LanguageConfigView: React.FC<LanguageConfigViewProps> = ({
  initialLanguage,
  onConfirmLanguage,
  userName,
}) => {
  const [selected, setSelected] = useState<LanguageCode>(initialLanguage || 'en');
  const t = getTranslation(selected);

  return (
    <div className="min-h-screen bg-[#080C16] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl z-10 space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 mb-2">
            <Globe className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            {t.languageConfigTitle}
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
            {t.languageConfigDesc}
          </p>
        </div>

        {/* 5 Languages Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;

            return (
              <div
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#1E1B3E] to-[#12182B] border-purple-500 shadow-xl shadow-purple-950/40 ring-2 ring-purple-500/30'
                    : 'bg-[#0F162A]/90 border-[#1E2942] hover:border-[#2E3F66] hover:bg-[#121B33]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'border-slate-600 group-hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {lang.nativeName}
                  </h3>
                  <div className="text-xs text-purple-400 font-medium mt-0.5">
                    {lang.name}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-[#1C2742] line-clamp-1 italic">
                  "{lang.tagline}"
                </p>
              </div>
            );
          })}
        </div>

        {/* Action button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0F162A]/80 border border-[#1E2942] p-5 rounded-2xl">
          <div className="text-xs text-slate-300">
            Selected Language:{' '}
            <span className="font-bold text-white">
              {SUPPORTED_LANGUAGES.find((l) => l.code === selected)?.nativeName}
            </span>
          </div>

          <button
            onClick={() => onConfirmLanguage(selected)}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <span>{t.continueToDashboard}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
