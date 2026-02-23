import React, { useState, useMemo, useEffect, useRef } from 'react'
import { motion as Motion, LayoutGroup, AnimatePresence } from 'framer-motion'
import { StaggerWrapper, StaggerItem, RevealWrapper } from '../components/ScrollReveal'
import { Link, useSearchParams } from 'react-router-dom'
import { motion as Motion2, AnimatePresence as AP2 } from 'framer-motion'
import { useFocusTrap } from '../hooks/useFocusTrap'
import HorizontalScrollProjects from '../components/HorizontalScrollProjects'
import SkillSpectrum, { SpectrumFilter } from '../components/SkillSpectrum'
import '../akaru-styles.css'
import { projects } from '../data/projects'
import ProgressiveImage from '../components/ProgressiveImage'
const ALL_CATEGORIES = Array.from(new Set(projects.map(p=>p.category)))
const CATEGORIES = ['All', ...ALL_CATEGORIES]

const cardVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  enter: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.04, duration: 0.5, ease: [0.4,0,0.2,1] } }),
  exit: { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.25, ease: 'easeOut' } }
}

export default function Projects() {
  const radioGroupRef = useRef(null)
  const [params, setParams] = useSearchParams()
  const initial = params.get('cat') || 'All'
  const [filter, setFilter] = useState(CATEGORIES.includes(initial) ? initial : 'All')
  const [spectrumFilter, setSpectrumFilter] = useState(50) // 0 = design, 100 = tech, 50 = all
  
  useEffect(()=>{
    setParams(p => {
      const next = new URLSearchParams(p)
      if (filter === 'All') next.delete('cat'); else next.set('cat', filter)
      return next
    }, { replace:true })
  }, [filter, setParams])
  
  // Filter by category first, then by spectrum if not centered
  const filtered = useMemo(()=> {
    let result = filter === 'All' ? projects : projects.filter(p => p.category === filter)
    
    // Apply spectrum filter if not at neutral position (50)
    if (spectrumFilter !== 50) {
      result = result.filter(p => {
        if (!p.spectrum) return true
        const balance = (p.spectrum.tech / (p.spectrum.design + p.spectrum.tech)) * 100
        const tolerance = 35 // Allow some range
        
        if (spectrumFilter < 50) {
          // User wants design-heavy: filter to projects with balance < 50 + tolerance
          return balance < (50 + tolerance)
        } else {
          // User wants tech-heavy: filter to projects with balance > 50 - tolerance
          return balance > (50 - tolerance)
        }
      })
    }
    
    return result
  }, [filter, spectrumFilter])
  
  const [preview, setPreview] = useState(null)
  const [announce, setAnnounce] = useState('')
  useEffect(()=>{ setAnnounce(`Filter set to ${filter}. ${filtered.length} projects shown.`) }, [filter, filtered.length])

  function handleFilterKeyDown(e, idx) {
    if (!radioGroupRef.current) return
    const buttons = Array.from(radioGroupRef.current.querySelectorAll('[role="radio"]'))
    const currentIndex = idx
    let nextIndex = null
    const key = e.key
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % buttons.length
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + buttons.length) % buttons.length
    } else if (key === 'Home') {
      nextIndex = 0
    } else if (key === 'End') {
      nextIndex = buttons.length - 1
    }
    if (nextIndex !== null) {
      e.preventDefault()
      const nextBtn = buttons[nextIndex]
      const nextValue = nextBtn.textContent
      setFilter(nextValue)
      // Focus will move on next render cycle; but attempt immediate focus for better UX
      requestAnimationFrame(() => nextBtn.focus())
    }
  }

  return (
    <>
  <section id="projects" className="projects-section">
      <div className="projects-inner">
  <RevealWrapper>
	<Motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-title">Projects</Motion.h2>
  </RevealWrapper>

        <RevealWrapper>
          <div
            ref={radioGroupRef}
            className="project-filters"
            role="radiogroup"
            aria-label="Project categories"
          >
            {CATEGORIES.map((cat, idx) => {
              const checked = cat === filter
              return (
                <button
                  key={cat}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  tabIndex={checked ? 0 : -1}
                  className={checked ? 'filter-btn is-active' : 'filter-btn'}
                  onClick={() => setFilter(cat)}
                  onKeyDown={(e) => handleFilterKeyDown(e, idx)}
                >
                  {cat}
                </button>
              )
            })}
            <span className="visually-hidden" aria-live="polite">Current category: {filter}</span>
          </div>
        </RevealWrapper>
        
        {/* T-Shaped Spectrum Filter */}
        <RevealWrapper>
          <SpectrumFilter 
            value={spectrumFilter}
            onChange={setSpectrumFilter}
            showAll={spectrumFilter !== 50}
          />
        </RevealWrapper>
  <div aria-live="polite" className="visually-hidden">{announce}</div>
        <LayoutGroup>
          <StaggerWrapper className="projects-grid" data-filter={filter} role="list">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <StaggerItem key={p.id}>
                  <Motion.article
                    role="listitem"
                    className="project-card-grid"
                    data-cursor-type="project"
                    variants={cardVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    custom={i}
                    layout
                  >
                  <div className="project-card-bg" style={{ background:p.color }} />
                  <div className="project-card-overlay" />
                  <div style={{position:'absolute', inset:0, borderRadius:'inherit', overflow:'hidden', mixBlendMode:'multiply', opacity:.9}} aria-hidden="true">
                    {p.image && (
                    <ProgressiveImage
                      src={p.image}
                      srcSet={p.jpg}
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 480px"
                      sources={[
                        { type:'image/avif', srcSet:p.avif },
                        { type:'image/webp', srcSet:p.webp }
                      ]}
                      placeholder={p.thumb}
                      alt=""
                      highPriority={i===0}
                    />)}
                  </div>
                  <div
                    className="project-card-content card-activator"
                    role="button"
                    tabIndex={0}
                    aria-label={`Open preview for ${p.title}`}
                    onClick={()=>setPreview(p)}
                    onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); setPreview(p) } }}
                    data-cursor-type="view"
                  >
                    <div className="project-card-top">
                      <span className="project-year">{p.year}</span>
                      <span className="project-category">{p.category}</span>
                    </div>
                    <h3 className="project-card-title">
                      <Link to={`/projects/${p.id}`} onMouseEnter={()=>import('./ProjectDetail')}>
                        <span>{p.title}</span>
                      </Link>
                    </h3>
                    <p className="project-card-desc">{p.desc}</p>
                    
                    {/* T-Shaped Spectrum Indicator */}
                    {p.spectrum && (
                      <div className="project-card-spectrum">
                        <SkillSpectrum 
                          spectrum={p.spectrum}
                          variant="compact"
                          size="small"
                          showLabels={false}
                          animated={true}
                        />
                      </div>
                    )}
                  </div>
                </Motion.article>
                </StaggerItem>
              ))}
            </AnimatePresence>
          </StaggerWrapper>
        </LayoutGroup>
      </div>
  </section>
  <HorizontalScrollProjects />
  <AP2>
    {preview && <PreviewModal project={preview} onClose={()=>setPreview(null)} />}
  </AP2>
  </>
  )
}

