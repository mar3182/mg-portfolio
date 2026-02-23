/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ABOUT SECTION — The T-Shaped Professional Story
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Visual split: Design ethos on left, Tech prowess on right,
 * unified by the T-shaped philosophy at center.
 */

import { memo } from 'react'
import { motion, useTransform, useScroll } from 'framer-motion'

// Expertise pillars — the horizontal bar of the T
const EXPERTISE_PILLARS = [
  {
    id: 'design-pillar',
    side: 'design',
    title: 'Creative Design',
    skills: ['Brand Identity', 'UI/UX Design', 'Motion Graphics', 'Visual Systems'],
    description: 'Crafting visual experiences that resonate emotionally and communicate with clarity.',
    icon: '◇',
  },
  {
    id: 'fullstack-pillar',
    side: 'center',
    title: 'Full Stack Development',
    skills: ['React / Next.js', 'Node.js / PHP', 'Python / AI', 'Database Design'],
    description: 'Building robust, scalable applications from database to interface.',
    icon: '⬢',
  },
  {
    id: 'blockchain-pillar',
    side: 'tech',
    title: 'Blockchain & Web3',
    skills: ['Smart Contracts', 'DeFi Protocols', 'NFT Platforms', 'Multi-chain'],
    description: 'Engineering decentralized systems and trustless architectures.',
    icon: '◈',
  },
]

// Stats for credibility
const STATS = [
  { value: '11+', label: 'Years Experience' },
  { value: '50+', label: 'Projects Delivered' },
  { value: '6', label: 'Languages' },
  { value: '∞', label: 'Curiosity' },
]

const AboutSection = memo(function AboutSection({ sectionRef }) {
  return (
    <section id="about" ref={sectionRef} className="t-about">
      {/* Section header */}
      <motion.div
        className="t-about__header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <span className="t-section-label">About</span>
        <h2 className="t-about__title">
          Where <em>design intuition</em> meets <strong>engineering precision</strong>
        </h2>
        <p className="t-about__intro">
          I'm a T-shaped professional — broad creative and technical foundation 
          with deep expertise in full-stack development, design systems, and blockchain. 
          Every project benefits from both perspectives working in harmony.
        </p>
      </motion.div>

      {/* The T explanation visual */}
      <div className="t-about__t-visual">
        <motion.div
          className="t-visual__horizontal"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="t-visual__label t-visual__label--left">Design</span>
          <span className="t-visual__label t-visual__label--right">Technology</span>
        </motion.div>
        <motion.div
          className="t-visual__vertical"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="t-visual__depth-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          Depth of Expertise
        </motion.span>
      </div>

      {/* Expertise pillars grid */}
      <div className="t-about__pillars">
        {EXPERTISE_PILLARS.map((pillar, i) => (
          <motion.div
            key={pillar.id}
            className={`t-pillar t-pillar--${pillar.side}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
          >
            <span className="t-pillar__icon">{pillar.icon}</span>
            <h3 className="t-pillar__title">{pillar.title}</h3>
            <p className="t-pillar__desc">{pillar.description}</p>
            <ul className="t-pillar__skills">
              {pillar.skills.map(skill => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Stats row */}
      <div className="t-about__stats">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="t-stat"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
          >
            <span className="t-stat__value">{stat.value}</span>
            <span className="t-stat__label">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
})

export default AboutSection
