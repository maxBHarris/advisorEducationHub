import { useMemo, useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export default function ArticleView({ articles }) {
  const { id } = useParams()
  const [activeSection, setActiveSection] = useState('')
  const article = articles.find(a => a.id === id)

  // Extract headings for TOC
  const headings = useMemo(() => {
    if (!article) return []
    const h = []
    const regex = /^(#{2,3})\s+(.+)$/gm
    let match
    while ((match = regex.exec(article.content)) !== null) {
      h.push({
        level: match[1].length,
        text: match[2],
        id: slugify(match[2]),
      })
    }
    return h
  }, [article])

  // Scroll tracking for TOC
  useEffect(() => {
    function onScroll() {
      const sections = document.querySelectorAll('.article-body h2[id], .article-body h3[id]')
      let current = ''
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= 100) current = s.id
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [id])

  // Scroll to article content on article change (skip header)
  useEffect(() => {
    // Scroll to the article content, not the absolute top
    const articleElement = document.querySelector('.article-content')
    if (articleElement) {
      const headerOffset = 80 // Account for fixed header
      const elementPosition = articleElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: 'instant' })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [id])

  const scrollToSection = useCallback((sectionId) => {
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  if (!article) {
    return (
      <div className="article-not-found">
        <h2>Article Not Found</h2>
        <p>The requested article could not be found.</p>
        <Link to="/">Return Home</Link>
      </div>
    )
  }

  return (
    <div className="article-panel">
      <div className="article-layout">
        {headings.length > 0 && (
          <aside className="article-toc">
            <div className="toc-header">On This Page</div>
            <nav className="toc-nav">
              {headings.map(h => (
                <button
                  key={h.id}
                  className={`toc-link ${h.level === 3 ? 'toc-link-sub' : ''} ${activeSection === h.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(h.id)}
                >
                  {h.text}
                </button>
              ))}
            </nav>
          </aside>
        )}
        <article className="article-content">
          <div className="article-breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>{article.title}</span>
          </div>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-subtitle">{article.subtitle}</p>
          <div className="article-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                // Skip H1 headers - title is already displayed from frontmatter
                h1: () => null,
                h2: ({ children, ...props }) => {
                  const text = typeof children === 'string' ? children : children?.toString() || ''
                  const hId = slugify(text)
                  return <h2 id={hId} className="section-heading" {...props}>{children}</h2>
                },
                h3: ({ children, ...props }) => {
                  const text = typeof children === 'string' ? children : children?.toString() || ''
                  const hId = slugify(text)
                  return <h3 id={hId} className="section-heading" {...props}>{children}</h3>
                },
                // Custom iframe rendering with responsive wrapper
                iframe: ({ node, ...props }) => {
                  const src = props.src || ''
                  // Check if it's a YouTube video
                  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be')

                  if (isYouTube) {
                    return (
                      <div className="video-embed">
                        <iframe {...props} allowFullScreen />
                      </div>
                    )
                  }

                  // For other iframes, render with some basic styling
                  return (
                    <div style={{ margin: '24px 0', borderRadius: '8px', overflow: 'hidden' }}>
                      <iframe {...props} style={{ width: '100%', minHeight: '400px', border: 'none' }} />
                    </div>
                  )
                }
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
}
