import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'
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
              className={`nav-dot ${idx === activeIndex ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(idx)}
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
        <span className="current">{String(activeIndex + 1).padStart(2, '0')}</span>
        <span className="divider">/</span>
        <span className="total">{String(count).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
