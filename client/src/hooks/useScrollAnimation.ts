import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { scrollProgressAtom, diamondRotationAtom } from '@/lib/atoms';
import { useDeviceTier } from '@/hooks/useDeviceTier';

/**
 * useScrollAnimation Hook
 * 
 * Manages smooth scroll-based animations and updates
 * Provides eased scroll progress for cinematic effects
 */

export function useScrollAnimation() {
  const [, setScrollProgress] = useAtom(scrollProgressAtom);
  const [, setDiamondRotation] = useAtom(diamondRotationAtom);
  const scrollVelocityRef = useRef(0);
  const lastScrollRef = useRef(0);
  const tier = useDeviceTier();

  useEffect(() => {
    if (tier === 'low') return;

    let animationFrameId: number;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrolled = docHeight > 0 ? scrollTop / docHeight : 0;
          
          // Calculate scroll velocity for momentum-based rotation
          const velocity = scrollTop - lastScrollRef.current;
          scrollVelocityRef.current = velocity * 0.1;
          lastScrollRef.current = scrollTop;

          // Apply easing to scroll progress for smoother transitions
          const easedProgress = easeInOutCubic(Math.min(scrolled, 1));
          setScrollProgress(easedProgress);

          // Update diamond rotation based on scroll
          setDiamondRotation({
            x: velocity * 0.05,
            y: velocity * 0.08,
            z: 0,
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [setScrollProgress, setDiamondRotation]);
}

/**
 * Easing functions for smooth animations
 */

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
