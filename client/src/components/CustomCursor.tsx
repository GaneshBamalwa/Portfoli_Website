import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Position coordinates using motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Buttery-smooth spring interpolation (stiffness/damping tailored for premium low-latency feel)
  const springConfig = { stiffness: 450, damping: 28, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device is touch-based or screen is too small
    const checkDevice = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouch || isSmallScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // offset half of circle width (32px / 2)
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    // Track active hover states on interactive links
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.closest('.cursor-pointer') ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('letter');
        
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, cursorX, cursorY]);

  // Hide completely on mobile/touch interfaces
  if (isMobile) return null;

  return (
    <>
      {/* Outer Halo ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          zIndex: 99999,
          borderColor: isHovered ? 'rgba(212, 175, 55, 0.65)' : 'rgba(232, 232, 232, 0.22)',
          background: isHovered ? 'rgba(212, 175, 55, 0.04)' : 'rgba(232, 232, 232, 0.01)',
          boxShadow: isHovered ? '0 0 15px rgba(212, 175, 55, 0.15)' : 'none',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovered ? 1.35 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      />
      
      {/* Inner laser dot */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 rounded-full pointer-events-none"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          zIndex: 99999,
          // Offset to center perfectly in the 32px outer box (32px/2 - 4px/2 = 14px)
          marginLeft: '14px',
          marginTop: '14px',
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovered ? '#D4AF37' : '#C0C0C0',
          boxShadow: isHovered ? '0 0 8px #D4AF37' : '0 0 4px rgba(192, 192, 192, 0.5)'
        }}
        animate={{
          scale: isHovered ? 0.6 : 1,
        }}
      />
    </>
  );
};

export default CustomCursor;
