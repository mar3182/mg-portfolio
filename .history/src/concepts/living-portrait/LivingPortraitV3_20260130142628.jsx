/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LIVING PORTRAIT V3 — Explorative T-Navigation
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ART DIRECTION CONCEPT:
 * 
 * The "+" acts as a LOUPE (magnifying glass) that reveals content:
 * 
 * HORIZONTAL AXIS (Projects):
 * - Items scattered/dispersed along the line
 * - Hover near an item → it reveals/highlights
 * - Left side: Design projects
 * - Right side: Tech projects
 * 
 * VERTICAL AXIS (Personal):
 * - From center, vertical movement reveals personal sections
 * - Who am I, Experience, Mindset, Contact, etc.
 * 
 * The "+" follows mouse in 2D space, revealing nearby items
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
  spring: {
    stiffness: 120,
    damping: 25,
    mass: 0.5,
  },
  springLoose: {
    stiffness: 60,
    damping: 20,
    mass: 1,
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
  // Reveal radius for the loupe effect
  loupeRadius: 120,
}

// Scattered project positions (percentage along axis)
const PROJECTS = {
  design: [
    { id: 'd1', title: 'Brand Identity', category: 'Branding', pos: 8 },
    { id: 'd2', title: 'UI/UX Design', category: 'Product', pos: 18 },
    { id: 'd3', title: 'Motion Graphics', category: 'Animation', pos: 28 },
    { id: 'd4', title: 'Packaging', category: 'Print', pos: 38 },
  ],
  tech: [
    { id: 't1', title: 'React Apps', category: 'Frontend', pos: 62 },
    { id: 't2', title: 'Node.js API', category: 'Backend', pos: 72 },
    { id: 't3', title: 'Cloud Infra', category: 'DevOps', pos: 82 },
    { id: 't4', title: 'Mobile App', category: 'React Native', pos: 92 },
  ],
}

