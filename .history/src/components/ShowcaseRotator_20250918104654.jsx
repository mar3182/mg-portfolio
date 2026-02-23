import React, { useEffect, useState } from 'react'
import '../styles/showcase.css'
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

  if (!showcaseItems.length) return <div className="showcase-rotator">No items available</div>

  return (
    <div className="showcase-rotator showcase-flow" aria-roledescription="showcase list" tabIndex={0}>
      <div className="showcase-flow-cards">
        {showcaseItems.map((item, idx) => {
          const hovered = hoveredIndex === idx
          const expanded = expandedIndex === idx
          return (
            <Motion.div
              key={item.id}
              layout
              className={`showcase-card-wrapper flow-item ${hovered ? 'showcase-card-wrapper--hovered' : ''} ${expanded ? 'showcase-card-wrapper--expanded' : ''}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setExpandedIndex(expanded ? null : idx)}
              initial={{ opacity: 0, y: 26, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: expanded ? 1.02 : (hovered ? 1.035 : 1) }}
              transition={{ delay: 0.06 * idx, duration: 0.6, ease: [0.4,0,0.2,1] }}
            >
              <Motion.div layout className={`showcase-card flow-card ${hovered ? 'showcase-card--hovered' : ''} ${expanded ? 'showcase-card--expanded' : ''}`} style={{ background: item.color }} aria-label={`${item.title} ${item.year}`}>
                <div className="showcase-meta" data-click-hint={expanded ? 'collapse' : 'expand'}>
                  <span className="showcase-year">{item.year}</span>
                  <h3 className="showcase-title">{item.title}</h3>
                  <p className="showcase-desc">{item.description}</p>
                </div>
                <AnimatePresence initial={false}>
                  {(expanded || (hovered && !expanded)) && item.details && (
                    <Motion.div
                      key={expanded ? 'expanded' : 'hover'}
                      layout
                      className={`showcase-details ${expanded ? 'showcase-details--expanded' : 'floating-details'}`}
                      initial={expanded ? { opacity: 0, height: 0 } : { opacity: 0, y: 14 }}
                      animate={expanded ? { opacity: 1, height: 'auto' } : { opacity: 1, y: 0 }}
                      exit={expanded ? { opacity: 0, height: 0 } : { opacity: 0, y: 14 }}
                      transition={{ duration: 0.45, ease: [0.4,0,0.2,1] }}
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
              </Motion.div>
            </Motion.div>
          )
        })}
      </div>
    </div>
  )
}
