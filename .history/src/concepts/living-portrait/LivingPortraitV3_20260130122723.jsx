/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LIVING PORTRAIT V3 — T-Navigation Portfolio Experience
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ART DIRECTION CONCEPT:
 * 
 * The "T" Navigation creates a spatial portfolio experience:
 * 
 *        ┌─────────────────────────────────────────────────┐
 *        │   DESIGN          ABOUT            TECH         │  ← Horizontal: WHAT
 *        │   (Portfolio)     (Self)           (Skills)     │
 *        │      ↓              ↓                 ↓         │
 *        │   [Content]     [Content]         [Content]     │  ← Vertical: DEPTH
 *        └─────────────────────────────────────────────────┘
 * 
 * ZONES:
 * - LEFT (0-0.3): Design Zone - Creative work, case studies
 * - CENTER (0.3-0.7): Self Zone - Portrait hero, about, contact
 * - RIGHT (0.7-1): Tech Zone - Development, skills, projects
 * 
 * PORTRAIT BEHAVIOR:
 * - CENTER: Large (hero), dominant presence
 * - EDGES: Small (thumbnail), content becomes hero
 * 
 * RESPONSIVE:
 * - Desktop: Mouse X controls horizontal, scroll for vertical
 * - Tablet/Mobile: Touch zones, swipe, scroll-primary
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useMotionValue, useSpring, useTransform, motion, AnimatePresence } from 'framer-motion'
import OrganicWorld from './OrganicWorld'
import MatrixWorld from './MatrixWorld'
import './living-portrait-v3.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Spring physics for smooth transitions
  spring: {
    stiffness: 60,
    damping: 25,
    mass: 1,
  },
  // Zone boundaries (0-1 normalized)
  zones: {
    design: { start: 0, end: 0.3, label: 'Creative Work' },
    self: { start: 0.3, end: 0.7, label: 'About Me' },
    tech: { start: 0.7, end: 1, label: 'Development' },
  },
  colors: {
    design: '#ff8c42',
    tech: '#1be7ff',
    neutral: '#ffffff',
  },
  portraits: {
    base: '/portrait-split.png',
    design: '/portrait-design-left.png',
    tech: '/portrait-tech-right.png',
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Determine current zone
// ═══════════════════════════════════════════════════════════════════════════

function getZone(identity) {
  if (identity < CONFIG.zones.design.end) return 'design'
  if (identity > CONFIG.zones.tech.start) return 'tech'
  return 'self'
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitV3() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeZone, setActiveZone] = useState('self')
  const [isMobile, setIsMobile] = useState(false)
  
  // Raw mouse/touch position (0-1)
  const identityRaw = useMotionValue(0.5)
  const depthRaw = useMotionValue(0) // Vertical scroll depth (0-1)
  
  // Smooth values with spring physics
  const identity = useSpring(identityRaw, CONFIG.spring)
  const depth = useSpring(depthRaw, CONFIG.spring)
  
  // ─── PORTRAIT SCALING ───
  // Large at center, small at edges (content becomes hero)
  const portraitScale = useTransform(
    identity, 
    [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1],
    [0.5, 0.6, 0.9, 1, 0.9, 0.6, 0.5]
  )
  
  // Portrait Y position - rises slightly at edges
  const portraitY = useTransform(
    identity,
    [0, 0.3, 0.5, 0.7, 1],
    ['15%', '5%', '0%', '5%', '15%']
  )
  
  // Portrait opacity - always visible but less prominent at edges
  const portraitOpacity = useTransform(
    identity,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0.7, 0.85, 1, 1, 0.85, 0.7]
  )
  
  // ─── HORIZONTAL SHIFT ───
  const horizontalShift = useTransform(identity, [0, 0.5, 1], ['20vw', '0vw', '-20vw'])
  
  // ─── ZONE VISIBILITY ───
  const designZoneOpacity = useTransform(identity, [0, 0.25, 0.4], [1, 0.5, 0])
  const techZoneOpacity = useTransform(identity, [0.6, 0.75, 1], [0, 0.5, 1])
  const selfZoneOpacity = useTransform(identity, [0.2, 0.35, 0.5, 0.65, 0.8], [0, 0.5, 1, 0.5, 0])
  
  // ─── CONTENT PANELS ───
  // Design panel slides in from left when in design zone
  const designPanelX = useTransform(identity, [0, 0.2, 0.4], ['0%', '10%', '100%'])
  const designPanelOpacity = useTransform(identity, [0, 0.15, 0.35], [1, 0.8, 0])
  
  // Tech panel slides in from right when in tech zone
  const techPanelX = useTransform(identity, [0.6, 0.8, 1], ['-100%', '-10%', '0%'])
  const techPanelOpacity = useTransform(identity, [0.65, 0.85, 1], [0, 0.8, 1])
  
  // ─── SCROLL INDICATOR ───
  const scrollIndicatorOpacity = useTransform(
    identity,
    [0.35, 0.45, 0.55, 0.65],
    [0, 1, 1, 0]
  )
  
  // ─── ZONE LABEL VISIBILITY ───
  const zoneLabelOpacity = useTransform(
    identity,
    [0, 0.15, 0.3, 0.4, 0.5, 0.6, 0.7, 0.85, 1],
    [1, 0.8, 0, 0, 0, 0, 0, 0.8, 1]
  )
  
  // ─── BACKGROUND COLORS ───
  const bgWarmOpacity = useTransform(identity, [0, 0.3, 0.5], [0.5, 0.2, 0])
  const bgCoolOpacity = useTransform(identity, [0.5, 0.7, 1], [0, 0.2, 0.5])
  
  // Check for mobile/touch devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Track zone changes
  useEffect(() => {
    const unsubscribe = identity.on('change', (value) => {
      const newZone = getZone(value)
      if (newZone !== activeZone) {
        setActiveZone(newZone)
      }
    })
    return () => unsubscribe()
  }, [identity, activeZone])
  
  // Mouse movement handler
  const handleMouseMove = useCallback((e) => {
    if (isMobile) return
    
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const normalizedX = e.clientX / rect.width
    identityRaw.set(normalizedX)
  }, [identityRaw, isMobile])
  
  // Touch handlers for mobile
  const handleTouchMove = useCallback((e) => {
    if (!isMobile) return
    
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const touch = e.touches[0]
    const normalizedX = touch.clientX / rect.width
    identityRaw.set(normalizedX)
  }, [identityRaw, isMobile])
  
  // Zone click handler (for mobile tap navigation)
  const handleZoneClick = useCallback((zone) => {
    switch(zone) {
      case 'design':
        identityRaw.set(0.15)
        break
      case 'self':
        identityRaw.set(0.5)
        break
      case 'tech':
        identityRaw.set(0.85)
        break
    }
  }, [identityRaw])
  
  // Mouse leave - snap to nearest zone
  const handleMouseLeave = useCallback(() => {
    const current = identityRaw.get()
    if (current < 0.25) {
      identityRaw.set(0.15) // Design zone
    } else if (current > 0.75) {
      identityRaw.set(0.85) // Tech zone
    } else {
      identityRaw.set(0.5) // Self zone
    }
  }, [identityRaw])
  
  // Scroll handler for vertical depth
  const handleScroll = useCallback((e) => {
    // Future: implement vertical scroll for depth exploration
    // For now, this is a placeholder for the vertical axis
  }, [])
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  return (
    <motion.div 
      ref={containerRef}
      className="living-portrait-v3"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* ═══ LAYER 1: BACKGROUNDS ═══ */}
      <div className="lpv3-background">
        <motion.div 
          className="lpv3-background__warm"
          style={{ opacity: bgWarmOpacity }}
        />
        <motion.div 
          className="lpv3-background__cool"
          style={{ opacity: bgCoolOpacity }}
        />
        <div className="lpv3-background__vignette" />
      </div>
      
      {/* ═══ LAYER 2: WORLD BACKGROUNDS ═══ */}
      <OrganicWorld 
        identity={identity}
        horizontalShift={horizontalShift}
      />
      <MatrixWorld 
        identity={identity}
        horizontalShift={horizontalShift}
      />
      
      {/* ═══ LAYER 3: CROSS NAVIGATION (×) ═══ */}
      <CrossNavigation identity={identity} />
      
      {/* ═══ LAYER 4: ZONE LABELS ═══ */}
      <ZoneLabels 
        identity={identity}
        activeZone={activeZone}
        onZoneClick={handleZoneClick}
        isMobile={isMobile}
      />
      
      {/* ═══ LAYER 5: MAIN CONTENT AREA ═══ */}
      <main className="lpv3-main">
        {/* ─── PORTRAIT (Scales based on zone) ─── */}
        <motion.div 
          className="lpv3-portrait"
          style={{ 
            scale: portraitScale,
            y: portraitY,
            opacity: portraitOpacity,
          }}
        >
          <PortraitElement 
            identity={identity}
            config={CONFIG}
          />
        </motion.div>
        
        {/* ─── NAME & TAGLINE ─── */}
        <motion.div 
          className="lpv3-identity"
          style={{ opacity: selfZoneOpacity }}
        >
          <h1 className="lpv3-identity__name">Designer × Developer</h1>
          <p className="lpv3-identity__tagline">
            Bridging creativity and technology
          </p>
        </motion.div>
      </main>
      
      {/* ═══ LAYER 6: CONTENT PANELS ═══ */}
      {/* Design panel - left side content preview */}
      <motion.aside 
        className="lpv3-panel lpv3-panel--design"
        style={{ 
          x: designPanelX,
          opacity: designPanelOpacity,
        }}
      >
        <div className="lpv3-panel__header">
          <span className="lpv3-panel__icon">✦</span>
          <h2>Creative Work</h2>
        </div>
        <div className="lpv3-panel__preview">
          <div className="lpv3-panel__item">Brand Identity</div>
          <div className="lpv3-panel__item">UI/UX Design</div>
          <div className="lpv3-panel__item">Motion Graphics</div>
        </div>
        <div className="lpv3-panel__cta">
          <span>Scroll to explore ↓</span>
        </div>
      </motion.aside>
      
      {/* Tech panel - right side content preview */}
      <motion.aside 
        className="lpv3-panel lpv3-panel--tech"
        style={{ 
          x: techPanelX,
          opacity: techPanelOpacity,
        }}
      >
        <div className="lpv3-panel__header">
          <span className="lpv3-panel__icon">⚡</span>
          <h2>Development</h2>
        </div>
        <div className="lpv3-panel__preview">
          <div className="lpv3-panel__item">React / Next.js</div>
          <div className="lpv3-panel__item">Node.js / Python</div>
          <div className="lpv3-panel__item">Cloud / DevOps</div>
        </div>
        <div className="lpv3-panel__cta">
          <span>Scroll to explore ↓</span>
        </div>
      </motion.aside>
      
      {/* ═══ LAYER 7: SCROLL INDICATOR (Center zone) ═══ */}
      <motion.div 
        className="lpv3-scroll-indicator"
        style={{ opacity: scrollIndicatorOpacity }}
      >
        <motion.div 
          className="lpv3-scroll-indicator__arrow"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ↓
        </motion.div>
        <span>Scroll to learn more</span>
      </motion.div>
      
      {/* ═══ LAYER 8: NAVIGATION HINT ═══ */}
      <footer className="lpv3-footer">
        <motion.div 
          className="lpv3-footer__hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2 }}
        >
          {isMobile ? 'Swipe or tap to explore' : 'Move cursor to explore'}
        </motion.div>
      </footer>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CROSS NAVIGATION — The "×" as navigation element
