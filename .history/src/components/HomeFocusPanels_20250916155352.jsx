import React, { useEffect, useState, useCallback, useRef } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { focusAreas } from '../data/focusAreas'

/* Enhanced functional colored panels that can expand to full hero width with horizontal scroll */
export default function HomeFocusPanels({ onFocusChange, externalActiveKey }) {
  const [active, setActive] = useState(0)
  const [showHint, setShowHint] = useState(true)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [viewMode, setViewMode] = useState('compact') // 'compact', 'expanded', 'horizontal'
  const liveRef = useRef(null)

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
    <div className="home-focus-panels" role="tablist" aria-label="Core focus areas">
      {focusAreas.map((area,i)=>{
        const isActive = i===active
        return (
          <Motion.button
            key={area.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={"focus-panel" + (isActive?" is-active":"")}
            style={{ '--panel-color': area.color }}
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0, flex: prefersReduced ? 1 : (isActive?1.1:0.22) }}
            whileHover={{ scale: isActive?1.02:1.01 }}
            transition={{ delay: 0.1 + i*0.05, type:'spring', stiffness:180, damping:26 }}
            onClick={()=>{ setActive(i); goToArea(i); onFocusChange?.(focusAreas[i].expKey); setShowHint(false) }}
          >
            <span className="focus-index" aria-hidden="true">{area.index}</span>
            <span className="focus-title">{area.title}</span>
            <Motion.div className="focus-extra" initial={false} animate={ isActive ? { height:'auto', opacity:1 } : { height:0, opacity:0 } } transition={{ duration:0.45, ease:[0.4,0,0.2,1] }} aria-hidden={!isActive}>
              <span className="focus-tagline">{area.tagline}</span>
              <span className="focus-desc">{area.description}</span>
            </Motion.div>
          </Motion.button>
        )
      })}
  <div className={"focus-shortcut-hint" + (showHint?" visible":"")} aria-hidden="true">Keys 1–4</div>
  {/* aria-live region for screen reader announcement of shortcuts */}
  <div ref={liveRef} className="visually-hidden" aria-live="polite">{showHint? 'Keyboard shortcuts available: press 1 to 4 to switch focus area.' : ''}</div>
    </div>
  )
}
