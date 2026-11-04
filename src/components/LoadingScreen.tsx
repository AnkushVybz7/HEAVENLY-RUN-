import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND_NAME, BRAND_TAGLINE } from '../data/products';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { createCanTexture, createDropletBumpMap } from './3d/canTextureGenerator';
import { useMotionPreference } from '../context/MotionContext';

interface LoadingScreenProps {
  onComplete: () => void;
}

/**
 * Official HR Celestial Monogram Emblem
 * Recreated with high-fidelity vector graphics matching the official can packaging:
 * - Elongated 4-point celestial star cross with icy cyan/blue glow
 * - Angled elliptical orbital ring with orbiting celestial energy spark
 * - Aerodynamic italicized metallic HR monogram with chrome & crimson bevel
 */
const OfficialHREmblem: React.FC<{ prefersReducedMotion: boolean }> = ({ prefersReducedMotion }) => {
  return (
    <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
      {/* Outer Rotating Celestial Telemetry Rings */}
      {!prefersReducedMotion && (
        <>
          {/* Ring 1 - Clockwise dashed orbit with celestial star marker */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-blue-500/20 border-dashed"
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_#60A5FA]" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-300/80 shadow-[0_0_8px_#818CF8]" />
          </motion.div>

          {/* Ring 2 - Counter-clockwise tilted elliptical ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3 rounded-full border border-red-500/20"
            style={{ transform: 'rotateX(62deg)' }}
          >
            <div className="absolute top-0 right-1/4 w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_10px_#F87171]" />
          </motion.div>

          {/* Ring 3 - Deep purple cosmic inclination ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-6 rounded-full border border-purple-500/20"
            style={{ transform: 'rotateY(60deg)' }}
          >
            <div className="absolute bottom-1 left-1/3 w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_8px_#C084FC]" />
          </motion.div>
        </>
      )}

      {/* Static telemetry framing when reduced motion is preferred */}
      {prefersReducedMotion && (
        <div className="absolute -inset-2 rounded-full border border-blue-500/25 border-dashed" />
      )}

      {/* Elongated Glowing Celestial Star Cross (Background flare) */}
      <div className="absolute w-44 sm:w-56 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_rgba(96,165,250,0.9)]" />
      <div className="absolute h-44 sm:h-56 w-[1.5px] bg-gradient-to-b from-transparent via-red-400 to-transparent shadow-[0_0_12px_rgba(248,113,113,0.9)]" />
      <div className="absolute w-28 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-45" />
      <div className="absolute w-28 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent -rotate-45" />

      {/* Central Pulsing HR Emblem Core */}
      <motion.div
        animate={
          !prefersReducedMotion
            ? {
                scale: [0.98, 1.025, 0.98],
                filter: [
                  'drop-shadow(0 0 20px rgba(23,107,255,0.35)) drop-shadow(0 0 40px rgba(181,18,39,0.25))',
                  'drop-shadow(0 0 35px rgba(23,107,255,0.65)) drop-shadow(0 0 55px rgba(181,18,39,0.45))',
                  'drop-shadow(0 0 20px rgba(23,107,255,0.35)) drop-shadow(0 0 40px rgba(181,18,39,0.25))',
                ],
              }
            : { scale: 1 }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-white/15 via-[#0E1424] to-[#070910] border border-white/30 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden shadow-2xl"
      >
        {/* Internal Sheen Diagonal Highlight */}
        <div className="absolute -top-full left-0 right-0 h-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform -skew-y-12 animate-pulse" />

        {/* Vector SVG of Official HR Monogram & Orbiting Sweep */}
        <svg
          viewBox="0 0 160 130"
          className="w-24 h-20 sm:w-28 sm:h-24 relative z-10 overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic Chrome Gradient */}
            <linearGradient id="hrMetallicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="75%" stopColor="#475569" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            {/* Devil-Heavenly Duality Border Gradient */}
            <linearGradient id="hrBorderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#176BFF" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#B51227" />
            </linearGradient>

            {/* Celestial Star Glow */}
            <radialGradient id="starCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#A8D8FF" />
              <stop offset="70%" stopColor="#176BFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#090B12" stopOpacity="0" />
            </radialGradient>

            {/* Orbital Ring Gradient */}
            <linearGradient id="orbitalRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#176BFF" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="80%" stopColor="#B51227" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#176BFF" stopOpacity="0.3" />
            </linearGradient>

            {/* Drop Shadow filter for vectors */}
            <filter id="svgGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#60A5FA" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Elongated Celestial Star Behind Monogram */}
          <g filter="url(#svgGlow)">
            {/* Vertical elongated star ray */}
            <path
              d="M 80,6 L 82.5,58 L 80,118 L 77.5,58 Z"
              fill="url(#starCoreGlow)"
            />
            {/* Horizontal star ray */}
            <path
              d="M 28,62 L 76,60 L 132,62 L 76,64 Z"
              fill="url(#starCoreGlow)"
            />
          </g>

          {/* Elliptical Celestial Orbit Ring */}
          <g transform="rotate(-16 80 62)">
            <ellipse
              cx="80"
              cy="62"
              rx="62"
              ry="22"
              stroke="url(#orbitalRingGrad)"
              strokeWidth="2.2"
              fill="none"
              strokeDasharray={prefersReducedMotion ? 'none' : '180 30'}
            />
            {/* Orbiting star particle */}
            {!prefersReducedMotion && (
              <circle
                cx="140"
                cy="62"
                r="3.5"
                fill="#FFFFFF"
                className="shadow-[0_0_8px_#FFFFFF]"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 80 62"
                  to="360 80 62"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>

          {/* Stylized Italicized "HR" Monogram Glyphs */}
          <g className="font-display font-black text-4xl" style={{ fontStyle: 'italic' }}>
            {/* Letter H */}
            <path
              d="M 36,88 L 47,38 L 59,38 L 54,58 L 68,58 L 72,38 L 84,38 L 73,88 L 61,88 L 65,69 L 51,69 L 47,88 Z"
              fill="url(#hrMetallicGrad)"
              stroke="url(#hrBorderGrad)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Letter R with sweeping dynamic aerodynamic leg */}
            <path
              d="M 76,88 L 87,38 L 109,38 C 120,38 126,43 123,53 C 121,60 115,65 106,66 L 118,88 L 105,88 L 95,68 L 91,68 L 87,88 Z M 93,58 L 104,58 C 109,58 112,56 113,52 C 114,48 112,46 107,46 L 96,46 Z"
              fill="url(#hrMetallicGrad)"
              stroke="url(#hrBorderGrad)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </g>

          {/* Inner metallic specular highlight on HR */}
          <path
            d="M 48,40 L 57,40 L 53,59 L 69,59 L 73,40 L 82,40"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>

        {/* Wordmark below monogram inside shield */}
        <div className="flex flex-col items-center -mt-1 relative z-10">
          <span className="text-[7.5px] sm:text-[9px] font-tech tracking-[0.38em] text-blue-300 font-bold uppercase">
            ENERGY
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const { reducedMotion } = useMotionPreference();
  const [progress, setProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(10);
  const [isDone, setIsDone] = useState(false);
  const prefersReducedMotion = reducedMotion;
  const isCompleteTriggeredRef = useRef(false);

  // Real 3D scenes & packaging asset preloading pipeline
  useEffect(() => {
    let isCancelled = false;

    const runAssetPreloading = async () => {
      const startTime = Date.now();
      const minDisplayMs = prefersReducedMotion ? 500 : 1400; // Respectful delay to ensure smooth perception
      const maxTimeoutMs = 3500; // Safeguard timeout so it never hangs

      // 1. Initial WebGL & core state
      if (!isCancelled) setTargetProgress(22);

      // 2. Preload official can image references
      const imageAssets = [
        '/assets/aistudio/1793642287576_7a5f7729.png', // Devil Rush
        '/assets/aistudio/1793644593915_1b64ec5a.png', // Heavenly Rush
      ];

      const preloadImages = Promise.all(
        imageAssets.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = src;
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
            })
        )
      );

      // 3. Pre-generate procedural can textures & bump maps for instant 3D smoothness
      const warmup3DTextures = new Promise((resolve) => {
        try {
          createCanTexture('devil-rush');
          createCanTexture('heavenly-rush');
          createDropletBumpMap();
        } catch {
          // Non-blocking fallback
        }
        resolve(true);
      });

      // 4. Verify fonts ready
      const fontsPromise =
        typeof document !== 'undefined' && document.fonts && document.fonts.ready
          ? document.fonts.ready.catch(() => true)
          : Promise.resolve(true);

      // Update intermediate milestones
      setTimeout(() => {
        if (!isCancelled) setTargetProgress(48);
      }, 300);

      await Promise.race([
        Promise.all([preloadImages, warmup3DTextures, fontsPromise]),
        new Promise((resolve) => setTimeout(resolve, maxTimeoutMs)),
      ]);

      if (!isCancelled) setTargetProgress(85);

      // Ensure minimum display duration for brand immersion
      const elapsed = Date.now() - startTime;
      const remainingMs = Math.max(0, minDisplayMs - elapsed);

      setTimeout(() => {
        if (!isCancelled) {
          setTargetProgress(100);
        }
      }, remainingMs);
    };

    runAssetPreloading();

    return () => {
      isCancelled = true;
    };
  }, [prefersReducedMotion]);

  // Smooth progress interpolation towards targetProgress
  useEffect(() => {
    const stepInterval = prefersReducedMotion ? 25 : 35;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < targetProgress) {
          const delta = prefersReducedMotion
            ? Math.ceil((targetProgress - prev) * 0.4)
            : Math.ceil((targetProgress - prev) * 0.25);
          const next = Math.min(targetProgress, prev + Math.max(1, delta));
          return next;
        }

        if (prev >= 100 && !isCompleteTriggeredRef.current) {
          isCompleteTriggeredRef.current = true;
          clearInterval(timer);

          // Graceful pause at 100% to view ready state before exit transition
          const pauseBeforeExit = prefersReducedMotion ? 180 : 350;
          setTimeout(() => {
            setIsDone(true);
            const exitTransitionDuration = prefersReducedMotion ? 300 : 650;
            setTimeout(() => {
              onComplete();
            }, exitTransitionDuration);
          }, pauseBeforeExit);

          return 100;
        }

        return prev;
      });
    }, stepInterval);

    return () => clearInterval(timer);
  }, [targetProgress, onComplete, prefersReducedMotion]);

  // Telemetry status messages reflecting real pipeline stages
  const getStatusMessage = (val: number) => {
    if (val < 25) return 'INITIALIZING 3D ENGINE & WEBGL CONTEXT';
    if (val < 50) return 'PRELOADING HIGH-RES PACKAGING & ASSETS';
    if (val < 75) return 'GENERATING CONDENSATION MAPS & PROCEDURAL SHADERS';
    if (val < 99) return 'CALIBRATING DEVIL & HEAVENLY SENSORY DUALITY';
    return 'FREQUENCY LOCKED. RISE ABOVE ORDINARY.';
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 1.04,
            filter: prefersReducedMotion ? 'none' : 'blur(8px)',
          }}
          transition={{ duration: prefersReducedMotion ? 0.35 : 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#090B12] flex flex-col items-center justify-center p-6 overflow-hidden select-none"
          role="status"
          aria-live="polite"
          aria-label="Loading HEAVENLY-RUN ENERGY experience"
        >
          {/* Pulsing Cinematic Nebula Background */}
          {!prefersReducedMotion ? (
            <>
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.2, 0.38, 0.2],
                  rotate: [0, 90, 180],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute w-[620px] h-[620px] bg-gradient-to-tr from-blue-600/30 via-[#8060B9]/25 to-red-600/25 rounded-full blur-[140px] pointer-events-none"
              />
              <motion.div
                animate={{
                  scale: [1.2, 0.95, 1.2],
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                  duration: 6.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute w-[460px] h-[460px] bg-blue-500/20 rounded-full blur-[110px] pointer-events-none"
              />
            </>
          ) : (
            <div className="absolute w-[500px] h-[500px] bg-blue-600/12 rounded-full blur-[120px] pointer-events-none" />
          )}

          {/* Background Micro-Grid for Cyber-Celestial Precision */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Central Official HR Monogram Emblem with Orbit & Glow */}
          <OfficialHREmblem prefersReducedMotion={prefersReducedMotion} />

          {/* Typography & Brand Header */}
          <div className="text-center relative z-10 mt-6 sm:mt-8">
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-[0.25em] text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]">
              {BRAND_NAME}
            </h1>
            <p className="font-tech text-xs sm:text-sm tracking-[0.4em] text-blue-400 mt-2 uppercase font-bold">
              {BRAND_TAGLINE}
            </p>
          </div>

          {/* Futuristic Telemetry Progress Bar */}
          <div className="w-72 sm:w-88 max-w-full mt-8 sm:mt-10 relative z-10">
            {/* Progress Bar Track */}
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/15 relative p-[1px] shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-red-500 rounded-full shadow-[0_0_14px_#60A5FA]"
                style={{ width: `${Math.min(100, progress)}%` }}
                transition={{ ease: 'easeOut', duration: prefersReducedMotion ? 0.05 : 0.15 }}
              />
            </div>

            {/* Status Telemetry Text & Percentage */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-tech text-white/60 mt-3.5 tracking-wider uppercase">
              <span className="flex items-center gap-1.5 truncate max-w-[80%]">
                {progress >= 100 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Sparkles
                    className={`w-3.5 h-3.5 text-blue-400 shrink-0 ${
                      !prefersReducedMotion ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '4s' }}
                  />
                )}
                <span className="truncate">{getStatusMessage(progress)}</span>
              </span>

              <span className="font-mono font-bold text-white tracking-normal text-xs shrink-0 ml-2">
                {Math.min(100, progress)}%
              </span>
            </div>
          </div>

          {/* Accessibility Indicator when Reduced Motion is Detected */}
          {prefersReducedMotion && (
            <div className="mt-5 text-[10px] font-tech text-blue-300/60 uppercase tracking-widest border border-blue-500/20 px-3 py-1 rounded-full bg-blue-950/20">
              ACCESSIBILITY: REDUCED MOTION PRESERVED
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
