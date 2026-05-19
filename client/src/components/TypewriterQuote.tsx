import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useMobileDetect } from '@/hooks/useMobileDetect';

const PHASE1 = '"The next chapter ';
const PHASE2 = `isn't written yet."`;
const FULL_QUOTE = PHASE1 + PHASE2;
const ITALIC_TEXT = "isn't written yet";
const ITALIC_START = FULL_QUOTE.indexOf(ITALIC_TEXT);
const ITALIC_END = ITALIC_START + ITALIC_TEXT.length;

export default function TypewriterQuote() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-20%' });
  const isMobile = useMobileDetect();

  const [displayedLength, setDisplayedLength] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingDone, setTypingDone] = useState(false);
  const startedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phase1Speed = isMobile ? 20 : 30;
  const phase2Speed = isMobile ? 35 : 55;
  const phase1End = PHASE1.length;

  useEffect(() => {
    if (!isInView || startedRef.current) return;
    startedRef.current = true;
    setShowCursor(true);

    let index = 0;

    const scheduleNext = () => {
      if (index >= FULL_QUOTE.length) {
        setTypingDone(true);
        timeoutRef.current = setTimeout(() => {
          setCursorVisible(false);
          setTimeout(() => setShowCursor(false), 400);
        }, 2000);
        return;
      }

      const delay = index < phase1End ? phase1Speed : phase2Speed;

      timeoutRef.current = setTimeout(() => {
        index += 1;
        setDisplayedLength(index);
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isInView, phase1Speed, phase2Speed, phase1End]);

  const renderQuote = () => {
    const visible = FULL_QUOTE.slice(0, displayedLength);
    if (!visible) return null;

    const beforeItalic = visible.slice(0, Math.min(visible.length, ITALIC_START));
    const italicSlice = visible.slice(
      ITALIC_START,
      Math.min(visible.length, ITALIC_END)
    );
    const afterItalic = visible.slice(Math.min(visible.length, ITALIC_END));

    return (
      <>
        {beforeItalic}
        {italicSlice && (
          <em className="text-accent italic font-normal">{italicSlice}</em>
        )}
        {afterItalic}
      </>
    );
  };

  return (
    <>
      <h2
        ref={containerRef}
        className="contact-quote text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6"
        style={{ fontFamily: 'var(--font-display)', lineHeight: '1.2' }}
      >
        {renderQuote()}
        {showCursor && (
          <span
            className="ml-0.5 inline-block"
            style={{
              opacity: cursorVisible ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
            aria-hidden
          >
            |
          </span>
        )}
      </h2>

      <motion.p
        className="contact-desc text-base md:text-lg text-white/50 leading-relaxed font-light mb-12 max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: typingDone ? 1 : 0 }}
        transition={{ duration: 0.4, delay: typingDone ? 0.4 : 0 }}
      >
        Seeking complex architectures to plan, secure, and accelerate. Let's create
        systems that think.
      </motion.p>
    </>
  );
}
