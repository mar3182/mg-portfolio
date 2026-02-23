/**
 * LIVING PORTRAIT V6 — Akaru.fr Style Navigation
 * 
 * Exact behavior from Akaru.fr:
 * - Split screen: Fixed left panel, dynamic right panel
 * - Horizontal scroll transitions between expertise areas
 * - Vertical scroll within each area reveals projects with parallax
 * - Smooth spring physics and snap behavior
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import './living-portrait-v6.css'

// Areas data - horizontal sections
const AREAS = [
  {
    id: 'brand',
    name: 'Brand Identity',
    category: 'Design',
    color: '#ff6b5b',
    bgColor: 'rgba(255, 107, 91, 0.08)',
    desc: 'Visual identity, logos, brand systems',
    projects: [
      { id: 'b1', name: 'Lumina Studio', desc: 'Complete rebrand for creative agency', year: '2024' },
      { id: 'b2', name: 'Verde Organic', desc: 'Sustainable food brand identity', year: '2024' },
    ]
  },
  {
    id: 'uiux',
    name: 'UI/UX Design',
    category: 'Design', 
    color: '#ff9a3c',
    bgColor: 'rgba(255, 154, 60, 0.08)',
    desc: 'Interfaces, user experience, prototypes',
    projects: [
      { id: 'u1', name: 'FlowState App', desc: 'Productivity app with focus modes', year: '2024' },
      { id: 'u2', name: 'Artisan Market', desc: 'E-commerce for handmade goods', year: '2023' },
    ]
  },
  {
    id: 'motion',
    name: 'Motion Design',
    category: 'Design',
    color: '#e879f9',
    bgColor: 'rgba(232, 121, 249, 0.08)',
    desc: 'Animation, motion graphics, interactions',
    projects: [
      { id: 'm1', name: 'Cosmic Intro', desc: 'Animated brand opener sequence', year: '2024' },
    ]
  },
  {
    id: 'center',
    name: 'Portfolio',
    category: '',
    color: '#ffffff',
    bgColor: 'transparent',
    desc: '',
    isCenter: true,
    projects: []
  },
  {
    id: 'react',
    name: 'React & Next.js',
    category: 'Tech',
    color: '#00ff88',
    bgColor: 'rgba(0, 255, 136, 0.06)',
    desc: 'Frontend development, SSR, web apps',
    projects: [
      { id: 'r1', name: 'This Portfolio', desc: 'Interactive scroll experience', year: '2025' },
      { id: 'r2', name: 'SaaS Dashboard', desc: 'Real-time analytics platform', year: '2024' },
    ]
  },
  {
    id: 'backend',
    name: 'Node.js & APIs',
    category: 'Tech',
    color: '#00e5ff',
    bgColor: 'rgba(0, 229, 255, 0.06)',
    desc: 'Backend, GraphQL, microservices',
    projects: [
      { id: 'n1', name: 'GraphQL Gateway', desc: 'Unified API for microservices', year: '2024' },
    ]
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    category: 'Tech',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.06)',
    desc: 'Kubernetes, CI/CD, infrastructure',
    projects: [
      { id: 'c1', name: 'K8s Platform', desc: 'Production Kubernetes setup', year: '2024' },
    ]
  },
]

const CENTER_INDEX = 3

export default function LivingPortraitV6() {
  const containerRef = useRef(null)
  const [currentArea, setCurrentArea] = useState(CENTER_INDEX)
  const [currentProject, setCurrentProject] = useState(-1) // -1 = area header
  const isAnimating = useRef(false)
  const lastScrollTime = useRef(0)
  
  // Smooth motion values
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  
  const springConfig = { stiffness: 80, damping: 25, mass: 0.5 }
  const smoothX = useSpring(targetX, springConfig)
  const smoothY = useSpring(targetY, springConfig)
  
  // Cursor
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 500)
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 400)
  const cursorX = useSpring(mouseX, { damping: 30, stiffness: 400 })
  const cursorY = useSpring(mouseY, { damping: 30, stiffness: 400 })

  const area = AREAS[currentArea]
  const projectCount = area?.projects?.length || 0

  // Navigate to area + project
  const navigateTo = useCallback((areaIdx, projectIdx = -1) => {
    if (isAnimating.current) return
    
    const clampedArea = Math.max(0, Math.min(AREAS.length - 1, areaIdx))
    const maxProject = (AREAS[clampedArea]?.projects?.length || 0) - 1
    const clampedProject = Math.max(-1, Math.min(maxProject, projectIdx))
    
    isAnimating.current = true
    
    // Calculate positions
    const xPos = (clampedArea - CENTER_INDEX) * 100 // vw
    const yPos = (clampedProject + 1) * 100 // vh (project -1 = 0vh, 0 = 100vh, etc)
    
    targetX.set(xPos)
    targetY.set(yPos)
    
    setCurrentArea(clampedArea)
    setCurrentProject(clampedProject)
    
    // Release animation lock after transition
    setTimeout(() => {
      isAnimating.current = false
    }, 600)
  }, [targetX, targetY])

  // Handle wheel scroll - Akaru style
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    
    const now = Date.now()
    if (now - lastScrollTime.current < 100) return // Debounce
    if (isAnimating.current) return
    
    lastScrollTime.current = now
    
    const delta = e.deltaY
    const threshold = 30
    
    if (Math.abs(delta) < threshold) return
    
    const direction = delta > 0 ? 1 : -1
    const areaProjectCount = AREAS[currentArea]?.projects?.length || 0
    
    if (direction > 0) {
      // Scrolling DOWN
      if (areaProjectCount === 0) {
        // No projects, move to next area
        navigateTo(currentArea + 1, -1)
      } else if (currentProject < areaProjectCount - 1) {
        // More projects to show
        navigateTo(currentArea, currentProject + 1)
      } else {
        // At last project, move to next area
        navigateTo(currentArea + 1, -1)
      }
    } else {
      // Scrolling UP
      if (currentProject > -1) {
        // Go to previous project or area header
        navigateTo(currentArea, currentProject - 1)
      } else {
        // At area header, go to previous area's last project
        const prevArea = currentArea - 1
        if (prevArea >= 0) {
          const prevProjectCount = AREAS[prevArea]?.projects?.length || 0
          navigateTo(prevArea, prevProjectCount - 1)
        }
      }
    }
  }, [currentArea, currentProject, navigateTo])

  // Mouse move
  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }, [mouseX, mouseY])

  // Setup wheel listener
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Transform for the world container
  const worldX = useTransform(smoothX, v => `${-v}vw`)
  const worldY = useTransform(smoothY, v => `${-v}vh`)

  // Background color transition
  const bgOpacity = useTransform(smoothX, 
    [-300, -200, -100, 0, 100, 200, 300],
    [0.15, 0.12, 0.08, 0, 0.08, 0.12, 0.15]
  )

  return (
    <div 
      ref={containerRef}
      className="lpv6"
      onMouseMove={handleMouseMove}
    >
      {/* Background layers */}
      <div className="lpv6-bg">
        <motion.div 
          className="lpv6-bg__gradient lpv6-bg__gradient--design"
          style={{ 
            opacity: useTransform(smoothX, [-300, 0], [0.4, 0])
          }}
        />
        <motion.div 
          className="lpv6-bg__gradient lpv6-bg__gradient--tech"
          style={{ 
            opacity: useTransform(smoothX, [0, 300], [0, 0.4])
          }}
        />
        <div className="lpv6-bg__noise" />
      </div>

      {/* Fixed Left Panel - Akaru style */}
      <LeftPanel 
        area={area} 
        currentProject={currentProject}
        onNavigate={navigateTo}
      />

      {/* The scrolling world */}
      <motion.div 
        className="lpv6-world"
        style={{ x: worldX, y: worldY }}
      >
        {AREAS.map((a, idx) => (
          <AreaSection
            key={a.id}
            area={a}
            index={idx}
            isActive={idx === currentArea}
            activeProject={idx === currentArea ? currentProject : -1}
          />
        ))}
      </motion.div>

      {/* Navigation indicators */}
      <AreaIndicator 
        areas={AREAS} 
        current={currentArea} 
        onSelect={(idx) => navigateTo(idx, -1)}
      />
      
      <AnimatePresence>
        {projectCount > 0 && (
          <ProjectIndicator
            count={projectCount}
            current={currentProject}
            color={area.color}
            onSelect={(idx) => navigateTo(currentArea, idx)}
          />
        )}
      </AnimatePresence>

      {/* Scroll hint */}
      <AnimatePresence>
        {currentProject === -1 && projectCount > 0 && (
          <ScrollHint color={area.color} direction="down" />
        )}
      </AnimatePresence>

      {/* Custom cursor */}
      <motion.div 
        className="lpv6-cursor"
        style={{ x: cursorX, y: cursorY }}
      >
        <motion.div 
          className="lpv6-cursor__dot"
          animate={{ 
            backgroundColor: area?.color || '#fff',
            scale: 1
          }}
        />
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   LEFT PANEL - Fixed Akaru-style panel
   ═══════════════════════════════════════════════════════════════════════════ */

