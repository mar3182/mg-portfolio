/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE LIVING PORTRAIT — Unified Hero Experience
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The synthesis of all portfolio concepts:
 * - Visual boldness of Award Hero (shapes, colors, typography)
 * - Interactive depth of Split Portrait (identity-driven crossfades)
 * - Cinematic refinement of Identity Background (drift, never switch)
 * 
 * CORE PHILOSOPHY:
 * "The portfolio doesn't show you who I am—it lets you explore how I think."
 * 
 * INTERACTION MODEL:
 * - Mouse left → Design portrait reveals, warm shapes bloom
 * - Mouse right → Tech portrait reveals, circuits appear
 * - Mouse center → B&W portrait dominant, both identities at 20%
 * 
 * The interface IS the portfolio.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { 
  useMotionValue, 
  useSpring, 
  useTransform, 
  motion,
  AnimatePresence 
} from 'framer-motion'
import { CustomCursor } from './components/CustomCursor'
import { SocialLinks } from './components/SocialLinks'
import './styles/living-portrait.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Cinematic spring physics - slow, confident, never snappy
  spring: {
    stiffness: 40,
    damping: 30,
    mass: 1.2,
  },
  // Even slower for backgrounds (drift, not switch)
  backgroundSpring: {
    stiffness: 20,
    damping: 25,
    mass: 2,
  },
  // Portrait parallax intensity
  parallax: {
    portrait: 25,
    shapes: 35,
  },
  // Identity zones (mouse X position 0-1)
  zones: {
    designEnd: 0.35,     // Full design until here
    neutralStart: 0.4,   // Neutral zone starts
    neutralEnd: 0.6,     // Neutral zone ends
    techStart: 0.65,     // Full tech from here
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitHero() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [cursorVariant, setCursorVariant] = useState('default')
  
  // ─── IDENTITY TRACKING ───
  // Raw mouse position (0-1 range, 0.5 = center)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  
  // Smooth spring for identity (this is the core driver)
  const identity = useSpring(mouseX, CONFIG.spring)
  
  // Even smoother for background elements
  const backgroundIdentity = useSpring(identity, CONFIG.backgroundSpring)
  
  // Raw pixel positions for cursor
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const smoothCursorX = useSpring(cursorX, { damping: 25, stiffness: 200 })
  const smoothCursorY = useSpring(cursorY, { damping: 25, stiffness: 200 })
  
  // ─── PORTRAIT OPACITY CROSSFADES ───
  // Design: Full at 0, fades by 0.4
  const designOpacity = useTransform(identity, [0, 0.25, 0.4], [1, 0.6, 0])
  
  // Center/Neutral: Visible in middle zone
  const centerOpacity = useTransform(identity, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0])
  
  // Tech: Full at 1, fades by 0.6
  const techOpacity = useTransform(identity, [0.6, 0.75, 1], [0, 0.6, 1])
  
  // ─── BACKGROUND COLOR SHIFTS ───
  const warmPresence = useTransform(backgroundIdentity, [0, 0.5, 1], [0.8, 0.3, 0.05])
  const coolPresence = useTransform(backgroundIdentity, [0, 0.5, 1], [0.05, 0.3, 0.8])
  
  // ─── SHAPE VISIBILITY ───
  const warmShapesOpacity = useTransform(identity, [0, 0.4, 0.7], [1, 0.5, 0])
  const coolShapesOpacity = useTransform(identity, [0.3, 0.6, 1], [0, 0.5, 1])
  
  // ─── PARALLAX ───
  const parallaxX = useTransform(
    cursorX, 
    [0, typeof window !== 'undefined' ? window.innerWidth : 1920], 
    [-CONFIG.parallax.portrait, CONFIG.parallax.portrait]
  )
  const parallaxY = useTransform(
    cursorY, 
    [0, typeof window !== 'undefined' ? window.innerHeight : 1080], 
    [-CONFIG.parallax.portrait * 0.6, CONFIG.parallax.portrait * 0.6]
  )
  
  // ─── MOUSE TRACKING ───
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    // Normalized 0-1 position
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    mouseX.set(Math.max(0, Math.min(1, x)))
    mouseY.set(Math.max(0, Math.min(1, y)))
    
    // Raw pixel for cursor
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
  }, [mouseX, mouseY, cursorX, cursorY])
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  // ─── IDENTITY LABEL (for debugging/typography) ───
  const identityLabel = useTransform(identity, (v) => {
    if (v < 0.35) return 'design'
    if (v > 0.65) return 'tech'
    return 'neutral'
  })

  return (
    <motion.div 
      ref={containerRef}
      className="living-portrait-container"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Custom Cursor */}
      <CustomCursor 
        cursorX={smoothCursorX} 
        cursorY={smoothCursorY} 
        variant={cursorVariant}
      />
      
      {/* ═══ LAYER 1: IDENTITY BACKGROUND ═══ */}
      <IdentityBackground 
        warmPresence={warmPresence} 
        coolPresence={coolPresence} 
      />
      
      {/* ═══ LAYER 2: GRADIENT SHAPES ═══ */}
      <IdentityShapes 
        warmOpacity={warmShapesOpacity}
        coolOpacity={coolShapesOpacity}
        parallaxX={parallaxX}
        parallaxY={parallaxY}
      />
      
      {/* ═══ LEFT NAVIGATION ═══ */}
      <LivingNavigation 
        onHover={() => setCursorVariant('link')}
        onLeave={() => setCursorVariant('default')}
        isLoaded={isLoaded}
        identity={identity}
      />
      
      {/* ═══ MAIN CONTENT ═══ */}
      <main className="living-portrait-main">
        {/* ═══ LAYER 3: PORTRAITS ═══ */}
        <PortraitTriad
          designOpacity={designOpacity}
          centerOpacity={centerOpacity}
          techOpacity={techOpacity}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
          identity={identity}
          onHover={() => setCursorVariant('view')}
          onLeave={() => setCursorVariant('default')}
        />
        
        {/* ═══ LAYER 4: TYPOGRAPHY ═══ */}
        <IdentityTypography 
          identity={identity}
          isLoaded={isLoaded}
        />
        
        {/* ═══ LAYER 5: SOCIAL LINKS ═══ */}
        <SocialLinks 
          onHover={() => setCursorVariant('link')}
          onLeave={() => setCursorVariant('default')}
        />
      </main>
      
      {/* Footer */}
      <footer className="living-portrait-footer">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5 }}
        >
          Copyright ©2026 Portfolio. All rights reserved.
        </motion.p>
      </footer>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY BACKGROUND — Drifts, never switches
