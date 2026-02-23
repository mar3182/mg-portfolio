/**
 * LIVING PORTRAIT V6 — Akaru.fr Exact Implementation (Corrected)
 * 
 * CORRECT BEHAVIOR:
 * 1. NO sidebar initially - hero is FULL SCREEN
 * 2. Elements EXPAND from bottom-right corner, scaling up
 * 3. Sidebar slides in LATER (after horizontal scroll phase ends)
 * 4. Scroll DOWN = next project with expand animation
 * 5. Scroll UP = previous project
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
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════

const smoothEase = [0.32, 0.72, 0, 1]

// Elements expand from bottom-right corner
const expandVariants = {
  initial: { 
    scale: 0.7,
    opacity: 0,
    x: '30%',
    y: '20%',
    transformOrigin: 'bottom right'
  },
  animate: { 
    scale: 1,
    opacity: 1,
    x: 0,
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: smoothEase 
    }
  },
  exit: { 
    scale: 0.9,
    opacity: 0,
    x: '-10%',
    y: '-5%',
    transition: { 
      duration: 0.5, 
      ease: 'easeOut' 
    }
  },
}

const numberVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.5, 
    x: 200,
    y: 100,
    transformOrigin: 'bottom right'
  },
  animate: { 
    opacity: 0.08, 
    scale: 1, 
    x: 0,
    y: 0,
    transition: { duration: 0.9, ease: smoothEase }
  },
  exit: { 
    opacity: 0, 
    scale: 1.1, 
    x: -100,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
}

const imageVariants = {
  initial: { 
    scale: 0.6,
    opacity: 0,
    x: '50%',
    y: '30%',
    transformOrigin: 'bottom right'
  },
  animate: { 
    scale: 1,
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.8, ease: smoothEase }
  },
  exit: { 
    scale: 0.95,
    opacity: 0,
    x: '-15%',
    transition: { duration: 0.5, ease: 'easeOut' }
  },
}

const textVariants = {
  initial: { opacity: 0, y: 40, x: 20 },
  animate: { opacity: 1, y: 0, x: 0 },
  exit: { opacity: 0, y: -20 },
}

// Sidebar slide-in animation
const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: smoothEase }
  },
}

// Sidebar content container - staggers children
const sidebarContentVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.08
    }
  }
}

// Individual project item in sidebar list
const sidebarItemVariants = {
  hidden: { opacity: 0, y: 30, x: -10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivingPortraitV6() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLocked, setIsLocked] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false) // Sidebar hidden initially
  
  const heroRef = useRef(null)
  const lastWheelTime = useRef(0)
  const accumulatedDelta = useRef(0)
  
  const project = PROJECTS[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === PROJECTS.length - 1

  // ─────────────────────────────────────────────────────────────────────────
  // SCROLL HANDLER
  // ─────────────────────────────────────────────────────────────────────────
  
  const handleWheel = useCallback((e) => {
    const now = Date.now()
    const heroRect = heroRef.current?.getBoundingClientRect()
    
    const heroInView = heroRect && 
      heroRect.top <= 10 && 
      heroRect.bottom > window.innerHeight * 0.5
    
    if (isLocked && heroInView) {
      if (now - lastWheelTime.current < 700) {
        e.preventDefault()
        return
      }
      
      if (isTransitioning) {
        e.preventDefault()
        return
      }
      
      accumulatedDelta.current += e.deltaY
      
      if (Math.abs(accumulatedDelta.current) < 80) {
        e.preventDefault()
        return
      }
      
      const scrollingDown = accumulatedDelta.current > 0
      accumulatedDelta.current = 0
      
      if (scrollingDown) {
        if (!isLast) {
          e.preventDefault()
          lastWheelTime.current = now
          setIsTransitioning(true)
          setCurrentIndex(prev => prev + 1)
          setTimeout(() => setIsTransitioning(false), 800)
        } else {
          // At last project - show sidebar and release lock
          setShowSidebar(true)
          setIsLocked(false)
        }
      } else {
        if (!isFirst) {
          e.preventDefault()
          lastWheelTime.current = now
          setIsTransitioning(true)
          setCurrentIndex(prev => prev - 1)
          setTimeout(() => setIsTransitioning(false), 800)
        }
      }
    }
    
    // Re-engage lock when scrolling back up to hero
    if (!isLocked && heroRect) {
      if (heroRect.bottom >= window.innerHeight && e.deltaY < 0) {
        setIsLocked(true)
        setShowSidebar(false) // Hide sidebar when going back
        setCurrentIndex(PROJECTS.length - 1)
      }
    }
  }, [isLocked, isTransitioning, isFirst, isLast])

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
    setCurrentIndex(index)
    setIsLocked(true)
    setShowSidebar(false)
    
    heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    
    setTimeout(() => setIsTransitioning(false), 800)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="akaru-page">
      {/* TOP NAVIGATION */}
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
          HERO SECTION - FULL SCREEN (no sidebar initially)
          ═══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className={`akaru-hero ${showSidebar ? 'with-sidebar' : ''}`}>
        
        {/* SIDEBAR - Slides in AFTER horizontal scroll ends */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div 
              className="akaru-sidebar"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <a href="/" className="akaru-logo">PORTFOLIO</a>
              
              {/* Projects List - Each item appears one by one */}
              <motion.nav 
                className="akaru-sidebar__projects"
                variants={sidebarContentVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.span 
                  className="akaru-sidebar__label"
                  variants={sidebarItemVariants}
                >
                  PROJECTS
                </motion.span>
                {PROJECTS.map((proj, i) => (
                  <motion.button
                    key={proj.id}
                    className={`akaru-sidebar__project ${currentIndex === i ? 'active' : ''}`}
                    variants={sidebarItemVariants}
                    onClick={() => goToProject(i)}
                    style={{ '--accent': proj.color }}
                  >
                    <span className="akaru-sidebar__project-num">{proj.number}</span>
                    <span className="akaru-sidebar__project-cat">{proj.category}</span>
                  </motion.button>
                ))}
              </motion.nav>

              <div className="akaru-sidebar__bottom">
                <motion.div 
                  className="akaru-mission"
                  variants={sidebarContentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.p variants={sidebarItemVariants}>
                    With a focus on precision expertise, our creative studio brings 
                    together daring innovation and a meticulous eye for detail.
                  </motion.p>
                </motion.div>

                <motion.div 
                  className="akaru-social"
                  variants={sidebarContentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="akaru-social__line" variants={sidebarItemVariants} />
                  <motion.div className="akaru-social__links" variants={sidebarItemVariants}>
                    <a href="#">INSTAGRAM</a>
                    <a href="#">LINKEDIN</a>
                    <a href="#">TWITTER</a>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN PROJECT AREA - Full screen initially */}
        <div className="akaru-hero__main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.id}
              className="akaru-project"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Giant Background Number - expands from bottom-right */}
              <motion.div 
                className="akaru-project__number"
                style={{ color: project.color }}
                variants={numberVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {project.number}
              </motion.div>

              {/* Project Image - expands from bottom-right */}
              <motion.div 
                className="akaru-project__image"
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <img src={project.image} alt={project.subtitle} />
              </motion.div>

              {/* Project Info - expands/fades in with stagger */}
              <div className="akaru-project__info">
                <motion.span 
                  className="akaru-project__year"
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
                >
                  {project.year}
                </motion.span>
                
                <motion.span 
                  className="akaru-project__category"
                  style={{ color: project.color }}
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
                >
                  {project.category}
                </motion.span>

                <motion.p 
                  className="akaru-project__subtitle"
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
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
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
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
          VERTICAL SECTIONS
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
          </div>
          <span className="akaru-footer__copy">PORTFOLIO © 2024</span>
        </footer>
      </section>
    </div>
  )
}
