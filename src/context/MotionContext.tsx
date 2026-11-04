import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'console';

export interface DisplayInfo {
  width: number;
  height: number;
  dpr: number;
  isTouch: boolean;
  isLandscape: boolean;
}

export interface MotionContextType {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  toggleReducedMotion: () => void;
  deviceType: DeviceType;
  displayInfo: DisplayInfo;
}

const MotionContext = createContext<MotionContextType | undefined>(undefined);

const STORAGE_KEY = 'heavenly_run_reduced_motion';

// Automatic silent device detection without prompting the user
export function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent || '';
  const isConsoleOrTV =
    /PlayStation|Xbox|Nintendo|TV|SmartTV|CrKey|Tizen|Web0S|Viera|AppleTV|BRAVIA/i.test(ua) ||
    (window.innerWidth >= 1200 &&
      window.matchMedia &&
      window.matchMedia('(hover: none) and (pointer: coarse)').matches &&
      !/Android|iPhone|iPad/i.test(ua));

  if (isConsoleOrTV) return 'console';

  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Reduced motion state (persisted in localStorage, fallback to system preference)
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });

  // 2. Responsive display metrics and silent device classification
  const [deviceType, setDeviceType] = useState<DeviceType>(() => detectDeviceType());
  const [displayInfo, setDisplayInfo] = useState<DisplayInfo>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
    dpr: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    isTouch:
      typeof window !== 'undefined'
        ? 'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0
        : false,
    isLandscape:
      typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : true,
  }));

  // Synchronize system media query changes if no user override in localStorage
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(STORAGE_KEY) === null) {
          setReducedMotionState(e.matches);
        }
      } catch {}
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Update DOM attributes whenever reducedMotion or deviceType changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
    root.setAttribute('data-device', deviceType);

    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [reducedMotion, deviceType]);

  // Window resize observer to update deviceType and display metrics smoothly
  useEffect(() => {
    let timeoutId: number;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const nextDevice = detectDeviceType();
        setDeviceType(nextDevice);
        setDisplayInfo({
          width: window.innerWidth,
          height: window.innerHeight,
          dpr: Math.min(window.devicePixelRatio || 1, 2.5),
          isTouch: 'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0,
          isLandscape: window.innerWidth > window.innerHeight,
        });
      }, 80);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const setReducedMotion = (value: boolean) => {
    setReducedMotionState(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {}
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  const value = useMemo(
    () => ({
      reducedMotion,
      setReducedMotion,
      toggleReducedMotion,
      deviceType,
      displayInfo,
    }),
    [reducedMotion, deviceType, displayInfo]
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
};

export const useMotionPreference = (): MotionContextType => {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error('useMotionPreference must be used within a MotionProvider');
  }
  return context;
};
