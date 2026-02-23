/**
 * THE LIVING PORTRAIT V6 — Akaru.fr Style
 * 
 * How it works (like Akaru.fr):
 * 1. Horizontal scroll snaps between AREAS
 * 2. Once on an area with projects, vertical scroll reveals them
 * 3. After last project, next scroll moves to next area
 * 4. Smooth spring physics throughout
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useMotionValue, useSpring, useTransform, motion, AnimatePresence } from 'framer-motion'
import './living-portrait-v6.css'

// CONTENT DATA
const AREAS = [
  {
    id: 'brand',
    name: 'Brand Identity',
    category: 'Design',
    color: '#ff6b5b',
    desc: 'Visual identity, logos, brand guidelines',
    projects: [
      { id: 'brand-1', name: 'Lumina Studio', desc: 'Complete rebrand for creative agency' },
      { id: 'brand-2', name: 'Verde Organic', desc: 'Sustainable food brand identity' },
    ]
  },
  {
    id: 'uiux',
    name: 'UI/UX Design',
    category: 'Design',
    color: '#ff9a3c',
    desc: 'Interfaces, user experience, prototypes',
    projects: [
      { id: 'ui-1', name: 'FlowState App', desc: 'Productivity app with focus modes' },
      { id: 'ui-2', name: 'Artisan Market', desc: 'E-commerce for handmade goods' },
    ]
  },
  {
    id: 'motion',
    name: 'Motion Design',
    category: 'Design',
    color: '#ffb4a9',
    desc: 'Animation, motion graphics, interactions',
    projects: [
      { id: 'motion-1', name: 'Cosmic Intro', desc: 'Animated brand opener sequence' },
    ]
  },
  {
    id: 'center',
    name: 'Design + Tech',
    category: 'Portfolio',
    color: '#ffffff',
    desc: 'Creative Developer',
    isCenter: true,
    projects: []
  },
  {
    id: 'react',
    name: 'React & Next.js',
    category: 'Tech',
    color: '#00ff88',
    desc: 'Frontend development, SSR, web apps',
    projects: [
      { id: 'react-1', name: 'This Portfolio', desc: 'Horizontal scroll experience' },
      { id: 'react-2', name: 'SaaS Dashboard', desc: 'Real-time analytics platform' },
    ]
  },
  {
    id: 'backend',
    name: 'Node.js & APIs',
    category: 'Tech',
    color: '#00e5ff',
    desc: 'Backend, GraphQL, microservices',
    projects: [
      { id: 'node-1', name: 'GraphQL Gateway', desc: 'Unified API for microservices' },
    ]
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    category: 'Tech',
    color: '#8b5cf6',
    desc: 'Kubernetes, CI/CD, infrastructure',
    projects: [
      { id: 'cloud-1', name: 'K8s Platform', desc: 'Production Kubernetes setup' },
    ]
  },
]

const CENTER_INDEX = 3

export default function LivingPortraitV6() {
  const containerRef = useRef(null)
  
  // Current area index (0-6)
  const [areaIndex, setAreaIndex] = useState(CENTER_INDEX)
  // Current project index within area (-1 = on area header, 0+ = on project)
  const [projectIndex, setProjectIndex] = useState(-1)
  
  // Scroll accumulator for smooth transitions
  const scrollAccumulator = useRef(0)
  const isScrolling = useRef(false)
  const scrollTimeout = useRef(null)
  
  // Animation values
  const xPosition = useMotionValue(-CENTER_INDEX * 100) // vw units
  const yPosition = useMotionValue(0) // vh units
  
  const smoothX = useSpring(xPosition, { stiffness: 50, damping: 20, mass: 0.8 })
  const smoothY = useSpring(yPosition, { stiffness: 50, damping: 20, mass: 0.8 })
  
  // Cursor
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 400 })
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 400 })

  const currentArea = AREAS[areaIndex]
  const projectCount = currentArea?.projects?.length || 0

  // Move to specific area
  const goToArea = useCallback((newAreaIndex) => {
    const clampedIndex = Math.max(0, Math.min(AREAS.length - 1, newAreaIndex))
    setAreaIndex(clampedIndex)
    setProjectIndex(-1)
    xPosition.set(-clampedIndex * 100)
    yPosition.set(0)
  }, [xPosition, yPosition])

  // Move to specific project within current area
  const goToProject = useCallback((newProjectIndex) => {
    const maxProject = projectCount - 1
    const clampedIndex = Math.max(-1, Math.min(maxProject, newProjectIndex))
    setProjectIndex(clampedIndex)
    yPosition.set((clampedIndex + 1) * 100) // +1 because -1 = 0vh, 0 = 100vh, etc.
  }, [projectCount, yPosition])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    
    const delta = e.deltaY
    const threshold = 80 // Sensitivity threshold
    
    // Accumulate scroll
    scrollAccumulator.current += delta
    
    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }
    
    // Reset accumulator after scroll stops
    scrollTimeout.current = setTimeout(() => {
      scrollAccumulator.current = 0
      isScrolling.current = false
    }, 150)
    
    // Only trigger navigation when threshold reached
    if (Math.abs(scrollAccumulator.current) < threshold) return
    
    const direction = scrollAccumulator.current > 0 ? 1 : -1
    scrollAccumulator.current = 0 // Reset after triggering
    
    // Prevent rapid-fire navigation
    if (isScrolling.current) return
    isScrolling.current = true
    setTimeout(() => { isScrolling.current = false }, 400)
    
    const currentProjectCount = AREAS[areaIndex]?.projects?.length || 0
    
    if (currentProjectCount === 0) {
      // No projects → just move horizontally between areas
      goToArea(areaIndex + direction)
    } else {
      // Has projects
      if (direction > 0) {
        // Scrolling DOWN/FORWARD
        if (projectIndex < currentProjectCount - 1) {
          // More projects to show → go to next project
          goToProject(projectIndex + 1)
        } else {
          // At last project → go to next area
          goToArea(areaIndex + 1)
        }
      } else {
        // Scrolling UP/BACKWARD
        if (projectIndex > -1) {
          // On a project → go to previous project (or area header)
          goToProject(projectIndex - 1)
        } else {
          // On area header → go to previous area
          const prevAreaIndex = areaIndex - 1
          if (prevAreaIndex >= 0) {
            const prevProjectCount = AREAS[prevAreaIndex]?.projects?.length || 0
            setAreaIndex(prevAreaIndex)
            setProjectIndex(prevProjectCount - 1) // Go to last project of prev area
            xPosition.set(-prevAreaIndex * 100)
            yPosition.set(prevProjectCount * 100)
          }
        }
      }
    }
  }, [areaIndex, projectIndex, goToArea, goToProject, xPosition, yPosition])

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }, [mouseX, mouseY])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Background gradient based on position
  const designIntensity = useTransform(smoothX, [-300, 0, 300], [0.4, 0, 0])
  const techIntensity = useTransform(smoothX, [-300, 0, 300], [0, 0, 0.4])

  return (
    <div 
      ref={containerRef}
      className="lpv6"
      onMouseMove={handleMouseMove}
    >
      {/* Background */}
      <div className="lpv6-bg">
        <motion.div 
          className="lpv6-bg__warm" 
          style={{ opacity: designIntensity }} 
        />
        <motion.div 
          className="lpv6-bg__cool" 
          style={{ opacity: techIntensity }} 
        />
        <div className="lpv6-bg__noise" />
      </div>
      
      {/* The scrolling world */}
      <motion.div 
        className="lpv6-world"
        style={{ 
          x: useTransform(smoothX, v => `${v}vw`),
          y: useTransform(smoothY, v => `${-v}vh`),
        }}
      >
        {AREAS.map((area, idx) => (
          <AreaPanel
            key={area.id}
            area={area}
            index={idx}
            isActive={idx === areaIndex}
            activeProjectIndex={idx === areaIndex ? projectIndex : -1}
          />
        ))}
      </motion.div>
      
      {/* Cursor */}
      <motion.div 
        className="lpv6-cursor"
        style={{ x: cursorX, y: cursorY }}
      >
        <motion.div 
          className="lpv6-cursor__dot"
          animate={{ backgroundColor: currentArea?.color || '#fff' }}
        />
      </motion.div>
      
      {/* Area indicator (top) */}
      <div className="lpv6-area-indicator">
        {AREAS.map((area, idx) => (
          <motion.div
            key={area.id}
            className={`lpv6-area-indicator__dot ${area.isCenter ? 'lpv6-area-indicator__dot--center' : ''}`}
            animate={{
              scale: idx === areaIndex ? 1.5 : 1,
              backgroundColor: idx === areaIndex ? area.color : 'rgba(255,255,255,0.2)',
            }}
            onClick={() => goToArea(idx)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
      
      {/* Project indicator (right side) - only show when area has projects */}
      <AnimatePresence>
        {projectCount > 0 && (
          <motion.div 
            className="lpv6-project-indicator"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Header dot */}
            <motion.div
              className="lpv6-project-indicator__dot lpv6-project-indicator__dot--header"
              animate={{
                scale: projectIndex === -1 ? 1.5 : 0.8,
                backgroundColor: projectIndex === -1 ? currentArea.color : 'rgba(255,255,255,0.2)',
              }}
              onClick={() => goToProject(-1)}
              style={{ cursor: 'pointer' }}
            />
            {/* Project dots */}
            {currentArea.projects.map((_, pIdx) => (
              <motion.div
                key={pIdx}
                className="lpv6-project-indicator__dot"
                animate={{
                  scale: projectIndex === pIdx ? 1.5 : 0.8,
                  backgroundColor: projectIndex === pIdx ? currentArea.color : 'rgba(255,255,255,0.2)',
                }}
                onClick={() => goToProject(pIdx)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scroll hint */}
      <AnimatePresence>
        {projectCount > 0 && projectIndex === -1 && (
          <motion.div 
            className="lpv6-scroll-hint"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <motion.span 
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ color: currentArea.color }}
            >
              ↓
            </motion.span>
            <span>Scroll to see projects</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   AREA PANEL — Each horizontal section
   ═══════════════════════════════════════════════════════════════════════════ */

const AreaPanel = memo(function AreaPanel({ area, index, isActive, activeProjectIndex }) {
  const isDesign = area.category === 'Design'
  const isCenter = area.isCenter
  const totalSlides = 1 + (area.projects?.length || 0) // header + projects
  
  return (
    <div 
      className="lpv6-area"
      style={{ 
        left: `${index * 100}vw`,
        height: `${totalSlides * 100}vh`,
        '--area-color': area.color,
      }}
    >
      {/* Area Header (first 100vh) */}
      <div className="lpv6-area__header">
        {isCenter ? (
          <CenterContent isActive={isActive && activeProjectIndex === -1} />
        ) : (
          <AreaHeader 
            area={area} 
            isDesign={isDesign} 
            isActive={isActive && activeProjectIndex === -1} 
          />
        )}
      </div>
      
      {/* Projects (each 100vh below) */}
      {area.projects?.map((project, pIdx) => (
        <ProjectSlide
          key={project.id}
          project={project}
          index={pIdx}
          areaColor={area.color}
          isDesign={isDesign}
          isActive={isActive && activeProjectIndex === pIdx}
        />
      ))}
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   CENTER CONTENT
   ═══════════════════════════════════════════════════════════════════════════ */

const CenterContent = memo(function CenterContent({ isActive }) {
  return (
    <div className="lpv6-center">
      <motion.h1 
        className="lpv6-center__title"
        animate={{ 
          scale: isActive ? 1 : 0.9,
          opacity: isActive ? 1 : 0.5 
        }}
        transition={{ duration: 0.5 }}
      >
        <span className="lpv6-center__design">Design</span>
        <span className="lpv6-center__plus">+</span>
        <span className="lpv6-center__tech">Tech</span>
      </motion.h1>
      
      <motion.p 
        className="lpv6-center__subtitle"
        animate={{ opacity: isActive ? 0.6 : 0 }}
      >
        Creative Developer Portfolio
      </motion.p>
      
      <motion.div 
        className="lpv6-center__hint"
        animate={{ opacity: isActive ? 1 : 0 }}
      >
        <span>← Design</span>
        <span className="lpv6-center__scroll-icon">⟷</span>
        <span>Tech →</span>
      </motion.div>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   AREA HEADER
   ═══════════════════════════════════════════════════════════════════════════ */

const AreaHeader = memo(function AreaHeader({ area, isDesign, isActive }) {
  return (
    <motion.div 
      className={`lpv6-area-header ${isDesign ? 'lpv6-area-header--design' : 'lpv6-area-header--tech'}`}
      animate={{ 
        opacity: isActive ? 1 : 0.3,
        x: isActive ? 0 : (isDesign ? 30 : -30),
      }}
      transition={{ duration: 0.5 }}
    >
      <span className="lpv6-area-header__category">{area.category}</span>
      <h2 className="lpv6-area-header__name">{area.name}</h2>
      <p className="lpv6-area-header__desc">{area.desc}</p>
      {area.projects?.length > 0 && (
        <span className="lpv6-area-header__count">
          {area.projects.length} project{area.projects.length > 1 ? 's' : ''}
        </span>
      )}
    </motion.div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT SLIDE — Full viewport project display
   ═══════════════════════════════════════════════════════════════════════════ */

const ProjectSlide = memo(function ProjectSlide({ project, index, areaColor, isDesign, isActive }) {
  return (
    <motion.div 
      className={`lpv6-project ${isDesign ? 'lpv6-project--design' : 'lpv6-project--tech'}`}
      style={{ '--project-color': areaColor }}
      animate={{
        opacity: isActive ? 1 : 0.3,
        scale: isActive ? 1 : 0.95,
      }}
      transition={{ duration: 0.4 }}
    >
      {/* Large number background */}
      <div className="lpv6-project__number">
        {String(index + 1).padStart(2, '0')}
      </div>
      
      {/* Content */}
      <div className="lpv6-project__content">
        <h3 className="lpv6-project__name">{project.name}</h3>
        <p className="lpv6-project__desc">{project.desc}</p>
      </div>
      
      {/* Visual placeholder */}
      <div className="lpv6-project__visual">
        <div className="lpv6-project__image-placeholder" />
      </div>
    </motion.div>
  )
})
