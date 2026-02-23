/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORGANIC WORLD — Creative Layered Design Background
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Uses the design-background.svg creatively through multiple animated layers,
 * masks, and positioning to create forms that appear to flow from the portrait.
 */

import { memo } from 'react'
import { useTransform, motion, useSpring } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function OrganicWorld({ identity }) {
  // Smooth spring for identity transitions
  const smoothIdentity = useSpring(identity, { stiffness: 50, damping: 20 })
  
  // Transform identity (0 = design, 1 = tech) to opacity and movement
  const opacity = useTransform(smoothIdentity, [0, 0.3, 0.7, 1], [1, 0.8, 0.3, 0])
  const scale = useTransform(smoothIdentity, [0, 0.5, 1], [1, 0.95, 0.85])
  
  // Parallax movement - layers drift as identity changes
  const layer1X = useTransform(smoothIdentity, [0, 1], [0, 120])
  const layer1Y = useTransform(smoothIdentity, [0, 1], [0, 60])
  const layer2X = useTransform(smoothIdentity, [0, 1], [0, 80])
  const layer2Y = useTransform(smoothIdentity, [0, 1], [0, 40])
  const layer3X = useTransform(smoothIdentity, [0, 1], [0, 40])
  const layer3Y = useTransform(smoothIdentity, [0, 1], [0, 20])
  
  // Rotation for organic movement
  const rotate1 = useTransform(smoothIdentity, [0, 1], [0, 15])
  const rotate2 = useTransform(smoothIdentity, [0, 1], [0, -10])

  return (
    <motion.div 
      className="organic-world"
      style={{ opacity, scale }}
    >
      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 1 - Main flowing background (positioned to flow from portrait)
          ═══════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="organic-world__layer organic-world__layer--main"
        style={{ 
          x: layer1X, 
          y: layer1Y,
          rotate: rotate1,
        }}
        initial={{ opacity: 0, scale: 0.8, x: 200, y: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <img 
          src="/design-background.svg" 
          alt="" 
          className="organic-world__svg organic-world__svg--main"
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 2 - Mirrored/rotated layer for depth (opposite side)
          ═══════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="organic-world__layer organic-world__layer--mirror"
        style={{ 
          x: layer2X, 
          y: layer2Y,
          rotate: rotate2,
        }}
        initial={{ opacity: 0, scale: 0.7, x: -200 }}
        animate={{ opacity: 0.6, scale: 1, x: 0 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <img 
          src="/design-background.svg" 
          alt="" 
          className="organic-world__svg organic-world__svg--mirror"
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 3 - Vertical version for depth variation
          ═══════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="organic-world__layer organic-world__layer--vertical"
        style={{ 
          x: layer3X, 
          y: layer3Y,
        }}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      >
        <img 
          src="/design-barckground-vertical.png" 
          alt="" 
          className="organic-world__svg organic-world__svg--vertical"
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 4 - Glow/ambient effect centered on portrait
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
