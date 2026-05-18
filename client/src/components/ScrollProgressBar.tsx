import React from 'react';
import { useAtom } from 'jotai';
import { scrollPercentAtom } from '@/lib/atoms';

export function ScrollProgressBar() {
  const [scrollPercent] = useAtom(scrollPercentAtom);

  return (
    <div 
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: '2px',
        height: `${scrollPercent}%`,
        background: 'linear-gradient(to bottom, #E8E8E8, #D4AF37)',
        zIndex: 9999,
        pointerEvents: 'none',
        transition: 'height 0.05s linear'
      }}
      aria-hidden
    />
  );
}

export default ScrollProgressBar;
