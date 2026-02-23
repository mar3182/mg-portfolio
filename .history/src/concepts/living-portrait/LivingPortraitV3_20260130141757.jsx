/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LIVING PORTRAIT V3 — T-Navigation Portfolio Experience
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ART DIRECTION CONCEPT:
 * 
 * The "+" Navigation creates a spatial portfolio experience:
 * - The "+" follows mouse along horizontal axis
 * - Hovering reveals project thumbnails from each zone
 * - Clicking a project expands to card view
 * - "+" rotates to "×" to close the card
 * 
 * ZONES:
 * - LEFT: Design Zone - Creative work, case studies
 * - CENTER: Self Zone - Portrait hero, about
 * - RIGHT: Tech Zone - Development, skills, projects
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
    stiffness: 60,
    damping: 25,
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
}

// Sample project data
const PROJECTS = {
  design: [
    { id: 'd1', title: 'Brand Identity', category: 'Branding', year: '2025' },
    { id: 'd2', title: 'UI/UX Design', category: 'Product', year: '2025' },
    { id: 'd3', title: 'Motion Graphics', category: 'Animation', year: '2024' },
    { id: 'd4', title: 'Packaging Design', category: 'Print', year: '2024' },
  ],
  tech: [
    { id: 't1', title: 'React Dashboard', category: 'Frontend', year: '2025' },
    { id: 't2', title: 'Node.js API', category: 'Backend', year: '2025' },
    { id: 't3', title: 'Cloud Infrastructure', category: 'DevOps', year: '2024' },
    { id: 't4', title: 'Mobile App', category: 'React Native', year: '2024' },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitV3() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeZone, setActiveZone] = useState('self')
  const [selectedProject, setSelectedProject] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Raw mouse position (0-1)
  const identityRaw = useMotionValue(0.5)
  const mouseYRaw = useMotionValue(0.5)
  
  // Smooth values with spring physics
  const identity = useSpring(identityRaw, CONFIG.spring)
  
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
  
  // Determine zone from identity
  const getZone = (val) => {
    if (val < 0.3) return 'design'
    if (val > 0.7) return 'tech'
    return 'self'
  }
  
  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Track zone changes
  useEffect(() => {
    const unsubscribe = identity.on('change', (value) => {
      const newZone = getZone(value)
      if (newZone !== activeZone) setActiveZone(newZone)
    })
    return () => unsubscribe()
  }, [identity, activeZone])
  
  // Mouse handlers
  const handleMouseMove = useCallback((e) => {
    if (isMobile || selectedProject) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    identityRaw.set(e.clientX / rect.width)
    mouseYRaw.set(e.clientY / rect.height)
  }, [identityRaw, mouseYRaw, isMobile, selectedProject])
  
  const handleMouseLeave = useCallback(() => {
    if (selectedProject) return
    const current = identityRaw.get()
    if (current < 0.25) identityRaw.set(0.15)
    else if (current > 0.75) identityRaw.set(0.85)
    else identityRaw.set(0.5)
  }, [identityRaw, selectedProject])
  
  // Project handlers
  const handleProjectClick = (project) => {
    setSelectedProject(project)
  }
  
  const handleCloseProject = () => {
    setSelectedProject(null)
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
      
      {/* ═══ LAYER 3: PLUS NAVIGATION (+) ═══ */}
      <PlusNavigation 
        identity={identity}
        projects={PROJECTS}
        onProjectClick={handleProjectClick}
        selectedProject={selectedProject}
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
      
      {/* ═══ LAYER 5: PROJECT CARD OVERLAY ═══ */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectCard 
            project={selectedProject} 
            onClose={handleCloseProject}
            zone={activeZone}
          />
        )}
      </AnimatePresence>
      
      {/* ═══ FOOTER ═══ */}
      <footer className="lpv3-footer">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 2 }}>
          {isMobile ? 'Tap to explore' : 'Move to explore · Click to expand'}
        </motion.p>
      </footer>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PLUS NAVIGATION — The "+" as interactive cursor/navigation
// ═══════════════════════════════════════════════════════════════════════════

