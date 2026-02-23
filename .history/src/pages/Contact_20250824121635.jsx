import React from 'react'

export default function Contact() {
  return (
    <section className="contact-section" style={{ minHeight: '60vh', padding: '6rem 2rem' }}>
      <div className="contact-inner" style={{ maxWidth: 640, margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Contact</h1>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.5 }}>Get in touch — <a href="mailto:hello@mg.example">hello@mg.example</a></p>
      </div>
    </section>
  )
}
