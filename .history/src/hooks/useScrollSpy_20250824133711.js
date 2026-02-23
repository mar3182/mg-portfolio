import { useEffect, useState } from 'react'

// Simple scroll spy using IntersectionObserver
export function useScrollSpy(ids = [], options = {}) {
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    const elements = ids
      .map(id => document.getElementById(id))
      .filter(Boolean)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // entries sorted by intersection ratio descending
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length) {
          setActiveId(visible[0].target.id)
        } else {
          // fallback: pick the earliest element above viewport
          let current = null
          for (const el of elements) {
            const rect = el.getBoundingClientRect()
            if (rect.top <= 80) current = el.id
          }
          if (current) setActiveId(current)
        }
      },
      { root: null, rootMargin: '0px 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1], ...options }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, options.rootMargin, options.threshold])

  return activeId
}
