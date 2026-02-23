/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MATRIX BACKGROUND — SVG Vector-Driven Tech Layer
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The counterpart to OrganicBackground. Structured, geometric, computational.
 * Represents the tech identity through grid patterns, data flows, and nodes.
 * 
 * Per spec: "Tech (Right) → structured, cool, computational"
 */

import { memo } from 'react'
import { motion, useTransform } from 'framer-motion'
import { useIdentityContext } from './IdentityMotionProvider'

// ═══════════════════════════════════════════════════════════════════════════
// MATRIX SVG PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

function MatrixSVG() {
  return (
    <svg
      viewBox="0 0 1920 1080"
      className="matrix-svg"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        {/* Cool tech gradient */}
        <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--tech-cyan, #1be7ff)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--tech-green, #00ff9c)" stopOpacity="0.3" />
        </linearGradient>
        
        {/* Grid line gradient */}
        <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1be7ff" stopOpacity="0" />
          <stop offset="50%" stopColor="#1be7ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1be7ff" stopOpacity="0" />
        </linearGradient>
        
        {/* Node glow */}
        <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Data pulse gradient */}
        <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00ff9c" stopOpacity="0" />
          <stop offset="50%" stopColor="#00ff9c" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00ff9c" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ═══ LAYER 1: Grid structure ═══ */}
      <g className="matrix-grid" opacity="0.15">
        {/* Horizontal grid lines */}
        {[200, 350, 500, 650, 800, 950].map((y, i) => (
          <line
            key={`h-${i}`}
            x1="960" y1={y}
            x2="1920" y2={y}
            stroke="url(#gridGradient)"
            strokeWidth="1"
            opacity={0.3 + (i % 2) * 0.2}
          />
        ))}
        
        {/* Vertical grid lines */}
        {[1100, 1250, 1400, 1550, 1700, 1850].map((x, i) => (
          <line
            key={`v-${i}`}
            x1={x} y1="0"
            x2={x} y2="1080"
            stroke="url(#gridGradient)"
            strokeWidth="1"
            opacity={0.2 + (i % 2) * 0.15}
            transform={`rotate(${2 - i * 0.5} ${x} 540)`}
          />
        ))}
      </g>

      {/* ═══ LAYER 2: Connection lines ═══ */}
      <g className="matrix-connections" opacity="0.4">
        {/* Neural pathway 1 */}
        <path
          d="M1600 540 L1700 480 L1800 520 L1850 450"
          fill="none"
          stroke="url(#techGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="8 4"
        />
        
        {/* Neural pathway 2 */}
        <path
          d="M1550 600 L1650 650 L1750 620 L1820 680"
          fill="none"
          stroke="url(#techGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        
        {/* Branching connection */}
        <path
          d="M1500 400 L1600 350 M1600 350 L1700 320 M1600 350 L1680 400"
          fill="none"
          stroke="#1be7ff"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
        
        {/* Data arc */}
        <path
          d="M1400 500 Q1550 400 1700 500"
          fill="none"
          stroke="url(#techGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>

      {/* ═══ LAYER 3: Nodes ═══ */}
      <g className="matrix-nodes" filter="url(#nodeGlow)">
        {/* Primary nodes */}
        <circle cx="1700" cy="480" r="6" fill="#1be7ff" opacity="0.8" />
        <circle cx="1800" cy="520" r="5" fill="#00ff9c" opacity="0.7" />
        <circle cx="1650" cy="650" r="4" fill="#1be7ff" opacity="0.6" />
        <circle cx="1600" cy="350" r="5" fill="#00ff9c" opacity="0.7" />
        
        {/* Secondary nodes (smaller) */}
        <circle cx="1750" cy="620" r="3" fill="#1be7ff" opacity="0.5" />
        <circle cx="1820" cy="680" r="3" fill="#00ff9c" opacity="0.5" />
        <circle cx="1680" cy="400" r="3" fill="#1be7ff" opacity="0.4" />
        <circle cx="1700" cy="320" r="4" fill="#00ff9c" opacity="0.6" />
        
        {/* Accent nodes */}
        <circle cx="1550" cy="600" r="2" fill="#ffffff" opacity="0.6" />
        <circle cx="1500" cy="400" r="2" fill="#ffffff" opacity="0.5" />
        <circle cx="1850" cy="450" r="3" fill="#ffffff" opacity="0.4" />
      </g>

      {/* ═══ LAYER 4: Geometric shapes ═══ */}
      <g className="matrix-geometry" opacity="0.3">
        {/* Hexagon outline */}
        <polygon
          points="1750,300 1780,320 1780,360 1750,380 1720,360 1720,320"
          fill="none"
          stroke="#1be7ff"
          strokeWidth="1"
          opacity="0.4"
        />
        
        {/* Diamond */}
        <polygon
          points="1600,700 1620,720 1600,740 1580,720"
          fill="none"
          stroke="#00ff9c"
          strokeWidth="1"
          opacity="0.3"
        />
        
        {/* Triangle */}
        <polygon
          points="1850,600 1870,640 1830,640"
          fill="none"
          stroke="#1be7ff"
          strokeWidth="1"
          opacity="0.35"
        />
      </g>

      {/* ═══ LAYER 5: Code fragments (decorative) ═══ */}
      <g className="matrix-code" opacity="0.2" fontFamily="'Space Grotesk', monospace" fontSize="10">
        <text x="1520" y="280" fill="#1be7ff">01100</text>
        <text x="1680" y="750" fill="#00ff9c">10011</text>
        <text x="1800" y="380" fill="#1be7ff">11010</text>
      </g>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function MatrixBackground() {
  const { identity, matrixOpacity } = useIdentityContext()
  
  // Drift right as identity moves toward design (left)
  const driftX = useTransform(identity, [0, 1], [80, 0])
  
  // Scale for depth
  const scale = useTransform(identity, [0, 1], [0.95, 1.05])
  
  return (
    <motion.div
      className="matrix-background"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: matrixOpacity,
        x: driftX,
        scale,
        transformOrigin: 'right center',
        willChange: 'transform, opacity',
      }}
    >
      <MatrixSVG />
    </motion.div>
  )
}

export default memo(MatrixBackground)
