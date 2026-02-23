import React, { useRef, useEffect, useState, useCallback } from 'react'

/**
 * FitText Component
 * Automatically scales text to fit container width, ensuring each line fits completely.
 * Uses binary search for efficient font-size calculation.
 */
export default function FitText({ 
  children, 
  as: Component = 'span',
  minFontSize = 16,
  maxFontSize = 500,
  className = '',
  style = {},
  ...props 
}) {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const [fontSize, setFontSize] = useState(maxFontSize)
  const resizeObserverRef = useRef(null)

  const calculateFontSize = useCallback(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const containerWidth = container.offsetWidth
    if (containerWidth === 0) return

    // Binary search for optimal font size
    let low = minFontSize
    let high = maxFontSize
    let optimalSize = minFontSize

    // Temporarily make text visible for measurement
    const originalVisibility = text.style.visibility
    text.style.visibility = 'hidden'
    text.style.position = 'absolute'
    text.style.whiteSpace = 'nowrap'

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      text.style.fontSize = `${mid}px`
      
      if (text.scrollWidth <= containerWidth) {
        optimalSize = mid
        low = mid + 1
      } else {
        high = mid - 1
      }
    }

    // Restore text visibility
    text.style.visibility = originalVisibility
    text.style.position = ''
    text.style.whiteSpace = ''

    setFontSize(optimalSize)
  }, [minFontSize, maxFontSize])

  useEffect(() => {
    calculateFontSize()

    // Observe container resize
    resizeObserverRef.current = new ResizeObserver(() => {
      calculateFontSize()
    })

    if (containerRef.current) {
      resizeObserverRef.current.observe(containerRef.current)
    }

    // Also recalculate on window resize for safety
    window.addEventListener('resize', calculateFontSize)

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      window.removeEventListener('resize', calculateFontSize)
    }
  }, [calculateFontSize, children])

  return (
    <div 
      ref={containerRef} 
      className={`fit-text-container ${className}`}
      style={{ width: '100%', ...style }}
    >
      <Component
        ref={textRef}
        className="fit-text-content"
        style={{ 
          fontSize: `${fontSize}px`,
          display: 'block',
          lineHeight: 0.85,
          whiteSpace: 'nowrap'
        }}
        {...props}
      >
        {children}
      </Component>
    </div>
  )
}

/**
 * FitTextLines Component
 * Renders multiple lines where each line independently scales to fit container width.
 */
export function FitTextLines({
  lines = [],
  as: Wrapper = 'h1',
  lineAs: LineComponent = 'span',
  minFontSize = 16,
  maxFontSize = 500,
  className = '',
  lineClassName = '',
  style = {},
  ...props
}) {
  return (
    <Wrapper className={`fit-text-lines ${className}`} style={style} {...props}>
      {lines.map((line, index) => (
        <FitText
          key={index}
          as={LineComponent}
          minFontSize={minFontSize}
          maxFontSize={maxFontSize}
          className={lineClassName}
        >
          {line}
        </FitText>
      ))}
    </Wrapper>
  )
}
