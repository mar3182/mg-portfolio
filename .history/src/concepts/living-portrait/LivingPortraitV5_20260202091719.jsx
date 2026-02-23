/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE LIVING PORTRAIT V5 — T-Navigation System
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Navigation Architecture:
 * 
 * HORIZONTAL AXIS (Identity):
 *   ← Design World ←――――― Center ―――――→ Tech World →
 *   (Organic, warm)    (Portrait)    (Structural, cool)
 * 
 * VERTICAL AXIS (Depth):
 *   Each area contains projects revealed by vertical scrolling
 *   ↑ Scroll up to see previous projects
 *   ↓ Scroll down to explore deeper
 * 
 * Design Areas: Brand Identity, UI/UX, Motion Graphics, Print, Illustration
 * Tech Areas: React/Next.js, Node.js/APIs, Cloud/DevOps, AI/ML, Mobile
 */

import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react'
import { useMotionValue, useSpring, useTransform, AnimatePresence, motion } from 'framer-motion'
import './living-portrait-v5.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT DATA — Areas with nested projects
// ═══════════════════════════════════════════════════════════════════════════

const AREAS = {
  design: [
    {
      id: 'brand',
      name: 'Brand Identity',
      icon: '◇',
      color: '#ff6b5b',
      position: 0.12, // horizontal position
      projects: [
        { id: 'brand-1', name: 'Lumina Studio', desc: 'Complete rebrand for creative agency', year: '2024' },
        { id: 'brand-2', name: 'Verde Organic', desc: 'Sustainable food brand identity', year: '2024' },
        { id: 'brand-3', name: 'Nexus Finance', desc: 'Fintech startup visual system', year: '2023' },
      ]
    },
    {
      id: 'uiux',
      name: 'UI/UX Design',
      icon: '▢',
      color: '#ff9a3c',
      position: 0.22,
      projects: [
        { id: 'ui-1', name: 'FlowState App', desc: 'Productivity app with focus modes', year: '2024' },
        { id: 'ui-2', name: 'Artisan Market', desc: 'E-commerce for handmade goods', year: '2024' },
        { id: 'ui-3', name: 'HealthPulse', desc: 'Medical dashboard redesign', year: '2023' },
      ]
    },
    {
      id: 'motion',
      name: 'Motion Graphics',
      icon: '○',
      color: '#ffb4a9',
      position: 0.32,
      projects: [
        { id: 'motion-1', name: 'Cosmic Intro', desc: 'Animated brand opener sequence', year: '2024' },
        { id: 'motion-2', name: 'Data Stories', desc: 'Infographic animation series', year: '2024' },
        { id: 'motion-3', name: 'Fluid Transitions', desc: 'UI micro-interaction library', year: '2023' },
      ]
    },
  ],
  tech: [
    {
      id: 'react',
      name: 'React & Next.js',
      icon: '⬢',
      color: '#00ff88',
      position: 0.68,
      projects: [
        { id: 'react-1', name: 'This Portfolio', desc: 'Living portrait with T-navigation', year: '2024' },
        { id: 'react-2', name: 'SaaS Dashboard', desc: 'Real-time analytics platform', year: '2024' },
        { id: 'react-3', name: 'E-Learning Hub', desc: 'Interactive course platform', year: '2023' },
      ]
    },
    {
      id: 'backend',
      name: 'Node.js & APIs',
      icon: '⬡',
      color: '#00e5ff',
      position: 0.78,
      projects: [
        { id: 'node-1', name: 'GraphQL Gateway', desc: 'Unified API for microservices', year: '2024' },
        { id: 'node-2', name: 'Auth System', desc: 'OAuth2 + JWT implementation', year: '2024' },
        { id: 'node-3', name: 'Event Pipeline', desc: 'Kafka-based event processing', year: '2023' },
      ]
    },
    {
      id: 'cloud',
      name: 'Cloud & DevOps',
      icon: '△',
      color: '#8b5cf6',
      position: 0.88,
      projects: [
        { id: 'cloud-1', name: 'K8s Platform', desc: 'Production Kubernetes setup', year: '2024' },
        { id: 'cloud-2', name: 'CI/CD Pipeline', desc: 'GitHub Actions + ArgoCD', year: '2024' },
        { id: 'cloud-3', name: 'Terraform Infra', desc: 'Multi-cloud IaC templates', year: '2023' },
      ]
    },
  ]
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  spring: {
    stiffness: 50,
    damping: 30,
    mass: 1.2,
  },
  cursorSpring: {
    damping: 25,
    stiffness: 200,
  },
  verticalSpring: {
    stiffness: 80,
    damping: 25,
  },
  // Area detection threshold (how close to center of area to "activate")
  areaThreshold: 0.08,
  // Project spacing in vertical scroll
  projectSpacing: 180,
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitV5() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeArea, setActiveArea] = useState(null)
  const [activeProject, setActiveProject] = useState(null)
  const [cursorVariant, setCursorVariant] = useState('default')
  
  // Horizontal identity (0 = full design, 1 = full tech)
  const mouseXRaw = useMotionValue(0.5)
  const mouseYRaw = useMotionValue(0.5)
  const identity = useSpring(mouseXRaw, CONFIG.spring)
  
  // Vertical depth (scroll position within an area)
  const scrollY = useMotionValue(0)
  const verticalDepth = useSpring(scrollY, CONFIG.verticalSpring)
  
  // Pixel-based mouse for cursor
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cursorX = useSpring(mouseX, CONFIG.cursorSpring)
  const cursorY = useSpring(mouseY, CONFIG.cursorSpring)
  
  // Detect which area the cursor is near
  const detectActiveArea = useCallback((x) => {
    const allAreas = [...AREAS.design, ...AREAS.tech]
    for (const area of allAreas) {
      if (Math.abs(x - area.position) < CONFIG.areaThreshold) {
        return area
      }
    }
    return null
  }, [])
  
  // Handle mouse movement (horizontal navigation)
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const normalizedX = e.clientX / rect.width
    const normalizedY = e.clientY / rect.height
    
    mouseXRaw.set(normalizedX)
    mouseYRaw.set(normalizedY)
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
    
    // Check if hovering over an area
    const area = detectActiveArea(normalizedX)
    if (area !== activeArea) {
      setActiveArea(area)
    }
  }, [mouseXRaw, mouseYRaw, mouseX, mouseY, activeArea, detectActiveArea])
  
  // Handle scroll (vertical navigation within areas)
  const handleWheel = useCallback((e) => {
    if (activeArea) {
      e.preventDefault()
      const newScroll = scrollY.get() + e.deltaY * 0.5
      const maxScroll = (activeArea.projects.length - 1) * CONFIG.projectSpacing
      scrollY.set(Math.max(0, Math.min(maxScroll, newScroll)))
    }
  }, [activeArea, scrollY])
  
  // Reset scroll when leaving area
  useEffect(() => {
    if (!activeArea) {
      scrollY.set(0)
      setActiveProject(null)
    }
  }, [activeArea, scrollY])
  
  // Determine active project based on scroll
  useEffect(() => {
    if (activeArea) {
      const unsubscribe = verticalDepth.on('change', (v) => {
        const projectIndex = Math.round(v / CONFIG.projectSpacing)
        const project = activeArea.projects[Math.min(projectIndex, activeArea.projects.length - 1)]
        if (project && project !== activeProject) {
          setActiveProject(project)
        }
      })
      return () => unsubscribe()
    }
  }, [activeArea, verticalDepth, activeProject])
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <motion.div 
      ref={containerRef}
      className="living-portrait-v5"
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background layers */}
      <GradientBackground identity={identity} />
      <VideoBackgrounds identity={identity} />
      <WorldDecorations identity={identity} />
      
      {/* Custom cursor */}
      <PlusLoupe 
        cursorX={cursorX} 
        cursorY={cursorY} 
        identity={identity}
        activeArea={activeArea}
      />
      
      {/* Navigation */}
      <Navigation 
        onHover={() => setCursorVariant('link')}
        onLeave={() => setCursorVariant('default')}
        identity={identity}
      />
      
      {/* Main content */}
      <main className="lpv5-main">
        {/* Central portrait and title */}
        <SplitPortrait identity={identity} />
        <AnimatedTitle identity={identity} isLoaded={isLoaded} />
        
        {/* Area markers (horizontal) */}
        <AreaMarkers 
          identity={identity} 
          activeArea={activeArea}
          onHover={() => setCursorVariant('view')}
          onLeave={() => setCursorVariant('default')}
        />
        
        {/* Project depth panel (vertical) */}
        <AnimatePresence mode="wait">
          {activeArea && (
            <ProjectDepthPanel 
              area={activeArea}
              verticalDepth={verticalDepth}
              activeProject={activeProject}
              onProjectClick={setActiveProject}
            />
          )}
        </AnimatePresence>
      </main>
      
      {/* Position indicators */}
      <PositionIndicator identity={identity} activeArea={activeArea} />
      <DepthIndicator activeArea={activeArea} verticalDepth={verticalDepth} />
      
      {/* Social links */}
      <SocialLinks 
        onHover={() => setCursorVariant('link')}
        onLeave={() => setCursorVariant('default')}
      />
      
      {/* Footer hint */}
      <Footer identity={identity} activeArea={activeArea} />
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// GRADIENT BACKGROUND — Now with horizontal panning
// ═══════════════════════════════════════════════════════════════════════════

