import React, { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import '../akaru-styles.css'

const options = [
  { num:'01', title:'A project', desc:'Tell me about your product or idea.', details:'Provide a short brief: goals, timeline, budget range.' },
  { num:'02', title:'Application', desc:'Interested in collaborating? Reach out.', details:'Share your portfolio / GitHub and what you like to build.' }
]

export default function Contact() {
  const [open, setOpen] = useState(null)
  const toggle = id => setOpen(o => o===id ? null : id)
  return (
    <section className="contact-section" aria-labelledby="contact-heading">
      <div className="contact-inner">
        <h1 id="contact-heading" className="section-title">Contact</h1>
        <p className="contact-lede">Follow the procedure calmly.</p>
        <div className="contact-options" role="list">
          {options.map(o => {
            const isOpen = open === o.num
            return (
              <div key={o.num} className={"contact-option" + (isOpen? ' is-open':'')} role="listitem">
                <button className="contact-toggle" aria-expanded={isOpen} onClick={()=>toggle(o.num)}>
                  <span className="contact-num">{o.num}</span>
                  <span className="contact-meta">
                    <span className="contact-title">{o.title}</span>
                    <span className="contact-desc">{o.desc}</span>
                  </span>
                  <span className="contact-chevron" aria-hidden="true">{isOpen ? '−':'+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <Motion.div
                      className="contact-panel"
                      initial={{ height:0, opacity:0 }}
                      animate={{ height:'auto', opacity:1 }}
                      exit={{ height:0, opacity:0 }}
                      transition={{ duration:0.4, ease:[0.4,0,0.2,1] }}
                    >
                      <p className="panel-text">{o.details}</p>
                      <form className="contact-form" onSubmit={e=>e.preventDefault()}>
                        <div className="field-row">
                          <label>
                            <span>Name</span>
                            <input required type="text" placeholder="Your name" />
                          </label>
                          <label>
                            <span>Email</span>
                            <input required type="email" placeholder="you@example.com" />
                          </label>
                        </div>
                        <label className="full">
                          <span>Message</span>
                          <textarea rows={4} placeholder="Short message" />
                        </label>
                        <button type="submit" className="contact-submit">Send</button>
                      </form>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
        <div className="contact-details">
          <p><strong>Email:</strong> example@email.com</p>
          <p><strong>Phone:</strong> +00 000 000 000</p>
        </div>
      </div>
    </section>
  )
}
