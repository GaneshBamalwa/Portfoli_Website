import { useCallback, useRef } from 'react';
import { useDeviceTier } from '@/hooks/useDeviceTier';

export const useMagneticButton = (strength = 0.35) => {
  const ref = useRef<any>(null);
  const tier = useDeviceTier();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (tier === 'low') return;
      const btn = ref.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      btn.style.transition = 'transform 0.1s ease';
    },
    [strength, tier]
  );

  const handleMouseLeave = useCallback(() => {
    if (tier === 'low') return;
    const btn = ref.current;
    if (!btn) return;
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition =
      'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }, [tier]);

  if (tier === 'low') {
    return { ref, handleMouseMove: () => {}, handleMouseLeave: () => {} };
  }

  return { ref, handleMouseMove, handleMouseLeave };
};