const GradientBackground = memo(function GradientBackground({ identity }) {
  const warmOpacity = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], [0.6, 0.4, 0.25, 0.1, 0])
  const coolOpacity = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], [0, 0.1, 0.25, 0.4, 0.6])
  
  // Horizontal panning - the whole world shifts as you explore
  const worldX = useTransform(identity, [0, 0.5, 1], ['25%', '0%', '-25%'])
  
  return (
    <motion.div className="lpv5-bg" style={{ x: worldX }}>
      <div className="lpv5-bg__base" />
      <div className="lpv5-bg__focal" />
      <motion.div className="lpv5-bg__warm" style={{ opacity: warmOpacity }} />
      <motion.div className="lpv5-bg__cool" style={{ opacity: coolOpacity }} />
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// VIDEO BACKGROUNDS — With parallax movement
// ═══════════════════════════════════════════════════════════════════════════

const VideoBackgrounds = memo(function VideoBackgrounds({ identity }) {
  const designVideoOpacity = useTransform(identity, [0, 0.15, 0.3, 0.5], [0.45, 0.3, 0.1, 0])
  const techVideoOpacity = useTransform(identity, [0.5, 0.7, 0.85, 1], [0, 0.1, 0.3, 0.45])
  
  // Videos pan in opposite direction for parallax depth
  const designVideoX = useTransform(identity, [0, 0.5, 1], ['0%', '15%', '30%'])
  const techVideoX = useTransform(identity, [0, 0.5, 1], ['-30%', '-15%', '0%'])
  
  return (
    <div className="lpv5-videos">
      <motion.div 
        className="lpv5-video lpv5-video--design" 
        style={{ opacity: designVideoOpacity, x: designVideoX }}
      >
        <video autoPlay muted loop playsInline>
          <source src="/video (1).webm" type="video/webm" />
        </video>
        <div className="lpv5-video__overlay lpv5-video__overlay--warm" />
      </motion.div>
      
      <motion.div 
        className="lpv5-video lpv5-video--tech" 
        style={{ opacity: techVideoOpacity, x: techVideoX }}
      >
        <video autoPlay muted loop playsInline>
          <source src="/tech-background-video.mp4" type="video/mp4" />
        </video>
        <div className="lpv5-video__overlay lpv5-video__overlay--cool" />
      </motion.div>
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// WORLD DECORATIONS — Organic (design) vs Geometric (tech) with parallax
// ═══════════════════════════════════════════════════════════════════════════

const WorldDecorations = memo(function WorldDecorations({ identity }) {
  const designOpacity = useTransform(identity, [0, 0.35, 0.5], [0.8, 0.4, 0])
  const techOpacity = useTransform(identity, [0.5, 0.65, 1], [0, 0.4, 0.8])
  
  // Strong parallax - decorations move faster than background
  const designX = useTransform(identity, [0, 0.5, 1], ['0vw', '40vw', '80vw'])
  const techX = useTransform(identity, [0, 0.5, 1], ['-80vw', '-40vw', '0vw'])
  
  return (
    <div className="lpv5-decorations">
      {/* Design world: organic flowing shapes */}
      <motion.div 
        className="lpv5-deco lpv5-deco--design" 
        style={{ opacity: designOpacity, x: designX }}
      >
        <svg viewBox="0 0 400 800" className="lpv5-deco__svg">
          {/* Flowing curves */}
          <path 
            d="M50,100 Q150,200 100,400 T150,700" 
            fill="none" 
            stroke="rgba(255,107,91,0.3)" 
            strokeWidth="2"
          />
          <path 
            d="M100,50 Q200,150 150,350 T200,650" 
            fill="none" 
            stroke="rgba(255,154,60,0.25)" 
            strokeWidth="2"
          />
          {/* Organic blobs */}
          <circle cx="80" cy="200" r="40" fill="rgba(255,107,91,0.08)" />
          <circle cx="150" cy="450" r="60" fill="rgba(255,154,60,0.06)" />
          <circle cx="60" cy="600" r="35" fill="rgba(255,180,169,0.08)" />
        </svg>
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="lpv5-deco__particle lpv5-deco__particle--warm"
            style={{
              left: `${10 + Math.random() * 25}%`,
              top: `${10 + (i * 12)}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>
      
      {/* Tech world: geometric structured shapes */}
      <motion.div 
        className="lpv5-deco lpv5-deco--tech" 
        style={{ opacity: techOpacity, x: techX }}
      >
        <svg viewBox="0 0 400 800" className="lpv5-deco__svg lpv5-deco__svg--right">
          {/* Grid lines */}
          {[...Array(6)].map((_, i) => (
            <line 
              key={`h-${i}`}
              x1="0" y1={i * 150} 
              x2="400" y2={i * 150} 
              stroke="rgba(0,255,136,0.1)" 
              strokeWidth="1"
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <line 
              key={`v-${i}`}
              x1={i * 100} y1="0" 
              x2={i * 100} y2="800" 
              stroke="rgba(0,229,255,0.08)" 
              strokeWidth="1"
            />
          ))}
          {/* Hexagons */}
          <polygon 
            points="350,150 380,170 380,210 350,230 320,210 320,170" 
            fill="none" 
            stroke="rgba(0,255,136,0.3)" 
            strokeWidth="1"
          />
          <polygon 
            points="300,400 340,425 340,475 300,500 260,475 260,425" 
            fill="none" 
            stroke="rgba(139,92,246,0.25)" 
            strokeWidth="1"
          />
          {/* Circuit nodes */}
          <circle cx="350" cy="300" r="4" fill="rgba(0,255,136,0.5)" />
          <circle cx="280" cy="550" r="3" fill="rgba(0,229,255,0.4)" />
          <circle cx="370" cy="650" r="5" fill="rgba(139,92,246,0.4)" />
        </svg>
        {/* Data stream lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="lpv5-deco__stream"
            style={{
              right: `${5 + i * 6}%`,
              height: '100%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '0% 100%'],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </motion.div>
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// SPLIT PORTRAIT — with subtle horizontal parallax
// ═══════════════════════════════════════════════════════════════════════════

const SplitPortrait = memo(function SplitPortrait({ identity }) {
  const clipPosition = useTransform(identity, [0, 0.5, 1], [0, 50, 100])
  const designOpacity = useTransform(identity, [0, 0.3, 0.5], [1, 0.9, 0.7])
  const techOpacity = useTransform(identity, [0.5, 0.7, 1], [0.7, 0.9, 1])
  const warmGlow = useTransform(identity, [0, 0.35, 0.5], [0.7, 0.4, 0])
  const coolGlow = useTransform(identity, [0.5, 0.65, 1], [0, 0.4, 0.7])
  
  // Subtle parallax - portrait moves slightly opposite to navigation
  const portraitX = useTransform(identity, [0, 0.5, 1], ['8vw', '0vw', '-8vw'])
  
  return (
    <motion.div 
      className="lpv5-portrait"
      style={{ x: portraitX }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3 }}
    >
      <motion.div className="lpv5-portrait__glow lpv5-portrait__glow--warm" style={{ opacity: warmGlow }} />
      <motion.div className="lpv5-portrait__glow lpv5-portrait__glow--cool" style={{ opacity: coolGlow }} />
      
      <motion.div className="lpv5-portrait__layer lpv5-portrait__layer--tech" style={{ opacity: techOpacity }}>
        <img src="/portrait-tech-right.png" alt="Tech" className="lpv5-portrait__img" />
      </motion.div>
      
      <motion.div 
        className="lpv5-portrait__layer lpv5-portrait__layer--design" 
        style={{ 
          opacity: designOpacity,
          clipPath: useTransform(clipPosition, (p) => `inset(0 ${p}% 0 0)`),
        }}
      >
        <img src="/portrait-design-left.png" alt="Design" className="lpv5-portrait__img" />
      </motion.div>
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED TITLE — Words split apart as you explore
// ═══════════════════════════════════════════════════════════════════════════

const AnimatedTitle = memo(function AnimatedTitle({ identity, isLoaded }) {
  // Design word flies left when exploring design (identity → 0)
  const designX = useTransform(identity, [0, 0.5, 1], ['-35vw', '0vw', '25vw'])
  const designScale = useTransform(identity, [0, 0.35, 0.5, 0.65, 1], [1.8, 1.2, 1, 0.7, 0.4])
  const designOpacity = useTransform(identity, [0, 0.4, 0.5, 0.7, 1], [1, 1, 0.9, 0.5, 0.2])
  
  // Tech word flies right when exploring tech (identity → 1)
  const techX = useTransform(identity, [0, 0.5, 1], ['-25vw', '0vw', '35vw'])
  const techScale = useTransform(identity, [0, 0.35, 0.5, 0.65, 1], [0.4, 0.7, 1, 1.2, 1.8])
  const techOpacity = useTransform(identity, [0, 0.3, 0.5, 0.6, 1], [0.2, 0.5, 0.9, 1, 1])
  
  // Plus symbol fades and shrinks when exploring
  const plusScale = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], [0.4, 0.9, 1, 0.9, 0.4])
  const plusOpacity = useTransform(identity, [0, 0.25, 0.5, 0.75, 1], [0.2, 0.8, 1, 0.8, 0.2])
  
  // The whole title container also shifts
  const titleX = useTransform(identity, [0, 0.5, 1], ['10vw', '0vw', '-10vw'])
  
  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div className="lpv5-title" style={{ x: titleX }}>
          <motion.span
            className="lpv5-title__word lpv5-title__word--design"
            style={{ x: designX, scale: designScale, opacity: designOpacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Design
          </motion.span>
          
          <motion.span
            className="lpv5-title__plus"
            style={{ scale: plusScale, opacity: plusOpacity }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            +
          </motion.span>
          
          <motion.span
            className="lpv5-title__word lpv5-title__word--tech"
            style={{ x: techX, scale: techScale, opacity: techOpacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Tech
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// AREA MARKERS — Horizontal navigation points with parallax
// ═══════════════════════════════════════════════════════════════════════════

const AreaMarkers = memo(function AreaMarkers({ identity, activeArea, onHover, onLeave }) {
  const allAreas = useMemo(() => [
    ...AREAS.design.map(a => ({ ...a, side: 'design' })),
    ...AREAS.tech.map(a => ({ ...a, side: 'tech' })),
  ], [])
  
  // The entire area layer moves with identity - creates "traveling through" effect
  // When identity is 0.5 (center), markers are at their natural position
  // When identity is 0 (full left), everything shifts RIGHT (you've traveled left)
  // When identity is 1 (full right), everything shifts LEFT (you've traveled right)
  const areasX = useTransform(identity, [0, 0.5, 1], ['50vw', '0vw', '-50vw'])
  
  return (
    <motion.div className="lpv5-areas" style={{ x: areasX }}>
      {allAreas.map((area) => {
        const isActive = activeArea?.id === area.id
        const isDesign = area.side === 'design'
        
        return (
          <motion.div
            key={area.id}
            className={`lpv5-area-marker ${isActive ? 'lpv5-area-marker--active' : ''} lpv5-area-marker--${area.side}`}
            style={{
              left: `${area.position * 100}%`,
              '--area-color': area.color,
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isActive ? 1 : 0.6,
              y: 0,
              scale: isActive ? 1.1 : 1,
            }}
            transition={{ delay: 0.8 + area.position * 0.3 }}
          >
            <span className="lpv5-area-marker__icon">{area.icon}</span>
            <span className="lpv5-area-marker__name">{area.name}</span>
            <motion.span 
              className="lpv5-area-marker__line"
              animate={{ scaleY: isActive ? 1 : 0.3 }}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT DEPTH PANEL — Vertical navigation within an area
// ═══════════════════════════════════════════════════════════════════════════

const ProjectDepthPanel = memo(function ProjectDepthPanel({ 
  area, 
  verticalDepth, 
  activeProject,
  onProjectClick 
}) {
  const isDesign = AREAS.design.some(a => a.id === area.id)
  
  return (
    <motion.div 
      className={`lpv5-depth-panel lpv5-depth-panel--${isDesign ? 'design' : 'tech'}`}
      initial={{ opacity: 0, x: isDesign ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isDesign ? -50 : 50 }}
      transition={{ duration: 0.4 }}
      style={{
        '--panel-color': area.color,
      }}
    >
      <div className="lpv5-depth-panel__header">
        <span className="lpv5-depth-panel__icon">{area.icon}</span>
        <h3 className="lpv5-depth-panel__title">{area.name}</h3>
        <span className="lpv5-depth-panel__count">{area.projects.length} projects</span>
      </div>
      
      <div className="lpv5-depth-panel__hint">
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ↓
        </motion.span>
        Scroll to explore
      </div>
      
      <motion.div 
        className="lpv5-depth-panel__projects"
        style={{ y: useTransform(verticalDepth, v => -v) }}
      >
        {area.projects.map((project, index) => {
          const isProjectActive = activeProject?.id === project.id
          
          return (
            <motion.div
              key={project.id}
              className={`lpv5-project-card ${isProjectActive ? 'lpv5-project-card--active' : ''}`}
              style={{
                top: index * CONFIG.projectSpacing,
              }}
              animate={{
                opacity: isProjectActive ? 1 : 0.5,
                scale: isProjectActive ? 1 : 0.95,
                x: isProjectActive ? 0 : (isDesign ? -10 : 10),
              }}
              onClick={() => onProjectClick(project)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="lpv5-project-card__number">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="lpv5-project-card__content">
                <h4 className="lpv5-project-card__name">{project.name}</h4>
                <p className="lpv5-project-card__desc">{project.desc}</p>
                <span className="lpv5-project-card__year">{project.year}</span>
              </div>
              <motion.div 
                className="lpv5-project-card__indicator"
                animate={{ scale: isProjectActive ? 1 : 0 }}
              />
            </motion.div>
          )
        })}
      </motion.div>
      
      {/* Depth progress bar */}
      <div className="lpv5-depth-panel__progress">
        <motion.div 
          className="lpv5-depth-panel__progress-fill"
          style={{
            scaleY: useTransform(
              verticalDepth,
              [0, (area.projects.length - 1) * CONFIG.projectSpacing],
              [0.1, 1]
            ),
          }}
        />
      </div>
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// PLUS LOUPE CURSOR
// ═══════════════════════════════════════════════════════════════════════════

const PlusLoupe = memo(function PlusLoupe({ cursorX, cursorY, identity, activeArea }) {
  const warmColor = useTransform(identity, [0, 0.5, 1], ['#ff6b5b', '#ffffff', '#00ff88'])
  const coolColor = useTransform(identity, [0, 0.5, 1], ['#ff9a3c', '#888888', '#00e5ff'])
  
  return (
    <motion.div
      className="lpv5-cursor"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div 
        className="lpv5-cursor__ring lpv5-cursor__ring--outer"
        animate={{
          scale: activeArea ? 1.5 : 1,
          opacity: activeArea ? 0.8 : 0.5,
        }}
        style={{ borderColor: warmColor }}
      />
      <motion.div 
        className="lpv5-cursor__ring lpv5-cursor__ring--inner"
        style={{ borderColor: coolColor }}
      />
      <motion.div className="lpv5-cursor__plus">
        <motion.span style={{ backgroundColor: warmColor }} />
        <motion.span style={{ backgroundColor: warmColor }} />
      </motion.div>
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// POSITION INDICATOR — Shows horizontal position
// ═══════════════════════════════════════════════════════════════════════════

const PositionIndicator = memo(function PositionIndicator({ identity, activeArea }) {
  const indicatorX = useTransform(identity, [0, 1], ['0%', '100%'])
  
  return (
    <div className="lpv5-position">
      <div className="lpv5-position__track">
        <span className="lpv5-position__label lpv5-position__label--left">Design</span>
        <span className="lpv5-position__label lpv5-position__label--right">Tech</span>
        <motion.div 
          className="lpv5-position__marker"
          style={{ left: indicatorX }}
        />
        {/* Area indicators */}
        {[...AREAS.design, ...AREAS.tech].map((area) => (
          <div
            key={area.id}
            className={`lpv5-position__area ${activeArea?.id === area.id ? 'lpv5-position__area--active' : ''}`}
            style={{ 
              left: `${area.position * 100}%`,
              backgroundColor: area.color,
            }}
          />
        ))}
      </div>
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// DEPTH INDICATOR — Shows vertical scroll position
// ═══════════════════════════════════════════════════════════════════════════

const DepthIndicator = memo(function DepthIndicator({ activeArea, verticalDepth }) {
  if (!activeArea) return null
  
  const maxDepth = (activeArea.projects.length - 1) * CONFIG.projectSpacing
  
  return (
    <motion.div 
      className="lpv5-depth"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <span className="lpv5-depth__label">Depth</span>
      <div className="lpv5-depth__track">
        {activeArea.projects.map((_, i) => (
          <div 
            key={i} 
            className="lpv5-depth__notch"
            style={{ top: `${(i / (activeArea.projects.length - 1)) * 100}%` }}
          />
        ))}
        <motion.div 
          className="lpv5-depth__marker"
          style={{
            top: useTransform(verticalDepth, [0, maxDepth], ['0%', '100%']),
          }}
        />
      </div>
    </motion.div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

const Navigation = memo(function Navigation({ onHover, onLeave, identity }) {
  const navItems = ['Home', 'About', 'Work', 'Contact']
  const navOpacity = useTransform(identity, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])
  
  return (
    <motion.nav className="lpv5-nav" style={{ opacity: navOpacity }}>
      <div className="lpv5-nav__logo">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          MP.
        </motion.span>
      </div>
      
      <ul className="lpv5-nav__list">
        {navItems.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <a 
              href={`#${item.toLowerCase()}`}
              className={`lpv5-nav__link ${i === 0 ? 'lpv5-nav__link--active' : ''}`}
              onMouseEnter={onHover}
              onMouseLeave={onLeave}
            >
              {item}
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL LINKS
// ═══════════════════════════════════════════════════════════════════════════

const SocialLinks = memo(function SocialLinks({ onHover, onLeave }) {
  const links = [
    { icon: '○', label: 'Instagram' },
    { icon: '◎', label: 'Dribbble' },
    { icon: '▢', label: 'Twitter' },
  ]
  
  return (
    <div className="lpv5-social">
      {links.map((link, i) => (
        <motion.a
          key={link.label}
          href="#"
          className="lpv5-social__link"
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
        className="lpv5-social__line"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      />
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════

const Footer = memo(function Footer({ identity, activeArea }) {
  const opacity = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], [0.3, 0.6, 0.5, 0.6, 0.3])
  
  return (
    <motion.footer className="lpv5-footer" style={{ opacity }}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {activeArea 
          ? `Scroll to explore ${activeArea.name} projects`
          : 'Move horizontally to discover areas · Scroll vertically to explore projects'
        }
      </motion.p>
    </motion.footer>
  )
})
