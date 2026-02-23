import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
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
      {isMenuOpen && (
        <motion.div
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
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                variants={fadeInUp}
                className="block text-white text-4xl font-bold mb-6 hover:text-gray-300 transition-colors pulse-on-hover"
                onClick={() => scrollToSection(index)}
              >
                {section.title}
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

      {/* About Section */}
      <div className={`min-h-screen flex items-center justify-center ${sections[1].color} relative`}>
        <div className="morphing-bg"></div>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl">
            <AnimatedSection>
              <h2 className="section-title mb-12">About</h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
              <AnimatedSection className="lg:col-span-2">
                <h3 className="text-3xl font-bold mb-6">T-Shaped Professional</h3>
                <p className="text-lg text-gray-700 mb-6">
                  I'm a T-shaped professional with broad knowledge across multiple 
                  disciplines and deep expertise in web development and design. 
                  This unique combination allows me to see the big picture while 
                  delivering exceptional technical solutions.
                </p>
                <p className="text-lg text-gray-700 mb-8">
                  My horizontal skills span across business strategy, user research, 
                  project management, and team collaboration, while my vertical 
                  expertise dives deep into modern web technologies, design systems, 
                  and performance optimization.
                </p>
                <div className="flex flex-wrap gap-3 mb-8 stagger-container">
                  {['Creative', 'Passionate', 'Independent', 'Innovative', 'Reliable'].map((trait) => (
                    <span key={trait} className="px-4 py-2 bg-white rounded-full border-2 border-black font-semibold skill-tag">
                      {trait}
                    </span>
                  ))}
                </div>
              </AnimatedSection>
              
              <AnimatedSection>
                <div className="bg-white p-6 rounded-lg border-4 border-black">
                  <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="text-gray-600" />
                      <span>New York, NY</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={20} className="text-gray-600" />
                      <span>Available for projects</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award size={20} className="text-gray-600" />
                      <span>5+ years experience</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-black text-white hover:bg-gray-800">
                    <Download size={16} className="mr-2" />
                    Download CV
                  </Button>
                </div>
              </AnimatedSection>
            </div>

            {/* Experience Timeline */}
            <AnimatedSection>
              <h3 className="text-3xl font-bold mb-8">Experience</h3>
              <div className="space-y-8">
                {experience.map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="border-l-4 border-black pl-8 relative"
                  >
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-black rounded-full"></div>
                    <div className="bg-white p-6 rounded-lg border-2 border-black">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold">{job.title}</h4>
                          <p className="text-gray-600 font-medium">{job.company}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          <div>{job.period}</div>
                          <div>{job.location}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{job.description}</p>
                      <div className="space-y-2">
                        {job.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Award size={16} className="text-green-600 mt-1 flex-shrink-0" />
                            <span className="text-sm">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {/* Stats */}
            <AnimatedSection className="mt-16">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center bg-white p-6 rounded-lg border-4 border-black float-animation"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-4xl font-bold text-black mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Expertise Section */}
      <div className={`min-h-screen flex items-center justify-center ${sections[2].color} relative`}>
        <div className="morphing-bg"></div>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl">
            <AnimatedSection>
              <h2 className="section-title mb-12">Expertise</h2>
              <p className="text-xl text-gray-700 mb-16 max-w-3xl">
                I specialize in creating digital experiences that combine technical 
                excellence with thoughtful design. From concept to deployment, I handle 
                every aspect of modern web development with precision and creativity.
              </p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-container">
              {expertise.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white p-8 rounded-lg border-4 border-black project-card float-animation"
                >
                  <div className="text-black mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-700 mb-6">{item.description}</p>
                  <div className="flex justify-between text-sm text-gray-600 mb-6">
                    <span>{item.experience}</span>
                    <span>{item.projects}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
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

      {/* Contact Section */}
      <div className={`min-h-screen flex items-center justify-center ${sections[4].color} relative`}>
        <div className="morphing-bg"></div>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <AnimatedSection>
              <h2 className="section-title mb-12">Contact</h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <AnimatedSection>
                <h3 className="text-3xl font-bold mb-6">Let's Work Together</h3>
                <p className="text-lg text-gray-700 mb-8">
                  Ready to bring your vision to life? Let's discuss your project 
                  and create something amazing together. I'm always excited to 
                  take on new challenges and collaborate with passionate individuals.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <Mail className="text-gray-600" size={24} />
                    <span className="text-lg">hello@mg-portfolio.com</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="text-gray-600" size={24} />
                    <span className="text-lg">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="text-gray-600" size={24} />
                    <span className="text-lg">New York, NY</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="border-2 border-black hover:bg-black hover:text-white pulse-on-hover">
                    <Github size={20} />
                  </Button>
                  <Button variant="outline" size="icon" className="border-2 border-black hover:bg-black hover:text-white pulse-on-hover">
                    <Linkedin size={20} />
                  </Button>
                </div>
                <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-bold text-green-800">Available for Projects</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Currently accepting new projects and collaborations. 
                    Response time: Usually within 24 hours.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection>
                <div className="bg-white p-8 rounded-lg border-4 border-black">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Name *</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email *</label>
                      <input 
                        type="email" 
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Project Type</label>
                      <select className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition-colors">
                        <option>Web Development</option>
                        <option>UI/UX Design</option>
                        <option>Full-Stack Project</option>
                        <option>Consultation</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Message *</label>
                      <textarea 
                        rows={4}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none resize-none transition-colors"
                        placeholder="Tell me about your project..."
                      />
                    </div>
                    <Button className="w-full bg-black text-white hover:bg-gray-800 pulse-on-hover">
                      Send Message
                    </Button>
                  </form>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

