/**
 * SplashLoader — Dual Identity Loading Animation
 * 
 * Animation Flow:
 * 1. M|G appear together at center
 * 2. Letters blur outward, their colors trail into the "|" divider
 * 3. The "|" transforms into the T-shape (stretches horizontal, drops vertical)
 * 4. Colors from M (blue) and G (orange) blur into the horizontal line's gradient
 * 5. T-shape remains as splash fades, carries over to hero
 */

import { useState, useEffect } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import './styles/splash-loader.css'

// Animation timing (ms)
const TIMING = {
  letterAppear: 600,
  letterBlur: 1000,
  tFormStart: 1200,
  tFormComplete: 1800,
  exit: 2200,
  complete: 2600,
}

export default function SplashLoader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true)
  const [phase, setPhase] = useState('initial') 
  // Phases: 'initial' → 'blur' → 't-grow' → 't-complete' → 'exit'

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('blur'), TIMING.letterBlur),
      setTimeout(() => setPhase('t-grow'), TIMING.tFormStart),
      setTimeout(() => setPhase('t-complete'), TIMING.tFormComplete),
      setTimeout(() => setPhase('exit'), TIMING.exit),
      setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, TIMING.complete),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  // Phase checks
  const isBlurring = phase === 'blur' || phase === 't-grow' || phase === 't-complete' || phase === 'exit'
  const isTGrowing = phase === 't-grow' || phase === 't-complete' || phase === 'exit'
  const isTComplete = phase === 't-complete' || phase === 'exit'
  const isExiting = phase === 'exit'

  return (
    <AnimatePresence>
      {isVisible && (
        <Motion.div
          className="splash-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Background */}
          <div className="splash-bg" />

          {/* === LETTERS M | G === */}
          <div className="splash-logo">
            {/* M - Tech (Sans-serif) - blurs LEFT */}
            <Motion.span
              className="splash-letter splash-letter--m"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isExiting ? 0 : (isBlurring ? 0 : 1),
                y: 0,
                x: isBlurring ? -120 : 0,
                filter: isBlurring ? 'blur(20px)' : 'blur(0px)',
                scale: isBlurring ? 0.8 : 1,
              }}
              transition={{ 
                opacity: { duration: 0.4 },
                y: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                x: { duration: 0.8, ease: [0.32, 0, 0.67, 0] },
                filter: { duration: 0.6 },
                scale: { duration: 0.6 },
              }}
            >
              M
            </Motion.span>

            {/* The "|" Divider - TRANSFORMS into T-shape */}
            <Motion.div
              className="splash-divider-core"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: 1,
                opacity: isTGrowing ? 0 : 1,
                height: isTGrowing ? 0 : '4rem',
              }}
              transition={{ 
                scaleY: { duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3 },
                height: { duration: 0.3 },
              }}
            />

            {/* G - Design (Serif) - blurs RIGHT */}
            <Motion.span
              className="splash-letter splash-letter--g"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isExiting ? 0 : (isBlurring ? 0 : 1),
                y: 0,
                x: isBlurring ? 120 : 0,
                filter: isBlurring ? 'blur(20px)' : 'blur(0px)',
                scale: isBlurring ? 0.8 : 1,
              }}
              transition={{ 
                opacity: { duration: 0.4 },
                y: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
                x: { duration: 0.8, ease: [0.32, 0, 0.67, 0] },
                filter: { duration: 0.6 },
                scale: { duration: 0.6 },
              }}
            >
              G
            </Motion.span>
          </div>

          {/* === Color Trails from M and G === */}
          {/* These blur trails feed color into the T horizontal line */}
          <Motion.div 
            className="color-trail color-trail--m"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
              opacity: isBlurring && !isTComplete ? 0.6 : 0,
              scaleX: isBlurring ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <Motion.div 
            className="color-trail color-trail--g"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
              opacity: isBlurring && !isTComplete ? 0.6 : 0,
              scaleX: isBlurring ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* === T-SHAPE: Born from the "|" divider === */}
          <Motion.div 
            className="splash-t-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: isTGrowing ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Horizontal line - grows from center point where "|" was */}
            <Motion.div 
              className="splash-t-horizontal"
              initial={{ scaleX: 0 }}
              animate={{ 
                scaleX: isTComplete ? 1 : (isTGrowing ? 0.3 : 0),
              }}
              transition={{ 
                duration: 0.6, 
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            
            {/* Vertical line - drops down from where "|" was */}
            <Motion.div 
              className="splash-t-vertical"
              initial={{ scaleY: 0 }}
              animate={{ 
                scaleY: isTComplete ? 1 : (isTGrowing ? 0.2 : 0),
              }}
              transition={{ 
                duration: 0.5, 
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </Motion.div>

          {/* Subtle tagline - appears during T formation */}
          <Motion.p
            className="splash-tagline"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isTComplete && !isExiting ? 0.6 : 0,
            }}
            transition={{ duration: 0.4 }}
          >
            Design × Code
          </Motion.p>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
