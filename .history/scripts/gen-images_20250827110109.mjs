#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Config
const INPUT_DIR = path.resolve(__dirname, '../raw-images/projects')
const OUT_DIR = path.resolve(__dirname, '../public/projects')
const MANIFEST_PATH = path.resolve(__dirname, '../src/data/projectImageManifest.json')
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

const manifest = {}

function hashBuffer(buf){ return crypto.createHash('sha1').update(buf).digest('hex').slice(0,8) }

async function processOne(file){
  const base = path.parse(file).name
  const srcPath = path.join(INPUT_DIR, file)
  const img = sharp(srcPath)
  const meta = await img.metadata()
  manifest[base] = { jpg:{}, webp:{}, avif:{} }
  // LQIP placeholder (blurred tiny jpeg base64)
  try {
    const lqBuf = await img.clone().resize({ width:20 }).jpeg({ quality:40 }).toBuffer()
    manifest[base].thumb = `data:image/jpeg;base64,${lqBuf.toString('base64')}`
  } catch(err){ console.warn('LQIP failed for', base, err.message) }
  for(const w of WIDTHS){
    if(meta.width && meta.width < w) continue // skip upscale
    const resize = sharp(srcPath).resize({ width:w })
    // jpg
    const jpgBuf = await resize.clone().jpeg({ quality:78, progressive:true }).toBuffer()
    const jpgHash = hashBuffer(jpgBuf)
    const jpgName = `${base}-${w}-${jpgHash}.jpg`
    fs.writeFileSync(path.join(OUT_DIR, jpgName), jpgBuf)
    manifest[base].jpg[w] = jpgName
    // webp
    const webpBuf = await resize.clone().webp({ quality:74 }).toBuffer()
    const webpHash = hashBuffer(webpBuf)
    const webpName = `${base}-${w}-${webpHash}.webp`
    fs.writeFileSync(path.join(OUT_DIR, webpName), webpBuf)
    manifest[base].webp[w] = webpName
    // avif
    const avifBuf = await resize.clone().avif({ quality:50 }).toBuffer()
    const avifHash = hashBuffer(avifBuf)
    const avifName = `${base}-${w}-${avifHash}.avif`
    fs.writeFileSync(path.join(OUT_DIR, avifName), avifBuf)
    manifest[base].avif[w] = avifName
  }
  console.log('Processed', base)
}

;(async()=>{
  for(const f of files){
    try { await processOne(f) } catch(err){ console.error('Error processing', f, err) }
  }
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
  console.log('Manifest written:', MANIFEST_PATH)
  console.log('Done.')
})()
