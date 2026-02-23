/**
 * ═══════════════════════════════════════════════════════════════════════════
 * T-PORTFOLIO HERO — The Definitive Implementation
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CORE CONCEPT:
 * A navigable space expressing the T-shaped professional:
 * - Horizontal axis → Breadth (Design ↔ Technology)
 * - Vertical axis → Depth (Projects, expertise)
 * - Portrait → Emotional anchor at the intersection
 * 
 * DESIGN PRINCIPLES:
 * 1. Navigation IS the concept — no explaining, just discovery
 * 2. Slower motion = Confidence (cinematic, not snappy)
 * 3. Two distinct worlds that blend at the center
 * 4. Authentic, handmade visual language
 * 
 * INTERACTION MODEL:
 * - Mouse/touch left-right: Horizontal exploration (identity)
 * - Scroll: Vertical depth (unlocks after horizontal commitment)
 * - Click zones: Enter Design or Tech world
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import { useIdentityActions } from '../../hooks/useIdentity'
import './t-portfolio-hero.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION — Cinematic, confident motion
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Portrait/identity spring — slow, heavy, confident
  identity: {
    stiffness: 40,
    damping: 30,
    mass: 1.2,
  },
  // Background atmosphere — even slower (drift, not switch)
  atmosphere: {
    stiffness: 20,
    damping: 25,
    mass: 2,
  },
  // Cursor tracking — responsive but not twitchy
  cursor: {
    stiffness: 200,
    damping: 25,
  },
  // Parallax intensities
  parallax: {
    portrait: 20,
    foreground: 35,
    background: 12,
  },
  // Zone thresholds
  zones: {
    designCommit: 0.3,   // Below this = committed to design
    neutralStart: 0.35,
    neutralEnd: 0.65,
    techCommit: 0.7,     // Above this = committed to tech
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function TPortfolioHero({
  portraitCenter = '/portrait-split.png',
  portraitDesign = '/portrait-design-left.png',
  portraitTech = '/portrait-tech-right.png',
  onNavigate,
  isReady = true,
}) {
  const containerRef = useRef(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [verticalUnlocked, setVerticalUnlocked] = useState(false)
  
  // ─── Identity System Connection ───
  const { setIdentity, animateToIdentity } = useIdentityActions()
  
  // ─── Core Motion Values ───
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  
  // ─── Smoothed Values ───
  const identity = useSpring(mouseX, CONFIG.identity)
  const atmosphere = useSpring(identity, CONFIG.atmosphere)
  // Cursor springs for potential future cursor component
  // const smoothCursorX = useSpring(cursorX, CONFIG.cursor)
  // const smoothCursorY = useSpring(cursorY, CONFIG.cursor)
  
  // ─── Portrait Crossfade Opacities ───
  // Design: Full at 0, invisible by 0.4
  const designOpacity = useTransform(identity, [0, 0.25, 0.4], [1, 0.6, 0])
  // Center: Visible in neutral zone
  const centerOpacity = useTransform(identity, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0])
  // Tech: Full at 1, invisible by 0.6
  const techOpacity = useTransform(identity, [0.6, 0.75, 1], [0, 0.6, 1])
  
  // ─── World Visibility ───
  const designWorldOpacity = useTransform(atmosphere, [0, 0.5], [1, 0])
  const techWorldOpacity = useTransform(atmosphere, [0.5, 1], [0, 1])
  
  // ─── Scene Panning ───
  // Move the whole scene left/right based on identity
  const scenePan = useTransform(identity, [0, 0.5, 1], ['30%', '0%', '-30%'])
  
  // ─── Parallax Effects ───
  const parallaxX = useTransform(cursorX, 
    val => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1920
      return ((val / width) - 0.5) * CONFIG.parallax.portrait * 2
    }
  )
  const parallaxY = useTransform(cursorY,
    val => {
      const height = typeof window !== 'undefined' ? window.innerHeight : 1080
      return ((val / height) - 0.5) * CONFIG.parallax.portrait * 1.2
    }
  )
  
  // ─── Vertical Unlock Logic ───
  // Vertical scroll becomes meaningful only after horizontal commitment
  useEffect(() => {
    const unsubscribe = identity.on('change', (v) => {
      const committed = v < CONFIG.zones.designCommit || v > CONFIG.zones.techCommit
      setVerticalUnlocked(committed)
    })
    return unsubscribe
  }, [identity])
  
  // ─── Mouse Movement Handler ───
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    // Normalized position (0-1)
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    
    mouseX.set(x)
    mouseY.set(y)
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
    
    // Update global identity system
    setIdentity(x, 'hero')
    
    if (!hasInteracted) setHasInteracted(true)
  }, [mouseX, mouseY, cursorX, cursorY, setIdentity, hasInteracted])
  
  // ─── Mouse Leave Handler ───
  const handleMouseLeave = useCallback(() => {
    // Lock to the side where the user exited
    const current = mouseX.get()
    if (current < 0.5) {
      animateToIdentity(0, { duration: 0.8, source: 'hero-exit' })
    } else {
      animateToIdentity(1, { duration: 0.8, source: 'hero-exit' })
    }
  }, [mouseX, animateToIdentity])
  
  // ─── Click Handler ───
  const handleClick = useCallback(() => {
    const current = mouseX.get()
    
    if (current < CONFIG.zones.designCommit) {
      onNavigate?.('design')
    } else if (current > CONFIG.zones.techCommit) {
      onNavigate?.('tech')
    }
    // Clicking in neutral zone does nothing — user must commit
  }, [mouseX, onNavigate])
  
  // ─── Touch Support ───
  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0]
    if (!touch || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width))
    
    mouseX.set(x)
    setIdentity(x, 'hero-touch')
    if (!hasInteracted) setHasInteracted(true)
  }, [mouseX, setIdentity, hasInteracted])

  return (
    <section
      ref={containerRef}
      className="t-hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchMove={handleTouchMove}
      data-ready={isReady}
      data-vertical-unlocked={verticalUnlocked}
    >
      {/* ═══ LAYER 1: ATMOSPHERE (Background) ═══ */}
      <AtmosphereLayer
        designOpacity={designWorldOpacity}
        techOpacity={techWorldOpacity}
        atmosphere={atmosphere}
      />
      
      {/* ═══ LAYER 2: PANNING CONTAINER ═══ */}
      <motion.div 
        className="t-hero__scene"
        style={{ x: scenePan }}
      >
        {/* ═══ LAYER 3: WORLD HINTS (Design / Tech) ═══ */}
        <WorldHints 
          identity={identity}
          hasInteracted={hasInteracted}
        />
        
        {/* ═══ LAYER 4: PORTRAIT TRIAD ═══ */}
        <PortraitTriad
          portraitCenter={portraitCenter}
          portraitDesign={portraitDesign}
          portraitTech={portraitTech}
          designOpacity={designOpacity}
          centerOpacity={centerOpacity}
          techOpacity={techOpacity}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
        />
        
        {/* ═══ LAYER 5: IDENTITY TYPOGRAPHY ═══ */}
        <IdentityTypography identity={identity} />
      </motion.div>
      
      {/* ═══ LAYER 6: INTERACTION HINT ═══ */}
      <InteractionHint 
        hasInteracted={hasInteracted} 
        verticalUnlocked={verticalUnlocked}
      />
      
      {/* ═══ LAYER 7: VERTICAL PROGRESS ═══ */}
      <VerticalIndicator 
        identity={identity}
        unlocked={verticalUnlocked}
      />
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Atmosphere Layer — Background colors and textures
 * Uses very slow spring for cinematic drift
 */
