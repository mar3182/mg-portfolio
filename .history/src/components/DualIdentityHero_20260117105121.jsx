/**
 * DualIdentityHero — Premium Portfolio Hero
 * 
 * One person. Two disciplines. Design ← → Tech
 * 
 * CRITICAL RULES:
 * - Portrait NEVER morphs or swaps
 * - Only visual layers evolve around portrait
 * - Smooth, intentional, elegant motion
 * - Dead zone at center to prevent flicker
 */

import { useRef, useState, useCallback, useEffect, memo } from 'react'
import { motion as Motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import './styles/dual-identity-hero.css'

// Mode thresholds (normalized 0-1, where 0.5 = center)
const DEAD_ZONE = 0.15 // ±15% from center = neutral zone
const CENTER = 0.5

/**
 * Determine current mode based on mouse X position
 */
function getMode(normalizedX) {
  if (normalizedX < CENTER - DEAD_ZONE) return 'design'
  if (normalizedX > CENTER + DEAD_ZONE) return 'tech'
  return 'neutral'
}

/**
 * Botanical SVG Branch - draws organically using pathLength
 */
const BotanicalBranch = memo(function BotanicalBranch({ 
  d, 
  delay = 0, 
  duration = 2,
  strokeWidth = 2,
  className = ''
}) {
  return (
    <Motion.path
      d={d}
      className={`botanical-branch ${className}`}
      strokeWidth={strokeWidth}
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ 
        pathLength: { duration, delay, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: 0.5, delay }
      }}
    />
  )
})

/**
 * Botanical Leaf - fades in with micro-rotation
 */
