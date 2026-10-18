import React, { useState, useEffect } from 'react';
import { finalLetter } from '../data/letter';
import { Mail, RotateCcw, ArrowUp, FastForward, ChevronLeft, Home, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LetterEnvelopeProps {
  onRevisitJourney: () => void;
  onReturnToChapter?: () => void;
  onReturnToLanding?: () => void;
}

const CornerFiligree: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-7 h-7 sm:w-9 sm:h-9 text-[#C9AE7C] pointer-events-none select-none ${className || ''}`}
    aria-hidden="true"
  >
    <path
      d="M2 38V12C2 6.47715 6.47715 2 12 2H38M2 12C6 12 12 6 12 2M6 22C6 13.1634 13.1634 6 22 6"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      opacity="0.8"
    />
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="2" cy="2" r="1.5" fill="currentColor" opacity="0.9" />
  </svg>
);

const CrestWatermark: React.FC = () => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="letter-watermark-crest"
    aria-hidden="true"
  >
    <circle cx="100" cy="100" r="90" stroke="#9B7C3E" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="100" cy="100" r="78" stroke="#9B7C3E" strokeWidth="0.8" />
    <path
      d="M100 35 C115 50, 150 70, 150 100 C150 135, 115 155, 100 165 C85 155, 50 135, 50 100 C50 70, 85 50, 100 35 Z"
      stroke="#9B7C3E"
      strokeWidth="1.2"
    />
    <text
      x="100"
      y="112"
      textAnchor="middle"
      fontFamily="Cinzel, serif"
      fontSize="36"
      fill="#9B7C3E"
      fontWeight="600"
      letterSpacing="2"
    >
      A &amp; B
    </text>
  </svg>
);

