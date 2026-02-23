/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IDENTITY DECORATIVE LAYER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Abstract decorative elements that respond to the identity value.
 * 
 * DESIGN INTENT:
 * - NOT literal flowers or Matrix rain
 * - Design: organic curves, flowing paths, radial patterns
 * - Tech: geometric grids, dots, linear structures
 * - Elements should feel ambient, not attention-grabbing
 * - All animation derives from the identity value
 */

import { memo, useMemo } from 'react'
import { motion as Motion, useTransform } from 'framer-motion'
import { 
  useIdentityMotionValue, 
  useSmoothedIdentity,
  useIdentityIntensity,
} from '../hooks/useIdentity'
import './styles/identity-decorative.css'

// ═══════════════════════════════════════════════════════════════════════════
// ORGANIC PATTERNS (Design identity)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Organic curves - flowing bezier paths that breathe
 */
function OrganicCurves({ identity }) {
  const smoothIdentity = useSmoothedIdentity()
  
  // Opacity fades as we move toward tech
  const opacity = useTransform(smoothIdentity, [0, 0.4, 0.6], [0.12, 0.04, 0])
  
  // Subtle scale breathing
  const scale = useTransform(smoothIdentity, [0, 0.5], [1, 0.95])
  
  // Paths morph subtly based on identity
  const paths = useMemo(() => [
    // Top-left flowing curve
    {
      d: 'M0,100 Q50,80 30,40 T60,0',
      delay: 0,
      origin: 'top-left',
    },
    // Bottom-right flowing curve  
    {
      d: 'M100,100 Q70,80 85,50 T60,20 Q40,0 30,10',
      delay: 0.2,
      origin: 'bottom-right',
    },
    // Center-left organic shape
    {
      d: 'M0,50 Q20,40 15,25 T35,10 Q45,5 40,0',
      delay: 0.1,
      origin: 'left',
    },
  ], [])
  
  return (
    <Motion.svg 
      className="identity-decor__organic"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ opacity, scale }}
    >
      <defs>
        <linearGradient id="organic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(196, 112, 58, 0.3)" />
          <stop offset="100%" stopColor="rgba(196, 112, 58, 0)" />
        </linearGradient>
      </defs>
      
      {paths.map((path, i) => (
        <Motion.path
          key={i}
          d={path.d}
          fill="none"
          stroke="url(#organic-gradient)"
          strokeWidth="0.3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: identity < 0.5 ? 1 : 0, 
            opacity: identity < 0.5 ? 1 : 0 
          }}
          transition={{ 
            duration: 2, 
            delay: path.delay,
            ease: [0.25, 0.1, 0.25, 1] 
          }}
        />
      ))}
    </Motion.svg>
  )
}

/**
 * Radial noise pattern - soft, breathing circles
 */
function RadialNoise() {
  const smoothIdentity = useSmoothedIdentity()
  const opacity = useTransform(smoothIdentity, [0, 0.35, 0.5], [0.08, 0.03, 0])
  
  return (
    <Motion.div 
      className="identity-decor__radial-noise"
      style={{ opacity }}
    >
      {[...Array(3)].map((_, i) => (
        <div 
          key={i} 
          className="radial-noise__circle"
          style={{
            '--delay': `${i * 2}s`,
            '--size': `${30 + i * 20}%`,
            '--x': `${20 + i * 15}%`,
            '--y': `${30 + i * 10}%`,
          }}
        />
      ))}
    </Motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// GEOMETRIC PATTERNS (Tech identity)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Dot grid - precise, rhythmic pattern
 */
function DotGrid() {
  const smoothIdentity = useSmoothedIdentity()
  const opacity = useTransform(smoothIdentity, [0.5, 0.65, 1], [0, 0.04, 0.08])
  
  // Grid shifts subtly
  const translateX = useTransform(smoothIdentity, [0.5, 1], ['5%', '0%'])
  
  return (
    <Motion.div 
      className="identity-decor__dot-grid"
      style={{ opacity, x: translateX }}
    />
  )
}

/**
 * Linear structures - clean lines that emerge
 */
function LinearStructures() {
  const smoothIdentity = useSmoothedIdentity()
  const opacity = useTransform(smoothIdentity, [0.5, 0.7, 1], [0, 0.06, 0.1])
  
  const lines = useMemo(() => [
    { x1: '80%', y1: '0%', x2: '100%', y2: '30%', delay: 0 },
    { x1: '90%', y1: '0%', x2: '100%', y2: '20%', delay: 0.1 },
    { x1: '70%', y1: '100%', x2: '100%', y2: '60%', delay: 0.15 },
    { x1: '85%', y1: '100%', x2: '100%', y2: '75%', delay: 0.2 },
  ], [])
  
  return (
    <Motion.svg 
      className="identity-decor__linear"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="linear-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(58, 156, 196, 0)" />
          <stop offset="50%" stopColor="rgba(58, 156, 196, 0.5)" />
          <stop offset="100%" stopColor="rgba(58, 156, 196, 0.2)" />
        </linearGradient>
      </defs>
      
      {lines.map((line, i) => (
        <Motion.line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="url(#linear-gradient)"
          strokeWidth="0.1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: 1.5, 
            delay: line.delay,
            ease: [0.4, 0, 0.2, 1] 
          }}
        />
      ))}
    </Motion.svg>
  )
}

/**
 * Corner brackets - subtle tech framing
 */
function CornerBrackets() {
  const smoothIdentity = useSmoothedIdentity()
  const opacity = useTransform(smoothIdentity, [0.6, 0.8, 1], [0, 0.1, 0.15])
  
  return (
    <Motion.div 
      className="identity-decor__brackets"
      style={{ opacity }}
    >
      <div className="bracket bracket--top-right" />
      <div className="bracket bracket--bottom-left" />
    </Motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function IdentityDecorativeLayer() {
  const identity = useIdentityMotionValue()
  const intensity = useIdentityIntensity()
  
  return (
    <div 
      className="identity-decorative-layer" 
      aria-hidden="true"
      data-intensity={intensity > 0.5 ? 'high' : 'low'}
    >
      {/* Organic patterns - fade as we approach tech */}
      <OrganicCurves identity={identity.get()} />
      <RadialNoise />
      
      {/* Geometric patterns - emerge as we approach tech */}
      <DotGrid />
      <LinearStructures />
      <CornerBrackets />
    </div>
  )
}

export default memo(IdentityDecorativeLayer)
