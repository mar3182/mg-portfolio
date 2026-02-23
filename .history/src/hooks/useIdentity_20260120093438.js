/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IDENTITY HOOKS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * React hooks for consuming the identity system.
 * These provide optimized access to identity-derived values.
 */

import { useEffect, useMemo } from 'react'
import { useTransform, useSpring } from 'framer-motion'
import { 
  useIdentityStore, 
  identityMotionValue,
  selectIdentity,
  selectColors,
  selectMotion,
  selectTypography,
  syncIdentityToCSS,
} from '../stores/identityStore'

// ═══════════════════════════════════════════════════════════════════════════
// CORE HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get the raw identity value (0-1)
 */
export function useIdentity() {
  return useIdentityStore(selectIdentity)
}

/**
 * Get the identity colors
 */
export function useIdentityColors() {
  return useIdentityStore(selectColors)
}

/**
 * Get the identity motion config
 */
export function useIdentityMotion() {
  return useIdentityStore(selectMotion)
}

/**
 * Get the identity typography
 */
export function useIdentityTypography() {
  return useIdentityStore(selectTypography)
}

/**
 * Get identity actions (setIdentity, animateToIdentity, etc.)
 */
export function useIdentityActions() {
  const setIdentity = useIdentityStore((s) => s.setIdentity)
  const animateToIdentity = useIdentityStore((s) => s.animateToIdentity)
  const lockToDesign = useIdentityStore((s) => s.lockToDesign)
  const lockToTech = useIdentityStore((s) => s.lockToTech)
  const resetToNeutral = useIdentityStore((s) => s.resetToNeutral)
  
  return { setIdentity, animateToIdentity, lockToDesign, lockToTech, resetToNeutral }
}

// ═══════════════════════════════════════════════════════════════════════════
// MOTION VALUE HOOKS (for Framer Motion integration)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get the identity as a MotionValue for direct Framer Motion transforms
 */
export function useIdentityMotionValue() {
  return identityMotionValue
}

/**
 * Get a smoothed identity value using spring physics
 * Adapts spring config based on current identity
 */
export function useSmoothedIdentity() {
  const motion = useIdentityMotion()
  
  return useSpring(identityMotionValue, {
    stiffness: motion.stiffness,
    damping: motion.damping,
    mass: motion.mass,
  })
}

/**
 * Transform identity to an interpolated value
 * 
 * Example:
 * const opacity = useIdentityTransform([0, 0.5, 1], [0.3, 0.5, 1])
 */
export function useIdentityTransform(inputRange, outputRange) {
  return useTransform(identityMotionValue, inputRange, outputRange)
}

/**
 * Transform identity to interpolated colors
 * 
 * Example:
 * const bgColor = useIdentityColorTransform('#0f0c09', '#080a0f')
 */
export function useIdentityColorTransform(designColor, techColor) {
  return useTransform(identityMotionValue, [0, 1], [designColor, techColor])
}

// ═══════════════════════════════════════════════════════════════════════════
// DERIVED VALUE HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get the identity as a discrete label
 */
export function useIdentityLabel() {
  const identity = useIdentity()
  
  return useMemo(() => {
    if (identity < 0.35) return 'design'
    if (identity > 0.65) return 'tech'
    return 'neutral'
  }, [identity])
}

/**
 * Get a DELAYED identity value for portrait motion
 * Per T-Shaped spec: portrait should lag 80-120ms behind identity
 * This creates the cinematic "the world reacts, then she responds" feel
 * 
 * @param {number} _delayMs - Conceptual delay (implemented via soft spring physics)
 */
export function useDelayedIdentity(_delayMs = 100) {
  const smoothIdentity = useSmoothedIdentity()
  
  // Use a softer spring for the portrait - slower to react
  // This creates natural delay without explicit setTimeout
  // Softer spring = more delay feel
  return useSpring(smoothIdentity, {
    stiffness: 35, // Very soft
    damping: 30,
    mass: 1.2,     // Heavier = slower to accelerate
  })
}

/**
 * Check if currently on design side
 */
export function useIsDesign() {
  const identity = useIdentity()
  return identity < 0.4
}

/**
 * Check if currently on tech side
 */
export function useIsTech() {
  const identity = useIdentity()
  return identity > 0.6
}

/**
 * Get the "intensity" of the current identity (distance from neutral)
 * 0 = fully neutral, 1 = fully design or tech
 */
export function useIdentityIntensity() {
  const identity = useIdentity()
  return Math.abs(identity - 0.5) * 2
}

/**
 * Get the vertical scroll multiplier based on identity
 * Per T-Shaped spec: vertical is muted at center, unlocks toward edges
 * This teaches: "Choose a direction, then go deep"
 * 
 * Returns 0-1 where:
 * - 0 = vertical scroll disabled (at center)
 * - 1 = vertical scroll fully enabled (at edges)
 */
export function useVerticalScrollUnlock() {
  const identity = useIdentity()
  
  return useMemo(() => {
    // Distance from center (0-0.5 range)
    const distanceFromCenter = Math.abs(identity - 0.5)
    
    // Remap to 0-1 with easing (squared for smooth ramp)
    // At center (0.5): returns 0
    // At edges (0 or 1): returns 1
    const unlock = Math.pow(distanceFromCenter * 2, 1.5)
    
    return Math.min(1, unlock)
  }, [identity])
}

// ═══════════════════════════════════════════════════════════════════════════
// CSS SYNC HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sync identity state to CSS custom properties
 * Place this in your root layout component
 */
export function useIdentityCSSSync() {
  const identity = useIdentity()
  const colors = useIdentityColors()
  const typography = useIdentityTypography()
  
  useEffect(() => {
    syncIdentityToCSS(identity, colors, typography)
  }, [identity, colors, typography])
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO INTEGRATION HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for the hero portrait interaction
 * Returns handlers and values for mouse-based identity control
 */
export function useHeroIdentityControl(containerRef) {
  const { setIdentity } = useIdentityActions()
  
  const handleMouseMove = (e) => {
    if (!containerRef?.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    
    // Clamp to 0-1 range
    const clamped = Math.max(0, Math.min(1, x))
    
    // Update identity based on mouse position
    setIdentity(clamped, 'hero')
  }
  
  const handleMouseLeave = () => {
    // Optional: could lock to the side they were on, or return to neutral
    const identity = useIdentityStore.getState().identity
    
    if (identity < 0.3) {
      useIdentityStore.getState().animateToIdentity(0, { source: 'hero-exit' })
    } else if (identity > 0.7) {
      useIdentityStore.getState().animateToIdentity(1, { source: 'hero-exit' })
    } else {
      useIdentityStore.getState().animateToIdentity(0.5, { source: 'hero-exit' })
    }
  }
  
  return {
    handleMouseMove,
    handleMouseLeave,
    identityMotionValue,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SPRING CONFIG HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get spring config that adapts to current identity
 * Design = slower, more organic
 * Tech = faster, more precise
 */
export function useIdentitySpringConfig() {
  const motion = useIdentityMotion()
  
  return useMemo(() => ({
    stiffness: motion.stiffness,
    damping: motion.damping,
    mass: motion.mass,
  }), [motion])
}

/**
 * Get transition config for Framer Motion variants
 */
export function useIdentityTransitionConfig() {
  const motion = useIdentityMotion()
  
  return useMemo(() => ({
    duration: motion.duration,
    ease: motion.ease,
  }), [motion])
}
