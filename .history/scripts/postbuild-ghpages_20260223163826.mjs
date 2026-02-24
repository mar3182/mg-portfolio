/**
 * Post-build script for GitHub Pages SPA support
 * - Copies 404.html to dist/ for SPA client-side redirect
 * - Injects SPA redirect handler script into dist/index.html
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '..', 'dist')
const indexPath = resolve(distDir, 'index.html')

// 1. Create 404.html
const notFoundHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting…</title>
    <script>
      // SPA redirect for GitHub Pages
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>Redirecting&hellip;</body>
</html>`

writeFileSync(resolve(distDir, '404.html'), notFoundHtml)
console.log('[gh-pages] Created 404.html')

// 2. Inject SPA redirect handler into index.html
if (existsSync(indexPath)) {
  let html = readFileSync(indexPath, 'utf-8')
  
  const spaScript = `
    <!-- SPA redirect handler for GitHub Pages 404.html -->
    <script>
      (function(l) {
        if (l.search[1] === '/') {
          var decoded = l.search.slice(1).split('&').map(function(s) {
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location))
    </script>`
  
  // Insert the script right after <body> tag
  html = html.replace('<body>', '<body>' + spaScript)
  writeFileSync(indexPath, html)
  console.log('[gh-pages] Injected SPA redirect handler into index.html')
}
