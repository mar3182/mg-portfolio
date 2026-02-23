import React, { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import './akaru-styles.css'

const projects = [
  { id: 1, title: 'Studio identity', desc: 'Branding and art direction for a creative studio.' },
  { id: 2, title: 'E-commerce platform', desc: 'Design and frontend for a niche marketplace.' },
  { id: 3, title: 'Interactive portfolio', desc: 'Animation-heavy portfolio site with custom scroll.' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function App() {
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
        <section id="home" className="split-hero">
          <div className="hero-left">
            <motion.h1
              className="giant-text"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              Creative
              <br />
              Direction
            </motion.h1>
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              We build brand identities and digital experiences that move people.
            </motion.p>
          </div>

          <div className="hero-right">
            <motion.div
              className="hero-panel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="panel-inner">
                <h3>Selected Work</h3>
                <p>Studio identity, e‑commerce, interactive experiences.</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="projects" className="projects-section">
          <div className="projects-inner">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="projects-title"
            >
              Projects
            </motion.h2>

            <div className="projects-list">
              {projects.map((p, i) => (
                <motion.article
                  key={p.id}
                  className="project-item"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={fadeInUp}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="project-index">0{p.id}</div>
                  <div className="project-body">
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

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
