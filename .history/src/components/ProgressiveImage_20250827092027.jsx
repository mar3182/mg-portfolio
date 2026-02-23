import React, { useState, useEffect } from 'react'

/* ProgressiveImage
   Props: src, placeholder (optional tiny base64), alt, className, style
   Fades from blurred placeholder to sharp image; supports color fallback background.
*/
export default function ProgressiveImage({ src, placeholder, alt='', className='', style }){
  const [loaded, setLoaded] = useState(false)
  useEffect(()=>{ setLoaded(false) }, [src])
  return (
    <span className={"prog-img-wrapper "+className} style={{position:'relative', display:'block', overflow:'hidden', borderRadius:'inherit', ...style}}>
      {placeholder && (
        <img
          src={placeholder}
          aria-hidden="true"
          className="prog-img ph"
          style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', filter:'blur(20px)', transform:'scale(1.05)', opacity:loaded?0:1, transition:'opacity .6s ease'}}
        />
      )}
      <img
        src={src}
        alt={alt}
        className="prog-img full"
        onLoad={()=>setLoaded(true)}
        style={{position:'relative', width:'100%', height:'100%', objectFit:'cover', opacity:loaded?1:0, transition:'opacity .6s ease'}}
      />
    </span>
  )
}
