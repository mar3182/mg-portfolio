#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { projects } from '../src/data/projects.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PUBLIC_DIR = path.resolve(__dirname, '../public')
const missing = []
for(const p of projects){
  const base = p.base
  for(const w of [400,600,800,1200]){
    for(const ext of ['jpg','webp','avif']){
      const rel = `/projects/${base}-${w}.${ext}`
      const full = path.join(PUBLIC_DIR, rel)
      if(!fs.existsSync(full)) missing.push(rel)
    }
  }
}
if(missing.length){
  console.error('[verify-images] Missing optimized assets:\n'+ missing.map(m=>' - '+m).join('\n'))
  process.exit(1)
}
console.log('[verify-images] All expected project images present.')
