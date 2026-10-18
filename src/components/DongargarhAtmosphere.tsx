import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface DongargarhAtmosphereProps {
  isActive: boolean;
}

export const DongargarhAtmosphere: React.FC<DongargarhAtmosphereProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isActive || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle gentle rain streaks
    const dropCount = Math.min(Math.floor(width / 18), 75);
    const drops: Array<{ x: number; y: number; length: number; speed: number; opacity: number }> = [];

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 12 + Math.random() * 18,
        speed: 4 + Math.random() * 5,
        opacity: 0.12 + Math.random() * 0.15,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render delicate rain streaks
      ctx.strokeStyle = 'rgba(221, 230, 221, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let i = 0; i < dropCount; i++) {
        const drop = drops[i];
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y + drop.length);

        drop.y += drop.speed;
        drop.x -= 0.6; // slight slant for wind

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * (width + 50);
        }
      }

      ctx.stroke();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, reducedMotion]);

  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-5 transition-opacity duration-1000 ease-in-out"
      style={{ opacity: isActive ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* Misty Mountain Environmental Lighting Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 25%, rgba(29, 59, 47, 0.45) 0%, rgba(16, 42, 35, 0.6) 50%, rgba(9, 23, 18, 0.7) 100%)',
        }}
      />

      {/* Rolling Low Cloud / Mist Layer */}
      <div
        className="absolute inset-x-0 bottom-0 h-96 opacity-35"
        style={{
          background:
            'linear-gradient(to top, rgba(167, 185, 166, 0.25) 0%, rgba(29, 59, 47, 0.15) 50%, transparent 100%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Gentle Rain Canvas */}
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}
    </div>
  );
};
