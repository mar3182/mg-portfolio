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
      ))}
    </>
  )
}

// Large ambient orbs for atmosphere
function AmbientOrbs() {
  const orbs = useMemo(() => [
    { id: 'orb-1', x: 20, y: 30, size: 200, color: 'rgba(0, 255, 136, 0.03)', duration: 20 },
    { id: 'orb-2', x: 70, y: 60, size: 250, color: 'rgba(100, 100, 255, 0.02)', duration: 25 },
    { id: 'orb-3', x: 85, y: 20, size: 180, color: 'rgba(255, 100, 150, 0.02)', duration: 22 },
  ], [])

  return (
    <>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="ambient-orb"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 30, 0, -30, 0],
            y: [0, -20, 0, 20, 0],
            scale: [1, 1.1, 1, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  )
}
