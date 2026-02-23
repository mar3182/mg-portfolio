import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { getProjectById } from '../data/projects'
import ProgressiveImage from '../components/ProgressiveImage'

export default function ProjectDetail() {
  const { id } = useParams()
  const project = getProjectById(id)

  if (!project) {
    return (
      <section style={{ padding: '6rem 2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Not found</h1>
        <p>Project does not exist.</p>
        <p style={{ marginTop: '2rem' }}><Link to="/projects">← Back to projects</Link></p>
      </section>
    )
  }

  return (
    <section className="project-detail" style={{ padding:'6rem 0 6rem' }}>
      <div className="project-detail-inner" style={{ maxWidth:1200, margin:'0 auto', padding:'0 2rem' }}>
        <Motion.header initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:.7,ease:[0.4,0,0.2,1]}} style={{marginBottom:'3.5rem'}}>
          <h1 style={{ fontSize:'clamp(2.5rem,8vw,5rem)', lineHeight:.85, letterSpacing:'-0.04em', margin:'0 0 1.75rem' }}>
            <Motion.span layoutId={`project-title-${project.id}`}>{project.title}</Motion.span>
          </h1>
          <Motion.div layoutId={`project-color-${project.id}`} style={{background:project.color, borderRadius:'1.25rem', padding:'2.4rem 2.4rem 2.6rem', boxShadow:'0 12px 48px -16px rgba(0,0,0,0.18)'}}>
            <p style={{ fontSize:'1.15rem', maxWidth:680, lineHeight:1.45 }}>{project.desc}</p>
          </Motion.div>
        </Motion.header>
        <div className="project-gallery" style={{display:'grid', gap:'2.2rem', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', marginBottom:'4rem'}}>
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="project-media" style={{aspectRatio:'4/3', borderRadius:'1.1rem', boxShadow:'0 6px 28px -12px rgba(0,0,0,0.15)', background:project.color}}>
              <ProgressiveImage
                src={`https://picsum.photos/seed/${project.id}-${i}/800/600`}
                placeholder={`https://picsum.photos/seed/${project.id}-${i}/40/30`}
                alt={project.title+ ' image '+(i+1)}
                style={{width:'100%', height:'100%'}}
              />
            </div>
          ))}
        </div>
        <div className="project-process" style={{display:'grid', gap:'3.5rem', marginBottom:'5rem'}}>
          {['Discovery','Exploration','Build','Launch'].map((phase,i)=>(
            <div key={phase} style={{display:'grid', gap:'.9rem'}}>
              <h2 style={{fontSize:'1.65rem', margin:0, letterSpacing:'-0.02em'}}>{String(i+1).padStart(2,'0')} {phase}</h2>
              <p style={{fontSize:'.95rem', lineHeight:1.5, maxWidth:760, opacity:.85}}>Phase narrative placeholder describing objectives, decisions, constraints and representative outputs for the {phase.toLowerCase()} step.</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize:'.8rem', letterSpacing:'.15em', textTransform:'uppercase', opacity:.5 }}>End of case study</p>
        <p style={{ marginTop:'3rem' }}><Link to="/projects">← Back to projects</Link></p>
      </div>
    </section>
  )
}
