/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IDENTITY BACKGROUND — Award-Level Compositing
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ARCHITECTURE (3 Layers):
 * 
 * 1️⃣ BASE ATMOSPHERE — Always present, never changes
 *    - Very dark neutral gradient
 *    - Slight noise
 *    - Visual stability, cinematic calm
 * 
 * 2️⃣ IDENTITY ATMOSPHERE — Drifts with identity (Design ↔ Tech)
 *    - Warm tones (design) / Cool tones (tech)
 *    - NEVER fully fades — keep 10-15% presence
 *    - Creates continuous world
 * 
 * 3️⃣ ACCENT LAYER — Very subtle, barely noticeable
 *    - If someone notices it consciously, it's too strong
 *    - Slow motion, low opacity
 * 
 * CRITICAL RULES:
 * - Backgrounds DRIFT, never SWITCH
 * - No hard transitions
 * - Motion slower than portrait, slower than cursor
 * - 2-4s easing, never springy
 * - Muted colors only (no neon, no pure black/white)
 */

import { memo } from 'react'
import { motion as Motion, useTransform } from 'framer-motion'
import { 
  useSmoothedIdentity 
} from '../hooks/useIdentity'
import './styles/identity-background.css'

// ═══════════════════════════════════════════════════════════════════════════
// COLOR PALETTE — Muted, Editorial, Gallery Lighting
// ═══════════════════════════════════════════════════════════════════════════

// Base atmosphere - always present
const BASE_DARK = '#0a0908'        // Warm-tinted near-black
const BASE_CENTER = '#0e0d0c'     // Slightly lighter center

// Design identity - STRONGER warmth for visible contrast
const DESIGN_WARM = '#221a14'      // Warmer, more visible
const DESIGN_ACCENT = '#2e2218'    // Richer terracotta undertone

// Tech identity - STRONGER coolness for visible contrast
const TECH_COOL = '#0e1218'        // Cooler, more visible
const TECH_ACCENT = '#0c141c'      // Richer navy undertone

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function IdentityBackground() {
  const smoothIdentity = useSmoothedIdentity()
  
  // ─── LAYER 1: Base Atmosphere (Always Present) ───
  // This never changes - provides visual stability
  
  // ─── LAYER 2: Identity Atmospheres ───
  // CRITICAL: Never fully fade - keep 10-15% presence for continuity
  
  // Design atmosphere: visible at 0, fades but never disappears
  const designOpacity = useTransform(
    smoothIdentity, 
    [0, 0.5, 1], 
    [0.85, 0.4, 0.12]  // Never goes below 0.12
  )
  
  // Tech atmosphere: visible at 1, fades but never disappears
  const techOpacity = useTransform(
    smoothIdentity, 
    [0, 0.5, 1], 
    [0.12, 0.4, 0.85]  // Never goes below 0.12
  )
  
  // ─── LAYER 3: Accent/Energy (Subtle but Perceptible) ───
  // Should register subconsciously — not invisible
  const accentDesignOpacity = useTransform(
    smoothIdentity,
    [0, 0.4, 0.7],
    [0.25, 0.1, 0]
  )
  
  const accentTechOpacity = useTransform(
    smoothIdentity,
    [0.3, 0.6, 1],
    [0, 0.1, 0.22]
  )
  
  // Subtle grain - always present, very low
  const grainOpacity = useTransform(smoothIdentity, [0, 1], [0.04, 0.025])
  
  return (
    <div className="identity-background" aria-hidden="true">
      
      {/* ═══ LAYER 1: BASE ATMOSPHERE ═══ */}
      {/* Always present - cinematic stability */}
      <div 
        className="identity-bg__base"
        style={{
          background: `radial-gradient(ellipse 120% 100% at 50% 50%, ${BASE_CENTER} 0%, ${BASE_DARK} 100%)`
        }}
      />
      
      {/* ═══ LAYER 2: IDENTITY ATMOSPHERES ═══ */}
      {/* These drift, never switch. Both always partially present. */}
      
      {/* Design Atmosphere - warm, organic, asymmetric */}
      <Motion.div 
        className="identity-bg__atmosphere identity-bg__atmosphere--design"
        style={{
          opacity: designOpacity,
          background: `
            radial-gradient(ellipse 80% 70% at 25% 30%, ${DESIGN_WARM} 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 75% 80%, ${DESIGN_ACCENT} 0%, transparent 60%)
          `
        }}
        transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
      />
      
      {/* Tech Atmosphere - cool, subtle grid alignment feel */}
      <Motion.div 
        className="identity-bg__atmosphere identity-bg__atmosphere--tech"
        style={{
          opacity: techOpacity,
          background: `
            radial-gradient(ellipse 70% 60% at 70% 25%, ${TECH_COOL} 0%, transparent 65%),
            radial-gradient(ellipse 50% 70% at 30% 75%, ${TECH_ACCENT} 0%, transparent 55%)
          `
        }}
        transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
      />
      
      {/* ═══ LAYER 3: ACCENT/ENERGY ═══ */}
      {/* Barely noticeable - subconscious */}
      
      {/* Design accent - very subtle warm glow */}
      <Motion.div 
        className="identity-bg__accent"
        style={{
          opacity: accentDesignOpacity,
          background: `radial-gradient(ellipse 40% 40% at 20% 40%, rgba(180, 140, 100, 0.15) 0%, transparent 100%)`
        }}
        transition={{ duration: 3, ease: 'linear' }}
      />
      
      {/* Tech accent - very subtle cool glow */}
      <Motion.div 
        className="identity-bg__accent"
        style={{
          opacity: accentTechOpacity,
          background: `radial-gradient(ellipse 40% 40% at 80% 60%, rgba(100, 130, 160, 0.12) 0%, transparent 100%)`
        }}
        transition={{ duration: 3, ease: 'linear' }}
      />
      
      {/* ═══ TOP LAYERS: Light / Grain / Vignette ═══ */}
      
      {/* Soft vignette - frames the portrait */}
      <div className="identity-bg__vignette" />
      
      {/* Film grain - subtle texture */}
      <Motion.div 
        className="identity-bg__grain"
        style={{ opacity: grainOpacity }}
      />
    </div>
  )
}

export default memo(IdentityBackground)
