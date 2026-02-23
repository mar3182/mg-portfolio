import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section style={{ minHeight: '60vh', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Page not found.</p>
        <Link to="/" style={{ fontWeight: 600 }}>← Back home</Link>
      </div>
    </section>
  )
}
