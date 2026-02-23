import React, { useEffect, useState, useCallback, useRef } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { focusAreas } from '../data/focusAreas'
import { projects } from '../data/projects'

// Enhanced service data with clear purposes and actions
const servicePreviewData = {
  strategy: {
    icon: '🎯',
    shortDesc: 'Strategic Planning',
    expandedDesc: 'Transform your business vision into actionable roadmaps with data-driven insights.',
    features: ['Market Analysis', 'Competitive Research', 'Growth Strategy', 'Brand Positioning'],
    cta: 'Schedule Strategy Call',
    price: 'From $2,500',
    timeline: '2-3 weeks',
    projects: projects.filter(p => p.category.includes('Portfolio') || p.category.includes('SaaS')),
    metrics: { completion: 95, satisfaction: 4.8, clients: 12 }
  },
  design: {
    icon: '🎨',
    shortDesc: 'Design & Branding',
    expandedDesc: 'Create compelling visual identities and user experiences that drive engagement.',
    features: ['UI/UX Design', 'Brand Identity', 'Visual Systems', 'Prototyping'],
    cta: 'View Design Work',
    price: 'From $3,500',
    timeline: '3-4 weeks',
    projects: projects.filter(p => p.category.includes('Design') || p.category.includes('Portfolio')),
    metrics: { completion: 92, satisfaction: 4.9, clients: 18 }
  },
  commerce: {
    icon: '🛒',
    shortDesc: 'E-commerce Development',
    expandedDesc: 'Build high-converting online stores with modern technology and optimized performance.',
    features: ['Shopify Development', 'Custom E-commerce', 'Payment Integration', 'Performance Optimization'],
    cta: 'Start Your Store',
    price: 'From $5,000',
    timeline: '4-6 weeks',
    projects: projects.filter(p => p.category.includes('Development') || p.category.includes('WordPress')),
    metrics: { completion: 98, satisfaction: 4.7, clients: 25 }
  },
  experience: {
    icon: '✨',
    shortDesc: 'Interactive Experiences',
    expandedDesc: 'Craft immersive digital experiences with cutting-edge technology and storytelling.',
    features: ['Interactive Design', 'Web Animations', 'WebGL Experiences', 'Performance Focus'],
    cta: 'See Experiences',
    price: 'From $4,000',
    timeline: '3-5 weeks',
    projects: projects.filter(p => p.category.includes('Interactive') || p.category.includes('Web')),
    metrics: { completion: 88, satisfaction: 4.6, clients: 15 }
  }
}

