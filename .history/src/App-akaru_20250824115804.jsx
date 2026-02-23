import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="relative">
      {/* Fixed Navigation */}
      <div className="fixed top-6 left-6 z-50 text-2xl font-bold text-black">
        M.G.
      </div>
      
      <div className="fixed top-6 right-6 z-50">
        <nav className="hidden md:flex space-x-8 text-sm text-gray-600">
          <button className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">Preview</button>
          <button className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">Projects</button>
          <button className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">Expertise</button>
          <button className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">About</button>
          <button className="hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">Contact</button>
        </nav>
      </div>
      
      <button 
        className="fixed top-6 right-6 z-50 md:hidden bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
        MENU
        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
      </button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          >
            <motion.div 
              className="text-center"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  variants={fadeInUp}
                  className="block text-white text-4xl font-bold mb-6 hover:text-gray-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {section.title}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home Section */}
      <div className="min-h-screen relative overflow-hidden bg-gray-100">
        <div className="absolute inset-0 flex">
          {/* Left side - T and description */}
          <div className="w-1/2 bg-gray-50 flex flex-col justify-center px-16">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="text-[20rem] font-black leading-none text-black mb-8">T</div>
              <div className="max-w-sm">
                <p className="text-sm text-gray-600 mb-4">
                  A preview of a dual-axis narrative: wide horizontal immersion handling off to vertical depth. Scroll to explore the concept.
                </p>
                <button className="text-xs text-gray-400 uppercase tracking-wider">
                  SCROLL ↓
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Right side - Strategy & Design split */}
          <div className="w-1/2 flex flex-col">
            {/* Strategy section */}
            <motion.div 
              className="h-1/2 bg-blue-200 flex flex-col justify-center px-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <h1 className="text-8xl font-black text-black mb-4">Strategy</h1>
              <div className="max-w-md">
                <h3 className="text-lg font-bold mb-2">Clarity & Direction</h3>
                <p className="text-sm text-gray-700">
                  Audits, benchmarks & positioning to unlock informed decisions.
                </p>
              </div>
            </motion.div>
            
            {/* Design section */}
            <motion.div 
              className="h-1/2 bg-pink-200 flex flex-col justify-center px-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <h1 className="text-8xl font-black text-black mb-4">Design</h1>
              <div className="max-w-md">
                <h3 className="text-lg font-bold mb-2">Emotion & Form</h3>
                <p className="text-sm text-gray-700">
                  Brand & product design translating strategy into visceral interfaces.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 flex">
          {/* Left side - Large Projects title and philosophy */}
          <div className="w-1/2 bg-pink-200 flex flex-col">
            <div className="flex-1 flex items-center justify-start px-16">
              <motion.h1 
                className="text-[12rem] font-black leading-none text-black"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                Projects
              </motion.h1>
            </div>
            <div className="px-16 pb-16">
              <motion.p 
                className="text-2xl text-black leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                La création et l'innovation sont au cœur de notre 
                processus, avec l'envie de faire les choses différemment, toujours sur 
                mesure. Allègrement, on dit non au déjà fait, au déjà vu, au déjà lu.
              </motion.p>
            </div>
          </div>
          
          {/* Right side - Project list */}
          <div className="w-1/2 bg-gray-50 flex flex-col justify-center px-16">
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
