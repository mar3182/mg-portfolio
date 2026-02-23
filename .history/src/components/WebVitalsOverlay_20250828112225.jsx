import React, { useState, useEffect } from 'react'
import { useWebVitals } from '../hooks/useWebVitals'

// Thresholds from web-vitals recommendations
const thresholds = {
  LCP: { good: 2500, ni: 4000 },
  CLS: { good: 0.1, ni: 0.25 },
  INP: { good: 200, ni: 500 },
  FCP: { good: 1800, ni: 3000 },
  TTFB: { good: 800, ni: 1800 }
}

function classify(name, value){
  const t = thresholds[name]
  if(!t) return 'na'
  if(value <= t.good) return 'good'
  if(value <= t.ni) return 'needs'
  return 'poor'
}

export default function WebVitalsOverlay({ position = 'bottom-right', collapseAfter = 8000 }) {
  const [metrics, setMetrics] = useState({})
  const [collapsed, setCollapsed] = useState(false)
  useWebVitals({ enabled: true, onReport: (m) => {
    setMetrics(prev => ({ ...prev, [m.name]: m }))
  } })

  useEffect(()=>{
    if(!collapseAfter) return
    const id = setTimeout(()=> setCollapsed(true), collapseAfter)
    return ()=> clearTimeout(id)
  }, [collapseAfter])

  const wrapperStyle = {
    position: 'fixed',
    zIndex: 9999,
    fontFamily: 'system-ui, sans-serif',
    fontSize: 12,
    lineHeight: 1.2,
    pointerEvents: 'none',
    color: '#fff'
  }
  if(position.includes('bottom')) wrapperStyle.bottom = 10
  if(position.includes('top')) wrapperStyle.top = 10
  if(position.includes('right')) wrapperStyle.right = 10
  if(position.includes('left')) wrapperStyle.left = 10

  const box = {
    background: 'rgba(17,17,20,0.78)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '6px 8px',
    display: 'flex',
    gap: 12,
    maxWidth: collapsed ? 110 : 420,
    transition: 'max-width .5s ease',
    overflow: 'hidden'
  }

  const pillBase = {
    display: 'flex', flexDirection: 'column', gap: 2, minWidth: 56
  }

  const valueStyle = (cls) => ({
    fontWeight: 600,
    color: cls === 'good' ? '#16a34a' : cls === 'needs' ? '#d97706' : cls === 'poor' ? '#dc2626' : '#e5e7eb'
  })

  const order = ['LCP','CLS','INP','FCP','TTFB']

  return (
    <div style={wrapperStyle} aria-live="off">
      <div style={box} role="group" aria-label="Web Vitals Live Metrics">
        {order.map(name => {
          const m = metrics[name]
          const val = m ? (name === 'CLS' ? m.value.toFixed(2) : m.value.toFixed(name==='TTFB'?0:0)) : '—'
          const rating = m ? classify(name, m.value) : 'na'
          return (
            <div key={name} style={pillBase}>
              <span style={{ opacity: .7 }}>{name}</span>
              <span style={valueStyle(rating)}>{val}{m && (name==='LCP'||name==='FCP') && ' ms'}{m && name==='INP' && ' ms'}</span>
            </div>
          )
        })}
        <button type="button" aria-label={collapsed? 'Expand web vitals overlay':'Collapse web vitals overlay'} onClick={()=>setCollapsed(c=>!c)} style={{
          position:'absolute', top:2, right:4, background:'transparent', border:'none', color:'#9ca3af', cursor:'pointer', fontSize:10, pointerEvents:'auto'
        }}>{collapsed? '▢':'—'}</button>
      </div>
    </div>
  )
}