function PreviewModal({ project, onClose }) {
  const ref = useRef(null)
  useFocusTrap(ref, true)
  
  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])
  
  return (
    <Motion2.div 
      className="project-preview-modal" 
      role="dialog" 
      aria-modal="true" 
      aria-label={project.title + ' preview'} 
      initial={{opacity:0}} 
      animate={{opacity:1}} 
      exit={{opacity:0}}
      onClick={handleBackdropClick}
    >
      <Motion2.div ref={ref} className="project-preview-dialog" initial={{scale:.95, y:20, opacity:0}} animate={{scale:1, y:0, opacity:1}} exit={{scale:.95, y:10, opacity:0}} transition={{type:'spring', stiffness:210, damping:26}}>
        <button className="preview-close" onClick={onClose} aria-label="Close preview">×</button>
        <div className="preview-hero" style={{background:project.color, overflow:'hidden'}}>
          {project.image && (
          <ProgressiveImage
            src={project.image}
            srcSet={project.jpg}
            sizes="(max-width: 800px) 100vw, 640px"
            sources={[
              { type:'image/avif', srcSet:project.avif },
              { type:'image/webp', srcSet:project.webp }
            ]}
            placeholder={project.thumb}
            alt=""
            highPriority
          />)}
        </div>
        <h2 className="preview-title-lg">{project.title}</h2>
        <p className="preview-desc-lg">{project.desc}</p>
        
        {/* Enhanced Call-to-Action */}
        <div className="preview-cta-row">
          <Link 
            to={`/projects/${project.id}`} 
            onClick={onClose}
            className="btn btn-primary"
          >
            View Full Case Study
            <span style={{ fontSize: '1.1rem' }}>→</span>
          </Link>
          <span className="hint-text">
            or press Escape to close
          </span>
        </div>
      </Motion2.div>
    </Motion2.div>
  )
}
