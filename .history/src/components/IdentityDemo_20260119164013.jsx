/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IDENTITY SYSTEM DEMO
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * A standalone demo component that showcases all aspects of the identity
 * motion system. Place this anywhere to see the system in action.
 * 
 * Features demonstrated:
 * - Manual identity slider
 * - Color interpolation
 * - Typography changes
 * - Motion behavior adaptation
 * - Decorative element transitions
 */

import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import {
  useIdentity,
  useIdentityColors,
  useIdentityMotion,
  useIdentityTypography,
  useIdentityActions,
  useIdentityLabel,
  useIdentityIntensity,
} from '../hooks/useIdentity'
import { IdentityHeading, IdentityParagraph, IdentityLabel, IdentityAccent } from './IdentityText'
import IdentitySectionDivider from './IdentitySectionDivider'
import './styles/identity-demo.css'

export default function IdentityDemo() {
  const identity = useIdentity()
  const colors = useIdentityColors()
  const motion = useIdentityMotion()
  const typography = useIdentityTypography()
  const { setIdentity, animateToIdentity, lockToDesign, lockToTech, resetToNeutral } = useIdentityActions()
  const label = useIdentityLabel()
  const intensity = useIdentityIntensity()
  
  const [isAnimating, setIsAnimating] = useState(false)
  
  const handleSliderChange = (e) => {
    setIdentity(parseFloat(e.target.value), 'demo-slider')
  }
  
  const handleAnimateToDesign = () => {
    setIsAnimating(true)
    animateToIdentity(0, { duration: 1.5 })
    setTimeout(() => setIsAnimating(false), 1500)
  }
  
  const handleAnimateToTech = () => {
    setIsAnimating(true)
    animateToIdentity(1, { duration: 1.5 })
    setTimeout(() => setIsAnimating(false), 1500)
  }
  
  const handleAnimateToNeutral = () => {
    setIsAnimating(true)
    resetToNeutral(true)
    setTimeout(() => setIsAnimating(false), 1200)
  }
  
  return (
    <div 
      className="identity-demo"
      style={{ 
        '--demo-bg': colors.background,
        '--demo-accent': colors.accent,
        '--demo-text': colors.text,
        '--demo-text-muted': colors.textMuted,
      }}
    >
      <div className="identity-demo__header">
        <IdentityHeading as="h2" size="lg">
          Identity Motion System
        </IdentityHeading>
        <IdentityParagraph muted>
          Move the slider or use the buttons to see the system in action.
          The entire page responds to this single value.
        </IdentityParagraph>
      </div>
      
      {/* Current State Display */}
      <div className="identity-demo__state">
        <div className="state-item">
          <IdentityLabel variant="accent">Current Identity</IdentityLabel>
          <div className="state-value" style={{ color: colors.accent }}>
            {label.toUpperCase()}
          </div>
        </div>
        <div className="state-item">
          <IdentityLabel>Value</IdentityLabel>
          <div className="state-value">{identity.toFixed(3)}</div>
        </div>
        <div className="state-item">
          <IdentityLabel>Intensity</IdentityLabel>
          <div className="state-value">{(intensity * 100).toFixed(0)}%</div>
        </div>
      </div>
      
      {/* Identity Slider */}
      <div className="identity-demo__slider">
        <span className="slider-label slider-label--design">Design</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={identity}
          onChange={handleSliderChange}
          className="identity-slider"
          style={{
            '--slider-progress': `${identity * 100}%`,
            '--slider-thumb-color': colors.accent,
          }}
        />
        <span className="slider-label slider-label--tech">Tech</span>
      </div>
      
      {/* Quick Actions */}
      <div className="identity-demo__actions">
        <button 
          onClick={handleAnimateToDesign}
          disabled={isAnimating}
          className="demo-btn demo-btn--design"
        >
          → Design
        </button>
        <button 
          onClick={handleAnimateToNeutral}
          disabled={isAnimating}
          className="demo-btn demo-btn--neutral"
        >
          ○ Neutral
        </button>
        <button 
          onClick={handleAnimateToTech}
          disabled={isAnimating}
          className="demo-btn demo-btn--tech"
        >
          Tech ←
        </button>
      </div>
      
      <IdentitySectionDivider />
      
      {/* Color Swatches */}
      <div className="identity-demo__colors">
        <IdentityLabel>Color System</IdentityLabel>
        <div className="color-swatches">
          <div className="swatch" style={{ background: colors.background }}>
            <span>BG</span>
          </div>
          <div className="swatch" style={{ background: colors.backgroundAlt }}>
            <span>Alt</span>
          </div>
          <div className="swatch" style={{ background: colors.accent }}>
            <span>Accent</span>
          </div>
          <div className="swatch" style={{ background: colors.accentGlow }}>
            <span>Glow</span>
          </div>
          <div className="swatch" style={{ background: colors.text, color: colors.background }}>
            <span>Text</span>
          </div>
          <div className="swatch" style={{ background: colors.textMuted, color: colors.background }}>
            <span>Muted</span>
          </div>
        </div>
      </div>
      
      {/* Typography Demo */}
      <div className="identity-demo__typography">
        <IdentityLabel>Typography Adaptation</IdentityLabel>
        <div className="typography-sample">
          <IdentityHeading as="h3" size="md">
            Creative <IdentityAccent>Technology</IdentityAccent>
          </IdentityHeading>
          <IdentityParagraph>
            The portfolio feels like a living organism that responds to exploration.
            Moving through the site reveals which identity resonates with you.
            <IdentityAccent> Design and technology</IdentityAccent> are not just topics—
            they are encoded into the interface itself.
          </IdentityParagraph>
        </div>
        <div className="typography-metrics">
          <span>Letter-spacing: {typography.letterSpacing}</span>
          <span>Font-weight: {typography.fontWeight}</span>
          <span>Line-height: {typography.lineHeight.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Motion Demo */}
      <div className="identity-demo__motion">
        <IdentityLabel>Motion Behavior</IdentityLabel>
        <div className="motion-demo-container">
          <Motion.div
            className="motion-demo-ball"
            animate={{ x: [0, 100, 0] }}
            transition={{
              duration: motion.duration * 2,
              ease: motion.ease,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
            style={{ background: colors.accent }}
          />
          <div className="motion-track" />
        </div>
        <div className="motion-metrics">
          <span>Stiffness: {motion.stiffness.toFixed(0)}</span>
          <span>Damping: {motion.damping.toFixed(0)}</span>
          <span>Duration: {motion.duration.toFixed(2)}s</span>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="identity-demo__instructions">
        <IdentityParagraph muted>
          <strong>Keyboard shortcuts (dev mode):</strong><br />
          1 = Design | 2 = Neutral | 3 = Tech | ←/→ = Nudge
        </IdentityParagraph>
      </div>
    </div>
  )
}
