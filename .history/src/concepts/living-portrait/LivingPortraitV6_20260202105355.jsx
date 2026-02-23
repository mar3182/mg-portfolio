/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE LIVING PORTRAIT V6 — Akaru-style Horizontal + Vertical Scroll
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Like Akaru.fr:
 * - Horizontal scroll reveals AREAS (expertise categories)
 * - Vertical scroll within each area reveals PROJECTS
 * 
 * Layout:
 * ← Brand | UI/UX | Motion | [CENTER] | React | Node | Cloud →
 *                              ↓
 *                         (projects)
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion'
import './living-portrait-v6.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT — Areas with their projects
// ═══════════════════════════════════════════════════════════════════════════

const AREAS = [
  // Design side (left)
  {
    id: 'brand',
    name: 'Brand Identity',
    category: 'Design',
    color: '#ff6b5b',
    desc: 'Identité visuelle, logos, chartes graphiques',
    projects: [
      { id: 'brand-1', name: 'Lumina Studio', desc: 'Complete rebrand for creative agency', image: null },
      { id: 'brand-2', name: 'Verde Organic', desc: 'Sustainable food brand identity', image: null },
      { id: 'brand-3', name: 'Nexus Finance', desc: 'Fintech startup visual system', image: null },
    ]
  },
  {
    id: 'uiux',
    name: 'UI/UX Design',
    category: 'Design',
    color: '#ff9a3c',
    desc: 'Interfaces, expérience utilisateur, prototypes',
    projects: [
      { id: 'ui-1', name: 'FlowState App', desc: 'Productivity app with focus modes', image: null },
      { id: 'ui-2', name: 'Artisan Market', desc: 'E-commerce for handmade goods', image: null },
      { id: 'ui-3', name: 'HealthPulse', desc: 'Medical dashboard redesign', image: null },
    ]
  },
  {
    id: 'motion',
    name: 'Motion Design',
    category: 'Design',
    color: '#ffb4a9',
    desc: 'Animation, motion graphics, interactions',
    projects: [
      { id: 'motion-1', name: 'Cosmic Intro', desc: 'Animated brand opener sequence', image: null },
      { id: 'motion-2', name: 'Data Stories', desc: 'Infographic animation series', image: null },
    ]
  },
  
  // Center
  {
    id: 'center',
    name: 'Design + Tech',
    category: 'Portfolio',
    color: '#ffffff',
    desc: 'Creative Developer',
    isCenter: true,
    projects: []
  },
  
  // Tech side (right)
  {
    id: 'react',
    name: 'React & Next.js',
    category: 'Tech',
    color: '#00ff88',
    desc: 'Frontend development, SSR, applications web',
    projects: [
      { id: 'react-1', name: 'This Portfolio', desc: 'Horizontal scroll experience', image: null },
      { id: 'react-2', name: 'SaaS Dashboard', desc: 'Real-time analytics platform', image: null },
      { id: 'react-3', name: 'E-Learning Hub', desc: 'Interactive course platform', image: null },
    ]
  },
  {
    id: 'backend',
    name: 'Node.js & APIs',
    category: 'Tech',
    color: '#00e5ff',
    desc: 'Backend, GraphQL, microservices',
    projects: [
      { id: 'node-1', name: 'GraphQL Gateway', desc: 'Unified API for microservices', image: null },
      { id: 'node-2', name: 'Auth System', desc: 'OAuth2 + JWT implementation', image: null },
    ]
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    category: 'Tech',
    color: '#8b5cf6',
    desc: 'Kubernetes, CI/CD, infrastructure',
    projects: [
      { id: 'cloud-1', name: 'K8s Platform', desc: 'Production Kubernetes setup', image: null },
      { id: 'cloud-2', name: 'CI/CD Pipeline', desc: 'GitHub Actions + ArgoCD', image: null },
    ]
  },
]

