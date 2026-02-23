import React, { useRef } from 'react'
import { motion as Motion, useScroll, useTransform } from 'framer-motion'
import { projects } from '../data/projects'
import { Link } from 'react-router-dom'

/*
  HorizontalScrollProjects
  - Creates a tall wrapper (height = viewport * factor)
  - Pins inner track (position: sticky) while user scrolls vertically
  - Translates inner track horizontally to simulate horizontal scroll
*/
export default function HorizontalScrollProjects() {
  const wrapperRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })
  // translateX from 0 to - (trackWidth - viewportWidth). We approximate with % across progress.
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-65%'])

  return (
    <section ref={wrapperRef} className="hs-wrapper" aria-label="Featured Projects Horizontal">
      <div className="hs-sticky">
        <Motion.div className="hs-track" style={{ x }}>
          {projects.map(p => (
            <Motion.div key={p.id} className="hs-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Link to={`/projects/${p.id}`} className="hs-card-inner" style={{ background:p.color }}>
                <div className="hs-card-meta">
                  <span className="hs-card-index">0{p.id}</span>
                  <h3 className="hs-card-title">{p.title}</h3>
                  <p className="hs-card-desc">{p.desc}</p>
                </div>
              </Link>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  )
}
