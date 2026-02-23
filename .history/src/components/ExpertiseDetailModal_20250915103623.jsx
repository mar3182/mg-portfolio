import React, { useEffect, useRef } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { getExpertiseByKey } from '../data/expertise'
import { useFocusTrap } from '../hooks/useFocusTrap'

export function useHash(){
  const [value,setValue] = React.useState(()=> window.location.hash.replace('#',''))
  useEffect(()=>{
    function onHash(){ setValue(window.location.hash.replace('#','')) }
    window.addEventListener('hashchange', onHash)
    return ()=> window.removeEventListener('hashchange', onHash)
  },[])
  const set = key => {
    if(key){ window.location.hash = key } else { history.replaceState('',document.title, window.location.pathname + window.location.search) }
  }
  return [value,set]
}

export default function ExpertiseDetailModal(){
  const [hash,setHash] = useHash()
  const key = hash?.startsWith('exp-') ? hash.slice(4) : null
  const data = key ? getExpertiseByKey(key) : null
  const ref = useRef(null)
  useFocusTrap(ref, !!data)

  useEffect(()=>{ 
    const root = document.documentElement
    let prev
    if(data){
      prev = getComputedStyle(root).getPropertyValue('--accent-color')
      root.dataset.prevAccent = prev
      root.style.setProperty('--accent-color', data.color)
    }
    return () => {
      if(!data && root.dataset.prevAccent){
        root.style.setProperty('--accent-color', root.dataset.prevAccent)
        delete root.dataset.prevAccent
      }
    }
  },[data])

  return (
    <AnimatePresence>
      {data && (
        <Motion.div 
          className="project-preview-modal" 
          role="dialog" 
          aria-modal="true" 
          aria-label={data.title + ' details'} 
          initial={{opacity:0}} 
          animate={{opacity:1}} 
          exit={{opacity:0}}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setHash(null)
            }
          }}
        >
          <Motion.div ref={ref} className="project-preview-dialog" initial={{scale:.95, y:20, opacity:0}} animate={{scale:1, y:0, opacity:1}} exit={{scale:.95, y:10, opacity:0}} transition={{type:'spring', stiffness:220, damping:26}} style={{maxWidth:760}}>
            <button className="preview-close" aria-label="Close" onClick={()=>setHash(null)}>×</button>
            <h2 style={{fontSize:'2.4rem', lineHeight:.9, letterSpacing:'-0.03em', margin:'0 0 1rem'}}>{data.title}</h2>
            <p style={{fontSize:'1rem', lineHeight:1.5, margin:'0 0 1.5rem'}}>{data.long}</p>
            <h3 style={{fontSize:'0.65rem', letterSpacing:'.18em', textTransform:'uppercase', opacity:.6, margin:'0 0 .75rem'}}>Core services</h3>
            <ul style={{margin:0, padding:'0 0 0 1.1rem', display:'grid', gap:'.5rem'}}>
              {data.services?.map(s => <li key={s} style={{fontSize:'.85rem', lineHeight:1.35}}>{s}</li>)}
            </ul>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
