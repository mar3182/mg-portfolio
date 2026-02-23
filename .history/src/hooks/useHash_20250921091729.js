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
      // Clear the hash and ensure subscribers update
      // Use location.hash assignment to trigger the native 'hashchange' event.
      // Fallback to replaceState + manual state update if needed.
      try {
        // This will remove the fragment and emit 'hashchange'
        window.location.hash = ''
      } catch {
        history.replaceState('', document.title, window.location.pathname + window.location.search)
        setValue('')
        window.dispatchEvent(new HashChangeEvent('hashchange'))
      }
    }
  }
  return [value, set]
}
