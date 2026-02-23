/**
 * ═══════════════════════════════════════════════════════════════════════════
 * T-PORTFOLIO PAGE — Main Entry Point
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The definitive T-shaped portfolio experience.
 * Full scrollable page: Hero → About → Projects → Contact
 * 
 * Navigation sidebar is fixed at page level with scroll-spy.
 * Hero section captures horizontal identity interaction.
 * Sections below use scroll-triggered animations.
 */

import { useState, useCallback, useRef, useEffect, memo } from 'react'
import { motion } from 'framer-motion'
import SplashLoader from '../../components/SplashLoader'
import TPortfolioHero from './TPortfolioHero'
import AboutSection from './AboutSection'
import ProjectsSection from './ProjectsSection'
import ContactSection from './ContactSection'
import './t-portfolio-page.css'

// Navigation items — must match section IDs
const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

// Social links for the right-side bar
const SOCIAL_ICONS = [
  { icon: '○', label: 'Instagram' },
  { icon: '◎', label: 'Dribbble' },
  { icon: '▢', label: 'Twitter' },
]

export default function TPortfolioPage() {
  const [splashComplete, setSplashComplete] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  
  // Section refs for scroll-spy
  const homeRef = useRef(null)
  const aboutRef = useRef(null)
  const workRef = useRef(null)
  const contactRef = useRef(null)
  
  const sectionRefs = useRef({ home: homeRef, about: aboutRef, work: workRef, contact: contactRef })
  
  // Splash completion
  const handleSplashComplete = useCallback(() => {
    setSplashComplete(true)
  }, [])

  // Scroll-spy: observe which section is in view
  useEffect(() => {
    if (!splashComplete) return
    
    const refs = [homeRef, aboutRef, workRef, contactRef]
    
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0
        let activeId = 'home'
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            activeId = entry.target.id || 'home'
          }
        })
        
        if (maxRatio > 0) {
          setActiveSection(activeId)
        }
      },
      { threshold: [0.1, 0.3, 0.5] }
    )
    
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })
    
    return () => observer.disconnect()
  }, [splashComplete])

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId) => {
    const ref = sectionRefs.current[sectionId]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <div className="t-portfolio">
      {/* Splash Loader — M|G → T-shape animation */}
      {!splashComplete && (
        <SplashLoader onComplete={handleSplashComplete} />
      )}

      {/* Fixed Navigation Sidebar */}
      <PageNav
        activeSection={activeSection}
        onNavigate={scrollToSection}
        isVisible={splashComplete}
      />
      
      {/* Fixed Social Links Bar */}
      <PageSocial isVisible={splashComplete} />

      {/* Scrollable content */}
      <motion.div
        className="t-portfolio__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: splashComplete ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* SECTION 1: Hero (100vh) */}
        <div id="home" ref={homeRef}>
          <TPortfolioHero
            isReady={splashComplete}
            onNavigate={() => scrollToSection('work')}
          />
        </div>
        
        {/* SECTION 2: About */}
        <AboutSection sectionRef={aboutRef} />
        
        {/* SECTION 3: Projects */}
        <ProjectsSection sectionRef={workRef} />
        
        {/* SECTION 4: Contact + Footer */}
        <ContactSection sectionRef={contactRef} />
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE-LEVEL NAVIGATION SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════

const PageNav = memo(function PageNav({ activeSection, onNavigate, isVisible }) {
  return (
    <motion.nav
      className="t-portfolio__nav"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="nav-sidebar__logo">
        <span>MG.</span>
      </div>
      
      <ul className="nav-sidebar__list">
        {NAV_ITEMS.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <button
              className={`nav-link ${activeSection === item.id ? 'nav-link--active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
              {activeSection === item.id && <span className="nav-indicator" />}
            </button>
          </motion.li>
        ))}
      </ul>
      
      <div className="nav-sidebar__social">
        {['Be', 'Dr', 'In'].map((abbr, i) => (
          <motion.a
            key={abbr}
            href="#"
            className="nav-social-icon"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            {abbr}
          </motion.a>
        ))}
      </div>
    </motion.nav>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// PAGE-LEVEL SOCIAL LINKS BAR
// ═══════════════════════════════════════════════════════════════════════════

const PageSocial = memo(function PageSocial({ isVisible }) {
  return (
    <motion.div
      className="t-portfolio__social"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {SOCIAL_ICONS.map((link, i) => (
        <motion.a
          key={link.label}
          href="#"
          className="social-link"
          aria-label={link.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 1.2 + i * 0.1 }}
        >
          {link.icon}
        </motion.a>
      ))}
      <motion.div
        className="social-line"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isVisible ? 1 : 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      />
    </motion.div>
  )
})
