import React from 'react'
import { motion as Motion } from 'framer-motion'
import '../akaru-styles.css'

export default function About() {
  return (
    <section className="about-section" style={{ padding: '6rem 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <Motion.header 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ marginBottom: '4rem' }}
        >
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 5rem)', 
            lineHeight: 0.85, 
            letterSpacing: '-0.04em', 
            margin: '0 0 2rem' 
          }}>
            About Mary Garcia
          </h1>
          <p style={{ 
            fontSize: '1.35rem', 
            fontWeight: 300, 
            opacity: 0.7, 
            maxWidth: '600px',
            lineHeight: 1.4
          }}>
            Full Stack Developer & Software Architect with 11+ years of experience building scalable web solutions, AI integrations, and custom applications.
          </p>
        </Motion.header>

        <div style={{ display: 'grid', gap: '4rem', marginBottom: '4rem' }}>
          
          {/* Professional Journey */}
          <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Professional Journey
            </h2>
            <div style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.85 }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Born in Rocha, Uruguay, I began my journey in technology over a decade ago with a passion for creating digital solutions that make a real impact. After completing my studies in Graphic Design and International Business, I discovered my true calling in full-stack development.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Since 2013, I've been building web applications and custom solutions for clients across various industries. My freelance practice, Studio Garcia Garcia, allowed me to develop expertise in the complete project lifecycle—from initial concept and design to technical implementation and deployment.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                In recent years, I've focused on cutting-edge technologies including AI integration, microservices architecture, and data-driven platforms. My current role involves architecting scalable SaaS solutions with advanced features like Retrieval-Augmented Generation (RAG) systems and event-driven architectures.
              </p>
            </div>
          </Motion.div>

          {/* Technical Expertise */}
          <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Technical Expertise
            </h2>
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              
              <div style={{ 
                background: '#ffd6e0', 
                padding: '2rem', 
                borderRadius: '1rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Backend Development</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.8 }}>
                  Expert in PHP and Python with extensive experience in database design, API development, and server-side optimization.
                </p>
              </div>

              <div style={{ 
                background: '#d7f0ff', 
                padding: '2rem', 
                borderRadius: '1rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Frontend Excellence</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.8 }}>
                  Modern JavaScript frameworks including React, with focus on performance, accessibility, and user experience.
                </p>
              </div>

              <div style={{ 
                background: '#f0e7ff', 
                padding: '2rem', 
                borderRadius: '1rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>AI Integration</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.8 }}>
                  Advanced implementation of RAG systems, vector databases, and knowledge graphs for intelligent applications.
                </p>
              </div>

              <div style={{ 
                background: '#e7ffd8', 
                padding: '2rem', 
                borderRadius: '1rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>WordPress Mastery</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.8 }}>
                  Custom theme and plugin development, e-commerce integrations, and performance optimization for WordPress.
                </p>
              </div>

            </div>
          </Motion.div>

          {/* Personal Values */}
          <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Approach & Values
            </h2>
            <div style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.85 }}>
              <p style={{ marginBottom: '1.5rem' }}>
                I believe in writing clean, maintainable code that not only solves immediate problems but scales with business growth. My approach combines technical excellence with genuine client collaboration—understanding business objectives and translating them into robust digital solutions.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Having worked with clients across different industries and scales, from small local businesses to complex SaaS platforms, I've learned the importance of adaptable communication and flexible technical solutions that meet real-world needs.
              </p>
              <p>
                Currently based in the Netherlands, I continue to expand my expertise in emerging technologies while maintaining focus on fundamental principles: performance, security, accessibility, and user experience.
              </p>
            </div>
          </Motion.div>

          {/* Education & Continuous Learning */}
          <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Education & Continuous Learning
            </h2>
            <div style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.85 }}>
              <p style={{ marginBottom: '1.5rem' }}>
                My educational foundation includes degrees in Graphic Design from Universidad ORT Uruguay and International Business from Holland Opleidingen Groep. This combination gives me a unique perspective on both the creative and business aspects of technology solutions.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                I'm committed to continuous learning, regularly completing courses in emerging technologies. Recent certifications include Harvard's CS50 Introduction to Computer Science, IBM's Data Engineering specialization, and MIT's Blockchain Technologies course.
              </p>
              <p>
                This blend of formal education, practical experience, and ongoing learning enables me to stay current with technology trends while maintaining a strong foundation in proven development principles.
              </p>
            </div>
          </Motion.div>

        </div>

        {/* Call to Action */}
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          style={{ 
            background: '#f8f9fa', 
            padding: '3rem 2.5rem', 
            borderRadius: '1.5rem',
            textAlign: 'center',
            marginTop: '3rem'
          }}
        >
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Let's Build Something Together
          </h3>
          <p style={{ fontSize: '1rem', lineHeight: 1.5, opacity: 0.8, maxWidth: '500px', margin: '0 auto 2rem' }}>
            Whether you need a custom web application, AI integration, or WordPress solution, I'm here to help bring your vision to life.
          </p>
          <a 
            href="/contact" 
            style={{ 
              display: 'inline-block',
              background: '#000', 
              color: '#fff', 
              padding: '0.8rem 2rem', 
              borderRadius: '2rem',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Get In Touch
          </a>
        </Motion.div>

      </div>
    </section>
  )
}