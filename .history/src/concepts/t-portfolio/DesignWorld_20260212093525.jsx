/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DESIGN WORLD — Organic, Warm, Artistic
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The creative side of the T — vertical depth into design work.
 * Visual language: warm, organic, handmade, imperfect.
 * 
 * Contains:
 * - Expertise areas (Brand, UI/UX, Motion, Print)
 * - Associated projects
 * - Vertical scroll navigation
 */

import { useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './design-world.css'

// Design expertise areas with projects
const DESIGN_AREAS = [
  {
    id: 'brand',
    title: 'Brand Identity',
    description: 'Crafting visual systems that tell authentic stories',
    icon: '◇',
    color: '#ff6b5b',
    projects: [
      { id: 'brand-1', title: 'Lumina Studio', desc: 'Complete rebrand for creative agency', year: '2024' },
      { id: 'brand-2', title: 'Verde Organic', desc: 'Sustainable food brand identity', year: '2024' },
      { id: 'brand-3', title: 'Nexus Finance', desc: 'Fintech startup visual system', year: '2023' },
    ]
  },
  {
    id: 'uiux',
    title: 'UI/UX Design',
    description: 'Interfaces that feel as good as they look',
    icon: '▢',
    color: '#e89a5f',
    projects: [
      { id: 'ui-1', title: 'FlowState App', desc: 'Productivity app with focus modes', year: '2024' },
      { id: 'ui-2', title: 'Artisan Market', desc: 'E-commerce for handmade goods', year: '2024' },
    ]
  },
  {
    id: 'motion',
    title: 'Motion Graphics',
    description: 'Movement that communicates emotion',
    icon: '○',
    color: '#c4703a',
    projects: [
      { id: 'motion-1', title: 'Cosmic Intro', desc: 'Animated brand opener sequence', year: '2024' },
      { id: 'motion-2', title: 'Data Stories', desc: 'Infographic animation series', year: '2024' },
    ]
  },
]

export default function DesignWorld({ onBack }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  
  // Parallax for background elements
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  
  const handleBackClick = useCallback((e) => {
    e.stopPropagation()
    onBack?.()
  }, [onBack])

  return (
    <motion.div
      className="design-world"
      initial={{ opacity: 0, x: '-100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-50%' }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Background layers */}
      <motion.div className="design-world__bg" style={{ y: bgY }}>
        {/* TODO: Replace with hand-painted texture */}
        <div className="design-world__texture" />
        <div className="design-world__gradient" />
      </motion.div>
      
      {/* Back button */}
      <button 
        className="design-world__back"
        onClick={handleBackClick}
        aria-label="Return to overview"
      >
        <span className="back__arrow">←</span>
        <span className="back__label">Back</span>
      </button>
      
      {/* Header */}
      <header className="design-world__header">
        <motion.h1
          className="design-world__title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Design
        </motion.h1>
        <motion.p
          className="design-world__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Where vision meets craft
        </motion.p>
      </header>
      
      {/* Scrollable content */}
      <div 
        ref={containerRef}
        className="design-world__content"
      >
        {/* Areas with projects */}
        <div className="design-world__areas">
          {DESIGN_AREAS.map((area, index) => (
            <DesignArea 
              key={area.id} 
              area={area} 
              index={index}
            />
          ))}
        </div>
        
        {/* Footer manifesto */}
        <footer className="design-world__footer">
          <blockquote className="design-world__manifesto">
            "Design is not decoration — it's communication refined to its essence."
          </blockquote>
        </footer>
      </div>
    </motion.div>
  )
}

// Area component with nested projects
function DesignArea({ area, index }) {
  return (
    <motion.section
      className="design-area"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{ '--area-color': area.color }}
    >
      <div className="design-area__header">
        <span className="design-area__icon">{area.icon}</span>
        <h2 className="design-area__title">{area.title}</h2>
        <p className="design-area__desc">{area.description}</p>
      </div>
      
      <div className="design-area__projects">
        {area.projects.map((project, i) => (
          <motion.article
            key={project.id}
            className="design-project"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ x: 10 }}
          >
            <div className="design-project__image">
              {/* TODO: Replace with actual project image */}
              <div className="design-project__placeholder" />
            </div>
            <div className="design-project__info">
              <h3 className="design-project__title">{project.title}</h3>
              <p className="design-project__desc">{project.desc}</p>
              <span className="design-project__year">{project.year}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}
