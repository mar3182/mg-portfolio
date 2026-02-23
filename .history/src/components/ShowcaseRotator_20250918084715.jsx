import React, { useEffect, useState } from 'react'
import '../styles/showcase.css'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'

const INTERVAL = 5000

export default function ShowcaseRotator({ onIndexChange, activeFocus }) {
  const filteredItems = activeFocus ? showcaseItems.filter(it=>it.categories?.includes(activeFocus)) : showcaseItems
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null)

  useEffect(() => {
    const firstItem = filteredItems[0]
    if (onIndexChange && firstItem) onIndexChange(0, firstItem)
    const root = document.documentElement
    root.style.setProperty('--accent-color', firstItem?.color || '#d77f2b')
  }, [onIndexChange, filteredItems])

  const handleCardHover = (cardIndex, hovering) => {
    setHoveredCardIndex(hovering ? cardIndex : null)
    
    // Trigger hero title stacking effect
    if (hovering) {
      document.body.classList.add('showcase-card-hovered')
      document.body.setAttribute('data-hovered-card', cardIndex)
    } else {
      document.body.classList.remove('showcase-card-hovered')
      document.body.removeAttribute('data-hovered-card')
    }
  }

  if (filteredItems.length === 0) {
    return <div className="showcase-rotator">No items to display</div>
  }

  return (
    <div className="showcase-rotator showcase-flow" aria-roledescription="showcase list" tabIndex={0}>
      <div className="showcase-flow-cards">
        {filteredItems.map((item, cardIndex) => {
          const isHovered = hoveredCardIndex === cardIndex
          return (
            <Motion.div
              key={item.id}
              className={`showcase-card-wrapper flow-item ${isHovered ? 'showcase-card-wrapper--hovered' : ''}`}
              onMouseEnter={() => handleCardHover(cardIndex, true)}
              onMouseLeave={() => handleCardHover(cardIndex, false)}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: isHovered ? 1.03 : 1 }}
              transition={{ delay: 0.05 * cardIndex, duration: 0.6, ease: [0.4,0,0.2,1] }}
            >
              <div className={`showcase-card flow-card ${isHovered ? 'showcase-card--hovered' : ''}`} style={{ background: item.color }} aria-label={`${item.title} ${item.year}`}>
                <div className="showcase-meta">
                  <span className="showcase-year">{item.year}</span>
                  <h3 className="showcase-title">{item.title}</h3>
                  <p className="showcase-desc">{item.description}</p>
                </div>
                <AnimatePresence>
                {isHovered && item.details && (
                  <Motion.div
                    className="showcase-details floating-details"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
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
