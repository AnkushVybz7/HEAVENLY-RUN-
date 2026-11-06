import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PageRoute } from '../../types';

interface InteractiveParticleFieldProps {
  currentRoute?: PageRoute;
  className?: string;
}

export const InteractiveParticleField: React.FC<InteractiveParticleFieldProps> = ({
  currentRoute = '/',
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<PageRoute>(currentRoute);

  // Keep route ref updated for the render loop
  useEffect(() => {
    routeRef.current = currentRoute;
  }, [currentRoute]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Allocate max particles buffer, dynamically activate subsets based on route
    const maxParticles = prefersReducedMotion ? 60 : isMobile ? 180 : 420;

    let width = window.innerWidth;
    let height = window.innerHeight;

    let renderer: THREE.WebGLRenderer | null = null;
    let handleContextLost: ((e: Event) => void) | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        powerPreference: 'default',
        antialias: false,
        failIfMajorPerformanceCaveat: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      handleContextLost = (e: Event) => {
        e.preventDefault();
      };
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    } catch {
      renderer = null;
    }

    if (!renderer) {
      const canvas2d = document.createElement('canvas');
      canvas2d.width = width;
      canvas2d.height = height;
      canvas2d.style.width = '100%';
      canvas2d.style.height = '100%';
      canvas2d.style.display = 'block';
      container.innerHTML = '';
      container.appendChild(canvas2d);
      const ctx = canvas2d.getContext('2d');
      if (!ctx) return;

      const pCount = isMobile ? 40 : 80;
      const particles2d = Array.from({ length: pCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        color: ['#176BFF', '#A8D8FF', '#C7CDD5', '#8060B9', '#FFFFFF'][Math.floor(Math.random() * 5)],
      }));

      let frame2d = 0;
      const render2d = () => {
        ctx.clearRect(0, 0, width, height);
        particles2d.forEach((p) => {
          if (!prefersReducedMotion) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        });
        frame2d = requestAnimationFrame(render2d);
      };
      render2d();

      const handleResize2d = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas2d.width = width;
        canvas2d.height = height;
      };
      window.addEventListener('resize', handleResize2d);

      return () => {
        cancelAnimationFrame(frame2d);
        window.removeEventListener('resize', handleResize2d);
      };
    }

    const activeRenderer = renderer;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 15;

    // Particle Geometry & Buffers
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const basePositions = new Float32Array(maxParticles * 3);
    const velocities = new Float32Array(maxParticles * 3);
    const targetColors = new Float32Array(maxParticles * 3);
    const currentColors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    const opacities = new Float32Array(maxParticles);

    // Palette Palettes per Theme
    const celestialPalette = [
      new THREE.Color('#176BFF'), // Electric Blue
      new THREE.Color('#C7CDD5'), // Chrome Silver
      new THREE.Color('#A8D8FF'), // Heavenly Blue
      new THREE.Color('#8060B9'), // Cosmic Violet
      new THREE.Color('#FFFFFF'), // Pure Star White
    ];

    const mysteryPalette = [
      new THREE.Color('#8060B9'), // Cosmic Violet
      new THREE.Color('#B51227'), // Devil Crimson
      new THREE.Color('#9A3412'), // Ember Amber
      new THREE.Color('#E056FD'), // Neon Purple
      new THREE.Color('#176BFF'), // Electric Blue
    ];

    const flavoursPalette = [
      new THREE.Color('#B51227'), // Devil Crimson
      new THREE.Color('#FF4D61'), // Flame Rose
      new THREE.Color('#A8D8FF'), // Heavenly Blue
      new THREE.Color('#F5F7FC'), // Cloud White
      new THREE.Color('#176BFF'), // Electric Blue
    ];

    const subtlePalette = [
      new THREE.Color('#C7CDD5'), // Silver
      new THREE.Color('#A8D8FF'), // Soft Blue
      new THREE.Color('#8060B9'), // Muted Violet
    ];

    for (let i = 0; i < maxParticles; i++) {
      const x = (Math.random() - 0.5) * 36;
      const y = (Math.random() - 0.5) * 24;
      const z = (Math.random() - 0.5) * 14;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = Math.random() * 0.02 + 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      const col = celestialPalette[Math.floor(Math.random() * celestialPalette.length)];
      currentColors[i * 3] = col.r;
      currentColors[i * 3 + 1] = col.g;
      currentColors[i * 3 + 2] = col.b;

      targetColors[i * 3] = col.r;
      targetColors[i * 3 + 1] = col.g;
      targetColors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 3.5 + 1.2;
      opacities[i] = Math.random() * 0.5 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(currentColors, 3));

    // Radial Glow Texture
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 64;
    particleCanvas.height = 64;
    const pCtx = particleCanvas.getContext('2d')!;
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.25, 'rgba(168, 216, 255, 0.85)');
    pGrad.addColorStop(0.65, 'rgba(23, 107, 255, 0.3)');
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);

    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.35 : 0.48,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // Mouse tracking for cursor interaction
    const mousePos = { x: -9999, y: -9999 };
    const targetMousePos = { x: -9999, y: -9999 };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      targetMousePos.x = (clientX / window.innerWidth) * 32 - 16;
      targetMousePos.y = -(clientY / window.innerHeight) * 22 + 11;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Scroll tracking
    let scrollProgress = 0;
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Window resize
    const handleResize = () => {
      if (!renderer || !camera) return;
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop with pause on tab hide
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Current Route Theme Configuration
      const route = routeRef.current;
      const isHome = route === '/';
      const isMystery = route === '/mystery';
      const isFlavours = route === '/flavours';

      // Active particle count based on page theme:
      // Pronounced on Home & Mystery, balanced on Flavours, subtle on FAQ & Admin
      let activeCount = maxParticles;
      let targetOpacity = 0.85;
      let targetSize = isMobile ? 0.36 : 0.48;
      let speedFactor = 1.0;
      let interactionRadius = 4.2;
      let activePalette = celestialPalette;

      if (isHome) {
        activeCount = maxParticles; // Full pronounced celestial
        targetOpacity = 0.9;
        speedFactor = 1.2;
        interactionRadius = 4.5;
        activePalette = celestialPalette;
      } else if (isMystery) {
        activeCount = maxParticles; // Full pronounced mystery
        targetOpacity = 0.95;
        speedFactor = 1.35;
        interactionRadius = 5.0;
        activePalette = mysteryPalette;
      } else if (isFlavours) {
        activeCount = Math.floor(maxParticles * 0.55); // Moderate effervescent
        targetOpacity = 0.65;
        speedFactor = 0.85;
        interactionRadius = 3.5;
        activePalette = flavoursPalette;
      } else {
        // FAQ & Admin: subtle, quiet ambient dust
        activeCount = Math.floor(maxParticles * 0.28);
        targetOpacity = 0.35;
        speedFactor = 0.45;
        interactionRadius = 2.5;
        activePalette = subtlePalette;
      }

      // Smooth opacity transition
      material.opacity += (targetOpacity - material.opacity) * (1 - Math.exp(-4 * delta));
      material.size += (targetSize - material.size) * (1 - Math.exp(-4 * delta));

      // Mouse damping
      mousePos.x += (targetMousePos.x - mousePos.x) * (1 - Math.exp(-9 * delta));
      mousePos.y += (targetMousePos.y - mousePos.y) * (1 - Math.exp(-9 * delta));

      const posArray = geometry.attributes.position.array as Float32Array;
      const colArray = geometry.attributes.color.array as Float32Array;

      const scrollSpeedMultiplier = 1 + scrollProgress * (isHome || isMystery ? 2.0 : 0.8);

      for (let i = 0; i < maxParticles; i++) {
        const i3 = i * 3;

        // If index exceeds activeCount for this route, park it offscreen gently
        if (i >= activeCount) {
          posArray[i3 + 2] = -999;
          continue;
        }

        let px = posArray[i3];
        let py = posArray[i3 + 1];
        let pz = basePositions[i3 + 2]; // restore z

        if (!prefersReducedMotion) {
          // Ambient vertical & horizontal drift
          py += velocities[i3 + 1] * scrollSpeedMultiplier * speedFactor;
          px += Math.sin(elapsed * 0.8 + i) * 0.007 * speedFactor;

          // Wrap boundaries
          if (py > 12.5) {
            py = -12.5;
            px = (Math.random() - 0.5) * 36;
          }

          // Cursor repulsion + vortex swirl
          const dx = px - mousePos.x;
          const dy = py - mousePos.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < interactionRadius * interactionRadius && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (interactionRadius - dist) / interactionRadius;
            const pushX = (dx / dist) * force * 0.45;
            const pushY = (dy / dist) * force * 0.45;
            const swirlX = -(dy / dist) * force * (isMystery ? 0.35 : 0.22);
            const swirlY = (dx / dist) * force * (isMystery ? 0.35 : 0.22);

            px += pushX + swirlX;
            py += pushY + swirlY;
          }
        }

        // Color blending towards target palette
        const targetColor = activePalette[i % activePalette.length];
        colArray[i3] += (targetColor.r - colArray[i3]) * (1 - Math.exp(-3 * delta));
        colArray[i3 + 1] += (targetColor.g - colArray[i3 + 1]) * (1 - Math.exp(-3 * delta));
        colArray[i3 + 2] += (targetColor.b - colArray[i3 + 2]) * (1 - Math.exp(-3 * delta));

        posArray[i3] = px;
        posArray[i3 + 1] = py;
        posArray[i3 + 2] = pz;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;

      // Gentle rotation responding to scroll
      pointCloud.rotation.z = scrollProgress * (isMystery ? 0.6 : 0.35);

      activeRenderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    tick();

    // Pause rendering when tab is hidden to conserve energy
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        clock.start();
        frameId = requestAnimationFrame(tick);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (handleContextLost) {
        activeRenderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      }
      activeRenderer.dispose();
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
