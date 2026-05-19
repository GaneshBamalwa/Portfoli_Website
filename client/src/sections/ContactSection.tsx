import { memo, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TypewriterQuote from '@/components/TypewriterQuote';
import { MagneticGlassLink } from '@/components/MagneticGlassLink';
import { gsapDur } from '@/lib/gsapDuration';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import { Mail } from 'lucide-react';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

function ContactSection() {
  const profile = useDeviceProfile();
  const isMobile = profile.isMobile;

  useEffect(() => {
    const contactEl = document.querySelector('.contact-section');
    if (!contactEl) return;

    const d = (n: number) => gsapDur(n, isMobile);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-topbar',
        { opacity: 0 },
        {
          opacity: 1,
          duration: d(0.6),
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contactEl,
            start: 'top 70%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        '.contact-ctas .glass-btn',
        { opacity: 0, y: 15, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: d(0.6),
          ease: 'back.out(1.2)',
          delay: 0.4,
          scrollTrigger: {
            trigger: contactEl,
            start: 'top 55%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        '.contact-footer span',
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: d(0.5),
          ease: 'power2.out',
          delay: 0.6,
          scrollTrigger: {
            trigger: contactEl,
            start: 'top 50%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isMobile]);

  return (
    <section
      id="chapter-contact"
      className="contact-section relative w-full h-screen bg-[#000000] border-t border-white/10 flex flex-col justify-between px-4 md:px-16 lg:px-24 py-12 md:py-20"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="contact-topbar flex items-center justify-between select-none">
        <span className="text-xs font-light uppercase tracking-[0.35em] text-accent">
          05 // THE HORIZON
        </span>
        <span className="text-xs font-mono text-white/20">EST. 2026 // AD INFINITUM</span>
      </div>

      <div className="max-w-4xl mx-auto w-full text-center md:text-left my-auto">
        <TypewriterQuote />

        <div className="contact-ctas flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
          {/* EMAIL WORK */}
          <MagneticGlassLink
            href="mailto:ganeshbamalwa89@gmail.com"
            className="glass-btn contact-btn group flex items-center gap-2 pointer-events-auto cursor-pointer w-full md:w-auto justify-center"
          >
            <Mail size={15} className="text-white opacity-80 group-hover:opacity-100" />
            <span className="relative">Email Work</span>
          </MagneticGlassLink>

          {/* LINKEDIN */}
          <MagneticGlassLink
            href="https://linkedin.com/in/ganeshbamalwa"
            target="_blank"
            rel="noreferrer"
            className="glass-btn outline-btn contact-btn group pointer-events-auto cursor-pointer w-full md:w-auto justify-center flex items-center gap-2"
          >
            <FaLinkedinIn size={15} className="text-white opacity-80 group-hover:opacity-100" />
            <span className="relative">LinkedIn</span>
          </MagneticGlassLink>

          {/* GITHUB */}
          <MagneticGlassLink
            href="https://github.com/GaneshBamalwa"
            target="_blank"
            rel="noreferrer"
            className="glass-btn outline-btn contact-btn group pointer-events-auto cursor-pointer w-full md:w-auto justify-center flex items-center gap-2"
          >
            <FaGithub size={15} className="text-white opacity-80 group-hover:opacity-100" />
            <span className="relative">GitHub</span>
          </MagneticGlassLink>
        </div>
      </div>

      <div className="contact-footer flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 text-[11px] font-mono text-white/25 select-none gap-4">
        <span>DESIGNED FOR LUXURY // ENGINEERED FOR EXCELLENCE</span>
        <span>© 2026 GANESH BAMALWA. ALL RIGHTS RESERVED.</span>
      </div>
    </section>
  );
}

export default memo(ContactSection);
