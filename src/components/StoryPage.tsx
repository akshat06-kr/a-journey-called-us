import React, { useEffect, useRef } from 'react';
import type { Chapter } from '../data/story';
import { StoryChapter } from './StoryChapter';
import { InteractiveTimeline } from './InteractiveTimeline';
import { ChevronLeft, ChevronRight, Home, Mail } from 'lucide-react';

interface StoryPageProps {
  chapters: Chapter[];
  activeChapterId: string;
  onSelectChapter: (id: string) => void;
  onGoToLetter: () => void;
  onReturnToLanding: () => void;
  onOpenPhoto: (index: number) => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({
  chapters,
  activeChapterId,
  onSelectChapter,
  onGoToLetter,
  onReturnToLanding,
  onOpenPhoto,
}) => {
  const currentIndex = chapters.findIndex((c) => c.id === activeChapterId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentChapter = chapters[safeIndex];

  const prevChapter = safeIndex > 0 ? chapters[safeIndex - 1] : null;
  const nextChapter = safeIndex < chapters.length - 1 ? chapters[safeIndex + 1] : null;

  const touchStartX = useRef<number | null>(null);

  // Scroll to top of chapter on chapter switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeChapterId]);

  // Keyboard navigation between individual chapter pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight') {
        if (nextChapter) {
          onSelectChapter(nextChapter.id);
        } else if (safeIndex === chapters.length - 1) {
          onGoToLetter();
        }
      } else if (e.key === 'ArrowLeft') {
        if (prevChapter) {
          onSelectChapter(prevChapter.id);
        } else if (safeIndex === 0) {
          onReturnToLanding();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextChapter, prevChapter, safeIndex, chapters.length, onSelectChapter, onGoToLetter, onReturnToLanding]);

  // Touch swipe support to flip between individual chapter pages
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;

    if (Math.abs(diff) > 60) {
      if (diff < 0) {
        if (nextChapter) {
          onSelectChapter(nextChapter.id);
        } else if (safeIndex === chapters.length - 1) {
          onGoToLetter();
        }
      } else {
        if (prevChapter) {
          onSelectChapter(prevChapter.id);
        } else if (safeIndex === 0) {
          onReturnToLanding();
        }
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      id="story-journey"
      className="w-full min-h-screen pt-1 sm:pt-3 pb-6 sm:pb-8 flex flex-col justify-start items-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Structured Milestone Timeline at the Top */}
      <header className="w-full mt-0 mb-1 sm:mb-2 flex justify-center">
        <InteractiveTimeline
          chapters={chapters}
          activeChapterId={activeChapterId}
          onSelectChapter={onSelectChapter}
        />
      </header>

      {/* The Individual Chapter Content View (Contained in readable story width) */}
      <main key={currentChapter.id} className="story-container w-full max-w-[740px] mx-auto px-4 animate-fadeIn">
        <StoryChapter
          chapter={currentChapter}
          index={safeIndex}
          onOpenPhoto={onOpenPhoto}
        />
      </main>

      {/* Bottom Chapter Pagination Controls (Buttons in a row on both mobile and desktop) */}
      <footer className="w-full max-w-[760px] mx-auto px-3 sm:px-4 mt-1 mb-4 pt-0">
        {/* Mobile Indicator (Centered above buttons) */}
        <div className="flex sm:hidden flex-col items-center gap-0.5 text-center px-2 py-0.5 mb-1.5">
          <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#C9AE7C] font-semibold">
            Chapter {currentChapter.number} of {String(chapters.length).padStart(2, '0')}
          </span>
          <span className="font-serif italic text-sm text-[#F5F0E5] line-clamp-1">
            {currentChapter.milestoneName || currentChapter.title}
          </span>
        </div>

        {/* Buttons Row (Side-by-side in a horizontal row on mobile and desktop) */}
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 w-full max-w-[660px] mx-auto">
          {/* Previous / Return to Intro Button */}
          {prevChapter ? (
            <button
              onClick={() => onSelectChapter(prevChapter.id)}
              className="pagination-btn flex-1 sm:flex-none group relative flex items-center justify-center px-2 sm:px-4"
              aria-label={`Go to previous chapter: ${prevChapter.title}`}
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9AE7C] group-hover:-translate-x-1.5 transition-transform shrink-0 absolute left-2 sm:left-3" />
              <div className="flex flex-col items-center justify-center text-center min-w-0 px-2 sm:px-3">
                <span className="text-[7.5px] sm:text-[9px] font-sans tracking-widest text-[#C9AE7C]/90 uppercase font-semibold">Previous</span>
                <span className="text-[9.5px] sm:text-[11px] font-sans text-[#F5F0E5] truncate max-w-[95px] sm:max-w-[145px]">
                  {prevChapter.number}. {prevChapter.title}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onReturnToLanding}
              className="pagination-btn flex-1 sm:flex-none group relative flex items-center justify-center px-2 sm:px-4"
              aria-label="Return to cover page"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9AE7C] group-hover:scale-110 transition-transform shrink-0 absolute left-2 sm:left-3" />
              <div className="flex flex-col items-center justify-center text-center min-w-0 px-2 sm:px-3">
                <span className="text-[7.5px] sm:text-[9px] font-sans tracking-widest text-[#C9AE7C]/90 uppercase font-semibold">Start Over</span>
                <span className="text-[9.5px] sm:text-[11px] font-sans text-[#F5F0E5] whitespace-nowrap">
                  Return to Intro
                </span>
              </div>
            </button>
          )}

