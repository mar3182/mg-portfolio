import React, { useState, useEffect, useRef } from 'react'

/* ProgressiveImage
   Props: src, placeholder (optional tiny base64), alt, className, style
   Fades from blurred placeholder to sharp image; supports color fallback background.
*/
export default function ProgressiveImage({ src, srcSet, sizes, sources = [], placeholder, alt='', className='', style, rootMargin='300px', lazy=true }){
  const [loaded, setLoaded] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(!lazy)
  const ref = useRef(null)

  // Observe for early prefetch
  useEffect(()=>{
    if(!lazy || shouldLoad) return
    const el = ref.current
    if(!el || typeof IntersectionObserver==='undefined'){ setShouldLoad(true); return }
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ setShouldLoad(true); obs.disconnect() } })
    }, { rootMargin })
    obs.observe(el)
    return () => obs.disconnect()
  }, [lazy, shouldLoad, rootMargin, src])

  useEffect(()=>{ setLoaded(false) }, [src])

  return (
    <span ref={ref} className={"prog-img-wrapper "+className} style={{position:'relative', display:'block', overflow:'hidden', borderRadius:'inherit', ...style}}>
      {placeholder && (
        <img
          src={placeholder}
          aria-hidden="true"
          className="prog-img ph"
          style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', filter:'blur(20px)', transform:'scale(1.05)', opacity:loaded?0:1, transition:'opacity .6s ease'}}
        />
      )}
      {shouldLoad && (
        <picture>
          {sources.map((s,i)=> <source key={i} {...s} />)}
          <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            className="prog-img full"
            onLoad={()=>setLoaded(true)}
            style={{position:'relative', width:'100%', height:'100%', objectFit:'cover', opacity:loaded?1:0, transition:'opacity .6s ease'}}
          />
        </picture>
      )}
    </span>
  )
}