// ═══════════════════════════════════════════════════════════════════════════

function IdentityBackground({ warmPresence, coolPresence }) {
  return (
    <div className="identity-bg" aria-hidden="true">
      {/* Base layer - always present */}
      <div className="identity-bg__base" />
      
      {/* Warm atmosphere (design) */}
      <motion.div 
        className="identity-bg__warm"
        style={{ opacity: warmPresence }}
      />
      
      {/* Cool atmosphere (tech) */}
      <motion.div 
        className="identity-bg__cool"
        style={{ opacity: coolPresence }}
      />
      
      {/* Light center focal area */}
      <div className="identity-bg__focal" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY SHAPES — Bold gradients that fade based on identity
// ═══════════════════════════════════════════════════════════════════════════

function IdentityShapes({ warmOpacity, coolOpacity, parallaxX, parallaxY }) {
  // Warm shapes (design side)
  const warmShapes = [
    { id: 'warm-1', top: '12%', right: '20%', w: 160, h: 160, gradient: 'linear-gradient(135deg, #FF6B8A 0%, #FFB4C2 100%)', rotation: -15 },
    { id: 'warm-2', bottom: '8%', left: '45%', w: 180, h: 200, gradient: 'linear-gradient(160deg, #C77DFF 0%, #9D4EDD 100%)', rotation: 10 },
    { id: 'warm-3', bottom: '5%', left: '58%', w: 70, h: 90, gradient: 'linear-gradient(135deg, #FFB347 0%, #FFCC70 100%)', rotation: 25 },
  ]
  
  // Cool shapes (tech side)  
  const coolShapes = [
    { id: 'cool-1', top: '15%', left: '8%', w: 140, h: 140, gradient: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', rotation: 20 },
    { id: 'cool-2', bottom: '12%', left: '5%', w: 120, h: 150, gradient: 'linear-gradient(160deg, #3a7cc4 0%, #2563eb 100%)', rotation: -15 },
  ]

  return (
    <div className="identity-shapes" aria-hidden="true">
      {/* Warm shapes */}
      {warmShapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="identity-shape identity-shape--warm"
          style={{
            top: shape.top,
            bottom: shape.bottom,
            left: shape.left,
            right: shape.right,
            width: shape.w,
            height: shape.h,
            background: shape.gradient,
            rotate: shape.rotation,
            opacity: warmOpacity,
            x: useTransform(parallaxX, (v) => v * 1.2),
            y: useTransform(parallaxY, (v) => v * 0.8),
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      ))}
      
      {/* Cool shapes */}
      {coolShapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="identity-shape identity-shape--cool"
          style={{
            top: shape.top,
            bottom: shape.bottom,
            left: shape.left,
            right: shape.right,
            width: shape.w,
            height: shape.h,
            background: shape.gradient,
            rotate: shape.rotation,
            opacity: coolOpacity,
            x: useTransform(parallaxX, (v) => -v * 1.2),
            y: useTransform(parallaxY, (v) => v * 0.8),
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PORTRAIT TRIAD — The three portraits that crossfade
// ═══════════════════════════════════════════════════════════════════════════

function PortraitTriad({ 
  designOpacity, 
  centerOpacity, 
  techOpacity, 
  parallaxX, 
  parallaxY,
  identity,
  onHover, 
  onLeave 
}) {
  // Circuit visibility - only when leaning tech
  const circuitOpacity = useTransform(identity, [0.5, 0.7, 1], [0, 0.4, 0.8])
  
  return (
    <div className="portrait-triad">
      {/* DESIGN PORTRAIT (Left - warm, profile) */}
      <motion.div 
        className="portrait portrait--design"
        style={{
          opacity: designOpacity,
          x: useTransform(parallaxX, (v) => v * -1.5),
          y: useTransform(parallaxY, (v) => v * 0.8),
        }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <img 
          src="/portrait-design-left.png" 
          alt="Design identity"
          className="portrait__img portrait__img--warm"
        />
      </motion.div>
      
      {/* CENTER PORTRAIT (B&W, front-facing, PRIMARY) */}
      <motion.div 
        className="portrait portrait--center"
        style={{
          opacity: centerOpacity,
          y: useTransform(parallaxY, (v) => v * 0.3),
        }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.1 }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <img 
          src="/portrait-base.png" 
          alt="Core identity"
          className="portrait__img portrait__img--bw"
        />
      </motion.div>
      
      {/* TECH PORTRAIT (Right - green, profile with circuits) */}
      <motion.div 
        className="portrait portrait--tech"
        style={{
          opacity: techOpacity,
          x: useTransform(parallaxX, (v) => v * 1.2),
          y: useTransform(parallaxY, (v) => v * -0.6),
        }}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <img 
          src="/portrait-tech-right.png" 
          alt="Tech identity"
          className="portrait__img portrait__img--tech"
        />
        {/* Circuit overlay - only visible when tech dominant */}
        <CircuitOverlay opacity={circuitOpacity} />
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CIRCUIT OVERLAY — Appears when tech side is dominant
// ═══════════════════════════════════════════════════════════════════════════

function CircuitOverlay({ opacity }) {
  return (
    <motion.svg 
      className="circuit-overlay" 
      viewBox="0 0 200 400" 
      fill="none"
      style={{ opacity }}
    >
      <motion.path
        d="M60 0 C60 80, 40 120, 40 200 C40 280, 80 320, 60 400"
        stroke="rgba(0, 255, 136, 0.6)"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      <motion.path
        d="M100 0 C100 100, 120 150, 100 250 C80 350, 120 380, 100 400"
        stroke="rgba(0, 255, 136, 0.4)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, delay: 0.7 }}
      />
      <motion.path
        d="M140 0 C160 50, 140 100, 160 180 C180 260, 140 320, 160 400"
        stroke="rgba(0, 255, 136, 0.5)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, delay: 0.9 }}
      />
      {/* Nodes */}
      <motion.circle cx="60" cy="200" r="4" fill="rgba(0, 255, 136, 0.8)" 
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }} />
      <motion.circle cx="100" cy="250" r="3" fill="rgba(0, 255, 136, 0.7)" 
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2 }} />
      <motion.circle cx="160" cy="180" r="2.5" fill="rgba(0, 255, 136, 0.6)" 
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.4 }} />
    </motion.svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY TYPOGRAPHY — Morphs between states
// ═══════════════════════════════════════════════════════════════════════════

function IdentityTypography({ identity, isLoaded }) {
  // Typography opacity based on identity
  const designTextOpacity = useTransform(identity, [0, 0.3, 0.5], [1, 0.5, 0])
  const neutralTextOpacity = useTransform(identity, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0])
  const techTextOpacity = useTransform(identity, [0.5, 0.7, 1], [0, 0.5, 1])
  
  return (
    <div className="identity-typography">
      <AnimatePresence>
        {isLoaded && (
          <>
            {/* DESIGN STATE: "CREATIVE DESIGNER" */}
            <motion.div 
              className="identity-title identity-title--design"
              style={{ opacity: designTextOpacity }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <span className="title-line">CREATIVE</span>
                <span className="title-line title-line--indent">DESIGNER</span>
              </motion.h1>
              <motion.p 
                className="identity-subline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Crafting experiences with intention
              </motion.p>
            </motion.div>
            
            {/* NEUTRAL STATE: "TECH & DESIGN" */}
            <motion.div 
              className="identity-title identity-title--neutral"
              style={{ opacity: neutralTextOpacity }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <span className="title-line">TECH &</span>
                <span className="title-line title-line--indent">DESIGN</span>
              </motion.h1>
              <motion.p 
                className="identity-subline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Where systems meet emotion
              </motion.p>
            </motion.div>
            
            {/* TECH STATE: "FULL STACK DEVELOPER" */}
            <motion.div 
              className="identity-title identity-title--tech"
              style={{ opacity: techTextOpacity }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <span className="title-line">FULL STACK</span>
                <span className="title-line title-line--indent">DEVELOPER</span>
              </motion.h1>
              <motion.p 
                className="identity-subline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Building the future with code
              </motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LIVING NAVIGATION — Sidebar that responds to identity
// ═══════════════════════════════════════════════════════════════════════════

function LivingNavigation({ onHover, onLeave, isLoaded, identity }) {
  const navItems = [
    { label: 'HOME', active: true },
    { label: 'ABOUT' },
    { label: 'SERVICES' },
    { label: 'WORKS' },
    { label: 'CONTACT' },
  ]
  
  // Accent color shifts with identity
  const accentColor = useTransform(
    identity, 
    [0, 0.5, 1], 
    ['#c4703a', '#888888', '#00ff88']
  )

  return (
    <nav className="living-nav">
      <motion.div 
        className="living-nav__logo"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span className="logo-text">MP.</span>
      </motion.div>
      
      <ul className="living-nav__list">
        {navItems.map((item, i) => (
          <motion.li 
            key={item.label}
            className={`living-nav__item ${item.active ? 'active' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
          >
            <a href={`#${item.label.toLowerCase()}`} className="living-nav__link">
              {item.label}
              {item.active && (
                <motion.span 
                  className="living-nav__indicator"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </a>
          </motion.li>
        ))}
      </ul>
      
      <div className="living-nav__social">
        <SocialIcon icon="behance" onHover={onHover} onLeave={onLeave} />
        <SocialIcon icon="dribbble" onHover={onHover} onLeave={onLeave} />
        <SocialIcon icon="instagram" onHover={onHover} onLeave={onLeave} />
      </div>
      
      <motion.p 
        className="living-nav__copyright"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2 }}
      >
        Copyright ©2026 Portfolio.<br />All rights reserved.
      </motion.p>
    </nav>
  )
}

function SocialIcon({ icon, onHover, onLeave }) {
  const icons = {
    behance: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.211.958 1.911 2.021 1.911.811 0 1.556-.458 1.782-1.089h3.953zM15.97 12.5h5.012c-.116-1.089-.908-1.523-1.958-1.523-1.202 0-1.93.639-2.054 1.523zM9.456 17.83H4V5.12h5.727c2.729 0 4.427 1.225 4.427 3.79 0 1.571-.75 2.559-1.846 3.084 1.492.452 2.356 1.676 2.356 3.373 0 2.795-2.168 4.463-5.208 4.463zm-.084-8.318c0-.93-.616-1.394-1.659-1.394H7.104v2.917h.609c1.116 0 1.659-.555 1.659-1.523zm.084 4.883c0-1.025-.669-1.571-1.846-1.571H7.104v3.142h1.506c1.177 0 1.846-.546 1.846-1.571z"/>
      </svg>
    ),
    dribbble: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.424 25.424 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.245.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  }
  
  return (
    <motion.a 
      href="#" 
      className="living-nav__social-icon"
      whileHover={{ scale: 1.1 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {icons[icon]}
    </motion.a>
  )
}
