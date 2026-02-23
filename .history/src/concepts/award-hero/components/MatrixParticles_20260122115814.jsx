/**
 * Matrix Particles Component
 * Subtle floating particles with ambient motion - felt, not noticed
 */

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function MatrixParticles() {
  // More particles for richer ambient feel
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.25 + 0.05,
      isGreen: Math.random() > 0.75, // 25% are green "matrix" particles
      drift: Math.random() * 30 - 15,
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
            opacity: [0, particle.opacity, particle.opacity, particle.opacity * 0.5, 0],
            y: [-30, -10, 10, 30, 50],
            x: [0, particle.drift * 0.5, particle.drift, particle.drift * 0.5, 0],
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
      
      {/* Ambient floating orbs */}
      <AmbientOrbs />
    </div>
  )
}

// Subtle glowing accent particles
function GlowingParticles() {
  const glowParticles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: `glow-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 12,
      size: Math.random() * 6 + 4,
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
            width: particle.size,
            height: particle.size,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.5, 1.3, 0.5],
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