          {/* Desktop Central Indicator (Between buttons) */}
          <div className="hidden sm:flex flex-col items-center gap-0.5 text-center px-2 py-0.5 shrink-0">
            <span className="text-[9px] font-sans tracking-[0.22em] uppercase text-[#C9AE7C] font-semibold">
              Chapter {currentChapter.number} of {String(chapters.length).padStart(2, '0')}
            </span>
            <span className="font-serif italic text-xs text-[#F5F0E5] line-clamp-1 max-w-[130px]">
              {currentChapter.milestoneName || currentChapter.title}
            </span>
          </div>

          {/* Next / Finale Button */}
          {nextChapter ? (
            <button
              onClick={() => onSelectChapter(nextChapter.id)}
              className="pagination-btn flex-1 sm:flex-none group relative flex items-center justify-center px-2 sm:px-4"
              aria-label={`Go to next chapter: ${nextChapter.title}`}
            >
              <div className="flex flex-col items-center justify-center text-center min-w-0 px-2 sm:px-3">
                <span className="text-[7.5px] sm:text-[9px] font-sans tracking-widest text-[#C9AE7C]/90 uppercase font-semibold">Next</span>
                <span className="text-[9.5px] sm:text-[11px] font-sans text-[#F5F0E5] truncate max-w-[95px] sm:max-w-[145px]">
                  {nextChapter.number}. {nextChapter.title}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9AE7C] group-hover:translate-x-1.5 transition-transform shrink-0 absolute right-2 sm:right-3" />
            </button>
          ) : (
            <button
              onClick={onGoToLetter}
              className="pagination-btn flex-1 sm:flex-none group relative flex items-center justify-center px-2 sm:px-4"
              aria-label="Proceed to the final letter"
            >
              <div className="flex flex-col items-center justify-center text-center min-w-0 px-2 sm:px-3">
                <span className="text-[7.5px] sm:text-[9px] font-sans tracking-widest text-[#C9AE7C]/90 uppercase font-semibold">Finale</span>
                <span className="text-[9.5px] sm:text-[11px] font-sans text-[#F5F0E5] whitespace-nowrap">
                  Open The Letter ✉
                </span>
              </div>
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9AE7C] group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0 absolute right-2 sm:right-3" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
