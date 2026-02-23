/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORGANIC BACKGROUND — SVG Vector-Driven Design Layer
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Per spec: "Represents the expansion of the woman's hair: Leaves, Curves, 
 * Paint-like flows. Evolving with identity."
 * 
 * This layer uses SVG paths for scalable, performant organic shapes.
 * The identity value controls opacity and horizontal drift.
 */

import { memo } from 'react'
import { motion, useTransform } from 'framer-motion'
import { useIdentityContext } from './IdentityMotionProvider'

// ═══════════════════════════════════════════════════════════════════════════
// ORGANIC SVG PATHS
// ═══════════════════════════════════════════════════════════════════════════

function OrganicSVG() {
  return (
    <svg
      viewBox="0 0 1920 1080"
      className="organic-svg"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        {/* Warm gradient for organic strokes */}
        <linearGradient id="organicGradient" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="var(--design-orange, #e77a2f)" stopOpacity="0.8" />
          <stop offset="50%" stopColor="var(--design-coral, #ff8c42)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--design-blue, #1e3a5f)" stopOpacity="0.4" />
        </linearGradient>
        
        {/* Soft gold gradient */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffc93c" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ff8c42" stopOpacity="0.3" />
        </linearGradient>
        
        {/* Navy depth gradient */}
        <linearGradient id="navyGradient" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a2a4a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0d1a2d" stopOpacity="0.2" />
        </linearGradient>
        
        {/* Glow filter for soft edges */}
        <filter id="organicGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ═══ LAYER 1: Far background curves ═══ */}
      <g className="organic-layer-1" opacity="0.3">
        {/* Large sweeping curve - left origin */}
        <path
          d="M-100 600 C200 400 400 700 600 500 S900 600 1200 450"
          fill="none"
          stroke="url(#navyGradient)"
          strokeWidth="80"
          strokeLinecap="round"
          opacity="0.4"
        />
        
        {/* Secondary wave */}
        <path
          d="M-50 800 Q300 650 500 750 T900 700"
          fill="none"
          stroke="url(#navyGradient)"
          strokeWidth="60"
          strokeLinecap="round"
          opacity="0.3"
        />
      </g>

      {/* ═══ LAYER 2: Mid-ground flowing lines ═══ */}
      <g className="organic-layer-2" opacity="0.5">
        {/* Primary flow from portrait region */}
        <path
          d="M300 400 C480 350 600 460 820 390 S1000 450 1100 380"
          fill="none"
          stroke="url(#organicGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#organicGlow)"
        />
        
        {/* Secondary flow */}
        <path
          d="M320 450 C520 520 700 480 900 540 S1100 500 1200 560"
          fill="none"
          stroke="url(#organicGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        
        {/* Rising tendril */}
        <path
          d="M250 500 Q300 350 380 280 T500 200"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        
        {/* Descending flow */}
        <path
          d="M350 550 C450 650 550 600 650 700 S800 750 900 800"
          fill="none"
          stroke="url(#organicGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>

      {/* ═══ LAYER 3: Foreground accents ═══ */}
      <g className="organic-layer-3" opacity="0.7">
        {/* Leaf-like shapes */}
        <ellipse
          cx="200" cy="350"
          rx="25" ry="8"
          fill="url(#navyGradient)"
          transform="rotate(-30 200 350)"
          opacity="0.6"
        />
        <ellipse
          cx="280" cy="300"
          rx="20" ry="6"
          fill="url(#goldGradient)"
          transform="rotate(-45 280 300)"
          opacity="0.5"
        />
        <ellipse
          cx="380" cy="280"
          rx="18" ry="5"
          fill="url(#organicGradient)"
          transform="rotate(-20 380 280)"
          opacity="0.4"
        />
        
        {/* Geometric circles (sun orbs) */}
        <circle
          cx="150" cy="200"
          r="35"
          fill="none"
          stroke="#ff8c42"
          strokeWidth="2"
          opacity="0.5"
        />
        <circle
          cx="150" cy="200"
          r="25"
          fill="#ffc93c"
          opacity="0.3"
        />
        
        <circle
          cx="400" cy="150"
          r="20"
          fill="none"
          stroke="#ffa054"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <circle
          cx="400" cy="150"
          r="12"
          fill="#ffd700"
          opacity="0.25"
        />
        
        {/* Scattered dots */}
        <circle cx="180" cy="280" r="3" fill="#ff6b4a" opacity="0.6" />
        <circle cx="220" cy="320" r="2" fill="#4a6a9a" opacity="0.5" />
        <circle cx="300" cy="250" r="4" fill="#ffc93c" opacity="0.5" />
        <circle cx="350" cy="330" r="2.5" fill="#ff8c5a" opacity="0.4" />
        <circle cx="420" cy="220" r="3" fill="#5a7aaa" opacity="0.4" />
        <circle cx="250" cy="400" r="2" fill="#ffab2e" opacity="0.5" />
      </g>

      {/* ═══ LAYER 4: Paint splatter effects ═══ */}
      <g className="organic-layer-4" opacity="0.4">
        <path
          d="M120 450 Q130 440 125 460 Q140 455 130 470 Q115 465 120 450"
          fill="#ff8c42"
          opacity="0.5"
        />
        <path
          d="M450 180 Q460 170 455 190 Q470 185 460 200 Q445 195 450 180"
          fill="#1a2a4a"
          opacity="0.4"
        />
        <path
          d="M80 320 Q90 310 85 330 Q100 325 90 340 Q75 335 80 320"
          fill="#ffc93c"
          opacity="0.3"
        />
      </g>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function OrganicBackground() {
  const { identity, organicOpacity } = useIdentityContext()
  
  // Drift left as identity moves toward tech (right)
  const driftX = useTransform(identity, [0, 1], [0, -80])
  
  // Scale slightly for depth
  const scale = useTransform(identity, [0, 1], [1.05, 0.95])
  
  return (
    <motion.div
      className="organic-background"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: organicOpacity,
        x: driftX,
        scale,
        transformOrigin: 'left center',
        willChange: 'transform, opacity',
      }}
    >
      <OrganicSVG />
    </motion.div>
  )
}

export default memo(OrganicBackground)
