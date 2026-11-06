import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CelestialHeroCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per guidelines
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: width >= 768,
        alpha: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      });
    } catch {
      return;
    }

    const isSoftwareGl = (() => {
      try {
        const gl = renderer.getContext();
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090b12, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Subtle Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2640, 1.2);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x176bff, 3.5, 30);
    blueLight.position.set(-8, 5, 5);
    scene.add(blueLight);

    const crimsonLight = new THREE.PointLight(0xb51227, 2.5, 30);
    crimsonLight.position.set(8, -5, 5);
    scene.add(crimsonLight);

    // 1. Instanced Floating Stars & Cosmic Dust (InstancedMesh)
    const starCount = isSoftwareGl ? 350 : 800;
    const starGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const starMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const starMesh = new THREE.InstancedMesh(starGeometry, starMaterial, starCount);

    const dummy = new THREE.Object3D();
    const starSpeeds: number[] = [];

    for (let i = 0; i < starCount; i++) {
      const radius = 6 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      dummy.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi) - 4
      );

      const scale = Math.random() * 1.8 + 0.4;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      starMesh.setMatrixAt(i, dummy.matrix);

      // Random tint (icy blue, white, cosmic violet)
      const colorRoll = Math.random();
      if (colorRoll > 0.6) {
        starMesh.setColorAt(i, new THREE.Color(0xa8d8ff));
      } else if (colorRoll > 0.3) {
        starMesh.setColorAt(i, new THREE.Color(0xf5f7fc));
      } else {
        starMesh.setColorAt(i, new THREE.Color(0x8060b9));
      }

      starSpeeds.push(Math.random() * 0.4 + 0.1);
    }

    starMesh.instanceMatrix.needsUpdate = true;
    if (starMesh.instanceColor) starMesh.instanceColor.needsUpdate = true;
    starMesh.computeBoundingSphere();
    scene.add(starMesh);

    // 2. Chrome Celestial Orbital Rings & Gyroscopic Core
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);
    ringsGroup.position.set(0, 0, -2);

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xc7cdd5,
      metalness: 0.95,
      roughness: 0.18,
    });

    const glowBlueMat = new THREE.MeshBasicMaterial({
      color: 0x176bff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    // Outer orbital ring
    const ring1Geo = new THREE.TorusGeometry(7.2, 0.05, 16, 100);
    const ring1 = new THREE.Mesh(ring1Geo, chromeMat);
    ringsGroup.add(ring1);

    // Middle tilted orbital ring
    const ring2Geo = new THREE.TorusGeometry(5.8, 0.04, 16, 90);
    const ring2 = new THREE.Mesh(ring2Geo, glowBlueMat);
    ring2.rotation.x = Math.PI / 3;
    ringsGroup.add(ring2);

    // Inner elliptical ring
    const ring3Geo = new THREE.TorusGeometry(4.2, 0.035, 16, 80);
    const ring3 = new THREE.Mesh(ring3Geo, chromeMat);
    ring3.rotation.y = Math.PI / 4;
    ringsGroup.add(ring3);

    // 3. Procedural Nebula Clouds (Canvas particle sprites)
    const nebulaCanvas = document.createElement('canvas');
    nebulaCanvas.width = 128;
    nebulaCanvas.height = 128;
    const nCtx = nebulaCanvas.getContext('2d')!;
    const nGrad = nCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    nGrad.addColorStop(0, 'rgba(23, 107, 255, 0.35)');
    nGrad.addColorStop(0.4, 'rgba(128, 96, 185, 0.2)');
    nGrad.addColorStop(1, 'rgba(9, 11, 18, 0)');
    nCtx.fillStyle = nGrad;
    nCtx.fillRect(0, 0, 128, 128);

    const nebulaTex = new THREE.CanvasTexture(nebulaCanvas);
    const nebulaMat = new THREE.SpriteMaterial({
      map: nebulaTex,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const nebulaSprites: THREE.Sprite[] = [];
    const nebulaPositions = [
      [-6, 3, -5],
      [7, -3, -6],
      [-2, -5, -4],
      [4, 4, -7],
      [0, 1, -8],
    ];

    nebulaPositions.forEach(([x, y, z]) => {
      const sprite = new THREE.Sprite(nebulaMat);
      sprite.position.set(x, y, z);
      sprite.scale.set(14, 14, 1);
      scene.add(sprite);
      nebulaSprites.push(sprite);
    });

    // Mouse parallax tracking
    const mousePos = { x: 0, y: 0 };
    const targetMousePos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      targetMousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Render Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera mouse parallax
      const smoothFactor = 1 - Math.exp(-4 * delta);
      mousePos.x += (targetMousePos.x - mousePos.x) * smoothFactor;
      mousePos.y += (targetMousePos.y - mousePos.y) * smoothFactor;

      camera.position.x = mousePos.x * 1.5;
      camera.position.y = mousePos.y * 1.2;
      camera.lookAt(0, 0, 0);

      // Rotate orbital rings
      ring1.rotation.z = elapsed * 0.08;
      ring1.rotation.x = elapsed * 0.04;
      ring2.rotation.y = elapsed * 0.12;
      ring2.rotation.z = -elapsed * 0.06;
      ring3.rotation.x = elapsed * 0.09;
      ring3.rotation.y = elapsed * 0.1;

      // Gentle nebula breathing
      nebulaSprites.forEach((sprite, idx) => {
        const offset = idx * 1.2;
        sprite.position.y += Math.sin(elapsed * 0.5 + offset) * 0.003;
      });

      // Slowly rotate starfield
      starMesh.rotation.y = elapsed * 0.015;
      starMesh.rotation.x = elapsed * 0.008;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      ring3Geo.dispose();
      chromeMat.dispose();
      glowBlueMat.dispose();
      nebulaTex.dispose();
      nebulaMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none w-full h-full overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};
