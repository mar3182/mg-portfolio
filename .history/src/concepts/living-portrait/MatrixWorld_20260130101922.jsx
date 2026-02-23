/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MATRIX WORLD — Digital/Tech Side
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Futuristic tech elements:
 * - Matrix code rain effect
 * - Circuit board traces
 * - Glowing nodes/connections
 * - Geometric grid patterns
 * - Cool cyan/purple color palette
 */

import { memo, useMemo, useRef, useEffect } from 'react'
import { motion, useTransform } from 'framer-motion'

// Tech color palette
const COLORS = {
  cyan: '#1be7ff',
  blue: '#0ea5e9',
  purple: '#8b5cf6',
  magenta: '#d946ef',
  dark: '#0a0a1a',
  grid: 'rgba(27, 231, 255, 0.1)',
}

// Matrix rain character set
const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF'

// Individual rain drop/column
const MatrixColumn = memo(function MatrixColumn({ x, speed, chars, delay }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {chars.map((char, i) => (
        <motion.text
          key={i}
          x={x}
          y={0}
          fill={i === chars.length - 1 ? COLORS.cyan : COLORS.cyan}
          fillOpacity={i === chars.length - 1 ? 1 : 0.3 - (chars.length - 1 - i) * 0.03}
          fontSize="14"
          fontFamily="monospace"
          animate={{
            y: [i * 20 - 100, i * 20 + 900],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
            delay: delay + i * 0.05,
          }}
        >
          {char}
        </motion.text>
      ))}
    </motion.g>
  )
})

// Circuit trace line
const CircuitTrace = memo(function CircuitTrace({ points, delay, parallax }) {
  const pathD = useMemo(() => {
    if (points.length < 2) return ''
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      // Right angles for circuit look
      if (Math.abs(curr.x - prev.x) > Math.abs(curr.y - prev.y)) {
        d += ` H ${curr.x} V ${curr.y}`
      } else {
        d += ` V ${curr.y} H ${curr.x}`
      }
    }
    return d
  }, [points])
  
  return (
    <motion.g style={{ x: parallax?.x, y: parallax?.y }}>
      {/* Trace shadow/glow */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={COLORS.cyan}
        strokeWidth="3"
        strokeOpacity="0.2"
        filter="blur(4px)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 1.5, ease: 'easeOut' }}
      />
      {/* Main trace */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={COLORS.cyan}
        strokeWidth="1.5"
        strokeOpacity="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 1.5, ease: 'easeOut' }}
      />
    </motion.g>
  )
})

// Circuit node
const CircuitNode = memo(function CircuitNode({ cx, cy, radius, delay, parallax, pulse }) {
  return (
    <motion.g style={{ x: parallax?.x, y: parallax?.y }}>
      {/* Outer glow */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={radius * 2}
        fill={COLORS.cyan}
        fillOpacity="0.1"
        initial={{ scale: 0 }}
        animate={{ 
          scale: pulse ? [1, 1.3, 1] : 1,
          opacity: pulse ? [0.1, 0.3, 0.1] : 0.1,
        }}
        transition={{
          delay,
          duration: pulse ? 2 : 0.5,
          repeat: pulse ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
      {/* Core */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={COLORS.dark}
        stroke={COLORS.cyan}
        strokeWidth="1.5"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay, duration: 0.4, type: 'spring' }}
      />
      {/* Inner dot */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={radius * 0.4}
        fill={COLORS.cyan}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
      />
    </motion.g>
  )
})

// Geometric hexagon
const Hexagon = memo(function Hexagon({ cx, cy, size, rotation, delay, parallax }) {
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2
      pts.push({
        x: cx + size * Math.cos(angle),
        y: cy + size * Math.sin(angle),
      })
    }
    return pts.map(p => `${p.x},${p.y}`).join(' ')
  }, [cx, cy, size])
  
  return (
    <motion.g style={{ x: parallax?.x, y: parallax?.y }}>
      <motion.polygon
        points={points}
        fill="none"
        stroke={COLORS.purple}
        strokeWidth="1"
        strokeOpacity="0.4"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ 
          scale: 1, 
          rotate: rotation,
        }}
        transition={{ 
          delay, 
          duration: 0.8,
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
        }}
      />
    </motion.g>
  )
})

// Data particle
const DataParticle = memo(function DataParticle({ startX, startY, endX, endY, delay, duration }) {
  return (
    <motion.circle
      cx={startX}
      cy={startY}
      r="2"
      fill={COLORS.cyan}
      initial={{ opacity: 0 }}
      animate={{
        cx: [startX, endX],
        cy: [startY, endY],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        delay,
        duration,
        repeat: Infinity,
        ease: 'linear',
        times: [0, 0.1, 0.9, 1],
      }}
    />
  )
})

// Grid background
const GridPattern = memo(function GridPattern() {
  return (
    <defs>
      <pattern id="techGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke={COLORS.grid}
          strokeWidth="0.5"
        />
      </pattern>
      <linearGradient id="gridFade" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="white" stopOpacity="0" />
        <stop offset="30%" stopColor="white" stopOpacity="1" />
        <stop offset="70%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <mask id="gridMask">
        <rect x="0" y="0" width="100%" height="100%" fill="url(#gridFade)" />
      </mask>
    </defs>
  )
})

