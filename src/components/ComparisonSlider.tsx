import React, { useState, useRef, useCallback } from 'react';
import type { PhotoComparison } from '../data/story';
import { ArrowLeftRight, Calendar } from 'lucide-react';

interface ComparisonSliderProps {
  comparison: PhotoComparison;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ comparison }) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { beforePhotoUrl, beforeLabel, afterPhotoUrl, afterLabel, caption } = comparison;

  // Don't render if either photo is missing
  if (!beforePhotoUrl || !afterPhotoUrl) return null;

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(rect.width, x));
    const percentage = (clamped / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  // Mouse handlers
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  // Touch handlers
  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      setSliderPosition(0);
    } else if (e.key === 'End') {
      setSliderPosition(100);
    }
  };

  return (
    <div className="my-10 w-full">
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-[#C9AE7C]">
          <Calendar className="w-3.5 h-3.5" />
          <span>Then vs. Now • Dongargarh</span>
        </div>
        <span className="text-xs font-sans text-[#A7B9A6]/70">
          Drag slider or use arrow keys
        </span>
      </div>

      {/* Draggable Slider Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden border border-[#C9AE7C]/40 shadow-2xl select-none cursor-ew-resize bg-[#091712]"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        tabIndex={0}
        role="slider"
        aria-label="Then versus now photo comparison slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={handleKeyDown}
      >
        {/* After (Right / Background Layer) */}
        <img
          src={afterPhotoUrl}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        {/* Before (Left / Clipped Layer) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforePhotoUrl}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              height: '100%',
            }}
            loading="lazy"
          />
        </div>

        {/* Badges for Before & After */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#091712]/80 backdrop-blur-md border border-[#C9AE7C]/30 text-[11px] font-sans tracking-wider uppercase text-[#F5F0E5] shadow-lg pointer-events-none">
          {beforeLabel}
        </div>

        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#091712]/80 backdrop-blur-md border border-[#C9AE7C]/30 text-[11px] font-sans tracking-wider uppercase text-[#F5F0E5] shadow-lg pointer-events-none">
          {afterLabel}
        </div>

        {/* Divider Line & Circular Handle */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-[#C9AE7C] shadow-[0_0_12px_rgba(201,174,124,0.8)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#102A23] border-2 border-[#C9AE7C] flex items-center justify-center text-[#C9AE7C] shadow-xl">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Caption Note */}
      {caption && (
        <p className="mt-3 text-center font-serif italic text-sm text-[#A7B9A6]/90 px-4">
          “{caption}”
        </p>
      )}
    </div>
  );
};
