/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PORTRAIT — Identity-Driven Directional Bias
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Per spec: "Portrait assets: portrait-design-left.webp (transparent),
 * portrait-neutral.webp, portrait-tech-right.webp"
 * 
 * The portrait crossfades between three states based on identity:
 * - Design (0): Looking/biased left, warm lighting
 * - Neutral (0.5): Center gaze, balanced
 * - Tech (1): Looking/biased right, cool lighting
 * 
 * Motion principle: "The portrait does not perform. The environment responds."
 */

import { memo } from 'react'
import { motion, useTransform } from 'framer-motion'
import { useIdentityContext } from './IdentityMotionProvider'

// ═══════════════════════════════════════════════════════════════════════════
// PORTRAIT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function Portrait({
  designImage = '/portrait-design-left.png',
  neutralImage = '/portrait-split.png', 
  techImage = '/portrait-tech-right.png',
  size = 420,
}) {
  const { identity } = useIdentityContext()
  
  // ═══ POSITIONAL BIAS ═══
  // Subtle horizontal drift following identity
  // Per spec: x transforms from [-24, 24] based on identity
  const x = useTransform(identity, [0, 1], [-24, 24])
  
  // Very subtle vertical drift (breathing motion)
  const y = useTransform(identity, [0, 0.5, 1], [4, 0, 4])
  
  // ═══ CROSSFADE OPACITIES ═══
  // Design portrait: Full at 0, fades by 0.4
  const designOpacity = useTransform(identity, [0, 0.3, 0.5], [1, 0.5, 0])
  
  // Neutral portrait: Visible in center zone (0.3-0.7)
  const neutralOpacity = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], [0, 0.5, 1, 0.5, 0])
  
  // Tech portrait: Full at 1, fades by 0.6
  const techOpacity = useTransform(identity, [0.5, 0.7, 1], [0, 0.5, 1])
  
  // ═══ SCALE (subtle depth) ═══
  // Very slight scale change for parallax depth
  const scale = useTransform(identity, [0, 0.5, 1], [1.02, 1, 1.02])

  const imageStyle = {
    position: 'absolute',
    width: size,
    height: 'auto',
    maxHeight: '85vh',
    objectFit: 'contain',
    userSelect: 'none',
    pointerEvents: 'none',
  }

  return (
    <div 
      className="portrait-container"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10, // Above backgrounds, below UI
      }}
    >
      {/* Design Portrait (Left-looking) */}
      <motion.img
        src={designImage}
        alt=""
        style={{
          ...imageStyle,
          opacity: designOpacity,
          x,
          y,
          scale,
        }}
        draggable={false}
      />
      
      {/* Neutral Portrait (Center) */}
      <motion.img
        src={neutralImage}
        alt=""
        style={{
          ...imageStyle,
          opacity: neutralOpacity,
          x,
          y,
          scale,
        }}
        draggable={false}
      />
      
      {/* Tech Portrait (Right-looking) */}
      <motion.img
        src={techImage}
        alt=""
        style={{
          ...imageStyle,
          opacity: techOpacity,
          x,
          y,
          scale,
        }}
        draggable={false}
      />
    </div>
  )
}

export default memo(Portrait)
