import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { useAtom } from 'jotai';
import { splineLoadedAtom } from '@/lib/atoms';
import useDOMParallax from '@/hooks/useDOMParallax';

/* ── Framer Motion Variants ──────────────────────────── */
const easing = [0.25, 0.1, 0.25, 1];
const premiumEase = [0.34, 1.56, 0.64, 1];

const fadeInUp: Variants = {
  hidden: { y: 20, opacity: 0, filter: 'blur(6px)' },
  visible: (custom: number = 0) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: easing, delay: custom },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: premiumEase, delay: custom },
  }),
};

interface LetterPhysics {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  rotation: number;
  scale: number;
  dragging: boolean;
  lastPointerX: number;
  lastPointerY: number;
  width: number;
  height: number;
}

export function HeroContent() {
  const [splineLoaded] = useAtom(splineLoadedAtom);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  
  // State for original name typing sequence
  const fullName = 'GANESH BAMALWA';
  const nonSpaceLetters = fullName.split('').filter(c => c !== ' ');

  const [nameRevealCount, setNameRevealCount] = useState(0);
  const [nameTypingDone, setNameTypingDone] = useState(false);
  const [stage, setStage] = useState(0);
  const [showHint, setShowHint] = useState(true);

  // Full Name zero-gravity physics state
  const [isFloating, setIsFloating] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // DOM refs for floating spans
  const animationFrameRef = useRef<number | null>(null);

  // Single-source physics ref to track all letters at 60fps
  const physicsData = useRef<LetterPhysics[]>([]);

  // Capture coordinate mappings of all letters relative to the nodeRef absolute wrapper
  const initializePhysics = useCallback(() => {
    const letters = document.querySelectorAll('.hero-headline .letter-char');
    const containerRect = nodeRef.current?.getBoundingClientRect();
    if (!containerRect || letters.length === 0) return;

    const data: LetterPhysics[] = [];
    letters.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const targetX = rect.left - containerRect.left;
      const targetY = rect.top - containerRect.top;

      data.push({
        x: targetX,
        y: targetY,
        vx: 0,
        vy: 0,
        targetX,
        targetY,
        rotation: 0,
        scale: 1,
        dragging: false,
        lastPointerX: 0,
        lastPointerY: 0,
        width: rect.width || 35,
        height: rect.height || 85
      });
    });

    physicsData.current = data;
  }, []);

  // Handle window sizing adjustments to compute responsive letter anchors
  const handleResize = useCallback(() => {
    if (!isFloating && !isReturning) {
      initializePhysics();
    } else {
      const letters = document.querySelectorAll('.hero-headline .letter-char');
      const containerRect = nodeRef.current?.getBoundingClientRect();
      if (!containerRect || letters.length === 0) return;

      letters.forEach((el, index) => {
        if (!physicsData.current[index]) return;
        const rect = el.getBoundingClientRect();
        physicsData.current[index].targetX = rect.left - containerRect.left;
        physicsData.current[index].targetY = rect.top - containerRect.top;
      });
    }
  }, [isFloating, isReturning, initializePhysics]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Stage 0 → 1: Start typewriter name typing once 3D canvas reports loaded
  useEffect(() => {
    if (splineLoaded && stage === 0) {
      setStage(1);
    }
  }, [splineLoaded, stage]);

  // Stage 1: Typewriter reveal sequence (60ms/char)
  useEffect(() => {
    if (stage !== 1) return;
    if (nameRevealCount >= fullName.length) {
      setNameTypingDone(true);
      const t = setTimeout(() => {
        setStage(2);
      }, 200);
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => {
      setNameRevealCount((c) => c + 1);
    }, 60);
    return () => clearTimeout(timer);
  }, [stage, nameRevealCount]);

  // Let layout settle completely before capturing initial coordinates
  useEffect(() => {
    if (nameTypingDone) {
      const t = setTimeout(() => {
        initializePhysics();
        // PART 5: Log initial origin positions on load
        if (physicsData.current && physicsData.current.length > 0) {
          physicsData.current.forEach((item, index) => {
            console.log(`Origin Letter ${nonSpaceLetters[index]}:`, item.targetX, item.targetY);
          });
        }
      }, 300);
      return () => clearTimeout(t);
    }
  }, [nameTypingDone, initializePhysics]);

  // Stage 2 → 3: Tagline reveal (900ms)
  useEffect(() => {
    if (stage !== 2) return;
    const t = setTimeout(() => setStage(3), 900);
    return () => clearTimeout(t);
  }, [stage]);

  // Stage 3 → 4: Buttons and chapter badges reveal
  useEffect(() => {
    if (stage !== 3) return;
    const t = setTimeout(() => setStage(4), 700);
    return () => clearTimeout(t);
  }, [stage]);

  // Fade out user click/interact hint after 5 seconds
  useEffect(() => {
    if (!nameTypingDone) return;
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, [nameTypingDone]);

  // Forward viewport mouse events directly to Spline canvas for interactive head-tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = document.querySelector('.robot-container canvas');
      if (!canvas) return;
      const target = e.target as HTMLElement;
      if (target && target !== canvas && !canvas.contains(target)) {
        const synthEvent = new MouseEvent('mousemove', {
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
          bubbles: true,
          cancelable: true,
        });
        canvas.dispatchEvent(synthEvent);
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToChapter = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /* ── physics trigger: zero-gravity explosion ────────────────── */
  const launchInitials = () => {
    if (isFloating || isReturning) return;

    // Refresh dynamic measurements
    initializePhysics();

    const data = physicsData.current;
    if (data.length === 0) return;

    data.forEach((item) => {
      // PART 2: Enforce start position is EXACTLY the origin coordinates (targetX, targetY)
      item.x = item.targetX;
      item.y = item.targetY;

      // Radial explosion angle (0 to 360 degrees)
      const angle = Math.random() * Math.PI * 2;
      // Launch velocity: 2-4 units per frame (varies per initial)
      const speed = 2 + Math.random() * 2;
      
      item.vx = Math.cos(angle) * speed;
      item.vy = Math.sin(angle) * speed;
      item.rotation = (Math.random() - 0.5) * 45;
      item.scale = 1.0;
    });

    setIsFloating(true);
    setIsReturning(false);
  };

  /* ── Interactive bat/nudge click boost ────────────────────────── */
  const handleLetterClick = (e: React.MouseEvent, index: number) => {
    if (!isFloating) {
      launchInitials();
      return;
    }
    if (isReturning) return;

    e.stopPropagation();

    const item = physicsData.current[index];
    if (!item) return;

    // Sudden directional momentum impulse
    const boostX = (Math.random() > 0.5 ? 1 : -1) * (3.5 + Math.random() * 2.5);
    const boostY = (Math.random() > 0.5 ? 1 : -1) * (3.5 + Math.random() * 2.5);

    item.vx += boostX;
    item.vy += boostY;

    // Scale pop visual feedback
    item.scale = 1.3;
    setTimeout(() => {
      if (physicsData.current && physicsData.current[index]) {
        physicsData.current[index].scale = 1.0;
      }
    }, 150);
  };

  /* ── Drag throw and momentum calculation ───────────────────────── */
  const startDrag = (index: number, clientX: number, clientY: number) => {
    if (!isFloating) {
      launchInitials();
      return;
    }
    if (isReturning) return;

    const data = physicsData.current[index];
    if (!data) return;

    data.dragging = true;
    setDraggingIndex(index);

    const letterElements = document.querySelectorAll('.floating-physics-letter');
    const el = letterElements[index] as HTMLElement;
    const rect = el?.getBoundingClientRect();
    const containerRect = nodeRef.current?.getBoundingClientRect();

    const offsetX = clientX - (rect ? rect.left : (containerRect ? containerRect.left + data.x : data.x));
    const offsetY = clientY - (rect ? rect.top : (containerRect ? containerRect.top + data.y : data.y));

    data.lastPointerX = clientX;
    data.lastPointerY = clientY;

    const handleDragMove = (moveEvent: MouseEvent | TouchEvent) => {
      const pageX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const pageY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;

      if (containerRect) {
        data.x = pageX - containerRect.left - offsetX;
        data.y = pageY - containerRect.top - offsetY;
      }

      // Record instantaneous velocity for drag-throwing momentum
      data.vx = (pageX - data.lastPointerX) * 0.85;
      data.vy = (pageY - data.lastPointerY) * 0.85;

      data.lastPointerX = pageX;
      data.lastPointerY = pageY;
    };

    const handleDragEnd = () => {
      data.dragging = false;
      setDraggingIndex(null);

      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };

    window.addEventListener('mousemove', handleDragMove, { passive: true });
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove, { passive: true });
    window.addEventListener('touchend', handleDragEnd);
  };

  /* ── Return locking animation ─────────────────────────────────── */
  const triggerReturn = () => {
    if (!isFloating || isReturning) return;
    setIsReturning(true);
  };

  /* ── requestAnimationFrame 60FPS physics loop ───────────────── */
  useEffect(() => {
    if (!isFloating) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const updatePhysics = () => {
      const container = nodeRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const screenW = rect.width;
      const screenH = rect.height;
      const margin = 10;

      const data = physicsData.current;
      const letterElements = document.querySelectorAll('.floating-physics-letter');

      let allSnapped = true;

      data.forEach((item, index) => {
        const el = letterElements[index] as HTMLElement;
        if (!el) return;

        if (isReturning) {
          // PART 4: Direct Lerp interpolation return path (currentPos += (originPos - currentPos) * 0.08)
          item.x += (item.targetX - item.x) * 0.08;
          item.y += (item.targetY - item.y) * 0.08;
          item.rotation += (0 - item.rotation) * 0.08;
          item.scale += (1 - item.scale) * 0.08;

          const dist = Math.hypot(item.x - item.targetX, item.y - item.targetY);
          if (dist >= 0.3) {
            allSnapped = false;
          }
        } else if (!item.dragging) {
          // Physics step
          item.x += item.vx;
          item.y += item.vy;
          item.rotation += item.vx * 0.15; // rotate proportional to horizontal speed

          // Friction decay
          item.vx *= 0.985;
          item.vy *= 0.985;

          // PART 3: Viewport edge collision check & boundary clamp
          if (item.x < margin) {
            item.x = margin;
            item.vx = -item.vx * 0.8; // reverse and bounce back
          } else if (item.x + item.width > screenW - margin) {
            item.x = screenW - margin - item.width;
            item.vx = -item.vx * 0.8;
          }

          if (item.y < margin) {
            item.y = margin;
            item.vy = -item.vy * 0.8;
          } else if (item.y + item.height > screenH - margin) {
            item.y = screenH - margin - item.height;
            item.vy = -item.vy * 0.8;
          }

          // PART 5: Frame debug coordinate logging
          console.log(`Current Letter ${nonSpaceLetters[index]}:`, item.x, item.y);
        }

        // Apply dynamic translations directly to bypass React re-renders for fluid 60fps
        el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) scale(${item.scale}) rotate(${item.rotation}deg)`;
      });

      // Terminate and lock elements once they decelerate back home
      if (isReturning && allSnapped) {
        setIsFloating(false);
        setIsReturning(false);

        data.forEach((item, index) => {
          const el = letterElements[index] as HTMLElement;
          if (!el) return;
          item.x = item.targetX;
          item.y = item.targetY;
          item.vx = 0;
          item.vy = 0;
          item.rotation = 0;
          item.scale = 1;
          el.style.transform = `translate3d(${item.targetX}px, ${item.targetY}px, 0) scale(1) rotate(0deg)`;
        });
        return;
      }

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isFloating, isReturning]);

  // Respect user preference for reduced motion accessibility
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsFloating(false);
      setIsReturning(false);
    }
  }, []);

  return (
    <div
      ref={nodeRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 3 }}
    >
      {/* Chapter Indicator label */}
      <motion.div
        initial="hidden"
        animate={stage >= 3 ? 'visible' : 'hidden'}
        variants={fadeInUp}
        custom={0}
        className="absolute top-[8%] md:top-[10%] left-1/2 -translate-x-1/2 text-[10px] md:text-xs uppercase tracking-[0.4em] text-accent font-semibold text-center opacity-85 pointer-events-none select-none whitespace-nowrap z-50 hero-chapter-label"
        style={{ textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}
      >
        CHAPTER 00 // THE FOCUS
      </motion.div>

      <div
        ref={contentRef}
        className="max-w-5xl w-full text-center px-8 md:px-16 py-16 md:py-24 hero-parallax rounded-2xl flex flex-col items-center justify-center"
        style={{ background: 'transparent', zIndex: 2, position: 'relative' }}
      >
        <div
          className="flex flex-col items-center justify-center w-full"
          style={{ zIndex: 3, position: 'relative' }}
        >
          {/* ── Name Container ──────────────────────── */}
          <div
            id="hero-name-area"
            className="relative w-full h-[140px] flex items-center justify-center pointer-events-auto"
          >
            {/* Standard full typewriter name, hidden when clicked/exploded */}
            <h1
              onClick={launchInitials}
              className={`hero-headline uppercase tracking-[0.16em] font-light text-5xl md:text-7xl lg:text-8xl text-[#F5F5F5] select-none whitespace-nowrap pl-[0.16em] cursor-pointer ${
                isFloating ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'
              }`}
              style={{
                fontFamily: 'var(--font-body)',
                textShadow: '2px 4px 32px rgba(0,0,0,0.8)',
                display: isFloating ? 'none' : 'flex',
                visibility: isFloating ? 'hidden' : 'visible',
                transition: isFloating ? 'none' : 'all 1000ms ease-out',
              }}
              aria-label="Ganesh Bamalwa"
            >
              {fullName.split('').map((char, index) => {
                const isRevealed = index < nameRevealCount;
                const isSpace = char === ' ';
                return (
                  <span
                    key={index}
                    className={`letter ${isSpace ? 'letter-space' : 'letter-char'} ${isRevealed ? 'revealed' : ''}`}
                    style={{
                      marginRight: isSpace ? '0.25em' : '0px',
                      opacity: isRevealed ? 1 : 0,
                      transition: 'opacity 0.08s ease-out',
                    }}
                  >
                    {isSpace ? '\u00A0' : char}
                  </span>
                );
              })}
            </h1>

            {/* Click-active dashed return zone for locking letters */}
            <div
              onClick={triggerReturn}
              className={`absolute cursor-pointer transition-all duration-700 ease-out flex items-center justify-center ${
                isFloating && !isReturning ? 'pointer-events-auto opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-90'
              }`}
              style={{
                zIndex: 10,
                width: '320px',
                height: '120px',
                border: '1px dashed rgba(212,175,55,0.25)',
                borderRadius: '16px',
                background: 'rgba(212,175,55,0.01)',
                backdropFilter: 'blur(2px)',
                boxShadow: '0 0 15px rgba(212,175,55,0.02), inset 0 0 10px rgba(212,175,55,0.01)',
              }}
              title="Click to snap name back together"
            >
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#E8E8E8]/45 text-center px-4 select-none leading-relaxed">
                Return Zone
              </span>
            </div>

            {/* Micro-interaction click hint */}
            <div
              onClick={launchInitials}
              className="absolute left-1/2 -translate-x-1/2 -bottom-4 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.35em] text-[#E8E8E8] cursor-pointer transition-opacity duration-1000 ease-out hover:opacity-100"
              style={{
                opacity: showHint && nameTypingDone && !isFloating ? 0.35 : 0,
                pointerEvents: nameTypingDone && !isFloating ? 'auto' : 'none',
                textShadow: '0 0 10px rgba(232,232,232,0.18)',
              }}
            >
              click name to unlock
            </div>
          </div>

          {/* ── Tagline — stage 2 ──────────────────── */}
          <motion.div
            className="mt-8 flex justify-center pointer-events-none select-none"
            initial="hidden"
            animate={stage >= 2 ? 'visible' : 'hidden'}
            variants={fadeInUp}
            custom={0}
          >
            <div
              className="px-6 py-2.5 rounded-full border border-white/[0.05] flex items-center justify-center pointer-events-none select-none hero-tagline"
              style={{ background: 'rgba(5,5,5,0.4)', backdropFilter: 'blur(12px)' }}
            >
              <span
                className="text-base md:text-xl font-light text-[#F5F5F5] tracking-[0.08em] pointer-events-none select-none"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                I build systems that think.
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Interactive physics-enabled floating letters of entire name ── */}
      {nameTypingDone && (
        <>
          {nonSpaceLetters.map((char, index) => {
            const isHovered = hoveredIndex === index;
            const isDragging = draggingIndex === index;
            const item = physicsData.current[index];

            return (
              <span
                key={index}
                onMouseDown={(e) => startDrag(index, e.clientX, e.clientY)}
                onTouchStart={(e) => startDrag(index, e.touches[0].clientX, e.touches[0].clientY)}
                onClick={(e) => handleLetterClick(e, index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="floating-physics-letter absolute z-[9990] font-light text-5xl md:text-7xl lg:text-8xl select-none pointer-events-auto cursor-pointer"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: '#F5F5F5',
                  willChange: 'transform',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  // Enforce current coordinates instantly in inline styles to prevent screen flashes/corners snapping
                  transform: item 
                    ? `translate3d(${item.x}px, ${item.y}px, 0) scale(${item.scale}) rotate(${item.rotation}deg)` 
                    : 'none',
                  filter: isHovered 
                    ? 'drop-shadow(0 0 25px rgba(255,255,255,0.4)) drop-shadow(0 4px 12px rgba(0,0,0,0.5))' 
                    : 'drop-shadow(0 4px 16px rgba(0,0,0,0.65))',
                  cursor: isFloating 
                    ? (isDragging ? 'grabbing' : 'grab') 
                    : 'pointer',
                  opacity: isFloating ? 0.95 : 0,
                  pointerEvents: isFloating ? 'auto' : 'none',
                  transition: isFloating ? 'filter 0.3s ease' : 'filter 0.3s ease, opacity 0.3s ease',
                  touchAction: 'none',
                  display: 'inline-block'
                }}
              >
                {char}
              </span>
            );
          })}
        </>
      )}

      {/* Floating Reassemble Action Button */}
      {isFloating && !isReturning && (
        <button
          onClick={triggerReturn}
          className="absolute left-1/2 -translate-x-1/2 bottom-[13%] md:bottom-[15%] px-7 py-2.5 rounded-full border border-accent/25 bg-[#050505]/70 backdrop-blur-md text-[10px] uppercase tracking-[0.3em] text-accent hover:border-accent/60 hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto shadow-2xl z-[9999]"
        >
          Reassemble Name
        </button>
      )}

      {/* ── Action Buttons — stage 3 ──────────── */}
      {!isFloating && (
        <motion.div
          className="absolute bottom-[13%] md:bottom-[15%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-6 z-40 pointer-events-auto"
          initial="hidden"
          animate={stage >= 3 ? 'visible' : 'hidden'}
          variants={scaleIn}
          custom={0.1}
        >
          <button
            onClick={() => scrollToChapter('chapter-projects')}
            className="glass-btn cursor-pointer pointer-events-auto"
          >
            The Build
          </button>
          <button
            onClick={() => scrollToChapter('chapter-contact')}
            className="glass-btn outline-btn cursor-pointer pointer-events-auto"
          >
            Get in touch
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default HeroContent;
