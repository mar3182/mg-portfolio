/**
 * LIVING PORTRAIT V6 — Akaru.fr Fluid Style
 * 
 * NO static panels - everything is fluid and animated
 * Elements EXPAND and FLOW during scroll transitions
 * Full-screen immersive experience
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import './living-portrait-v6.css'

const SLIDES = [
  {
    id: 'brand',
    number: '01',
    category: 'DIRECTION ARTISTIQUE',
    title: 'Brand Identity',
    subtitle: 'VISUAL SYSTEMS',
    description: 'Creating memorable brand experiences through strategic design and visual storytelling.',
    year: '2024',
    color: '#ff6b5b',
    bgColor: '#0f0a09',
    projects: [
      { name: 'Logo Design', detail: 'Modern minimalist approach' },
      { name: 'Color System', detail: 'Palette creation & application' },
      { name: 'Typography', detail: 'Font selection & hierarchy' },
    ],
  },
  {
    id: 'uiux',
    number: '02',
    category: 'UI/UX DESIGN',
    title: 'Digital Interfaces',
    subtitle: 'USER EXPERIENCE',
    description: 'Crafting intuitive interfaces that delight users and drive engagement.',
    year: '2024',
    color: '#ff9a3c',
    bgColor: '#0f0c08',
    projects: [
      { name: 'Dashboard Design', detail: 'Analytics & monitoring interface' },
      { name: 'Mobile App', detail: 'Touch-optimized interactions' },
      { name: 'Web Portal', detail: 'Responsive & accessible design' },
    ],
  },
  {
    id: 'motion',
    number: '03',
    category: 'MOTION DESIGN',
    title: 'Animation',
    subtitle: 'VISUAL MOTION',
    description: 'Bringing designs to life through fluid animations and micro-interactions.',
    year: '2024',
    color: '#e879f9',
    bgColor: '#0d080f',
    projects: [
      { name: 'Micro Interactions', detail: 'Button states & transitions' },
      { name: 'Page Animations', detail: 'Scroll triggers & reveals' },
      { name: 'Video Production', detail: 'Explainer & promotional content' },
    ],
  },
  {
    id: 'react',
    number: '04',
    category: 'DÉVELOPPEMENT',
    title: 'React & Next.js',
    subtitle: 'FRONTEND',
    description: 'Building performant web applications with modern JavaScript frameworks.',
    year: '2025',
    color: '#00ff88',
    bgColor: '#060f0a',
    projects: [
      { name: 'E-commerce Platform', detail: 'Full-stack React application' },
      { name: 'Portfolio Site', detail: 'Next.js with SSG & ISR' },
      { name: 'SPA Dashboard', detail: 'Real-time data visualization' },
    ],
  },
  {
    id: 'backend',
    number: '05',
    category: 'DÉVELOPPEMENT',
    title: 'Node.js & APIs',
    subtitle: 'BACKEND',
    description: 'Creating robust APIs and server-side solutions for scalable applications.',
    year: '2024',
    color: '#00e5ff',
    bgColor: '#060a0f',
    projects: [
      { name: 'REST APIs', detail: 'Scalable endpoint architecture' },
      { name: 'GraphQL Server', detail: 'Type-safe query language' },
      { name: 'Authentication', detail: 'JWT & OAuth integration' },
    ],
  },
  {
    id: 'cloud',
    number: '06',
    category: 'DEVOPS',
    title: 'Cloud & Infra',
    subtitle: 'INFRASTRUCTURE',
    description: 'Deploying and managing cloud infrastructure with modern DevOps practices.',
    year: '2024',
    color: '#8b5cf6',
    bgColor: '#0a080f',
    projects: [
      { name: 'AWS Deployment', detail: 'EC2, RDS & CloudFront setup' },
      { name: 'Docker & K8s', detail: 'Container orchestration' },
      { name: 'CI/CD Pipeline', detail: 'GitHub Actions automation' },
    ],
  },
]

export default function LivingPortraitV6() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentProject, setCurrentProject] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState('down')
  const containerRef = useRef(null)
  const lastScrollTime = useRef(0)
  const scrollAccumulator = useRef(0)

  const slide = SLIDES[currentSlide]
  const projectCount = slide.projects.length

  // Smooth scroll progress for parallax effects
  const scrollProgress = useMotionValue(0)
  const smoothProgress = useSpring(scrollProgress, { stiffness: 100, damping: 30 })

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    
    const now = Date.now()
    if (now - lastScrollTime.current < 250 || isAnimating) return
    
    const delta = e.deltaY
    if (Math.abs(delta) < 15) return
    
    scrollAccumulator.current += delta
    
    if (Math.abs(scrollAccumulator.current) >= 60) {
      lastScrollTime.current = now
      setIsAnimating(true)
      
      if (scrollAccumulator.current > 0) {
        // Scroll down
        if (currentProject < projectCount - 1) {
          setDirection('down')
          setCurrentProject(prev => prev + 1)
        } else if (currentSlide < SLIDES.length - 1) {
          setDirection('right')
          setCurrentSlide(prev => prev + 1)
          setCurrentProject(0)
        }
      } else {
        // Scroll up
        if (currentProject > 0) {
          setDirection('up')
          setCurrentProject(prev => prev - 1)
        } else if (currentSlide > 0) {
          setDirection('left')
          setCurrentSlide(prev => prev - 1)
          setCurrentProject(SLIDES[currentSlide - 1].projects.length - 1)
        }
      }
      
      scrollAccumulator.current = 0
      setTimeout(() => setIsAnimating(false), 600)
    }
  }, [currentSlide, currentProject, projectCount, isAnimating])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnimating) return
      
      if (e.key === 'ArrowDown') {
        if (currentProject < projectCount - 1) {
          setDirection('down')
          setIsAnimating(true)
          setCurrentProject(prev => prev + 1)
          setTimeout(() => setIsAnimating(false), 600)
        } else if (currentSlide < SLIDES.length - 1) {
          setDirection('right')
          setIsAnimating(true)
          setCurrentSlide(prev => prev + 1)
          setCurrentProject(0)
          setTimeout(() => setIsAnimating(false), 600)
        }
      } else if (e.key === 'ArrowUp') {
        if (currentProject > 0) {
          setDirection('up')
          setIsAnimating(true)
          setCurrentProject(prev => prev - 1)
          setTimeout(() => setIsAnimating(false), 600)
        } else if (currentSlide > 0) {
          setDirection('left')
          setIsAnimating(true)
          setCurrentSlide(prev => prev - 1)
          setCurrentProject(SLIDES[currentSlide - 1].projects.length - 1)
          setTimeout(() => setIsAnimating(false), 600)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, currentProject, projectCount, isAnimating])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  return (
    <div ref={containerRef} className="akaru-fluid">
      {/* Background color transition */}
      <motion.div 
        className="akaru-fluid__bg"
        animate={{ backgroundColor: slide.bgColor }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      />

      {/* Main content */}
      <AnimatePresence mode="wait" custom={direction}>
        <FluidSlide 
          key={`${slide.id}-${currentProject}`}
          slide={slide}
          project={slide.projects[currentProject]}
          projectIndex={currentProject}
          totalProjects={projectCount}
          direction={direction}
          totalSlides={SLIDES.length}
          slideIndex={currentSlide}
        />
      </AnimatePresence>

      {/* Navigation */}
      <nav className="akaru-fluid__nav">
        <a href="/projects">Projects</a>
        <a href="/expertise">Expertise</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>

      {/* Logo */}
      <a href="/" className="akaru-fluid__logo">PORTFOLIO</a>

      {/* Social links */}
      <div className="akaru-fluid__social">
        <a href="#">IG</a>
        <a href="#">LI</a>
        <a href="#">TW</a>
      </div>

      {/* Slide counter */}
      <div className="akaru-fluid__counter">
        <span className="akaru-fluid__counter-current">{slide.number}</span>
        <span className="akaru-fluid__counter-sep">/</span>
        <span className="akaru-fluid__counter-total">{String(SLIDES.length).padStart(2, '0')}</span>
      </div>

      {/* Progress dots */}
      <div className="akaru-fluid__dots">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            className={`akaru-fluid__dot ${idx === currentSlide ? 'akaru-fluid__dot--active' : ''}`}
            onClick={() => {
              if (!isAnimating && idx !== currentSlide) {
                setDirection(idx > currentSlide ? 'right' : 'left')
                setIsAnimating(true)
                setCurrentSlide(idx)
                setCurrentProject(0)
                setTimeout(() => setIsAnimating(false), 600)
              }
            }}
            style={{ 
              '--dot-color': idx === currentSlide ? slide.color : 'rgba(255,255,255,0.2)'
            }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="akaru-fluid__scroll"
        animate={{ opacity: currentSlide === 0 && currentProject === 0 ? 1 : 0.3 }}
      >
        <span>SCROLL</span>
        <motion.div 
          className="akaru-fluid__scroll-line"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLUID SLIDE — Full-screen with expanding elements
   ═══════════════════════════════════════════════════════════════════════════ */

const FluidSlide = memo(function FluidSlide({ 
  slide, 
  project, 
  projectIndex, 
  totalProjects, 
  direction,
  totalSlides,
  slideIndex
}) {
  const isHorizontal = direction === 'left' || direction === 'right'
  const isForward = direction === 'down' || direction === 'right'

  // Different animations for horizontal vs vertical transitions
  const variants = {
    initial: isHorizontal 
      ? { 
          x: isForward ? '100%' : '-100%', 
          opacity: 0,
          scale: 0.9
        }
      : { 
          y: isForward ? 80 : -80, 
          opacity: 0,
          scale: 0.98
        },
    animate: { 
      x: 0, 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        duration: isHorizontal ? 0.7 : 0.5,
        ease: [0.32, 0.72, 0, 1],
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    },
    exit: isHorizontal
      ? { 
          x: isForward ? '-50%' : '50%', 
          opacity: 0,
          scale: 0.95,
          transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
        }
      : { 
          y: isForward ? -40 : 40, 
          opacity: 0,
          scale: 0.98,
          transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] }
        }
  }

  const childVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.div 
      className="akaru-fluid__slide"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Giant background number - expands during transition */}
      <motion.div 
        className="akaru-fluid__number"
        style={{ color: slide.color }}
        initial={{ opacity: 0, scale: 0.5, x: '20%' }}
        animate={{ 
          opacity: 0.06, 
          scale: 1, 
          x: 0,
          transition: { duration: 1, ease: [0.32, 0.72, 0, 1] }
        }}
        exit={{ 
          opacity: 0, 
          scale: 1.2, 
          x: '-20%',
          transition: { duration: 0.5 }
        }}
      >
        {slide.number}
      </motion.div>

      {/* Left content area */}
      <div className="akaru-fluid__left">
        <motion.div 
          className="akaru-fluid__category"
          variants={childVariants}
          style={{ color: slide.color }}
        >
          {slide.category}
        </motion.div>

        <motion.h1 
          className="akaru-fluid__title"
          variants={childVariants}
        >
          {slide.title}
        </motion.h1>

        <motion.h2 
          className="akaru-fluid__subtitle"
          variants={childVariants}
          style={{ color: slide.color }}
        >
          {slide.subtitle}
        </motion.h2>

        <motion.p 
          className="akaru-fluid__description"
          variants={childVariants}
        >
          {slide.description}
        </motion.p>

        <motion.div 
          className="akaru-fluid__cta"
          variants={childVariants}
        >
          <button 
            className="akaru-fluid__button"
            style={{ 
              borderColor: slide.color,
              color: slide.color 
            }}
          >
            SEE EXPERTISE
          </button>
        </motion.div>
      </div>

      {/* Right content - project showcase with expanding effect */}
      <div className="akaru-fluid__right">
        <motion.div 
          className="akaru-fluid__project"
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            scale: 1,
            transition: { duration: 0.7, delay: 0.2, ease: [0.32, 0.72, 0, 1] }
          }}
          exit={{ 
            opacity: 0, 
            x: -40, 
            scale: 0.95,
            transition: { duration: 0.4 }
          }}
        >
          {/* Project image placeholder */}
          <div 
            className="akaru-fluid__project-image"
            style={{ 
              background: `linear-gradient(135deg, ${slide.color}15 0%, ${slide.color}05 50%, transparent 100%)`,
              borderColor: `${slide.color}20`
            }}
          >
            <motion.div 
              className="akaru-fluid__project-overlay"
              style={{ background: `radial-gradient(circle at 30% 30%, ${slide.color}20 0%, transparent 60%)` }}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          {/* Project info */}
          <div className="akaru-fluid__project-info">
            <div className="akaru-fluid__project-year" style={{ color: slide.color }}>
              {slide.year}
            </div>
            <div className="akaru-fluid__project-name">
              {project.name}
            </div>
            <div className="akaru-fluid__project-detail">
              {project.detail}
            </div>
            
            {/* Project dots */}
            <div className="akaru-fluid__project-dots">
              {Array.from({ length: totalProjects }).map((_, i) => (
                <span 
                  key={i} 
                  className={`akaru-fluid__project-dot ${i === projectIndex ? 'active' : ''}`}
                  style={{ 
                    backgroundColor: i === projectIndex ? slide.color : 'rgba(255,255,255,0.2)'
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
})
