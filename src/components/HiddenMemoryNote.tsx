import React, { useState, useRef, useEffect } from 'react';
import type { MemoryNote } from '../data/story';
import { Feather, X, Bookmark, Sparkles, ChevronDown } from 'lucide-react';

interface HiddenMemoryNoteProps {
  note: MemoryNote;
}

export const HiddenMemoryNote: React.FC<HiddenMemoryNoteProps> = ({ note }) => {
  // Always start closed when arriving on any page / chapter
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  // Whenever the note/chapter changes, automatically reset to closed state
  useEffect(() => {
    setIsOpen(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, [note]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth subtle tilt angles (-8deg to +8deg)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.8,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="my-8 w-full max-w-full">
      {!isOpen ? (
        /* Collapsed 3D Floating Token (First thing user sees on any new chapter) */
        <div className="flex justify-center sm:justify-start">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#102A23] via-[#1D3B2F] to-[#102A23] border border-[#C9AE7C]/50 text-xs font-sans tracking-widest uppercase text-[#F5F0E5] shadow-[0_10px_25px_rgba(0,0,0,0.5),0_0_15px_rgba(201,174,124,0.2)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.6),0_0_24px_rgba(201,174,124,0.4)] hover:border-[#C9AE7C] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
            aria-label="Open personal memory note"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#C9AE7C]/25 to-transparent pointer-events-none" />

            {/* Glowing Feather Token */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#9B7C3E] via-[#C9AE7C] to-[#E5D2A8] flex items-center justify-center text-[#102A23] shadow-md group-hover:rotate-12 transition-transform duration-300 shrink-0">
              <Feather className="w-3 h-3" />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#C9AE7C] text-[11px] tracking-wider">
                ✦ PERSONAL MEMORY NOTE
              </span>
              <span className="text-[10px] text-[#A7B9A6]/80 font-normal tracking-normal lowercase first-letter:uppercase hidden xs:inline">
                (Tap to read)
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#C9AE7C] group-hover:translate-y-0.5 transition-transform duration-300 shrink-0" />
          </button>
        </div>
      ) : (
        /* The 3D Animated Personal Memory Note Card (Properly fitted, no overflow, no background semicolon) */
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="memory-note-card-3d w-full box-border cursor-default select-none animate-fadeIn overflow-hidden rounded-2xl"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
              tilt.x !== 0 || tilt.y !== 0 ? 'scale3d(1.015, 1.015, 1.015)' : 'scale3d(1, 1, 1)'
            }`,
            transition:
              tilt.x === 0 && tilt.y === 0
                ? 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
                : 'none',
          }}
        >
          {/* Specular Glare Overlay Tracking Cursor */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle 300px at ${glare.x}% ${glare.y}%, rgba(201, 174, 124, 0.25) 0%, transparent 65%)`,
            }}
          />

          {/* Golden Ambient Mesh Background Highlight */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30 z-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 10%, rgba(201, 174, 124, 0.25) 0%, transparent 70%)',
            }}
          />

          {/* Top Decorative Gold Accent Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9AE7C] to-transparent relative z-10" />

          {/* Card Content - Well-padded and properly aligned */}
          <div className="p-5 sm:p-7 relative z-10 flex flex-col gap-4 box-border">
            {/* Header: Tag, Date, and Close Button */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#C9AE7C]/20">
              <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                {/* Wax Seal Badge */}
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#9B7C3E] via-[#C9AE7C] to-[#E5D2A8] flex items-center justify-center text-[#102A23] shadow-md border border-[#F5F0E5]/40 shrink-0">
                  <Sparkles className="w-3 h-3 text-[#102A23]" />
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#102A23]/80 border border-[#C9AE7C]/40 text-[10px] font-sans font-semibold tracking-wider uppercase text-[#C9AE7C] truncate">
                  <Bookmark className="w-2.5 h-2.5 text-[#C9AE7C] shrink-0" />
                  <span className="truncate">{note.title ? note.title.toUpperCase() : 'PERSONAL MEMORY'}</span>
                </span>

                {note.date && (
                  <span className="font-sans text-xs tracking-wider text-[#A7B9A6] font-medium hidden sm:inline-block">
                    • {note.date}
                  </span>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full bg-[#102A23]/70 hover:bg-[#1D3B2F] border border-[#C9AE7C]/30 hover:border-[#C9AE7C] text-[#A7B9A6] hover:text-[#F5F0E5] transition-all cursor-pointer shrink-0 shadow-sm"
                title="Close note"
                aria-label="Close note"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Note Body Text - Perfectly Fitted, Clean Margins, No Overlap */}
            <div className="py-2">
              <p className="font-serif italic text-base sm:text-lg text-[#F5F0E5] leading-relaxed tracking-wide text-left pl-3.5 sm:pl-4 border-l-2 border-[#C9AE7C]/50 break-words">
                “{note.text}”
              </p>
            </div>

            {/* Gilded Decorative Separator */}
            <div className="flex items-center gap-3 my-0.5">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#C9AE7C]/30 to-transparent" />
              <span className="text-[#C9AE7C] text-[10px]">✦</span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#C9AE7C]/30 to-transparent" />
            </div>

            {/* Footer Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#A7B9A6]">
              <div className="flex items-center gap-1.5">
                <Feather className="w-3 h-3 text-[#C9AE7C] shrink-0" />
                <span className="font-serif italic text-sm text-[#A7B9A6]/90">
                  From Akshat's Personal Journal
                </span>
              </div>
              <span className="font-sans text-[10px] tracking-widest uppercase text-[#C9AE7C] font-semibold">
                Dedicated with Love to Banita
              </span>
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#C9AE7C]/30 to-transparent relative z-10" />
        </div>
      )}
    </div>
  );
};
