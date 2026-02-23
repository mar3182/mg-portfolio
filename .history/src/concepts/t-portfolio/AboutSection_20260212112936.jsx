/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ABOUT SECTION — Identity-Aware T-Shaped Story
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Content adapts to committed side:
 * - design: Creative philosophy, visual process, design inspirations
 * - balanced: Full T-shape story, both pillars equally
 * - tech: Technical architecture, systems thinking, engineering craft
 */

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════
// CONTENT VARIANTS PER SIDE
// ═══════════════════════════════════════════════════════════════════

const ABOUT_VARIANTS = {
  design: {
    title: <>Where <em>visual storytelling</em> shapes digital experiences</>,
    intro: `I believe every pixel has purpose. From brand systems to motion design, 
      I craft visual experiences that resonate emotionally — translating complex ideas 
      into intuitive, beautiful interfaces that users love to interact with.`,
    pillars: [
      {
        id: 'brand-identity',
        title: 'Brand & Identity',
        skills: ['Logo Design', 'Visual Identity Systems', 'Brand Guidelines', 'Typography'],
        description: 'Building cohesive brand worlds that communicate personality and values at every touchpoint.',
        icon: '◇',
      },
      {
        id: 'ui-ux',
        title: 'UI/UX Design',
        skills: ['Interface Design', 'Design Systems', 'Prototyping', 'User Research'],
        description: 'Designing intuitive interfaces grounded in user psychology and tested with real people.',
        icon: '◈',
      },
      {
        id: 'motion-visual',
        title: 'Motion & Visual',
        skills: ['Motion Graphics', 'Micro-interactions', 'SVG Animation', 'Visual Effects'],
        description: 'Animating with intention — every movement guides attention and enhances understanding.',
        icon: '○',
      },
    ],
    stats: [
      { value: '200+', label: 'Interfaces Designed' },
      { value: '11+', label: 'Years Crafting' },
      { value: '15+', label: 'Brand Systems' },
      { value: '∞', label: 'Attention to Detail' },
    ],
  },

  balanced: {
    title: <>Where <em>design intuition</em> meets <strong>engineering precision</strong></>,
    intro: `I'm a T-shaped professional — broad creative and technical foundation 
      with deep expertise in full-stack development, design systems, and blockchain. 
      Every project benefits from both perspectives working in harmony.`,
    pillars: [
      {
        id: 'design-pillar',
        title: 'Creative Design',
        skills: ['Brand Identity', 'UI/UX Design', 'Motion Graphics', 'Visual Systems'],
        description: 'Crafting visual experiences that resonate emotionally and communicate with clarity.',
        icon: '◇',
      },
      {
        id: 'fullstack-pillar',
        title: 'Full Stack Development',
        skills: ['React / Next.js', 'Node.js / PHP', 'Python / AI', 'Database Design'],
        description: 'Building robust, scalable applications from database to interface.',
        icon: '⬢',
      },
      {
        id: 'blockchain-pillar',
        title: 'Blockchain & Web3',
        skills: ['Smart Contracts', 'DeFi Protocols', 'NFT Platforms', 'Multi-chain'],
        description: 'Engineering decentralized systems and trustless architectures.',
        icon: '◈',
      },
    ],
    stats: [
      { value: '11+', label: 'Years Experience' },
      { value: '50+', label: 'Projects Delivered' },
      { value: '6', label: 'Languages' },
      { value: '∞', label: 'Curiosity' },
    ],
  },

  tech: {
    title: <>Where <strong>systems thinking</strong> builds digital infrastructure</>,
    intro: `I engineer solutions that scale. From microservice architectures to smart contracts, 
      I build the invisible structures that power modern applications — always with clean code, 
      robust testing, and maintainable patterns at the core.`,
    pillars: [
      {
        id: 'fullstack',
        title: 'Full Stack Engineering',
        skills: ['React / Next.js', 'Node.js / Express', 'PHP / Laravel', 'PostgreSQL / MongoDB'],
        description: 'Building end-to-end applications with clean architecture and performance in mind.',
        icon: '⬢',
      },
      {
        id: 'blockchain',
        title: 'Blockchain & Web3',
        skills: ['Solidity / Rust', 'DeFi Protocols', 'Smart Contract Auditing', 'Multi-chain Infrastructure'],
        description: 'Engineering decentralized systems with security-first approach and gas optimization.',
        icon: '◈',
      },
      {
        id: 'devops-ai',
        title: 'DevOps & AI',
        skills: ['Docker / K8s', 'CI/CD Pipelines', 'Python / ML', 'LLM Integration'],
        description: 'Automating infrastructure and integrating AI capabilities into production systems.',
        icon: '⟐',
      },
    ],
    stats: [
      { value: '50+', label: 'Systems Built' },
      { value: '6', label: 'Languages' },
      { value: '99.9%', label: 'Uptime Target' },
      { value: '∞', label: 'Curiosity' },
    ],
  },
}

// Side class for each pillar
function pillarSideClass(side, index) {
  if (side === 'balanced') {
    return index === 0 ? 'design' : index === 2 ? 'tech' : 'center'
  }
  return side
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

const AboutSection = memo(function AboutSection({ sectionRef, committedSide = 'balanced' }) {
  const content = useMemo(() => ABOUT_VARIANTS[committedSide] || ABOUT_VARIANTS.balanced, [committedSide])

  return (
    <section id="about" ref={sectionRef} className={`t-about t-about--${committedSide}`}>
      {/* Section header */}
      <motion.div
        className="t-about__header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <span className="t-section-label">About</span>
        <h2 className="t-about__title" key={committedSide}>
          {content.title}
        </h2>
        <p className="t-about__intro">{content.intro}</p>
      </motion.div>

      {/* The T explanation visual — only show in balanced mode */}
      {committedSide === 'balanced' && (
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
      )}

      {/* Side-specific decorative line for design/tech modes */}
      {committedSide !== 'balanced' && (
        <motion.div
          className={`t-about__side-accent t-about__side-accent--${committedSide}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      {/* Expertise pillars grid */}
      <div className="t-about__pillars">
        {content.pillars.map((pillar, i) => (
          <motion.div
            key={pillar.id}
            className={`t-pillar t-pillar--${pillarSideClass(committedSide, i)}`}
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
        {content.stats.map((stat, i) => (
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
