/**
 * Hero Portraits Component
 * Three portrait layout with parallax effects and asymmetric positioning
 */

import { motion, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'

export function HeroPortraits({ parallaxX, parallaxY, onHover, onLeave }) {
  const [, setImagesLoaded] = useState(false)
  
  useEffect(() => {
    // Simulate image loading
    const timer = setTimeout(() => setImagesLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="hero-portraits-container">
      {/* Left Portrait - Matrix/Tech Version */}
      <motion.div 
        className="portrait portrait-left"
        style={{
          x: useTransform(parallaxX, (x) => x * -1.5),
          y: useTransform(parallaxY, (y) => y * 0.8),
        }}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div className="portrait-image-wrapper matrix-overlay">
          {/* Matrix effect overlay */}
          <div className="matrix-effect">
            <MatrixCodeRain />
          </div>
          
          {/* Portrait image */}
          <img 
            src="/portrait-tech-right.png" 
            alt="Tech portrait"
            className="portrait-img tech-green"
          />
          
          {/* Circuit patterns in hair */}
          <CircuitPatterns />
        </div>
      </motion.div>
      
      {/* Center Portrait - Main B&W with color accents */}
      <motion.div 
        className="portrait portrait-center"
        style={{
          // Slight offset for asymmetry
          y: useTransform(parallaxY, (y) => y * 0.3 + 15),
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div className="portrait-image-wrapper center-portrait">
          <img 
            src="/portrait-base.png" 
            alt="Main portrait"
            className="portrait-img portrait-main"
          />
          
          {/* Dotted pattern overlay */}
          <div className="dotted-pattern" />
        </div>
      </motion.div>
      
      {/* Right Portrait - Warm/Creative Version */}
      <motion.div 
        className="portrait portrait-right"
        style={{
          x: useTransform(parallaxX, (x) => x * 1.2),
          y: useTransform(parallaxY, (y) => y * -0.6),
        }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div className="portrait-image-wrapper warm-overlay">
          <img 
            src="/portrait-design-left.png" 
            alt="Design portrait"
            className="portrait-img warm-gradient"
          />
          
          {/* Flowing hair strands animation */}
          <HairFlowEffect />
        </div>
      </motion.div>
    </div>
  )
}

// Mini matrix code rain for left portrait
function MatrixCodeRain() {
  const columns = 8
  const chars = '01アイウエオカキクケコ'
  
  return (
    <div className="matrix-rain-mini">
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          className="matrix-column"
          style={{ left: `${(i / columns) * 100}%` }}
          initial={{ y: '-100%' }}
          animate={{ y: '100%' }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear',
          }}
        >
          {Array.from({ length: 10 }).map((_, j) => (
            <span key={j} style={{ opacity: 1 - j * 0.1 }}>
              {chars[Math.floor(Math.random() * chars.length)]}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

// Circuit patterns for tech portrait
function CircuitPatterns() {
  return (
    <svg className="circuit-patterns" viewBox="0 0 200 300" fill="none">
      <motion.path
        d="M50 0 L50 100 L100 100 L100 150"
        stroke="rgba(0, 255, 136, 0.5)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1, ease: 'easeInOut' }}
      />
      <motion.path
        d="M150 0 L150 50 L100 50 L100 100"
        stroke="rgba(0, 255, 136, 0.3)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1.2, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="100"
        cy="100"
        r="4"
        fill="rgba(0, 255, 136, 0.8)"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, delay: 2 }}
      />
      <motion.circle
        cx="50"
        cy="100"
        r="3"
        fill="rgba(0, 255, 136, 0.6)"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, delay: 2.2 }}
      />
    </svg>
  )
}

// Flowing hair effect for warm portrait
function HairFlowEffect() {
  const strands = 5
  
  return (
    <div className="hair-flow">
      {Array.from({ length: strands }).map((_, i) => (
        <motion.div
          key={i}
          className="hair-strand"
          style={{
            top: `${20 + i * 15}%`,
            right: `${10 + i * 5}%`,
            width: `${40 - i * 5}px`,
            height: '2px',
            background: `linear-gradient(90deg, transparent, rgba(255, ${100 + i * 30}, ${50 + i * 20}, 0.6))`,
          }}
          animate={{
            x: [0, 10, 0],
            y: [0, 3, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}
