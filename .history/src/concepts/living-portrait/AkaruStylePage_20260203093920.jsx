/**
 * AKARU-STYLE PROJECT PAGE
 * 
 * Recreating the Akaru.fr project page style:
 * - Smooth vertical scroll with parallax
 * - Large typography
 * - Image galleries with animations
 * - Clean sections with reveal effects
 */

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import './akaru-style.css'

// Project data (mimicking Sanctuary project)
const PROJECT = {
  title: 'Portfolio Experience',
  subtitle: 'CREATIVE DEVELOPER',
  year: '2025',
  category: 'DIRECTION ARTISTIQUE',
  heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80',
  tags: ['React Development', 'Motion Design', 'UI/UX Design', 'Creative Coding'],
  intro: `Une aventure créative alliant design et technologie. Ce portfolio représente 
    l'intersection entre l'art visuel et le développement web moderne, créant une 
    expérience immersive et mémorable pour chaque visiteur.`,
  sections: [
    {
      id: 'experience',
      title: 'SITE VITRINE EXPERIENCE',
      content: `Conception d'un portfolio web axé sur l'expérience, visant à démontrer 
        l'expertise technique et créative. L'accent est mis sur un design soigné et 
        une technologie de pointe avec React et Framer Motion.`,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
        'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=1200&q=80',
      ]
    },
    {
      id: 'approach',
      title: 'UN ACCOMPAGNEMENT COMPLET',
      content: `De la direction artistique au développement front-end, chaque détail 
        a été pensé pour créer une expérience cohérente. L'utilisation de technologies 
        modernes permet des animations fluides et des transitions élégantes.`,
      images: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      ]
    },
    {
      id: 'responsive',
      title: 'RESPONSIVE DESIGN',
      content: `La dimension mobile n'a pas été négligée. La fluidité de la navigation 
        et la richesse visuelle sont préservées sur tous les appareils, permettant à 
        chacun de découvrir cette expérience créative.`,
      mobileImages: [
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&q=80',
        'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?w=600&q=80',
      ]
    },
    {
      id: 'tech',
      title: 'TECHNOLOGIES MODERNES',
      content: `Intégration de React, Framer Motion et CSS moderne pour créer des 
        animations fluides et des interactions naturelles. Chaque élément a été 
        optimisé pour la performance.`,
      images: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
      ]
    },
  ]
}

export default function AkaruStylePage() {
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div ref={containerRef} className="akaru">
      {/* Progress bar */}
      <motion.div 
        className="akaru-progress"
        style={{ scaleX: smoothProgress }}
      />
      
      {/* Navigation */}
      <nav className="akaru-nav">
        <a href="/" className="akaru-nav__logo">MG</a>
        <div className="akaru-nav__links">
          <a href="/projets">Projets</a>
          <a href="/expertises">Expertises</a>
          <a href="/contact">Contact</a>
        </div>
      </nav>
      
      {/* Hero Section */}
      <HeroSection project={PROJECT} scrollProgress={smoothProgress} />
      
      {/* Intro Section */}
      <IntroSection project={PROJECT} />
      
      {/* Content Sections */}
      {PROJECT.sections.map((section, index) => (
        <ContentSection 
          key={section.id} 
          section={section} 
          index={index}
        />
      ))}
      
      {/* Footer CTA */}
      <FooterSection />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function HeroSection({ project, scrollProgress }) {
  const y = useTransform(scrollProgress, [0, 0.3], [0, -150])
  const opacity = useTransform(scrollProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollProgress, [0, 0.3], [1, 1.1])
  
  return (
    <section className="akaru-hero">
      {/* Background image with parallax */}
      <motion.div 
        className="akaru-hero__bg"
        style={{ scale }}
      >
        <img src={project.heroImage} alt={project.title} />
        <div className="akaru-hero__overlay" />
      </motion.div>
      
      {/* Content */}
      <motion.div 
        className="akaru-hero__content"
        style={{ y, opacity }}
      >
        <motion.span 
          className="akaru-hero__category"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {project.category}
        </motion.span>
        
        <motion.span 
          className="akaru-hero__year"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {project.year}
        </motion.span>
        
        <motion.h1 
          className="akaru-hero__title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {project.subtitle}
        </motion.h1>
        
        {/* Tags */}
        <motion.div 
          className="akaru-hero__tags"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {project.tags.map((tag, i) => (
            <span key={i} className="akaru-hero__tag">{tag}</span>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="akaru-hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div 
          className="akaru-hero__scroll-line"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTRO SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function IntroSection({ project }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  
  return (
    <motion.section 
      ref={ref}
      className="akaru-intro"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <motion.p 
        className="akaru-intro__text"
        style={{ y }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {project.intro}
      </motion.p>
    </motion.section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTENT SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function ContentSection({ section, index }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100])
  
  const isReversed = index % 2 === 1
  
  return (
    <section 
      ref={ref}
      className={`akaru-section ${isReversed ? 'akaru-section--reversed' : ''}`}
    >
      <div className="akaru-section__content">
        <motion.h2 
          className="akaru-section__title"
          initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {section.title}
        </motion.h2>
        
        <motion.p 
          className="akaru-section__text"
          style={{ y }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {section.content}
        </motion.p>
      </div>
      
      {/* Images */}
      <div className="akaru-section__images">
        {section.mobileImages ? (
          <div className="akaru-section__mobile-grid">
            {section.mobileImages.map((img, i) => (
              <motion.div
                key={i}
                className="akaru-section__mobile-img"
                style={{ y: imageY }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <img src={img} alt={`Mobile ${i + 1}`} />
              </motion.div>
            ))}
          </div>
        ) : (
          section.images?.map((img, i) => (
            <motion.div
              key={i}
              className="akaru-section__img"
              style={{ y: i === 0 ? imageY : undefined }}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              <img src={img} alt={section.title} />
            </motion.div>
          ))
        )}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function FooterSection() {
  return (
    <footer className="akaru-footer">
      <motion.div 
        className="akaru-footer__content"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="akaru-footer__label">VOIR LE PROJET</span>
        <a href="/" className="akaru-footer__link">
          <span>Retour à l'accueil</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </a>
      </motion.div>
      
      <div className="akaru-footer__bottom">
        <p>© 2025 — Tous droits réservés</p>
        <div className="akaru-footer__socials">
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">GitHub</a>
        </div>
      </div>
    </footer>
  )
}
