/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORGANIC WORLD — Flowing Forms from Design Background
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Creates an organic flowing world using the design-background.svg as the
 * primary visual element. Multiple layers of the SVG are positioned and
 * animated to create a sense of forms emanating from the portrait's head.
 */

import { memo, useMemo } from 'react'
import { useTransform, motion, useSpring } from 'framer-motion'

// Color palette extracted from the design SVG
const COLORS = {
  primary: ['#F37A0A', '#D3550B', '#AD3307', '#F89017'],
  golden: ['#FCB835', '#F7AA43', '#CA9362', '#F98A0A'],
  deep: ['#B92F04', '#1B0D0B', '#291412', '#CC8851'],
  accent: ['#C71585', '#ff6b6b', '#e84a5f', '#ff8c42'],
}

// Generate more complex organic shapes for emanating forms
const generateFlowingShape = (seed, scale = 1) => {
  const points = []
  const segments = 8 + Math.floor(seed * 4)
  const radius = 30 * scale
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const variance = 0.5 + (Math.sin(seed * 10 + i * 0.7) * 0.5)
    const r = radius * variance
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return points.join(' ') + 'Z'
}
// FLOWING PATH COMPONENT - Paths that emanate from portrait center
// ═══════════════════════════════════════════════════════════════════════════

