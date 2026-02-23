import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'
import '../styles/showcase-3d.css'

/**
 * 3D Stacked Carousel for Selected Work
 * Cards are stacked with a 3D perspective and expand to center on click
 */
export default function ShowcaseCarousel3D({ onIndexChange }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef(null)

  // Notify parent of active card change
  useEffect(() => {
    if (onIndexChange && showcaseItems[activeIndex]) {
      onIndexChange(activeIndex, showcaseItems[activeIndex])
    }
    // Update CSS custom property for ambient color
    if (showcaseItems[activeIndex]) {
      document.documentElement.style.setProperty(
        '--accent-color', 
        showcaseItems[activeIndex].color || '#d77f2b'
      )
    }
  }, [activeIndex, onIndexChange])

  // Navigate function (defined before useEffect that uses it)
  const navigateStack = useCallback((direction) => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex(prev => {
      const newIndex = prev + direction
      if (newIndex < 0) return showcaseItems.length - 1
      if (newIndex >= showcaseItems.length) return 0
      return newIndex
    })
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  const closeExpanded = () => {
    setExpandedIndex(null)
  }

  // Handle escape to close expanded card
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && expandedIndex !== null) {
        closeExpanded()
      }
      // Arrow keys to navigate when not expanded
      if (expandedIndex === null && !isAnimating) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          navigateStack(-1)
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          navigateStack(1)
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [expandedIndex, isAnimating, navigateStack])

  // Lock body scroll when expanded
  useEffect(() => {
    if (expandedIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [expandedIndex])

  const handleCardClick = (index) => {
    if (isAnimating) return
    if (index === activeIndex) {
      // Click on active card - expand it
      setExpandedIndex(index)
    } else {
      // Click on another card - bring it to front
      setIsAnimating(true)
      setActiveIndex(index)
      setTimeout(() => setIsAnimating(false), 500)
    }
  }

  const closeExpanded = () => {
    setExpandedIndex(null)
  }

  // Calculate 3D transform for each card in the stack
  const getCardStyle = (index) => {
    const diff = index - activeIndex
    
    // Cards behind the active one
    if (diff < 0) {
      return {
        transform: `
          translateZ(${diff * 60}px) 
          translateY(${diff * 25}px) 
          scale(${1 + diff * 0.05})
        `,
        opacity: Math.max(0.3, 1 + diff * 0.2),
        zIndex: showcaseItems.length + diff,
      }
    }
    
    // Active card (front)
    if (diff === 0) {
      return {
        transform: 'translateZ(0) translateY(0) scale(1)',
        opacity: 1,
        zIndex: showcaseItems.length,
      }
    }
    
    // Cards in front (below active in visual stack)
    return {
      transform: `
        translateZ(${-diff * 60}px) 
        translateY(${diff * 30}px) 
        scale(${1 - diff * 0.05})
      `,
      opacity: Math.max(0.2, 1 - diff * 0.3),
      zIndex: showcaseItems.length - diff,
    }
  }

  if (!showcaseItems.length) {
    return <div className="showcase-3d">No items available</div>
  }

  return (
    <>
      <div className="showcase-3d" ref={containerRef}>
        <div className="showcase-3d-stage">
          {/* Navigation hint */}
          <div className="showcase-3d-hint">
            <span>Click to expand • Scroll to browse</span>
          </div>

          {/* 3D Card Stack */}
          <div 
            className="showcase-3d-stack"
            onWheel={(e) => {
              e.preventDefault()
              if (expandedIndex === null) {
                navigateStack(e.deltaY > 0 ? 1 : -1)
              }
            }}
          >
            {showcaseItems.map((item, idx) => {
              const style = getCardStyle(idx)
              const isActive = idx === activeIndex
              
              return (
                <Motion.div
                  key={item.id}
                  className={`showcase-3d-card ${isActive ? 'is-active' : ''}`}
                  style={{
                    background: item.color,
                    zIndex: style.zIndex,
                  }}
                  initial={false}
                  animate={{
                    transform: style.transform,
                    opacity: style.opacity,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  onClick={() => handleCardClick(idx)}
                  whileHover={isActive ? { scale: 1.02 } : {}}
                  layoutId={`card-${item.id}`}
                >
                  <div className="showcase-3d-content">
                    <span className="showcase-3d-year">{item.year}</span>
                    <h3 className="showcase-3d-title">{item.title}</h3>
                    <p className="showcase-3d-desc">{item.description}</p>
                    
                    {isActive && (
                      <Motion.div 
                        className="showcase-3d-cta"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span>Click to explore →</span>
                      </Motion.div>
                    )}
                  </div>
                  
                  {/* Card index indicator */}
                  <div className="showcase-3d-index">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </Motion.div>
              )
            })}
          </div>

          {/* Navigation dots */}
          <div className="showcase-3d-nav">
            {showcaseItems.map((item, idx) => (
              <button
                key={item.id}
                className={`showcase-3d-dot ${idx === activeIndex ? 'is-active' : ''}`}
                onClick={() => handleCardClick(idx)}
                aria-label={`Go to ${item.title}`}
                style={{ 
                  '--dot-color': item.color 
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="showcase-3d-counter">
            <span className="current">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="divider">/</span>
            <span className="total">{String(showcaseItems.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <Motion.div
            className="showcase-3d-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeExpanded}
          >
            <Motion.div
              className="showcase-3d-expanded"
              layoutId={`card-${showcaseItems[expandedIndex].id}`}
              style={{ background: showcaseItems[expandedIndex].color }}
              onClick={(e) => e.stopPropagation()}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 30,
              }}
            >
              <button 
                className="showcase-3d-close"
                onClick={closeExpanded}
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="showcase-3d-expanded-content">
                <div className="showcase-3d-expanded-header">
                  <span className="showcase-3d-year">{showcaseItems[expandedIndex].year}</span>
                  <h2 className="showcase-3d-expanded-title">{showcaseItems[expandedIndex].title}</h2>
                  <p className="showcase-3d-expanded-desc">{showcaseItems[expandedIndex].description}</p>
                </div>

                {showcaseItems[expandedIndex].details && (
                  <Motion.div 
                    className="showcase-3d-expanded-details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="detail-grid">
                      <div className="detail-section">
                        <h4>Scope</h4>
                        <p>{showcaseItems[expandedIndex].details.scope}</p>
                      </div>
                      
                      <div className="detail-section">
                        <h4>Technologies</h4>
                        <div className="tech-tags">
                          {showcaseItems[expandedIndex].details.technologies.map((tech, i) => (
                            <span key={i} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="detail-section full-width">
                        <h4>Key Features</h4>
                        <ul className="feature-list">
                          {showcaseItems[expandedIndex].details.features.map((feature, i) => (
                            <Motion.li 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + i * 0.05 }}
                            >
                              {feature}
                            </Motion.li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="detail-section full-width">
                        <h4>Outcome</h4>
                        <p className="outcome">{showcaseItems[expandedIndex].details.outcome}</p>
                      </div>
                    </div>
                  </Motion.div>
                )}

                <div className="showcase-3d-expanded-footer">
                  <button 
                    className="view-project-btn"
                    onClick={() => {
                      closeExpanded()
                      // Navigate to project if needed
                    }}
                  >
                    View Full Project
                    <span>→</span>
                  </button>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