const PlusNavigation = memo(function PlusNavigation({ 
  identity, projects, onProjectClick, selectedProject 
}) {
  // Position along horizontal axis
  const plusX = useTransform(identity, [0, 1], ['5%', '95%'])
  
  // Color based on zone
  const plusColor = useTransform(
    identity,
    [0, 0.25, 0.5, 0.75, 1],
    [CONFIG.colors.design, CONFIG.colors.design, CONFIG.colors.neutral, CONFIG.colors.tech, CONFIG.colors.tech]
  )
  
  // Project visibility
  const designProjectsOpacity = useTransform(identity, [0, 0.15, 0.35], [1, 0.7, 0])
  const techProjectsOpacity = useTransform(identity, [0.65, 0.85, 1], [0, 0.7, 1])
  
  return (
    <div className="lpv3-plus-nav">
      {/* Horizontal line */}
      <div className="lpv3-plus-nav__line">
        <div className="lpv3-plus-nav__line-design" />
        <div className="lpv3-plus-nav__line-tech" />
      </div>
      
      {/* Design projects (left side) */}
      <motion.div 
        className="lpv3-plus-nav__projects lpv3-plus-nav__projects--design"
        style={{ opacity: designProjectsOpacity }}
      >
        {projects.design.map((project, i) => (
          <motion.button
            key={project.id}
            className="lpv3-project-item"
            onClick={() => onProjectClick(project)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05, x: 10 }}
          >
            <span className="lpv3-project-item__title">{project.title}</span>
            <span className="lpv3-project-item__meta">{project.category}</span>
          </motion.button>
        ))}
      </motion.div>
      
      {/* Tech projects (right side) */}
      <motion.div 
        className="lpv3-plus-nav__projects lpv3-plus-nav__projects--tech"
        style={{ opacity: techProjectsOpacity }}
      >
        {projects.tech.map((project, i) => (
          <motion.button
            key={project.id}
            className="lpv3-project-item lpv3-project-item--tech"
            onClick={() => onProjectClick(project)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05, x: -10 }}
          >
            <span className="lpv3-project-item__title">{project.title}</span>
            <span className="lpv3-project-item__meta">{project.category}</span>
          </motion.button>
        ))}
      </motion.div>
      
      {/* The "+" cursor */}
      <motion.div 
        className="lpv3-plus-nav__cursor"
        style={{ left: plusX }}
      >
        <motion.span 
          className="lpv3-plus-nav__symbol"
          style={{ color: plusColor }}
          animate={{ rotate: selectedProject ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          +
        </motion.span>
      </motion.div>
      
      {/* Zone labels */}
      <motion.span 
        className="lpv3-plus-nav__label lpv3-plus-nav__label--left"
        style={{ opacity: useTransform(identity, [0, 0.15, 0.3], [1, 0.6, 0]) }}
      >
        Design
      </motion.span>
      <motion.span 
        className="lpv3-plus-nav__label lpv3-plus-nav__label--right"
        style={{ opacity: useTransform(identity, [0.7, 0.85, 1], [0, 0.6, 1]) }}
      >
        Tech
      </motion.span>
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT CARD — Expanded project view
// ═══════════════════════════════════════════════════════════════════════════

const ProjectCard = memo(function ProjectCard({ project, onClose, zone }) {
  const isDesign = zone === 'design'
  const accentColor = isDesign ? CONFIG.colors.design : CONFIG.colors.tech
  
  return (
    <motion.div 
      className="lpv3-card-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className={`lpv3-card lpv3-card--${zone}`}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - rotated "+" becomes "×" */}
        <motion.button 
          className="lpv3-card__close"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ color: accentColor }}
        >
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: 45 }}
            exit={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            +
          </motion.span>
        </motion.button>
        
        {/* Card content */}
        <div className="lpv3-card__content">
          <span className="lpv3-card__category" style={{ color: accentColor }}>
            {project.category}
          </span>
          <h2 className="lpv3-card__title">{project.title}</h2>
          <p className="lpv3-card__year">{project.year}</p>
          
          <div className="lpv3-card__placeholder">
            <span>Project details coming soon</span>
          </div>
          
          <motion.button 
            className="lpv3-card__cta"
            style={{ backgroundColor: accentColor }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Full Case Study
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
