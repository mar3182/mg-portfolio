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
      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 1 - Main animated video (flowing from portrait area)
          ═══════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="organic-world__layer organic-world__layer--main"
        style={{ 
          x: layer1X, 
          y: layer1Y,
          rotate: rotate1,
        }}
        initial={{ opacity: 0, scale: 0.9, x: 100, y: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <video 
          ref={videoRef}
          className="organic-world__video organic-world__video--main"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/video (1).webm" type="video/webm" />
          <source src="/video (1).mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 1B - Mirrored video (horizontally flipped for seamless edges)
          ═══════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="organic-world__layer organic-world__layer--main-mirror"
        style={{ 
          x: layer1X, 
          y: layer1Y,
          rotate: rotate1,
        }}
        initial={{ opacity: 0, scale: 0.9, x: -100, y: 50 }}
        animate={{ opacity: 0.7, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <video 
          className="organic-world__video organic-world__video--main-mirror"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/video (1).webm" type="video/webm" />
          <source src="/video (1).mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 2 - Mirrored video layer for depth
          ═══════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="organic-world__layer organic-world__layer--mirror"
        style={{ 
          x: layer2X, 
          y: layer2Y,
          rotate: rotate2,
        }}
        initial={{ opacity: 0, scale: 0.85, x: -150 }}
        animate={{ opacity: 0.5, scale: 1, x: 0 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      >
        <video 
          ref={mirrorVideoRef}
          className="organic-world__video organic-world__video--mirror"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/video (1).webm" type="video/webm" />
          <source src="/video (1).mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 3 - Glow/ambient effect centered on portrait
          ═══════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="organic-world__glow"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      />
    </motion.div>
  )
}

export default memo(OrganicWorld)
