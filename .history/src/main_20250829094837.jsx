import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Global stylesheet & motion library deferred to reduce render-blocking for initial LCP.
// import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

const rootEl = document.getElementById('root')
createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

// After first frame, inject stylesheet; use requestIdleCallback fallback.
function loadStyles() {
  if (document.getElementById('deferred-global-css')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/src/akaru-styles.css'
  link.id = 'deferred-global-css'
  document.head.appendChild(link)
}

if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(loadStyles, { timeout: 1200 })
} else {
  setTimeout(loadStyles, 1)
}

// Lazy hydrate motion-based enhancements (optional progressive enhancement) after styles.
async function enhanceMotion() {
  try {
    const [{ motion: Motion }, variants] = await Promise.all([
      import('framer-motion'),
      import('./lib/motion')
    ])
    // Example future enhancement hook; currently no-op to avoid re-render cost.
    // Could re-render hero with animated spans once loaded.
  } catch (e) {
    // Silently ignore; motion not critical.
  }
}

// Schedule motion after interaction or idle to prioritize input readiness
window.addEventListener('pointerdown', enhanceMotion, { once: true })
if (typeof requestIdleCallback === 'function') requestIdleCallback(enhanceMotion, { timeout: 4000 })
else setTimeout(enhanceMotion, 4000)
