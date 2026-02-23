import { useEffect, useState } from 'react'

export function useHash(){
  const [value, setValue] = useState(() => window.location.hash.replace('#',''))
  useEffect(() => {
    function onHash(){ setValue(window.location.hash.replace('#','')) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const set = (key) => {
    if (key) {
      window.location.hash = key
    } else {
      history.replaceState('', document.title, window.location.pathname + window.location.search)
    }
  }
  return [value, set]
}
