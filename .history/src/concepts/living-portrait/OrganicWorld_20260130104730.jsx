/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORGANIC WORLD — Video Background Only
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Design side with video background for rich organic atmosphere
 */

import { memo, useRef, useEffect } from 'react'
import { useTransform, motion, useSpring } from 'framer-motion'

function OrganicWorld({ identity, horizontalShift }) {
  const videoRef = useRef(null)
  
  // Smooth spring for identity transitions
  const smoothIdentity = useSpring(identity, { stiffness: 40, damping: 25 })
  
  // Transform identity (0 = design, 1 = tech) to opacity and movement
  const opacity = useTransform(smoothIdentity, [0, 0.3, 0.7, 1], [1, 0.8, 0.3, 0])
  const scale = useTransform(smoothIdentity, [0, 0.5, 1], [1, 0.98, 0.92])
  
  // Horizontal scroll shift (passed from parent)
  const shiftX = useTransform(horizontalShift || smoothIdentity, 
    horizontalShift ? [25, 0, -25] : [0, 0.5, 1], 
    horizontalShift ? ['25vw', '0vw', '-25vw'] : ['20vw', '0vw', '-20vw']
  )
  
  // Video layer parallax
  const videoX = useTransform(smoothIdentity, [0, 1], [0, 120])
  const videoY = useTransform(smoothIdentity, [0, 1], [0, 60])
  const videoRotate = useTransform(smoothIdentity, [0, 1], [0, 8])
  
  // Video playback control - pause when not visible
  useEffect(() => {
    const unsubscribe = opacity.on('change', (value) => {
      if (videoRef.current) {
        if (value > 0.1) {
          videoRef.current.play().catch(() => {})
        } else {
          videoRef.current.pause()
        }
      }
    })
    return () => unsubscribe()
  }, [opacity])

  return (
    <motion.div 
      className="organic-world"
      style={{ opacity, scale, x: shiftX }}
    >
      {/* Video background layer */}
      <motion.div 
        className="organic-world__video-layer"
        style={{ 
          x: videoX, 
          y: videoY,
          rotate: videoRotate,
        }}
      >
        <video 
          ref={videoRef}
          className="organic-world__video"
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/video (1).webm" type="video/webm" />
          <source src="/video (1).mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Glow overlay */}
      <motion.div 
        className="organic-world__glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
    </motion.div>
  )
}

export default memo(OrganicWorld)
