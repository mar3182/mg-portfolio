import React, { useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'
import '../styles/showcase-sidenav.css'

/**
 * ShowcaseSideNav
 * - Cards displayed as compact thumbnails on the side
 * - Click expands into full horizontal carousel overlay
 */
export default function ShowcaseSideNav({ onIndexChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const wheelTimeoutRef = useRef(null)
  const count = showcaseItems.length

  // Update accent color
  useEffect(() => {
    if (showcaseItems[activeIndex]) {
      document.documentElement.style.setProperty(
        '--accent-color', 
        showcaseItems[activeIndex].color || '#d77f2b'
      )
      if (onIndexChange) {
        onIndexChange(activeIndex, showcaseItems[activeIndex])
      }
    }
  }, [activeIndex, onIndexChange])

  // Lock body scroll and restore cursor when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('showcase-overlay-open')
    } else {
      document.body.style.overflow = ''
      document.body.classList.remove('showcase-overlay-open')
    }
    return () => { 
      document.body.style.overflow = ''
      document.body.classList.remove('showcase-overlay-open')
    }
  }, [isExpanded])

  const handleExpand = (index) => {
    setActiveIndex(index)
    setIsExpanded(true)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
  }

  const navigatePanel = useCallback((direction) => {
    setActiveIndex(prev => {
      const next = prev + direction
      if (next < 0) return count - 1
      if (next >= count) return 0
      return next
    })
  }, [count])

  // Keyboard navigation when expanded
  useEffect(() => {
    if (!isExpanded) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        handleCollapse()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        navigatePanel(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        navigatePanel(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isExpanded, navigatePanel])

  // Wheel navigation when expanded (throttled to prevent jitter)
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    
    // Throttle: ignore rapid wheel events
    if (isNavigating) return
    
    setIsNavigating(true)
    navigatePanel(e.deltaY > 0 ? 1 : -1)
    
    // Clear any existing timeout
    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current)
    }
    
    // Re-enable navigation after animation completes
    wheelTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false)
    }, 400) // Match spring animation duration
  }, [navigatePanel, isNavigating])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current)
      }
    }
  }, [])

  if (!showcaseItems.length) {
    return <div className="showcase-sidenav">No items available</div>
  }

  return (
    <>
      {/* Collapsed: Side thumbnails */}
      <div className="showcase-sidenav showcase-sidenav--collapsed">
        <div className="showcase-sidenav-header">
          <h3>Selected Work</h3>
          <p>Click to explore</p>
        </div>
        
        <div className="showcase-sidenav-thumbs">
          {showcaseItems.map((item, idx) => (
            <Motion.button
              key={item.id}
              className="showcase-thumb"
              style={{ '--card-color': item.color }}
              onClick={() => handleExpand(idx)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, x: -4 }}
              aria-label={`View ${item.title}`}
            >
              <span className="showcase-thumb-index">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="showcase-thumb-title">{item.title}</span>
              <span className="showcase-thumb-arrow">→</span>
            </Motion.button>
          ))}
        </div>
      </div>

      {/* Expanded: Full overlay carousel - rendered via portal */}
      {createPortal(
        <AnimatePresence>
          {isExpanded && (
            <Motion.div 
              className="showcase-sidenav-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onWheel={handleWheel}
            >
            {/* Close button */}
            <button 
              className="showcase-sidenav-close"
              onClick={handleCollapse}
              aria-label="Close gallery"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Close</span>
            </button>

            {/* Arrow Navigation */}
            <button 
              className="showcase-sidenav-arrow showcase-sidenav-arrow--prev"
              onClick={() => navigatePanel(-1)}
              aria-label="Previous project"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button 
              className="showcase-sidenav-arrow showcase-sidenav-arrow--next"
              onClick={() => navigatePanel(1)}
              aria-label="Next project"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Horizontal track */}
            <Motion.div 
              className="showcase-sidenav-track"
              animate={{ x: `${-activeIndex * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            >
              {showcaseItems.map((item, idx) => (
                <Panel 
                  key={item.id} 
                  item={item} 
                  index={idx}
                  isActive={idx === activeIndex}
                  onClose={handleCollapse}
                />
              ))}
            </Motion.div>

            {/* Navigation */}
            <nav className="showcase-sidenav-nav" aria-label="Project navigation">
              <div className="showcase-sidenav-progress">
                <span style={{ width: `${((activeIndex + 1) / count) * 100}%` }} />
              </div>
              <div className="showcase-sidenav-dots">
                {showcaseItems.map((item, idx) => (
                  <button
                    key={item.id}
                    className={idx === activeIndex ? 'is-active' : ''}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Go to ${item.title}`}
                    style={{ '--dot-color': item.color }}
                  />
                ))}
              </div>
              <div className="showcase-sidenav-counter">
                <span className="current">{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="divider">/</span>
                <span className="total">{String(count).padStart(2, '0')}</span>
              </div>
            </nav>
          </Motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  )
}

function Panel({ item, index, isActive, onClose }) {
  return (
    <Motion.article 
      className={`showcase-panel ${isActive ? 'is-active' : ''}`}
      style={{ background: item.color }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="showcase-panel-inner">
        <header className="showcase-panel-header">
          <span className="showcase-panel-index">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="showcase-panel-year">{item.year}</span>
          <h2 className="showcase-panel-title">{item.title}</h2>
          <p className="showcase-panel-desc">{item.description}</p>
          
          {item.categories && (
            <ul className="showcase-panel-tags">
              {item.categories.map(cat => (
                <li key={cat}>{cat}</li>
              ))}
            </ul>
          )}
        </header>

        {isActive && item.details && (
          <Motion.div 
            className="showcase-panel-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="showcase-panel-scope">
              <h4>Scope</h4>
              <p>{item.details.scope}</p>
            </div>

            <div className="showcase-panel-tech">
              <h4>Technologies</h4>
              <div className="tech-tags">
                {item.details.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>

            <div className="showcase-panel-features">
              <h4>Key Features</h4>
              <ul>
                {item.details.features.slice(0, 3).map((feature, i) => (
                  <Motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    {feature}
                  </Motion.li>
                ))}
              </ul>
            </div>

            <div className="showcase-panel-outcome">
              <h4>Outcome</h4>
              <p>{item.details.outcome}</p>
            </div>
          </Motion.div>
        )}

        <footer className="showcase-panel-footer">
          <Link to={`/projects/${item.id}`} className="showcase-panel-cta" onClick={onClose}>
            View Full Project
            <span>→</span>
          </Link>
        </footer>
      </div>
    </Motion.article>
  )
}
