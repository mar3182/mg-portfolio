import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer" aria-label="Global footer">
      <div className="footer-inner">
        <p className="footer-copy">© {new Date().getFullYear()} MG Portfolio. Built with React & Motion.</p>
        <ul className="footer-social" aria-label="Social links">
          {[
            { href:'https://instagram.com', label:'Instagram', title:'Open Instagram in a new tab' },
            { href:'https://linkedin.com', label:'LinkedIn', title:'Open LinkedIn in a new tab' },
            { href:'https://twitter.com', label:'Twitter', title:'Open Twitter (X) in a new tab' },
            { href:'https://facebook.com', label:'Facebook', title:'Open Facebook in a new tab' }
          ].map(s => (
            <li key={s.label}>
              <a
                className="focus-ring-link"
                target="_blank"
                rel="noopener noreferrer"
                href={s.href}
                aria-label={`${s.label} (opens in a new tab)`}
                title={s.title}
                data-cursor="visit"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
