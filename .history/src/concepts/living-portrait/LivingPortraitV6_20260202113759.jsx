/**
 * THE LIVING PORTRAIT V6 — Simple Horizontal Scroll
 * 
 * Simplified approach:
 * - ONE continuous horizontal scroll through all content
 * - Areas and their projects are all horizontal slides
 * - Much more intuitive navigation
 */

import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react'
import { useMotionValue, useSpring, useTransform, motion, AnimatePresence } from 'framer-motion'
import './living-portrait-v6.css'

// CONTENT DATA
const AREAS = [
  {
    id: 'brand',
    name: 'Brand Identity',
    category: 'Design',
    color: '#ff6b5b',
    desc: 'Identité visuelle, logos, chartes graphiques',
    projects: [
      { id: 'brand-1', name: 'Lumina Studio', desc: 'Complete rebrand for creative agency' },
      { id: 'brand-2', name: 'Verde Organic', desc: 'Sustainable food brand identity' },
      { id: 'brand-3', name: 'Nexus Finance', desc: 'Fintech startup visual system' },
    ]
  },
  {
    id: 'uiux',
    name: 'UI/UX Design',
    category: 'Design',
    color: '#ff9a3c',
    desc: 'Interfaces, expérience utilisateur, prototypes',
    projects: [
      { id: 'ui-1', name: 'FlowState App', desc: 'Productivity app with focus modes' },
      { id: 'ui-2', name: 'Artisan Market', desc: 'E-commerce for handmade goods' },
      { id: 'ui-3', name: 'HealthPulse', desc: 'Medical dashboard redesign' },
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
      { id: 'motion-2', name: 'Data Stories', desc: 'Infographic animation series' },
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
    desc: 'Frontend development, SSR, applications web',
    projects: [
      { id: 'react-1', name: 'This Portfolio', desc: 'Horizontal scroll experience' },
      { id: 'react-2', name: 'SaaS Dashboard', desc: 'Real-time analytics platform' },
      { id: 'react-3', name: 'E-Learning Hub', desc: 'Interactive course platform' },
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
      { id: 'node-2', name: 'Auth System', desc: 'OAuth2 + JWT implementation' },
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
      { id: 'cloud-2', name: 'CI/CD Pipeline', desc: 'GitHub Actions + ArgoCD' },
    ]
  },
]

// Build flat list of all slides (areas + their projects)
function buildSlides(areas) {
  const slides = []
  let centerSlideIndex = 0
  
  areas.forEach((area, areaIndex) => {
    if (area.isCenter) {
      centerSlideIndex = slides.length
    }
    
    // Add area header slide
    slides.push({
      type: 'area',
      area,
      areaIndex,
      id: area.id,
    })
    
    // Add project slides for this area
    if (area.projects?.length) {
      area.projects.forEach((project, pIndex) => {
        slides.push({
          type: 'project',
          area,
          areaIndex,
          project,
          projectIndex: pIndex,
          id: project.id,
        })
      })
    }
  })
  
  return { slides, centerSlideIndex }
}

export default function LivingPortraitV6() {
  const containerRef = useRef(null)
  
  const { slides, centerSlideIndex } = useMemo(() => buildSlides(AREAS), [])
  const [activeAreaIndex, setActiveAreaIndex] = useState(CENTER_INDEX)
  const [activeProjectIndex, setActiveProjectIndex] = useState(-1)
  
  const scrollX = useMotionValue(0)
  const scrollY = useMotionValue(0)
  
  const smoothX = useSpring(scrollX, { stiffness: 60, damping: 25, mass: 1 })
  const smoothY = useSpring(scrollY, { stiffness: 60, damping: 25, mass: 1 })
  
  const worldX = useTransform(smoothX, v => -v)
  const worldY = useTransform(smoothY, v => -v)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cursorX = useSpring(mouseX, { damping: 20, stiffness: 300 })
  const cursorY = useSpring(mouseY, { damping: 20, stiffness: 300 })

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }, [mouseX, mouseY])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    
    const currentX = scrollX.get()
    const currentY = scrollY.get()
    const delta = e.deltaY
    const sectionWidth = window.innerWidth
    const sectionHeight = window.innerHeight
    
    // Calculate current area from X position
    const rawAreaIndex = Math.round(currentX / sectionWidth) + CENTER_INDEX
    const areaIndex = Math.max(0, Math.min(AREAS.length - 1, rawAreaIndex))
    const currentArea = AREAS[areaIndex]
    const projectCount = currentArea?.projects?.length || 0
    
    const maxX = (AREAS.length - 1 - CENTER_INDEX) * sectionWidth
    const minX = -CENTER_INDEX * sectionWidth
    const maxY = projectCount * sectionHeight
    
    // No projects in this area → always horizontal scroll
    if (projectCount === 0) {
      const newX = currentX + delta * 1.2
      const clampedX = Math.max(minX, Math.min(maxX, newX))
      scrollX.set(clampedX)
      return
    }
    
    // Has projects - decide between horizontal and vertical
    const isAtTop = currentY <= 5
    const isScrollingDown = delta > 0
    const isScrollingUp = delta < 0
    
    if (isAtTop && isScrollingUp) {
      // At top, scrolling up → horizontal navigation
      const newX = currentX + delta * 1.2
      const clampedX = Math.max(minX, Math.min(maxX, newX))
      scrollX.set(clampedX)
    } else if (isAtTop && isScrollingDown) {
      // At top with projects, scrolling down → start vertical scroll into projects
      const newY = Math.min(maxY, currentY + delta * 0.8)
      scrollY.set(newY)
    } else {
      // In the middle of projects → vertical scroll
      const newY = currentY + delta * 0.8
      const clampedY = Math.max(0, Math.min(maxY, newY))
      scrollY.set(clampedY)
    }
  }, [scrollX, scrollY])

  useEffect(() => {
    const unsubX = smoothX.on('change', (x) => {
      const sectionWidth = typeof window !== 'undefined' ? window.innerWidth : 1000
      const rawIndex = Math.round(x / sectionWidth) + CENTER_INDEX
      const index = Math.max(0, Math.min(AREAS.length - 1, rawIndex))
      setActiveAreaIndex(index)
    })
    
    const unsubY = smoothY.on('change', (y) => {
      const sectionHeight = typeof window !== 'undefined' ? window.innerHeight : 800
      const projectIndex = Math.floor(y / sectionHeight)
      setActiveProjectIndex(y < sectionHeight * 0.3 ? -1 : projectIndex)
    })
    
    return () => {
      unsubX()
      unsubY()
    }
  }, [smoothX, smoothY])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const identity = useTransform(smoothX,
    [-CENTER_INDEX * 1000, 0, (AREAS.length - 1 - CENTER_INDEX) * 1000],
    [0, 0.5, 1]
  )

  const activeArea = AREAS[activeAreaIndex]

  return (
    <div 
      ref={containerRef}
      className="lpv6"
      onMouseMove={handleMouseMove}
    >
      <GradientBackground identity={identity} />
      
      <motion.div 
        className="lpv6-world"
        style={{ x: worldX, y: worldY }}
      >
        {AREAS.map((area, index) => (
          <AreaSection
            key={area.id}
            area={area}
            index={index}
            isActive={index === activeAreaIndex}
            activeProjectIndex={activeProjectIndex}
          />
        ))}
      </motion.div>
      
      <Cursor cursorX={cursorX} cursorY={cursorY} color={activeArea?.color} />
      <AreaIndicator areas={AREAS} activeIndex={activeAreaIndex} />
      
      <AnimatePresence>
        {activeArea?.projects?.length > 0 && activeProjectIndex === -1 && (
          <ScrollHint color={activeArea.color} />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {activeArea?.projects?.length > 0 && (
          <ProjectIndicator 
            projects={activeArea.projects} 
            activeIndex={activeProjectIndex}
            color={activeArea.color}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const AreaSection = memo(function AreaSection({ area, index, isActive, activeProjectIndex }) {
  const isDesign = area.category === 'Design'
  const isCenter = area.isCenter
  const totalHeight = 100 + (area.projects?.length || 0) * PROJECT_HEIGHT
  
  return (
    <div 
      className={`lpv6-area lpv6-area--${area.category?.toLowerCase() || 'center'}`}
      style={{ 
        left: `${index * 100}vw`,
        height: `${totalHeight}vh`,
        '--area-color': area.color,
      }}
    >
      <div className="lpv6-area__header">
        {isCenter ? (
          <CenterContent isActive={isActive} />
        ) : (
          <AreaHeader area={area} isActive={isActive} isDesign={isDesign} />
        )}
      </div>
      
      {area.projects && area.projects.length > 0 && (
        <div className="lpv6-area__projects-stack">
          {area.projects.map((project, pIndex) => (
            <ProjectSection
              key={project.id}
              project={project}
              index={pIndex}
              isActive={isActive && pIndex === activeProjectIndex}
              areaColor={area.color}
              isDesign={isDesign}
            />
          ))}
        </div>
      )}
    </div>
  )
})

const CenterContent = memo(function CenterContent({ isActive }) {
  return (
    <div className="lpv6-center">
      <motion.div 
        className="lpv6-center__title"
        animate={{ 
          scale: isActive ? 1 : 0.85,
          opacity: isActive ? 1 : 0.4
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="lpv6-center__design">Design</span>
        <span className="lpv6-center__plus">+</span>
        <span className="lpv6-center__tech">Tech</span>
      </motion.div>
      
      <motion.p 
        className="lpv6-center__subtitle"
        animate={{ opacity: isActive ? 0.6 : 0 }}
        transition={{ duration: 0.4, delay: isActive ? 0.2 : 0 }}
      >
        Creative Developer Portfolio
      </motion.p>
      
      <motion.div 
        className="lpv6-center__hint"
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <span>← Design</span>
        <span className="lpv6-center__scroll-icon">⟷</span>
        <span>Tech →</span>
      </motion.div>
    </div>
  )
})

const AreaHeader = memo(function AreaHeader({ area, isActive, isDesign }) {
  return (
    <motion.div 
      className={`lpv6-area-header ${isDesign ? 'lpv6-area-header--design' : 'lpv6-area-header--tech'}`}
      animate={{ opacity: isActive ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <span className="lpv6-area-header__category">{area.category}</span>
      <h2 className="lpv6-area-header__name">{area.name}</h2>
      <p className="lpv6-area-header__desc">{area.desc}</p>
      
      {area.projects?.length > 0 && (
        <div className="lpv6-area-header__project-count">
          {area.projects.length} {area.projects.length === 1 ? 'Project' : 'Projects'}
        </div>
      )}
    </motion.div>
  )
})

const ProjectSection = memo(function ProjectSection({ project, index, isActive, areaColor, isDesign }) {
  return (
    <motion.div 
      className={`lpv6-project ${isDesign ? 'lpv6-project--design' : 'lpv6-project--tech'}`}
      style={{ '--project-color': areaColor }}
      animate={{
        opacity: isActive ? 1 : 0.4,
        scale: isActive ? 1 : 0.95,
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="lpv6-project__number">
        {String(index + 1).padStart(2, '0')}
      </div>
      
      <div className="lpv6-project__content">
        <h3 className="lpv6-project__name">{project.name}</h3>
        <p className="lpv6-project__desc">{project.desc}</p>
      </div>
      
      <div className="lpv6-project__visual">
        <div className="lpv6-project__image-placeholder" />
      </div>
      
      <motion.div 
        className="lpv6-project__accent"
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  )
})

const GradientBackground = memo(function GradientBackground({ identity }) {
  const warmOpacity = useTransform(identity, [0, 0.5, 1], [0.35, 0.08, 0])
  const coolOpacity = useTransform(identity, [0, 0.5, 1], [0, 0.08, 0.35])
  
  return (
    <div className="lpv6-bg">
      <motion.div className="lpv6-bg__warm" style={{ opacity: warmOpacity }} />
      <motion.div className="lpv6-bg__cool" style={{ opacity: coolOpacity }} />
      <div className="lpv6-bg__noise" />
    </div>
  )
})

const Cursor = memo(function Cursor({ cursorX, cursorY, color }) {
  return (
    <motion.div 
      className="lpv6-cursor"
      style={{ x: cursorX, y: cursorY }}
    >
      <motion.div 
        className="lpv6-cursor__dot"
        animate={{ backgroundColor: color || '#fff' }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
})

const AreaIndicator = memo(function AreaIndicator({ areas, activeIndex }) {
  return (
    <div className="lpv6-area-indicator">
      {areas.map((area, index) => (
        <motion.div
          key={area.id}
          className={`lpv6-area-indicator__dot ${area.isCenter ? 'lpv6-area-indicator__dot--center' : ''}`}
          animate={{
            scale: index === activeIndex ? 1.4 : 1,
            backgroundColor: index === activeIndex ? area.color : 'rgba(255,255,255,0.25)',
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
})

const ProjectIndicator = memo(function ProjectIndicator({ projects, activeIndex, color }) {
  return (
    <motion.div 
      className="lpv6-project-indicator"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <motion.div
        className="lpv6-project-indicator__dot lpv6-project-indicator__dot--header"
        animate={{
          scale: activeIndex === -1 ? 1.3 : 0.8,
          backgroundColor: activeIndex === -1 ? color : 'rgba(255,255,255,0.2)',
        }}
      />
      
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          className="lpv6-project-indicator__dot"
          animate={{
            scale: index === activeIndex ? 1.3 : 0.8,
            backgroundColor: index === activeIndex ? color : 'rgba(255,255,255,0.2)',
          }}
        />
      ))}
    </motion.div>
  )
})

const ScrollHint = memo(function ScrollHint({ color }) {
  return (
    <motion.div 
      className="lpv6-scroll-hint"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <motion.div 
        className="lpv6-scroll-hint__arrow"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ color }}
      >
        ↓
      </motion.div>
      <span>Scroll to explore projects</span>
    </motion.div>
  )
})
