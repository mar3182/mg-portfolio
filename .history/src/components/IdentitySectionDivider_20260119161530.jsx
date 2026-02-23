/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IDENTITY SECTION DIVIDER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * A decorative section divider that responds to the identity value.
 * Use this between major page sections to maintain visual continuity.
 * 
 * DESIGN INTENT:
 * - Design: flowing, organic wave pattern
 * - Tech: sharp, geometric step pattern
 * - Both should feel intentional and premium
 */

import { memo } from 'react'
import { motion as Motion, useTransform } from 'framer-motion'
import { useSmoothedIdentity } from '../hooks/useIdentity'
import './styles/identity-section-divider.css'

function IdentitySectionDivider({ 
  variant = 'default', // 'default' | 'inverted'
  className = '',
}) {
  const smoothIdentity = useSmoothedIdentity()
  
  // Morphing between organic wave and geometric steps
  const organicPath = 'M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z'
  const geometricPath = 'M0,50 L25,50 L25,35 L50,35 L50,50 L75,50 L75,40 L100,40 L100,100 L0,100 Z'
  
  // Interpolate between paths (conceptual - actual morphing would need more sophisticated approach)
  const pathD = useTransform(smoothIdentity, [0, 1], [organicPath, geometricPath])
  
  // Fill color based on identity
  const fillColor = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    [
      'rgba(196, 112, 58, 0.05)',
      'rgba(128, 128, 128, 0.03)',
      'rgba(58, 156, 196, 0.05)'
    ]
  )
  
  // Stroke color
  const strokeColor = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    [
      'rgba(196, 112, 58, 0.15)',
      'rgba(128, 128, 128, 0.1)',
      'rgba(58, 156, 196, 0.15)'
    ]
  )
  
  return (
    <div 
      className={`identity-section-divider identity-section-divider--${variant} ${className}`}
      aria-hidden="true"
    >
      <Motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="divider-svg"
      >
        <Motion.path
          d={pathD}
          style={{ fill: fillColor, stroke: strokeColor }}
          strokeWidth="0.5"
        />
      </Motion.svg>
    </div>
  )
}

export default memo(IdentitySectionDivider)
