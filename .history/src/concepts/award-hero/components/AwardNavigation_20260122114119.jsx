/**
 * Award Navigation
 * Animated sidebar with magnetic text effects and micro-interactions
 */

import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const navItems = [
  { id: 'home', label: 'HOME', active: true },
  { id: 'about', label: 'ABOUT' },
  { id: 'services', label: 'SERVICES' },
  { id: 'works', label: 'SELECTED WORK' },
  { id: 'thoughts', label: 'THOUGHTS' },
  { id: 'contact', label: "LET'S COLLABORATE" },
]

export function AwardNavigation({ onHover, onLeave, isLoaded }) {
  return (
    <motion.nav 
      className="award-nav"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Logo */}
      <motion.div 
        className="award-nav-logo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
      >
        <span className="logo-text">MP.</span>
      </motion.div>
      
      {/* Navigation Items */}
      <ul className="award-nav-list">
        {navItems.map((item, index) => (
          <MagneticNavItem 
            key={item.id}
            item={item}
            index={index}
            onHover={onHover}
            onLeave={onLeave}
            isLoaded={isLoaded}
          />
        ))}
      </ul>
      
      {/* Social Icons */}
      <div className="award-nav-social">
        {['Behance', 'Dribbble', 'Instagram'].map((social, i) => (
          <motion.a
            key={social}
            href="#"
            className="nav-social-icon"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.1 }}
            whileHover={{ scale: 1.2, y: -2 }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            aria-label={social}
          >
            <SocialIcon name={social} />
          </motion.a>
        ))}
      </div>
    </motion.nav>
  )
}

function MagneticNavItem({ item, index, onHover, onLeave, isLoaded }) {
  const ref = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  
  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Magnetic pull effect
    const deltaX = (e.clientX - centerX) * 0.3
    const deltaY = (e.clientY - centerY) * 0.3
    
    x.set(deltaX)
    y.set(deltaY)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
    onLeave()
  }
  
  const handleMouseEnter = () => {
    setIsHovered(true)
    onHover()
  }
  
  return (
    <motion.li
      ref={ref}
      className={`award-nav-item ${item.active ? 'active' : ''}`}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
    >
      <motion.a 
        href={`#${item.id}`}
        className="nav-link"
      >
        <span className="nav-label">{item.label}</span>
        
        {/* Active indicator */}
        {item.active && (
          <motion.span 
            className="nav-active-indicator"
            layoutId="activeNav"
          />
        )}
        
        {/* Hover underline */}
        <motion.span 
          className="nav-hover-line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.a>
    </motion.li>
  )
}

function SocialIcon({ name }) {
  const icons = {
    Behance: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M7.803 5.432c.589 0 1.12.051 1.593.156.473.104.872.274 1.198.507.326.232.577.53.753.889.176.36.264.79.264 1.291 0 .549-.135 1.016-.407 1.398-.272.383-.666.697-1.185.942.707.18 1.241.516 1.602 1.006.362.49.543 1.091.543 1.802 0 .549-.116 1.032-.349 1.449a3.097 3.097 0 01-.934 1.053c-.39.28-.84.491-1.348.63-.508.14-1.032.21-1.573.21H2V5.432h5.803zm-.351 4.574c.467 0 .856-.11 1.168-.331.312-.222.467-.575.467-1.058 0-.265-.051-.485-.152-.66a1.072 1.072 0 00-.407-.407 1.673 1.673 0 00-.59-.204 3.538 3.538 0 00-.703-.066H4.49v2.726h2.962zm.138 4.793c.27 0 .527-.028.773-.084.246-.056.461-.148.648-.274.186-.127.335-.3.445-.518.11-.218.165-.498.165-.84 0-.67-.2-1.149-.6-1.436-.4-.287-.925-.43-1.573-.43H4.49v3.582h3.1zM15.047 14.552c.355.377.868.566 1.538.566.48 0 .896-.123 1.248-.369.351-.246.566-.5.644-.763h2.136c-.342 1.068-.866 1.835-1.573 2.3-.707.466-1.561.699-2.564.699-.696 0-1.323-.113-1.88-.34a4.06 4.06 0 01-1.426-.966 4.332 4.332 0 01-.906-1.495 5.513 5.513 0 01-.32-1.92c0-.67.11-1.297.329-1.88a4.43 4.43 0 01.934-1.505 4.332 4.332 0 011.426-.998c.555-.24 1.17-.36 1.843-.36.746 0 1.396.14 1.95.42a3.94 3.94 0 011.379 1.134c.363.475.63 1.02.802 1.636.173.617.24 1.27.202 1.96h-6.372c.031.747.255 1.504.61 1.88zm2.685-4.672c-.284-.332-.74-.498-1.368-.498-.41 0-.752.07-1.026.212-.273.142-.495.318-.664.53a1.84 1.84 0 00-.34.657 3.004 3.004 0 00-.108.576h4.172c-.08-.613-.282-1.146-.666-1.477zM14.473 5.985h4.342v1.239h-4.342z"/>
      </svg>
    ),
    Dribbble: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.424 25.424 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.245.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"/>
      </svg>
    ),
    Instagram: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  }
  
  return icons[name] || null
}
