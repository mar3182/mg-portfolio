/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PORTRAIT ECOSYSTEM — Living Portrait that Inhabits the Entire Page
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CONCEPT: The portrait isn't just IN the page, it BECOMES the page.
 * Portrait fragments, silhouettes, and particles drift throughout,
 * responding to mouse movement and identity position.
 * 
 * BOLD APPROACH: Unmistakably portrait-derived, almost surreal.
 * 
 * LAYER ARCHITECTURE:
 * 1. DEEP ECHOES — Very blurred, large silhouettes (parallax 0.05x)
 * 2. MID FRAGMENTS — Semi-transparent portrait pieces (parallax 0.2x)  
 * 3. SURFACE PARTICLES — Canvas-based particle field (parallax 0.8x)
 * 
 * All layers respond to:
 * - Mouse position (parallax depth)
 * - Identity value (warm ↔ cool tinting)
 * - Scroll position (vertical drift)
 */

import { useRef, useEffect, useCallback, memo } from 'react'
import { useMotionValue, useSpring, useTransform, motion as Motion } from 'framer-motion'
import { useSmoothedIdentity, useIdentity } from '../hooks/useIdentity'
import './styles/portrait-ecosystem.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Particle system
  particles: {
    count: 120,           // Number of particles
    minSize: 2,
    maxSize: 8,
    speed: 0.3,           // Base drift speed
    mouseInfluence: 150,  // Pixel radius of mouse influence
    mouseForce: 0.8,      // How strongly mouse pushes particles
  },
  // Echo layers (silhouettes)
  echoes: {
    count: 3,
    minOpacity: 0.03,
    maxOpacity: 0.12,
    minBlur: 30,
    maxBlur: 80,
    minScale: 1.2,
    maxScale: 2.5,
  },
  // Fragment pieces
  fragments: {
    count: 5,
    parallaxRange: [0.1, 0.4],
  },
  // Spring physics for mouse tracking
  spring: {
    stiffness: 30,
    damping: 30,
    mass: 1,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTICLE SYSTEM (Canvas-based for performance)
// ═══════════════════════════════════════════════════════════════════════════

function ParticleCanvas({ identity }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const animationRef = useRef(null)
  const scrollRef = useRef(0)
  
  // Initialize particles
  useEffect(() => {
    const particles = []
    for (let i = 0; i < CONFIG.particles.count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 3, // Spread across 3 viewports
        baseX: Math.random() * window.innerWidth,
        baseY: Math.random() * window.innerHeight * 3,
        size: CONFIG.particles.minSize + Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize),
        speed: CONFIG.particles.speed * (0.5 + Math.random()),
        angle: Math.random() * Math.PI * 2,
        depth: 0.3 + Math.random() * 0.7, // Parallax depth factor
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
      })
    }
    particlesRef.current = particles
  }, [])
  
  // Track mouse
  useEffect(() => {
    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])
  
  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight
    
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    resize()
    window.addEventListener('resize', resize)
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      
      const scroll = scrollRef.current
      const mouse = mouseRef.current
      const currentIdentity = identity
      
      // Color based on identity (warm ↔ cool)
      const warmColor = { r: 196, g: 112, b: 58 }   // #c4703a
      const coolColor = { r: 58, g: 124, b: 196 }   // #3a7cc4
      const neutralColor = { r: 180, g: 180, b: 180 }
      
      particlesRef.current.forEach((p, i) => {
        // Wobble motion
        p.wobble += p.wobbleSpeed
        const wobbleX = Math.sin(p.wobble) * 20 * p.depth
        const wobbleY = Math.cos(p.wobble * 0.7) * 15 * p.depth
        
        // Parallax from scroll
        const parallaxY = scroll * p.depth * 0.3
        
        // Calculate target position
        let targetX = p.baseX + wobbleX
        let targetY = p.baseY + wobbleY - parallaxY
        
        // Mouse influence
        const dx = mouse.x - p.x
        const dy = (mouse.y + scroll) - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < CONFIG.particles.mouseInfluence) {
          const force = (1 - dist / CONFIG.particles.mouseInfluence) * CONFIG.particles.mouseForce
          targetX -= (dx / dist) * force * 50
          targetY -= (dy / dist) * force * 50
        }
        
        // Smooth movement toward target
        p.x += (targetX - p.x) * 0.02
        p.y += (targetY - p.y) * 0.02
        
        // Wrap around vertically
        const viewportY = p.y - scroll
        if (viewportY < -100) p.y += height * 3
        if (viewportY > height + 100) p.y -= height * 3
        
        // Draw particle
        const screenY = p.y - scroll
        if (screenY > -50 && screenY < height + 50) {
          // Color interpolation based on identity
          let color
          if (currentIdentity < 0.4) {
            const t = currentIdentity / 0.4
            color = {
              r: Math.round(warmColor.r + (neutralColor.r - warmColor.r) * t),
              g: Math.round(warmColor.g + (neutralColor.g - warmColor.g) * t),
              b: Math.round(warmColor.b + (neutralColor.b - warmColor.b) * t),
            }
          } else if (currentIdentity > 0.6) {
            const t = (currentIdentity - 0.6) / 0.4
            color = {
              r: Math.round(neutralColor.r + (coolColor.r - neutralColor.r) * t),
              g: Math.round(neutralColor.g + (coolColor.g - neutralColor.g) * t),
              b: Math.round(neutralColor.b + (coolColor.b - neutralColor.b) * t),
            }
          } else {
            color = neutralColor
          }
          
          // Opacity based on depth (deeper = more transparent)
          const opacity = 0.15 + (1 - p.depth) * 0.35
          
          ctx.beginPath()
          ctx.arc(p.x, screenY, p.size * p.depth, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`
          ctx.fill()
          
          // Add glow for larger particles
          if (p.size > 5) {
            ctx.beginPath()
            ctx.arc(p.x, screenY, p.size * p.depth * 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.2})`
            ctx.fill()
          }
        }
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [identity])
  
  return (
    <canvas 
      ref={canvasRef}
      className="ecosystem-particles"
      aria-hidden="true"
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ECHO LAYERS (Blurred silhouettes)
// ═══════════════════════════════════════════════════════════════════════════

function EchoLayers({ mouseX, mouseY, scrollY, identity }) {
  // Generate echo configurations
  const echoes = [
    { 
      id: 'echo-deep',
      image: '/portrait-split.png',
      depth: 0.03,
      blur: 60,
      opacity: 0.06,
      scale: 2.2,
      offsetX: -15,
      offsetY: 20,
    },
    {
      id: 'echo-mid',
      image: '/portrait-design-left.png', 
      depth: 0.08,
      blur: 40,
      opacity: 0.04,
      scale: 1.6,
      offsetX: 25,
      offsetY: -10,
    },
    {
      id: 'echo-near',
      image: '/portrait-tech-right.png',
      depth: 0.12,
      blur: 25,
      opacity: 0.05,
      scale: 1.3,
      offsetX: -20,
      offsetY: 30,
    },
  ]
  
  return (
    <div className="ecosystem-echoes" aria-hidden="true">
      {echoes.map((echo) => {
        // Parallax transforms
        const x = useTransform(mouseX, [0, 1], [echo.offsetX - 30 * echo.depth, echo.offsetX + 30 * echo.depth])
        const y = useTransform(mouseY, [0, 1], [echo.offsetY - 20 * echo.depth, echo.offsetY + 20 * echo.depth])
        
        // Fade based on identity (design echo brighter on left, tech on right)
        const isDesignEcho = echo.image.includes('design')
        const isTechEcho = echo.image.includes('tech')
        
        const opacity = useTransform(identity, [0, 0.5, 1], [
          isDesignEcho ? echo.opacity * 1.5 : isTechEcho ? echo.opacity * 0.5 : echo.opacity,
          echo.opacity,
          isTechEcho ? echo.opacity * 1.5 : isDesignEcho ? echo.opacity * 0.5 : echo.opacity,
        ])
        
        return (
          <Motion.div
            key={echo.id}
            className="ecosystem-echo"
            style={{
              x,
              y,
              opacity,
              filter: `blur(${echo.blur}px)`,
              transform: `scale(${echo.scale})`,
            }}
          >
            <img src={echo.image} alt="" />
          </Motion.div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FRAGMENT PIECES (Cropped portrait elements)
// ═══════════════════════════════════════════════════════════════════════════

function FragmentLayers({ mouseX, mouseY, identity }) {
  // Define specific portrait fragments
  // These are positioned to create visual interest without being literal
  const fragments = [
    {
      id: 'frag-eye-left',
      type: 'eye',
      position: { top: '35%', left: '8%' },
      size: { width: '120px', height: '60px' },
      clipPath: 'ellipse(50% 40% at 50% 50%)',
      depth: 0.25,
      rotation: -5,
      blur: 2,
      opacity: 0.15,
    },
    {
      id: 'frag-profile',
      type: 'profile',
      position: { top: '55%', right: '5%' },
      size: { width: '180px', height: '280px' },
      clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 30% 100%, 0% 50%)',
      depth: 0.18,
      rotation: 8,
      blur: 4,
      opacity: 0.08,
    },
    {
      id: 'frag-hand',
      type: 'gesture',
      position: { bottom: '25%', left: '15%' },
      size: { width: '100px', height: '100px' },
      clipPath: 'circle(50% at 50% 50%)',
      depth: 0.3,
      rotation: 15,
      blur: 1,
      opacity: 0.12,
    },
    {
      id: 'frag-silhouette',
      type: 'silhouette',
      position: { top: '70%', left: '50%' },
      size: { width: '300px', height: '400px' },
      clipPath: 'ellipse(40% 50% at 50% 50%)',
      depth: 0.08,
      rotation: 0,
      blur: 20,
      opacity: 0.04,
    },
  ]
  
  return (
    <div className="ecosystem-fragments" aria-hidden="true">
      {fragments.map((frag) => {
        // Parallax based on depth
        const x = useTransform(mouseX, [0, 1], [-40 * frag.depth, 40 * frag.depth])
        const y = useTransform(mouseY, [0, 1], [-30 * frag.depth, 30 * frag.depth])
        
        // Subtle rotation response to mouse
        const rotate = useTransform(mouseX, [0, 1], [frag.rotation - 3, frag.rotation + 3])
        
        // Choose image based on identity
        const designSrc = '/portrait-design-left.png'
        const techSrc = '/portrait-tech-right.png'
        const splitSrc = '/portrait-split.png'
        
        return (
          <Motion.div
            key={frag.id}
            className={`ecosystem-fragment ecosystem-fragment--${frag.type}`}
            style={{
              ...frag.position,
              ...frag.size,
              x,
              y,
              rotate,
              opacity: frag.opacity,
              filter: `blur(${frag.blur}px)`,
              clipPath: frag.clipPath,
            }}
          >
            {/* Crossfade between design/tech based on identity */}
            <Motion.img 
              src={designSrc} 
              alt=""
              style={{ opacity: useTransform(identity, [0, 0.5, 1], [1, 0.5, 0]) }}
            />
            <Motion.img 
              src={techSrc} 
              alt=""
              style={{ 
                position: 'absolute', 
                inset: 0,
                opacity: useTransform(identity, [0, 0.5, 1], [0, 0.5, 1]) 
              }}
            />
          </Motion.div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ECOSYSTEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PortraitEcosystem() {
  const identity = useIdentity()
  const smoothIdentity = useSmoothedIdentity()
  
  // Global mouse tracking (0-1 range)
  const mouseXRaw = useMotionValue(0.5)
  const mouseYRaw = useMotionValue(0.5)
  
  const mouseX = useSpring(mouseXRaw, CONFIG.spring)
  const mouseY = useSpring(mouseYRaw, CONFIG.spring)
  
  // Scroll tracking
  const scrollY = useMotionValue(0)
  
  useEffect(() => {
    const handleMouse = (e) => {
      mouseXRaw.set(e.clientX / window.innerWidth)
      mouseYRaw.set(e.clientY / window.innerHeight)
    }
    
    const handleScroll = () => {
      scrollY.set(window.scrollY)
    }
    
    window.addEventListener('mousemove', handleMouse, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [mouseXRaw, mouseYRaw, scrollY])
  
  return (
    <div className="portrait-ecosystem" aria-hidden="true">
      {/* Layer 1: Deep echoes (blurred silhouettes) */}
      <EchoLayers 
        mouseX={mouseX} 
        mouseY={mouseY} 
        scrollY={scrollY}
        identity={smoothIdentity}
      />
      
      {/* Layer 2: Fragment pieces */}
      <FragmentLayers 
        mouseX={mouseX} 
        mouseY={mouseY}
        identity={smoothIdentity}
      />
      
      {/* Layer 3: Particle field */}
      <ParticleCanvas identity={identity} />
      
      {/* Breathing overlay - subtle pulse */}
      <Motion.div 
        className="ecosystem-breath"
        animate={{ 
          opacity: [0.02, 0.05, 0.02],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

export default memo(PortraitEcosystem)
