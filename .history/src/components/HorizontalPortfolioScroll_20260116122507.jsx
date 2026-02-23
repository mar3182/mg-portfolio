/**
 * HorizontalPortfolioScroll — Continuous horizontal scroll experience
 * 
 * Three-panel horizontal layout:
 * - Left: Design section with floral growth background
 * - Center: Hero with split portrait
 * - Right: Tech section with matrix rain background
 * 
 * Navigation:
 * - Mouse position provides peek/preview
 * - Horizontal scroll or swipe moves between sections
 * - Click on sides triggers smooth scroll to that section
 */

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion as Motion, useTransform, useScroll } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import FloralGrowthEffect from './FloralGrowthEffect'
import MatrixRainEffect from './MatrixRainEffect'
import './styles/horizontal-portfolio.css'

// Filter projects by side
const designProjects = projects.filter(p => 
  p.spectrum && (p.spectrum.design / (p.spectrum.design + p.spectrum.tech)) > 0.5
).slice(0, 4)

const techProjects = projects.filter(p => 
  p.spectrum && (p.spectrum.tech / (p.spectrum.design + p.spectrum.tech)) >= 0.5
).slice(0, 4)

// Project card component
function ProjectCard({ project, side, index }) {
  return (
    <Motion.article
      className={`hps-project-card hps-project-card--${side}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={`/projects/${project.slug}`} className="hps-project-link">
        <div 
          className="hps-project-image"
          style={{ backgroundColor: project.color }}
        >
          {project.image && (
            <img src={project.image} alt={project.title} loading="lazy" />
          )}
        </div>
        <div className="hps-project-info">
          <span className="hps-project-category">{project.category}</span>
          <h3 className="hps-project-title">{project.title}</h3>
        </div>
      </Link>
    </Motion.article>
  )
}

export default function HorizontalPortfolioScroll({
  designImage = '/portrait-design-nb.png',
  techImage = '/portrait-tech-nb.png',
  isReady = true,
}) {
  const containerRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const [activeSection, setActiveSection] = useState('center') // 'design' | 'center' | 'tech'
  
  // Scroll progress (0 = design, 0.5 = center, 1 = tech)
  const { scrollXProgress } = useScroll({ container: scrollContainerRef })
  
  // Transform scroll progress to section indicator
  useEffect(() => {
    const unsubscribe = scrollXProgress.on('change', (progress) => {
      if (progress < 0.33) {
        setActiveSection('design')
      } else if (progress > 0.66) {
        setActiveSection('tech')
      } else {
        setActiveSection('center')
      }
    })
    return unsubscribe
  }, [scrollXProgress])
  
  // Avatar scale based on scroll
  const avatarScale = useTransform(scrollXProgress, [0, 0.25, 0.5, 0.75, 1], [0.7, 0.85, 1, 0.85, 0.7])
  
  // Portrait rotation based on scroll
  const designRotateY = useTransform(scrollXProgress, [0, 0.5], [0, 90])
  const techRotateY = useTransform(scrollXProgress, [0.5, 1], [-90, 0])
  const designOpacity = useTransform(scrollXProgress, [0, 0.35, 0.5], [1, 0.5, 0])
  const techOpacity = useTransform(scrollXProgress, [0.5, 0.65, 1], [0, 0.5, 1])
  
  // Handle mouse movement for peek effect (only in center)
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || activeSection !== 'center') return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    mouseX.set(Math.max(0, Math.min(1, x)))
  }, [mouseX, activeSection])
  
  // Scroll to section
  const scrollToSection = useCallback((section) => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const sectionWidth = container.scrollWidth / 3
    
    let targetX = sectionWidth // center by default
    if (section === 'design') targetX = 0
    if (section === 'tech') targetX = sectionWidth * 2
    
    container.scrollTo({ left: targetX, behavior: 'smooth' })
  }, [])
  
  // Initialize scroll to center
  useEffect(() => {
    if (scrollContainerRef.current && isReady) {
      const container = scrollContainerRef.current
      const centerX = container.scrollWidth / 3
      container.scrollTo({ left: centerX, behavior: 'instant' })
    }
  }, [isReady])
  
  // Click handlers for navigation hints
  const handleDesignClick = () => scrollToSection('design')
  const handleTechClick = () => scrollToSection('tech')
  const handleCenterClick = () => scrollToSection('center')

  return (
    <div 
      ref={containerRef}
      className="horizontal-portfolio-scroll"
      onMouseMove={handleMouseMove}
    >
      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="hps-scroll-container"
      >
        {/* ═══════════════════════════════════════════════════════════
            DESIGN SECTION (Left)
            ═══════════════════════════════════════════════════════════ */}
        <section className="hps-section hps-section--design">
          <FloralGrowthEffect isActive={activeSection === 'design'} side="left" />
          
          <div className="hps-section-content">
            <header className="hps-section-header">
              <Motion.h1 
                className="hps-title hps-title--design"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                Design
              </Motion.h1>
              <p className="hps-subtitle">
                Creative vision meets strategic thinking
              </p>
            </header>
            
            <div className="hps-projects-grid">
              {designProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} side="design" index={i} />
              ))}
            </div>
            
            <Link to="/projects?filter=design" className="hps-view-all hps-view-all--design">
              View all design work →
            </Link>
          </div>
          
          {/* Avatar on this section */}
          <div className="hps-avatar hps-avatar--design">
            <img src={designImage} alt="Designer" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            CENTER SECTION (Hero)
            ═══════════════════════════════════════════════════════════ */}
        <section className="hps-section hps-section--center">
          <div className="hps-hero">
            {/* Navigation hints */}
            <button 
              className="hps-nav-hint hps-nav-hint--left"
              onClick={handleDesignClick}
              aria-label="Scroll to Design section"
            >
              <span className="hps-nav-arrow">←</span>
              <span className="hps-nav-label">Design</span>
            </button>
            
            {/* Portrait container */}
            <Motion.div 
              className="hps-portrait-container"
              style={{ scale: avatarScale }}
            >
              {/* Design face */}
              <Motion.div 
                className="hps-portrait-face hps-portrait-face--design"
                style={{ rotateY: designRotateY, opacity: designOpacity }}
              >
                <img src={designImage} alt="Designer portrait" />
              </Motion.div>
              
              {/* Tech face */}
              <Motion.div 
                className="hps-portrait-face hps-portrait-face--tech"
                style={{ rotateY: techRotateY, opacity: techOpacity }}
              >
                <img src={techImage} alt="Coder portrait" />
              </Motion.div>
            </Motion.div>
            
            {/* T-shaped tagline */}
            <div className="hps-tagline">
              <div className="hps-t-horizontal" />
              <div className="hps-t-vertical" />
              <span className="hps-t-text">The T-Shaped Professional</span>
            </div>
            
            <button 
              className="hps-nav-hint hps-nav-hint--right"
              onClick={handleTechClick}
              aria-label="Scroll to Tech section"
            >
              <span className="hps-nav-label">Tech</span>
              <span className="hps-nav-arrow">→</span>
            </button>
          </div>
          
          {/* Scroll indicator */}
          <div className="hps-scroll-indicator">
            <span>← Scroll to explore →</span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TECH SECTION (Right)
            ═══════════════════════════════════════════════════════════ */}
        <section className="hps-section hps-section--tech">
          <MatrixRainEffect isActive={activeSection === 'tech'} />
          
          <div className="hps-section-content">
            <header className="hps-section-header">
              <Motion.h1 
                className="hps-title hps-title--tech"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {'<Tech />'}
              </Motion.h1>
              <p className="hps-subtitle">
                Clean code. Elegant solutions.
              </p>
            </header>
            
            <div className="hps-projects-grid">
              {techProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} side="tech" index={i} />
              ))}
            </div>
            
            <Link to="/projects?filter=tech" className="hps-view-all hps-view-all--tech">
              ← View all tech projects
            </Link>
          </div>
          
          {/* Avatar on this section */}
          <div className="hps-avatar hps-avatar--tech">
            <img src={techImage} alt="Coder" />
          </div>
        </section>
      </div>
      
      {/* Section indicator dots */}
      <div className="hps-section-dots">
        <button 
          className={`hps-dot ${activeSection === 'design' ? 'is-active' : ''}`}
          onClick={handleDesignClick}
          aria-label="Go to Design"
        />
        <button 
          className={`hps-dot ${activeSection === 'center' ? 'is-active' : ''}`}
          onClick={handleCenterClick}
          aria-label="Go to Center"
        />
        <button 
          className={`hps-dot ${activeSection === 'tech' ? 'is-active' : ''}`}
          onClick={handleTechClick}
          aria-label="Go to Tech"
        />
      </div>
    </div>
  )
}
