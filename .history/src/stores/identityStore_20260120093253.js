/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GLOBAL IDENTITY MOTION SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The single source of truth for the Design ↔ Tech identity continuum.
 * 
 * PHILOSOPHY:
 * - The identity value is ANALOG, not a toggle
 * - 0 = Design (organic, floral, warm)
 * - 0.5 = Neutral (balanced)  
 * - 1 = Tech (geometric, matrix, cool)
 * 
 * This value cascades through the entire visual system:
 * - Color palette interpolation
 * - Motion behavior (easing, speed, character)
 * - Typography (spacing, weight, glow)
 * - Decorative elements (organic curves vs geometric grids)
 * - Ambient effects (grain, bloom, noise)
 * 
 * DESIGN INTENT:
 * The portfolio should feel like a living organism that responds to exploration.
 * Moving through the site reveals which identity resonates with the visitor.
 * Design and technology are not categories—they are encoded into the interface.
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { motionValue, animate } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════════
// MOTION VALUES (Framer Motion primitives for smooth interpolation)
// ═══════════════════════════════════════════════════════════════════════════

// The core identity motion value - drives ALL visual derivatives
export const identityMotionValue = motionValue(0.5)

// Mouse position for local interactions (hero portrait, etc.)
export const mouseXMotionValue = motionValue(0.5)
export const mouseYMotionValue = motionValue(0.5)

// ═══════════════════════════════════════════════════════════════════════════
// COLOR SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

// Design Side (warm, organic, earthy)
const DESIGN_COLORS = {
  background: '#0f0c09',      // Warm black
  backgroundAlt: '#1a1510',   // Warm charcoal
  accent: '#c4703a',          // Amber/terracotta
  accentGlow: '#e89a5f',      // Warm glow
  text: '#f5f0eb',            // Warm white
  textMuted: '#a89a8a',       // Warm gray
  overlay: 'rgba(196, 112, 58, 0.03)', // Warm tint
  grain: 0.04,                // Subtle grain
}

// Tech Side (cool, digital, precise)
const TECH_COLORS = {
  background: '#080a0f',      // Cool black
  backgroundAlt: '#0d1117',   // Cool charcoal
  accent: '#3a9cc4',          // Cyan
  accentGlow: '#5fbde8',      // Cool glow
  text: '#e8f4f8',            // Cool white
  textMuted: '#7a9aa8',       // Cool gray
  overlay: 'rgba(58, 156, 196, 0.03)', // Cool tint
  grain: 0.02,                // Minimal grain
}

// Neutral (balanced)
const NEUTRAL_COLORS = {
  background: '#0d0d0d',
  backgroundAlt: '#161616',
  accent: '#888888',
  accentGlow: '#aaaaaa',
  text: '#f0f0f0',
  textMuted: '#909090',
  overlay: 'rgba(128, 128, 128, 0.02)',
  grain: 0.03,
}

// ═══════════════════════════════════════════════════════════════════════════
// MOTION BEHAVIOR SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// T-SHAPED MOTION SPEC (from portfolio document)
// ═══════════════════════════════════════════════════════════════════════════
// Stiffness: 40-60 | Damping: 25-30 | Mass: ~1 | Dead zone: ±5% around center
// Motion reacts slightly slower than input - weight over responsiveness

// Design: slower, organic, breathing
const DESIGN_MOTION = {
  stiffness: 45,
  damping: 28,
  mass: 1.0,
  duration: 0.8,
  ease: [0.25, 0.1, 0.25, 1.0], // Smooth, organic easing
}

// Tech: slightly more responsive, but still weighted
const TECH_MOTION = {
  stiffness: 55,
  damping: 26,
  mass: 0.9,
  duration: 0.6,
  ease: [0.4, 0.0, 0.2, 1.0], // Sharp, precise easing
}

