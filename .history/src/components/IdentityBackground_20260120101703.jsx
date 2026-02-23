/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IDENTITY BACKGROUND
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The living, breathing background that responds to the identity value.
 * 
 * DESIGN INTENT:
 * - Background matches portrait images for seamless blend
 * - Design side: warm cream (rgba(249, 228, 207)) to match portrait
 * - Tech side: pure black to match portrait
 * - Transitions should feel cinematic, not snappy
 */

import { memo } from 'react'
import { motion as Motion, useTransform } from 'framer-motion'
import { 
  useSmoothedIdentity 
} from '../hooks/useIdentity'
import './styles/identity-background.css'

// ═══════════════════════════════════════════════════════════════════════════
// COLOR DEFINITIONS - Match Portrait Images
// ═══════════════════════════════════════════════════════════════════════════

// Design side - warm cream tones
const DESIGN_BG = '#f9e4cf'        // Main cream: rgba(249, 228, 207)
const DESIGN_BG_DARK = '#e8d0b8'   // Slightly darker cream for depth
const DESIGN_ACCENT = '#d4a574'    // Warm accent

// Tech side - deep dark tones with color variation
const TECH_BG = '#000000'          // Pure black (portrait match)
const TECH_BG_MID = '#0a0812'      // Deep purple-black
const TECH_ACCENT_BLUE = '#0d1a2d' // Deep navy blue
const TECH_ACCENT_PURPLE = '#12081a' // Deep purple
const TECH_ACCENT_CYAN = '#081a1a' // Deep teal/cyan

// Neutral center
const NEUTRAL_BG = '#1a1614'       // Warm dark neutral

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function IdentityBackground() {
  const smoothIdentity = useSmoothedIdentity()
  
  // ─── Derived Motion Values ───
  
  // Background color interpolation - matches portrait backgrounds
  const backgroundColor = useTransform(
    smoothIdentity,
    [0, 0.35, 0.5, 0.65, 1],
    [DESIGN_BG, DESIGN_BG_DARK, NEUTRAL_BG, TECH_BG_LIGHT, TECH_BG]
  )
  
  // Grain opacity - more visible on light, subtle on dark
  const grainOpacity = useTransform(smoothIdentity, [0, 0.5, 1], [0.08, 0.04, 0.02])
  
  // Vignette intensity - stronger on edges for depth
  const vignetteOpacity = useTransform(smoothIdentity, [0, 0.5, 1], [0.3, 0.5, 0.6])
  
  // Warm glow for design side
  const warmGlowOpacity = useTransform(smoothIdentity, [0, 0.4, 0.6], [0.4, 0.1, 0])
  
  // Cool glow for tech side (subtle blue-purple)
  const coolGlowOpacity = useTransform(smoothIdentity, [0.4, 0.6, 1], [0, 0.1, 0.2])
  
  return (
    <div className="identity-background" aria-hidden="true">
      {/* Base layer - solid color matching portraits */}
      <Motion.div 
        className="identity-bg__base"
        style={{ backgroundColor }}
      />
      
      {/* Warm radial glow - design side */}
      <Motion.div 
        className="identity-bg__gradient identity-bg__gradient--primary"
        style={{
          opacity: warmGlowOpacity,
          background: `radial-gradient(ellipse 100% 80% at 30% 50%, ${DESIGN_ACCENT} 0%, transparent 60%)`,
        }}
      />
      
      {/* Cool radial glow - tech side */}
      <Motion.div 
        className="identity-bg__gradient identity-bg__gradient--secondary"
        style={{
          opacity: coolGlowOpacity,
          background: `radial-gradient(ellipse 100% 80% at 70% 50%, ${TECH_ACCENT} 0%, transparent 60%)`,
        }}
      />
      
      {/* Edge vignette - subtle depth, stronger on dark side */}
      <Motion.div 
        className="identity-bg__vignette" 
        style={{ opacity: vignetteOpacity }}
      />
      
      {/* Film grain overlay - more visible on light backgrounds */}
      <Motion.div 
        className="identity-bg__grain"
        style={{ opacity: grainOpacity }}
      />
      
      {/* Scan lines (tech identity only) */}
      <Motion.div 
        className="identity-bg__scanlines"
        style={{
          opacity: useTransform(smoothIdentity, [0.6, 1], [0, 0.03]),
        }}
      />
    </div>
  )
}

export default memo(IdentityBackground)
