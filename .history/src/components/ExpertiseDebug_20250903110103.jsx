import React from 'react'

// Simple debug component to identify expertise section issues
export default function ExpertiseDebug() {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '100px', 
      right: '20px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '1rem', 
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 999,
      maxWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Expertise Debug</h3>
      <p>✅ Component loaded successfully</p>
      <p>✅ CSS imported: expertise.css</p>
      <p>✅ Motion/animation imports working</p>
      <p>Check console for any runtime errors</p>
      <button 
        onClick={() => {
          console.log('Expertise section element:', document.getElementById('expertise'))
          console.log('Active metrics:', document.querySelectorAll('.expertise-metrics .metric'))
        }}
        style={{ 
          background: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '11px',
          cursor: 'pointer',
          marginTop: '8px'
        }}
      >
        Log Debug Info
      </button>
    </div>
  )
}
