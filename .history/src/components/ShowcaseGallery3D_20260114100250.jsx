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
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const wheelTimeoutRef = useRef(null)
  const containerRef = useRef(null)
  const count = showcaseItems.length

  const isExpanded = expandedIndex !== null

  // Notify parent about expand/collapse for hero layout
  useEffect(() => {
    if (isExpanded) {
      onExpand?.()
      document.body.classList.add('showcase-expanded')
    } else {
      onCollapse?.()
      document.body.classList.remove('showcase-expanded')
    }
    return () => {
      document.body.classList.remove('showcase-expanded')
    }
  }, [isExpanded, onExpand, onCollapse])

  // Update accent color
  useEffect(() => {
    const currentItem = showcaseItems[expandedIndex ?? activeIndex]
    if (currentItem) {
      document.documentElement.style.setProperty(
        '--accent-color', 
        currentItem.color || '#d77f2b'
      )
    }
  }, [activeIndex, expandedIndex])

  const handleCardClick = (index) => {
    if (expandedIndex === index) {
      // Clicking expanded card - do nothing (use close button)
      return
    }
    if (expandedIndex !== null) {
      // Another card is expanded - switch to this one
      setExpandedIndex(index)
      setActiveIndex(index)
    } else if (index === activeIndex) {
      // Click on front card - expand it
      setExpandedIndex(index)
    } else {
      // Click on background card - bring to front
      setActiveIndex(index)
    }
  }

  const handleClose = () => {
    setExpandedIndex(null)
  }

  const navigateStack = useCallback((direction) => {
    if (isNavigating) return
    setIsNavigating(true)
    
    if (expandedIndex !== null) {
      // Navigate expanded cards
      setExpandedIndex(prev => {
        const next = prev + direction
        if (next < 0) return count - 1
        if (next >= count) return 0
        setActiveIndex(next < 0 ? count - 1 : next >= count ? 0 : next)
        return next < 0 ? count - 1 : next >= count ? 0 : next
      })
    } else {
      // Navigate stack
      setActiveIndex(prev => {
        const next = prev + direction
        if (next < 0) return count - 1
        if (next >= count) return 0
        return next
      })
    }
    
    if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current)
    wheelTimeoutRef.current = setTimeout(() => setIsNavigating(false), 350)
  }, [count, expandedIndex, isNavigating])

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
    }
  }, [])

  if (!showcaseItems.length) {
    return <div className="showcase-gallery3d">No items available</div>
  }

  // Calculate 3D transforms for stacked cards
  const getCardStyle = (index) => {
    const current = expandedIndex ?? activeIndex
    const diff = index - current
    const absDiff = Math.abs(diff)
    
    if (expandedIndex !== null && index !== expandedIndex) {
      // Other cards when one is expanded - stack behind
      return {
        y: diff * 40,
        z: -absDiff * 80,
        scale: 1 - absDiff * 0.06,
        opacity: Math.max(0.2, 1 - absDiff * 0.25),
        rotateX: 0,
      }
    }
    
    // Normal stack view
    if (diff === 0) {
      return { y: 0, z: 0, scale: 1, opacity: 1, rotateX: 0 }
    }
    
    // Cards behind
    if (diff < 0) {
      return {
        y: diff * 35,
        z: diff * 50,
        scale: 1 + diff * 0.04,
        opacity: Math.max(0.4, 1 + diff * 0.2),
        rotateX: diff * 2,
      }
    }
    
    // Cards in front (below in stack)
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
    >
      {/* 3D Stack Container */}
      <div className="showcase-gallery3d-stack">
        {showcaseItems.map((item, idx) => {
          const style = getCardStyle(idx)
          const isActive = idx === (expandedIndex ?? activeIndex)
          const isCardExpanded = idx === expandedIndex
          
          return (
            <Motion.article
              key={item.id}
              className={`showcase-gallery3d-card ${isActive ? 'is-active' : ''} ${isCardExpanded ? 'is-expanded' : ''}`}
              style={{ 
                backgroundColor: item.color,
                zIndex: count - Math.abs(idx - (expandedIndex ?? activeIndex)),
              }}
              animate={{
                y: style.y,
                z: style.z,
                scale: style.scale,
                opacity: style.opacity,
                rotateX: style.rotateX,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={() => handleCardClick(idx)}
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
                
                {isActive && !isCardExpanded && (
                  <Motion.div 
                    className="showcase-gallery3d-cta-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Click to expand →
                  </Motion.div>
                )}
              </header>

              {/* Expanded Content */}
              <AnimatePresence>
                {isCardExpanded && item.details && (
                  <Motion.div 
                    className="showcase-gallery3d-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
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
                      <button 
                        className="showcase-gallery3d-close"
                        onClick={(e) => { e.stopPropagation(); handleClose(); }}
                      >
                        Close
                      </button>
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
