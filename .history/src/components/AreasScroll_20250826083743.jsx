import React, { useRef } from 'react'
import { expertiseCategories } from '../data/expertise'
import '../akaru-styles.css'

// Horizontally scrollable areas, each with vertical scroll for details
export default function AreasScroll() {
  const scrollRef = useRef(null)
  return (
    <section className="areas-scroll-section" aria-label="Areas of expertise">
      <div className="areas-scroll-track" ref={scrollRef}>
        {expertiseCategories.map(area => (
          <div className="area-card" key={area.key}>
            <div className="area-header" style={{ background: area.color }}>
              <h2 className="area-title">{area.title}</h2>
              <ul className="area-tags">
                {area.tags.map(tag => <li key={tag} className="area-tag">{tag}</li>)}
              </ul>
            </div>
            <div className="area-details">
              <p>{area.blurb}</p>
              {/* Example vertical content: add more details, images, metrics, etc. */}
              <div style={{ height: '320px', background: '#f9f9f9', margin: '1rem 0', borderRadius: '8px' }} />
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Scroll down for more...</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
