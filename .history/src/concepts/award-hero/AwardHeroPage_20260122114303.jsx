/**
 * Award-Winning Hero Concept
 * A sophisticated portfolio design with:
 * - Magnetic cursor interactions
 * - Parallax mouse tracking
 * - Animated gradient shapes
 * - Matrix particle effects
 * - Creative typography with motion
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useMotionValue, useSpring, useTransform, AnimatePresence, motion } from 'framer-motion'
import { AwardNavigation } from './components/AwardNavigation'
import { CustomCursor } from './components/CustomCursor'
import { HeroPortraits } from './components/HeroPortraits'
import { GradientShapes } from './components/GradientShapes'
import { MatrixParticles } from './components/MatrixParticles'
import { SocialLinks } from './components/SocialLinks'
import './styles/award-hero.css'

export default function AwardHeroPage() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [cursorVariant, setCursorVariant] = useState('default')
  
  // Mouse position for parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Smooth spring for cursor
  const springConfig = { damping: 25, stiffness: 200 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)
  
  // Parallax transforms with different intensities
  const parallaxX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-30, 30])
  const parallaxY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-20, 20])
  
  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }, [mouseX, mouseY])
  
  useEffect(() => {
    // Trigger load animation
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <motion.div 
      ref={containerRef}
      className="award-hero-container"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Custom Cursor */}
      <CustomCursor 
        cursorX={cursorX} 
        cursorY={cursorY} 
        variant={cursorVariant}
      />
      
      {/* Left Navigation Sidebar */}
      <AwardNavigation 
        onHover={() => setCursorVariant('link')}
        onLeave={() => setCursorVariant('default')}
        isLoaded={isLoaded}
      />
      
      {/* Main Hero Content */}
      <main className="award-hero-main">
        {/* Matrix Particles Background */}
        <MatrixParticles />
        
        {/* Animated Gradient Shapes */}
        <GradientShapes parallaxX={parallaxX} parallaxY={parallaxY} />
        
        {/* Three Portrait Layout */}
        <HeroPortraits 
          parallaxX={parallaxX} 
          parallaxY={parallaxY}
          onHover={() => setCursorVariant('view')}
          onLeave={() => setCursorVariant('default')}
        />
        
        {/* Hero Typography */}
        <div className="award-hero-typography">
          <AnimatePresence>
            {isLoaded && (
              <>
                <motion.h1 
                  className="award-hero-title"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <motion.span 
                    className="title-tech"
                    initial={{ letterSpacing: '0.3em' }}
                    animate={{ letterSpacing: '0.05em' }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                  >
                    TECH &
                  </motion.span>
                  <motion.span 
                    className="title-design"
                    initial={{ letterSpacing: '0.3em', x: 50 }}
                    animate={{ letterSpacing: '0.05em', x: 0 }}
                    transition={{ duration: 1.2, delay: 0.7 }}
                  >
                    DESIGN
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="award-hero-subline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  Where systems meet emotion
                </motion.p>
                
                {/* Personal Manifesto */}
                <motion.p 
                  className="award-hero-manifesto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                >
                  I design digital experiences where logic and emotion coexist.
                </motion.p>
              </>
            )}
          </AnimatePresence>
        </div>
        
        {/* Decorative Stars */}
        <DecorativeStars isLoaded={isLoaded} />
        
        {/* Right Social Links */}
        <SocialLinks 
          onHover={() => setCursorVariant('link')}
          onLeave={() => setCursorVariant('default')}
        />
      </main>
      
      {/* Footer */}
      <footer className="award-hero-footer">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.8 }}
        >
          Copyright ©2026 Portfolio. All rights reserved.
        </motion.p>
      </footer>
    </motion.div>
  )
}

// Decorative floating stars
function DecorativeStars({ isLoaded }) {
  const stars = [
    { x: '35%', y: '75%', delay: 1.2, size: 24 },
    { x: '72%', y: '18%', delay: 1.4, size: 28 },
    { x: '88%', y: '55%', delay: 1.6, size: 20 },
  ]
  
  return (
    <div className="decorative-stars">
      {stars.map((star, i) => (
        <motion.svg
          key={i}
          className="star-icon"
          style={{ left: star.x, top: star.y }}
          width={star.size}
          height={star.size}
          viewBox="0 0 24 24"
          fill="none"
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={isLoaded ? { 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
          } : {}}
          transition={{ 
            duration: 0.8, 
            delay: star.delay,
            type: 'spring',
            stiffness: 200
          }}
        >
          <motion.path
            d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </motion.svg>
      ))}
    </div>
  )
}
