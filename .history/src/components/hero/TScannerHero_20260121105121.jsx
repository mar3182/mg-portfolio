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
// SVG BACKGROUNDS
// ═══════════════════════════════════════════════════════════════════════════

function OrganicSVG() {
  return (
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        <linearGradient id="organicGradient" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#e77a2f" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ff8c42" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffc93c" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ff8c42" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="navyGradient" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a2a4a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0d1a2d" stopOpacity="0.2" />
        </linearGradient>
        <filter id="organicGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="organic-layer-1" opacity="0.3">
        <path
          d="M-100 600 C200 400 400 700 600 500 S900 600 1200 450"
          fill="none"
          stroke="url(#navyGradient)"
          strokeWidth="80"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M-50 800 Q300 650 500 750 T900 700"
          fill="none"
          stroke="url(#navyGradient)"
          strokeWidth="60"
          strokeLinecap="round"
          opacity="0.3"
        />
      </g>

      <g className="organic-layer-2" opacity="0.5">
        <path
          d="M300 400 C480 350 600 460 820 390 S1000 450 1100 380"
          fill="none"
          stroke="url(#organicGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#organicGlow)"
        />
        <path
          d="M320 450 C520 520 700 480 900 540 S1100 500 1200 560"
          fill="none"
          stroke="url(#organicGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M250 500 Q300 350 380 280 T500 200"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>

      <g className="organic-layer-3" opacity="0.7">
        <ellipse cx="200" cy="350" rx="25" ry="8" fill="url(#navyGradient)" transform="rotate(-30 200 350)" opacity="0.6" />
        <ellipse cx="280" cy="300" rx="20" ry="6" fill="url(#goldGradient)" transform="rotate(-45 280 300)" opacity="0.5" />
        <ellipse cx="380" cy="280" rx="18" ry="5" fill="url(#organicGradient)" transform="rotate(-20 380 280)" opacity="0.4" />
        
        <circle cx="150" cy="200" r="35" fill="none" stroke="#ff8c42" strokeWidth="2" opacity="0.5" />
        <circle cx="150" cy="200" r="25" fill="#ffc93c" opacity="0.3" />
        <circle cx="400" cy="150" r="20" fill="none" stroke="#ffa054" strokeWidth="1.5" opacity="0.4" />
        <circle cx="400" cy="150" r="12" fill="#ffd700" opacity="0.25" />
        
        <circle cx="180" cy="280" r="3" fill="#ff6b4a" opacity="0.6" />
        <circle cx="220" cy="320" r="2" fill="#4a6a9a" opacity="0.5" />
        <circle cx="300" cy="250" r="4" fill="#ffc93c" opacity="0.5" />
        <circle cx="350" cy="330" r="2.5" fill="#ff8c5a" opacity="0.4" />
      </g>
    </svg>
  )
}

function MatrixSVG() {
  return (
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1be7ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00ff9c" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1be7ff" stopOpacity="0" />
          <stop offset="50%" stopColor="#1be7ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1be7ff" stopOpacity="0" />
        </linearGradient>
        <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="matrix-grid" opacity="0.15">
        {[200, 350, 500, 650, 800, 950].map((y, i) => (
          <line key={`h-${i}`} x1="960" y1={y} x2="1920" y2={y} stroke="url(#gridGradient)" strokeWidth="1" opacity={0.3 + (i % 2) * 0.2} />
        ))}
        {[1100, 1250, 1400, 1550, 1700, 1850].map((x, i) => (
          <line key={`v-${i}`} x1={x} y1="0" x2={x} y2="1080" stroke="url(#gridGradient)" strokeWidth="1" opacity={0.2 + (i % 2) * 0.15} />
        ))}
      </g>

      <g className="matrix-connections" opacity="0.4">
        <path d="M1600 540 L1700 480 L1800 520 L1850 450" fill="none" stroke="url(#techGradient)" strokeWidth="2" strokeLinecap="round" strokeDasharray="8 4" />
        <path d="M1550 600 L1650 650 L1750 620 L1820 680" fill="none" stroke="url(#techGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M1500 400 L1600 350 M1600 350 L1700 320 M1600 350 L1680 400" fill="none" stroke="#1be7ff" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      </g>

      <g className="matrix-nodes" filter="url(#nodeGlow)">
        <circle cx="1700" cy="480" r="6" fill="#1be7ff" opacity="0.8" />
        <circle cx="1800" cy="520" r="5" fill="#00ff9c" opacity="0.7" />
        <circle cx="1650" cy="650" r="4" fill="#1be7ff" opacity="0.6" />
        <circle cx="1600" cy="350" r="5" fill="#00ff9c" opacity="0.7" />
        <circle cx="1750" cy="620" r="3" fill="#1be7ff" opacity="0.5" />
        <circle cx="1820" cy="680" r="3" fill="#00ff9c" opacity="0.5" />
      </g>

      <g className="matrix-geometry" opacity="0.3">
        <polygon points="1750,300 1780,320 1780,360 1750,380 1720,360 1720,320" fill="none" stroke="#1be7ff" strokeWidth="1" opacity="0.4" />
        <polygon points="1600,700 1620,720 1600,740 1580,720" fill="none" stroke="#00ff9c" strokeWidth="1" opacity="0.3" />
      </g>
    </svg>
  )
}

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
  
  // Background opacities
  const organicOpacity = useTransform(smoothPosition, [0, 0.5, 1], [1, 0.4, 0.1])
  const matrixOpacity = useTransform(smoothPosition, [0, 0.5, 1], [0.1, 0.4, 1])
  
  // Background drift
  const organicDriftX = useTransform(smoothPosition, [0, 1], [0, -80])
  const matrixDriftX = useTransform(smoothPosition, [0, 1], [80, 0])
  
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
      {/* ═══ ORGANIC BACKGROUND (Design Side) ═══ */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: organicOpacity,
          x: organicDriftX,
          transformOrigin: 'left center',
        }}
      >
        <OrganicSVG />
      </motion.div>
      
      {/* ═══ MATRIX BACKGROUND (Tech Side) ═══ */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: matrixOpacity,
          x: matrixDriftX,
          transformOrigin: 'right center',
        }}
      >
        <MatrixSVG />
      </motion.div>

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
        {/* Soft elliptical mask for all portraits */}
        <div
          className="portrait-mask"
          style={{
            position: 'relative',
            width: '60vh',
            height: '85vh',
            maxWidth: '80vw',
            maskImage: 'radial-gradient(ellipse 50% 48% at 50% 50%, black 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 50% 48% at 50% 50%, black 60%, transparent 100%)',
          }}
        >
          {/* Layer 1: Base Portrait (always visible) */}
          <img
            src={baseImage}
            alt=""
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height: '100%',
              width: 'auto',
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
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height: '100%',
              width: 'auto',
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
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none',
              clipPath: techClipPath,
            }}
            draggable={false}
          />
        </div>
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
