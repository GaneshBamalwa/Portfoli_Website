import { atom } from 'jotai';

/**
 * Global state atoms for diamond interaction
 * Manages rotation, lighting, and animation state
 */

export const diamondRotationAtom = atom({
  x: 0,
  y: 0,
  z: 0,
});

export const diamondLightingAtom = atom({
  keyLightIntensity: 1.5,
  rimLightIntensity: 1.2,
  rimLightAngle: 0,
});

export const mousePositionAtom = atom({
  x: 0,
  y: 0,
});

export const scrollProgressAtom = atom(0);

// Indicates the Spline scene and hero visuals have completed their reveal
export const splineLoadedAtom = atom(false);

export const activeChapterAtom = atom(0);
export const subSceneAtom = atom<string | null>(null);
export const scrollPercentAtom = atom(0);

// Global control for Réne chatbot modal state
export const reneChatOpenAtom = atom(false);
