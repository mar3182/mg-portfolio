/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE LIVING PORTRAIT — Unified Portfolio Hero
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Synthesis of all design directions:
 * - Visual boldness from Award Hero (shapes, colors, cursor)
 * - Interactive depth from Split Portrait (identity-driven)
 * - Cinematic refinement from Identity Background
 * 
 * CORE PHILOSOPHY:
 * "The interface represents a mind, not a UI."
 * 
 * INTERACTION MODEL:
 * - Mouse left → Design identity reveals (warm, organic)
 * - Mouse center → Balanced dual identity
 * - Mouse right → Tech identity reveals (cool, digital)
 * - Vertical scroll → Unlocks only after horizontal commitment
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useMotionValue, useSpring, useTransform, AnimatePresence, motion } from 'framer-motion'
import './living-portrait.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Cinematic spring physics (slow, intentional)
  spring: {
    stiffness: 50,
    damping: 30,
    mass: 1.2,
  },
  // Identity zones (0 = left/design, 0.5 = center, 1 = right/tech)
  zones: {
    designFull: 0.25,    // Full design visible
    neutralStart: 0.35,  // Neutral begins
    neutralEnd: 0.65,    // Neutral ends
    techFull: 0.75,      // Full tech visible
  },
  // Parallax intensities
  parallax: {
    portrait: 25,
    shapes: 35,
    text: 15,
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitPage() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [cursorVariant, setCursorVariant] = useState('default')
  
  // Raw mouse position (0-1 normalized)
  const mouseXRaw = useMotionValue(0.5)
  const mouseYRaw = useMotionValue(0.5)
  
  // Smooth identity value with cinematic easing
  const identity = useSpring(mouseXRaw, CONFIG.spring)
  
  // Pixel-based mouse for cursor/parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 200 })
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 200 })
  
  // Parallax transforms
  const parallaxX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-CONFIG.parallax.portrait, CONFIG.parallax.portrait])
  const parallaxY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-CONFIG.parallax.portrait * 0.6, CONFIG.parallax.portrait * 0.6])
  
  // ─── PORTRAIT OPACITIES (Crossfade based on identity) ───
  const designOpacity = useTransform(identity, [0, CONFIG.zones.designFull, CONFIG.zones.neutralStart], [1, 1, 0])
  const centerOpacity = useTransform(identity, [CONFIG.zones.designFull, CONFIG.zones.neutralStart, CONFIG.zones.neutralEnd, CONFIG.zones.techFull], [0.3, 1, 1, 0.3])
  const techOpacity = useTransform(identity, [CONFIG.zones.neutralEnd, CONFIG.zones.techFull, 1], [0, 1, 1])
  
  // ─── SHAPE OPACITIES (Design shapes fade right, tech shapes fade left) ───
  const designShapesOpacity = useTransform(identity, [0, 0.5, 0.8], [1, 0.4, 0])
  const techShapesOpacity = useTransform(identity, [0.2, 0.5, 1], [0, 0.4, 1])
  
  // ─── BACKGROUND COLOR (Warm ↔ Cool drift) ───
  const bgWarmOpacity = useTransform(identity, [0, 0.5, 1], [0.5, 0.15, 0])
  const bgCoolOpacity = useTransform(identity, [0, 0.5, 1], [0, 0.15, 0.5])
  
  // Handle mouse movement
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    // Normalized position (0-1)
    const normalizedX = e.clientX / rect.width
    const normalizedY = e.clientY / rect.height
    
    mouseXRaw.set(normalizedX)
    mouseYRaw.set(normalizedY)
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }, [mouseXRaw, mouseYRaw, mouseX, mouseY])
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <motion.div 
      ref={containerRef}
      className="living-portrait"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ═══ LAYER 1: IDENTITY BACKGROUND ═══ */}
      <IdentityBackground 
        warmOpacity={bgWarmOpacity} 
        coolOpacity={bgCoolOpacity} 
      />
      
      {/* ═══ LAYER 2: GRADIENT SHAPES ═══ */}
      <GradientShapes 
        designOpacity={designShapesOpacity}
        techOpacity={techShapesOpacity}
        parallaxX={parallaxX}
        parallaxY={parallaxY}
      />
      
      {/* ═══ LAYER 3: CUSTOM CURSOR ═══ */}
      <CustomCursor 
        cursorX={cursorX} 
        cursorY={cursorY} 
        variant={cursorVariant}
      />
      
      {/* ═══ LAYER 4: NAVIGATION ═══ */}
      <Navigation 
        onHover={() => setCursorVariant('link')}
        onLeave={() => setCursorVariant('default')}
        isLoaded={isLoaded}
      />
      
      {/* ═══ MAIN CONTENT AREA ═══ */}
      <main className="living-portrait__main">
        {/* ═══ LAYER 5: THREE PORTRAITS ═══ */}
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
        
        {/* ═══ LAYER 6: TYPOGRAPHY ═══ */}
        <DynamicTypography 
          identity={identity} 
          isLoaded={isLoaded}
        />
        
        {/* ═══ LAYER 7: SOCIAL LINKS ═══ */}
        <SocialLinks 
          onHover={() => setCursorVariant('link')}
          onLeave={() => setCursorVariant('default')}
        />
      </main>
      
      {/* ═══ FOOTER ═══ */}
      <footer className="living-portrait__footer">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5 }}
        >
          Move left to explore Design · Move right to explore Technology
        </motion.p>
      </footer>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY BACKGROUND — Drifts warm ↔ cool
