import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Header({ articles, onToggleSidebar }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  function handleSearch(q) {
    setQuery(q)
    const trimmed = q.trim().toLowerCase()
    if (trimmed.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    const terms = trimmed.split(/\s+/)
    const matches = articles.filter(a =>
      terms.every(t => a.searchText.includes(t))
    ).slice(0, 8)

    setResults(matches)
    setShowResults(true)
  }

  function selectResult(id) {
    navigate(`/article/${id}`)
    setQuery('')
    setShowResults(false)
  }

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <header className="header">
      <button className="hamburger" onClick={onToggleSidebar} aria-label="Menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <Link to="/" className="header-brand">
        <div className="header-logo">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 80 L10 35 L30 55 L50 15 L70 55 L90 35 L90 80" stroke="#4A9EE8" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        <div>
          <div className="header-title">Advisor Education Hub</div>
          <div className="header-subtitle">Powered by Monark Markets</div>
        </div>
      </Link>
      <div className="header-search" ref={searchRef}>
        <span className="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setShowResults(true)}
          autoComplete="off"
        />
        {showResults && (
          <div className="search-results active">
            {results.length === 0 ? (
              <div className="search-no-results">No results found</div>
            ) : (
              results.map(r => (
                <div
                  key={r.id}
                  className="search-result-item"
                  onClick={() => selectResult(r.id)}
                >
                  <div className="search-result-title">{r.title}</div>
                  <div className="search-result-excerpt">{r.subtitle}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  )
}
