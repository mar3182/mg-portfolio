/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LIVING PORTRAIT V2 — Scanner Reveal Edition
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Combines:
 * - Living Portrait design (gradients, cursor, nav, typography)
 * - T-Scanner reveal mechanic (base portrait with design/tech layers revealed)
 * 
 * INTERACTION:
 * - Mouse left → Design layer reveals over base portrait (warm)
 * - Mouse center → Base portrait visible
 * - Mouse right → Tech layer reveals over base portrait (cool)
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useMotionValue, useSpring, useTransform, AnimatePresence, motion } from 'framer-motion'
import './living-portrait-v2.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  spring: {
    stiffness: 50,
    damping: 30,
    mass: 1.2,
  },
  parallax: {
    portrait: 25,
    shapes: 35,
  },
  portraits: {
    base: '/portrait-split.png',
    design: '/portrait-desing2.png',
    tech: '/portrait-tech.png',
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
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 200 })
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 200 })
  
  // Parallax transforms
  const parallaxX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-CONFIG.parallax.portrait, CONFIG.parallax.portrait])
  const parallaxY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-CONFIG.parallax.portrait * 0.6, CONFIG.parallax.portrait * 0.6])
  
  // ─── SCANNER REVEAL CLIP PATHS ───
  // Design reveals from left when mouse is left of center
  const designClipPath = useTransform(identity, (pos) => {
    if (pos >= 0.5) return 'inset(0 100% 0 0)' // Hidden
    const revealPercent = ((0.5 - pos) / 0.5) * 100
    return `inset(0 ${100 - revealPercent}% 0 0)`
  })
  
  // Tech reveals from right when mouse is right of center
  const techClipPath = useTransform(identity, (pos) => {
    if (pos <= 0.5) return 'inset(0 0 0 100%)' // Hidden
    const revealPercent = ((pos - 0.5) / 0.5) * 100
    return `inset(0 0 0 ${100 - revealPercent}%)`
  })
  
  // ─── SHAPE OPACITIES ───
  const designShapesOpacity = useTransform(identity, [0, 0.5, 0.8], [1, 0.4, 0])
  const techShapesOpacity = useTransform(identity, [0.2, 0.5, 1], [0, 0.4, 1])
  
  // ─── BACKGROUND COLOR ───
  const bgWarmOpacity = useTransform(identity, [0, 0.5, 1], [0.5, 0.15, 0])
  const bgCoolOpacity = useTransform(identity, [0, 0.5, 1], [0, 0.15, 0.5])
  
  // ─── SCANNER LINE ───
  const scannerX = useTransform(identity, [0, 1], ['0%', '100%'])
  const scannerColor = useTransform(
    identity,
    [0, 0.4, 0.5, 0.6, 1],
    ['#ff8c42', '#ff8c42', '#ffffff', '#1be7ff', '#1be7ff']
  )
  const scannerOpacity = useTransform(
    identity,
    [0, 0.15, 0.5, 0.85, 1],
    [0.3, 0.8, 1, 0.8, 0.3]
  )
  
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
    // Snap to nearest position
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
      />
      
      {/* ═══ MAIN CONTENT AREA ═══ */}
      <main className="living-portrait-v2__main">
        {/* ═══ LAYER 5: SCANNER PORTRAIT ═══ */}
        <ScannerPortrait
          baseImage={CONFIG.portraits.base}
          designImage={CONFIG.portraits.design}
          techImage={CONFIG.portraits.tech}
          designClipPath={designClipPath}
          techClipPath={techClipPath}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
          onHover={() => setCursorVariant('view')}
          onLeave={() => setCursorVariant('default')}
        />
        
        {/* ═══ LAYER 6: SCANNER LINE ═══ */}
        <ScannerLine 
          scannerX={scannerX}
          scannerColor={scannerColor}
          scannerOpacity={scannerOpacity}
        />
        
        {/* ═══ LAYER 7: TYPOGRAPHY ═══ */}
        <DynamicTypography 
          identity={identity} 
          isLoaded={isLoaded}
        />
        
        {/* ═══ LAYER 8: SOCIAL LINKS ═══ */}
        <SocialLinks 
          onHover={() => setCursorVariant('link')}
          onLeave={() => setCursorVariant('default')}
        />
      </main>
      
      {/* ═══ FOOTER ═══ */}
      <footer className="living-portrait-v2__footer">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5 }}
        >
          ← Move to reveal Design · Move to reveal Technology →
        </motion.p>
      </footer>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════

