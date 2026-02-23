import { useState, useMemo, useEffect } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { blogPosts, blogCategories, getPostsByCategory } from '../data/blog'
import { RevealWrapper, StaggerWrapper, StaggerItem } from '../components/ScrollReveal'
import '../styles/blog.css'

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searchActive, setSearchActive] = useState(false)
  const blogRadioRef = useRef(null)

  // Date formatter
  const formatDate = (iso) => {
    try {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
    } catch {
      return iso
    }
  }

  // Debounce the search input
  useEffect(() => {
    const h = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 280)
    return () => clearTimeout(h)
  }, [searchQuery])

  // Shallow search on title/excerpt/tags for performance
  const shallowSearch = (query) => {
    const q = query.toLowerCase()
    return blogPosts.filter(post =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some(tag => tag.toLowerCase().includes(q))
    )
  }

  // Filter posts based on category and search
  const filteredPosts = useMemo(() => {
    if (debouncedQuery) {
      return shallowSearch(debouncedQuery)
    }
    return getPostsByCategory(selectedCategory)
  }, [selectedCategory, debouncedQuery])

  const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0]
  const regularPosts = filteredPosts.filter(post => post.id !== featuredPost?.id)

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    setSearchActive(query.trim().length > 0)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchActive(false)
    setSelectedCategory('All')
  }

  // Keyboard navigation for category radiogroup (roving tabindex)
  function handleBlogFilterKeyDown(e, idx) {
    if (!blogRadioRef.current) return
    const buttons = Array.from(blogRadioRef.current.querySelectorAll('[role="radio"]'))
    const currentIndex = idx
    let nextIndex = null
    const key = e.key
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % buttons.length
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + buttons.length) % buttons.length
    } else if (key === 'Home') {
      nextIndex = 0
    } else if (key === 'End') {
      nextIndex = buttons.length - 1
    }
    if (nextIndex !== null) {
      e.preventDefault()
      const nextBtn = buttons[nextIndex]
      const value = nextBtn.textContent
      setSelectedCategory(value)
      requestAnimationFrame(() => nextBtn.focus())
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="blog-section">
        <div className="blog-inner">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Blog</h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Insights on web development, AI integration, and building scalable applications. 
            Sharing knowledge from over 11 years of experience in the industry.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="pb-8 px-6">
        <div className="blog-inner">
          <RevealWrapper>
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              {/* Search Bar */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-4 py-3 pl-12 pr-12 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchActive && (
                  <button
                    onClick={clearSearch}
                    type="button"
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Category Filters */}
              {!searchActive && (
                <div
                  ref={blogRadioRef}
                  className="project-filters"
                  role="radiogroup"
                  aria-label="Blog categories"
                >
                  {blogCategories.map((category, idx) => {
                    const checked = selectedCategory === category
                    return (
                      <button
                        key={category}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        tabIndex={checked ? 0 : -1}
                        className={`filter-btn${checked ? ' is-active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                        onKeyDown={(e) => handleBlogFilterKeyDown(e, idx)}
                      >
                        {category}
                      </button>
                    )
                  })}
                  <span className="visually-hidden" aria-live="polite">Current category: {selectedCategory}</span>
                </div>
              )}

              {/* Search Results Info */}
              {searchActive && (
                <div className="text-sm text-slate-600">
                  Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} for "{debouncedQuery}"
                </div>
              )}
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && !searchActive && (
        <section className="pb-16 px-6">
          <div className="blog-inner">
            <RevealWrapper>
              <div className="mb-4 md:mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Featured Article</h2>
              </div>
              
              <Link to={`/blog/${featuredPost.slug}`} className="block group focus-ring-link">
                <article className="bg-slate-50 rounded-lg p-8 border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-slate-300 w-full">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredPost.categories.map((category) => (
                      <span key={category} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-4">
                      <span>{formatDate(featuredPost.publishedAt)}</span>
                      <span>{featuredPost.readingTime}</span>
                    </div>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">Featured</span>
                  </div>
                </article>
              </Link>
            </RevealWrapper>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="pb-20 px-6">
        <div className="blog-inner">
          {!searchActive && featuredPost && regularPosts.length > 0 && (
            <RevealWrapper>
              <div className="mb-3 md:mb-6">
                <h2 className="text-2xl font-bold text-slate-900">More Articles</h2>
              </div>
            </RevealWrapper>
          )}

          {filteredPosts.length === 0 ? (
            <RevealWrapper>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No articles found</h3>
                <p className="text-slate-500 mb-6">
                  {searchActive 
                    ? `No articles match "${searchQuery}". Try a different search term.`
                    : `No articles in the "${selectedCategory}" category yet.`
                  }
                </p>
              </div>
            </RevealWrapper>
          ) : (
            <StaggerWrapper>
              <div className="blog-grid">
                {(searchActive || !featuredPost ? filteredPosts : regularPosts).map((post) => (
                  <StaggerItem key={post.id}>
                    <Link to={`/blog/${post.slug}`} className="block h-full group focus-ring-link">
                      <article className="h-full bg-white rounded-xl p-7 border border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:border-slate-300 flex flex-col">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.categories.slice(0, 2).map((category) => (
                            <span key={category} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                              {category}
                            </span>
                          ))}
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-slate-600 mb-4 leading-relaxed flex-grow">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-200">
                          <span>{formatDate(post.publishedAt)}</span>
                          <span>{post.readingTime}</span>
                        </div>
                      </article>
                    </Link>
                  </StaggerItem>
                ))}
              </div>
            </StaggerWrapper>
          )}
        </div>
      </section>
    </div>
  )
}

export default Blog