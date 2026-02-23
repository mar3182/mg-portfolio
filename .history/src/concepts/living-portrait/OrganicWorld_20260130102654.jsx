/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORGANIC WORLD — Video Background + Vector Vegetation Foreground
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Design side with:
 * - Video background for rich organic atmosphere
 * - SVG vector vegetation (leaves, vines, flowers) in foreground
 * - Interactive elements for project reveals
 */

import { memo, useRef, useEffect, useMemo } from 'react'
import { useTransform, motion, useSpring } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN COLOR PALETTE
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  orange: '#F37A0A',
  gold: '#FCB835',
  coral: '#D3550B',
  rust: '#AD3307',
  amber: '#F89017',
  pink: '#C71585',
  warmWhite: '#FFF8F0',
}

// ═══════════════════════════════════════════════════════════════════════════
// ORGANIC LEAF COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const OrganicLeaf = memo(function OrganicLeaf({ 
  x, y, size, rotation, color, delay, parallax 
}) {
  // Leaf SVG path - organic teardrop shape
  const leafPath = `
    M 0 ${-size}
    Q ${size * 0.6} ${-size * 0.3} ${size * 0.4} ${size * 0.5}
    Q 0 ${size} 0 ${size}
    Q 0 ${size} ${-size * 0.4} ${size * 0.5}
    Q ${-size * 0.6} ${-size * 0.3} 0 ${-size}
    Z
  `
  
  return (
    <motion.g
      style={{ x: parallax?.x, y: parallax?.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Leaf glow */}
      <motion.path
        d={leafPath}
        fill={color}
        fillOpacity="0.3"
        transform={`translate(${x}, ${y}) rotate(${rotation})`}
        filter="blur(8px)"
      />
      {/* Main leaf */}
      <motion.path
        d={leafPath}
        fill={color}
        fillOpacity="0.8"
        transform={`translate(${x}, ${y}) rotate(${rotation})`}
        animate={{
          rotate: [rotation, rotation + 5, rotation - 3, rotation],
        }}
        transition={{
          duration: 6 + Math.random() * 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Leaf vein */}
      <motion.line
        x1={x}
        y1={y - size * 0.8}
        x2={x}
        y2={y + size * 0.7}
        stroke={COLORS.warmWhite}
        strokeWidth="1"
        strokeOpacity="0.3"
        transform={`rotate(${rotation}, ${x}, ${y})`}
      />
    </motion.g>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// FLOWING VINE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const FlowingVine = memo(function FlowingVine({ 
  startX, startY, color, delay, direction = 'down', length = 200 
}) {
  const xDir = direction === 'left' ? -1 : direction === 'right' ? 1 : 0
  const yDir = direction === 'up' ? -1 : 1
  
  const pathD = useMemo(() => {
    let d = `M ${startX} ${startY}`
    const segments = 5
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments
      const waveX = Math.sin(t * Math.PI * 2) * 30 * (xDir || 1)
      const x = startX + waveX + (xDir * t * length * 0.5)
      const y = startY + (yDir * t * length)
      
      const cpX = startX + Math.sin((t - 0.25) * Math.PI * 2) * 30 * (xDir || 1)
      const cpY = startY + (yDir * (t - 0.25) * length)
      
      d += ` Q ${cpX} ${cpY} ${x} ${y}`
    }
    return d
  }, [startX, startY, xDir, yDir, length])

  return (
    <motion.g>
      {/* Vine glow */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeOpacity="0.2"
        strokeLinecap="round"
        filter="blur(4px)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 2, ease: 'easeOut' }}
      />
      {/* Main vine */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeOpacity="0.7"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 2, ease: 'easeOut' }}
      />
    </motion.g>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// ORGANIC FLOWER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const OrganicFlower = memo(function OrganicFlower({ 
  cx, cy, size, color, delay, parallax, petals = 5 
}) {
  const petalPaths = useMemo(() => {
    return Array.from({ length: petals }, (_, i) => {
      const angle = (i / petals) * Math.PI * 2
      const petalLength = size * 0.8
      const petalWidth = size * 0.35
      
      return {
        angle: (angle * 180) / Math.PI,
        path: `
          M 0 0
          Q ${petalWidth} ${-petalLength * 0.5} 0 ${-petalLength}
          Q ${-petalWidth} ${-petalLength * 0.5} 0 0
          Z
        `
      }
    })
  }, [petals, size])

  return (
    <motion.g
      style={{ x: parallax?.x, y: parallax?.y }}
      initial={{ opacity: 0, scale: 0, rotate: -30 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Flower glow */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={size * 1.2}
        fill={color}
        fillOpacity="0.15"
        filter="blur(10px)"
      />
      
      {/* Petals */}
      {petalPaths.map((petal, i) => (
        <motion.path
          key={i}
          d={petal.path}
          fill={color}
          fillOpacity={0.7 - i * 0.05}
          transform={`translate(${cx}, ${cy}) rotate(${petal.angle})`}
          animate={{
            rotate: [petal.angle, petal.angle + 3, petal.angle - 2, petal.angle],
          }}
          transition={{
            duration: 5 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: delay + i * 0.1,
          }}
        />
      ))}
      
      {/* Flower center */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={size * 0.25}
        fill={COLORS.gold}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.g>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// FLOATING PARTICLE (pollen/sparkle)
// ═══════════════════════════════════════════════════════════════════════════

const FloatingParticle = memo(function FloatingParticle({ 
  startX, startY, color, delay, size = 3 
}) {
  return (
    <motion.circle
      cx={startX}
      cy={startY}
      r={size}
      fill={color}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        cy: [startY, startY - 100 - Math.random() * 100],
        cx: [startX, startX + (Math.random() - 0.5) * 80],
      }}
      transition={{
        delay,
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ORGANIC WORLD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function OrganicWorld({ identity }) {
  const videoRef = useRef(null)
  
  // Smooth spring for identity transitions
  const smoothIdentity = useSpring(identity, { stiffness: 40, damping: 25 })
  
  // Transform identity (0 = design, 1 = tech) to opacity and movement
  const opacity = useTransform(smoothIdentity, [0, 0.3, 0.7, 1], [1, 0.8, 0.3, 0])
  const scale = useTransform(smoothIdentity, [0, 0.5, 1], [1, 0.98, 0.92])
  
  // Parallax for SVG elements
  const parallax1 = {
    x: useTransform(smoothIdentity, [0, 1], [0, 80]),
    y: useTransform(smoothIdentity, [0, 1], [0, 40]),
  }
  const parallax2 = {
    x: useTransform(smoothIdentity, [0, 1], [0, 50]),
    y: useTransform(smoothIdentity, [0, 1], [0, 25]),
  }
  
  // Video layer parallax
  const videoX = useTransform(smoothIdentity, [0, 1], [0, 120])
  const videoY = useTransform(smoothIdentity, [0, 1], [0, 60])
  const videoRotate = useTransform(smoothIdentity, [0, 1], [0, 8])
  
  // Video playback control - pause when not visible
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

  // Leaves data - positioned around top-left area
  const leaves = useMemo(() => [
    { x: 80, y: 120, size: 35, rotation: -30, color: COLORS.orange, delay: 0.3 },
    { x: 150, y: 80, size: 28, rotation: 15, color: COLORS.gold, delay: 0.5 },
    { x: 50, y: 200, size: 40, rotation: -60, color: COLORS.coral, delay: 0.7 },
    { x: 200, y: 150, size: 32, rotation: 45, color: COLORS.amber, delay: 0.9 },
    { x: 120, y: 280, size: 25, rotation: -15, color: COLORS.orange, delay: 1.1 },
    { x: 280, y: 100, size: 30, rotation: 30, color: COLORS.gold, delay: 1.3 },
    { x: 60, y: 350, size: 38, rotation: -45, color: COLORS.rust, delay: 1.5 },
    { x: 220, y: 250, size: 26, rotation: 60, color: COLORS.coral, delay: 1.7 },
  ], [])

  // Vines flowing from top
  const vines = useMemo(() => [
    { startX: 100, startY: 0, color: COLORS.coral, delay: 0.5, direction: 'down', length: 300 },
    { startX: 200, startY: 0, color: COLORS.rust, delay: 0.8, direction: 'down', length: 250 },
    { startX: 50, startY: 150, color: COLORS.orange, delay: 1.0, direction: 'down', length: 200 },
    { startX: 300, startY: 50, color: COLORS.amber, delay: 1.2, direction: 'down', length: 280 },
  ], [])

  // Flowers at key positions
  const flowers = useMemo(() => [
    { cx: 120, cy: 180, size: 25, color: COLORS.orange, delay: 1.0, petals: 6 },
    { cx: 250, cy: 120, size: 20, color: COLORS.gold, delay: 1.3, petals: 5 },
    { cx: 80, cy: 320, size: 28, color: COLORS.pink, delay: 1.6, petals: 7 },
    { cx: 200, cy: 280, size: 22, color: COLORS.coral, delay: 1.9, petals: 5 },
  ], [])

  // Floating particles (pollen)
  const particles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      startX: 50 + Math.random() * 300,
      startY: 200 + Math.random() * 400,
      color: [COLORS.gold, COLORS.orange, COLORS.warmWhite][i % 3],
      delay: i * 0.3,
      size: 2 + Math.random() * 3,
    }))
  , [])

  return (
    <motion.div 
      className="organic-world"
      style={{ opacity, scale }}
    >
      {/* Video background layer */}
      <motion.div 
        className="organic-world__video-layer"
        style={{ 
          x: videoX, 
          y: videoY,
          rotate: videoRotate,
        }}
      >
        <video 
          ref={videoRef}
          className="organic-world__video"
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/video (1).webm" type="video/webm" />
          <source src="/video (1).mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* SVG vector foreground layer */}
      <svg
        viewBox="0 0 400 600"
        preserveAspectRatio="xMinYMin slice"
        className="organic-world__svg"
      >
        <defs>
          {/* Warm glow gradient */}
          <radialGradient id="organicGlow" cx="30%" cy="20%" r="70%">
            <stop offset="0%" stopColor={COLORS.orange} stopOpacity="0.3" />
            <stop offset="50%" stopColor={COLORS.coral} stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <rect 
          x="0" y="0" 
          width="400" height="600" 
          fill="url(#organicGlow)" 
        />

        {/* Flowing vines */}
        {vines.map((vine, i) => (
          <FlowingVine key={`vine-${i}`} {...vine} />
        ))}

        {/* Organic leaves */}
        {leaves.map((leaf, i) => (
          <OrganicLeaf 
            key={`leaf-${i}`} 
            {...leaf} 
            parallax={i % 2 === 0 ? parallax1 : parallax2} 
          />
        ))}

        {/* Flowers */}
        {flowers.map((flower, i) => (
          <OrganicFlower 
            key={`flower-${i}`} 
            {...flower} 
            parallax={parallax2} 
          />
        ))}

        {/* Floating particles */}
        {particles.map((particle, i) => (
          <FloatingParticle key={`particle-${i}`} {...particle} />
        ))}
      </svg>

      {/* Glow overlay */}
      <motion.div 
        className="organic-world__glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
    </motion.div>
  )
}

export default memo(OrganicWorld)
