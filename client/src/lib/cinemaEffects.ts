import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Setup chapter flash transitions (black flash between sections)
 */
export const setupChapterFlashes = (flashOverlayRef: React.RefObject<HTMLDivElement | null>) => {
  const chapterIds = ['chapter-origin', 'chapter-projects', 'chapter-skills', 'chapter-achievements', 'chapter-contact'];

  chapterIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el || !flashOverlayRef.current) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top center+=20%',
      invalidateOnRefresh: true,
      onEnter: () => {
        gsap.fromTo(flashOverlayRef.current,
          { opacity: 0 },
          {
            opacity: 0.8,
            duration: 0.15,
            ease: 'power2.in'
          }
        );

        gsap.to(flashOverlayRef.current, {
          opacity: 0,
          duration: 0.15,
          ease: 'power2.out',
          delay: 0.15
        });
      }
    });
  });
};
