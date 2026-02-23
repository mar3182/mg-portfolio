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
    stiffness: 40,
    damping: 25,
    mass: 1,
  },
  cursorSpring: {
    damping: 25,
    stiffness: 200,
  },
  verticalSpring: {
    stiffness: 80,
    damping: 25,
  },
  // Horizontal scroll speed multiplier (higher = faster scrolling)
  scrollSpeed: 0.003,
  // Area detection threshold (how close to center of area to "activate")
  areaThreshold: 0.08,
  areaThreshold: 0.08,
  // Project spacing in vertical scroll
  projectSpacing: 180,
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT — Akaru-style horizontal scroll
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitV5() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeArea, setActiveArea] = useState(null)
  const [activeProject, setActiveProject] = useState(null)
  const [cursorVariant, setCursorVariant] = useState('default')
  
  // Horizontal scroll position (0 to 1, where 0.5 is center)
  const scrollProgress = useMotionValue(0.5)
  const smoothProgress = useSpring(scrollProgress, CONFIG.spring)
  
  // Vertical depth (scroll position within an area)
  const scrollY = useMotionValue(0)
  const verticalDepth = useSpring(scrollY, CONFIG.verticalSpring)
  
  // Mouse position for cursor
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cursorX = useSpring(mouseX, CONFIG.cursorSpring)
  const cursorY = useSpring(mouseY, CONFIG.cursorSpring)
  
  // Detect which area we're in based on scroll position
  const detectActiveArea = useCallback((progress) => {
    const allAreas = [...AREAS.design, ...AREAS.tech]
    for (const area of allAreas) {
      if (Math.abs(progress - area.position) < CONFIG.areaThreshold) {
        return area
      }
    }
    return null
  }, [])
  
  // Handle mouse movement (for cursor only)
  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }, [mouseX, mouseY])
  
  // Handle scroll — THIS IS THE KEY: wheel scroll controls horizontal position
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    
    // Get current progress
    const current = scrollProgress.get()
    
    // If we're on an area and scrolling vertically within it
    if (activeArea && Math.abs(e.deltaX) < Math.abs(e.deltaY) * 0.5) {
      // Allow vertical scroll within area
      const newScroll = scrollY.get() + e.deltaY * 0.5
      const maxScroll = (activeArea.projects.length - 1) * CONFIG.projectSpacing
      scrollY.set(Math.max(0, Math.min(maxScroll, newScroll)))
      return
    }
    
    // Horizontal scroll - deltaY drives horizontal movement (like Akaru)
    const delta = (e.deltaY + e.deltaX) * CONFIG.scrollSpeed
    const newProgress = Math.max(0, Math.min(1, current + delta))
    scrollProgress.set(newProgress)
    
    // Update active area
    const area = detectActiveArea(newProgress)
    if (area !== activeArea) {
      setActiveArea(area)
      scrollY.set(0) // Reset vertical scroll when changing areas
    }
  }, [scrollProgress, activeArea, scrollY, detectActiveArea])
  
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
  
  // The entire world translates based on scroll progress
  // progress 0 = show Design side (world moves RIGHT by 100vw)
  // progress 0.5 = center (world at natural position, x = 0)
  // progress 1 = show Tech side (world moves LEFT by 100vw)
  const worldX = useTransform(
    smoothProgress, 
    [0, 0.5, 1], 
    ['100vw', '0vw', '-100vw']
  )
  
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
      {/* Fixed background */}
      <GradientBackground identity={smoothProgress} />
      
      {/* THE SCROLLING WORLD — everything inside moves horizontally */}
      <motion.div className="lpv5-world" style={{ x: worldX }}>
        {/* Video backgrounds positioned in the world */}
        <VideoBackgrounds identity={smoothProgress} />
        
        {/* World decorations */}
        <WorldDecorations identity={smoothProgress} />
        
        {/* Area markers spread across the world */}
        <AreaMarkers 
          identity={smoothProgress} 
          activeArea={activeArea}
          onHover={() => setCursorVariant('view')}
          onLeave={() => setCursorVariant('default')}
        />
        
        {/* Central content (portrait + title) */}
        <div className="lpv5-center">
          <SplitPortrait identity={smoothProgress} />
          <AnimatedTitle identity={smoothProgress} isLoaded={isLoaded} />
        </div>
      </motion.div>
      
      {/* Fixed UI elements (don't scroll) */}
      <PlusLoupe 
        cursorX={cursorX} 
        cursorY={cursorY} 
        identity={smoothProgress}
        activeArea={activeArea}
      />
      
      <Navigation 
        onHover={() => setCursorVariant('link')}
        onLeave={() => setCursorVariant('default')}
        identity={smoothProgress}
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
      
      {/* Position indicators */}
      <PositionIndicator identity={smoothProgress} activeArea={activeArea} />
      <DepthIndicator activeArea={activeArea} verticalDepth={verticalDepth} />
      
      <SocialLinks 
        onHover={() => setCursorVariant('link')}
        onLeave={() => setCursorVariant('default')}
      />
      
      <Footer identity={smoothProgress} activeArea={activeArea} />
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
// VIDEO BACKGROUNDS — Positioned in the scrolling world
// ═══════════════════════════════════════════════════════════════════════════

