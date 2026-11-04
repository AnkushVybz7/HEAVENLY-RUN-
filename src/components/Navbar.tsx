import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { Menu, X, Sparkles, Volume2, VolumeX, LogOut, UserCheck, Shield, Instagram } from 'lucide-react';
import { audioSynth } from '../utils/audio';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  isAdmin?: boolean;
  currentUser: { name: string; email: string } | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  isAdmin = false,
  currentUser,
  onLogout,
  onOpenLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; route: PageRoute; badge?: string }[] = [
    { label: 'HOME', route: '/' },
    { label: 'FLAVOURS', route: '/flavours', badge: '3D' },
    { label: 'THE MYSTERY', route: '/mystery', badge: 'SECRET' },
    { label: 'FAQ', route: '/faq' },
    ...(isAdmin
      ? [{ label: 'FIRST 50 (CREATOR)', route: '/admin-first-50' as PageRoute, badge: 'VIP' }]
      : []),
  ];

  const handleLinkClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSound = () => {
    const nextState = !ambientAudio;
    setAmbientAudio(nextState);
    if (nextState) {
      audioSynth.setVolume(0.4);
      audioSynth.playGuitarNote(440, 1.2, false);
    } else {
      audioSynth.stopRiff();
      audioSynth.setVolume(0);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 lg:px-8 py-3 ${
          scrolled
            ? 'bg-[#090B12]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-2.5'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none shrink-0"
            aria-label="HEAVENLY-RUN ENERGY Home"
          >
            {/* Stylized Official HR Chrome Emblem */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/10 via-black to-[#090B12] border border-white/20 group-hover:border-blue-400/60 transition-colors shadow-lg shadow-blue-500/10">
              <div className="absolute w-[20px] h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              <div className="absolute h-[20px] w-[2px] bg-gradient-to-b from-transparent via-blue-400 to-transparent" />
              <div className="absolute w-7 h-3.5 rounded-full border border-white/30 -rotate-12 pointer-events-none" />
              <span className="font-display font-black text-xs sm:text-sm tracking-tighter text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]">
                HR
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-display font-bold text-xs sm:text-sm tracking-[0.2em] text-white group-hover:text-blue-300 transition-colors">
                HEAVENLY-RUN
              </span>
              <span className="text-[9px] sm:text-[10px] font-tech tracking-[0.35em] text-blue-400 -mt-0.5">
                ENERGY
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links (Distinct multi-page navigation) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleLinkClick(link.route)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-tech font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-sans tracking-normal ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : link.badge === 'VIP'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-white/10 text-blue-300 group-hover:bg-white/20'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities (User Profile, Log Out, Sound, Explore) */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-full border text-xs transition-colors cursor-pointer flex items-center justify-center ${
                ambientAudio
                  ? 'bg-blue-600/20 border-blue-400 text-blue-300'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
              }`}
              title={ambientAudio ? 'Audio active (click to mute)' : 'Enable atmospheric sound'}
              aria-label="Toggle procedural audio"
            >
              {ambientAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Official Instagram Icon & Handle */}
            <a
              href="https://www.instagram.com/heavenly_run.energy/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 hover:text-white hover:bg-pink-500/20 transition-all cursor-pointer flex items-center justify-center"
              title="Official Instagram: @heavenly_run.energy"
              aria-label="Official Instagram @heavenly_run.energy"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>

            {/* Authenticated User Status & LOG OUT BUTTON */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-black/60 border border-white/15 rounded-full pl-3 pr-1 py-1">
                <div className="flex items-center gap-1.5 text-xs font-tech">
                  {isAdmin ? (
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Shield className="w-3 h-3" />
                      <span className="max-w-[120px] truncate">{currentUser.name}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 uppercase">Founder</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-white/80">
                      <UserCheck className="w-3 h-3 text-blue-400" />
                      <span className="max-w-[110px] truncate">{currentUser.name}</span>
                    </span>
                  )}
                </div>

                {/* LOG OUT BUTTON */}
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1 rounded-full text-xs font-tech font-bold text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 transition-all cursor-pointer flex items-center gap-1"
                  title="Log out and re-open sign-in modal"
                >
                  <LogOut className="w-3 h-3" />
                  <span>LOG OUT</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-1.5 rounded-full text-xs font-tech font-bold text-blue-300 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-500/30 transition-colors cursor-pointer"
              >
                SIGN IN
              </button>
            )}

            {/* Quick 3D Can Showcase Link */}
            {currentRoute !== '/flavours' && (
              <button
                onClick={() => handleLinkClick('/flavours')}
                className="px-3.5 py-1.5 rounded-full text-xs font-tech font-bold tracking-wider text-black bg-gradient-to-r from-white via-blue-100 to-[#A8D8FF] hover:brightness-110 active:scale-95 transition-all shadow-md shadow-white/10 cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3 h-3 text-blue-700" />
                <span>3D CANS</span>
              </button>
            )}
          </div>

          {/* Mobile Menu & Log Out Header */}
          <div className="flex lg:hidden items-center gap-1.5">
            {currentUser && (
              <button
                onClick={onLogout}
                className="px-2 py-1 rounded-lg text-[11px] font-tech font-bold text-red-300 bg-red-950/40 border border-red-500/30 flex items-center gap-1"
                title="Log Out"
              >
                <LogOut className="w-3 h-3" />
                <span>LOG OUT</span>
              </button>
            )}

            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70"
              aria-label="Toggle audio"
            >
              {ambientAudio ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-[#090B12]/98 backdrop-blur-xl pt-20 px-6 flex flex-col justify-between pb-8 animate-fadeIn">
          <div className="flex flex-col gap-2.5">
            <div className="text-[11px] font-tech uppercase tracking-[0.25em] text-white/40 mb-1">
              Select Page ({navLinks.length} Pages Available)
            </div>

            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleLinkClick(link.route)}
                  className={`w-full py-3 px-4 rounded-xl text-left font-display font-bold text-sm tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/25 text-blue-300 border border-blue-500/50 shadow-lg'
                      : 'text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-400' : 'bg-white/20'}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`text-[10px] font-tech px-2 py-0.5 rounded ${
                        link.badge === 'VIP'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            {currentUser ? (
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-tech text-white/40 block">CURRENT ACCOUNT</span>
                  <span className="text-xs font-tech font-bold text-white">{currentUser.name}</span>
                  {isAdmin && <span className="text-[9px] text-amber-400 block font-tech">👑 Founder Verified</span>}
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-tech font-bold text-red-300 bg-red-950/50 border border-red-500/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOG OUT</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 rounded-xl font-tech font-bold text-xs tracking-wider bg-white/10 text-white text-center border border-white/20"
              >
                SIGN IN / REGISTER
              </button>
            )}

            {/* Official Instagram in Mobile Menu */}
            <a
              href="https://www.instagram.com/heavenly_run.energy/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl font-tech font-bold text-xs tracking-wider bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>FOLLOW @heavenly_run.energy</span>
              </div>
              <span className="text-[10px] text-white/50 uppercase">OFFICIAL</span>
            </a>

            <button
              onClick={() => handleLinkClick('/flavours')}
              className="w-full py-3 rounded-xl font-tech font-bold text-xs tracking-widest bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center shadow-lg cursor-pointer"
            >
              GO TO 3D CAN SHOWROOM
            </button>
          </div>
        </div>
      )}
    </>
  );
};
