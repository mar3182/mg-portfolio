/**
 * TechSection — Right side of the spatial navigation
 * 
 * Shows tech/development work with cool blue accent
 */

import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MatrixRainEffect from './MatrixRainEffect'
import './styles/spatial-sections.css'

const TECH_WORK = [
  {
    id: 'web-apps',
    title: 'Web Applications',
    description: 'Full-stack solutions built for scale',
    tags: ['React', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'api-design',
    title: 'API Architecture',
    description: 'RESTful and GraphQL services',
    tags: ['REST', 'GraphQL', 'Microservices'],
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Intelligent features and automation',
    tags: ['Python', 'TensorFlow', 'OpenAI'],
  },
  {
    id: 'blockchain',
    title: 'Web3 & Blockchain',
    description: 'Decentralized applications and smart contracts',
    tags: ['Solidity', 'Ethereum', 'NFT'],
  },
]

export default function TechSection({ onBack }) {
  return (
    <Motion.section 
      className="spatial-section spatial-section--tech"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Back button */}
      <button className="section-back section-back--right" onClick={onBack}>
        <span>Back to center</span>
        <span className="back-arrow">←</span>
      </button>
      
      {/* Section header */}
      <header className="section-header section-header--right">
        <Motion.h1 
          className="section-title section-title--tech"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Tech
        </Motion.h1>
        <Motion.p 
          className="section-subtitle"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Engineering solutions that power innovation
        </Motion.p>
      </header>
      
      {/* Work grid */}
      <div className="section-grid">
        {TECH_WORK.map((work, index) => (
          <Motion.article 
            key={work.id}
            className="work-card work-card--tech"
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
                  <span key={tag} className="tag tag--tech">{tag}</span>
                ))}
              </div>
            </div>
          </Motion.article>
        ))}
      </div>
      
      {/* View all link */}
      <Motion.div 
        className="section-cta section-cta--right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link to="/projects?filter=tech" className="cta-link cta-link--tech">
          ← View all tech projects
        </Link>
      </Motion.div>
      
      {/* Background accent */}
      <div className="section-bg section-bg--tech" />
      
      {/* Matrix Rain Effect - digital code rain animation */}
      <MatrixRainEffect isActive={true} />
    </Motion.section>
  )
}
