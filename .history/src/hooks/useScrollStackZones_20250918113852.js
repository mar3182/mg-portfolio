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
  removeDelay = 180,
  enableScrollDirection = true,
  minimalScrollActivate = 24 // px scrolled from very top to allow early activation
} = {}) {
  useEffect(() => {
    const zones = Array.from(document.querySelectorAll(`[${attr}]`))
    if (!zones.length) return

    let activeCount = 0
    let removeTimer = null
    let lastScrollY = window.scrollY
    let earlyActivated = false

    // Backwards compat: if thresholdRatio provided, override both
    const enterT = typeof thresholdRatio === 'number' ? thresholdRatio : enterRatio
    const exitT = typeof thresholdRatio === 'number' ? thresholdRatio : exitRatio

    const handleActivate = () => {
      if (!document.body.classList.contains('stacking-ready')) return
      if (!document.body.classList.contains(bodyClass)) {
        document.body.classList.remove('showcase-card-unhover')
        document.body.classList.add(bodyClass)
      }
    }

    const handleDeactivate = () => {
      if (!document.body.classList.contains(bodyClass)) return
      document.body.classList.add('showcase-card-unhover')
      if (removeTimer) clearTimeout(removeTimer)
      removeTimer = setTimeout(() => {
        if (!document.body.classList.contains(bodyClass)) return
        // If no zones re-activated, remove classes
        if (activeCount === 0) {
          document.body.classList.remove(bodyClass)
          document.body.classList.remove('showcase-card-unhover')
        }
      }, removeDelay)
    }

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
            handleActivate()
          }
        } else if (!nowActive && wasActive) {
          entry.target.__stackActive = false
          activeCount = Math.max(0, activeCount - 1)
          if (activeCount === 0) {
            handleDeactivate()
          }
        }
      })
    }, { threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9, 1] })

    zones.forEach(z => observer.observe(z))

    // Scroll direction + early activation logic
    const onScroll = () => {
      const y = window.scrollY
      const directionDown = y > lastScrollY
      lastScrollY = y
      if (!document.body.classList.contains('stacking-ready')) return

      // Early activation when user starts scrolling down a tiny bit from top
      if (!earlyActivated && y > 0 && y < minimalScrollActivate && directionDown) {
        earlyActivated = true
        handleActivate()
      }

      // If near top and scrolling upward: ensure reverse animation
      if (y < 4 && !directionDown) {
        // Force deactivate immediately
        activeCount = 0
        handleDeactivate()
      }
    }

    if (enableScrollDirection) {
      window.addEventListener('scroll', onScroll, { passive: true })
    }

    return () => {
      observer.disconnect()
      if (removeTimer) clearTimeout(removeTimer)
      if (enableScrollDirection) window.removeEventListener('scroll', onScroll)
      document.body.classList.remove(bodyClass)
    }
  }, [attr, bodyClass, thresholdRatio, enterRatio, exitRatio, removeDelay, enableScrollDirection, minimalScrollActivate])
}

export default useScrollStackZones