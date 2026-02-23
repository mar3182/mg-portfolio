/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IDENTITY PROVIDER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Root component that initializes and provides the identity motion system.
 * Place this high in your component tree (in AppLayout or main.jsx).
 * 
 * Responsibilities:
 * - Syncs identity state to CSS custom properties
 * - Renders the living background
 * - Renders decorative layers
 * - Provides context for child components
 */

import { useEffect, memo, lazy, Suspense } from 'react'
import { useIdentityCSSSync, useIdentity, useIdentityActions } from '../hooks/useIdentity'
import IdentityBackground from './IdentityBackground'
import IdentityDecorativeLayer from './IdentityDecorativeLayer'

// Portrait Ecosystem - living growth from portrait (lazy loaded for performance)
const PortraitEcosystem = lazy(() => import('./PortraitEcosystem'))

// ═══════════════════════════════════════════════════════════════════════════
// CSS SYNC COMPONENT (Internal)
// ═══════════════════════════════════════════════════════════════════════════

function IdentityCSSSync() {
  useIdentityCSSSync()
  return null
}

// ═══════════════════════════════════════════════════════════════════════════
// KEYBOARD CONTROLS (Development/Demo)
// ═══════════════════════════════════════════════════════════════════════════

function IdentityKeyboardControls() {
  const { setIdentity, animateToIdentity, resetToNeutral } = useIdentityActions()
  const identity = useIdentity()
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only in development
      if (import.meta.env.PROD) return
      
      // Don't interfere with form inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      
      switch (e.key) {
        case '1':
          // Lock to Design
          animateToIdentity(0, { duration: 1.5, source: 'keyboard' })
          break
        case '2':
          // Lock to Neutral
          resetToNeutral(true)
          break
        case '3':
          // Lock to Tech
          animateToIdentity(1, { duration: 1.5, source: 'keyboard' })
          break
        case 'ArrowLeft':
          // Nudge toward Design
          setIdentity(Math.max(0, identity - 0.05), 'keyboard')
          break
        case 'ArrowRight':
          // Nudge toward Tech
          setIdentity(Math.min(1, identity + 0.05), 'keyboard')
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [identity, setIdentity, animateToIdentity, resetToNeutral])
  
  return null
}

// ═══════════════════════════════════════════════════════════════════════════
// DEBUG OVERLAY
// ═══════════════════════════════════════════════════════════════════════════

function IdentityDebugOverlay() {
  const identity = useIdentity()
  
  // Only show in development with debug flag
  if (import.meta.env.PROD) return null
  if (typeof window !== 'undefined' && !window.location.search.includes('debugIdentity')) return null
  
  const label = identity < 0.35 ? 'DESIGN' : identity > 0.65 ? 'TECH' : 'NEUTRAL'
  const color = identity < 0.35 ? '#c4703a' : identity > 0.65 ? '#3a9cc4' : '#888'
  
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        lineHeight: 1.5,
        pointerEvents: 'none',
      }}
    >
      <div style={{ color, fontWeight: 'bold', marginBottom: '4px' }}>{label}</div>
      <div>Identity: {identity.toFixed(3)}</div>
      <div style={{ opacity: 0.6, marginTop: '8px', fontSize: '10px' }}>
        Keys: 1=Design, 2=Neutral, 3=Tech<br />
        ←/→ = Nudge
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PROVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * IdentityProvider
 * 
 * Wraps your application with the identity motion system.
 * Renders the living background, portrait ecosystem, and decorative layers.
 * 
 * Props:
 * - children: Your application content
 * - showBackground: Whether to render the animated background (default: true)
 * - showDecorative: Whether to render decorative layers (default: true)
 * - showEcosystem: Whether to render portrait ecosystem growth (default: true)
 * - enableKeyboardControls: Enable dev keyboard controls (default: true in dev)
 */
function IdentityProvider({ 
  children,
  showBackground = true,
  showDecorative = true,
  showEcosystem = true,
  enableKeyboardControls = true,
}) {
  return (
    <>
      {/* CSS sync - updates custom properties */}
      <IdentityCSSSync />
      
      {/* Keyboard controls for development */}
      {enableKeyboardControls && <IdentityKeyboardControls />}
      
      {/* Debug overlay (only in dev with ?debugIdentity) */}
      <IdentityDebugOverlay />
      
      {/* Living background layer */}
      {showBackground && <IdentityBackground />}
      
      {/* Portrait Ecosystem - flora/circuit growth from portrait */}
      {showEcosystem && (
        <Suspense fallback={null}>
          <PortraitEcosystem />
        </Suspense>
      )}
      
      {/* Decorative elements layer */}
      {showDecorative && <IdentityDecorativeLayer />}
      
      {/* Application content */}
      {children}
    </>
  )
}

export default memo(IdentityProvider)

// Note: Import hooks directly from '../hooks/useIdentity' in consuming components
// to avoid Fast Refresh issues with mixed exports.
// 
// Example:
// import IdentityProvider from './IdentityProvider'
// import { useIdentity, useIdentityActions } from '../hooks/useIdentity'
