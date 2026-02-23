/**
 * Social Links Component
 * Right-side vertical social icons with hover animations
 */

import { motion } from 'framer-motion'

const socialLinks = [
  { 
    name: 'Instagram', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="1" fill="currentColor" />
      </svg>
    ),
    url: '#',
  },
  { 
    name: 'Dribbble', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
      </svg>
    ),
    url: '#',
  },
  { 
    name: 'Twitter', 
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    url: '#',
  },
]

export function SocialLinks({ onHover, onLeave }) {
  return (
    <motion.div 
      className="social-links-right"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.url}
          className="social-link"
          aria-label={social.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + index * 0.1 }}
          whileHover={{ 
            scale: 1.15,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          <motion.span 
            className="social-icon"
            whileHover={{ rotate: 5 }}
          >
            {social.icon}
          </motion.span>
        </motion.a>
      ))}
      
      {/* Vertical line */}
      <motion.div 
        className="social-line"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      />
    </motion.div>
  )
}
