/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TECH WORLD — Structural, Cool, Precise
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The engineering side of the T — vertical depth into technical work.
 * Visual language: cool, geometric, structured, precise.
 * 
 * Contains:
 * - Expertise areas (Frontend, Backend, Cloud, AI)
 * - Associated projects
 * - Vertical scroll navigation
 */

import { useRef, useCallback } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import { motion } from 'framer-motion'
import './tech-world.css'

// Tech expertise areas with projects
const TECH_AREAS = [
  {
    id: 'frontend',
    title: 'React & Next.js',
    description: 'Building interfaces that scale and delight',
    icon: '⬢',
    color: '#00ff88',
    projects: [
      { id: 'react-1', title: 'This Portfolio', desc: 'T-shaped navigation with Framer Motion', year: '2024' },
      { id: 'react-2', title: 'SaaS Dashboard', desc: 'Real-time analytics with WebSockets', year: '2024' },
      { id: 'react-3', title: 'E-Learning Hub', desc: 'Interactive course platform', year: '2023' },
    ]
  },
  {
    id: 'backend',
    title: 'Node.js & APIs',
    description: 'Robust systems built for reliability',
    icon: '⬡',
    color: '#00e5ff',
    projects: [
      { id: 'node-1', title: 'GraphQL Gateway', desc: 'Unified API for microservices', year: '2024' },
      { id: 'node-2', title: 'Auth System', desc: 'OAuth2 + JWT + MFA implementation', year: '2024' },
    ]
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    description: 'Infrastructure as code, deployed with confidence',
    icon: '△',
    color: '#8b5cf6',
    projects: [
      { id: 'cloud-1', title: 'K8s Platform', desc: 'Production Kubernetes on AWS EKS', year: '2024' },
      { id: 'cloud-2', title: 'CI/CD Pipeline', desc: 'GitHub Actions + ArgoCD GitOps', year: '2024' },
    ]
  },
  {
    id: 'blockchain',
    title: 'Web3 & DeFi',
    description: 'Smart contracts and decentralized systems',
    icon: '◈',
    color: '#3a7cc4',
    projects: [
      { id: 'defi-1', title: 'Yield Optimizer', desc: 'Automated DeFi yield farming', year: '2025' },
      { id: 'defi-2', title: 'NFT Marketplace', desc: 'ERC-721 + ERC-1155 platform', year: '2024' },
    ]
  },
]

export default function TechWorld({ onBack }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  
  // Grid animation based on scroll
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.08, 0.03])
  
  const handleBackClick = useCallback((e) => {
    e.stopPropagation()
    onBack?.()
  }, [onBack])

  return (
    <motion.div
      className="tech-world"
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '50%' }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Background grid */}
      <motion.div 
        className="tech-world__bg"
        style={{ scale: gridScale }}
      >
        <motion.div 
          className="tech-world__grid" 
          style={{ opacity: gridOpacity }}
        />
        <div className="tech-world__gradient" />
      </motion.div>
      
      {/* Decorative circuit lines */}
      <CircuitDecoration />
      
      {/* Back button */}
      <button 
        className="tech-world__back"
        onClick={handleBackClick}
        aria-label="Return to overview"
      >
        <span className="back__arrow">←</span>
        <span className="back__label">Back</span>
      </button>
      
      {/* Header */}
      <header className="tech-world__header">
        <motion.h1
          className="tech-world__title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Technology
        </motion.h1>
        <motion.p
          className="tech-world__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Where systems meet solutions
        </motion.p>
      </header>
      
      {/* Scrollable content */}
      <div 
        ref={containerRef}
        className="tech-world__content"
      >
        {/* Areas with projects */}
        <div className="tech-world__areas">
          {TECH_AREAS.map((area, index) => (
            <TechArea 
              key={area.id} 
              area={area} 
              index={index}
            />
          ))}
        </div>
        
        {/* Footer manifesto */}
        <footer className="tech-world__footer">
          <blockquote className="tech-world__manifesto">
            "Code is poetry written for machines — and read by humans."
          </blockquote>
        </footer>
      </div>
    </motion.div>
  )
}

// Area component with nested projects
function TechArea({ area, index }) {
  return (
    <motion.section
      className="tech-area"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{ '--area-color': area.color }}
    >
      <div className="tech-area__header">
        <span className="tech-area__icon">{area.icon}</span>
        <h2 className="tech-area__title">{area.title}</h2>
        <p className="tech-area__desc">{area.description}</p>
      </div>
      
      <div className="tech-area__projects">
        {area.projects.map((project, i) => (
          <motion.article
            key={project.id}
            className="tech-project"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ x: -10, scale: 1.02 }}
          >
            <div className="tech-project__image">
              {/* TODO: Replace with actual project image */}
              <div className="tech-project__placeholder">
                <span className="tech-project__code">{`{ }`}</span>
              </div>
            </div>
            <div className="tech-project__info">
              <h3 className="tech-project__title">{project.title}</h3>
              <p className="tech-project__desc">{project.desc}</p>
              <span className="tech-project__year">{project.year}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}

// Decorative circuit pattern
function CircuitDecoration() {
  return (
    <svg 
      className="tech-world__circuits"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Horizontal lines */}
      <motion.line
        x1="0" y1="20" x2="100" y2="20"
        stroke="var(--t-tech-cool)"
        strokeWidth="0.1"
        strokeOpacity="0.15"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      <motion.line
        x1="0" y1="80" x2="100" y2="80"
        stroke="var(--t-tech-cool)"
        strokeWidth="0.1"
        strokeOpacity="0.15"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.7 }}
      />
      
      {/* Vertical lines */}
      <motion.line
        x1="15" y1="0" x2="15" y2="100"
        stroke="var(--t-tech-cool)"
        strokeWidth="0.1"
        strokeOpacity="0.1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
      
      {/* Nodes */}
      <motion.circle
        cx="15" cy="20" r="0.5"
        fill="var(--t-tech-cool)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ delay: 1.5 }}
      />
      <motion.circle
        cx="15" cy="80" r="0.5"
        fill="var(--t-tech-cool)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ delay: 1.7 }}
      />
    </svg>
  )
}
