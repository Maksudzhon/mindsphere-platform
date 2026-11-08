import React, { useState } from 'react';
import {
  X,
  Clock,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  Sparkles,
  Award,
  ChevronRight,
  RotateCcw,
  Star,
} from 'lucide-react';

import confetti from 'canvas-confetti';
import { Course, Lesson } from '../types';
import {
  BiologyGraphic,
  LawGraphic,
  ArtsGraphic,
  MathGraphic,
  BusinessGraphic,
  MusicGraphic,
} from './DisciplineGraphics';
import { soundFx } from '../utils/sound';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onUpdateProgress: (courseId: string, delta: number, lessonId?: string, hoursAdded?: number) => void;
  onAskAIAboutCourse: (courseTitle: string, initialPrompt?: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  onUpdateProgress,
  onAskAIAboutCourse,
}) => {
  if (!course) return null;

  const [activeTab, setActiveTab] = useState<'syllabus' | 'lesson' | 'quiz'>('syllabus');
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(
    course.modules[0]?.lessons[0] || null
  );

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuiz = course.sampleQuiz[currentQuizIdx];

  const handleLessonSelect = (lesson: Lesson) => {
    soundFx.playClick(720);
    setSelectedLesson(lesson);
    setActiveTab('lesson');
  };

  const handleCompleteLesson = () => {
    if (!selectedLesson) return;
    soundFx.playChime();
    onUpdateProgress(course.id, 10, selectedLesson.id, 1);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswerSubmitted) return;
    soundFx.playClick(650);
    setSelectedOption(idx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedOption === null || !currentQuiz) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuiz.correctIndex) {
      soundFx.playClick(950);
      setQuizScore((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      soundFx.playClick(350);
    }
  };

  const handleNextQuizQuestion = () => {
    soundFx.playClick(700);
    if (currentQuizIdx < course.sampleQuiz.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      onUpdateProgress(course.id, 5, undefined, 0.5);
    }
  };

  const handleResetQuiz = () => {
    soundFx.playClick();
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  // Render course-specific SVG emblem
  const renderCourseGraphic = (sizeClass = 'w-12 h-12') => {
    switch (course.id) {
      case 'bio-101':
        return <div className={sizeClass}><BiologyGraphic /></div>;
      case 'law-101':
        return <div className={sizeClass}><LawGraphic /></div>;
      case 'art-101':
        return <div className={sizeClass}><ArtsGraphic /></div>;
      case 'math-101':
        return <div className={sizeClass}><MathGraphic /></div>;
      case 'bus-101':
        return <div className={sizeClass}><BusinessGraphic /></div>;
      case 'mus-101':
        return <div className={sizeClass}><MusicGraphic /></div>;
      default:
        return (
          <div
            className={`${sizeClass} rounded-xl flex items-center justify-center text-white shadow-lg`}
            style={{ backgroundColor: course.color }}
          >
            <BookOpen className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0C1222] border border-[#1E2942] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-purple-950/40 overflow-hidden">
        {/* Header - Responsive with SVG emblem */}
        <div className="p-4 sm:p-6 border-b border-[#18233C] flex items-center justify-between bg-[#0F162A]">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {renderCourseGraphic('w-11 h-11 sm:w-14 sm:h-14 shrink-0')}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white font-display truncate">
                  {course.title}
                </h2>
                <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#18233D] text-slate-300 font-mono shrink-0">
                  {course.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
                {course.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#18233D] transition-colors shrink-0 ml-2 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher - responsive overflow */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#090E1D] border-b border-[#18233D] flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('syllabus');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'syllabus'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141C34]'
              }`}
            >
              Syllabus & Modules
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('lesson');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'lesson'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141C34]'
              }`}
            >
              Lesson Viewer
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('quiz');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141C34]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Practice Quiz</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
              onAskAIAboutCourse(course.title, `Help me master key concepts in ${course.title}`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-fuchsia-300 bg-fuchsia-950/40 border border-fuchsia-500/30 rounded-xl hover:bg-fuchsia-900/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI Tutor</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: SYLLABUS */}
          {activeTab === 'syllabus' && (
            <div className="space-y-6">
              {/* Course Meta Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#0F162A] border border-[#1E2942]">
                  <div className="text-xs text-slate-400 font-medium">Instructor</div>
                  <div className="text-sm font-semibold text-white mt-1 font-display">
                    {course.instructor.name}
                  </div>
                  <div className="text-[11px] text-slate-400">{course.instructor.role}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F162A] border border-[#1E2942]">
                  <div className="text-xs text-slate-400 font-medium">Enrolled Scholars</div>
                  <div className="text-sm font-semibold text-white font-mono mt-1">
                    {course.totalStudents.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{course.rating} / 5.0 Rating</span>
                  </div>
                </div>


                <div className="p-4 rounded-2xl bg-[#0F162A] border border-[#1E2942]">
                  <div className="text-xs text-slate-400 font-medium">Progress Track</div>
                  <div className="text-sm font-semibold text-white font-mono mt-1">
                    {course.progress}% Completed
                  </div>
                  <div className="text-[11px] text-purple-400 font-mono">{course.hours} Hours Logged</div>
                </div>
              </div>

              {/* Modules list */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Curriculum Modules
                </h3>
                {course.modules.map((module, mIdx) => (
                  <div
                    key={module.id}
                    className="rounded-2xl border border-[#1E2942] bg-[#0F162A] p-4 sm:p-5 space-y-3 shadow-md"
                  >
                    <div className="text-sm font-bold text-white flex items-center justify-between font-display">
                      <span>Module {mIdx + 1}: {module.title}</span>
                      <span className="text-xs text-slate-400 font-normal">
                        {module.lessons.length} lessons
                      </span>
                    </div>

                    <div className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#0B1020] hover:bg-[#141C34] border border-[#19243E] transition-colors gap-2"
                        >
                          <div className="flex items-center gap-3">
                            {lesson.completed ? (
                              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                            ) : (
                              <PlayCircle className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                            )}
                            <div>
                              <div className="text-sm font-medium text-slate-200">
                                {lesson.title}
                              </div>
                              <div className="text-xs text-slate-400 line-clamp-1">{lesson.summary}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#1A253E]">
                            <span className="text-xs text-slate-500 font-mono">
                              {lesson.duration}
                            </span>
                            <button
                              onClick={() => handleLessonSelect(lesson)}
                              className="px-3.5 py-1.5 text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/50 hover:bg-purple-800/60 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                            >
                              Study Lesson
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LESSON VIEWER */}
          {activeTab === 'lesson' && selectedLesson && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0F162A] border border-[#1E2942]">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider font-mono">
                      Interactive Topic
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1 font-display">
                      {selectedLesson.title}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono bg-[#090E1D] px-2.5 py-1 rounded-lg shrink-0">
                    {selectedLesson.duration}
                  </span>
                </div>
              </div>

              {/* Core content */}
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed bg-[#0E1528] p-5 rounded-2xl border border-[#19243E] shadow-inner">
                {selectedLesson.content}
              </div>

              {/* Key Takeaways */}
              <div className="bg-[#0F162A] border border-[#1E2942] rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono">
                  Core High-Yield Takeaways
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedLesson.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onClose();
                    onAskAIAboutCourse(
                      course.title,
                      `Explain the lesson "${selectedLesson.title}" from ${course.title} using an intuitive real-world analogy.`
                    );
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 bg-[#162038] hover:bg-[#1E2B4A] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Explain with Analogy (AI)</span>
                </button>

                <button
                  onClick={handleCompleteLesson}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Lesson Complete (+50 XP)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PRACTICE QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {!quizFinished ? (
                currentQuiz && (
                  <div className="bg-[#0F162A] border border-[#1E2942] rounded-2xl p-4 sm:p-6 space-y-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider font-mono">
                        Question {currentQuizIdx + 1} of {course.sampleQuiz.length}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Score: {quizScore}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white font-display">
                      {currentQuiz.question}
                    </h3>

                    {/* Options list */}
                    <div className="space-y-2.5">
                      {currentQuiz.options.map((option, idx) => {
                        const isSelected = selectedOption === idx;
                        let optionStyle = 'bg-[#0E1528] border-[#1C2742] text-slate-200 hover:bg-[#16203A]';

                        if (isAnswerSubmitted) {
                          if (idx === currentQuiz.correctIndex) {
                            optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                          } else if (isSelected) {
                            optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 line-through';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-purple-950/60 border-purple-500 text-purple-200 font-semibold ring-2 ring-purple-500/30';
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={isAnswerSubmitted}
                            className={`w-full p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-center justify-between cursor-pointer ${optionStyle}`}
                          >
                            <span>{option}</span>
                            {isAnswerSubmitted && idx === currentQuiz.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback explanation */}
                    {isAnswerSubmitted && (
                      <div className="p-4 rounded-xl bg-[#090D1A] border border-[#1E2B4B] text-xs text-slate-300">
                        <span className="font-semibold text-purple-300 block mb-1">
                          Pedagogical Explanation:
                        </span>
                        {currentQuiz.explanation}
                      </div>
                    )}

                    {/* Next / Submit buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                      {!isAnswerSubmitted ? (
                        <button
                          onClick={handleSubmitQuizAnswer}
                          disabled={selectedOption === null}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
                        >
                          Check Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuizQuestion}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <span>{currentQuizIdx < course.sampleQuiz.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              ) : (
                /* Quiz Complete screen */
                <div className="p-6 sm:p-8 text-center bg-[#0F162A] border border-[#1E2942] rounded-3xl space-y-4 shadow-xl">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-display">Quiz Completed!</h3>
                  <p className="text-sm text-slate-300">
                    You scored{' '}
                    <span className="font-mono font-bold text-purple-400 text-base">
                      {quizScore} / {course.sampleQuiz.length}
                    </span>{' '}
                    points. Your course mastery has been updated.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <button
                      onClick={handleResetQuiz}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-[#162038] hover:bg-[#1E2B4A] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('syllabus')}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors cursor-pointer"
                    >
                      Back to Syllabus
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
