/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CINEMATIC PORTRAIT HERO
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * A premium, editorial-style hero portrait that responds to mouse position.
 * 
 * VISUAL NARRATIVE:
 * - Mouse left → Design identity (portrait looks left)
 * - Mouse center → Dual identity (split portrait)
 * - Mouse right → Technology identity (portrait looks right)
 * 
 * MOTION PHILOSOPHY:
 * - Cinematic, slow transitions (not snappy)
 * - Intent-based movement (responsive but calm)
 * - Subtle parallax creates depth
 * - Crossfades feel like breathing, not switching
 * 
 * IMAGES (place in /public):
 * - /portrait-design-left.png  → Left-facing, warm/organic feel
 * - /portrait-split.png        → Center/neutral, dual identity
 * - /portrait-tech-right.png   → Right-facing, cool/digital feel
 */

import { useRef, useState, useCallback, useEffect, memo } from 'react'
import { motion as Motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useIdentityActions } from '../hooks/useIdentity'
import './styles/cinematic-portrait.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Spring physics for smooth, cinematic motion
  spring: {
    stiffness: 50,    // Low = slower, more cinematic
    damping: 30,      // Higher = less oscillation
    mass: 1.2,        // Higher = more inertia
  },
  // Parallax offset in pixels
  parallax: {
    portrait: 20,     // Portrait layer shift
    bloom: 30,        // Light bloom shift
    grain: 5,         // Grain subtle shift
  },
  // Opacity transition zones (mouse X position 0-1)
  zones: {
    designEnd: 0.35,    // Full design visible until here
    neutralStart: 0.4,  // Neutral fades in
    neutralEnd: 0.6,    // Neutral fades out
    techStart: 0.65,    // Tech starts fading in
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// PORTRAIT LAYER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Individual portrait layer with parallax and opacity control
 */
const PortraitLayer = memo(function PortraitLayer({ 
  src, 
  alt, 
  opacity, 
  parallaxX, 
  parallaxY,
  priority = false,
}) {
  return (
    <Motion.div
      className="cinematic-portrait__layer"
      style={{
        opacity,
        x: parallaxX,
        y: parallaxY,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="cinematic-portrait__image"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </Motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// VISUAL EFFECTS COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cinematic vignette overlay (top/bottom darkness)
 */
const Vignette = memo(function Vignette() {
  return (
    <div className="cinematic-portrait__vignette" aria-hidden="true">
      <div className="cinematic-portrait__vignette-top" />
      <div className="cinematic-portrait__vignette-bottom" />
      <div className="cinematic-portrait__vignette-radial" />
    </div>
  )
})

/**
 * Soft light bloom effect that follows mouse
 */
const LightBloom = memo(function LightBloom({ x, y, identity }) {
  // Bloom color shifts with identity
  const bloomColor = useTransform(
    identity,
    [0, 0.5, 1],
    [
      'rgba(196, 112, 58, 0.15)',   // Warm design glow
      'rgba(255, 255, 255, 0.08)', // Neutral
      'rgba(58, 156, 196, 0.15)',   // Cool tech glow
    ]
  )

  return (
    <Motion.div
      className="cinematic-portrait__bloom"
      style={{
        x,
        y,
        background: useTransform(
          [bloomColor],
          ([color]) => `radial-gradient(ellipse 60% 50% at 50% 50%, ${color} 0%, transparent 70%)`
        ),
      }}
      aria-hidden="true"
    />
  )
})

/**
 * Subtle film grain overlay (SVG-based for performance)
 */
const FilmGrain = memo(function FilmGrain({ opacity }) {
  return (
    <Motion.div
      className="cinematic-portrait__grain"
      style={{ opacity }}
      aria-hidden="true"
    />
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY LABELS (Clickable for navigation)
// ═══════════════════════════════════════════════════════════════════════════

const IdentityLabel = memo(function IdentityLabel({ side, opacity, onClick }) {
  const isDesign = side === 'design'
  
  return (
    <Motion.button
      type="button"
      className={`cinematic-portrait__label cinematic-portrait__label--${side}`}
      style={{ opacity }}
      onClick={() => onClick?.(side)}
      aria-label={`Explore ${isDesign ? 'design' : 'tech'} projects`}
    >
      <span className="cinematic-portrait__label-title">
        {isDesign ? 'designer' : '<coder>'}
      </span>
      <span className="cinematic-portrait__label-desc">
        {isDesign 
          ? 'Product designer specialising in UI design and design systems.'
          : 'Full stack developer who writes clean, elegant and efficient code.'
        }
      </span>
      <span className="cinematic-portrait__label-cta">
        Click to explore →
      </span>
    </Motion.button>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function CinematicPortraitHero({
  designImage = '/portrait-design-left.png',
  splitImage = '/portrait-split.png',
  techImage = '/portrait-tech-right.png',
  isReady = true,
  onIdentityChange,  // Called on mouse move (for visual feedback only)
  onNavigate,        // Called on click (for navigating to projects - Step 3)
}) {
  const containerRef = useRef(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [currentZone, setCurrentZone] = useState('neutral')
  
  // ═══ Identity System Integration ═══
  const { setIdentity, animateToIdentity } = useIdentityActions()

  // ═══ Mouse Position Tracking ═══
  // Raw mouse position (0-1 range, 0.5 = center)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Smoothed values with cinematic spring physics
  const smoothX = useSpring(mouseX, CONFIG.spring)
  const smoothY = useSpring(mouseY, CONFIG.spring)

  // ═══ Portrait Opacity Calculations ═══
  // Design portrait: Full opacity on left, fades toward center
  const designOpacity = useTransform(
    smoothX,
    [0, CONFIG.zones.designEnd, CONFIG.zones.neutralStart],
    [1, 1, 0]
  )

  // Split portrait: Visible in center zone
  const splitOpacity = useTransform(
    smoothX,
    [CONFIG.zones.designEnd, CONFIG.zones.neutralStart, CONFIG.zones.neutralEnd, CONFIG.zones.techStart],
    [0, 1, 1, 0]
  )

  // Tech portrait: Full opacity on right, fades toward center
  const techOpacity = useTransform(
    smoothX,
    [CONFIG.zones.neutralEnd, CONFIG.zones.techStart, 1],
    [0, 1, 1]
  )

  // ═══ Label Opacities ═══
  const designLabelOpacity = useTransform(smoothX, [0, 0.25, 0.4], [1, 0.8, 0])
  const techLabelOpacity = useTransform(smoothX, [0.6, 0.75, 1], [0, 0.8, 1])

  // ═══ Parallax Calculations ═══
  // Portrait shifts opposite to mouse for depth
  const portraitParallaxX = useTransform(
    smoothX,
    [0, 1],
    [CONFIG.parallax.portrait, -CONFIG.parallax.portrait]
  )
  const portraitParallaxY = useTransform(
    smoothY,
    [0, 1],
    [CONFIG.parallax.portrait * 0.5, -CONFIG.parallax.portrait * 0.5]
  )

  // Bloom follows mouse (same direction, larger range)
  const bloomX = useTransform(
    smoothX,
    [0, 1],
    [-CONFIG.parallax.bloom, CONFIG.parallax.bloom]
  )
  const bloomY = useTransform(
    smoothY,
    [0, 1],
    [-CONFIG.parallax.bloom * 0.5, CONFIG.parallax.bloom * 0.5]
  )

  // Grain opacity varies slightly with identity
  const grainOpacity = useTransform(smoothX, [0, 0.5, 1], [0.06, 0.04, 0.03])

  // ═══ Mouse Event Handlers ═══
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const clampedX = Math.max(0, Math.min(1, x))
    const clampedY = Math.max(0, Math.min(1, y))

    mouseX.set(clampedX)
    mouseY.set(clampedY)

    // Update global identity system
    setIdentity(clampedX, 'hero')

    // Notify parent if callback provided
    if (onIdentityChange) {
      const zone = clampedX < 0.35 ? 'design' : clampedX > 0.65 ? 'tech' : 'neutral'
      onIdentityChange(zone, clampedX)
    }

    if (!hasInteracted) setHasInteracted(true)
  }, [mouseX, mouseY, setIdentity, onIdentityChange, hasInteracted])

  const handleMouseLeave = useCallback(() => {
    // Smoothly return to center (neutral state)
    mouseX.set(0.5)
    mouseY.set(0.5)
    animateToIdentity(0.5, { duration: 1.2, source: 'hero-exit' })
  }, [mouseX, mouseY, animateToIdentity])

  // ═══ Touch Support ═══
  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current || !e.touches[0]) return
    
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width))
    
    mouseX.set(x)
    setIdentity(x, 'hero-touch')
    
    if (!hasInteracted) setHasInteracted(true)
  }, [mouseX, setIdentity, hasInteracted])

  const handleTouchEnd = useCallback(() => {
    // Return to center on touch end
    mouseX.set(0.5)
    mouseY.set(0.5)
    animateToIdentity(0.5, { duration: 1.2, source: 'hero-touch-end' })
  }, [mouseX, mouseY, animateToIdentity])

  // ═══ Keyboard Accessibility ═══
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      const newX = Math.max(0, mouseX.get() - 0.1)
      mouseX.set(newX)
      setIdentity(newX, 'keyboard')
    } else if (e.key === 'ArrowRight') {
      const newX = Math.min(1, mouseX.get() + 0.1)
      mouseX.set(newX)
      setIdentity(newX, 'keyboard')
    }
  }, [mouseX, setIdentity])

  // ═══ Entrance Animation ═══
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    if (isReady) {
      // Slight delay for cinematic entrance
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isReady])

  return (
    <section
      ref={containerRef}
      className={`cinematic-portrait ${isVisible ? 'cinematic-portrait--visible' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Interactive portrait hero - move mouse left for design, right for technology"
    >
      {/* Portrait Container with editorial framing */}
      <div className="cinematic-portrait__frame">
        {/* Design Portrait (Left-facing) */}
        <PortraitLayer
          src={designImage}
          alt="Portrait facing left - Design identity"
          opacity={designOpacity}
          parallaxX={portraitParallaxX}
          parallaxY={portraitParallaxY}
        />

        {/* Split Portrait (Center/Neutral) */}
        <PortraitLayer
          src={splitImage}
          alt="Portrait center - Dual identity"
          opacity={splitOpacity}
          parallaxX={portraitParallaxX}
          parallaxY={portraitParallaxY}
          priority
        />

        {/* Tech Portrait (Right-facing) */}
        <PortraitLayer
          src={techImage}
          alt="Portrait facing right - Technology identity"
          opacity={techOpacity}
          parallaxX={portraitParallaxX}
          parallaxY={portraitParallaxY}
        />

        {/* Visual Effects */}
        <Vignette />
        <LightBloom x={bloomX} y={bloomY} identity={smoothX} />
        <FilmGrain opacity={grainOpacity} />
      </div>

      {/* Identity Labels */}
      <IdentityLabel side="design" opacity={designLabelOpacity} />
      <IdentityLabel side="tech" opacity={techLabelOpacity} />

      {/* Scroll Indicator */}
      <Motion.div 
        className="cinematic-portrait__scroll-hint"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: hasInteracted ? 0 : 0.6, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span>EXPLORE</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Motion.div>

      {/* Interaction Hint (fades after first interaction) */}
      {!hasInteracted && (
        <Motion.div
          className="cinematic-portrait__hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          Move cursor to explore
        </Motion.div>
      )}
    </section>
  )
}

export default memo(CinematicPortraitHero)
