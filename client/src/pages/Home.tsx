import { lazy, Suspense, useEffect, useRef, useState, type TouchEvent } from 'react';
import { motion } from 'framer-motion';
import { SplineHero } from '@/components/SplineHero';
import HeroContent from '@/components/HeroContent';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useMouseInteraction } from '@/hooks/useMouseInteraction';
import { useScrollDepthTransition } from '@/hooks/useScrollDepthTransition';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { setupChapterFlashes } from '@/lib/cinemaEffects';
import { gsapDur } from '@/lib/gsapDuration';
import { useMobileDetect } from '@/hooks/useMobileDetect';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { useAtom } from 'jotai';
import { activeChapterAtom, subSceneAtom, scrollPercentAtom, reneChatOpenAtom } from '@/lib/atoms';
import ScrambleText from '@/components/ScrambleText';
import { TriumphConfetti } from '@/components/TriumphConfetti';

const ArsenalSection = lazy(() => import('@/sections/ArsenalSection'));
const ContactSection = lazy(() => import('@/sections/ContactSection'));
const ReneChatbot = lazy(() => import('@/components/ReneChatbot'));

export default function Home() {
  // Initialize foundational mouse and scroll effects
  useScrollAnimation();
  useMouseInteraction();
  useScrollDepthTransition();
  useScrollTrigger();

  const [activeChapter, setActiveChapter] = useAtom(activeChapterAtom);
  const [teamsCount, setTeamsCount] = useState(0);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [scrollPercent, setScrollPercent] = useAtom(scrollPercentAtom);
  const [subScene, setSubScene] = useAtom(subSceneAtom);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [loadReneChat, setLoadReneChat] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [isReneOpen] = useAtom(reneChatOpenAtom);
  const isMobile = useMobileDetect();

  // Parent refs for GSAP ScrollTrigger context
  const originRef = useRef<HTMLDivElement>(null);
  const buildRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const arsenalRef = useRef<HTMLDivElement>(null);
  const winRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef2 = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Chapter mapping for navigation
  const CHAPTERS = [
    { id: 'chapter-hero', label: 'THE FOCUS', num: '00' },
    { id: 'chapter-origin', label: 'THE ORIGIN', num: '01' },
    { id: 'chapter-projects', label: 'THE BUILD', num: '02' },
    { id: 'chapter-skills', label: 'THE ARSENAL', num: '03' },
    { id: 'chapter-achievements', label: 'THE TRIUMPH', num: '04' },
    { id: 'chapter-contact', label: 'THE HORIZON', num: '05' }
  ];

  useEffect(() => {
    if (isReneOpen) setLoadReneChat(true);
  }, [isReneOpen]);

  useEffect(() => {
    if (!isMobile) {
      setShowSwipeHint(false);
      return;
    }

    setShowSwipeHint(true);
    const timer = window.setTimeout(() => {
      setShowSwipeHint(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [isMobile, activeProject]);

  useEffect(() => {
    setupChapterFlashes(flashOverlayRef2);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
  // Node descriptions for the ATLAS, NEXORA, and STRATOS interactive architectures
  const NODE_DETAILS: Record<string, { title: string; desc: string; status: string; load: string }> = {
    'input': { title: 'WORKLOAD INGEST', desc: 'Accepts raw startup ideas, tasks, or event triggers, injecting them into the pipeline.', status: 'Active', load: '12 events/s' },
    'planner': { title: 'DAG PLANNER', desc: 'Analyzes workloads, resolves dependencies, and plans an optimal execution DAG.', status: 'Idle', load: '0.2ms latency' },
    'guard': { title: 'RECURSION GUARD', desc: 'Audits circular dependencies and protects event pipelines from recursive loops.', status: 'Active', load: 'Safe (Depth 0)' },
    'aegis': { title: 'AEGIS SANDBOX', desc: 'Executes workloads in strict Docker-isolated secure runtime environments.', status: 'Running', load: '3 sandboxes active' },
    'swarm': { title: 'SWARM AGENTS', desc: 'Multi-agent network performing concurrent validation, testing, and optimization.', status: 'Analyzing', load: '5 agents active' },
    'output': { title: 'PRODUCTION ARTIFACT', desc: 'Compiles, assets-bundles, and delivers production-grade enterprise deployments.', status: 'Completed', load: 'Ready' },
    'stratos-queue': { title: 'REDIS QUEUE CLUSTER', desc: 'Manages job queueing, visited-URL bloom filters, and dead-letter loop guards.', status: 'Active', load: '1,280 jobs in queue' },
    'stratos-worker': { title: 'PLAYWRIGHT & AIOHTTP ENGINE', desc: 'Dual-mode execution pool using Playwright for dynamic JS and aiohttp for high-concurrency scraping.', status: 'Running', load: '12 active threads' },
    'stratos-pipeline': { title: 'DOM HEURISTIC & LLM PROCESSOR', desc: 'Extracts tabular structures using DOM clustering with LLM fallback via Groq/OpenAI APIs.', status: 'Analyzing', load: '0.85 F1-Score' },
    'stratos-persistence': { title: 'TRIPLE-STORE PERSISTENCE', desc: 'Streams crawled data to PostgreSQL (jobs), Elasticsearch (search indices), and raw HTML vault storage.', status: 'Streaming', load: '8.4 MB/s written' },
    'stratos-outputs': { title: 'DELIVERY PIPELINE', desc: 'Formats data as Parquet, CSV, or JSON and emails files dynamically via Gmail OAuth API integration.', status: 'Idle', load: 'Ready' },
    'nexora-submit': { title: 'SUBMIT TICKET', desc: 'Customer raises a support ticket via multi-channel forms or real-time event triggers.', status: 'Active', load: '14 tickets/min' },
    'nexora-triage': { title: 'TRIAGE (AI CORE)', desc: 'Gemini 2.0 model classifies priority, conducts sentiment checks, and suggests routes.', status: 'Triage AI', load: '0.45s classification latency' },
    'nexora-assign': { title: 'ASYNCIO ASSIGNMENT', desc: 'Asynchronous engine maps open tickets to available agents dynamically.', status: 'Running', load: '0.1s allocation speed' },
    'nexora-escalate': { title: 'ESCALATION PATH', desc: 'Supervisors alerted instantly upon ticket SLA breach alerts or critical tags.', status: 'Monitored', load: 'Zero SLA breaches' },
    'nexora-resolve': { title: 'RESOLVE & ASSIST', desc: 'Support agents close resolved tickets with real-time generative AI draft assistance.', status: 'Active', load: '94.2% CSAT score' },
    'nexora-close': { title: 'CLOSE & ARCHIVE', desc: 'Ticket archived to MySQL/SQLite and triggers automated CSAT recording.', status: 'Completed', load: 'Database written' }
  };

  // High performance passive throttled scroll listener
  useEffect(() => {
    let ticking = false;
    let scrollTimeout: NodeJS.Timeout | number;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const viewportHeight = window.innerHeight;
          const scrollHeight = document.documentElement.scrollHeight;
          
          // Calculate scroll percentage
          const maxScroll = scrollHeight - viewportHeight;
          const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
          setScrollPercent(pct);

          // Update active chapter
          let currentActive = 0;
          for (let i = 0; i < CHAPTERS.length; i++) {
            const el = document.getElementById(CHAPTERS[i].id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= viewportHeight / 2 + 10) {
                currentActive = i;
              }
            }
          }
          setActiveChapter(currentActive);

          // Update active horizontal subscene
          if (currentActive === 2 && horizontalRef.current) {
            const rect = horizontalRef.current.getBoundingClientRect();
            const offsetLeft = Math.abs(rect.left);
            const width = window.innerWidth;
            if (offsetLeft < width * 0.5) {
              setSubScene('atlas');
            } else if (offsetLeft < width * 1.5) {
              setSubScene('nexora');
            } else {
              setSubScene('stratos');
            }
          } else {
            setSubScene(null);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // Post-mount triggers alignment
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Chapter 1 (Origin) Premium Staggered Entrance + Parallax
  useEffect(() => {
    if (!originRef.current) return;

    const d = (n: number) => gsapDur(n, isMobile);

    const ctx = gsap.context(() => {
      gsap.fromTo('.origin-label', 
        { opacity: 0, x: -20 },
        { 
          opacity: 1, x: 0, duration: d(0.6), 
          ease: 'power3.out',
          scrollTrigger: { trigger: originRef.current, start: 'top 75%', toggleActions: 'restart none none reset', invalidateOnRefresh: true }
        }
      );

      // Headline + body paragraphs: staggered fade-in (800ms each, 100ms stagger)
      gsap.fromTo('.origin-line', {
        opacity: 0,
        y: 20,
        scale: 1
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: d(0.8),
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: originRef.current,
          start: 'top 75%',
          toggleActions: 'restart none none reset',
          invalidateOnRefresh: true,
        }
      });

      gsap.fromTo('.closing-statement',
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: d(0.9),
          ease: 'power3.out',
          delay: 0.6,
          scrollTrigger: { trigger: originRef.current, start: 'top 60%', toggleActions: 'restart none none reset', invalidateOnRefresh: true }
        }
      );

      gsap.fromTo('.origin-links',
        { opacity: 0, y: 15 },
        {
          opacity: 1, y: 0,
          duration: d(0.6),
          ease: 'power2.out',
          delay: 0.8,
          scrollTrigger: { trigger: originRef.current, start: 'top 60%', toggleActions: 'restart none none reset', invalidateOnRefresh: true }
        }
      );

      gsap.to('.coord-blur-origin', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: originRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    }, originRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isMobile]);

  // Removed aggressive GSAP-based snap per product request.

  // Hero & Global Section Parallax Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Purple nebula moves slower and fades out (dist-parallax)
      gsap.to('.nebula-purple', {
        yPercent: 25,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#chapter-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      // 2. Emerald nebula moves slightly faster and fades out (mid-parallax)
      gsap.to('.nebula-emerald', {
        yPercent: -15,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#chapter-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      // 3. Tech grid moves at 10% and fades out
      gsap.to('.tech-grid-overlay', {
        yPercent: 10,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#chapter-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      // 4. Robot container moves at 15% and fades out
      gsap.to('.robot-container', {
        yPercent: 15,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#chapter-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      // 5. Name and tagline layers move and fade out (40% - 60% scroll speed)
      gsap.to('.hero-headline', {
        y: () => window.innerHeight * 0.45,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#chapter-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      gsap.to('.hero-tagline', {
        y: () => window.innerHeight * 0.32,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#chapter-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Chapter 2 (Projects) Horizontal Scroll Snapping Carousel Animation
  useEffect(() => {
    if (!buildRef.current || !horizontalRef.current) return;

    const ctx = gsap.context(() => {
      const scrollWidth = horizontalRef.current!.scrollWidth;
      const viewportWidth = window.innerWidth;
      
      gsap.to(horizontalRef.current, {
        x: () => -(scrollWidth - viewportWidth),
        ease: 'none',
        scrollTrigger: {
          id: 'projects-trigger',
          trigger: buildRef.current,
          start: 'top top',
          end: () => `+=${scrollWidth - viewportWidth}`,
          scrub: 0.3,
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / 2, // Snap perfectly between the 3 project panels (0, 0.5, 1)
            duration: { min: 0.2, max: 0.4 },
            delay: 0.05,
            ease: 'power2.inOut'
          },
          onUpdate: (self) => {
                const progress = self.progress;
                // Map scroll progress to project indices (3 panels -> indices 0,1,2)
                const panels = 3;
                const idx = Math.round(progress * (panels - 1));
                setActiveProject(Math.min(Math.max(idx, 0), panels - 1));
          }
        }
      });
    }, buildRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Chapter 3 (Skills/Arsenal) Premium Staggered Pop-in
  useEffect(() => {
    if (!arsenalRef.current) return;

    const ctx = gsap.context(() => {
      // Section label fade-in
      gsap.fromTo('.arsenal-label',
        { opacity: 0, x: -15 },
        {
          opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: arsenalRef.current, start: 'top 65%', toggleActions: 'play none none none' }
        }
      );

      // Headline: scale up while fading in (0.95→1, 700ms)
      gsap.fromTo('.arsenal-headline',
        { opacity: 0, scale: 0.95, y: 15 },
        {
          opacity: 1, scale: 1, y: 0, duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: arsenalRef.current, start: 'top 65%', toggleActions: 'play none none none' }
        }
      );

      // Subheading fade-in
      gsap.fromTo('.arsenal-sub',
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.6, delay: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: arsenalRef.current, start: 'top 65%', toggleActions: 'play none none none' }
        }
      );

      // Cards: pop in with stagger (scale 0.9→1, 600ms, 200ms between)
      // Cards and skill items remain static to avoid accidental hiding;
      // animations were removed to ensure all cards are visible at render.
    }, arsenalRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Chapter 4 (Achievements) Premium Entrance + Count-Up
  useEffect(() => {
    if (!winRef.current) return;

    const d = (n: number) => gsapDur(n, isMobile);

    const ctx = gsap.context(() => {
      // Achievement badge: scale in with overshoot
      gsap.fromTo('.achievement-badge',
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: d(0.7), ease: 'back.out(1.7)',
          scrollTrigger: { trigger: winRef.current, start: 'top 55%', toggleActions: 'play none none none', invalidateOnRefresh: true }
        }
      );

      // Main headline: staggered fade-in
      gsap.fromTo('.achievement-title',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: d(0.8), ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: winRef.current, start: 'top 55%', toggleActions: 'play none none none', invalidateOnRefresh: true }
        }
      );

      // Subtitle
      gsap.fromTo('.achievement-subtitle',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: d(0.6), ease: 'power2.out', delay: 0.4,
          scrollTrigger: { trigger: winRef.current, start: 'top 55%', toggleActions: 'play none none none', invalidateOnRefresh: true }
        }
      );

      // Score grid fade in
      gsap.fromTo('.achievement-scores',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: d(0.7), ease: 'power3.out', delay: 0.5,
          scrollTrigger: { trigger: winRef.current, start: 'top 50%', toggleActions: 'play none none none', invalidateOnRefresh: true }
        }
      );

      // Teams counter: count-up animation (1.2s ease-in-out)
      const counterObj = { val: 0 };
      gsap.to(counterObj, {
        val: 150,
        duration: d(1.2),
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: winRef.current,
          start: 'top 45%',
          toggleActions: 'play none none reverse',
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          setTeamsCount(Math.floor(counterObj.val));
        },
      });

      // Triumph glow breathing
      gsap.to('.triumph-glow', {
        scale: 1.15,
        opacity: 0.85,
        duration: d(2),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.triumph-glow', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: winRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    }, winRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isMobile]);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Simple smooth scroll for all chapter navigation (no cinematic flash)
    el.scrollIntoView({ behavior: 'smooth' });
  };

  // Horizontal Projects Carousel Navigation Helper
  const handleNavigateProject = (idx: number) => {
    if (!buildRef.current || !horizontalRef.current) return;
    const scrollWidth = horizontalRef.current!.scrollWidth;
    const viewportWidth = window.innerWidth;
    const travel = scrollWidth - viewportWidth; // total horizontal travel mapped to vertical scroll

    // Panels count (we use 3 panels laid out as 0, 0.5, 1 progress)
    const panels = 3;
    const progress = (idx / (panels - 1));

    // Compute the vertical scroll position for the start of the pinned build section
    const buildTop = buildRef.current.getBoundingClientRect().top + window.scrollY;

    const target = buildTop + progress * travel;

    window.scrollTo({ top: Math.round(target), behavior: 'smooth' });
  };

  const handleProjectTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0].screenX;
    touchStartY.current = event.changedTouches[0].screenY;
  };

  const handleProjectTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const touchEndX = event.changedTouches[0].screenX;
    const touchEndY = event.changedTouches[0].screenY;
    const distanceX = touchStartX.current - touchEndX;
    const distanceY = Math.abs(touchStartY.current - touchEndY);

    if (distanceY > 80) return;

    if (distanceX > 50) {
      handleNavigateProject(activeProject + 1);
    } else if (distanceX < -50) {
      handleNavigateProject(activeProject - 1);
    }
  };

  return (
    <div className={`relative w-full bg-background text-[#f5f5f5] overflow-x-hidden select-none`} style={{ touchAction: 'pan-y' }}>
      
      {/* Cinematic Flash Overlay for THE BUILD transition */}
      <div
        ref={flashOverlayRef}
        className="fixed inset-0 bg-white z-[9999] pointer-events-none"
        style={{ opacity: 0 }}
        aria-hidden
      />

      {/* Black Flash for Section Snaps */}
      <div
        ref={flashOverlayRef2}
        className="fixed inset-0 bg-black z-[9998] pointer-events-none"
        style={{ opacity: 0 }}
        aria-hidden
      />
      
      {/* 1. CINEMATIC SIDE PROGRESS INDICATOR */}
      <div 
        className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-5 z-50 pointer-events-auto mix-blend-difference hidden md:flex"
        aria-label="Story Chapters Navigation"
      >
        {CHAPTERS.map((ch, idx) => {
          const isActive = idx === activeChapter;
          return (
            <button
              key={ch.id}
              onClick={() => scrollToChapter(ch.id)}
              className="group flex items-center gap-4 cursor-pointer text-right outline-none focus:outline-none"
            >
              {/* Tooltip Label */}
              <span className={`text-[10px] uppercase font-light tracking-[0.25em] transition-all duration-500 ${
                isActive ? 'opacity-90 text-accent translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-60 group-hover:translate-x-0'
              }`}>
                {ch.num} // {ch.label}
              </span>
              
              {/* Visual Indicator Dot */}
              <span className={`relative w-[6px] h-[6px] rounded-full transition-all duration-500 ${
                isActive ? 'bg-accent scale-150 shadow-[0_0_10px_#E8E8E8]' : 'bg-white/20 group-hover:bg-white/50'
              }`}>
                {isActive && (
                  <span className="absolute -inset-1.5 rounded-full border border-accent/40 animate-ping" />
                )}
              </span>
            </button>
          );
        })}
      </div>


      {/* CHAPTER 0 — HERO (Full Screen Landing) */}
      <section id="chapter-hero" className="relative w-full h-screen overflow-hidden" style={{ scrollSnapAlign: 'start' }}>
        {/* Cinematic Spline background */}
        <SplineHero />

        {/* Soft Cosmic Purple/Indigo Nebula Blur */}
        <div 
          className="absolute left-[10%] top-[15%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-40 -z-20 nebula-purple" 
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.09) 0%, rgba(59, 130, 246, 0.03) 60%, transparent 100%)' }} 
          aria-hidden
        />
        {/* Soft Cosmic Emerald/Green Nebula Blur */}
        <div 
          className="absolute right-[5%] bottom-[10%] w-[550px] h-[550px] rounded-full blur-[120px] pointer-events-none opacity-30 -z-20 nebula-emerald" 
          style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.02) 60%, transparent 100%)' }} 
          aria-hidden
        />

        {/* Subtle technological SVG grid backdrop (same as about me) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-10 tech-grid-overlay">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* Large developer coordinate background blur (same as about me) */}
        <div className="absolute right-[20%] top-[30%] w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none coord-blur" />
        
        {/* Large developer name + typewriter subhead overlay */}
        <HeroContent />
        
        {/* Subtle scroll-down breathing indicator — appears after hero sequence */}
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-40 scroll-breathe transition-opacity duration-1000"
          style={{ opacity: scrollPercent > 5 ? 0 : undefined }}
        >
          <span 
            className="text-[9px] uppercase tracking-[0.3em] font-light text-white/80"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            Scroll to unfold
          </span>
          <svg className="w-4 h-4 text-accent drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>


      {/* CHAPTER 1 — ORIGIN (CS Undergrad, 9.13 CGPA Story Beat) */}
      {/* CHAPTER 1 — ORIGIN (Fluid, Dynamic, Adaptive Enterprise Layout) */}
      <section 
        id="chapter-origin" 
        ref={originRef}
        className="relative w-full min-h-screen bg-[#050505] border-t border-white/5 py-24 md:py-32 flex items-center justify-center overflow-visible px-8 md:px-16 lg:px-24"
        style={{ scrollSnapAlign: 'start' }}
      >
        {/* Subtle technological SVG grid backdrop (extremely faint for luxury negative space) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="origin-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#origin-grid)" />
          </svg>
        </div>
        
        {/* Large Kolkata coordinate background blur (extremely soft atmospheric bounce light) */}
        <div className="absolute right-[20%] top-[30%] w-96 h-96 bg-accent/[0.03] rounded-full blur-3xl -z-10 coord-blur-origin" />

        <div className="max-w-4xl w-full text-left flex flex-col justify-center">
          <div className="origin-label text-xs md:text-sm font-semibold uppercase tracking-[0.4em] text-[#C9A961] mb-3 block select-none opacity-0">
            <ScrambleText text="01 // THE ORIGIN" />
          </div>
          
          <div className="space-y-4 md:space-y-5 max-w-4xl">
            <h2 
              className="origin-line line-1 text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-white/95 opacity-0 translate-y-5" 
              style={{ fontFamily: 'var(--font-display)', lineHeight: '1.25' }}
            >
              Started in <ScrambleText text="Kolkata" className="text-[#C9A961] font-semibold italic" />. Ended up building AI.
            </h2>
            
            <p 
              className="origin-line line-2 text-lg md:text-xl text-white/80 font-light leading-relaxed opacity-0 translate-y-5"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              I'm Ganesh, a CS undergrad specializing in AI/ML with a strong foundation in systems and software engineering.
            </p>
            
            <p 
              className="origin-line line-3 text-lg md:text-xl text-white/90 font-semibold leading-relaxed opacity-0 translate-y-5"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              I don't just study AI. <ScrambleText text="I ship it." className="text-[#C9A961] font-bold" />
            </p>
            
            <p 
              className="origin-line line-4 text-base md:text-lg text-white/70 font-light leading-relaxed opacity-0 translate-y-5"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              From multi-agent orchestration platforms that won national hackathons, to production full-stack systems serving real users, everything I build is engineered to run in the real world, not exist as a proof of concept.
            </p>
 
            <p 
              className="origin-line line-5 text-base md:text-lg text-white/70 font-light leading-relaxed opacity-0 translate-y-5"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              My fundamentals run deep: <ScrambleText text="C, C++, Java, Python" className="font-mono text-[#C9A961] font-medium" />, languages I actually understand, not just syntax I've copied. Backed by solid grounding in Data Structures & Algorithms, Object-Oriented Programming, Operating Systems, and Database Management Systems.
            </p>
 
            <p 
              className="origin-line line-6 text-lg text-white/90 font-semibold tracking-wide pt-2 opacity-0 translate-y-5"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              My stack runs deeper.
            </p>

            <div className="origin-line line-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 text-xs md:text-sm font-light text-white/70 max-w-4xl pt-1 opacity-0 translate-y-5 select-none pointer-events-none">
              <div className="flex flex-col gap-1.5 bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 shadow-[inset_0_0_12px_rgba(255,255,255,0.01)]"><span className="text-[#C9A961] font-mono font-semibold text-[10px] uppercase tracking-wider">Backend</span> Python, FastAPI, asyncio</div>
              <div className="flex flex-col gap-1.5 bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 shadow-[inset_0_0_12px_rgba(255,255,255,0.01)]"><span className="text-[#C9A961] font-mono font-semibold text-[10px] uppercase tracking-wider">Frontend</span> React 19, TypeScript, Three.js, Framer Motion</div>
              <div className="flex flex-col gap-1.5 bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 shadow-[inset_0_0_12px_rgba(255,255,255,0.01)]"><span className="text-[#C9A961] font-mono font-semibold text-[10px] uppercase tracking-wider">Data Layer</span> Redis, PostgreSQL, MySQL, ChromaDB, Elasticsearch</div>
              <div className="flex flex-col gap-1.5 bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 shadow-[inset_0_0_12px_rgba(255,255,255,0.01)]"><span className="text-[#C9A961] font-mono font-semibold text-[10px] uppercase tracking-wider">AI Layer</span> LangChain, MCP, OpenAI, Groq, Gemini 2.0</div>
              <div className="flex flex-col gap-1.5 bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 shadow-[inset_0_0_12px_rgba(255,255,255,0.01)]"><span className="text-[#C9A961] font-mono font-semibold text-[10px] uppercase tracking-wider">Infrastructure</span> Docker, OAuth2, JWT, Playwright</div>
              <div className="flex flex-col gap-1.5 bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 shadow-[inset_0_0_12px_rgba(255,255,255,0.01)] justify-center"><span className="text-[#C9A961] font-mono font-semibold text-[10px] uppercase tracking-wider">Adaptive</span> And whatever the problem needs.</div>
            </div>

            <p 
              className="origin-line line-8 text-base md:text-lg text-white/75 font-light leading-relaxed pt-2 opacity-0 translate-y-5"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              The question I keep building toward: <span className="text-white font-medium">how far can autonomous AI actually go?</span>
            </p>
 
            <div 
              className="closing-statement text-2xl md:text-4xl font-extrabold tracking-tight opacity-0 translate-y-5 scale-95 pt-2"
              style={{ 
                fontFamily: 'var(--font-body)',
                lineHeight: '1.25'
              }}
            >
              <ScrambleText text="The systems are live. The story isn't finished" className="text-[#E8E8E8] drop-shadow-[0_0_30px_rgba(232,232,232,0.12)]" /><span className="text-[#C9A961] drop-shadow-[0_0_15px_rgba(201,169,97,0.45)] font-extrabold font-mono">.</span>
            </div>
 
            {/* Small side-by-side links */}
            <div className="origin-links flex items-center gap-6 opacity-0 translate-y-5 pt-2 pointer-events-auto">
              <a 
                href="https://github.com/GaneshBamalwa" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#D4AF37] transition-colors duration-300 pointer-events-auto"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                </svg>
                <span className="font-mono">GaneshBamalwa</span>
              </a>
              <a 
                href="https://linkedin.com/in/ganeshbamalwa" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#D4AF37] transition-colors duration-300 pointer-events-auto"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="font-mono">ganeshbamalwa</span>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* CHAPTER 2 — THE BUILD (ATLAS, Nexora & STRATOS Horizontal showcase) */}
      <section 
        id="chapter-projects" 
        ref={buildRef}
        className="relative w-full h-screen bg-[#030303]"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div 
          ref={horizontalRef}
          className="sticky top-0 h-screen w-[300vw] flex flex-row items-center overflow-hidden"
          onTouchStart={handleProjectTouchStart}
          onTouchEnd={handleProjectTouchEnd}
        >
          
          {/* PANEL 2A: ATLAS PROJECT (Node Graph reveal) */}
          <div className={`w-[100vw] h-full flex flex-col lg:flex-row items-center justify-between px-14 md:px-20 lg:px-28 py-16 gap-10 transition-all duration-700 ease-out ${
            activeProject === 0 ? 'opacity-100 scale-100' : 'opacity-35 scale-[0.88] pointer-events-none'
          }`}>
                 {/* Project Spec details */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center select-none text-left z-20 max-md:gap-3 max-md:p-4 max-md:max-w-full">
              <span className="text-xs font-light uppercase tracking-[0.35em] text-accent mb-3 block">
                02 // THE BUILD
              </span>
              <div className="relative mb-6">
                <div className="absolute -top-[64px] -left-[10px] font-black leading-none select-none pointer-events-none text-[8.5rem]" style={{ color: 'rgba(255,255,255,0.012)', fontFamily: 'var(--font-body)', fontWeight: 900 }}>01</div>
                <h3 
                  className="text-5xl md:text-7xl font-light tracking-tight mb-0 uppercase project-title-atlas relative z-10" 
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  ATLAS
                </h3>
              </div>
              <p className="text-accent font-mono text-xs uppercase tracking-wider mb-2">
                "Not a chatbot. A control plane."
              </p>
              <p className="text-[#C9A961] font-mono text-[10px] uppercase tracking-wider mb-5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A961] animate-pulse" />
                Won 1st place at Samsung PRISM out of 150+ competing teams.
              </p>
              <p 
                className="text-base md:text-lg text-white/70 leading-relaxed font-light mb-6 max-w-xl project-description-text max-md:line-clamp-3 max-md:overflow-hidden"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                A distributed multi-agent AI orchestration platform. Built to take natural language requests, decompose them into structured multi-step workflows, and execute them across specialized services — with every reasoning step visible in real time.
              </p>

              {/* GitHub Link Button — its own row above tags */}
              <div className="mb-4 max-md:order-4 md:order-none max-md:w-full">
                <a 
                  href="https://github.com/GaneshBamalwa/atlas" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="github-project-btn github-btn-atlas pointer-events-auto max-md:w-full max-md:justify-center"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>

              {/* Tech Tags — wrapping row below GitHub button */}
              <div className={`flex flex-wrap gap-x-2 gap-y-2 w-full max-w-full mb-6 transition-all duration-700 delay-200 ${
                activeProject === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}>
                {['Python', 'FastAPI', 'LangChain', 'React', 'TypeScript', 'Redis', 'ChromaDB', 'Docker', 'ReactFlow', 'Google APIs', 'MCP'].map(tag => (
                  <span key={tag} className="tech-pill-atlas whitespace-nowrap flex-shrink-0">
                    {tag}
                  </span>
                ))}
              </div>
 
              {/* Interaction instruction */}
              <div className="flex items-center gap-2 text-[11px] font-mono hint-terminal-prompt-green uppercase tracking-wider select-none max-md:order-6 md:order-none">
                <span>&gt; Hover nodes on the graph to inspect runtime states.</span>
                <span className="terminal-cursor font-bold">_</span>
              </div>
            </div>
 
            {/* Visual Interactive Node Graph */}
            <div className="w-full lg:w-[50%] h-64 md:h-[50vh] lg:h-[70vh] flex items-center justify-center relative hover-lift-card overflow-x-auto md:overflow-visible">
              <div className="absolute inset-0 project-right-panel project-right-panel-atlas -z-10" style={{ background: 'radial-gradient(ellipse at center, rgba(232, 232, 232, 0.04) 0%, rgba(0, 0, 0, 0.6) 70%)' }} />
              
              <svg viewBox="0 0 600 450" className="w-full h-full p-6 select-none max-w-xl min-w-[520px] md:min-w-0 mx-auto" style={{ overflow: 'visible' }}>
                <defs>
                  {/* Glowing neon shadow filter */}
                  <filter id="glow-platinum" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Animated Pulsing Connectors */}
                {/* 1. Input -> Planner */}
                <path d="M 80 225 L 200 135" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 80 225 L 200 135" stroke="#E8E8E8" strokeWidth="2.5" fill="none" className="pulse-path opacity-80" />

                {/* 2. Input -> Swarm */}
                <path d="M 80 225 L 200 315" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 80 225 L 200 315" stroke="#E8E8E8" strokeWidth="2.5" fill="none" className="pulse-path opacity-80" />

                {/* 3. Planner -> Guard */}
                <path d="M 200 135 L 340 135" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 200 135 L 340 135" stroke="#E8E8E8" strokeWidth="2.5" fill="none" className="pulse-path opacity-80" />

                {/* 4. Swarm -> Sandbox */}
                <path d="M 200 315 L 340 315" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 200 315 L 340 315" stroke="#E8E8E8" strokeWidth="2.5" fill="none" className="pulse-path opacity-80" />

                {/* 5. Guard -> Output */}
                <path d="M 340 135 L 500 225" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 340 135 L 500 225" stroke="#E8E8E8" strokeWidth="2.5" fill="none" className="pulse-path opacity-80" />

                {/* 6. Sandbox -> Output */}
                <path d="M 340 315 L 500 225" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 340 315 L 500 225" stroke="#E8E8E8" strokeWidth="2.5" fill="none" className="pulse-path opacity-80" />

                {/* Interactive SVG Nodes */}
                {/* NODE 1: Ingestion */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('input')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="80" cy="225" r="30" fill="#0c0c0c" stroke="#E8E8E8" strokeWidth="2.5" filter="url(#glow-platinum)" className="transition-all duration-300 group-hover:fill-accent/10" />
                  <text x="80" y="229" fill="white" fontSize="9" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">INGEST</text>
                </g>

                {/* NODE 2: Planner */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('planner')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="200" cy="135" r="30" fill="#0c0c0c" stroke="#E8E8E8" strokeWidth="2" filter="url(#glow-platinum)" className="transition-all duration-300 group-hover:fill-accent/10" />
                  <text x="200" y="139" fill="white" fontSize="9" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">PLANNER</text>
                </g>

                {/* NODE 3: Swarm */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('swarm')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="200" cy="315" r="30" fill="#0c0c0c" stroke="#E8E8E8" strokeWidth="2" filter="url(#glow-platinum)" className="transition-all duration-300 group-hover:fill-accent/10" />
                  <text x="200" y="319" fill="white" fontSize="9" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">SWARM</text>
                </g>

                {/* NODE 4: Guard */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('guard')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="340" cy="135" r="30" fill="#0c0c0c" stroke="#E8E8E8" strokeWidth="2" filter="url(#glow-platinum)" className="transition-all duration-300 group-hover:fill-accent/10" />
                  <text x="340" y="139" fill="white" fontSize="8" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">GUARD</text>
                </g>

                {/* NODE 5: Sandbox */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('aegis')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="340" cy="315" r="30" fill="#0c0c0c" stroke="#E8E8E8" strokeWidth="2" filter="url(#glow-platinum)" className="transition-all duration-300 group-hover:fill-accent/10" />
                  <text x="340" y="319" fill="white" fontSize="8" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">SANDBOX</text>
                </g>

                {/* NODE 6: Output */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('output')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="500" cy="225" r="34" fill="#E8E8E8" stroke="#E8E8E8" strokeWidth="2" filter="url(#glow-platinum)" className="transition-all duration-300 group-hover:opacity-90" />
                  <text x="500" y="229" fill="#050505" fontSize="9" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">DEPLOY</text>
                </g>
              </svg>

              {/* Dynamic Overlay HUD Info box */}
              <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-xl border bg-black/85 backdrop-blur-md transition-all duration-300 text-left ${
                activeNode && !activeNode.startsWith('stratos-') && !activeNode.startsWith('nexora-') ? 'opacity-100 scale-100 border-accent/40' : 'opacity-0 scale-95 border-white/5 pointer-events-none'
              }`}>
                {activeNode && !activeNode.startsWith('stratos-') && !activeNode.startsWith('nexora-') && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="col-span-2 border-b border-white/10 pb-1.5 mb-1.5 flex items-center justify-between">
                      <span className="font-mono text-accent uppercase font-bold tracking-wider">{NODE_DETAILS[activeNode].title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 text-[9px] text-accent border border-accent/25">{NODE_DETAILS[activeNode].status}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block mb-0.5">Function</span>
                      <span className="text-white/90 text-[11px] leading-relaxed block">{NODE_DETAILS[activeNode].desc}</span>
                    </div>
                    <div className="pl-4 border-l border-white/10 flex flex-col justify-center">
                      <span className="text-white/40 block mb-0.5">Telemetry</span>
                      <span className="font-mono text-accent text-[13px]">{NODE_DETAILS[activeNode].load}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PANEL 2B: NEXORA PROJECT */}
          <div className={`w-[100vw] h-full flex flex-col lg:flex-row items-center justify-between px-14 md:px-20 lg:px-28 py-16 gap-10 bg-[#060606] transition-all duration-700 ease-out ${
            activeProject === 1 ? 'opacity-100 scale-100' : 'opacity-35 scale-[0.88] pointer-events-none'
          }`}>
                 {/* Description */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center select-none text-left z-20 max-md:gap-3 max-md:p-4 max-md:max-w-full">
              <span className="text-xs font-light uppercase tracking-[0.35em] text-[#b464ff] mb-3 block">
                02 // THE BUILD
              </span>
              <div className="relative mb-6">
                <div className="absolute -top-[64px] -left-[10px] font-black leading-none select-none pointer-events-none text-[8.5rem]" style={{ color: 'rgba(255,255,255,0.012)', fontFamily: 'var(--font-body)', fontWeight: 900 }}>02</div>
                <h3 
                  className="text-5xl md:text-7xl font-light tracking-tight mb-0 uppercase project-title-nexora relative z-10" 
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  NEXORA
                </h3>
              </div>
              <p className="text-[#b464ff] font-mono text-xs uppercase tracking-wider mb-6">
                "Built to be secure, scalable, and actually nice to use."
              </p>
              <p 
                className="text-base md:text-lg text-white/70 leading-relaxed font-light mb-6 max-w-xl project-description-text max-md:line-clamp-3 max-md:overflow-hidden"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                A production-ready AI-powered customer support platform. Three user tiers, 25+ REST endpoints, a full ticket lifecycle, and an AI engine that triages requests and assists agents in real time.
              </p>
              
              <div className={`flex flex-wrap gap-x-2 gap-y-2 w-full max-w-full mb-6 transition-all duration-700 delay-200 ${
                activeProject === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}>
                {['FastAPI', 'React 19', 'Gemini 2.0', 'MySQL', 'SQLite', 'JWT', 'bcrypt', 'Three.js', 'Framer Motion', 'Tailwind CSS', 'Recharts'].map(tag => (
                  <span key={tag} className="tech-pill-nexora whitespace-nowrap flex-shrink-0">
                    {tag}
                  </span>
                ))}
              </div>

              {/* GitHub Link Button */}
              <div className="mb-8 flex flex-col gap-4 max-md:order-4 md:order-none max-md:w-full">
                <a 
                  href="https://github.com/GaneshBamalwa/nexora" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="github-project-btn github-btn-nexora w-max pointer-events-auto max-md:w-full max-md:justify-center"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                  </svg>
                  <span>GitHub</span>
                </a>
                
                {/* Interaction instruction */}
                <div className="flex items-center gap-2 text-[11px] font-mono hint-terminal-prompt-purple uppercase tracking-wider select-none max-md:order-6 md:order-none">
                  <span>&gt; Hover nodes on the graph to inspect support workflow.</span>
                  <span className="terminal-cursor font-bold">_</span>
                </div>
              </div>
            </div>
 
            {/* Visual Interactive Node Graph */}
            <div className="w-full lg:w-[50%] h-64 md:h-[50vh] lg:h-[70vh] flex items-center justify-center relative hover-lift-card overflow-x-auto md:overflow-visible">
              <div className="absolute inset-0 project-right-panel project-right-panel-nexora -z-10" style={{ background: 'radial-gradient(ellipse at center, rgba(180, 100, 255, 0.04) 0%, rgba(0, 0, 0, 0.6) 70%)' }} />
              
              <svg viewBox="0 0 600 450" className="w-full h-full p-6 select-none max-w-xl min-w-[520px] md:min-w-0 mx-auto" style={{ overflow: 'visible' }}>
                <defs>
                  {/* Glowing neon shadow filter */}
                  <filter id="glow-purple" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-triage" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="12" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Animated Pulsing Connectors */}
                {/* 1. SUBMIT -> TRIAGE */}
                <path d="M 60 225 L 180 225" stroke="rgba(180,100,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 60 225 L 180 225" stroke="#b464ff" strokeWidth="2.5" fill="none" className="pulse-path opacity-80" />

                {/* 2. TRIAGE -> ASSIGN */}
                <path d="M 180 225 L 300 225" stroke="rgba(180,100,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 180 225 L 300 225" stroke="#b464ff" strokeWidth="2.5" fill="none" className="pulse-path opacity-80" />

                {/* 3. TRIAGE -> ESCALATE */}
                <path d="M 180 225 L 180 360" stroke="rgba(180,100,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 180 225 L 180 360" stroke="#ef4444" strokeWidth="2.5" fill="none" className="pulse-path opacity-80" />

                {/* 4. ASSIGN -> RESOLVE */}
                <path d="M 300 225 L 420 225" stroke="rgba(180,100,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 300 225 L 420 225" stroke="#b464ff" strokeWidth="2.5" fill="none" className="pulse-path opacity-80" />

                {/* 5. ESCALATE -> RESOLVE */}
                <path d="M 180 360 Q 300 360 420 225" stroke="rgba(180,100,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 180 360 Q 300 360 420 225" stroke="#b464ff" strokeWidth="2" fill="none" strokeDasharray="5,5" className="pulse-path opacity-60" />

                {/* 6. RESOLVE -> CLOSE */}
                <path d="M 420 225 L 540 225" stroke="rgba(180,100,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 420 225 L 540 225" stroke="#b464ff" strokeWidth="2.5" fill="none" className="pulse-path opacity-80" />

                {/* Interactive SVG Nodes */}
                {/* NODE 1: SUBMIT */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('nexora-submit')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="60" cy="225" r="28" fill="#050505" stroke="#b464ff" strokeWidth="2" filter="url(#glow-purple)" className="transition-all duration-300 group-hover:fill-[#b464ff]/10" />
                  <text x="60" y="229" fill="white" fontSize="9" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">SUBMIT</text>
                </g>

                {/* NODE 2: TRIAGE (AI CORE - Gemini 2.0) */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('nexora-triage')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  {/* Outer pulsing ring */}
                  <circle cx="180" cy="225" r="40" fill="none" stroke="#b464ff" strokeWidth="1" className="animate-ping opacity-25" />
                  <circle cx="180" cy="225" r="34" fill="#08050e" stroke="#c084fc" strokeWidth="3" filter="url(#glow-triage)" className="transition-all duration-300 group-hover:stroke-white" />
                  <text x="180" y="222" fill="#c084fc" fontSize="9" fontWeight="black" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace" className="group-hover:fill-white transition-colors duration-300">TRIAGE</text>
                  <text x="180" y="232" fill="white" fontSize="7" fontWeight="bold" letterSpacing="0.03em" textAnchor="middle" fontFamily="monospace" className="opacity-70">(AI)</text>
                </g>

                {/* NODE 3: ASSIGN */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('nexora-assign')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="300" cy="225" r="28" fill="#050505" stroke="#b464ff" strokeWidth="2" filter="url(#glow-purple)" className="transition-all duration-300 group-hover:fill-[#b464ff]/10" />
                  <text x="300" y="229" fill="white" fontSize="9" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">ASSIGN</text>
                </g>

                {/* NODE 4: ESCALATE */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('nexora-escalate')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="180" cy="360" r="28" fill="#050505" stroke="#ef4444" strokeWidth="2" filter="url(#glow-purple)" className="transition-all duration-300 group-hover:fill-red-500/10" />
                  <text x="180" y="364" fill="#ef4444" fontSize="8" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">ESCALATE</text>
                </g>

                {/* NODE 5: RESOLVE */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('nexora-resolve')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="420" cy="225" r="28" fill="#050505" stroke="#b464ff" strokeWidth="2" filter="url(#glow-purple)" className="transition-all duration-300 group-hover:fill-[#b464ff]/10" />
                  <text x="420" y="229" fill="white" fontSize="9" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">RESOLVE</text>
                </g>

                {/* NODE 6: CLOSE */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('nexora-close')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="540" cy="225" r="30" fill="#b464ff" stroke="#b464ff" strokeWidth="2" filter="url(#glow-purple)" className="transition-all duration-300 group-hover:opacity-90" />
                  <text x="540" y="229" fill="#050505" fontSize="9" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">CLOSE</text>
                </g>
              </svg>

              {/* Dynamic Overlay HUD Info box */}
              <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-xl border bg-black/85 backdrop-blur-md transition-all duration-300 text-left ${
                activeNode && activeNode.startsWith('nexora-') ? 'opacity-100 scale-100 border-[#b464ff]/40' : 'opacity-0 scale-95 border-white/5 pointer-events-none'
              }`}>
                {activeNode && activeNode.startsWith('nexora-') && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="col-span-2 border-b border-white/10 pb-1.5 mb-1.5 flex items-center justify-between">
                      <span className="font-mono text-[#b464ff] uppercase font-bold tracking-wider">{NODE_DETAILS[activeNode].title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#b464ff]/10 text-[9px] text-[#b464ff] border border-[#b464ff]/25">{NODE_DETAILS[activeNode].status}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block mb-0.5">Function</span>
                      <span className="text-white/90 text-[11px] leading-relaxed block">{NODE_DETAILS[activeNode].desc}</span>
                    </div>
                    <div className="pl-4 border-l border-white/10 flex flex-col justify-center">
                      <span className="text-white/40 block mb-0.5">Telemetry</span>
                      <span className="font-mono text-[#b464ff] text-[13px]">{NODE_DETAILS[activeNode].load}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PANEL 2C: STRATOS PROJECT */}
          <div className={`w-[100vw] h-full flex flex-col lg:flex-row items-center justify-between px-14 md:px-20 lg:px-28 py-16 gap-10 bg-[#040404] border-l border-white/5 transition-all duration-700 ease-out ${
            activeProject === 2 ? 'opacity-100 scale-100' : 'opacity-35 scale-[0.88] pointer-events-none'
          }`}>
                 {/* Project Spec details */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center select-none text-left z-20 max-md:gap-3 max-md:p-4 max-md:max-w-full">
              <span className="text-xs font-light uppercase tracking-[0.35em] text-amber-500 mb-3 block">
                02 // THE BUILD // PIPELINE MACHINE
              </span>
              <div className="relative mb-4">
                <div className="absolute -top-[64px] -left-[10px] font-black leading-none select-none pointer-events-none text-[8.5rem]" style={{ color: 'rgba(255,255,255,0.012)', fontFamily: 'var(--font-body)', fontWeight: 900 }}>03</div>
                <h3 
                  className="text-5xl md:text-7xl font-light tracking-tight mb-0 uppercase project-title-stratos relative z-10" 
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  STRATOS
                </h3>
              </div>
              
              {/* Story beat tagline */}
              <p className="text-amber-500 font-mono text-xs uppercase tracking-wider mb-6">
                "Not every problem needs an agent. Sometimes you need a machine."
              </p>
              
              <p 
                className="text-base md:text-lg text-white/70 leading-relaxed font-light mb-6 max-w-xl project-description-text max-md:line-clamp-3 max-md:overflow-hidden"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                A highly-distributed web scraping and data extraction infrastructure. Operates a Redis-backed queue crawler and a universal LLM-assisted parsing agent. Built for production-grade scraping pipelines that require rigorous data guarantees, dead-letter queue safety, and multiple format outputs.
              </p>
              
              {/* Tech Tags */}
              <div className={`flex flex-wrap gap-x-2 gap-y-2 w-full max-w-full mb-6 transition-all duration-700 delay-200 ${
                activeProject === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}>
                {['Python', 'FastAPI', 'asyncio', 'Redis', 'PostgreSQL', 'Elasticsearch', 'Playwright', 'Groq', 'Docker', 'Pandas', 'Selectolax'].map(tag => (
                  <span key={tag} className="tech-pill-stratos whitespace-nowrap flex-shrink-0">
                    {tag}
                  </span>
                ))}
              </div>

              {/* GitHub Link Button */}
              <div className="mb-8 max-md:order-4 md:order-none max-md:w-full">
                <a 
                  href="https://github.com/GaneshBamalwa/stratos" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="github-project-btn github-btn-stratos pointer-events-auto max-md:w-full max-md:justify-center"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
 
              {/* Interaction instruction */}
              <div className="flex items-center gap-2 text-[11px] font-mono hint-terminal-prompt-amber uppercase tracking-wider select-none max-md:order-6 md:order-none">
                <span>&gt; Hover machine components to inspect telemetry.</span>
                <span className="terminal-cursor font-bold">_</span>
              </div>
            </div>
 
            {/* Industrial SVG architecture diagram */}
            <div className="w-full lg:w-[50%] h-64 md:h-[50vh] lg:h-[70vh] flex items-center justify-center relative hover-lift-card overflow-x-auto md:overflow-visible">
              <div className="absolute inset-0 project-right-panel project-right-panel-stratos -z-10" style={{ background: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.04) 0%, rgba(0, 0, 0, 0.6) 70%)' }} />
              
              <svg viewBox="0 0 600 450" className="w-full h-full p-6 select-none max-w-xl min-w-[520px] md:min-w-0 mx-auto" style={{ overflow: 'visible' }}>
                <defs>
                  {/* Glowing amber shadow filter */}
                  <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Animated Pulsing Connectors */}
                {/* 1. Queue -> Worker */}
                <path d="M 80 225 L 200 225" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 80 225 L 200 225" stroke="#f59e0b" strokeWidth="2.5" fill="none" className="pulse-path-amber opacity-80" />

                {/* 2. Worker -> Pipeline */}
                <path d="M 200 225 L 320 225" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 200 225 L 320 225" stroke="#f59e0b" strokeWidth="2.5" fill="none" className="pulse-path-amber opacity-80" />

                {/* 3. Pipeline -> Persistence */}
                <path d="M 320 225 L 460 135" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 320 225 L 460 135" stroke="#f59e0b" strokeWidth="2.5" fill="none" className="pulse-path-amber opacity-80" />

                {/* 4. Pipeline -> Outputs */}
                <path d="M 320 225 L 460 315" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
                <path d="M 320 225 L 460 315" stroke="#f59e0b" strokeWidth="2.5" fill="none" className="pulse-path-amber opacity-80" />

                {/* Interactive SVG Nodes */}
                {/* NODE 1: Queue */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('stratos-queue')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="80" cy="225" r="30" fill="#0c0c0c" stroke="#f59e0b" strokeWidth="2.5" filter="url(#glow-amber)" className="transition-all duration-300 group-hover:fill-amber-500/10" />
                  <text x="80" y="229" fill="white" fontSize="9" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">QUEUE</text>
                </g>

                {/* NODE 2: Worker */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('stratos-worker')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="200" cy="225" r="30" fill="#0c0c0c" stroke="#f59e0b" strokeWidth="2" filter="url(#glow-amber)" className="transition-all duration-300 group-hover:fill-amber-500/10" />
                  <text x="200" y="229" fill="white" fontSize="9" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">WORKERS</text>
                </g>

                {/* NODE 3: Pipeline */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('stratos-pipeline')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="320" cy="225" r="30" fill="#0c0c0c" stroke="#f59e0b" strokeWidth="2" filter="url(#glow-amber)" className="transition-all duration-300 group-hover:fill-amber-500/10" />
                  <text x="320" y="229" fill="white" fontSize="8" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">PIPELINE</text>
                </g>

                {/* NODE 4: Persistence */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('stratos-persistence')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="460" cy="135" r="30" fill="#0c0c0c" stroke="#f59e0b" strokeWidth="2" filter="url(#glow-amber)" className="transition-all duration-300 group-hover:fill-amber-500/10" />
                  <text x="460" y="139" fill="white" fontSize="8" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">STORES</text>
                </g>

                {/* NODE 5: Outputs */}
                <g 
                  className="cursor-pointer group" 
                  onMouseEnter={() => setActiveNode('stratos-outputs')} 
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <circle cx="460" cy="315" r="34" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" filter="url(#glow-amber)" className="transition-all duration-300 group-hover:opacity-90" />
                  <text x="460" y="319" fill="#050505" fontSize="9" fontWeight="bold" letterSpacing="0.05em" textAnchor="middle" fontFamily="monospace">DELIVER</text>
                </g>
              </svg>

              {/* Dynamic Overlay HUD Info box */}
              <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-xl border bg-black/85 backdrop-blur-md transition-all duration-300 text-left ${
                activeNode && activeNode.startsWith('stratos-') ? 'opacity-100 scale-100 border-amber-500/40' : 'opacity-0 scale-95 border-white/5 pointer-events-none'
              }`}>
                {activeNode && activeNode.startsWith('stratos-') && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="col-span-2 border-b border-white/10 pb-1.5 mb-1.5 flex items-center justify-between">
                      <span className="font-mono text-amber-500 uppercase font-bold tracking-wider">{NODE_DETAILS[activeNode].title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-[9px] text-amber-500 border border-amber-500/25">{NODE_DETAILS[activeNode].status}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block mb-0.5">Function</span>
                      <span className="text-white/90 text-[11px] leading-relaxed block">{NODE_DETAILS[activeNode].desc}</span>
                    </div>
                    <div className="pl-4 border-l border-white/10 flex flex-col justify-center">
                      <span className="text-white/40 block mb-0.5">Telemetry</span>
                      <span className="font-mono text-amber-500 text-[13px]">{NODE_DETAILS[activeNode].load}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        <div className="absolute inset-0 z-40 pointer-events-none md:hidden">
          <button
            onClick={() => handleNavigateProject(activeProject - 1)}
            disabled={activeProject === 0}
            className={`absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/10 bg-black/75 backdrop-blur-md flex items-center justify-center text-white cursor-pointer pointer-events-auto transition-all duration-300 focus:outline-none select-none active:scale-95 ${
              activeProject === 0 ? 'opacity-20 pointer-events-none' : 'opacity-90'
            }`}
            title="Previous Project"
            aria-label="Previous Project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={() => handleNavigateProject(activeProject + 1)}
            disabled={activeProject === 2}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/10 bg-black/75 backdrop-blur-md flex items-center justify-center text-white cursor-pointer pointer-events-auto transition-all duration-300 focus:outline-none select-none active:scale-95 ${
              activeProject === 2 ? 'opacity-20 pointer-events-none' : 'opacity-90'
            }`}
            title="Next Project"
            aria-label="Next Project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <motion.p
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-widest text-center md:hidden pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: showSwipeHint ? 1 : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          aria-hidden
        >
          &larr; SWIPE TO EXPLORE &rarr;
        </motion.p>

        {/* Fixed controls layer pinned to viewport while scrolling horizontally */}
        <div className="absolute inset-0 pointer-events-none z-30 hidden md:block">
          {/* Arrow Left — hugged to the very edge so it never overlaps content */}
          <button
            onClick={() => handleNavigateProject(activeProject - 1)}
            disabled={activeProject === 0}
            className={`absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-center text-white cursor-pointer pointer-events-auto transition-all duration-400 focus:outline-none select-none hover:bg-white/10 hover:border-white/20 active:scale-95 ${
              activeProject === 0 ? 'opacity-10 pointer-events-none' : 'opacity-70 hover:opacity-100'
            }`}
            title="Previous Project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Arrow Right — hugged to the very edge so it never overlaps content */}
          <button
            onClick={() => handleNavigateProject(activeProject + 1)}
            disabled={activeProject === 2}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-center text-white cursor-pointer pointer-events-auto transition-all duration-400 focus:outline-none select-none hover:bg-white/10 hover:border-white/20 active:scale-95 ${
              activeProject === 2 ? 'opacity-10 pointer-events-none' : 'opacity-70 hover:opacity-100'
            }`}
            title="Next Project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 select-none">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => handleNavigateProject(idx)}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-500 cursor-pointer pointer-events-auto flex items-center justify-center focus:outline-none ${
                  activeProject === idx 
                    ? 'bg-accent border-accent scale-125' 
                    : 'bg-white/10 border-white/20 hover:bg-white/25 hover:border-white/30'
                }`}
                title={`View Project 0${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>


      {/* CHAPTER 3 — THE ARSENAL (lazy-loaded) */}
      <Suspense fallback={<div className="h-screen" />}>
        <ArsenalSection ref={arsenalRef} />
      </Suspense>


        {/* CHAPTER 4 — THE WIN (Samsung PRISM cinematic unlock) */}
        <section 
          id="chapter-achievements" 
          ref={winRef}
          className="relative w-full min-h-screen py-12 md:py-32 px-4 flex items-center justify-center bg-[#020202] border-t border-white/5 scroll-mt-0"
        >
        {/* Floating particle canvas mock background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="triumph-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] opacity-60" />
          
          {/* Custom micro sparks particle mock */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.85))] -z-10" />
        </div>

        <TriumphConfetti />

        <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center px-6 select-none">
          
          <div className="achievement-badge mb-6 px-4 py-1.5 rounded-full border border-accent/35 bg-accent/5 text-xs text-accent tracking-[0.4em] uppercase font-bold flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-6.75a1.125 1.125 0 00-1.125 1.125v3.375m9 0h-9M9 10.5h.008v.008H9V10.5zm.563 0h.008v.008H9.563V10.5zm.562 0h.008v.008H10.12V10.5zm-.562 3h.008v.008H9.563v-.008zm-.563 0h.008v.008H9v-.008zm.563 0h.008v.008H9.563v-.008zm1.688-3h.008v.008H11.25V10.5zm.562 0h.008v.008H11.81V10.5zm.563 0h.008v.008H12.37V10.5zm-.563 3h.008v.008H11.81v-.008zm-.562 0h.008v.008H11.25v-.008zm.562 0h.008v.008H11.81v-.008zm3.937-3h.008v.008H15.75V10.5zm.563 0h.008v.008H16.31V10.5zm.562 0h.008v.008H16.87V10.5zm-.562 3h.008v.008H16.31v-.008zm-.563 0h.008v.008H15.75v-.008zm.563 0h.008v.008H16.31v-.008z" />
            </svg>
            ACHIEVEMENT UNLOCKED
          </div>

          <h2 
            className="achievement-title text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-2 uppercase"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            SAMSUNG PRISM
          </h2>
          
          <p className="achievement-subtitle text-accent text-lg md:text-2xl font-light tracking-[0.2em] mb-16 uppercase">
            CINEMATIC CAPSTONE CHAMPIONSHIP
          </p>

          {/* Achievement Scores Grid */}
          <div className="achievement-scores grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-2xl w-full">
            <div className="flex flex-col items-center border-r border-white/5">
              <span className="text-[120px] font-extralight text-accent leading-none tracking-tighter">1st</span>
              <span className="text-xs uppercase tracking-[0.3em] text-white/40 mt-3 block">CHAMPIONSHIP PLACE</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-[120px] flex items-center justify-center">
                <span className="text-7xl md:text-8xl font-extralight text-white leading-none tracking-tighter font-mono">
                  {teamsCount}+
                </span>
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-white/40 mt-3 block">TEAMS DEFEATED NATIONWIDE</span>
            </div>
          </div>

        </div>
        </section>

      <Suspense fallback={<div className="h-screen" />}>
        <ContactSection />
      </Suspense>

      {/* Volumetric styling for flow diagrams */}
      <style>{`
        .pulse-path {
          stroke-dasharray: 10, 16;
          animation: flowPath 4s linear infinite;
        }
        @keyframes flowPath {
          to {
            stroke-dashoffset: -80;
          }
        }
        .pulse-path-amber {
          stroke-dasharray: 10, 16;
          animation: flowPathAmber 4s linear infinite;
        }
        @keyframes flowPathAmber {
          to {
            stroke-dashoffset: -80;
          }
        }
        
        /* Smooth transitions for all focus buttons */
        .glass-btn {
          cursor: pointer !important;
        }
      `}</style>
        
      {loadReneChat && (
        <Suspense fallback={null}>
          <ReneChatbot />
        </Suspense>
      )}
    </div>
  );
}
