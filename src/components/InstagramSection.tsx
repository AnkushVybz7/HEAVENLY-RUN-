import React from 'react';
import { Instagram, ArrowUpRight, Sparkles, Radio } from 'lucide-react';

interface InstagramSectionProps {
  className?: string;
  variant?: 'celestial' | 'compact';
}

export const OFFICIAL_INSTAGRAM = {
  username: '@heavenly_run.energy',
  url: 'https://www.instagram.com/heavenly_run.energy/',
};

export const InstagramSection: React.FC<InstagramSectionProps> = ({ className = '', variant = 'celestial' }) => {
  return (
    <section className={`relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#111728]/90 via-[#0B0F1A]/95 to-[#070910] border border-white/15 p-8 sm:p-12 shadow-2xl backdrop-blur-xl overflow-hidden group hover:border-blue-500/40 transition-colors">
          {/* Subtle grid and decorative lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-500/10 via-purple-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            {/* Left Content */}
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 border border-pink-400/30 text-[11px] font-tech font-bold tracking-[0.2em] text-pink-300 uppercase">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>OFFICIAL INSTAGRAM</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-tech tracking-widest text-white/50 uppercase">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>ACTIVE BROADCAST</span>
                </span>
              </div>

              {/* Exact required title */}
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase text-white">
                FOLLOW THE FREQUENCY.
              </h2>

              {/* Exact required supporting text */}
              <p className="font-body text-white/70 text-sm sm:text-base mt-3 leading-relaxed">
                Follow us for new flavour announcements, launch updates and exclusive HEAVENLY-RUN reveals.
              </p>

              {/* Recognizable Instagram icon and clickable username */}
              <div className="mt-4 inline-flex items-center gap-2">
                <span className="text-xs font-tech text-white/40 uppercase tracking-widest">OFFICIAL HANDLE:</span>
                <a
                  href={OFFICIAL_INSTAGRAM.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-tech font-bold text-pink-300 hover:text-white transition-colors underline decoration-pink-500/50 underline-offset-4 cursor-pointer"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>{OFFICIAL_INSTAGRAM.username}</span>
                </a>
              </div>
            </div>

            {/* Right Action: CTA Button & Visual Pill */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <a
                href={OFFICIAL_INSTAGRAM.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full font-tech font-bold text-xs sm:text-sm tracking-widest text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-pink-500/25 flex items-center gap-2.5 cursor-pointer group/btn"
              >
                <Instagram className="w-4 h-4 text-white" />
                <span>FOLLOW ON INSTAGRAM</span>
                <ArrowUpRight className="w-4 h-4 text-white/80 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>

              <div className="flex items-center gap-2 text-[10px] font-tech text-white/40 tracking-wider">
                <Sparkles className="w-3 h-3 text-pink-400" />
                <span>EXCLUSIVELY ON @heavenly_run.energy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
