import React from 'react';
import { Clock, Play, BookOpen, Award, ArrowUpRight } from 'lucide-react';
import { Course } from '../types';
import { soundFx } from '../utils/sound';
import { CourseDisciplineBadge, DisciplineWatermark } from './DisciplineGraphics';

interface MyCoursesViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export const MyCoursesView: React.FC<MyCoursesViewProps> = ({
  courses,
  onSelectCourse,
}) => {
  const avgCompletion = Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
            My Active Courses
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Tracking your progress across 6 core multidisciplinary tracks
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0F162A] border border-[#1E2942] px-4 py-2 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Average Completion:</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">
            {avgCompletion}%
          </span>
        </div>
      </div>

      {/* Grid of Enrolled Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => {
              soundFx.playClick(800);
              onSelectCourse(course);
            }}
            className="bg-[#0F162A] border border-[#1E2942] hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-200 ease-out cursor-pointer group flex flex-col justify-between hover:-translate-y-1 shadow-lg shadow-black/20 hover:shadow-[0_12px_30px_-8px_rgba(139,92,246,0.2)] relative overflow-hidden"
          >
            {/* Background Discipline Watermark */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 pointer-events-none select-none">
              <DisciplineWatermark courseId={course.id} />
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <CourseDisciplineBadge courseId={course.id} color={course.color} size={48} />
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors font-display">
                      {course.title}
                    </h3>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{course.category}</span>
                      <span>•</span>
                      <span className="font-mono">{course.hours}h logged</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-slate-200 bg-[#0C1221] px-2.5 py-1 rounded-lg border border-[#1C2742]">
                  {course.progress}%
                </span>
              </div>


              <p className="text-xs text-slate-400 line-clamp-2 mb-6 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="space-y-4">
              {/* Progress bar with hover sheen */}
              <div className="w-full bg-[#18233C] h-2 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out relative group-hover:brightness-110"
                  style={{
                    width: `${course.progress}%`,
                    backgroundColor: course.color,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-progress-sheen pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 font-mono text-[11px]">
                  {course.modules.reduce((a, m) => a + m.lessons.filter((l) => l.completed).length, 0)} of{' '}
                  {course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons finished
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playClick();
                    onSelectCourse(course);
                  }}
                  className="flex items-center gap-1.5 font-semibold text-purple-400 group-hover:text-purple-300 transition-colors hover:translate-x-1"
                >
                  <span>Continue</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
