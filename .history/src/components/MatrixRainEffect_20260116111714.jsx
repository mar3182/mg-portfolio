/**
 * MatrixRainEffect — Digital Code Rain for Tech Side
 * 
 * Creates "The Matrix" style falling code characters
 * when the tech side is expanded. Uses canvas for performance.
 */

import { useEffect, useRef, memo, useCallback } from 'react'
import './styles/matrix-rain.css'

// Characters to use (mix of code symbols, numbers, katakana-inspired)
const CHARS = '01アイウエオカキクケコサシスセソタチツテト{}[]<>/\\|=+-*&^%$#@!;:,.ABCDEFGHIJKLMNOPQRSTUVWXYZfunction()=>const let var if else return import export class extends implements interface type async await Promise useState useEffect useRef'.split('')

// Column configuration
const FONT_SIZE = 14
const COLUMN_WIDTH = FONT_SIZE + 2

class MatrixColumn {
  constructor(x, canvasHeight) {
    this.x = x
    this.canvasHeight = canvasHeight
    this.reset()
  }
  
  reset() {
    // Random starting position (above canvas)
    this.y = Math.random() * -500
    // Random speed
    this.speed = 3 + Math.random() * 7
    // Trail length
    this.trailLength = 10 + Math.floor(Math.random() * 20)
    // Characters in this column
    this.chars = Array.from({ length: this.trailLength }, () => 
      CHARS[Math.floor(Math.random() * CHARS.length)]
    )
    // Occasionally change a character
    this.mutationRate = 0.02
  }
  
  update() {
    this.y += this.speed
    
    // Mutate random characters
    if (Math.random() < this.mutationRate) {
      const idx = Math.floor(Math.random() * this.chars.length)
      this.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)]
    }
    
    // Reset when fully off screen
    if (this.y - this.trailLength * FONT_SIZE > this.canvasHeight) {
      this.reset()
    }
  }
  
  draw(ctx) {
    for (let i = 0; i < this.chars.length; i++) {
      const charY = this.y - i * FONT_SIZE
      
      // Skip if off screen
      if (charY < -FONT_SIZE || charY > this.canvasHeight + FONT_SIZE) continue
      
      // Calculate opacity based on position in trail
      const trailPos = i / this.chars.length
      let opacity = 1 - trailPos
      
      // First character is brightest (white/green)
      if (i === 0) {
        ctx.fillStyle = `rgba(180, 255, 180, ${opacity})`
        ctx.shadowColor = '#00ff00'
        ctx.shadowBlur = 10
      } else {
        // Trail fades from bright green to dark
        const greenIntensity = Math.floor(255 * (1 - trailPos * 0.7))
        ctx.fillStyle = `rgba(0, ${greenIntensity}, ${Math.floor(greenIntensity * 0.4)}, ${opacity * 0.8})`
        ctx.shadowBlur = 0
      }
      
      ctx.fillText(this.chars[i], this.x, charY)
    }
    ctx.shadowBlur = 0
  }
}

function MatrixRainEffect({ isActive = false }) {
  const canvasRef = useRef(null)
  const columnsRef = useRef([])
  const animationRef = useRef(null)
  const isActiveRef = useRef(isActive)
  
  // Update ref when prop changes
  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])
  
  const initColumns = useCallback((width, height) => {
    const numColumns = Math.ceil(width / COLUMN_WIDTH)
    columnsRef.current = Array.from({ length: numColumns }, (_, i) => 
      new MatrixColumn(i * COLUMN_WIDTH, height)
    )
  }, [])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    
    const resize = () => {
      const parent = canvas.parentElement
      width = parent?.clientWidth || window.innerWidth
      height = parent?.clientHeight || window.innerHeight
      
      canvas.width = width
      canvas.height = height
      
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", "Fira Code", monospace`
      ctx.textAlign = 'center'
      
      initColumns(width, height)
    }
    
    resize()
    window.addEventListener('resize', resize)
    
    // Animation loop
    const animate = () => {
      if (!isActiveRef.current) {
        // Fade out effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
        ctx.fillRect(0, 0, width, height)
      } else {
        // Clear with trail effect
        ctx.fillStyle = 'rgba(0, 10, 2, 0.1)'
        ctx.fillRect(0, 0, width, height)
        
        // Update and draw columns
        columnsRef.current.forEach(column => {
          column.update()
          column.draw(ctx)
        })
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initColumns])
  
  return (
    <div className={`matrix-rain ${isActive ? 'is-active' : ''}`} aria-hidden="true">
      <canvas ref={canvasRef} className="matrix-canvas" />
      
      {/* Overlay gradient for depth */}
      <div className="matrix-overlay" />
      
      {/* Scanline effect */}
      <div className="matrix-scanlines" />
    </div>
  )
}

export default memo(MatrixRainEffect)
