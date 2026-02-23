/**
 * SpatialHub — Horizontal/Vertical Navigation System
 * 
 * Navigation Concept:
 * ═══════════════════════════════════════════════════════════
 *                         ↑
 *                       ABOUT
 *                      CONTACT
 *                         │
 *    ← DESIGN ────────────┼──────────── TECH →
 *       work              │              work
 *       process          YOU            projects
 *       branding                         code
 *                         │
 *                         ↓
 *                      CONTENT
 * ═══════════════════════════════════════════════════════════
 * 
 * - Horizontal axis: Design (left) ↔ Tech (right)
 * - Vertical axis: About/Contact (up) ↔ Content/Work (down)
 * - The T-shape IS the navigation
 * - Edge hints reveal section previews
 * - Swipe gestures for mobile
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion as Motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import './styles/spatial-hub.css'

// Navigation sections configuration
const SECTIONS = {
  design: {
    id: 'design',
    label: 'Design',
    sublabel: 'Creative Work',
    color: '#c4703a',
    items: ['Branding', 'UI/UX', 'Packaging', 'Identity'],
  },
  tech: {
    id: 'tech', 
    label: 'Tech',
    sublabel: 'Development',
    color: '#3a7cc4',
    items: ['Web Apps', 'APIs', 'AI/ML', 'Blockchain'],
  },
  about: {
    id: 'about',
    label: 'About',
    sublabel: 'The Story',
    color: '#fafafa',
  },
  contact: {
    id: 'contact',
    label: 'Contact',
    sublabel: 'Get in Touch',
    color: '#fafafa',
  }
}

export default function SpatialHub({ 
  onNavigate, // Callback when user navigates to a section
  isEnabled = true, // Whether navigation is active (false when viewing a section)
  children, // The portrait content in the center
}) {
  const containerRef = useRef(null)
  const [_activeHint, setActiveHint] = useState(null) // 'left' | 'right' | 'top' | 'bottom' - reserved for future use
  const [isAtEdge, setIsAtEdge] = useState({ left: false, right: false, top: false, bottom: false })
  
  // Mouse position for edge detection
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  
  // Smooth springs for animations
  const springConfig = { stiffness: 150, damping: 25 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)
  
  // Edge proximity (0-1, 1 = at edge)
  const leftEdgeProximity = useTransform(smoothX, [0, 0.15], [1, 0])
  const rightEdgeProximity = useTransform(smoothX, [0.85, 1], [0, 1])
  const topEdgeProximity = useTransform(smoothY, [0, 0.1], [1, 0])
  
  // Handle mouse movement
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !isEnabled) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    mouseX.set(x)
    mouseY.set(y)
    
    // Detect edge zones
    const edgeThreshold = 0.12
    setIsAtEdge({
      left: x < edgeThreshold,
      right: x > 1 - edgeThreshold,
      top: y < edgeThreshold,
      bottom: y > 0.85,
    })
    
    // Set active hint
    if (x < edgeThreshold) setActiveHint('left')
    else if (x > 1 - edgeThreshold) setActiveHint('right')
    else if (y < edgeThreshold) setActiveHint('top')
    else setActiveHint(null)
  }, [mouseX, mouseY, isEnabled])
  
  const handleMouseLeave = useCallback(() => {
    setActiveHint(null)
    setIsAtEdge({ left: false, right: false, top: false, bottom: false })
  }, [])
  
  // Handle navigation clicks
  const handleNavClick = useCallback((section) => {
    onNavigate?.(section)
  }, [onNavigate])
  
  // Keyboard navigation
  useEffect(() => {
    if (!isEnabled) return
    
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          onNavigate?.('left')
          break
        case 'ArrowRight':
          e.preventDefault()
          onNavigate?.('right')
          break
        case 'ArrowUp':
          e.preventDefault()
          onNavigate?.('up')
          break
        case 'ArrowDown':
          e.preventDefault()
          // Scroll to content
          document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEnabled, onNavigate])
  
  // Touch/swipe support
  const touchStart = useRef({ x: 0, y: 0 })
  
  const handleTouchStart = useCallback((e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }, [])
  
  const handleTouchEnd = useCallback((e) => {
    if (!isEnabled) return
    
    const deltaX = e.changedTouches[0].clientX - touchStart.current.x
    const deltaY = e.changedTouches[0].clientY - touchStart.current.y
    const threshold = 80
    
    // Horizontal swipe takes priority if larger
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX < 0) {
        onNavigate?.('right') // Swipe left → go right (tech)
      } else {
        onNavigate?.('left') // Swipe right → go left (design)
      }
    } else if (Math.abs(deltaY) > threshold) {
      if (deltaY < 0) {
        // Swipe up → scroll to content
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
      } else {
        onNavigate?.('up') // Swipe down → about
      }
    }
  }, [isEnabled, onNavigate])

  return (
    <div 
      ref={containerRef}
      className="spatial-hub"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Central content (portrait) */}
      <div className="spatial-center">
        {children}
      </div>
      
      {/* === LEFT EDGE: Design Section === */}
      <div 
        className="spatial-edge spatial-edge--left"
        onClick={() => handleNavClick('left')}
        role="button"
        tabIndex={0}
        aria-label="Navigate to Design work"
      >
        <div className="edge-content">
          <span className="edge-arrow">←</span>
          <div className="edge-label">
            <span className="edge-title" style={{ color: SECTIONS.design.color }}>
              {SECTIONS.design.label}
            </span>
            <span className="edge-sublabel">{SECTIONS.design.sublabel}</span>
          </div>
        </div>
        <div className="edge-preview">
          {SECTIONS.design.items.map((item) => (
            <span key={item} className="preview-item">
              {item}
            </span>
          ))}
        </div>
        <div className="edge-glow" style={{ background: `linear-gradient(90deg, ${SECTIONS.design.color}15, transparent)` }} />
      </div>
      
      {/* === RIGHT EDGE: Tech Section === */}
      <div 
        className="spatial-edge spatial-edge--right"
        onClick={() => handleNavClick('right')}
        role="button"
        tabIndex={0}
        aria-label="Navigate to Tech work"
      >
        <div className="edge-content">
          <div className="edge-label">
            <span className="edge-title" style={{ color: SECTIONS.tech.color }}>
              {SECTIONS.tech.label}
            </span>
            <span className="edge-sublabel">{SECTIONS.tech.sublabel}</span>
          </div>
          <span className="edge-arrow">→</span>
        </div>
        <div className="edge-preview">
          {SECTIONS.tech.items.map((item) => (
            <span key={item} className="preview-item">
              {item}
            </span>
          ))}
        </div>
        <div className="edge-glow" style={{ background: `linear-gradient(-90deg, ${SECTIONS.tech.color}15, transparent)` }} />
      </div>
      
      {/* === TOP EDGE: About/Contact === */}
      <div 
        className="spatial-edge spatial-edge--top"
        onClick={() => handleNavClick('up')}
        role="button"
        tabIndex={0}
        aria-label="Navigate to About"
      >
        <div className="edge-content edge-content--vertical">
          <span className="edge-arrow">↑</span>
          <span className="edge-title">About</span>
        </div>
      </Motion.div>
      
      {/* === NAVIGATION HINTS (when at edges) === */}
      <AnimatePresence>
        {isAtEdge.left && (
          <Motion.div 
            className="nav-hint nav-hint--left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <span>Click or press ← for Design</span>
          </Motion.div>
        )}
        {isAtEdge.right && (
          <Motion.div 
            className="nav-hint nav-hint--right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <span>Click or press → for Tech</span>
          </Motion.div>
        )}
      </AnimatePresence>
      
      {/* === SCROLL INDICATOR (bottom) === */}
      <Motion.div 
        className="scroll-prompt"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span>Scroll to explore</span>
        <span className="scroll-arrow">↓</span>
      </Motion.div>
      
      {/* === KEYBOARD HINT === */}
      <div className="keyboard-hint" aria-hidden="true">
        <span>←↑↓→</span>
      </div>
    </div>
  )
}
