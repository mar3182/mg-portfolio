export const expertiseCategories = [
  {
    id: 1,
    key: 'strategy',
    title: 'Strategy & Direction',
    tags: ['Discovery', 'Positioning', 'Content Strategy', 'Roadmapping'],
    blurb: 'Aligning business objectives with clear digital direction and measurable milestones.',
    long: 'We build a shared, evidence-based understanding of user needs, the market, and internal goals. Outcomes: positioning clarity, prioritized opportunities, and a measurable roadmap that de-risks execution.',
    services: [
      'Stakeholder & user interviews',
      'Competitive / heuristic audits',
      'Analytics & performance baseline',
      'Content architecture & narrative',
      'Product & feature roadmapping',
      'KPI & measurement frameworks'
    ],
    color: '#ffe9d6'
  },
  {
    id: 2,
    key: 'design',
    title: 'Design Systems',
    tags: ['UI Architecture', 'Accessibility', 'Tokens', 'Prototyping'],
    blurb: 'Scalable interface patterns and accessible component systems supporting rapid iteration.',
    long: 'From exploratory concepts to codified components, we craft a shared language enabling velocity with consistency. Accessibility and expressive motion are foundational—never afterthoughts.',
    services: [
      'Visual + interaction language',
      'Design tokens & theming',
      'Accessible component libraries',
      'Prototyping & motion specs',
      'Documentation & usage guidelines',
      'Design QA & audits'
    ],
    color: '#e0f7ff'
  },
  {
    id: 3,
    key: 'frontend',
    title: 'Frontend Engineering',
    tags: ['React', 'Performance', 'Animations', 'Tooling'],
    blurb: 'High-fidelity interactive experiences with a focus on motion, performance and reliability.',
    long: 'We implement resilient, performant interfaces—balancing craft and maintainability. Tooling, observability and performance budgets are embedded from day one.',
    services: [
      'Component architecture & patterns',
      'Accessibility implementation',
      'Animation & micro-interactions',
      'Performance tuning & budgets',
      'Tooling & DX optimization',
      'Testing strategy'
    ],
    color: '#e7ffd8'
  },
  {
    id: 4,
    key: 'integration',
    title: 'Integration & Delivery',
    tags: ['APIs', 'CI/CD', 'Observability', 'Optimization'],
    blurb: 'Robust delivery pipelines, runtime monitoring and continuous performance optimization.',
    long: 'Infra & delivery discipline that keeps products fast, observable and continuously improving. We align deployment automation with meaningful telemetry and iterative optimization loops.',
    services: [
      'API & data layer integration',
      'CI/CD pipelines & preview envs',
      'Observability & logging setup',
      'Real user monitoring (RUM)',
      'Performance regression tracking',
      'Continuous optimization cycles'
    ],
    color: '#f2e3ff'
  }
]

export function getExpertiseByKey(key) {
  return expertiseCategories.find(c => c.key === key)
}
