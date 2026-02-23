import React, { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import './akaru-styles.css'
import Home from './pages/Home'
import Projects from './pages/Projects'

const projects = [
  { id: 1, title: 'Studio identity', desc: 'Branding and art direction for a creative studio.' },
  { id: 2, title: 'E-commerce platform', desc: 'Design and frontend for a niche marketplace.' },
  { id: 3, title: 'Interactive portfolio', desc: 'Animation-heavy portfolio site with custom scroll.' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="brand">MG</div>
        <nav className="nav-actions">
          <button className="menu-btn" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="menu-overlay">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      )}

      <main>
        <Home />
        <Projects />
        <section id="contact" className="contact-section">
          <div className="contact-inner">
            <h3>Contact</h3>
            <p>Get in touch — hello@mg.example</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
