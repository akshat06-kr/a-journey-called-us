import React, { useState, useEffect } from 'react';

interface BlurredBackgroundProps {
  currentPhotoUrl?: string;
  activeChapterIndex: number;
}

export const BlurredBackground: React.FC<BlurredBackgroundProps> = ({
  currentPhotoUrl,
  activeChapterIndex,
}) => {
  const [imgError, setImgError] = useState(false);
  const [activeUrl, setActiveUrl] = useState<string | undefined>(currentPhotoUrl);

  useEffect(() => {
    setImgError(false);
    setActiveUrl(currentPhotoUrl);
  }, [currentPhotoUrl]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Underlying Deep Forest Gradient that shifts with atmosphere */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background:
            activeChapterIndex === 3
              ? 'radial-gradient(circle at 50% 40%, #1D3B2F 0%, #102A23 50%, #091712 90%)'
              : activeChapterIndex === 5
              ? 'radial-gradient(circle at 50% 20%, #2A483B 0%, #102A23 60%, #091712 100%)'
              : 'radial-gradient(circle at 50% 30%, #102A23 0%, #091712 70%)',
        }}
      />

      {/* 2. Photograph Layer with Dedicated CSS Blur Filter & Subtle Zoom */}
      {activeUrl && !imgError ? (
        <div className="absolute inset-0 overflow-hidden transition-opacity duration-1000">
          <img
            src={activeUrl}
            alt=""
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
            style={{
              filter: 'blur(22px) brightness(0.38) saturate(0.8)',
              transform: 'scale(1.12)',
            }}
          />
        </div>
      ) : (
        /* Aesthetic Generative Forest Mist Texture Fallback */
        <div className="absolute inset-0 opacity-40">
          <svg
            className="w-full h-full object-cover transform scale-105"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="forestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1D3B2F" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#102A23" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#091712" stopOpacity="0.98" />
              </linearGradient>
            </defs>
            <rect width="1000" height="1000" fill="url(#forestGrad)" />
            <circle cx="500" cy="350" r="400" fill="#A7B9A6" opacity="0.12" filter="blur(80px)" />
            <circle cx="700" cy="650" r="300" fill="#C9AE7C" opacity="0.08" filter="blur(90px)" />
          </svg>
        </div>
      )}

      {/* 3. Dark Forest Overlay (Ensures Foreground Text is 100% Sharp & Readable) */}
      <div
        className="absolute inset-0 bg-[#091712]/78 mix-blend-multiply"
        style={{
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* 4. Deep Vignette to Frame the Reading View */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(9, 23, 18, 0.88) 85%, #091712 100%)',
        }}
      />

      {/* 5. Delicate Floating Atmospheric Dust Glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen bg-[radial-gradient(circle_at_50%_120%,rgba(201,174,124,0.3),transparent_70%)]" />
    </div>
  );
};
