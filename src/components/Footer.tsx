import React, { useState } from 'react';
import { PageRoute } from '../types';
import { BRAND_NAME, BRAND_TAGLINE, CAFFEINE_WARNING } from '../data/products';
import { Shield, Sparkles, ExternalLink, X, FileText } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
  currentUser?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentUser, onLogout }) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const handleLink = (route: PageRoute) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="relative bg-[#06080E] border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background ambient gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
          {/* Top Brand Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 via-blue-900/40 to-black border border-white/20 flex items-center justify-center font-display font-black text-xs text-white">
                  HR
                </div>
                <h2 className="font-display font-black text-2xl tracking-[0.15em] text-white">
                  {BRAND_NAME}
                </h2>
              </div>
              <p className="font-tech text-sm tracking-[0.25em] text-blue-400 mt-1 uppercase">
                {BRAND_TAGLINE}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleLink('/flavours')}
                className="px-5 py-2.5 rounded-full text-xs font-tech font-bold tracking-widest text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>3D CAN SHOWROOM</span>
              </button>
              <button
                onClick={() => handleLink('/mystery')}
                className="px-5 py-2.5 rounded-full text-xs font-tech font-bold tracking-widest text-red-300 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 transition-all cursor-pointer"
              >
                THE MYSTERY
              </button>
            </div>
          </div>

          {/* Navigation & Informational Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Column 1: Navigation */}
            <div>
              <h3 className="font-display text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
                EXPLORE
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm font-tech">
                <li>
                  <button
                    onClick={() => handleLink('/')}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    HOME
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('/flavours')}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    FLAVOURS (DEVIL & HEAVENLY)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('/mystery')}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    THE MYSTERY (PRODIGY)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('/faq')}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    FAQ & QUESTIONS
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Products */}
            <div>
              <h3 className="font-display text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
                FLAGSHIP CANS
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm font-tech">
                <li>
                  <button
                    onClick={() => handleLink('/flavours')}
                    className="text-white/70 hover:text-red-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>DEVIL RUSH (Spicy & Sour)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('/flavours')}
                    className="text-white/70 hover:text-blue-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>HEAVENLY RUSH (Sweet & Sour)</span>
                  </button>
                </li>
                <li className="text-white/40 text-xs italic">
                  More flavours in development at the Lab
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Standards */}
            <div>
              <h3 className="font-display text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
                TRANSPARENCY
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm font-tech">
                <li>
                  <button
                    onClick={() => setModalType('privacy')}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-white/40" />
                    <span>Privacy Notice</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('terms')}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-white/40" />
                    <span>Terms & Provisional Status</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('/faq')}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Contact & Inquiries
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Official Instagram & Status */}
            <div>
              <h3 className="font-display text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
                OFFICIAL SOCIAL
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://www.instagram.com/heavenly_run.energy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 hover:border-pink-500/50 text-white hover:text-pink-300 transition-all cursor-pointer group"
                  aria-label="Official Instagram @heavenly_run.energy"
                >
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[10px] font-tech text-white/50 tracking-wider">INSTAGRAM</span>
                    <span className="font-tech text-xs font-bold text-white group-hover:text-pink-300">
                      @heavenly_run.energy
                    </span>
                  </div>
                </a>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-tech flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>PRE-LAUNCH STATUS</span>
                  </div>
                  <p className="text-white/50 text-[11px] leading-relaxed">
                    Exclusive announcements and reveals drop first on Instagram.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Responsible Warning Notice Banner (Required Compliance) */}
          <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 text-center">
            <p className="text-xs font-tech font-bold text-red-300 tracking-wider">
              {CAFFEINE_WARNING}
            </p>
            <p className="text-[11px] font-tech text-white/50 mt-1">
              Positioned strictly for responsible adults. All nutritional specifications and claims are provisional until finalized in laboratory testing.
            </p>
          </div>

          {/* User Session Bar & Log Out in Footer */}
          {currentUser && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-tech">
              <div className="flex items-center gap-2 text-white/70">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
                </span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  LOG OUT / SWITCH ACCOUNT
                </button>
              )}
            </div>
          )}

          {/* Bottom Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-tech text-white/40 pt-4 border-t border-white/5">
            <div>
              © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span>CELESTIAL REFRESHMENT</span>
              <span>•</span>
              <span>DEVIL & HEAVENLY SENSATIONS</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {modalType === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-white/20 rounded-2xl max-w-xl w-full p-6 text-white max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-display font-bold text-lg text-white">PRIVACY NOTICE</h3>
              <button
                onClick={() => setModalType(null)}
                className="text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm font-tech text-white/80 space-y-4 leading-relaxed">
              <p>
                <strong>HEAVENLY-RUN ENERGY</strong> is dedicated to safeguarding visitor privacy. Information submitted through our Community Flavour Lab or Question form is collected solely to evaluate flavour ideas and answer brand questions.
              </p>
              <p>
                We do not sell, rent, or transfer contact details to third-party marketing entities. Any flavour proposals entered into the Community Flavour Lab are submitted voluntarily for community conceptualization.
              </p>
              <p>
                Our interactive 3D can showroom and procedural sound synth execute entirely client-side in your modern browser without invasive behavioral trackers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-tech font-bold cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service & Provisional Status Modal */}
      {modalType === 'terms' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-white/20 rounded-2xl max-w-xl w-full p-6 text-white max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-display font-bold text-lg text-white">TERMS & PROVISIONAL SPECIFICATIONS</h3>
              <button
                onClick={() => setModalType(null)}
                className="text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm font-tech text-white/80 space-y-4 leading-relaxed">
              <p>
                <strong>Provisional Specifications Notice:</strong> DEVIL RUSH and HEAVENLY RUSH are in the conceptualization and pre-launch engineering phase. Can volume (300 ML), caffeine content (100 MG), and zero calorie metrics represent target specifications subject to regulatory certification and industrial verification.
              </p>
              <p>
                <strong>Launch & Availability:</strong> No official launch date or retail distributors have been finalized. The brand will disclose commercial schedules strictly via official channels when verified.
              </p>
              <p>
                <strong>Electric Guitarist Anonymity:</strong> The identity of the musical prodigy behind HEAVENLY-RUN remains strictly classified. All skill sets represent verified musical dedication without fabricated accolades.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-tech font-bold cursor-pointer"
              >
                I UNDERSTAND
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
