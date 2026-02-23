import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useScrollStackZones } from '../hooks/useScrollStackZones'
import { useSearchParams, useOutletContext } from 'react-router-dom'
// Heavy global stylesheet & framer-motion are deferred (see lazy-styles + dynamic import in main.jsx)
// import '../akaru-styles.css'
// import { motion as Motion } from 'framer-motion'
// import { heroContainer, heroLetter } from '../lib/motion'
// Dynamic imports for non-critical sections
import SocialBar from '../components/SocialBar'
import { RevealWrapper, StaggerWrapper, StaggerItem } from '../components/ScrollReveal'
// Split Portrait Hero - central face with mouse-reactive dual identity
const SplitPortraitHero = lazy(() => import('../components/SplitPortraitHero'))
// Horizontal Portfolio Scroll - continuous horizontal scroll experience
const HorizontalPortfolioScroll = lazy(() => import('../components/HorizontalPortfolioScroll'))
// Morphing Hero - fallback or combined option
const MorphingHero = lazy(() => import('../components/MorphingHero'))
// Spatial sections for design/tech work (legacy - now using HorizontalPortfolioScroll)
const DesignSection = lazy(() => import('../components/DesignSection'))
const TechSection = lazy(() => import('../components/TechSection'))
// Heavier components lazy loaded via observer inside component body

// Hero loading fallback - matches splash dark background
function HeroFallback() {
  return (
    <div className="morphing-hero-fallback" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--akaru-bg, #0d0d0d)'
    }}>
      {/* Empty - splash loader handles the animation */}
    </div>
  )
}

function LazyMount({ children, rootMargin = '400px' }) {
  const [show, setShow] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (show) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { setShow(true); obs.disconnect() }
      })
    }, { rootMargin })
    obs.observe(el)
    return () => obs.disconnect()
  }, [show, rootMargin])
  return <div ref={ref}>{show ? children : null}</div>
}

export default function Home() {
  const { splashComplete } = useOutletContext() || {}
  const [params, setParams] = useSearchParams()
  const initialFocus = params.get('focus') || undefined
  
  // Navigation state for design/tech sections
  const [activeSection, setActiveSection] = useState('center')
  
  // Focus state removed with service panels; clean URL if param present
  useEffect(()=>{
    if (initialFocus) {
      setParams(p=>{ const next = new URLSearchParams(p); next.delete('focus'); return next }, { replace:true })
    }
  }, [initialFocus, setParams])

  const [ShowcaseGallery3DComp, setShowcaseGallery3DComp] = useState(null)
  const [HorizontalScrollAreasComp, setHorizontalScrollAreasComp] = useState(null)
  const [ExpertiseSectionComp, setExpertiseSectionComp] = useState(null)
  const [isShowcaseExpanded, setIsShowcaseExpanded] = useState(false)

  // Activate stacking via scroll zones instead of only pointer
  useScrollStackZones({ bodyClass: 'showcase-card-hovered', attr: 'data-stack-zone', enterRatio: 0.25, exitRatio: 0.15, removeDelay: 220 })

  // Mark body as stacking-ready after first meaningful interaction to avoid initial stacked hero flicker
  useEffect(() => {
    if (document.body.classList.contains('stacking-ready')) return
    const enable = () => {
      document.body.classList.add('stacking-ready')
      window.removeEventListener('scroll', enable)
      window.removeEventListener('pointermove', enable)
      window.removeEventListener('keydown', enable)
      window.removeEventListener('touchstart', enable, { passive: true })
    }
    window.addEventListener('scroll', enable, { passive: true, once: true })
    window.addEventListener('pointermove', enable, { passive: true, once: true })
    window.addEventListener('keydown', enable, { once: true })
    window.addEventListener('touchstart', enable, { passive: true, once: true })
    return () => {
      window.removeEventListener('scroll', enable)
      window.removeEventListener('pointermove', enable)
      window.removeEventListener('keydown', enable)
      window.removeEventListener('touchstart', enable)
    }
  }, [])

  // Load side nav when right pane scrolled into view (root margin generous)
  useEffect(() => {
    const el = document.querySelector('.showcase-stack')
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        import('../components/ShowcaseGallery3D').then(m => setShowcaseGallery3DComp(()=>m.default)).catch(()=>{})
        obs.disconnect()
      }
    }, { rootMargin: '600px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  // Load large scroll areas & expertise when user nears them
  useEffect(() => {
    const target = document.getElementById('home')?.nextElementSibling
    if (!target) return
    const obs = new IntersectionObserver((entries) => {
      if (entries.some(e=>e.isIntersecting)) {
        import('../components/HorizontalScrollAreas').then(m => setHorizontalScrollAreasComp(()=>m.default)).catch(()=>{})
        import('../components/ExpertiseSection').then(m => setExpertiseSectionComp(()=>m.default)).catch(()=>{})
        obs.disconnect()
      }
    }, { rootMargin: '800px' })
    obs.observe(target)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* ═══ Split Portrait Hero — Mouse-based horizontal navigation ═══ */}
      <Suspense fallback={<HeroFallback />}>
        <SplitPortraitHero 
          designImage="/portrait-design-nb.png"
          techImage="/portrait-tech-nb.png"
          isReady={splashComplete}
          onNavigate={(side) => setActiveSection(side)}
        />
      </Suspense>

      {/* ═══ Section Overlays — Triggered on click ═══ */}
      <AnimatePresence mode="wait">
        {activeSection === 'design' && (
          <Suspense fallback={null}>
            <DesignSection onBack={() => setActiveSection('center')} />
          </Suspense>
        )}
        {activeSection === 'tech' && (
          <Suspense fallback={null}>
            <TechSection onBack={() => setActiveSection('center')} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* ═══ Selected Work Section ═══ */}
      <section id="work" className="work-section" aria-label="Selected Work" data-stack-zone>
        <div className="work-section__inner">
          <RevealWrapper className="showcase-stack">
            <div className="showcase-heading">
              <h2 className="showcase-heading__title">Selected Work</h2>
              <p className="showcase-heading__desc">
                Snapshot of current directions across identity, commerce & experiential surfaces.
              </p>
            </div>
            {ShowcaseGallery3DComp && (
              <ShowcaseGallery3DComp 
                onExpand={() => setIsShowcaseExpanded(true)}
                onCollapse={() => setIsShowcaseExpanded(false)}
              />
            )}
          </RevealWrapper>
          <SocialBar />
        </div>
      </section>

      {/* ═══ Additional Sections ═══ */}
      <LazyMount>{HorizontalScrollAreasComp && <HorizontalScrollAreasComp />}</LazyMount>
      <LazyMount rootMargin="300px">{ExpertiseSectionComp && <ExpertiseSectionComp />}</LazyMount>
    </>
  )
}
