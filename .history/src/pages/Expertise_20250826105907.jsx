import React from 'react'
import '../akaru-styles.css'
import { motion as Motion } from 'framer-motion'
import { expertiseCategories } from '../data/expertise'

const reveal = {
  hidden:{opacity:0, y:40},
  visible:i=>({opacity:1,y:0,transition:{delay:i*0.08,duration:0.6,ease:[0.4,0,0.2,1]}})
}

export default function ExpertisePage(){
  return (
    <section className="expertise-full" style={{padding:'8rem 0 6rem'}} aria-labelledby="expertise-main-heading">
      <div className="expertise-full-inner" style={{maxWidth:1200, margin:'0 auto', padding:'0 2rem'}}>
        <Motion.h1 id="expertise-main-heading" className="section-title" initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:[0.4,0,0.2,1]}}>Expertise</Motion.h1>
        <Motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.25,duration:.6}} style={{maxWidth:640, fontSize:'1.05rem', lineHeight:1.45, margin:'1.5rem 0 3.5rem'}}>Aim for quality only — web design & development craft across strategy, identity, commerce & experiential surfaces.</Motion.p>
        <div className="expertise-blocks" style={{display:'grid', gap:'4rem'}}>
          {expertiseCategories.map((cat,i)=>{
            return (
              <Motion.article key={cat.key} className="expertise-block" variants={reveal} initial="hidden" whileInView="visible" viewport={{once:true, margin:'-80px'}} custom={i} style={{position:'relative'}}>
                <div className="expertise-block-bg" aria-hidden="true" style={{position:'absolute', inset:0, background:cat.color, opacity:.15, borderRadius:'1.5rem'}} />
                <div className="expertise-block-inner" style={{position:'relative', padding:'2.5rem 2.75rem 3rem', borderRadius:'1.5rem', backdropFilter:'blur(4px)', boxShadow:'0 6px 32px -12px rgba(0,0,0,0.12)', background:'rgba(255,255,255,0.55)'}}>
                  <header style={{display:'flex', flexDirection:'column', gap:'.65rem', marginBottom:'1.5rem'}}>
                    <span style={{fontSize:'.65rem', letterSpacing:'.15em', fontWeight:700, opacity:.65}}>0{cat.id}</span>
                    <h2 style={{fontSize:'2.8rem', lineHeight:.9, letterSpacing:'-0.03em', margin:0}}>{cat.title}</h2>
                  </header>
                  <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:'.75rem'}}>
                    {cat.tags.map(t=> <li key={t} style={{fontSize:'.8rem', letterSpacing:'.05em', fontWeight:500}}>{t}</li> )}
                  </ul>
                  <p style={{fontSize:'.9rem', lineHeight:1.45, margin:'1.25rem 0 1.75rem'}}>{cat.blurb}</p>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem'}}>
                    <a href="#contact" className="see-expertise-btn" style={{textDecoration:'none', fontSize:'.65rem', letterSpacing:'.15em', fontWeight:700, textTransform:'uppercase', padding:'.7rem 1.05rem .75rem', background:'#111', color:'#fff', borderRadius:'.75rem'}}>See expertise</a>
                    <span style={{fontSize:'.55rem', letterSpacing:'.15em', textTransform:'uppercase', opacity:.6}}>Selected services</span>
                  </div>
                </div>
              </Motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
