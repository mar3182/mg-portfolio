/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AMBIENT LAYERS — Grain, Vignette, Light Effects
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Per spec: "Add subtle noise / grain on top for cinematic depth."
 * 
 * These layers sit above all content and provide:
 * - Film grain (identity-reactive intensity)
 * - Vignette (edge darkening)
 * - Subtle light bloom around portrait region
 */

import { memo, useMemo } from 'react'
import { motion, useTransform } from 'framer-motion'
import { useIdentityContext } from './IdentityMotionProvider'

// ═══════════════════════════════════════════════════════════════════════════
// GRAIN OVERLAY
// ═══════════════════════════════════════════════════════════════════════════

function GrainOverlay() {
  const { grainIntensity } = useIdentityContext()
  
  // Generate noise SVG data URL (static, no animation for performance)
  const noiseSvg = useMemo(() => {
    return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
  }, [])
  
  return (
    <motion.div
      className="grain-overlay"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: noiseSvg,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        opacity: grainIntensity,
        mixBlendMode: 'overlay',
        zIndex: 100,
      }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// VIGNETTE OVERLAY
// ═══════════════════════════════════════════════════════════════════════════

function VignetteOverlay() {
  const { identity } = useIdentityContext()
  
  // Vignette color shifts with identity
  // Design: warm black edges
  // Tech: cool black edges
  const vignetteColor = useTransform(
    identity,
    [0, 1],
    ['rgba(15, 12, 9, 0.6)', 'rgba(8, 10, 15, 0.6)']
  )
  
  return (
    <motion.div
      className="vignette-overlay"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: useTransform(
          vignetteColor,
          (color) => `radial-gradient(ellipse at center, transparent 30%, ${color} 100%)`
        ),
        zIndex: 99,
      }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LIGHT BLOOM (subtle glow around portrait)
// ═══════════════════════════════════════════════════════════════════════════

function LightBloom() {
  const { identity } = useIdentityContext()
  
  // Bloom color shifts with identity
  const bloomColor = useTransform(
    identity,
    [0, 0.5, 1],
    [
      'radial-gradient(ellipse 40% 50% at 50% 50%, rgba(232, 154, 95, 0.08) 0%, transparent 70%)',
      'radial-gradient(ellipse 40% 50% at 50% 50%, rgba(200, 200, 200, 0.04) 0%, transparent 70%)',
      'radial-gradient(ellipse 40% 50% at 50% 50%, rgba(95, 189, 232, 0.08) 0%, transparent 70%)',
    ]
  )
  
  return (
    <motion.div
      className="light-bloom"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: bloomColor,
        zIndex: 5, // Below portrait
      }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// AMBIENT BASE (CSS gradient background)
// ═══════════════════════════════════════════════════════════════════════════

function AmbientBase() {
  const { identity } = useIdentityContext()
  
  // Background shifts from warm to cool
  const bgGradient = useTransform(
    identity,
    [0, 0.5, 1],
    [
      'radial-gradient(ellipse at center, #0f0c09 0%, #050403 100%)', // Warm
      'radial-gradient(ellipse at center, #0d0d0d 0%, #050505 100%)', // Neutral
      'radial-gradient(ellipse at center, #080a0f 0%, #030405 100%)', // Cool
    ]
  )
  
  return (
    <motion.div
      className="ambient-base hero-base"
      style={{
        position: 'absolute',
        inset: 0,
        background: bgGradient,
        zIndex: 0,
      }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// COMBINED AMBIENT LAYERS EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export function AmbientLayers() {
  return (
    <>
      <AmbientBase />
      <LightBloom />
      <VignetteOverlay />
      <GrainOverlay />
    </>
  )
}

export { GrainOverlay, VignetteOverlay, LightBloom, AmbientBase }
export default memo(AmbientLayers)
