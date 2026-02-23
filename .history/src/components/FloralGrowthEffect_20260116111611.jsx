/**
 * FloralGrowthEffect — Organic Growing Background for Design Side
 * 
 * Creates animated botanical/floral SVG patterns that "grow" 
 * from the edges when the design side is expanded.
 * Inspired by art nouveau and organic forms.
 */

import { useEffect, useRef, memo } from 'react'
import { motion as Motion, useAnimation } from 'framer-motion'
import './styles/floral-growth.css'

// SVG path data for organic vine/floral shapes
const VINE_PATHS = [
  // Left edge vines
  { 
    id: 'vine-1',
    d: 'M0,100 Q20,80 15,50 T30,20 Q35,10 25,0',
    origin: 'left',
    delay: 0,
  },
  { 
    id: 'vine-2',
    d: 'M0,200 Q40,180 35,140 T50,100 Q60,80 45,60 T55,30',
    origin: 'left',
    delay: 0.15,
  },
  { 
    id: 'vine-3',
    d: 'M0,350 Q60,320 50,280 T70,240 Q80,200 65,170 T75,130 Q85,100 70,70',
    origin: 'left',
    delay: 0.3,
  },
  // Bottom edge vines
  { 
    id: 'vine-4',
    d: 'M100,500 Q80,460 120,420 T90,380 Q110,340 80,300',
    origin: 'bottom',
    delay: 0.2,
  },
  { 
    id: 'vine-5',
    d: 'M200,500 Q180,450 220,400 T190,350 Q230,300 200,250',
    origin: 'bottom',
    delay: 0.35,
  },
  // Corner flourishes
  { 
    id: 'vine-6',
    d: 'M0,500 Q80,480 60,420 T100,360 Q120,320 90,280 T130,220',
    origin: 'corner',
    delay: 0.1,
  },
]

// Flower/leaf decorations that bloom at vine ends
const BLOOMS = [
  { id: 'bloom-1', cx: 25, cy: 0, r: 12, delay: 0.6, type: 'flower' },
  { id: 'bloom-2', cx: 55, cy: 30, r: 10, delay: 0.75, type: 'leaf' },
  { id: 'bloom-3', cx: 70, cy: 70, r: 14, delay: 0.9, type: 'flower' },
  { id: 'bloom-4', cx: 80, cy: 300, r: 11, delay: 0.85, type: 'leaf' },
  { id: 'bloom-5', cx: 130, cy: 220, r: 15, delay: 1.0, type: 'flower' },
  { id: 'bloom-6', cx: 200, cy: 250, r: 12, delay: 0.95, type: 'leaf' },
]

// Animated vine path component
function GrowingVine({ path, isActive }) {
  const pathRef = useRef(null)
  
  return (
    <Motion.path
      ref={pathRef}
      d={path.d}
      className={`floral-vine floral-vine--${path.origin}`}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={isActive ? { 
        pathLength: 1, 
        opacity: 1,
      } : { 
        pathLength: 0, 
        opacity: 0 
      }}
      transition={{
        pathLength: { 
          duration: 2, 
          delay: path.delay,
          ease: [0.4, 0, 0.2, 1] 
        },
        opacity: { duration: 0.3, delay: path.delay }
      }}
    />
  )
}

// Bloom/flower decoration
function Bloom({ bloom, isActive }) {
  const isFlower = bloom.type === 'flower'
  
  return (
    <Motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{
        duration: 0.6,
        delay: bloom.delay,
        ease: [0.34, 1.56, 0.64, 1], // Bouncy
      }}
      style={{ transformOrigin: `${bloom.cx}px ${bloom.cy}px` }}
    >
      {isFlower ? (
        // 5-petal flower
        <>
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <Motion.ellipse
              key={i}
              cx={bloom.cx + Math.cos(angle * Math.PI / 180) * bloom.r * 0.6}
              cy={bloom.cy + Math.sin(angle * Math.PI / 180) * bloom.r * 0.6}
              rx={bloom.r * 0.5}
              ry={bloom.r * 0.3}
              className="floral-petal"
              style={{ 
                transform: `rotate(${angle}deg)`,
                transformOrigin: `${bloom.cx}px ${bloom.cy}px`
              }}
            />
          ))}
          <circle cx={bloom.cx} cy={bloom.cy} r={bloom.r * 0.25} className="floral-center" />
        </>
      ) : (
        // Leaf shape
        <Motion.path
          d={`M${bloom.cx},${bloom.cy - bloom.r} 
              Q${bloom.cx + bloom.r},${bloom.cy} ${bloom.cx},${bloom.cy + bloom.r} 
              Q${bloom.cx - bloom.r},${bloom.cy} ${bloom.cx},${bloom.cy - bloom.r}`}
          className="floral-leaf"
        />
      )}
    </Motion.g>
  )
}

function FloralGrowthEffect({ isActive = false, side = 'left' }) {
  return (
    <div className={`floral-growth floral-growth--${side}`} aria-hidden="true">
      <svg 
        className="floral-svg"
        viewBox="0 0 300 500"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gradient for vines */}
          <linearGradient id="vineGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c4703a" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#d4a574" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e8c9a8" stopOpacity="0.4" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="floralGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Growing vines */}
        <g className="floral-vines" filter="url(#floralGlow)">
          {VINE_PATHS.map(path => (
            <GrowingVine key={path.id} path={path} isActive={isActive} />
          ))}
        </g>
        
        {/* Blooming flowers and leaves */}
        <g className="floral-blooms">
          {BLOOMS.map(bloom => (
            <Bloom key={bloom.id} bloom={bloom} isActive={isActive} />
          ))}
        </g>
      </svg>
      
      {/* Mirrored version for right edge */}
      <svg 
        className="floral-svg floral-svg--mirrored"
        viewBox="0 0 300 500"
        preserveAspectRatio="none"
      >
        <g className="floral-vines" filter="url(#floralGlow)">
          {VINE_PATHS.map(path => (
            <GrowingVine key={`${path.id}-mirror`} path={path} isActive={isActive} />
          ))}
        </g>
        <g className="floral-blooms">
          {BLOOMS.map(bloom => (
            <Bloom key={`${bloom.id}-mirror`} bloom={bloom} isActive={isActive} />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default memo(FloralGrowthEffect)
