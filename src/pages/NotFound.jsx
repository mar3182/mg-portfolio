import React from 'react'
import { Link } from 'react-router-dom'
import { searchPosts } from '../data/blog'
import { projects } from '../data/projects'

export default function NotFound() {
  const [query, setQuery] = React.useState('')

  // Debounce the search to avoid excessive computations
  const [debouncedQuery, setDebouncedQuery] = React.useState('')
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 220)
    return () => clearTimeout(t)
  }, [query])

  const results = React.useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return { posts: [], projects: [] }
    const posts = searchPosts(debouncedQuery).slice(0, 5)
    const term = debouncedQuery.toLowerCase()
    const proj = projects
      .filter(p =>
        (p.title && p.title.toLowerCase().includes(term)) ||
        (p.desc && p.desc.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term))
      )
      .slice(0, 5)
    return { posts, projects: proj }
  }, [debouncedQuery])

  return (
    <section className="notfound-section">
      <div className="notfound-inner">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-desc">Page not found.</p>

        {/* Quick links to help users recover */}
        <div className="notfound-quick-links" aria-label="Quick links">
          <Link to="/projects" className="btn btn-ghost focus-ring-link">Browse projects</Link>
          <Link to="/blog" className="btn btn-ghost focus-ring-link">Read the blog</Link>
          <Link to="/contact" className="btn btn-primary focus-ring-link">Contact me</Link>
        </div>

        {/* Optional on-page search */}
        <div className="notfound-search" role="search" aria-label="Search site">
          <label htmlFor="nf-search" className="sr-only">Search projects and blog</label>
          <input
            id="nf-search"
            type="search"
            className="search-input"
            placeholder="Search projects or blog posts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            inputMode="search"
            autoComplete="off"
          />
          <div className="sr-only" aria-live="polite">
            {debouncedQuery && (results.posts.length + results.projects.length) > 0
              ? `${results.posts.length + results.projects.length} results`
              : debouncedQuery ? 'No results' : ''}
          </div>
        </div>

        {(debouncedQuery && (results.posts.length > 0 || results.projects.length > 0)) && (
          <div className="notfound-results">
            {results.projects.length > 0 && (
              <div className="results-group">
                <h2 className="results-heading">Projects</h2>
                <ul className="results-list">
                  {results.projects.map((p) => (
                    <li key={`proj-${p.id}`} className="result-item">
                      <Link to={`/projects/${p.id}`} className="focus-ring-link">
                        <span className="result-title">{p.title}</span>
                        {p.category && <span className="result-meta"> · {p.category}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.posts.length > 0 && (
              <div className="results-group">
                <h2 className="results-heading">Blog posts</h2>
                <ul className="results-list">
                  {results.posts.map((post) => (
                    <li key={`post-${post.id}`} className="result-item">
                      <Link to={`/blog/${post.slug}`} className="focus-ring-link">
                        <span className="result-title">{post.title}</span>
                        {post.readingTime && <span className="result-meta"> · {post.readingTime}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <Link to="/" className="btn btn-ghost focus-ring-link">← Back home</Link>
        </div>
      </div>
    </section>
  )
}
