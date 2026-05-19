import { useEffect, useState } from 'react';

/**
 * Hook to detect mobile devices (< 768px width)
 * Detects once on mount and throttles subsequent checks to resize events only
 * Useful for conditional rendering and performance optimization on mobile
 */
export const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    
    // Initial check
    check();
    
    // Listen for resize events
    window.addEventListener('resize', check);
    
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
};
