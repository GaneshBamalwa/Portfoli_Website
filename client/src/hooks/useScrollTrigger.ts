import { useEffect, useRef } from 'react';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useAtomValue } from 'jotai';
import { reneChatOpenAtom } from '@/lib/atoms';
import gsap from 'gsap';

/**
 * useScrollTrigger Hook
 * 
 * Implements a premium cinematic scroll-based transition between the 3D Hero and the About section:
 * - Detects user scroll intent (wheel, touch swipe, keys) at the top of the page.
 * - Smoothly glides down to the About section on scroll down.
 * - Smoothly glides back to the top when scrolling up from the About section.
 * - Bypasses standard scroll only for this transition, allowing normal scrolling everywhere else.
 * - Uses high-performance GSAP interpolation for an ultra-smooth 60fps feel.
 */
export function useScrollTrigger() {
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);
  const tier = useDeviceTier();
  const isChatOpen = useAtomValue(reneChatOpenAtom);

  useEffect(() => {
    if (tier === 'low') return;
    if (isChatOpen) return;

    const handleWheel = (e: WheelEvent) => {
      const scrollY = window.scrollY;
      const threshold = 50; // threshold area near sections
      const viewportHeight = window.innerHeight;
      const aboutElement = document.getElementById('about');
      const targetY = aboutElement ? aboutElement.offsetTop : viewportHeight;

      // 1. If currently animating, intercept and block duplicate triggers
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      // 2. Transition DOWN: from Hero (scrollY near 0) to About section
      if (scrollY < threshold && e.deltaY > 0) {
        e.preventDefault();
        isAnimating.current = true;
        
        const scrollObj = { y: window.scrollY };
        gsap.to(scrollObj, {
          y: targetY,
          duration: 1.4,
          ease: 'power4.out',
          onUpdate: () => {
            window.scrollTo(0, scrollObj.y);
          },
          onComplete: () => {
            isAnimating.current = false;
          }
        });
        return;
      }

      // 3. Transition UP: from top of About section (scrollY near targetY) back to Hero
      if (Math.abs(scrollY - targetY) < threshold && e.deltaY < 0) {
        e.preventDefault();
        isAnimating.current = true;

        const scrollObj = { y: window.scrollY };
        gsap.to(scrollObj, {
          y: 0,
          duration: 1.4,
          ease: 'power4.out',
          onUpdate: () => {
            window.scrollTo(0, scrollObj.y);
          },
          onComplete: () => {
            isAnimating.current = false;
          }
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const scrollY = window.scrollY;
      const threshold = 50;
      const viewportHeight = window.innerHeight;
      const aboutElement = document.getElementById('about');
      const targetY = aboutElement ? aboutElement.offsetTop : viewportHeight;

      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchCurrentY; // positive means scrolling down (swiping up)

      // Only trigger if swipe distance is significant
      if (Math.abs(deltaY) < 30) return;

      // Transition DOWN on mobile
      if (scrollY < threshold && deltaY > 0) {
        e.preventDefault();
        isAnimating.current = true;

        const scrollObj = { y: window.scrollY };
        gsap.to(scrollObj, {
          y: targetY,
          duration: 1.4,
          ease: 'power4.out',
          onUpdate: () => {
            window.scrollTo(0, scrollObj.y);
          },
          onComplete: () => {
            isAnimating.current = false;
          }
        });
        return;
      }

      // Transition UP on mobile
      if (Math.abs(scrollY - targetY) < threshold && deltaY < 0) {
        e.preventDefault();
        isAnimating.current = true;

        const scrollObj = { y: window.scrollY };
        gsap.to(scrollObj, {
          y: 0,
          duration: 1.4,
          ease: 'power4.out',
          onUpdate: () => {
            window.scrollTo(0, scrollObj.y);
          },
          onComplete: () => {
            isAnimating.current = false;
          }
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollY = window.scrollY;
      const threshold = 50;
      const viewportHeight = window.innerHeight;
      const aboutElement = document.getElementById('about');
      const targetY = aboutElement ? aboutElement.offsetTop : viewportHeight;

      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const isScrollDownKey = e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ';
      const isScrollUpKey = e.key === 'ArrowUp' || e.key === 'PageUp';

      // Key transition DOWN
      if (scrollY < threshold && isScrollDownKey) {
        e.preventDefault();
        isAnimating.current = true;

        const scrollObj = { y: window.scrollY };
        gsap.to(scrollObj, {
          y: targetY,
          duration: 1.4,
          ease: 'power4.out',
          onUpdate: () => {
            window.scrollTo(0, scrollObj.y);
          },
          onComplete: () => {
            isAnimating.current = false;
          }
        });
        return;
      }

      // Key transition UP
      if (Math.abs(scrollY - targetY) < threshold && isScrollUpKey) {
        e.preventDefault();
        isAnimating.current = true;

        const scrollObj = { y: window.scrollY };
        gsap.to(scrollObj, {
          y: 0,
          duration: 1.4,
          ease: 'power4.out',
          onUpdate: () => {
            window.scrollTo(0, scrollObj.y);
          },
          onComplete: () => {
            isAnimating.current = false;
          }
        });
      }
    };

    // Add listeners with passive: false so we can prevent default scrolling
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tier, isChatOpen]);
}
