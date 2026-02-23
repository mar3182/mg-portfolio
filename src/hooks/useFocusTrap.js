import { useEffect } from 'react'

export function useFocusTrap(containerRef, active, { restoreFocus = true } = {}) {
  useEffect(() => {
    if (!active) return
    const el = containerRef.current
    if (!el) return
    const prev = document.activeElement
    const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    function focusFirst(){
      const nodes = el.querySelectorAll(focusableSelectors)
      if (nodes.length) nodes[0].focus()
    }
    focusFirst()
    function onKey(e){
      if (e.key !== 'Tab') return
      const nodes = Array.from(el.querySelectorAll(focusableSelectors)).filter(n=>!n.hasAttribute('disabled') && n.tabIndex !== -1)
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (restoreFocus && prev && prev.focus) prev.focus()
    }
  }, [containerRef, active, restoreFocus])
}
