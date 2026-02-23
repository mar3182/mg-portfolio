import { useEffect } from 'react'

/**
 * Scroll-based activation of stacking effect.
 * Any element with data-stack-zone attribute becomes an activation zone.
 * When at least one zone is ≥40% visible, the provided body class is applied.
 * Class is removed when no zones remain active.
 */
export function useScrollStackZones({ bodyClass = 'showcase-card-hovered', attr = 'data-stack-zone', thresholdRatio = 0.4 } = {}) {
  useEffect(() => {
    const zones = Array.from(document.querySelectorAll(`[${attr}]`))
    if (!zones.length) return

    let activeCount = 0

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasActive = !!entry.target.__stackActive
        const nowActive = entry.intersectionRatio >= thresholdRatio
        if (nowActive && !wasActive) {
          entry.target.__stackActive = true
          activeCount++
          if (activeCount === 1) document.body.classList.add(bodyClass)
        } else if (!nowActive && wasActive) {
          entry.target.__stackActive = false
          activeCount = Math.max(0, activeCount - 1)
          if (activeCount === 0) document.body.classList.remove(bodyClass)
        }
      })
    }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] })

    zones.forEach(z => observer.observe(z))

    return () => {
      observer.disconnect()
      document.body.classList.remove(bodyClass)
    }
  }, [attr, bodyClass, thresholdRatio])
}

export default useScrollStackZones