import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Preload, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Diamond, createBrilliantCutDiamond } from './Diamond';
import { CinematicEffects } from './CinematicEffects';
import { useAtom } from 'jotai';
import { diamondRotationAtom, diamondLightingAtom, scrollProgressAtom } from '@/lib/atoms';
import InputManager from '@/lib/inputManager';
import gsap from 'gsap';

/**
 * HeroScene Component
 * 
 * Premium cinematic 3D scene with:
 * - Cinematic camera with slow dolly motion (low-angle framing)
 * - Proper camera framing (full diamond visible, 30-45% viewport height)
 * - Cinematic fade-in animation on page load
 * - Scroll-triggered depth transitions with lighting choreography
 * - Emerald green + cool white rim lighting (luxury product aesthetic)
 * - Luxury product commercial aesthetic (Apple/Unreal Engine level)
 */

function SceneContent() {
  const keyLightRef = useRef<THREE.Light>(null);
  const rimLight1Ref = useRef<THREE.Light>(null);
  const rimLight2Ref = useRef<THREE.Light>(null);
  const spotLightRef = useRef<THREE.Light>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const { camera, scene } = useThree();
  const [, setRotation] = useAtom(diamondRotationAtom);
  const [, setLighting] = useAtom(diamondLightingAtom);
  const [scrollProgress] = useAtom(scrollProgressAtom);
  const backgroundGeometry = useMemo(() => createBrilliantCutDiamond(), []);

  // Set up cinematic lighting system
  useEffect(() => {
    // Key light - cool white directional light (premium cinema feel)
    if (keyLightRef.current) {
      // Move key light to upper-left for dramatic product lighting
      keyLightRef.current.position.set(-6, 14, 8);
      (keyLightRef.current as THREE.DirectionalLight).intensity = 3.2;
      (keyLightRef.current as THREE.DirectionalLight).color.setHex(0xffffff);
      (keyLightRef.current as THREE.DirectionalLight).shadow.mapSize.width = 2048;
      (keyLightRef.current as THREE.DirectionalLight).shadow.mapSize.height = 2048;
    }

    // Rim light 1 - cool blue rim lighting from left (edge definition)
    if (rimLight1Ref.current) {
      rimLight1Ref.current.position.set(-12, 10, 4);
      (rimLight1Ref.current as THREE.Light).intensity = 1.8;
      (rimLight1Ref.current as THREE.Light).color.setHex(0x6fb3ff); // Cool blue
    }

    // Rim light 2 - deep cool blue from right (secondary accent)
    if (rimLight2Ref.current) {
      rimLight2Ref.current.position.set(12, 9, -8);
      (rimLight2Ref.current as THREE.Light).intensity = 1.2;
      (rimLight2Ref.current as THREE.Light).color.setHex(0x2b6cff); // Deep cool blue
    }

    // Specular highlight light - creates sparkle
    if (spotLightRef.current) {
      spotLightRef.current.position.set(4, 14, 6);
      (spotLightRef.current as THREE.SpotLight).intensity = 3.0;
      (spotLightRef.current as THREE.SpotLight).angle = Math.PI / 6;
      (spotLightRef.current as THREE.SpotLight).penumbra = 0.5;
      (spotLightRef.current as THREE.SpotLight).decay = 2;
      (spotLightRef.current as THREE.SpotLight).distance = 40;
    }
  }, []);

  // Cinematic fade-in animation on mount
  useEffect(() => {
    // Animate lights in from 0 intensity for dramatic reveal
    gsap.fromTo(
      keyLightRef.current,
      { intensity: 0 },
      { intensity: 2.8, duration: 2.5, ease: 'power2.inOut' }
    );
    
    gsap.fromTo(
      rimLight1Ref.current,
      { intensity: 0 },
      { intensity: 2.0, duration: 2.8, ease: 'power2.inOut', delay: 0.3 }
    );
    
    gsap.fromTo(
      rimLight2Ref.current,
      { intensity: 0 },
      { intensity: 1.4, duration: 3.0, ease: 'power2.inOut', delay: 0.5 }
    );

    gsap.fromTo(
      spotLightRef.current,
      { intensity: 0 },
      { intensity: 3.0, duration: 3.2, ease: 'power2.inOut', delay: 0.7 }
    );

    // Fade in ambient light
    gsap.fromTo(
      scene.children.find(child => child instanceof THREE.AmbientLight) || {},
      { intensity: 0 },
      { intensity: 0.3, duration: 2.5, ease: 'power2.inOut' }
    );
  }, [scene]);

  // Update lighting and camera with cinematic choreography
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Cinematic camera dolly motion - slow, controlled movement
    const cameraDollyY = Math.sin(time * 0.15) * 0.3;
    const cameraDollyZ = Math.cos(time * 0.1) * 0.2;
    camera.position.y += (cameraDollyY - camera.position.y) * 0.01;
    camera.position.z = 5.5 + cameraDollyZ * 0.1;
    
    // Apply scroll-based camera perspective (depth of field effect)
    const scrollCameraZ = 5.5 + scrollProgress * 0.5;
    camera.position.z += (scrollCameraZ - camera.position.z) * 0.02;

    // Update key light position based on scroll - cinematic choreography
    if (keyLightRef.current) {
      const angle = scrollProgress * Math.PI * 1.5;
      const radius = 6 + scrollProgress * 2;
      keyLightRef.current.position.x = Math.cos(angle) * radius;
      keyLightRef.current.position.y = 12 - scrollProgress * 3;
      keyLightRef.current.position.z = Math.sin(angle) * radius;
    }

    // Update rim light 1 - left side sweep
    if (rimLight1Ref.current) {
      const rimAngle1 = scrollProgress * Math.PI * 2;
      rimLight1Ref.current.position.x = Math.cos(rimAngle1) * -12;
      rimLight1Ref.current.position.z = Math.sin(rimAngle1) * 4;
      (rimLight1Ref.current as THREE.Light).intensity = 2.0 + Math.sin(time * 0.3) * 0.3;
    }

    // Update rim light 2 - right side sweep
    if (rimLight2Ref.current) {
      const rimAngle2 = scrollProgress * Math.PI * 2 + Math.PI;
      rimLight2Ref.current.position.x = Math.cos(rimAngle2) * 12;
      rimLight2Ref.current.position.z = Math.sin(rimAngle2) * -8;
      (rimLight2Ref.current as THREE.Light).intensity = 1.4 + Math.cos(time * 0.25) * 0.2;
    }

    // Spotlight sparkle animation
    if (spotLightRef.current) {
      spotLightRef.current.position.x = 4 + Math.sin(time * 0.4) * 3;
      spotLightRef.current.position.z = 6 + Math.cos(time * 0.3) * 3;
      (spotLightRef.current as THREE.SpotLight).intensity = 2.5 + Math.sin(time * 0.5) * 0.5;
    }

    // Apply mouse-based camera tilt for subtle parallax (consume InputManager)
    const nm = InputManager.getNormalized();
    const targetRotX = (nm.y - 0.5) * 0.05;
    const targetRotY = (nm.x - 0.5) * 0.05;
    
    camera.rotation.order = 'YXZ';
    camera.rotation.y += (targetRotY - camera.rotation.y) * 0.01;
    camera.rotation.x += (targetRotX - camera.rotation.x) * 0.01;
  });

  return (
    <>
      {/* Post-Processing Effects Pipeline */}
      <CinematicEffects />

      {/* Background diamond silhouette - establishes the scene shape */}
      <mesh geometry={backgroundGeometry} position={[0, 0, -2.8]} scale={[4.2, 4.6, 3.8]} rotation={[0.2, 0.35, 0.05]}>
        <MeshTransmissionMaterial
          transmission={0.55}
          ior={2.2}
          backsideThickness={20}
          thickness={1.2}
          roughness={0.06}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.12}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.0}
          distortionScale={0}
          temporalDistortion={0}
          samples={20}
          resolution={1024}
          backside
          toneMapped
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lighting Setup - Luxury Product Cinema Aesthetic */}
      <ambientLight intensity={0.2} color={0xffffff} />
      <directionalLight ref={keyLightRef} color={0xffffff} castShadow />
      <pointLight ref={rimLight1Ref} distance={40} decay={1.5} />
      <pointLight ref={rimLight2Ref} distance={40} decay={1.5} />
      <spotLight ref={spotLightRef} castShadow color={0xffffff} />

      {/* Soft volumetric atmosphere */}
      <fogExp2 attach="fog" args={[0x000000, 0.02]} />

      {/* Soft volumetric cone from the key light for gentle glow */}
      <mesh position={[-4.5, 11, 7]} rotation={[ -1.2, 0.1, 0.2 ]} scale={[1.6, 1.6, 1.6]}>
        <coneGeometry args={[3.5, 10, 32]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Environment - studio HDRI used for controlled reflections, keep background false to maintain deep black */}
      <Environment preset="studio" background={false} />

      {/* Main Diamond Mesh */}
      <Diamond />

      {/* Preload assets */}
      <Preload all />
    </>
  );
}

export function HeroScene() {
  const [, setScrollProgress] = useAtom(scrollProgressAtom);

  // Handle mouse movement for parallax
  useEffect(() => {
    // Handle scroll for rotation and lighting changes
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(Math.min(scrolled, 1));
    };
    window.addEventListener('scroll', handleScroll);

    // Ensure InputManager is running for 3D consumers; we use it in the render loop
    InputManager.start();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setScrollProgress]);

  return (
    <Canvas
      className="w-full h-screen"
      dpr={[1, 1.5]}
      performance={{ min: 0.5, max: 1 }}
      gl={{
        antialias: true,
        alpha: false,
        stencil: false,
        depth: true,
      }}
    >
      {/* Camera positioned to frame entire diamond with negative space */}
      {/* Diamond should occupy ~30-45% of viewport height */}
      {/* 85mm lens equivalent vertical FOV (~29 degrees) for tight product framing */}
      <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={29} />
      <SceneContent />
    </Canvas>
  );
}