const LeftPanel = memo(function LeftPanel({ area, currentProject, onNavigate }) {
  const isCenter = area?.isCenter
  const isDesign = area?.category === 'Design'
  
  return (
    <div className="lpv6-left">
      <div className="lpv6-left__content">
        {/* Logo */}
        <motion.a 
          href="/"
          className="lpv6-left__logo"
          whileHover={{ scale: 1.05 }}
        >
          MG
        </motion.a>
        
        {/* Current area info */}
        <div className="lpv6-left__info">
          <AnimatePresence mode="wait">
            <motion.div
              key={area?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {!isCenter && (
                <>
                  <span 
                    className="lpv6-left__category"
                    style={{ color: area?.color }}
                  >
                    {area?.category}
                  </span>
                  <h2 className="lpv6-left__title">{area?.name}</h2>
                  <p className="lpv6-left__desc">{area?.desc}</p>
                </>
              )}
              
              {isCenter && (
                <div className="lpv6-left__center">
                  <span className="lpv6-left__tagline">Creative Developer</span>
                  <h1 className="lpv6-left__name">
                    <span style={{ color: '#ff6b5b' }}>Design</span>
                    <span className="lpv6-left__plus">+</span>
                    <span style={{ color: '#00ff88' }}>Tech</span>
                  </h1>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Social links */}
        <div className="lpv6-left__social">
          <div className="lpv6-left__line" />
          <div className="lpv6-left__links">
            <a href="#" aria-label="GitHub">GH</a>
            <a href="#" aria-label="LinkedIn">LI</a>
            <a href="#" aria-label="Twitter">TW</a>
          </div>
        </div>
      </div>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   AREA SECTION - Each horizontal panel
   ═══════════════════════════════════════════════════════════════════════════ */

const AreaSection = memo(function AreaSection({ area, index, isActive, activeProject }) {
  const isCenter = area.isCenter
  const totalSlides = 1 + (area.projects?.length || 0)
  
  return (
    <div 
      className="lpv6-area"
      style={{ 
        left: `${index * 100}vw`,
        height: `${totalSlides * 100}vh`,
        '--area-color': area.color,
        '--area-bg': area.bgColor,
      }}
    >
      {/* Area header - first viewport */}
      <div className="lpv6-area__header">
        {isCenter ? (
          <CenterDisplay isActive={isActive && activeProject === -1} />
        ) : (
          <AreaDisplay 
            area={area} 
            isActive={isActive && activeProject === -1}
          />
        )}
      </div>
      
      {/* Projects - each takes one viewport below */}
      {area.projects?.map((project, pIdx) => (
        <ProjectDisplay
          key={project.id}
          project={project}
          index={pIdx}
          area={area}
          isActive={isActive && activeProject === pIdx}
        />
      ))}
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   CENTER DISPLAY
   ═══════════════════════════════════════════════════════════════════════════ */

const CenterDisplay = memo(function CenterDisplay({ isActive }) {
  return (
    <div className="lpv6-center">
      <motion.div 
        className="lpv6-center__content"
        animate={{ 
          scale: isActive ? 1 : 0.9,
          opacity: isActive ? 1 : 0.4
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="lpv6-center__visual">
          <motion.div 
            className="lpv6-center__circle lpv6-center__circle--design"
            animate={{ 
              x: isActive ? -60 : 0,
              scale: isActive ? 1 : 0.8
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div 
            className="lpv6-center__circle lpv6-center__circle--tech"
            animate={{ 
              x: isActive ? 60 : 0,
              scale: isActive ? 1 : 0.8
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        
        <motion.p 
          className="lpv6-center__hint"
          animate={{ opacity: isActive ? 0.6 : 0 }}
          transition={{ delay: 0.3 }}
        >
          ← Scroll to explore →
        </motion.p>
      </motion.div>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   AREA DISPLAY - Non-center area header
   ═══════════════════════════════════════════════════════════════════════════ */

const AreaDisplay = memo(function AreaDisplay({ area, isActive }) {
  const isDesign = area.category === 'Design'
  
  return (
    <div className={`lpv6-area-display ${isDesign ? 'lpv6-area-display--design' : 'lpv6-area-display--tech'}`}>
      <motion.div 
        className="lpv6-area-display__content"
        animate={{ 
          opacity: isActive ? 1 : 0.3,
          x: isActive ? 0 : (isDesign ? 50 : -50)
        }}
        transition={{ duration: 0.5 }}
      >
        <span className="lpv6-area-display__count">
          {String(area.projects?.length || 0).padStart(2, '0')} Projects
        </span>
      </motion.div>
      
      {/* Large background number */}
      <motion.div 
        className="lpv6-area-display__number"
        animate={{ 
          opacity: isActive ? 0.04 : 0.02,
          scale: isActive ? 1 : 0.95
        }}
      >
        {String(AREAS.indexOf(area) + 1).padStart(2, '0')}
      </motion.div>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT DISPLAY - Individual project slide
   ═══════════════════════════════════════════════════════════════════════════ */

const ProjectDisplay = memo(function ProjectDisplay({ project, index, area, isActive }) {
  const isDesign = area.category === 'Design'
  
  return (
    <motion.div 
      className={`lpv6-project ${isDesign ? 'lpv6-project--design' : 'lpv6-project--tech'}`}
      animate={{
        opacity: isActive ? 1 : 0.2,
      }}
      transition={{ duration: 0.5 }}
    >
      <div className="lpv6-project__inner">
        {/* Number */}
        <motion.div 
          className="lpv6-project__number"
          style={{ color: area.color }}
          animate={{ 
            opacity: isActive ? 0.15 : 0.05,
            scale: isActive ? 1 : 0.9
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.div>
        
        {/* Content */}
        <motion.div 
          className="lpv6-project__content"
          animate={{ 
            y: isActive ? 0 : 30,
            opacity: isActive ? 1 : 0
          }}
          transition={{ duration: 0.5, delay: isActive ? 0.1 : 0 }}
        >
          <span className="lpv6-project__year">{project.year}</span>
          <h3 className="lpv6-project__name">{project.name}</h3>
          <p className="lpv6-project__desc">{project.desc}</p>
          
          <motion.button 
            className="lpv6-project__cta"
            style={{ borderColor: area.color, color: area.color }}
            whileHover={{ 
              backgroundColor: area.color,
              color: '#0a0a0a'
            }}
          >
            View Project
          </motion.button>
        </motion.div>
        
        {/* Visual placeholder */}
        <motion.div 
          className="lpv6-project__visual"
          animate={{ 
            scale: isActive ? 1 : 0.9,
            opacity: isActive ? 1 : 0.3
          }}
          transition={{ duration: 0.6 }}
        >
          <div 
            className="lpv6-project__image"
            style={{ 
              background: `linear-gradient(135deg, ${area.color}15 0%, ${area.color}05 100%)`
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   INDICATORS
   ═══════════════════════════════════════════════════════════════════════════ */

const AreaIndicator = memo(function AreaIndicator({ areas, current, onSelect }) {
  return (
    <div className="lpv6-area-indicator">
      {areas.map((area, idx) => (
        <motion.button
          key={area.id}
          className={`lpv6-area-indicator__dot ${area.isCenter ? 'lpv6-area-indicator__dot--center' : ''}`}
          animate={{
            scale: idx === current ? 1.4 : 1,
            backgroundColor: idx === current ? area.color : 'rgba(255,255,255,0.2)',
          }}
          whileHover={{ scale: 1.3 }}
          onClick={() => onSelect(idx)}
          aria-label={`Go to ${area.name}`}
        />
      ))}
    </div>
  )
})

const ProjectIndicator = memo(function ProjectIndicator({ count, current, color, onSelect }) {
  return (
    <motion.div 
      className="lpv6-project-indicator"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      {/* Header dot */}
      <motion.button
        className="lpv6-project-indicator__dot lpv6-project-indicator__dot--header"
        animate={{
          scale: current === -1 ? 1.4 : 0.8,
          backgroundColor: current === -1 ? color : 'rgba(255,255,255,0.15)',
        }}
        onClick={() => onSelect(-1)}
        aria-label="Go to area header"
      />
      
      {/* Project dots */}
      {Array.from({ length: count }).map((_, idx) => (
        <motion.button
          key={idx}
          className="lpv6-project-indicator__dot"
          animate={{
            scale: idx === current ? 1.4 : 0.8,
            backgroundColor: idx === current ? color : 'rgba(255,255,255,0.15)',
          }}
          onClick={() => onSelect(idx)}
          aria-label={`Go to project ${idx + 1}`}
        />
      ))}
    </motion.div>
  )
})

const ScrollHint = memo(function ScrollHint({ color, direction }) {
  return (
    <motion.div 
      className="lpv6-scroll-hint"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <motion.span 
        className="lpv6-scroll-hint__arrow"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ color }}
      >
        ↓
      </motion.span>
      <span className="lpv6-scroll-hint__text">Scroll to explore</span>
    </motion.div>
  )
})
