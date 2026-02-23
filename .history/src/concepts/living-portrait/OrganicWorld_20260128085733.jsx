/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORGANIC WORLD — Frida Kahlo Inspired Design Side (Refined)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Rich botanical elements inspired by Frida Kahlo's paintings:
 * - Tropical flowers (dahlias, hibiscus, roses)
 * - Monarch butterflies
 * - Lush foliage with varied leaf shapes
 * - Curling vines and tendrils
 * - Floating petals
 * - Golden sun accents
 * - Warm, earthy Mexican color palette
 */

import { memo, useMemo } from 'react'
import { useTransform, motion } from 'framer-motion'

// Frida Kahlo inspired color palette
const COLORS = {
  // Warm florals
  coral: '#ff6b6b',
  rose: '#e84a5f',
  magenta: '#c71585',
  fuchsia: '#ff1493',
  peach: '#ffab91',
  
  // Golden accents
  gold: '#ffd700',
  amber: '#ffbf00',
  marigold: '#f4a534',
  
  // Foliage
  emerald: '#2d5a27',
  forest: '#1b4332',
  sage: '#588157',
  mint: '#95d5b2',
  
  // Earthy
  terracotta: '#c74b2a',
  sienna: '#a0522d',
  navy: '#1a365d',
  cream: '#fef3c7',
}

// ═══════════════════════════════════════════════════════════════════════════
// FLOWER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// Dahlia-style layered flower
const Dahlia = memo(function Dahlia({ cx, cy, size, color, delay, parallax }) {
  const layers = 4
  const petalsPerLayer = [8, 12, 16, 20]
  
  return (
    <motion.g
      style={{ x: parallax?.x, y: parallax?.y }}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, duration: 1.2, type: 'spring', stiffness: 60 }}
    >
      {/* Flower layers from outside to inside */}
      {Array.from({ length: layers }).map((_, layerIndex) => {
        const layerSize = size * (1 - layerIndex * 0.2)
        const numPetals = petalsPerLayer[layerIndex]
        const layerColor = layerIndex % 2 === 0 ? color : COLORS.peach
        
        return (
          <g key={layerIndex}>
            {Array.from({ length: numPetals }).map((_, petalIndex) => {
              const angle = (petalIndex / numPetals) * 360 + layerIndex * 15
              const petalLength = layerSize * 0.5
              const petalWidth = layerSize * 0.15
              
              return (
                <motion.ellipse
                  key={petalIndex}
                  cx={cx}
                  cy={cy - petalLength * 0.5}
                  rx={petalWidth}
                  ry={petalLength}
                  fill={layerColor}
                  fillOpacity={0.9 - layerIndex * 0.1}
                  transform={`rotate(${angle} ${cx} ${cy})`}
                  animate={{
                    ry: [petalLength, petalLength * 1.05, petalLength],
                  }}
                  transition={{
                    duration: 3 + Math.random(),
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: petalIndex * 0.05,
                  }}
                />
              )
            })}
          </g>
        )
      })}
      
      {/* Center */}
      <circle cx={cx} cy={cy} r={size * 0.12} fill={COLORS.gold} />
      <circle cx={cx} cy={cy} r={size * 0.06} fill={COLORS.amber} />
    </motion.g>
  )
})

// Simple 5-petal flower
const SimpleFlower = memo(function SimpleFlower({ cx, cy, size, color, delay, parallax }) {
  const petals = 5
  
  return (
    <motion.g
      style={{ x: parallax?.x, y: parallax?.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8, type: 'spring' }}
    >
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * 360 - 90
        const petalLength = size * 0.45
        
        return (
          <motion.ellipse
            key={i}
            cx={cx}
            cy={cy - petalLength * 0.4}
            rx={size * 0.2}
            ry={petalLength}
            fill={color}
            fillOpacity={0.85}
            transform={`rotate(${angle} ${cx} ${cy})`}
            animate={{ rotate: [angle - 2, angle + 2, angle - 2] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        )
      })}
      <circle cx={cx} cy={cy} r={size * 0.15} fill={COLORS.marigold} />
    </motion.g>
  )
})

