import { motion } from 'framer-motion'

// Fade up animation - most common reveal
export const fadeUpVariants = {
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

// Stagger children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

// Scale in animation for cards
export const scaleInVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
}

// Slide in from left
export const slideInLeftVariants = {
  hidden: { 
    opacity: 0, 
    x: -60,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

// Slide in from right
export const slideInRightVariants = {
  hidden: { 
    opacity: 0, 
    x: 60,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

// Draw line animation for dividers
export const drawLineVariants = {
  hidden: { 
    pathLength: 0,
    opacity: 0
  },
  visible: { 
    pathLength: 1,
    opacity: 1,
    transition: { 
      duration: 1.2,
      ease: "easeInOut"
    }
  }
}

// Counter animation for numbers
export const counterVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
}

// Reveal wrapper component with optimized viewport settings
export const RevealWrapper = ({ children, variants = fadeUpVariants, className = '', ...props }) => {
  return (
    <motion.div
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
    </motion.div>
  )
}

// Stagger wrapper for lists and grids
export const StaggerWrapper = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
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
    </motion.div>
  )
}

// Individual stagger item
export const StaggerItem = ({ children, variants = fadeUpVariants, ...props }) => {
  return (
    <motion.div
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default {
  fadeUpVariants,
  staggerContainer,
  scaleInVariants,
  slideInLeftVariants,
  slideInRightVariants,
  drawLineVariants,
  counterVariants,
  RevealWrapper,
  StaggerWrapper,
  StaggerItem
}