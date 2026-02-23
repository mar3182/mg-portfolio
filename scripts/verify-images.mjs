#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { projects } from '../src/data/projects.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PUBLIC_DIR = path.resolve(__dirname, '../public')
if(process.env.CI_SKIP_IMAGE_VERIFY === '1'){
  console.log('[verify-images] Skipped via CI_SKIP_IMAGE_VERIFY=1')
  process.exit(0)
}

const manifestPath = path.resolve(__dirname, '../src/data/projectImageManifest.json')
if(!fs.existsSync(manifestPath)){
  console.error('[verify-images] Missing manifest file. Run: pnpm optimize:images')
  process.exit(1)
}
const manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8'))
let missing = []
for(const p of projects){
  const base = p.base
  const entry = manifest[base]
  if(!entry){ missing.push(`manifest entry for ${base}`); continue }
  for(const w of [400,600,800,1200]){
    for(const ext of ['jpg','webp','avif']){
      const name = entry[ext]?.[w]
      if(!name){ missing.push(`${base} ${ext} ${w}w`) ; continue }
      const full = path.join(PUBLIC_DIR, 'projects', name)
      if(!fs.existsSync(full)) missing.push(`file ${name}`)
    }
  }
  if(!entry.thumb) missing.push(`${base} thumb`)
}
if(missing.length){
  console.error('[verify-images] Missing assets/entries:\n' + missing.map(m=>' - '+m).join('\n'))
  process.exit(1)
}
console.log('[verify-images] All expected project images & manifest entries present.')
