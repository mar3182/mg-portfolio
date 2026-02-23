/**
 * DesignSection — Left side of the spatial navigation
 * 
 * Shows design/creative work with warm orange accent
 */

import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './styles/spatial-sections.css'

const DESIGN_WORK = [
  {
    id: 'brand-identity',
    title: 'Brand Identity',
    description: 'Visual identity systems that tell stories',
    tags: ['Logo', 'Guidelines', 'Typography'],
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    description: 'Human-centered digital experiences',
    tags: ['Web', 'Mobile', 'Design Systems'],
  },
  {
    id: 'packaging',
    title: 'Packaging Design',
    description: 'Physical products that stand out',
    tags: ['Print', '3D', 'Sustainable'],
  },
  {
    id: 'motion',
    title: 'Motion Design',
    description: 'Animation that brings brands to life',
    tags: ['Animation', 'Video', 'Interactive'],
  },
]

export default function DesignSection({ onBack }) {
  return (
    <Motion.section 
      className="spatial-section spatial-section--design"
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Back button */}
      <button className="section-back" onClick={onBack}>
        <span className="back-arrow">→</span>
        <span>Back to center</span>
      </button>
      
      {/* Section header */}
      <header className="section-header">
        <Motion.h1 
          className="section-title section-title--design"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Design
        </Motion.h1>
        <Motion.p 
          className="section-subtitle"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Creative work that connects brands with people
        </Motion.p>
      </header>
      
      {/* Work grid */}
      <div className="section-grid">
        {DESIGN_WORK.map((work, index) => (
          <Motion.article 
            key={work.id}
            className="work-card work-card--design"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
          >
            <div className="work-card__visual" />
            <div className="work-card__content">
              <h3 className="work-card__title">{work.title}</h3>
              <p className="work-card__desc">{work.description}</p>
              <div className="work-card__tags">
                {work.tags.map(tag => (
                  <span key={tag} className="tag tag--design">{tag}</span>
                ))}
              </div>
            </div>
          </Motion.article>
        ))}
      </div>
      
      {/* View all link */}
      <Motion.div 
        className="section-cta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link to="/projects?filter=design" className="cta-link cta-link--design">
          View all design work →
        </Link>
      </Motion.div>
      
      {/* Background accent */}
      <div className="section-bg section-bg--design" />
    </Motion.section>
  )
}