// Dead zone configuration
const DEAD_ZONE = 0.05 // ±5% around center (0.5)
const IDLE_TIMEOUT = 2500 // 2.5 seconds before idle reset
const IDLE_DRIFT_DURATION = 1.8 // Slow drift back to center

// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

const DESIGN_TYPOGRAPHY = {
  letterSpacing: '-0.02em',
  fontWeight: 400,
  lineHeight: 1.6,
  textShadow: '0 0 40px rgba(196, 112, 58, 0.15)',
}

const TECH_TYPOGRAPHY = {
  letterSpacing: '0.04em',
  fontWeight: 500,
  lineHeight: 1.4,
  textShadow: '0 0 20px rgba(58, 156, 196, 0.2)',
}

// ═══════════════════════════════════════════════════════════════════════════
// ZUSTAND STORE
// ═══════════════════════════════════════════════════════════════════════════

// Idle timer reference (module-level for cleanup)
let idleTimer = null

export const useIdentityStore = create(
  subscribeWithSelector((set, get) => ({
    // ─── Core State ───
    identity: 0.5,           // Current identity value (0 = design, 1 = tech)
    targetIdentity: 0.5,     // Target for animations
    isTransitioning: false,  // Whether a transition is in progress
    interactionSource: null, // 'hero' | 'nav' | 'scroll' | 'auto'
    isIdle: true,            // Whether user is idle (for drift behavior)
    lastInteractionTime: 0,  // Timestamp of last interaction
    
    // ─── Derived State (updated when identity changes) ───
    colors: NEUTRAL_COLORS,
    motion: { ...DESIGN_MOTION, ...TECH_MOTION }, // Blended
    typography: { ...DESIGN_TYPOGRAPHY },
    
    // ─── Actions ───
    
    /**
     * Apply dead zone around center (±5%)
     * Small movements near center don't affect identity
     */
    applyDeadZone: (value) => {
      const center = 0.5
      const distanceFromCenter = Math.abs(value - center)
      
      // If within dead zone, snap to center
      if (distanceFromCenter < DEAD_ZONE) {
        return center
      }
      
      // Otherwise, remap value to remove the dead zone gap
      // This creates smooth transition at dead zone boundaries
      if (value < center) {
        // Design side: remap 0-0.45 to 0-0.5
        return (value / (center - DEAD_ZONE)) * center
      } else {
        // Tech side: remap 0.55-1 to 0.5-1
        return center + ((value - center - DEAD_ZONE) / (center - DEAD_ZONE)) * center
      }
    },
    
    /**
     * Start/reset the idle timer
     * After IDLE_TIMEOUT, identity drifts back to center
     */
    resetIdleTimer: () => {
      // Clear existing timer
      if (idleTimer) {
        clearTimeout(idleTimer)
        idleTimer = null
      }
      
      set({ isIdle: false, lastInteractionTime: Date.now() })
      
      // Start new timer
      idleTimer = setTimeout(() => {
        const { identity, isTransitioning } = get()
        
        // Don't interrupt active transitions or if already at center
        if (isTransitioning || Math.abs(identity - 0.5) < 0.01) {
          set({ isIdle: true })
          return
        }
        
        // Drift back to center
        set({ isIdle: true })
        get().animateToIdentity(0.5, { 
          duration: IDLE_DRIFT_DURATION, 
          source: 'idle-reset',
          ease: [0.25, 0.1, 0.25, 1.0], // Slow, cinematic drift
        })
      }, IDLE_TIMEOUT)
    },
    
    /**
     * Set identity directly (for continuous tracking like mouse movement)
     * Use this for real-time updates where you want no animation.
     * Applies dead zone and resets idle timer.
     */
    setIdentity: (value, source = null) => {
      const clamped = Math.max(0, Math.min(1, value))
      // const processed = get().applyDeadZone(clamped) // Dead zone disabled for smoother feel
      const processed = clamped
      identityMotionValue.set(processed)
      
      // Reset idle timer on any interaction
      get().resetIdleTimer()
      
      set({
        identity: processed,
        targetIdentity: processed,
        interactionSource: source,
        colors: interpolateColors(processed),
        motion: interpolateMotion(processed),
        typography: interpolateTypography(processed),
      })
    },
    
    /**
     * Animate identity to a target value (for discrete transitions)
     * Use this when you want smooth, cinematic transitions.
     */
    animateToIdentity: (target, options = {}) => {
      const {
        duration = 1.2,
        ease = [0.25, 0.1, 0.25, 1.0],
        source = null,
      } = options
      
      set({ 
        targetIdentity: target, 
        isTransitioning: true,
        interactionSource: source,
      })
      
      animate(identityMotionValue, target, {
        duration,
        ease,
        onUpdate: (latest) => {
          set({
            identity: latest,
            colors: interpolateColors(latest),
            motion: interpolateMotion(latest),
            typography: interpolateTypography(latest),
          })
        },
        onComplete: () => {
          set({ isTransitioning: false })
        },
      })
    },
    
    /**
     * Lock to design side (identity = 0)
     */
    lockToDesign: (animate = true) => {
      if (animate) {
        get().animateToIdentity(0, { source: 'lock' })
      } else {
        get().setIdentity(0, 'lock')
      }
    },
    
    /**
     * Lock to tech side (identity = 1)
     */
    lockToTech: (animate = true) => {
      if (animate) {
        get().animateToIdentity(1, { source: 'lock' })
      } else {
        get().setIdentity(1, 'lock')
      }
    },
    
    /**
     * Return to neutral (identity = 0.5)
     */
    resetToNeutral: (animate = true) => {
      if (animate) {
        get().animateToIdentity(0.5, { source: 'reset' })
      } else {
        get().setIdentity(0.5, 'reset')
      }
    },
    
    /**
     * Get the current identity as a discrete label
     */
    getIdentityLabel: () => {
      const { identity } = get()
      if (identity < 0.35) return 'design'
      if (identity > 0.65) return 'tech'
      return 'neutral'
    },
  }))
)

