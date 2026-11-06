/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { SubscriberModal } from './components/SubscriberModal';
import { MultiPageDock } from './components/MultiPageDock';
import { CustomCursor } from './components/CustomCursor';
import { InteractiveParticleField } from './components/3d/InteractiveParticleField';
import { HomePage } from './pages/HomePage';
import { FlavoursPage } from './pages/FlavoursPage';
import { MysteryPage } from './pages/MysteryPage';
import { FaqPage } from './pages/FaqPage';
import { AdminFirst50Page } from './pages/AdminFirst50Page';
import { testConnection, logoutUser, auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { audioSynth } from './utils/audio';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Check if visitor has entered full name and email
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Parse path or hash to ensure robust multi-page routing
  const getInitialRoute = (): PageRoute => {
    const hash = window.location.hash.toLowerCase().replace('#', '');
    const path = window.location.pathname.toLowerCase();
    const target = hash || path;

    if (target.includes('flavours') || target.includes('flavors')) return '/flavours';
    if (target.includes('mystery')) return '/mystery';
    if (target.includes('faq')) return '/faq';
    if (target.includes('admin')) return '/admin-first-50';
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getInitialRoute);

  // Firebase is the source of truth for signed-in identity. Never trust a
  // browser-stored profile or admin flag for access decisions.
  useEffect(() => {
    testConnection();
  }, []);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    const admin = user?.email?.toLowerCase() === 'ankushbanerjeecool777@gmail.com' && user.emailVerified;
    setIsAdmin(Boolean(admin));
    if (user) {
      setCurrentUser({ name: user.displayName || 'Google User', email: user.email || '' });
      setShowSubscriberModal(false);
    } else {
      setIsAdmin(false);
      setCurrentUser(null);
    }
  }), []);

  // Sync with browser navigation (popstate & hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const nextRoute = getInitialRoute();
      setCurrentRoute(nextRoute);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Page-specific thematic soundscape management
  useEffect(() => {
    if (currentRoute === '/') {
      audioSynth.startThematicAmbient('home');
    } else if (currentRoute === '/flavours') {
      audioSynth.startThematicAmbient('flavours');
    } else if (currentRoute === '/mystery') {
      audioSynth.startThematicAmbient('mystery');
    } else {
      audioSynth.stopThematicAmbient();
    }
  }, [currentRoute]);

  const handleNavigate = (route: PageRoute) => {
    // Restrict /admin-first-50 to admin only; if not admin, open sign-in modal
    if (route === '/admin-first-50' && !isAdmin) {
      setShowSubscriberModal(true);
      return;
    }

    setCurrentRoute(route);
    // Update hash for instant iframe routing reliability
    window.location.hash = route;
    if (window.location.pathname !== route) {
      try {
        window.history.pushState({}, '', route);
      } catch {}
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscriberSuccess = (adminDetected: boolean, userData: { name: string; email: string }) => {
    setShowSubscriberModal(false);
    setCurrentUser(userData);
    setIsAdmin(adminDetected);

    // Do not call handleNavigate here: React state updates are asynchronous,
    // so its admin guard would still see the previous value.
    if (adminDetected) {
      setCurrentRoute('/admin-first-50');
      window.location.hash = '/admin-first-50';
      try { window.history.pushState({}, '', '/admin-first-50'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // LOG OUT HANDLER
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    setCurrentUser(null);
    setIsAdmin(false);
    handleNavigate('/');
    setShowSubscriberModal(true); // Re-open popup so they can test logging in again
  };

  return (
    <div className="min-h-screen bg-[#090B12] text-white flex flex-col selection:bg-blue-600/30 relative">
      {/* Sleek Futuristic Custom Desktop Cursor */}
      <CustomCursor />

      {/* Global Dynamic Particle Background (Subtle on FAQ/Admin, Pronounced on Home & Mystery) */}
      <InteractiveParticleField currentRoute={currentRoute} />

      {/* Initial Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Mandatory Sign-in for Latest Updates & First 50 Can Contest Popup */}
      <SubscriberModal
        isOpen={showSubscriberModal}
        onSuccess={handleSubscriberSuccess}
      />

      {/* Floating Navbar with prominent user status and LOG OUT button */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setShowSubscriberModal(true)}
      />

      {/* Distinct Page Route Renderer */}
      <main className="flex-grow">
        {currentRoute === '/' && <HomePage onNavigate={handleNavigate} />}
        {currentRoute === '/flavours' && <FlavoursPage />}
        {currentRoute === '/mystery' && <MysteryPage />}
        {currentRoute === '/faq' && <FaqPage />}
        {currentRoute === '/admin-first-50' && (isAdmin ? <AdminFirst50Page /> : <div className="min-h-[50vh] flex items-center justify-center text-white/70">Sign in with the authorised founder Google account to access this page.</div>)}
      </main>

      {/* Always-Visible Floating Multi-Page Switcher & 1-Click Logout Dock */}
      <MultiPageDock
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setShowSubscriberModal(true)}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    </div>
  );
}
