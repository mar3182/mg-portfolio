// Detailed technical skills and proficiency levels
export const technicalSkills = {
  languages: [
    { name: 'PHP', level: 'Expert', years: 11, description: 'Backend development, custom applications, WordPress' },
    { name: 'Python', level: 'Advanced', years: 3, description: 'Data engineering, AI integration, automation scripts' },
    { name: 'JavaScript', level: 'Expert', years: 10, description: 'Frontend development, React, Node.js, ES6+' },
    { name: 'HTML5', level: 'Expert', years: 11, description: 'Semantic markup, accessibility, modern standards' },
    { name: 'CSS3', level: 'Expert', years: 11, description: 'Responsive design, animations, modern layouts' },
    { name: 'SQL', level: 'Advanced', years: 9, description: 'Database design, optimization, complex queries' }
  ],
  
  frameworks: [
    { name: 'React', level: 'Advanced', years: 4, description: 'Component architecture, hooks, state management' },
    { name: 'WordPress', level: 'Expert', years: 10, description: 'Custom themes, plugins, multisite, optimization' },
    { name: 'Next.js', level: 'Intermediate', years: 2, description: 'SSR, static generation, full-stack React apps' },
    { name: 'Vite', level: 'Advanced', years: 2, description: 'Build optimization, development experience' }
  ],
  
  databases: [
    { name: 'MySQL', level: 'Advanced', years: 9, description: 'Relational database design, optimization, scaling' },
    { name: 'Vector Databases', level: 'Intermediate', years: 1, description: 'AI/ML applications, similarity search' },
    { name: 'NoSQL Concepts', level: 'Intermediate', years: 2, description: 'Document stores, key-value databases' }
  ],
  
  technologies: [
    { name: 'REST APIs', level: 'Expert', years: 8, description: 'Design, development, documentation, versioning' },
    { name: 'Microservices', level: 'Advanced', years: 2, description: 'Architecture, event-driven design, scaling' },
    { name: 'Docker', level: 'Intermediate', years: 2, description: 'Containerization, development environments' },
    { name: 'Git', level: 'Advanced', years: 8, description: 'Version control, branching strategies, collaboration' },
    { name: 'RAG Systems', level: 'Intermediate', years: 1, description: 'Retrieval-augmented generation, AI integration' },
    { name: 'Knowledge Graphs', level: 'Intermediate', years: 1, description: 'Data modeling, semantic relationships' }
  ],
  
  specializations: [
    { name: 'E-commerce Development', level: 'Expert', years: 7, description: 'Payment integration, inventory management, user experience' },
    { name: 'Performance Optimization', level: 'Advanced', years: 6, description: 'Load times, caching strategies, database optimization' },
    { name: 'SEO Implementation', level: 'Advanced', years: 8, description: 'Technical SEO, site structure, performance metrics' },
    { name: 'AI Integration', level: 'Intermediate', years: 2, description: 'Machine learning APIs, data processing, intelligent features' },
    { name: 'Event-Driven Architecture', level: 'Intermediate', years: 2, description: 'Asynchronous systems, scalability patterns' },
    { name: 'Domain-Driven Design', level: 'Intermediate', years: 2, description: 'Architecture patterns, business logic modeling' }
  ],
  
  tools: [
    { name: 'VS Code', level: 'Expert', years: 5, description: 'Development environment, extensions, productivity' },
    { name: 'Photoshop', level: 'Advanced', years: 12, description: 'Image editing, web graphics, design assets' },
    { name: 'Illustrator', level: 'Advanced', years: 10, description: 'Vector graphics, logo design, illustrations' },
    { name: 'Browser DevTools', level: 'Advanced', years: 9, description: 'Debugging, performance analysis, testing' },
    { name: 'Postman', level: 'Advanced', years: 5, description: 'API testing, documentation, automation' }
  ]
}

export const certifications = [
  {
    title: 'Introduction to Computer Science',
    provider: 'Harvard University (CS50)',
    year: 2020,
    type: 'Computer Science Fundamentals'
  },
  {
    title: 'Python for Data Science and AI',
    provider: 'IBM via Coursera',
    year: 2025,
    type: 'Data Science & AI'
  },
  {
    title: 'Introduction to Data Engineering',
    provider: 'IBM via Coursera',
    year: 2025,
    type: 'Data Engineering'
  },
  {
    title: 'Blockchain Technologies',
    provider: 'MIT',
    year: 2021,
    type: 'Emerging Technologies'
  },
  {
    title: 'Databases and SQL for Data Science',
    provider: 'IBM via Coursera',
    year: 2025,
    type: 'Database Management'
  },
  {
    title: 'Web Development Bootcamp',
    provider: 'Udemy',
    year: 2021,
    type: 'Full Stack Development'
  }
]

export const languages = [
  { name: 'Spanish', level: 'Native', description: 'Mother tongue' },
  { name: 'Dutch', level: 'Fluent', description: 'Professional working proficiency' },
  { name: 'English', level: 'Fluent', description: 'Professional working proficiency' }
]

export function getSkillsByCategory(category) {
  return technicalSkills[category] || []
}

export function getAllSkillCategories() {
  return Object.keys(technicalSkills)
}