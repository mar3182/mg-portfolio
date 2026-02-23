import React from 'react'
import '../akaru-styles.css'

export default function Contact() {
  return (
    <section className="contact-section" aria-labelledby="contact-heading">
      <div className="contact-inner">
        <h1 id="contact-heading" className="section-title">Contact</h1>
        <p className="contact-lede">Follow the procedure calmly.</p>
        <div className="contact-options">
          {[
            { num:'01', title:'A project', desc:'Tell me about your product or idea.' },
            { num:'02', title:'Application', desc:'Interested in collaborating? Reach out.' }
          ].map(o => (
            <div key={o.num} className="contact-option">
              <div className="contact-num">{o.num}</div>
              <div className="contact-meta">
                <h3>{o.title}</h3>
                <p>{o.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="contact-details">
          <p><strong>Email:</strong> example@email.com</p>
          <p><strong>Phone:</strong> +00 000 000 000</p>
        </div>
      </div>
    </section>
  )
}