const AtmosphereLayer = memo(function AtmosphereLayer({ 
  designOpacity, 
  techOpacity,
  atmosphere,
}) {
  // Transform atmosphere to actual gradient values
  const coolGlow = useTransform(atmosphere, [0, 0.5, 1], [0, 0.1, 0.4])
  
  return (
    <div className="t-hero__atmosphere">
      {/* Design World (Warm, Organic) */}
      <motion.div
        className="t-hero__atmosphere-design"
        style={{ opacity: designOpacity }}
      >
        {/* Hand-painted texture overlay */}
        <div className="atmosphere-texture atmosphere-texture--paper" />
        {/* Warm gradient */}
        <div className="atmosphere-gradient atmosphere-gradient--warm" />
      </motion.div>
      
      {/* Tech World (Cool, Structured) */}
      <motion.div
        className="t-hero__atmosphere-tech"
        style={{ opacity: techOpacity }}
      >
        {/* Grid pattern */}
        <div className="atmosphere-texture atmosphere-texture--grid" />
        {/* Cool gradient */}
        <motion.div 
          className="atmosphere-gradient atmosphere-gradient--cool"
          style={{ opacity: coolGlow }}
        />
      </motion.div>
      
      {/* Neutral base */}
      <div className="t-hero__atmosphere-neutral" />
    </div>
  )
})

/**
 * World Hints — Visual indicators for Design/Tech directions
 */
const WorldHints = memo(function WorldHints({ identity, hasInteracted }) {
  // Design hint opacity: visible when leaning right (away from design)
  const designHintOpacity = useTransform(identity, [0, 0.3, 0.5, 1], [0, 0, 0.4, 0.7])
  // Tech hint opacity: visible when leaning left (away from tech)
  const techHintOpacity = useTransform(identity, [0, 0.5, 0.7, 1], [0.7, 0.4, 0, 0])
  
  return (
    <>
      <motion.div 
        className="t-hero__world-hint t-hero__world-hint--design"
        style={{ opacity: hasInteracted ? designHintOpacity : 0.5 }}
      >
        <span className="world-hint__label">Design</span>
        <span className="world-hint__arrow">←</span>
      </motion.div>
      
      <motion.div 
        className="t-hero__world-hint t-hero__world-hint--tech"
        style={{ opacity: hasInteracted ? techHintOpacity : 0.5 }}
      >
        <span className="world-hint__arrow">→</span>
        <span className="world-hint__label">Technology</span>
      </motion.div>
    </>
  )
})

