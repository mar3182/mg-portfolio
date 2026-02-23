/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LIVING PORTRAIT V2 — Award-Winning Dual Identity Hero
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * A cinematic portfolio hero that immerses visitors into two worlds:
 * - DESIGN: Organic, playful, Frida Kahlo-inspired, warm Latin roots
 * - TECH: Futuristic, systematic, matrix-inspired, precise digital
 * 
 * NAVIGATION CONCEPT: The "T" Shape
 * - Horizontal axis: Identity spectrum (design ↔ tech)
 * - Vertical axis: Depth exploration (scroll to dive deeper)
 * 
 * INTERACTION:
 * - Mouse left → Design world reveals (warm/organic)
 * - Mouse center → Balanced state, T-navigation visible
 * - Mouse right → Tech world reveals (cool/digital)
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useMotionValue, useSpring, useTransform, AnimatePresence, motion } from 'framer-motion'
import OrganicWorld from './OrganicWorld'
import MatrixWorld from './MatrixWorld'
import './living-portrait-v2.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  spring: {
    // Slower, more cinematic feel
    stiffness: 40,
    damping: 25,
    mass: 1.5,
  },
  parallax: {
    portrait: 30,
    worlds: 40,
  },
  portraits: {
    base: '/portrait-split.png',
    design: '/portrait-design-left.png',
    tech: '/portrait-tech-right.png',
  },
  colors: {
    design: '#ff8c42',
    tech: '#1be7ff',
    neutral: '#ffffff',
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitV2() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [cursorVariant, setCursorVariant] = useState('default')
  
  // Raw mouse position (0-1 normalized)
  const mouseXRaw = useMotionValue(0.5)
  const mouseYRaw = useMotionValue(0.5)
  
  // Smooth identity value with cinematic easing
  const identity = useSpring(mouseXRaw, CONFIG.spring)
  
  // Pixel-based mouse for cursor/parallax
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 960)
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 540)
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 200 })
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 200 })
  
  // Parallax transforms
  const parallaxX = useTransform(
    mouseX, 
    [0, typeof window !== 'undefined' ? window.innerWidth : 1920], 
    [-CONFIG.parallax.portrait, CONFIG.parallax.portrait]
  )
  const parallaxY = useTransform(
    mouseY, 
    [0, typeof window !== 'undefined' ? window.innerHeight : 1080], 
    [-CONFIG.parallax.portrait * 0.5, CONFIG.parallax.portrait * 0.5]
  )
  
  // ─── SCANNER REVEAL CLIP PATHS ───
  const designClipPath = useTransform(identity, (pos) => {
    if (pos >= 0.48) return 'inset(0 100% 0 0)'
    const revealPercent = ((0.48 - pos) / 0.48) * 100
    return `inset(0 ${100 - revealPercent}% 0 0)`
  })
  
  const techClipPath = useTransform(identity, (pos) => {
    if (pos <= 0.52) return 'inset(0 0 0 100%)'
    const revealPercent = ((pos - 0.52) / 0.48) * 100
    return `inset(0 0 0 ${100 - revealPercent}%)`
  })
  
  // Layer opacities (hidden at center)
  const designLayerOpacity = useTransform(identity, [0, 0.4, 0.5], [1, 1, 0])
  const techLayerOpacity = useTransform(identity, [0.5, 0.6, 1], [0, 1, 1])
  
  // ─── BACKGROUND COLORS ───
  const bgWarmOpacity = useTransform(identity, [0, 0.5, 1], [0.6, 0.1, 0])
  const bgCoolOpacity = useTransform(identity, [0, 0.5, 1], [0, 0.1, 0.6])
  
  // ─── SCANNER LINE ───
  const scannerX = useTransform(identity, [0, 1], ['0%', '100%'])
  const scannerColor = useTransform(
    identity,
    [0, 0.4, 0.5, 0.6, 1],
    [CONFIG.colors.design, CONFIG.colors.design, CONFIG.colors.neutral, CONFIG.colors.tech, CONFIG.colors.tech]
  )
  const scannerOpacity = useTransform(identity, [0, 0.15, 0.5, 0.85, 1], [0.4, 0.9, 1, 0.9, 0.4])
  
  // ─── T-NAVIGATION (visible at center) ───
  const tNavOpacity = useTransform(identity, [0.3, 0.45, 0.55, 0.7], [0, 1, 1, 0])
  const tVerticalScale = useTransform(identity, [0.4, 0.5, 0.6], [0, 1, 0])
  
  // Handle mouse movement
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const normalizedX = e.clientX / rect.width
    const normalizedY = e.clientY / rect.height
    
    mouseXRaw.set(normalizedX)
    mouseYRaw.set(normalizedY)
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }, [mouseXRaw, mouseYRaw, mouseX, mouseY])
  
  const handleMouseLeave = useCallback(() => {
    const current = mouseXRaw.get()
    if (current < 0.25) {
      mouseXRaw.set(0)
    } else if (current > 0.75) {
      mouseXRaw.set(1)
    } else {
      mouseXRaw.set(0.5)
    }
  }, [mouseXRaw])
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <motion.div 
      ref={containerRef}
      className="living-portrait-v2"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* ═══ LAYER 1: DEEP BACKGROUND ═══ */}
      <IdentityBackground 
        warmOpacity={bgWarmOpacity} 
        coolOpacity={bgCoolOpacity} 
      />
      
      {/* ═══ LAYER 2: ORGANIC WORLD (Design Side) ═══ */}
      <OrganicWorld 
        identity={identity}
        parallaxX={parallaxX}
        parallaxY={parallaxY}
      />
      
      {/* ═══ LAYER 3: MATRIX WORLD (Tech Side) ═══ */}
      <MatrixWorld 
        identity={identity}
        parallaxX={parallaxX}
        parallaxY={parallaxY}
      />
      
      {/* ═══ LAYER 4: CUSTOM CURSOR ═══ */}
      <CustomCursor 
        cursorX={cursorX} 
        cursorY={cursorY} 
        variant={cursorVariant}
        identity={identity}
      />
      
      {/* ═══ LAYER 5: NAVIGATION ═══ */}
      <Navigation 
        onHover={() => setCursorVariant('link')}
        onLeave={() => setCursorVariant('default')}
      />
      
      {/* ═══ MAIN CONTENT AREA ═══ */}
      <main className="living-portrait-v2__main">
        {/* ═══ CENTERED PORTRAIT ═══ */}
        <ScannerPortrait
          baseImage={CONFIG.portraits.base}
          designImage={CONFIG.portraits.design}
          techImage={CONFIG.portraits.tech}
          designClipPath={designClipPath}
          techClipPath={techClipPath}
          designOpacity={designLayerOpacity}
          techOpacity={techLayerOpacity}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
          onHover={() => setCursorVariant('view')}
          onLeave={() => setCursorVariant('default')}
        />
        
        {/* ═══ SCANNER LINE ═══ */}
        <ScannerLine 
          scannerX={scannerX}
          scannerColor={scannerColor}
          scannerOpacity={scannerOpacity}
        />
        
        {/* ═══ T-NAVIGATION INDICATOR ═══ */}
        <TNavigation 
          opacity={tNavOpacity}
          verticalScale={tVerticalScale}
        />
        
        {/* ═══ TYPOGRAPHY ═══ */}
        <DynamicTypography 
          identity={identity} 
          isLoaded={isLoaded}
        />
        
        {/* ═══ SOCIAL LINKS ═══ */}
        <SocialLinks 
          onHover={() => setCursorVariant('link')}
          onLeave={() => setCursorVariant('default')}
        />
      </main>
      
      {/* ═══ FOOTER HINT ═══ */}
      <footer className="living-portrait-v2__footer">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2 }}
        >
          ← Design · Explore the duality · Tech →
        </motion.p>
      </footer>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY BACKGROUND — Base atmosphere layer
