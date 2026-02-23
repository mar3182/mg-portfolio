/**
 * LIVING PORTRAIT V6 — True Akaru.fr Style
 * 
 * The CORRECT behavior:
 * - Left panel is COMPLETELY FIXED (never moves)
 * - Right panel slides HORIZONTALLY when you scroll vertically
 * - Large project numbers (01, 02, 03)
 * - Big typography, full-screen slides
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './living-portrait-v6.css'

// Projects/Slides data
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
    bgColor: '#1a1210',
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
    bgColor: '#1a1510',
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
    bgColor: '#1a1018',
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
    bgColor: '#0a1a12',
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
    bgColor: '#0a1518',
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
    bgColor: '#12101a',
  },
]

export default function LivingPortraitV6() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef(null)
  const lastScrollTime = useRef(0)

  const slide = SLIDES[currentSlide]

  // Handle wheel - vertical scroll triggers horizontal slide change
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    
    const now = Date.now()
    // Debounce - wait 800ms between transitions for smooth feel
    if (now - lastScrollTime.current < 800 || isAnimating) return
    
    const delta = e.deltaY
    if (Math.abs(delta) < 20) return // Ignore tiny scrolls
    
    lastScrollTime.current = now
    setIsAnimating(true)
    
    if (delta > 0 && currentSlide < SLIDES.length - 1) {
      // Scroll down = next slide
      setCurrentSlide(prev => prev + 1)
    } else if (delta < 0 && currentSlide > 0) {
      // Scroll up = previous slide
      setCurrentSlide(prev => prev - 1)
    }
    
    // Release animation lock
    setTimeout(() => setIsAnimating(false), 700)
  }, [currentSlide, isAnimating])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (currentSlide < SLIDES.length - 1 && !isAnimating) {
          setIsAnimating(true)
          setCurrentSlide(prev => prev + 1)
          setTimeout(() => setIsAnimating(false), 700)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (currentSlide > 0 && !isAnimating) {
          setIsAnimating(true)
          setCurrentSlide(prev => prev - 1)
          setTimeout(() => setIsAnimating(false), 700)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, isAnimating])

  // Setup wheel listener
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  return (
    <div ref={containerRef} className="akaru">
      {/* ══════════════════════════════════════════════════════════════════
          LEFT PANEL — Completely Fixed
          ══════════════════════════════════════════════════════════════════ */}
      <div className="akaru-left">
        <a href="/" className="akaru-left__logo">PORTFOLIO</a>
        
        <div className="akaru-left__content">
          <p className="akaru-left__intro">
            With a focus on creative excellence, this portfolio brings together 
            innovative design and cutting-edge development to deliver exceptional 
            digital experiences.
          </p>
        </div>
        
        <div className="akaru-left__footer">
          <div className="akaru-left__line" />
          <div className="akaru-left__social">
            <a href="#">GITHUB</a>
            <a href="#">LINKEDIN</a>
            <a href="#">TWITTER</a>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          RIGHT PANEL — Horizontal Slides
          ══════════════════════════════════════════════════════════════════ */}
      <div className="akaru-right">
        <AnimatePresence mode="wait">
          <Slide key={slide.id} slide={slide} />
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          NAVIGATION — Top right
          ══════════════════════════════════════════════════════════════════ */}
      <nav className="akaru-nav">
        <a href="/projects">Projects</a>
        <a href="/expertise">Expertise</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════
          SLIDE INDICATOR — Bottom right
          ══════════════════════════════════════════════════════════════════ */}
      <div className="akaru-indicator">
        <span className="akaru-indicator__current">{slide.number}</span>
        <span className="akaru-indicator__separator">/</span>
        <span className="akaru-indicator__total">{String(SLIDES.length).padStart(2, '0')}</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          DOTS NAVIGATION
          ══════════════════════════════════════════════════════════════════ */}
      <div className="akaru-dots">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            className={`akaru-dots__dot ${idx === currentSlide ? 'akaru-dots__dot--active' : ''}`}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true)
                setCurrentSlide(idx)
                setTimeout(() => setIsAnimating(false), 700)
              }
            }}
            style={{ 
              '--dot-color': idx === currentSlide ? s.color : 'rgba(255,255,255,0.3)'
            }}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="akaru-scroll-hint">
        <motion.div 
          className="akaru-scroll-hint__line"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SLIDE COMPONENT — Each horizontal panel
   ═══════════════════════════════════════════════════════════════════════════ */

const Slide = memo(function Slide({ slide }) {
  return (
    <motion.div 
      className="akaru-slide"
      style={{ backgroundColor: slide.bgColor }}
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ 
        duration: 0.7, 
        ease: [0.32, 0.72, 0, 1] // Custom easing like Akaru
      }}
    >
      {/* Large background number */}
      <motion.div 
        className="akaru-slide__number"
        style={{ color: slide.color }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {slide.number}
      </motion.div>

      {/* Content */}
      <div className="akaru-slide__content">
        <motion.span 
          className="akaru-slide__category"
          style={{ color: slide.color }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {slide.category}
        </motion.span>
        
        <motion.span 
          className="akaru-slide__year"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {slide.year}
        </motion.span>

        <motion.h1 
          className="akaru-slide__title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {slide.title}
        </motion.h1>

        <motion.h2 
          className="akaru-slide__subtitle"
          style={{ color: slide.color }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {slide.subtitle}
        </motion.h2>

        <motion.p 
          className="akaru-slide__description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {slide.description}
        </motion.p>

        <motion.button 
          className="akaru-slide__cta"
          style={{ 
            borderColor: slide.color,
            color: slide.color 
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ 
            backgroundColor: slide.color,
            color: '#0a0a0a'
          }}
        >
          VIEW PROJECT
        </motion.button>
      </div>

      {/* Visual element */}
      <motion.div 
        className="akaru-slide__visual"
        initial={{ opacity: 0, scale: 0.9, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <div 
          className="akaru-slide__image"
          style={{ 
            background: `linear-gradient(135deg, ${slide.color}20 0%, ${slide.color}05 100%)`,
            borderColor: `${slide.color}30`
          }}
        />
      </motion.div>
    </motion.div>
  )
})
