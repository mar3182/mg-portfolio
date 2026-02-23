#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Config
const INPUT_DIR = path.resolve(__dirname, '../raw-images/projects')
const OUT_DIR = path.resolve(__dirname, '../public/projects')
const WIDTHS = [400,600,800,1200]

if(!fs.existsSync(INPUT_DIR)){
  console.error('[gen-images] Missing input dir', INPUT_DIR)
  process.exit(1)
}
fs.mkdirSync(OUT_DIR, { recursive:true })

const files = fs.readdirSync(INPUT_DIR).filter(f=>/\.(jpe?g|png|tiff|webp)$/i.test(f))
if(!files.length){
  console.error('[gen-images] No source images found in', INPUT_DIR)
  process.exit(1)
}

async function processOne(file){
  const base = path.parse(file).name
  const srcPath = path.join(INPUT_DIR, file)
  const img = sharp(srcPath)
  const meta = await img.metadata()
  for(const w of WIDTHS){
    if(meta.width && meta.width < w) continue // skip upscale
    const pipeline = sharp(srcPath).resize({ width:w })
    // JPG
    await pipeline.clone().jpeg({ quality:78, progressive:true }).toFile(path.join(OUT_DIR, `${base}-${w}.jpg`))
    // WebP
    await pipeline.clone().webp({ quality:74 }).toFile(path.join(OUT_DIR, `${base}-${w}.webp`))
    // AVIF
    await pipeline.clone().avif({ quality:50 }).toFile(path.join(OUT_DIR, `${base}-${w}.avif`))
  }
  console.log('Processed', base)
}

;(async()=>{
  for(const f of files){
    try { await processOne(f) } catch(err){ console.error('Error processing', f, err) }
  }
  console.log('Done.')
})()
