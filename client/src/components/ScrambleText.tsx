import React, { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  duration?: number; // duration in seconds
  triggerOnHover?: boolean;
}

const UPPER_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER_ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";

export const ScrambleText: React.FC<ScrambleTextProps> = ({ 
  text, 
  className = "", 
  duration = 0.8,
  triggerOnHover = true
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const animateScramble = (time: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = time;
    }
    
    const elapsed = (time - startTimeRef.current) / 1000;
    
    // Dynamically scale stagger time based on string length to guarantee positive duration!
    const totalStagger = Math.min(0.2, duration * 0.3); // at most 30% of duration goes to stagger
    const staggerDelay = text.length > 1 ? totalStagger / (text.length - 1) : 0;
    const charDuration = duration - totalStagger; // guaranteed to be a solid positive duration
    
    let allResolved = true;
    
    const scrambled = text
      .split("")
      .map((char, i) => {
        if (char === " ") return " ";
        
        // Calculate distinct organic timelines per character
        const charStart = i * staggerDelay;
        const charProgress = Math.min(
          Math.max((elapsed - charStart) / charDuration, 0),
          1
        );
        
        if (charProgress < 1) {
          allResolved = false;
        }
        
        // When resolved, return original character
        if (charProgress >= 1) {
          return char;
        }
        
        // Caesar scroll offset count down sequentially to 0
        const charOffset = Math.floor((1 - charProgress) * 6) + 1;
        
        if (char >= 'A' && char <= 'Z') {
          const idx = UPPER_ALPHABET.indexOf(char);
          const shiftedIdx = (idx + charOffset) % 26;
          return UPPER_ALPHABET[shiftedIdx];
        } else if (char >= 'a' && char <= 'z') {
          const idx = LOWER_ALPHABET.indexOf(char);
          const shiftedIdx = (idx + charOffset) % 26;
          return LOWER_ALPHABET[shiftedIdx];
        } else if (char >= '0' && char <= '9') {
          const idx = NUMBERS.indexOf(char);
          const shiftedIdx = (idx + charOffset) % 10;
          return NUMBERS[shiftedIdx];
        }
        
        return char;
      })
      .join("");
      
    setDisplayText(scrambled);
    
    if (!allResolved) {
      requestRef.current = requestAnimationFrame(animateScramble);
    } else {
      setDisplayText(text);
      isAnimating.current = false;
    }
  };

  const startScramble = () => {
    isAnimating.current = true;
    startTimeRef.current = 0;
    
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animateScramble);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (triggerOnHover) {
      startScramble();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Let the animation finish naturally (which is now guaranteed to complete in 0.8s!)
  };

  return (
    <span 
      className={`scramble-text ${className} cursor-default transition-colors duration-300 ${isHovered ? 'text-accent' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </span>
  );
};

export default ScrambleText;
