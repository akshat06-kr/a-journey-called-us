import React, { useEffect, useState } from 'react';
import type { Chapter } from '../data/story';

interface StoryProgressProps {
  chapters: Chapter[];
  activeChapterId: string;
  onSelectChapter: (id: string) => void;
  onGoToLetter: () => void;
  isLetterVisible: boolean;
}

export const StoryProgress: React.FC<StoryProgressProps> = ({
  chapters,
  activeChapterId,
  onSelectChapter,
  onGoToLetter,
  isLetterVisible,
}) => {
  const [scrollPercent, setScrollPercent] = useState(0);

  const activeIndex = chapters.findIndex((c) => c.id === activeChapterId);
  const activeChapter = chapters[activeIndex >= 0 ? activeIndex : 0];

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const current = window.scrollY;
      const percent = Math.min(100, Math.max(0, Math.round((current / docHeight) * 100)));
      setScrollPercent(percent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="progress-nav-bar flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-4 py-2.5"
      aria-label="Story chapter navigation and reading progress"
    >
      {/* Current Chapter Label & Reading Progress */}
      <div className="flex items-center gap-2.5">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-sans text-[10px] font-semibold text-[#C9AE7C] tracking-widest uppercase">
              {isLetterVisible
                ? 'Final Letter'
                : `Ch ${activeChapter?.number || '01'}`}
            </span>
            <span className="text-[#A7B9A6]/40 text-xs">•</span>
            <span className="font-sans text-[10px] text-[#A7B9A6]/80 font-light">
              {scrollPercent}% Read
            </span>
          </div>
          <span className="font-serif italic text-xs text-[#F5F0E5] max-w-[140px] sm:max-w-[180px] truncate leading-tight">
            {isLetterVisible ? 'A Letter For You' : activeChapter?.milestoneName || activeChapter?.title}
          </span>
        </div>
      </div>

      <div className="hidden sm:block w-[1px] h-6 bg-[#C9AE7C]/25" />

      {/* Chapter Indicator Dots */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {chapters.map((chapter) => {
          const isActive = !isLetterVisible && chapter.id === activeChapterId;
          return (
            <button
              key={chapter.id}
              onClick={() => onSelectChapter(chapter.id)}
              className="group relative p-1 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9AE7C]"
              aria-label={`Jump to Chapter ${chapter.number}: ${chapter.title}`}
              title={`Chapter ${chapter.number}: ${chapter.title}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-6 h-2 bg-[#C9AE7C] shadow-[0_0_10px_rgba(201,174,124,0.9)]'
                    : 'w-2 h-2 bg-[#A7B9A6]/40 hover:bg-[#F5F0E5]/80 hover:scale-125'
                }`}
              />
              {/* Tooltip on Hover */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] tracking-wider uppercase whitespace-nowrap rounded-md bg-[#102A23] border border-[#C9AE7C]/30 text-[#F5F0E5] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl font-sans">
                {chapter.number}. {chapter.milestoneName || chapter.title}
              </span>
            </button>
          );
        })}

        {/* Final Letter Dot */}
        <button
          onClick={onGoToLetter}
          className="group relative p-1 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9AE7C]"
          aria-label="Jump to Final Letter"
          title="The Final Letter"
        >
          <span
            className={`block rounded-full transition-all duration-300 ${
              isLetterVisible
                ? 'w-6 h-2 bg-[#F5F0E5] shadow-[0_0_10px_rgba(245,240,229,0.9)]'
                : 'w-2 h-2 bg-[#C9AE7C]/60 hover:bg-[#C9AE7C] hover:scale-125'
            }`}
          />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] tracking-wider uppercase whitespace-nowrap rounded-md bg-[#102A23] border border-[#C9AE7C]/30 text-[#F5F0E5] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl font-sans">
            Final Letter ✉
          </span>
        </button>
      </div>
    </nav>
  );
};
