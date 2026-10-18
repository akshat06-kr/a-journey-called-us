import React, { useEffect, useState } from 'react';
import { ForestScene } from './ForestScene';
import { Sparkles } from 'lucide-react';

interface LandingPageProps {
  onEnterStory: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterStory }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [zoomProgress, setZoomProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleEnterClick = () => {
    setIsExiting(true);
    let start: number | null = null;
    const duration = 1200;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = progress * progress * progress;
      setZoomProgress(eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        onEnterStory();
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <section className="landing-section">
      {/* 3D Forest Scene in Background */}
      <ForestScene cameraZoomProgress={zoomProgress} />

      {/* Atmospheric Mist & Vignette */}
      <div className="vignette-overlay" />

      {/* Main Cinematic Content */}
      <div
        className={`landing-content-box transition-all duration-1000 ease-out ${
          isLoaded && !isExiting
            ? 'opacity-100 translate-y-0'
            : isExiting
            ? 'opacity-0 -translate-y-10 blur-sm'
            : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Subtle Eyebrow Badge */}
        <div className="landing-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-[#C9AE7C] animate-pulse" />
          <span>Akshat &amp; Banita</span>
        </div>

        {/* Film Title with Staggered Word / Line Reveals */}
        <h1 className="title-film">
          <span className="block animate-slideDown [animation-delay:200ms]">
            A Journey
          </span>
          <em className="block animate-slideUp [animation-delay:400ms]">
            Called Us
          </em>
        </h1>

        {/* Cinematic Subtitle with Italic Emphasis */}
        <p className="subtitle-cinematic animate-fadeIn [animation-delay:600ms]">
          “Some journeys stay with us long after the moment has passed.”
        </p>

        {/* Enter Our Story Button */}
        <div className="animate-fadeIn [animation-delay:800ms] flex justify-center">
          <button
            onClick={handleEnterClick}
            className="pagination-btn group flex items-center justify-center gap-2.5"
            aria-label="Enter our story"
          >
            <span className="font-sans text-xs uppercase tracking-widest font-semibold text-[#F5F0E5]">
              Enter Our Story
            </span>
            <span className="text-[#C9AE7C] transform group-hover:translate-x-1.5 transition-transform duration-300 font-serif text-base">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