// ═══════════════════════════════════════════════════════════════════════════

const CrossNavigation = memo(function CrossNavigation({ identity }) {
  // Horizontal line transforms
  const hLineScaleX = useTransform(identity, [0, 0.5, 1], [0.3, 1, 0.3])
  const hLineX = useTransform(identity, [0, 1], ['-35%', '35%'])
  
  // The "×" symbol rotation based on position
  const crossRotation = useTransform(identity, [0, 0.5, 1], [-15, 0, 15])
  
  // Color transitions
  const leftColor = useTransform(
    identity, [0, 0.3, 0.5],
    [CONFIG.colors.design, CONFIG.colors.design, 'rgba(255,255,255,0.3)']
  )
  const rightColor = useTransform(
    identity, [0.5, 0.7, 1],
    ['rgba(255,255,255,0.3)', CONFIG.colors.tech, CONFIG.colors.tech]
  )
  const centerColor = useTransform(
    identity, [0, 0.3, 0.5, 0.7, 1],
    [CONFIG.colors.design, '#fff', '#fff', '#fff', CONFIG.colors.tech]
  )
  
  // Vertical line visibility (shows in center for scroll hint)
  const vLineOpacity = useTransform(identity, [0.3, 0.45, 0.55, 0.7], [0, 1, 1, 0])
  const vLineScaleY = useTransform(identity, [0.35, 0.5, 0.65], [0, 1, 0])
  
  return (
    <div className="lpv3-cross-nav">
      {/* Horizontal axis line */}
      <div className="lpv3-cross-nav__h-track">
        {/* Left segment (design) */}
        <motion.div 
          className="lpv3-cross-nav__h-segment lpv3-cross-nav__h-segment--left"
          style={{ backgroundColor: leftColor }}
        />
        {/* Right segment (tech) */}
        <motion.div 
          className="lpv3-cross-nav__h-segment lpv3-cross-nav__h-segment--right"
          style={{ backgroundColor: rightColor }}
        />
      </div>
      
      {/* The "×" cross symbol at current position */}
      <motion.div 
        className="lpv3-cross-nav__cross"
        style={{ 
          x: hLineX,
          rotate: crossRotation,
        }}
      >
        <motion.span 
          className="lpv3-cross-nav__symbol"
          style={{ color: centerColor }}
        >
          ×
        </motion.span>
      </motion.div>
      
      {/* Vertical axis line (scroll indicator) */}
      <motion.div 
        className="lpv3-cross-nav__v-line"
        style={{ 
          opacity: vLineOpacity,
          scaleY: vLineScaleY,
        }}
      />
      
      {/* Labels */}
      <motion.span 
        className="lpv3-cross-nav__label lpv3-cross-nav__label--left"
        style={{ opacity: useTransform(identity, [0, 0.2, 0.4], [1, 0.5, 0]) }}
      >
        Design
      </motion.span>
      <motion.span 
        className="lpv3-cross-nav__label lpv3-cross-nav__label--right"
        style={{ opacity: useTransform(identity, [0.6, 0.8, 1], [0, 0.5, 1]) }}
      >
        Tech
      </motion.span>
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// ZONE LABELS
// ═══════════════════════════════════════════════════════════════════════════

const ZoneLabels = memo(function ZoneLabels({ identity, activeZone, onZoneClick, isMobile }) {
  const designLabelOpacity = useTransform(identity, [0, 0.2, 0.35], [1, 0.6, 0])
  const techLabelOpacity = useTransform(identity, [0.65, 0.8, 1], [0, 0.6, 1])
  
  return (
    <>
      {/* Design zone label */}
      <motion.button 
        className="lpv3-zone-label lpv3-zone-label--design"
        style={{ opacity: designLabelOpacity }}
        onClick={() => isMobile && onZoneClick('design')}
        whileHover={!isMobile ? { scale: 1.05 } : {}}
      >
        <span className="lpv3-zone-label__icon">✦</span>
        <span className="lpv3-zone-label__text">Creative Work</span>
      </motion.button>
      
      {/* Tech zone label */}
      <motion.button 
        className="lpv3-zone-label lpv3-zone-label--tech"
        style={{ opacity: techLabelOpacity }}
        onClick={() => isMobile && onZoneClick('tech')}
        whileHover={!isMobile ? { scale: 1.05 } : {}}
      >
        <span className="lpv3-zone-label__text">Development</span>
        <span className="lpv3-zone-label__icon">⚡</span>
      </motion.button>
    </>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// PORTRAIT ELEMENT
// ═══════════════════════════════════════════════════════════════════════════

const PortraitElement = memo(function PortraitElement({ identity, config }) {
  // Design half clip path
  const designClipPath = useTransform(identity, (pos) => {
    if (pos >= 0.5) return 'inset(0 100% 0 0)'
    const revealPercent = ((0.5 - pos) / 0.5) * 100
    return `inset(0 ${100 - revealPercent}% 0 0)`
  })
  
  // Tech half clip path
  const techClipPath = useTransform(identity, (pos) => {
    if (pos <= 0.5) return 'inset(0 0 0 100%)'
    const revealPercent = ((pos - 0.5) / 0.5) * 100
    return `inset(0 0 0 ${100 - revealPercent}%)`
  })
  
  // Base portrait visibility
  const baseOpacity = useTransform(
    identity, 
    [0, 0.25, 0.4, 0.6, 0.75, 1], 
    [0.3, 0.6, 1, 1, 0.6, 0.3]
  )
  
  return (
    <div className="lpv3-portrait__container">
      {/* Base portrait (neutral) */}
      <motion.img 
        src={config.portraits.base}
        alt="Portrait"
        className="lpv3-portrait__image lpv3-portrait__image--base"
        style={{ opacity: baseOpacity }}
      />
      
      {/* Design half (warm tones) */}
      <motion.img 
        src={config.portraits.design}
        alt="Design side"
        className="lpv3-portrait__image lpv3-portrait__image--design"
        style={{ clipPath: designClipPath }}
      />
      
      {/* Tech half (cool tones) */}
      <motion.img 
        src={config.portraits.tech}
        alt="Tech side"
        className="lpv3-portrait__image lpv3-portrait__image--tech"
        style={{ clipPath: techClipPath }}
      />
      
      {/* Glow effect */}
      <div className="lpv3-portrait__glow" />
    </div>
  )
})
