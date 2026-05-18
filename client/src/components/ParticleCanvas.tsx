import React, { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { activeChapterAtom, subSceneAtom } from '@/lib/atoms';

export function ParticleCanvas() {
  const [activeChapter] = useAtom(activeChapterAtom);
  const [subScene] = useAtom(subSceneAtom);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      colorType: 'white' | 'accent' | 'dim';
      vx: number;
      vy: number;
      parallaxFactor: number;
    }> = [];

    const currentAccentColor = { r: 232, g: 232, b: 232, a: 0.12 }; // Cool Platinum

    const getParticleCount = () => {
      return window.innerWidth < 768 ? 50 : 100;
    };

    const initParticles = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const count = getParticleCount();
      particles = [];

      // Calculate grid cells to space them out perfectly on start
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

          // Grid cell center with significant random jitter for natural look
          const jitterX = (Math.random() - 0.5) * cellWidth * 0.7;
          const jitterY = (Math.random() - 0.5) * cellHeight * 0.7;
          const x = (c + 0.5) * cellWidth + jitterX;
          const y = (r + 0.5) * cellHeight + jitterY;

          particles.push({
            x: Math.max(20, Math.min(x, width - 20)),
            y: Math.max(20, Math.min(y, height - 20)),
            radius: Math.random() * 1.2 + 0.8, // Slightly smaller radius to reduce visual noise
            colorType,
            vx: Math.random() * 0.08 - 0.04, // slow cinematic drift
            vy: Math.random() * 0.06 - 0.03, // slow cinematic drift
            parallaxFactor: Math.random() * 0.08 - 0.04
          });
          pIndex++;
        }
      }
    };

    initParticles();

    // Scroll velocity tracking
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

    // Resize handling with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        canvas.width = newWidth;
        canvas.height = newHeight;

        particles.forEach(p => {
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

    // Render loop
    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Keep luxurious cool platinum space-starfield consistent site-wide
      const targetColor = { r: 232, g: 232, b: 232, a: 0.12 };

      // Lerp accent color over ~60 frames
      currentAccentColor.r += (targetColor.r - currentAccentColor.r) * 0.05;
      currentAccentColor.g += (targetColor.g - currentAccentColor.g) * 0.05;
      currentAccentColor.b += (targetColor.b - currentAccentColor.b) * 0.05;
      currentAccentColor.a += (targetColor.a - currentAccentColor.a) * 0.05;

      const accentStyle = `rgba(${Math.round(currentAccentColor.r)}, ${Math.round(currentAccentColor.g)}, ${Math.round(currentAccentColor.b)}, ${currentAccentColor.a})`;

      // 1. Build adjacency list of connections (< 130px)
      const neighbors: number[][] = Array.from({ length: particles.length }, () => []);
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 16900) { // 130px connection radius
            neighbors[i].push(j);
            neighbors[j].push(i);
          }
        }
      }

      // 2. Find connected components (clusters) using a quick DFS
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
          clusterIndices.forEach(idx => {
            particleToClusterSize[idx] = clusterSize;
            particleToClusterId[idx] = clusterIdCounter;
          });
          clusterIdCounter++;
        }
      }

      // 3. Apply physics forces (Intelligent constellation control: max size 3, comfortable spacing)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 16900) { // Within connection distance (130px)
            const dist = Math.max(Math.sqrt(distSq), 0.1);
            
            // Global repulsion: strictly enforce minimum spacing of 75px between ANY two particles to keep them spaced out
            if (dist < 75) {
              const force = (1 - dist / 75) * 0.025; // solid spacing pressure
              const rx = dx * force;
              const ry = dy * force;
              p1.vx -= rx;
              p1.vy -= ry;
              p2.vx += rx;
              p2.vy += ry;
            } else if (particleToClusterId[i] === particleToClusterId[j]) {
              // Gentle attraction to keep connected stars in same constellation active but spaced
              const force = (1 - dist / 130) * 0.0006;
              const ax = dx * force;
              const ay = dy * force;
              p1.vx += ax;
              p1.vy += ay;
              p2.vx -= ax;
              p2.vy -= ay;
            } else {
              // If they are in DIFFERENT clusters, keep them separated
              const sizeI = particleToClusterSize[i];
              const sizeJ = particleToClusterSize[j];
              
              if (sizeI + sizeJ > 3) {
                // Repel to strictly prevent merging into large dense clusters
                const force = (1 - dist / 130) * 0.012;
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

      // Render particles
      particles.forEach(p => {
        // Clamp velocity to a highly atmospheric, extremely slow cinematic drift
        p.vx = Math.max(Math.min(p.vx, 0.12), -0.12);
        p.vy = Math.max(Math.min(p.vy, 0.08), -0.08);

        // Slowly damp velocity back to normal drift
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Micro random walking to keep organic movement alive
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
          fillStyle = 'rgba(255, 255, 255, 0.4)'; // soft white
        } else if (p.colorType === 'dim') {
          fillStyle = 'rgba(255, 255, 255, 0.1)'; // faint dim white
        } else {
          fillStyle = accentStyle;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = fillStyle;
        ctx.fill();
      });

      // Rendering of connection lines (refined opacity for Apple-level luxury negative space)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 16900) { // 130px max distance
            // Only draw connection lines if they strictly belong to the same cluster (size <= 3)
            if (particleToClusterId[i] === particleToClusterId[j] && particleToClusterSize[i] <= 3) {
              const dist = Math.sqrt(distSq);
              const opacity = (1 - dist / 130) * 0.38; // 3x more visible, sharp lines
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(232, 232, 232, ${opacity})`;
              ctx.lineWidth = 0.8; // slightly thicker, high-fidelity lines
              ctx.stroke();
            }
          }
        }
      }

      scrollVelocity *= 0.88;
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
      className="fixed inset-0 w-screen h-screen pointer-events-none opacity-[0.82]" 
      style={{ zIndex: 1 }}
    />
  );
}

export default ParticleCanvas;
