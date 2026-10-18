import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface AudioToggleProps {
  children?: React.ReactNode;
}

export const AudioToggle: React.FC<AudioToggleProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(60); // 0 to 100
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  const getTargetGain = (volPercent: number) => {
    return (volPercent / 100) * 0.35;
  };

  const startAmbientAudio = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(getTargetGain(volume), ctx.currentTime + 2.5);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 1. Soft Forest Wind / White-Pink Noise Filter
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0,
        b1 = 0,
        b2 = 0,
        b3 = 0,
        b4 = 0,
        b5 = 0,
        b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      const filterLFO = ctx.createOscillator();
      filterLFO.frequency.setValueAtTime(0.12, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(140, ctx.currentTime);
      filterLFO.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      filterLFO.start();

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      // 2. Warm Drone Harmony (C and G in deep octave)
      const frequencies = [65.41, 98.0, 130.81, 196.0];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.015 / (idx + 1), ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
      });

      // 3. Gentle Periodic Dawn Chimes
      const chimeNotes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const playChime = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        const chimeCtx = audioCtxRef.current;
        const osc = chimeCtx.createOscillator();
        const chimeGain = chimeCtx.createGain();
        const note = chimeNotes[Math.floor(Math.random() * chimeNotes.length)];

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, chimeCtx.currentTime);

        chimeGain.gain.setValueAtTime(0.001, chimeCtx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.04, chimeCtx.currentTime + 0.1);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, chimeCtx.currentTime + 4.5);

        osc.connect(chimeGain);
        chimeGain.connect(masterGain);

        osc.start(chimeCtx.currentTime);
        osc.stop(chimeCtx.currentTime + 4.6);
      };

      intervalRef.current = window.setInterval(() => {
        if (Math.random() > 0.35) playChime();
      }, 5000);

      setIsPlaying(true);
    } catch (e) {
      console.warn('Audio could not be started:', e);
    }
  };

  const stopAmbientAudio = () => {
    if (masterGainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      masterGainRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        audioCtxRef.current?.close().catch(() => {});
        audioCtxRef.current = null;
        setIsPlaying(false);
      }, 1300);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAmbientAudio();
    } else {
      startAmbientAudio();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    if (masterGainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      masterGainRef.current.gain.linearRampToValueAtTime(getTargetGain(newVol), ctx.currentTime + 0.1);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div
      className="fixed top-5 right-5 z-50 flex items-center gap-2.5"
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
    >
      {children}
      {/* Volume Slider Drawer */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-full bg-[#102A23]/90 border border-[#C9AE7C]/30 backdrop-blur-md transition-all duration-300 ${
          showVolumeSlider && isPlaying
            ? 'opacity-100 translate-x-0 pointer-events-auto shadow-lg'
            : 'opacity-0 translate-x-4 pointer-events-none w-0 p-0 overflow-hidden border-none'
        }`}
      >
        <Volume1 className="w-3.5 h-3.5 text-[#C9AE7C] shrink-0" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 sm:w-24 h-1.5 bg-[#1D3B2F] accent-[#C9AE7C] rounded-lg cursor-pointer"
          aria-label="Ambient music volume"
        />
        <span className="font-sans text-[10px] text-[#A7B9A6] w-6 text-right">
          {volume}%
        </span>
      </div>

      {/* Main Music Toggle Button */}
      <button
        onClick={toggleAudio}
        className="audio-toggle-btn group"
        title={isPlaying ? 'Mute ambient soundscape' : 'Play ambient forest soundscape'}
        aria-label="Toggle ambient soundscape"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-[#C9AE7C] animate-pulse" />
            <span className="text-xs font-sans tracking-widest uppercase text-[#A7B9A6] group-hover:text-[#F5F0E5] transition-colors">
              Sound: On
            </span>
            <span className="flex gap-0.5 items-end h-3 ml-0.5">
              <span className="w-0.5 bg-[#C9AE7C] h-full animate-[pulse_1.2s_ease-in-out_infinite]"></span>
              <span className="w-0.5 bg-[#C9AE7C] h-2/3 animate-[pulse_0.8s_ease-in-out_infinite]"></span>
              <span className="w-0.5 bg-[#C9AE7C] h-4/5 animate-[pulse_1.5s_ease-in-out_infinite]"></span>
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-[#A7B9A6] group-hover:text-[#C9AE7C] transition-colors" />
            <span className="text-xs font-sans tracking-widest uppercase text-[#A7B9A6] group-hover:text-[#F5F0E5] transition-colors">
              Sound: Off
            </span>
          </>
        )}
      </button>
    </div>
  );
};