// Main matrix world component
function MatrixWorld({ identity, parallaxX, parallaxY }) {
  const videoRef = useRef(null)
  
  // Opacity based on identity (visible on right/tech side)
  const opacity = useTransform(identity, [0.3, 0.5, 0.7, 1], [0, 0.3, 0.8, 1])
  
  // Video only plays when tech side is active (performance optimization)
  useEffect(() => {
    const unsubscribe = opacity.on('change', (value) => {
      if (videoRef.current) {
        if (value > 0.1) {
          videoRef.current.play().catch(() => {})
        } else {
          videoRef.current.pause()
        }
      }
    })
    return () => unsubscribe()
  }, [opacity])
  
  // Parallax transforms
  const parallax1 = {
    x: useTransform(parallaxX, v => -v * 0.5),
    y: useTransform(parallaxY, v => v * 0.5),
  }
  const parallax2 = {
    x: useTransform(parallaxX, v => -v * 0.8),
    y: useTransform(parallaxY, v => v * 0.8),
  }
  
  // Matrix columns data
  const matrixColumns = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      x: 250 + i * 25,
      speed: 8 + Math.random() * 6,
      chars: Array.from({ length: 15 }, () => 
        MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      ),
      delay: i * 0.2,
    }))
  }, [])
  
  // Circuit traces - extending toward portrait center (left side of SVG)
  const circuits = useMemo(() => [
    {
      // Top circuit reaching toward center
      points: [
        { x: 550, y: 80 },
        { x: 480, y: 80 },
        { x: 480, y: 150 },
        { x: 380, y: 150 },
        { x: 380, y: 250 },
        { x: 280, y: 250 },
        { x: 280, y: 320 },
      ],
      delay: 0.3,
    },
    {
      // Middle circuit
      points: [
        { x: 580, y: 350 },
        { x: 500, y: 350 },
        { x: 500, y: 420 },
        { x: 400, y: 420 },
        { x: 400, y: 480 },
        { x: 300, y: 480 },
      ],
      delay: 0.6,
    },
    {
      // Bottom circuit reaching toward center
      points: [
        { x: 550, y: 600 },
        { x: 480, y: 600 },
        { x: 480, y: 550 },
        { x: 380, y: 550 },
        { x: 380, y: 480 },
        { x: 300, y: 480 },
        { x: 300, y: 400 },
      ],
      delay: 0.9,
    },
    {
      // Additional circuit from top-right
      points: [
        { x: 600, y: 200 },
        { x: 520, y: 200 },
        { x: 520, y: 300 },
        { x: 420, y: 300 },
        { x: 420, y: 380 },
      ],
      delay: 1.2,
    },
  ], [])
  
  // Circuit nodes - positioned along circuits, some near center
  const nodes = useMemo(() => [
    { cx: 280, cy: 320, radius: 10, delay: 0.8, pulse: true },
    { cx: 300, cy: 480, radius: 8, delay: 1.1, pulse: true },
    { cx: 380, cy: 250, radius: 6, delay: 0.5, pulse: false },
    { cx: 300, cy: 400, radius: 9, delay: 1.4, pulse: true },
    { cx: 420, cy: 380, radius: 7, delay: 0.9, pulse: false },
    { cx: 400, cy: 420, radius: 6, delay: 1.0, pulse: false },
    { cx: 480, cy: 150, radius: 5, delay: 0.6, pulse: false },
  ], [])
  
  // Hexagons - some closer to center
  const hexagons = useMemo(() => [
    { cx: 320, cy: 180, size: 35, rotation: 30, delay: 0.5 },
    { cx: 280, cy: 380, size: 30, rotation: -20, delay: 0.8 },
    { cx: 450, cy: 280, size: 25, rotation: 45, delay: 1.1 },
    { cx: 350, cy: 550, size: 28, rotation: 15, delay: 1.3 },
    { cx: 520, cy: 450, size: 22, rotation: -30, delay: 1.5 },
  ], [])
  
  // Data particles - flowing toward center
  const particles = useMemo(() => [
    { startX: 550, startY: 150, endX: 280, endY: 320, delay: 1.5, duration: 2.5 },
    { startX: 580, startY: 400, endX: 300, endY: 480, delay: 2.0, duration: 3 },
    { startX: 520, startY: 550, endX: 300, endY: 400, delay: 2.5, duration: 2.5 },
    { startX: 500, startY: 250, endX: 320, endY: 380, delay: 3.0, duration: 2 },
  ], [])
  
  return (
    <motion.div 
      className="matrix-world"
      style={{ opacity }}
    >
      {/* Video background layer */}
      <div className="matrix-world__video-layer">
        <video
          ref={videoRef}
          className="matrix-world__video"
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/tech-background-video.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* SVG foreground layer with vector animations */}
      <svg
        viewBox="0 0 600 800"
        preserveAspectRatio="xMaxYMid slice"
        className="matrix-world__svg"
      >
        <GridPattern />
        
        {/* Grid background - very subtle */}
        <rect 
          x="0" 
          y="0" 
          width="600" 
          height="800" 
          fill="url(#techGrid)" 
          mask="url(#gridMask)"
          opacity="0.3"
        />
        
        {/* Matrix rain (subtle) */}
        <g opacity="0.3">
          {matrixColumns.slice(0, 6).map((col, i) => (
            <MatrixColumn key={i} {...col} />
          ))}
        </g>
        
        {/* Circuit traces */}
        {circuits.map((circuit, i) => (
          <CircuitTrace key={i} {...circuit} parallax={parallax1} />
        ))}
        
        {/* Hexagons */}
        {hexagons.map((hex, i) => (
          <Hexagon key={i} {...hex} parallax={parallax2} />
        ))}
        
        {/* Circuit nodes */}
        {nodes.map((node, i) => (
          <CircuitNode key={i} {...node} parallax={parallax1} />
        ))}
        
        {/* Data particles */}
        {particles.map((particle, i) => (
          <DataParticle key={i} {...particle} />
        ))}
      </svg>
    </motion.div>
  )
}

export default memo(MatrixWorld)
