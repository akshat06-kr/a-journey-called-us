import React, { useState, useRef } from 'react';
import type { Chapter } from '../data/story';
import { Camera, Compass, Maximize2 } from 'lucide-react';
import { HiddenMemoryNote } from './HiddenMemoryNote';
import { ComparisonSlider } from './ComparisonSlider';

interface StoryChapterProps {
  chapter: Chapter;
  index: number;
  onOpenPhoto: (index: number) => void;
}

export const StoryChapter: React.FC<StoryChapterProps> = ({
  chapter,
  index,
  onOpenPhoto,
}) => {
  const [photoError, setPhotoError] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Tilt effect on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <article
      data-chapter-id={chapter.id}
      className="story-chapter-section"
    >
      {/* Chapter Meta Line */}
      <div className="chapter-meta-line">
        <span className="chapter-number">
          CHAPTER {chapter.number}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9AE7C]/60" />
        <span className="flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase text-[#A7B9A6]/80">
          <Compass className="w-3 h-3 text-[#C9AE7C]/70" />
          {chapter.timeframe}
        </span>
      </div>

      {/* Main Chapter Heading */}
      <h2 className="chapter-heading">
        {chapter.title}
      </h2>

      {/* Chapter Subtitle */}
      <p className="chapter-subheading">
        {chapter.subtitle}
      </p>

      {/* Elegant Accent Line */}
      <div className="chapter-accent-divider" />

      {/* Story Paragraphs */}
      <div className="story-body">
        {chapter.paragraphs.map((paragraph, pIdx) => (
          <p key={pIdx}>
            {paragraph}
          </p>
        ))}
      </div>

      {/* Highlighted Quote Callout if present */}
      {chapter.highlightQuote && (
        <blockquote className="highlight-quote">
          “{chapter.highlightQuote}”
        </blockquote>
      )}

      {/* Hidden Personal Memory Note if present */}
      {chapter.memoryNote && (
        <HiddenMemoryNote note={chapter.memoryNote} />
      )}

      {/* Floating 3D Photograph Frame (User-supplied personal photo) */}
      {chapter.photoUrl && (
        <div
          ref={frameRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => !photoError && onOpenPhoto(index)}
          className="chapter-photo-frame group cursor-pointer"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: tilt.x === 0 ? 'transform 0.5s ease-out' : 'none',
          }}
          title="Click to view expanded photograph"
        >
          {!photoError ? (
            <div className="chapter-photo-media relative overflow-hidden flex items-center justify-center min-h-[300px] sm:min-h-[400px] max-h-[580px] bg-[#091712]">
              {/* Ambient Blurred Background Fill */}
              <img
                src={chapter.photoUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-25 scale-110 pointer-events-none"
              />

              {/* Main Photo - Perfectly contained, never cropped, never overlaps borders */}
              <img
                src={chapter.photoUrl}
                alt={chapter.photoCaption || chapter.title}
                onError={() => setPhotoError(true)}
                loading="lazy"
                decoding="async"
                className="relative z-10 max-w-full max-h-[540px] w-auto h-auto object-contain rounded-lg shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]"
              />

              {/* Subtle Dark Forest Overlay for Text Readability */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(9, 23, 18, 0.5) 0%, transparent 40%)',
                  pointerEvents: 'none',
                  zIndex: 15,
                }}
              />

              {/* Expand Hint Overlay on Hover */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#102A23]/80 border border-[#C9AE7C]/40 text-[#F5F0E5] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 text-[11px] font-sans tracking-wider uppercase backdrop-blur-md shadow-lg z-20">
                <Maximize2 className="w-3 h-3 text-[#C9AE7C]" />
                <span>Expand</span>
              </div>
            </div>
          ) : (
            /* Poetic Fallback Artwork Frame */
            <div className="relative rounded-xl aspect-[16/10] bg-gradient-to-br from-[#102A23] via-[#1D3B2F]/60 to-[#091712] border border-[#C9AE7C]/30 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-[#091712]/80 border border-[#C9AE7C]/50 flex items-center justify-center text-[#C9AE7C] mb-4 shadow-lg">
                <Camera className="w-5 h-5 opacity-90" />
              </div>
              <h4 className="font-serif italic text-2xl text-[#F5F0E5] mb-2 tracking-wide">
                {chapter.title}
              </h4>
              <p className="font-sans text-xs tracking-widest uppercase text-[#C9AE7C]/90 max-w-sm mb-3">
                {chapter.timeframe}
              </p>
              <div className="w-10 h-[1px] bg-[#C9AE7C]/40 mb-3" />
              <span className="font-serif italic text-sm text-[#A7B9A6]/90 max-w-md">
                {chapter.photoCaption || chapter.subtitle}
              </span>
            </div>
          )}

          {/* Photo Caption */}
          {chapter.photoCaption && !photoError && (
            <p className="chapter-photo-caption">
              {chapter.photoCaption}
            </p>
          )}
        </div>
      )}

      {/* Then-versus-Now Comparison Slider (Shown only when available) */}
      {chapter.comparison && (
        <ComparisonSlider comparison={chapter.comparison} />
      )}
    </article>
  );
};
