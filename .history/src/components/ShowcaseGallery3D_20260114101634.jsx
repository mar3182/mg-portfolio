import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'
import '../styles/showcase-gallery3d.css'

/**
 * ShowcaseGallery3D
 * - Cards displayed as 3D vertical stack
 * - Click expands card inline, hero collapses to sidebar
 * - Navigate through stacked cards with scroll/arrows
 */
export default function ShowcaseGallery3D({ onExpand, onCollapse }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const wheelTimeoutRef = useRef(null)
  const containerRef = useRef(null)
  const hoverTimeoutRef = useRef(null)
  const count = showcaseItems.length

  const isExpanded = hoveredIndex !== null

  // Clean up body class on mount (in case of stale state from HMR)
  useEffect(() => {
    document.body.classList.remove('showcase-expanded')
    return () => {
      document.body.classList.remove('showcase-expanded')
    }
  }, [])

  // Notify parent about expand/collapse for hero layout
  useEffect(() => {
    if (isExpanded) {
      onExpand?.()
      document.body.classList.add('showcase-expanded')
    } else {
      onCollapse?.()
      document.body.classList.remove('showcase-expanded')
    }
  }, [isExpanded, onExpand, onCollapse])

  // Update accent color
  useEffect(() => {
    const currentItem = showcaseItems[hoveredIndex ?? activeIndex]
    if (currentItem) {
      document.documentElement.style.setProperty(
        '--accent-color', 
        currentItem.color || '#d77f2b'
      )
    }
  }, [activeIndex, hoveredIndex])

  // Handle hover with slight delay for stability
  const handleMouseEnter = (index) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(index)
      setActiveIndex(index)
    }, 80)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null)
    }, 150)
  }

  const handleCardClick = (index) => {
    // Click navigates to the project page
    // Navigation handled by Link component in expanded state
    if (hoveredIndex !== index) {
      setActiveIndex(index)
    }
  }

  const navigateStack = useCallback((direction) => {
    if (isNavigating) return
    setIsNavigating(true)
    
    setActiveIndex(prev => {
      const next = prev + direction
      if (next < 0) return count - 1
      if (next >= count) return 0
      return next
    })
    
    if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current)
    wheelTimeoutRef.current = setTimeout(() => setIsNavigating(false), 350)
  }, [count, isNavigating])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && expandedIndex !== null) {
        handleClose()
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        navigateStack(1)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        navigateStack(-1)
      } else if (e.key === 'Enter' && expandedIndex === null) {
        setExpandedIndex(activeIndex)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expandedIndex, activeIndex, navigateStack])

  // Wheel navigation (throttled)
  const handleWheel = useCallback((e) => {
    // Only handle wheel on the container
    if (!containerRef.current?.contains(e.target)) return
    e.preventDefault()
    navigateStack(e.deltaY > 0 ? 1 : -1)
  }, [navigateStack])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Cleanup
  useEffect(() => {
    return () => {
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current)
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  if (!showcaseItems.length) {
    return <div className="showcase-gallery3d">No items available</div>
  }

  // Calculate 3D transforms for stacked cards - MORE PRONOUNCED
  const getCardStyle = (index) => {
    const current = activeIndex
    const diff = index - current
    const absDiff = Math.abs(diff)
    
    // Hovered card - expand and lift
    if (hoveredIndex === index) {
      return {
        y: 0,
        z: 100,
        scale: 1.05,
        opacity: 1,
        rotateX: 0,
      }
    }
    
    // When a card is hovered, push others back more
    if (hoveredIndex !== null && index !== hoveredIndex) {
      const hoverDiff = index - hoveredIndex
      return {
        y: hoverDiff * 60,
        z: -absDiff * 120 - 50,
        scale: 0.85 - absDiff * 0.05,
        opacity: Math.max(0.3, 0.7 - absDiff * 0.15),
        rotateX: hoverDiff * 3,
      }
    }
    
    // Normal stack view - MORE VISIBLE STACKING
    if (diff === 0) {
      return { y: 0, z: 0, scale: 1, opacity: 1, rotateX: 0 }
    }
    
    // Cards behind (negative diff - above in visual stack)
    if (diff < 0) {
      return {
        y: diff * 55,
        z: diff * 40,
        scale: 1 + diff * 0.03,
        opacity: Math.max(0.5, 1 + diff * 0.15),
        rotateX: diff * 4,
      }
    }
    
    // Cards in front (positive diff - below in visual stack)
    return {
      y: diff * 45,
      z: -diff * 60,
      scale: 1 - diff * 0.05,
      opacity: Math.max(0.3, 1 - diff * 0.25),
      rotateX: -diff * 2,
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`showcase-gallery3d ${isExpanded ? 'is-expanded' : ''}`}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Stack Container */}
      <div className="showcase-gallery3d-stack">
        {showcaseItems.map((item, idx) => {
          const style = getCardStyle(idx)
          const isActive = idx === activeIndex
          const isCardHovered = idx === hoveredIndex
          
          return (
            <Motion.article
              key={item.id}
              className={`showcase-gallery3d-card ${isActive ? 'is-active' : ''} ${isCardHovered ? 'is-expanded' : ''}`}
              style={{ 
                backgroundColor: item.color,
                zIndex: isCardHovered ? 100 : count - Math.abs(idx - activeIndex),
              }}
              animate={{
                y: style.y,
                z: style.z,
                scale: style.scale,
                opacity: style.opacity,
                rotateX: style.rotateX,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={() => handleCardClick(idx)}
              onMouseEnter={() => handleMouseEnter(idx)}
              layout
            >
              {/* Card Header - always visible */}
              <header className="showcase-gallery3d-header">
                <div className="showcase-gallery3d-meta">
                  <span className="showcase-gallery3d-index">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="showcase-gallery3d-year">{item.year}</span>
                </div>
                <h3 className="showcase-gallery3d-title">{item.title}</h3>
                <p className="showcase-gallery3d-desc">{item.description}</p>
                
                {item.categories && (
                  <div className="showcase-gallery3d-tags">
                    {item.categories.map(cat => (
                      <span key={cat} className="showcase-gallery3d-tag">{cat}</span>
                    ))}
                  </div>
                )}
                
                {isActive && !isCardHovered && (
                  <Motion.div 
                    className="showcase-gallery3d-cta-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Hover to preview →
                  </Motion.div>
                )}
              </header>

              {/* Expanded Content */}
              <AnimatePresence>
                {isCardHovered && item.details && (
                  <Motion.div 
                    className="showcase-gallery3d-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="showcase-gallery3d-details-grid">
                      <div className="detail-block">
                        <h4>Scope</h4>
                        <p>{item.details.scope}</p>
                      </div>

                      <div className="detail-block">
                        <h4>Technologies</h4>
                        <div className="tech-tags">
                          {item.details.technologies.map((tech, i) => (
                            <span key={i} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                      </div>

                      <div className="detail-block full-width">
                        <h4>Key Features</h4>
                        <ul className="feature-list">
                          {item.details.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="detail-block full-width">
                        <h4>Outcome</h4>
                        <p className="outcome-text">{item.details.outcome}</p>
                      </div>
                    </div>

                    <div className="showcase-gallery3d-actions">
                      <Link 
                        to={`/projects/${item.id}`} 
                        className="showcase-gallery3d-link"
                      >
                        View Full Project
                        <span>→</span>
                      </Link>
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </Motion.article>
          )
        })}
      </div>

      {/* Navigation indicators */}
      <div className="showcase-gallery3d-nav">
        <button 
          className="nav-arrow nav-arrow--up"
          onClick={() => navigateStack(-1)}
          aria-label="Previous project"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        
        <div className="nav-dots">
          {showcaseItems.map((_, idx) => (
            <button
              key={idx}
              className={`nav-dot ${idx === (expandedIndex ?? activeIndex) ? 'is-active' : ''}`}
              onClick={() => {
                setActiveIndex(idx)
                if (expandedIndex !== null) setExpandedIndex(idx)
              }}
              aria-label={`Go to project ${idx + 1}`}
            />
          ))}
        </div>
        
        <button 
          className="nav-arrow nav-arrow--down"
          onClick={() => navigateStack(1)}
          aria-label="Next project"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Counter */}
      <div className="showcase-gallery3d-counter">
        <span className="current">{String((expandedIndex ?? activeIndex) + 1).padStart(2, '0')}</span>
        <span className="divider">/</span>
        <span className="total">{String(count).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
