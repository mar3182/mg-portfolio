// Lightweight Web Vitals hook with pluggable reporter.
// Usage: useWebVitals({ onReport: metric => {...} })
// Metrics collected: CLS, LCP, INP (new FID), FCP, TTFB.
// Each report shape: { name, id, value, delta, rating, navigationType, attribution?, timestamp }

import { useEffect, useRef } from 'react'

/**
 * Default console reporter with collapsed grouping & basic coloring.
 */
function defaultReporter(metric) {
  // Store globally for later inspection (e.g., window.__WEB_VITALS__)
  if (!window.__WEB_VITALS__) window.__WEB_VITALS__ = []
  window.__WEB_VITALS__.push(metric)

  const color = metric.rating === 'good' ? 'color:#16a34a' : metric.rating === 'needs-improvement' ? 'color:#d97706' : 'color:#dc2626'
  console.log(`%cWEB VITAL %c${metric.name}%c ${metric.value.toFixed(2)} (${metric.rating})`, 'background:#111;color:#fff;padding:2px 4px;border-radius:3px', 'background:#334155;color:#fff;padding:2px 6px;border-radius:3px', color)
}

/**
 * useWebVitals
 * @param {Object} opts
 * @param {(metric: object)=>void} [opts.onReport] custom reporter callback
 * @param {boolean} [opts.enabled] force enable/disable (defaults true in browser)
 */
export function useWebVitals({ onReport, enabled = true } = {}) {
  const reportedIds = useRef(new Set())

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Ensure subscriber registry exists
    window.__WEB_VITALS_SUBSCRIBERS__ = window.__WEB_VITALS_SUBSCRIBERS__ || []
    const subscriber = (metric) => {
      // De-dupe non-CLS repeats
      if (reportedIds.current.has(metric.id) && metric.name !== 'CLS') return
      if (metric.name !== 'CLS') reportedIds.current.add(metric.id)
      try {
        (onReport || defaultReporter)(metric)
      } catch (err) {
        console.error('WebVitals report error', err)
      }
    }
    window.__WEB_VITALS_SUBSCRIBERS__.push(subscriber)

    // Initialize underlying collection once
    if (!window.__WEB_VITALS_INIT__) {
      window.__WEB_VITALS_INIT__ = true
      import('web-vitals').then(mod => {
        const { onCLS, onINP, onLCP, onFCP, onTTFB } = mod
        const fanout = (metric) => {
          const enriched = {
            ...metric,
            navigationType: performance?.getEntriesByType?.('navigation')?.[0]?.type,
            timestamp: Date.now()
          }
          window.__WEB_VITALS_SUBSCRIBERS__.forEach(fn => fn(enriched))
        }
        onCLS(fanout)
        onINP(fanout)
        onLCP(fanout)
        onFCP(fanout)
        onTTFB(fanout)
      }).catch(err => console.warn('web-vitals import failed', err))
    }

    return () => {
      const list = window.__WEB_VITALS_SUBSCRIBERS__
      if (list) {
        const idx = list.indexOf(subscriber)
        if (idx >= 0) list.splice(idx, 1)
      }
    }
  }, [onReport, enabled])
}

/** Convenience helper for manual one-off collection (promise). */
export async function collectWebVitalsOnce() {
  const mod = await import('web-vitals')
  const metrics = []
  const push = m => metrics.push(m)
  mod.onCLS(push)
  mod.onINP(push)
  mod.onLCP(push)
  mod.onFCP(push)
  mod.onTTFB(push)
  // Allow a short delay for late metrics (e.g., LCP after images)
  await new Promise(r => setTimeout(r, 4000))
  return metrics
}
