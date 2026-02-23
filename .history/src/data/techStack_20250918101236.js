// Ordered technology stack list used for stacking visualization
// Each entry can later hold category or icon metadata if desired
export const techStack = [
  'PHP',
  'Python',
  'SQL',
  'REST APIs',
  'HTML',
  'CSS',
  'JavaScript',
  'RDBMS (MySQL)',
  'NoSQL',
  'React',
  'Next.js',
  'Git',
  'Docker',
  'AI / ML'
].map((label, i) => ({ id: label.toLowerCase().replace(/[^a-z0-9]+/g,'-'), label, index: i }))

export default techStack