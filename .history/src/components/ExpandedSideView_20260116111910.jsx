/**
 * ExpandedSideView — Full-screen view for Design or Tech side
 * 
 * Shows when user fully commits to one side:
 * - Avatar stays visible on the side edge
 * - Background effect (floral for design, matrix for tech)
 * - Projects grid filtered by spectrum
 * - Smooth expand/collapse animation
 */

import { memo, useMemo } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import FloralGrowthEffect from './FloralGrowthEffect'
import MatrixRainEffect from './MatrixRainEffect'
import ProgressiveImage from './ProgressiveImage'
import './styles/expanded-side-view.css'

// Filter projects by design or tech leaning
function getFilteredProjects(side) {
  return projects.filter(p => {
    if (!p.spectrum) return true
    const balance = p.spectrum.tech / (p.spectrum.design + p.spectrum.tech)
    // Design side: balance < 0.5 (more design-heavy)
    // Tech side: balance >= 0.5 (more tech-heavy)
    return side === 'design' ? balance < 0.55 : balance >= 0.45
  }).slice(0, 6) // Limit to 6 projects
}

// Project card component
function ProjectCard({ project, index, side }) {
  const isDesign = side === 'design'
  
  return (
    <Motion.article
      className={`expanded-project-card expanded-project-card--${side}`}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.3 + index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <Link to={`/projects/${project.slug}`} className="expanded-project-link">
        <div className="expanded-project-image">
          <ProgressiveImage
            src={project.image}
            alt={project.title}
            aspectRatio="16/10"
          />
          <div className="expanded-project-overlay" />
        </div>
        
        <div className="expanded-project-info">
          <span className="expanded-project-category">{project.category}</span>
          <h3 className="expanded-project-title">{project.title}</h3>
          <p className="expanded-project-desc">{project.desc}</p>
          
          {/* Spectrum indicator */}
          <div className="expanded-project-spectrum">
            <div 
              className="expanded-project-spectrum-bar"
              style={{
                '--design-percent': `${project.spectrum?.design || 50}%`,
                '--tech-percent': `${project.spectrum?.tech || 50}%`,
              }}
            />
          </div>
        </div>
      </Link>
    </Motion.article>
  )
}

function ExpandedSideView({ 
  side, // 'design' | 'tech' | null
  isExpanded = false,
  avatarImage,
  onClose,
}) {
  const filteredProjects = useMemo(() => 
    side ? getFilteredProjects(side) : [],
    [side]
  )
  
  const isDesign = side === 'design'
  const isTech = side === 'tech'
  
  return (
    <AnimatePresence mode="wait">
      {isExpanded && side && (
        <Motion.div
          key={side}
          className={`expanded-side-view expanded-side-view--${side}`}
          initial={{ opacity: 0, x: isDesign ? '-100%' : '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isDesign ? '-100%' : '100%' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Background Effect */}
          {isDesign && <FloralGrowthEffect isActive={true} side="left" />}
          {isTech && <MatrixRainEffect isActive={true} />}
          
          {/* Close button */}
          <Motion.button
            className="expanded-close-btn"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            aria-label="Close and return to hero"
          >
            <span className="close-icon">✕</span>
            <span className="close-text">Back</span>
          </Motion.button>
          
          {/* Avatar - stays on the edge */}
          <Motion.div 
            className={`expanded-avatar expanded-avatar--${side}`}
            initial={{ opacity: 0, scale: 0.8, x: isDesign ? -50 : 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <img 
              src={avatarImage} 
              alt={`${side} avatar`}
              className="expanded-avatar-img"
            />
          </Motion.div>
          
          {/* Content area */}
          <div className={`expanded-content expanded-content--${side}`}>
            {/* Header */}
            <Motion.header 
              className="expanded-header"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className={`expanded-title expanded-title--${side}`}>
                {isDesign ? 'Design' : '<Tech />'}
              </h1>
              <p className="expanded-subtitle">
                {isDesign 
                  ? 'Creative vision meets strategic thinking. Crafting experiences that resonate.'
                  : 'Clean code. Elegant solutions. Building the future, one commit at a time.'
                }
              </p>
            </Motion.header>
            
            {/* Projects Grid */}
            <div className="expanded-projects-grid">
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index}
                  side={side}
                />
              ))}
            </div>
            
            {/* View all link */}
            <Motion.div 
              className="expanded-view-all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Link 
                to={`/projects?filter=${side}`} 
                className={`expanded-view-all-link expanded-view-all-link--${side}`}
              >
                View all {side} projects →
              </Link>
            </Motion.div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}

export default memo(ExpandedSideView)
