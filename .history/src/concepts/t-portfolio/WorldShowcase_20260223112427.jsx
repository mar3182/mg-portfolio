/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WORLD SHOWCASE — Akaru-Style Horizontal Scroll-Hijack
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Scroll DOWN → projects slide HORIZONTALLY (Akaru.fr behavior)
 * Content adapts based on committedSide: 'design' | 'tech' | 'balanced'
 * 
 * When on the last panel and user scrolls down, scroll-hijack releases
 * and page continues to vertical sections below.
 * 
 * Key Akaru behaviors:
 * - Scroll threshold: ~80px before triggering transition
 * - Cooldown: ~700ms between transitions
 * - Images slide from right, text staggers in
 * - Giant background number per project
 * - Dots navigation + counter
 */

import { useState, useRef, useCallback, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './world-showcase.css'

// ═══════════════════════════════════════════════════════════════════
// PROJECT DATA PER WORLD
// ═══════════════════════════════════════════════════════════════════

const DESIGN_PROJECTS = [
  {
    id: 1,
    title: 'Lumina Studio',
    subtitle: 'Complete brand identity for a creative agency — logo, typography system, color palette, and brand guidelines.',
    category: 'BRAND IDENTITY',
    year: '2024',
    color: '#ff6b5b',
    image: null, // placeholder
  },
  {
    id: 2,
    title: 'FlowState App',
    subtitle: 'Productivity application with focus modes, ambient soundscapes, and adaptive UI that responds to user behavior.',
    category: 'UI/UX DESIGN',
    year: '2024',
    color: '#e89a5f',
    image: null,
  },
  {
    id: 3,
    title: 'Cosmic Sequence',
    subtitle: 'Animated brand opener and motion system for a digital agency — SVG morphing, particle effects, and kinetic typography.',
    category: 'MOTION GRAPHICS',
    year: '2024',
    color: '#c4703a',
    image: null,
  },
  {
    id: 4,
    title: 'Verde Organic',
    subtitle: 'Sustainable food brand — packaging design, visual identity, and responsive e-commerce experience.',
    category: 'VISUAL SYSTEMS',
    year: '2023',
    color: '#d4a373',
    image: null,
  },
]

const TECH_PROJECTS = [
  {
    id: 1,
    title: 'DeFi Yield Optimizer',
    subtitle: 'Automated yield farming platform with smart contract integration, multi-chain support, and real-time analytics dashboard.',
    category: 'BLOCKCHAIN / DEFI',
    year: '2025',
    color: '#00ff88',
    image: null,
  },
  {
    id: 2,
    title: 'Urubay SaaS Platform',
    subtitle: 'Microservices-based SaaS with AI integration, event-driven architecture, and real-time collaboration features.',
    category: 'FULL STACK / SAAS',
    year: '2024',
    color: '#00e5ff',
    image: null,
  },
  {
    id: 3,
    title: 'K8s Infrastructure',
    subtitle: 'Production Kubernetes platform on AWS EKS — Terraform IaC, ArgoCD GitOps, observability with Grafana stack.',
    category: 'CLOUD / DEVOPS',
    year: '2024',
    color: '#8b5cf6',
    image: null,
  },
  {
    id: 4,
    title: 'GraphQL Gateway',
    subtitle: 'Unified API gateway federating multiple microservices — auth, rate limiting, caching, and real-time subscriptions.',
    category: 'BACKEND / APIs',
    year: '2024',
    color: '#3a7cc4',
    image: null,
  },
]

// Balanced shows a mix (2 design + 2 tech)
const BALANCED_PROJECTS = [
  DESIGN_PROJECTS[0],
  TECH_PROJECTS[0],
  DESIGN_PROJECTS[1],
  TECH_PROJECTS[1],
]

function getProjectsForSide(side) {
  if (side === 'design') return DESIGN_PROJECTS
  if (side === 'tech') return TECH_PROJECTS
  return BALANCED_PROJECTS
}

// Section header text per side
const SHOWCASE_HEADER = {
  design: { title: 'Design', tagline: 'Where vision meets craft' },
  tech: { title: 'Technology', tagline: 'Where systems meet scale' },
  balanced: { title: 'Selected Work', tagline: 'Design & engineering in harmony' },
}

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  scrollThreshold: 80,    // px of scroll delta before triggering
  cooldownMs: 700,        // ms between transitions
  transitionDuration: 0.7, // seconds
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

const WorldShowcase = memo(function WorldShowcase({ committedSide = 'balanced', sectionRef }) {
  const projects = getProjectsForSide(committedSide)
  const header = SHOWCASE_HEADER[committedSide] || SHOWCASE_HEADER.balanced
  const totalProjects = projects.length

  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const [isHijacking, setIsHijacking] = useState(true)
  const containerRef = useRef(null)
  const cooldownRef = useRef(false)
  const scrollAccumRef = useRef(0)

  // Reset when side changes
  useEffect(() => {
    setActiveIndex(0)
    setDirection(1)
    setIsHijacking(true)
    scrollAccumRef.current = 0
  }, [committedSide])

  // ─── Scroll Hijack Logic (Akaru-style) ───
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e) => {
      if (!isHijacking) return

      // Always prevent default scroll while hijacking to avoid
      // the About section scrolling up behind the sticky showcase
      e.preventDefault()

      // Accumulate scroll delta
      scrollAccumRef.current += Math.abs(e.deltaY)

      // Check if threshold reached
      if (scrollAccumRef.current < CONFIG.scrollThreshold) return
      scrollAccumRef.current = 0

      // Check cooldown
      if (cooldownRef.current) return
      cooldownRef.current = true
      setTimeout(() => { cooldownRef.current = false }, CONFIG.cooldownMs)

      if (e.deltaY > 0) {
        // Scroll DOWN → next project
        if (activeIndex < totalProjects - 1) {
          setDirection(1)
          setActiveIndex(prev => prev + 1)
        } else {
          // Last project → release scroll hijack
          setIsHijacking(false)
        }
      } else {
        // Scroll UP → previous project
        if (activeIndex > 0) {
          setDirection(-1)
          setActiveIndex(prev => prev - 1)
        }
        // At first project, scrolling up does nothing (hero above handles it)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [activeIndex, totalProjects, isHijacking])

  // Re-engage hijack when scrolling back into view
  useEffect(() => {
    if (isHijacking) return
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
          setIsHijacking(true)
          setActiveIndex(totalProjects - 1)
        }
      },
      { threshold: [0.8] }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [isHijacking, totalProjects])

  // Direct navigation via dots
  const goToProject = useCallback((index) => {
    if (cooldownRef.current) return
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
    cooldownRef.current = true
    setTimeout(() => { cooldownRef.current = false }, CONFIG.cooldownMs)
  }, [activeIndex])

  const activeProject = projects[activeIndex]
  const sideClass = committedSide === 'design' ? 'design' : committedSide === 'tech' ? 'tech' : 'balanced'

  return (
    <section
      id="work"
      ref={(el) => {
        containerRef.current = el
        if (sectionRef) sectionRef.current = el
      }}
      className={`world-showcase world-showcase--${sideClass}`}
      data-hijacking={isHijacking}
    >
      {/* ── Left Panel (Fixed info) ── */}
      <div className="world-showcase__left">
        <div className="world-showcase__header">
          <h2 className="world-showcase__title">{header.title}</h2>
          <p className="world-showcase__tagline">{header.tagline}</p>
        </div>

        {/* Navigation dots */}
        <div className="world-showcase__dots">
          {projects.map((_, i) => (
            <button
              key={i}
              className={`showcase-dot ${i === activeIndex ? 'showcase-dot--active' : ''}`}
              onClick={() => goToProject(i)}
              aria-label={`Go to project ${i + 1}`}
              style={i === activeIndex ? { backgroundColor: activeProject.color } : undefined}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="world-showcase__counter">
          <span className="counter__current">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className="counter__sep">/</span>
          <span className="counter__total">
            {String(totalProjects).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ── Right Panel (Dynamic project content) ── */}
      <div className="world-showcase__right">
        {/* Giant background number */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`num-${activeIndex}`}
            className="world-showcase__bg-number"
            style={{ color: activeProject.color }}
            initial={{ opacity: 0, scale: 0.8, x: direction * 80 }}
            animate={{ opacity: 0.08, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.1, x: direction * -60 }}
            transition={{ duration: CONFIG.transitionDuration, ease: [0.32, 0.72, 0, 1] }}
          >
            {String(activeIndex + 1).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>

        {/* Project image area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${activeProject.id}-${activeIndex}`}
            className="world-showcase__image"
            initial={{ opacity: 0, x: direction * 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -150 }}
            transition={{ duration: CONFIG.transitionDuration, ease: [0.32, 0.72, 0, 1] }}
          >
            {activeProject.image ? (
              <img src={activeProject.image} alt={activeProject.title} />
            ) : (
              <div
                className="world-showcase__placeholder"
                style={{
                  background: `linear-gradient(135deg, ${activeProject.color}22, ${activeProject.color}44)`,
                  borderColor: `${activeProject.color}33`,
                }}
              >
                <span style={{ color: activeProject.color }}>{activeProject.category}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Project info stack */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${activeProject.id}-${activeIndex}`}
            className="world-showcase__info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              className="world-showcase__year"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {activeProject.year}
            </motion.span>

            <motion.span
              className="world-showcase__category"
              style={{ color: activeProject.color }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              {activeProject.category}
            </motion.span>

            <motion.h3
              className="world-showcase__project-title"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {activeProject.title}
            </motion.h3>

            <motion.p
              className="world-showcase__subtitle"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4 }}
            >
              {activeProject.subtitle}
            </motion.p>

            <motion.button
              className="world-showcase__cta"
              style={{
                borderColor: activeProject.color,
                color: activeProject.color,
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              whileHover={{
                backgroundColor: activeProject.color,
                color: '#0d0d0d',
              }}
            >
              SEE PROJECT
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scroll hint (only on first project) */}
      {activeIndex === 0 && isHijacking && (
        <motion.div
          className="world-showcase__scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5 }}
        >
          <span>SCROLL</span>
          <motion.div
            className="scroll-hint__line"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </motion.div>
      )}
    </section>
  )
})

export default WorldShowcase
