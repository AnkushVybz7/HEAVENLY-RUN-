import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FlavourId } from '../../types';
import { PRODUCTS } from '../../data/products';
import { createCanTexture, createDropletBumpMap } from './canTextureGenerator';
import { RotateCw, ZoomIn, ZoomOut, Eye, Layers, ChevronDown, ChevronUp, Sparkles, Check, Volume2 } from 'lucide-react';
import { audioSynth } from '../../utils/audio';

interface CanViewer3DProps {
  initialFlavour?: FlavourId;
  onFlavourChange?: (flavour: FlavourId) => void;
  className?: string;
}

export const CanViewer3D: React.FC<CanViewer3DProps> = ({
  initialFlavour = 'devil-rush',
  onFlavourChange,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentFlavour, setCurrentFlavour] = useState<FlavourId>(initialFlavour);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [controlsCollapsed, setControlsCollapsed] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // References to keep mutable 3D state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const canGroupRef = useRef<THREE.Group | null>(null);
  const canBodyMeshRef = useRef<THREE.Mesh | null>(null);
  const lidGroupRef = useRef<THREE.Group | null>(null);
  const tabGroupRef = useRef<THREE.Group | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const texturesRef = useRef<{ [key in FlavourId]?: THREE.CanvasTexture }>({});
  const bumpMapRef = useRef<THREE.CanvasTexture | null>(null);

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.1, y: 0 });
  const targetZoomRef = useRef<number>(5.2);
  const targetExplodeRef = useRef<number>(0);

  // Synchronize initialFlavour prop
  useEffect(() => {
    if (initialFlavour !== currentFlavour) {
      setCurrentFlavour(initialFlavour);
    }
  }, [initialFlavour]);

  // Handle flavour change
  const handleSelectFlavour = useCallback((flavour: FlavourId) => {
    setCurrentFlavour(flavour);
    audioSynth.playCanFizz(); // Responsive carbonated fizz cue
    if (onFlavourChange) {
      onFlavourChange(flavour);
    }

    if (canBodyMeshRef.current && texturesRef.current[flavour]) {
      const mat = canBodyMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.map = texturesRef.current[flavour]!;
      mat.needsUpdate = true;
    }

    // Adjust lighting accents to match flavour theme
    if (keyLightRef.current && rimLightRef.current) {
      if (flavour === 'devil-rush') {
        keyLightRef.current.color.setHex(0xFFE4E6);
        rimLightRef.current.color.setHex(0xB51227); // Devil Crimson
      } else {
        keyLightRef.current.color.setHex(0xF0F9FF);
        rimLightRef.current.color.setHex(0x176BFF); // Electric Blue
      }
    }
  }, [onFlavourChange]);

  // Main Three.js Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per guidelines
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 5.2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0x90b8f0, 1.2);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xb51227, 2.5, 10);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Procedural Bump Map & Textures
    const bumpMap = createDropletBumpMap();
    bumpMapRef.current = bumpMap;

    const devilTexture = createCanTexture('devil-rush');
    const heavenlyTexture = createCanTexture('heavenly-rush');
    texturesRef.current['devil-rush'] = devilTexture;
    texturesRef.current['heavenly-rush'] = heavenlyTexture;

    // Set anisotropy
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    devilTexture.anisotropy = maxAniso;
    heavenlyTexture.anisotropy = maxAniso;
    bumpMap.anisotropy = maxAniso;

    // --- COMPOSITE PROCEDURAL ALUMINIUM CAN MODEL (7 Parts) ---
    const canRoot = new THREE.Group();
    // Pivot at bottom-center flush with ground
    canRoot.position.set(0, -0.2, 0);
    scene.add(canRoot);
    canGroupRef.current = canRoot;

    // Dimensions for 300 ml sleek aluminium can
    const bodyRadius = 0.68;
    const bodyHeight = 2.05;
    const neckTopRadius = 0.58;
    const neckHeight = 0.22;
    const baseTaperHeight = 0.16;

    // 1. Can Body Cylinder (Printed Aluminum with Label & Droplets)
    const bodyGeometry = new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 48, 1, true);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      map: texturesRef.current[currentFlavour],
      metalness: 0.85,
      roughness: 0.26,
      bumpMap: bumpMap,
      bumpScale: 0.02,
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = bodyHeight / 2 + baseTaperHeight;
    bodyMesh.castShadow = !isSoftwareGl;
    bodyMesh.receiveShadow = !isSoftwareGl;
    canRoot.add(bodyMesh);
    canBodyMeshRef.current = bodyMesh;

    // Chrome Metal Material for unprinted rims and tab
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8dde4,
      metalness: 0.98,
      roughness: 0.12,
    });

    const brushedAlumMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8cdd5,
      metalness: 0.92,
      roughness: 0.28,
    });

    // 2. Neck Taper (transition from body radius 0.68 down to 0.58)
    const neckGeometry = new THREE.CylinderGeometry(neckTopRadius, bodyRadius, neckHeight, 48, 1, true);
    const neckMesh = new THREE.Mesh(neckGeometry, brushedAlumMaterial);
    neckMesh.position.y = baseTaperHeight + bodyHeight + neckHeight / 2;
    canRoot.add(neckMesh);

    // 3. Bottom Taper & Rim
    const bottomTaperGeometry = new THREE.CylinderGeometry(bodyRadius, bodyRadius * 0.88, baseTaperHeight, 48, 1, true);
    const bottomTaperMesh = new THREE.Mesh(bottomTaperGeometry, brushedAlumMaterial);
    bottomTaperMesh.position.y = baseTaperHeight / 2;
    canRoot.add(bottomTaperMesh);

    // 4. Concave Bottom Dome
    const baseDomeGeometry = new THREE.SphereGeometry(bodyRadius * 0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const baseDomeMesh = new THREE.Mesh(baseDomeGeometry, brushedAlumMaterial);
    baseDomeMesh.rotation.x = Math.PI;
    baseDomeMesh.position.y = 0.12;
    canRoot.add(baseDomeMesh);

    // --- SEPARABLE LID & TAB ASSEMBLY (for Exploded/Inspection view) ---
    const lidGroup = new THREE.Group();
    lidGroup.position.y = baseTaperHeight + bodyHeight + neckHeight;
    canRoot.add(lidGroup);
    lidGroupRef.current = lidGroup;

    // 5. Top Chime (Thick polished crimped aluminium rim)
    const chimeGeometry = new THREE.TorusGeometry(neckTopRadius, 0.038, 16, 48);
    const chimeMesh = new THREE.Mesh(chimeGeometry, chromeMaterial);
    chimeMesh.rotation.x = Math.PI / 2;
    lidGroup.add(chimeMesh);

    // 6. Recessed Lid Face with Score Line Indentation
    const lidFaceGeometry = new THREE.CylinderGeometry(neckTopRadius - 0.015, neckTopRadius - 0.015, 0.03, 48);
    const lidFaceMesh = new THREE.Mesh(lidFaceGeometry, brushedAlumMaterial);
    lidFaceMesh.position.y = -0.015;
    lidGroup.add(lidFaceMesh);

    // 7. Stay-on Pull Tab with Rivet
    const tabGroup = new THREE.Group();
    tabGroup.position.set(0, 0.015, 0.1);
    lidGroup.add(tabGroup);
    tabGroupRef.current = tabGroup;

    // Central Rivet pin
    const rivetGeometry = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16);
    const rivetMesh = new THREE.Mesh(rivetGeometry, chromeMaterial);
    tabGroup.add(rivetMesh);

    // Tab body lever
    const tabShape = new THREE.BoxGeometry(0.24, 0.016, 0.42);
    const tabMesh = new THREE.Mesh(tabShape, chromeMaterial);
    tabMesh.position.set(0, 0.008, -0.09);
    tabGroup.add(tabMesh);

    // Tab finger hole ring
    const tabHoleRingGeometry = new THREE.TorusGeometry(0.065, 0.02, 12, 24);
    const tabHoleRing = new THREE.Mesh(tabHoleRingGeometry, chromeMaterial);
    tabHoleRing.rotation.x = Math.PI / 2;
    tabHoleRing.position.set(0, 0.012, -0.2);
    tabGroup.add(tabHoleRing);

    // Grounding Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    sGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.35)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.6,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.21;
    scene.add(shadowMesh);

    // Initial angle setup
    targetRotationRef.current.y = Math.PI * 0.98; // Show the front HR emblem nicely

    // --- Pointer & Touch Interaction Handlers ---
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x = Math.max(
        -0.4,
        Math.min(0.5, targetRotationRef.current.x + deltaY * 0.006)
      );

      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZoomRef.current = Math.max(3.0, Math.min(7.5, targetZoomRef.current + e.deltaY * 0.0035));
      setZoomLevel(Number((7.5 - targetZoomRef.current) / 4.5 + 0.5));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    domElement.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Window Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop with Exponential Damping
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = clock.getDelta();

      if (canRoot) {
        // Auto-rotation when enabled and user is not manually dragging
        if (isAutoRotating && !isDraggingRef.current) {
          targetRotationRef.current.y += delta * 0.45;
        }

        // Smooth exponential damping
        const smoothFactor = 1 - Math.exp(-12 * delta);
        canRoot.rotation.y += (targetRotationRef.current.y - canRoot.rotation.y) * smoothFactor;
        canRoot.rotation.x += (targetRotationRef.current.x - canRoot.rotation.x) * smoothFactor;

        // Subtle floating breathing effect
        canRoot.position.y = -0.2 + Math.sin(clock.getElapsedTime() * 1.5) * 0.04;
      }

      if (camera) {
        const zoomSmooth = 1 - Math.exp(-10 * delta);
        camera.position.z += (targetZoomRef.current - camera.position.z) * zoomSmooth;
      }

      // Exploded / Inspection view transition
      if (lidGroupRef.current && tabGroupRef.current) {
        const explodeFactor = 1 - Math.exp(-8 * delta);
        const currentExplodeY = lidGroupRef.current.position.y;
        const targetLidY = baseTaperHeight + bodyHeight + neckHeight + targetExplodeRef.current * 0.6;
        lidGroupRef.current.position.y += (targetLidY - currentExplodeY) * explodeFactor;

        const currentTabY = tabGroupRef.current.position.y;
        const targetTabY = 0.015 + targetExplodeRef.current * 0.3;
        tabGroupRef.current.position.y += (targetTabY - currentTabY) * explodeFactor;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    tick();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      domElement.removeEventListener('wheel', handleWheel);

      renderer.dispose();
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      neckGeometry.dispose();
      bottomTaperGeometry.dispose();
      baseDomeGeometry.dispose();
      chimeGeometry.dispose();
      lidFaceGeometry.dispose();
      rivetGeometry.dispose();
      tabShape.dispose();
      tabHoleRingGeometry.dispose();
      chromeMaterial.dispose();
      brushedAlumMaterial.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      bumpMap.dispose();
      devilTexture.dispose();
      heavenlyTexture.dispose();
    };
  }, []);

  // Sync zoom control
  const handleZoomIn = () => {
    targetZoomRef.current = Math.max(3.0, targetZoomRef.current - 0.7);
  };

  const handleZoomOut = () => {
    targetZoomRef.current = Math.min(7.5, targetZoomRef.current + 0.7);
  };

  const handleResetAngle = () => {
    audioSynth.playCanMetallicChime();
    targetRotationRef.current = { x: 0.1, y: Math.PI * 0.98 };
    targetZoomRef.current = 5.2;
  };

  const toggleExploded = () => {
    audioSynth.playCanMetallicChime();
    const next = !isExploded;
    setIsExploded(next);
    targetExplodeRef.current = next ? 1 : 0;
  };

  const activeProduct = PRODUCTS[currentFlavour];

  return (
    <div
      className={`relative w-full h-[540px] md:h-[620px] rounded-2xl overflow-hidden select-none bg-gradient-to-b from-[#090B12]/80 via-[#0d111a]/90 to-[#090B12] border border-white/10 shadow-2xl flex flex-col items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Scene Viewport */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing w-full h-full" />

      {/* Top Left Minimal Spec Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: activeProduct.primaryColor }}
          />
          <span className="font-display font-bold text-xs uppercase tracking-widest text-white/90">
            {activeProduct.name}
          </span>
          <span className="text-[10px] uppercase font-tech px-1.5 py-0.5 rounded bg-white/10 text-white/70">
            300 ML
          </span>
        </div>
        <div className="text-[11px] font-tech text-white/50 tracking-wider">
          {activeProduct.category} • {activeProduct.slogan}
        </div>
      </div>

      {/* Top Right Quick Hint */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 text-[11px] font-tech text-white/40 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>Drag to rotate • Scroll to zoom</span>
      </div>

      {/* 
        UNIFIED SLEEK COLLAPSIBLE BOTTOM DOCK 
        (Strict Three.js Skill Compliance: Zero viewport occlusion, <= 15% footprint, no backdrop-filter over WebGL, zero pulsating dots)
      */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 max-w-[94vw] w-auto ${
          controlsCollapsed ? 'translate-y-14' : 'translate-y-0'
        }`}
      >
        {/* Toggle Collapse Button */}
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => setControlsCollapsed(!controlsCollapsed)}
            className="px-3 py-1 rounded-t-lg bg-[#141926] border-t border-x border-white/15 text-[11px] font-tech text-white/70 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title={controlsCollapsed ? 'Expand 3D Controls' : 'Collapse 3D Controls'}
          >
            {controlsCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
                <span>Show 3D Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-white/50" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        {/* Control Bar Surface */}
        <div className="bg-[#0f1422] border border-white/15 rounded-xl px-3 py-2 shadow-2xl flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {/* Flavour Switcher Pills */}
          <div className="flex items-center bg-black/60 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => handleSelectFlavour('devil-rush')}
              className={`px-3 py-1.5 rounded-md text-xs font-tech font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentFlavour === 'devil-rush'
                  ? 'bg-[#B51227] text-white shadow-lg shadow-[#B51227]/40'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>DEVIL RUSH</span>
            </button>
            <button
              onClick={() => handleSelectFlavour('heavenly-rush')}
              className={`px-3 py-1.5 rounded-md text-xs font-tech font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentFlavour === 'heavenly-rush'
                  ? 'bg-[#176BFF] text-white shadow-lg shadow-[#176BFF]/40'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-300" />
              <span>HEAVENLY RUSH</span>
            </button>
          </div>

          <div className="w-[1px] h-6 bg-white/15 hidden sm:block" />

          {/* Action buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Auto-Rotate Toggle */}
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`p-2 rounded-lg border text-xs font-tech flex items-center gap-1.5 transition-all cursor-pointer ${
                isAutoRotating
                  ? 'bg-white/15 border-white/30 text-white'
                  : 'bg-black/40 border-white/10 text-white/50 hover:text-white'
              }`}
              title="Toggle Auto-Rotate"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'text-blue-400' : ''}`} />
              <span className="hidden md:inline">{isAutoRotating ? 'Auto On' : 'Auto Off'}</span>
            </button>

            {/* Reset Angle */}
            <button
              onClick={handleResetAngle}
              className="p-2 rounded-lg bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer text-xs font-tech flex items-center gap-1"
              title="Reset View Angle"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Front</span>
            </button>

            {/* Exploded / Inspection Mode */}
            <button
              onClick={toggleExploded}
              className={`p-2 rounded-lg border text-xs font-tech flex items-center gap-1.5 transition-all cursor-pointer ${
                isExploded
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-black/40 border-white/10 text-white/50 hover:text-white'
              }`}
              title="Inspect Can Lid Craftsmanship"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isExploded ? 'Assembled' : 'Inspect Lid'}</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-0.5">
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
