import React, { useState } from 'react';
import { PageRoute } from '../types';
import { CelestialHeroCanvas } from '../components/3d/CelestialHeroCanvas';
import { PRODUCTS, BRAND_TAGLINE, BRAND_NAME, LAUNCH_DATE_STATUS } from '../data/products';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Disc3, Eye, ZoomIn, X } from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [selectedAdModal, setSelectedAdModal] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen bg-transparent text-white pt-20 overflow-hidden">
      {/* 1. 3D CELESTIAL HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* 3D Celestial WebGL Canvas */}
        <CelestialHeroCanvas />

        {/* Ambient Hero Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090B12]/40 via-transparent to-[#090B12] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Top Brand Emblem Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-[11px] font-tech font-bold tracking-[0.2em] text-blue-300 uppercase">
              PAGE 1 OF 4: CELESTIAL HOME
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-xl">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="font-tech text-xs tracking-[0.25em] text-white/90 uppercase">
                {BRAND_NAME}
              </span>
              <span className="text-white/30">•</span>
              <span className="font-tech text-xs tracking-wider text-blue-300">
                OFFICIAL SHOWCASE
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.08em] leading-tight uppercase text-metallic drop-shadow-[0_10px_35px_rgba(23,107,255,0.25)]">
            {BRAND_TAGLINE}
          </h1>

          {/* Subheading */}
          <h2 className="font-tech font-bold text-base sm:text-xl md:text-2xl tracking-[0.25em] text-blue-300 mt-4 uppercase">
            A NEW ENERGY EXPERIENCE IS APPROACHING.
          </h2>

          {/* Description */}
          <p className="max-w-2xl font-body text-base sm:text-lg text-white/70 mt-6 leading-relaxed font-light">
            Introducing <strong className="text-white font-medium">HEAVENLY-RUN ENERGY</strong> — an upcoming premium beverage brand built around distinctive flavours, futuristic aesthetics and a unique identity.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-10 w-full justify-center">
            <button
              onClick={() => onNavigate('/flavours')}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-tech font-bold text-sm tracking-widest text-black bg-gradient-to-r from-white via-[#C7CDD5] to-[#A8D8FF] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>EXPLORE FLAVOURS</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('/mystery')}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-tech font-bold text-sm tracking-widest text-white bg-white/5 hover:bg-white/10 border border-white/20 active:scale-95 transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>DISCOVER THE MYSTERY</span>
              <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Bottom Hero Status Indicator */}
          <div className="mt-14 flex items-center gap-6 text-xs font-tech text-white/40 tracking-wider">
            <span>300 ML CALIBRATED CAN</span>
            <span>•</span>
            <span>ZERO SUGAR & ZERO CALORIES</span>
            <span>•</span>
            <span>100 MG CAFFEINE</span>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE BRAND PILLARS */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-tech uppercase tracking-[0.3em] text-blue-400 mb-2">
            THE ARCHITECTURE
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-wider text-white">
            DEFINED BY CONTRAST
          </h2>
          <p className="font-body text-white/60 text-sm sm:text-base mt-4">
            Engineered from ground up with celestial precision and provocative sensory science.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: DISTINCTIVE FLAVOURS */}
          <div className="relative group bg-gradient-to-b from-[#111624] to-[#0A0D16] border border-white/10 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-tech text-red-400 tracking-widest uppercase mb-1">
                SENSORY DUALITY
              </div>
              <h3 className="font-display font-bold text-xl tracking-wide text-white mb-3">
                DISTINCTIVE FLAVOURS
              </h3>
              <p className="font-body text-white/70 text-sm leading-relaxed">
                Bold flavour concepts that break the monotonous sweetness of traditional drinks. Experience the fire of <strong className="text-red-300">Devil Rush</strong> and the serene crispness of <strong className="text-blue-300">Heavenly Rush</strong>.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-tech text-white/40">
              <span>DUAL FORMULATIONS</span>
              <span className="text-red-400">SOUR & SWEET</span>
            </div>
          </div>

          {/* Pillar 2: UNIQUE IDENTITY */}
          <div className="relative group bg-gradient-to-b from-[#111624] to-[#0A0D16] border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-tech text-blue-400 tracking-widest uppercase mb-1">
                CYBER-CELESTIAL
              </div>
              <h3 className="font-display font-bold text-xl tracking-wide text-white mb-3">
                UNIQUE IDENTITY
              </h3>
              <p className="font-body text-white/70 text-sm leading-relaxed">
                A futuristic brand experience uniting sleek chrome packaging, Y2K cyber aesthetics, and atmospheric 3D worlds. Every can is designed as an industrial work of art.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-tech text-white/40">
              <span>ALUMINIUM CRAFT</span>
              <span className="text-blue-400">300 ML SLEEK</span>
            </div>
          </div>

          {/* Pillar 3: THE UNKNOWN */}
          <div className="relative group bg-gradient-to-b from-[#111624] to-[#0A0D16] border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
              <Disc3 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-tech text-purple-400 tracking-widest uppercase mb-1">
                THE SECRET SOUND
              </div>
              <h3 className="font-display font-bold text-xl tracking-wide text-white mb-3">
                THE UNKNOWN
              </h3>
              <p className="font-body text-white/70 text-sm leading-relaxed">
                A mysterious musical connection. Driven by the raw electrifying riffs of an anonymous young guitar prodigy whose identity remains strictly guarded.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-tech text-white/40">
              <span>IDENTITY STATUS</span>
              <span className="text-purple-400">CLASSIFIED</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OFFICIAL PRODUCT SHOWCASE (DISPLAYING BOTH UPLOADED ADVERTISEMENTS) */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-tech uppercase tracking-[0.3em] text-blue-400 mb-2">
              PRIMARY REFERENCES
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-wider text-white">
              OFFICIAL PRODUCT ADVERTISEMENTS
            </h2>
            <p className="font-body text-white/60 text-sm sm:text-base mt-2 max-w-2xl">
              Authentic design specifications as captured in our official visual identity release.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/flavours')}
            className="px-6 py-3 rounded-full text-xs font-tech font-bold tracking-widest text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>OPEN 3D INTERACTIVE SHOWROOM</span>
          </button>
        </div>

        {/* Dual Cards for Official Posters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Card 1: DEVIL RUSH Advertisement */}
          <div className="group relative bg-[#0d1017] border border-red-500/20 hover:border-red-500/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col">
            {/* Header info */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div>
                <span className="text-[11px] font-tech text-red-400 tracking-widest uppercase">
                  OFFICIAL ARTWORK • REFERENCE 1
                </span>
                <h3 className="font-display font-bold text-2xl text-white">DEVIL RUSH</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-tech font-bold bg-red-950/60 text-red-300 border border-red-500/30">
                SPICY & SOUR
              </span>
            </div>

            {/* Poster Image Container */}
            <div className="relative aspect-[4/5] bg-black overflow-hidden flex items-center justify-center p-2">
              <img
                src={PRODUCTS['devil-rush'].imageAdUrl}
                alt="DEVIL RUSH Official Advertisement"
                className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-102"
              />
              <button
                onClick={() => setSelectedAdModal(PRODUCTS['devil-rush'].imageAdUrl)}
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-xl border border-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center gap-2 text-xs font-tech"
                title="View Full Resolution"
              >
                <ZoomIn className="w-4 h-4 text-red-400" />
                <span>EXPAND AD POSTER</span>
              </button>
            </div>

            {/* Footer Specifications & Slogan */}
            <div className="p-6 bg-gradient-to-t from-red-950/20 to-transparent flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-tech">
                <span className="text-white/60">OFFICIAL SLOGAN:</span>
                <span className="font-bold text-red-400">SOUR FIRST. FIRE LAST.</span>
              </div>
              <div className="flex items-center justify-between text-xs font-tech text-white/50 border-t border-white/5 pt-2">
                <span>PROVISIONAL TARGET:</span>
                <span>300 ML | 100 MG CAFFEINE | ZERO SUGAR</span>
              </div>
            </div>
          </div>

          {/* Card 2: HEAVENLY RUSH Advertisement */}
          <div className="group relative bg-[#0d1017] border border-blue-500/20 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col">
            {/* Header info */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div>
                <span className="text-[11px] font-tech text-blue-400 tracking-widest uppercase">
                  OFFICIAL ARTWORK • REFERENCE 2
                </span>
                <h3 className="font-display font-bold text-2xl text-white">HEAVENLY RUSH</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-tech font-bold bg-blue-950/60 text-blue-300 border border-blue-500/30">
                SWEET & SOUR
              </span>
            </div>

            {/* Poster Image Container */}
            <div className="relative aspect-[4/5] bg-black overflow-hidden flex items-center justify-center p-2">
              <img
                src={PRODUCTS['heavenly-rush'].imageAdUrl}
                alt="HEAVENLY RUSH Official Advertisement"
                className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-102"
              />
              <button
                onClick={() => setSelectedAdModal(PRODUCTS['heavenly-rush'].imageAdUrl)}
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-xl border border-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center gap-2 text-xs font-tech"
                title="View Full Resolution"
              >
                <ZoomIn className="w-4 h-4 text-blue-400" />
                <span>EXPAND AD POSTER</span>
              </button>
            </div>

            {/* Footer Specifications & Slogan */}
            <div className="p-6 bg-gradient-to-t from-blue-950/20 to-transparent flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-tech">
                <span className="text-white/60">OFFICIAL SLOGAN:</span>
                <span className="font-bold text-blue-400">SWEET FIRST. SOUR NEXT.</span>
              </div>
              <div className="flex items-center justify-between text-xs font-tech text-white/50 border-t border-white/5 pt-2">
                <span>PROVISIONAL TARGET:</span>
                <span>300 ML | 100 MG CAFFEINE | ZERO SUGAR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL TEASER & LAUNCH STATUS BANNER */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-gradient-to-b from-transparent via-[#0e1320] to-[#090B12]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/20 flex items-center justify-center mb-6 shadow-2xl">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-wide text-white uppercase">
            SOMETHING EXTRAORDINARY IS COMING.
          </h2>

          <div className="mt-8 px-6 py-3 rounded-full bg-blue-950/40 border border-blue-500/40 text-blue-300 font-tech font-bold text-sm tracking-[0.25em] uppercase flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span>LAUNCH DATE: {LAUNCH_DATE_STATUS}</span>
          </div>

          <p className="font-body text-white/60 max-w-xl text-sm sm:text-base mt-6 leading-relaxed">
            Follow our pre-release development, participate in the Community Flavour Lab, and witness the dawn of a new frequency in energy refreshment.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => onNavigate('/flavours')}
              className="px-8 py-3.5 rounded-full font-tech font-bold text-xs tracking-widest text-black bg-white hover:bg-white/90 transition-all cursor-pointer"
            >
              SUGGEST A FLAVOUR
            </button>
            <button
              onClick={() => onNavigate('/faq')}
              className="px-8 py-3.5 rounded-full font-tech font-bold text-xs tracking-widest text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
            >
              READ BRAND FAQ
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Full Resolution Ad Poster */}
      {selectedAdModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedAdModal(null)}
        >
          <div className="relative max-w-4xl max-h-[92vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedAdModal(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 rounded-full bg-white/10 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedAdModal}
              alt="Official Advertisement Poster"
              className="max-h-[85vh] w-auto object-contain rounded-xl border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-xs font-tech text-white/60 mt-3 text-center tracking-widest">
              OFFICIAL HEAVENLY-RUN PACKAGING ARTWORK REFERENCE
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
