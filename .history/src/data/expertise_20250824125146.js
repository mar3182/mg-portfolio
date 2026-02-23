export const expertiseCategories = [
  {
    id: 1,
    key: 'strategy',
    title: 'Strategy & Direction',
    tags: ['Discovery', 'Positioning', 'Content Strategy', 'Roadmapping'],
    blurb: 'Aligning business objectives with clear digital direction and measurable milestones.',
    color: '#ffe9d6'
  },
  {
    id: 2,
    key: 'design',
    title: 'Design Systems',
    tags: ['UI Architecture', 'Accessibility', 'Tokens', 'Prototyping'],
    blurb: 'Scalable interface patterns and accessible component systems supporting rapid iteration.',
    color: '#e0f7ff'
  },
  {
    id: 3,
    key: 'frontend',
    title: 'Frontend Engineering',
    tags: ['React', 'Performance', 'Animations', 'Tooling'],
    blurb: 'High-fidelity interactive experiences with a focus on motion, performance and reliability.',
    color: '#e7ffd8'
  },
  {
    id: 4,
    key: 'integration',
    title: 'Integration & Delivery',
    tags: ['APIs', 'CI/CD', 'Observability', 'Optimization'],
    blurb: 'Robust delivery pipelines, runtime monitoring and continuous performance optimization.',
    color: '#f2e3ff'
  }
]

export function getExpertiseByKey(key) {
  return expertiseCategories.find(c => c.key === key)
}
