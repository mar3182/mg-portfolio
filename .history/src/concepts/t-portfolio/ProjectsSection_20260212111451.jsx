/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECTS SECTION — Showcasing Work Across the Spectrum
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Each project shows its position on the Design↔Tech spectrum.
 * Cards have living-portrait-style color atmosphere.
 */

import { memo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '../../data/projects'

// Map spectrum to gradient colors
function getSpectrumGradient(spectrum) {
  const designWeight = spectrum.design / 100
  const techWeight = spectrum.tech / 100
  const warmAlpha = designWeight * 0.15
  const coolAlpha = techWeight * 0.12
  return `linear-gradient(135deg, rgba(196, 112, 58, ${warmAlpha}), rgba(58, 124, 196, ${coolAlpha}))`
}

function getSpectrumPosition(spectrum) {
  // Higher design = more left, higher tech = more right
  const total = spectrum.design + spectrum.tech
  return total > 0 ? (spectrum.tech / total) * 100 : 50
}

const ProjectsSection = memo(function ProjectsSection({ sectionRef }) {
  const [hoveredProject, setHoveredProject] = useState(null)

  return (
    <section id="work" ref={sectionRef} className="t-projects">
      {/* Section header */}
      <motion.div
        className="t-projects__header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <span className="t-section-label">Work</span>
        <h2 className="t-projects__title">Selected Projects</h2>
        <p className="t-projects__intro">
          Each project sits on the Design↔Tech spectrum — 
          showing where creative thinking and engineering meet.
        </p>
      </motion.div>

      {/* Spectrum scale */}
      <motion.div
        className="t-projects__spectrum-bar"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="spectrum-bar__label spectrum-bar__label--left">Design</span>
        <div className="spectrum-bar__track" />
        <span className="spectrum-bar__label spectrum-bar__label--right">Tech</span>
      </motion.div>

      {/* Project cards grid */}
      <div className="t-projects__grid">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            isHovered={hoveredProject === project.id}
            onHover={setHoveredProject}
          />
        ))}
      </div>
    </section>
  )
})

// Single project card
const ProjectCard = memo(function ProjectCard({ project, index, isHovered, onHover }) {
  const spectrumPos = getSpectrumPosition(project.spectrum)
  const gradient = getSpectrumGradient(project.spectrum)

  return (
    <motion.article
      className="t-project-card"
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
            <span className="tag tag--design" style={{ opacity: project.spectrum.design / 100 }}>
              Design {project.spectrum.design}%
            </span>
            <span className="tag tag--tech" style={{ opacity: project.spectrum.tech / 100 }}>
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
