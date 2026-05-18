/**
 * InputManager
 *
 * Global singleton that centralizes pointer input for high-frequency consumers
 * (3D scene, robot head tracking, camera parallax). It listens to pointer
 * events on the window in capture mode, smooths input using an rAF loop,
 * and exposes read-only getters. This keeps high-frequency input outside of
 * React state updates and prevents UI hover from interrupting tracking.
 */

type RawPoint = { x: number; y: number };

const InputManager = (() => {
  let running = false;
  let target: RawPoint = { x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 };
  let smooth: RawPoint = { ...target };
  let lastTime: number | null = null;
  let rafId: number | null = null;
  const SMOOTHING = 28; // time-constant style smoothing, tuned for snappy but smooth motion

  const handlePointer = (e: PointerEvent | MouseEvent | TouchEvent) => {
    // Support PointerEvent, MouseEvent, TouchEvent
    let cx = 0, cy = 0;
    if ('clientX' in (e as MouseEvent)) {
      const m = e as MouseEvent;
      cx = m.clientX;
      cy = m.clientY;
    } else if ('touches' in (e as TouchEvent)) {
      const t = (e as TouchEvent).touches[0];
      if (t) {
        cx = t.clientX;
        cy = t.clientY;
      }
    }
    if (cx || cy) {
      target.x = cx;
      target.y = cy;
    }
  };

  const update = (now: number) => {
    if (lastTime == null) lastTime = now;
    const dt = Math.max(0.001, (now - lastTime) / 1000);
    lastTime = now;

    const alpha = 1 - Math.exp(-SMOOTHING * dt);
    smooth.x += (target.x - smooth.x) * alpha;
    smooth.y += (target.y - smooth.y) * alpha;

    rafId = requestAnimationFrame(update);
  };

  const start = () => {
    if (running) return;
    running = true;
    // Initialize center
    target.x = window.innerWidth / 2;
    target.y = window.innerHeight / 2;
    smooth.x = target.x;
    smooth.y = target.y;

    // Use pointermove in capture to avoid UI elements stopping propagation
    window.addEventListener('pointermove', handlePointer as EventListener, { passive: true, capture: true });
    // Fallback for older browsers
    window.addEventListener('mousemove', handlePointer as EventListener, { passive: true, capture: true });
    window.addEventListener('touchstart', handlePointer as EventListener, { passive: true, capture: true });
    window.addEventListener('touchmove', handlePointer as EventListener, { passive: true, capture: true });

    rafId = requestAnimationFrame(update);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', handlePointer as EventListener, { capture: true } as any);
    window.removeEventListener('mousemove', handlePointer as EventListener, { capture: true } as any);
    window.removeEventListener('touchstart', handlePointer as EventListener, { capture: true } as any);
    window.removeEventListener('touchmove', handlePointer as EventListener, { capture: true } as any);
    lastTime = null;
    rafId = null;
  };

  const getRaw = () => ({ x: smooth.x, y: smooth.y });
  const getNormalized = () => ({ x: smooth.x / window.innerWidth, y: smooth.y / window.innerHeight });

  return {
    start,
    stop,
    getRaw,
    getNormalized,
  };
})();

export default InputManager;