// ═══════════════════════════════════════════════════════════════════════════

const IdentityBackground = memo(function IdentityBackground({ warmOpacity, coolOpacity }) {
  return (
    <div className="identity-bg">
      <div className="identity-bg__base" />
      <motion.div className="identity-bg__warm" style={{ opacity: warmOpacity }} />
      <motion.div className="identity-bg__cool" style={{ opacity: coolOpacity }} />
      <div className="identity-bg__vignette" />
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM CURSOR — Identity-aware cursor
// ═══════════════════════════════════════════════════════════════════════════

const cursorVariants = {
  default: {
    width: 24,
    height: 24,
    backgroundColor: 'transparent',
    border: '2px solid rgba(255, 255, 255, 0.5)',
  },
  link: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '2px solid rgba(255, 255, 255, 0.6)',
  },
  view: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
  },
}

const CustomCursor = memo(function CustomCursor({ cursorX, cursorY, variant = 'default', identity }) {
  const cursorColor = useTransform(
    identity,
    [0, 0.5, 1],
    ['rgba(255, 140, 66, 0.8)', 'rgba(255, 255, 255, 0.6)', 'rgba(27, 231, 255, 0.8)']
  )
  
  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          borderColor: cursorColor,
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
            Explore
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
          backgroundColor: cursorColor,
        }}
        animate={{
          scale: variant === 'default' ? 1 : 0,
          opacity: variant === 'default' ? 1 : 0,
        }}
      />
    </>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION — Vertical sidebar
// ═══════════════════════════════════════════════════════════════════════════

const Navigation = memo(function Navigation({ onHover, onLeave }) {
  const navItems = ['Home', 'About', 'Work', 'Contact']
  
  return (
    <nav className="nav-sidebar">
      <motion.div 
        className="nav-sidebar__logo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        MG.
      </motion.div>
      
      <ul className="nav-sidebar__list">
        {navItems.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
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
    </nav>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// SCANNER PORTRAIT — The centered reveal portrait
// ═══════════════════════════════════════════════════════════════════════════

const ScannerPortrait = memo(function ScannerPortrait({ 
  baseImage, 
  designImage, 
  techImage, 
  designClipPath, 
  techClipPath,
  designOpacity,
  techOpacity,
  parallaxX, 
  parallaxY,
  onHover,
  onLeave,
}) {
  const portraitX = useTransform(parallaxX, v => v * 0.4)
  const portraitY = useTransform(parallaxY, v => v * 0.3)
  
  return (
    <motion.div 
      className="scanner-portrait"
      style={{ x: portraitX, y: portraitY }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="scanner-portrait__container">
        {/* Base portrait (always visible) */}
        <motion.img
          src={baseImage}
          alt="Portrait"
          className="scanner-portrait__img scanner-portrait__img--base"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          draggable={false}
        />
        
        {/* Design portrait (revealed from left) */}
        <motion.img
          src={designImage}
          alt=""
          className="scanner-portrait__img scanner-portrait__img--design"
          style={{ clipPath: designClipPath, opacity: designOpacity }}
          draggable={false}
        />
        
        {/* Tech portrait (revealed from right) */}
        <motion.img
          src={techImage}
          alt=""
          className="scanner-portrait__img scanner-portrait__img--tech"
          style={{ clipPath: techClipPath, opacity: techOpacity }}
          draggable={false}
        />
        
        {/* Soft edge mask overlay */}
        <div className="scanner-portrait__edge-mask" />
      </div>
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// SCANNER LINE — Visual identity indicator
// ═══════════════════════════════════════════════════════════════════════════

const ScannerLine = memo(function ScannerLine({ scannerX, scannerColor, scannerOpacity }) {
  const glowShadow = useTransform(scannerColor, c => `0 0 30px ${c}, 0 0 60px ${c}40`)
  const headGlow = useTransform(scannerColor, c => `0 0 20px ${c}, 0 0 40px ${c}`)
  
  return (
    <motion.div 
      className="scanner-line"
      style={{ left: scannerX, opacity: scannerOpacity }}
    >
      <motion.div 
        className="scanner-line__beam"
        style={{ backgroundColor: scannerColor, boxShadow: glowShadow }}
      />
      <motion.div 
        className="scanner-line__head scanner-line__head--top"
        style={{ backgroundColor: scannerColor, boxShadow: headGlow }}
      />
      <motion.div 
        className="scanner-line__head scanner-line__head--bottom"
        style={{ backgroundColor: scannerColor, boxShadow: headGlow }}
      />
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// T-NAVIGATION — The "T" concept visual
// ═══════════════════════════════════════════════════════════════════════════

const TNavigation = memo(function TNavigation({ opacity, verticalScale }) {
  return (
    <motion.div 
      className="t-navigation"
      style={{ opacity }}
    >
      {/* Vertical stem of the T */}
      <motion.div 
        className="t-navigation__vertical"
        style={{ scaleY: verticalScale }}
      />
      
      {/* Hint text */}
      <motion.div 
        className="t-navigation__hint"
        style={{ opacity: verticalScale }}
      >
        <span className="t-navigation__arrow">↓</span>
        <span className="t-navigation__text">Scroll to dive deeper</span>
      </motion.div>
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// DYNAMIC TYPOGRAPHY — Identity-driven text
// ═══════════════════════════════════════════════════════════════════════════

const DynamicTypography = memo(function DynamicTypography({ identity, isLoaded }) {
  // Show design text only when committed to design side
  const designTextOpacity = useTransform(identity, [0, 0.2, 0.4], [1, 0.8, 0])
  // Show tech text only when committed to tech side  
  const techTextOpacity = useTransform(identity, [0.6, 0.8, 1], [0, 0.8, 1])
  // Center title visible in middle zone
  const centerTextOpacity = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], [0.3, 0.8, 1, 0.8, 0.3])
  
  return (
    <div className="typography">
      <AnimatePresence>
        {isLoaded && (
          <>
            {/* Design side label */}
            <motion.div 
              className="typography__design"
              style={{ opacity: designTextOpacity }}
            >
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                <span className="text-accent">Creative</span>
                <br/>Designer
              </motion.h2>
              <motion.p
                className="typography__subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1.2 }}
              >
                Where emotion meets expression
              </motion.p>
            </motion.div>
            
            {/* Center title */}
            <motion.div 
              className="typography__center"
              style={{ opacity: centerTextOpacity }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <span className="title-line">Tech</span>
                <span className="title-ampersand">&</span>
                <span className="title-line">Design</span>
              </motion.h1>
              <motion.p
                className="subline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1.2 }}
              >
                Where systems meet soul
              </motion.p>
            </motion.div>
            
            {/* Tech side label */}
            <motion.div 
              className="typography__tech"
              style={{ opacity: techTextOpacity }}
            >
              <motion.h2
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                <span className="text-accent">Full Stack</span>
                <br/>Developer
              </motion.h2>
              <motion.p
                className="typography__subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1.2 }}
              >
                Where logic meets innovation
              </motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL LINKS
// ═══════════════════════════════════════════════════════════════════════════

const SocialLinks = memo(function SocialLinks({ onHover, onLeave }) {
  const links = [
    { icon: '○', label: 'Instagram' },
    { icon: '◎', label: 'Dribbble' },
    { icon: '▢', label: 'LinkedIn' },
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
          transition={{ delay: 1.5 + i * 0.1 }}
          aria-label={link.label}
        >
          {link.icon}
        </motion.a>
      ))}
      <motion.div 
        className="social-line"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      />
    </div>
  )
})
