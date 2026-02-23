/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECTS SECTION — Identity-Aware Showcase
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Commit & Dive: Projects are filtered and presented based on the user's  
 * committed side from the hero. Design side shows design-heavy work first,
 * Tech side shows tech-heavy work first, Balanced shows the full spectrum.
 */

import { memo, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { projects } from '../../data/projects'

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

function getSpectrumGradient(spectrum, side) {
  const designWeight = spectrum.design / 100
  const techWeight = spectrum.tech / 100
  // Amplify the committed side's color
  const warmBoost = side === 'design' ? 1.6 : side === 'tech' ? 0.5 : 1
  const coolBoost = side === 'tech' ? 1.6 : side === 'design' ? 0.5 : 1
  const warmAlpha = designWeight * 0.15 * warmBoost
  const coolAlpha = techWeight * 0.12 * coolBoost
  return `linear-gradient(135deg, rgba(196, 112, 58, ${warmAlpha}), rgba(58, 124, 196, ${coolAlpha}))`
}

function getSpectrumPosition(spectrum) {
  const total = spectrum.design + spectrum.tech
  return total > 0 ? (spectrum.tech / total) * 100 : 50
}

/** Sort/filter projects based on committed side */
function getOrderedProjects(committedSide) {
  const sorted = [...projects]
  if (committedSide === 'design') {
    // Design-heavy projects first
    sorted.sort((a, b) => b.spectrum.design - a.spectrum.design)
  } else if (committedSide === 'tech') {
    // Tech-heavy projects first
    sorted.sort((a, b) => b.spectrum.tech - a.spectrum.tech)
  }
  // balanced: original order (spectrum visualization)
  return sorted
}

// Section variant text
const SECTION_VARIANTS = {
  design: {
    title: 'Design Showcase',
    intro: 'Projects where visual craft and creative direction lead the way — ordered by design intensity.',
  },
  balanced: {
    title: 'Selected Projects',
    intro: 'Each project sits on the Design↔Tech spectrum — showing where creative thinking and engineering meet.',
  },
  tech: {
    title: 'Engineering Portfolio',
    intro: 'Projects defined by technical architecture and engineering depth — ordered by technical complexity.',
  },
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

const ProjectsSection = memo(function ProjectsSection({ sectionRef, committedSide = 'balanced' }) {
  const [hoveredProject, setHoveredProject] = useState(null)
  const orderedProjects = useMemo(() => getOrderedProjects(committedSide), [committedSide])
  const variant = SECTION_VARIANTS[committedSide] || SECTION_VARIANTS.balanced

  return (
    <section id="work" ref={sectionRef} className={`t-projects t-projects--${committedSide}`}>
      {/* Section header */}
      <motion.div
        className="t-projects__header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <span className="t-section-label">Work</span>
        <h2 className="t-projects__title">{variant.title}</h2>
        <p className="t-projects__intro">{variant.intro}</p>
      </motion.div>

      {/* Spectrum scale — shows current focus */}
      <motion.div
        className="t-projects__spectrum-bar"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="spectrum-bar__label spectrum-bar__label--left">Design</span>
        <div className="spectrum-bar__track">
          {/* Active zone indicator */}
          <motion.div
            className={`spectrum-bar__focus spectrum-bar__focus--${committedSide}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          />
        </div>
        <span className="spectrum-bar__label spectrum-bar__label--right">Tech</span>
      </motion.div>

      {/* Project cards grid */}
      <div className="t-projects__grid">
        {orderedProjects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            committedSide={committedSide}
            isHovered={hoveredProject === project.id}
            onHover={setHoveredProject}
          />
        ))}
      </div>
    </section>
  )
})

// ═══════════════════════════════════════════════════════════════════
// PROJECT CARD — adapts description emphasis per side
// ═══════════════════════════════════════════════════════════════════

const ProjectCard = memo(function ProjectCard({ project, index, committedSide, isHovered, onHover }) {
  const spectrumPos = getSpectrumPosition(project.spectrum)
  const gradient = getSpectrumGradient(project.spectrum, committedSide)
  
  // Determine which tag is the "primary" based on committed side
  const primaryTag = committedSide === 'design' ? 'design' : committedSide === 'tech' ? 'tech' : null

  return (
    <motion.article
      className={`t-project-card t-project-card--${committedSide}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ y: -8 }}
      style={{ '--card-gradient': gradient }}
    >
      {/* Image area */}
      <div className="t-project-card__image">
        {project.thumb ? (
          <picture>
            {project.avif && <source srcSet={project.avif} type="image/avif" sizes="(max-width: 600px) 100vw, 50vw" />}
            {project.webp && <source srcSet={project.webp} type="image/webp" sizes="(max-width: 600px) 100vw, 50vw" />}
            <img
              src={project.image || project.thumb}
              alt={project.title}
              loading="lazy"
              width="600"
              height="400"
            />
          </picture>
        ) : (
          <div className="t-project-card__placeholder" style={{ background: gradient }} />
        )}

        {/* Spectrum indicator on image */}
        <div className="t-project-card__spectrum">
          <div className="spectrum__track">
            <motion.div
              className="spectrum__dot"
              style={{ left: `${spectrumPos}%` }}
              animate={{ scale: isHovered ? 1.3 : 1 }}
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="t-project-card__info">
        <span className="t-project-card__category">{project.category}</span>
        <h3 className="t-project-card__title">{project.title}</h3>
        <p className="t-project-card__desc">{project.desc}</p>
        
        <div className="t-project-card__meta">
          <span className="t-project-card__year">{project.year}</span>
          <div className="t-project-card__tags">
            <span className={`tag tag--design ${primaryTag === 'design' ? 'tag--primary' : ''}`}>
              Design {project.spectrum.design}%
            </span>
            <span className={`tag tag--tech ${primaryTag === 'tech' ? 'tag--primary' : ''}`}>
              Tech {project.spectrum.tech}%
            </span>
          </div>
        </div>
      </div>

      {/* Hover atmosphere */}
      <motion.div
        className="t-project-card__atmosphere"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.article>
  )
})

export default ProjectsSection
