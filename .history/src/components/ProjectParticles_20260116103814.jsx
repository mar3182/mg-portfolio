/**
 * ProjectParticles — Floating project hints revealed by mouse cursor
 * 
 * Invisible particles float in the background of each side (design/tech).
 * The mouse cursor's "explore circle" reveals these particles as you hover.
 * Clicking a revealed particle opens the project details.
 */

import { useMemo, useCallback } from 'react'
import { motion as Motion, useMotionValue, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import './styles/project-particles.css'

// Sample project data for particles
const DESIGN_PARTICLES = [
  { id: 'brand-identity', title: 'Brand Identity', x: 15, y: 35, size: 'lg' },
  { id: 'ui-ux-design', title: 'UI/UX Design', x: 25, y: 55, size: 'md' },
  { id: 'packaging', title: 'Packaging', x: 8, y: 70, size: 'sm' },
  { id: 'motion-design', title: 'Motion', x: 30, y: 25, size: 'sm' },
  { id: 'illustration', title: 'Illustration', x: 18, y: 80, size: 'md' },
]

const TECH_PARTICLES = [
  { id: 'web-apps', title: 'Web Apps', x: 75, y: 40, size: 'lg' },
  { id: 'api-design', title: 'API Design', x: 85, y: 60, size: 'md' },
  { id: 'blockchain', title: 'Web3', x: 70, y: 75, size: 'sm' },
  { id: 'ai-ml', title: 'AI/ML', x: 90, y: 30, size: 'sm' },
  { id: 'cloud', title: 'Cloud', x: 78, y: 85, size: 'md' },
]

// Particle component that reveals when mouse is near
function Particle({ 
  id, 
  title, 
  x, 
  y, 
  size, 
  side,
  mouseX, 
  mouseY,
  revealRadius = 150,
}) {
  // Calculate distance from mouse to this particle
  const particleOpacity = useTransform(
    [mouseX, mouseY],
    ([mx, my]) => {
      // Convert particle position (%) to normalized mouse position
      const px = x / 100
      const py = y / 100
      
      // Calculate distance (in viewport units, roughly)
      const dx = (mx - px) * 100 // Scale back to percentages for distance calc
      const dy = (my - py) * 100
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Reveal radius in percentage of viewport
      const radiusPercent = revealRadius / 10 // ~15% of viewport
      
      if (distance < radiusPercent) {
        // Smooth fade based on distance from center
        return 1 - (distance / radiusPercent) * 0.3
      }
      return 0
    }
  )
  
  const particleScale = useTransform(
    [mouseX, mouseY],
    ([mx, my]) => {
      const px = x / 100
      const py = y / 100
      const dx = (mx - px) * 100
      const dy = (my - py) * 100
      const distance = Math.sqrt(dx * dx + dy * dy)
      const radiusPercent = revealRadius / 10
      
      if (distance < radiusPercent) {
        return 1 + (1 - distance / radiusPercent) * 0.2
      }
      return 0.8
    }
  )

  const sizeClasses = {
    sm: 'particle--sm',
    md: 'particle--md',
    lg: 'particle--lg',
  }

  return (
    <Motion.div
      className={`particle particle--${side} ${sizeClasses[size]}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: particleOpacity,
        scale: particleScale,
      }}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link 
        to={`/work/${id}`}
        className="particle__link"
        onClick={(e) => {
          // Prevent navigation if particle is not visible enough
          // This is handled visually by pointer-events in CSS
        }}
      >
        <span className="particle__dot" />
        <span className="particle__title">{title}</span>
      </Link>
    </Motion.div>
  )
}

export default function ProjectParticles({ mouseX, mouseY, isReady = true }) {
  // Memoize particles to prevent re-renders
  const designParticles = useMemo(() => DESIGN_PARTICLES, [])
  const techParticles = useMemo(() => TECH_PARTICLES, [])

  if (!isReady) return null

  return (
    <div className="project-particles" aria-hidden="true">
      {/* Design side particles (left) */}
      <div className="particles-side particles-side--design">
        {designParticles.map((p) => (
          <Particle
            key={p.id}
            {...p}
            side="design"
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </div>
      
      {/* Tech side particles (right) */}
      <div className="particles-side particles-side--tech">
        {techParticles.map((p) => (
          <Particle
            key={p.id}
            {...p}
            side="tech"
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </div>
    </div>
  )
}
