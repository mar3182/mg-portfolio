/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORGANIC WORLD — Optimized Single Video Background
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Performance-optimized: Uses a SINGLE video element with CSS effects
 * for mirroring and depth, avoiding multiple video decode operations.
 */

import { memo, useRef, useEffect } from 'react'
import { useTransform, motion, useSpring } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function OrganicWorld({ identity }) {
  const videoRef = useRef(null)
  
  // Smooth spring for identity transitions (reduced stiffness for performance)
  const smoothIdentity = useSpring(identity, { stiffness: 40, damping: 25 })
  
  // Transform identity (0 = design, 1 = tech) to opacity and movement
  const opacity = useTransform(smoothIdentity, [0, 0.3, 0.7, 1], [1, 0.8, 0.3, 0])
  const scale = useTransform(smoothIdentity, [0, 0.5, 1], [1, 0.98, 0.92])
  
  // Simplified parallax - single layer movement
  const layerX = useTransform(smoothIdentity, [0, 1], [0, 120])
  const layerY = useTransform(smoothIdentity, [0, 1], [0, 60])
  const rotate = useTransform(smoothIdentity, [0, 1], [0, 8])
  
  // Ensure video plays when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <motion.div 
      className="organic-world"
      style={{ opacity, scale }}
    >
      {/* Single optimized video layer with CSS-based mirroring for performance */}
      <motion.div 
        className="organic-world__layer organic-world__layer--main"
        style={{ 
          x: layerX, 
          y: layerY,
          rotate,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <video 
          ref={videoRef}
          className="organic-world__video organic-world__video--main"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/video (1).webm" type="video/webm" />
          <source src="/video (1).mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Glow effect - CSS only, no video */}
      <motion.div 
        className="organic-world__glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
    </motion.div>
  )
}

export default memo(OrganicWorld)
