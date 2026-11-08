import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, CheckCircle2, Zap, Rocket, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

interface HyperspaceWelcomeAnimationProps {
  userName: string;
  language: LanguageCode;
  onFinished: () => void;
}

export const HyperspaceWelcomeAnimation: React.FC<HyperspaceWelcomeAnimationProps> = ({
  userName,
  language,
  onFinished,
}) => {
  const [progress, setProgress] = useState(15);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[2];

  // Localized greetings
  const greetings: Record<LanguageCode, { welcome: string; sub: string; stages: string[] }> = {
    en: {
      welcome: `Welcome to MindSphere, ${userName}!`,
      sub: 'Synchronizing multi-disciplinary tracks and 24/7 AI Tutor...',
      stages: [
        'Verifying scholar credentials...',
        `Calibrating language models for ${langObj.nativeName}...`,
        'Syncing 6 core learning tracks...',
        'AI Tutor activated (Gemini 3.8 Flash)!',
      ],
    },
    uz: {
      welcome: `MindSphere-ga xush kelibsiz, ${userName}!`,
      sub: "Ko'p tarmoqli fanlar va 24/7 AI Repetitor faollashtirilmoqda...",
      stages: [
        'Talaba hisob ma\'lumotlari tasdiqlanmoqda...',
        `${langObj.nativeName} tili parametrlari moslashtirilmoqda...`,
        "6 ta asosiy fan o'quv rejalari sinxronlanmoqda...",
        'AI Repetitor faollashtirildi (Gemini 3.8 Flash)!',
      ],
    },
    ru: {
      welcome: `Добро пожаловать в MindSphere, ${userName}!`,
      sub: 'Синхронизация учебных курсов и AI-тьютора 24/7...',
      stages: [
        'Проверка учетных данных исследователя...',
        `Калибровка языковой модели для ${langObj.nativeName}...`,
        'Синхронизация 6 ключевых дисциплин...',
        'AI Тьютор активирован (Gemini 3.8 Flash)!',
      ],
    },
    es: {
      welcome: `¡Bienvenido a MindSphere, ${userName}!`,
      sub: 'Sincronizando asignaturas multidisciplinarias y Tutor IA 24/7...',
      stages: [
        'Verificando credenciales de estudiante...',
        `Calibrando modelos de lenguaje para ${langObj.nativeName}...`,
        'Sincronizando 6 asignaturas principales...',
        '¡Tutor IA activado (Gemini 3.8 Flash)!',
      ],
    },
    zh: {
      welcome: `欢迎来到 MindSphere，${userName}！`,
      sub: '正在同步跨学科知识图谱与全天候智能导师...',
      stages: [
        '正在验证学者身份认证...',
        `已校准 ${langObj.nativeName} 多语言语义模型...`,
        '已挂载 6 大核心学科知识网络...',
        'AI 智能导师准备就绪 (Gemini 3.8 Flash)！',
      ],
    },
  };

  const currentGreeting = greetings[language] || greetings.en;

  // Starfield warp canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate stars
    const numStars = 400;
    const stars: Array<{ x: number; y: number; z: number; pz: number; color: string }> = [];
    const colors = ['#8B5CF6', '#C084FC', '#E879F9', '#38BDF8', '#FFFFFF'];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        pz: width,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let speed = 25;

    const render = () => {
      ctx.fillStyle = 'rgba(7, 10, 20, 0.35)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        star.z -= speed;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
          star.z = width;
          star.pz = width;
        }

        const k = 250 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const prevK = 250 / star.pz;
          const prevX = star.x * prevK + cx;
          const prevY = star.y * prevK + cy;

          ctx.beginPath();
          ctx.strokeStyle = star.color;
          ctx.lineWidth = Math.min(3, Math.max(0.8, (1 - star.z / width) * 3));
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(px, py);
          ctx.stroke();
        }

        star.pz = star.z;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const stageIndex = progress >= 90 ? 3 : progress >= 65 ? 2 : progress >= 40 ? 1 : 0;

  // Progress timer & celebration
  useEffect(() => {
    // Initial confetti burst
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#A855F7', '#EC4899', '#38BDF8', '#10B981'],
    });

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onFinished();
          }, 450);
          return 100;
        }
        return Math.min(100, prev + 18);
      });
    }, 280);

    return () => clearInterval(interval);
  }, [onFinished]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070A14] overflow-hidden select-none">
      {/* Dynamic Hyperspace Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Central Holographic Gateway HUD */}
      <div className="relative z-10 w-full max-w-xl mx-auto p-8 rounded-3xl bg-[#0D1326]/85 border-2 border-purple-500/60 backdrop-blur-2xl shadow-2xl shadow-purple-950/80 text-center space-y-6 animate-fadeIn">
        {/* Glowing Orb with Rings */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400 animate-[spin_6s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-cyan-400/60 animate-[spin_4s_linear_infinite_reverse]" />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-600/60 animate-bounce">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Big Greeting Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-semibold">
            <Rocket className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Hyperspace Gateway Active</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {currentGreeting.welcome}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {currentGreeting.sub}
          </p>
        </div>

        {/* Phased Checklist Status */}
        <div className="space-y-2 text-left bg-[#090E1C] p-4 rounded-2xl border border-[#1A2644]">
          {currentGreeting.stages.map((stg, i) => {
            const isDone = stageIndex > i || progress >= 100;
            const isCurrent = stageIndex === i && progress < 100;

            return (
              <div
                key={i}
                className={`flex items-center justify-between text-xs py-1 transition-all ${
                  isDone
                    ? 'text-emerald-400 font-semibold'
                    : isCurrent
                    ? 'text-purple-300 font-bold scale-[1.01]'
                    : 'text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span>{stg}</span>
                </div>
                {isDone && <span className="text-[10px] uppercase font-mono font-bold">Ready</span>}
              </div>
            );
          })}
        </div>

        {/* Hyperdrive Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-[#121A33] border border-[#202E52] h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Neural Synthesis</span>
            <span className="text-purple-400 font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
