/**
 * SplitPortraitHero — T-Shaped 3D Reveal Component
 * 
 * Concept:
 * - Initial state: Horizontal + vertical lines forming a "T" shape
 *   (synced from SplashLoader where T forms as M|G split)
 * - The horizontal line is the "edge" of the portrait seen in 3D
 * - Mouse movement left/right "rotates" the line to reveal the portrait
 * - Moving left reveals design portrait (warm, artistic)
 * - Moving right reveals tech portrait (cool, digital)
 * 
 * Like a thin card rotating from edge-on view to face view
 */

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion as Motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import './styles/split-portrait.css'

// Identity configuration
const IDENTITIES = {
  design: {
    title: 'designer',
    description: 'Product designer specialising in UI design and design systems.',
    color: '#c4703a',
  },
  tech: {
    title: '<coder>',
    description: 'Full stack developer who writes clean, elegant and efficient code.',
    color: '#3a7cc4',
  }
}

export default function SplitPortraitHero({ 
  designImage = '/portrait-design.png',
  techImage = '/portrait-tech.png',
  isReady = true, // Set to true when splash is complete
}) {
  const containerRef = useRef(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isAnimatedIn, setIsAnimatedIn] = useState(false)

  // Animate in after splash completes
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => setIsAnimatedIn(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isReady])

  // Mouse position tracking (0-1 range, 0.5 = center)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Smooth spring animation
  const springConfig = { stiffness: 100, damping: 30, mass: 0.8 }
  const smoothX = useSpring(mouseX, springConfig)

  // === 3D ROTATION TRANSFORMS ===
  // At center (0.5): portraits are edge-on (not visible)
  // At left (0): design face visible, flat
  // At right (1): tech face visible, flat
  
  // Design rotation: 0deg at left, 90deg at center
  const designRotateY = useTransform(smoothX, [0, 0.5], [0, 90])
  
  // Tech rotation: -90deg at center, 0deg at right
  const techRotateY = useTransform(smoothX, [0.5, 1], [-90, 0])
  
  // Opacity of the portraits based on position
  // Design shows when on left side (0-0.5)
  // Tech shows when on right side (0.5-1)
  const designOpacity = useTransform(smoothX, [0, 0.35, 0.5], [1, 0.5, 0])
  const techOpacity = useTransform(smoothX, [0.5, 0.65, 1], [0, 0.5, 1])
  
  // The "T" horizontal line width - starts as full line, shrinks to edge at center, expands again
  const lineScaleX = useTransform(smoothX, 
    [0, 0.3, 0.5, 0.7, 1], 
    [1, 0.3, 0.02, 0.3, 1]
  )
  
  // Vertical line opacity - visible at center, fades as portrait reveals
  const verticalLineOpacity = useTransform(smoothX,
    [0.3, 0.5, 0.7],
    [0, 1, 0]
  )

  // Handle mouse movement
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    mouseX.set(Math.max(0, Math.min(1, x)))
    mouseY.set(Math.max(0, Math.min(1, y)))
    
    if (!hasInteracted) setHasInteracted(true)
  }, [mouseX, mouseY, hasInteracted])

  const handleMouseLeave = () => {
    // Animate back to center (edge-on view)
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  // Touch support
  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current || !e.touches[0]) return
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = (touch.clientX - rect.left) / rect.width
    mouseX.set(Math.max(0, Math.min(1, x)))
    if (!hasInteracted) setHasInteracted(true)
  }, [mouseX, hasInteracted])

  return (
    <section 
      ref={containerRef}
      className="split-portrait-hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      data-cursor="explore"
    >
      {/* Design Side Label - Left */}
      <Motion.div 
        className="identity-panel identity-panel--design"
        style={{ opacity: designOpacity }}
      >
        <h2 className="identity-title identity-title--design">
          {IDENTITIES.design.title}
        </h2>
        <p className="identity-description">
          {IDENTITIES.design.description}
        </p>
      </Motion.div>

      {/* Tech Side Label - Right */}
      <Motion.div 
        className="identity-panel identity-panel--tech"
        style={{ opacity: techOpacity }}
      >
        <h2 className="identity-title identity-title--tech">
          {IDENTITIES.tech.title}
        </h2>
        <p className="identity-description">
          {IDENTITIES.tech.description}
        </p>
        
        {/* Code snippets */}
        <div className="code-snippets" aria-hidden="true">
          <span className="code-line">{'<html>'}</span>
          <span className="code-line">{'height:184px;}'}</span>
          <span className="code-line">{'class="creative"'}</span>
          <span className="code-line code-line--highlight">CSS3 <span style={{ opacity: 0.6 }}>HTML5</span></span>
        </div>
      </Motion.div>

      {/* === THE T-SHAPE: Horizontal + Vertical Lines === */}
      {/* These carry over from the splash animation */}
      <Motion.div 
        className="t-shape-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: isAnimatedIn ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Horizontal Line - the "edge" of the portrait in 3D */}
        <Motion.div 
          className="t-horizontal-line"
          initial={{ scaleX: 1 }}
          style={{ 
            scaleX: isAnimatedIn ? lineScaleX : 1,
          }}
        />
        
        {/* Vertical Line - center divider forming the T */}
        <Motion.div 
          className="t-vertical-line"
          initial={{ scaleY: 1, opacity: 1 }}
          style={{ 
            opacity: isAnimatedIn ? verticalLineOpacity : 1,
          }}
        />
      </Motion.div>

      {/* === 3D PORTRAIT CONTAINER === */}
      <Motion.div 
        className="portrait-3d-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: isAnimatedIn ? 1 : 0, 
          scale: isAnimatedIn ? 1 : 0.9 
        }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Design Portrait - visible when rotated left */}
        <Motion.div 
          className="portrait-face portrait-face--design"
          style={{
            rotateY: rotateY,
            opacity: designOpacity,
          }}
        >
          <img 
            src={designImage} 
            alt="Designer portrait - creative and artistic side"
            loading="eager"
          />
        </Motion.div>

        {/* Tech Portrait - visible when rotated right */}
        <Motion.div 
          className="portrait-face portrait-face--tech"
          style={{
            rotateY: useTransform(rotateY, r => r - 180),
            opacity: techOpacity,
          }}
        >
          <img 
            src={techImage} 
            alt="Coder portrait - technical and digital side"
            loading="eager"
          />
        </Motion.div>
      </Motion.div>

      {/* Scroll indicator */}
      <Motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span>Explore</span>
        <div className="scroll-arrow">↓</div>
      </Motion.div>

      {/* Exploration hint - only shows before interaction */}
      <Motion.div 
        className="explore-hint"
        animate={{ opacity: hasInteracted ? 0 : 0.7 }}
        transition={{ duration: 0.5 }}
      >
        <span className="hint-icon">←</span>
        <span className="hint-text">Move to explore</span>
        <span className="hint-icon">→</span>
      </Motion.div>
    </section>
  )
}