/* Enhanced functional colored panels that can expand to full hero width with horizontal scroll */
export default function HomeFocusPanels({ onFocusChange, externalActiveKey }) {
  const [active, setActive] = useState(0)
  const [showHint, setShowHint] = useState(true)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const [viewMode, setViewMode] = useState('compact') // 'compact', 'expanded', 'horizontal'
  const [animatingSkills, setAnimatingSkills] = useState({})
  const liveRef = useRef(null)

  // Animate skills on panel activation
  useEffect(() => {
    const area = focusAreas[active]
    if (area && focusAreaContent[area.id]) {
      setAnimatingSkills(prev => ({ ...prev, [area.id]: true }))
      const timer = setTimeout(() => {
        setAnimatingSkills(prev => ({ ...prev, [area.id]: false }))
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [active])

  // Dynamic content component for each panel
  const PanelContent = ({ area, isActive, mode }) => {
    const content = focusAreaContent[area.id]
    const isAnimating = animatingSkills[area.id]
    
    return (
      <Motion.div 
        className="panel-dynamic-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Skills showcase with animations */}
        {(mode !== 'compact' || isActive) && content && (
          <Motion.div 
            className="skills-showcase"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="skills-grid">
              {content.skills.map((skill, idx) => (
                <Motion.div
                  key={skill}
                  className="skill-pill"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    backgroundColor: isAnimating ? area.color : 'rgba(255,255,255,0.8)'
                  }}
                  transition={{ 
                    delay: idx * 0.1,
                    duration: 0.3,
                    backgroundColor: { duration: 0.6 }
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {skill}
                </Motion.div>
              ))}
            </div>
          </Motion.div>
        )}

        {/* Project carousel preview */}
        {mode === 'expanded' && content && content.projects.length > 0 && (
          <Motion.div 
            className="project-carousel"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="carousel-header">
              <h4>Recent Projects</h4>
            </div>
            <div className="project-previews">
              {content.projects.slice(0, 2).map((project, idx) => (
                <Motion.div
                  key={project.id}
                  className="project-preview-card"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  style={{ '--project-color': project.color }}
                >
                  {project.image && (
                    <div className="project-thumb">
                      <img src={project.image} alt={project.title} />
                    </div>
                  )}
                  <div className="project-info">
                    <h5>{project.title}</h5>
                    <span className="project-category">{project.category}</span>
                  </div>
                </Motion.div>
              ))}
            </div>
          </Motion.div>
        )}

        {/* Metrics display for horizontal mode */}
        {mode === 'horizontal' && content && (
          <Motion.div 
            className="metrics-display"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="metric">
              <Motion.div 
                className="metric-circle"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <span className="metric-value">{content.metrics.completion}%</span>
              </Motion.div>
              <span className="metric-label">Success Rate</span>
            </div>
            <div className="metric">
              <div className="metric-stars">
                {[...Array(5)].map((_, i) => (
                  <Motion.span 
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: i < Math.floor(content.metrics.satisfaction) ? 1 : 0.3 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    ⭐
                  </Motion.span>
                ))}
              </div>
              <span className="metric-label">{content.metrics.satisfaction}/5.0</span>
            </div>
            <div className="metric">
              <Motion.span 
                className="metric-count"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                {content.metrics.projects}
              </Motion.span>
              <span className="metric-label">Projects</span>
            </div>
          </Motion.div>
        )}
      </Motion.div>
    )
  }

  // Detect prefers-reduced-motion
  useEffect(()=>{
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = ()=> setPrefersReduced(!!m.matches)
    apply()
    m.addEventListener('change', apply)
    return ()=> m.removeEventListener('change', apply)
  },[])

  // Sync with external key (e.g., query param deep link)
  useEffect(()=>{
    if(!externalActiveKey) return
    const idx = focusAreas.findIndex(f=>f.expKey===externalActiveKey)
    if(idx>=0 && idx!==active){ setActive(idx) }
  }, [externalActiveKey, active])

  useEffect(()=>{
    const root = document.documentElement
    const color = focusAreas[active]?.color
    if(color) root.style.setProperty('--accent-color', color)
  },[active])

  const goToArea = useCallback((i)=>{
    // Scroll to horizontal areas section & move approximate panel
    const sec = document.getElementById('areas')
    if(sec){
      const top = sec.offsetTop - 40
      window.scrollTo({ top, behavior:'smooth' })
    }
    // also set hash to highlight expertise in full page context when opened later
    const fa = focusAreas[i]
    if(fa?.expKey){
      // store last desired panel for HorizontalScrollAreas to read
      sessionStorage.setItem('areas:desiredKey', fa.expKey)
    }
  },[])

  // Keyboard shortcuts (1-4)
  useEffect(()=>{
    const handler = (e)=>{
      if(['1','2','3','4'].includes(e.key)){
        const idx = Number(e.key)-1
        if(idx < focusAreas.length){ setActive(idx); onFocusChange?.(focusAreas[idx].expKey); goToArea(idx); setShowHint(false) }
      }
    }
    window.addEventListener('keydown', handler)
    return ()=> window.removeEventListener('keydown', handler)
  }, [onFocusChange, goToArea])

  // Auto-hide hint after delay
  useEffect(()=>{
    if(!showHint) return
    const t = setTimeout(()=> setShowHint(false), 6500)
    return ()=> clearTimeout(t)
  }, [showHint])

  // Cycle through view modes: compact -> expanded -> horizontal -> compact
  const cycleViewMode = useCallback(() => {
    setViewMode(current => {
      switch(current) {
        case 'compact': return 'expanded'
        case 'expanded': return 'horizontal' 
        case 'horizontal': return 'compact'
        default: return 'compact'
      }
    })
  }, [])

  // Handle panel selection in different modes
  const handlePanelClick = useCallback((i) => {
    setActive(i)
    onFocusChange?.(focusAreas[i].expKey)
    
    // In compact mode, also trigger area navigation
    if (viewMode === 'compact') {
      goToArea(i)
    }
    
    setShowHint(false)
  }, [viewMode, onFocusChange, goToArea])

  return (
    <Motion.div 
      className={`home-focus-panels home-focus-panels--${viewMode}`}
      role="tablist" 
      aria-label="Core focus areas"
      layout
      transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
    >
      {/* Mode toggle button */}
      <Motion.button
        type="button"
        className="focus-mode-toggle"
        onClick={cycleViewMode}
        aria-label={`Switch to ${viewMode === 'compact' ? 'expanded' : viewMode === 'expanded' ? 'horizontal scroll' : 'compact'} view`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Motion.div
          className="toggle-icon"
          animate={{ 
            rotate: viewMode === 'compact' ? 0 : viewMode === 'expanded' ? 90 : 180 
          }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'compact' && '⤢'}
          {viewMode === 'expanded' && '⟷'}
          {viewMode === 'horizontal' && '⬇'}
        </Motion.div>
      </Motion.button>

      {/* Panels container */}
      <Motion.div 
        className="focus-panels-container"
        layout
        transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
      >
        {focusAreas.map((area, i) => {
          const isActive = i === active
          return (
            <Motion.button
              key={area.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`focus-panel focus-panel--${viewMode}${isActive ? ' is-active' : ''}`}
              style={{ '--panel-color': area.color }}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                flex: prefersReduced ? 1 : (
                  viewMode === 'compact' ? (isActive ? 1.1 : 0.22) : 1
                )
              }}
              whileHover={{ 
                scale: viewMode === 'horizontal' ? 1.02 : (isActive ? 1.02 : 1.01),
                y: viewMode === 'horizontal' ? -4 : 0
              }}
              transition={{ 
                delay: 0.1 + i * 0.05, 
                type: 'spring', 
                stiffness: 180, 
                damping: 26,
                layout: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }
              }}
              onClick={() => handlePanelClick(i)}
            >
              <div className="panel-header">
                <span className="focus-index" aria-hidden="true">{area.index}</span>
                <span className="focus-title">{area.title}</span>
              </div>
              
              <AnimatePresence mode="wait">
                {(isActive || viewMode !== 'compact') && (
                  <Motion.div 
                    className="focus-extra" 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    aria-hidden={!isActive && viewMode === 'compact'}
                  >
                    <span className="focus-tagline">{area.tagline}</span>
                    <span className="focus-desc">{area.description}</span>
                  </Motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic content based on mode */}
              <PanelContent area={area} isActive={isActive} mode={viewMode} />
            </Motion.button>
          )
        })}
      </Motion.div>

      {/* Hints and shortcuts */}
      <Motion.div 
        className={`focus-shortcut-hint${showHint ? ' visible' : ''}`} 
        aria-hidden="true"
        animate={{ opacity: showHint ? 1 : 0 }}
      >
        Keys 1–4 • Click {viewMode === 'compact' ? '⤢' : viewMode === 'expanded' ? '⟷' : '⬇'} to {viewMode === 'compact' ? 'expand' : viewMode === 'expanded' ? 'scroll' : 'compact'}
      </Motion.div>
      
      {/* aria-live region for screen reader announcement */}
      <div ref={liveRef} className="visually-hidden" aria-live="polite">
        {showHint ? `Keyboard shortcuts available: press 1 to 4 to switch focus area. Current view: ${viewMode}` : ''}
      </div>
    </Motion.div>
  )
}
