import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Fixed full-screen background with subtle vertical parallax columns
export default function BackgroundParallaxColumns() {
  const { scrollYProgress } = useScroll()
  // Different speed factors for each column (slight shifts)
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -160])
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -100])
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <div className="parallax-bg" aria-hidden="true">
      <motion.div className="parallax-col col-neutral" style={{ y: ySlow }} />
      <motion.div className="parallax-col col-accent" style={{ y: yFast }} />
      <motion.div className="parallax-col col-muted" style={{ y: yMid }} />
    </div>
  )
}
