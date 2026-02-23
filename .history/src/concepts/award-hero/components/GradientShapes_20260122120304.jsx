/**
 * Gradient Shapes Component
 * Minimal floating shapes - muted, calm, supporting elements
 * Shapes float, they don't glow
 */

import { motion, useTransform } from 'framer-motion'

export function GradientShapes({ parallaxX, parallaxY }) {
  // Reduced palette - fewer shapes, muted colors
  const shapes = [
    {
      id: 'soft-pink',
      className: 'shape-soft-pink',
      position: { top: '18%', right: '22%' },
      size: { width: 120, height: 120 },
      // Muted, desaturated pink
      gradient: 'rgba(220, 180, 190, 0.25)',
      rotationSpeed: 0,
      parallaxIntensity: 0.8,
      blur: true,
    },
    {
      id: 'soft-lavender',
      className: 'shape-soft-lavender',
      position: { bottom: '15%', right: '18%' },
      size: { width: 100, height: 100 },
      // Very muted lavender
      gradient: 'rgba(180, 170, 200, 0.2)',
      rotationSpeed: 0,
      parallaxIntensity: 1.0,
      blur: true,
    },
    {
      id: 'soft-peach',
      className: 'shape-soft-peach',
      position: { bottom: '8%', right: '8%' },
      size: { width: 60, height: 60 },
      // Muted warm accent
      gradient: 'rgba(230, 200, 180, 0.3)',
      rotationSpeed: 0,
      parallaxIntensity: 1.2,
      blur: true,
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
    blur,
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        opacity: { duration: 1.2, delay: 0.8 },
      }}
    >
      <div 
        className="shape-inner"
        style={{
          background: gradient,
          filter: blur ? 'blur(50px)' : 'none',
          borderRadius: '50%',
        }}
      />
      {/* No glow effect - shapes float, don't announce */}
    </motion.div>
  )
}
