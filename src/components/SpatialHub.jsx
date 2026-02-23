/**
 * SpatialHub — Minimal Edge Navigation
 * 
 * - Edge zones are invisible until hovered
 * - Just arrows + subtle tooltip on hover
 * - Swipe gestures for mobile
 * - Keyboard arrows for accessibility
 */

import { useCallback, useEffect, useRef } from 'react'
import { motion as Motion } from 'framer-motion'
import './styles/spatial-hub.css'

// Navigation colors
const COLORS = {
  design: '#c4703a',
  tech: '#3a7cc4',
}

export default function SpatialHub({ 
  onNavigate,
  isEnabled = true,
  children,
}) {
  const containerRef = useRef(null)
  
  // Handle navigation clicks
  const handleNavClick = useCallback((direction) => {
    if (!isEnabled) return
    onNavigate?.(direction)
  }, [onNavigate, isEnabled])
  
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
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX < 0) {
        onNavigate?.('right')
      } else {
        onNavigate?.('left')
      }
    } else if (Math.abs(deltaY) > threshold) {
      if (deltaY < 0) {
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
      } else {
        onNavigate?.('up')
      }
    }
  }, [isEnabled, onNavigate])

  return (
    <div 
      ref={containerRef}
      className="spatial-hub"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="spatial-center">
        {children}
      </div>
      
      <div 
        className="spatial-edge spatial-edge--left"
        onClick={() => handleNavClick('left')}
        role="button"
        tabIndex={isEnabled ? 0 : -1}
        aria-label="Navigate to Design work"
      >
        <div className="edge-indicator">
          <span className="edge-arrow">&#8592;</span>
        </div>
        <div className="edge-glow" style={{ background: `linear-gradient(90deg, ${COLORS.design}10, transparent)` }} />
      </div>
      
      <div 
        className="spatial-edge spatial-edge--right"
        onClick={() => handleNavClick('right')}
        role="button"
        tabIndex={isEnabled ? 0 : -1}
        aria-label="Navigate to Tech work"
      >
        <div className="edge-indicator">
          <span className="edge-arrow">&#8594;</span>
        </div>
        <div className="edge-glow" style={{ background: `linear-gradient(-90deg, ${COLORS.tech}10, transparent)` }} />
      </div>
      
      <div 
        className="spatial-edge spatial-edge--top"
        onClick={() => handleNavClick('up')}
        role="button"
        tabIndex={isEnabled ? 0 : -1}
        aria-label="Navigate to About"
      >
        <div className="edge-indicator">
          <span className="edge-arrow">&#8593;</span>
        </div>
      </div>
      
      <Motion.div 
        className="scroll-prompt"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span>Scroll to explore</span>
        <span className="scroll-arrow">&#8595;</span>
      </Motion.div>
      
      <div className="keyboard-hint" aria-hidden="true">
        <span>&#8592;&#8593;&#8595;&#8594;</span>
      </div>
    </div>
  )
}
