/**
 * LIVING PORTRAIT V6 — Akaru.fr Exact Implementation
 * 
 * Based on AKARU_DETAILED_SPEC.md:
 * - Scroll-hijacked horizontal navigation (NO auto-advance)
 * - Scroll DOWN = next project, Scroll UP = previous
 * - At last project, scroll releases to vertical sections
 * - 600-800ms cooldown between transitions
 * - Staggered text animations, image slides from right
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './living-portrait-v6.css'

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════

const PROJECTS = [
  {
    id: 'pikko',
    number: '01',
    category: 'ART DIRECTION',
    subtitle: 'AUSTRALIAN BRAND SPECIALIZING IN CREATIVE DESIGN',
    year: '2024',
    color: '#ff6b5b',
    image: '/projects/studio-identity-800-68d65e3d.avif',
  },
  {
    id: 'entreautre',
    number: '02',
    category: 'ART DIRECTION',
    subtitle: 'CROSS-DISCIPLINARY DESIGN AGENCY',
    year: '2024',
    color: '#ff9a3c',
    image: '/projects/ecommerce-platform-800-1643d532.avif',
  },
  {
    id: 'hiway',
    number: '03',
    category: 'MOTION DESIGN',
    subtitle: 'THE ONLY ALL-IN-ONE CREATIVE OFFER',
    year: '2024',
    color: '#e879f9',
    image: '/projects/interactive-portfolio-800-b7d86403.avif',
  },
  {
    id: 'vaonis',
    number: '04',
    category: 'E-COMMERCE',
    subtitle: 'INNOVATIVE SPACE TECHNOLOGY PLATFORM',
    year: '2025',
    color: '#00ff88',
    image: '/projects/packaging-design-800-e4f2fc53.avif',
  },
]

const EXPERTISE = [
  { number: '01', title: 'Strategy & Advice', tags: ['/AUDIT', '/CONSULTING', '/ROADMAP'], color: '#ff6b5b' },
  { number: '02', title: 'Art Direction', tags: ['/VISUAL IDENTITY', '/GRAPHIC CHARTER', '/UI & UX'], color: '#ff9a3c' },
  { number: '03', title: 'E-commerce', tags: ['/USER JOURNEY', '/CUSTOM SHOPIFY', '/HEADLESS'], color: '#e879f9' },
  { number: '04', title: 'Showcase Website', tags: ['/FRONT-END', '/BACK-END', '/WEBGL'], color: '#00ff88' },
  { number: '05', title: 'Digital Experience', tags: ['/LANDING PAGE', '/3D', '/GAMING'], color: '#00e5ff' },
]

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS (per spec)
// ═══════════════════════════════════════════════════════════════════════════

const smoothEase = [0.32, 0.72, 0, 1]

// Direction-aware variants
const getSlideVariants = (direction) => ({
  initial: { 
    opacity: 0,
  },
  animate: { 
    opacity: 1,
  },
  exit: { 
    opacity: 0,
  },
})

const getNumberVariants = (direction) => ({
  initial: { 
    opacity: 0, 
    scale: 0.8, 
    x: direction > 0 ? 100 : -100 
  },
  animate: { 
    opacity: 0.1, 
    scale: 1, 
    x: 0,
    transition: { duration: 0.7, ease: smoothEase }
  },
  exit: { 
    opacity: 0, 
    scale: 1.1, 
    x: direction > 0 ? -50 : 50,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
})

const getImageVariants = (direction) => ({
  initial: { 
    x: direction > 0 ? '100%' : '-100%', 
    opacity: 0 
  },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.7, ease: smoothEase }
  },
  exit: { 
    x: direction > 0 ? '-20%' : '20%', 
    opacity: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
})

const textItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitV6() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const [isLocked, setIsLocked] = useState(true) // Scroll-hijack active
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const heroRef = useRef(null)
  const lastWheelTime = useRef(0)
  const accumulatedDelta = useRef(0)
  
  const project = PROJECTS[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === PROJECTS.length - 1

  // ─────────────────────────────────────────────────────────────────────────
  // SCROLL HANDLER (The core of Akaru behavior)
  // ─────────────────────────────────────────────────────────────────────────
  
  const handleWheel = useCallback((e) => {
    const now = Date.now()
    const heroRect = heroRef.current?.getBoundingClientRect()
    
    // Check if hero is in viewport
    const heroInView = heroRect && 
      heroRect.top <= 10 && 
      heroRect.bottom > window.innerHeight * 0.5
    
    // If we're in locked mode and hero is visible, hijack scroll
    if (isLocked && heroInView) {
      // Cooldown check (700ms per spec)
      if (now - lastWheelTime.current < 700) {
        e.preventDefault()
        return
      }
      
      // Don't process during transition
      if (isTransitioning) {
        e.preventDefault()
        return
      }
      
      // Accumulate scroll delta for threshold
      accumulatedDelta.current += e.deltaY
      
      // Threshold: need significant scroll intent (80px)
      if (Math.abs(accumulatedDelta.current) < 80) {
        e.preventDefault()
        return
      }
      
      const scrollingDown = accumulatedDelta.current > 0
      accumulatedDelta.current = 0 // Reset accumulator
      
      if (scrollingDown) {
        // SCROLL DOWN
        if (!isLast) {
          e.preventDefault()
          lastWheelTime.current = now
          setIsTransitioning(true)
          setDirection(1)
          setCurrentIndex(prev => prev + 1)
          setTimeout(() => setIsTransitioning(false), 700)
        } else {
          // At last project - release lock, allow vertical scroll
          setIsLocked(false)
        }
      } else {
        // SCROLL UP
        if (!isFirst) {
          e.preventDefault()
          lastWheelTime.current = now
          setIsTransitioning(true)
          setDirection(-1)
          setCurrentIndex(prev => prev - 1)
          setTimeout(() => setIsTransitioning(false), 700)
        }
      }
    }
    
    // Re-engage lock when scrolling back up to hero
    if (!isLocked && heroRect) {
      // If hero bottom is coming back into full view from below
      if (heroRect.bottom >= window.innerHeight && e.deltaY < 0) {
        setIsLocked(true)
        setCurrentIndex(PROJECTS.length - 1) // Start from last project
        setDirection(-1)
      }
    }
  }, [isLocked, isTransitioning, isFirst, isLast])

  // Attach wheel listener
  useEffect(() => {
    const handler = (e) => handleWheel(e)
    window.addEventListener('wheel', handler, { passive: false })
    return () => window.removeEventListener('wheel', handler)
  }, [handleWheel])

  // ─────────────────────────────────────────────────────────────────────────
  // DOT NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────
  
  const goToProject = (index) => {
    if (isTransitioning || index === currentIndex) return
    
    setIsTransitioning(true)
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
    setIsLocked(true)
    
    // Scroll hero into view if needed
    heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    
    setTimeout(() => setIsTransitioning(false), 700)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="akaru-page">
      {/* ═══════════════════════════════════════════════════════════════════
          TOP NAVIGATION
          ═══════════════════════════════════════════════════════════════════ */}
      <nav className="akaru-nav">
        <a href="#expertise">Expertise</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <button className="akaru-nav__menu">
          MENU
          <span className="akaru-nav__dot" />
        </button>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION (100vh, sticky during scroll-hijack)
          ═══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="akaru-hero">
        {/* LEFT PANEL - Fixed */}
        <div className="akaru-hero__left">
          <a href="/" className="akaru-logo">PORTFOLIO</a>
          
          <div className="akaru-mission">
            <p>
              With a focus on precision expertise, our creative studio brings 
              together daring innovation and a meticulous eye for detail to 
              deliver exceptional websites and designs.
            </p>
          </div>

          <div className="akaru-social">
            <div className="akaru-social__line" />
            <div className="akaru-social__links">
              <a href="#">INSTAGRAM</a>
              <a href="#">LINKEDIN</a>
              <a href="#">TWITTER</a>
              <a href="#">FACEBOOK</a>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Dynamic Project Display */}
        <div className="akaru-hero__right">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.id}
              className="akaru-project"
              variants={getSlideVariants(direction)}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              {/* Giant Background Number */}
              <motion.div 
                className="akaru-project__number"
                style={{ color: project.color }}
                variants={getNumberVariants(direction)}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {project.number}
              </motion.div>

              {/* Project Image */}
              <motion.div 
                className="akaru-project__image"
                variants={getImageVariants(direction)}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <img src={project.image} alt={project.subtitle} />
              </motion.div>

              {/* Project Info Stack */}
              <div className="akaru-project__info">
                <motion.span 
                  className="akaru-project__year"
                  variants={textItemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
                >
                  {project.year}
                </motion.span>
                
                <motion.span 
                  className="akaru-project__category"
                  style={{ color: project.color }}
                  variants={textItemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
                >
                  {project.category}
                </motion.span>

                <motion.p 
                  className="akaru-project__subtitle"
                  variants={textItemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                >
                  {project.subtitle}
                </motion.p>

                <motion.a 
                  href={`/projects/${project.id}`}
                  className="akaru-project__cta"
                  style={{ 
                    borderColor: project.color, 
                    color: project.color,
                    '--hover-bg': project.color 
                  }}
                  variants={textItemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: 0.25, duration: 0.4, ease: 'easeOut' }}
                >
                  SEE PROJECT
                </motion.a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="akaru-dots">
            {PROJECTS.map((p, idx) => (
              <button
                key={p.id}
                className={`akaru-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => goToProject(idx)}
                style={{ '--dot-color': p.color }}
                aria-label={`Go to project ${idx + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="akaru-counter">
            <span className="akaru-counter__current">{project.number}</span>
            <span className="akaru-counter__sep">/</span>
            <span className="akaru-counter__total">{String(PROJECTS.length).padStart(2, '0')}</span>
          </div>

          {/* Scroll Indicator */}
          <div className="akaru-scroll-hint">
            <span>SCROLL</span>
            <div className="akaru-scroll-hint__line" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          VERTICAL SECTIONS (after horizontal scroll ends)
          ═══════════════════════════════════════════════════════════════════ */}
      
      {/* Expertise Section */}
      <section id="expertise" className="akaru-expertise">
        <div className="akaru-expertise__header">
          <motion.span 
            className="akaru-expertise__label"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            EXPERTISE
          </motion.span>
          <motion.h2 
            className="akaru-expertise__title"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            aim for quality only
          </motion.h2>
        </div>

        <div className="akaru-expertise__grid">
          {EXPERTISE.map((exp, idx) => (
            <motion.div 
              key={exp.number}
              className="akaru-exp-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              <span className="akaru-exp-card__number" style={{ color: exp.color }}>
                {exp.number}
              </span>
              <h3 className="akaru-exp-card__title">{exp.title}</h3>
              <div className="akaru-exp-card__tags">
                {exp.tags.map((tag, i) => (
                  <span key={i} className="akaru-exp-card__tag">{tag}</span>
                ))}
              </div>
              <a href="#" className="akaru-exp-card__link" style={{ color: exp.color }}>
                SEE EXPERTISE
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="akaru-about">
        <motion.h2 
          className="akaru-about__title"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: smoothEase }}
        >
          We craft beautiful<br/>digital experiences
        </motion.h2>
        
        <motion.div 
          className="akaru-about__values"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          DISCOVER THE AGENCY
        </motion.a>
      </section>

      {/* Contact Section */}
      <section id="contact" className="akaru-contact">
        <motion.h2 
          className="akaru-contact__title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Let's work together
        </motion.h2>
        
        <motion.a 
          href="mailto:contact@portfolio.com"
          className="akaru-contact__email"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          CONTACT@PORTFOLIO.COM
        </motion.a>

        <footer className="akaru-footer">
          <div className="akaru-footer__links">
            <a href="#">INSTAGRAM</a>
            <a href="#">LINKEDIN</a>
            <a href="#">TWITTER</a>
            <a href="#">FACEBOOK</a>
          </div>
          <span className="akaru-footer__copy">PORTFOLIO © 2024</span>
        </footer>
      </section>
    </div>
  )
}
