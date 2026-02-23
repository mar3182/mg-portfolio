import React from 'react'
import { motion as Motion } from 'framer-motion'
import '../akaru-styles.css'
import { team, awards, clients } from '../data/agency'

const fadeUp = {
  hidden: { opacity:0, y: 30 },
  visible: i => ({ opacity:1, y:0, transition:{ delay: i * 0.07, duration:0.6, ease:[0.4,0,0.2,1] } })
}

export default function Agency() {
  return (
    <section className="agency-section" aria-labelledby="agency-heading">
      <div className="agency-inner">
        <Motion.h1
          id="agency-heading"
          className="section-title"
          initial={{ opacity:0, y:40 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, ease:[0.4,0,0.2,1] }}
        >Agency</Motion.h1>
        <Motion.p className="agency-intro" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25 }}>We craft beautiful experiences — creative, passionate, independent.</Motion.p>
        <div className="agency-values">
          <div className="agency-values-marquee" aria-hidden="true">
            {Array.from({length:12}).map((_,i)=>{
              const words=['Creative','Passionate','Independent']
              return <span key={i}>{words[i%3]}</span>
            })}
          </div>
        </div>

        <section className="team-section" aria-labelledby="team-heading">
          <h2 id="team-heading" className="sub-title">Team</h2>
          <ul className="team-grid">
            {team.map((m,i) => (
              <Motion.li
                key={m.id}
                className="team-card"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once:true }}
                custom={i}
                whileHover={{ y:-6, rotate:0.2 }}
                transition={{ type:'spring', stiffness:260, damping:22 }}
              >
                <div className="team-photo" aria-hidden="true">
                  <span className="team-photo-inner">{m.name[0]}</span>
                </div>
                <div className="team-meta">
                  <h3 className="team-name">{m.name}</h3>
                  <p className="team-role">{m.role}</p>
                </div>
              </Motion.li>
            ))}
          </ul>
        </section>

        <section className="awards-section" aria-labelledby="awards-heading">
            <h2 id="awards-heading" className="sub-title">Awards</h2>
            <ul className="awards-list">
              {awards.map((a,i) => (
                <Motion.li key={a.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }} custom={i}>
                  <span className="award-year">{a.year}</span>
                  <span className="award-title">{a.title}</span>
                </Motion.li>
              ))}
            </ul>
        </section>

        <section className="clients-section" aria-labelledby="clients-heading">
          <h2 id="clients-heading" className="sub-title">Clients</h2>
          <ul className="clients-grid">
            {clients.map((c,i) => (
              <Motion.li key={c} className="client-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }} custom={i}>
                <span className="client-logo" aria-hidden="true">{c.split(' ').map(w=>w[0]).join('')}</span>
                <span className="client-name">{c}</span>
              </Motion.li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  )
}
