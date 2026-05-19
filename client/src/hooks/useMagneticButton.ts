import { useCallback, useEffect, useRef } from 'react';

export const useMagneticButton = (strength = 0.35) => {
  const ref = useRef<HTMLAnchorElement>(null);
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

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isMobileRef.current) return;
      const btn = ref.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      btn.style.transition = 'transform 0.1s ease';
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    if (isMobileRef.current) return;
    const btn = ref.current;
    if (!btn) return;
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition =
      'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
};
