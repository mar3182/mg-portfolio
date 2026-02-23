import React, { useEffect, useState } from 'react'
import '../styles/showcase.css'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'

export default function ShowcaseRotator({ onIndexChange }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  useEffect(() => {
    if (showcaseItems.length && onIndexChange) onIndexChange(0, showcaseItems[0])
    if (showcaseItems.length) {
      const root = document.documentElement
      root.style.setProperty('--accent-color', showcaseItems[0].color || '#d77f2b')
    }
  }, [onIndexChange])

  if (!showcaseItems.length) return <div className="showcase-rotator">No items available</div>

  return (
    <div className="showcase-rotator showcase-flow" aria-roledescription="showcase list" tabIndex={0}>
      <div className="showcase-flow-cards">
        {showcaseItems.map((item, idx) => {
          const hovered = hoveredIndex === idx
          return (
            <Motion.div
              key={item.id}
              className={`showcase-card-wrapper flow-item ${hovered ? 'showcase-card-wrapper--hovered' : ''}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 26, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: hovered ? 1.035 : 1 }}
              transition={{ delay: 0.06 * idx, duration: 0.6, ease: [0.4,0,0.2,1] }}
            >
              <div className={`showcase-card flow-card ${hovered ? 'showcase-card--hovered' : ''}`} style={{ background: item.color }} aria-label={`${item.title} ${item.year}`}>
                <div className="showcase-meta">
                  <span className="showcase-year">{item.year}</span>
                  <h3 className="showcase-title">{item.title}</h3>
                  <p className="showcase-desc">{item.description}</p>
                </div>
                <AnimatePresence>
                  {hovered && item.details && (
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
                        <div className="showcase-detail-section">
                          <h4>Key Features</h4>
                          <ul className="showcase-features">
                            {item.details.features.map((feature, i) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="showcase-detail-section">
                          <h4>Outcome</h4>
                          <p>{item.details.outcome}</p>
                        </div>
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Motion.div>
          )
        })}
      </div>
    </div>
  )
}
