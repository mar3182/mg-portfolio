import React from 'react'
import '../akaru-styles.css'

export default function Agency() {
  return (
    <section className="agency-section" aria-labelledby="agency-heading">
      <div className="agency-inner">
        <h1 id="agency-heading" className="section-title">Agency</h1>
        <p className="agency-intro">We craft beautiful experiences — creative, passionate, independent.</p>
        <div className="agency-values">
          {['Creative','Passionate','Independent'].map(v => (
            <div key={v} className="agency-value">{v}</div>
          ))}
        </div>
        <div className="agency-team-placeholder">
          <p>Team profiles & awards coming soon.</p>
        </div>
      </div>
    </section>
  )
}
