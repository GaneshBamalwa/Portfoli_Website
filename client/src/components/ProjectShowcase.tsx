import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

type CardData = { id: string; title: string; description: string };

const CARD_DATA: CardData[] = [
  { id: 'c1', title: 'Project One', description: 'Immersive UI experience' },
  { id: 'c2', title: 'Project Two', description: 'Cinematic product reveal' },
  { id: 'c3', title: 'Project Three', description: 'AI interface design' },
];

function Card({ index, position, rotation, data }: { index: number; position: [number, number, number]; rotation: [number, number, number]; data: CardData }) {
  const rootRef = useRef<any>(null);
  const contentRef = useRef<any>(null);
  const visualRef = useRef<any>(null);
  const [flipped, setFlipped] = useState(false);
  const hoverRef = useRef(false);
  const baseRef = useRef({ x: 0, y: 0, z: 0, rz: 0 });

  const frontTex = useLoader(THREE.TextureLoader, '/assets/cards/front.svg');
  const backTex = useLoader(THREE.TextureLoader, '/assets/cards/back.svg');
  frontTex.encoding = THREE.sRGBEncoding;
  backTex.encoding = THREE.sRGBEncoding;

  useFrame(({ clock }) => {
    if (!rootRef.current) return;
    const t = clock.getElapsedTime();
    rootRef.current.position.y = baseRef.current.y + Math.sin(t * 0.6 + index) * 0.05;
    rootRef.current.rotation.z = baseRef.current.rz + Math.sin(t * 0.4 + index) * 0.02;

    // update flipped state by reading content rotation
    const vis = visualRef.current;
    if (vis) {
      let ang = vis.rotation.y % (Math.PI * 2);
      if (ang < 0) ang += Math.PI * 2;
      const faceUp = ang < Math.PI / 2 || ang > (3 * Math.PI) / 2;
      if (faceUp !== flipped) setFlipped(faceUp);
    }
  });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    baseRef.current.x = el.position.x;
    baseRef.current.y = el.position.y;
    baseRef.current.z = el.position.z;
    baseRef.current.rz = el.rotation.z;
    // make visual slightly larger for presence
    if (contentRef.current) {
      try { contentRef.current.scale.set(1.08, 1.08, 1.08); } catch (e) {}
      visualRef.current = contentRef.current;
    }
  }, []);

  const onPointerOver = (e: any) => {
    e.stopPropagation();
    hoverRef.current = true;
    if (!rootRef.current) return;
    gsap.to(rootRef.current.position, { y: rootRef.current.position.y + 0.28, duration: 0.45, ease: 'power2.out' });
    if (visualRef.current) gsap.to(visualRef.current.scale, { x: 1.03, y: 1.03, z: 1.03, duration: 0.45, ease: 'power2.out' });
  };

  const onPointerOut = (e: any) => {
    e.stopPropagation();
    hoverRef.current = false;
    if (!rootRef.current) return;
    gsap.to(rootRef.current.position, { y: position[1], duration: 0.6, ease: 'power3.out' });
    if (visualRef.current) gsap.to(visualRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'power3.out' });
  };

  const onClick = (e: any) => {
    e.stopPropagation();
    setFlipped((v) => !v);
    if (!contentRef.current) return;
    const rot = flipped ? 0.0001 : Math.PI;
    gsap.to(contentRef.current.rotation, { y: rot, duration: 0.9, ease: 'power2.inOut' });
  };

  return (
    <group>
      <group ref={rootRef} position={position} rotation={rotation} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
        <group ref={contentRef}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.66, 2.46, 0.08]} />
            <meshPhysicalMaterial color={'#080808'} metalness={0.9} roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.1} />
          </mesh>

          <mesh position={[0, 0, -0.042]} rotation={[0, Math.PI, 0]}> 
            <planeGeometry args={[1.58, 2.28]} />
            <meshStandardMaterial map={backTex} roughness={0.55} metalness={0.02} />
          </mesh>

          <mesh position={[0, 0, 0.042]} rotation={[0, 0, 0]}>
            <planeGeometry args={[1.58, 2.28]} />
            <meshStandardMaterial map={frontTex} roughness={0.45} metalness={0.02} />
          </mesh>
        </group>

        <Html position={[0, 0, 0.12]} center style={{ pointerEvents: flipped ? 'auto' : 'none' }}>
          <div className="card-front" aria-hidden={!flipped}>
            <div className="card-front-inner">
              <h3>{data.title}</h3>
              <p>{data.description}</p>
              <div className="card-links">
                <a href="#" className="card-link">Live</a>
                <a href="#" className="card-link">Code</a>
              </div>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

function SceneContent() {
  const groupRef = useRef<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    const cards = groupRef.current?.children;
    if (!cards || cards.length === 0) return;

    const spacing = 1.4;
    const targets = Array.from(cards).map((c: any, i: number) => {
      const centerIndex = (cards.length - 1) / 2;
      const x = (i - centerIndex) * spacing;
      const y = -0.05 + Math.abs(i - centerIndex) * -0.02;
      const z = -0.05 * Math.abs(i - centerIndex);
      const rz = (i - centerIndex) * 0.18;
      const ry = Math.PI + (i - centerIndex) * 0.12;
      return { x, y, z, rz, ry };
    });

    cards.forEach((c: any, i: number) => {
      c.position.set(0, -1.2, -0.6 - i * 0.02);
      c.rotation.set(0, Math.PI + (Math.random() - 0.5) * 0.2, 0.4 - i * 0.2);
    });

    cards.forEach((c: any, i: number) => {
      const t = targets[i];
      gsap.to(c.position, { x: t.x, y: t.y, z: t.z, duration: 1.2, ease: 'power3.out', delay: i * 0.08 });
      gsap.to(c.rotation, { x: 0, y: t.ry, z: t.rz, duration: 1.2, ease: 'power3.out', delay: i * 0.08 });
    });

    gsap.to(camera.position, { z: 4.2, duration: 1.6, ease: 'power2.out' });
  }, [camera]);

  return (
    <group ref={groupRef}>
      {CARD_DATA.map((c, i) => (
        <Card key={c.id} index={i} position={[(-1 + i) * 0.8, 0.4, -0.5 - i * 0.02]} rotation={[0, 0.3 - i * 0.35, 0.1 - i * 0.02]} data={c} />
      ))}
    </group>
  );
}

export default function ProjectShowcase() {
  return (
    <section id="project-showcase" className="relative w-full h-[80vh] md:h-[70vh] lg:h-[76vh]">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }} shadows gl={{ antialias: true }}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 10, 7]} intensity={1.2} />
        <Suspense fallback={null}>
          <Environment preset="studio" background={false} />
          <SceneContent />
        </Suspense>
      </Canvas>

      <div className="project-showcase-ui">
        <div className="canvas-instruction">Press on the canvas to focus and interact</div>
      </div>
    </section>
  );
}
