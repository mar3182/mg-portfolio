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
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import './App.css'
import './akaru-styles.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const sections = [
    { id: 'home', title: 'Home' },
    { id: 'projects', title: 'Projects' },
    { id: 'expertise', title: 'Expertise' },
    { id: 'about', title: 'About' },
    { id: 'contact', title: 'Contact' }
  ]

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
      {/* Home Section */}
      <section id="home" className="min-h-screen section split-screen">
        <div className="split-left">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="home-left"
          >
            <div className="giant-text">T</div>
            <div className="mt-6 max-w-sm text-sm text-gray-600">
              <p>
                A preview of a dual-axis narrative: wide horizontal immersion handing off to vertical depth. Scroll to explore the concept.
              </p>
              <div className="mt-4 text-xs text-gray-400 uppercase tracking-wider">Scroll ↓</div>
            </div>
          </motion.div>
        </div>

        <div className="split-right">
          <div className="w-full">
            <motion.div
              className="right-split-grid"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <div className="panel panel-strategy">
                <h2 className="text-7xl font-black">Strategy</h2>
                <h4 className="mt-4 font-bold">Clarity & Direction</h4>
                <p className="mt-3 text-sm text-gray-700 max-w-md">Audits, benchmarks & positioning to unlock informed decisions.</p>
              </div>
              <div className="panel panel-design">
                <h2 className="text-7xl font-black">Design</h2>
                <h4 className="mt-4 font-bold">Emotion & Form</h4>
                <p className="mt-3 text-sm text-gray-700 max-w-md">Brand & product design translating strategy into visceral interfaces.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Home Section */}
      <div className="min-h-screen relative overflow-hidden bg-gray-100">
        <div className="absolute inset-0 flex">
          {/* Left side - T and description */}
          <div className="w-1/2 bg-gray-50 flex flex-col justify-center px-16">
            <motion.div
              {/* Projects Section */}
              <section id="projects" className="min-h-screen section">
                <div className="container-inner grid grid-cols-12 gap-8 items-start">
                  <motion.div
                    className="col-span-6 projects-left"
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.9 }}
                  >
                    <h1 className="giant-text">Projets</h1>
                    <p className="mt-8 text-xl max-w-2xl text-gray-800">
                      La création et l'innovation sont au cœur de notre processus, avec l'envie de faire les choses différemment, toujours sur mesure. Allègrement, on dit non au déjà fait, au déjà vu, au déjà lu.
                    </p>
                  </motion.div>

                  <motion.div
                    className="col-span-6 projects-right"
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.9, delay: 0.15 }}
                  >
                    <div className="project-list">
                      {[
                        'IDENTITÉ VISUELLE, CHARTE GRAPHIQUE, LOGO',
                        'CRÉATION DE SITE VITRINE SUR MESURE',
                        'DIRECTION ARTISTIQUE, WEBDESIGN, UX & UI',
                        'E-COMMERCE SHOPIFY & PLATEFORME DE VENTE'
                      ].map((title, i) => (
                        <div key={i} className="project-list-item flex items-start gap-6">
                          <div className="project-number">{String(i).padStart(2, '0')}</div>
                          <div className="project-title">{title}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </section>
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="border-b border-black pb-6">
                <div className="flex items-start gap-8">
                  <span className="text-2xl font-light text-gray-400">00</span>
                  <div>
                    <h3 className="text-lg font-bold text-black uppercase tracking-wide">
                      IDENTITÉ VISUELLE, CHARTE<br />GRAPHIQUE, LOGO
                    </h3>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-black pb-6">
                <div className="flex items-start gap-8">
                  <span className="text-2xl font-light text-gray-400">01</span>
                  <div>
                    <h3 className="text-lg font-bold text-black uppercase tracking-wide">
                      CRÉATION DE SITE VITRINE<br />SUR MESURE
                    </h3>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-black pb-6">
                <div className="flex items-start gap-8">
                  <span className="text-2xl font-light text-gray-400">02</span>
                  <div>
                    <h3 className="text-lg font-bold text-black uppercase tracking-wide">
                      DIRECTION ARTISTIQUE,<br />WEBDESIGN, UX & UI
                    </h3>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-black pb-6">
                <div className="flex items-start gap-8">
                  <span className="text-2xl font-light text-gray-400">03</span>
                  <div>
                    <h3 className="text-lg font-bold text-black uppercase tracking-wide">
                      E-COMMERCE SHOPIFY &<br />PLATEFORME DE VENTE
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
