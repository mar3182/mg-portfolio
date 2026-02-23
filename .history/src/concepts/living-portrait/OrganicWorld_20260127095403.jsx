/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORGANIC WORLD — Frida Kahlo Inspired Design Side
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Latin-inspired organic elements:
 * - Flowing botanical branches with leaves
 * - Golden sun orbs
 * - Paint splatters and color bursts
 * - Decorative flowing lines
 * - Warm earthy color palette
 */

import { memo, useMemo } from 'react'
import { motion, useTransform } from 'framer-motion'

// Color palette inspired by Frida Kahlo
const COLORS = {
  coral: '#ff7f50',
  orange: '#ff8c42',
  gold: '#f4a534',
  terracotta: '#c74b2a',
  navy: '#1a365d',
  cream: '#fef3c7',
  magenta: '#be185d',
}

// Generate leaf paths for branches
const generateLeafPath = (cx, cy, size, rotation) => {
  const w = size * 0.4
  const h = size
  return `
    M ${cx} ${cy - h / 2}
    Q ${cx + w} ${cy - h / 4} ${cx + w * 0.8} ${cy + h / 4}
    Q ${cx} ${cy + h / 2} ${cx - w * 0.8} ${cy + h / 4}
    Q ${cx - w} ${cy - h / 4} ${cx} ${cy - h / 2}
    Z
  `
}

// Leaf component
const Leaf = memo(function Leaf({ x, y, size, rotation, color, delay, parallax }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8, type: 'spring' }}
      style={{ x: parallax?.x, y: parallax?.y }}
    >
      <motion.path
        d={generateLeafPath(x, y, size, rotation)}
        fill={color}
        transform={`rotate(${rotation} ${x} ${y})`}
        animate={{
          rotate: [rotation - 5, rotation + 5, rotation - 5],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Leaf vein */}
      <motion.line
        x1={x}
        y1={y - size / 2}
        x2={x}
        y2={y + size / 3}
        stroke={color === COLORS.navy ? COLORS.cream : COLORS.navy}
        strokeWidth="0.5"
        strokeOpacity="0.4"
        transform={`rotate(${rotation} ${x} ${y})`}
      />
    </motion.g>
  )
})

// Branch with leaves
const Branch = memo(function Branch({ startX, startY, curve, leaves, delay, parallax }) {
  const pathId = useMemo(() => `branch-${startX}-${startY}`, [startX, startY])
  
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1 }}
      style={{ x: parallax?.x, y: parallax?.y }}
    >
      {/* Branch line */}
      <motion.path
        d={curve}
        fill="none"
        stroke={COLORS.terracotta}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 1.5, ease: 'easeOut' }}
      />
      
      {/* Leaves along branch */}
      {leaves.map((leaf, i) => (
        <Leaf
          key={i}
          x={leaf.x}
          y={leaf.y}
          size={leaf.size}
          rotation={leaf.rotation}
          color={leaf.color}
          delay={delay + 0.3 + i * 0.1}
          parallax={parallax}
        />
      ))}
    </motion.g>
  )
})

// Golden sun orb
const SunOrb = memo(function SunOrb({ cx, cy, radius, delay, parallax }) {
  return (
    <motion.g
      style={{ x: parallax?.x, y: parallax?.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8, type: 'spring' }}
    >
      {/* Outer glow */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={radius * 1.5}
        fill={`url(#sunGlow-${cx}-${cy})`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Core */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={COLORS.gold}
      />
      {/* Gradient definition */}
      <defs>
        <radialGradient id={`sunGlow-${cx}-${cy}`}>
          <stop offset="0%" stopColor={COLORS.gold} stopOpacity="0.8" />
          <stop offset="50%" stopColor={COLORS.orange} stopOpacity="0.4" />
          <stop offset="100%" stopColor={COLORS.orange} stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.g>
  )
})

// Paint splatter
const Splatter = memo(function Splatter({ cx, cy, size, color, delay, parallax }) {
  const blobs = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      x: cx + (Math.random() - 0.5) * size,
      y: cy + (Math.random() - 0.5) * size,
      r: size * (0.1 + Math.random() * 0.3),
      delay: i * 0.05,
    }))
  }, [cx, cy, size])
  
  return (
    <motion.g
      style={{ x: parallax?.x, y: parallax?.y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ delay, duration: 0.5 }}
    >
      {blobs.map((blob, i) => (
        <motion.circle
          key={i}
          cx={blob.x}
          cy={blob.y}
          r={blob.r}
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + blob.delay, duration: 0.4, type: 'spring' }}
        />
      ))}
    </motion.g>
  )
})

// Decorative flowing curve
const FlowingCurve = memo(function FlowingCurve({ path, color, strokeWidth, delay, parallax }) {
  return (
    <motion.path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeOpacity={0.6}
      style={{ x: parallax?.x, y: parallax?.y }}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay, duration: 2, ease: 'easeOut' }}
    />
  )
})

