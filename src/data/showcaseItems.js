/**
 * Showcase Items with T-Shaped Spectrum Scores
 * 
 * Each project has a spectrum score indicating the balance of:
 * - design: Visual/creative aspects (0-100)
 * - tech: Technical/engineering aspects (0-100)
 * 
 * This helps users understand the nature of each project
 * and filter based on their interests.
 */

export const showcaseItems = [
  {
    id: 'studio-identity',
    title: 'Studio Identity',
    year: 2025,
    description: 'A cohesive visual + motion system for a forward creative studio.',
    color: '#e2d5c7',
    categories: ['strategy','design'],
    // T-Shaped Spectrum: Design-heavy brand project
    spectrum: { design: 95, tech: 25 },
    skills: {
      design: ['Brand Identity', 'Motion Design', 'Typography', 'Color Theory'],
      tech: ['After Effects', 'Figma']
    },
    details: {
      scope: 'Brand Identity, Motion Graphics, Guidelines',
      technologies: ['After Effects', 'Figma', 'Cinema 4D'],
      features: [
        'Dynamic logo system with 12 variations',
        'Modular motion library for all touchpoints',
        'Comprehensive brand guidelines with usage examples',
        'Adaptive color system for different contexts',
        'Typography hierarchy with custom typeface pairing'
      ],
      outcome: 'Delivered a flexible identity system that scales across digital and print media while maintaining brand consistency.'
    }
  },
  {
    id: 'immersive-commerce',
    title: 'Immersive Commerce',
    year: 2024,
    description: 'Narrative product drops with frictionless checkout and realtime ambience.',
    color: '#d0dde8',
    categories: ['frontend','integration','design'],
    // T-Shaped Spectrum: Balanced design + tech
    spectrum: { design: 70, tech: 85 },
    skills: {
      design: ['UX Design', '3D Visualization', 'Interaction Design'],
      tech: ['Three.js', 'WebGL', 'Stripe API', 'Node.js', 'React']
    },
    details: {
      scope: 'E-commerce Platform, 3D Experience, Payment Integration',
      technologies: ['Three.js', 'WebGL', 'Stripe API', 'Node.js'],
      features: [
        'Real-time 3D product visualization with physics',
        'Dynamic ambient soundscapes that respond to user behavior',
        'One-click checkout with saved payment preferences',
        'Storytelling sequences that guide purchase decisions',
        'Social sharing with custom AR filters'
      ],
      outcome: 'Achieved 340% increase in conversion rates and 89% customer satisfaction through immersive shopping experiences.'
    }
  },
  {
    id: 'interactive-installation',
    title: 'Interactive Installation',
    year: 2025,
    description: 'Spatial web + physical sensor fusion for a cultural pavilion.',
    color: '#d7e3d7',
    categories: ['frontend','integration'],
    // T-Shaped Spectrum: Tech-heavy with creative output
    spectrum: { design: 55, tech: 95 },
    skills: {
      design: ['Spatial Design', 'Generative Art', 'Experience Design'],
      tech: ['WebXR', 'Arduino', 'OSC Protocol', 'TouchDesigner', 'Computer Vision']
    },
    details: {
      scope: 'Interactive Installation, Sensor Integration, Real-time Visuals',
      technologies: ['WebXR', 'Arduino', 'OSC Protocol', 'TouchDesigner'],
      features: [
        'Motion tracking with computer vision algorithms',
        'Responsive particle systems based on visitor movement',
        'Multi-user collaborative interactions',
        'Real-time audio synthesis triggered by proximity',
        'Data visualization of collective visitor patterns'
      ],
      outcome: 'Successfully installed at MoMA with over 50,000 interactions recorded and featured in digital arts exhibitions.'
    }
  },
  {
    id: 'generative-campaign',
    title: 'Generative Campaign',
    year: 2024,
    description: 'Adaptive graphics pipeline powering a multi-market launch experience.',
    color: '#e3d7e1',
    categories: ['strategy','design','frontend'],
    // T-Shaped Spectrum: Strong balance of both
    spectrum: { design: 80, tech: 75 },
    skills: {
      design: ['Campaign Design', 'Generative Graphics', 'Visual Systems'],
      tech: ['P5.js', 'ML5.js', 'Adobe SDK', 'GraphQL', 'AI/ML']
    },
    details: {
      scope: 'Campaign System, Generative Graphics, Multi-platform Deployment',
      technologies: ['P5.js', 'ML5.js', 'Adobe SDK', 'GraphQL'],
      features: [
        'AI-powered content generation for 15+ markets',
        'Real-time adaptation based on performance metrics',
        'Automated asset creation in multiple formats',
        'Cultural sensitivity analysis for global markets',
        'A/B testing framework for creative optimization'
      ],
      outcome: 'Generated 2.3M unique creative variants across markets with 67% improvement in engagement rates.'
    }
  },
  {
    id: 'decentralized-freelancer-platform',
    title: 'Decentralized Freelancer Platform',
    year: 2025,
    description: 'Innovative freelancer marketplace with educational rewards system and transparent skill verification.',
    color: '#e8f4f8',
    categories: ['blockchain','frontend','platform'],
    // T-Shaped Spectrum: Heavy tech with UX focus
    spectrum: { design: 45, tech: 95 },
    skills: {
      design: ['UX Design', 'Dashboard Design', 'Information Architecture'],
      tech: ['React', 'Solidity', 'Web3.js', 'IPFS', 'Node.js', 'Smart Contracts']
    },
    details: {
      scope: 'Freelancer Platform, Smart Contracts, Educational System',
      technologies: ['React', 'Solidity', 'Web3.js', 'IPFS', 'Node.js'],
      features: [
        'Decentralized job matching without intermediary fees',
        'Educational points system with verified skill certifications',
        'Smart contract escrow for secure payment processing',
        'Transparent reputation system based on completed projects',
        'Learning modules integrated with real project opportunities'
      ],
      outcome: 'Platform connecting 1,200+ freelancers with fair compensation and skill development opportunities.'
    }
  }
]
