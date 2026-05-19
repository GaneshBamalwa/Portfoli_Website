import { useRef } from 'react';

export type DeviceTier = 'desktop' | 'high' | 'low';

function detectTier(): DeviceTier {
  if (typeof window === 'undefined') return 'desktop';

  // Desktop — never throttle
  if (window.innerWidth >= 768) return 'desktop';

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as any).deviceMemory ?? 4; // GB, Chrome only
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // iOS — always high tier (iPhones handle everything)
  if (isIOS) return 'high';

  // Android high-end: 6+ cores AND 4GB+ RAM
  if (cores >= 6 && memory >= 4) return 'high';

  // Android mid: 4-5 cores OR 3GB RAM — still high tier
  if (cores >= 4 && memory >= 3) return 'high';

  // Anything below — low tier
  return 'low';
}

export const useDeviceTier = (): DeviceTier => {
  const tier = useRef<DeviceTier>(detectTier());
  return tier.current; // ref — never causes re-render
};
