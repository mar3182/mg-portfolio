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
  const [hoveredPanel, setHoveredPanel] = useState(null)
  const [expandedPanel, setExpandedPanel] = useState(null)
  const liveRef = useRef(null)

  // Handle panel interactions
  const handlePanelInteraction = useCallback((panelId, action) => {
    const area = focusAreas.find(a => a.id === panelId)
    if (!area) return

    switch(action) {
      case 'viewProjects':
        // Navigate to projects filtered by category
        window.location.href = '/projects'
        break
      case 'scheduleCall':
        // Open contact form or calendar
        window.location.href = '/contact'
        break
      case 'getQuote':
        // Open contact with service pre-selected
        window.location.href = `/contact?service=${panelId}`
        break
      default:
        break
    }
  }, [])

  // Interactive Service Preview Component
  const ServicePreview = ({ area, isActive, isHovered, isExpanded }) => {
    const service = servicePreviewData[area.id]
    if (!service) return null
    
    return (
      <Motion.div 
        className="service-preview"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Compact Preview */}
        <Motion.div className="service-compact">
          <span className="service-icon">{service.icon}</span>
          <span className="service-short-desc">{service.shortDesc}</span>
          <span className="service-price">{service.price}</span>
        </Motion.div>

        {/* Expanded Content on Hover */}
        <AnimatePresence>
          {(isHovered || isExpanded || viewMode !== 'compact') && (
            <Motion.div
              className="service-expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <p className="service-description">{service.expandedDesc}</p>
              
              {/* Key Features */}
              <div className="service-features">
                {service.features.map((feature, idx) => (
                  <Motion.span
                    key={feature}
                    className="feature-tag"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    {feature}
                  </Motion.span>
                ))}
              </div>

              {/* Service Details */}
              <div className="service-details">
                <div className="service-timeline">
                  <span className="detail-label">Timeline:</span>
                  <span className="detail-value">{service.timeline}</span>
                </div>
                <div className="service-satisfaction">
                  <span className="detail-label">Rating:</span>
                  <span className="detail-value">{service.metrics.satisfaction}/5.0 ⭐</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="service-actions">
                <Motion.button
                  className="cta-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePanelInteraction(area.id, 'scheduleCall')
                  }}
                >
                  {service.cta}
                </Motion.button>
                <Motion.button
                  className="cta-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePanelInteraction(area.id, 'viewProjects')
                  }}
                >
                  View Work
                </Motion.button>
              </div>

              {/* Recent Project Preview */}
              {service.projects.length > 0 && (
                <Motion.div 
                  className="recent-project-preview"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="project-preview-mini">
                    <img 
                      src={service.projects[0].image} 
                      alt={service.projects[0].title}
                      className="project-mini-thumb"
                    />
                    <div className="project-mini-info">
                      <span className="project-mini-title">{service.projects[0].title}</span>
                      <span className="project-mini-category">{service.projects[0].category}</span>
                    </div>
                  </div>
                </Motion.div>
              )}
            </Motion.div>
          )}
        </AnimatePresence>
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
