/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PORTRAIT ECOSYSTEM — Living Growth from Portrait Origin
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The portrait is the seed. Two worlds grow from it:
 * 
 * 🌿 DESIGN (Left): Organic flora — vines, flowers, leaves
 *    - Grows from hair/head region
 *    - Waves gently, responds to mouse like wind
 *    - Blooms and unfurls organically
 * 
 * ⚡ TECH (Right): Circuit network — wires, nodes, data pulses
 *    - Extends from head like neural connections
 *    - Pulses with data flow
 *    - Connects and branches algorithmically
 * 
 * Both ecosystems blend based on identity value (0 = full flora, 1 = full circuit)
 */

import { useRef, useEffect, useCallback, memo } from 'react'
import { useSmoothedIdentity } from '../hooks/useIdentity'
import './styles/portrait-ecosystem.css'

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // TERRITORIAL ORIGINS — Flora owns LEFT (0-40%), Circuits own RIGHT (60-100%)
  floraOrigins: [
    { x: 0.08, y: 0.15 },
    { x: 0.15, y: 0.4 },
    { x: 0.05, y: 0.65 },
    { x: 0.20, y: 0.85 },
    { x: 0.35, y: 0.3 },
    { x: 0.30, y: 0.55 },
    { x: 0.25, y: 0.75 },
  ],
  circuitOrigins: [
    { x: 0.92, y: 0.15 },
    { x: 0.85, y: 0.4 },
    { x: 0.95, y: 0.65 },
    { x: 0.80, y: 0.85 },
    { x: 0.65, y: 0.3 },
    { x: 0.70, y: 0.55 },
    { x: 0.75, y: 0.75 },
  ],
  
  // Base opacity and hover intensity
  baseOpacity: 0.12,
  hoverIntensity: 0.6,
  // Dynamic hover radius (will be calculated based on viewport)
  getHoverRadius: () => Math.min(300, Math.max(150, window.innerWidth * 0.15)),
  
  // Breathing animation — subtle ambient life
  breathing: {
    enabled: true,
    speed: 0.0008,
    scaleAmount: 0.03, // 3% scale pulse
    opacityAmount: 0.08, // 8% opacity pulse
  },
  
  // Flora settings — PORTRAIT ILLUSTRATION STYLE
  // Geometric shapes, simple silhouette leaves, flowing lines, paint splatters
  flora: {
    maxVines: 15, // Flowing decorative lines
    maxFlowers: 25,
    maxLeaves: 80, // Simple silhouette leaves
    maxTropicalLeaves: 0, // Not using these anymore
    maxFerns: 0, // Not using these anymore
    maxCircles: 25, // Geometric sun/orb shapes
    maxDots: 60, // Scattered dots
    maxSplatters: 20, // Paint splatter effects
    maxBranches: 15, // Stylized branch with leaves
    growthSpeed: 0.0008,
    waveSpeed: 0.001,
    waveAmount: 15,
    // Portrait palette — navy/indigo + warm orange/coral + golden yellow
    colors: {
      vine: ['#1a2a4a', '#2a3a5a', '#3a4a6a'], // Deep navy flowing lines
      flower: [
        '#e85a5a', '#f06a4a', '#ff8c5a', // Warm reds/oranges
        '#e84a8a', '#ff6b9d', // Magentas/pinks
        '#ffc93c', '#ffab2e', '#f4d03f', // Golden yellows
      ],
      leaf: [
        '#1a2a4a', '#2a3a5a', '#0d1a2d', // Dark navy silhouettes
        '#f4a06a', '#e8905a', '#ffc07a', // Warm orange leaves
      ],
      circle: [
        '#ff8c42', '#ffa054', '#ffb347', // Orange orbs
        '#ffc93c', '#ffd700', // Golden suns
        '#4a7aaa', '#5a8aba', // Blue accent circles
      ],
      dot: [
        '#ff6b4a', '#ff8c5a', '#ffa07a', // Coral/orange dots
        '#4a6a9a', '#5a7aaa', '#3a5a8a', // Navy/blue dots
        '#ffc93c', '#ffab2e', // Golden dots
      ],
      splatter: [
        '#3a5a8a', '#4a6a9a', '#2a4a7a', // Blue splatters
        '#ff8c5a', '#ffa07a', '#ffb090', // Orange splatters
      ],
      branch: ['#1a2a4a', '#2a3a5a', '#0d1a2d'], // Dark navy branches
    },
    // Depth layers for parallax
    depthLayers: [
      { scale: 0.5, opacity: 0.4, speed: 0.4 },
      { scale: 0.7, opacity: 0.6, speed: 0.6 },
      { scale: 0.85, opacity: 0.8, speed: 0.8 },
      { scale: 1.0, opacity: 1.0, speed: 1.0 },
    ]
  },
  
  // Circuit settings
  circuit: {
    maxWires: 25,
    maxNodes: 35,
    maxPulses: 40,
    pulseSpeed: 0.002,
    connectionRadius: 150,
    colors: {
      wire: ['#0a3a2a', '#0d4a35', '#105a40'],
      node: ['#00ff88', '#20ffa0', '#40ffb0'],
      pulse: ['#50ffc0', '#70ffd0', '#90ffe0'],
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FLORA CLASSES — Organic Growth
// ═══════════════════════════════════════════════════════════════════════════

class Vine {
  constructor(canvas, startX, startY, angle, config) {
    this.canvas = canvas
    this.startX = startX
    this.startY = startY
    this.angle = angle + (Math.random() - 0.5) * 0.5
    this.length = 0
    this.maxLength = 100 + Math.random() * 200
    this.thickness = 2 + Math.random() * 3
    this.segments = []
    this.growthProgress = 0
    this.color = config.colors.vine[Math.floor(Math.random() * config.colors.vine.length)]
    this.waveOffset = Math.random() * Math.PI * 2
    this.curveStrength = 0.3 + Math.random() * 0.4
  }
  
  grow(dt, waveTime, mouse) {
    if (this.growthProgress < 1) {
      this.growthProgress += dt * CONFIG.flora.growthSpeed * (0.5 + Math.random() * 0.5)
    }
    
    // Rebuild segments with wave motion
    this.segments = []
    const segmentCount = Math.floor(this.maxLength / 10)
    
    let x = this.startX
    let y = this.startY
    let angle = this.angle
    
    for (let i = 0; i < segmentCount; i++) {
      const progress = i / segmentCount
      if (progress > this.growthProgress) break
      
      // Organic curve
      const curve = Math.sin(progress * Math.PI * 2 + this.waveOffset) * this.curveStrength
      // Wind wave (base)
      let wave = Math.sin(waveTime + progress * 3 + this.waveOffset) * CONFIG.flora.waveAmount * progress
      
      // MOUSE WIND EFFECT — flora bends away from cursor like wind
      if (mouse) {
        const mouseX = mouse.x * this.canvas.width
        const mouseY = mouse.y * this.canvas.height
        const dx = x - mouseX
        const dy = y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const influence = Math.max(0, 1 - dist / 300) // 300px influence radius
        // Push segments away from mouse
        wave += dx * influence * 0.15 * progress
      }
      
      angle += curve * 0.1
      x += Math.cos(angle) * 10 + wave * 0.1
      y += Math.sin(angle) * 10
      
      this.segments.push({ x, y, thickness: this.thickness * (1 - progress * 0.7) })
    }
  }
  
  draw(ctx, opacity) {
    if (this.segments.length < 2) return
    
    ctx.strokeStyle = this.color
    ctx.lineCap = 'round'
    ctx.globalAlpha = opacity * 0.7
    
    ctx.beginPath()
    ctx.moveTo(this.segments[0].x, this.segments[0].y)
    
    for (let i = 1; i < this.segments.length; i++) {
      const seg = this.segments[i]
      ctx.lineWidth = seg.thickness
      ctx.lineTo(seg.x, seg.y)
    }
    
    ctx.stroke()
    ctx.globalAlpha = 1
  }
}

class Flower {
  constructor(x, y, config) {
    this.x = x
    this.y = y
    this.baseX = x
    this.baseY = y
    this.size = 0
    this.maxSize = 10 + Math.random() * 20 // Larger flowers
    this.petalCount = 5 + Math.floor(Math.random() * 5) // 5-9 petals
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.0008
    this.bloomProgress = 0
    this.color = config.colors.flower[Math.floor(Math.random() * config.colors.flower.length)]
    // Second color for gradient petals (Frida Kahlo style)
    this.color2 = config.colors.flower[Math.floor(Math.random() * config.colors.flower.length)]
    this.delay = Math.random() * 1500
    this.born = Date.now()
    // Flower style: 0 = simple, 1 = layered, 2 = dahlia-like
    this.flowerStyle = Math.floor(Math.random() * 3)
    this.innerRings = 1 + Math.floor(Math.random() * 2)
  }
  
  update(dt, mouse, canvasWidth, canvasHeight) {
    if (Date.now() - this.born < this.delay) return
    
    if (this.bloomProgress < 1) {
      this.bloomProgress += dt * 0.0004
    }
    this.size = this.maxSize * this.easeOutBack(Math.min(1, this.bloomProgress))
    this.rotation += this.rotationSpeed * dt
    
    // MOUSE SWAY — flowers turn toward cursor like sunflowers
    if (mouse && canvasWidth && canvasHeight) {
      const mouseX = mouse.x * canvasWidth
      const mouseY = mouse.y * canvasHeight
      const dx = mouseX - this.baseX
      const dy = mouseY - this.baseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const influence = Math.max(0, 1 - dist / 250)
      
      // Flowers sway toward mouse
      this.x = this.baseX + dx * influence * 0.08
      this.y = this.baseY + dy * influence * 0.08
    }
  }
  
  easeOutBack(t) {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  }
  
  draw(ctx, opacity, waveTime) {
    if (this.size < 1) return
    
    const wave = Math.sin(waveTime * 0.5 + this.x * 0.01) * 3
    
    ctx.save()
    ctx.translate(this.x + wave, this.y)
    ctx.rotate(this.rotation)
    ctx.globalAlpha = opacity * 0.85
    
    if (this.flowerStyle === 0) {
      // SIMPLE FLOWER — Classic petals
      this.drawSimpleFlower(ctx)
    } else if (this.flowerStyle === 1) {
      // LAYERED FLOWER — Multiple rings (like hibiscus)
      this.drawLayeredFlower(ctx)
    } else {
      // DAHLIA-LIKE — Many small petals radiating out
      this.drawDahliaFlower(ctx)
    }
    
    ctx.restore()
    ctx.globalAlpha = 1
  }
  
  drawSimpleFlower(ctx) {
    // Outer petals
    ctx.fillStyle = this.color
    for (let i = 0; i < this.petalCount; i++) {
      const angle = (i / this.petalCount) * Math.PI * 2
      ctx.save()
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.ellipse(this.size * 0.5, 0, this.size * 0.55, this.size * 0.28, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    
    // Golden center with texture
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.25)
    gradient.addColorStop(0, '#ffd700')
    gradient.addColorStop(0.6, '#daa520')
    gradient.addColorStop(1, '#b8860b')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2)
    ctx.fill()
  }
  
  drawLayeredFlower(ctx) {
    // Outer ring (larger, lighter)
    ctx.fillStyle = this.color
    for (let i = 0; i < this.petalCount; i++) {
      const angle = (i / this.petalCount) * Math.PI * 2
      ctx.save()
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.ellipse(this.size * 0.55, 0, this.size * 0.5, this.size * 0.25, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    
    // Inner ring (smaller, offset, different color)
    ctx.fillStyle = this.color2
    for (let i = 0; i < this.petalCount; i++) {
      const angle = (i / this.petalCount) * Math.PI * 2 + Math.PI / this.petalCount
      ctx.save()
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.ellipse(this.size * 0.35, 0, this.size * 0.35, this.size * 0.18, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    
    // Rich center
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.2)
    gradient.addColorStop(0, '#8b0000')
    gradient.addColorStop(0.5, '#dc143c')
    gradient.addColorStop(1, '#ff6347')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, this.size * 0.18, 0, Math.PI * 2)
    ctx.fill()
  }
  
  drawDahliaFlower(ctx) {
    // Many small pointed petals radiating outward
    const petalLayers = 3
    
    for (let layer = petalLayers - 1; layer >= 0; layer--) {
      const layerScale = 0.4 + layer * 0.3
      const petalsInLayer = this.petalCount + layer * 3
      const layerColor = layer === 0 ? this.color2 : this.color
      
      ctx.fillStyle = layerColor
      for (let i = 0; i < petalsInLayer; i++) {
        const angle = (i / petalsInLayer) * Math.PI * 2 + layer * 0.2
        ctx.save()
        ctx.rotate(angle)
        
        // Pointed petal shape
        ctx.beginPath()
        ctx.moveTo(this.size * 0.1, 0)
        ctx.quadraticCurveTo(
          this.size * layerScale * 0.5, -this.size * 0.08,
          this.size * layerScale, 0
        )
        ctx.quadraticCurveTo(
          this.size * layerScale * 0.5, this.size * 0.08,
          this.size * 0.1, 0
        )
        ctx.fill()
        ctx.restore()
      }
    }
    
    // Textured center
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.15)
    gradient.addColorStop(0, '#ffd700')
    gradient.addColorStop(0.7, '#b8860b')
    gradient.addColorStop(1, '#8b4513')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, this.size * 0.12, 0, Math.PI * 2)
    ctx.fill()
  }
}

class Leaf {
  constructor(x, y, angle, config, depthLayer = null) {
    this.x = x
    this.y = y
    this.baseX = x
    this.baseY = y
    this.angle = angle
    
    // Depth layer for jungle parallax effect
    this.depth = depthLayer || config.depthLayers[Math.floor(Math.random() * config.depthLayers.length)]
    
    // Size varies by depth — smaller = further back
    const baseSize = 8 + Math.random() * 25
    this.maxSize = baseSize * this.depth.scale
    this.size = 0
    this.growthProgress = 0
    
    this.color = config.colors.leaf[Math.floor(Math.random() * config.colors.leaf.length)]
    this.waveOffset = Math.random() * Math.PI * 2
    this.delay = Math.random() * 1000 * (1 / this.depth.speed) // Back layers appear first
    this.born = Date.now()
    
    // Leaf shape variation
    this.leafType = Math.floor(Math.random() * 3) // 0: oval, 1: pointed, 2: round
    this.curvature = 0.2 + Math.random() * 0.3
  }
  
  update(dt, waveTime) {
    if (Date.now() - this.born < this.delay) return
    
    if (this.growthProgress < 1) {
      this.growthProgress += dt * 0.0008 * this.depth.speed
    }
    this.size = this.maxSize * Math.min(1, this.growthProgress)
    
    // Gentle sway based on depth (back layers move less)
    const sway = Math.sin(waveTime * 0.5 + this.waveOffset) * 5 * this.depth.speed
    this.x = this.baseX + sway
  }
  
  draw(ctx, opacity, waveTime) {
    if (this.size < 2) return
    
    const wave = Math.sin(waveTime + this.waveOffset) * 0.15 * this.depth.speed
    const layerOpacity = opacity * this.depth.opacity * 0.7
    
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle + wave)
    ctx.globalAlpha = layerOpacity
    ctx.fillStyle = this.color
    
    // Different leaf shapes
    ctx.beginPath()
    if (this.leafType === 0) {
      // Oval leaf
      ctx.ellipse(this.size * 0.5, 0, this.size * 0.6, this.size * 0.25, 0, 0, Math.PI * 2)
    } else if (this.leafType === 1) {
      // Pointed leaf
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(this.size * 0.3, -this.size * this.curvature, this.size, 0)
      ctx.quadraticCurveTo(this.size * 0.3, this.size * this.curvature, 0, 0)
    } else {
      // Round/heart leaf
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(
        this.size * 0.2, -this.size * 0.4,
        this.size * 0.8, -this.size * 0.3,
        this.size, 0
      )
      ctx.bezierCurveTo(
        this.size * 0.8, this.size * 0.3,
        this.size * 0.2, this.size * 0.4,
        0, 0
      )
    }
    ctx.fill()
    
    // Leaf vein (more prominent on front layers)
    if (this.depth.scale > 0.6) {
      ctx.strokeStyle = `rgba(255,255,255,${0.15 * this.depth.opacity})`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(this.size * 0.8, 0)
      ctx.stroke()
    }
    
    ctx.restore()
    ctx.globalAlpha = 1
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TROPICAL LEAF — Large Monstera/Palm style leaves (Frida Kahlo jungle)
// ═══════════════════════════════════════════════════════════════════════════

class TropicalLeaf {
  constructor(x, y, angle, config, depthLayer = null) {
    this.x = x
    this.y = y
    this.baseX = x
    this.baseY = y
    this.angle = angle
    
    // Depth layer for parallax
    this.depth = depthLayer || config.depthLayers[Math.floor(Math.random() * config.depthLayers.length)]
    
    // Large leaves — 40-100px base, scaled by depth
    const baseSize = 40 + Math.random() * 60
    this.maxSize = baseSize * this.depth.scale
    this.size = 0
    this.growthProgress = 0
    
    this.color = config.colors.tropicalLeaf[Math.floor(Math.random() * config.colors.tropicalLeaf.length)]
    this.waveOffset = Math.random() * Math.PI * 2
    this.delay = Math.random() * 800 * (1 / this.depth.speed)
    this.born = Date.now()
    
    // Monstera has holes, palm has segments
    this.leafStyle = Math.random() > 0.5 ? 'monstera' : 'palm'
    this.segments = 5 + Math.floor(Math.random() * 4)
  }
  
  update(dt, waveTime) {
    if (Date.now() - this.born < this.delay) return
    
    if (this.growthProgress < 1) {
      this.growthProgress += dt * 0.0005 * this.depth.speed
    }
    this.size = this.maxSize * Math.min(1, this.growthProgress)
    
    // Heavy leaves sway slowly
    const sway = Math.sin(waveTime * 0.3 + this.waveOffset) * 8 * this.depth.speed
    this.x = this.baseX + sway
  }
  
  draw(ctx, opacity, waveTime) {
    if (this.size < 5) return
    
    const wave = Math.sin(waveTime * 0.4 + this.waveOffset) * 0.1 * this.depth.speed
    const layerOpacity = opacity * this.depth.opacity * 0.65
    
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle + wave)
    ctx.globalAlpha = layerOpacity
    
    if (this.leafStyle === 'monstera') {
      this.drawMonstera(ctx)
    } else {
      this.drawPalm(ctx)
    }
    
    ctx.restore()
    ctx.globalAlpha = 1
  }
  
  drawMonstera(ctx) {
    const s = this.size
    
    // Main leaf shape
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(s * 0.3, -s * 0.5, s * 0.7, -s * 0.4, s, 0)
    ctx.bezierCurveTo(s * 0.7, s * 0.4, s * 0.3, s * 0.5, 0, 0)
    ctx.fill()
    
    // Monstera holes (characteristic splits)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'black'
    for (let i = 0; i < 3; i++) {
      const holeX = s * (0.3 + i * 0.2)
      const holeY = (i % 2 === 0 ? -1 : 1) * s * 0.15
      const holeSize = s * 0.08
      ctx.beginPath()
      ctx.ellipse(holeX, holeY, holeSize, holeSize * 1.5, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'source-over'
    
    // Central vein
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(s * 0.9, 0)
    ctx.stroke()
  }
  
  drawPalm(ctx) {
    const s = this.size
    
    // Palm frond — multiple segments
    ctx.fillStyle = this.color
    
    for (let i = 0; i < this.segments; i++) {
      const segAngle = (i - this.segments / 2) * 0.15
      const segLength = s * (0.7 + Math.random() * 0.3)
      
      ctx.save()
      ctx.rotate(segAngle)
      
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(segLength * 0.5, -s * 0.03, segLength, 0)
      ctx.quadraticCurveTo(segLength * 0.5, s * 0.03, 0, 0)
      ctx.fill()
      
      ctx.restore()
    }
    
    // Central stem
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(s * 0.3, 0)
    ctx.stroke()
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FERN — Delicate fronds for jungle understory
// ═══════════════════════════════════════════════════════════════════════════

class Fern {
  constructor(x, y, angle, config, depthLayer = null) {
    this.x = x
    this.y = y
    this.baseX = x
    this.baseY = y
    this.angle = angle
    
    this.depth = depthLayer || config.depthLayers[Math.floor(Math.random() * config.depthLayers.length)]
    
    const baseSize = 25 + Math.random() * 40
    this.maxSize = baseSize * this.depth.scale
    this.size = 0
    this.growthProgress = 0
    
    this.color = config.colors.fern[Math.floor(Math.random() * config.colors.fern.length)]
    this.waveOffset = Math.random() * Math.PI * 2
    this.delay = Math.random() * 600 * (1 / this.depth.speed)
    this.born = Date.now()
    
    this.leaflets = 8 + Math.floor(Math.random() * 6)
  }
  
  update(dt, waveTime) {
    if (Date.now() - this.born < this.delay) return
    
    if (this.growthProgress < 1) {
      this.growthProgress += dt * 0.0007 * this.depth.speed
    }
    this.size = this.maxSize * Math.min(1, this.growthProgress)
    
    // Ferns sway delicately
    const sway = Math.sin(waveTime * 0.8 + this.waveOffset) * 4 * this.depth.speed
    this.x = this.baseX + sway
  }
  
  draw(ctx, opacity, waveTime) {
    if (this.size < 3) return
    
    const wave = Math.sin(waveTime + this.waveOffset) * 0.08 * this.depth.speed
    const layerOpacity = opacity * this.depth.opacity * 0.6
    
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle + wave)
    ctx.globalAlpha = layerOpacity
    ctx.fillStyle = this.color
    
    // Central stem (curved)
    ctx.strokeStyle = this.color
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(this.size * 0.5, -this.size * 0.1, this.size, 0)
    ctx.stroke()
    
    // Leaflets along the stem
    for (let i = 0; i < this.leaflets; i++) {
      const t = (i + 1) / (this.leaflets + 1)
      const leafX = this.size * t
      const leafY = -this.size * 0.1 * Math.sin(t * Math.PI) // Curve offset
      const leafSize = this.size * 0.15 * (1 - t * 0.5) // Smaller toward tip
      
      // Upper leaflet
      ctx.beginPath()
      ctx.moveTo(leafX, leafY)
      ctx.quadraticCurveTo(leafX + leafSize * 0.5, leafY - leafSize * 0.8, leafX + leafSize, leafY - leafSize * 0.3)
      ctx.quadraticCurveTo(leafX + leafSize * 0.5, leafY - leafSize * 0.2, leafX, leafY)
      ctx.fill()
      
      // Lower leaflet
      ctx.beginPath()
      ctx.moveTo(leafX, leafY)
      ctx.quadraticCurveTo(leafX + leafSize * 0.5, leafY + leafSize * 0.8, leafX + leafSize, leafY + leafSize * 0.3)
      ctx.quadraticCurveTo(leafX + leafSize * 0.5, leafY + leafSize * 0.2, leafX, leafY)
      ctx.fill()
    }
    
    ctx.restore()
    ctx.globalAlpha = 1
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CIRCUIT CLASSES — Digital Growth
// ═══════════════════════════════════════════════════════════════════════════

class Wire {
  constructor(canvas, startX, startY, angle, config) {
    this.canvas = canvas
    this.startX = startX
    this.startY = startY
    this.angle = angle + (Math.random() - 0.5) * 0.3
    this.segments = []
    this.growthProgress = 0
    this.maxSegments = 5 + Math.floor(Math.random() * 8)
    this.color = config.colors.wire[Math.floor(Math.random() * config.colors.wire.length)]
    this.thickness = 1 + Math.random() * 2
  }
  
  grow(dt) {
    if (this.growthProgress < 1) {
      this.growthProgress += dt * CONFIG.circuit.pulseSpeed * 0.3
    }
    
    // Generate segments (straight lines with 90° turns)
    if (this.segments.length === 0) {
      let x = this.startX
      let y = this.startY
      let angle = this.angle
      
      this.segments.push({ x, y })
      
      for (let i = 0; i < this.maxSegments; i++) {
        const length = 30 + Math.random() * 60
        x += Math.cos(angle) * length
        y += Math.sin(angle) * length
        this.segments.push({ x, y })
        
        // 90° turn
        angle += (Math.random() > 0.5 ? 1 : -1) * Math.PI / 2
      }
    }
  }
  
  draw(ctx, opacity) {
    if (this.segments.length < 2) return
    
    const visibleSegments = Math.floor(this.segments.length * this.growthProgress)
    if (visibleSegments < 2) return
    
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.thickness
    ctx.lineCap = 'square'
    ctx.globalAlpha = opacity * 0.5
    
    ctx.beginPath()
    ctx.moveTo(this.segments[0].x, this.segments[0].y)
    
    for (let i = 1; i < visibleSegments; i++) {
      ctx.lineTo(this.segments[i].x, this.segments[i].y)
    }
    
    ctx.stroke()
    ctx.globalAlpha = 1
  }
}

class Node {
  constructor(x, y, config) {
    this.x = x
    this.y = y
    this.baseX = x
    this.baseY = y
    this.size = 0
    this.maxSize = 3 + Math.random() * 6
    this.pulsePhase = Math.random() * Math.PI * 2
    this.growthProgress = 0
    this.color = config.colors.node[Math.floor(Math.random() * config.colors.node.length)]
    this.delay = Math.random() * 1000
    this.born = Date.now()
    this.connections = []
    this.mouseInfluence = 0
  }
  
  update(dt, time, mouse, canvasWidth, canvasHeight) {
    if (Date.now() - this.born < this.delay) return
    
    if (this.growthProgress < 1) {
      this.growthProgress += dt * 0.001
    }
    
    // MOUSE ATTRACTION — nodes are drawn toward cursor
    if (mouse && canvasWidth && canvasHeight) {
      const mouseX = mouse.x * canvasWidth
      const mouseY = mouse.y * canvasHeight
      const dx = mouseX - this.baseX
      const dy = mouseY - this.baseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const influence = Math.max(0, 1 - dist / 200) // 200px influence radius
      this.mouseInfluence = influence
      
      // Nodes drift toward mouse
      this.x = this.baseX + dx * influence * 0.1
      this.y = this.baseY + dy * influence * 0.1
    } else {
      this.x = this.baseX
      this.y = this.baseY
      this.mouseInfluence = 0
    }
    
    // Pulse faster when mouse is near
    const pulseSpeed = 0.003 + this.mouseInfluence * 0.01
    const pulse = 0.8 + Math.sin(time * pulseSpeed + this.pulsePhase) * (0.2 + this.mouseInfluence * 0.3)
    this.size = this.maxSize * Math.min(1, this.growthProgress) * pulse
  }
  
  draw(ctx, opacity) {
    if (this.size < 1) return
    
    // Brighter when mouse is near
    const brightness = opacity * (0.8 + this.mouseInfluence * 0.4)
    ctx.globalAlpha = Math.min(1, brightness)
    
    // Larger glow when mouse is near
    const glowRadius = this.size * (2 + this.mouseInfluence * 2)
    
    // Glow
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius)
    gradient.addColorStop(0, this.color)
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2)
    ctx.fill()
    
    // Core
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.globalAlpha = 1
  }
}

class DataPulse {
  constructor(wire, config) {
    this.wire = wire
    this.progress = 0
    this.speed = 0.001 + Math.random() * 0.002
    this.size = 2 + Math.random() * 3
    this.color = config.colors.pulse[Math.floor(Math.random() * config.colors.pulse.length)]
    this.active = true
  }
  
  update(dt) {
    this.progress += this.speed * dt
    if (this.progress > 1) {
      this.progress = 0
      // Random chance to deactivate
      if (Math.random() > 0.7) this.active = false
    }
  }
  
  draw(ctx, opacity) {
    if (!this.active || this.wire.segments.length < 2) return
    
    const visibleSegments = Math.floor(this.wire.segments.length * this.wire.growthProgress)
    if (visibleSegments < 2) return
    
    // Find position along wire
    const totalLength = visibleSegments - 1
    const segmentIndex = Math.floor(this.progress * totalLength)
    const segmentProgress = (this.progress * totalLength) % 1
    
    if (segmentIndex >= visibleSegments - 1) return
    
    const seg1 = this.wire.segments[segmentIndex]
    const seg2 = this.wire.segments[segmentIndex + 1]
    
    const x = seg1.x + (seg2.x - seg1.x) * segmentProgress
    const y = seg1.y + (seg2.y - seg1.y) * segmentProgress
    
    // Draw pulse
    ctx.globalAlpha = opacity * 0.9
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.size * 3)
    gradient.addColorStop(0, this.color)
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, this.size * 3, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(x, y, this.size * 0.5, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.globalAlpha = 1
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PortraitEcosystem() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const entitiesRef = useRef({
    vines: [],
    flowers: [],
    leaves: [],
    tropicalLeaves: [], // Keeping for compatibility
    ferns: [], // Keeping for compatibility
    circles: [], // Geometric orbs/suns
    dots: [], // Scattered dots
    splatters: [], // Paint splatter effects
    branches: [], // Stylized branches with leaves
    wires: [],
    nodes: [],
    pulses: [],
    initialized: false,
    lastTime: 0,
    waveTime: 0,
  })
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  
  const identity = useSmoothedIdentity()
  
  // Initialize entities
  const initializeEntities = useCallback((canvas) => {
    const entities = entitiesRef.current
    
    // FLORA — LEFT TERRITORY ONLY (organic, growing upward/outward)
    CONFIG.floraOrigins.forEach(origin => {
      const originX = canvas.width * origin.x
      const originY = canvas.height * origin.y
      
      const vinesPerOrigin = Math.ceil(CONFIG.flora.maxVines / CONFIG.floraOrigins.length)
      for (let i = 0; i < vinesPerOrigin; i++) {
        // Organic growth: mostly upward and outward (away from center)
        const baseAngle = -Math.PI / 2 // Up
        const spread = Math.PI * 0.6 // 108 degree spread
        const angle = baseAngle + (Math.random() - 0.5) * spread - (origin.x * 0.5) // Bias away from center
        const offsetX = (Math.random() - 0.5) * 80
        const offsetY = (Math.random() - 0.5) * 80
        entities.vines.push(new Vine(canvas, originX + offsetX, originY + offsetY, angle, CONFIG.flora))
      }
      
      // TROPICAL LEAVES — Large monstera/palm leaves scattered around origin
      const tropicalPerOrigin = Math.ceil(CONFIG.flora.maxTropicalLeaves / CONFIG.floraOrigins.length)
      for (let i = 0; i < tropicalPerOrigin; i++) {
        const angle = Math.random() * Math.PI * 2
        const offsetX = (Math.random() - 0.5) * 200
        const offsetY = (Math.random() - 0.5) * 200
        // Assign to different depth layers for jungle parallax
        const depthLayer = CONFIG.flora.depthLayers[Math.floor(Math.random() * CONFIG.flora.depthLayers.length)]
        entities.tropicalLeaves.push(new TropicalLeaf(originX + offsetX, originY + offsetY, angle, CONFIG.flora, depthLayer))
      }
      
      // FERNS — Delicate fronds in the understory
      const fernsPerOrigin = Math.ceil(CONFIG.flora.maxFerns / CONFIG.floraOrigins.length)
      for (let i = 0; i < fernsPerOrigin; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.5 // Mostly upward
        const offsetX = (Math.random() - 0.5) * 150
        const offsetY = (Math.random() - 0.5) * 150
        const depthLayer = CONFIG.flora.depthLayers[Math.floor(Math.random() * CONFIG.flora.depthLayers.length)]
        entities.ferns.push(new Fern(originX + offsetX, originY + offsetY, angle, CONFIG.flora, depthLayer))
      }
      
      // SCATTERED LEAVES — Multiple depth layers for jungle density
      const leavesPerOrigin = Math.ceil(CONFIG.flora.maxLeaves / CONFIG.floraOrigins.length / 2)
      for (let i = 0; i < leavesPerOrigin; i++) {
        const angle = Math.random() * Math.PI * 2
        const offsetX = (Math.random() - 0.5) * 250
        const offsetY = (Math.random() - 0.5) * 250
        const depthLayer = CONFIG.flora.depthLayers[Math.floor(Math.random() * CONFIG.flora.depthLayers.length)]
        entities.leaves.push(new Leaf(originX + offsetX, originY + offsetY, angle, CONFIG.flora, depthLayer))
      }
    })
    
    // CIRCUITS — RIGHT TERRITORY ONLY (structured, orthogonal)
    CONFIG.circuitOrigins.forEach(origin => {
      const originX = canvas.width * origin.x
      const originY = canvas.height * origin.y
      
      const wiresPerOrigin = Math.ceil(CONFIG.circuit.maxWires / CONFIG.circuitOrigins.length)
      for (let i = 0; i < wiresPerOrigin; i++) {
        // Orthogonal growth: 0°, 90°, 180°, 270° with slight randomness
        const baseAngle = Math.floor(Math.random() * 4) * (Math.PI / 2)
        const angle = baseAngle + (Math.random() - 0.5) * 0.2
        const offsetX = (Math.random() - 0.5) * 80
        const offsetY = (Math.random() - 0.5) * 80
        entities.wires.push(new Wire(canvas, originX + offsetX, originY + offsetY, angle, CONFIG.circuit))
      }
    })
    
    entities.initialized = true
    entities.lastTime = performance.now()
  }, [])
  
  // Add flowers and leaves to vine tips
  const spawnFloraDetails = useCallback(() => {
    const entities = entitiesRef.current
    
    entities.vines.forEach(vine => {
      if (vine.segments.length > 3 && entities.flowers.length < CONFIG.flora.maxFlowers) {
        // Add flower at tip sometimes
        if (Math.random() > 0.6) {
          const tip = vine.segments[vine.segments.length - 1]
          if (tip) {
            entities.flowers.push(new Flower(tip.x, tip.y, CONFIG.flora))
          }
        }
      }
      
      // Add leaves along vine
      if (vine.segments.length > 2 && entities.leaves.length < CONFIG.flora.maxLeaves) {
        vine.segments.forEach((seg, i) => {
          if (i > 0 && i % 3 === 0 && Math.random() > 0.5) {
            const prev = vine.segments[i - 1]
            const angle = Math.atan2(seg.y - prev.y, seg.x - prev.x) + (Math.random() > 0.5 ? 1 : -1) * Math.PI / 3
            entities.leaves.push(new Leaf(seg.x, seg.y, angle, CONFIG.flora))
          }
        })
      }
    })
  }, [])
  
  // Add nodes to wire corners
  const spawnCircuitDetails = useCallback(() => {
    const entities = entitiesRef.current
    
    entities.wires.forEach(wire => {
      if (wire.segments.length > 2 && entities.nodes.length < CONFIG.circuit.maxNodes) {
        wire.segments.forEach((seg, i) => {
          if (i > 0 && Math.random() > 0.6) {
            entities.nodes.push(new Node(seg.x, seg.y, CONFIG.circuit))
          }
        })
      }
      
      // Add data pulses
      if (wire.growthProgress > 0.5 && entities.pulses.length < CONFIG.circuit.maxPulses) {
        if (Math.random() > 0.95) {
          entities.pulses.push(new DataPulse(wire, CONFIG.circuit))
        }
      }
    })
  }, [])
  
  // Animation loop
  const animate = useCallback((time) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const entities = entitiesRef.current
    
    if (!entities.initialized) {
      initializeEntities(canvas)
      console.log('[PortraitEcosystem] Entities initialized:', {
        vines: entities.vines.length,
        wires: entities.wires.length
      })
    }
    
    const dt = time - entities.lastTime
    entities.lastTime = time
    entities.waveTime += dt * CONFIG.flora.waveSpeed
    
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Calculate opacities based on identity with SMOOTH CROSSFADE
    // identity 0 = full flora (design side), identity 1 = full circuit (tech side)
    const currentIdentity = identity.get()
    
    // Smooth S-curve crossfade — both visible in center, exclusive at extremes
    // Uses smoothstep for natural easing
    const smoothstep = (t) => t * t * (3 - 2 * t)
    
    // Flora: 0.5 at identity 0, fades through center, 0.02 at identity 1
    const floraFade = smoothstep(Math.min(1, currentIdentity * 1.5))
    const floraBaseOpacity = Math.max(0.02, (1 - floraFade) * 0.45)
    
    // Circuit: 0.02 at identity 0, fades through center, 0.5 at identity 1  
    const circuitFade = smoothstep(Math.max(0, (currentIdentity - 0.33) * 1.5))
    const circuitBaseOpacity = Math.max(0.02, circuitFade * 0.45)
    
    // BREATHING ANIMATION — subtle ambient life
    const breathPhase = time * CONFIG.breathing.speed
    const breathScale = 1 + Math.sin(breathPhase) * CONFIG.breathing.scaleAmount
    const breathOpacity = 1 + Math.sin(breathPhase * 1.3) * CONFIG.breathing.opacityAmount
    
    // Get current mouse position and dynamic hover radius
    const mouse = mouseRef.current
    const mouseX = mouse.x * canvas.width
    const mouseY = mouse.y * canvas.height
    const hoverRadius = CONFIG.getHoverRadius()
    
    // Helper: calculate opacity boost based on mouse proximity + breathing
    const getMouseBoost = (x, y) => {
      const dx = x - mouseX
      const dy = y - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const proximity = Math.max(0, 1 - dist / hoverRadius)
      // Apply breathing to boost
      return proximity * CONFIG.hoverIntensity * breathScale * breathOpacity
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // FLORA RENDERING — Back to front for proper depth layering
    // Frida Kahlo jungle: dense, layered, lush
    // ═══════════════════════════════════════════════════════════════════════
    
    // BACK LAYER: Tropical leaves (large, in background)
    // Sort by depth for proper layering
    const sortedTropical = [...entities.tropicalLeaves].sort((a, b) => a.depth.scale - b.depth.scale)
    sortedTropical.forEach(leaf => {
      leaf.update(dt, entities.waveTime)
      const boost = getMouseBoost(leaf.x, leaf.y)
      leaf.draw(ctx, (floraBaseOpacity + boost) * breathOpacity, entities.waveTime)
    })
    
    // MID-BACK LAYER: Ferns (delicate, understory)
    const sortedFerns = [...entities.ferns].sort((a, b) => a.depth.scale - b.depth.scale)
    sortedFerns.forEach(fern => {
      fern.update(dt, entities.waveTime)
      const boost = getMouseBoost(fern.x, fern.y)
      fern.draw(ctx, (floraBaseOpacity + boost) * breathOpacity, entities.waveTime)
    })
    
    // MID LAYER: Vines (structure)
    entities.vines.forEach(vine => {
      vine.grow(dt, entities.waveTime, mouse)
      const centerSeg = vine.segments[Math.floor(vine.segments.length / 2)]
      const boost = centerSeg ? getMouseBoost(centerSeg.x, centerSeg.y) : 0
      vine.draw(ctx, (floraBaseOpacity + boost) * breathOpacity)
    })
    
    // Spawn flora details periodically
    if (Math.random() > 0.99) {
      spawnFloraDetails()
    }
    
    // MID-FRONT LAYER: Small scattered leaves
    const sortedLeaves = [...entities.leaves].sort((a, b) => a.depth.scale - b.depth.scale)
    sortedLeaves.forEach(leaf => {
      leaf.update(dt, entities.waveTime)
      const boost = getMouseBoost(leaf.x, leaf.y)
      leaf.draw(ctx, (floraBaseOpacity + boost) * breathOpacity, entities.waveTime)
    })
    
    // FRONT LAYER: Flowers (pop of color)
    entities.flowers.forEach(flower => {
      flower.update(dt, mouse, canvas.width, canvas.height)
      const boost = getMouseBoost(flower.x, flower.y)
      // Cap at 70% for ethereal feel
      flower.draw(ctx, Math.min(0.7, (floraBaseOpacity + boost) * breathOpacity), entities.waveTime)
    })
    
    // Update and draw circuits
    entities.wires.forEach(wire => {
      wire.grow(dt)
      // Get center point of wire for hover calculation
      const centerSeg = wire.segments[Math.floor(wire.segments.length / 2)]
      const boost = centerSeg ? getMouseBoost(centerSeg.x, centerSeg.y) : 0
      wire.draw(ctx, (circuitBaseOpacity + boost) * breathOpacity)
    })
    
    // Spawn circuit details periodically
    if (Math.random() > 0.98) {
      spawnCircuitDetails()
    }
    
    // Update and draw nodes (with mouse attraction + hover boost + breathing)
    entities.nodes.forEach(node => {
      node.update(dt, time, mouse, canvas.width, canvas.height)
      const boost = getMouseBoost(node.x, node.y)
      node.draw(ctx, (circuitBaseOpacity + boost) * breathOpacity)
    })
    
    entities.pulses.forEach(pulse => {
      pulse.update(dt)
      // Use wire center for pulse hover calculation
      const centerSeg = pulse.wire.segments[Math.floor(pulse.wire.segments.length / 2)]
      const boost = centerSeg ? getMouseBoost(centerSeg.x, centerSeg.y) : 0
      pulse.draw(ctx, (circuitBaseOpacity + boost) * breathOpacity)
    })
    
    // Clean up inactive pulses
    entities.pulses = entities.pulses.filter(p => p.active)
    
    animationRef.current = requestAnimationFrame(animate)
  }, [identity, initializeEntities, spawnFloraDetails, spawnCircuitDetails])
  
  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    console.log('[PortraitEcosystem] Canvas mounted, starting animation')
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      console.log('[PortraitEcosystem] Canvas resized to', canvas.width, 'x', canvas.height)
      
      // Reset entities on resize
      const entities = entitiesRef.current
      entities.vines = []
      entities.flowers = []
      entities.leaves = []
      entities.wires = []
      entities.nodes = []
      entities.pulses = []
      entities.initialized = false
    }
    
    resize()
    window.addEventListener('resize', resize)
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])
  
  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="portrait-ecosystem"
      aria-hidden="true"
    />
  )
}

export default memo(PortraitEcosystem)
