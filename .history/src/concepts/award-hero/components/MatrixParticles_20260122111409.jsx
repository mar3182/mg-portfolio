/**
 * Matrix Particles Component
 * Subtle floating particles that drift gently in the background
 */

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function MatrixParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
      isGreen: Math.random() > 0.7, // 30% are green "matrix" particles
    }))
  }, [])

  return (
    <div className="matrix-particles">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`particle ${particle.isGreen ? 'particle-green' : ''}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ 
            opacity: 0,
            y: 0,
          }}
          animate={{ 
            opacity: [0, particle.opacity, particle.opacity, 0],
            y: [-20, 0, 20, 40],
            x: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Occasional glowing particles */}
      <GlowingParticles />
    </div>
  )
}

function GlowingParticles() {
  const glowParticles = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: `glow-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 10,
    }))
  }, [])

  return (
    <>
      {glowParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle-glow"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  )
}
