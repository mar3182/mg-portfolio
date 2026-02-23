import React, { useEffect, useState } from 'react'
import '../styles/showcase.css'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'
import TechStackChips from './TechStackChips'

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

  const item = filteredItems[0]
  const cardIndex = 0
  const isHovered = hoveredCardIndex === cardIndex

  return (
    <div className="showcase-rotator single-showcase" aria-roledescription="featured project" tabIndex={0}>
      <div className="showcase-single-layout">
        <Motion.div
          key={item.id}
          className={`showcase-card-wrapper single-wrapper ${isHovered ? 'showcase-card-wrapper--hovered' : ''}`}
          onMouseEnter={() => handleCardHover(cardIndex, true)}
          onMouseLeave={() => handleCardHover(cardIndex, false)}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: isHovered ? 1.02 : 1 }}
          transition={{ duration: 0.65, ease: [0.4,0,0.2,1] }}
        >
          <div className={`showcase-card flow-card single ${isHovered ? 'showcase-card--hovered' : ''}`} style={{ background: item.color }} aria-label={`${item.title} ${item.year}`}>
            <div className="showcase-meta">
              <span className="showcase-year">{item.year}</span>
              <h3 className="showcase-title">{item.title}</h3>
              <p className="showcase-desc">{item.description}</p>
            </div>
            <AnimatePresence>
              {isHovered && item.details && (
                <Motion.div
                  className="showcase-details floating-details"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="showcase-scroll-content">
                    <div className="showcase-detail-section">
                      <h4>Scope</h4>
                      <p>{item.details.scope}</p>
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
        <div className="tech-stack-visual" aria-label="Technology stack">
          <div className="tech-stack-heading">Stack Layers</div>
          <TechStackChips />
        </div>
      </div>
    </div>
  )
}