// ═══════════════════════════════════════════════════════════════════════════

function IdentityBackground({ warmOpacity, coolOpacity }) {
  return (
    <div className="identity-bg">
      {/* Base dark layer */}
      <div className="identity-bg__base" />
      
      {/* Light center focal area */}
      <div className="identity-bg__focal" />
      
      {/* Warm atmosphere (design) */}
      <motion.div 
        className="identity-bg__warm"
        style={{ opacity: warmOpacity }}
      />
      
      {/* Cool atmosphere (tech) */}
      <motion.div 
        className="identity-bg__cool"
        style={{ opacity: coolOpacity }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// GRADIENT SHAPES — Fade based on identity
// ═══════════════════════════════════════════════════════════════════════════

function GradientShapes({ designOpacity, techOpacity, parallaxX, parallaxY }) {
  const shapeParallaxX = useTransform(parallaxX, v => v * 1.4)
  const shapeParallaxY = useTransform(parallaxY, v => v * 1.4)
  
  return (
    <div className="gradient-shapes">
      {/* Design shapes (warm colors) - visible on left */}
      <motion.div 
        className="gradient-shapes__design"
        style={{ opacity: designOpacity }}
      >
        <motion.div 
          className="shape shape--coral"
          style={{ x: shapeParallaxX, y: shapeParallaxY }}
        />
        <motion.div 
          className="shape shape--orange"
          style={{ x: useTransform(shapeParallaxX, v => v * 0.8), y: useTransform(shapeParallaxY, v => v * 1.2) }}
        />
      </motion.div>
      
      {/* Tech shapes (cool colors) - visible on right */}
      <motion.div 
        className="gradient-shapes__tech"
        style={{ opacity: techOpacity }}
      >
        <motion.div 
          className="shape shape--purple"
          style={{ x: useTransform(shapeParallaxX, v => -v), y: shapeParallaxY }}
        />
        <motion.div 
          className="shape shape--blue"
          style={{ x: useTransform(shapeParallaxX, v => -v * 0.7), y: useTransform(shapeParallaxY, v => v * 0.9) }}
        />
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════════════════════════════════════

const cursorVariants = {
  default: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    border: '2px solid rgba(255, 255, 255, 0.6)',
  },
  link: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.7)',
  },
  view: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '2px solid rgba(255, 255, 255, 0.4)',
  },
}

function CustomCursor({ cursorX, cursorY, variant = 'default' }) {
  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        variants={cursorVariants}
        animate={variant}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {variant === 'view' && (
          <motion.span
            className="cursor-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            View
          </motion.span>
        )}
      </motion.div>
      <motion.div
        className="cursor-dot"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: variant === 'default' ? 1 : 0,
          opacity: variant === 'default' ? 1 : 0,
        }}
      />
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION — Dark sidebar
// ═══════════════════════════════════════════════════════════════════════════

function Navigation({ onHover, onLeave, isLoaded }) {
  const navItems = ['Home', 'About', 'Work', 'Contact']
  
  return (
    <nav className="nav-sidebar">
      <div className="nav-sidebar__logo">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          MP.
        </motion.span>
      </div>
      
      <ul className="nav-sidebar__list">
        {navItems.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <a 
              href={`#${item.toLowerCase()}`}
              className={`nav-link ${i === 0 ? 'nav-link--active' : ''}`}
              onMouseEnter={onHover}
              onMouseLeave={onLeave}
            >
              {item}
              {i === 0 && <span className="nav-indicator" />}
            </a>
          </motion.li>
        ))}
      </ul>
      
      <div className="nav-sidebar__social">
        {['Be', 'Dr', 'In'].map((icon, i) => (
          <motion.a
            key={icon}
            href="#"
            className="nav-social-icon"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            {icon}
          </motion.a>
        ))}
      </div>
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PORTRAIT TRIAD — Three portraits with identity-based crossfade
// ═══════════════════════════════════════════════════════════════════════════

