/**
 * Subtle Particles Component
 * Minimal, barely-there particles that support, not perform
 * Elegance through restraint
 */

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function MatrixParticles() {
  // Very few, very subtle particles
  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 30 + 25,
      delay: Math.random() * 10,
      // Very low opacity - barely visible
      opacity: Math.random() * 0.08 + 0.02,
    }))
  }, [])

  return (
    <div className="matrix-particles">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: 'rgba(0, 0, 0, 0.15)',
            borderRadius: '50%',
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, particle.opacity, particle.opacity, 0],
            y: [-20, 0, 20, 40],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
