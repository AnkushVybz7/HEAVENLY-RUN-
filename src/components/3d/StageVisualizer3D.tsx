import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StageVisualizer3DProps {
  isPlaying?: boolean;
}

export const StageVisualizer3D: React.FC<StageVisualizer3DProps> = ({ isPlaying = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 500;

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
    scene.fog = new THREE.FogExp2(0x090b12, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.5);

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 1. Stage Floor with metallic reflection grid
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x05070a,
      roughness: 0.18,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    scene.add(floor);

    // 2. Volumetric Spotlight Cones (Electric Blue & Devil Crimson)
    const coneGeo = new THREE.ConeGeometry(3.5, 9, 32, 1, true);

    const blueSpotMat = new THREE.MeshBasicMaterial({
      color: 0x176bff,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const blueSpot = new THREE.Mesh(coneGeo, blueSpotMat);
    blueSpot.position.set(-3.2, 3.2, -1.5);
    blueSpot.rotation.z = -0.35;
    scene.add(blueSpot);

    const redSpotMat = new THREE.MeshBasicMaterial({
      color: 0xb51227,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const redSpot = new THREE.Mesh(coneGeo, redSpotMat);
    redSpot.position.set(3.2, 3.2, -1.5);
    redSpot.rotation.z = 0.35;
    scene.add(redSpot);

    // Dynamic point lights for the stage
    const bluePoint = new THREE.PointLight(0x176bff, 3.0, 15);
    bluePoint.position.set(-2.5, 4.5, -1);
    scene.add(bluePoint);

    const redPoint = new THREE.PointLight(0xb51227, 3.0, 15);
    redPoint.position.set(2.5, 4.5, -1);
    scene.add(redPoint);

    const rimBacklight = new THREE.DirectionalLight(0xffffff, 3.0);
    rimBacklight.position.set(0, 3.5, -4);
    scene.add(rimBacklight);

    // 3. Stage Smoke & Sparks Particles
    const sparkCount = isSoftwareGl ? 80 : 250;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkSpeeds = new Float32Array(sparkCount);

    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = (Math.random() - 0.5) * 8;
      sparkPos[i * 3 + 1] = Math.random() * 4 - 1;
      sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sparkSpeeds[i] = Math.random() * 0.02 + 0.005;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));

    const sparkMat = new THREE.PointsMaterial({
      color: 0xa8d8ff,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkPoints);

    // 4. MYSTERIOUS GUITARIST SILHOUETTE (Pure pitch-black silhouette with dramatic rim light)
    // Strictly preserve anonymity: Face is totally unlit silhouette
    const guitaristGroup = new THREE.Group();
    scene.add(guitaristGroup);
    guitaristGroup.position.set(0, -1.2, 0);

    const silhouetteMat = new THREE.MeshStandardMaterial({
      color: 0x010204,
      roughness: 0.95,
      metalness: 0.05,
    });

    // Body Torso
    const torsoGeo = new THREE.CylinderGeometry(0.35, 0.28, 1.3, 16);
    const torso = new THREE.Mesh(torsoGeo, silhouetteMat);
    torso.position.set(0, 1.45, 0);
    guitaristGroup.add(torso);

    // Head / Hooded Silhouette (zero facial features visible)
    const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const head = new THREE.Mesh(headGeo, silhouetteMat);
    head.position.set(0, 2.3, 0);
    guitaristGroup.add(head);

    // Shoulders & Arms
    const lArmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.9, 12);
    const lArm = new THREE.Mesh(lArmGeo, silhouetteMat);
    lArm.position.set(-0.48, 1.5, 0.25);
    lArm.rotation.set(0.4, 0, 0.45);
    guitaristGroup.add(lArm);

    const rArmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.9, 12);
    const rArm = new THREE.Mesh(rArmGeo, silhouetteMat);
    rArm.position.set(0.48, 1.45, 0.2);
    rArm.rotation.set(0.3, 0, -0.6);
    guitaristGroup.add(rArm);

    // Legs
    const lLegGeo = new THREE.CylinderGeometry(0.12, 0.1, 1.2, 12);
    const lLeg = new THREE.Mesh(lLegGeo, silhouetteMat);
    lLeg.position.set(-0.25, 0.6, 0);
    guitaristGroup.add(lLeg);

    const rLegGeo = new THREE.CylinderGeometry(0.12, 0.1, 1.2, 12);
    const rLeg = new THREE.Mesh(rLegGeo, silhouetteMat);
    rLeg.position.set(0.25, 0.6, 0.1);
    rLeg.rotation.x = -0.1;
    guitaristGroup.add(rLeg);

    // Electric Guitar (Sleek Angular Cyber Guitar Body)
    const guitarGroup = new THREE.Group();
    guitarGroup.position.set(0.05, 1.35, 0.4);
    guitarGroup.rotation.set(0.2, -0.15, -0.55);
    guitaristGroup.add(guitarGroup);

    // Guitar Body
    const gBodyGeo = new THREE.BoxGeometry(0.45, 0.85, 0.08);
    const gBodyMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      metalness: 0.9,
      roughness: 0.2,
    });
    const gBody = new THREE.Mesh(gBodyGeo, gBodyMat);
    guitarGroup.add(gBody);

    // Guitar Neck
    const gNeckGeo = new THREE.BoxGeometry(0.1, 1.3, 0.04);
    const gNeck = new THREE.Mesh(gNeckGeo, gBodyMat);
    gNeck.position.set(0, 0.95, 0);
    guitarGroup.add(gNeck);

    // Headstock
    const gHeadGeo = new THREE.BoxGeometry(0.14, 0.25, 0.04);
    const gHead = new THREE.Mesh(gHeadGeo, gBodyMat);
    gHead.position.set(0, 1.68, 0);
    guitarGroup.add(gHead);

    // Glowing Neon Pickups / Strings (Electric vibe)
    const pickupMat = new THREE.MeshBasicMaterial({
      color: 0x176bff,
      wireframe: false,
    });
    const pickup1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.02), pickupMat);
    pickup1.position.set(0, 0.1, 0.045);
    guitarGroup.add(pickup1);

    const pickup2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.02), pickupMat);
    pickup2.position.set(0, -0.15, 0.045);
    guitarGroup.add(pickup2);

    // Mouse responsiveness
    const targetCamX = { val: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetCamX.val = normX * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Camera parallax
      camera.position.x += (targetCamX.val - camera.position.x) * (1 - Math.exp(-6 * delta));
      camera.lookAt(0, 0.8, 0);

      // Spotlights subtle sway
      blueSpot.rotation.z = -0.35 + Math.sin(elapsed * 0.8) * 0.08;
      redSpot.rotation.z = 0.35 + Math.cos(elapsed * 0.9) * 0.08;

      // Guitarist breathing or rhythmic sway when playing
      const swaySpeed = isPlayingRef.current ? 3.5 : 1.2;
      const swayAmp = isPlayingRef.current ? 0.03 : 0.01;
      guitaristGroup.position.y = -1.2 + Math.sin(elapsed * swaySpeed) * swayAmp;
      guitarGroup.rotation.z = -0.55 + Math.sin(elapsed * swaySpeed * 1.5) * (isPlayingRef.current ? 0.04 : 0.01);

      // Audio intensity pulse on pickups
      if (isPlayingRef.current) {
        pickupMat.color.setHex(Math.sin(elapsed * 10) > 0 ? 0xff3b52 : 0x176bff);
      } else {
        pickupMat.color.setHex(0x176bff);
      }

      // Spark particles drift upwards
      const positions = sparkGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkCount; i++) {
        positions[i * 3 + 1] += sparkSpeeds[i] * (isPlayingRef.current ? 2.5 : 1);
        if (positions[i * 3 + 1] > 3.5) {
          positions[i * 3 + 1] = -1.1;
          positions[i * 3] = (Math.random() - 0.5) * 8;
        }
      }
      sparkGeo.attributes.position.needsUpdate = true;

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
      floorGeo.dispose();
      floorMat.dispose();
      coneGeo.dispose();
      blueSpotMat.dispose();
      redSpotMat.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();
      silhouetteMat.dispose();
      torsoGeo.dispose();
      headGeo.dispose();
      lArmGeo.dispose();
      rArmGeo.dispose();
      lLegGeo.dispose();
      rLegGeo.dispose();
      gBodyGeo.dispose();
      gBodyMat.dispose();
      gNeckGeo.dispose();
      gHeadGeo.dispose();
      pickupMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[450px] md:h-[550px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#06080e] via-[#090b12] to-[#040508] border border-white/10 shadow-2xl"
    >
      {/* Anonymous Silhouette Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 text-xs font-tech text-white/70">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-none" />
        <span className="tracking-widest uppercase">Identity: Strictly Classified</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 text-[11px] font-tech text-white/40 tracking-wider">
        3D CONCERT STAGE • DUAL SPOTLIGHT RIG
      </div>
    </div>
  );
};
