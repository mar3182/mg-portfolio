import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'

function useNavSections() {
  const location = useLocation()
  const isRoot = location.pathname === '/'
  if (isRoot) {
    return [
      { id: 'home', label: 'Home', href: '/#home', color: '#d77f2b', hash: true },
      { id: 'areas', label: 'Areas', href: '/#areas', color: '#6b866f', hash: true },
      { id: 'expertise', label: 'Expertise', href: '/#expertise', color: '#b98aa9', hash: true },
      { id: 'projects', label: 'Projects', to: '/projects', color: '#b0c4d8' },
      { id: 'blog', label: 'Blog', to: '/blog', color: '#8b5cf6' },
      { id: 'contact', label: 'Contact', to: '/contact', color: '#222' },
    ]
  }
  return [
    { id: 'projects', label: 'Projects', to: '/projects', color: '#b0c4d8' },
    { id: 'blog', label: 'Blog', to: '/blog', color: '#8b5cf6' },
    { id: 'expertise-page', label: 'Expertise', to: '/expertise', color: '#6b866f' },
    { id: 'agency', label: 'Agency', to: '/agency', color: '#b98aa9' },
    { id: 'contact', label: 'Contact', to: '/contact', color: '#222' },
  ]
}

export default function PrimaryNav({ active, onAnchor }) {
  const SECTIONS = useNavSections()
  return (
    <nav className="primary-nav" aria-label="Primary">
      <ul className="primary-nav-list">
        {SECTIONS.map(item => {
          const isActive = active === item.id
          const content = (
            <span className="nav-item-inner">
              <span className="nav-dot" style={{ background: item.color }} aria-hidden="true" />
              <span className="nav-label">{item.label}</span>
              {isActive && (
                <Motion.span layoutId="nav-underline" className="nav-underline" />
              )}
            </span>
          )
          return (
            <li key={item.id} className={isActive ? 'is-active' : undefined} data-id={item.id}>
              {item.hash ? (
                <a 
                  href={item.href} 
                  onClick={onAnchor} 
                  aria-current={isActive ? 'true': undefined}
                  data-cursor="discover"
                  data-cursor-magnetic="0.2"
                >
                  {content}
                </a>
              ) : (
                <NavLink 
                  to={item.to}
                  data-cursor="discover"
                  data-cursor-magnetic="0.2"
                >
                  {content}
                </NavLink>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
