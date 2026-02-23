import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { getProjectById } from '../data/projects'
import { getProjectDetails } from '../data/projectDetails'
import ProgressiveImage from '../components/ProgressiveImage'

export default function ProjectDetail() {
  const { id } = useParams()
  const project = getProjectById(id)
  const details = project ? getProjectDetails(project.slug) : null

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
          <h1 style={{ fontSize:'clamp(2.5rem,8vw,5rem)', lineHeight:.85, letterSpacing:'-0.04em', margin:'0 0 1rem' }}>
            <Motion.span layoutId={`project-title-${project.id}`}>{project.title}</Motion.span>
          </h1>
          {details && (
            <p style={{ fontSize:'1.35rem', fontWeight:300, opacity:.7, marginBottom:'1.75rem' }}>{details.subtitle}</p>
          )}
          <Motion.div layoutId={`project-color-${project.id}`} style={{background:project.color, borderRadius:'1.25rem', padding:'2.4rem 2.4rem 2.6rem', boxShadow:'0 12px 48px -16px rgba(0,0,0,0.18)'}}>
            <p style={{ fontSize:'1.15rem', maxWidth:680, lineHeight:1.45 }}>{project.desc}</p>
            {details && (
              <div style={{ marginTop:'1.5rem', display:'grid', gap:'0.5rem', fontSize:'0.9rem', opacity:.8 }}>
                <p><strong>Duration:</strong> {details.duration}</p>
                <p><strong>Role:</strong> {details.role}</p>
                <p><strong>Team:</strong> {details.team}</p>
              </div>
            )}
          </Motion.div>
        </Motion.header>

        {details && (
          <div className="project-overview" style={{marginBottom:'4rem'}}>
            <div style={{display:'grid', gap:'3rem', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))'}}>
              <div>
                <h2 style={{fontSize:'1.5rem', marginBottom:'1rem', letterSpacing:'-0.02em'}}>Challenge</h2>
                <p style={{fontSize:'.95rem', lineHeight:1.6, opacity:.85}}>{details.challenge}</p>
              </div>
              <div>
                <h2 style={{fontSize:'1.5rem', marginBottom:'1rem', letterSpacing:'-0.02em'}}>Impact</h2>
                <ul style={{fontSize:'.95rem', lineHeight:1.6, opacity:.85, paddingLeft:'1.2rem'}}>
                  {details.impact.map((item, i) => (
                    <li key={i} style={{marginBottom:'0.5rem'}}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="project-gallery" style={{display:'grid', gap:'2.2rem', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', marginBottom:'4rem'}}>
          {Array.from({length:4}).map((_,i)=>(
            <div key={i} className="project-media" style={{aspectRatio:'4/3', borderRadius:'1.1rem', boxShadow:'0 6px 28px -12px rgba(0,0,0,0.15)', background:project.color}}>
              <ProgressiveImage
                src={`https://picsum.photos/seed/${project.id}-${i}/800/600`}
                srcSet={`https://picsum.photos/seed/${project.id}-${i}/400/300 400w, https://picsum.photos/seed/${project.id}-${i}/600/450 600w, https://picsum.photos/seed/${project.id}-${i}/800/600 800w`}
                sources={[
                  { type:'image/avif', srcSet:`https://picsum.photos/seed/${project.id}-${i}/800/600.avif 800w` },
                  { type:'image/webp', srcSet:`https://picsum.photos/seed/${project.id}-${i}/800/600.webp 800w` }
                ]}
                sizes="(max-width: 700px) 100vw, (max-width: 1200px) 33vw, 380px"
                placeholder={`https://picsum.photos/seed/${project.id}-${i}/40/30`}
                alt={project.title+ ' image '+(i+1)}
                style={{width:'100%', height:'100%'}}
              />
            </div>
          ))}
        </div>

        {details && (
          <div className="project-solution" style={{marginBottom:'4rem'}}>
            <h2 style={{fontSize:'1.8rem', marginBottom:'1.5rem', letterSpacing:'-0.02em'}}>Solution & Approach</h2>
            <div style={{fontSize:'.95rem', lineHeight:1.6, opacity:.85, whiteSpace:'pre-line'}}>
              {details.solution}
            </div>
          </div>
        )}

        {details && details.technologies && (
          <div className="project-technologies" style={{marginBottom:'4rem'}}>
            <h2 style={{fontSize:'1.5rem', marginBottom:'1.5rem', letterSpacing:'-0.02em'}}>Technologies Used</h2>
            <div style={{display:'flex', flexWrap:'wrap', gap:'0.5rem'}}>
              {details.technologies.map((tech, i) => (
                <span key={i} style={{
                  background:'rgba(0,0,0,0.06)', 
                  padding:'0.4rem 0.8rem', 
                  borderRadius:'1rem', 
                  fontSize:'0.85rem',
                  fontWeight:'500'
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {details && details.highlights && (
          <div className="project-highlights" style={{marginBottom:'4rem'}}>
            <h2 style={{fontSize:'1.5rem', marginBottom:'1.5rem', letterSpacing:'-0.02em'}}>Key Highlights</h2>
            <ul style={{fontSize:'.95rem', lineHeight:1.6, opacity:.85, paddingLeft:'1.2rem'}}>
              {details.highlights.map((highlight, i) => (
                <li key={i} style={{marginBottom:'0.5rem'}}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}
        
        <p style={{ fontSize:'.8rem', letterSpacing:'.15em', textTransform:'uppercase', opacity:.5 }}>End of case study</p>
        <p style={{ marginTop:'3rem' }}><Link to="/projects">← Back to projects</Link></p>
      </div>
    </section>
  )
}
