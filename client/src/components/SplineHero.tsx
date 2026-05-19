import React, { memo, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, useAnimation } from 'framer-motion';
import { useAtom } from 'jotai';
import { splineLoadedAtom, reneChatOpenAtom, activeChapterAtom } from '@/lib/atoms';
import { ReneLauncher } from '@/components/ReneChatbot';
import { useDeviceTier } from '@/hooks/useDeviceTier';

function SplineHeroComponent() {
  const [loaded, setLoaded] = useAtom(splineLoadedAtom);
  const [, setIsOpen] = useAtom(reneChatOpenAtom);
  const [activeChapter] = useAtom(activeChapterAtom);
  const controls = useAnimation();
  const overlayControls = useAnimation();
  const tier = useDeviceTier();

  useEffect(() => {
    // Start ambient overlays fade-in (nearly black -> subtle glow & grain)
    overlayControls.start({ opacity: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } });

    // Try to remove any branding elements that contain the text 'Built with Spline'.
    // Run on mount and observe mutations briefly to catch dynamically inserted badges.
    const removeSplineBadges = () => {
      try {
        const candidates = Array.from(document.querySelectorAll('a,div,span,button'));
        candidates.forEach((el) => {
          try {
            if (!el) return;
            const txt = (el.textContent || '').trim();
            if (txt && txt.includes('Built with Spline')) {
              el.remove();
            }
          } catch (e) {
            // ignore individual element errors
          }
        });
      } catch (e) {
        // ignore
      }
    };

    removeSplineBadges();

    const observer = new MutationObserver(() => removeSplineBadges());
    observer.observe(document.body, { childList: true, subtree: true });

    const stopTimeout = setTimeout(() => observer.disconnect(), 5000);
    return () => {
      observer.disconnect();
      clearTimeout(stopTimeout);
    };
  }, []);

  // Handler when Spline reports ready
  const handleSplineLoad = async () => {
    // start the cinematic reveal for the 3D scene
    // start from invisible -> fade+scale+sharpen
    try {
      await controls.start({ opacity: 1, scale: 0.92, filter: 'blur(0px)', transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] } });
    } catch (e) {
      // ignore
    }

    // keep overlays present but slightly reduce opacity to allow text to pop
    try {
      overlayControls.start({ opacity: 0.9, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } });
    } catch (e) { }

    // mark global state so text and UI can animate
    setLoaded(true);
  };

  return (
    <div className="w-full h-screen overflow-hidden relative" style={{ zIndex: 2 }}>
      {/* Cinematic overlays, controlled here so they sync with Spline reveal */}
      <motion.div className="hero-vignette" initial={{ opacity: 0 }} animate={overlayControls} aria-hidden style={{ zIndex: 30 }} />
      <motion.div className="hero-grain" initial={{ opacity: 0 }} animate={overlayControls} aria-hidden style={{ zIndex: 31 }} />

      {/* Spotlight behind the robot/spline visual */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 232, 232, 0.04) 0%, rgba(5, 5, 5, 0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(30px)'
        }}
        aria-hidden
      />

      {/* Spline scene wrapped so we can animate opacity/scale/blur */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
        animate={controls}
        style={{
          width: '100%',
          height: '100%',
          zIndex: 1,
          position: 'relative'
        }}
      >
        <div className="robot-container w-full h-full relative">
          <div
            className="w-full h-full"
            style={tier === 'low' ? { pointerEvents: 'none' } : undefined}
          >
            <Spline scene="https://prod.spline.design/KRXODn3OlcL24ra0/scene.splinecode" onLoad={handleSplineLoad} />
          </div>

          {/* Interactive "Talk to Réne" badge masking the Spline watermark */}
          {activeChapter === 0 && (
            <ReneLauncher
              onClick={() => setIsOpen(true)}
              className="spline-cover-badge"
              style={{
                position: 'fixed',
                height: '25px',
                bottom: '20px',
                right: '12px',
                padding: '1px 4px 5px 4px',
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

const SplineHero = memo(SplineHeroComponent);
export { SplineHero };
export default SplineHero;