// Rose with spiral petals
const Rose = memo(function Rose({ cx, cy, size, color, delay, parallax }) {
  return (
    <motion.g
      style={{ x: parallax?.x, y: parallax?.y }}
      initial={{ opacity: 0, scale: 0, rotate: -90 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, duration: 1, type: 'spring' }}
    >
      {/* Outer petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360
        return (
          <motion.path
            key={i}
            d={`M ${cx} ${cy} 
                Q ${cx + size * 0.3} ${cy - size * 0.2} ${cx} ${cy - size * 0.5}
                Q ${cx - size * 0.3} ${cy - size * 0.2} ${cx} ${cy}`}
            fill={color}
            fillOpacity={0.7}
            transform={`rotate(${angle} ${cx} ${cy})`}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
          />
        )
      })}
      
      {/* Inner spiral */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * 360 + 36
        const innerSize = size * (0.6 - i * 0.08)
        return (
          <motion.path
            key={`inner-${i}`}
            d={`M ${cx} ${cy} 
                Q ${cx + innerSize * 0.25} ${cy - innerSize * 0.15} ${cx} ${cy - innerSize * 0.4}
                Q ${cx - innerSize * 0.25} ${cy - innerSize * 0.15} ${cx} ${cy}`}
            fill={i % 2 === 0 ? COLORS.peach : color}
            fillOpacity={0.9}
            transform={`rotate(${angle} ${cx} ${cy})`}
          />
        )
      })}
      
      <circle cx={cx} cy={cy} r={size * 0.08} fill={COLORS.gold} />
    </motion.g>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// BUTTERFLY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const Butterfly = memo(function Butterfly({ cx, cy, size, delay, parallax }) {
  return (
    <motion.g
      style={{ x: parallax?.x, y: parallax?.y }}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 1 }}
    >
      <motion.g
        animate={{
          y: [0, -10, 0, 10, 0],
          x: [0, 5, 0, -5, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Left wing */}
        <motion.path
          d={`M ${cx} ${cy}
              C ${cx - size * 0.6} ${cy - size * 0.3} ${cx - size * 0.8} ${cy - size * 0.5} ${cx - size * 0.5} ${cy - size * 0.7}
              C ${cx - size * 0.2} ${cy - size * 0.9} ${cx} ${cy - size * 0.3} ${cx} ${cy}
              C ${cx - size * 0.2} ${cy + size * 0.3} ${cx - size * 0.5} ${cy + size * 0.5} ${cx - size * 0.4} ${cy + size * 0.3}
              C ${cx - size * 0.6} ${cy + size * 0.1} ${cx - size * 0.3} ${cy} ${cx} ${cy}`}
          fill={COLORS.marigold}
          fillOpacity={0.9}
          animate={{ scaleX: [1, 0.7, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        
        {/* Right wing */}
        <motion.path
          d={`M ${cx} ${cy}
              C ${cx + size * 0.6} ${cy - size * 0.3} ${cx + size * 0.8} ${cy - size * 0.5} ${cx + size * 0.5} ${cy - size * 0.7}
              C ${cx + size * 0.2} ${cy - size * 0.9} ${cx} ${cy - size * 0.3} ${cx} ${cy}
              C ${cx + size * 0.2} ${cy + size * 0.3} ${cx + size * 0.5} ${cy + size * 0.5} ${cx + size * 0.4} ${cy + size * 0.3}
              C ${cx + size * 0.6} ${cy + size * 0.1} ${cx + size * 0.3} ${cy} ${cx} ${cy}`}
          fill={COLORS.marigold}
          fillOpacity={0.9}
          animate={{ scaleX: [1, 0.7, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        
        {/* Wing patterns */}
        <circle cx={cx - size * 0.35} cy={cy - size * 0.3} r={size * 0.1} fill={COLORS.navy} fillOpacity={0.8} />
        <circle cx={cx + size * 0.35} cy={cy - size * 0.3} r={size * 0.1} fill={COLORS.navy} fillOpacity={0.8} />
        <circle cx={cx - size * 0.25} cy={cy + size * 0.15} r={size * 0.06} fill={COLORS.navy} fillOpacity={0.6} />
        <circle cx={cx + size * 0.25} cy={cy + size * 0.15} r={size * 0.06} fill={COLORS.navy} fillOpacity={0.6} />
        
        {/* Body */}
        <ellipse cx={cx} cy={cy} rx={size * 0.06} ry={size * 0.25} fill={COLORS.navy} />
        
        {/* Antennae */}
        <path
          d={`M ${cx - size * 0.03} ${cy - size * 0.25} Q ${cx - size * 0.1} ${cy - size * 0.4} ${cx - size * 0.08} ${cy - size * 0.45}`}
          stroke={COLORS.navy}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d={`M ${cx + size * 0.03} ${cy - size * 0.25} Q ${cx + size * 0.1} ${cy - size * 0.4} ${cx + size * 0.08} ${cy - size * 0.45}`}
          stroke={COLORS.navy}
          strokeWidth="1.5"
          fill="none"
        />
      </motion.g>
    </motion.g>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// FOLIAGE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// Monstera-style tropical leaf
const MonsteraLeaf = memo(function MonsteraLeaf({ cx, cy, size, rotation, delay, parallax }) {
  return (
    <motion.g
      style={{ x: parallax?.x, y: parallax?.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8, type: 'spring' }}
    >
      <motion.path
        d={`M ${cx} ${cy + size * 0.6}
            Q ${cx - size * 0.1} ${cy + size * 0.3} ${cx - size * 0.3} ${cy + size * 0.2}
            Q ${cx - size * 0.5} ${cy + size * 0.1} ${cx - size * 0.45} ${cy - size * 0.1}
            Q ${cx - size * 0.4} ${cy - size * 0.3} ${cx - size * 0.2} ${cy - size * 0.45}
            Q ${cx} ${cy - size * 0.6} ${cx + size * 0.2} ${cy - size * 0.45}
            Q ${cx + size * 0.4} ${cy - size * 0.3} ${cx + size * 0.45} ${cy - size * 0.1}
            Q ${cx + size * 0.5} ${cy + size * 0.1} ${cx + size * 0.3} ${cy + size * 0.2}
            Q ${cx + size * 0.1} ${cy + size * 0.3} ${cx} ${cy + size * 0.6}
            Z`}
        fill={COLORS.emerald}
        fillOpacity={0.85}
        transform={`rotate(${rotation} ${cx} ${cy})`}
        animate={{ rotate: [rotation - 3, rotation + 3, rotation - 3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Leaf holes (monstera signature) */}
      <ellipse cx={cx - size * 0.15} cy={cy - size * 0.1} rx={size * 0.08} ry={size * 0.12} 
        fill="#050505" fillOpacity={0.3} transform={`rotate(${rotation} ${cx} ${cy})`} />
      <ellipse cx={cx + size * 0.18} cy={cy + size * 0.05} rx={size * 0.06} ry={size * 0.1} 
        fill="#050505" fillOpacity={0.3} transform={`rotate(${rotation} ${cx} ${cy})`} />
      {/* Center vein */}
      <line x1={cx} y1={cy - size * 0.4} x2={cx} y2={cy + size * 0.5} 
        stroke={COLORS.forest} strokeWidth="2" strokeOpacity={0.5}
        transform={`rotate(${rotation} ${cx} ${cy})`} />
    </motion.g>
  )
})

// Simple elongated leaf
const SimpleLeaf = memo(function SimpleLeaf({ x, y, size, rotation, color, delay, parallax }) {
  return (
    <motion.g
      style={{ x: parallax?.x, y: parallax?.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, type: 'spring' }}
    >
      <motion.path
        d={`M ${x} ${y - size / 2}
            Q ${x + size * 0.25} ${y - size * 0.2} ${x + size * 0.2} ${y + size * 0.2}
            Q ${x} ${y + size / 2} ${x - size * 0.2} ${y + size * 0.2}
            Q ${x - size * 0.25} ${y - size * 0.2} ${x} ${y - size / 2}
            Z`}
        fill={color}
        fillOpacity={0.8}
        transform={`rotate(${rotation} ${x} ${y})`}
        animate={{ rotate: [rotation - 5, rotation + 5, rotation - 5] }}
        transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Vein */}
      <line x1={x} y1={y - size * 0.4} x2={x} y2={y + size * 0.35}
        stroke={COLORS.forest} strokeWidth="1" strokeOpacity={0.4}
        transform={`rotate(${rotation} ${x} ${y})`} />
    </motion.g>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// VINE / TENDRIL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const Vine = memo(function Vine({ path, delay, parallax }) {
  return (
    <motion.g style={{ x: parallax?.x, y: parallax?.y }}>
      <motion.path
        d={path}
        fill="none"
        stroke={COLORS.forest}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 2, ease: 'easeOut' }}
      />
      {/* Tendril curls */}
      <motion.path
        d={path}
        fill="none"
        stroke={COLORS.sage}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="4 8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.5, duration: 1.5, ease: 'easeOut' }}
      />
    </motion.g>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// FLOATING PETAL
// ═══════════════════════════════════════════════════════════════════════════

const FloatingPetal = memo(function FloatingPetal({ startX, startY, color, size, delay }) {
  return (
    <motion.ellipse
      cx={startX}
      cy={startY}
      rx={size * 0.3}
      ry={size}
      fill={color}
      fillOpacity={0.6}
      initial={{ opacity: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: [0, 0.7, 0.7, 0],
        y: [0, 150, 300],
        x: [0, 30, -20, 40],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// SUN ORB
// ═══════════════════════════════════════════════════════════════════════════

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
        r={radius * 2}
        fill={`url(#sunGlow-${cx}-${cy})`}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Core */}
      <circle cx={cx} cy={cy} r={radius} fill={COLORS.gold} />
      <circle cx={cx} cy={cy} r={radius * 0.6} fill={COLORS.amber} />
      {/* Rays */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.line
          key={i}
          x1={cx}
          y1={cy - radius * 1.3}
          x2={cx}
          y2={cy - radius * 1.8}
          stroke={COLORS.gold}
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${i * 45} ${cx} ${cy})`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
      <defs>
        <radialGradient id={`sunGlow-${cx}-${cy}`}>
          <stop offset="0%" stopColor={COLORS.gold} stopOpacity="0.8" />
          <stop offset="50%" stopColor={COLORS.amber} stopOpacity="0.3" />
          <stop offset="100%" stopColor={COLORS.marigold} stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.g>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function OrganicWorld({ identity, parallaxX, parallaxY }) {
  // Opacity based on identity (visible on left/design side)
  const opacity = useTransform(identity, [0, 0.3, 0.5, 0.7], [1, 0.85, 0.4, 0])
  
  // Parallax transforms for different depths
  const parallax1 = {
    x: useTransform(parallaxX, v => v * 0.3),
    y: useTransform(parallaxY, v => v * 0.3),
  }
  const parallax2 = {
    x: useTransform(parallaxX, v => v * 0.6),
    y: useTransform(parallaxY, v => v * 0.6),
  }
  const parallax3 = {
    x: useTransform(parallaxX, v => v * 1),
    y: useTransform(parallaxY, v => v * 1),
  }
  
  // ═══ ELEMENT DATA ═══
  
  // Main flowers - positioned to frame the portrait
  const flowers = useMemo(() => [
    // Large dahlia top-left, reaching toward center
    { type: 'dahlia', cx: 280, cy: 120, size: 70, color: COLORS.coral, delay: 0.3 },
    // Rose mid-left
    { type: 'rose', cx: 120, cy: 280, size: 55, color: COLORS.rose, delay: 0.5 },
    // Simple flowers scattered
    { type: 'simple', cx: 320, cy: 320, size: 40, color: COLORS.fuchsia, delay: 0.7 },
    { type: 'simple', cx: 180, cy: 450, size: 35, color: COLORS.peach, delay: 0.9 },
    // Dahlia bottom, reaching toward center
    { type: 'dahlia', cx: 300, cy: 580, size: 60, color: COLORS.magenta, delay: 1.1 },
    // More simple flowers near center
    { type: 'simple', cx: 350, cy: 420, size: 32, color: COLORS.coral, delay: 1.3 },
    { type: 'rose', cx: 340, cy: 200, size: 45, color: COLORS.fuchsia, delay: 1.5 },
  ], [])
  
  // Butterflies - floating near flowers
  const butterflies = useMemo(() => [
    { cx: 250, cy: 180, size: 40, delay: 2.0 },
    { cx: 330, cy: 480, size: 35, delay: 2.5 },
    { cx: 150, cy: 350, size: 30, delay: 3.0 },
  ], [])
  
  // Tropical leaves
  const leaves = useMemo(() => [
    // Monstera leaves
    { type: 'monstera', cx: 80, cy: 200, size: 90, rotation: -20, delay: 0.4 },
    { type: 'monstera', cx: 350, cy: 650, size: 80, rotation: 25, delay: 0.6 },
    // Simple leaves scattered
    { type: 'simple', x: 60, y: 380, size: 50, rotation: -35, color: COLORS.emerald, delay: 0.5 },
    { type: 'simple', x: 150, y: 150, size: 45, rotation: 25, color: COLORS.sage, delay: 0.7 },
    { type: 'simple', x: 300, y: 250, size: 40, rotation: -15, color: COLORS.emerald, delay: 0.9 },
    { type: 'simple', x: 100, y: 520, size: 55, rotation: 40, color: COLORS.forest, delay: 1.1 },
    { type: 'simple', x: 280, y: 480, size: 42, rotation: -30, color: COLORS.sage, delay: 1.3 },
    { type: 'simple', x: 360, y: 350, size: 38, rotation: 20, color: COLORS.mint, delay: 1.5 },
  ], [])
  
  // Vines curling toward center
  const vines = useMemo(() => [
    { path: 'M 0 150 Q 100 130 180 200 Q 250 280 300 350 Q 340 420 320 500', delay: 0.2 },
    { path: 'M 50 700 Q 150 650 220 580 Q 280 520 340 480', delay: 0.4 },
    { path: 'M 380 100 Q 350 180 360 280 Q 370 380 340 450', delay: 0.6 },
  ], [])
  
  // Sun orbs
  const suns = useMemo(() => [
    { cx: 320, cy: 80, radius: 25, delay: 0.2 },
    { cx: 100, cy: 600, radius: 20, delay: 0.8 },
  ], [])
  
  // Floating petals
  const petals = useMemo(() => [
    { startX: 150, startY: 100, color: COLORS.coral, size: 12, delay: 0 },
    { startX: 280, startY: 200, color: COLORS.peach, size: 10, delay: 2 },
    { startX: 100, startY: 300, color: COLORS.fuchsia, size: 11, delay: 4 },
    { startX: 320, startY: 150, color: COLORS.rose, size: 9, delay: 6 },
  ], [])
  
  return (
    <motion.div 
      className="organic-world"
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 400 800"
        preserveAspectRatio="xMinYMid slice"
        className="organic-world__svg organic-world__svg--left"
      >
        {/* Vines (background layer) */}
        {vines.map((vine, i) => (
          <Vine key={`vine-${i}`} {...vine} parallax={parallax1} />
        ))}
        
        {/* Sun orbs */}
        {suns.map((sun, i) => (
          <SunOrb key={`sun-${i}`} {...sun} parallax={parallax1} />
        ))}
        
        {/* Leaves (mid layer) */}
        {leaves.map((leaf, i) => (
          leaf.type === 'monstera' ? (
            <MonsteraLeaf key={`leaf-${i}`} {...leaf} parallax={parallax2} />
          ) : (
            <SimpleLeaf key={`leaf-${i}`} {...leaf} parallax={parallax2} />
          )
        ))}
        
        {/* Flowers (foreground layer) */}
        {flowers.map((flower, i) => {
          switch (flower.type) {
            case 'dahlia':
              return <Dahlia key={`flower-${i}`} {...flower} parallax={parallax3} />
            case 'rose':
              return <Rose key={`flower-${i}`} {...flower} parallax={parallax3} />
            default:
              return <SimpleFlower key={`flower-${i}`} {...flower} parallax={parallax3} />
          }
        })}
        
        {/* Butterflies (top layer) */}
        {butterflies.map((butterfly, i) => (
          <Butterfly key={`butterfly-${i}`} {...butterfly} parallax={parallax3} />
        ))}
        
        {/* Floating petals */}
        {petals.map((petal, i) => (
          <FloatingPetal key={`petal-${i}`} {...petal} />
        ))}
      </svg>
      
      {/* Right side - subtle mirrored elements */}
      <svg
        viewBox="0 0 400 800"
        preserveAspectRatio="xMaxYMid slice"
        className="organic-world__svg organic-world__svg--right"
      >
        {suns.slice(0, 1).map((sun, i) => (
          <SunOrb key={i} cx={400 - sun.cx} cy={sun.cy} radius={sun.radius * 0.8} delay={sun.delay + 1} parallax={parallax1} />
        ))}
        {flowers.slice(0, 2).map((flower, i) => (
          <SimpleFlower 
            key={i} 
            cx={400 - flower.cx} 
            cy={flower.cy} 
            size={flower.size * 0.7} 
            color={flower.color} 
            delay={flower.delay + 1} 
            parallax={parallax2} 
          />
        ))}
      </svg>
    </motion.div>
  )
}

export default memo(OrganicWorld)