// ═══════════════════════════════════════════════════════════════════════════
// INTERPOLATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Linear interpolation between two values
 */
function lerp(a, b, t) {
  return a + (b - a) * t
}

/**
 * Interpolate between two hex colors
 */
function lerpColor(colorA, colorB, t) {
  // Parse hex to RGB
  const parseHex = (hex) => {
    const clean = hex.replace('#', '')
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    }
  }
  
  const a = parseHex(colorA)
  const b = parseHex(colorB)
  
  const r = Math.round(lerp(a.r, b.r, t))
  const g = Math.round(lerp(a.g, b.g, t))
  const bl = Math.round(lerp(a.b, b.b, t))
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`
}

/**
 * Interpolate the color system based on identity
 */
function interpolateColors(identity) {
  // Use a smooth curve rather than linear for more natural feel
  // Slight ease toward the edges
  const t = identity
  
  return {
    background: lerpColor(DESIGN_COLORS.background, TECH_COLORS.background, t),
    backgroundAlt: lerpColor(DESIGN_COLORS.backgroundAlt, TECH_COLORS.backgroundAlt, t),
    accent: lerpColor(DESIGN_COLORS.accent, TECH_COLORS.accent, t),
    accentGlow: lerpColor(DESIGN_COLORS.accentGlow, TECH_COLORS.accentGlow, t),
    text: lerpColor(DESIGN_COLORS.text, TECH_COLORS.text, t),
    textMuted: lerpColor(DESIGN_COLORS.textMuted, TECH_COLORS.textMuted, t),
    // Overlay needs alpha preservation
    overlay: t < 0.5 
      ? `rgba(196, 112, 58, ${lerp(0.03, 0.015, t * 2)})`
      : `rgba(58, 156, 196, ${lerp(0.015, 0.03, (t - 0.5) * 2)})`,
    grain: lerp(DESIGN_COLORS.grain, TECH_COLORS.grain, t),
  }
}

/**
 * Interpolate motion behavior based on identity
 */
function interpolateMotion(identity) {
  const t = identity
  
  return {
    stiffness: lerp(DESIGN_MOTION.stiffness, TECH_MOTION.stiffness, t),
    damping: lerp(DESIGN_MOTION.damping, TECH_MOTION.damping, t),
    mass: lerp(DESIGN_MOTION.mass, TECH_MOTION.mass, t),
    duration: lerp(DESIGN_MOTION.duration, TECH_MOTION.duration, t),
    ease: t < 0.5 ? DESIGN_MOTION.ease : TECH_MOTION.ease,
  }
}

/**
 * Interpolate typography based on identity
 */
function interpolateTypography(identity) {
  const t = identity
  
  // Letter spacing needs special handling (em values)
  const designSpacing = -0.02
  const techSpacing = 0.04
  const spacing = lerp(designSpacing, techSpacing, t)
  
  return {
    letterSpacing: `${spacing}em`,
    fontWeight: Math.round(lerp(DESIGN_TYPOGRAPHY.fontWeight, TECH_TYPOGRAPHY.fontWeight, t)),
    lineHeight: lerp(DESIGN_TYPOGRAPHY.lineHeight, TECH_TYPOGRAPHY.lineHeight, t),
    textShadow: t < 0.5 
      ? `0 0 ${lerp(40, 20, t * 2)}px rgba(196, 112, 58, ${lerp(0.15, 0.1, t * 2)})`
      : `0 0 ${lerp(20, 20, (t - 0.5) * 2)}px rgba(58, 156, 196, ${lerp(0.1, 0.2, (t - 0.5) * 2)})`,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SELECTORS (for optimized subscriptions)
// ═══════════════════════════════════════════════════════════════════════════

export const selectIdentity = (state) => state.identity
export const selectColors = (state) => state.colors
export const selectMotion = (state) => state.motion
export const selectTypography = (state) => state.typography
export const selectIsTransitioning = (state) => state.isTransitioning

// ═══════════════════════════════════════════════════════════════════════════
// CSS CUSTOM PROPERTIES SYNC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sync identity state to CSS custom properties for non-React elements
 * Call this from a useEffect in a top-level component
 */
export function syncIdentityToCSS(identity, colors, typography) {
  const root = document.documentElement
  
  // Core identity value
  root.style.setProperty('--identity', identity.toString())
  root.style.setProperty('--identity-design', (1 - identity).toString())
  root.style.setProperty('--identity-tech', identity.toString())
  
  // Colors
  root.style.setProperty('--identity-bg', colors.background)
  root.style.setProperty('--identity-bg-alt', colors.backgroundAlt)
  root.style.setProperty('--identity-accent', colors.accent)
  root.style.setProperty('--identity-accent-glow', colors.accentGlow)
  root.style.setProperty('--identity-text', colors.text)
  root.style.setProperty('--identity-text-muted', colors.textMuted)
  root.style.setProperty('--identity-overlay', colors.overlay)
  root.style.setProperty('--identity-grain', colors.grain.toString())
  
  // Typography
  root.style.setProperty('--identity-letter-spacing', typography.letterSpacing)
  root.style.setProperty('--identity-font-weight', typography.fontWeight.toString())
  root.style.setProperty('--identity-line-height', typography.lineHeight.toString())
  root.style.setProperty('--identity-text-shadow', typography.textShadow)
  
  // Body class for discrete theming fallbacks
  document.body.classList.remove('identity-design', 'identity-neutral', 'identity-tech')
  if (identity < 0.35) {
    document.body.classList.add('identity-design')
  } else if (identity > 0.65) {
    document.body.classList.add('identity-tech')
  } else {
    document.body.classList.add('identity-neutral')
  }
}
