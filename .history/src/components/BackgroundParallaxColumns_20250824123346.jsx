import React from 'react'
import { motion as Motion, useScroll, useTransform } from 'framer-motion'

// Fixed full-screen background with subtle vertical parallax columns
export default function BackgroundParallaxColumns() {
  const { scrollYProgress } = useScroll()
  // Different speed factors for each column (slight shifts)
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -160])
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -100])
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -60])
  const xFast = useTransform(scrollYProgress, [0, 1], [0, 40])
  const xMid = useTransform(scrollYProgress, [0, 1], [0, 28])
  const xSlow = useTransform(scrollYProgress, [0, 1], [0, 16])
  const sFast = useTransform(scrollYProgress, [0, 1], [1, 1.04])
  const sMid = useTransform(scrollYProgress, [0, 1], [1, 1.02])
  const sSlow = useTransform(scrollYProgress, [0, 1], [1, 1.015])

  return (
    <div className="parallax-bg" aria-hidden="true">
  <Motion.div className="parallax-col col-neutral" style={{ y: ySlow, x: xSlow, scale: sSlow }} />
  <Motion.div className="parallax-col col-accent" style={{ y: yFast, x: xFast, scale: sFast }} />
  <Motion.div className="parallax-col col-muted" style={{ y: yMid, x: xMid, scale: sMid }} />
    </div>
  )
}
