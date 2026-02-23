import React, { useEffect } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'

export default function LogoIntro({ show, onFinish }) {
  return (
    <AnimatePresence>
      {show && (
        <Motion.div
          className="logo-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.4,0,0.2,1] } }}
          transition={{ duration: 0.8 }}
        >
          <Motion.h1
            className="logo-intro-word"
            initial={{ scale: 0.85, letterSpacing: '-0.1em', opacity: 0 }}
            animate={{ scale: 1, letterSpacing: '-0.04em', opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.4,0,0.2,1] }}
            onAnimationComplete={() => setTimeout(onFinish, 450)}
            aria-label="MG Portfolio"
          >
            <span className="logo-intro-letter">M</span>
            <span className="logo-intro-letter">G</span>
          </Motion.h1>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
