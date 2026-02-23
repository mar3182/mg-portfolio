import React, { useEffect, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { focusAreas } from '../data/focusAreas'

// Enhanced service data with clear purposes and actions
const servicePreviewData = {
  strategy: {
    icon: '🎯',
    title: 'Brand Strategy',
    tagline: 'Strategic Foundation',
    highlights: ['Market Analysis', 'Growth Strategy', 'Brand Positioning'],
    cta: 'Schedule Strategy Call',
    pricing: 'From $2,500-$5,000',
    timeline: '2-4 weeks',
    projectExample: 'SaaS Rebranding',
    projectResult: '+180% Brand Recognition'
  },
  design: {
    icon: '🎨',
    title: 'Digital Products',
    tagline: 'Creative Excellence',
    highlights: ['UI/UX Design', 'Brand Identity', 'Visual Systems'],
    cta: 'Schedule Strategy Call',
    pricing: 'From $3,000-$8,000',
    timeline: '3-6 weeks',
    projectExample: 'E-commerce Platform',
    projectResult: '+250% User Engagement'
  },
  commerce: {
    icon: '🛒',
    title: 'Creative Design',
    tagline: 'Visual Impact',
    highlights: ['Custom Development', 'Payment Integration', 'Performance Focus'],
    cta: 'Schedule Strategy Call',
    pricing: 'From $1,500-$4,000',
    timeline: '1-3 weeks',
    projectExample: 'Online Store',
    projectResult: '+320% Conversion Rate'
  },
  experience: {
    icon: '✨',
    title: 'Interactive Experience',
    tagline: 'Digital Innovation',
    highlights: ['Interactive Design', 'Web Animations', 'Performance Focus'],
    cta: 'Schedule Strategy Call',
    pricing: 'From $4,000-$10,000',
    timeline: '4-8 weeks',
    projectExample: 'Interactive Portfolio',
    projectResult: '+400% Time on Site'
  }
}

  }
}

export default function HomeFocusPanels({ onFocusChange }) {
  const [active, setActive] = useState(0)
  const [hoveredPanel, setHoveredPanel] = useState(null)

  // Service Preview Component with business-focused interactions
  const ServicePreview = ({ area, isHovered }) => {
    const service = servicePreviewData[area.id];
    
    return (
      <Motion.div 
        className="service-preview"
        initial={{ scale: 1 }}
        animate={{ scale: isHovered ? 1.08 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Compact View */}
        <div className="service-compact">
          <div className="service-icon">
            <span className="service-emoji">{service.icon}</span>
          </div>
          <h3>{service.title}</h3>
          <p className="service-tagline">{service.tagline}</p>
        </div>
        
        {/* Expanded Content on Hover */}
        <AnimatePresence>
          {isHovered && (
            <Motion.div 
              className="service-expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="service-details">
                <div className="service-pricing">
                  <span className="price-label">Starting at</span>
                  <span className="price-value">{service.pricing}</span>
                </div>
                
                <div className="service-timeline">
                  <span className="timeline-icon">⏱️</span>
                  <span>{service.timeline}</span>
                </div>
                
                <div className="service-highlights">
                  {service.highlights.map((highlight, idx) => (
                    <div key={idx} className="highlight-item">
                      <span className="highlight-check">✓</span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
                
                <div className="service-actions">
                  <button className="cta-primary">{service.cta}</button>
                  <button className="cta-secondary">View Work</button>
                </div>
                
                {/* Project Preview */}
                <div className="project-preview">
                  <div className="preview-label">Recent Project</div>
                  <div className="preview-item">
                    <div className="preview-thumb"></div>
                    <div className="preview-info">
                      <span className="preview-name">{service.projectExample}</span>
                      <span className="preview-result">{service.projectResult}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
        
        {/* Action Hint */}
        <div className="action-hint">
          <span>Hover to explore →</span>
        </div>
      </Motion.div>
    );
  };

  // Sync active state with external change
  useEffect(() => {
    const root = document.documentElement
    const color = focusAreas[active]?.color
    if (color) root.style.setProperty('--accent-color', color)
  }, [active])

  return (
    <Motion.div 
      className="floating-service-panels"
      role="tablist" 
      aria-label="Portfolio focus areas"
      layout
      transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
    >
      {/* Horizontal Scroll Container */}
      <div className="service-scroll-container">
        <div className="service-cards-track">
          {focusAreas.map((area, i) => {
            const isActive = i === active
            const isHovered = hoveredPanel === i
            
            return (
              <Motion.div
                key={area.id}
                className={`service-card-wrapper ${area.id}${isActive ? ' is-active' : ''}${isHovered ? ' is-hovered' : ''}`}
                style={{ '--panel-color': area.color }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ 
                  opacity: 1, 
                  y: 0
                }}
                whileHover={{ 
                  scale: 1.08,
                  y: -12,
                  zIndex: 20,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
                }}
                transition={{ 
                  delay: 0.1 + i * 0.05, 
                  type: 'spring', 
                  stiffness: 200, 
                  damping: 25
                }}
                onMouseEnter={() => setHoveredPanel(i)}
                onMouseLeave={() => setHoveredPanel(null)}
                onClick={() => {
                  setActive(i);
                  onFocusChange?.(focusAreas[i]);
                }}
              >
                <div className="card-content">
                  {/* Interactive Service Preview */}
                  <ServicePreview 
                    area={area} 
                    isHovered={isHovered} 
                  />
                </div>
              </Motion.div>
            )
          })}
        </div>
      </div>
      
      {/* Scroll Indicators */}
      <div className="scroll-indicators">
        <div className="scroll-hint">
          <span>← Scroll to explore services →</span>
        </div>
        <div className="scroll-dots">
          {focusAreas.map((_, i) => (
            <button 
              key={i}
              className={`scroll-dot ${i === active ? 'active' : ''}`}
              onClick={() => {
                setActive(i);
                onFocusChange?.(focusAreas[i]);
              }}
              aria-label={`Go to ${focusAreas[i].title}`}
            />
          ))}
        </div>
      </div>
    </Motion.div>
  )
}