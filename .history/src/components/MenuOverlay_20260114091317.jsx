import React, { useEffect, useRef } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { useFocusTrap } from '../hooks/useFocusTrap'

const menuItems = [
  { path: '/projects', label: 'Projects', icon: '◈' },
  { path: '/blog', label: 'Blog', icon: '◉' },
  { path: '/expertise', label: 'Expertise', icon: '◆' },
  { path: '/agency', label: 'Agency', icon: '◇' },
  { path: '/contact', label: 'Contact', icon: '●' },
]

const menuVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } }
}

export default function MenuOverlay({ open, onClose }) {
  const ref = useRef(null)
  const panelRef = useRef(null)
  useFocusTrap(ref, open)
  
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
  
  useEffect(() => {
    if (open && ref.current) {
      const first = ref.current.querySelector('a,button,input,textarea,select')
      first && first.focus()
    }
  }, [open])

  // Handle backdrop click to close menu
  const handleBackdropClick = (e) => {
    // Only close if clicking on the backdrop itself, not the menu content
    if (e.target === panelRef.current) {
      onClose()
    }
  }
  
  return (
    <AnimatePresence>
      {open && (
        <Motion.div 
          ref={panelRef}
          className="menu-overlay-panel" 
          role="dialog" 
          aria-modal="true" 
          aria-label="Navigation Menu"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}
          onClick={handleBackdropClick}
        >
          <div className="menu-overlay-inner" ref={ref}>
            <button onClick={onClose} className="menu-close" aria-label="Close menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <nav className="menu-nav">
              <ul className="menu-links" role="list">
                {menuItems.map((item) => (
                  <Motion.li key={item.path} variants={itemVariants}>
                    <NavLink 
                      to={item.path} 
                      onClick={onClose}
                      className={({ isActive }) => isActive ? 'is-active' : ''}
                    >
                      <span className="menu-item-icon" aria-hidden="true">{item.icon}</span>
                      <span className="menu-item-label">{item.label}</span>
                      <span className="menu-item-arrow" aria-hidden="true">→</span>
                    </NavLink>
                  </Motion.li>
                ))}
              </ul>
            </nav>
            <div className="menu-footer">
              <p className="menu-tagline">T-Shaped Professional</p>
              <p className="menu-copyright">© 2025 MG Portfolio</p>
            </div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}