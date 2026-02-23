/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IDENTITY MOTION PROVIDER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Cinematic wrapper for identity-driven interactions.
 * Per spec: "The portrait behaves as a lens through which the environment reacts."
 * 
 * This component bridges the existing Zustand identity store with Framer Motion
 * for buttery-smooth CSS variable updates.
 */

import { createContext, useContext, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useIdentityActions } from '../../hooks/useIdentity'
import { identityMotionValue } from '../../stores/identityStore'

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

const IdentityContext = createContext(null)

export function useIdentityContext() {
  const ctx = useContext(IdentityContext)
  if (!ctx) {
    throw new Error('useIdentityContext must be used inside IdentityMotionProvider')
  }
  return ctx
}

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function IdentityMotionProvider({ children, className = '' }) {
  const { setIdentity, animateToIdentity } = useIdentityActions()
  
  // Raw mouse position (0-1)
  const identityRaw = useMotionValue(0.5)
  
  // ═══ CINEMATIC SMOOTHING ═══
  // Per spec: "Duration: 1.2s – 2.4s, Ease: easeInOut"
  // Stiffness: 60, Damping: 20, Mass: 1.2 gives ~1.5s effective response
  const identity = useSpring(identityRaw, {
    stiffness: 60,
    damping: 20,
    mass: 1.2,
  })
  
  // Sync the spring to the global identity motion value
  useEffect(() => {
    const unsubscribe = identity.on('change', (latest) => {
      identityMotionValue.set(latest)
    })
    return unsubscribe
  }, [identity])
  
  // ═══ DERIVED VALUES FOR CSS VARIABLES ═══
  // These drive the ambient base layer via CSS custom properties
  
  // Background warmth (0 = warm design, 1 = cool tech)
  const warmth = useTransform(identity, [0, 1], [1, 0])
  
  // Organic opacity (design side elements)
  const organicOpacity = useTransform(identity, [0, 0.5, 1], [1, 0.6, 0.15])
  
  // Matrix opacity (tech side elements)  
  const matrixOpacity = useTransform(identity, [0, 0.5, 1], [0.15, 0.6, 1])
  
  // Grain intensity (design has more texture)
  const grainIntensity = useTransform(identity, [0, 1], [0.04, 0.015])
  
  // Handle mouse movement
  const handleMouseMove = (e) => {
    const x = e.clientX / window.innerWidth
    identityRaw.set(x)
    
    // Also update the global store (for non-Framer consumers)
    setIdentity(x, 'hero')
  }
  
  // Handle mouse leave - lock to nearest side
  const handleMouseLeave = () => {
    const current = identityRaw.get()
    
    if (current < 0.4) {
      // Lock to design
      identityRaw.set(0)
      animateToIdentity(0, { duration: 0.8, source: 'hero-exit' })
    } else if (current > 0.6) {
      // Lock to tech
      identityRaw.set(1)
      animateToIdentity(1, { duration: 0.8, source: 'hero-exit' })
    } else {
      // Return to neutral
      identityRaw.set(0.5)
      animateToIdentity(0.5, { duration: 1.2, source: 'hero-exit' })
    }
  }
  
  // Context value
  const contextValue = {
    identity,
    identityRaw,
    organicOpacity,
    matrixOpacity,
    warmth,
    grainIntensity,
  }
  
  return (
    <IdentityContext.Provider value={contextValue}>
      <motion.div
        className={`identity-motion-provider ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          '--identity': identity,
          '--warmth': warmth,
          '--organic-opacity': organicOpacity,
          '--matrix-opacity': matrixOpacity,
          '--grain-intensity': grainIntensity,
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {children}
      </motion.div>
    </IdentityContext.Provider>
  )
}

export default IdentityMotionProvider
