/**
 * Gradient Shapes Component
 * Bold, vibrant floating shapes - pink, purple, orange accents
 * Matching original design language
 */

import { motion, useTransform } from 'framer-motion'

export function GradientShapes({ parallaxX, parallaxY }) {
  // Bold, vibrant shapes matching original design
  const shapes = [
    {
      id: 'pink-crescent',
      className: 'shape-pink-crescent',
      position: { top: '12%', right: '18%' },
      size: { width: 180, height: 180 },
      // Vibrant coral/pink - top right behind "DESIGN"
      gradient: 'linear-gradient(135deg, #FF6B8A 0%, #FF8FA3 50%, #FFB4C2 100%)',
      parallaxIntensity: 0.8,
      clipPath: 'ellipse(50% 40% at 50% 60%)',
      blur: false,
      rotation: -15,
    },
    {
      id: 'purple-blob',
      className: 'shape-purple-blob',
      position: { bottom: '5%', left: '40%' },
      size: { width: 200, height: 220 },
      // Vibrant purple/magenta - bottom center
      gradient: 'linear-gradient(160deg, #C77DFF 0%, #9D4EDD 50%, #7B2CBF 100%)',
      parallaxIntensity: 1.0,
      clipPath: 'polygon(20% 0%, 100% 10%, 90% 90%, 10% 100%, 0% 40%)',
      blur: false,
      rotation: 10,
    },
    {
      id: 'orange-accent',
      className: 'shape-orange-accent',
      position: { bottom: '2%', left: '55%' },
      size: { width: 80, height: 100 },
      // Orange/yellow accent - small bottom
      gradient: 'linear-gradient(135deg, #FFB347 0%, #FFCC70 100%)',
      parallaxIntensity: 1.2,
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      blur: false,
      rotation: 25,
    },
  ]

  return (
    <div className="gradient-shapes-container">
      {shapes.map((shape) => (
        <GradientShape 
          key={shape.id}
          shape={shape}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
        />
      ))}
      
      {/* Dotted pattern - bottom area */}
      <DottedPattern />
    </div>
  )
}

function GradientShape({ shape, parallaxX, parallaxY }) {
  const {
    className,
    position,
    size,
    gradient,
    parallaxIntensity,
    clipPath,
    blur,
    rotation = 0,
  } = shape

  // Transform parallax values
  const x = useTransform(parallaxX, (v) => v * parallaxIntensity)
  const y = useTransform(parallaxY, (v) => v * parallaxIntensity)

  return (
    <motion.div
      className={`gradient-shape ${className}`}
      style={{
        ...position,
        width: size.width,
        height: size.height,
        x,
        y,
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{
        opacity: { duration: 0.8, delay: 0.5 },
        scale: { duration: 0.8, delay: 0.5 },
        rotate: { duration: 0.8, delay: 0.5 },
      }}
    >
      <div 
        className="shape-inner"
        style={{
          background: gradient,
          clipPath: clipPath || 'none',
          filter: blur ? 'blur(40px)' : 'none',
          borderRadius: !clipPath ? '50%' : '0',
        }}
      />
    </motion.div>
  )
}

// Dotted pattern decoration
function DottedPattern() {
  return (
    <motion.div
      className="dotted-pattern-decoration"
      style={{
        position: 'absolute',
        bottom: '8%',
        left: '48%',
        width: '60px',
        height: '60px',
        backgroundImage: 'radial-gradient(circle, rgba(100, 100, 100, 0.4) 1.5px, transparent 1.5px)',
        backgroundSize: '8px 8px',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    />
  )
}
