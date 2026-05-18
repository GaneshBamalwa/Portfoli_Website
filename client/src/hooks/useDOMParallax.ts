import { RefObject, useEffect, useRef } from 'react';

type Options = {
  strength?: number; // px multiplier for parallax
  smoothing?: number; // time constant for smoothing
};

// High-performance DOM parallax: applies transforms directly via rAF
export function useDOMParallax(targetRef: RefObject<HTMLElement | null>, opts: Options = {}) {
  const { strength = 6, smoothing = 18 } = opts;
  const target = targetRef;
  const posRef = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // init center
    targetPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    posRef.current = { ...targetPos.current };

    const handleMove = (e: MouseEvent | TouchEvent) => {
        // Support PointerEvent, TouchEvent and MouseEvent; prefer PointerEvent
        // when available so we get events even if elements capture pointer.
        let x = targetPos.current.x;
        let y = targetPos.current.y;
        const ev = e as PointerEvent;
        if (typeof PointerEvent !== 'undefined' && ev && ev.pointerType) {
          x = ev.clientX;
          y = ev.clientY;
        } else if ('touches' in (e as TouchEvent)) {
          const t = (e as TouchEvent).touches && (e as TouchEvent).touches[0];
          if (t) {
            x = t.clientX;
            y = t.clientY;
          }
        } else if ('clientX' in (e as MouseEvent)) {
          const mm = e as MouseEvent;
          x = mm.clientX;
          y = mm.clientY;
        }
      targetPos.current.x = x;
      targetPos.current.y = y;
    };

    const loop = (now: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = now;
      const dt = Math.max(0.001, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      const alpha = 1 - Math.exp(-smoothing * dt);

      posRef.current.x += (targetPos.current.x - posRef.current.x) * alpha;
      posRef.current.y += (targetPos.current.y - posRef.current.y) * alpha;

      // calculate offset from center
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (posRef.current.x - cx) / cx; // -1..1
      const dy = (posRef.current.y - cy) / cy;

      const tx = dx * strength;
      const ty = dy * strength;

      const el = target.current;
      if (el) {
        // Use transform only for GPU acceleration
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

      // Use pointermove in capture so the handler runs even when hovering over
      // elements that may intercept pointer events (interactive text/buttons).
      window.addEventListener('pointermove', handleMove as EventListener, { passive: true, capture: true });
      // Fallbacks
      window.addEventListener('mousemove', handleMove as EventListener, { passive: true, capture: true });
      window.addEventListener('touchmove', handleMove as EventListener, { passive: true, capture: true });
      // Also add on document to be extra-resilient
      document.addEventListener('pointermove', handleMove as EventListener, { passive: true, capture: true });

    rafRef.current = requestAnimationFrame(loop);

    return () => {
        window.removeEventListener('pointermove', handleMove as EventListener);
        window.removeEventListener('mousemove', handleMove as EventListener);
        window.removeEventListener('touchmove', handleMove as EventListener);
        document.removeEventListener('pointermove', handleMove as EventListener);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [strength, smoothing, target]);
}

export default useDOMParallax;
