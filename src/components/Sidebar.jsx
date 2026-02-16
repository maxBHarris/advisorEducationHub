import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

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
  'manager-research': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><path d="M11 8v6" /><path d="M8 11h6" />
    </svg>
  ),
}

export default function Sidebar({ categories, isOpen, onClose }) {
  const [collapsed, setCollapsed] = useState({})
  const location = useLocation()

  function toggleCategory(catId) {
    setCollapsed(prev => ({ ...prev, [catId]: !prev[catId] }))
  }

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      <NavLink
        to="/"
        className={({ isActive }) => `sidebar-home ${isActive && location.pathname === '/' ? 'active' : ''}`}
        onClick={onClose}
        end
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Home
      </NavLink>

      {categories.map(cat => (
        <div key={cat.id} className={`sidebar-category ${collapsed[cat.id] ? 'collapsed' : ''}`}>
          <div className="sidebar-category-title" onClick={() => toggleCategory(cat.id)}>
            <span className="sidebar-category-icon">
              {categoryIcons[cat.id] || categoryIcons.fundamentals}
            </span>
            {cat.title}
            <span className="sidebar-chevron">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
          <div className="sidebar-category-links">
            {cat.articles.map(article => (
              <NavLink
                key={article.id}
                to={`/article/${article.id}`}
                className={({ isActive }) => `sidebar-article-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                {article.title}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}
