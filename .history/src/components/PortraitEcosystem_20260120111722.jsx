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
  // Origin point (relative to canvas, where portrait head is)
  origin: { x: 0.5, y: 0.35 },
  
  // Flora settings
  flora: {
    maxVines: 12,
    maxFlowers: 20,
    maxLeaves: 40,
    growthSpeed: 0.0008,
    waveSpeed: 0.001,
    waveAmount: 15,
    colors: {
      vine: ['#2d4a3e', '#3d5a4e', '#4d6a5e'],
      flower: ['#c4703a', '#d4805a', '#e4906a', '#d4a07a'],
      leaf: ['#3d5a4e', '#4d6a5e', '#5d7a6e', '#6d8a7e'],
    }
  },
  
  // Circuit settings
  circuit: {
    maxWires: 15,
    maxNodes: 25,
    maxPulses: 30,
    pulseSpeed: 0.002,
    connectionRadius: 150,
    colors: {
      wire: ['#1a3a5a', '#2a4a6a', '#3a5a7a'],
      node: ['#3a7cc4', '#4a8cd4', '#5a9ce4'],
      pulse: ['#6aace4', '#7abcf4', '#8accff'],
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
  
  grow(dt, waveTime) {
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
      // Wind wave
      const wave = Math.sin(waveTime + progress * 3 + this.waveOffset) * CONFIG.flora.waveAmount * progress
      
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
    this.size = 0
    this.maxSize = 8 + Math.random() * 15
    this.petalCount = 5 + Math.floor(Math.random() * 4)
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.001
    this.bloomProgress = 0
    this.color = config.colors.flower[Math.floor(Math.random() * config.colors.flower.length)]
    this.delay = Math.random() * 2000
    this.born = Date.now()
  }
  
  update(dt) {
    if (Date.now() - this.born < this.delay) return
    
    if (this.bloomProgress < 1) {
      this.bloomProgress += dt * 0.0005
    }
    this.size = this.maxSize * this.easeOutBack(Math.min(1, this.bloomProgress))
    this.rotation += this.rotationSpeed * dt
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
    this.angle = angle
    this.size = 0
    this.maxSize = 10 + Math.random() * 20
    this.growthProgress = 0
    this.color = config.colors.leaf[Math.floor(Math.random() * config.colors.leaf.length)]
    this.waveOffset = Math.random() * Math.PI * 2
    this.delay = Math.random() * 1500
    this.born = Date.now()
  }
  
  update(dt) {
    if (Date.now() - this.born < this.delay) return
    
    if (this.growthProgress < 1) {
      this.growthProgress += dt * 0.0006
    }
    this.size = this.maxSize * Math.min(1, this.growthProgress)
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
    this.size = 0
    this.maxSize = 3 + Math.random() * 6
    this.pulsePhase = Math.random() * Math.PI * 2
    this.growthProgress = 0
    this.color = config.colors.node[Math.floor(Math.random() * config.colors.node.length)]
    this.delay = Math.random() * 1000
    this.born = Date.now()
    this.connections = []
  }
  
  update(dt, time) {
    if (Date.now() - this.born < this.delay) return
    
    if (this.growthProgress < 1) {
      this.growthProgress += dt * 0.001
    }
    
    const pulse = 0.8 + Math.sin(time * 0.003 + this.pulsePhase) * 0.2
    this.size = this.maxSize * Math.min(1, this.growthProgress) * pulse
  }
  
  draw(ctx, opacity) {
    if (this.size < 1) return
    
    ctx.globalAlpha = opacity * 0.8
    
    // Glow
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2)
    gradient.addColorStop(0, this.color)
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2)
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
    
    const originX = canvas.width * CONFIG.origin.x
    const originY = canvas.height * CONFIG.origin.y
    
    // Create flora (left side)
    for (let i = 0; i < CONFIG.flora.maxVines; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8 // Upward-ish
      const offsetX = (Math.random() - 0.7) * 100 // Bias left
      const offsetY = (Math.random() - 0.5) * 50
      entities.vines.push(new Vine(canvas, originX + offsetX, originY + offsetY, angle, CONFIG.flora))
    }
    
    // Create circuit (right side)
    for (let i = 0; i < CONFIG.circuit.maxWires; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8
      const offsetX = (Math.random() - 0.3) * 100 + 50 // Bias right
      const offsetY = (Math.random() - 0.5) * 50
      entities.wires.push(new Wire(canvas, originX + offsetX, originY + offsetY, angle, CONFIG.circuit))
    }
    
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
    }
    
    const dt = time - entities.lastTime
    entities.lastTime = time
    entities.waveTime += dt * CONFIG.flora.waveSpeed
    
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Calculate opacities based on identity
    // identity 0 = full flora, identity 1 = full circuit
    const currentIdentity = identity.get()
    const floraOpacity = 1 - currentIdentity
    const circuitOpacity = currentIdentity
    
    // Update and draw flora
    entities.vines.forEach(vine => {
      vine.grow(dt, entities.waveTime)
      vine.draw(ctx, floraOpacity)
    })
    
    // Spawn flora details periodically
    if (Math.random() > 0.99) {
      spawnFloraDetails()
    }
    
    entities.flowers.forEach(flower => {
      flower.update(dt)
      flower.draw(ctx, floraOpacity, entities.waveTime)
    })
    
    entities.leaves.forEach(leaf => {
      leaf.update(dt)
      leaf.draw(ctx, floraOpacity, entities.waveTime)
    })
    
    // Update and draw circuits
    entities.wires.forEach(wire => {
      wire.grow(dt)
      wire.draw(ctx, circuitOpacity)
    })
    
    // Spawn circuit details periodically
    if (Math.random() > 0.98) {
      spawnCircuitDetails()
    }
    
    entities.nodes.forEach(node => {
      node.update(dt, time)
      node.draw(ctx, circuitOpacity)
    })
    
    entities.pulses.forEach(pulse => {
      pulse.update(dt)
      pulse.draw(ctx, circuitOpacity)
    })
    
    // Clean up inactive pulses
    entities.pulses = entities.pulses.filter(p => p.active)
    
    animationRef.current = requestAnimationFrame(animate)
  }, [identity, initializeEntities, spawnFloraDetails, spawnCircuitDetails])
  
  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
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