const FlowingPath = memo(function FlowingPath({ 
  d, 
  fill, 
  offsetX = 0,
  offsetY = 0,
  delay = 0, 
  scale = 1,
  originX = 512,  // Portrait center X
  originY = 300,  // Portrait head area Y
  parallaxOffset = { x: 0, y: 0 }
}) {
  // Calculate actual position from portrait center
  const x = originX + offsetX
  const y = originY + offsetY
  
  return (
    <motion.g
      style={{
        x: parallaxOffset.x,
        y: parallaxOffset.y,
      }}
    >
      <motion.path
        d={d}
        fill={fill}
        transform={`translate(${x}, ${y}) scale(${scale})`}
        initial={{ 
          opacity: 0, 
          scale: 0,
          x: originX - x,  // Start from portrait center
          y: originY - y,
        }}
        animate={{ 
          opacity: [0, 0.9, 0.75],
          scale: [0, 1.15, 1],
          x: 0,
          y: 0,
        }}
        transition={{ 
          delay,
          duration: 2.5,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.5, 1]
        }}
      />
    </motion.g>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// WAVE STREAM COMPONENT - Creates flowing wave effect
// ═══════════════════════════════════════════════════════════════════════════

const WaveStream = memo(function WaveStream({ 
  startX, 
  startY, 
  color, 
  delay = 0,
  direction = 'left',
  scale = 1
}) {
  const xDir = direction === 'left' ? -1 : 1
  
  // Generate organic flowing path
  const pathD = useMemo(() => {
    const points = []
    const segments = 8
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const x = startX + (xDir * t * 400 * scale)
      const y = startY + Math.sin(t * Math.PI * 2) * 80 * scale + (t * 150 * scale)
      const cp1x = x - (xDir * 30)
      const cp1y = y - 40
      const cp2x = x - (xDir * 10)  
      const cp2y = y + 20
      
      if (i === 0) {
        points.push(`M${x},${y}`)
      } else {
        points.push(`C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`)
      }
    }
    return points.join(' ')
  }, [startX, startY, xDir, scale])

  return (
    <motion.path
      d={pathD}
      fill="none"
      stroke={color}
      strokeWidth={3 * scale}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: 1,
        opacity: [0, 0.8, 0.4],
      }}
      transition={{
        pathLength: { delay, duration: 2, ease: "easeInOut" },
        opacity: { delay, duration: 3, times: [0, 0.3, 1] }
      }}
      style={{
        filter: `drop-shadow(0 0 ${10 * scale}px ${color})`
      }}
    />
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// PARTICLE BURST - Small elements flowing outward
// ═══════════════════════════════════════════════════════════════════════════

const ParticleBurst = memo(function ParticleBurst({ 
  cx, 
  cy, 
  color, 
  count = 12,
  delay = 0,
  direction = 'left' 
}) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (direction === 'left' ? 180 : 0) + (Math.random() - 0.5) * 120
      const distance = 100 + Math.random() * 200
      const size = 3 + Math.random() * 8
      const duration = 2 + Math.random() * 2
      
      return { angle, distance, size, duration, delay: delay + i * 0.1 }
    })
  }, [count, delay, direction])

  return (
    <g>
      {particles.map((p, i) => {
        const radians = (p.angle * Math.PI) / 180
        const endX = cx + Math.cos(radians) * p.distance
        const endY = cy + Math.sin(radians) * p.distance * 0.6 + p.distance * 0.3
        
        return (
          <motion.circle
            key={i}
            r={p.size}
            fill={color}
            fillOpacity={0.8}
            initial={{ cx, cy, scale: 0, opacity: 0 }}
            animate={{
              cx: [cx, endX],
              cy: [cy, endY],
              scale: [0, 1, 0.3],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              delay: p.delay,
              duration: p.duration,
              ease: [0.22, 1, 0.36, 1],
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
            }}
          />
        )
      })}
    </g>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// ORGANIC BLOB - Morphing abstract shape
// ═══════════════════════════════════════════════════════════════════════════

const OrganicBlob = memo(function OrganicBlob({ 
  cx, 
  cy, 
  size, 
  color, 
  delay = 0,
  parallaxOffset = { x: 0, y: 0 }
}) {
  // Generate morphing blob paths
  const blobPaths = useMemo(() => {
    const generateBlob = (seed) => {
      const points = 8
      const pathPoints = []
      
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2
        const variance = 0.3 + Math.sin(seed + i) * 0.3
        const r = size * variance
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r * 0.7
        pathPoints.push({ x, y })
      }
      
      // Create smooth bezier curve through points
      let d = `M${pathPoints[0].x},${pathPoints[0].y}`
      for (let i = 0; i < points; i++) {
        const p0 = pathPoints[(i - 1 + points) % points]
        const p1 = pathPoints[i]
        const p2 = pathPoints[(i + 1) % points]
        const p3 = pathPoints[(i + 2) % points]
        
        const cp1x = p1.x + (p2.x - p0.x) * 0.2
        const cp1y = p1.y + (p2.y - p0.y) * 0.2
        const cp2x = p2.x - (p3.x - p1.x) * 0.2
        const cp2y = p2.y - (p3.y - p1.y) * 0.2
        
        d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
      }
      d += 'Z'
      return d
    }
    
    return [generateBlob(0), generateBlob(2), generateBlob(4), generateBlob(0)]
  }, [cx, cy, size])

  return (
    <motion.path
      fill={color}
      fillOpacity={0.6}
      style={{ 
        x: parallaxOffset.x, 
        y: parallaxOffset.y,
        filter: `blur(2px) drop-shadow(0 0 20px ${color})`
      }}
      initial={{ d: blobPaths[0], scale: 0, opacity: 0 }}
      animate={{ 
        d: blobPaths,
        scale: 1,
        opacity: 1 
      }}
      transition={{
        d: {
          delay: delay + 1,
          duration: 8,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        },
        scale: { delay, duration: 1.5, ease: [0.22, 1, 0.36, 1] },
        opacity: { delay, duration: 1 },
      }}
    />
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// FLOWING TENDRIL - Hair-like flowing element
// ═══════════════════════════════════════════════════════════════════════════

const FlowingTendril = memo(function FlowingTendril({
  startX,
  startY,
  color,
  length = 200,
  delay = 0,
  direction = 'left',
  curl = 1
}) {
  const xDir = direction === 'left' ? -1 : 1
  
  const pathD = useMemo(() => {
    const segments = 6
    let d = `M${startX},${startY}`
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments
      const x = startX + xDir * t * length
      const waveY = Math.sin(t * Math.PI * curl) * 50
      const dropY = t * t * 100
      const y = startY + waveY + dropY
      
      const cpX = startX + xDir * (t - 0.5/segments) * length
      const cpY = startY + Math.sin((t - 0.5/segments) * Math.PI * curl) * 50 + ((t - 0.5/segments) ** 2) * 100
      
      d += ` Q${cpX},${cpY} ${x},${y}`
    }
    
    return d
  }, [startX, startY, length, xDir, curl])

  return (
    <motion.path
      d={pathD}
      fill="none"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: [0, 1],
        opacity: [0, 0.8, 0.5],
      }}
      transition={{
        pathLength: { delay, duration: 2, ease: 'easeOut' },
        opacity: { delay, duration: 3, times: [0, 0.3, 1] },
      }}
      style={{
        filter: `drop-shadow(0 0 8px ${color})`,
      }}
    />
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ORGANIC WORLD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function OrganicWorld({ identity }) {
  // Smooth spring for identity transitions
  const smoothIdentity = useSpring(identity, { stiffness: 50, damping: 20 })
  
  // Transform identity (0 = design, 1 = tech) to opacity
  const opacity = useTransform(smoothIdentity, [0, 0.3, 0.7, 1], [1, 0.8, 0.3, 0])
  const scale = useTransform(smoothIdentity, [0, 0.5, 1], [1, 0.95, 0.85])
  
  // Parallax layers based on identity (forms drift as identity changes)
  const parallax2 = {
    x: useTransform(smoothIdentity, [0, 1], [0, 60]),
    y: useTransform(smoothIdentity, [0, 1], [0, 30]),
  }
  const parallax3 = {
    x: useTransform(smoothIdentity, [0, 1], [0, 30]),
    y: useTransform(smoothIdentity, [0, 1], [0, 15]),
  }

  // Portrait head position (approximate center where forms should emanate)
  const headPosition = { x: 512, y: 250 } // Center top of viewport
  
  // Generate flowing tendrils emanating from head
  const tendrils = useMemo(() => {
    const colors = ['#F37A0A', '#D3550B', '#FCB835', '#AD3307', '#F89017', '#C71585']
    const hx = headPosition.x
    const hy = headPosition.y
    return Array.from({ length: 12 }).map((_, i) => ({
      startX: hx + (Math.random() - 0.5) * 100,
      startY: hy + Math.random() * 50,
      color: colors[i % colors.length],
      length: 150 + Math.random() * 200,
      delay: i * 0.15,
      direction: i % 2 === 0 ? 'left' : 'right',
      curl: 0.5 + Math.random() * 1.5,
    }))
  }, [headPosition.x, headPosition.y])

  // Organic blobs flowing outward
  const blobs = useMemo(() => {
    const colors = ['#F37A0A', '#FCB835', '#D3550B', '#ff6b6b', '#e84a5f']
    return [
      // Left side blobs
      { cx: 200, cy: 350, size: 120, color: colors[0], delay: 0.5 },
      { cx: 120, cy: 500, size: 80, color: colors[1], delay: 0.8 },
      { cx: 280, cy: 600, size: 100, color: colors[2], delay: 1.1 },
      { cx: 80, cy: 700, size: 60, color: colors[3], delay: 1.4 },
      { cx: 180, cy: 800, size: 90, color: colors[4], delay: 1.7 },
      // Right side blobs (smaller, subtle)
      { cx: 820, cy: 400, size: 70, color: colors[1], delay: 0.7 },
      { cx: 900, cy: 550, size: 50, color: colors[0], delay: 1.0 },
    ]
  }, [])

  return (
    <motion.div 
      className="organic-world"
      style={{ opacity, scale }}
    >
      {/* Background layer: Use the actual SVG with blend mode */}
      <motion.div 
        className="organic-world__background-layer organic-world__background-layer--main"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ delay: 0.2, duration: 2 }}
      >
        <img 
          src="/design-background.svg" 
          alt="" 
          className="organic-world__background-svg"
        />
      </motion.div>

      {/* Secondary layer: Vertical version for depth */}
      <motion.div 
        className="organic-world__background-layer organic-world__background-layer--vertical"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 0.4, x: 0 }}
        transition={{ delay: 0.5, duration: 2.5 }}
      >
        <img 
          src="/design-barckground-vertical.png" 
          alt="" 
          className="organic-world__background-svg organic-world__background-svg--vertical"
        />
      </motion.div>

      {/* Main SVG canvas for animated elements */}
      <svg
        viewBox="0 0 1024 1024"
        preserveAspectRatio="xMidYMin slice"
        className="organic-world__svg organic-world__svg--main"
      >
        <defs>
          {/* Gradient for warm glow */}
          <radialGradient id="warmGlow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#F37A0A" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#D3550B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0" />
          </radialGradient>
          
          {/* Gradient for golden accents */}
          <radialGradient id="goldenGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FCB835" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Blur filter for depth */}
          <filter id="organicBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Background glow emanating from portrait area */}
        <motion.ellipse
          cx={headPosition.x}
          cy={headPosition.y + 100}
          rx="400"
          ry="300"
          fill="url(#warmGlow)"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Layer 1: Warm colored paths - emanating from portrait */}
        <motion.g 
          className="organic-world__layer organic-world__layer--warm"
          style={{ x: parallax2.x, y: parallax2.y }}
        >
          {FLOW_PATHS.warm.map((path, i) => (
            <FlowingPath
              key={`warm-${i}`}
              {...path}
              delay={0.2 + i * 0.12}
              scale={1.5}
              originX={headPosition.x}
              originY={headPosition.y}
              parallaxOffset={parallax2}
            />
          ))}
        </motion.g>

        {/* Layer 2: Golden accent paths */}
        <motion.g 
          className="organic-world__layer organic-world__layer--golden"
          style={{ x: parallax3.x, y: parallax3.y }}
        >
          {FLOW_PATHS.golden.map((path, i) => (
            <FlowingPath
              key={`golden-${i}`}
              {...path}
              delay={0.4 + i * 0.15}
              scale={1.3}
              originX={headPosition.x}
              originY={headPosition.y}
              parallaxOffset={parallax3}
            />
          ))}
        </motion.g>

        {/* Layer 3: Deep color accents */}
        <motion.g className="organic-world__layer organic-world__layer--deep">
          {FLOW_PATHS.deep.map((path, i) => (
            <FlowingPath
              key={`deep-${i}`}
              {...path}
              delay={0.5 + i * 0.18}
              scale={1.2}
              originX={headPosition.x}
              originY={headPosition.y}
            />
          ))}
        </motion.g>

        {/* Layer 4: Cool tones for contrast */}
        <motion.g className="organic-world__layer organic-world__layer--cool">
          {FLOW_PATHS.cool.map((path, i) => (
            <FlowingPath
              key={`cool-${i}`}
              {...path}
              delay={0.6 + i * 0.2}
              scale={1.0}
              originX={headPosition.x}
              originY={headPosition.y}
            />
          ))}
        </motion.g>

        {/* Flowing tendrils from head position */}
        <g className="organic-world__tendrils">
          {tendrils.map((tendril, i) => (
            <FlowingTendril key={`tendril-${i}`} {...tendril} />
          ))}
        </g>

        {/* Particle bursts from head area */}
        <ParticleBurst
          cx={headPosition.x - 50}
          cy={headPosition.y + 50}
          color="#F37A0A"
          count={15}
          delay={1}
          direction="left"
        />
        <ParticleBurst
          cx={headPosition.x + 50}
          cy={headPosition.y + 50}
          color="#FCB835"
          count={10}
          delay={1.2}
          direction="right"
        />

        {/* Wave streams flowing down */}
        <WaveStream
          startX={headPosition.x - 30}
          startY={headPosition.y + 100}
          color="#D3550B"
          delay={0.8}
          direction="left"
          scale={1}
        />
        <WaveStream
          startX={headPosition.x + 30}
          startY={headPosition.y + 120}
          color="#F89017"
          delay={1}
          direction="right"
          scale={0.8}
        />

        {/* Organic morphing blobs */}
        {blobs.map((blob, i) => (
          <OrganicBlob
            key={`blob-${i}`}
            {...blob}
            parallaxOffset={i < 5 ? parallax2 : parallax3}
          />
        ))}
      </svg>
    </motion.div>
  )
}

export default memo(OrganicWorld)
