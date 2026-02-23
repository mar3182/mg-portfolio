import React from 'react'

const SOCIAL = [
  { id: 'li', label: 'LinkedIn', href: 'https://www.linkedin.com', short: 'LI' },
  { id: 'gh', label: 'GitHub', href: 'https://github.com', short: 'GH' },
  { id: 'tw', label: 'Twitter / X', href: 'https://twitter.com', short: 'TW' },
  { id: 'ig', label: 'Instagram', href: 'https://instagram.com', short: 'IG' }
]

export default function SocialBar() {
  return (
    <div className="social-bar" aria-label="Social links">
      <span className="bar-line" aria-hidden="true" />
      <ul className="social-list">
        {SOCIAL.map(s => (
          <li key={s.id}>
            <a 
              href={s.href} 
              target="_blank" 
              rel="noopener noreferrer"
              data-cursor="visit"
              aria-label={s.label}
            >
              {s.short}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
