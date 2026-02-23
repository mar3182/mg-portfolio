import React, { useEffect, useState } from 'react'
import '../styles/showcase.css'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'

export default function ShowcaseRotator({ onIndexChange }) {
  const item = showcaseItems[0]
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (item && onIndexChange) onIndexChange(0, item)
    const root = document.documentElement
    root.style.setProperty('--accent-color', item?.color || '#d77f2b')
  }, [onIndexChange])

  if (!item) return <div className="showcase-rotator">No item available</div>

  return (
    <div className="showcase-rotator single-card" aria-roledescription="showcase" tabIndex={0}>
      <Motion.div
        className={`showcase-card-wrapper flow-item ${hovered ? 'showcase-card-wrapper--hovered' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ opacity: 0, y: 28, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: hovered ? 1.025 : 1 }}
        transition={{ duration: 0.65, ease: [0.4,0,0.2,1] }}
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
    </div>
  )
}
