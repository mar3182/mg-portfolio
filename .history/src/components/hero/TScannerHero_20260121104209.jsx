/**
 * ═══════════════════════════════════════════════════════════════════════════
 * T-SCANNER HERO — Reveal Effect with T-Shaped UI
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Concept:
 * - A T-shape UI element where the vertical line acts as a "scanner"
 * - Base portrait is always visible
 * - Moving left: Design layer reveals from the scanner line leftward
 * - Moving right: Tech layer reveals from the scanner line rightward
 * - The scanner line glows and acts as the reveal boundary
 */

import { useRef, useCallback, useState, memo } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useIdentityActions } from '../../hooks/useIdentity'
import { identityMotionValue } from '../../stores/identityStore'

// ═══════════════════════════════════════════════════════════════════════════
// T-SCANNER HERO COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function TScannerHero({
  baseImage = '/portrait-base.png',
  designImage = '/portrait-design-nb.png',
  techImage = '/portrait-tech.png',
}) {
  const containerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const { setIdentity } = useIdentityActions()
  
  // Scanner position (0-1, 0.5 = center)
  const scannerPosition = useMotionValue(0.5)
  
  // Smooth spring for cinematic feel
  const smoothPosition = useSpring(scannerPosition, {
    stiffness: 80,
    damping: 25,
    mass: 0.8,
  })
  
  // Sync to global identity
  useTransform(smoothPosition, (v) => {
    identityMotionValue.set(v)
    return v
  })
  
  // Scanner line X position (percentage)
  const scannerX = useTransform(smoothPosition, [0, 1], ['0%', '100%'])
  
  // Design reveal: clips from scanner line to left edge
  // When scanner is at 0.3 (30%), design is revealed from 0% to 30%
  const designClipPath = useTransform(smoothPosition, (pos) => {
    // Only reveal design when scanner is left of center
    if (pos >= 0.5) return 'inset(0 100% 0 0)' // Hidden
    // Reveal from left edge to scanner position
    const revealPercent = ((0.5 - pos) / 0.5) * 100
    return `inset(0 ${100 - revealPercent}% 0 0)`
  })
  
  // Tech reveal: clips from scanner line to right edge
  // When scanner is at 0.7 (70%), tech is revealed from 70% to 100%
  const techClipPath = useTransform(smoothPosition, (pos) => {
    // Only reveal tech when scanner is right of center
    if (pos <= 0.5) return 'inset(0 0 0 100%)' // Hidden
    // Reveal from scanner position to right edge
    const revealPercent = ((pos - 0.5) / 0.5) * 100
    return `inset(0 0 0 ${100 - revealPercent}%)`
  })
  
  // Scanner glow color based on position
  const scannerColor = useTransform(
    smoothPosition,
    [0, 0.4, 0.5, 0.6, 1],
    ['#ff8c42', '#ff8c42', '#ffffff', '#1be7ff', '#1be7ff']
  )
  
  // T horizontal bar opacity (fades as you commit to a side)
  const tBarOpacity = useTransform(
    smoothPosition,
    [0, 0.2, 0.5, 0.8, 1],
    [0.3, 0.6, 1, 0.6, 0.3]
  )
  
  // Handle mouse/touch movement
  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width
    const clamped = Math.max(0, Math.min(1, x))
    
    scannerPosition.set(clamped)
    setIdentity(clamped, 'scanner')
  }, [scannerPosition, setIdentity])
  
  const handleMouseMove = useCallback((e) => {
    handleMove(e.clientX)
  }, [handleMove])
  
  const handleTouchMove = useCallback((e) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX)
    }
  }, [handleMove])
  
  const handleMouseLeave = useCallback(() => {
    // Snap to nearest side or center
    const current = scannerPosition.get()
    if (current < 0.25) {
      scannerPosition.set(0)
    } else if (current > 0.75) {
      scannerPosition.set(1)
    } else {
      scannerPosition.set(0.5)
    }
  }, [scannerPosition])

  return (
    <div
      ref={containerRef}
      className="t-scanner-hero"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, #0d0d0d 0%, #050505 100%)',
        cursor: 'ew-resize',
      }}
    >
      {/* ═══ PORTRAIT STACK ═══ */}
      <div 
        className="portrait-stack"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Layer 1: Base Portrait (always visible) */}
        <img
          src={baseImage}
          alt=""
          style={{
            position: 'absolute',
            height: '85vh',
            maxWidth: '90vw',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          draggable={false}
        />
        
        {/* Layer 2: Design Portrait (revealed when scanning left) */}
        <motion.img
          src={designImage}
          alt=""
          style={{
            position: 'absolute',
            height: '85vh',
            maxWidth: '90vw',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
            clipPath: designClipPath,
          }}
          draggable={false}
        />
        
        {/* Layer 3: Tech Portrait (revealed when scanning right) */}
        <motion.img
          src={techImage}
          alt=""
          style={{
            position: 'absolute',
            height: '85vh',
            maxWidth: '90vw',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
            clipPath: techClipPath,
          }}
          draggable={false}
        />
      </div>
      
      {/* ═══ T-SHAPE UI ═══ */}
      <div 
        className="t-shape-ui"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 50,
        }}
      >
        {/* Horizontal bar of the T */}
        <motion.div
          className="t-horizontal"
          style={{
            position: 'absolute',
            top: '8vh',
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'linear-gradient(90deg, #ff8c42 0%, #ffffff 50%, #1be7ff 100%)',
            opacity: tBarOpacity,
          }}
        />
        
        {/* Vertical scanner line (the revealing edge) */}
        <motion.div
          className="t-vertical-scanner"
          style={{
            position: 'absolute',
            top: '8vh',
            left: scannerX,
            width: '2px',
            height: '84vh',
            transform: 'translateX(-50%)',
            background: scannerColor,
            boxShadow: useTransform(
              scannerColor,
              (color) => `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`
            ),
          }}
        />
        
        {/* Scanner head (intersection point) */}
        <motion.div
          className="scanner-head"
          style={{
            position: 'absolute',
            top: '8vh',
            left: scannerX,
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            background: scannerColor,
            boxShadow: useTransform(
              scannerColor,
              (color) => `0 0 15px ${color}, 0 0 30px ${color}`
            ),
          }}
        />
        
        {/* Identity labels */}
        <motion.span
          style={{
            position: 'absolute',
            top: '4vh',
            left: '10%',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '0.875rem',
            fontStyle: 'italic',
            color: '#ff8c42',
            opacity: useTransform(smoothPosition, [0.5, 0.2, 0], [0, 0.5, 1]),
            letterSpacing: '0.1em',
          }}
        >
          Design
        </motion.span>
        
        <motion.span
          style={{
            position: 'absolute',
            top: '4vh',
            right: '10%',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#1be7ff',
            opacity: useTransform(smoothPosition, [0.5, 0.8, 1], [0, 0.5, 1]),
            letterSpacing: '0.05em',
          }}
        >
          Tech
        </motion.span>
      </div>
      
      {/* ═══ AMBIENT EFFECTS ═══ */}
      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          zIndex: 60,
        }}
      />
      
      {/* Grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.03,
          mixBlendMode: 'overlay',
          zIndex: 70,
        }}
      />
      
      {/* Instructions */}
      <div
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 80,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.8rem',
          pointerEvents: 'none',
        }}
      >
        <p style={{ margin: 0 }}>
          ← Move to reveal Design | Move to reveal Tech →
        </p>
      </div>
    </div>
  )
}

export default memo(TScannerHero)
