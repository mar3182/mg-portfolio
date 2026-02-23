import React, { useState, useCallback, Suspense, useEffect, lazy } from 'react'
import { Link, Outlet, NavLink, useLocation } from 'react-router-dom'
import { useScrollSpy } from './hooks/useScrollSpy'
// framer-motion removed from initial critical path
// import { AnimatePresence, motion as Motion, MotionConfig } from 'framer-motion'
import PrimaryNav from './components/PrimaryNav'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
// Heavy / non-critical components dynamically imported for LCP protection
// (LogoIntro animation, custom cursor, modal & menu overlay)
import { useWebVitals } from './hooks/useWebVitals'
import WebVitalsOverlay from './components/WebVitalsOverlay'
// Splash Loader - dual identity M|G animation
import SplashLoader from './components/SplashLoader'
// ═══ IDENTITY MOTION SYSTEM ═══
// Global identity controller that drives all visual/motion behavior
import IdentityProvider from './components/IdentityProvider'
import { useIdentity, useIdentityLabel } from './hooks/useIdentity'
// Spatial Navigation - loaded after first interaction
const SpatialNav = lazy(() => import('./components/SpatialNav'))
// Skeleton fallback components for route-based Suspense
function HomeSkeleton() {
  return (
    <div className="skeleton home-skel">
      <div className="skel-giant" />
      <div className="skel-block w40" />
      <div className="skel-block w55" />
      <div className="skel-grid">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skel-pill" />)}
      </div>
    </div>
  )
}
function ProjectsSkeleton() { return <div className="skeleton list-skel">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skel-row" />)}</div> }
function DetailSkeleton() { return <div className="skeleton detail-skel"><div className="skel-title" /><div className="skel-rect" /></div> }
function ContactSkeleton() { return <div className="skeleton form-skel">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skel-input" />)}</div> }
function RouteFallback({ path }) {
  if (path === '/') return <HomeSkeleton />
  if (path.startsWith('/projects/')) return <DetailSkeleton />
  if (path.startsWith('/projects')) return <ProjectsSkeleton />
  if (path.startsWith('/contact')) return <ContactSkeleton />
  return <div className="route-fallback" role="status" aria-live="polite"><span className="loader-dot" /> Loading…</div>
}
import './App.css'
import './akaru-styles.css'

export default function AppLayout() {
  const location = useLocation()
  // Include project section spy only when on root path for hash nav OR when projects route is mounted with id.
  const isRoot = location.pathname === '/'
  const spyIds = isRoot ? ['home', 'areas', 'expertise', 'projects'] : ['projects']
  const activeSection = useScrollSpy(spyIds, { offset: 100 })
  // removed old navRef usage
  // legacy indicator removed in redesign
  // const [indicatorStyle, setIndicatorStyle] = useState({ transform: 'translate(-10px,0)', height: 14 })
  const [introDone, setIntroDone] = useState(true) // No longer using LogoIntro
  const [CustomCursorComp, setCustomCursorComp] = useState(null)
  const [MenuOverlayComp, setMenuOverlayComp] = useState(null)
  const [ExpertiseDetailModalComp, setExpertiseDetailModalComp] = useState(null)
  const [navMorphed, setNavMorphed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentIdentity, setCurrentIdentity] = useState('tech')
  const [showSpatialNav, setShowSpatialNav] = useState(false)
  const [splashComplete, setSplashComplete] = useState(false)

  // Load spatial nav after first interaction
  useEffect(() => {
    const loadSpatialNav = () => setShowSpatialNav(true)
    const timer = setTimeout(loadSpatialNav, 2000) // Show after 2s or on interaction
    const onInteract = () => {
      clearTimeout(timer)
      loadSpatialNav()
      window.removeEventListener('scroll', onInteract)
      window.removeEventListener('pointermove', onInteract)
    }
    window.addEventListener('scroll', onInteract, { passive: true, once: true })
    window.addEventListener('pointermove', onInteract, { passive: true, once: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onInteract)
      window.removeEventListener('pointermove', onInteract)
    }
  }, [])

  // Track current identity from body class
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains('identity-design')) {
        setCurrentIdentity('design')
      } else if (document.body.classList.contains('identity-tech')) {
        setCurrentIdentity('tech')
      }
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Nav morph threshold (after most of hero consumed)
  useEffect(() => {
    function onScroll() {
      const hero = document.getElementById('home')
      const y = window.scrollY
      const threshold = hero ? (hero.offsetHeight * 0.55) : 700
      const shouldMorph = y > threshold
      setNavMorphed(prev => prev !== shouldMorph ? shouldMorph : prev)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // removed legacy vertical indicator effect

  const handleAnchorClick = useCallback((e) => {
    const href = e.currentTarget.getAttribute('href')
    if (!href || !href.startsWith('/#')) return
    const id = href.split('#')[1]
    const el = document.getElementById(id)
    if (el) {
      e.preventDefault()
      const headerOffset = 70
      const rect = el.getBoundingClientRect()
      const scrollTop = window.scrollY + rect.top - headerOffset
      window.scrollTo({ top: scrollTop, behavior: 'smooth' })
    }
  }, [])

  // LogoIntro removed - using SplashLoader instead

  // Custom cursor: only after pointer interaction
  useEffect(() => {
    function onFirstMove() {
      import('./components/CustomCursor').then(m => setCustomCursorComp(() => m.default)).catch(()=>{})
      window.removeEventListener('pointermove', onFirstMove)
    }
    window.addEventListener('pointermove', onFirstMove, { passive: true, once: true })
    return () => window.removeEventListener('pointermove', onFirstMove)
  }, [])

  // Non-critical overlays & modals loaded idle
  useEffect(() => {
    const loadIdle = () => {
      import('./components/MenuOverlay').then(m => setMenuOverlayComp(() => m.default)).catch(()=>{})
      import('./components/ExpertiseDetailModal').then(m => setExpertiseDetailModalComp(() => m.default)).catch(()=>{})
    }
    if ('requestIdleCallback' in window) requestIdleCallback(loadIdle, { timeout: 3000 })
    else setTimeout(loadIdle, 2500)
  }, [])

  // Initialize Web Vitals collection (disabled in development hot reload noise by checking prod build env)
  useWebVitals({ enabled: import.meta.env.MODE === 'production' })

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Manage inert/aria-hidden on shell when menu open + body class for cursor fix
  useEffect(() => {
    const shell = document.getElementById('app-shell')
    if (!shell) return
    
    if (menuOpen) {
      shell.setAttribute('aria-hidden', 'true')
      shell.setAttribute('inert', '')
      document.body.classList.add('menu-open')
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      shell.removeAttribute('aria-hidden')
      shell.removeAttribute('inert')
      document.body.classList.remove('menu-open')
      document.body.style.overflow = ''
    }
    
    // Cleanup on unmount - ensure we always clean up
    return () => {
      shell.removeAttribute('aria-hidden')
      shell.removeAttribute('inert')
      document.body.classList.remove('menu-open')
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <IdentityProvider showBackground={splashComplete} showDecorative={splashComplete}>
    <div className="app-wrapper">
    {/* Splash Loader - M|G dual identity animation */}
    {!splashComplete && <SplashLoader onComplete={() => setSplashComplete(true)} />}
    <div className="app-root" id="app-shell">
  {CustomCursorComp && <CustomCursorComp />}
  <a href="#main-content" className="skip-link">Skip to content</a>
      <header className={"primary-header" + (navMorphed ? ' morphed':'')} role="banner">
        <div className="primary-brand"><Link to="/">MG</Link></div>
        <PrimaryNav active={activeSection} onAnchor={handleAnchorClick} />
        <button className="menu-trigger" type="button" aria-expanded={menuOpen} onClick={()=>setMenuOpen(o=>!o)}>
          <span className="menu-trigger-dot" aria-hidden="true" /> MENU
        </button>
      </header>

  <main id="main-content" style={{ position: 'relative', minHeight: '100%' }}>
        <Suspense fallback={<RouteFallback path={location.pathname} />}>
          <PageTransition>
            <Outlet context={{ splashComplete }} />
          </PageTransition>
        </Suspense>
      </main>
  <Footer />
  {/* Spatial Navigation - dual-axis compass */}
  {showSpatialNav && (
    <Suspense fallback={null}>
      <SpatialNav currentIdentity={currentIdentity} />
    </Suspense>
  )}
  {import.meta.env.DEV && (location.hash.includes('debug-vitals') || location.search.includes('debugVitals')) && <WebVitalsOverlay />}
  </div>
  {MenuOverlayComp && <MenuOverlayComp open={menuOpen} onClose={()=>setMenuOpen(false)} />}
  {ExpertiseDetailModalComp && <ExpertiseDetailModalComp />}
  </div>
  </IdentityProvider>
  )
}
