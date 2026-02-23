/**
 * ProjectParticles — Floating project hints revealed by mouse cursor
 * 
 * Invisible particles float in the background of each side (design/tech).
 * The mouse cursor's "explore circle" reveals these particles as you hover.
 * Clicking a revealed particle opens the project details.
 * Hover shows a preview image thumbnail with project name.
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

// More particle positions - spread towards center
const DESIGN_POSITIONS = [
  // Outer edge
  { x: 8, y: 30, size: 'sm' },
  { x: 5, y: 55, size: 'sm' },
  { x: 10, y: 78, size: 'sm' },
  // Middle area
  { x: 18, y: 25, size: 'md' },
  { x: 22, y: 48, size: 'lg' },
  { x: 15, y: 65, size: 'md' },
  { x: 25, y: 82, size: 'sm' },
  // Closer to center
  { x: 32, y: 35, size: 'md' },
  { x: 38, y: 55, size: 'lg' },
  { x: 35, y: 72, size: 'md' },
  { x: 42, y: 42, size: 'sm' },
  { x: 45, y: 68, size: 'sm' },
]

const TECH_POSITIONS = [
  // Outer edge
  { x: 92, y: 32, size: 'sm' },
  { x: 95, y: 58, size: 'sm' },
  { x: 90, y: 80, size: 'sm' },
  // Middle area
  { x: 82, y: 28, size: 'md' },
  { x: 78, y: 50, size: 'lg' },
  { x: 85, y: 68, size: 'md' },
  { x: 75, y: 85, size: 'sm' },
  // Closer to center
  { x: 68, y: 38, size: 'md' },
  { x: 62, y: 58, size: 'lg' },
  { x: 65, y: 75, size: 'md' },
  { x: 58, y: 45, size: 'sm' },
  { x: 55, y: 70, size: 'sm' },
]

// Generate particles from real projects based on their spectrum scores
function generateParticlesFromProjects() {
  // Split projects by whether they lean design or tech
  const designProjects = projects
    .filter(p => p.spectrum && p.spectrum.design >= p.spectrum.tech)
  
  const techProjects = projects
    .filter(p => p.spectrum && p.spectrum.tech > p.spectrum.design)
  
  // Fill positions - repeat projects if needed to fill all positions
  const designParticles = DESIGN_POSITIONS.map((pos, i) => {
    const proj = designProjects[i % designProjects.length] || projects[i % projects.length]
    return {
      id: proj.slug,
      title: proj.title,
      category: proj.category,
      image: proj.image || `/projects/packaging-design-400-1c9c2b8f.jpg`,
      color: '#c4703a',
      ...pos,
    }
  })

  const techParticles = TECH_POSITIONS.map((pos, i) => {
    const proj = techProjects[i % techProjects.length] || projects[i % projects.length]
    return {
      id: proj.slug,
      title: proj.title,
      category: proj.category,
      image: proj.image || `/projects/ecommerce-platform-400-1ed60e00.jpg`,
      color: '#3a7cc4',
      ...pos,
    }
  })

  return { designParticles, techParticles }
}

// Particle component that reveals when mouse is near
function Particle({ 
  id, 
  title,
  category,
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
    onTap?.(id, title, category, image, color, x, y)
  }, [id, title, category, image, color, x, y, onTap])

  // Short category label for the particle
  const shortCategory = category?.split(' ')[0] || 'Project'

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
        <span className="particle__title">{shortCategory}</span>
      </Link>
      
      {/* Image preview on hover - shows actual project name */}
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
            <span className="particle__preview-title">{title}</span>
            <span className="particle__preview-label">View Project →</span>
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
