import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { getProjectById } from '../data/projects'

export default function ProjectDetail() {
  const { id } = useParams()
  const project = getProjectById(id)

  if (!project) {
    return (
      <section style={{ padding: '6rem 2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Not found</h1>
        <p>Project does not exist.</p>
        <p style={{ marginTop: '2rem' }}><Link to="/projects">← Back to projects</Link></p>
      </section>
    )
  }

  return (
    <section style={{ padding: '6rem 2rem', minHeight: '80vh' }}>
      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 920, margin: '0 auto' }}
        layoutId={`project-card-${project.id}`}
      >
        <h1 style={{ fontSize: '4rem', lineHeight: 0.9, marginBottom: '2rem' }}>
          <Motion.span layoutId={`project-title-${project.id}`}>{project.title}</Motion.span>
        </h1>
        <Motion.div style={{ background: project.color, borderRadius: 12, padding: '3rem 2rem', marginBottom: '2.5rem' }} layoutId={`project-color-${project.id}`}>
          <p style={{ fontSize: '1.2rem', maxWidth: 600 }}>{project.desc}</p>
        </Motion.div>
        <p style={{ fontSize: '0.95rem', opacity: 0.7 }}>Case study placeholder content... (add details, imagery, process, outcomes).</p>
        <p style={{ marginTop: '3rem' }}><Link to="/projects">← Back to projects</Link></p>
      </Motion.div>
    </section>
  )
}