const CENTER_INDEX = 3 // Index of center area

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitV6() {
  const containerRef = useRef(null)
  const [activeAreaIndex, setActiveAreaIndex] = useState(CENTER_INDEX)
  
  // Horizontal scroll position (which area)
  const scrollX = useMotionValue(0)
  const smoothX = useSpring(scrollX, { stiffness: 50, damping: 30 })
  
  // World transform - only horizontal
  const worldX = useTransform(smoothX, v => -v)
  const worldY = useTransform(smoothY, v => -v)
  
  // Mouse for cursor
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 200 })
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 200 })

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }, [mouseX, mouseY])

  // Handle scroll - Simplified Akaru style
  // deltaY (vertical scroll) always controls HORIZONTAL movement
  // This is exactly how Akaru.fr works - scroll down = move right
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    
    const currentX = scrollX.get()
    const delta = e.deltaY
    
    const sectionWidth = window.innerWidth
    
    // Calculate bounds
    const maxX = (AREAS.length - 1 - CENTER_INDEX) * sectionWidth
    const minX = -CENTER_INDEX * sectionWidth
    
    // Just scroll horizontally - simple and intuitive
    const newX = currentX + delta * 1.0
    const clampedX = Math.max(minX, Math.min(maxX, newX))
    
    scrollX.set(clampedX)
  }, [scrollX])

  // Track active area
  useEffect(() => {
    const unsubX = smoothX.on('change', (v) => {
      const sectionWidth = window.innerWidth
      const index = Math.round(v / sectionWidth) + CENTER_INDEX
      const clamped = Math.max(0, Math.min(AREAS.length - 1, index))
      if (clamped !== activeAreaIndex) {
        setActiveAreaIndex(clamped)
      }
    })
    
    return () => unsubX()
  }, [smoothX, activeAreaIndex])

  // Identity for color transitions (0 = design, 0.5 = center, 1 = tech)
  const identity = useTransform(smoothX,
    [-CENTER_INDEX * (typeof window !== 'undefined' ? window.innerWidth : 1000), 0, (AREAS.length - 1 - CENTER_INDEX) * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
    [0, 0.5, 1]
  )

  const activeArea = AREAS[activeAreaIndex]

  return (
    <div 
      ref={containerRef}
      className="lpv6"
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
    >
      <GradientBackground identity={identity} />
      
      {/* THE WORLD - moves horizontally only */}
      <motion.div 
        className="lpv6-world"
        style={{ x: worldX }}
      >
        {AREAS.map((area, index) => (
          <AreaSection
            key={area.id}
            area={area}
            index={index}
            isActive={index === activeAreaIndex}
          />
        ))}
      </motion.div>
      
      {/* Fixed UI */}
      <Cursor cursorX={cursorX} cursorY={cursorY} color={activeArea?.color} />
      <AreaIndicator areas={AREAS} activeIndex={activeAreaIndex} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// AREA SECTION — Horizontal section with vertical project list
// ═══════════════════════════════════════════════════════════════════════════

const AreaSection = memo(function AreaSection({ area, index, isActive, activeProjectIndex }) {
  const isDesign = area.category === 'Design'
  const isTech = area.category === 'Tech'
  const isCenter = area.isCenter
  
  return (
    <div 
      className={`lpv6-area lpv6-area--${area.category?.toLowerCase() || 'center'}`}
      style={{ 
        left: `${index * 100}vw`,
        '--area-color': area.color,
      }}
    >
      {/* Area Header (always visible at top) */}
      <motion.div 
        className="lpv6-area__header"
        animate={{ opacity: isActive ? 1 : 0.3 }}
      >
        {!isCenter && (
          <span className="lpv6-area__category">{area.category}</span>
        )}
        <h2 className="lpv6-area__name">{area.name}</h2>
        <p className="lpv6-area__desc">{area.desc}</p>
      </motion.div>
      
      {/* Projects (flow vertically below) */}
      {area.projects && area.projects.length > 0 && (
        <div className="lpv6-area__projects">
          {area.projects.map((project, pIndex) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={pIndex}
              isActive={isActive && pIndex === activeProjectIndex}
              areaColor={area.color}
              side={isDesign ? 'design' : 'tech'}
            />
          ))}
        </div>
      )}
      
      {/* Center special content */}
      {isCenter && (
        <div className="lpv6-center-content">
          <motion.div 
            className="lpv6-center-title"
            animate={{ scale: isActive ? 1 : 0.9 }}
          >
            <span className="lpv6-center-title__design">Design</span>
            <span className="lpv6-center-title__plus">+</span>
            <span className="lpv6-center-title__tech">Tech</span>
          </motion.div>
        </div>
      )}
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT CARD — Individual project within an area
// ═══════════════════════════════════════════════════════════════════════════

const ProjectCard = memo(function ProjectCard({ project, index, isActive, areaColor, side }) {
  return (
    <motion.div 
      className={`lpv6-project lpv6-project--${side}`}
      style={{ 
        top: `${(index + 1) * 80}vh`, // First project at 80vh, then 160vh, etc
        '--project-color': areaColor,
      }}
      animate={{
        opacity: isActive ? 1 : 0.4,
        scale: isActive ? 1 : 0.95,
        x: isActive ? 0 : (side === 'design' ? -30 : 30),
      }}
      transition={{ duration: 0.4 }}
    >
      <div className="lpv6-project__index">
        {String(index + 1).padStart(2, '0')}
      </div>
      
      <div className="lpv6-project__content">
        <h3 className="lpv6-project__name">{project.name}</h3>
        <p className="lpv6-project__desc">{project.desc}</p>
      </div>
      
      <div className="lpv6-project__visual">
        <div className="lpv6-project__placeholder" />
      </div>
      
      <motion.div 
        className="lpv6-project__accent"
        animate={{ scaleX: isActive ? 1 : 0 }}
      />
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════

const GradientBackground = memo(function GradientBackground({ identity }) {
  const warmOpacity = useTransform(identity, [0, 0.5, 1], [0.35, 0.1, 0])
  const coolOpacity = useTransform(identity, [0, 0.5, 1], [0, 0.1, 0.35])
  
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

const Cursor = memo(function Cursor({ cursorX, cursorY, color }) {
  return (
    <motion.div
      className="lpv6-cursor"
      style={{ x: cursorX, y: cursorY }}
    >
      <motion.div 
        className="lpv6-cursor__dot" 
        animate={{ backgroundColor: color || '#ffffff' }}
      />
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// AREA INDICATOR — Horizontal dots showing areas
// ═══════════════════════════════════════════════════════════════════════════

const AreaIndicator = memo(function AreaIndicator({ areas, activeIndex }) {
  return (
    <div className="lpv6-area-indicator">
      {areas.map((area, index) => (
        <motion.div
          key={area.id}
          className="lpv6-area-indicator__dot"
          animate={{
            scale: index === activeIndex ? 1.5 : 1,
            backgroundColor: index === activeIndex ? area.color : 'rgba(255,255,255,0.3)',
          }}
        />
      ))}
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT INDICATOR — Vertical dots showing projects in current area
// ═══════════════════════════════════════════════════════════════════════════

const ProjectIndicator = memo(function ProjectIndicator({ area, activeProjectIndex, scrollY }) {
  if (!area || !area.projects || area.projects.length === 0) return null
  
  return (
    <motion.div 
      className="lpv6-project-indicator"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {area.projects.map((project, index) => (
        <motion.div
          key={project.id}
          className="lpv6-project-indicator__dot"
          animate={{
            scale: index === activeProjectIndex ? 1.5 : 1,
            backgroundColor: index === activeProjectIndex ? area.color : 'rgba(255,255,255,0.3)',
          }}
        />
      ))}
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL HINT
// ═══════════════════════════════════════════════════════════════════════════

const ScrollHint = memo(function ScrollHint({ activeArea, scrollY }) {
  const hasProjects = activeArea?.projects?.length > 0
  const y = useTransform(scrollY, v => v > 50 ? 30 : 0)
  const opacity = useTransform(scrollY, [0, 100], [1, 0])
  
  if (!hasProjects) return null
  
  return (
    <motion.div 
      className="lpv6-scroll-hint"
      style={{ y, opacity }}
    >
      <motion.span
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ↓
      </motion.span>
      <span>Scroll to see projects</span>
    </motion.div>
  )
})
