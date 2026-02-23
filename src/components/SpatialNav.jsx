import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import '../styles/spatial-nav.css'

/**
 * SpatialNav — Dual-Axis Exploration Navigation
 * 
 * Breaks the traditional linear navigation model with a 2D spatial interface:
 * - Horizontal axis: Design ↔ Tech spectrum
 * - Vertical axis: Explore deeper into content
 * 
 * Features:
 * - Floating compass showing current position
 * - Gesture/keyboard controls for spatial movement
 * - Visual map of the portfolio space
 * - Context-aware navigation suggestions
 */

// Define the spatial map of the portfolio
const SPATIAL_MAP = {
  // Format: { x: Design(-1) to Tech(1), y: depth (0=surface, 1=deep) }
  home: { x: 0, y: 0, label: 'Home', icon: '◈' },
  
  // Design axis (negative x)
  'projects/studio-identity': { x: -0.8, y: 0.5, label: 'Studio Identity', icon: '◇', category: 'design' },
  'projects/packaging-design': { x: -0.6, y: 0.6, label: 'Packaging', icon: '◇', category: 'design' },
  about: { x: -0.3, y: 0.3, label: 'About', icon: '○', category: 'design' },
  
  // Tech axis (positive x)
  'projects/immersive-commerce': { x: 0.5, y: 0.5, label: 'Immersive Commerce', icon: '◆', category: 'tech' },
  'projects/interactive-installation': { x: 0.7, y: 0.6, label: 'Interactive Install', icon: '◆', category: 'tech' },
  expertise: { x: 0.4, y: 0.4, label: 'Expertise', icon: '□', category: 'tech' },
  
  // Neutral/Both
  projects: { x: 0, y: 0.4, label: 'All Work', icon: '◈' },
  contact: { x: 0, y: 0.8, label: 'Contact', icon: '●' },
}

// Navigation suggestions based on current identity
const NAV_SUGGESTIONS = {
  tech: [
    { path: '/expertise', label: 'See My Stack', icon: '→' },
    { path: '/projects', label: 'View Projects', icon: '↓' },
  ],
  design: [
    { path: '/about', label: 'My Story', icon: '→' },
    { path: '/projects', label: 'View Work', icon: '↓' },
  ],
}

