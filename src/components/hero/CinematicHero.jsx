/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CINEMATIC HERO — Award-Level Dual-Identity Hero Assembly
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Per spec: "The hero represents a dual identity:
 * - Design (Left) → organic, warm, editorial
 * - Tech (Right) → structured, cool, computational"
 * 
 * ARCHITECTURAL LAYERS (from spec):
 * [ Ambient Base (CSS gradients) ]
 * [ Organic / Matrix Vector Layer (SVG) ]
 * [ Portrait (Transparent WEBP) ]
 * [ Light · Grain · Vignette ]
 * 
 * "Nothing switches. Everything drifts."
 */

import { memo } from 'react'
import { IdentityMotionProvider } from './IdentityMotionProvider'
import { AmbientLayers } from './AmbientLayers'
import OrganicBackground from './OrganicBackground'
import MatrixBackground from './MatrixBackground'
import Portrait from './Portrait'
import './cinematic-hero.css'

// ═══════════════════════════════════════════════════════════════════════════
// MAIN HERO COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function CinematicHero({
  designImage = '/portrait-design-left.png',
  neutralImage = '/portrait-split.png',
  techImage = '/portrait-tech-right.png',
  className = '',
}) {
  return (
    <IdentityMotionProvider className={`cinematic-hero ${className}`}>
      {/* ═══ LAYER 0: Ambient Base ═══ */}
      <AmbientLayers />
      
      {/* ═══ LAYER 1: Organic Background (Design Side) ═══ */}
      <OrganicBackground />
      
      {/* ═══ LAYER 2: Matrix Background (Tech Side) ═══ */}
      <MatrixBackground />
      
      {/* ═══ LAYER 3: Portrait ═══ */}
      <Portrait
        designImage={designImage}
        neutralImage={neutralImage}
        techImage={techImage}
      />
      
      {/* Typography & Navigation layers can be added here */}
      {/* They will have access to identity via useIdentityContext() */}
    </IdentityMotionProvider>
  )
}

export default memo(CinematicHero)

// ═══════════════════════════════════════════════════════════════════════════
// RE-EXPORTS for flexibility
// ═══════════════════════════════════════════════════════════════════════════

export { IdentityMotionProvider, useIdentityContext } from './IdentityMotionProvider'
export { AmbientLayers, GrainOverlay, VignetteOverlay, LightBloom, AmbientBase } from './AmbientLayers'
export { default as OrganicBackground } from './OrganicBackground'
export { default as MatrixBackground } from './MatrixBackground'
export { default as Portrait } from './Portrait'
