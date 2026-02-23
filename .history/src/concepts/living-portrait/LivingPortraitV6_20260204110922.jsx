/**
 * LIVING PORTRAIT V6 — Akaru.fr Style Navigation
 * 
 * EXACT BEHAVIOR:
 * 1. Hero section with horizontal scroll-hijacked projects
 * 2. Scroll down = moves horizontally through projects
 * 3. When last project reached, vertical scroll continues to sections below
 * 4. Left panel is fixed during horizontal scroll
 * 5. Smooth transitions between projects
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './living-portrait-v6.css'

// Projects data
const PROJECTS = [
  {
    id: 'pikko',
    number: '01',
    category: 'ART DIRECTION',
    title: 'Brand Identity',
    subtitle: 'AUSTRALIAN BRAND SPECIALIZING IN CREATIVE DESIGN',
    year: '2024',
    color: '#ff6b5b',
    image: '/projects/studio-identity-800-68d65e3d.avif',
  },
  {
    id: 'entreautre',
    number: '02',
    category: 'ART DIRECTION',
    title: 'Digital Interfaces',
    subtitle: 'CROSS-DISCIPLINARY DESIGN AGENCY',
    year: '2024',
    color: '#ff9a3c',
    image: '/projects/ecommerce-platform-800-1643d532.avif',
  },
  {
    id: 'hiway',
    number: '03',
    category: 'MOTION DESIGN',
    title: 'Animation Studio',
    subtitle: 'THE ONLY ALL-IN-ONE CREATIVE OFFER',
    year: '2024',
    color: '#e879f9',
    image: '/projects/interactive-portfolio-800-b7d86403.avif',
  },
  {
    id: 'vaonis',
    number: '04',
    category: 'E-COMMERCE',
    title: 'Smart Telescopes',
    subtitle: 'INNOVATIVE SPACE TECHNOLOGY PLATFORM',
    year: '2025',
    color: '#00ff88',
    image: '/projects/packaging-design-800-e4f2fc53.avif',
  },
]

// Expertise data
const EXPERTISE = [
  { number: '01', title: 'Strategy & Advice', tags: ['/AUDIT', '/CONSULTING', '/ROADMAP'], color: '#ff6b5b' },
  { number: '02', title: 'Art Direction', tags: ['/VISUAL IDENTITY', '/GRAPHIC CHARTER', '/UI & UX'], color: '#ff9a3c' },
  { number: '03', title: 'E-commerce', tags: ['/USER JOURNEY', '/CUSTOM SHOPIFY', '/HEADLESS'], color: '#e879f9' },
  { number: '04', title: 'Showcase Website', tags: ['/FRONT-END', '/BACK-END', '/WEBGL'], color: '#00ff88' },
  { number: '05', title: 'Digital Experience', tags: ['/LANDING PAGE', '/3D', '/GAMING'], color: '#00e5ff' },
]

export default function LivingPortraitV6() {
  const [currentProject, setCurrentProject] = useState(0)
  const [isHorizontalMode, setIsHorizontalMode] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const lastScrollTime = useRef(0)

  const project = PROJECTS[currentProject]
  const isFirst = currentProject === 0
  const isLast = currentProject === PROJECTS.length - 1

  // Handle scroll for horizontal navigation
  useEffect(() => {
    const handleWheel = (e) => {
      // Throttle scroll events
      const now = Date.now()
      if (now - lastScrollTime.current < 600) return
      if (isTransitioning) return

      const heroRect = heroRef.current?.getBoundingClientRect()
      const isHeroVisible = heroRect && heroRect.top <= 0 && heroRect.bottom > window.innerHeight * 0.5

      // If hero is in view, handle horizontal navigation
      if (isHeroVisible && isHorizontalMode) {
        const delta = e.deltaY

        if (delta > 20) {
          // Scrolling down
          if (!isLast) {
            e.preventDefault()
            lastScrollTime.current = now
            setIsTransitioning(true)
            setCurrentProject(prev => prev + 1)
            setTimeout(() => setIsTransitioning(false), 600)
          } else {
            // Last project - allow vertical scroll to continue
            setIsHorizontalMode(false)
          }
        } else if (delta < -20) {
          // Scrolling up
          if (!isFirst) {
            e.preventDefault()
            lastScrollTime.current = now
            setIsTransitioning(true)
            setCurrentProject(prev => prev - 1)
            setTimeout(() => setIsTransitioning(false), 600)
          }
        }
      }

      // Re-enable horizontal mode when scrolling back to hero
      if (!isHorizontalMode && heroRect && heroRect.bottom >= window.innerHeight) {
        setIsHorizontalMode(true)
        setCurrentProject(PROJECTS.length - 1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [currentProject, isHorizontalMode, isTransitioning, isFirst, isLast])

  // Manual dot navigation
  const goToProject = (index) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentProject(index)
    setIsHorizontalMode(true)
    // Scroll hero into view
    heroRef.current?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => setIsTransitioning(false), 600)
  }

  return (
    <div ref={containerRef} className="lp6-page">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO: HORIZONTAL SCROLL-HIJACKED PROJECTS
          ═══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="lp6-hero">
        {/* Fixed Left Panel */}
        <div className="lp6-hero__left">
          <a href="/" className="lp6-logo">PORTFOLIO</a>
          
          <div className="lp6-mission">
            <p>
              Creative studio bringing together innovative design and 
              cutting-edge development for exceptional digital experiences.
            </p>
          </div>

          <div className="lp6-social">
            <div className="lp6-social__line" />
            <div className="lp6-social__links">
              <a href="#">INSTAGRAM</a>
              <a href="#">LINKEDIN</a>
              <a href="#">TWITTER</a>
            </div>
          </div>
        </div>

        {/* Right Panel - Project Display */}
        <div className="lp6-hero__right">
          <AnimatePresence mode="wait">
            <motion.div
              key={project.id}
              className="lp6-project"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Giant background number */}
              <motion.div 
                className="lp6-project__number"
                style={{ color: project.color }}
                initial={{ opacity: 0, scale: 0.8, x: 100 }}
                animate={{ opacity: 0.1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.1, x: -50 }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              >
                {project.number}
              </motion.div>

              {/* Project image */}
              <motion.div 
                className="lp6-project__image"
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-20%', opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              >
                <img src={project.image} alt={project.title} />
              </motion.div>

              {/* Project info */}
              <div className="lp6-project__info">
                <motion.span 
                  className="lp6-project__year"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  {project.year}
                </motion.span>
                
                <motion.span 
                  className="lp6-project__category"
                  style={{ color: project.color }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  {project.category}
                </motion.span>

                <motion.p 
                  className="lp6-project__subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  {project.subtitle}
                </motion.p>

                <motion.a 
                  href={`/projects/${project.id}`}
                  className="lp6-project__cta"
                  style={{ borderColor: project.color, color: project.color }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  whileHover={{ backgroundColor: project.color, color: '#0a0a0a' }}
                >
                  SEE PROJECT
                </motion.a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="lp6-dots">
            {PROJECTS.map((p, idx) => (
              <button
                key={p.id}
                className={`lp6-dot ${idx === currentProject ? 'active' : ''}`}
                onClick={() => goToProject(idx)}
                style={{ 
                  '--dot-color': p.color,
                  '--active': idx === currentProject ? 1 : 0 
                }}
                aria-label={`Go to project ${idx + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="lp6-counter">
            <span className="lp6-counter__current">{project.number}</span>
            <span className="lp6-counter__total">/{String(PROJECTS.length).padStart(2, '0')}</span>
          </div>

          {/* Scroll hint */}
          {isHorizontalMode && (
            <motion.div 
              className="lp6-scroll-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span>SCROLL</span>
              <div className="lp6-scroll-hint__line" />
            </motion.div>
          )}
        </div>

        {/* Top Navigation */}
        <nav className="lp6-nav">
          <a href="#expertise">Expertise</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTIONS BELOW (vertical scroll after horizontal)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="lp6-sections">
        {/* Expertise Section */}
        <section id="expertise" className="lp6-expertise">
          <div className="lp6-expertise__header">
            <motion.span 
              className="lp6-expertise__label"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              EXPERTISE
            </motion.span>
            <motion.h2 
              className="lp6-expertise__title"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              aim for quality only
            </motion.h2>
          </div>

          <div className="lp6-expertise__grid">
            {EXPERTISE.map((exp, idx) => (
              <motion.div 
                key={exp.number}
                className="lp6-exp-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              >
                <span className="lp6-exp-card__number" style={{ color: exp.color }}>
                  {exp.number}
                </span>
                <h3 className="lp6-exp-card__title">{exp.title}</h3>
                <div className="lp6-exp-card__tags">
                  {exp.tags.map((tag, i) => (
                    <span key={i} className="lp6-exp-card__tag">{tag}</span>
                  ))}
                </div>
                <a href="#" className="lp6-exp-card__link" style={{ color: exp.color }}>
                  SEE EXPERTISE
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="lp6-about">
          <motion.h2 
            className="lp6-about__title"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            We craft beautiful<br/>digital experiences
          </motion.h2>
          
          <motion.div 
            className="lp6-about__values"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span>creative</span>
            <span>passionate</span>
            <span>independent</span>
          </motion.div>

          <motion.a 
            href="#contact" 
            className="lp6-about__cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            DISCOVER THE AGENCY
          </motion.a>
        </section>

        {/* Contact Section */}
        <section id="contact" className="lp6-contact">
          <motion.h2 
            className="lp6-contact__title"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Let's work together
          </motion.h2>
          
          <motion.a 
            href="mailto:contact@portfolio.com"
            className="lp6-contact__email"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            CONTACT@PORTFOLIO.COM
          </motion.a>

          <footer className="lp6-footer">
            <div className="lp6-footer__links">
              <a href="#">INSTAGRAM</a>
              <a href="#">LINKEDIN</a>
              <a href="#">TWITTER</a>
            </div>
            <span className="lp6-footer__copy">PORTFOLIO © 2024</span>
          </footer>
        </section>
      </div>
    </div>
  )
}
