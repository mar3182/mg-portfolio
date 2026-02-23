// Centralized Framer Motion variants
export const heroContainer = {
  hidden: {},
  visible: (stagger = 0.03) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.1 }
  })
}

export const heroLetter = {
  hidden: { y: 80, opacity: 0, rotate: 4 },
  visible: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 500, damping: 32 }
  }
}

export const heroPanel = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } }
}