export default function SpatialNav({ currentIdentity = 'tech' }) {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const navRef = useRef(null)
  
  // Get current position in spatial map
  const currentPath = location.pathname.replace(/^\//, '') || 'home'
  const currentPosition = SPATIAL_MAP[currentPath] || SPATIAL_MAP.home
  
  // Calculate compass rotation based on identity
  const compassRotation = currentIdentity === 'design' ? -45 : 45

  // Track cursor for interactive compass
  const handleMouseMove = useCallback((e) => {
    if (!navRef.current) return
    const rect = navRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setCursorPos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) })
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + Arrow keys for spatial navigation
      if (e.altKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault()
            // Navigate toward Design
            if (currentIdentity !== 'design') {
              document.body.classList.remove('identity-tech')
              document.body.classList.add('identity-design')
            }
            break
          case 'ArrowRight':
            e.preventDefault()
            // Navigate toward Tech
            if (currentIdentity !== 'tech') {
              document.body.classList.remove('identity-design')
              document.body.classList.add('identity-tech')
            }
            break
          case 'ArrowDown':
            e.preventDefault()
            // Go deeper - show suggestions
            setIsExpanded(true)
            break
          case 'ArrowUp':
            e.preventDefault()
            // Go to surface - home
            window.location.href = '/'
            break
        }
      }
      
      // M key toggles map
      if (e.key === 'm' || e.key === 'M') {
        if (e.target === document.body) {
          setShowMap(prev => !prev)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIdentity])

  const suggestions = NAV_SUGGESTIONS[currentIdentity] || NAV_SUGGESTIONS.tech

  return (
    <>
      {/* Floating Compass Navigation */}
      <Motion.nav
        ref={navRef}
        className={`spatial-nav spatial-nav--${currentIdentity}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => { setIsExpanded(false); setCursorPos({ x: 0, y: 0 }); }}
        data-cursor="discover"
      >
        {/* Compass Ring */}
        <div className="spatial-nav__compass">
          <Motion.div 
            className="spatial-nav__compass-ring"
            animate={{ rotate: compassRotation }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            <span className="spatial-nav__compass-label spatial-nav__compass-label--design">Design</span>
            <span className="spatial-nav__compass-label spatial-nav__compass-label--tech">Tech</span>
          </Motion.div>
          
          {/* Compass Needle */}
          <Motion.div 
            className="spatial-nav__needle"
            animate={{ 
              rotate: cursorPos.x * 30 + compassRotation,
              scale: isExpanded ? 1.1 : 1
            }}
          />
          
          {/* Center Dot */}
          <div className="spatial-nav__center">
            <span>{currentPosition.icon}</span>
          </div>
        </div>

        {/* Expanded Navigation */}
        <AnimatePresence>
          {isExpanded && (
            <Motion.div
              className="spatial-nav__expanded"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Current Location */}
              <div className="spatial-nav__location">
                <span className="spatial-nav__location-icon">{currentPosition.icon}</span>
                <span className="spatial-nav__location-label">{currentPosition.label}</span>
              </div>

              {/* Axis Indicators */}
              <div className="spatial-nav__axes">
                <div className="spatial-nav__axis spatial-nav__axis--x">
                  <span className="spatial-nav__axis-label">← Design</span>
                  <div className="spatial-nav__axis-track">
                    <Motion.div 
                      className="spatial-nav__axis-marker"
                      animate={{ left: `${(currentPosition.x + 1) * 50}%` }}
                    />
                  </div>
                  <span className="spatial-nav__axis-label">Tech →</span>
                </div>
                <div className="spatial-nav__axis spatial-nav__axis--y">
                  <span className="spatial-nav__axis-label">Surface</span>
                  <div className="spatial-nav__axis-track spatial-nav__axis-track--vertical">
                    <Motion.div 
                      className="spatial-nav__axis-marker"
                      animate={{ top: `${currentPosition.y * 100}%` }}
                    />
                  </div>
                  <span className="spatial-nav__axis-label">Deep</span>
                </div>
              </div>

              {/* Quick Navigation */}
              <div className="spatial-nav__suggestions">
                {suggestions.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="spatial-nav__suggestion"
                    data-cursor="click"
                  >
                    <span>{item.label}</span>
                    <span className="spatial-nav__suggestion-icon">{item.icon}</span>
                  </Link>
                ))}
              </div>

              {/* Map Toggle */}
              <button 
                className="spatial-nav__map-toggle"
                onClick={() => setShowMap(true)}
                data-cursor="expand"
              >
                <span>View Map</span>
                <span className="spatial-nav__map-key">M</span>
              </button>
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.nav>

      {/* Full Spatial Map Overlay */}
      <AnimatePresence>
        {showMap && (
          <Motion.div
            className="spatial-map-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMap(false)}
          >
            <Motion.div
              className="spatial-map"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="spatial-map__header">
                <h2 className="spatial-map__title">Portfolio Space</h2>
                <p className="spatial-map__subtitle">Navigate between Design & Tech worlds</p>
                <button 
                  className="spatial-map__close"
                  onClick={() => setShowMap(false)}
                  aria-label="Close map"
                >
                  ✕
                </button>
              </div>

              <div className="spatial-map__canvas">
                {/* Axis Lines */}
                <div className="spatial-map__axis-x" />
                <div className="spatial-map__axis-y" />
                
                {/* Axis Labels */}
                <span className="spatial-map__label spatial-map__label--design">Design</span>
                <span className="spatial-map__label spatial-map__label--tech">Tech</span>
                <span className="spatial-map__label spatial-map__label--surface">Surface</span>
                <span className="spatial-map__label spatial-map__label--deep">Deep</span>

                {/* Map Points */}
                {Object.entries(SPATIAL_MAP).map(([path, data]) => {
                  const isActive = path === currentPath
                  const left = `${(data.x + 1) * 50}%`
                  const top = `${data.y * 100}%`
                  
                  return (
                    <Link
                      key={path}
                      to={path === 'home' ? '/' : `/${path}`}
                      className={`spatial-map__point ${isActive ? 'is-active' : ''} ${data.category ? `spatial-map__point--${data.category}` : ''}`}
                      style={{ left, top }}
                      onClick={() => setShowMap(false)}
                      data-cursor="click"
                    >
                      <span className="spatial-map__point-icon">{data.icon}</span>
                      <span className="spatial-map__point-label">{data.label}</span>
                    </Link>
                  )
                })}
              </div>

              <div className="spatial-map__footer">
                <div className="spatial-map__hint">
                  <span className="spatial-map__hint-key">Alt</span>
                  <span>+</span>
                  <span className="spatial-map__hint-key">←→↑↓</span>
                  <span>to navigate spatially</span>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