// Vertical menu items (percentage from center)
const VERTICAL_ITEMS = [
  { id: 'about', title: 'Who am I', icon: '◯', offsetY: -35 },
  { id: 'experience', title: 'Experience', icon: '◈', offsetY: -20 },
  { id: 'mindset', title: 'Mindset', icon: '◇', offsetY: 20 },
  { id: 'contact', title: 'Contact', icon: '△', offsetY: 35 },
]

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitV3() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Raw mouse position (0-1 normalized)
  const mouseXRaw = useMotionValue(0.5)
  const mouseYRaw = useMotionValue(0.5)
  
  // Smooth values with spring physics (the loupe position)
  const mouseX = useSpring(mouseXRaw, CONFIG.spring)
  const mouseY = useSpring(mouseYRaw, CONFIG.spring)
  
  // Identity for background effects (looser spring)
  const identity = useSpring(mouseXRaw, CONFIG.springLoose)
  
  // ─── PORTRAIT TRANSFORMS ───
  const portraitScale = useTransform(
    identity, 
    [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1],
    [0.5, 0.6, 0.9, 1, 0.9, 0.6, 0.5]
  )
  const portraitY = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], ['15%', '5%', '0%', '5%', '15%'])
  const portraitOpacity = useTransform(identity, [0, 0.2, 0.4, 0.6, 0.8, 1], [0.7, 0.85, 1, 1, 0.85, 0.7])
  
  // ─── HORIZONTAL SHIFT ───
  const horizontalShift = useTransform(identity, [0, 0.5, 1], ['20vw', '0vw', '-20vw'])
  
  // ─── ZONE VISIBILITY ───
  const selfZoneOpacity = useTransform(identity, [0.2, 0.35, 0.5, 0.65, 0.8], [0, 0.5, 1, 0.5, 0])
  
  // ─── BACKGROUND COLORS ───
  const bgWarmOpacity = useTransform(identity, [0, 0.3, 0.5], [0.5, 0.2, 0])
  const bgCoolOpacity = useTransform(identity, [0.5, 0.7, 1], [0, 0.2, 0.5])
  
  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Mouse handlers
  const handleMouseMove = useCallback((e) => {
    if (isMobile || selectedItem) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseXRaw.set(e.clientX / rect.width)
    mouseYRaw.set(e.clientY / rect.height)
  }, [mouseXRaw, mouseYRaw, isMobile, selectedItem])
  
  const handleMouseLeave = useCallback(() => {
    if (selectedItem) return
    mouseXRaw.set(0.5)
    mouseYRaw.set(0.5)
  }, [mouseXRaw, mouseYRaw, selectedItem])
  
  // Item handlers
  const handleItemClick = (item, type) => {
    setSelectedItem({ ...item, type })
  }
  
  const handleCloseItem = () => {
    setSelectedItem(null)
  }
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  return (
    <motion.div 
      ref={containerRef}
      className="living-portrait-v3"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* ═══ LAYER 1: BACKGROUNDS ═══ */}
      <div className="lpv3-background">
        <motion.div className="lpv3-background__warm" style={{ opacity: bgWarmOpacity }} />
        <motion.div className="lpv3-background__cool" style={{ opacity: bgCoolOpacity }} />
        <div className="lpv3-background__vignette" />
      </div>
      
      {/* ═══ LAYER 2: WORLD BACKGROUNDS ═══ */}
      <OrganicWorld identity={identity} horizontalShift={horizontalShift} />
      <MatrixWorld identity={identity} horizontalShift={horizontalShift} />
      
      {/* ═══ LAYER 3: EXPLORATIVE NAVIGATION ═══ */}
      <ExplorativeNav 
        mouseX={mouseX}
        mouseY={mouseY}
        projects={PROJECTS}
        verticalItems={VERTICAL_ITEMS}
        onItemClick={handleItemClick}
        loupeRadius={CONFIG.loupeRadius}
      />
      
      {/* ═══ LAYER 4: MAIN CONTENT ═══ */}
      <main className="lpv3-main">
        <motion.div 
          className="lpv3-portrait"
          style={{ scale: portraitScale, y: portraitY, opacity: portraitOpacity }}
        >
          <PortraitElement identity={identity} config={CONFIG} />
        </motion.div>
        
        {/* Typography - V2 style */}
        <motion.div className="lpv3-typography" style={{ opacity: selfZoneOpacity }}>
          <h1 className="lpv3-typography__title">
            <span className="title-line">Design</span>
            <span className="title-ampersand">&</span>
            <span className="title-line">Tech</span>
          </h1>
          <p className="lpv3-typography__subtitle">Creative Developer</p>
        </motion.div>
      </main>
      
      {/* ═══ LAYER 5: ITEM DETAIL OVERLAY ═══ */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetail 
            item={selectedItem} 
            onClose={handleCloseItem}
          />
        )}
      </AnimatePresence>
      
      {/* ═══ FOOTER ═══ */}
      <footer className="lpv3-footer">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 2 }}>
          {isMobile ? 'Tap to explore' : 'Move to discover · Hover to reveal'}
        </motion.p>
      </footer>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPLORATIVE NAVIGATION — The "+" loupe revealing scattered items
// ═══════════════════════════════════════════════════════════════════════════

