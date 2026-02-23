export const expertiseCategories = [
  {
    id: 1,
    key: 'fullstack',
    title: 'Full Stack Development',
    tags: ['PHP', 'Python', 'React', 'API Design'],
    blurb: 'Complete web solutions from backend architecture to responsive frontend experiences.',
    long: 'Expert in building scalable web applications using modern technologies. Specialized in PHP and Python backends with React frontends, ensuring optimal performance and maintainability.',
    services: [
      'Custom web application development',
      'Database design & optimization',
      'Responsive frontend interfaces',
      'Performance optimization',
      'Code architecture & best practices',
      'Cross-platform compatibility'
    ],
    color: '#ffe9d6'
  },
  {
    id: 2,
    key: 'api',
    title: 'API Integration & Design',
    tags: ['REST APIs', 'Microservices', 'Data Pipelines', 'System Integration'],
    blurb: 'Seamless system integrations and scalable API architectures for modern applications.',
    long: 'Designing and implementing robust API solutions with API-first approach. Expert in creating microservices architectures and integrating external systems for enhanced functionality.',
    services: [
      'REST API design & development',
      'Third-party API integrations',
      'Microservices architecture',
      'Data pipeline development',
      'System integration consulting',
      'API documentation & testing'
    ],
    color: '#e0f7ff'
  },
  {
    id: 3,
    key: 'ai',
    title: 'AI & Data Engineering',
    tags: ['RAG Systems', 'Vector Databases', 'Data Pipelines', 'Prompt Engineering'],
    blurb: 'Advanced AI implementations including knowledge graphs and retrieval-augmented generation.',
    long: 'Implementing cutting-edge AI solutions with focus on Retrieval-Augmented Generation systems, vector databases, and intelligent data processing for enhanced user experiences.',
    services: [
      'RAG system implementation',
      'Knowledge graph development',
      'Vector database integration',
      'AI-powered features',
      'Data engineering pipelines',
      'Prompt engineering optimization'
    ],
    color: '#f0e7ff'
  },
  {
    id: 4,
    key: 'wordpress',
    title: 'WordPress & CMS Solutions',
    tags: ['Custom Themes', 'Plugin Development', 'E-commerce', 'Performance'],
    blurb: 'Custom WordPress solutions from theme development to complex e-commerce integrations.',
    long: 'Specialist in creating bespoke WordPress solutions, from custom themes and plugins to complete e-commerce platforms with payment system integrations.',
    services: [
      'Custom WordPress theme development',
      'Plugin creation & customization',
      'E-commerce implementations',
      'Payment system integrations',
      'Performance optimization',
      'SEO & content strategy'
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
