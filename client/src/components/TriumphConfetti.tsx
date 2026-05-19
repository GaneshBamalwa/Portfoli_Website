import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useInView } from 'framer-motion';

export const TriumphConfetti = () => {
  const ref = useRef<HTMLDivElement>(null);
  // Require at least 75% of the section visible before firing
  const isInView = useInView(ref, { once: true, amount: 0.75 });
  const fired = useRef(false);
  const isMobileRef = useRef(
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const check = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isInView && !fired.current) {
      fired.current = true;

      const particleCount = isMobileRef.current ? 40 : 80;

      // Delay confetti so it fires after any snap animation finishes
      const delay = setTimeout(() => {
        confetti({
          particleCount,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#D4AF37', '#FFD700', '#ffffff', '#F5F5DC'],
          gravity: 0.8,
          scalar: 1.1,
          drift: 0,
        });

        setTimeout(() => {
          confetti({
            particleCount,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: ['#D4AF37', '#FFD700', '#ffffff', '#F5F5DC'],
            gravity: 0.8,
            scalar: 1.1,
            drift: 0,
          });
        }, 200);
      }, 400); // wait 400ms for snap to finish

      return () => clearTimeout(delay);
    }
  }, [isInView]);

  return <div ref={ref} className="absolute inset-0 pointer-events-none" />;
};
