import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { getProjectById, projects } from '../data/projects'
import { getProjectDetails } from '../data/projectDetails'
import ProgressiveImage from '../components/ProgressiveImage'

export default function ProjectDetail() {
  const { id } = useParams()
  const project = getProjectById(id)
  const details = project ? getProjectDetails(project.slug) : null
  const nextProject = React.useMemo(() => {
    const idx = projects.findIndex(p => p.id === Number(id))
    if (idx === -1 || projects.length === 0) return null
    return projects[(idx + 1) % projects.length]
  }, [id])
  const prevProject = React.useMemo(() => {
    const idx = projects.findIndex(p => p.id === Number(id))
    if (idx === -1 || projects.length === 0) return null
    return projects[(idx - 1 + projects.length) % projects.length]
  }, [id])

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
        
        {/* Back Navigation */}
        <Motion.div 
          initial={{opacity:0, x:-20}} 
          animate={{opacity:1, x:0}} 
          transition={{duration:.5, ease:[0.4,0,0.2,1]}}
          style={{marginBottom:'2rem'}}
        >
          <Link 
            to="/projects" 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#666',
              textDecoration: 'none',
              padding: '0.7rem 1.2rem',
              borderRadius: '2rem',
              background: '#f8f9fa',
              border: '1px solid rgba(0,0,0,0.08)',
              transition: 'all 0.2s ease',
              ':hover': {
                background: '#e9ecef',
                borderColor: 'rgba(0,0,0,0.12)'
              }
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#e9ecef'
              e.target.style.borderColor = 'rgba(0,0,0,0.12)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#f8f9fa'
              e.target.style.borderColor = 'rgba(0,0,0,0.08)'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>←</span>
            Back to Projects
          </Link>
        </Motion.div>

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
        
        <p style={{ fontSize:'.8rem', letterSpacing:'.15em', textTransform:'uppercase', opacity:.5, marginBottom:'1.25rem' }}>End of case study</p>

        {/* Next project navigation */}
        {(prevProject || nextProject) && (
          <div className="next-project" style={{ 
            margin: '0 0 2.25rem', 
            padding: '1rem 1.25rem', 
            border: '1px solid rgba(0,0,0,0.06)', 
            borderRadius: '1rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '1rem', 
            background: '#fafafa',
            flexWrap: 'wrap'
          }}>
            {nextProject && (
              <div style={{ display:'flex', alignItems:'center', gap:'.6rem', minWidth:0 }}>
                <div style={{ fontSize:'.75rem', letterSpacing:'.12em', textTransform:'uppercase', opacity:.6 }}>Next project</div>
                <span aria-hidden="true" style={{
                  width:'14px', height:'14px', borderRadius:'50%', background: nextProject.color,
                  display:'inline-block', boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.08)'
                }} />
                <div style={{ fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{nextProject.title}</div>
              </div>
            )}
            <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}>
              {prevProject && (
                <Link 
                  to={`/projects/${prevProject.id}`} 
                  className="btn btn-ghost focus-ring-link"
                  aria-label={`Previous project: ${prevProject.title}`}
                >
                  ← Previous
                </Link>
              )}
              {nextProject && (
                <Link 
                  to={`/projects/${nextProject.id}`} 
                  className="btn btn-primary focus-ring-link"
                  aria-label={`Next project: ${nextProject.title}`}
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
        
        {/* Enhanced Navigation */}
        <div style={{ 
          display: 'grid', 
          gap: '1rem', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          marginBottom: '2rem'
        }}>
          <Link 
            to="/projects"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.7rem',
              padding: '1rem 2rem',
              background: '#000',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '3rem',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>←</span>
            View All Projects
          </Link>
          
          <Link 
            to="/contact"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.7rem',
              padding: '1rem 2rem',
              background: 'transparent',
              color: '#000',
              textDecoration: 'none',
              borderRadius: '3rem',
              fontSize: '0.95rem',
              fontWeight: '500',
              border: '2px solid #000',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#000'
              e.target.style.color = '#fff'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.color = '#000'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>✉</span>
            Start a Project
          </Link>
        </div>
      </div>
    </section>
  )
}
