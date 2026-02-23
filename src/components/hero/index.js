/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HERO COMPONENTS — Barrel Export
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Single import point for all hero-related components.
 * 
 * Usage:
 *   import CinematicHero from '@/components/hero'
 *   import { OrganicBackground, Portrait } from '@/components/hero'
 */

// Main assembled hero
export { default, default as CinematicHero } from './CinematicHero'

// Provider (for custom hero compositions)
export { 
  IdentityMotionProvider, 
  useIdentityContext 
} from './IdentityMotionProvider'

// Individual layers (for custom compositions)
export { default as OrganicBackground } from './OrganicBackground'
export { default as MatrixBackground } from './MatrixBackground'
export { default as Portrait } from './Portrait'

// Ambient effects
export { 
  AmbientLayers, 
  GrainOverlay, 
  VignetteOverlay, 
  LightBloom, 
  AmbientBase 
} from './AmbientLayers'
