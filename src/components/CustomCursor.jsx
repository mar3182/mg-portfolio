import React, { useEffect, useRef, useState, useCallback } from 'react'

/**
 * CustomCursor - Immersive Interactive Cursor Experience
 * 
 * This cursor guides users through the portfolio by communicating
 * context and encouraging exploration. Each element type triggers
 * a unique cursor state that hints at the interaction available.
 * 
 * CURSOR STATES:
 * ─────────────────────────────────────────────────────────────
 * DEFAULT     → Subtle dot + ring (ambient awareness)
 * EXPLORE     → Expands with "EXPLORE" - for project cards
 * VIEW        → Shows "VIEW" - for preview triggers
 * DISCOVER    → Rotating ring + "DISCOVER" - for nav items
 * EXPAND      → Pulsing + "EXPAND" - for expandable content
 * SCROLL      → Directional arrows - for scroll hints
 * DRAG        → Grab cursor - for draggable elements
 * MAGNETIC    → Pulls toward element center - for CTAs
 * ─────────────────────────────────────────────────────────────
 */

// Cursor state configurations
const CURSOR_STATES = {
  default: { text: '', scale: 1, blend: 'normal' },
  explore: { text: 'EXPLORE', scale: 1.8, blend: 'difference', icon: '◈' },
  view: { text: 'VIEW', scale: 1.6, blend: 'normal', icon: '→' },
  preview: { text: 'PREVIEW', scale: 1.5, blend: 'normal', icon: '◎' },
  discover: { text: 'DISCOVER', scale: 1.5, blend: 'normal', icon: '✦' },
  expand: { text: 'EXPAND', scale: 1.4, blend: 'normal', icon: '↗' },
  scroll: { text: 'SCROLL', scale: 1.3, blend: 'normal', icon: '↕' },
  drag: { text: 'DRAG', scale: 1.4, blend: 'normal', icon: '⇄' },
  click: { text: 'CLICK', scale: 1.3, blend: 'normal', icon: '●' },
  read: { text: 'READ', scale: 1.4, blend: 'normal', icon: '◉' },
  email: { text: 'EMAIL', scale: 1.5, blend: 'normal', icon: '✉' },
  call: { text: 'CALL', scale: 1.5, blend: 'normal', icon: '☎' },
  visit: { text: 'VISIT', scale: 1.5, blend: 'normal', icon: '↗' },
  play: { text: 'PLAY', scale: 1.6, blend: 'normal', icon: '▶' },
  next: { text: 'NEXT', scale: 1.3, blend: 'normal', icon: '→' },
  prev: { text: 'PREV', scale: 1.3, blend: 'normal', icon: '←' },
}

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const glowRef = useRef(null)
  
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const target = useRef({ x: pos.current.x, y: pos.current.y })
  const velocity = useRef({ x: 0, y: 0 })
  const magnetic = useRef({ x: 0, y: 0, active: false })
  const raf = useRef(null)
  
  const [cursorState, setCursorState] = useState('default')
  const [isPressed, setIsPressed] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse) or (max-width: 1023px)').matches

  // Determine cursor state from element
  const getCursorState = useCallback((element) => {
    if (!element) return 'default'
    
    // Check for explicit cursor type first
    const cursorType = element.getAttribute('data-cursor')
    if (cursorType && CURSOR_STATES[cursorType]) return cursorType
    
    // Check data-cursor-type (legacy support)
    const legacyType = element.getAttribute('data-cursor-type')
    if (legacyType === 'view') return 'view'
    if (legacyType === 'project') return 'explore'
    
    // Find interactive parent
    const interactive = element.closest(`
      a, button, [role="button"], 
      .focus-panel, .project-preview, .project-card-grid, 
      .team-card, .contact-toggle, .nav-arrow, .nav-dot,
      .showcase-gallery3d-card, .showcase-gallery3d-link,
      .primary-nav a, .menu-links a, .social-icon,
      .expertise-card, .area-card, .blog-card,
      [data-cursor], [data-cursor-type]
    `)
    
    if (!interactive) return 'default'
    
    // Determine state based on element type/class
    const classList = interactive.classList
    const tagName = interactive.tagName.toLowerCase()
    
    // Navigation elements
    if (classList.contains('nav-arrow')) return 'click'
    if (classList.contains('nav-dot')) return 'click'
    if (interactive.closest('.primary-nav') || interactive.closest('.menu-links')) return 'discover'
    if (classList.contains('social-icon')) return 'visit'
    
    // Project/content elements  
    if (classList.contains('showcase-gallery3d-card')) {
      return classList.contains('is-active') ? 'view' : 'explore'
    }
    if (classList.contains('showcase-gallery3d-link')) return 'view'
    if (classList.contains('project-preview') || classList.contains('project-card-grid')) return 'explore'
    if (classList.contains('blog-card')) return 'read'
    if (classList.contains('expertise-card') || classList.contains('area-card')) return 'expand'
    if (classList.contains('focus-panel')) return 'expand'
    if (classList.contains('team-card')) return 'expand'
    
    // Links
    if (tagName === 'a' && interactive.href) {
      if (interactive.href.includes('mailto:')) return 'email'
      if (interactive.href.includes('tel:')) return 'call'
      if (interactive.href.startsWith('http') && !interactive.href.includes(window.location.hostname)) return 'visit'
    }
    
    // Buttons
    if (tagName === 'button' || interactive.getAttribute('role') === 'button') {
      return 'click'
    }
    
    return 'default'
  }, [])

  useEffect(() => {
    if (prefersReduced || isMobile) return
    
    let lastElement = null
    
    const handleMove = (e) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
      
      // Calculate velocity for effects
      velocity.current.x = e.movementX || 0
      velocity.current.y = e.movementY || 0
    }
    
    const handleOver = (e) => {
      const element = e.target
      if (element === lastElement) return
      lastElement = element
      
      const state = getCursorState(element)
      setCursorState(state)
      
      // Check for magnetic attraction
      const magneticEl = element.closest('[data-cursor-magnetic]')
      if (magneticEl) {
        const rect = magneticEl.getBoundingClientRect()
        magnetic.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          active: true,
          strength: parseFloat(magneticEl.getAttribute('data-cursor-magnetic')) || 0.3
        }
      } else {
        magnetic.current.active = false
      }
    }
    
    const handleDown = () => setIsPressed(true)
    const handleUp = () => setIsPressed(false)
    
    const handleLeave = () => setIsHidden(true)
    const handleEnter = () => setIsHidden(false)
    
    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerover', handleOver, { passive: true })
    window.addEventListener('pointerdown', handleDown)
    window.addEventListener('pointerup', handleUp)
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mouseenter', handleEnter)
    
    function frame() {
      // Apply magnetic effect
      let targetX = target.current.x
      let targetY = target.current.y
      
      if (magnetic.current.active) {
        const dx = magnetic.current.x - target.current.x
        const dy = magnetic.current.y - target.current.y
        targetX += dx * magnetic.current.strength
        targetY += dy * magnetic.current.strength
      }
      
      // Smooth cursor movement with easing
      const ease = 0.18
      pos.current.x += (targetX - pos.current.x) * ease
      pos.current.y += (targetY - pos.current.y) * ease
      
      // Apply transforms
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`
      }
      if (ringRef.current) {
        const state = CURSOR_STATES[cursorState] || CURSOR_STATES.default
        const pressScale = isPressed ? 0.85 : 1
        const scale = state.scale * pressScale
        ringRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${scale})`
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(-50%, -50%) translate3d(${pos.current.x}px, ${pos.current.y - 35}px, 0)`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      }
      
      raf.current = requestAnimationFrame(frame)
    }
    raf.current = requestAnimationFrame(frame)
    
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerover', handleOver)
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointerup', handleUp)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseenter', handleEnter)
      cancelAnimationFrame(raf.current)
    }
  }, [prefersReduced, isMobile, cursorState, isPressed, getCursorState])

  if (prefersReduced || isMobile) return null
  
  const state = CURSOR_STATES[cursorState] || CURSOR_STATES.default
  const isActive = cursorState !== 'default'

  return (
    <div 
      className="custom-cursor-layer" 
      aria-hidden="true"
      style={{ opacity: isHidden ? 0 : 1 }}
    >
      {/* Ambient glow effect */}
      <div 
        ref={glowRef}
        className={`cursor-glow ${isActive ? 'cursor-glow-active' : ''}`}
      />
      
      {/* Main ring - expands on interaction */}
      <div 
        ref={ringRef} 
        className={`cursor-ring ${isActive ? 'cursor-ring-active' : ''} ${isPressed ? 'cursor-ring-pressed' : ''}`}
        style={{
          mixBlendMode: state.blend,
        }}
      />
      
      {/* Center dot */}
      <div 
        ref={dotRef} 
        className={`cursor-dot ${isActive ? 'cursor-dot-active' : ''}`}
      />
      
      {/* Contextual label */}
      <div 
        ref={labelRef}
        className={`cursor-label ${isActive ? 'cursor-label-visible' : ''}`}
      >
        {state.icon && <span className="cursor-label-icon">{state.icon}</span>}
        <span className="cursor-label-text">{state.text}</span>
      </div>
    </div>
  )
}
