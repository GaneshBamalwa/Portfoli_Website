import React, { useEffect, useRef, useState } from 'react';

type TypingEffectProps = {
  text: string;
  cps?: number; // characters per second
  className?: string;
};

export function TypingEffect({ text, cps = 12, className = '' }: TypingEffectProps) {
  const [index, setIndex] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setIndex(0);
    startRef.current = null;

    const step = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const elapsed = (t - startRef.current) / 1000; // seconds
      const chars = Math.min(text.length, Math.floor(elapsed * cps));
      setIndex(chars);
      if (chars < text.length) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        // keep caret visible when finished
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, cps]);

  return (
    <div className={className} aria-hidden>
      <span>{text.slice(0, index)}</span>
      <span
        style={{
          display: 'inline-block',
          width: 12,
          marginLeft: 6,
          transformOrigin: 'center',
        }}
        className="typing-caret"
      />
      <style>{`
        .typing-caret {
          height: 22px;
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9));
          animation: caretPulse 1s steps(1,end) infinite;
          vertical-align:middle;
        }

        @keyframes caretPulse {
          0% { opacity: 1; }
          50% { opacity: 0.1; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default TypingEffect;
