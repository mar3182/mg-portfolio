import React, { useEffect, useState, useCallback } from 'react'
import { motion as Motion } from 'framer-motion'
import { focusAreas } from '../data/focusAreas'

/* Functional colored panels on right side that the showcase swaps out for.
   Behaves as vertical stack with scroll snapping; active panel syncs accent color. */
export default function HomeFocusPanels() {
  const [active, setActive] = useState(0)

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
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay: 0.15 + i*0.05 }}
            onClick={()=>{ setActive(i); goToArea(i) }}
          >
            <span className="focus-index" aria-hidden="true">{area.index}</span>
            <span className="focus-title">{area.title}</span>
            <span className="focus-tagline">{area.tagline}</span>
            <span className="focus-desc">{area.description}</span>
          </Motion.button>
        )
      })}
    </div>
  )
}