function IdentityBackground({ warmOpacity, coolOpacity }) {
  return (
    <div className="identity-bg">
      <div className="identity-bg__base" />
      <div className="identity-bg__focal" />
      <motion.div className="identity-bg__warm" style={{ opacity: warmOpacity }} />
      <motion.div className="identity-bg__cool" style={{ opacity: coolOpacity }} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// GRADIENT SHAPES
// ═══════════════════════════════════════════════════════════════════════════

function GradientShapes({ designOpacity, techOpacity, parallaxX, parallaxY }) {
  const shapeParallaxX = useTransform(parallaxX, v => v * 1.4)
  const shapeParallaxY = useTransform(parallaxY, v => v * 1.4)
  
  return (
    <div className="gradient-shapes">
      <motion.div className="gradient-shapes__design" style={{ opacity: designOpacity }}>
        <motion.div 
          className="shape shape--coral"
          style={{ x: shapeParallaxX, y: shapeParallaxY }}
        />
        <motion.div 
          className="shape shape--orange"
          style={{ x: useTransform(shapeParallaxX, v => v * 0.8), y: useTransform(shapeParallaxY, v => v * 1.2) }}
        />
      </motion.div>
      
      <motion.div className="gradient-shapes__tech" style={{ opacity: techOpacity }}>
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
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

function Navigation({ onHover, onLeave }) {
  const navItems = ['Home', 'About', 'Work', 'Contact']
  
  return (
    <nav className="nav-sidebar">
      <div className="nav-sidebar__logo">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          MG.
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
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SCANNER PORTRAIT — Base + revealed layers
// ═══════════════════════════════════════════════════════════════════════════

function ScannerPortrait({ 
  baseImage, 
  designImage, 
  techImage, 
  designClipPath, 
  techClipPath, 
  parallaxX, 
  parallaxY,
  onHover,
  onLeave,
}) {
  const portraitX = useTransform(parallaxX, v => v * 0.5)
  const portraitY = useTransform(parallaxY, v => v * 0.3)
  
  return (
    <motion.div 
      className="scanner-portrait"
      style={{ x: portraitX, y: portraitY }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Soft elliptical mask container */}
      <div className="scanner-portrait__mask">
        {/* Base portrait (always visible) */}
        <motion.img
          src={baseImage}
          alt=""
          className="scanner-portrait__img scanner-portrait__img--base"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          draggable={false}
        />
        
        {/* Design portrait (revealed from left) */}
        <motion.img
          src={designImage}
          alt=""
          className="scanner-portrait__img scanner-portrait__img--design"
          style={{ clipPath: designClipPath }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          draggable={false}
        />
        
        {/* Tech portrait (revealed from right) */}
        <motion.img
          src={techImage}
          alt=""
          className="scanner-portrait__img scanner-portrait__img--tech"
          style={{ clipPath: techClipPath }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          draggable={false}
        />
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SCANNER LINE — Visual indicator of reveal position
// ═══════════════════════════════════════════════════════════════════════════

function ScannerLine({ scannerX, scannerColor, scannerOpacity }) {
  return (
    <motion.div 
      className="scanner-line"
      style={{
        left: scannerX,
        opacity: scannerOpacity,
      }}
    >
      <motion.div 
        className="scanner-line__beam"
        style={{
          backgroundColor: scannerColor,
          boxShadow: useTransform(scannerColor, c => `0 0 30px ${c}, 0 0 60px ${c}`),
        }}
      />
      <motion.div 
        className="scanner-line__head"
        style={{
          backgroundColor: scannerColor,
          boxShadow: useTransform(scannerColor, c => `0 0 20px ${c}`),
        }}
      />
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DYNAMIC TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════════════

function DynamicTypography({ identity, isLoaded }) {
  const designTextOpacity = useTransform(identity, [0, 0.3, 0.5], [1, 0.5, 0])
  const techTextOpacity = useTransform(identity, [0.5, 0.7, 1], [0, 0.5, 1])
  const centerTextOpacity = useTransform(identity, [0, 0.2, 0.5, 0.8, 1], [0.3, 0.8, 1, 0.8, 0.3])
  
  return (
    <div className="typography">
      <AnimatePresence>
        {isLoaded && (
          <>
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
