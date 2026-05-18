import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * About Section
 * 
 * Cinematic scroll-triggered about section with:
 * - Fade-in and slide-up animations on scroll
 * - Staggered element animations for luxury feel
 * - Smooth 60fps performance with GSAP ScrollTrigger
 * - Premium dark theme with emerald accents
 */

function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Timeline for coordinated animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        end: 'top 20%',
        scrub: 0.3,
        anticipatePin: 1,
        fastScrollEnd: true,
        markers: false,
      },
    });

    // Title animation: fade in and slide up
    if (titleRef.current) {
      tl.from(
        titleRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 0.4,
          ease: 'power2.out',
        },
        0
      );
    }

    // Content animation: staggered fade and slide
    if (contentRef.current) {
      const paragraphs = contentRef.current.querySelectorAll('p');
      tl.from(
        paragraphs,
        {
          opacity: 0,
          y: 30,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
        },
        0.1
      );
    }

    // Stats animation: fade in with scale
    if (statsRef.current) {
      const stats = statsRef.current.querySelectorAll('.stat-item');
      tl.from(
        stats,
        {
          opacity: 0,
          scale: 0.9,
          y: 20,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        },
        0.2
      );
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full px-8 md:px-16 lg:px-24 py-24 md:py-32 border-t border-white/10"
    >
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Section title */}
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl font-light tracking-tight mb-12 opacity-0"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          About
          <span className="text-emerald-400 font-normal"> Me</span>
        </h2>

        {/* Content */}
        <div ref={contentRef} className="space-y-6 mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed opacity-0">
            I'm a creative developer passionate about building immersive digital experiences that push the boundaries
            of what's possible on the web. With expertise in 3D graphics, AI integration, and cinematic interactions, I
            craft interfaces that feel premium and respond intuitively.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed opacity-0">
            My work blends technical precision with design thoughtfulness—every animation is purposeful, every
            interaction smooth, and every experience memorable. I specialize in transforming complex ideas into elegant,
            high-performance solutions that users love.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed opacity-0">
            Whether building real-time 3D scenes, implementing AI systems, or designing smooth scroll experiences, I
            bring a cinematic approach to development that elevates digital products.
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="stat-item rounded-xl border border-white/10 bg-card/40 px-6 py-8 backdrop-blur-xl opacity-0">
            <div className="text-2xl md:text-3xl font-light text-emerald-400 mb-2">50+</div>
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-muted-foreground">Projects</p>
          </div>
          <div className="stat-item rounded-xl border border-white/10 bg-card/40 px-6 py-8 backdrop-blur-xl opacity-0">
            <div className="text-2xl md:text-3xl font-light text-emerald-400 mb-2">8+</div>
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-muted-foreground">Years</p>
          </div>
          <div className="stat-item rounded-xl border border-white/10 bg-card/40 px-6 py-8 backdrop-blur-xl opacity-0">
            <div className="text-2xl md:text-3xl font-light text-emerald-400 mb-2">3D</div>
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-muted-foreground">Graphics</p>
          </div>
          <div className="stat-item rounded-xl border border-white/10 bg-card/40 px-6 py-8 backdrop-blur-xl opacity-0">
            <div className="text-2xl md:text-3xl font-light text-emerald-400 mb-2">100%</div>
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-muted-foreground">Cinematic</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
