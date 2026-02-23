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
  // eslint-disable-next-line no-console
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
    // Guard against double init (Fast Refresh / multiple roots)
    if (window.__WEB_VITALS_INIT__) return
    window.__WEB_VITALS_INIT__ = true

    let cancelled = false

    import('web-vitals').then(mod => {
      if (cancelled) return
      const { onCLS, onINP, onLCP, onFCP, onTTFB } = mod
      const handler = (metric) => {
        // De-dupe (web-vitals may emit updates; keep last by id+name but still allow delta)
        if (reportedIds.current.has(metric.id) && metric.name !== 'CLS') {
          // For CLS multiple updates expected; allow them all
          return
        }
        if (metric.name !== 'CLS') reportedIds.current.add(metric.id)
        const enriched = {
          ...metric,
            navigationType: performance?.getEntriesByType?.('navigation')?.[0]?.type,
            timestamp: Date.now(),
          // Some builds provide attribution (INP, LCP) under metric.attribution
        }
        try {
          (onReport || defaultReporter)(enriched)
        } catch(err) {
          // eslint-disable-next-line no-console
          console.error('WebVitals report error', err)
        }
      }

      // Register listeners
      onCLS(handler)
      onINP(handler)
      onLCP(handler)
      onFCP(handler)
      onTTFB(handler)
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.warn('web-vitals import failed', err)
    })

    return () => { cancelled = true }
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
