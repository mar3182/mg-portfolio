/**
 * SplashLoader — Dual Identity Loading Animation with T-Shape
 * 
 * Features:
 * - "M" in sans-serif (tech identity) animates LEFT
 * - "G" in serif (design identity) animates RIGHT
 * - T-shape forms as letters split (horizontal line draws, vertical drops)
 * - Letters split apart to reveal the page beneath
 * - Smooth curtain reveal effect
 */

import { useState, useEffect } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import './styles/splash-loader.css'

// Minimum display time for the splash (ms)
const MIN_SPLASH_DURATION = 2200

export default function SplashLoader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true)
  const [phase, setPhase] = useState('initial') // 'initial' | 'split' | 't-form' | 'exit'

  useEffect(() => {
    // Phase 1: Show initials together (0-800ms)
    const splitTimer = setTimeout(() => {
      setPhase('split')
    }, 800)

    // Phase 2: T-shape forms as letters move apart (1200ms)
    const tFormTimer = setTimeout(() => {
      setPhase('t-form')
    }, 1200)

    // Phase 3: Begin exit (1900ms)
    const exitTimer = setTimeout(() => {
      setPhase('exit')
    }, MIN_SPLASH_DURATION - 300)

    // Phase 4: Complete
    const completeTimer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, MIN_SPLASH_DURATION)

    return () => {
      clearTimeout(splitTimer)
      clearTimeout(tFormTimer)
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <Motion.div
          className="splash-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* Background curtains that split */}
          <Motion.div 
            className="splash-curtain splash-curtain--left"
            initial={{ x: 0 }}
            animate={{ x: phase === 'exit' ? '-100%' : 0 }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          />
          <Motion.div 
            className="splash-curtain splash-curtain--right"
            initial={{ x: 0 }}
            animate={{ x: phase === 'exit' ? '100%' : 0 }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          />

          {/* Logo container */}
          <div className="splash-logo">
            {/* M - Tech (Sans-serif) - Moves LEFT */}
            <Motion.span
              className="splash-letter splash-letter--m"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ 
                opacity: phase === 'exit' ? 0 : 1, 
                y: 0, 
                scale: 1,
                x: phase === 'split' || phase === 'exit' ? -80 : 0,
              }}
              transition={{ 
                opacity: { duration: 0.3 },
                y: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                x: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
                scale: { duration: 0.5 },
              }}
            >
              M
            </Motion.span>

            {/* Divider line */}
            <Motion.span
              className="splash-divider"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: phase === 'initial' ? 1 : 0, 
                opacity: phase === 'initial' ? 0.3 : 0 
              }}
              transition={{ duration: 0.4, delay: 0.3 }}
            />

            {/* G - Design (Serif) - Moves RIGHT */}
            <Motion.span
              className="splash-letter splash-letter--g"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ 
                opacity: phase === 'exit' ? 0 : 1, 
                y: 0, 
                scale: 1,
                x: phase === 'split' || phase === 'exit' ? 80 : 0,
              }}
              transition={{ 
                opacity: { duration: 0.3 },
                y: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
                x: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
                scale: { duration: 0.5, delay: 0.1 },
              }}
            >
              G
            </Motion.span>
          </div>

          {/* Tagline that appears briefly */}
          <Motion.p
            className="splash-tagline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: phase === 'split' ? 1 : 0, 
              y: phase === 'split' ? 0 : 10 
            }}
            transition={{ duration: 0.4 }}
          >
            <span className="tagline-design">Design</span>
            <span className="tagline-separator">×</span>
            <span className="tagline-tech">Code</span>
          </Motion.p>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
