import React, { useEffect, useState } from 'react';
import { BRAND_NAME, BRAND_TAGLINE } from '../data/products';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setFading(true);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        return prev + Math.floor(Math.random() * 22 + 14);
      });
    }, 110);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#090B12] flex flex-col items-center justify-center p-6 transition-opacity duration-600 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background glow */}
      <div className="absolute w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none -translate-y-12" />

      {/* Futuristic HR Emblem Loading Rig */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-8">
        {/* Orbital rings */}
        <div className="absolute inset-0 rounded-full border border-white/20 animate-spin" style={{ animationDuration: '6s' }} />
        <div className="absolute -inset-2 rounded-full border border-blue-500/30 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
        
        {/* Star Cross Background */}
        <div className="absolute w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
        <div className="absolute h-24 w-0.5 bg-gradient-to-b from-transparent via-red-500 to-transparent" />

        {/* Central HR badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-white/20 to-black/80 border border-white/30 shadow-2xl flex items-center justify-center">
          <span className="font-display font-black text-2xl tracking-tighter text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]">
            HR
          </span>
        </div>
      </div>

      {/* Brand Title */}
      <h1 className="font-display font-black text-2xl tracking-[0.25em] text-white text-center">
        {BRAND_NAME}
      </h1>
      <p className="font-tech text-xs tracking-[0.35em] text-blue-400 mt-2 uppercase">
        {BRAND_TAGLINE}
      </p>

      {/* Progress Bar */}
      <div className="w-64 max-w-full bg-white/10 h-1 rounded-full mt-8 overflow-hidden relative border border-white/10">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-red-500 transition-all duration-150 ease-out"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      <div className="flex items-center justify-between w-64 max-w-full text-[10px] font-tech text-white/40 mt-2 tracking-widest">
        <span>INITIALIZING 3D ENVIRONMENT</span>
        <span>{Math.min(100, progress)}%</span>
      </div>
    </div>
  );
};
