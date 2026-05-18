import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { mousePositionAtom } from '@/lib/atoms';
import InputManager from '@/lib/inputManager';

/**
 * useMouseInteraction Hook
 * 
 * Manages mouse movement tracking for parallax and magnetic effects
 * Provides smooth interpolation between mouse positions
 */

export function useMouseInteraction() {
  const [, setMousePosition] = useAtom(mousePositionAtom);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef<number | null>(null);

  // smoothing constant (higher = faster response). This is a continuous-time
  // constant used with exponential smoothing so behavior is stable across frame rates.
  // Increased slightly for snappier response while maintaining smoothness.
  const SMOOTHING = 28; // tuned for snappy but smooth 60fps motion

  useEffect(() => {
    // Start the centralized InputManager which uses capture pointer events
    InputManager.start();

    // Set initial mouse position atom once to center (non-frequent reactive uses)
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setMousePosition({ x: cx, y: cy });

    return () => {
      // We do not stop the InputManager here since other components may rely on it.
      // If you want to stop it, call InputManager.stop() from a top-level teardown.
    };
  }, [setMousePosition]);
}
