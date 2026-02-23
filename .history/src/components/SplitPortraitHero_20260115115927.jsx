/**
 * SplitPortraitHero — Dual-Identity Portrait Component
 * 
 * Inspired by Adham Dannaway's split-face concept.
 * 
 * Features:
 * - Central portrait that responds to mouse movement
 * - Left side: Design identity (artistic, painted, warm colors)
 * - Right side: Tech identity (code overlay, cool colors, geometric)
 * - Mouse position reveals more of each side
 * - Smooth transitions and parallax effects
 * 
 * Portrait Image Requirements:
 * - Forward-facing portrait photo
 * - High resolution (at least 1200px tall)
 * - Neutral background (will be removed/replaced)
 * - Two versions needed:
 *   1. portrait-design.png - with artistic/painted overlay
 *   2. portrait-tech.png - with code/digital overlay
 */

import { useRef, useState, useCallback } from 'react'
import { motion as Motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import './styles/split-portrait.css'

// Identity configuration
const IDENTITIES = {
  design: {
    title: 'designer',
    description: 'Product designer specialising in UI design and design systems.',
    color: '#c4703a',
    font: 'var(--font-display)',
  },
  tech: {
    title: '<coder>',
    description: 'Full stack developer who writes clean, elegant and efficient code.',
    color: '#3a7cc4',
    font: 'var(--font-body)',
  }
}

export default function SplitPortraitHero({ 
  designImage = '/portrait-design.png',
  techImage = '/portrait-tech.png',
  baseImage = '/portrait-base.png',
}) {
  const containerRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [activeIdentity, setActiveIdentity] = useState(null) // 'design' | 'tech' | null

  // Mouse position tracking (0-1 range, 0.5 = center)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Smooth spring animation for mouse position
  const springConfig = { stiffness: 150, damping: 25, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Transform mouse position to clip/reveal values
  // When mouse is left (0), show more design; when right (1), show more tech
  const designClip = useTransform(smoothX, [0, 0.5, 1], [100, 50, 0])
  const techClip = useTransform(smoothX, [0, 0.5, 1], [0, 50, 100])

  // Parallax transforms for depth effect
  const portraitX = useTransform(smoothX, [0, 1], [-20, 20])
  const portraitY = useTransform(smoothY, [0, 1], [-10, 10])
  const portraitRotateY = useTransform(smoothX, [0, 1], [8, -8])

  // Handle mouse movement
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    mouseX.set(Math.max(0, Math.min(1, x)))
    mouseY.set(Math.max(0, Math.min(1, y)))

    // Determine active identity based on position
    if (x < 0.35) {
      setActiveIdentity('design')
    } else if (x > 0.65) {
      setActiveIdentity('tech')
    } else {
      setActiveIdentity(null)
    }
  }, [mouseX, mouseY])

  const handleMouseEnter = () => setIsHovering(true)
  const handleMouseLeave = () => {
    setIsHovering(false)
    setActiveIdentity(null)
    // Animate back to center
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
  }, [mouseX])

  return (
    <section 
      ref={containerRef}
      className="split-portrait-hero"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      data-cursor="explore"
    >
      {/* Design Side - Left */}
      <div className="identity-panel identity-panel--design">
        <Motion.h2 
          className="identity-title identity-title--design"
          animate={{ 
            opacity: activeIdentity === 'design' ? 1 : 0.6,
            x: activeIdentity === 'design' ? 0 : -20,
          }}
          transition={{ duration: 0.4 }}
        >
          {IDENTITIES.design.title}
        </Motion.h2>
        <Motion.p 
          className="identity-description"
          animate={{ 
            opacity: activeIdentity === 'design' ? 1 : 0,
            y: activeIdentity === 'design' ? 0 : 10,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {IDENTITIES.design.description}
        </Motion.p>
      </div>

      {/* Tech Side - Right */}
      <div className="identity-panel identity-panel--tech">
        <Motion.h2 
          className="identity-title identity-title--tech"
          animate={{ 
            opacity: activeIdentity === 'tech' ? 1 : 0.6,
            x: activeIdentity === 'tech' ? 0 : 20,
          }}
          transition={{ duration: 0.4 }}
        >
          {IDENTITIES.tech.title}
        </Motion.h2>
        <Motion.p 
          className="identity-description"
          animate={{ 
            opacity: activeIdentity === 'tech' ? 1 : 0,
            y: activeIdentity === 'tech' ? 0 : 10,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {IDENTITIES.tech.description}
        </Motion.p>

        {/* Code snippets floating on tech side */}
        <div className="code-snippets" aria-hidden="true">
          <Motion.span 
            className="code-line"
            animate={{ opacity: activeIdentity === 'tech' ? 0.7 : 0.2 }}
          >
            {'<html>'}
          </Motion.span>
          <Motion.span 
            className="code-line"
            animate={{ opacity: activeIdentity === 'tech' ? 0.6 : 0.15 }}
          >
            {'height:184px;}'}
          </Motion.span>
          <Motion.span 
            className="code-line"
            animate={{ opacity: activeIdentity === 'tech' ? 0.8 : 0.2 }}
          >
            {'class="creative"'}
          </Motion.span>
          <Motion.span 
            className="code-line code-line--highlight"
            animate={{ opacity: activeIdentity === 'tech' ? 1 : 0.3 }}
          >
            CSS3 <span style={{ opacity: 0.6 }}>HTML5</span>
          </Motion.span>
        </div>
      </div>

      {/* Central Portrait Container */}
      <Motion.div 
        className="portrait-container"
        style={{
          x: portraitX,
          y: portraitY,
          rotateY: portraitRotateY,
        }}
      >
        {/* Base portrait layer */}
        <div className="portrait-layer portrait-layer--base">
          <img 
            src={baseImage} 
            alt="Portrait" 
            loading="eager"
          />
        </div>

        {/* Design overlay - clips from left */}
        <Motion.div 
          className="portrait-layer portrait-layer--design"
          style={{
            clipPath: useTransform(designClip, (v) => `inset(0 ${100 - v}% 0 0)`),
          }}
        >
          <img 
            src={designImage} 
            alt="" 
            aria-hidden="true"
            loading="eager"
          />
        </Motion.div>

        {/* Tech overlay - clips from right */}
        <Motion.div 
          className="portrait-layer portrait-layer--tech"
          style={{
            clipPath: useTransform(techClip, (v) => `inset(0 0 0 ${100 - v}%)`),
          }}
        >
          <img 
            src={techImage} 
            alt="" 
            aria-hidden="true"
            loading="eager"
          />
        </Motion.div>

        {/* Center divider line */}
        <Motion.div 
          className="portrait-divider"
          style={{
            left: useTransform(smoothX, [0, 1], ['20%', '80%']),
            opacity: useTransform(smoothX, [0.3, 0.5, 0.7], [0, 1, 0]),
          }}
        />
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

      {/* Exploration hint */}
      <Motion.div 
        className="explore-hint"
        animate={{ opacity: isHovering ? 0 : 0.6 }}
        transition={{ duration: 0.3 }}
      >
        <span className="hint-icon">←</span>
        <span className="hint-text">Move cursor to explore</span>
        <span className="hint-icon">→</span>
      </Motion.div>
    </section>
  )
}
