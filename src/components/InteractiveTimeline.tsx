import React from 'react';
import type { Chapter } from '../data/story';
import { MapPin, Sparkles, Heart, Compass, Mountain, RotateCcw } from 'lucide-react';

interface InteractiveTimelineProps {
  chapters: Chapter[];
  activeChapterId: string;
  onSelectChapter: (id: string) => void;
}

const milestoneIcons: Record<string, React.ReactNode> = {
  'chapter-01': <MapPin className="w-4 h-4" />,
  'chapter-02': <Heart className="w-4 h-4" />,
  'chapter-03': <Compass className="w-4 h-4" />,
  'chapter-04': <Mountain className="w-4 h-4" />,
  'chapter-05': <Sparkles className="w-4 h-4" />,
  'chapter-06': <RotateCcw className="w-4 h-4" />,
};

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  chapters,
  activeChapterId,
  onSelectChapter,
}) => {
  const activeIndex = chapters.findIndex((c) => c.id === activeChapterId);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <section
      className="milestone-timeline-section relative z-20 w-full pt-4 pb-6 px-4 flex flex-col items-center justify-center"
      aria-label="Interactive Story Milestones Timeline"
    >
      {/* Dedicated Centered Content Container */}
      <div className="milestone-timeline-container w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Centered Heading & Subtitle */}
        <div className="milestone-header-block w-full text-center mb-7 flex flex-col items-center justify-center">
          <span className="inline-block text-[11px] font-sans tracking-[0.28em] uppercase text-[#C9AE7C] font-semibold mb-2 text-center">
            ✦ MILESTONES OF OUR JOURNEY ✦
          </span>
          <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#F5F0E5] tracking-wide leading-snug text-center max-w-2xl mx-auto">
            Select a chapter to revisit that memory
          </h2>
          <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9AE7C]/60 to-transparent mx-auto mt-3" />
        </div>

        {/* 6-Milestone Unified Timeline Group (Fits all 6 chapters on mobile and desktop) */}
        <div className="milestone-track-wrapper relative w-full max-w-3xl mx-auto px-1 sm:px-4">
          <div className="relative w-full min-w-0">
            {/* Continuous Connecting Line aligned through the centre of all milestone icons */}
            <div
              className="milestone-connecting-line absolute h-[2px] bg-[#1D3B2F] pointer-events-none -z-0 top-[35px] sm:top-[52px]"
              style={{
                left: 'calc(100% / 12)',
                right: 'calc(100% / 12)',
              }}
              aria-hidden="true"
            >
              {/* Illuminated active line fill */}
              <div
                className="h-full bg-gradient-to-r from-[#C9AE7C] to-[#1D3B2F] transition-all duration-500"
                style={{
                  width: `${(safeActiveIndex / (chapters.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* CSS Grid with six equal columns for equal spacing across any viewport width */}
            <div className="milestone-grid grid grid-cols-6 gap-1 sm:gap-2 w-full relative z-10 justify-items-center">
            {chapters.map((chapter) => {
              const isActive = chapter.id === activeChapterId;
              const icon = milestoneIcons[chapter.id] || <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;

              return (
                <button
                  key={chapter.id}
                  onClick={() => onSelectChapter(chapter.id)}
                  className="milestone-item flex flex-col items-center group cursor-pointer p-0.5 sm:p-1 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9AE7C] transition-all w-full max-w-[62px] sm:max-w-none"
                  aria-label={`Go to chapter ${chapter.number}: ${chapter.milestoneName || chapter.title}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {/* 1. Chapter Number Pill */}
                  <span
                    className={`text-[8.5px] sm:text-[10px] font-sans tracking-wider uppercase mb-1 sm:mb-2 px-1.5 sm:px-2.5 py-0.5 rounded-full transition-all duration-300 font-medium whitespace-nowrap ${
                      isActive
                        ? 'bg-[#C9AE7C] text-[#102A23] font-bold shadow-[0_0_12px_rgba(201,174,124,0.6)] scale-105'
                        : 'bg-[#102A23]/80 text-[#A7B9A6]/90 border border-[#C9AE7C]/25 group-hover:border-[#C9AE7C]/60 group-hover:text-[#F5F0E5]'
                    }`}
                  >
                    CH {chapter.number}
                  </span>

                  {/* 2. Circular Icon Node (Scales neatly on mobile to fit all 6 columns) */}
                  <div
                    className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 relative shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-br from-[#C9AE7C] to-[#9B7C3E] text-[#102A23] shadow-[0_0_20px_rgba(201,174,124,0.7)] scale-105 sm:scale-110 ring-2 sm:ring-4 ring-[#091712]'
                        : 'bg-[#091712] border-2 border-[#1D3B2F] text-[#A7B9A6] group-hover:border-[#C9AE7C] group-hover:text-[#F5F0E5] group-hover:scale-105'
                    }`}
                  >
                    {icon}
                    {isActive && (
                      <span className="absolute -inset-1 rounded-full border border-[#C9AE7C]/40 animate-ping pointer-events-none" />
                    )}
                  </div>

                  {/* 3. Milestone Name */}
                  <span
                    className={`mt-1.5 sm:mt-2.5 font-serif text-[9.5px] sm:text-xs md:text-sm text-center leading-tight transition-colors duration-300 line-clamp-2 w-full break-words ${
                      isActive
                        ? 'text-[#F5F0E5] font-semibold'
                        : 'text-[#A7B9A6]/80 group-hover:text-[#F5F0E5]'
                    }`}
                  >
                    {chapter.milestoneName || chapter.title}
                  </span>
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