const ExplorativeNav = memo(function ExplorativeNav({ 
  mouseX, mouseY, projects, verticalItems, onItemClick, loupeRadius 
}) {
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 })
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])
  
  // Loupe position in pixels
  const loupeX = useTransform(mouseX, [0, 1], [0, dimensions.width])
  const loupeY = useTransform(mouseY, [0, 1], [0, dimensions.height])
  
  // Color based on horizontal position
  const plusColor = useTransform(
    mouseX,
    [0, 0.35, 0.5, 0.65, 1],
    [CONFIG.colors.design, CONFIG.colors.design, CONFIG.colors.neutral, CONFIG.colors.tech, CONFIG.colors.tech]
  )
  
  // Vertical line visibility (when near center horizontally)
  const verticalLineOpacity = useTransform(mouseX, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0])
  
  // All horizontal projects combined
  const allProjects = [...projects.design, ...projects.tech]
  
  return (
    <div ref={containerRef} className="lpv3-explore">
      {/* Horizontal axis line */}
      <div className="lpv3-explore__h-line">
        <div className="lpv3-explore__h-line-design" />
        <div className="lpv3-explore__h-line-tech" />
      </div>
      
      {/* Vertical axis line (appears when centered) */}
      <motion.div 
        className="lpv3-explore__v-line"
        style={{ opacity: verticalLineOpacity }}
      />
      
      {/* Scattered horizontal items (projects) */}
      {allProjects.map((project) => (
        <ScatteredItem
          key={project.id}
          item={project}
          type="project"
          loupeX={loupeX}
          loupeY={loupeY}
          loupeRadius={loupeRadius}
          centerY={dimensions.height / 2}
          onClick={() => onItemClick(project, project.id.startsWith('d') ? 'design' : 'tech')}
          isDesign={project.id.startsWith('d')}
        />
      ))}
      
      {/* Vertical items (personal sections) */}
      {verticalItems.map((item) => (
        <VerticalItem
          key={item.id}
          item={item}
          loupeX={loupeX}
          loupeY={loupeY}
          loupeRadius={loupeRadius}
          centerX={dimensions.width / 2}
          centerY={dimensions.height / 2}
          onClick={() => onItemClick(item, 'personal')}
        />
      ))}
      
      {/* The "+" loupe cursor */}
      <motion.div 
        className="lpv3-explore__loupe"
        style={{ 
          x: loupeX,
          y: loupeY,
        }}
      >
        <motion.span 
          className="lpv3-explore__plus"
          style={{ color: plusColor }}
        >
          +
        </motion.span>
        <div className="lpv3-explore__loupe-ring" />
      </motion.div>
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// SCATTERED ITEM — Horizontal project items that reveal on proximity
// ═══════════════════════════════════════════════════════════════════════════

const ScatteredItem = memo(function ScatteredItem({ 
  item, loupeX, loupeY, loupeRadius, centerY, onClick, isDesign 
}) {
  const itemRef = useRef(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [itemPos, setItemPos] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect()
      const parent = itemRef.current.parentElement.getBoundingClientRect()
      setItemPos({
        x: rect.left - parent.left + rect.width / 2,
        y: rect.top - parent.top + rect.height / 2,
      })
    }
  }, [])
  
  // Check proximity to loupe
  useEffect(() => {
    const unsubX = loupeX.on('change', (x) => {
      const y = loupeY.get()
      const distance = Math.sqrt(Math.pow(x - itemPos.x, 2) + Math.pow(y - itemPos.y, 2))
      setIsRevealed(distance < loupeRadius)
    })
    const unsubY = loupeY.on('change', (y) => {
      const x = loupeX.get()
      const distance = Math.sqrt(Math.pow(x - itemPos.x, 2) + Math.pow(y - itemPos.y, 2))
      setIsRevealed(distance < loupeRadius)
    })
    return () => { unsubX(); unsubY() }
  }, [loupeX, loupeY, itemPos, loupeRadius])
  
  // Small vertical offset for visual interest
  const yOffset = ((item.pos % 20) - 10) * 2
  
  return (
    <motion.button
      ref={itemRef}
      className={`lpv3-scatter-item ${isDesign ? 'lpv3-scatter-item--design' : 'lpv3-scatter-item--tech'}`}
      style={{ 
        left: `${item.pos}%`,
        top: `calc(50% + ${yOffset}px)`,
      }}
      animate={{
        opacity: isRevealed ? 1 : 0.15,
        scale: isRevealed ? 1 : 0.7,
        y: isRevealed ? 0 : 10,
      }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      transition={{ duration: 0.3 }}
    >
      <span className="lpv3-scatter-item__dot" />
      <motion.div 
        className="lpv3-scatter-item__label"
        animate={{ opacity: isRevealed ? 1 : 0 }}
      >
        <span className="lpv3-scatter-item__title">{item.title}</span>
        <span className="lpv3-scatter-item__category">{item.category}</span>
      </motion.div>
    </motion.button>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// VERTICAL ITEM — Personal sections along vertical axis
// ═══════════════════════════════════════════════════════════════════════════

const VerticalItem = memo(function VerticalItem({ 
  item, loupeX, loupeY, loupeRadius, centerX, centerY, onClick 
}) {
  const itemRef = useRef(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [itemPos, setItemPos] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect()
      const parent = itemRef.current.parentElement.getBoundingClientRect()
      setItemPos({
        x: rect.left - parent.left + rect.width / 2,
        y: rect.top - parent.top + rect.height / 2,
      })
    }
  }, [centerX, centerY])
  
  // Check proximity to loupe
  useEffect(() => {
    const unsubX = loupeX.on('change', (x) => {
      const y = loupeY.get()
      const distance = Math.sqrt(Math.pow(x - itemPos.x, 2) + Math.pow(y - itemPos.y, 2))
      // Also check if we're near the center horizontally
      const nearCenter = Math.abs(x - centerX) < 150
      setIsRevealed(distance < loupeRadius && nearCenter)
    })
    const unsubY = loupeY.on('change', (y) => {
      const x = loupeX.get()
      const distance = Math.sqrt(Math.pow(x - itemPos.x, 2) + Math.pow(y - itemPos.y, 2))
      const nearCenter = Math.abs(x - centerX) < 150
      setIsRevealed(distance < loupeRadius && nearCenter)
    })
    return () => { unsubX(); unsubY() }
  }, [loupeX, loupeY, itemPos, loupeRadius, centerX])
  
  return (
    <motion.button
      ref={itemRef}
      className="lpv3-vertical-item"
      style={{ 
        left: '50%',
        top: `calc(50% + ${item.offsetY}vh)`,
      }}
      animate={{
        opacity: isRevealed ? 1 : 0.1,
        scale: isRevealed ? 1 : 0.6,
        x: isRevealed ? 0 : -20,
      }}
      whileHover={{ scale: 1.1, x: 10 }}
      onClick={onClick}
      transition={{ duration: 0.3 }}
    >
      <span className="lpv3-vertical-item__icon">{item.icon}</span>
      <motion.span 
        className="lpv3-vertical-item__title"
        animate={{ opacity: isRevealed ? 1 : 0 }}
      >
        {item.title}
      </motion.span>
    </motion.button>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// ITEM DETAIL — Expanded view for any item
// ═══════════════════════════════════════════════════════════════════════════

const ItemDetail = memo(function ItemDetail({ item, onClose }) {
  const isDesign = item.type === 'design'
  const isTech = item.type === 'tech'
  const isPersonal = item.type === 'personal'
  
  const accentColor = isDesign ? CONFIG.colors.design : isTech ? CONFIG.colors.tech : CONFIG.colors.neutral
  
  return (
    <motion.div 
      className="lpv3-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className={`lpv3-detail lpv3-detail--${item.type}`}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <motion.button 
          className="lpv3-detail__close"
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          style={{ color: accentColor }}
        >
          +
        </motion.button>
        
        {/* Content */}
        <div className="lpv3-detail__content">
          {isPersonal && (
            <span className="lpv3-detail__icon">{item.icon}</span>
          )}
          {!isPersonal && (
            <span className="lpv3-detail__category" style={{ color: accentColor }}>
              {item.category}
            </span>
          )}
          <h2 className="lpv3-detail__title">{item.title}</h2>
          
          <div className="lpv3-detail__placeholder">
            <span>{isPersonal ? 'Personal section content' : 'Project details'} coming soon</span>
          </div>
          
          <motion.button 
            className="lpv3-detail__cta"
            style={{ backgroundColor: accentColor }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isPersonal ? 'Learn More' : 'View Case Study'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// PORTRAIT ELEMENT
// ═══════════════════════════════════════════════════════════════════════════

const PortraitElement = memo(function PortraitElement({ identity, config }) {
  const designClipPath = useTransform(identity, (pos) => {
    if (pos >= 0.5) return 'inset(0 100% 0 0)'
    const revealPercent = ((0.5 - pos) / 0.5) * 100
    return `inset(0 ${100 - revealPercent}% 0 0)`
  })
  
  const techClipPath = useTransform(identity, (pos) => {
    if (pos <= 0.5) return 'inset(0 0 0 100%)'
    const revealPercent = ((pos - 0.5) / 0.5) * 100
    return `inset(0 0 0 ${100 - revealPercent}%)`
  })
  
  const baseOpacity = useTransform(identity, [0, 0.25, 0.4, 0.6, 0.75, 1], [0.3, 0.6, 1, 1, 0.6, 0.3])
  
  return (
    <div className="lpv3-portrait__container">
      <motion.img 
        src={config.portraits.base}
        alt="Portrait"
        className="lpv3-portrait__image lpv3-portrait__image--base"
        style={{ opacity: baseOpacity }}
      />
      <motion.img 
        src={config.portraits.design}
        alt="Design side"
        className="lpv3-portrait__image lpv3-portrait__image--design"
        style={{ clipPath: designClipPath }}
      />
      <motion.img 
        src={config.portraits.tech}
        alt="Tech side"
        className="lpv3-portrait__image lpv3-portrait__image--tech"
        style={{ clipPath: techClipPath }}
      />
      <div className="lpv3-portrait__glow" />
    </div>
  )
})
