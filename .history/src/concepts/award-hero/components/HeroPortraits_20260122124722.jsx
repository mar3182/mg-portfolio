/**
 * Hero Portraits Component
 * Three portrait layout - Tech (green) → Human (B&W) → Design (warm)
 * With circuit patterns on tech portrait
 */

import { motion, useTransform } from 'framer-motion'

export function HeroPortraits({ parallaxX, parallaxY, onHover, onLeave }) {
  return (
    <div className="hero-portraits-container">
      {/* Left Portrait - Tech with neon green and circuits */}
      <motion.div 
        className="portrait portrait-left"
        style={{
          x: useTransform(parallaxX, (x) => x * -1.5),
          y: useTransform(parallaxY, (y) => y * 0.8),
        }}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div className="portrait-image-wrapper matrix-overlay">
          <img 
            src="/portrait-tech-right.png" 
            alt="Tech portrait"
            className="portrait-img tech-green"
          />
          {/* Circuit patterns overlay */}
          <CircuitPatterns />
        </div>
      </motion.div>
      
      {/* Center Portrait - Main B&W - PRIMARY FOCUS */}
      <motion.div 
        className="portrait portrait-center"
        style={{
          y: useTransform(parallaxY, (y) => y * 0.3),
        }}
        initial={{ opacity: 0, y: 50 }}
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
      
      {/* Right Portrait - Design with warm colors */}
      <motion.div 
        className="portrait portrait-right"
        style={{
          x: useTransform(parallaxX, (x) => x * 1.2),
          y: useTransform(parallaxY, (y) => y * -0.6),
        }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.95, x: 0 }}
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

// Circuit patterns for tech portrait - neon green lines
function CircuitPatterns() {
  return (
    <svg 
      className="circuit-patterns" 
      viewBox="0 0 200 400" 
      fill="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.7,
      }}
    >
      {/* Flowing circuit lines */}
      <motion.path
        d="M60 0 C60 80, 40 120, 40 200 C40 280, 80 320, 60 400"
        stroke="rgba(0, 255, 136, 0.6)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.8, ease: 'easeInOut' }}
      />
      <motion.path
        d="M100 0 C100 100, 120 150, 100 250 C80 350, 120 380, 100 400"
        stroke="rgba(0, 255, 136, 0.4)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, delay: 1, ease: 'easeInOut' }}
      />
      <motion.path
        d="M140 0 C160 50, 140 100, 160 180 C180 260, 140 320, 160 400"
        stroke="rgba(0, 255, 136, 0.5)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, delay: 1.2, ease: 'easeInOut' }}
      />
      
      {/* Circuit nodes */}
      <motion.circle
        cx="60"
        cy="200"
        r="3"
        fill="rgba(0, 255, 136, 0.8)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 2.2 }}
      />
      <motion.circle
        cx="100"
        cy="250"
        r="2.5"
        fill="rgba(0, 255, 136, 0.7)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 2.4 }}
      />
      <motion.circle
        cx="160"
        cy="180"
        r="2"
        fill="rgba(0, 255, 136, 0.6)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 2.6 }}
      />
    </svg>
  )
}
