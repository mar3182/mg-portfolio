import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion as Motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import '../styles/morphing-hero.css'

/**
 * MorphingHero — T-Shaped Creative Identity Animation
 * 
 * Interactive Features:
 * - Mouse parallax on all elements (depth layers)
 * - Hover zones that reveal identity details
 * - Cursor-guided exploration hints
 * - Touch/swipe support for mobile
 * - Magnetic indicators
 */

const IDENTITIES = [
  {
    id: 'tech',
    lines: ['FULL STACK', 'DEVELOPER'],
    subtitle: 'Building the future with code',
    fontFamily: 'var(--font-body)',
    accentColor: '#3a7cc4', // Cool blue
    particleStyle: 'geometric',
    skills: ['React', 'Node.js', 'API Design', 'AI/ML', 'Blockchain'],
  },
  {
    id: 'design',
    lines: ['CREATIVE', 'DESIGNER'],
    subtitle: 'Crafting experiences with intention',
    fontFamily: 'var(--font-display)',
    accentColor: '#c4703a', // Warm orange
    particleStyle: 'organic',
    skills: ['Brand Identity', 'UI/UX', 'Motion Design', 'Typography', 'Packaging'],
  },
]

const CYCLE_DURATION = 5000
const TRANSITION_DURATION = 1.2

// Letter animation variants
const letterVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    rotateX: -90,
    filter: 'blur(8px)',
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.03,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: (i) => ({
    opacity: 0,
    y: -40,
    rotateX: 45,
    filter: 'blur(4px)',
    transition: {
      delay: i * 0.015,
      duration: 0.4,
      ease: [0.55, 0, 1, 0.45],
    },
  }),
}

// Line container variants
const lineVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.015,
    },
  },
}

// Subtitle variants
const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { delay: 0.4, duration: 0.6, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.3 }
  },
}

// Indicator dot variants
const dotVariants = {
  inactive: { scale: 1, opacity: 0.3 },
  active: { 
    scale: 1.4, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
}

export default function MorphingHero({ onIdentityChange }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isManualOverride, setIsManualOverride] = useState(false)

  const currentIdentity = IDENTITIES[currentIndex]

  // Auto-cycle through identities
  useEffect(() => {
    if (isPaused || isManualOverride) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IDENTITIES.length)
    }, CYCLE_DURATION)

    return () => clearInterval(timer)
  }, [isPaused, isManualOverride])

  // Notify parent of identity changes
  useEffect(() => {
    onIdentityChange?.(currentIdentity)
    
    // Update CSS custom property for accent color
    document.documentElement.style.setProperty(
      '--hero-accent', 
      currentIdentity.accentColor
    )
    
    // Update body class for global theming
    document.body.classList.remove('identity-tech', 'identity-design')
    document.body.classList.add(`identity-${currentIdentity.id}`)
  }, [currentIdentity, onIdentityChange])

  // Manual selection
  const selectIdentity = useCallback((index) => {
    setCurrentIndex(index)
    setIsManualOverride(true)
    
    // Resume auto-cycle after 10 seconds of inactivity
    setTimeout(() => setIsManualOverride(false), 10000)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'd' || e.key === 'D') {
        selectIdentity(1) // Design
      } else if (e.key === 't' || e.key === 'T') {
        selectIdentity(0) // Tech
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault()
        setCurrentIndex((prev) => (prev + 1) % IDENTITIES.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectIdentity])

  return (
    <div 
      className={`morphing-hero morphing-hero--${currentIdentity.id}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-cursor="explore"
    >
      {/* Background gradient that morphs */}
      <div className="morphing-hero__bg" />
      
      {/* Particle system placeholder */}
      <div className={`morphing-hero__particles morphing-hero__particles--${currentIdentity.particleStyle}`} />

      {/* Main text content */}
      <div className="morphing-hero__content">
        <AnimatePresence mode="wait">
          <Motion.div
            key={currentIdentity.id}
            className="morphing-hero__text-container"
            style={{ fontFamily: currentIdentity.fontFamily }}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {currentIdentity.lines.map((line, lineIndex) => (
              <Motion.div
                key={lineIndex}
                className="morphing-hero__line"
                variants={lineVariants}
              >
                {line.split('').map((char, charIndex) => (
                  <Motion.span
                    key={charIndex}
                    className="morphing-hero__letter"
                    variants={letterVariants}
                    custom={charIndex + lineIndex * 10}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </Motion.span>
                ))}
              </Motion.div>
            ))}

            {/* Subtitle */}
            <Motion.p 
              className="morphing-hero__subtitle"
              variants={subtitleVariants}
            >
              {currentIdentity.subtitle}
            </Motion.p>
          </Motion.div>
        </AnimatePresence>

        {/* Identity indicator */}
        <div className="morphing-hero__indicators">
          {IDENTITIES.map((identity, index) => (
            <button
              key={identity.id}
              className={`morphing-hero__indicator ${index === currentIndex ? 'is-active' : ''}`}
              onClick={() => selectIdentity(index)}
              aria-label={`Switch to ${identity.id} identity`}
              aria-pressed={index === currentIndex}
            >
              <Motion.span
                className="morphing-hero__indicator-dot"
                variants={dotVariants}
                animate={index === currentIndex ? 'active' : 'inactive'}
              />
              <span className="morphing-hero__indicator-label">
                {identity.id === 'tech' ? 'Tech' : 'Design'}
              </span>
            </button>
          ))}
        </div>

        {/* Keyboard hint */}
        <div className="morphing-hero__hint">
          <span className="morphing-hero__hint-key">T</span>
          <span className="morphing-hero__hint-sep">/</span>
          <span className="morphing-hero__hint-key">D</span>
          <span className="morphing-hero__hint-text">to explore</span>
        </div>
      </div>

      {/* T-shape visual accent */}
      <div className="morphing-hero__t-shape">
        <div className="morphing-hero__t-horizontal" />
        <div className="morphing-hero__t-vertical" />
      </div>
    </div>
  )
}