const VideoBackgrounds = memo(function VideoBackgrounds({ identity }) {
  const designVideoOpacity = useTransform(identity, [0, 0.2, 0.4, 0.5], [0.6, 0.4, 0.2, 0])
  const techVideoOpacity = useTransform(identity, [0.5, 0.6, 0.8, 1], [0, 0.2, 0.4, 0.6])
  
  return (
    <>
      {/* Design section background - positioned on the left side of the world (0-100vw) */}
      <motion.div 
        className="lpv5-video lpv5-video--design" 
        style={{ opacity: designVideoOpacity }}
      >
        <div className="lpv5-video__gradient lpv5-video__gradient--warm" />
        <video autoPlay muted loop playsInline>
          <source src="/video (1).webm" type="video/webm" />
        </video>
        <div className="lpv5-video__overlay lpv5-video__overlay--warm" />
        <div className="lpv5-section-label lpv5-section-label--design">
          <span>DESIGN</span>
          <span className="lpv5-section-label__sub">Creative Direction</span>
        </div>
      </motion.div>
      
      {/* Tech section background - positioned on the right side of the world (200vw-300vw) */}
      <motion.div 
        className="lpv5-video lpv5-video--tech" 
        style={{ opacity: techVideoOpacity }}
      >
        <div className="lpv5-video__gradient lpv5-video__gradient--cool" />
        <video autoPlay muted loop playsInline>
          <source src="/tech-background-video.mp4" type="video/mp4" />
        </video>
        <div className="lpv5-video__overlay lpv5-video__overlay--cool" />
        <div className="lpv5-section-label lpv5-section-label--tech">
          <span>TECH</span>
          <span className="lpv5-section-label__sub">Engineering Excellence</span>
        </div>
      </motion.div>
    </>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// WORLD DECORATIONS — Positioned in the scrolling world
// ═══════════════════════════════════════════════════════════════════════════

const WorldDecorations = memo(function WorldDecorations({ identity }) {
  const designOpacity = useTransform(identity, [0, 0.3, 0.5], [1, 0.5, 0])
  const techOpacity = useTransform(identity, [0.5, 0.7, 1], [0, 0.5, 1])
  
  return (
    <>
      {/* Design world decorations - LEFT SIDE */}
      <motion.div 
        className="lpv5-deco lpv5-deco--design" 
        style={{ opacity: designOpacity }}
      >
        <svg viewBox="0 0 400 800" className="lpv5-deco__svg">
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
          <circle cx="80" cy="200" r="40" fill="rgba(255,107,91,0.08)" />
          <circle cx="150" cy="450" r="60" fill="rgba(255,154,60,0.06)" />
          <circle cx="60" cy="600" r="35" fill="rgba(255,180,169,0.08)" />
        </svg>
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
      
      {/* Tech world decorations - RIGHT SIDE */}
      <motion.div 
        className="lpv5-deco lpv5-deco--tech" 
        style={{ opacity: techOpacity }}
      >
        <svg viewBox="0 0 400 800" className="lpv5-deco__svg">
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
          <circle cx="350" cy="300" r="4" fill="rgba(0,255,136,0.5)" />
          <circle cx="280" cy="550" r="3" fill="rgba(0,229,255,0.4)" />
          <circle cx="370" cy="650" r="5" fill="rgba(139,92,246,0.4)" />
        </svg>
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
    </>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// SPLIT PORTRAIT — Stays centered in the world, reveals change with scroll
// ═══════════════════════════════════════════════════════════════════════════

const SplitPortrait = memo(function SplitPortrait({ identity }) {
  const clipPosition = useTransform(identity, [0, 0.5, 1], [0, 50, 100])
  const designOpacity = useTransform(identity, [0, 0.3, 0.5], [1, 0.9, 0.7])
  const techOpacity = useTransform(identity, [0.5, 0.7, 1], [0.7, 0.9, 1])
  const warmGlow = useTransform(identity, [0, 0.35, 0.5], [0.7, 0.4, 0])
  const coolGlow = useTransform(identity, [0.5, 0.65, 1], [0, 0.4, 0.7])
  
  return (
    <motion.div 
      className="lpv5-portrait"
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
// ANIMATED TITLE — Words shift and scale as you navigate horizontally
// ═══════════════════════════════════════════════════════════════════════════

const AnimatedTitle = memo(function AnimatedTitle({ identity, isLoaded }) {
  // Design word grows and moves left when scrolling toward design
  const designX = useTransform(identity, [0, 0.5, 1], ['-20vw', '0vw', '15vw'])
  const designScale = useTransform(identity, [0, 0.35, 0.5, 0.65, 1], [1.6, 1.2, 1, 0.8, 0.5])
  const designOpacity = useTransform(identity, [0, 0.4, 0.5, 0.7, 1], [1, 1, 0.9, 0.5, 0.2])
  
  // Tech word grows and moves right when scrolling toward tech
  const techX = useTransform(identity, [0, 0.5, 1], ['-15vw', '0vw', '20vw'])
  const techScale = useTransform(identity, [0, 0.35, 0.5, 0.65, 1], [0.5, 0.8, 1, 1.2, 1.6])
  const techOpacity = useTransform(identity, [0, 0.3, 0.5, 0.6, 1], [0.2, 0.5, 0.9, 1, 1])
  
  // Plus symbol strongest at center
  const plusScale = useTransform(identity, [0, 0.3, 0.5, 0.7, 1], [0.5, 0.9, 1, 0.9, 0.5])
  const plusOpacity = useTransform(identity, [0, 0.25, 0.5, 0.75, 1], [0.3, 0.8, 1, 0.8, 0.3])
  
  return (
    <AnimatePresence>
      {isLoaded && (
        <div className="lpv5-title">
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
        </div>
      )}
    </AnimatePresence>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// AREA MARKERS — Spread across the world, visible as you scroll
// ═══════════════════════════════════════════════════════════════════════════

const AreaMarkers = memo(function AreaMarkers({ identity, activeArea, onHover, onLeave }) {
  const allAreas = useMemo(() => [
    ...AREAS.design.map(a => ({ ...a, side: 'design' })),
    ...AREAS.tech.map(a => ({ ...a, side: 'tech' })),
  ], [])
  
  // No additional transform needed - markers are positioned in the world
  // The world itself moves via worldX transform in parent
  // Design areas: position 0.12, 0.22, 0.32 (left third of world)
  // Tech areas: position 0.68, 0.78, 0.88 (right third of world)
  
  return (
    <div className="lpv5-areas">
      {allAreas.map((area) => {
        const isActive = activeArea?.id === area.id
        
        // Convert position (0-1 on identity scale) to world position
        // World is 300vw wide (-100vw to +200vw when centered)
        // Position 0 = left edge, 0.5 = center, 1 = right edge
        // So we map: 0 → 0vw, 0.5 → 150vw, 1 → 300vw
        const worldPosition = area.position * 300
        
        return (
          <motion.div
            key={area.id}
            className={`lpv5-area-marker ${isActive ? 'lpv5-area-marker--active' : ''} lpv5-area-marker--${area.side}`}
            style={{
              left: `${worldPosition}vw`,
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
    </div>
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
  // Calculate max depth - default to a reasonable value if no area
  const maxDepth = activeArea 
    ? (activeArea.projects.length - 1) * CONFIG.projectSpacing 
    : CONFIG.projectSpacing * 2
  
  // Always call hook - React hooks must be called unconditionally
  const markerTop = useTransform(verticalDepth, [0, maxDepth], ['0%', '100%'])
  
  // Now we can early return
  if (!activeArea) return null
  
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
          style={{ top: markerTop }}
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
