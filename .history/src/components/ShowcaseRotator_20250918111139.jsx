import React, { useEffect, useState } from 'react'
import '../styles/showcase.css'
import '../styles/showcase-modal.css'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'

export default function ShowcaseRotator({ onIndexChange }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [expandedIndex, setExpandedIndex] = useState(null)

  useEffect(() => {
    if (showcaseItems.length && onIndexChange) onIndexChange(0, showcaseItems[0])
    if (showcaseItems.length) {
      const root = document.documentElement
      root.style.setProperty('--accent-color', showcaseItems[0].color || '#d77f2b')
    }
  }, [onIndexChange])

  // Handle escape key to close expanded card
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && expandedIndex !== null) {
        setExpandedIndex(null)
      }
    }
    if (expandedIndex !== null) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [expandedIndex])

  if (!showcaseItems.length) return <div className="showcase-rotator">No items available</div>

  return (
    <>
      <div className="showcase-rotator showcase-flow" aria-roledescription="showcase list" tabIndex={0}>
        <div className="showcase-flow-cards">
          {showcaseItems.map((item, idx) => {
            const hovered = hoveredIndex === idx
            const expanded = expandedIndex === idx
            return (
              <Motion.div
                key={item.id}
                layout
                className={`showcase-card-wrapper flow-item ${hovered ? 'showcase-card-wrapper--hovered' : ''}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setExpandedIndex(idx)}
                initial={{ opacity: 0, y: 26, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: hovered ? 1.035 : 1 }}
                transition={{ delay: 0.06 * idx, duration: 0.6, ease: [0.4,0,0.2,1] }}
              >
                <Motion.div layout className={`showcase-card flow-card ${hovered ? 'showcase-card--hovered' : ''}`} style={{ background: item.color }} aria-label={`${item.title} ${item.year}`}>
                  <div className="showcase-meta">
                    <span className="showcase-year">{item.year}</span>
                    <h3 className="showcase-title">{item.title}</h3>
                    <p className="showcase-desc">{item.description}</p>
                  </div>
                  <AnimatePresence initial={false}>
                    {hovered && !expanded && item.details && (
                      <Motion.div
                        className="showcase-details floating-details"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 14 }}
                        transition={{ duration: 0.35 }}
                      >
                        <div className="showcase-scroll-content">
                          <div className="showcase-detail-section">
                            <h4>Scope</h4>
                            <p>{item.details.scope}</p>
                          </div>
                          <div className="showcase-detail-section">
                            <h4>Technologies</h4>
                            <div className="showcase-tags">
                              {item.details.technologies.map((tech, i) => (
                                <span key={i} className="showcase-tag">{tech}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </Motion.div>
              </Motion.div>
            )
          })}
        </div>
      </div>

      {/* Full-screen expanded overlay */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <Motion.div
            className="showcase-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setExpandedIndex(null)}
          >
            <Motion.div
              className="showcase-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4,0,0.2,1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: showcaseItems[expandedIndex].color }}
            >
              <button 
                className="showcase-close"
                onClick={() => setExpandedIndex(null)}
                aria-label="Close project details"
              >
                ×
              </button>
              
              <div className="showcase-modal-content">
                <div className="showcase-modal-header">
                  <span className="showcase-year">{showcaseItems[expandedIndex].year}</span>
                  <h2 className="showcase-title">{showcaseItems[expandedIndex].title}</h2>
                  <p className="showcase-desc">{showcaseItems[expandedIndex].description}</p>
                </div>
                
                {showcaseItems[expandedIndex].details && (
                  <div className="showcase-modal-details">
                    <div className="showcase-detail-section">
                      <h3>Scope</h3>
                      <p>{showcaseItems[expandedIndex].details.scope}</p>
                    </div>
                    <div className="showcase-detail-section">
                      <h3>Technologies</h3>
                      <div className="showcase-tags">
                        {showcaseItems[expandedIndex].details.technologies.map((tech, i) => (
                          <span key={i} className="showcase-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <div className="showcase-detail-section">
                      <h3>Key Features</h3>
                      <ul className="showcase-features">
                        {showcaseItems[expandedIndex].details.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="showcase-detail-section">
                      <h3>Outcome</h3>
                      <p>{showcaseItems[expandedIndex].details.outcome}</p>
                    </div>
                  </div>
                )}
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
