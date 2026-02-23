export function mixHex(c1, c2, t) {
  const p = v => parseInt(v,16)
  const r1=p(c1.slice(1,3)), g1=p(c1.slice(3,5)), b1=p(c1.slice(5,7))
  const r2=p(c2.slice(1,3)), g2=p(c2.slice(3,5)), b2=p(c2.slice(5,7))
  const lerp=(a,b,t)=>a+(b-a)*t
  const r=Math.round(lerp(r1,r2,t)).toString(16).padStart(2,'0')
  const g=Math.round(lerp(g1,g2,t)).toString(16).padStart(2,'0')
  const b=Math.round(lerp(b1,b2,t)).toString(16).padStart(2,'0')
  return `#${r}${g}${b}`
}