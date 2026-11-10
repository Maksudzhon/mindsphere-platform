import React, { useState } from 'react';
import { Search, Clock, BookOpen, Star, Filter, Check, Plus, ArrowUpRight } from 'lucide-react';
import { Course } from '../types';
import { soundFx } from '../utils/sound';
import { CourseDisciplineBadge, DisciplineWatermark } from './DisciplineGraphics';

interface ExploreViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (courseId: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  courses,
  onSelectCourse,
  onEnrollCourse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');

  const categories = ['All', 'Science', 'Law', 'Arts', 'Mathematics', 'Business', 'Music'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    const matchesSearch =
      c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesDiff && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
          Explore Multi-Disciplinary Tracks
        </h1>
        <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
          Broaden your neural synthesis across empirical sciences, jurisprudence, modern visual arts, and quantitative models
        </p>
      </div>

      {/* Filters strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F162A] border border-[#1E2942] shadow-lg">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter courses by keyword..."
            className="w-full bg-[#0C1221] text-xs text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#1E2942] focus:border-purple-500 focus:outline-hidden transition-colors"
          />
        </div>

        {/* Categories segmented buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick(620);
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                  : 'text-slate-400 hover:text-white bg-[#0C1221] hover:bg-[#16213B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => {
              soundFx.playClick(800);
              onSelectCourse(course);
            }}
            className="bg-[#0F162A] border border-[#1E2942] rounded-2xl p-6 transition-all duration-200 ease-out flex flex-col justify-between group hover:-translate-y-1 cursor-pointer shadow-lg shadow-black/20 hover:border-purple-500/50 hover:shadow-[0_12px_30px_-8px_rgba(139,92,246,0.2)] relative overflow-hidden"
          >
            {/* Background Discipline Watermark */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 pointer-events-none select-none">
              <DisciplineWatermark courseId={course.id} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <CourseDisciplineBadge courseId={course.id} color={course.color} size={46} />

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-400 bg-[#0C1221] px-2.5 py-0.5 rounded-md border border-[#1C2742]">
                    {course.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors font-display">
                  {course.title}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
              </div>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 mt-4 pb-4 border-b border-[#18233C]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono">{course.hours}h curriculum</span>
                </div>
                <span>•</span>
                <div>{course.totalStudents.toLocaleString()} scholars</div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  onSelectCourse(course);
                }}
                className="flex-1 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#151F36] hover:bg-[#1E2B4A] rounded-xl transition-all cursor-pointer text-center"
              >
                View Syllabus
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick(900);
                  onSelectCourse(course);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-md shadow-purple-900/30 cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Enrolled</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
