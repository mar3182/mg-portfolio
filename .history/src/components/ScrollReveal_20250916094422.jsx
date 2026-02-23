import { motion as Motion } from 'framer-motion'

// Animation variants
const fadeUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

/* other variants removed; keep file minimal for Fast Refresh */

// Reveal wrapper component with optimized viewport settings
export const RevealWrapper = ({ children, variants = fadeUpVariants, className = '', ...props }) => {
  return (
    <Motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: true, 
        amount: 0.2,
        margin: "0px 0px -100px 0px" 
      }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </Motion.div>
  )
}

// Stagger wrapper for lists and grids
export const StaggerWrapper = ({ children, className = '', delay = 0 }) => {
  return (
    <Motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: true, 
        amount: 0.1,
        margin: "0px 0px -50px 0px" 
      }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
            delayChildren: delay
          }
        }
      }}
      className={className}
    >
      {children}
    </Motion.div>
  )
}

// Individual stagger item
export const StaggerItem = ({ children, variants = fadeUpVariants, ...props }) => {
  return (
    <Motion.div
      variants={variants}
      {...props}
    >
      {children}
    </Motion.div>
  )
}
