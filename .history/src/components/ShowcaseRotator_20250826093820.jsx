import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'

const INTERVAL = 5000

export default function ShowcaseRotator({ onIndexChange }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const timerRef = useRef(null)

  const next = useCallback(() => setIndex(i => (i + 1) % showcaseItems.length), [])
  const prev = useCallback(() => setIndex(i => (i - 1 + showcaseItems.length) % showcaseItems.length), [])

  useEffect(() => {
    if (reduced || paused) return
    timerRef.current = setTimeout(next, INTERVAL)
    return () => clearTimeout(timerRef.current)
  }, [index, paused, reduced, next])

  // Accent / ambient color sync
  useEffect(() => {
    const item = showcaseItems[index]
    if (onIndexChange) onIndexChange(index, item)
    const root = document.documentElement
    root.style.setProperty('--accent-color', item.color)
  }, [index, onIndexChange])

  const item = showcaseItems[index]

  return (
    <div className="showcase-rotator" aria-roledescription="carousel">
      <div
        className="showcase-viewport"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <Motion.div
            key={item.id}
            className="showcase-card"
            style={{ background: item.color }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.6, ease: [0.4,0,0.2,1] }}
            aria-label={`${item.title} ${item.year}`}
          >
            <div className="showcase-meta">
              <span className="showcase-year">{item.year}</span>
              <h3 className="showcase-title">{item.title}</h3>
              <p className="showcase-desc">{item.description}</p>
            </div>
          </Motion.div>
        </AnimatePresence>
      </div>
      <div className="showcase-controls" role="group" aria-label="Showcase navigation">
        <button onClick={prev} aria-label="Previous item" className="showcase-btn" type="button">◄</button>
        <div className="showcase-dots" role="tablist">
          {showcaseItems.map((it, i) => (
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
      </div>
    </div>
  )
}
