/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE LIVING PORTRAIT V4 — Hybrid Edition
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Combines the best of V1 (clean, professional) and V3 (explorative, dynamic):
 * 
 * DEFAULT STATE (center):
 * - Clean, elegant design with subtle gradients
 * - "Design + Tech" with animated "+" symbol
 * - Professional sidebar navigation
 * - Portraits with subtle crossfade
 * 
 * EXPLORATION STATE (extremes):
 * - Video backgrounds fade in as reward
 * - Words split apart dramatically  
 * - Projects become visible
 * - Full immersion in Design or Tech world
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useMotionValue, useSpring, useTransform, AnimatePresence, motion } from 'framer-motion'
import './living-portrait-v4.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Cinematic spring physics
  spring: {
    stiffness: 50,
    damping: 30,
    mass: 1.2,
  },
  // Fast spring for cursor
  cursorSpring: {
    damping: 25,
    stiffness: 200,
  },
  // Identity zones
  zones: {
    designFull: 0.15,    // Full design immersion
    designStart: 0.3,    // Design world begins
    neutralStart: 0.4,   // Neutral zone
    neutralEnd: 0.6,     // Neutral zone ends
    techStart: 0.7,      // Tech world begins
    techFull: 0.85,      // Full tech immersion
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitV4() {
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
  const cursorX = useSpring(mouseX, CONFIG.cursorSpring)
  const cursorY = useSpring(mouseY, CONFIG.cursorSpring)
  
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
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <motion.div 
      ref={containerRef}
      className="living-portrait-v4"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ═══ LAYER 1: BASE GRADIENT BACKGROUND ═══ */}
      <GradientBackground identity={identity} />
      
      {/* ═══ LAYER 2: VIDEO BACKGROUNDS (fade in at extremes) ═══ */}
      <VideoBackgrounds identity={identity} />
      
      {/* ═══ LAYER 3: GRADIENT SHAPES ═══ */}
      <GradientShapes identity={identity} />
      
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
        identity={identity}
      />
      
      {/* ═══ MAIN CONTENT ═══ */}
      <main className="lpv4-main">
        {/* ═══ LAYER 6: ANIMATED TYPOGRAPHY ═══ */}
        <AnimatedTitle identity={identity} isLoaded={isLoaded} />
        
        {/* ═══ LAYER 7: EXPLORATION ITEMS (visible at extremes) ═══ */}
        <ExplorationItems identity={identity} />
      </main>
      
      {/* ═══ LAYER 9: SOCIAL LINKS ═══ */}
      <SocialLinks 
        onHover={() => setCursorVariant('link')}
        onLeave={() => setCursorVariant('default')}
      />
      
      {/* ═══ FOOTER HINT ═══ */}
      <Footer identity={identity} />
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// GRADIENT BACKGROUND — Clean base with subtle identity tint
// ═══════════════════════════════════════════════════════════════════════════

const GradientBackground = memo(function GradientBackground({ identity }) {
  // Both warm and cool visible at center for beautiful ambient lighting
  const warmOpacity = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], [0.6, 0.4, 0.25, 0.1, 0])
  const coolOpacity = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], [0, 0.1, 0.25, 0.4, 0.6])
  
  return (
    <div className="lpv4-bg">
      <div className="lpv4-bg__base" />
      <div className="lpv4-bg__focal" />
      <div className="lpv4-bg__ambient" />
      <motion.div className="lpv4-bg__warm" style={{ opacity: warmOpacity }} />
      <motion.div className="lpv4-bg__cool" style={{ opacity: coolOpacity }} />
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// VIDEO BACKGROUNDS — Fade in only at exploration extremes
// ═══════════════════════════════════════════════════════════════════════════

const VideoBackgrounds = memo(function VideoBackgrounds({ identity }) {
  // Videos only appear when deeply exploring (past 0.3 or 0.7)
  const designVideoOpacity = useTransform(
    identity, 
    [0, CONFIG.zones.designFull, CONFIG.zones.designStart, CONFIG.zones.neutralStart], 
    [0.6, 0.4, 0.15, 0]
  )
  const techVideoOpacity = useTransform(
    identity, 
    [CONFIG.zones.neutralEnd, CONFIG.zones.techStart, CONFIG.zones.techFull, 1], 
    [0, 0.15, 0.4, 0.6]
  )
  
  return (
    <div className="lpv4-videos">
      {/* Design Video (Organic/Nature) */}
      <motion.div className="lpv4-video lpv4-video--design" style={{ opacity: designVideoOpacity }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/video-poster-design.jpg"
        >
          <source src="/video (1).webm" type="video/webm" />
          <source src="/video (1).mp4" type="video/mp4" />
        </video>
        <div className="lpv4-video__overlay lpv4-video__overlay--warm" />
      </motion.div>
      
      {/* Tech Video (Matrix/Digital) */}
      <motion.div className="lpv4-video lpv4-video--tech" style={{ opacity: techVideoOpacity }}>
        <video
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/tech-background-video.mp4" type="video/mp4" />
        </video>
        <div className="lpv4-video__overlay lpv4-video__overlay--cool" />
      </motion.div>
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// GRADIENT SHAPES — Subtle ambient blurs
// ═══════════════════════════════════════════════════════════════════════════

const GradientShapes = memo(function GradientShapes({ identity }) {
  // Both sides visible at center for rich ambient lighting
  const designShapesOpacity = useTransform(identity, [0, 0.4, 0.5, 0.7, 1], [0.7, 0.5, 0.4, 0.15, 0])
  const techShapesOpacity = useTransform(identity, [0, 0.3, 0.5, 0.6, 1], [0, 0.15, 0.4, 0.5, 0.7])
  
  return (
    <div className="lpv4-shapes">
      <motion.div className="lpv4-shapes__design" style={{ opacity: designShapesOpacity }}>
        <div className="lpv4-shape lpv4-shape--coral" />
        <div className="lpv4-shape lpv4-shape--orange" />
        <div className="lpv4-shape lpv4-shape--peach" />
      </motion.div>
      <motion.div className="lpv4-shapes__tech" style={{ opacity: techShapesOpacity }}>
        <div className="lpv4-shape lpv4-shape--purple" />
        <div className="lpv4-shape lpv4-shape--cyan" />
        <div className="lpv4-shape lpv4-shape--blue" />
      </motion.div>
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM CURSOR — Changes based on context
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

const CustomCursor = memo(function CustomCursor({ cursorX, cursorY, variant = 'default' }) {
  return (
    <>
      <motion.div
        className="lpv4-cursor"
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
            className="lpv4-cursor__text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            View
          </motion.span>
        )}
      </motion.div>
      <motion.div
        className="lpv4-cursor-dot"
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
})

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION — Clean sidebar from V1
// ═══════════════════════════════════════════════════════════════════════════

const Navigation = memo(function Navigation({ onHover, onLeave, identity }) {
  const navItems = ['Home', 'About', 'Work', 'Contact']
  
  // Nav fades slightly when deep in exploration
  const navOpacity = useTransform(identity, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])
  
  return (
    <motion.nav className="lpv4-nav" style={{ opacity: navOpacity }}>
      <div className="lpv4-nav__logo">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          MP.
        </motion.span>
      </div>
      
      <ul className="lpv4-nav__list">
        {navItems.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <a 
              href={`#${item.toLowerCase()}`}
              className={`lpv4-nav__link ${i === 0 ? 'lpv4-nav__link--active' : ''}`}
              onMouseEnter={onHover}
              onMouseLeave={onLeave}
            >
              {item}
              {i === 0 && <span className="lpv4-nav__indicator" />}
            </a>
          </motion.li>
        ))}
      </ul>
      
      <div className="lpv4-nav__social">
        {['Be', 'Dr', 'In'].map((icon, i) => (
          <motion.a
            key={icon}
            href="#"
            className="lpv4-nav__social-icon"
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
    </motion.nav>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// PORTRAIT — Single centered portrait with identity-based filter
// ═══════════════════════════════════════════════════════════════════════════

const Portrait = memo(function Portrait({ identity, onHover, onLeave }) {
  // Portrait filter shifts warm ↔ cool
  const hueRotate = useTransform(identity, [0, 0.5, 1], [-15, 0, 30])
  const saturate = useTransform(identity, [0, 0.5, 1], [1.2, 0.9, 0.8])
  
  return (
    <motion.div 
      className="lpv4-portrait"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <motion.div 
        className="lpv4-portrait__frame"
        style={{
          filter: useTransform(
            [hueRotate, saturate],
            ([h, s]) => `hue-rotate(${h}deg) saturate(${s}) grayscale(0.3)`
          )
        }}
      >
        <img 
          src="/portrait-base.png" 
          alt="Portrait"
          className="lpv4-portrait__img"
        />
      </motion.div>
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED TITLE — "Design + Tech" with splitting animation
// ═══════════════════════════════════════════════════════════════════════════

const AnimatedTitle = memo(function AnimatedTitle({ identity, isLoaded }) {
  // Design word transforms
  const designX = useTransform(identity, [0, 0.5, 1], ['-20vw', '0vw', '15vw'])
  const designScale = useTransform(identity, [0, 0.35, 0.5, 0.65, 1], [1.6, 1.2, 1, 0.7, 0.5])
  const designOpacity = useTransform(identity, [0, 0.4, 0.5, 0.7, 1], [1, 1, 0.9, 0.5, 0.3])
  
  // Tech word transforms
  const techX = useTransform(identity, [0, 0.5, 1], ['-15vw', '0vw', '20vw'])
  const techScale = useTransform(identity, [0, 0.35, 0.5, 0.65, 1], [0.5, 0.7, 1, 1.2, 1.6])
  const techOpacity = useTransform(identity, [0, 0.3, 0.5, 0.6, 1], [0.3, 0.5, 0.9, 1, 1])
  
  // Plus symbol
  const plusScale = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], [0.6, 0.9, 1, 0.9, 0.6])
  const plusOpacity = useTransform(identity, [0, 0.25, 0.5, 0.75, 1], [0.4, 0.8, 1, 0.8, 0.4])
  
  // Subtitle
  const subtitleOpacity = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], [0.3, 0.8, 1, 0.8, 0.3])
  
  return (
    <AnimatePresence>
      {isLoaded && (
        <div className="lpv4-title">
          {/* DESIGN word */}
          <motion.span
            className="lpv4-title__word lpv4-title__word--design"
            style={{
              x: designX,
              scale: designScale,
              opacity: designOpacity,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Design
          </motion.span>
          
          {/* Plus symbol */}
          <motion.span
            className="lpv4-title__plus"
            style={{
              scale: plusScale,
              opacity: plusOpacity,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            +
          </motion.span>
          
          {/* TECH word */}
          <motion.span
            className="lpv4-title__word lpv4-title__word--tech"
            style={{
              x: techX,
              scale: techScale,
              opacity: techOpacity,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Tech
          </motion.span>
          
          {/* Subtitle */}
          <motion.p
            className="lpv4-title__subtitle"
            style={{ opacity: subtitleOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            Where systems meet emotion
          </motion.p>
        </div>
      )}
    </AnimatePresence>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// EXPLORATION ITEMS — Visible only when deep in Design or Tech
// ═══════════════════════════════════════════════════════════════════════════

const designItems = [
  { id: 1, label: 'Brand Identity', x: '15%', y: '25%' },
  { id: 2, label: 'UI/UX Design', x: '20%', y: '65%' },
  { id: 3, label: 'Motion Design', x: '8%', y: '45%' },
]

const techItems = [
  { id: 1, label: 'React & Next.js', x: '85%', y: '30%' },
  { id: 2, label: 'Node.js APIs', x: '80%', y: '60%' },
  { id: 3, label: 'Cloud Architecture', x: '92%', y: '45%' },
]

const ExplorationItems = memo(function ExplorationItems({ identity }) {
  // Design items appear on the left
  const designItemsOpacity = useTransform(
    identity, 
    [0, CONFIG.zones.designFull, CONFIG.zones.designStart, CONFIG.zones.neutralStart], 
    [1, 0.8, 0.3, 0]
  )
  
  // Tech items appear on the right
  const techItemsOpacity = useTransform(
    identity, 
    [CONFIG.zones.neutralEnd, CONFIG.zones.techStart, CONFIG.zones.techFull, 1], 
    [0, 0.3, 0.8, 1]
  )
  
  return (
    <div className="lpv4-explore">
      {/* Design Items */}
      <motion.div className="lpv4-explore__group" style={{ opacity: designItemsOpacity }}>
        {designItems.map((item) => (
          <motion.div
            key={item.id}
            className="lpv4-explore__item lpv4-explore__item--design"
            style={{ left: item.x, top: item.y }}
          >
            <span className="lpv4-explore__dot" />
            <span className="lpv4-explore__label">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Tech Items */}
      <motion.div className="lpv4-explore__group" style={{ opacity: techItemsOpacity }}>
        {techItems.map((item) => (
          <motion.div
            key={item.id}
            className="lpv4-explore__item lpv4-explore__item--tech"
            style={{ left: item.x, top: item.y }}
          >
            <span className="lpv4-explore__dot" />
            <span className="lpv4-explore__label">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL LINKS — Right side
// ═══════════════════════════════════════════════════════════════════════════

const SocialLinks = memo(function SocialLinks({ onHover, onLeave }) {
  const links = [
    { icon: '○', label: 'Instagram' },
    { icon: '◎', label: 'Dribbble' },
    { icon: '▢', label: 'Twitter' },
  ]
  
  return (
    <div className="lpv4-social">
      {links.map((link, i) => (
        <motion.a
          key={link.label}
          href="#"
          className="lpv4-social__link"
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
        className="lpv4-social__line"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      />
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER — Exploration hint
// ═══════════════════════════════════════════════════════════════════════════

const Footer = memo(function Footer({ identity }) {
  const opacity = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], [0.3, 0.6, 0.5, 0.6, 0.3])
  
  return (
    <motion.footer className="lpv4-footer" style={{ opacity }}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Move left to explore Design · Move right to explore Technology
      </motion.p>
    </motion.footer>
  )
})