const BotanicalLeaf = memo(function BotanicalLeaf({
  cx, cy, size = 20, rotation = 0, delay = 0
}) {
  return (
    <Motion.g
      initial={{ opacity: 0, scale: 0.5, rotate: rotation - 10 }}
      animate={{ opacity: 0.8, scale: 1, rotate: rotation }}
      transition={{ 
        duration: 1.2, 
        delay,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <ellipse
        cx={cx}
        cy={cy}
        rx={size * 0.4}
        ry={size}
        className="botanical-leaf"
        transform={`rotate(${rotation} ${cx} ${cy})`}
      />
      {/* Leaf vein */}
      <line
        x1={cx}
        y1={cy - size * 0.8}
        x2={cx}
        y2={cy + size * 0.8}
        className="botanical-leaf-vein"
        transform={`rotate(${rotation} ${cx} ${cy})`}
      />
    </Motion.g>
  )
})

/**
 * Design World - Organic botanical background
 */
const DesignWorld = memo(function DesignWorld({ intensity }) {
  // Branch paths - organic, asymmetric curves
  const branches = [
    { d: 'M0,100 Q60,80 40,20 T80,0', delay: 0, strokeWidth: 3 },
    { d: 'M0,200 Q80,180 60,120 T100,60 Q120,30 90,0', delay: 0.2, strokeWidth: 2.5 },
    { d: 'M0,350 Q100,320 80,250 T120,180 Q140,120 100,80', delay: 0.4, strokeWidth: 2 },
    { d: 'M0,500 Q120,450 90,380 T140,300 Q160,240 120,180', delay: 0.3, strokeWidth: 2 },
  ]
  
  // Leaves with varying positions and rotations
  const leaves = [
    { cx: 45, cy: 25, size: 18, rotation: -30, delay: 1.2 },
    { cx: 75, cy: 70, size: 22, rotation: 15, delay: 1.4 },
    { cx: 95, cy: 150, size: 16, rotation: -45, delay: 1.6 },
    { cx: 60, cy: 130, size: 20, rotation: 25, delay: 1.3 },
    { cx: 110, cy: 220, size: 24, rotation: -20, delay: 1.8 },
    { cx: 85, cy: 280, size: 18, rotation: 40, delay: 1.5 },
    { cx: 130, cy: 320, size: 20, rotation: -35, delay: 2.0 },
    { cx: 100, cy: 400, size: 22, rotation: 10, delay: 1.7 },
  ]

  return (
    <Motion.div 
      className="design-world"
      style={{ opacity: intensity }}
    >
      {/* Warm gradient wash */}
      <div className="design-wash" />
      
      {/* Botanical SVG layer */}
      <svg 
        className="design-botanicals"
        viewBox="0 0 200 500"
        preserveAspectRatio="xMinYMin slice"
      >
        <defs>
          <linearGradient id="branchGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#c4703a" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#d4956a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#e8c4a8" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5a7c3a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8fb85a" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        
        {/* Branches */}
        <g className="branches-group">
          {branches.map((branch, i) => (
            <BotanicalBranch key={i} {...branch} />
          ))}
        </g>
        
        {/* Leaves */}
        <g className="leaves-group">
          {leaves.map((leaf, i) => (
            <BotanicalLeaf key={i} {...leaf} />
          ))}
        </g>
      </svg>
      
      {/* Paint wash overlay - masked reveal */}
      <div className="design-paint-wash" />
    </Motion.div>
  )
})

/**
 * Tech World - Structured grid and data lines
 */
const TechWorld = memo(function TechWorld({ intensity }) {
  return (
    <Motion.div 
      className="tech-world"
      style={{ opacity: intensity }}
    >
      {/* Cool gradient base */}
      <div className="tech-gradient" />
      
      {/* Grid pattern */}
      <div className="tech-grid" />
      
      {/* Vertical data lines */}
      <div className="tech-data-lines">
        {[...Array(8)].map((_, i) => (
          <Motion.div
            key={i}
            className="data-line"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.6 }}
            transition={{
              duration: 1.5,
              delay: i * 0.15,
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{ 
              left: `${15 + i * 12}%`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>
      
      {/* Subtle particle field */}
      <div className="tech-particles" />
      
      {/* Glow accent */}
      <div className="tech-glow" />
    </Motion.div>
  )
})

/**
 * Portrait Component with overlay effects
 */
const Portrait = memo(function Portrait({ 
  src, 
  translateX,
  designIntensity,
  techIntensity 
}) {
  // Calculate neutral intensity (1 when both design/tech are 0)
  const neutralIntensity = useTransform(
    [designIntensity, techIntensity],
    ([d, t]) => Math.max(0, 1 - d - t)
  )
  
  return (
    <div className="portrait-container">
      {/* Base portrait - always visible, B&W in neutral */}
      <Motion.div 
        className="portrait-wrapper"
        style={{ x: translateX }}
      >
        <img 
          src={src}
          alt="Portrait"
          className="portrait-image"
          draggable={false}
        />
        
        {/* Neutral state: grayscale overlay */}
        <Motion.div 
          className="portrait-grayscale"
          style={{ opacity: neutralIntensity }}
        />
        
        {/* Design mode: warm color grade */}
        <Motion.div 
          className="portrait-overlay portrait-overlay--warm"
          style={{ opacity: designIntensity }}
        />
        
        {/* Tech mode: cool color grade + RGB split */}
        <Motion.div 
          className="portrait-overlay portrait-overlay--cool"
          style={{ opacity: techIntensity }}
        />
        
        {/* Tech mode: subtle RGB split effect */}
        <Motion.div 
          className="portrait-rgb-split"
          style={{ opacity: techIntensity }}
        />
      </Motion.div>
    </div>
  )
})

/**
 * Main Hero Component
 */
export default function DualIdentityHero({
  portraitSrc = '/portrait.png',
  isReady = true,
}) {
  const containerRef = useRef(null)
  const [mode, setMode] = useState('neutral')
  const [hasInteracted, setHasInteracted] = useState(false)

  // Mouse position (normalized 0-1)
  const mouseX = useMotionValue(0.5)
  
  // Smooth spring for all derived values
  const springConfig = { stiffness: 80, damping: 25, mass: 0.8 }
  const smoothX = useSpring(mouseX, springConfig)
  
  // Portrait translation (±40px from center)
  const portraitX = useTransform(smoothX, [0, 0.5, 1], [40, 0, -40])
  
  // Design intensity (1 at left edge, 0 at center+)
  const designIntensity = useTransform(smoothX, 
    [0, CENTER - DEAD_ZONE, CENTER], 
    [1, 0.5, 0]
  )
  
  // Tech intensity (0 at center-, 1 at right edge)
  const techIntensity = useTransform(smoothX, 
    [CENTER, CENTER + DEAD_ZONE, 1], 
    [0, 0.5, 1]
  )

  // Mouse move handler
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const clampedX = Math.max(0, Math.min(1, x))
    
    mouseX.set(clampedX)
    setMode(getMode(clampedX))
    
    if (!hasInteracted) setHasInteracted(true)
  }, [mouseX, hasInteracted])

  // Mouse leave - return to neutral
  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5)
    setMode('neutral')
  }, [mouseX])

  // Animate in when ready
  const [isAnimatedIn, setIsAnimatedIn] = useState(false)
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => setIsAnimatedIn(true), 300)
      return () => clearTimeout(timer)
    }
  }, [isReady])

  return (
    <section 
      ref={containerRef}
      className={`dual-identity-hero ${isAnimatedIn ? 'is-ready' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-mode={mode}
    >
      {/* Design World (Left) */}
      <DesignWorld intensity={designIntensity} />
      
      {/* Tech World (Right) */}
      <TechWorld intensity={techIntensity} />
      
      {/* Central Portrait */}
      <Portrait 
        src={portraitSrc}
        translateX={portraitX}
        designIntensity={designIntensity}
        techIntensity={techIntensity}
      />
      
      {/* Mode labels */}
      <div className="mode-labels">
        <Motion.span 
          className="mode-label mode-label--design"
          style={{ opacity: designIntensity }}
        >
          Design
        </Motion.span>
        <Motion.span 
          className="mode-label mode-label--tech"
          style={{ opacity: techIntensity }}
        >
          {'<Tech />'}
        </Motion.span>
      </div>
      
      {/* Interaction hint */}
      <Motion.div 
        className="interaction-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: hasInteracted ? 0 : 0.6 }}
        transition={{ duration: 0.5 }}
      >
        <span className="hint-arrow">←</span>
        <span className="hint-text">Explore</span>
        <span className="hint-arrow">→</span>
      </Motion.div>
      
      {/* Tagline */}
      <div className="hero-tagline">
        <span className="tagline-text">The T-Shaped Professional</span>
      </div>
    </section>
  )
}
