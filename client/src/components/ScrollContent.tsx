import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollContent Component
 * 
 * Manages scroll-triggered animations:
 * - Text block fades in and moves forward from bottom with staggered timing
 * - Creates cinematic depth layering as user scrolls
 * - Smooth easing for premium luxury feel
 * - Glassmorphism UI with edge highlights
 */

export function ScrollContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    // Create scroll trigger for content animation
    gsap.fromTo(
      contentRef.current,
      {
        opacity: 0,
        y: 100,
        scale: 0.90,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 0.3,
          anticipatePin: 1,
          fastScrollEnd: true,
          markers: false,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none flex items-end justify-center pb-20"
    >
      <div
        ref={contentRef}
        className="pointer-events-auto max-w-2xl mx-auto px-8 py-12 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-xl rounded-lg border border-border/40 shadow-2xl opacity-0"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          <span className="text-xs font-light uppercase tracking-widest text-accent">Scroll to Explore</span>
        </div>
        <h2
          className="text-4xl md:text-5xl font-light mb-6 tracking-tight text-foreground leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Precision Engineered
        </h2>
        <p
          className="text-base md:text-lg text-muted-foreground leading-relaxed font-light"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Every facet of this premium experience merges hyper-realistic 3D rendering with cinematic design excellence. The diamond represents digital craftsmanship at its finest—physically accurate, visually sophisticated, technically superior.
        </p>
      </div>
    </div>
  );
}
