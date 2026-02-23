import React, { useState, useEffect } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import '../styles/expertise.css'
import { expertiseCategories } from '../data/expertise'

const listItem = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } })
}

export default function ExpertiseSection() {
  const [active, setActive] = useState(expertiseCategories[0])

  const metricsByKey = {
    fullstack: [
      { label: 'Web Apps Built', value: 50 },
      { label: 'Years Experience', value: 11 },
      { label: 'Client Projects', value: 30 }
    ],
    api: [
      { label: 'APIs Developed', value: 25 },
      { label: 'Integrations', value: 40 },
      { label: 'Microservices', value: 15 }
    ],
    ai: [
      { label: 'AI Projects', value: 8 },
      { label: 'RAG Systems', value: 3 },
      { label: 'Data Pipelines', value: 12 }
    ],
    wordpress: [
      { label: 'Custom Themes', value: 35 },
      { label: 'Plugins Created', value: 20 },
      { label: 'E-commerce Sites', value: 15 }
    ],
    blockchain: [
      { label: 'Smart Contracts', value: 12 },
      { label: 'DeFi Projects', value: 5 },
      { label: 'Web3 Apps', value: 8 }
    ]
  }

  // Enhanced CountUp with better number formatting and error handling
  function CountUp({ end, suffix = '' }) {
    const [val, setVal] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    
    useEffect(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) { 
        setVal(end)
        return 
      }
      
      setIsAnimating(true)
      let frame, start
      const dur = 1600 // Slightly longer for smoother animation
      const easeOutQuart = t => 1 - Math.pow(1 - t, 4) // Smooth easing
      
      const tick = ts => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / dur, 1)
        const easedProgress = easeOutQuart(progress)
        const currentVal = Math.round(easedProgress * end)
        setVal(currentVal)
        
        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        } else {
          setIsAnimating(false)
        }
      }
      
      frame = requestAnimationFrame(tick)
      return () => {
        if (frame) cancelAnimationFrame(frame)
        setIsAnimating(false)
      }
    }, [end])
    
    // Format large numbers with commas for readability
    const formatNumber = (num) => {
      if (num >= 1000) {
        return num.toLocaleString()
      }
      return num.toString()
    }
    
    return (
      <span className={`metric-value ${isAnimating ? 'counting' : 'complete'}`}>
        {formatNumber(val)}{suffix}
      </span>
    )
  }

  return (
    <section 
      id="expertise" 
      className="expertise-section" 
      aria-labelledby="expertise-heading"
    >
      <div className="expertise-inner">
        <div className="expertise-left">
          <h2 id="expertise-heading" className="section-title">
            Expertise
          </h2>
          <div className="expertise-list" role="tablist" aria-label="Expertise categories">
            {expertiseCategories.map((c) => {
              const isActive = c.key === active.key
              return (
                <button
                  key={c.key}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`expertise-panel-${c.key}`}
                  id={`expertise-tab-${c.key}`}
                  className={isActive ? 'expertise-tab active' : 'expertise-tab'}
                  onClick={() => setActive(c)}
                  tabIndex={isActive ? 0 : -1}
                  data-cursor="expand"
                >
                  <span className="expertise-index" aria-hidden="true">
                    0{c.id}
                  </span>
                  <span className="expertise-title">{c.title}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="expertise-right">
          <AnimatePresence mode="wait">
            <Motion.div
              key={active.key}
              id={`expertise-panel-${active.key}`}
              role="tabpanel"
              aria-labelledby={`expertise-tab-${active.key}`}
              className="expertise-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ backgroundColor: active.color }}
            >
              <div className="expertise-panel-inner">
                <Motion.ul
                  className="expertise-tags"
                  initial="hidden"
                  animate="visible"
                >
                  {active.tags.map((t, i) => (
                    <Motion.li
                      key={t}
                      className="expertise-tag"
                      variants={listItem}
                      custom={i}
                    >{t}</Motion.li>
                  ))}
                </Motion.ul>
                <p className="expertise-blurb">{active.blurb}</p>
                <ul className="expertise-metrics" aria-label="Key metrics">
                  {metricsByKey[active.key].map(m => {
                    // Determine suffix based on metric type
                    const getSuffix = (label) => {
                      if (label.includes('%')) return '%'
                      if (label.includes('Score')) return '/100'
                      if (label.includes('KB') || label.includes('Reduction')) return ''
                      return '+'
                    }
                    
                    return (
                      <li key={m.label} className="metric">
                        <span className="metric-number">
                          <CountUp end={m.value} suffix={getSuffix(m.label)} />
                        </span>
                        <span className="metric-label">{m.label}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </Motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
