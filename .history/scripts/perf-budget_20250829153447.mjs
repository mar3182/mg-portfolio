#!/usr/bin/env node
/**
 * Performance Budget Check
 * Budgets (gzip unless noted):
 *  - Main entry JS <= 120 KB
 *  - Total initial JS (entry + modulepreload) <= 170 KB
 *  - Inline critical CSS (raw) <= 8 KB
 *  - Deferred main CSS (gzip) <= 30 KB
 * Exits non-zero if any budget violated (unless BUDGET_SKIP=1).
 * These thresholds are calibrated off current build to leave modest headroom & catch regressions.
 */
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { fileURLToPath } from 'url'

if (process.env.BUDGET_SKIP === '1') {
  console.log('[perf-budget] Skipped (BUDGET_SKIP=1)')
  process.exit(0)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')

function gzipSize(buf) { return zlib.gzipSync(buf).length }
function read(file) { return fs.readFileSync(file) }

// Load budgets from JSON file if present (allows ratcheting persistence)
const budgetsFile = path.join(projectRoot, 'perf-budgets.json')
let budgets
if (fs.existsSync(budgetsFile)) {
  try {
    budgets = JSON.parse(fs.readFileSync(budgetsFile, 'utf-8'))
  } catch (e) {
    console.warn('[perf-budget] Failed to parse perf-budgets.json, using defaults:', e.message)
  }
}
if (!budgets) {
  budgets = {
    mainJsGzip: 120 * 1024,
    totalInitialJsGzip: 170 * 1024,
    inlineCriticalCssRaw: 8 * 1024,
    deferredCssGzip: 30 * 1024,
  }
}

const report = []
let violations = 0

function logResult(label, size, limit, type) {
  const ok = size <= limit
  report.push({ label, size, limit, pass: ok, type })
  if (!ok) violations++
}

// 1. Parse dist/index.html
const indexHtmlPath = path.join(distDir, 'index.html')
if (!fs.existsSync(indexHtmlPath)) {
  console.error('[perf-budget] dist/index.html not found. Build first.')
  process.exit(1)
}
const html = read(indexHtmlPath).toString()

// Inline critical CSS: take first <style>...</style> block (our critical subset)
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/)
if (styleMatch) {
  const inlineCss = styleMatch[1]
  logResult('inline-critical-css (raw)', Buffer.byteLength(inlineCss), budgets.inlineCriticalCssRaw, 'raw')
} else {
  console.warn('[perf-budget] No inline <style> block found; skipping critical CSS budget')
}

// Main entry JS: first <script type="module" src="/assets/xxx.js">
let mainJsGzipSize = null
const scriptMatch = html.match(/<script type="module"[^>]*src="(\/assets\/[^"]+\.js)"/)
if (scriptMatch) {
  const jsRel = scriptMatch[1]
  const jsPath = path.join(distDir, jsRel.replace(/^\//, ''))
  if (fs.existsSync(jsPath)) {
    const jsBuf = read(jsPath)
    mainJsGzipSize = gzipSize(jsBuf)
    logResult('main-entry-js (gzip)', mainJsGzipSize, budgets.mainJsGzip, 'gzip')
  } else {
    console.warn('[perf-budget] Main JS not found at', jsPath)
  }
} else {
  console.warn('[perf-budget] Could not locate main entry <script> tag')
}

// Collect modulepreload JS assets for total initial JS calculation
let totalInitialJs = null
if (mainJsGzipSize != null) {
  totalInitialJs = mainJsGzipSize
  const preloadMatches = [...html.matchAll(/<link rel="modulepreload"[^>]*href="(\/assets\/[^"]+\.js)"/g)].map(m => m[1])
  for (const rel of preloadMatches) {
    const p = path.join(distDir, rel.replace(/^\//, ''))
    if (fs.existsSync(p)) totalInitialJs += gzipSize(read(p))
  }
  logResult('total-initial-js (gzip)', totalInitialJs, budgets.totalInitialJsGzip, 'gzip')
}

// Deferred CSS: look for preload link to css file
let deferredCssGzipSize = null
const cssMatch = html.match(/<link rel="preload"[^>]*href="(\/assets\/[^"]+\.css)"/)
if (cssMatch) {
  const cssRel = cssMatch[1]
  const cssPath = path.join(distDir, cssRel.replace(/^\//, ''))
  if (fs.existsSync(cssPath)) {
    const cssBuf = read(cssPath)
    deferredCssGzipSize = gzipSize(cssBuf)
    logResult('deferred-main-css (gzip)', deferredCssGzipSize, budgets.deferredCssGzip, 'gzip')
  }
}

// Print report
console.log('\nPerformance Budget Report:')
for (const r of report) {
  const pct = ((r.size / r.limit) * 100).toFixed(1)
  console.log(` - ${r.label}: ${r.size} B (${pct}% of limit ${r.limit} B) ${r.pass ? '✓' : '✗'}`)
}

// Emit JSON report for trend tracking
try {
  const json = {
    timestamp: new Date().toISOString(),
    budgets,
    results: report,
  }
  fs.writeFileSync(path.join(distDir, 'perf-budget-report.json'), JSON.stringify(json, null, 2))
  console.log('\n[perf-budget] Wrote perf-budget-report.json')
} catch (e) {
  console.warn('[perf-budget] Failed to write JSON report:', e.message)
}

// Optional ratcheting: tighten budgets when comfortably below threshold.
// Enable with PERF_RATCHET=1 (only recommended on protected branches after review).
if (process.env.PERF_RATCHET === '1') {
  const RATIO_TRIGGER = 0.9        // if size < 90% of limit
  const MIN_HEADROOM_FACTOR = 1.05 // keep 5% spare above current size
  const MIN_ABSOLUTE_HEADROOM = 512 // bytes
  let changed = false
  for (const r of report) {
    if (!r.pass) continue
    // Only ratchet if meaningfully under budget
    if (r.size / r.limit < RATIO_TRIGGER) {
      const newLimit = Math.max(
        Math.ceil(r.size * MIN_HEADROOM_FACTOR),
        r.size + MIN_ABSOLUTE_HEADROOM
      )
      if (newLimit < r.limit) {
        budgets[ labelKey(r.label) ] = newLimit
        console.log(`[perf-budget] Ratcheting ${r.label} limit from ${r.limit} -> ${newLimit}`)
        changed = true
      }
    }
  }
  if (changed) {
    try {
      fs.writeFileSync(budgetsFile, JSON.stringify(budgets, null, 2))
      console.log('[perf-budget] Updated perf-budgets.json with ratcheted limits.')
    } catch (e) {
      console.warn('[perf-budget] Failed to write perf-budgets.json:', e.message)
    }
  } else {
    console.log('[perf-budget] Ratcheting: no changes (either not enabled or no metrics sufficiently below thresholds).')
  }
}

function labelKey(label) {
  // Map human label back to budgets key naming
  if (label.startsWith('main-entry-js')) return 'mainJsGzip'
  if (label.startsWith('total-initial-js')) return 'totalInitialJsGzip'
  if (label.startsWith('inline-critical-css')) return 'inlineCriticalCssRaw'
  if (label.startsWith('deferred-main-css')) return 'deferredCssGzip'
  return label.replace(/[^a-zA-Z0-9]/g,'')
}

if (violations) {
  console.error(`\n[perf-budget] FAILED: ${violations} budget violation(s).`)
  process.exit(1)
} else {
  console.log('\n[perf-budget] All budgets within limits.')
}
