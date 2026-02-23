/**
 * ProjectParticles — Floating project hints revealed by mouse cursor
 * 
 * Invisible particles float in the background of each side (design/tech).
 * The mouse cursor's "explore circle" reveals these particles as you hover.
 * Clicking a revealed particle opens the project details.
 * Hover shows a preview image thumbnail.
 * 
 * Mobile: Particles are always slightly visible, tap reveals image preview
 * 
 * Projects are categorized by their spectrum scores:
 * - Design-heavy (spectrum.design > spectrum.tech) → Left side
 * - Tech-heavy (spectrum.tech > spectrum.design) → Right side
 */

import { useMemo, useState, useCallback } from 'react'
import { motion as Motion, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import './styles/project-particles.css'

// Particle positions - spread across the sides
const DESIGN_POSITIONS = [
  { x: 12, y: 38, size: 'lg' },
  { x: 28, y: 55, size: 'md' },
  { x: 8, y: 72, size: 'sm' },
  { x: 32, y: 28, size: 'md' },
]

const TECH_POSITIONS = [
  { x: 72, y: 42, size: 'lg' },
  { x: 88, y: 58, size: 'md' },
  { x: 68, y: 75, size: 'sm' },
  { x: 92, y: 32, size: 'md' },
]

// Generate particles from real projects based on their spectrum scores
function generateParticlesFromProjects() {
  // Split projects by whether they lean design or tech
  const designProjects = projects
    .filter(p => p.spectrum && p.spectrum.design >= p.spectrum.tech)
    .slice(0, DESIGN_POSITIONS.length)
  
  const techProjects = projects
    .filter(p => p.spectrum && p.spectrum.tech > p.spectrum.design)
    .slice(0, TECH_POSITIONS.length)
  
  // If not enough projects in each category, fill from all
  const allProjects = [...projects]
  while (designProjects.length < DESIGN_POSITIONS.length && allProjects.length > 0) {
    const proj = allProjects.shift()
    if (!designProjects.find(p => p.id === proj.id)) {
      designProjects.push(proj)
    }
  }
  while (techProjects.length < TECH_POSITIONS.length && allProjects.length > 0) {
    const proj = allProjects.pop()
    if (!techProjects.find(p => p.id === proj.id)) {
      techProjects.push(proj)
    }
  }

  const designParticles = designProjects.map((proj, i) => ({
    id: proj.slug,
    title: proj.title,
    image: proj.image || `/projects/packaging-design-400-1c9c2b8f.jpg`,
    color: '#c4703a',
    ...DESIGN_POSITIONS[i % DESIGN_POSITIONS.length],
  }))

  const techParticles = techProjects.map((proj, i) => ({
    id: proj.slug,
    title: proj.title,
    image: proj.image || `/projects/ecommerce-platform-400-1ed60e00.jpg`,
    color: '#3a7cc4',
    ...TECH_POSITIONS[i % TECH_POSITIONS.length],
  }))

  return { designParticles, techParticles }
}

// Particle component that reveals when mouse is near
function Particle({ 
  id, 
  title, 
  x, 
  y, 
  size, 
  side,
  image,
  color,
  mouseX, 
  mouseY,
  revealRadius = 150,
  onHover,
  onLeave,
  onTap,
  isTouch,
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Calculate distance from mouse to this particle
  const particleOpacity = useTransform(
    [mouseX, mouseY],
    ([mx, my]) => {
      // On touch devices, always show particles at low opacity
      if (isTouch) return 0.6
      
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
      if (isTouch) return 1
      
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
  
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    onHover?.(id, title, image, color, x, y)
  }, [id, title, image, color, x, y, onHover])
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    onLeave?.()
  }, [onLeave])
  
  const handleTouchStart = useCallback((e) => {
    e.preventDefault()
    onTap?.(id, title, image, color, x, y)
  }, [id, title, image, color, x, y, onTap])

  return (
    <Motion.div
      className={`particle particle--${side} ${sizeClasses[size]} ${isHovered ? 'particle--hovered' : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: particleOpacity,
        scale: particleScale,
      }}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      data-cursor="preview"
    >
      <Link 
        to={`/work/${id}`}
        className="particle__link"
      >
        <span className="particle__dot" style={{ '--particle-color': color }} />
        <span className="particle__title">{title}</span>
      </Link>
      
      {/* Image preview on hover */}
      <AnimatePresence>
        {isHovered && (
          <Motion.div 
            className="particle__preview"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <img src={image} alt={title} loading="lazy" />
            <span className="particle__preview-label">View Project</span>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.div>
  )
}

export default function ProjectParticles({ mouseX, mouseY, isReady = true }) {
  const [isTouch, setIsTouch] = useState(false)
  const [mobilePreview, setMobilePreview] = useState(null)
  
  // Detect touch device
  useMemo(() => {
    if (typeof window !== 'undefined') {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
  }, [])
  
  // Mobile tap handler - shows preview modal
  const handleTap = useCallback((id, title, image, color, x, y) => {
    setMobilePreview({ id, title, image, color, x, y })
  }, [])
  
  const closeMobilePreview = useCallback(() => {
    setMobilePreview(null)
  }, [])
  
  // Generate particles from real project data
  const { designParticles, techParticles } = useMemo(() => generateParticlesFromProjects(), [])

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
            isTouch={isTouch}
            onTap={handleTap}
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
            isTouch={isTouch}
            onTap={handleTap}
          />
        ))}
      </div>
      
      {/* Mobile preview modal */}
      <AnimatePresence>
        {mobilePreview && (
          <Motion.div 
            className="mobile-preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobilePreview}
          >
            <Motion.div 
              className="mobile-preview"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={mobilePreview.image} alt={mobilePreview.title} />
              <h3 className="mobile-preview__title">{mobilePreview.title}</h3>
              <Link 
                to={`/work/${mobilePreview.id}`}
                className="mobile-preview__link"
              >
                View Project →
              </Link>
              <button 
                className="mobile-preview__close"
                onClick={closeMobilePreview}
                aria-label="Close preview"
              >
                ×
              </button>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
