import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogCategories, getPostsByCategory, searchPosts } from '../data/blog'
import { RevealWrapper, StaggerWrapper, StaggerItem } from '../components/ScrollReveal'

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchActive, setSearchActive] = useState(false)

  // Filter posts based on category and search
  const filteredPosts = useMemo(() => {
    if (searchQuery.trim()) {
      return searchPosts(searchQuery)
    }
    return getPostsByCategory(selectedCategory)
  }, [selectedCategory, searchQuery])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <RevealWrapper>
            <motion.h1 
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Blog
            </motion.h1>
          </RevealWrapper>
          
          <RevealWrapper delay={0.2}>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Insights on web development, AI integration, and building scalable applications. 
              Sharing knowledge from over 11 years of experience in the industry.
            </p>
          </RevealWrapper>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealWrapper>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              {/* Search Bar */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-4 py-3 pl-12 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchActive && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Category Filters */}
              {!searchActive && (
                <div className="flex flex-wrap gap-3">
                  {blogCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              {/* Search Results Info */}
              {searchActive && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
                </div>
              )}
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && !searchActive && (
        <section className="pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <RevealWrapper>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Featured Article</h2>
              </div>
              
              <Link to={`/blog/${featuredPost.slug}`} className="block group">
                <motion.article 
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-blue-200/50 dark:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:-translate-y-1"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredPost.categories.map((category) => (
                      <span key={category} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-4">
                      <span>{featuredPost.publishedAt}</span>
                      <span>{featuredPost.readingTime}</span>
                    </div>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">Featured</span>
                  </div>
                </motion.article>
              </Link>
            </RevealWrapper>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {!searchActive && featuredPost && regularPosts.length > 0 && (
            <RevealWrapper>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">More Articles</h2>
              </div>
            </RevealWrapper>
          )}

          {filteredPosts.length === 0 ? (
            <RevealWrapper>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">No articles found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  {searchActive 
                    ? `No articles match "${searchQuery}". Try a different search term.`
                    : `No articles in the "${selectedCategory}" category yet.`
                  }
                </p>
                {searchActive && (
                  <button
                    onClick={clearSearch}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </RevealWrapper>
          ) : (
            <StaggerWrapper>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchActive || !featuredPost ? filteredPosts : regularPosts).map((post) => (
                  <StaggerItem key={post.id}>
                    <Link to={`/blog/${post.slug}`} className="block h-full group">
                      <motion.article 
                        className="h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/20 hover:-translate-y-1 flex flex-col"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.categories.slice(0, 2).map((category) => (
                            <span key={category} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full">
                              {category}
                            </span>
                          ))}
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed flex-grow">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                          <span>{post.publishedAt}</span>
                          <span>{post.readingTime}</span>
                        </div>
                      </motion.article>
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