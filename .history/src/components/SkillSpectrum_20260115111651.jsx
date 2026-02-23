/**
 * SkillSpectrum Component
 * 
 * Visual representation of the Design ←→ Tech spectrum for projects.
 * Shows where each project falls on the T-shaped creative spectrum.
 * 
 * Can display as:
 * - bar: Horizontal gradient bar with position marker
 * - dual: Two separate bars for design and tech
 * - compact: Minimal version for cards
 */

import { motion } from 'framer-motion'
import './styles/skill-spectrum.css'

export default function SkillSpectrum({ 
  spectrum = { design: 50, tech: 50 },
  variant = 'bar', // 'bar' | 'dual' | 'compact'
  showLabels = true,
  showValues = false,
  size = 'default', // 'small' | 'default' | 'large'
  animated = true 
}) {
  const { design, tech } = spectrum
  
  // Calculate the position on the spectrum (0 = full design, 100 = full tech)
  // This creates a single point that represents the balance
  const balance = (tech / (design + tech)) * 100

  if (variant === 'compact') {
    return (
      <div className={`skill-spectrum skill-spectrum--compact skill-spectrum--${size}`}>
        <div className="spectrum-track">
          <motion.div 
            className="spectrum-marker"
            initial={animated ? { left: '50%' } : false}
            animate={{ left: `${balance}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
          <div className="spectrum-fill spectrum-fill--design" style={{ width: `${balance}%` }} />
          <div className="spectrum-fill spectrum-fill--tech" style={{ width: `${100 - balance}%` }} />
        </div>
      </div>
    )
  }

  if (variant === 'dual') {
    return (
      <div className={`skill-spectrum skill-spectrum--dual skill-spectrum--${size}`}>
        {/* Design Bar */}
        <div className="spectrum-row">
          {showLabels && <span className="spectrum-label spectrum-label--design">Design</span>}
          <div className="spectrum-bar-track">
            <motion.div 
              className="spectrum-bar spectrum-bar--design"
              initial={animated ? { width: 0 } : false}
              animate={{ width: `${design}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
            />
          </div>
          {showValues && <span className="spectrum-value">{design}</span>}
        </div>
        
        {/* Tech Bar */}
        <div className="spectrum-row">
          {showLabels && <span className="spectrum-label spectrum-label--tech">Tech</span>}
          <div className="spectrum-bar-track">
            <motion.div 
              className="spectrum-bar spectrum-bar--tech"
              initial={animated ? { width: 0 } : false}
              animate={{ width: `${tech}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 20, delay: 0.1 }}
            />
          </div>
          {showValues && <span className="spectrum-value">{tech}</span>}
        </div>
      </div>
    )
  }

  // Default: bar variant
  return (
    <div className={`skill-spectrum skill-spectrum--bar skill-spectrum--${size}`}>
      {showLabels && (
        <div className="spectrum-labels">
          <span className="spectrum-label spectrum-label--design">Design</span>
          <span className="spectrum-label spectrum-label--tech">Tech</span>
        </div>
      )}
      
      <div className="spectrum-track">
        {/* Gradient background */}
        <div className="spectrum-gradient" />
        
        {/* Position marker */}
        <motion.div 
          className="spectrum-marker"
          initial={animated ? { left: '50%', scale: 0 } : false}
          animate={{ left: `${balance}%`, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <span className="marker-dot" />
          {showValues && (
            <span className="marker-tooltip">
              {design}% Design · {tech}% Tech
            </span>
          )}
        </motion.div>
        
        {/* Tick marks */}
        <div className="spectrum-ticks">
          {[0, 25, 50, 75, 100].map(tick => (
            <div 
              key={tick} 
              className="spectrum-tick" 
              style={{ left: `${tick}%` }}
            />
          ))}
        </div>
      </div>
      
      {showValues && (
        <div className="spectrum-values">
          <span className="spectrum-value spectrum-value--design">{design}</span>
          <span className="spectrum-value spectrum-value--tech">{tech}</span>
        </div>
      )}
    </div>
  )
}

/**
 * SkillCloud Component
 * 
 * Displays the skills associated with a project in a visual cloud format,
 * color-coded by design/tech classification.
 */
export function SkillCloud({ skills, limit = 6 }) {
  if (!skills) return null
  
  const { design = [], tech = [] } = skills
  
  // Interleave design and tech skills for visual variety
  const combined = []
  const maxLength = Math.max(design.length, tech.length)
  
  for (let i = 0; i < maxLength && combined.length < limit; i++) {
    if (design[i] && combined.length < limit) {
      combined.push({ skill: design[i], type: 'design' })
    }
    if (tech[i] && combined.length < limit) {
      combined.push({ skill: tech[i], type: 'tech' })
    }
  }

  return (
    <div className="skill-cloud">
      {combined.map(({ skill, type }, index) => (
        <motion.span
          key={`${type}-${skill}`}
          className={`skill-tag skill-tag--${type}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {skill}
        </motion.span>
      ))}
    </div>
  )
}

/**
 * SpectrumFilter Component
 * 
 * Filter control for project lists based on spectrum position.
 */
export function SpectrumFilter({ 
  value = 50, // 0 = design only, 100 = tech only, 50 = balanced
  onChange,
  showAll = true 
}) {
  const handleSliderChange = (e) => {
    onChange?.(parseInt(e.target.value, 10))
  }

  const handleReset = () => {
    onChange?.(50)
  }

  return (
    <div className="spectrum-filter">
      <div className="filter-header">
        <span className="filter-title">Filter by Spectrum</span>
        {showAll && (
          <button className="filter-reset" onClick={handleReset}>
            Show All
          </button>
        )}
      </div>
      
      <div className="filter-controls">
        <span className="filter-label filter-label--design">Design</span>
        
        <div className="filter-slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleSliderChange}
            className="filter-slider"
          />
          <div 
            className="filter-indicator"
            style={{ left: `${value}%` }}
          />
        </div>
        
        <span className="filter-label filter-label--tech">Tech</span>
      </div>
      
      <div className="filter-description">
        {value < 30 && 'Showing design-focused projects'}
        {value >= 30 && value <= 70 && 'Showing balanced projects'}
        {value > 70 && 'Showing tech-focused projects'}
      </div>
    </div>
  )
}
