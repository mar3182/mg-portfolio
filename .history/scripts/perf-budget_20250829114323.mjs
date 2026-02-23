#!/usr/bin/env node
/**
 * Performance Budget Check
 * Budgets (gzip):
 *  - Main entry JS <= 180 KB
 *  - Inline critical CSS (raw) <= 8 KB
 *  - Deferred main CSS (gzip) <= 50 KB (initial target; adjust as we trim)
 * Exits non-zero if any budget violated (unless BUDGET_SKIP=1).
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

const budgets = {
  mainJsGzip: 180 * 1024,
  inlineCriticalCssRaw: 8 * 1024,
  deferredCssGzip: 50 * 1024,
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
const scriptMatch = html.match(/<script type="module"[^>]*src="(\/assets\/[^"]+\.js)"/)
if (scriptMatch) {
  const jsRel = scriptMatch[1]
  const jsPath = path.join(distDir, jsRel.replace(/^\//, ''))
  if (fs.existsSync(jsPath)) {
    const jsBuf = read(jsPath)
    logResult('main-entry-js (gzip)', gzipSize(jsBuf), budgets.mainJsGzip, 'gzip')
  } else {
    console.warn('[perf-budget] Main JS not found at', jsPath)
  }
} else {
  console.warn('[perf-budget] Could not locate main entry <script> tag')
}

// Deferred CSS: look for preload link to css file
const cssMatch = html.match(/<link rel="preload"[^>]*href="(\/assets\/[^"]+\.css)"/)
if (cssMatch) {
  const cssRel = cssMatch[1]
  const cssPath = path.join(distDir, cssRel.replace(/^\//, ''))
  if (fs.existsSync(cssPath)) {
    const cssBuf = read(cssPath)
    logResult('deferred-main-css (gzip)', gzipSize(cssBuf), budgets.deferredCssGzip, 'gzip')
  }
}

// Print report
console.log('\nPerformance Budget Report:')
for (const r of report) {
  const pct = ((r.size / r.limit) * 100).toFixed(1)
  console.log(` - ${r.label}: ${r.size} B (${pct}% of limit ${r.limit} B) ${r.pass ? '✓' : '✗'}`)
}

if (violations) {
  console.error(`\n[perf-budget] FAILED: ${violations} budget violation(s).`)
  process.exit(1)
} else {
  console.log('\n[perf-budget] All budgets within limits.')
}
