import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="notfound-section">
      <div className="notfound-inner">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-desc">Page not found.</p>
        <Link to="/" className="btn btn-primary">← Back home</Link>
      </div>
    </section>
  )
}
