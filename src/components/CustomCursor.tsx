import React, { useEffect, useState, useRef } from 'react';
import { useMotionPreference } from '../context/MotionContext';

type CursorVariant = 'default' | 'hover' | 'devil' | 'input' | 'canvas3d' | 'drag';

export const CustomCursor: React.FC = () => {
  const { reducedMotion, deviceType } = useMotionPreference();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [cursorText, setCursorText] = useState<string | null>(null);

  // Exact coordinates
  const mousePos = useRef({ x: -100, y: -100 });
  // Interpolated smooth follower coordinates
  const ringPos = useRef({ x: -100, y: -100 });

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable custom cursor if reduced motion is preferred or if on console/TV/mobile
    if (reducedMotion || deviceType === 'console' || deviceType === 'mobile') {
      setEnabled(false);
      document.documentElement.classList.remove('custom-cursor-active');
      return;
    }

    // Only activate on devices with fine pointer (mouse / trackpad) and hover capability
    const mediaQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    if (!mediaQuery.matches) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!visible) setVisible(true);

      // Instantly position the central precision reticle
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check hovered element to adapt cursor variant
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, input, textarea, select, [role="button"], .cursor-pointer, [data-cursor]'
      );

      if (interactive) {
        const tagName = interactive.tagName.toLowerCase();
        const customType = interactive.getAttribute('data-cursor');
        const isRed =
          interactive.classList.contains('text-red-300') ||
          interactive.classList.contains('text-red-400') ||
          interactive.classList.contains('bg-red-600') ||
          interactive.classList.contains('bg-red-950') ||
          interactive.textContent?.includes('DEVIL');

        if (customType === 'canvas3d' || target.closest('canvas')) {
          setVariant('canvas3d');
          setCursorText('360°');
        } else if (tagName === 'input' || tagName === 'textarea') {
          setVariant('input');
          setCursorText(null);
        } else if (isRed) {
          setVariant('devil');
          setCursorText(null);
        } else {
          setVariant('hover');
          setCursorText(null);
        }
      } else if (target.closest('canvas')) {
        setVariant('canvas3d');
        setCursorText('360°');
      } else {
        setVariant('default');
        setCursorText(null);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth physics loop for the orbital follower ring
    let animationFrameId = 0;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      // Lerp ring towards mouse with smooth celestial damping
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.18);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.18);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Inject cursor style rule to hide default cursor cleanly on desktop
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [visible]);

  if (!enabled) return null;

  // Determine styles according to variant
  const isHovered = variant === 'hover' || variant === 'devil' || variant === 'canvas3d';
  const isDevil = variant === 'devil';
  const isCanvas = variant === 'canvas3d';
  const isInput = variant === 'input';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* 1. Central High-Precision Reticle Dot (Zero-Lag) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full pointer-events-none will-change-transform z-20 transition-transform duration-75"
        style={{
          backgroundColor: isDevil ? '#FF3344' : isCanvas ? '#A8D8FF' : '#ffffff',
          boxShadow: isDevil
            ? '0 0 10px #FF1E38, 0 0 20px #B51227'
            : '0 0 10px #176BFF, 0 0 18px #A8D8FF',
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      />

      {/* 2. Cyber-Celestial Orbital Follower Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform z-10 flex items-center justify-center transition-all duration-200"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      >
        <div
          className={`relative rounded-full flex items-center justify-center transition-all duration-300 ${
            isClicking
              ? 'scale-75'
              : isHovered
              ? 'scale-125'
              : isInput
              ? 'scale-90'
              : 'scale-100'
          }`}
          style={{
            width: isHovered ? '48px' : isInput ? '28px' : '34px',
            height: isHovered ? '48px' : isInput ? '28px' : '34px',
            marginLeft: isHovered ? '-24px' : isInput ? '-14px' : '-17px',
            marginTop: isHovered ? '-24px' : isInput ? '-14px' : '-17px',
            border: isDevil
              ? '1.5px solid rgba(255, 60, 80, 0.85)'
              : isHovered
              ? '1.5px solid rgba(168, 216, 255, 0.95)'
              : '1.2px solid rgba(199, 205, 213, 0.45)',
            backgroundColor: isDevil
              ? 'rgba(181, 18, 39, 0.15)'
              : isHovered
              ? 'rgba(23, 107, 255, 0.16)'
              : 'rgba(9, 11, 18, 0.25)',
            backdropFilter: isHovered ? 'blur(2px)' : 'none',
            boxShadow: isDevil
              ? '0 0 18px rgba(181, 18, 39, 0.6), inset 0 0 10px rgba(255, 50, 70, 0.3)'
              : isHovered
              ? '0 0 20px rgba(23, 107, 255, 0.5), inset 0 0 10px rgba(168, 216, 255, 0.25)'
              : '0 0 8px rgba(168, 216, 255, 0.15)',
          }}
        >
          {/* Futuristic Corner Reticle Brackets */}
          <span
            className={`absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l transition-colors ${
              isDevil ? 'border-red-400' : 'border-blue-300'
            }`}
          />
          <span
            className={`absolute -top-1 -right-1 w-1.5 h-1.5 border-t border-r transition-colors ${
              isDevil ? 'border-red-400' : 'border-blue-300'
            }`}
          />
          <span
            className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b border-l transition-colors ${
              isDevil ? 'border-red-400' : 'border-blue-300'
            }`}
          />
          <span
            className={`absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r transition-colors ${
              isDevil ? 'border-red-400' : 'border-blue-300'
            }`}
          />

          {/* Micro Orbit Pulse Dot */}
          <div
            className={`absolute w-1 h-1 rounded-full ${
              isDevil ? 'bg-red-400' : 'bg-blue-300'
            } animate-spin`}
            style={{
              top: '2px',
              animationDuration: isHovered ? '1.8s' : '4s',
            }}
          />

          {/* Contextual Badge (e.g. 360° on Can Canvas) */}
          {cursorText && (
            <span
              className="text-[9px] font-tech font-bold tracking-tighter text-blue-200 uppercase select-none"
              style={{ textShadow: '0 0 6px rgba(23,107,255,0.8)' }}
            >
              {cursorText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
