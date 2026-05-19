import { useEffect } from 'react';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollDepthTransition Hook
 * 
 * Manages scroll-triggered depth transitions:
 * - Diamond recedes into background as user scrolls
 * - Camera position shifts based on scroll
 * - Creates cinematic depth layering effect
 */

export function useScrollDepthTransition() {
  const tier = useDeviceTier();

  useEffect(() => {
    if (tier === 'low') return;

    // Get the canvas element
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    // Create scroll trigger for depth transition
    const anim = gsap.to(
      canvas,
      {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom center',
          scrub: 0.3,
          anticipatePin: 1,
          fastScrollEnd: true,
          markers: false,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Calculate depth based on scroll progress
            const progress = self.progress;
            
            // Apply subtle scale reduction to diamond
            gsap.to(canvas, {
              opacity: Math.max(0.3, 1 - progress * 0.7),
              duration: 0,
            });
          },
        },
      }
    );

    return () => {
      if (anim.scrollTrigger) {
        anim.scrollTrigger.kill();
        ScrollTrigger.refresh();
      }
    };
  }, []);
}
