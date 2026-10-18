import React, { useRef, useMemo, useEffect, useState, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ForestSceneProps {
  cameraZoomProgress?: number;
  className?: string;
}

// Deterministic pseudo-random number generator for pure rendering
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Error Boundary for WebGL context creation issues
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('WebGL Forest Scene error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Single Pine Tree Component
const PineTree: React.FC<{
  position: [number, number, number];
  scale?: number;
  tint?: number;
}> = ({ position, scale = 1, tint = 0x102a23 }) => {
  const tiers = 4;
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, (1.8 * scale) / 2, 0]}>
        <cylinderGeometry args={[0.12 * scale, 0.18 * scale, 1.8 * scale, 6]} />
        <meshStandardMaterial color="#091410" roughness={0.9} />
      </mesh>

      {/* Foliage Cones */}
      {Array.from({ length: tiers }).map((_, i) => {
        const radius = (1.2 - i * 0.22) * scale;
        const height = (1.6 - i * 0.15) * scale;
        const yPos = (1.4 + i * 0.9) * scale;
        return (
          <mesh key={i} position={[0, yPos, 0]} rotation={[0, (i * Math.PI) / 4, 0]}>
            <coneGeometry args={[radius, height, 7]} />
            <meshStandardMaterial color={tint} roughness={0.85} metalness={0.05} flatShading />
          </mesh>
        );
      })}
    </group>
  );
};

// Subtle Fireflies Particle System
const FireflyParticles: React.FC<{ count: number; reducedMotion: boolean }> = ({ count, reducedMotion }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const rng = mulberry32(1337);
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rng() - 0.5) * 28;
      pos[i * 3 + 1] = 0.2 + rng() * 8;
      pos[i * 3 + 2] = -25 + rng() * 40;

      spd[i * 3] = (rng() - 0.5) * 0.005;
      spd[i * 3 + 1] = 0.003 + rng() * 0.006;
      spd[i * 3 + 2] = (rng() - 0.5) * 0.005;
    }
    return [pos, spd];
  }, [count]);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(226, 207, 171, 1)');
      gradient.addColorStop(0.3, 'rgba(201, 174, 124, 0.7)');
      gradient.addColorStop(0.7, 'rgba(167, 185, 166, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || reducedMotion) return;
    const geom = pointsRef.current.geometry;
    const posArr = geom.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += speeds[i * 3 + 1];
      posArr[i * 3] += Math.sin(time * 0.5 + i) * 0.003;

      if (posArr[i * 3 + 1] > 9) {
        posArr[i * 3 + 1] = 0.2;
        posArr[i * 3] = ((i % 10) / 10 - 0.5) * 28;
      }
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.24}
        map={particleTexture}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.8}
      />
    </points>
  );
};

