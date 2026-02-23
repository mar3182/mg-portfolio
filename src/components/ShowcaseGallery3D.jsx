import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'
import SkillSpectrum from './SkillSpectrum'
import '../styles/showcase-gallery3d.css'

/**
 * ShowcaseGallery3D - UX-Optimized Portfolio Gallery
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVIGATION DESIGN PRINCIPLES (Expert UX Analysis)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 1. CLICK/TAP IS PRIMARY
 *    - Works on ALL devices (desktop, tablet, mobile, touch screens)
 *    - Intentional action - no accidental triggers
 *    - Click inactive card → Select it (bring to front)
 *    - Click active card → Navigate to project detail page
 * 
 * 2. KEYBOARD ARROWS FOR ACCESSIBILITY
 *    - ↑↓←→ to navigate between cards
 *    - Only active when gallery is in viewport
 *    - Essential for accessibility compliance
 * 
 * 3. NAVIGATION BUTTONS - CLEAR AFFORDANCE
 *    - Visible arrows and dot indicators
 *    - Provides clear visual hint of interactivity
 *    - Works on all devices
 * 
 * 4. ❌ NO SCROLL HIJACKING
 *    - Page scroll should ALWAYS scroll the page
 *    - Scroll hijacking causes user frustration
 *    - Breaks expected browser behavior
 * 
 * 5. ❌ NO HOVER-TO-EXPAND (Removed)
 *    - Hover doesn't work on touch devices
 *    - Accidental triggers from mouse movement
 *    - Conflicts with page scrolling
 *    - Removed: hoveredIndex, handleMouseEnter/Leave
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * RESPONSIVE BEHAVIOR BY DEVICE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * DESKTOP (1024px+):
 *   - Full 3D card stack visible
 *   - Click cards to select, buttons to navigate
 *   - Keyboard arrows work
 * 
 * TABLET (768-1023px):
 *   - Slightly smaller cards
 *   - Touch-friendly button sizes
 *   - Same click-to-select interaction
 * 
 * MOBILE (<768px):
 *   - Single card view (stacked cards hidden)
 *   - Swipe gestures enabled
 *   - Large touch-friendly nav buttons
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function ShowcaseGallery3D() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const containerRef = useRef(null)
  const count = showcaseItems.length

  // Update accent color based on active card
  useEffect(() => {
    const currentItem = showcaseItems[activeIndex]
    if (currentItem) {
      document.documentElement.style.setProperty(
        '--accent-color', 
        currentItem.color || '#d77f2b'
      )
    }
  }, [activeIndex])

  // Navigate to specific index with transition guard
  const goToIndex = useCallback((index) => {
    if (isTransitioning) return
    if (index === activeIndex) return
    
    setIsTransitioning(true)
    setActiveIndex(index)
    
    // Reset transition lock after animation completes
    setTimeout(() => setIsTransitioning(false), 350)
  }, [activeIndex, isTransitioning])

  // Navigate by direction (-1 = prev, +1 = next)
  const navigate = useCallback((direction) => {
    const next = activeIndex + direction
    if (next < 0) {
      goToIndex(count - 1)
    } else if (next >= count) {
      goToIndex(0)
    } else {
      goToIndex(next)
    }
  }, [activeIndex, count, goToIndex])

  // Handle card click
  // - Inactive card: Select it (bring to front)
  // - Active card: Link handles navigation to project page
  const handleCardClick = (index, e) => {
    if (index !== activeIndex) {
      e.preventDefault() // Prevent Link navigation for inactive cards
      goToIndex(index)
    }
    // Active card click: Let Link component handle navigation
  }

  // Keyboard navigation - only when gallery is visible
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current) return
      
      // Check if gallery is in viewport
      const rect = containerRef.current.getBoundingClientRect()
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0
      if (!inViewport) return

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault()
          navigate(1)
          break
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault()
          navigate(-1)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    })
  }

  const handleTouchEnd = (e) => {
    if (!touchStart) return
    
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    }
    
    const deltaX = touchEnd.x - touchStart.x
    const deltaY = touchEnd.y - touchStart.y
    
    // Minimum swipe distance (px)
    const minSwipe = 50
    
    // Determine if horizontal or vertical swipe
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)
    
    if (isHorizontal && Math.abs(deltaX) > minSwipe) {
      // Horizontal swipe: left = next, right = prev
      navigate(deltaX < 0 ? 1 : -1)
    } else if (!isHorizontal && Math.abs(deltaY) > minSwipe) {
      // Vertical swipe: up = prev, down = next (intuitive for stack)
      navigate(deltaY > 0 ? 1 : -1)
    }
    
    setTouchStart(null)
  }

  if (!showcaseItems.length) {
    return <div className="showcase-gallery3d">No projects available</div>
  }

  // Calculate 3D transforms for stacked cards
  const getCardStyle = (index) => {
    const diff = index - activeIndex
    
    // Active card - front and center
    if (diff === 0) {
      return { 
        y: 0, 
        z: 0, 
        scale: 1, 
        opacity: 1, 
        rotateX: 0 
      }
    }
    
    // Cards above active (negative diff - stacked above)
    if (diff < 0) {
      return {
        y: diff * 50,           // Stack upward
        z: diff * 35,           // Push back in 3D space
        scale: 1 + diff * 0.04, // Slightly smaller
        opacity: Math.max(0.5, 1 + diff * 0.2),
        rotateX: diff * 3,      // Subtle tilt back
      }
    }
    
    // Cards below active (positive diff - stacked below)
    return {
      y: diff * 40,             // Stack downward
      z: -diff * 50,            // Push back in 3D space
      scale: 1 - diff * 0.05,   // Slightly smaller
      opacity: Math.max(0.4, 1 - diff * 0.2),
      rotateX: -diff * 2,       // Subtle tilt forward
    }
  }

  return (
    <div 
      ref={containerRef}
      className="showcase-gallery3d"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Project showcase gallery"
      aria-roledescription="carousel"
    >
      {/* 3D Card Stack */}
      <div className="showcase-gallery3d-stack">
        {showcaseItems.map((item, idx) => {
          const style = getCardStyle(idx)
          const isActive = idx === activeIndex
          const diff = Math.abs(idx - activeIndex)
          
          return (
            <Motion.article
              key={item.id}
              className={`showcase-gallery3d-card ${isActive ? 'is-active' : ''}`}
              style={{ 
                backgroundColor: item.color,
                zIndex: count - diff,
              }}
              animate={{
                y: style.y,
                z: style.z,
                scale: style.scale,
                opacity: style.opacity,
                rotateX: style.rotateX,
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                mass: 0.8
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${count}: ${item.title}`}
              aria-current={isActive ? 'true' : undefined}
              tabIndex={isActive ? 0 : -1}
            >
              {/* Card is wrapped in Link - click anywhere to interact */}
              <Link 
                to={`/projects/${item.id}`}
                className="showcase-gallery3d-card-link"
                onClick={(e) => handleCardClick(idx, e)}
                aria-label={isActive ? `View ${item.title} project details` : `Select ${item.title}`}
                data-cursor={isActive ? 'view' : 'explore'}
              >
                {/* Card Header */}
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
                  
                  {/* T-Shaped Spectrum Indicator */}
                  {item.spectrum && (
                    <div className="showcase-gallery3d-spectrum">
                      <SkillSpectrum 
                        spectrum={item.spectrum}
                        variant="compact"
                        size="small"
                        showLabels={false}
                        animated={isActive}
                      />
                    </div>
                  )}
                </header>

                {/* Active Card CTA */}
                <AnimatePresence>
                  {isActive && (
                    <Motion.div 
                      className="showcase-gallery3d-cta"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: 0.15 }}
                    >
                      <span className="showcase-gallery3d-cta-text">
                        View Project
                        <span className="showcase-gallery3d-cta-arrow" aria-hidden="true">→</span>
                      </span>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </Motion.article>
          )
        })}
      </div>

      {/* Navigation Controls */}
      <nav className="showcase-gallery3d-nav" aria-label="Gallery navigation">
        <button 
          className="nav-arrow nav-arrow--prev"
          onClick={() => navigate(-1)}
          aria-label="Previous project"
          disabled={isTransitioning}
          data-cursor="prev"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        
        <div className="nav-dots" role="tablist" aria-label="Project slides">
          {showcaseItems.map((item, idx) => (
            <button
              key={idx}
              className={`nav-dot ${idx === activeIndex ? 'is-active' : ''}`}
              onClick={() => goToIndex(idx)}
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Go to ${item.title}`}
              tabIndex={idx === activeIndex ? 0 : -1}
              data-cursor="click"
            />
          ))}
        </div>
        
        <button 
          className="nav-arrow nav-arrow--next"
          onClick={() => navigate(1)}
          aria-label="Next project"
          disabled={isTransitioning}
          data-cursor="next"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </nav>

      {/* Progress Counter */}
      <div className="showcase-gallery3d-counter" aria-hidden="true">
        <span className="current">{String(activeIndex + 1).padStart(2, '0')}</span>
        <span className="divider">/</span>
        <span className="total">{String(count).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
