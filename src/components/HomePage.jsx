import { Link } from 'react-router-dom'

const categoryIcons = {
  fundamentals: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  'asset-classes': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  process: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M9 14l2 2 4-4" />
    </svg>
  ),
}

export default function HomePage({ categories }) {
  const totalArticles = categories.reduce((sum, c) => sum + c.articles.length, 0)

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero-badge">Alternative Investments Knowledge Center</div>
        <h1>Advisor Education Hub</h1>
        <p>
          Your comprehensive resource for understanding alternative investments.
          Explore asset classes, learn about investment structures and processes,
          and build the knowledge you need to serve your clients with confidence.
        </p>
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-number">{categories.filter(c => c.id === 'asset-classes')[0]?.articles.length || 4}</div>
            <div className="stat-label">Asset Classes Covered</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalArticles}</div>
            <div className="stat-label">Educational Articles</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{categories.length}</div>
            <div className="stat-label">Learning Paths</div>
          </div>
        </div>
      </div>

      {categories.map(cat => (
        <section key={cat.id} className="category-section">
          <div className="category-header">
            <div className="category-icon">
              {categoryIcons[cat.id] || categoryIcons.fundamentals}
            </div>
            <div>
              <h2 className="category-title">{cat.title}</h2>
              <p className="category-desc">
                {cat.id === 'fundamentals' && 'Core concepts every advisor needs to know about alternative investments'}
                {cat.id === 'asset-classes' && 'Comprehensive tear sheets covering each major alternative asset class'}
                {cat.id === 'process' && 'Step-by-step guidance through making and managing alternative investments'}
              </p>
            </div>
          </div>
          <div className="articles-grid">
            {cat.articles.map(article => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="article-card"
              >
                <div className="article-card-title">{article.title}</div>
                <div className="article-card-desc">{article.subtitle}</div>
                <span className="article-card-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
