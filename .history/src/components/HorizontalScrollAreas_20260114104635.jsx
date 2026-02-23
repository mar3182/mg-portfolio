import React, { useRef, useEffect, useState, useCallback } from 'react'
import '../styles/areas.css'
import { motion as Motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { expertiseCategories } from '../data/expertise'

/*
  HorizontalScrollAreas
  - Vertical scroll drives horizontal translation of expertise area panels
  - Each panel becomes vertically scrollable (overflow-y:auto) only when active (centered)
*/
export default function HorizontalScrollAreas({ initialKey }) {
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const count = expertiseCategories.length
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })
  const rawX = useTransform(scrollYProgress, [0, 1], ['0%', `${-(count - 1) * 80}%`])
  const x = useSpring(rawX, { stiffness: 120, damping: 28, mass: 0.4 })
  const [active, setActive] = useState(0)
  // Background color interpolation across panels
  const inputRange = expertiseCategories.map((_, i) => i / (count - 1))
  const colorRange = expertiseCategories.map(c => c.color)
  const bgColor = useTransform(scrollYProgress, inputRange, colorRange)

  // Restore last visited panel
  useEffect(() => {
    const desiredKey = initialKey || sessionStorage.getItem('areas:desiredKey')
    // map desiredKey to index if present
    let targetIndex = null
    if(desiredKey){
      const idx = expertiseCategories.findIndex(c=>c.key===desiredKey)
      if(idx>=0) targetIndex = idx
      sessionStorage.removeItem('areas:desiredKey')
    } else {
      const saved = sessionStorage.getItem('areas:lastIndex')
      if (saved) {
        const i = parseInt(saved, 10)
        if (!Number.isNaN(i) && i >= 0 && i < count) targetIndex = i
      }
    }
    if(targetIndex!=null){
      const el = wrapperRef.current
      if (el) {
        const totalScrollable = el.offsetHeight - window.innerHeight
        const target = el.offsetTop + (totalScrollable * (targetIndex / (count - 1)))
        ;(window.requestAnimationFrame || setTimeout)(() => { window.scrollTo({ top: target, behavior:'smooth' }) })
      }
    }
  }, [count, initialKey])

  useEffect(() => {
    return scrollYProgress.on('change', v => {
      const idx = Math.round(v * (count - 1))
      setActive(idx)
      sessionStorage.setItem('areas:lastIndex', String(idx))
    })
  }, [scrollYProgress, count])

  // Ambient / accent color interpolation -> CSS variables for global theming
  useEffect(() => {
    const root = document.documentElement
    const color = colorRange[active]
    root.style.setProperty('--ambient-color', color)
    root.style.setProperty('--accent-color', color)
  }, [active, colorRange])

  const handleDotClick = useCallback((i) => {
    const el = wrapperRef.current
    if (!el) return
  // Disable pointer events on track during animated scroll to avoid accidental interactions
  const track = trackRef.current
  if(track) track.style.pointerEvents = 'none'
    const totalScrollable = el.offsetHeight - window.innerHeight
    const target = el.offsetTop + (totalScrollable * (i / (count - 1)))
  window.scrollTo({ top: target, behavior: 'smooth' })
  // Re-enable after estimated duration
  setTimeout(()=>{ if(track) track.style.pointerEvents = '' }, 800)
  }, [count])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); handleDotClick(Math.min(count - 1, active + 1)) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); handleDotClick(Math.max(0, active - 1)) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, count, handleDotClick])

  return (
    <section id="areas" ref={wrapperRef} className="areas-hs-wrapper" aria-label="Areas of Expertise (horizontal)" tabIndex={0}>
      <div className="areas-hs-sticky">
  <Motion.div className="areas-hs-bg" style={{ background: bgColor }} aria-hidden="true" />
        <Motion.div ref={trackRef} className="areas-hs-track" style={{ x }}>
          {expertiseCategories.map((area, idx) => (
            <Panel key={area.key} area={area} index={idx} count={count} active={active} progress={scrollYProgress} />
          ))}
        </Motion.div>
        <nav className="areas-progress" aria-label="Areas progress">
          <div className="areas-progress-bar"><span style={{ width: `${(active/(count-1))*100}%` }} /></div>
          <ul className="areas-progress-dots">
            {expertiseCategories.map((a,i)=>(
              <li key={a.key}>
                <button 
                  aria-label={`Go to ${a.title}`} 
                  className={i===active? 'is-active': ''} 
                  onClick={()=>handleDotClick(i)}
                  data-cursor="click"
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}

function Panel({ area, index, count, active, progress }) {
  // define progress range for this panel
  const start = (index - 0.5) / (count - 1)
  const end = (index + 0.5) / (count - 1)
  const clampedStart = Math.max(0, start)
  const clampedEnd = Math.min(1, end)
  const local = useTransform(progress, [clampedStart, clampedEnd], [0, 1])
  const scale = useTransform(local, [0, 1], [0.9, 1])
  const opacity = useTransform(local, [0, 1], [0.5, 1])
  const pointer = index === active ? 'auto' : 'none'

  return (
    <Motion.div className="areas-panel" style={{ background: area.color, scale, opacity }} data-active={index===active ? 'true':'false'}>
      <div className="areas-panel-inner">
        <header className="areas-panel-head">
          <span className="areas-panel-index">{area.id.toString().padStart(2, '0')}</span>
          <h3 className="areas-panel-title">{area.title}</h3>
          <ul className="areas-panel-tags">
            {area.tags.map(t => <li key={t}>{t}</li>)}
          </ul>
        </header>
        <div className="areas-panel-body" style={{ overflowY: index===active ? 'auto':'hidden', pointerEvents: pointer }}>
          <p className="areas-panel-blurb">{area.blurb}</p>
          {index===active && (
            <div className="areas-panel-extra">
              <p className="areas-panel-extra-heading">Deep Dive</p>
              <ul className="areas-panel-extra-list">
                <li>Key KPI uplift examples</li>
                <li>Representative tools / stack notes</li>
                <li>Mini case study placeholder</li>
              </ul>
            </div>
          )}
          <div className="areas-panel-spacer" />
          <p className="areas-panel-more">More detailed case metrics & examples could appear here.</p>
        </div>
      </div>
    </Motion.div>
  )
}
