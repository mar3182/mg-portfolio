/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IDENTITY TEXT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Typography components that respond to the identity value.
 * 
 * DESIGN INTENT:
 * - Text should feel like it belongs to the current identity
 * - Design: tighter tracking, lighter weight, warm shadows
 * - Tech: expanded tracking, medium weight, cool glow
 * - Transitions are smooth and cinematic
 */

import { memo, forwardRef } from 'react'
import { motion as Motion, useTransform } from 'framer-motion'
import { 
  useSmoothedIdentity,
} from '../hooks/useIdentity'
import './styles/identity-text.css'

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY HEADING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A heading that morphs based on identity
 * 
 * Usage:
 * <IdentityHeading as="h1" size="xl">Hello World</IdentityHeading>
 */
export const IdentityHeading = memo(forwardRef(function IdentityHeading(
  { 
    as: Component = 'h2', 
    size = 'lg',
    children, 
    className = '',
    style = {},
    ...props 
  }, 
  ref
) {
  const smoothIdentity = useSmoothedIdentity()
  
  // Dynamic letter spacing based on identity
  const letterSpacing = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    ['-0.03em', '-0.01em', '0.03em']
  )
  
  // Dynamic font weight (subtle shift)
  const fontWeight = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    [400, 450, 500]
  )
  
  // Text color with warm/cool shift
  const color = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    ['#f5f0eb', '#f0f0f0', '#e8f4f8']
  )
  
  // Subtle text shadow
  const textShadow = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    [
      '0 0 60px rgba(196, 112, 58, 0.15)',
      '0 0 40px rgba(128, 128, 128, 0.08)',
      '0 0 40px rgba(58, 156, 196, 0.2)'
    ]
  )
  
  return (
    <Motion.div
      ref={ref}
      className={`identity-heading identity-heading--${size} ${className}`}
      style={{
        letterSpacing,
        fontWeight,
        color,
        textShadow,
        ...style,
      }}
      {...props}
    >
      <Component>{children}</Component>
    </Motion.div>
  )
}))

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY PARAGRAPH
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Body text that responds to identity
 */
export const IdentityParagraph = memo(forwardRef(function IdentityParagraph(
  { 
    children, 
    className = '',
    muted = false,
    style = {},
    ...props 
  }, 
  ref
) {
  const smoothIdentity = useSmoothedIdentity()
  
  // Subtle line height adjustment
  const lineHeight = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    [1.7, 1.6, 1.5]
  )
  
  // Text color
  const color = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    muted 
      ? ['#a89a8a', '#909090', '#7a9aa8']
      : ['#d5d0cb', '#c0c0c0', '#c8d4d8']
  )
  
  return (
    <Motion.p
      ref={ref}
      className={`identity-paragraph ${muted ? 'identity-paragraph--muted' : ''} ${className}`}
      style={{
        lineHeight,
        color,
        ...style,
      }}
      {...props}
    >
      {children}
    </Motion.p>
  )
}))

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY LABEL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Small labels (tags, categories, etc.) that respond to identity
 */
export const IdentityLabel = memo(forwardRef(function IdentityLabel(
  { 
    children, 
    className = '',
    variant = 'default', // 'default' | 'accent' | 'subtle'
    style = {},
    ...props 
  }, 
  ref
) {
  const smoothIdentity = useSmoothedIdentity()
  
  // Letter spacing expands toward tech
  const letterSpacing = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    ['0.05em', '0.08em', '0.12em']
  )
  
  // Accent color shift
  const color = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    variant === 'accent'
      ? ['#c4703a', '#888888', '#3a9cc4']
      : ['#a89a8a', '#909090', '#7a9aa8']
  )
  
  // Border color for bordered variants
  const borderColor = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    ['rgba(196, 112, 58, 0.3)', 'rgba(128, 128, 128, 0.2)', 'rgba(58, 156, 196, 0.3)']
  )
  
  return (
    <Motion.span
      ref={ref}
      className={`identity-label identity-label--${variant} ${className}`}
      style={{
        letterSpacing,
        color,
        borderColor,
        ...style,
      }}
      {...props}
    >
      {children}
    </Motion.span>
  )
}))

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY ACCENT TEXT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Accent/highlight text (e.g., emphasized words, links)
 */
export const IdentityAccent = memo(forwardRef(function IdentityAccent(
  { 
    children, 
    as: Tag = 'span',
    className = '',
    style = {},
    ...props 
  }, 
  ref
) {
  const smoothIdentity = useSmoothedIdentity()
  
  // Accent color
  const color = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    ['#e89a5f', '#aaaaaa', '#5fbde8']
  )
  
  // Subtle glow
  const textShadow = useTransform(
    smoothIdentity,
    [0, 0.5, 1],
    [
      '0 0 20px rgba(232, 154, 95, 0.3)',
      '0 0 15px rgba(170, 170, 170, 0.15)',
      '0 0 20px rgba(95, 189, 232, 0.35)'
    ]
  )
  
  return (
    <Motion.span
      ref={ref}
      className={`identity-accent ${className}`}
      style={{
        color,
        textShadow,
        ...style,
      }}
      {...props}
    >
      {Tag === 'span' ? children : <Tag>{children}</Tag>}
    </Motion.span>
  )
}))

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default {
  Heading: IdentityHeading,
  Paragraph: IdentityParagraph,
  Label: IdentityLabel,
  Accent: IdentityAccent,
}
