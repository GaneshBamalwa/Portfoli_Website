import React, { memo, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { activeChapterAtom, subSceneAtom } from '@/lib/atoms';

const DESKTOP_NODE_COUNT = 100;
const MOBILE_NODE_RATIO = 0.35;
const DESKTOP_CONNECT_SQ = 16900;
const MOBILE_CONNECT_SQ = 6084;

function ParticleCanvasComponent() {
  const [activeChapter] = useAtom(activeChapterAtom);
  const [subScene] = useAtom(subSceneAtom);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobileRef = useRef(
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  const activeChapterRef = useRef(activeChapter);
  const subSceneRef = useRef(subScene);

  useEffect(() => {
    activeChapterRef.current = activeChapter;
  }, [activeChapter]);

  useEffect(() => {
    subSceneRef.current = subScene;
  }, [subScene]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frameCounter = 0;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      colorType: 'white' | 'accent' | 'dim';
      vx: number;
      vy: number;
      parallaxFactor: number;
    }> = [];

    const currentAccentColor = { r: 232, g: 232, b: 232, a: 0.12 };

    const getParticleCount = () => {
      const base = isMobileRef.current
        ? Math.floor(DESKTOP_NODE_COUNT * MOBILE_NODE_RATIO)
        : DESKTOP_NODE_COUNT;
      return base;
    };

    const getConnectDistSq = () =>
      isMobileRef.current ? MOBILE_CONNECT_SQ : DESKTOP_CONNECT_SQ;

    const initParticles = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const count = getParticleCount();
      particles = [];

      const cols = Math.ceil(Math.sqrt((count * width) / height));
      const rows = Math.ceil(count / cols);
      const cellWidth = width / cols;
      const cellHeight = height / rows;

      let pIndex = 0;
      for (let r = 0; r < rows && pIndex < count; r++) {
        for (let c = 0; c < cols && pIndex < count; c++) {
          const rand = Math.random();
          let colorType: 'white' | 'accent' | 'dim' = 'white';
          if (rand < 0.35) {
            colorType = 'accent';
          } else if (rand < 0.7) {
            colorType = 'dim';
          }

          const jitterX = (Math.random() - 0.5) * cellWidth * 0.7;
          const jitterY = (Math.random() - 0.5) * cellHeight * 0.7;
          const x = (c + 0.5) * cellWidth + jitterX;
          const y = (r + 0.5) * cellHeight + jitterY;

          particles.push({
            x: Math.max(20, Math.min(x, width - 20)),
            y: Math.max(20, Math.min(y, height - 20)),
            radius: Math.random() * 1.2 + 0.8,
            colorType,
            vx: Math.random() * 0.08 - 0.04,
            vy: Math.random() * 0.06 - 0.03,
            parallaxFactor: Math.random() * 0.08 - 0.04,
          });
          pIndex++;
        }
      }
    };

    initParticles();

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let scrollTicking = false;

    const handleScrollEvent = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          scrollVelocity = currentScrollY - lastScrollY;
          lastScrollY = currentScrollY;
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener('scroll', handleScrollEvent, { passive: true });

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      isMobileRef.current = window.innerWidth < 768;
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        canvas.width = newWidth;
        canvas.height = newHeight;

        particles.forEach((p) => {
          p.x = (p.x / oldWidth) * newWidth;
          p.y = (p.y / oldHeight) * newHeight;
        });

        const count = getParticleCount();
        if (particles.length !== count) {
          initParticles();
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      frameCounter++;
      const skipPhysics =
        isMobileRef.current && frameCounter % 2 !== 0;

      const width = canvas.width;
      const height = canvas.height;
      const connectDistSq = getConnectDistSq();
      const connectDist = Math.sqrt(connectDistSq);

      if (!skipPhysics) {
        ctx.clearRect(0, 0, width, height);

        const targetColor = { r: 232, g: 232, b: 232, a: 0.12 };
        currentAccentColor.r += (targetColor.r - currentAccentColor.r) * 0.05;
        currentAccentColor.g += (targetColor.g - currentAccentColor.g) * 0.05;
        currentAccentColor.b += (targetColor.b - currentAccentColor.b) * 0.05;
        currentAccentColor.a += (targetColor.a - currentAccentColor.a) * 0.05;

        const accentStyle = `rgba(${Math.round(currentAccentColor.r)}, ${Math.round(currentAccentColor.g)}, ${Math.round(currentAccentColor.b)}, ${currentAccentColor.a})`;

        const neighbors: number[][] = Array.from({ length: particles.length }, () => []);
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < connectDistSq) {
              neighbors[i].push(j);
              neighbors[j].push(i);
            }
          }
        }

        const visited = new Set<number>();
        const particleToClusterSize: number[] = new Array(particles.length).fill(1);
        const particleToClusterId: number[] = new Array(particles.length).fill(-1);

        let clusterIdCounter = 0;
        for (let i = 0; i < particles.length; i++) {
          if (!visited.has(i)) {
            const clusterIndices: number[] = [];
            const queue = [i];
            visited.add(i);

            while (queue.length > 0) {
              const curr = queue.shift()!;
              clusterIndices.push(curr);
              for (const neighbor of neighbors[curr]) {
                if (!visited.has(neighbor)) {
                  visited.add(neighbor);
                  queue.push(neighbor);
                }
              }
            }

            const clusterSize = clusterIndices.length;
            clusterIndices.forEach((idx) => {
              particleToClusterSize[idx] = clusterSize;
              particleToClusterId[idx] = clusterIdCounter;
            });
            clusterIdCounter++;
          }
        }

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connectDistSq) {
              const dist = Math.max(Math.sqrt(distSq), 0.1);

              if (dist < 75) {
                const force = (1 - dist / 75) * 0.025;
                const rx = dx * force;
                const ry = dy * force;
                p1.vx -= rx;
                p1.vy -= ry;
                p2.vx += rx;
                p2.vy += ry;
              } else if (particleToClusterId[i] === particleToClusterId[j]) {
                const force = (1 - dist / connectDist) * 0.0006;
                const ax = dx * force;
                const ay = dy * force;
                p1.vx += ax;
                p1.vy += ay;
                p2.vx -= ax;
                p2.vy -= ay;
              } else {
                const sizeI = particleToClusterSize[i];
                const sizeJ = particleToClusterSize[j];

                if (sizeI + sizeJ > 3) {
                  const force = (1 - dist / connectDist) * 0.012;
                  const rx = dx * force;
                  const ry = dy * force;
                  p1.vx -= rx;
                  p1.vy -= ry;
                  p2.vx += rx;
                  p2.vy += ry;
                }
              }
            }
          }
        }

        particles.forEach((p) => {
          p.vx = Math.max(Math.min(p.vx, 0.12), -0.12);
          p.vy = Math.max(Math.min(p.vy, 0.08), -0.08);
          p.vx *= 0.99;
          p.vy *= 0.99;
          p.vx += (Math.random() - 0.5) * 0.0015;
          p.vy += (Math.random() - 0.5) * 0.0012;
          p.x += p.vx;
          p.y += p.vy;
          p.y -= scrollVelocity * 0.4;
          p.x += scrollVelocity * p.parallaxFactor;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          let fillStyle = '';
          if (p.colorType === 'white') {
            fillStyle = 'rgba(255, 255, 255, 0.4)';
          } else if (p.colorType === 'dim') {
            fillStyle = 'rgba(255, 255, 255, 0.1)';
          } else {
            fillStyle = accentStyle;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = fillStyle;
          ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connectDistSq) {
              if (
                particleToClusterId[i] === particleToClusterId[j] &&
                particleToClusterSize[i] <= 3
              ) {
                const dist = Math.sqrt(distSq);
                const opacity = (1 - dist / connectDist) * 0.38;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(232, 232, 232, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
              }
            }
          }
        }

        scrollVelocity *= 0.88;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('scroll', handleScrollEvent);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none opacity-[0.82] particle-network-canvas"
      style={{ zIndex: 1, contain: 'layout style paint' }}
    />
  );
}

export const ParticleCanvas = memo(ParticleCanvasComponent);
export default ParticleCanvas;
