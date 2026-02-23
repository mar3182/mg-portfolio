import { useParams, Link, Navigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { getPostBySlug, getRecentPosts } from '../data/blog'
import { RevealWrapper } from '../components/ScrollReveal'
import { useEffect, useMemo, useState } from 'react'

const BlogPost = () => {
  const { slug } = useParams()
  const post = getPostBySlug(slug)
  const recentPosts = getRecentPosts(3).filter(p => p?.slug !== slug)
  const [copied, setCopied] = useState(false)

  const shareData = useMemo(() => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://example.com/blog/${post?.slug ?? ''}`
    const text = post?.title ?? 'Check this out'
    const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    return { url, text, x, li }
  }, [post])

  const copyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url)
      } else {
        const el = document.createElement('input')
        el.value = shareData.url
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch (e) {
      // non-fatal: clipboard API may be unavailable
      console.warn('Copy to clipboard failed', e)
    }
  }

  const formatDate = (iso) => {
    try {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
    } catch {
      return iso
    }
  }

  // Update page title and meta description
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Mary Garcia Portfolio`
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', post.seo.metaDescription)
      }

      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]')
      if (metaKeywords) {
        metaKeywords.setAttribute('content', post.seo.keywords.join(', '))
      }
    }

    // Cleanup on unmount
    return () => {
      document.title = 'Mary Garcia | Full-Stack Developer & AI Integration Specialist'
      const metaDescription = document.querySelector('meta[name="description"]')
      const metaKeywords = document.querySelector('meta[name="keywords"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Experienced full-stack developer specializing in React, PHP, and AI integration. 11+ years building scalable web applications.')
      }
      if (metaKeywords) {
        metaKeywords.setAttribute('content', 'Full-stack developer, React, PHP, AI integration, web development')
      }
    }
  }, [post])

  // Redirect to 404 if post not found
  if (!post) {
    return <Navigate to="/404" replace />
  }

  // Format content with basic markdown-like rendering
  const formatContent = (content) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        // Handle headings
        if (paragraph.startsWith('# ')) {
          return <h1 key={index} className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-6 mt-8">{paragraph.slice(2)}</h1>
        }
        if (paragraph.startsWith('## ')) {
          return <h2 key={index} className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4 mt-8">{paragraph.slice(3)}</h2>
        }
        if (paragraph.startsWith('### ')) {
          return <h3 key={index} className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4 mt-6">{paragraph.slice(4)}</h3>
        }

        // Handle code blocks
        if (paragraph.startsWith('```')) {
          const lines = paragraph.split('\n')
          const language = lines[0].slice(3)
          const code = lines.slice(1, -1).join('\n')
          return (
            <div key={index} className="mb-6">
              <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto">
                <code className={`language-${language}`}>{code}</code>
              </pre>
            </div>
          )
        }

        // Handle bullet points
        if (paragraph.includes('\n- ')) {
          const items = paragraph.split('\n- ').filter(item => item.trim())
          return (
            <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-slate-600 dark:text-slate-300">
              {items.map((item, itemIndex) => (
                <li key={itemIndex} className="leading-relaxed">{item.replace(/^- /, '')}</li>
              ))}
            </ul>
          )
        }

        // Handle numbered lists
        if (/^\d+\./.test(paragraph)) {
          const items = paragraph.split(/\n\d+\./).filter(item => item.trim())
          return (
            <ol key={index} className="list-decimal list-inside space-y-2 mb-6 text-slate-600 dark:text-slate-300">
              {items.map((item, itemIndex) => (
                <li key={itemIndex} className="leading-relaxed">{item.replace(/^\d+\.\s*/, '')}</li>
              ))}
            </ol>
          )
        }

        // Handle inline code with backticks
        const processInlineCode = (text) => {
          return text.split('`').map((part, i) => 
            i % 2 === 1 ? 
              <code key={i} className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm text-blue-600 dark:text-blue-400">{part}</code> : 
              part
          )
        }

        // Handle bold text
        const processBold = (text) => {
          if (Array.isArray(text)) {
            return text.map((part, i) => 
              typeof part === 'string' ? 
                part.split(/\*\*(.*?)\*\*/g).map((segment, j) => 
                  j % 2 === 1 ? <strong key={`${i}-${j}`} className="font-semibold">{segment}</strong> : segment
                ) : part
            ).flat()
          }
          return text.split(/\*\*(.*?)\*\*/g).map((part, i) => 
            i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
          )
        }

        // Regular paragraphs
        if (paragraph.trim()) {
          return (
            <p key={index} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {processBold(processInlineCode(paragraph))}
            </p>
          )
        }

        return null
      })
      .filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Back Navigation */}
      <div className="pt-24 pb-8 px-6">
        <div className="blog-inner">
          <RevealWrapper>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-8 group focus-ring-link"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </RevealWrapper>
        </div>
      </div>

      {/* Article Header */}
      <header className="pb-12 px-6">
        <div className="blog-inner">
          <RevealWrapper>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category) => (
                <span key={category} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                  {category}
                </span>
              ))}
            </div>
            
            <Motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-slate-200 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {post.title}
            </Motion.h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
              <div className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  MG
                </div>
                <span>{post.author}</span>
              </div>
                <span>{formatDate(post.publishedAt)}</span>
              <span>{post.readingTime}</span>
                {post.updatedAt !== post.publishedAt && (
                  <span>Updated {formatDate(post.updatedAt)}</span>
              )}
            </div>
          </RevealWrapper>
        </div>
      </header>

          {/* Author bio + Share */}
          <section className="pb-8 px-6">
            <div className="blog-inner">
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold" aria-hidden="true">MG</div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{post.author}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Full‑Stack Developer & AI Integration</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <a href={shareData.x} target="_blank" rel="noopener noreferrer" className="btn btn-ghost icon-button" aria-label="Share on X (formerly Twitter)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2H21l-6.52 7.455L22 22h-6.955l-4.73-6.16L4.8 22H2l7.09-8.09L2 2h7.045l4.39 5.86L18.244 2Zm-1.217 18h2.023L7.05 4h-2L17.027 20Z"/></svg>
                    <span className="sr-only">Share on X</span>
                  </a>
                  <a href={shareData.li} target="_blank" rel="noopener noreferrer" className="btn btn-ghost icon-button" aria-label="Share on LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0zM8.98 8.98H14v2.05h.08c.7-1.33 2.42-2.72 4.98-2.72 5.32 0 6.3 3.5 6.3 8.06V24h-5v-6.98c0-1.66-.03-3.8-2.32-3.8-2.33 0-2.68 1.82-2.68 3.68V24h-5z"/></svg>
                    <span className="sr-only">Share on LinkedIn</span>
                  </a>
                  <button type="button" onClick={copyLink} className="btn btn-ghost icon-button" aria-label="Copy link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    <span className="sr-only">Copy link</span>
                  </button>
                  <span aria-live="polite" className="visually-hidden">{copied ? 'Link copied to clipboard' : ''}</span>
                </div>
              </div>
            </div>
          </section>

      {/* Article Content */}
      <main className="pb-16 px-6">
        <div className="blog-inner">
          <RevealWrapper>
            <article className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-200/50 dark:border-slate-700/50 prose prose-slate dark:prose-invert max-w-3xl mx-auto">
              {formatContent(post.content)}
            </article>
          </RevealWrapper>
        </div>
      </main>

      {/* Tags */}
      <section className="pb-16 px-6">
        <div className="blog-inner">
          <RevealWrapper>
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* Related Articles */}
      {recentPosts.length > 0 && (
        <section className="pb-24 px-6">
          <div className="blog-inner">
            <RevealWrapper>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-8">More Articles</h2>
              
              <div
                className="grid md:grid-cols-2 lg:grid-cols-3"
                style={{ columnGap: '6rem', rowGap: '5.5rem' }}
              >
                {recentPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="block group focus-ring-link">
                    <Motion.article 
                      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-7 md:p-8 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/20 hover:-translate-y-1 h-full flex flex-col"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-wrap gap-2 mb-5">
                        {relatedPost.categories.slice(0, 2).map((category) => (
                          <span key={category} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full">
                            {category}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-300 mb-5 leading-relaxed flex-grow text-sm">
                        {relatedPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-5 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span>{formatDate(relatedPost.publishedAt)}</span>
                        <span>{relatedPost.readingTime}</span>
                      </div>
                    </Motion.article>
                  </Link>
                ))}
              </div>
            </RevealWrapper>
          </div>
        </section>
      )}
    </div>
  )
}

export default BlogPost