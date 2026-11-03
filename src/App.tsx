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
import { testConnection, logoutUser } from './services/firebase';
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

  // Check existing session / credentials
  useEffect(() => {
    testConnection();
    try {
      const stored = localStorage.getItem('heavenly_run_user_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name && parsed.email) {
          setCurrentUser({ name: parsed.name, email: parsed.email });
          const adminCheck =
            parsed.isAdmin === true ||
            (parsed.email.toLowerCase() === 'ankushbanerjeecool777@gmail.com' && parsed.isAdmin);
          setIsAdmin(adminCheck);
          setShowSubscriberModal(false);
          return;
        }
      }
      // If no valid session, show popup every time someone opens the page until they enter their name and email
      setShowSubscriberModal(true);
    } catch {
      setShowSubscriberModal(true);
    }
  }, []);

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

    // If user is Ankush Banerjee, automatically unlock and route to the 5th page!
    if (adminDetected) {
      handleNavigate('/admin-first-50');
    }
  };

  // LOG OUT HANDLER
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    localStorage.removeItem('heavenly_run_user_auth');
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
        {currentRoute === '/admin-first-50' && <AdminFirst50Page />}
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
