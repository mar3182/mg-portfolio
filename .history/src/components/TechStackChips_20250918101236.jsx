import React from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { techStack } from '../data/techStack'

/**
 * TechStackChips
 * Displays technologies either as:
 *  - expanded grid (default)
 *  - compressed vertical stacked column when body has showcase-card-hovered
 * Focus: provide visual metaphor: layers of the stack.
 */
export default function TechStackChips({ compact = false }) {
  return (
    <div className={`tech-stack-chips ${compact ? 'tech-stack-chips--compact' : ''}`}> 
      <AnimatePresence initial={false}>
        {techStack.map((t, i) => (
          <Motion.span
            key={t.id}
            className="tech-chip"
            style={{ '--i': i }}
            initial={{ opacity: 0, y: 12, scale: .95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: .9 }}
            transition={{ delay: i * 0.04, duration: 0.5, ease: [0.4,0,0.2,1] }}
          >
            {t.label}
          </Motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}