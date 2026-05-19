/** Scale GSAP durations on mobile for snappier feel */
export const gsapDur = (duration: number, isMobile: boolean) =>
  isMobile ? duration * 0.7 : duration;
