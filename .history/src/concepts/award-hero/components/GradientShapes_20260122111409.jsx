/**
 * Gradient Shapes Component
 * Animated organic shapes with subtle rotation and parallax
 */

import { motion, useTransform } from 'framer-motion'

export function GradientShapes({ parallaxX, parallaxY }) {
  const shapes = [
    {
      id: 'pink-crescent',
      className: 'shape-pink-crescent',
      position: { top: '15%', right: '25%' },
      size: { width: 180, height: 180 },
      gradient: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FB1 50%, #FFB4C8 100%)',
      rotationSpeed: 30,
      parallaxIntensity: 1.2,
      clipPath: 'polygon(100% 0%, 100% 100%, 50% 100%, 0% 50%, 50% 0%)',
      blur: false,
    },
    {
      id: 'purple-blob',
      className: 'shape-purple-blob',
      position: { bottom: '10%', right: '15%' },
      size: { width: 220, height: 250 },
      gradient: 'linear-gradient(180deg, #B56EFF 0%, #8B5CF6 50%, #7C3AED 100%)',
      rotationSpeed: -25,
      parallaxIntensity: 0.8,
      clipPath: 'polygon(30% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%, 0% 30%)',
      blur: false,
      // This one bleeds outside - controlled imperfection
      overflow: true,
    },
    {
      id: 'orange-accent',
      className: 'shape-orange-accent',
      position: { bottom: '5%', right: '0%' },
      size: { width: 100, height: 120 },
      gradient: 'linear-gradient(135deg, #FF9F43 0%, #FFB366 100%)',
      rotationSpeed: 45,
      parallaxIntensity: 1.5,
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      blur: false,
    },
    {
      id: 'soft-pink',
      className: 'shape-soft-pink',
      position: { top: '60%', left: '30%' },
      size: { width: 80, height: 80 },
      gradient: 'radial-gradient(circle, rgba(255, 107, 157, 0.4) 0%, transparent 70%)',
      rotationSpeed: 0,
      parallaxIntensity: 2,
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
    id,
    className,
    position,
    size,
    gradient,
    rotationSpeed,
    parallaxIntensity,
    clipPath,
    blur,
    overflow,
  } = shape

  // Transform parallax values
  const x = useTransform(parallaxX, (v) => v * parallaxIntensity)
  const y = useTransform(parallaxY, (v) => v * parallaxIntensity)

  return (
    <motion.div
      className={`gradient-shape ${className} ${overflow ? 'overflow-visible' : ''}`}
      style={{
        ...position,
        width: size.width,
        height: size.height,
        x,
        y,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotate: rotationSpeed !== 0 ? 360 : 0,
      }}
      transition={{
        opacity: { duration: 0.8, delay: 0.5 },
        scale: { duration: 0.8, delay: 0.5 },
        rotate: {
          duration: Math.abs(rotationSpeed),
          repeat: Infinity,
          ease: 'linear',
          direction: rotationSpeed < 0 ? 'reverse' : 'normal',
        },
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
      
      {/* Subtle glow effect */}
      {!blur && (
        <div 
          className="shape-glow"
          style={{
            background: gradient,
            filter: 'blur(30px)',
            opacity: 0.4,
          }}
        />
      )}
    </motion.div>
  )
}
