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
  const [formData, setFormData] = useState({ name:'', email:'', message:'' })
  const [errors, setErrors] = useState({})
  function validate(){
    const e = {}
    if(!formData.name.trim()) e.name = 'Required'
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) e.email = 'Invalid email'
    if(formData.message.trim().length < 10) e.message = 'Min 10 chars'
    setErrors(e)
    return Object.keys(e).length===0
  }
  const onChange = ev => {
    const { name, value } = ev.target
    setFormData(f => ({ ...f, [name]: value }))
  }
  function submit(e){ e.preventDefault(); if(validate()){ /* send */ alert('Submitted (demo)') } }
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
                      <form className="contact-form" onSubmit={submit} noValidate>
                        <div className="field-row">
                          <label className={errors.name? 'has-error': ''}>
                            <span>Name</span>
                            <input name="name" value={formData.name} onChange={onChange} aria-invalid={!!errors.name} aria-describedby={errors.name? 'err-name': undefined} type="text" placeholder="Your name" />
                            {errors.name && <span id="err-name" className="field-error">{errors.name}</span>}
                          </label>
                          <label className={errors.email? 'has-error': ''}>
                            <span>Email</span>
                            <input name="email" value={formData.email} onChange={onChange} aria-invalid={!!errors.email} aria-describedby={errors.email? 'err-email': undefined} type="email" placeholder="you@example.com" />
                            {errors.email && <span id="err-email" className="field-error">{errors.email}</span>}
                          </label>
                        </div>
                        <label className={"full" + (errors.message? ' has-error':'')}>
                          <span>Message</span>
                          <textarea name="message" value={formData.message} onChange={onChange} aria-invalid={!!errors.message} aria-describedby={errors.message? 'err-message': undefined} rows={4} placeholder="Short message" />
                          {errors.message && <span id="err-message" className="field-error">{errors.message}</span>}
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