// Main Scene Inside R3F Canvas
const ForestContent: React.FC<{
  cameraZoomProgress: number;
  reducedMotion: boolean;
  isMobile: boolean;
}> = ({ cameraZoomProgress, reducedMotion, isMobile }) => {
  const warmLightRef = useRef<THREE.PointLight>(null);

  // Precomputed Tree Positions using deterministic RNG
  const trees = useMemo(() => {
    const rng = mulberry32(42);
    const list: Array<{ position: [number, number, number]; scale: number; tint: number }> = [];

    // Framing Foreground Trees
    list.push({ position: [-5.2, -0.2, 6], scale: 1.7, tint: 0x0c1e19 });
    list.push({ position: [-7.5, -0.2, 4], scale: 2.0, tint: 0x091712 });
    list.push({ position: [5.5, -0.2, 5.5], scale: 1.8, tint: 0x0e241e });
    list.push({ position: [7.8, -0.2, 4.2], scale: 2.1, tint: 0x091712 });

    // Midground Trees
    const midCount = isMobile ? 18 : 34;
    for (let i = 0; i < midCount; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = side * (3.5 + rng() * 14);
      const z = -2 - rng() * 26;
      const scale = 0.9 + rng() * 0.9;
      const tint = rng() > 0.4 ? 0x102a23 : 0x1d3b2f;
      list.push({ position: [x, -0.2, z], scale, tint });
    }

    // Distant Ridge Trees
    const distCount = isMobile ? 20 : 38;
    for (let i = 0; i < distCount; i++) {
      const x = (rng() - 0.5) * 60;
      const z = -25 - rng() * 20;
      const scale = 0.8 + rng() * 1.2;
      list.push({ position: [x, -0.2, z], scale, tint: 0x081510 });
    }

    return list;
  }, [isMobile]);

  // Animated Camera and Parallax
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const currentCamera = state.camera;

    if (!reducedMotion) {
      // Parallax target
      const targetX = (state.pointer.x * 0.8) + Math.sin(time * 0.2) * 0.25;
      const targetY = 1.2 + (-state.pointer.y * 0.4) + Math.cos(time * 0.25) * 0.15;

      currentCamera.position.x += (targetX - currentCamera.position.x) * 0.04;
      currentCamera.position.y += (targetY - currentCamera.position.y) * 0.04;
    }

    // Zoom transition
    const baseZ = 14;
    const targetZ = baseZ - cameraZoomProgress * 12;
    currentCamera.position.z += (targetZ - currentCamera.position.z) * 0.06;

    currentCamera.lookAt(0, 1.4, -10);

    // Subtle breathing warm light
    if (warmLightRef.current) {
      warmLightRef.current.intensity = 2.2 + Math.sin(time * 1.5) * 0.35;
    }
  });

  const particleCount = isMobile ? 80 : 200;

  return (
    <>
      <fogExp2 attach="fog" args={['#091712', 0.042]} />

      {/* Ambient & Atmosphere Lights */}
      <ambientLight color="#102a23" intensity={1.8} />
      <directionalLight position={[5, 18, -25]} color="#dde6dd" intensity={1.6} />
      <pointLight ref={warmLightRef} position={[0, 3, 4]} color="#c9ae7c" intensity={2.4} distance={35} />
      <pointLight position={[0, 2, -20]} color="#1d3b2f" intensity={4} distance={60} />

      {/* Mountain Silhouettes */}
      {[
        [-18, 2, -45],
        [0, 4, -55],
        [18, 3, -48],
        [-32, 1, -40],
        [30, 2, -42],
      ].map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]} scale={[1.4, 1, 1.2]} rotation={[0, Math.PI * 0.2 * idx, 0]}>
          <coneGeometry args={[22, 16, 4]} />
          <meshStandardMaterial color="#07120e" roughness={0.95} metalness={0.1} flatShading />
        </mesh>
      ))}

      {/* Ground Mesh */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80, 24, 24]} />
        <meshStandardMaterial color="#07130e" roughness={0.98} metalness={0.02} />
      </mesh>

      {/* Pine Trees */}
      {trees.map((t, idx) => (
        <PineTree key={idx} position={t.position} scale={t.scale} tint={t.tint} />
      ))}

      {/* Fireflies / Ambient Particles */}
      <FireflyParticles count={particleCount} reducedMotion={reducedMotion} />
    </>
  );
};

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const ForestScene: React.FC<ForestSceneProps> = ({
  cameraZoomProgress = 0,
  className = '',
}) => {
  const [canRenderWebGL] = useState<boolean>(() => checkWebGLSupport());
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fallback = (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 30%, #1D3B2F 0%, #102A23 45%, #091712 90%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#091712] via-[#091712]/50 to-transparent" />
      <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9AE7C]/20 via-transparent to-transparent" />
    </div>
  );

  if (!canRenderWebGL) {
    return fallback;
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <WebGLErrorBoundary fallback={fallback}>
        <Canvas
          camera={{ position: [0, 1.2, 14], fov: 55, near: 0.1, far: 150 }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
        >
          <ForestContent
            cameraZoomProgress={cameraZoomProgress}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
          />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};
