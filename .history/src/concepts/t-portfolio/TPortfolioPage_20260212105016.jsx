/**
 * ═══════════════════════════════════════════════════════════════════════════
 * T-PORTFOLIO PAGE — Main Entry Point
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The definitive T-shaped portfolio experience.
 * Combines horizontal (breadth) and vertical (depth) navigation.
 */

import { useState, useCallback, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TPortfolioHero from './TPortfolioHero'

// Lazy load the world sections (only when committed)
const DesignWorld = lazy(() => import('./DesignWorld'))
const TechWorld = lazy(() => import('./TechWorld'))

// Loading fallback — subtle pulse
function WorldFallback({ side }) {
  const color = side === 'design' ? 'rgba(196, 112, 58, 0.1)' : 'rgba(58, 124, 196, 0.1)'
  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: `2px solid ${side === 'design' ? '#c4703a' : '#3a7cc4'}`,
          borderTopColor: 'transparent',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  )
}

export default function TPortfolioPage() {
  const [activeWorld, setActiveWorld] = useState(null) // 'design' | 'tech' | null
  
  // Handle navigation from hero
  const handleNavigate = useCallback((world) => {
    setActiveWorld(world)
  }, [])
  
  // Handle return from world to hero
  const handleBack = useCallback(() => {
    setActiveWorld(null)
  }, [])

  return (
    <div className="t-portfolio">
      {/* Hero — Always visible when no world is active */}
      <AnimatePresence mode="wait">
        {!activeWorld && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
          >
            <TPortfolioHero
              onNavigate={handleNavigate}
              isReady={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* World Overlays — Shown when committed to a direction */}
      <AnimatePresence mode="wait">
        {activeWorld === 'design' && (
          <Suspense fallback={<WorldFallback side="design" />}>
            <DesignWorld onBack={handleBack} />
          </Suspense>
        )}
        
        {activeWorld === 'tech' && (
          <Suspense fallback={<WorldFallback side="tech" />}>
            <TechWorld onBack={handleBack} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  )
}
