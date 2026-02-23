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
  const [showSkills, setShowSkills] = useState(false)
  const containerRef = useRef(null)
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  const currentIdentity = IDENTITIES[currentIndex]

  // Mouse position for parallax (smooth spring physics)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  // Parallax transforms for different layers
  const bgX = useTransform(smoothX, [-0.5, 0.5], ['-2%', '2%'])
  const bgY = useTransform(smoothY, [-0.5, 0.5], ['-2%', '2%'])
  const textX = useTransform(smoothX, [-0.5, 0.5], ['3%', '-3%'])
  const textY = useTransform(smoothY, [-0.5, 0.5], ['2%', '-2%'])
  const particleX = useTransform(smoothX, [-0.5, 0.5], ['-5%', '5%'])
  const particleY = useTransform(smoothY, [-0.5, 0.5], ['-5%', '5%'])
  const tShapeX = useTransform(smoothX, [-0.5, 0.5], ['8%', '-8%'])
  const tShapeY = useTransform(smoothY, [-0.5, 0.5], ['5%', '-5%'])

  // Mouse move handler
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || isMobile) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY, isMobile])

  // Touch handlers for mobile swipe
  const touchStartX = useRef(0)
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(deltaX) > 50) {
      // Swipe detected
      if (deltaX > 0) {
        setCurrentIndex((prev) => (prev === 0 ? IDENTITIES.length - 1 : prev - 1))
      } else {
        setCurrentIndex((prev) => (prev + 1) % IDENTITIES.length)
      }
      setIsManualOverride(true)
      setTimeout(() => setIsManualOverride(false), 10000)
    }
  }, [])

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
      ref={containerRef}
      className={`morphing-hero morphing-hero--${currentIdentity.id}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); mouseX.set(0); mouseY.set(0); }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-cursor="explore"
    >
      {/* Background gradient that morphs with parallax */}
      <Motion.div 
        className="morphing-hero__bg" 
        style={{ x: bgX, y: bgY }}
      />
      
      {/* Particle system with parallax */}
      <Motion.div 
        className={`morphing-hero__particles morphing-hero__particles--${currentIdentity.particleStyle}`}
        style={{ x: particleX, y: particleY }}
      />

      {/* Interactive exploration zones (left = Tech, right = Design) */}
      <div className="morphing-hero__zones">
        <div 
          className="morphing-hero__zone morphing-hero__zone--tech"
          onMouseEnter={() => { selectIdentity(0); setShowSkills(true); }}
          onMouseLeave={() => setShowSkills(false)}
          data-cursor="discover"
          data-cursor-magnetic
        >
          <span className="morphing-hero__zone-label">← Tech</span>
        </div>
        <div 
          className="morphing-hero__zone morphing-hero__zone--design"
          onMouseEnter={() => { selectIdentity(1); setShowSkills(true); }}
          onMouseLeave={() => setShowSkills(false)}
          data-cursor="discover"
          data-cursor-magnetic
        >
          <span className="morphing-hero__zone-label">Design →</span>
        </div>
      </div>

      {/* Main text content with parallax */}
      <Motion.div 
        className="morphing-hero__content"
        style={{ x: textX, y: textY }}
      >
        <AnimatePresence mode="wait">
          <Motion.div
            key={currentIdentity.id}
            className="morphing-hero__text-container"
            style={{ fontFamily: currentIdentity.fontFamily }}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Clickable title area */}
            <div 
              className="morphing-hero__title-area"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % IDENTITIES.length)}
              data-cursor="click"
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
            </div>

            {/* Subtitle */}
            <Motion.p 
              className="morphing-hero__subtitle"
              variants={subtitleVariants}
            >
              {currentIdentity.subtitle}
            </Motion.p>

            {/* Skills preview (shows on hover) */}
            <Motion.div 
              className="morphing-hero__skills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showSkills ? 1 : 0, y: showSkills ? 0 : 10 }}
              transition={{ duration: 0.3 }}
            >
              {currentIdentity.skills.map((skill, i) => (
                <span key={skill} className="morphing-hero__skill" data-cursor="view">
                  {skill}
                </span>
              ))}
            </Motion.div>
          </Motion.div>
        </AnimatePresence>

        {/* Identity indicators with magnetic effect */}
        <div className="morphing-hero__indicators">
          {IDENTITIES.map((identity, index) => (
            <button
              key={identity.id}
              className={`morphing-hero__indicator ${index === currentIndex ? 'is-active' : ''}`}
              onClick={() => selectIdentity(index)}
              aria-label={`Switch to ${identity.id} identity`}
              aria-pressed={index === currentIndex}
              data-cursor="click"
              data-cursor-magnetic
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

        {/* Explore hint - different for desktop/mobile */}
        <div className="morphing-hero__hint">
          {isMobile ? (
            <>
              <span className="morphing-hero__hint-icon">👆</span>
              <span className="morphing-hero__hint-text">Swipe to explore</span>
            </>
          ) : (
            <>
              <span className="morphing-hero__hint-text">Move to</span>
              <span className="morphing-hero__hint-key">← Tech</span>
              <span className="morphing-hero__hint-sep">or</span>
              <span className="morphing-hero__hint-key">Design →</span>
            </>
          )}
        </div>
      </Motion.div>

      {/* T-shape visual accent with parallax */}
      <Motion.div 
        className="morphing-hero__t-shape"
        style={{ x: tShapeX, y: tShapeY }}
      >
        <div className="morphing-hero__t-horizontal" />
        <div className="morphing-hero__t-vertical" />
      </Motion.div>

      {/* Scroll indicator */}
      <Motion.div 
        className="morphing-hero__scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        data-cursor="scroll"
      >
        <span>Scroll to discover</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </Motion.div>
    </div>
  )
}
