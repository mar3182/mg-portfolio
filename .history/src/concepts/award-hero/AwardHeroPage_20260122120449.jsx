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
      
      {/* Main Hero Content - Clean, editorial space */}
      <main className="award-hero-main">
        {/* Minimal particles - barely visible */}
        <MatrixParticles />
        
        {/* Subtle floating shapes - muted, supportive */}
        <GradientShapes parallaxX={parallaxX} parallaxY={parallaxY} />
        
        {/* Three Portrait Layout - balanced triad */}
        <HeroPortraits 
          parallaxX={parallaxX} 
          parallaxY={parallaxY}
          onHover={() => setCursorVariant('view')}
          onLeave={() => setCursorVariant('default')}
        />
        
        {/* Hero Typography - Strong, readable, structural */}
        <div className="award-hero-typography">
          <AnimatePresence>
            {isLoaded && (
              <div className="hero-copy-group">
                <motion.h1 
                  className="award-hero-title"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <motion.span 
                    className="title-tech"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    TECH &
                  </motion.span>
                  <motion.span 
                    className="title-design"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    DESIGN
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="award-hero-subline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  Where systems meet emotion
                </motion.p>
                
                <motion.p 
                  className="award-hero-manifesto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                >
                  I design digital experiences where logic and emotion coexist.
                </motion.p>
              </div>
            )}
          </AnimatePresence>
        </div>
        
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
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5 }}
        >
          Copyright ©2026 Portfolio. All rights reserved.
        </motion.p>
      </footer>
    </motion.div>
  )
}
