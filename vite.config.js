import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

// Reconstruct lost Vite config (file had become empty) with original behavior:
// - Tailwind + React
// - Defer non‑critical CSS via preload+swap
// - Priority hints for critical font + main entry JS
// - Manual chunk splitting (react, framer-motion) to keep main bundle under budget

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Use Vite's env exposure; fallback to empty string if undefined
const envAnalyze = (import.meta?.env?.ANALYZE || '').toString().toLowerCase()
const analyzeFlag = envAnalyze === '1' || envAnalyze === 'true'

export default defineConfig(async () => {
  const cssDeferPlugin = {
    name: 'defer-non-critical-css',
    transformIndexHtml(html) {
      // 1. Convert blocking stylesheet links (except fonts.css) to preload+swap
      html = html.replace(/<link[^>]+rel="stylesheet"[^>]+href="(\/assets\/[^"']+\.css)"[^>]*>/g, (full, href) => {
        if (/fonts\.css$/.test(href)) return full
        return `<!-- deferred css -->\n<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'">\n<noscript><link rel="stylesheet" href="${href}"></noscript>`
      })

      // 2. Add fetchpriority=high to font preload(s)
      html = html.replace(/<link([^>]+)rel="preload"([^>]+)as="font"([^>]*)>/g, '<link$1rel="preload"$2as="font" fetchpriority="high"$3>')

      // 3. Add fetchpriority=high to main entry script (keep pattern flexible)
  html = html.replace(/<script([^>]+)src="(\/assets\/index-[^"]+\.js)"([^>]*)><\/script>/g, '<script$1src="$2" fetchpriority="high"$3></script>')

      return html
    },
  }

  const plugins = [react(), tailwindcss(), cssDeferPlugin]

  if (analyzeFlag) {
    try {
      const { visualizer } = await import('rollup-plugin-visualizer')
      plugins.push(visualizer({ filename: 'dist/stats.html', open: false, gzipSize: true, brotliSize: true }))
    } catch {
      console.warn('[analyze] rollup-plugin-visualizer not installed.')
    }
  }

  return {
    // GitHub Pages serves from /mg-portfolio/ subdirectory
    base: '/mg-portfolio/',
    plugins,
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    build: {
      // Keep determinism & chunk boundaries stable for perf budgets.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'react'
              if (id.includes('framer-motion')) return 'motion'
            }
          },
        },
      },
    },
  }
})
