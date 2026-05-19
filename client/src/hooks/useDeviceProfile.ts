import { useEffect, useRef } from 'react';

export interface DeviceProfile {
  isMobile: boolean;
  isLowEnd: boolean;
  dpr: number;
  prefersReducedMotion: boolean;
}

export const useDeviceProfile = (): DeviceProfile => {
  const profile = useRef<DeviceProfile>({
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    isLowEnd:
      typeof window !== 'undefined'
        ? window.innerWidth < 768 && (navigator.hardwareConcurrency || 4) < 4
        : false,
    dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1,
    prefersReducedMotion:
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false,
  });
  return profile.current;
};