/**
 * Portrait Triad — Three portraits that crossfade based on identity
 */
const PortraitTriad = memo(function PortraitTriad({
  portraitCenter,
  portraitDesign,
  portraitTech,
  designOpacity,
  centerOpacity,
  techOpacity,
  parallaxX,
  parallaxY,
}) {
  return (
    <div className="t-hero__portrait-triad">
      {/* Design Portrait (Warm, Profile Left) */}
      <motion.div
        className="t-hero__portrait t-hero__portrait--design"
        style={{ 
          opacity: designOpacity,
          x: parallaxX,
          y: parallaxY,
        }}
      >
        <img 
          src={portraitDesign} 
          alt="Design perspective"
          loading="eager"
        />
      </motion.div>
      
      {/* Center Portrait (B&W, Frontal) */}
      <motion.div
        className="t-hero__portrait t-hero__portrait--center"
        style={{ 
          opacity: centerOpacity,
          x: parallaxX,
          y: parallaxY,
        }}
      >
        <img 
          src={portraitCenter} 
          alt="Portrait"
          loading="eager"
        />
      </motion.div>
      
      {/* Tech Portrait (Cool, Profile Right) */}
      <motion.div
        className="t-hero__portrait t-hero__portrait--tech"
        style={{ 
          opacity: techOpacity,
          x: parallaxX,
          y: parallaxY,
        }}
      >
        <img 
          src={portraitTech} 
          alt="Technology perspective"
          loading="eager"
        />
      </motion.div>
    </div>
  )
})

/**
 * Identity Typography — Words that appear based on identity commitment
 */
const IdentityTypography = memo(function IdentityTypography({ identity }) {
  const designTextOpacity = useTransform(identity, [0, 0.2, 0.4], [0.8, 0.5, 0])
  const techTextOpacity = useTransform(identity, [0.6, 0.8, 1], [0, 0.5, 0.8])
  
  const designTextX = useTransform(identity, [0, 0.5], [0, 40])
  const techTextX = useTransform(identity, [0.5, 1], [-40, 0])
  
  return (
    <div className="t-hero__typography">
      <motion.div
        className="t-hero__identity-text t-hero__identity-text--design"
        style={{ opacity: designTextOpacity, x: designTextX }}
      >
        <span className="identity-text__label">Creative</span>
        <span className="identity-text__sub">Vision & Craft</span>
      </motion.div>
      
      <motion.div
        className="t-hero__identity-text t-hero__identity-text--tech"
        style={{ opacity: techTextOpacity, x: techTextX }}
      >
        <span className="identity-text__label">Technical</span>
        <span className="identity-text__sub">Systems & Code</span>
      </motion.div>
    </div>
  )
})

/**
 * Interaction Hint — Subtle guidance for first-time visitors
 */
const InteractionHint = memo(function InteractionHint({ hasInteracted, verticalUnlocked }) {
  if (hasInteracted && verticalUnlocked) {
    return (
      <motion.div
        className="t-hero__hint t-hero__hint--scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.5 }}
      >
        <span>Scroll to explore</span>
        <motion.span
          className="hint__arrow"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ↓
        </motion.span>
      </motion.div>
    )
  }
  
  if (!hasInteracted) {
    return (
      <motion.div
        className="t-hero__hint t-hero__hint--explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.5 }}
        exit={{ opacity: 0 }}
      >
        <motion.span
          animate={{ x: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          ← Explore →
        </motion.span>
      </motion.div>
    )
  }
  
  return null
})

/**
 * Vertical Indicator — Shows depth progress when unlocked
 */
const VerticalIndicator = memo(function VerticalIndicator({ identity, unlocked }) {
  const indicatorOpacity = unlocked ? 1 : 0
  
  // Color based on which side committed
  const indicatorColor = useTransform(identity, 
    [0, 0.3, 0.7, 1],
    ['#c4703a', '#c4703a', '#3a7cc4', '#3a7cc4']
  )
  
  return (
    <motion.div
      className="t-hero__vertical-indicator"
      style={{ opacity: indicatorOpacity }}
    >
      <motion.div 
        className="vertical-indicator__line"
        style={{ backgroundColor: indicatorColor }}
      />
      <motion.div 
        className="vertical-indicator__dot"
        style={{ backgroundColor: indicatorColor }}
      />
    </motion.div>
  )
})
