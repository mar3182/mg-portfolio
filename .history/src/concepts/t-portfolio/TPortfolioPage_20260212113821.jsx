/**
 * ═══════════════════════════════════════════════════════════════════════════
 * T-PORTFOLIO PAGE — Main Entry Point
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The definitive T-shaped portfolio experience.
 * Hero → WorldShowcase (Akaru horizontal scroll-hijack) → About → Contact
 * 
 * Horizontal scrolling for Design/Tech projects (Akaru.fr effects).
 * Vertical scrolling for general info (About, Contact).
 */

import { useState, useCallback, useRef, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SplashLoader from '../../components/SplashLoader'
import TPortfolioHero from './TPortfolioHero'
import WorldShowcase from './WorldShowcase'
import AboutSection from './AboutSection'
import ContactSection from './ContactSection'
import './t-portfolio-page.css'

// Navigation items — must match section IDs
const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

// Real social links
const SOCIAL_LINKS = [
  { abbr: 'Li', label: 'LinkedIn', href: 'https://linkedin.com/in/mg' },
  { abbr: 'Gh', label: 'GitHub', href: 'https://github.com/mg' },
  { abbr: 'Be', label: 'Behance', href: 'https://behance.net/mg' },
]

/**
 * Derive committed side from identity value (0-1)
 * 0..0.3 = design, 0.3..0.7 = balanced, 0.7..1 = tech
 */
function deriveSide(identityValue) {
  if (identityValue < 0.3) return 'design'
  if (identityValue > 0.7) return 'tech'
  return 'balanced'
}

export default function TPortfolioPage() {
  const [splashComplete, setSplashComplete] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  // The committed identity side: 'design' | 'balanced' | 'tech'
  const [committedSide, setCommittedSide] = useState('balanced')
  
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

  // Hero reports identity commitment
  const handleIdentityCommit = useCallback((identityValue) => {
    setCommittedSide(deriveSide(identityValue))
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
    <div className={`t-portfolio t-portfolio--${committedSide}`}>
      {/* Splash Loader — M|G → T-shape animation */}
      {!splashComplete && (
        <SplashLoader onComplete={handleSplashComplete} />
      )}

      {/* Fixed Navigation Sidebar */}
      <PageNav
        activeSection={activeSection}
        committedSide={committedSide}
        onNavigate={scrollToSection}
        isVisible={splashComplete}
      />
      
      {/* Fixed Social Links Bar */}
      <PageSocial isVisible={splashComplete} committedSide={committedSide} />

      {/* Scrollable content */}
      <motion.div
        className="t-portfolio__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: splashComplete ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* SECTION 1: Hero (100vh) — user explores horizontally */}
        <div id="home" ref={homeRef}>
          <TPortfolioHero
            isReady={splashComplete}
            onNavigate={() => scrollToSection('about')}
            onIdentityCommit={handleIdentityCommit}
          />
        </div>
        
        {/* SECTION 2: World Showcase — Akaru-style horizontal scroll-hijack */}
        <WorldShowcase sectionRef={workRef} committedSide={committedSide} />
        
        {/* SECTION 3: About — general personal info */}
        <AboutSection sectionRef={aboutRef} committedSide={committedSide} />
        
        {/* SECTION 4: Contact + Footer */}
        <ContactSection sectionRef={contactRef} committedSide={committedSide} />
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE-LEVEL NAVIGATION SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════

const PageNav = memo(function PageNav({ activeSection, committedSide, onNavigate, isVisible }) {
  // Nav accent color shifts per committed side
  const accentColor = committedSide === 'design' 
    ? 'var(--t-design-warm, #c4703a)' 
    : committedSide === 'tech' 
      ? 'var(--t-tech-cool, #3a7cc4)' 
      : 'var(--t-neutral-muted, #888)'
  
  return (
    <motion.nav
      className={`t-portfolio__nav t-portfolio__nav--${committedSide}`}
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
              style={activeSection === item.id ? { color: accentColor } : undefined}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.span 
                  className="nav-indicator" 
                  layoutId="nav-indicator"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </button>
          </motion.li>
        ))}
      </ul>
      
      <div className="nav-sidebar__social">
        {SOCIAL_LINKS.map((link, i) => (
          <motion.a
            key={link.abbr}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-social-icon"
            aria-label={link.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            {link.abbr}
          </motion.a>
        ))}
      </div>
    </motion.nav>
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// PAGE-LEVEL SOCIAL LINKS BAR
// ═══════════════════════════════════════════════════════════════════════════

const PageSocial = memo(function PageSocial({ isVisible, committedSide }) {
  const lineColor = committedSide === 'design' 
    ? 'var(--t-design-warm, #c4703a)' 
    : committedSide === 'tech' 
      ? 'var(--t-tech-cool, #3a7cc4)' 
      : 'var(--t-neutral-muted, #555)'

  return (
    <motion.div
      className="t-portfolio__social"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {SOCIAL_LINKS.map((link, i) => (
        <motion.a
          key={link.abbr}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={link.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 1.2 + i * 0.1 }}
        >
          {link.abbr}
        </motion.a>
      ))}
      <motion.div
        className="social-line"
        style={{ backgroundColor: lineColor }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isVisible ? 1 : 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      />
    </motion.div>
  )
})
