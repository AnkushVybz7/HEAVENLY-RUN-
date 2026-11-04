import React from 'react';
import { useMotionPreference } from '../context/MotionContext';
import {
  Sliders,
  Eye,
  EyeOff,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  Tv,
  Gamepad2,
  CheckCircle2,
  Activity,
  Layers,
} from 'lucide-react';
import { motion } from 'motion/react';

export const MotionAccessibilityCard: React.FC = () => {
  const { reducedMotion, toggleReducedMotion, setReducedMotion, deviceType, displayInfo } =
    useMotionPreference();

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-4 h-4 text-blue-400" />;
      case 'tablet':
        return <Tablet className="w-4 h-4 text-indigo-400" />;
      case 'console':
        return <Gamepad2 className="w-4 h-4 text-red-400" />;
      case 'desktop':
      default:
        return <Monitor className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getDeviceLabel = () => {
    switch (deviceType) {
      case 'mobile':
        return 'Mobile Phone';
      case 'tablet':
        return 'Tablet Display';
      case 'console':
        return 'Console / Smart TV';
      case 'desktop':
      default:
        return 'Desktop Workstation';
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-white/10 via-[#0e1424]/90 to-[#070912]/95 border border-white/15 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Background ambient corner glow */}
      <div
        className={`absolute -top-20 -right-20 w-56 h-56 rounded-full blur-[90px] pointer-events-none transition-colors duration-700 ${
          reducedMotion ? 'bg-emerald-500/10' : 'bg-blue-600/15'
        }`}
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-colors duration-300 ${
                reducedMotion
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'bg-blue-600/20 border-blue-400/40 text-blue-300 shadow-[0_0_15px_rgba(23,107,255,0.25)]'
              }`}
            >
              <Sliders className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg tracking-wider text-white uppercase">
                  Sensory Comfort & Reduced Motion
                </h3>
                <span
                  className={`text-[9px] font-tech font-bold uppercase px-2 py-0.5 rounded-full border ${
                    reducedMotion
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                  }`}
                >
                  GLOBAL PREFERENCE
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-white/60 mt-0.5 font-light">
                Fine-tune Framer Motion dynamics, 3D particle densities, and camera oscillations across all pages.
              </p>
            </div>
          </div>

          {/* Primary Accessible Switch Button */}
          <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
            <button
              type="button"
              role="switch"
              aria-checked={reducedMotion}
              aria-label="Toggle Reduced Motion across the application"
              onClick={toggleReducedMotion}
              className={`relative inline-flex h-8 w-16 sm:h-9 sm:w-18 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090B12] ${
                reducedMotion
                  ? 'bg-emerald-600 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.5)]'
                  : 'bg-white/10 border-white/20 hover:border-white/40'
              }`}
            >
              <span className="sr-only">Toggle Reduced Motion</span>
              <span
                className={`pointer-events-none inline-flex h-6 w-6 sm:h-7 sm:w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out items-center justify-center my-auto ${
                  reducedMotion
                    ? 'translate-x-8 sm:translate-x-9 text-emerald-700'
                    : 'translate-x-1 text-slate-700'
                }`}
              >
                {reducedMotion ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </span>
            </button>

            <span className="font-tech text-xs sm:text-sm font-bold tracking-wider uppercase text-white min-w-[70px]">
              {reducedMotion ? (
                <span className="text-emerald-400">ON</span>
              ) : (
                <span className="text-white/60">OFF</span>
              )}
            </span>
          </div>
        </div>

        {/* Live Status and Interactive Preview Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Explanation & Effect Scope */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-tech text-blue-300 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Active Motion State</span>
              </span>

              <p className="font-body text-xs sm:text-sm text-white/80 leading-relaxed">
                {reducedMotion ? (
                  <span>
                    <strong className="text-emerald-400 font-medium">Reduced Motion Active:</strong> 3D background particle systems are decreased to calm static dust, Three.js celestial ring rotations are frozen, cursor vortex swirls are halted, and Framer Motion spring oscillations render instantly.
                  </span>
                ) : (
                  <span>
                    <strong className="text-blue-400 font-medium">Standard Dynamic Mode:</strong> Full Three.js interstellar particle field with mouse swirl response, gyroscopic celestial orbital rings, 360° can auto-rotation, and kinetic Framer Motion page reveals.
                  </span>
                )}
              </p>
            </div>

            {/* Quick Toggle Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReducedMotion(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-tech font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  !reducedMotion
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
                    : 'text-white/50 hover:text-white bg-white/5 border border-white/10'
                }`}
              >
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>Full Dynamics (Default)</span>
              </button>

              <button
                type="button"
                onClick={() => setReducedMotion(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-tech font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  reducedMotion
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'text-white/50 hover:text-white bg-white/5 border border-white/10'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Calmed Motion (Accessible)</span>
              </button>
            </div>
          </div>

          {/* Live Mini Preview Box showing real-time effect */}
          <div className="lg:col-span-5 bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-[10px] font-tech text-white/50 uppercase tracking-widest border-b border-white/10 pb-2">
              <span>Interactive Live Preview</span>
              <span className={reducedMotion ? 'text-emerald-400' : 'text-blue-400'}>
                {reducedMotion ? 'Static Serene' : 'Dynamic Orbit'}
              </span>
            </div>

            {/* Preview Animation Rig */}
            <div className="relative h-24 my-2 flex items-center justify-center overflow-hidden">
              {/* Outer Orbit Ring */}
              <motion.div
                animate={!reducedMotion ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full border border-dashed border-blue-400/40 relative flex items-center justify-center"
              >
                {!reducedMotion && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60A5FA]" />
                )}
              </motion.div>

              {/* Counter ring */}
              <motion.div
                animate={!reducedMotion ? { rotate: -360 } : { rotate: 25 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute w-24 h-12 rounded-full border border-red-500/30"
                style={{ transform: 'rotateX(65deg)' }}
              />

              {/* Central Core Emblem */}
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center font-display font-black text-xs text-white transition-all duration-300 ${
                  reducedMotion
                    ? 'bg-emerald-950/50 border-emerald-400/50 text-emerald-200'
                    : 'bg-blue-950/50 border-blue-400/50 text-blue-200 shadow-[0_0_12px_rgba(23,107,255,0.4)]'
                }`}
              >
                HR
              </div>
            </div>

            <div className="text-[10px] font-tech text-white/50 text-center uppercase tracking-wider">
              {reducedMotion
                ? '30 Active Particles • Static Framing'
                : '420 Active Particles • 60 FPS Gyroscope'}
            </div>
          </div>
        </div>

        {/* Automatic Device & Display Detection Telemetry */}
        <div className="border-t border-white/10 pt-4 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-tech text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Automatic Display & Device Adaptation (Silent Sensor)</span>
            </span>
            <span className="text-[10px] font-tech text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Calibrated Perfectly</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Device Type */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-black/40">{getDeviceIcon()}</div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-tech text-white/40 uppercase">Hardware Class</span>
                <span className="text-xs font-tech font-bold text-white truncate">
                  {getDeviceLabel()}
                </span>
              </div>
            </div>

            {/* Screen Resolution */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-black/40">
                <Tv className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-tech text-white/40 uppercase">Viewport Dimensions</span>
                <span className="text-xs font-mono font-bold text-white truncate">
                  {displayInfo.width} × {displayInfo.height} px
                </span>
              </div>
            </div>

            {/* Input System */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-black/40">
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-tech text-white/40 uppercase">Interaction Method</span>
                <span className="text-xs font-tech font-bold text-white truncate">
                  {displayInfo.isTouch ? 'Touch Screen' : 'Pointer / Gamepad'}
                </span>
              </div>
            </div>

            {/* DPR & Pixel Scale */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-black/40">
                <Sliders className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-tech text-white/40 uppercase">Retina / Scale Ratio</span>
                <span className="text-xs font-mono font-bold text-white truncate">
                  {displayInfo.dpr.toFixed(1)}x Density
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] font-body text-white/50 leading-relaxed font-light mt-1">
            HEAVENLY-RUN dynamically matches typography, 3D viewport dimensions, camera depth, and touch zones to your exact screen size—without requiring device surveys or configuration prompts.
          </p>
        </div>
      </div>
    </div>
  );
};
