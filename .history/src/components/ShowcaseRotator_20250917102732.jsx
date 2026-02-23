import React, { useEffect, useState, useRef, useCallback } from 'react'
import '../styles/showcase.css'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'

const INTERVAL = 5000

export default function ShowcaseRotator({ onIndexChange, activeFocus }) {
  const filteredItems = activeFocus ? showcaseItems.filter(it=>it.categories?.includes(activeFocus)) : showcaseItems
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const timerRef = useRef(null)

  const next = useCallback(() => setIndex(i => (i + 1) % filteredItems.length), [filteredItems.length])
  const prev = useCallback(() => setIndex(i => (i - 1 + filteredItems.length) % filteredItems.length), [filteredItems.length])

  useEffect(() => {
    if (reduced || paused) return
    timerRef.current = setTimeout(next, INTERVAL)
    return () => clearTimeout(timerRef.current)
  }, [index, paused, reduced, next])

  // Pause when document/tab hidden to save work
  useEffect(() => {
    function onVis() {
      if (document.hidden) setPaused(true)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Accent / ambient color sync
  useEffect(() => { setIndex(0) }, [activeFocus])

  const handleCardHover = (hovering) => {
    setIsHovered(hovering)
    setPaused(hovering)
  }

  useEffect(() => {
    const item = filteredItems[index]
    if (onIndexChange) onIndexChange(index, item)
    const root = document.documentElement
    root.style.setProperty('--accent-color', item.color)
  }, [index, onIndexChange, filteredItems])

  const item = filteredItems[index]
  const announce = `${item.title} ${index+1} of ${filteredItems.length}`

  return (
  <div className="showcase-rotator" aria-roledescription="carousel" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='ArrowRight'){ next(); setPaused(true) } else if(e.key==='ArrowLeft'){ prev(); setPaused(true) } }}>
      <div
        className="showcase-viewport"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <Motion.div
            key={item.id}
            className={`showcase-card ${isHovered ? 'showcase-card--hovered' : ''}`}
            style={{ background: item.color }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.6, ease: [0.4,0,0.2,1] }}
            aria-label={`${item.title} ${item.year}`}
            onMouseEnter={() => handleCardHover(true)}
            onMouseLeave={() => handleCardHover(false)}
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
                opacity: isHovered ? 1 : 0, 
                y: isHovered ? 0 : 20,
                height: isHovered ? 'auto' : 0
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
        </AnimatePresence>
      </div>
      <div className="showcase-controls" role="group" aria-label="Showcase navigation">
        <button onClick={prev} aria-label="Previous item" className="showcase-btn" type="button">◄</button>
        <div className="showcase-dots" role="tablist">
          {filteredItems.map((it, i) => (
            <button
              key={it.id}
              className={i === index ? 'dot is-active' : 'dot'}
              aria-label={`Go to ${it.title}`}
              aria-selected={i === index}
              role="tab"
              onClick={() => setIndex(i)}
              type="button"
            />
          ))}
        </div>
        <button onClick={next} aria-label="Next item" className="showcase-btn" type="button">►</button>
        <span className="showcase-count" aria-live="off" style={{fontSize:'0.55rem', letterSpacing:'0.15em', fontWeight:600, textTransform:'uppercase', opacity:.6}}>{String(index+1).padStart(2,'0')} / {String(filteredItems.length).padStart(2,'0')}</span>
  <span className="visually-hidden" aria-live="polite">{announce}</span>
      </div>
    </div>
  )
}