// Main organic world component
function OrganicWorld({ identity, parallaxX, parallaxY }) {
  // Opacity based on identity (visible on left/design side)
  const opacity = useTransform(identity, [0, 0.3, 0.5, 0.7], [1, 0.8, 0.3, 0])
  
  // Parallax transforms for different depths
  const parallax1 = {
    x: useTransform(parallaxX, v => v * 0.5),
    y: useTransform(parallaxY, v => v * 0.5),
  }
  const parallax2 = {
    x: useTransform(parallaxX, v => v * 0.8),
    y: useTransform(parallaxY, v => v * 0.8),
  }
  const parallax3 = {
    x: useTransform(parallaxX, v => v * 1.2),
    y: useTransform(parallaxY, v => v * 1.2),
  }
  
  // Pre-generated elements
  const branches = useMemo(() => [
    {
      startX: -50,
      startY: 200,
      curve: 'M -50 200 Q 150 180 200 350 Q 250 450 180 550',
      leaves: [
        { x: 80, y: 190, size: 35, rotation: -30, color: COLORS.navy },
        { x: 150, y: 220, size: 28, rotation: 15, color: COLORS.orange },
        { x: 190, y: 310, size: 40, rotation: -45, color: COLORS.navy },
        { x: 220, y: 390, size: 32, rotation: 30, color: COLORS.orange },
        { x: 200, y: 470, size: 38, rotation: -20, color: COLORS.coral },
        { x: 185, y: 530, size: 30, rotation: 45, color: COLORS.navy },
      ],
      delay: 0.5,
    },
    {
      startX: 100,
      startY: 0,
      curve: 'M 100 0 Q 80 120 150 200 Q 200 280 120 350',
      leaves: [
        { x: 90, y: 80, size: 30, rotation: 60, color: COLORS.orange },
        { x: 130, y: 160, size: 35, rotation: -35, color: COLORS.navy },
        { x: 170, y: 240, size: 28, rotation: 20, color: COLORS.coral },
        { x: 150, y: 310, size: 32, rotation: -50, color: COLORS.navy },
      ],
      delay: 0.8,
    },
    {
      startX: 250,
      startY: 600,
      curve: 'M 250 800 Q 200 650 280 550 Q 350 480 300 400',
      leaves: [
        { x: 230, y: 680, size: 35, rotation: 120, color: COLORS.coral },
        { x: 260, y: 580, size: 30, rotation: -70, color: COLORS.navy },
        { x: 310, y: 510, size: 38, rotation: 100, color: COLORS.orange },
        { x: 300, y: 440, size: 28, rotation: -40, color: COLORS.navy },
      ],
      delay: 1.0,
    },
  ], [])
  
  const suns = useMemo(() => [
    { cx: 80, cy: 120, radius: 25, delay: 0.3 },
    { cx: 250, cy: 80, radius: 18, delay: 0.6 },
    { cx: 50, cy: 450, radius: 15, delay: 0.9 },
  ], [])
  
  const splatters = useMemo(() => [
    { cx: 150, cy: 150, size: 60, color: COLORS.coral, delay: 1.2 },
    { cx: 80, cy: 380, size: 45, color: COLORS.magenta, delay: 1.4 },
    { cx: 220, cy: 280, size: 50, color: COLORS.navy, delay: 1.6 },
    { cx: 50, cy: 550, size: 40, color: COLORS.orange, delay: 1.8 },
  ], [])
  
  const curves = useMemo(() => [
    { path: 'M 0 300 Q 100 280 150 350 Q 200 420 100 500', color: COLORS.gold, strokeWidth: 1.5, delay: 1.0 },
    { path: 'M 300 100 Q 250 200 280 300 Q 310 400 250 450', color: COLORS.coral, strokeWidth: 1, delay: 1.3 },
  ], [])
  
  return (
    <motion.div 
      className="organic-world"
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 300 800"
        preserveAspectRatio="xMinYMid slice"
        className="organic-world__svg organic-world__svg--left"
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="organicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.orange} stopOpacity="0.1" />
            <stop offset="100%" stopColor={COLORS.coral} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="300" height="800" fill="url(#organicGradient)" />
        
        {/* Flowing curves */}
        {curves.map((curve, i) => (
          <FlowingCurve key={i} {...curve} parallax={parallax1} />
        ))}
        
        {/* Paint splatters */}
        {splatters.map((splatter, i) => (
          <Splatter key={i} {...splatter} parallax={parallax2} />
        ))}
        
        {/* Sun orbs */}
        {suns.map((sun, i) => (
          <SunOrb key={i} {...sun} parallax={parallax1} />
        ))}
        
        {/* Branches with leaves */}
        {branches.map((branch, i) => (
          <Branch key={i} {...branch} parallax={parallax3} />
        ))}
      </svg>
      
      {/* Right side mirrored (subtler) */}
      <svg
        viewBox="0 0 300 800"
        preserveAspectRatio="xMaxYMid slice"
        className="organic-world__svg organic-world__svg--right"
        style={{ transform: 'scaleX(-1)', opacity: 0.4 }}
      >
        {branches.slice(0, 1).map((branch, i) => (
          <Branch key={i} {...branch} parallax={parallax2} delay={branch.delay + 0.5} />
        ))}
        {suns.slice(0, 1).map((sun, i) => (
          <SunOrb key={i} {...sun} parallax={parallax1} delay={sun.delay + 0.5} />
        ))}
      </svg>
    </motion.div>
  )
}

export default memo(OrganicWorld)
