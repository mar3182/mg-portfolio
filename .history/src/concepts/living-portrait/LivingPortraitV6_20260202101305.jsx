/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE LIVING PORTRAIT V6 — Akaru-style Pure Horizontal Scroll
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Exactly like Akaru.fr but extends BOTH directions:
 * - Scroll down/right → moves world LEFT → reveals TECH content
 * - Scroll up/left → moves world RIGHT → reveals DESIGN content
 * 
 * No modes, no vertical depth - pure continuous horizontal flow
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion'
import './living-portrait-v6.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT — Sections that appear as you scroll horizontally
// ═══════════════════════════════════════════════════════════════════════════

const SECTIONS = [
  // LEFT SIDE (Design) - revealed by scrolling up/left
  { id: 'brand', type: 'project', side: 'design', title: 'Brand Identity', subtitle: 'Lumina Studio', desc: 'Complete rebrand for creative agency', year: '2024', color: '#ff6b5b', position: -3 },
  { id: 'uiux', type: 'project', side: 'design', title: 'UI/UX Design', subtitle: 'FlowState App', desc: 'Productivity app with focus modes', year: '2024', color: '#ff9a3c', position: -2 },
  { id: 'motion', type: 'project', side: 'design', title: 'Motion Graphics', subtitle: 'Cosmic Intro', desc: 'Animated brand opener sequence', year: '2024', color: '#ffb4a9', position: -1 },
  
  // CENTER - Starting point
  { id: 'center', type: 'hero', side: 'center', title: 'Design + Tech', position: 0 },
  
  // RIGHT SIDE (Tech) - revealed by scrolling down/right
  { id: 'react', type: 'project', side: 'tech', title: 'React & Next.js', subtitle: 'This Portfolio', desc: 'Living portrait with horizontal scroll', year: '2024', color: '#00ff88', position: 1 },
  { id: 'backend', type: 'project', side: 'tech', title: 'Node.js & APIs', subtitle: 'GraphQL Gateway', desc: 'Unified API for microservices', year: '2024', color: '#00e5ff', position: 2 },
  { id: 'cloud', type: 'project', side: 'tech', title: 'Cloud & DevOps', subtitle: 'K8s Platform', desc: 'Production Kubernetes setup', year: '2024', color: '#8b5cf6', position: 3 },
]

