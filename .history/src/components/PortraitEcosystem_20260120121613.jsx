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
  // Multiple origin points spread across the canvas
  origins: [
    { x: 0.15, y: 0.2 },
    { x: 0.85, y: 0.25 },
    { x: 0.1, y: 0.6 },
    { x: 0.9, y: 0.65 },
    { x: 0.5, y: 0.35 }, // Portrait area
    { x: 0.3, y: 0.8 },
    { x: 0.7, y: 0.85 },
    { x: 0.2, y: 0.45 },
    { x: 0.8, y: 0.5 },
  ],
  
  // Base opacity (subtle) and hover intensity multiplier
  baseOpacity: 0.15,
  hoverIntensity: 0.85,
  hoverRadius: 200, // pixels
  
  // Flora settings
  flora: {
    maxVines: 20,
    maxFlowers: 30,
    maxLeaves: 50,
    growthSpeed: 0.0008,
    waveSpeed: 0.001,
    waveAmount: 15,
    colors: {
      vine: ['#4a7a5e', '#5a8a6e', '#6a9a7e'],
      flower: ['#e4905a', '#f4a06a', '#ffc07a', '#ffb090'],
      leaf: ['#5a8a6e', '#6a9a7e', '#7aaa8e', '#8aba9e'],
    }
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
    this.baseGrowth = 0.1 + Math.random() * 0.15 // Start small
    this.targetGrowth = this.baseGrowth
    this.color = config.colors.vine[Math.floor(Math.random() * config.colors.vine.length)]
    this.waveOffset = Math.random() * Math.PI * 2
    this.curveStrength = 0.3 + Math.random() * 0.4
  }
  
  grow(dt, waveTime, mouse) {
    // MOUSE PROXIMITY GROWTH — vines grow when mouse is near
    if (mouse) {
      const mouseX = mouse.x * this.canvas.width
      const mouseY = mouse.y * this.canvas.height
      const dx = this.startX - mouseX
      const dy = this.startY - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const proximity = Math.max(0, 1 - dist / CONFIG.hoverRadius)
      
      // Target growth increases with mouse proximity
      this.targetGrowth = this.baseGrowth + proximity * (1 - this.baseGrowth)
    }
    
    // Smooth growth toward target
    const growthSpeed = 0.003
    if (this.growthProgress < this.targetGrowth) {
      this.growthProgress += dt * growthSpeed
    } else if (this.growthProgress > this.targetGrowth + 0.1) {
      // Slowly retract when mouse leaves (but not fully)
      this.growthProgress -= dt * growthSpeed * 0.3
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
    this.maxSize = 8 + Math.random() * 15
    this.petalCount = 5 + Math.floor(Math.random() * 4)
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.001
    this.bloomProgress = 0
    this.baseBloom = 0.1 + Math.random() * 0.2 // Start as small buds
    this.targetBloom = this.baseBloom
    this.color = config.colors.flower[Math.floor(Math.random() * config.colors.flower.length)]
    this.delay = Math.random() * 500 // Shorter delay
    this.born = Date.now()
  }
  
  update(dt, mouse, canvasWidth, canvasHeight) {
    if (Date.now() - this.born < this.delay) return
    
    // MOUSE PROXIMITY BLOOM — flowers bloom when mouse approaches
    if (mouse && canvasWidth && canvasHeight) {
      const mouseX = mouse.x * canvasWidth
      const mouseY = mouse.y * canvasHeight
      const dx = mouseX - this.baseX
      const dy = mouseY - this.baseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const proximity = Math.max(0, 1 - dist / CONFIG.hoverRadius)
      
      // Target bloom increases with mouse proximity
      this.targetBloom = this.baseBloom + proximity * (1 - this.baseBloom)
      
      // Flowers sway toward mouse
      this.x = this.baseX + dx * proximity * 0.12
      this.y = this.baseY + dy * proximity * 0.12
    }
    
    // Smooth bloom toward target
    const bloomSpeed = 0.004
    if (this.bloomProgress < this.targetBloom) {
      this.bloomProgress += dt * bloomSpeed
    } else if (this.bloomProgress > this.targetBloom + 0.1) {
      // Slowly close when mouse leaves
      this.bloomProgress -= dt * bloomSpeed * 0.2
    }
    
    this.size = this.maxSize * this.easeOutBack(Math.min(1, this.bloomProgress))
    this.rotation += this.rotationSpeed * dt * (1 + this.bloomProgress) // Spin faster when blooming
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
    ctx.globalAlpha = opacity * 0.8
    
    // Draw petals
    ctx.fillStyle = this.color
    for (let i = 0; i < this.petalCount; i++) {
      const angle = (i / this.petalCount) * Math.PI * 2
      ctx.save()
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.ellipse(this.size * 0.5, 0, this.size * 0.6, this.size * 0.3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    
    // Draw center
    ctx.fillStyle = '#f4e4d4'
    ctx.beginPath()
    ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
    ctx.globalAlpha = 1
  }
}

class Leaf {
  constructor(x, y, angle, config) {
    this.x = x
    this.y = y
    this.baseX = x
    this.baseY = y
    this.angle = angle
    this.size = 0
    this.maxSize = 10 + Math.random() * 20
    // Start small, grow with mouse
    this.baseGrowth = 0.1 + Math.random() * 0.15
    this.targetGrowth = this.baseGrowth
    this.growthProgress = this.baseGrowth
    this.color = config.colors.leaf[Math.floor(Math.random() * config.colors.leaf.length)]
    this.waveOffset = Math.random() * Math.PI * 2
    this.delay = Math.random() * 800
    this.born = Date.now()
  }
  
  update(dt, mouseX, mouseY) {
    if (Date.now() - this.born < this.delay) return
    
    // Calculate mouse proximity
    const dx = mouseX - this.x
    const dy = mouseY - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const proximityFactor = Math.max(0, 1 - dist / CONFIG.hoverRadius)
    
    // Mouse proximity triggers growth
    if (proximityFactor > 0) {
      this.targetGrowth = this.baseGrowth + (1 - this.baseGrowth) * proximityFactor * 1.2
    } else {
      this.targetGrowth = this.baseGrowth
    }
    
    // Smooth growth toward target
    const growthSpeed = proximityFactor > 0 ? 2.5 : 0.3
    this.growthProgress += (this.targetGrowth - this.growthProgress) * dt * growthSpeed
    this.growthProgress = Math.max(this.baseGrowth, Math.min(1, this.growthProgress))
    
    this.size = this.maxSize * this.growthProgress
  }
  
  draw(ctx, opacity, waveTime) {
    if (this.size < 2) return
    
    const wave = Math.sin(waveTime + this.waveOffset) * 0.2
    
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle + wave)
    ctx.globalAlpha = opacity * 0.6
    ctx.fillStyle = this.color
    
    // Leaf shape
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(this.size * 0.5, -this.size * 0.3, this.size, 0)
    ctx.quadraticCurveTo(this.size * 0.5, this.size * 0.3, 0, 0)
    ctx.fill()
    
    // Leaf vein
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(this.size * 0.8, 0)
    ctx.stroke()
    
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
  
  grow(dt, mouseX, mouseY) {
    // Generate segments first (straight lines with 90° turns)
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
      
      // Start with minimal growth
      this.baseGrowth = 0.1 + Math.random() * 0.15
      this.targetGrowth = this.baseGrowth
      this.growthProgress = this.baseGrowth
    }
    
    // Calculate mouse proximity to extend wire
    const dx = mouseX - this.startX
    const dy = mouseY - this.startY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const proximityFactor = Math.max(0, 1 - dist / CONFIG.hoverRadius)
    
    // Mouse proximity triggers full extension
    if (proximityFactor > 0) {
      this.targetGrowth = this.baseGrowth + (1 - this.baseGrowth) * proximityFactor * 1.2
    } else {
      // Slowly retract when mouse is away
      this.targetGrowth = this.baseGrowth
    }
    
    // Smooth growth toward target
    const growthSpeed = proximityFactor > 0 ? 2.5 : 0.3
    this.growthProgress += (this.targetGrowth - this.growthProgress) * dt * growthSpeed
    this.growthProgress = Math.max(this.baseGrowth, Math.min(1, this.growthProgress))
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
    // Start small, grow with mouse
    this.baseGrowth = 0.1 + Math.random() * 0.15
    this.targetGrowth = this.baseGrowth
    this.growthProgress = this.baseGrowth
    this.color = config.colors.node[Math.floor(Math.random() * config.colors.node.length)]
    this.delay = Math.random() * 500 // Shorter delay
    this.born = Date.now()
    this.connections = []
    this.mouseInfluence = 0
  }
  
  update(dt, time, mouse, canvasWidth, canvasHeight) {
    if (Date.now() - this.born < this.delay) return
    
    // MOUSE ATTRACTION — nodes are drawn toward cursor and GROW
    if (mouse && canvasWidth && canvasHeight) {
      const mouseX = mouse.x * canvasWidth
      const mouseY = mouse.y * canvasHeight
      const dx = mouseX - this.baseX
      const dy = mouseY - this.baseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const influence = Math.max(0, 1 - dist / CONFIG.hoverRadius)
      this.mouseInfluence = influence
      
      // Nodes drift toward mouse
      this.x = this.baseX + dx * influence * 0.1
      this.y = this.baseY + dy * influence * 0.1
      
      // Mouse proximity triggers growth
      if (influence > 0) {
        this.targetGrowth = this.baseGrowth + (1 - this.baseGrowth) * influence * 1.3
      } else {
        this.targetGrowth = this.baseGrowth
      }
    } else {
      this.x = this.baseX
      this.y = this.baseY
      this.mouseInfluence = 0
      this.targetGrowth = this.baseGrowth
    }
    
    // Smooth growth toward target
    const growthSpeed = this.mouseInfluence > 0 ? 3 : 0.4
    this.growthProgress += (this.targetGrowth - this.growthProgress) * dt * growthSpeed
    this.growthProgress = Math.max(this.baseGrowth, Math.min(1, this.growthProgress))
    
    // Pulse faster when mouse is near
    const pulseSpeed = 0.003 + this.mouseInfluence * 0.01
    const pulse = 0.8 + Math.sin(time * pulseSpeed + this.pulsePhase) * (0.2 + this.mouseInfluence * 0.3)
    this.size = this.maxSize * this.growthProgress * pulse
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
    
    // Create flora from multiple origin points (left-biased origins)
    const floraOrigins = CONFIG.origins.filter(o => o.x < 0.6)
    floraOrigins.forEach(origin => {
      const originX = canvas.width * origin.x
      const originY = canvas.height * origin.y
      
      const vinesPerOrigin = Math.ceil(CONFIG.flora.maxVines / floraOrigins.length)
      for (let i = 0; i < vinesPerOrigin; i++) {
        const angle = Math.random() * Math.PI * 2 // Any direction
        const offsetX = (Math.random() - 0.5) * 150
        const offsetY = (Math.random() - 0.5) * 150
        entities.vines.push(new Vine(canvas, originX + offsetX, originY + offsetY, angle, CONFIG.flora))
      }
    })
    
    // Create circuits from multiple origin points (right-biased origins)
    const circuitOrigins = CONFIG.origins.filter(o => o.x > 0.4)
    circuitOrigins.forEach(origin => {
      const originX = canvas.width * origin.x
      const originY = canvas.height * origin.y
      
      const wiresPerOrigin = Math.ceil(CONFIG.circuit.maxWires / circuitOrigins.length)
      for (let i = 0; i < wiresPerOrigin; i++) {
        const angle = Math.random() * Math.PI * 2
        const offsetX = (Math.random() - 0.5) * 150
        const offsetY = (Math.random() - 0.5) * 150
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
    
    // Calculate opacities based on identity
    // identity 0 = full flora, identity 1 = full circuit
    const currentIdentity = identity.get()
    // Base opacity is subtle, will be intensified by mouse proximity per-element
    const floraBaseOpacity = Math.max(CONFIG.baseOpacity, (1 - currentIdentity) * 0.4)
    const circuitBaseOpacity = Math.max(CONFIG.baseOpacity, currentIdentity * 0.4)
    
    // Get current mouse position
    const mouse = mouseRef.current
    const mouseX = mouse.x * canvas.width
    const mouseY = mouse.y * canvas.height
    
    // Helper: calculate opacity boost based on mouse proximity
    const getMouseBoost = (x, y) => {
      const dx = x - mouseX
      const dy = y - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const proximity = Math.max(0, 1 - dist / CONFIG.hoverRadius)
      return proximity * CONFIG.hoverIntensity
    }
    
    // Update and draw flora (with mouse wind effect + hover boost)
    entities.vines.forEach(vine => {
      vine.grow(dt, entities.waveTime, mouse)
      // Get center point of vine for hover calculation
      const centerSeg = vine.segments[Math.floor(vine.segments.length / 2)]
      const boost = centerSeg ? getMouseBoost(centerSeg.x, centerSeg.y) : 0
      vine.draw(ctx, floraBaseOpacity + boost)
    })
    
    // Spawn flora details periodically
    if (Math.random() > 0.99) {
      spawnFloraDetails()
    }
    
    // Update and draw flowers (with mouse attraction + hover boost)
    entities.flowers.forEach(flower => {
      flower.update(dt, mouse, canvas.width, canvas.height)
      const boost = getMouseBoost(flower.x, flower.y)
      flower.draw(ctx, floraBaseOpacity + boost, entities.waveTime)
    })
    
    entities.leaves.forEach(leaf => {
      leaf.update(dt)
      const boost = getMouseBoost(leaf.x, leaf.y)
      leaf.draw(ctx, floraBaseOpacity + boost, entities.waveTime)
    })
    
    // Update and draw circuits
    entities.wires.forEach(wire => {
      wire.grow(dt)
      // Get center point of wire for hover calculation
      const centerSeg = wire.segments[Math.floor(wire.segments.length / 2)]
      const boost = centerSeg ? getMouseBoost(centerSeg.x, centerSeg.y) : 0
      wire.draw(ctx, circuitBaseOpacity + boost)
    })
    
    // Spawn circuit details periodically
    if (Math.random() > 0.98) {
      spawnCircuitDetails()
    }
    
    // Update and draw nodes (with mouse attraction + hover boost)
    entities.nodes.forEach(node => {
      node.update(dt, time, mouse, canvas.width, canvas.height)
      const boost = getMouseBoost(node.x, node.y)
      node.draw(ctx, circuitBaseOpacity + boost)
    })
    
    entities.pulses.forEach(pulse => {
      pulse.update(dt)
      // Use wire center for pulse hover calculation
      const centerSeg = pulse.wire.segments[Math.floor(pulse.wire.segments.length / 2)]
      const boost = centerSeg ? getMouseBoost(centerSeg.x, centerSeg.y) : 0
      pulse.draw(ctx, circuitBaseOpacity + boost)
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
