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

  useEffect(() => {
    const item = filteredItems[index]
    if (onIndexChange) onIndexChange(index, item)
    const root = document.documentElement
    root.style.setProperty('--accent-color', item.color)
  }, [index, onIndexChange, filteredItems])

  if (filteredItems.length === 0) {
    return <div className="showcase-rotator">No items to display</div>
  }

  return (
    <div className="showcase-rotator" aria-roledescription="vertical scroll showcase" tabIndex={0}>
      <div className="showcase-viewport showcase-viewport--vertical">
        <div className="showcase-cards-container">
          {filteredItems.map((item, cardIndex) => (
            <div
              key={item.id}
              className={`showcase-card-wrapper ${hoveredCardIndex === cardIndex ? 'showcase-card-wrapper--hovered' : ''}`}
              onMouseEnter={() => handleCardHover(cardIndex, true)}
              onMouseLeave={() => handleCardHover(cardIndex, false)}
            >
              <Motion.div
                className={`showcase-card ${hoveredCardIndex === cardIndex ? 'showcase-card--hovered' : ''}`}
                style={{ background: item.color }}
                initial={{ opacity: 0.8, scale: 0.95 }}
                animate={{ 
                  opacity: hoveredCardIndex === cardIndex ? 1 : 0.8,
                  scale: hoveredCardIndex === cardIndex ? 1.05 : 0.95,
                  y: hoveredCardIndex === cardIndex ? -10 : 0
                }}
                transition={{ duration: 0.4, ease: [0.4,0,0.2,1] }}
                aria-label={`${item.title} ${item.year}`}
              >
                <div className="showcase-meta">
                  <span className="showcase-year">{item.year}</span>
                  <h3 className="showcase-title">{item.title}</h3>
                  <p className="showcase-desc">{item.description}</p>
                </div>
                
                {/* Scrollable content area that appears on hover */}
                <Motion.div 
                  className="showcase-details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: hoveredCardIndex === cardIndex ? 1 : 0, 
                    y: hoveredCardIndex === cardIndex ? 0 : 20,
                    height: hoveredCardIndex === cardIndex ? 'auto' : 0
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {item.details && (
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
                  )}
                </Motion.div>
              </Motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
