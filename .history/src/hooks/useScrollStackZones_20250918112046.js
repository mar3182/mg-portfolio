import { useEffect } from 'react'

/**
 * Scroll-based activation of stacking effect.
 * Any element with data-stack-zone attribute becomes an activation zone.
 * When at least one zone is ≥40% visible, the provided body class is applied.
 * Class is removed when no zones remain active.
 */
export function useScrollStackZones({ 
  bodyClass = 'showcase-card-hovered', 
  attr = 'data-stack-zone', 
  thresholdRatio, // legacy single threshold
  enterRatio = 0.4,
  exitRatio = 0.25,
  removeDelay = 180
} = {}) {
  useEffect(() => {
    const zones = Array.from(document.querySelectorAll(`[${attr}]`))
    if (!zones.length) return

    let activeCount = 0
    let removeTimer = null

    // Backwards compat: if thresholdRatio provided, override both
    const enterT = typeof thresholdRatio === 'number' ? thresholdRatio : enterRatio
    const exitT = typeof thresholdRatio === 'number' ? thresholdRatio : exitRatio

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasActive = !!entry.target.__stackActive
        const ratio = entry.intersectionRatio
        const nowActive = wasActive ? ratio >= exitT : ratio >= enterT
        if (nowActive && !wasActive) {
          entry.target.__stackActive = true
          activeCount++
          if (activeCount === 1) {
            if (removeTimer) { clearTimeout(removeTimer); removeTimer = null }
            if (!document.body.classList.contains('stacking-ready')) {
              // Only allow stacking after user interaction (scroll/move) to avoid initial jarring state
              return
            }
            document.body.classList.add(bodyClass)
          }
        } else if (!nowActive && wasActive) {
          entry.target.__stackActive = false
          activeCount = Math.max(0, activeCount - 1)
          if (activeCount === 0) {
            // Add reverse animation class for staggered exit
            document.body.classList.add('showcase-card-unhover')
            if (removeTimer) clearTimeout(removeTimer)
            removeTimer = setTimeout(() => {
              if (activeCount === 0) {
                document.body.classList.remove(bodyClass)
                document.body.classList.remove('showcase-card-unhover')
              }
            }, removeDelay)
          }
        }
      })
    }, { threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9, 1] })

    zones.forEach(z => observer.observe(z))

    return () => {
      observer.disconnect()
      if (removeTimer) clearTimeout(removeTimer)
      document.body.classList.remove(bodyClass)
    }
  }, [attr, bodyClass, thresholdRatio, enterRatio, exitRatio, removeDelay])
}

export default useScrollStackZones