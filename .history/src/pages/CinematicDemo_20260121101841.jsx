/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CINEMATIC HERO DEMO PAGE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Test page for the new dual-identity hero system.
 * Access at: /cinematic-demo
 */

import CinematicHero from '../components/hero'

export default function CinematicDemo() {
  return (
    <main style={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      background: '#0d0d0d',
    }}>
      <CinematicHero
        designImage="/portrait-design-left.png"
        neutralImage="/portrait-split.png"
        techImage="/portrait-tech-right.png"
      />
      
      {/* Demo info overlay */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.875rem',
        pointerEvents: 'none',
      }}>
        <p style={{ margin: 0 }}>
          Move mouse left ← → right to explore identity
        </p>
        <p style={{ margin: '0.5rem 0 0', opacity: 0.6, fontSize: '0.75rem' }}>
          Design (warm, organic) ←→ Tech (cool, computational)
        </p>
      </div>
    </main>
  )
}
