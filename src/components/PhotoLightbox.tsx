import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface PhotoLightboxProps {
  isOpen: boolean;
  photoUrl: string;
  caption?: string;
  title?: string;
  timeframe?: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalPhotos?: number;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  isOpen,
  photoUrl,
  caption,
  title,
  timeframe,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalPhotos,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    closeBtnRef.current?.focus();

    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && onPrev) {
        onPrev();
      } else if (diff < 0 && onNext) {
        onNext();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Expanded Personal Photograph View"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fadeIn"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Deep Midnight Backdrop with Blur */}
      <div className="absolute inset-0 bg-[#091712]/92 backdrop-blur-xl" />

      {/* Main Lightbox Card */}
      <div
        className="relative z-10 max-w-4xl w-full max-h-[92vh] flex flex-col bg-[#102A23] border border-[#C9AE7C]/40 rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#1D3B2F]/80 bg-[#091712]/75">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1D3B2F]/60 border border-[#C9AE7C]/30 flex items-center justify-center text-[#C9AE7C] shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#C9AE7C] font-semibold">
                  Personal Memory
                </span>
                {typeof currentIndex === 'number' && typeof totalPhotos === 'number' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#1D3B2F] text-[10px] font-sans text-[#A7B9A6] border border-[#C9AE7C]/20">
                    {currentIndex + 1} of {totalPhotos}
                  </span>
                )}
              </div>
              {title && (
                <h3 className="font-serif italic text-base sm:text-lg text-[#F5F0E5] leading-tight mt-0.5">
                  {title}
                </h3>
              )}
            </div>
          </div>

          {/* Close Button in top-right */}
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="p-2 rounded-full bg-[#1D3B2F]/60 hover:bg-[#1D3B2F] border border-[#C9AE7C]/25 text-[#A7B9A6] hover:text-[#F5F0E5] hover:border-[#C9AE7C] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9AE7C]"
            aria-label="Close photo view"
            title="Close photo viewer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Photo Container with symmetrical navigation arrows */}
        <div className="relative flex-1 min-h-[280px] sm:min-h-[380px] max-h-[66vh] bg-[#091712] flex items-center justify-center overflow-hidden px-12 sm:px-16 py-3 sm:py-5">
          {/* Ambient Blurred Background Fill */}
          <img
            src={photoUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-25 scale-110 pointer-events-none"
          />

          <img
            src={photoUrl}
            alt={caption || title || 'Personal Photograph'}
            className="relative z-10 max-w-full max-h-[58vh] sm:max-h-[62vh] w-auto h-auto object-contain rounded-xl shadow-[0_15px_45px_rgba(0,0,0,0.85)] transition-all duration-300"
            loading="eager"
          />

          {/* Symmetrical Previous Arrow */}
          {onPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-[#102A23]/90 hover:bg-[#1D3B2F] border border-[#C9AE7C]/40 text-[#F5F0E5] hover:text-[#C9AE7C] transition-all hover:scale-110 shadow-[0_10px_25px_rgba(0,0,0,0.6)] cursor-pointer z-20"
              aria-label="Previous photograph"
              title="Previous photograph"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Symmetrical Next Arrow */}
          {onNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-[#102A23]/90 hover:bg-[#1D3B2F] border border-[#C9AE7C]/40 text-[#F5F0E5] hover:text-[#C9AE7C] transition-all hover:scale-110 shadow-[0_10px_25px_rgba(0,0,0,0.6)] cursor-pointer z-20"
              aria-label="Next photograph"
              title="Next photograph"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Caption & Metadata Footer */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 bg-[#091712]/90 border-t border-[#1D3B2F]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {caption ? (
            <p className="font-serif italic text-sm sm:text-base text-[#F5F0E5]/90 leading-snug">
              “{caption}”
            </p>
          ) : (
            <span className="font-serif italic text-sm text-[#A7B9A6]">
              A moment captured along our journey.
            </span>
          )}

          {timeframe && (
            <span className="text-[11px] font-sans tracking-widest uppercase text-[#C9AE7C] shrink-0 font-medium">
              {timeframe}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
