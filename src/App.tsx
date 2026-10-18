import { useState, useCallback, useEffect } from 'react';
import { storyChapters } from './data/story';
import { LandingPage } from './components/LandingPage';
import { StoryPage } from './components/StoryPage';
import { BlurredBackground } from './components/BlurredBackground';
import { DongargarhAtmosphere } from './components/DongargarhAtmosphere';
import { LetterEnvelope } from './components/LetterEnvelope';
import { PhotoLightbox } from './components/PhotoLightbox';
import './App.css';

type ViewMode = 'landing' | 'story' | 'letter';

export function App() {
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'landing';
    const hash = window.location.hash.replace('#', '');
    if (hash === 'letter') return 'letter';
    if (storyChapters.some((c) => c.id === hash)) return 'story';
    return 'landing';
  });

  const [activeChapterId, setActiveChapterId] = useState<string>(() => {
    if (typeof window === 'undefined') return storyChapters[0].id;
    const hash = window.location.hash.replace('#', '');
    if (storyChapters.some((c) => c.id === hash)) return hash;
    return storyChapters[0].id;
  });

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Active chapter details
  const activeChapterIndex = storyChapters.findIndex((c) => c.id === activeChapterId);
  const currentChapter = storyChapters[activeChapterIndex >= 0 ? activeChapterIndex : 0];
  const currentPhotoUrl = currentChapter?.photoUrl;

  // Rain atmosphere active across all pages (chapters, letter, and landing)
  const isRainAtmosphere = true;

  // Synchronize state from browser back/forward buttons (hashchange)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'letter') {
        setView('letter');
      } else if (storyChapters.some((c) => c.id === hash)) {
        setView('story');
        setActiveChapterId(hash);
      } else if (hash === 'intro' || hash === '' || hash === 'landing') {
        setView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Enter story from landing page
  const handleEnterStory = useCallback(() => {
    setView('story');
    setActiveChapterId(storyChapters[0].id);
    window.location.hash = '#' + storyChapters[0].id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Jump to specific individual chapter page
  const handleSelectChapter = useCallback((chapterId: string) => {
    setView('story');
    setActiveChapterId(chapterId);
    window.location.hash = '#' + chapterId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Jump to final letter page
  const handleGoToLetter = useCallback(() => {
    setView('letter');
    window.location.hash = '#letter';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Return to cover / landing page
  const handleReturnToLanding = useCallback(() => {
    setView('landing');
    window.location.hash = '#intro';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Return to chapter 6 from letter page
  const handleReturnToChapterFromLetter = useCallback(() => {
    const lastChapterId = storyChapters[storyChapters.length - 1].id;
    handleSelectChapter(lastChapterId);
  }, [handleSelectChapter]);

  // Revisit journey from beginning
  const handleRevisitJourney = useCallback(() => {
    handleSelectChapter(storyChapters[0].id);
  }, [handleSelectChapter]);

  // Photo Lightbox modal handlers
  const handleOpenPhoto = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handleNextPhoto = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % storyChapters.length : 0
    );
  }, []);

  const handlePrevPhoto = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + storyChapters.length) % storyChapters.length : 0
    );
  }, []);

  const currentLightboxChapter =
    lightboxIndex !== null ? storyChapters[lightboxIndex] : null;

  return (
    <div className="relative min-h-screen bg-[#091712] text-[#F5F0E5] font-sans selection:bg-[#1D3B2F] selection:text-[#F5F0E5]">


      {/* 3. Blurred Photograph Background Layer */}
      {view === 'story' && (
        <BlurredBackground
          currentPhotoUrl={currentPhotoUrl}
          activeChapterIndex={activeChapterIndex}
        />
      )}

      {/* 4. Misty Rain Atmosphere (Active across all pages) */}
      <DongargarhAtmosphere isActive={isRainAtmosphere} />

      {/* 5. Individual Page Views */}
      {view === 'landing' && (
        <div className="animate-fadeIn">
          <LandingPage onEnterStory={handleEnterStory} />
        </div>
      )}

      {view === 'story' && (
        <main className="relative z-10 w-full animate-fadeIn">
          <StoryPage
            chapters={storyChapters}
            activeChapterId={activeChapterId}
            onSelectChapter={handleSelectChapter}
            onGoToLetter={handleGoToLetter}
            onReturnToLanding={handleReturnToLanding}
            onOpenPhoto={handleOpenPhoto}
          />
        </main>
      )}

      {view === 'letter' && (
        <main className="relative z-10 animate-fadeIn">
          <LetterEnvelope
            onRevisitJourney={handleRevisitJourney}
            onReturnToChapter={handleReturnToChapterFromLetter}
            onReturnToLanding={handleReturnToLanding}
          />
        </main>
      )}



      {/* 7. Floating 3D Photo Lightbox Modal */}
      {currentLightboxChapter && (
        <PhotoLightbox
          isOpen={lightboxIndex !== null}
          photoUrl={currentLightboxChapter.photoUrl || ''}
          caption={currentLightboxChapter.photoCaption}
          title={currentLightboxChapter.title}
          timeframe={currentLightboxChapter.timeframe}
          onClose={handleCloseLightbox}
          onNext={handleNextPhoto}
          onPrev={handlePrevPhoto}
          currentIndex={lightboxIndex ?? 0}
          totalPhotos={storyChapters.length}
        />
      )}

      {/* Footer Note */}
      {view !== 'landing' && (
        <footer className="relative z-10 py-8 text-center text-xs font-sans tracking-widest text-[#A7B9A6]/50 uppercase border-t border-[#1D3B2F]/40">
          <p>A Journey Called Us &bull; Created with care by Akshat for Banita</p>
        </footer>
      )}
    </div>
  );
}

export default App;