const renderParagraphContent = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-[#102A23]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

export const LetterEnvelope: React.FC<LetterEnvelopeProps> = ({
  onRevisitJourney,
  onReturnToChapter,
  onReturnToLanding,
}) => {
  // Opening states: 'closed' | 'opening' | 'opened'
  const [stage, setStage] = useState<'closed' | 'opening' | 'opened'>('closed');
  const [revealedParagraphs, setRevealedParagraphs] = useState<number>(0);

  // Trigger flap opening and slide out
  const handleOpenLetter = () => {
    setStage('opening');
    // After flap opens (700ms), stage moves to 'opened'
    setTimeout(() => {
      setStage('opened');
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#C9AE7C', '#F5F0E5', '#E2CFAB', '#1D3B2F'],
        });
      } catch {
        // confetti fallback
      }
    }, 750);
  };

  // Skip animation directly to opened with all paragraphs
  const handleSkipAnimation = () => {
    setStage('opened');
    setRevealedParagraphs(finalLetter.paragraphs.length);
  };

  // Reset / Read again
  const handleReadAgain = () => {
    setStage('closed');
    setRevealedParagraphs(0);
  };

  // Staggered paragraph reveal when opened
  useEffect(() => {
    if (stage !== 'opened') return;

    if (revealedParagraphs < finalLetter.paragraphs.length) {
      const timer = setTimeout(() => {
        setRevealedParagraphs((prev) => prev + 1);
      }, 160);
      return () => clearTimeout(timer);
    }
  }, [stage, revealedParagraphs]);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '3rem 1.25rem 6rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
      }}
    >
      {/* Background Atmosphere & Ambient Candlelight Radial Aura */}
      <div className="letter-section-atmosphere" />

      {/* Floating Golden Embers & Star Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="letter-sparkle w-1.5 h-1.5 top-[12%] left-[8%] [animation-delay:0s]" />
        <div className="letter-sparkle w-2 h-2 top-[22%] right-[10%] [animation-delay:1.5s]" />
        <div className="letter-sparkle w-1 h-1 top-[38%] left-[12%] [animation-delay:3s]" />
        <div className="letter-sparkle w-2.5 h-2.5 top-[55%] right-[8%] [animation-delay:0.8s]" />
        <div className="letter-sparkle w-1.5 h-1.5 top-[70%] left-[6%] [animation-delay:2.4s]" />
        <div className="letter-sparkle w-2 h-2 top-[84%] right-[12%] [animation-delay:4s]" />
      </div>

      {/* Top Navigation Bar on Letter Page */}
      <div className="w-full max-w-3xl mb-8 flex items-center justify-between z-30">
        {onReturnToChapter && (
          <button
            onClick={onReturnToChapter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#102A23]/80 hover:bg-[#1D3B2F] border border-[#C9AE7C]/30 text-xs font-sans tracking-wider uppercase text-[#A7B9A6] hover:text-[#F5F0E5] transition-all cursor-pointer shadow-md"
            aria-label="Return to previous chapter"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[#C9AE7C]" />
            <span>Back to Journey</span>
          </button>
        )}

        {onReturnToLanding && (
          <button
            onClick={onReturnToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#102A23]/80 hover:bg-[#1D3B2F] border border-[#C9AE7C]/30 text-xs font-sans tracking-wider uppercase text-[#A7B9A6] hover:text-[#F5F0E5] transition-all cursor-pointer shadow-md ml-auto"
            aria-label="Return to cover page"
          >
            <Home className="w-3.5 h-3.5 text-[#C9AE7C]" />
            <span>Intro</span>
          </button>
        )}
      </div>

      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-10 z-20">
        <span className="font-editorial text-xs sm:text-sm tracking-[0.28em] uppercase text-[#C9AE7C] block mb-2 font-semibold">
          THE FINAL CHAPTER
        </span>
        <h2 className="font-display text-4xl sm:text-5xl text-[#F5F0E5] font-normal tracking-wide text-center mb-3 drop-shadow-md">
          A Letter For You
        </h2>
        <p className="font-serif italic text-lg sm:text-xl text-[#A7B9A6] text-center">
          {finalLetter.subheading || 'A few words, from me to you.'}
        </p>
        <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9AE7C] to-transparent mx-auto mt-4" />
      </div>

      {/* 3D Envelope Container */}
      {stage !== 'opened' ? (
        <div className="relative z-20 flex flex-col items-center [perspective:1200px]">
          {/* Envelope Graphic with 3D Transform Flap */}
          <div
            onClick={stage === 'closed' ? handleOpenLetter : undefined}
            className={`w-72 sm:w-96 h-48 sm:h-60 rounded-xl relative cursor-pointer group shadow-2xl transition-all duration-700 [transform-style:preserve-3d] ${
              stage === 'closed' ? 'hover:scale-105' : 'scale-100'
            }`}
            style={{
              background: 'linear-gradient(145deg, #1D3B2F 0%, #102A23 100%)',
              border: '1px solid rgba(201, 174, 124, 0.55)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            }}
          >
            {/* Triangular Flap with 3D Flip */}
            <div
              className="absolute top-0 left-0 right-0 h-28 sm:h-36 origin-top transition-transform duration-700 ease-in-out z-20"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                background: 'linear-gradient(180deg, #284c3d 0%, #17382c 100%)',
                borderTop: '1px solid rgba(201, 174, 124, 0.5)',
                transform: stage === 'opening' ? 'rotateX(180deg)' : 'rotateX(0deg)',
              }}
            />

            {/* Inner Paper preview peeking out during opening */}
            <div
              className={`absolute left-4 right-4 h-40 bg-[#FAF4E9] rounded-t-lg transition-transform duration-700 ease-out z-10 shadow-md ${
                stage === 'opening' ? '-translate-y-24' : 'translate-y-2'
              }`}
            />

            {/* Side folds */}
            <div
              className="absolute inset-0 pointer-events-none z-15"
              style={{
                clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
                background: 'rgba(9, 23, 18, 0.35)',
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none z-15"
              style={{
                clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)',
                background: 'rgba(9, 23, 18, 0.35)',
              }}
            />

            {/* Bottom Fold */}
            <div
              className="absolute inset-0 pointer-events-none z-15"
              style={{
                clipPath: 'polygon(0% 100%, 50% 50%, 100% 100%)',
                background: 'rgba(16, 42, 35, 0.75)',
              }}
            />

            {/* Golden Wax Seal */}
            <div
              className={`absolute top-24 sm:top-32 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-tr from-[#9B7C3E] via-[#C9AE7C] to-[#E5D2A8] flex items-center justify-center shadow-2xl border border-[#F5F0E5]/50 transition-all duration-500 z-30 ${
                stage === 'opening' ? 'scale-0 opacity-0' : 'group-hover:scale-110'
              }`}
            >
              <span className="font-editorial font-bold text-[#102A23] text-xs tracking-widest">
                A &amp; B
              </span>
            </div>

            {/* Subtle glow underneath */}
            <div className="absolute -inset-2 bg-[#C9AE7C]/25 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>

          {/* Controls below envelope */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleOpenLetter}
              disabled={stage === 'opening'}
              className="pagination-btn group flex items-center justify-center gap-2.5"
              aria-label="Open the letter"
            >
              <Mail className="w-4 h-4 text-[#C9AE7C] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 shrink-0" />
              <span className="font-sans text-xs uppercase tracking-widest font-semibold text-[#F5F0E5]">
                {stage === 'opening' ? 'Opening...' : 'Open the Letter ✉'}
              </span>
            </button>

            <button
              onClick={handleSkipAnimation}
              className="pagination-btn group flex items-center justify-center gap-2.5"
              title="Skip animation and read immediately"
              aria-label="Skip animation and read immediately"
            >
              <FastForward className="w-4 h-4 text-[#C9AE7C] group-hover:translate-x-1.5 transition-transform duration-300 shrink-0" />
              <span className="font-sans text-xs uppercase tracking-widest font-semibold text-[#F5F0E5]">
                Skip Animation
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* The Unfolded Warm Ivory Vintage Parchment Letter */
        <div style={{ position: 'relative', zIndex: 20, width: '100%', maxWidth: '740px', margin: '0 auto' }}>
          {/* Top Floating Controls */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 text-xs font-editorial tracking-[0.22em] uppercase text-[#C9AE7C]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9AE7C]" />
              <span>Letter Unfolded</span>
            </div>

            {/* Skip animation button if still revealing */}
            {revealedParagraphs < finalLetter.paragraphs.length && (
              <button
                onClick={handleSkipAnimation}
                className="text-xs font-sans tracking-wider uppercase text-[#C9AE7C] hover:text-[#F5F0E5] transition-colors flex items-center gap-1.5 cursor-pointer bg-[#102A23]/60 px-3 py-1 rounded-full border border-[#C9AE7C]/30"
              >
                <FastForward className="w-3 h-3" />
                <span>Show All Text</span>
              </button>
            )}
          </div>

          <div className="letter-paper px-6 py-10 sm:px-12 sm:py-16 md:px-16 md:py-20 rounded-2xl relative transition-all duration-500 animate-fadeIn">
            {/* Inner Gold Foil Frame */}
            <div className="letter-inner-frame" />

            {/* Four Ornate Golden Filigree Corners */}
            <CornerFiligree className="absolute top-4 left-4 sm:top-6 sm:left-6" />
            <CornerFiligree className="absolute top-4 right-4 sm:top-6 sm:right-6 rotate-90" />
            <CornerFiligree className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 -rotate-90" />
            <CornerFiligree className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 rotate-180" />

            {/* Background Crest Watermark */}
            <CrestWatermark />

            {/* Delicate Gold Header Emblem */}
            <div className="text-center mb-10 relative z-10">
              <span className="font-editorial text-xs sm:text-sm tracking-[0.3em] uppercase text-[#9B7C3E] font-semibold block mb-2">
                ✦ A Personal Note ✦
              </span>
              <div className="flex items-center justify-center gap-3 my-3">
                <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[#C9AE7C]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#C9AE7C]" />
                <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[#C9AE7C]" />
              </div>
              {finalLetter.title && (
                <h4 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#102A23] font-semibold tracking-wide leading-snug mt-2">
                  {finalLetter.title}
                </h4>
              )}
            </div>

            {/* Recipient Salutation in Sweeping Romantic Calligraphy */}
            <div className="relative z-10 mb-8">
              <h3 className="font-calligraphy text-5xl sm:text-6xl md:text-7xl font-normal text-[#102A23] leading-tight tracking-wide drop-shadow-sm select-none">
                {finalLetter.recipient}
              </h3>
            </div>

            {/* Letter Body Paragraphs */}
            <div className="space-y-6 text-[#172B23] font-serif relative z-10">
              {finalLetter.paragraphs.slice(0, revealedParagraphs || finalLetter.paragraphs.length).map((p, idx) => {
                const isShortCallout = p.startsWith('**') && p.endsWith('**') && p.length < 50;
                
                if (isShortCallout) {
                  return (
                    <div
                      key={idx}
                      className="my-8 py-3.5 border-y border-[#C9AE7C]/40 text-center font-display text-xl sm:text-2xl font-medium text-[#102A23] tracking-wide animate-fadeIn flex items-center justify-center gap-3"
                    >
                      <span className="text-[#9B7C3E] text-xs">✦</span>
                      <span>{p.replace(/\*\*/g, '')}</span>
                      <span className="text-[#9B7C3E] text-xs">✦</span>
                    </div>
                  );
                }

                const isFullHighlight = p.startsWith('**') && p.endsWith('**');
                if (isFullHighlight) {
                  return (
                    <div
                      key={idx}
                      className="letter-callout-highlight text-left font-serif text-[1.12rem] sm:text-[1.28rem] leading-[2.1] text-[#102A23] font-medium tracking-[0.012em] animate-fadeIn"
                    >
                      {renderParagraphContent(p)}
                    </div>
                  );
                }

                // First paragraph gets the exquisite classic illuminated drop-cap
                if (idx === 0) {
                  const firstLetterChar = p.charAt(0);
                  const remainingText = p.slice(1);
                  return (
                    <p
                      key={idx}
                      className="text-left font-serif text-[1.12rem] sm:text-[1.25rem] leading-[2.1] text-[#172B23] font-normal tracking-[0.012em] animate-fadeIn"
                    >
                      <span className="letter-drop-cap">{firstLetterChar}</span>
                      {renderParagraphContent(remainingText)}
                    </p>
                  );
                }

                return (
                  <p
                    key={idx}
                    className="text-left font-serif text-[1.12rem] sm:text-[1.25rem] leading-[2.1] text-[#172B23] font-normal tracking-[0.012em] animate-fadeIn"
                  >
                    {renderParagraphContent(p)}
                  </p>
                );
              })}
            </div>

            {/* Sign-off & Author Seal */}
            <div className="mt-14 pt-8 border-t border-[#C9AE7C]/35 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 relative z-10">
              {/* Left Side: Wax Seal Stamp with Monogram */}
              <div className="flex items-center gap-4">
                <div
                  className="letter-wax-seal group/seal shrink-0"
                  title="Official Wax Seal of A & B"
                >
                  <div className="w-12 h-12 rounded-full border border-dashed border-[#F5F0E5]/60 flex flex-col items-center justify-center text-center p-1">
                    <Heart className="w-3 h-3 text-[#F5F0E5] fill-[#F5F0E5] mb-0.5" />
                    <span className="font-editorial text-[10px] font-bold text-[#F5F0E5] tracking-widest leading-none">
                      A &amp; B
                    </span>
                  </div>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-editorial text-[11px] uppercase tracking-[0.25em] text-[#9B7C3E] font-semibold">
                    Sealed With Love
                  </span>
                  <span className="font-serif italic text-xs text-[#172B23]/70">
                    A Journey Called Us
                  </span>
                </div>
              </div>

              {/* Right Side: Closing & Handwritten Calligraphy Signature */}
              <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                <span className="font-serif italic text-lg sm:text-xl text-[#102A23]/85">
                  {finalLetter.closing}
                </span>
                <span className="font-calligraphy text-5xl sm:text-6xl text-[#102A23] leading-none my-2 select-none drop-shadow-sm">
                  — {finalLetter.author}
                </span>
                {finalLetter.date && (
                  <span className="font-editorial text-xs font-semibold tracking-[0.28em] uppercase text-[#9B7C3E] mt-1">
                    {finalLetter.date}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Options after Letter Opens */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 z-20">
            <button
              onClick={handleReadAgain}
              className="pagination-btn group flex items-center justify-center gap-2.5"
              aria-label="Fold letter and read again"
            >
              <RotateCcw className="w-4 h-4 text-[#C9AE7C] group-hover:-rotate-90 transition-transform duration-300 shrink-0" />
              <span className="font-sans text-xs uppercase tracking-widest font-semibold text-[#F5F0E5]">
                Read Again
              </span>
            </button>

            <button
              onClick={onRevisitJourney}
              className="pagination-btn group flex items-center justify-center gap-2.5"
              aria-label="Revisit our journey from the beginning"
            >
              <ArrowUp className="w-4 h-4 text-[#C9AE7C] group-hover:-translate-y-1.5 transition-transform duration-300 shrink-0" />
              <span className="font-sans text-xs uppercase tracking-widest font-semibold text-[#F5F0E5]">
                Revisit Our Journey
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

