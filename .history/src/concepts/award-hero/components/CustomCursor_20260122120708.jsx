/**
 * Custom Cursor Component
 * Morphing cursor with different states for interactions
 */

import { motion } from 'framer-motion'

const cursorVariants = {
  default: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    border: '1.5px solid rgba(10, 10, 10, 0.5)',
    mixBlendMode: 'normal',
  },
  link: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(10, 10, 10, 0.04)',
    border: '1.5px solid rgba(10, 10, 10, 0.4)',
    mixBlendMode: 'normal',
  },
  view: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(10, 10, 10, 0.06)',
    border: '1.5px solid rgba(10, 10, 10, 0.3)',
    mixBlendMode: 'normal',
  },
}

export function CustomCursor({ cursorX, cursorY, variant = 'default' }) {
  return (
    <>
      {/* Main cursor circle */}
      <motion.div
        className="custom-cursor"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        variants={cursorVariants}
        animate={variant}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 300,
          mass: 0.5,
        }}
      >
        {/* Inner content for "view" state */}
        <motion.span
          className="cursor-text"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: variant === 'view' ? 1 : 0,
            scale: variant === 'view' ? 1 : 0.5,
          }}
          transition={{ duration: 0.2 }}
        >
          View
        </motion.span>
      </motion.div>
      
      {/* Trailing dot */}
      <motion.div
        className="cursor-dot"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: variant === 'default' ? 1 : 0,
          opacity: variant === 'default' ? 1 : 0,
        }}
      />
    </>
  )
}
