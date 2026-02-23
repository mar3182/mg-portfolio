/**
 * Hero Portraits Component
 * Clean three portrait layout - balanced triad: Tech → Human → Design
 * Elegance through restraint, not effects
 */

import { motion, useTransform } from 'framer-motion'

export function HeroPortraits({ parallaxX, parallaxY, onHover, onLeave }) {
  return (
    <div className="hero-portraits-container">
      {/* Left Portrait - Tech (subtle green tint) */}
      <motion.div 
        className="portrait portrait-left"
        style={{
          x: useTransform(parallaxX, (x) => x * -1.2),
          y: useTransform(parallaxY, (y) => y * 0.6),
        }}
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 0.92, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div className="portrait-image-wrapper">
          <img 
            src="/portrait-tech-right.png" 
            alt="Tech portrait"
            className="portrait-img tech-green"
          />
        </div>
      </motion.div>
      
      {/* Center Portrait - Main B&W - PRIMARY FOCUS */}
      <motion.div 
        className="portrait portrait-center"
        style={{
          y: useTransform(parallaxY, (y) => y * 0.3),
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div className="portrait-image-wrapper center-portrait">
          <img 
            src="/portrait-base.png" 
            alt="Main portrait"
            className="portrait-img portrait-main"
          />
        </div>
      </motion.div>
      
      {/* Right Portrait - Design (subtle warm tint) - balanced with left */}
      <motion.div 
        className="portrait portrait-right"
        style={{
          x: useTransform(parallaxX, (x) => x * 1.0),
          y: useTransform(parallaxY, (y) => y * -0.5),
        }}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 0.88, x: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div className="portrait-image-wrapper warm-overlay">
          <img 
            src="/portrait-design-left.png" 
            alt="Design portrait"
            className="portrait-img warm-gradient"
          />
        </div>
      </motion.div>
    </div>
  )
}
