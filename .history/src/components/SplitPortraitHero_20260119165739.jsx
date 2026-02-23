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
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * IDENTITY MOTION SYSTEM INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This component is the PRIMARY DRIVER of the global identity value.
 * Mouse position in the hero directly controls the identity, which cascades
 * through the entire visual system (background, decorative layers, typography).
 */

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion as Motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import ProjectParticles from './ProjectParticles'
import { useIdentityActions } from '../hooks/useIdentity'
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
  onNavigate, // Callback: (side: 'design' | 'tech') => void
}) {
  const containerRef = useRef(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isAnimatedIn, setIsAnimatedIn] = useState(false)
  
  // ═══ IDENTITY SYSTEM INTEGRATION ═══
  // Mouse movement in this hero drives the global identity value
  const { setIdentity, animateToIdentity } = useIdentityActions()

  // Animate in immediately when splash completes - T-shape takes over seamlessly
  useEffect(() => {
    if (isReady) {
      // No delay - T-shape should already be in position from splash
      setIsAnimatedIn(true)
    }
  }, [isReady])

  // Mouse position tracking (0-1 range, 0.5 = center)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Smooth spring animation - use identity-aware spring config
  const springConfig = { stiffness: 100, damping: 30, mass: 0.8 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

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
  
  // Position indicator on the horizontal line (percentage from left)
  const indicatorPosition = useTransform(smoothX, [0, 1], ['0%', '100%'])
  
  // Vertical line opacity - visible at center, fades as portrait reveals
  const verticalLineOpacity = useTransform(smoothX,
    [0.3, 0.5, 0.7],
    [0, 1, 0]
  )
  
  // Colors for the position indicator based on side
  const indicatorColor = useTransform(smoothX, 
    [0, 0.4, 0.5, 0.6, 1],
    ['#c4703a', '#c4703a', '#888888', '#3a7cc4', '#3a7cc4']
  )

  // === HORIZONTAL PANNING — Move the whole scene left/right ===
  // At center (0.5): no translation
  // At left (0): scene shifts RIGHT to reveal design content
  // At right (1): scene shifts LEFT to reveal tech content
  const scenePanX = useTransform(smoothX, [0, 0.5, 1], ['25%', '0%', '-25%'])

  // Handle mouse movement
  // ═══ CRITICAL: This drives the GLOBAL IDENTITY SYSTEM ═══
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    const clampedX = Math.max(0, Math.min(1, x))
    
    mouseX.set(clampedX)
    mouseY.set(Math.max(0, Math.min(1, y)))
    
    // ═══ UPDATE GLOBAL IDENTITY ═══
    // This cascades through the entire visual system
    setIdentity(clampedX, 'hero')
    
    if (!hasInteracted) setHasInteracted(true)
  }, [mouseX, mouseY, hasInteracted, setIdentity])

  const handleMouseLeave = useCallback(() => {
    // Lock to the side based on where the mouse exited
    // If mouse was on left half, lock to full left (0)
    // If mouse was on right half, lock to full right (1)
    const currentX = mouseX.get()
    if (currentX < 0.5) {
      mouseX.set(0) // Lock to design (left)
      // ═══ ANIMATE GLOBAL IDENTITY TO DESIGN ═══
      animateToIdentity(0, { duration: 0.8, source: 'hero-exit' })
    } else {
      mouseX.set(1) // Lock to tech (right)
      // ═══ ANIMATE GLOBAL IDENTITY TO TECH ═══
      animateToIdentity(1, { duration: 0.8, source: 'hero-exit' })
    }
  }, [mouseX, animateToIdentity])

  // Touch support
  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current || !e.touches[0]) return
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = (touch.clientX - rect.left) / rect.width
    const clampedX = Math.max(0, Math.min(1, x))
    mouseX.set(clampedX)
    // ═══ UPDATE GLOBAL IDENTITY FROM TOUCH ═══
    setIdentity(clampedX, 'hero-touch')
    if (!hasInteracted) setHasInteracted(true)
  }, [mouseX, hasInteracted, setIdentity])

  // Click to navigate to design or tech section
  const handleClick = useCallback((e) => {
    // Ignore if clicking on a particle
    if (e.target.closest('.particle')) return
    
    const currentX = mouseX.get()
    console.log('Click detected, mouseX:', currentX)
    
    // Lower thresholds - 0.45 and 0.55 for easier triggering
    if (currentX < 0.45) {
      console.log('Navigating to DESIGN side')
      onNavigate?.('design')
    } else if (currentX > 0.55) {
      console.log('Navigating to TECH side')
      onNavigate?.('tech')
    }
  }, [mouseX, onNavigate])

  return (
    <section 
      ref={containerRef}
      className="split-portrait-hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
      data-cursor="explore"
    >
      {/* Panning container - shifts entire scene left/right based on mouse position */}
      <Motion.div 
        className="hero-pan-container"
        style={{ x: scenePanX }}
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
          <span className="click-hint click-hint--design">Click to view work →</span>
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
          <span className="click-hint click-hint--tech">← Click to view projects</span>
          
          {/* Code snippets */}
          <div className="code-snippets" aria-hidden="true">
            <span className="code-line">{'<html>'}</span>
            <span className="code-line">{'height:184px;}'}</span>
            <span className="code-line">{'class="creative"'}</span>
            <span className="code-line code-line--highlight">CSS3 <span style={{ opacity: 0.6 }}>HTML5</span></span>
          </div>
        </Motion.div>

        {/* === NAVIGATION TRACK: Horizontal Line with Position Indicator === */}
        {/* This takes over from splash T-shape - starts visible, no fade-in */}
        <Motion.div 
          className="nav-track-container"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          {/* The track itself - always visible */}
          <div className="nav-track">
            {/* Left label */}
            <Motion.span 
              className="nav-track__label nav-track__label--left"
              style={{ opacity: designOpacity }}
            >
              Design
            </Motion.span>
            
            {/* The track line */}
            <div className="nav-track__line">
              {/* Position indicator/cursor that moves along the track */}
              <Motion.div 
                className="nav-track__indicator"
                style={{ 
                  left: indicatorPosition,
                  backgroundColor: indicatorColor,
                }}
              />
            </div>
            
            {/* Right label */}
            <Motion.span 
              className="nav-track__label nav-track__label--right"
              style={{ opacity: techOpacity }}
            >
              Tech
            </Motion.span>
          </div>
          
          {/* ONE continuous vertical line from horizontal bar down */}
          {/* Fades out when portrait appears */}
          <Motion.div 
            className="t-vertical-line"
            style={{ opacity: verticalLineOpacity }}
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
          {/* Design Portrait - visible when on left side */}
          <Motion.div 
            className="portrait-face portrait-face--design"
            style={{
              rotateY: designRotateY,
              opacity: designOpacity,
            }}
          >
            <img 
              src={designImage} 
              alt="Designer portrait - creative and artistic side"
              loading="eager"
            />
          </Motion.div>

          {/* Tech Portrait - visible when on right side */}
          <Motion.div 
            className="portrait-face portrait-face--tech"
            style={{
              rotateY: techRotateY,
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
      </Motion.div>
      {/* End of hero-pan-container */}

      {/* Scroll indicator - stays fixed */}
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

      {/* Floating project particles - revealed by mouse cursor */}
      <ProjectParticles 
        mouseX={smoothX}
        mouseY={smoothY}
        isReady={isAnimatedIn && hasInteracted}
      />
    </section>
  )
}
