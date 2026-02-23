import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion as Motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { showcaseItems } from '../data/showcaseItems'
import '../styles/showcase-sidenav.css'

/**
 * ShowcaseSideNav
 * - Cards displayed as compact thumbnails on the side
 * - Click expands into full horizontal carousel view
 * - Vertical scroll drives horizontal translation (like HorizontalScrollAreas)
 */
export default function ShowcaseSideNav({ onIndexChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const count = showcaseItems.length

  // Horizontal scroll driven by vertical scroll (when expanded)
  const { scrollYProgress } = useScroll({ 
    target: wrapperRef, 
    offset: ['start start', 'end end'] 
  })
  const rawX = useTransform(scrollYProgress, [0, 1], ['0%', `${-(count - 1) * 80}%`])
  const x = useSpring(rawX, { stiffness: 120, damping: 28, mass: 0.4 })

  // Track active panel based on scroll
  useEffect(() => {
    if (!isExpanded) return
    return scrollYProgress.on('change', v => {
      const idx = Math.round(v * (count - 1))
      setActiveIndex(idx)
      if (onIndexChange && showcaseItems[idx]) {
        onIndexChange(idx, showcaseItems[idx])
      }
    })
  }, [scrollYProgress, count, isExpanded, onIndexChange])

  // Update accent color
  useEffect(() => {
    if (showcaseItems[activeIndex]) {
      document.documentElement.style.setProperty(
        '--accent-color', 
        showcaseItems[activeIndex].color || '#d77f2b'
      )
    }
  }, [activeIndex])

  // Lock body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      // When expanding, scroll the wrapper into view
      wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isExpanded])

  const handleExpand = (index) => {
    setActiveIndex(index)
    setIsExpanded(true)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
  }

  const handleDotClick = useCallback((i) => {
    const el = wrapperRef.current
    if (!el) return
    const track = trackRef.current
    if (track) track.style.pointerEvents = 'none'
    const totalScrollable = el.offsetHeight - window.innerHeight
    const target = el.offsetTop + (totalScrollable * (i / (count - 1)))
    window.scrollTo({ top: target, behavior: 'smooth' })
    setTimeout(() => { if (track) track.style.pointerEvents = '' }, 800)
  }, [count])

  // Keyboard navigation when expanded
  useEffect(() => {
    if (!isExpanded) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        handleCollapse()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleDotClick(Math.min(count - 1, activeIndex + 1))
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleDotClick(Math.max(0, activeIndex - 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isExpanded, activeIndex, count, handleDotClick])

  if (!showcaseItems.length) {
    return <div className="showcase-sidenav">No items available</div>
  }

  // Collapsed: Side thumbnails
  if (!isExpanded) {
    return (
      <div className="showcase-sidenav showcase-sidenav--collapsed">
        <div className="showcase-sidenav-header">
          <h3>Selected Work</h3>
          <p>Click to explore</p>
        </div>
        
        <div className="showcase-sidenav-thumbs">
          {showcaseItems.map((item, idx) => (
            <Motion.button
              key={item.id}
              className="showcase-thumb"
              style={{ '--card-color': item.color }}
              onClick={() => handleExpand(idx)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, x: -4 }}
              aria-label={`View ${item.title}`}
            >
              <span className="showcase-thumb-index">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="showcase-thumb-title">{item.title}</span>
              <span className="showcase-thumb-arrow">→</span>
            </Motion.button>
          ))}
        </div>
      </div>
    )
  }

  // Expanded: Full horizontal carousel
  return (
    <section 
      ref={wrapperRef} 
      className="showcase-sidenav showcase-sidenav--expanded" 
      style={{ height: `${count * 100}vh` }}
      aria-label="Selected Work Gallery"
    >
      <div className="showcase-sidenav-sticky">
        {/* Close button */}
        <button 
          className="showcase-sidenav-close"
          onClick={handleCollapse}
          aria-label="Close gallery"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span>Close</span>
        </button>

        {/* Horizontal track */}
        <Motion.div ref={trackRef} className="showcase-sidenav-track" style={{ x }}>
          {showcaseItems.map((item, idx) => (
            <Panel 
              key={item.id} 
              item={item} 
              index={idx} 
              count={count} 
              active={activeIndex} 
              progress={scrollYProgress}
            />
          ))}
        </Motion.div>

        {/* Navigation */}
        <nav className="showcase-sidenav-nav" aria-label="Project navigation">
          <div className="showcase-sidenav-progress">
            <span style={{ width: `${(activeIndex / (count - 1)) * 100}%` }} />
          </div>
          <div className="showcase-sidenav-dots">
            {showcaseItems.map((item, idx) => (
              <button
                key={item.id}
                className={idx === activeIndex ? 'is-active' : ''}
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to ${item.title}`}
                style={{ '--dot-color': item.color }}
              />
            ))}
          </div>
          <div className="showcase-sidenav-counter">
            <span className="current">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="divider">/</span>
            <span className="total">{String(count).padStart(2, '0')}</span>
          </div>
        </nav>
      </div>
    </section>
  )
}

function Panel({ item, index, count, active, progress }) {
  const start = (index - 0.5) / (count - 1)
  const end = (index + 0.5) / (count - 1)
  const clampedStart = Math.max(0, start)
  const clampedEnd = Math.min(1, end)
  const local = useTransform(progress, [clampedStart, clampedEnd], [0, 1])
  const scale = useTransform(local, [0, 1], [0.88, 1])
  const opacity = useTransform(local, [0, 1], [0.4, 1])
  const isActive = index === active

  return (
    <Motion.article 
      className={`showcase-panel ${isActive ? 'is-active' : ''}`}
      style={{ 
        background: item.color, 
        scale, 
        opacity 
      }}
      data-active={isActive ? 'true' : 'false'}
    >
      <div className="showcase-panel-inner">
        <header className="showcase-panel-header">
          <span className="showcase-panel-index">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="showcase-panel-year">{item.year}</span>
          <h2 className="showcase-panel-title">{item.title}</h2>
          <p className="showcase-panel-desc">{item.description}</p>
          
          {item.categories && (
            <ul className="showcase-panel-tags">
              {item.categories.map(cat => (
                <li key={cat}>{cat}</li>
              ))}
            </ul>
          )}
        </header>

        {isActive && item.details && (
          <Motion.div 
            className="showcase-panel-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="showcase-panel-scope">
              <h4>Scope</h4>
              <p>{item.details.scope}</p>
            </div>

            <div className="showcase-panel-tech">
              <h4>Technologies</h4>
              <div className="tech-tags">
                {item.details.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>

            <div className="showcase-panel-features">
              <h4>Key Features</h4>
              <ul>
                {item.details.features.slice(0, 3).map((feature, i) => (
                  <Motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    {feature}
                  </Motion.li>
                ))}
              </ul>
            </div>

            <div className="showcase-panel-outcome">
              <h4>Outcome</h4>
              <p>{item.details.outcome}</p>
            </div>
          </Motion.div>
        )}

        <footer className="showcase-panel-footer">
          <a href={`/projects#${item.id}`} className="showcase-panel-cta">
            View Full Project
            <span>→</span>
          </a>
        </footer>
      </div>
    </Motion.article>
  )
}