function PortraitTriad({ designOpacity, centerOpacity, techOpacity, parallaxX, parallaxY, identity, onHover, onLeave }) {
  // Different parallax intensities per portrait
  const designParallaxX = useTransform(parallaxX, v => v * -1.5)
  const designParallaxY = useTransform(parallaxY, v => v * 0.8)
  const techParallaxX = useTransform(parallaxX, v => v * 1.3)
  const techParallaxY = useTransform(parallaxY, v => v * -0.6)
  const centerParallaxY = useTransform(parallaxY, v => v * 0.3)
  
  // Circuit patterns visibility (only when leaning tech)
  const circuitOpacity = useTransform(identity, [0.5, 0.75, 1], [0, 0.5, 0.8])
  
  return (
    <div className="portrait-triad">
      {/* LEFT: Design Portrait */}
      <motion.div 
        className="portrait portrait--design"
        style={{
          opacity: designOpacity,
          x: designParallaxX,
          y: designParallaxY,
        }}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
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
      
      {/* CENTER: Main B&W Portrait */}
      <motion.div 
        className="portrait portrait--center"
        style={{
          opacity: centerOpacity,
          y: centerParallaxY,
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
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
      
      {/* RIGHT: Tech Portrait */}
      <motion.div 
        className="portrait portrait--tech"
        style={{
          opacity: techOpacity,
          x: techParallaxX,
          y: techParallaxY,
        }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <img 
          src="/portrait-tech-right.png" 
          alt="Tech identity"
          className="portrait__img portrait__img--tech"
        />
        {/* Circuit overlay - fades in when tech-leaning */}
        <motion.svg 
          className="circuit-overlay"
          style={{ opacity: circuitOpacity }}
          viewBox="0 0 200 400"
        >
          <path d="M60 0 C60 80, 40 120, 40 200 C40 280, 80 320, 60 400" stroke="rgba(0,255,136,0.5)" strokeWidth="1" fill="none" />
          <path d="M100 0 C100 100, 120 150, 100 250 C80 350, 120 380, 100 400" stroke="rgba(0,255,136,0.3)" strokeWidth="1" fill="none" />
          <path d="M140 0 C160 50, 140 100, 160 180 C180 260, 140 320, 160 400" stroke="rgba(0,255,136,0.4)" strokeWidth="1" fill="none" />
          <circle cx="60" cy="200" r="3" fill="rgba(0,255,136,0.7)" />
          <circle cx="100" cy="250" r="2.5" fill="rgba(0,255,136,0.6)" />
          <circle cx="160" cy="180" r="2" fill="rgba(0,255,136,0.5)" />
        </motion.svg>
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DYNAMIC TYPOGRAPHY — Morphs based on identity
// ═══════════════════════════════════════════════════════════════════════════

function DynamicTypography({ identity, isLoaded }) {
  // Design text opacity (visible on left)
  const designTextOpacity = useTransform(identity, [0, 0.3, 0.5], [1, 0.5, 0])
  // Tech text opacity (visible on right)
  const techTextOpacity = useTransform(identity, [0.5, 0.7, 1], [0, 0.5, 1])
  // Center text (always visible, fades at extremes)
  const centerTextOpacity = useTransform(identity, [0, 0.2, 0.5, 0.8, 1], [0.3, 0.8, 1, 0.8, 0.3])
  
  return (
    <div className="typography">
      <AnimatePresence>
        {isLoaded && (
          <>
            {/* DESIGN label - appears on left */}
            <motion.div 
              className="typography__design"
              style={{ opacity: designTextOpacity }}
            >
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                CREATIVE<br/>DESIGNER
              </motion.h2>
            </motion.div>
            
            {/* CENTER headline - always present */}
            <motion.div 
              className="typography__center"
              style={{ opacity: centerTextOpacity }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="title-line">TECH &</span>
                <span className="title-line title-line--offset">DESIGN</span>
              </motion.h1>
              <motion.p
                className="subline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                Where systems meet emotion
              </motion.p>
            </motion.div>
            
            {/* TECH label - appears on right */}
            <motion.div 
              className="typography__tech"
              style={{ opacity: techTextOpacity }}
            >
              <motion.h2
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                FULL STACK<br/>DEVELOPER
              </motion.h2>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL LINKS
// ═══════════════════════════════════════════════════════════════════════════

function SocialLinks({ onHover, onLeave }) {
  const links = [
    { icon: '○', label: 'Instagram' },
    { icon: '◎', label: 'Dribbble' },
    { icon: '▢', label: 'Twitter' },
  ]
  
  return (
    <div className="social-links">
      {links.map((link, i) => (
        <motion.a
          key={link.label}
          href="#"
          className="social-link"
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 + i * 0.1 }}
          aria-label={link.label}
        >
          {link.icon}
        </motion.a>
      ))}
      <motion.div 
        className="social-line"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      />
    </div>
  )
}
