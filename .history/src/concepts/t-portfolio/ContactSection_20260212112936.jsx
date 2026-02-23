/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONTACT SECTION + FOOTER — Identity-Aware
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The atmosphere and tone adapt to the committed side:
 * - design: Warm tones, creative framing
 * - balanced: Both gradients, collaborative tone
 * - tech: Cool tones, builder framing
 */

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

const CONTACT_LINKS = [
  { label: 'Email', value: 'hello@mg-portfolio.dev', href: 'mailto:hello@mg-portfolio.dev', icon: '✉' },
  { label: 'LinkedIn', value: 'linkedin.com/in/mg', href: 'https://linkedin.com/in/mg', icon: '▣' },
  { label: 'GitHub', value: 'github.com/mg', href: 'https://github.com/mg', icon: '◎' },
  { label: 'Behance', value: 'behance.net/mg', href: 'https://behance.net/mg', icon: '◇' },
]

const CTA_VARIANTS = {
  design: {
    title: "Let's Create Something Beautiful",
    intro: 'Looking for a designer who thinks in systems? Whether you need a brand identity, a design system, or a visual experience that moves people — let\'s talk.',
    cta: 'Start a Creative Brief',
    tagline: 'Visual Storyteller & Systems Designer',
  },
  balanced: {
    title: "Let's Build Something Together",
    intro: 'Whether you need a brand identity, a full-stack application, or something that bridges both worlds — I\'d love to hear about your project.',
    cta: 'Start a Conversation',
    tagline: 'The T-Shaped Professional',
  },
  tech: {
    title: "Let's Engineer Something Powerful",
    intro: 'Need a full-stack application, a blockchain solution, or a scalable system architecture? I build technology that performs and endures.',
    cta: 'Discuss Your Architecture',
    tagline: 'Full Stack & Blockchain Engineer',
  },
}

const ContactSection = memo(function ContactSection({ sectionRef, committedSide = 'balanced' }) {
  const variant = useMemo(() => CTA_VARIANTS[committedSide] || CTA_VARIANTS.balanced, [committedSide])

  // Filter contact links per side (show all in balanced, emphasize relevant ones)
  const orderedLinks = useMemo(() => {
    if (committedSide === 'design') {
      // Behance first for designers
      return [CONTACT_LINKS[0], CONTACT_LINKS[3], CONTACT_LINKS[1], CONTACT_LINKS[2]]
    }
    if (committedSide === 'tech') {
      // GitHub first for engineers
      return [CONTACT_LINKS[0], CONTACT_LINKS[2], CONTACT_LINKS[1], CONTACT_LINKS[3]]
    }
    return CONTACT_LINKS
  }, [committedSide])

  return (
    <section id="contact" ref={sectionRef} className={`t-contact t-contact--${committedSide}`}>
      {/* Background atmosphere — shifts per side */}
      <div className="t-contact__atmosphere">
        <div className={`t-contact__gradient t-contact__gradient--warm ${committedSide === 'tech' ? 't-contact__gradient--muted' : ''}`} />
        <div className={`t-contact__gradient t-contact__gradient--cool ${committedSide === 'design' ? 't-contact__gradient--muted' : ''}`} />
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
          <h2 className="t-contact__title">{variant.title}</h2>
          <p className="t-contact__intro">{variant.intro}</p>
        </motion.div>

        {/* Contact links */}
        <div className="t-contact__links">
          {orderedLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
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
          <a href="mailto:hello@mg-portfolio.dev" className={`t-cta-button t-cta-button--${committedSide}`}>
            <span>{variant.cta}</span>
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
            <span className="t-footer__tagline">{variant.tagline}</span>
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
        <div className={`t-footer__t-line t-footer__t-line--${committedSide}`} />
      </footer>
    </section>
  )
})

export default ContactSection
