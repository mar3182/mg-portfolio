/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONTACT SECTION + FOOTER — The Final Impression
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Warm, inviting CTA area with the living-portrait atmosphere.
 * Footer closes with M|G identity.
 */

import { memo } from 'react'
import { motion } from 'framer-motion'

const CONTACT_LINKS = [
  { label: 'Email', value: 'hello@mg-portfolio.dev', href: 'mailto:hello@mg-portfolio.dev', icon: '✉' },
  { label: 'LinkedIn', value: 'linkedin.com/in/mg', href: '#', icon: '▣' },
  { label: 'GitHub', value: 'github.com/mg', href: '#', icon: '◎' },
  { label: 'Behance', value: 'behance.net/mg', href: '#', icon: '◇' },
]

const ContactSection = memo(function ContactSection({ sectionRef }) {
  return (
    <section id="contact" ref={sectionRef} className="t-contact">
      {/* Background atmosphere */}
      <div className="t-contact__atmosphere">
        <div className="t-contact__gradient t-contact__gradient--warm" />
        <div className="t-contact__gradient t-contact__gradient--cool" />
      </div>

      <div className="t-contact__content">
        <motion.div
          className="t-contact__header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="t-section-label">Contact</span>
          <h2 className="t-contact__title">Let's Build Something Together</h2>
          <p className="t-contact__intro">
            Whether you need a brand identity, a full-stack application, or something 
            that bridges both worlds — I'd love to hear about your project.
          </p>
        </motion.div>

        {/* Contact links */}
        <div className="t-contact__links">
          {CONTACT_LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="t-contact-link"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              whileHover={{ x: 12 }}
            >
              <span className="t-contact-link__icon">{link.icon}</span>
              <div className="t-contact-link__text">
                <span className="t-contact-link__label">{link.label}</span>
                <span className="t-contact-link__value">{link.value}</span>
              </div>
              <span className="t-contact-link__arrow">→</span>
            </motion.a>
          ))}
        </div>

        {/* CTA button */}
        <motion.div
          className="t-contact__cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <a href="mailto:hello@mg-portfolio.dev" className="t-cta-button">
            <span>Start a Conversation</span>
            <span className="t-cta-button__arrow">→</span>
          </a>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="t-footer">
        <div className="t-footer__content">
          <div className="t-footer__brand">
            <span className="t-footer__logo">
              <span className="t-footer__m">M</span>
              <span className="t-footer__divider">|</span>
              <span className="t-footer__g">G</span>
            </span>
            <span className="t-footer__tagline">The T-Shaped Professional</span>
          </div>
          
          <div className="t-footer__meta">
            <span className="t-footer__copyright">© {new Date().getFullYear()} MG Portfolio</span>
            <span className="t-footer__built">
              Designed & Built with{' '}
              <span className="t-footer__heart">♥</span>
            </span>
          </div>
        </div>
        
        {/* Decorative T line at very bottom */}
        <div className="t-footer__t-line" />
      </footer>
    </section>
  )
})

export default ContactSection
