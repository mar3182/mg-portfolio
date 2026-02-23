/**
 * LIVING PORTRAIT V6 — True Akaru.fr Homepage Style
 * 
 * CORRECT BEHAVIOR (from analysis):
 * 1. Homepage has a HORIZONTAL AUTO-PLAYING CAROUSEL of projects
 * 2. Left side: Logo + Mission statement (fixed)
 * 3. Right side: Project images sliding horizontally with title, year, number
 * 4. Vertical scroll = Goes to NEXT SECTION (not next project)
 * 5. Sections: Hero Carousel → Expertise → About → Contact
 * 
 * Elements animation on Akaru:
 * - Project images slide in from right
 * - Numbers (01, 02) are large in background
 * - Text fades/slides in with stagger
 * - Smooth color transitions between projects
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './living-portrait-v6.css'

// Projects for the carousel
const PROJECTS = [
  {
    id: 'pikko',
    number: '01',
    category: 'ART DIRECTION',
    title: 'Brand Identity',
    description: 'AUSTRALIAN BRAND SPECIALIZING IN CREATIVE DESIGN',
    year: '2024',
    color: '#ff6b5b',
    image: '/projects/studio-identity-800-68d65e3d.avif',
  },
  {
    id: 'entreautre',
    number: '02',
    category: 'ART DIRECTION',
    title: 'Digital Interfaces',
    description: 'CROSS-DISCIPLINARY DESIGN AGENCY',
    year: '2024',
    color: '#ff9a3c',
    image: '/projects/ecommerce-platform-800-1643d532.avif',
  },
  {
    id: 'hiway',
    number: '03',
    category: 'MOTION DESIGN',
    title: 'Animation Studio',
    description: 'THE ONLY ALL-IN-ONE CREATIVE OFFER',
    year: '2024',
    color: '#e879f9',
    image: '/projects/interactive-portfolio-800-b7d86403.avif',
  },
  {
    id: 'vaonis',
    number: '04',
    category: 'E-COMMERCE',
    title: 'Smart Telescopes',
    description: 'INNOVATIVE SPACE TECHNOLOGY PLATFORM',
    year: '2025',
    color: '#00ff88',
    image: '/projects/packaging-design-800-e4f2fc53.avif',
  },
]

// Expertise areas
const EXPERTISE = [
  { 
    number: '01', 
    title: 'Strategy & Advice',
    tags: ['/AUDIT', '/CONSULTING', '/ROADMAP', '/BENCHMARK'],
    color: '#ff6b5b',
  },
  { 
    number: '02', 
    title: 'Art Direction',
    tags: ['/VISUAL IDENTITY', '/GRAPHIC CHARTER', '/GRAPHIC DESIGN', '/UI & UX DESIGN'],
    color: '#ff9a3c',
  },
  { 
    number: '03', 
    title: 'E-commerce Website',
    tags: ['/USER JOURNEY', '/ART DIRECTION', '/CUSTOM SHOPIFY', '/HEADLESS'],
    color: '#e879f9',
  },
  { 
    number: '04', 
    title: 'Showcase Website',
    tags: ['/FRONT-END', '/BACK-END', '/CSS ANIMATIONS', '/WEBGL'],
    color: '#00ff88',
  },
  { 
    number: '05', 
    title: 'Digital Experience',
    tags: ['/LANDING PAGE', '/GAMING', '/3D DEVELOPMENT', '/STORYBOARD'],
    color: '#00e5ff',
  },
]

export default function LivingPortraitV6() {
  const [currentProject, setCurrentProject] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef(null)
  const autoPlayRef = useRef(null)

  const project = PROJECTS[currentProject]
  
  // Debug
  console.log('[V6] Rendering, project:', project?.id, 'index:', currentProject)

  // Auto-play carousel (like Akaru)
  useEffect(() => {
    if (!isAutoPlaying) return
    
    autoPlayRef.current = setInterval(() => {
      setCurrentProject(prev => (prev + 1) % PROJECTS.length)
    }, 4000) // Change every 4 seconds
    
    return () => clearInterval(autoPlayRef.current)
  }, [isAutoPlaying])

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  // Manual navigation
  const goToProject = (index) => {
    setCurrentProject(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 6 seconds
    setTimeout(() => setIsAutoPlaying(true), 6000)
  }

  const nextProject = () => goToProject((currentProject + 1) % PROJECTS.length)
  const prevProject = () => goToProject((currentProject - 1 + PROJECTS.length) % PROJECTS.length)

  return (
    <div ref={containerRef} className="akaru-page">
      {/* ════════════════════════════════════════════════════════════════
          SECTION 1: HERO WITH PROJECT CAROUSEL
          ════════════════════════════════════════════════════════════════ */}
      <section className="akaru-hero">
        {/* Left Panel - Fixed info */}
        <div className="akaru-hero__left">
          <a href="/" className="akaru-hero__logo">PORTFOLIO</a>
          
          <div className="akaru-hero__mission">
            <p>
              With a focus on creative excellence, this portfolio brings together 
              innovative design and cutting-edge development to deliver exceptional 
              digital experiences.
            </p>
          </div>
          
          <div className="akaru-hero__social">
            <div className="akaru-hero__social-line" />
            <div className="akaru-hero__social-links">
              <a href="#">INSTAGRAM</a>
              <a href="#">LINKEDIN</a>
              <a href="#">TWITTER</a>
            </div>
          </div>
        </div>

        {/* Right Panel - Project Carousel */}
        <div 
          className="akaru-hero__right"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence mode="wait">
            <ProjectSlide 
              key={project.id} 
              project={project}
              onNext={nextProject}
            />
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="akaru-hero__dots">
            {PROJECTS.map((p, idx) => (
              <button
                key={p.id}
                className={`akaru-hero__dot ${idx === currentProject ? 'active' : ''}`}
                onClick={() => goToProject(idx)}
                style={{ '--dot-color': idx === currentProject ? project.color : 'rgba(255,255,255,0.3)' }}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="akaru-hero__counter">
            <span className="akaru-hero__counter-current">{project.number}</span>
            <span className="akaru-hero__counter-total">/{String(PROJECTS.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Top Navigation */}
        <nav className="akaru-nav">
          <a href="#projects">Projects</a>
          <a href="#expertise">Expertise</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2: EXPERTISE
          ════════════════════════════════════════════════════════════════ */}
      <section id="expertise" className="akaru-expertise">
        <div className="akaru-expertise__header">
          <h2 className="akaru-expertise__title">Expertise</h2>
          <p className="akaru-expertise__subtitle">aim for quality only</p>
        </div>

        <div className="akaru-expertise__grid">
          {EXPERTISE.map((exp, idx) => (
            <ExpertiseCard key={exp.number} expertise={exp} index={idx} />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 3: ABOUT
          ════════════════════════════════════════════════════════════════ */}
      <section id="about" className="akaru-about">
        <div className="akaru-about__content">
          <motion.h2 
            className="akaru-about__title"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            We craft beautiful<br/>experiences
          </motion.h2>
          
          <motion.div 
            className="akaru-about__values"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span>creative</span>
            <span>passionate</span>
            <span>independent</span>
          </motion.div>

          <motion.a 
            href="#contact" 
            className="akaru-about__cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            OUR AGENCY
          </motion.a>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 4: CONTACT
          ════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="akaru-contact">
        <div className="akaru-contact__content">
          <motion.h2 
            className="akaru-contact__title"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Let's work together
          </motion.h2>
          
          <motion.div 
            className="akaru-contact__info"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a href="mailto:contact@portfolio.com">CONTACT@PORTFOLIO.COM</a>
          </motion.div>
        </div>

        <footer className="akaru-footer">
          <div className="akaru-footer__links">
            <a href="#">INSTAGRAM</a>
            <a href="#">LINKEDIN</a>
            <a href="#">TWITTER</a>
          </div>
          <div className="akaru-footer__copy">
            PORTFOLIO © 2024
          </div>
        </footer>
      </section>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT SLIDE — Animated carousel item
   ═══════════════════════════════════════════════════════════════════════════ */

const ProjectSlide = memo(function ProjectSlide({ project, onNext }) {
  return (
    <motion.div 
      className="akaru-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background number */}
      <motion.div 
        className="akaru-slide__number"
        style={{ color: project.color }}
        initial={{ opacity: 0, x: 100, scale: 0.8 }}
        animate={{ opacity: 0.08, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -50, scale: 1.1 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      >
        {project.number}
      </motion.div>

      {/* Project image */}
      <motion.div 
        className="akaru-slide__image-wrapper"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-30%', opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      >
        <div 
          className="akaru-slide__image"
          style={{ 
            backgroundImage: `url(${project.image})`,
            backgroundColor: `${project.color}20`
          }}
        />
      </motion.div>

      {/* Project info */}
      <div className="akaru-slide__info">
        <motion.span 
          className="akaru-slide__year"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {project.year}
        </motion.span>
        
        <motion.span 
          className="akaru-slide__category"
          style={{ color: project.color }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {project.category}
        </motion.span>

        <motion.p 
          className="akaru-slide__description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {project.description}
        </motion.p>

        <motion.button 
          className="akaru-slide__cta"
          style={{ borderColor: project.color, color: project.color }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          whileHover={{ 
            backgroundColor: project.color,
            color: '#0a0a0a'
          }}
        >
          SEE PROJECT
        </motion.button>
      </div>
    </motion.div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   EXPERTISE CARD — Scroll-triggered animation
   ═══════════════════════════════════════════════════════════════════════════ */

const ExpertiseCard = memo(function ExpertiseCard({ expertise, index }) {
  return (
    <motion.div 
      className="akaru-exp-card"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.1,
        ease: [0.32, 0.72, 0, 1] 
      }}
    >
      <div className="akaru-exp-card__number" style={{ color: expertise.color }}>
        {expertise.number}
      </div>
      
      <h3 className="akaru-exp-card__title">{expertise.title}</h3>
      
      <div className="akaru-exp-card__tags">
        {expertise.tags.map((tag, i) => (
          <span key={i} className="akaru-exp-card__tag">{tag}</span>
        ))}
      </div>
      
      <a 
        href="#" 
        className="akaru-exp-card__link"
        style={{ color: expertise.color }}
      >
        SEE EXPERTISE
      </a>
    </motion.div>
  )
})
