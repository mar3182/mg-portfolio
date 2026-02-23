/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORGANIC WORLD — Flowing Forms from Design Background
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Uses the artistic paths from design-background.svg to create
 * organic flowing forms that emanate from the portrait's head.
 * The forms appear to grow, flow and evolve like waves from the hair.
 */

import { memo, useMemo } from 'react'
import { useTransform, motion, useSpring } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════════
// SVG PATH DATA - Extracted key flowing forms from design-background.svg
// These paths create the organic abstract shapes
// ═══════════════════════════════════════════════════════════════════════════

// Group paths by their visual characteristics and position
const FLOW_PATHS = {
  // Orange/coral warm tones - primary flowing forms
  warm: [
    { d: "m0 0 7 4 6 4-4 1-6-4v-2l-4-2z", fill: "#F37A0A", transform: "translate(468,934)" },
    { d: "m0 0 5 2 6 3-4 2-6-3z", fill: "#AD3307", transform: "translate(535,922)" },
    { d: "m0 0 4 2 5 4 4 4-1 3-12-12z", fill: "#D3550B", transform: "translate(635,914)" },
    { d: "m0 0h9l5 2v2h-5l-9-3z", fill: "#F89017", transform: "translate(929,897)" },
    { d: "m0 0h6v4l-3 2h-3z", fill: "#F8880B", transform: "translate(444,891)" },
    { d: "m0 0 16 1-2 1v2l4 1-3 1-5-3-10-2z", fill: "#A13B11", transform: "translate(655,887)" },
    { d: "m0 0 10 2 7 2v1h-9l-8-4z", fill: "#362727", transform: "translate(559,862)" },
    { d: "m0 0 11 1v1l-7 1-3 1-5-1 1-2z", fill: "#BD4709", transform: "translate(577,854)" },
    { d: "m0 0 5 1 8 4-4 2-2-2-5-1z", fill: "#181721", transform: "translate(465,827)" },
    { d: "m0 0 3 3-8 3-4-1 3-3h6z", fill: "#CB6529", transform: "translate(528,794)" },
  ],
  
  // Golden/amber highlights
  golden: [
    { d: "m0 0 6 1 2 3-4 3h-3v-5z", fill: "#FCB835", transform: "translate(827,942)" },
    { d: "m0 0h18l3 2h-22z", fill: "#CA9362", transform: "translate(759,680)" },
    { d: "m0 0 4 1 5 2v2l-10-1z", fill: "#F7AA43", transform: "translate(526,653)" },
    { d: "m0 0h1v7l-4 1-1-6z", fill: "#CD8B54", transform: "translate(625,628)" },
    { d: "m0 0h14l-1 5-5-2-1-1-7-1z", fill: "#F98A0A", transform: "translate(826,964)" },
    { d: "m0 0h5l-1 7h-3z", fill: "#FCB838", transform: "translate(768,1000)" },
    { d: "m0 0 3 1v6l-4-2z", fill: "#DDAB7F", transform: "translate(625,628)" },
  ],
  
  // Deep reds/burgundy - accent forms
  deep: [
    { d: "m0 0 5 2 2 3-5 2-4-4z", fill: "#B92F04", transform: "translate(364,943)" },
    { d: "m0 0 9 5 1 2-12-2 2-2z", fill: "#1B0D0B", transform: "translate(373,913)" },
    { d: "m0 0 6 2v1h-18v-1z", fill: "#291412", transform: "translate(751,881)" },
    { d: "m0 0 6 3v1l-13 1v-2h2l1-2z", fill: "#68250E", transform: "translate(626,834)" },
    { d: "m0 0 4 1 6 3v2l-7-1-2 2 1-4z", fill: "#CC8851", transform: "translate(515,685)" },
    { d: "m0 0h3v5h2l-1 4h-4z", fill: "#847E78", transform: "translate(631,669)" },
  ],
  
  // Teal/forest accents
  cool: [
    { d: "m0 0h2l1 4-3 2h-5v-3z", fill: "#24466B", transform: "translate(220,924)" },
    { d: "m0 0 5 1 3 2v2l-4 1-4-3z", fill: "#172638", transform: "translate(566,900)" },
    { d: "m0 0h3l-1 4-2 3-2-3h-5l-1-2 5-1z", fill: "#14151C", transform: "translate(277,787)" },
    { d: "m0 0 3 1 3 9h-3l-3-6z", fill: "#122843", transform: "translate(465,589)" },
    { d: "m0 0 4 1 1 4-7 2v-5z", fill: "#203F62", transform: "translate(362,498)" },
    { d: "m0 0h6l3 2v2l-5 1-4-4z", fill: "#6E4D3D", transform: "translate(136,666)" },
  ],
  
  // Large flowing shapes for background
  flowing: [
    { d: "m0 0 2 1v3h4l1-3v3l3 1-1 4-1-4h-9z", fill: "#909395", transform: "translate(674,753)" },
    { d: "m0 0 3 1v3h4l1-3 2 4h-7l-2 4-1-3 1-2z", fill: "#CFBBAB", transform: "translate(678,581)" },
    { d: "m0 0 4 4 3 1 2 6-1 4-3-8h-3l-2-4z", fill: "#3E3D41", transform: "translate(500,560)" },
    { d: "m0 0 2 2 1 4h-2l-1 2-5-2 2-1 1-3h2z", fill: "#120A0C", transform: "translate(233,550)" },
    { d: "m0 0 2 2 2 10-2 1-3-7z", fill: "#D9811F", transform: "translate(285,538)" },
    { d: "m0 0 5 1v5l-3 3-2-1v-5z", fill: "#E75D06", transform: "translate(572,532)" },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// FLOWING PATH COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const FlowingPath = memo(function FlowingPath({ 
  d, 
  fill, 
  transform, 
  delay = 0, 
  scale = 1,
  parallaxOffset = { x: 0, y: 0 }
}) {
  return (
    <motion.path
      d={d}
      fill={fill}
      transform={transform}
      style={{
        x: parallaxOffset.x,
        y: parallaxOffset.y,
      }}
      initial={{ 
        opacity: 0, 
        scale: 0.3,
        filter: 'blur(10px)'
      }}
      animate={{ 
        opacity: [0, 0.9, 0.7],
        scale: [0.3, scale * 1.1, scale],
        filter: ['blur(10px)', 'blur(0px)', 'blur(0px)']
      }}
      transition={{ 
        delay,
        duration: 3,
        ease: [0.22, 1, 0.36, 1],
        times: [0, 0.6, 1]
      }}
    />
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
  
  // Parallax layers based on identity
  const parallax1 = {
    x: useTransform(smoothIdentity, [0, 1], [0, 100]),
    y: useTransform(smoothIdentity, [0, 1], [0, 50]),
  }
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
        className="organic-world__background-layer"
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

        {/* Layer 1: Background flowing paths */}
        <motion.g 
          className="organic-world__layer organic-world__layer--bg"
          style={{ x: parallax1.x, y: parallax1.y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {FLOW_PATHS.flowing.map((path, i) => (
            <FlowingPath
              key={`flowing-${i}`}
              {...path}
              delay={0.5 + i * 0.2}
              scale={1.5}
              parallaxOffset={parallax1}
            />
          ))}
        </motion.g>

        {/* Layer 2: Warm colored paths */}
        <motion.g 
          className="organic-world__layer organic-world__layer--warm"
          style={{ x: parallax2.x, y: parallax2.y }}
        >
          {FLOW_PATHS.warm.map((path, i) => (
            <FlowingPath
              key={`warm-${i}`}
              {...path}
              delay={0.3 + i * 0.15}
              scale={1.2}
              parallaxOffset={parallax2}
            />
          ))}
        </motion.g>

        {/* Layer 3: Golden accent paths */}
        <motion.g 
          className="organic-world__layer organic-world__layer--golden"
          style={{ x: parallax3.x, y: parallax3.y }}
        >
          {FLOW_PATHS.golden.map((path, i) => (
            <FlowingPath
              key={`golden-${i}`}
              {...path}
              delay={0.4 + i * 0.12}
              scale={1.3}
              parallaxOffset={parallax3}
            />
          ))}
        </motion.g>

        {/* Layer 4: Deep color accents */}
        <motion.g className="organic-world__layer organic-world__layer--deep">
          {FLOW_PATHS.deep.map((path, i) => (
            <FlowingPath
              key={`deep-${i}`}
              {...path}
              delay={0.6 + i * 0.18}
              scale={1.1}
            />
          ))}
        </motion.g>

        {/* Layer 5: Cool tones for contrast */}
        <motion.g className="organic-world__layer organic-world__layer--cool">
          {FLOW_PATHS.cool.map((path, i) => (
            <FlowingPath
              key={`cool-${i}`}
              {...path}
              delay={0.7 + i * 0.2}
              scale={1.0}
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
