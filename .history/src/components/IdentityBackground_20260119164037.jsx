/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IDENTITY BACKGROUND
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The living, breathing background that responds to the identity value.
 * 
 * DESIGN INTENT:
 * - The background should feel like it's alive, not just colored
 * - Subtle gradients, grain, and ambient movement
 * - Design side: warm, organic gradients with soft grain
 * - Tech side: cool, precise gradients with minimal noise
 * - Transitions should feel cinematic, not snappy
 */

import { memo, useRef, useEffect } from 'react'
import { motion as Motion, useTransform } from 'framer-motion'
import { 
  useIdentityMotionValue, 
  useIdentityColors, 
  useSmoothedIdentity 
} from '../hooks/useIdentity'
import './styles/identity-background.css'

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function IdentityBackground() {
  const smoothIdentity = useSmoothedIdentity()
  // Note: canvasRef available for future canvas-based effects
  // const canvasRef = useRef(null)
  
  // ─── Derived Motion Values ───
  
  // Background color interpolation
  const backgroundColor = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    ['#0f0c09', '#0d0d0d', '#080a0f']
  )
  
  // Note: gradientX/Y available for more complex gradient positioning
  // const gradientX = useTransform(smoothIdentity, [0, 1], ['30%', '70%'])
  // const gradientY = useTransform(smoothIdentity, [0, 1], ['40%', '60%'])
  
  // Grain opacity varies
  const grainOpacity = useTransform(smoothIdentity, [0, 0.5, 1], [0.04, 0.03, 0.02])
  
  // Accent glow color
  const glowColorDesign = 'rgba(196, 112, 58, 0.08)'
  const glowColorTech = 'rgba(58, 156, 196, 0.08)'
  const glowColor = useTransform(
    smoothIdentity, 
    [0, 0.5, 1], 
    [glowColorDesign, 'rgba(128, 128, 128, 0.04)', glowColorTech]
  )
  
  // Secondary glow (opposite corner)
  const secondaryGlowOpacity = useTransform(smoothIdentity, [0, 0.5, 1], [0.03, 0.02, 0.03])
  
  // ─── Ambient Animation (subtle breathing) ───
  
  useEffect(() => {
    // Optional: Add subtle canvas-based noise/grain animation
    // For now, using CSS-based grain for performance
  }, [])
  
  return (
    <div className="identity-background" aria-hidden="true">
      {/* Base layer - solid color */}
      <Motion.div 
        className="identity-bg__base"
        style={{ backgroundColor }}
      />
      
      {/* Primary radial gradient - follows identity */}
      <Motion.div 
        className="identity-bg__gradient identity-bg__gradient--primary"
        style={{
          background: useTransform(
            [smoothIdentity, glowColor],
            ([identity, color]) => {
              const x = 30 + identity * 40
              const y = 30 + identity * 20
              return `radial-gradient(ellipse 80% 60% at ${x}% ${y}%, ${color} 0%, transparent 70%)`
            }
          ),
        }}
      />
      
      {/* Secondary radial gradient - counter-movement */}
      <Motion.div 
        className="identity-bg__gradient identity-bg__gradient--secondary"
        style={{
          background: useTransform(
            [smoothIdentity, secondaryGlowOpacity],
            ([identity, opacity]) => {
              const x = 70 - identity * 40
              const y = 70 - identity * 20
              const color = identity < 0.5 
                ? `rgba(196, 112, 58, ${opacity})`
                : `rgba(58, 156, 196, ${opacity})`
              return `radial-gradient(ellipse 60% 80% at ${x}% ${y}%, ${color} 0%, transparent 60%)`
            }
          ),
        }}
      />
      
      {/* Edge vignette - subtle depth */}
      <div className="identity-bg__vignette" />
      
      {/* Film grain overlay */}
      <Motion.div 
        className="identity-bg__grain"
        style={{ opacity: grainOpacity }}
      />
      
      {/* Scan lines (tech identity only) */}
      <Motion.div 
        className="identity-bg__scanlines"
        style={{
          opacity: useTransform(smoothIdentity, [0.5, 1], [0, 0.015]),
        }}
      />
    </div>
  )
}

export default memo(IdentityBackground)
