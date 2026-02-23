/**
 * ProjectParticles — Floating project hints revealed by mouse cursor
 * 
 * Invisible particles float in the background of each side (design/tech).
 * The mouse cursor's "explore circle" reveals these particles as you hover.
 * Clicking a revealed particle opens the project details.
 * Hover shows a preview image thumbnail.
 * 
 * Mobile: Particles are always slightly visible, tap reveals image preview
 */

import { useMemo, useState, useCallback } from 'react'
import { motion as Motion, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './styles/project-particles.css'

// Project data for particles with images
const DESIGN_PARTICLES = [
  { 
    id: 'brand-identity', 
    title: 'Brand Identity', 
    x: 15, y: 35, size: 'lg',
    image: '/projects/packaging-design-400-1c9c2b8f.jpg',
    color: '#c4703a'
  },
  { 
    id: 'ui-ux-design', 
    title: 'UI/UX Design', 
    x: 25, y: 55, size: 'md',
    image: '/projects/interactive-portfolio-400-5ce3456b.jpg',
    color: '#d4804a'
  },
  { 
    id: 'packaging', 
    title: 'Packaging', 
    x: 8, y: 70, size: 'sm',
    image: '/projects/packaging-design-400-1c9c2b8f.jpg',
    color: '#b4603a'
  },
  { 
    id: 'motion-design', 
    title: 'Motion', 
    x: 30, y: 25, size: 'sm',
    image: '/projects/interactive-portfolio-400-5ce3456b.jpg',
    color: '#e4905a'
  },
  { 
    id: 'illustration', 
    title: 'Illustration', 
    x: 18, y: 80, size: 'md',
    image: '/projects/packaging-design-400-1c9c2b8f.jpg',
    color: '#c4703a'
  },
]

const TECH_PARTICLES = [
  { 
    id: 'web-apps', 
    title: 'Web Apps', 
    x: 75, y: 40, size: 'lg',
    image: '/projects/ecommerce-platform-400-1ed60e00.jpg',
    color: '#3a7cc4'
  },
  { 
    id: 'api-design', 
    title: 'API Design', 
    x: 85, y: 60, size: 'md',
    image: '/projects/interactive-portfolio-400-5ce3456b.jpg',
    color: '#4a8cd4'
  },
  { 
    id: 'blockchain', 
    title: 'Web3', 
    x: 70, y: 75, size: 'sm',
    image: '/projects/ecommerce-platform-400-1ed60e00.jpg',
    color: '#2a6cb4'
  },
  { 
    id: 'ai-ml', 
    title: 'AI/ML', 
    x: 90, y: 30, size: 'sm',
    image: '/projects/interactive-portfolio-400-5ce3456b.jpg',
    color: '#5a9ce4'
  },
  { 
    id: 'cloud', 
    title: 'Cloud', 
    x: 78, y: 85, size: 'md',
    image: '/projects/ecommerce-platform-400-1ed60e00.jpg',
    color: '#3a7cc4'
  },
]

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
      data-cursor="view"
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
