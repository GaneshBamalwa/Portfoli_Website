import { useRef, useEffect } from 'react';
import {
  Bloom,
  Vignette,
  ChromaticAberration,
  ToneMapping,
  EffectComposer,
  DepthOfField,
} from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

/**
 * CinematicEffects Component
 * 
 * Premium post-processing pipeline for luxury product cinematics:
 * - Selective bloom for diamond sparkle
 * - Vignette for cinematic framing
 * - Subtle chromatic aberration for spectral effects
 * - Filmic tone mapping for luxury aesthetic
 * - Optional depth of field for cinematic focus
 */

export function CinematicEffects() {
  return (
    <EffectComposer>
      {/* Selective Bloom - creates luxury sparkle without washing out image */}
      <Bloom
        luminanceThreshold={0.9}
        luminanceSmoothing={0.8}
        intensity={1.8}
        levels={8}
        mipmapBlur={true}
        kernelSize={3}
      />

      {/* Vignette - subtle darkening at edges for cinematic framing */}
      <Vignette
        offset={0.3}
        darkness={0.35}
        blurred={false}
      />

      {/* Chromatic Aberration - spectral effects for premium feel */}
      <ChromaticAberration
        offset={[0.001, 0.0015]}
        blurred={false}
      />

      {/* Depth of Field - emulates 85mm f/1.8 shallow DOF (macro product shot) */}
      <DepthOfField
        focusDistance={0.01}
        focalLength={85}
        bokehScale={6}
        height={480}
      />

      {/* Filmic Tone Mapping - luxury color grading */}
      <ToneMapping
        mode={ToneMappingMode.ACES_FILMIC}
        exposure={0.9}
        whitePoint={5.0}
        middleGrey={0.65}
      />

    </EffectComposer>
  );
}
