/**
 * ═══════════════════════════════════════════════════════════════════════════
 * T-SCANNER HERO DEMO PAGE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Test page for the T-shaped scanner reveal effect.
 * Access at: /cinematic-demo
 */

import TScannerHero from '../components/hero/TScannerHero'

export default function CinematicDemo() {
  return (
    <main style={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      background: '#0d0d0d',
    }}>
      <TScannerHero
        baseImage="/portrait-base.png"
        designImage="/portrait-design-nb.png"
        techImage="/portrait-tech.png"
      />
    </main>
  )
}