// How many viewport widths each section takes
const SECTION_WIDTH = 100 // vw
const TOTAL_SECTIONS = SECTIONS.length
const WORLD_WIDTH = TOTAL_SECTIONS * SECTION_WIDTH // total vw

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitV6() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Scroll position in pixels (can go negative for left, positive for right)
  // Start at 0 = center
  const scrollX = useMotionValue(0)
  const smoothX = useSpring(scrollX, { stiffness: 50, damping: 30, mass: 1 })
  
  // Convert scroll to world transform
  // scrollX positive → world moves LEFT (shows tech/right content)
  // scrollX negative → world moves RIGHT (shows design/left content)
  const worldX = useTransform(smoothX, (v) => -v)
  
  // Calculate which section is currently "active" based on scroll
  const [activeIndex, setActiveIndex] = useState(3) // center
  
  // Mouse position for cursor
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 200 })
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 200 })

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }, [mouseX, mouseY])

  // Handle wheel — Akaru-style: any scroll moves horizontally
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    
    // Use deltaY (vertical scroll) to control horizontal movement
    // This is exactly how Akaru.fr works
    const delta = e.deltaY * 1.5
    
    const current = scrollX.get()
    const newX = current + delta
    
    // Clamp to world bounds
    // Center is at 0, left edge is -3 sections, right edge is +3 sections
    const maxScroll = 3 * window.innerWidth
    const minScroll = -3 * window.innerWidth
    
    scrollX.set(Math.max(minScroll, Math.min(maxScroll, newX)))
  }, [scrollX])
  
  // Track active section
  useEffect(() => {
    const unsubscribe = smoothX.on('change', (v) => {
      // Each section is 100vw (window.innerWidth)
      const sectionWidth = window.innerWidth
      // Find which section we're closest to
      // v=0 means center (index 3), v=1vw means slightly right, v=-1vw means slightly left
      const sectionOffset = Math.round(v / sectionWidth)
      const newIndex = 3 + sectionOffset // 3 is center
      const clampedIndex = Math.max(0, Math.min(SECTIONS.length - 1, newIndex))
      if (clampedIndex !== activeIndex) {
        setActiveIndex(clampedIndex)
      }
    })
    return () => unsubscribe()
  }, [smoothX, activeIndex])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Calculate identity (0 = full design, 0.5 = center, 1 = full tech)
  const identity = useTransform(smoothX, 
    [-3 * (typeof window !== 'undefined' ? window.innerWidth : 1000), 0, 3 * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
    [0, 0.5, 1]
  )

  return (
    <div 
      ref={containerRef}
      className="lpv6"
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
    >
      {/* Background gradient that shifts with scroll */}
      <GradientBackground identity={identity} />
      
      {/* THE HORIZONTAL WORLD */}
      <motion.div 
        className="lpv6-world"
        style={{ x: worldX }}
      >
        {SECTIONS.map((section, index) => (
          <Section 
            key={section.id}
            section={section}
            index={index}
            isActive={index === activeIndex}
            identity={identity}
          />
        ))}
      </motion.div>
      
      {/* Fixed UI */}
      <Cursor cursorX={cursorX} cursorY={cursorY} identity={identity} />
      <Navigation identity={identity} />
      <ScrollIndicator identity={identity} activeIndex={activeIndex} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION — Each horizontal section in the world
// ═══════════════════════════════════════════════════════════════════════════

const Section = memo(function Section({ section, index, isActive, identity }) {
  if (section.type === 'hero') {
    return (
      <motion.div 
        className="lpv6-section lpv6-section--hero"
        style={{ left: `${(index) * SECTION_WIDTH}vw` }}
        animate={{ opacity: isActive ? 1 : 0.3 }}
      >
        <div className="lpv6-hero">
          <motion.h1 
            className="lpv6-hero__title"
            animate={{ scale: isActive ? 1 : 0.9 }}
          >
            <span className="lpv6-hero__design">Design</span>
            <span className="lpv6-hero__plus">+</span>
            <span className="lpv6-hero__tech">Tech</span>
          </motion.h1>
          <p className="lpv6-hero__subtitle">Creative Developer Portfolio</p>
        </div>
      </motion.div>
    )
  }
  
  return (
    <motion.div 
      className={`lpv6-section lpv6-section--${section.side}`}
      style={{ 
        left: `${(index) * SECTION_WIDTH}vw`,
        '--section-color': section.color,
      }}
      animate={{ 
        opacity: isActive ? 1 : 0.4,
      }}
    >
      <div className="lpv6-project">
        <motion.div 
          className="lpv6-project__index"
          animate={{ x: isActive ? 0 : (section.side === 'design' ? -30 : 30) }}
        >
          {String(index).padStart(2, '0')}
        </motion.div>
        
        <motion.div 
          className="lpv6-project__content"
          animate={{ 
            x: isActive ? 0 : (section.side === 'design' ? -50 : 50),
            opacity: isActive ? 1 : 0.6,
          }}
          transition={{ duration: 0.5 }}
        >
          <span className="lpv6-project__category">{section.title}</span>
          <h2 className="lpv6-project__title">{section.subtitle}</h2>
          <p className="lpv6-project__desc">{section.desc}</p>
          <span className="lpv6-project__year">{section.year}</span>
        </motion.div>
        
        <motion.div 
          className="lpv6-project__visual"
          animate={{ 
            scale: isActive ? 1 : 0.85,
            opacity: isActive ? 1 : 0.5,
          }}
          transition={{ duration: 0.6 }}
        >
          {/* Placeholder for project image/visual */}
          <div className="lpv6-project__placeholder" />
        </motion.div>
        
        <motion.div 
          className="lpv6-project__line"
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// BACKGROUND — Gradient that shifts with identity
// ═══════════════════════════════════════════════════════════════════════════

const GradientBackground = memo(function GradientBackground({ identity }) {
  const warmOpacity = useTransform(identity, [0, 0.5, 1], [0.4, 0.15, 0])
  const coolOpacity = useTransform(identity, [0, 0.5, 1], [0, 0.15, 0.4])
  
  return (
    <div className="lpv6-bg">
      <motion.div className="lpv6-bg__warm" style={{ opacity: warmOpacity }} />
      <motion.div className="lpv6-bg__cool" style={{ opacity: coolOpacity }} />
      <div className="lpv6-bg__noise" />
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════════════════════════════════════════

const Cursor = memo(function Cursor({ cursorX, cursorY, identity }) {
  const color = useTransform(identity, [0, 0.5, 1], ['#ff6b5b', '#ffffff', '#00ff88'])
  
  return (
    <motion.div
      className="lpv6-cursor"
      style={{ x: cursorX, y: cursorY }}
    >
      <motion.div className="lpv6-cursor__dot" style={{ backgroundColor: color }} />
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

const Navigation = memo(function Navigation({ identity }) {
  const designOpacity = useTransform(identity, [0, 0.3, 0.5], [1, 0.5, 0.3])
  const techOpacity = useTransform(identity, [0.5, 0.7, 1], [0.3, 0.5, 1])
  
  return (
    <nav className="lpv6-nav">
      <motion.span className="lpv6-nav__item lpv6-nav__item--design" style={{ opacity: designOpacity }}>
        ← Design
      </motion.span>
      <motion.span className="lpv6-nav__item lpv6-nav__item--tech" style={{ opacity: techOpacity }}>
        Tech →
      </motion.span>
    </nav>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL INDICATOR — Shows position in the horizontal journey
// ═══════════════════════════════════════════════════════════════════════════

const ScrollIndicator = memo(function ScrollIndicator({ identity, activeIndex }) {
  return (
    <div className="lpv6-indicator">
      {SECTIONS.map((section, index) => (
        <motion.div
          key={section.id}
          className={`lpv6-indicator__dot ${index === activeIndex ? 'lpv6-indicator__dot--active' : ''}`}
          animate={{
            scale: index === activeIndex ? 1.5 : 1,
            backgroundColor: index === activeIndex 
              ? (section.color || '#ffffff') 
              : 'rgba(255,255,255,0.3)',
          }}
          style={{
            '--dot-color': section.color || '#ffffff',
          }}
        />
      ))}
    </div>
  )
})
