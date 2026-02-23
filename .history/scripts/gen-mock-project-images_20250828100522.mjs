#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { projects } from '../src/data/projects.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const RAW_DIR = path.resolve(__dirname, '../raw-images/projects')
fs.mkdirSync(RAW_DIR, { recursive:true })

function gradientSvg(width, height, title, color){
  const id = 'g'+Math.random().toString(36).slice(2,8)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>
  <defs>
    <linearGradient id='${id}' x1='0%' x2='100%' y1='0%' y2='100%'>
      <stop offset='0%' stop-color='${color}' stop-opacity='0.9' />
      <stop offset='100%' stop-color='${color}' stop-opacity='0.4' />
    </linearGradient>
  </defs>
  <rect width='100%' height='100%' rx='48' fill='url(#${id})'/>
  <g fill='#111' font-family='Inter,Arial,sans-serif' font-weight='700'>
    <text x='50%' y='46%' font-size='64' text-anchor='middle' opacity='0.08'>${title.toUpperCase()}</text>
    <text x='50%' y='56%' font-size='42' text-anchor='middle' opacity='0.25' letter-spacing='2'>${title.split(' ').slice(0,2).join(' ')}</text>
  </g>
</svg>`
}

async function createMock(base, title, color){
  const svg = gradientSvg(1600, 1066, title, color)
  const out = path.join(RAW_DIR, `${base}.jpg`)
  // render svg -> png -> jpg
  const buf = Buffer.from(svg)
  const jpg = await sharp(buf).jpeg({ quality:88 }).toBuffer()
  fs.writeFileSync(out, jpg)
  console.log('Mock source created', out)
}

;(async()=>{
  for(const p of projects){
    const base = p.base
    const rawPath = path.join(RAW_DIR, `${base}.jpg`)
    if(fs.existsSync(rawPath)) { console.log('Skipping existing', rawPath); continue }
    await createMock(base, p.title, p.color || '#ccc')
  }
  console.log('All mock images generated.')
  console.log('Next: pnpm optimize:images')
})()
