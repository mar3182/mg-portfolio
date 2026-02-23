import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { useScrollStackZones } from '../hooks/useScrollStackZones'
import { useSearchParams } from 'react-router-dom'
// Heavy global stylesheet & framer-motion are deferred (see lazy-styles + dynamic import in main.jsx)
// import '../akaru-styles.css'
// import { motion as Motion } from 'framer-motion'
// import { heroContainer, heroLetter } from '../lib/motion'
// Dynamic imports for non-critical sections
import SocialBar from '../components/SocialBar'
import { RevealWrapper, StaggerWrapper, StaggerItem } from '../components/ScrollReveal'
// Morphing Hero - the new T-shaped creative identity animation
const MorphingHero = lazy(() => import('../components/MorphingHero'))
// Heavier components lazy loaded via observer inside component body

// Hero loading fallback
function HeroFallback() {
  return (
    <div className="morphing-hero-fallback" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base, #fafafa)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: 'clamp(3rem, 12vw, 8rem)', 
          fontWeight: 700,
          letterSpacing: '-0.03em',
          opacity: 0.1 
        }}>
          Loading...
        </h1>
      </div>
    </div>
  )
}

const HERO_LINES = ['FULL STACK', 'DEVELOPER']

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
  const [params, setParams] = useSearchParams()
  const initialFocus = params.get('focus') || undefined
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
  <section id="home" className="split-screen sticky-left-layout" aria-label="Home" data-stack-zone>
      <div className="split-left hero-left sticky-pane">
        {/* Auto-scaling hero text - each line fits container width */}
        <h1 className="giant-text giant-text-fit" aria-label={HERO_LINES.join(' ')}>
          {HERO_LINES.map((line, index) => (
            <FitText 
              key={index} 
              as="span" 
              className="hero-line-fit"
              minFontSize={32}
              maxFontSize={400}
            >
              {line}
            </FitText>
          ))}
        </h1>
        {/* LCP target paragraph: remove motion delay so it can paint immediately */}
        <p className="hero-sub">
          I shape digital identities and experiences with an obsession for detail and performance.
        </p>
        <a
          href="/projects"
          className="hero-cta"
          aria-label="View projects"
        >
          View Projects
          <span aria-hidden="true" style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
        </a>
        <SocialBar />
      </div>
  <div className="split-right hero-right scroll-pane" data-stack-zone
    onMouseEnter={() => { document.body.classList.add('stacking-ready'); document.body.classList.add('showcase-card-hovered'); document.body.dataset.stackSource = 'hover' }}
    onMouseLeave={() => { if (document.body.dataset.stackSource === 'hover') { document.body.classList.add('showcase-card-unhover'); setTimeout(()=>{ document.body.classList.remove('showcase-card-hovered'); document.body.classList.remove('showcase-card-unhover'); delete document.body.dataset.stackSource }, 220) } }}>
  <div className="hero-scroll-cue" aria-hidden="true">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
		<span>Scroll</span>
	</div>
  <div style={{ height:'1.25rem' }} />
        <RevealWrapper className="showcase-stack">
          <div className="showcase-heading">
            <h3 style={{ margin: 0 }}>Selected Work</h3>
            <p style={{ maxWidth: '24rem', marginTop: '0.5rem' }}>
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
      </div>
  </section>
  <LazyMount>{HorizontalScrollAreasComp && <HorizontalScrollAreasComp />}</LazyMount>
  <LazyMount rootMargin="300px">{ExpertiseSectionComp && <ExpertiseSectionComp />}</LazyMount>
  </>
  )
}
