import { useState, useRef, useEffect, useCallback } from 'react'

function searchArticles(articles, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1)
  if (terms.length === 0) return []

  return articles
    .map(article => {
      let score = 0
      const titleLower = article.title.toLowerCase()
      const subtitleLower = article.subtitle.toLowerCase()
      const contentLower = article.searchText

      for (const term of terms) {
        if (titleLower.includes(term)) score += 10
        if (subtitleLower.includes(term)) score += 5

        const contentMatches = (contentLower.match(new RegExp(term, 'g')) || []).length
        score += Math.min(contentMatches, 20)
      }

      return { ...article, score }
    })
    .filter(a => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

function extractRelevantPassages(article, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1)
  const sentences = article.content.split(/(?<=[.!?])\s+/)
  const scored = sentences.map(s => {
    const lower = s.toLowerCase()
    let score = 0
    for (const t of terms) {
      if (lower.includes(t)) score++
    }
    return { text: s, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.text.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim())
    .filter(s => s.length > 20)
}

function generateResponse(articles, query) {
  const matches = searchArticles(articles, query)

  if (matches.length === 0) {
    return {
      text: "I couldn't find specific information about that in our education materials. Try asking about alternative investments, private equity, private credit, real estate, infrastructure, SPVs, pre-IPO investing, registered funds, or the investment process.",
      sources: [],
    }
  }

  const passages = []
  const sources = []

  for (const article of matches) {
    const relevant = extractRelevantPassages(article, query)
    if (relevant.length > 0) {
      passages.push(...relevant)
      sources.push({ id: article.id, title: article.title })
    }
  }

  if (passages.length === 0) {
    const topArticle = matches[0]
    return {
      text: `Based on our materials, the article "${topArticle.title}" covers this topic. ${topArticle.subtitle}.`,
      sources: [{ id: topArticle.id, title: topArticle.title }],
    }
  }

  const responseText = passages.slice(0, 3).join('\n\n')
  return { text: responseText, sources }
}

export default function ChatBot({ articles }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm your Advisor Education assistant. Ask me anything about alternative investments, fund structures, asset classes, or the investment process. I'll search our knowledge base to find the most relevant information for you.",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return

    setMessages(prev => [...prev, { role: 'user', text: trimmed }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = generateResponse(articles, trimmed)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: response.text,
          sources: response.sources,
        },
      ])
      setIsTyping(false)
    }, 600)
  }, [input, articles])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="10" r="0.5" fill="currentColor" />
            <circle cx="8" cy="10" r="0.5" fill="currentColor" />
            <circle cx="16" cy="10" r="0.5" fill="currentColor" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <div className="chatbot-header-title">AI Assistant</div>
              <div className="chatbot-header-status">Search across all articles</div>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-message ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="chatbot-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                )}
                <div className="chatbot-bubble">
                  <div className="chatbot-text">{msg.text}</div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="chatbot-sources">
                      <div className="chatbot-sources-label">Sources:</div>
                      {msg.sources.map(s => (
                        <a
                          key={s.id}
                          href={`#/article/${s.id}`}
                          className="chatbot-source-link"
                          onClick={() => setIsOpen(false)}
                        >
                          {s.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chatbot-message assistant">
                <div className="chatbot-avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="chatbot-bubble">
                  <div className="chatbot-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about alternative investments..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chatbot-send"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
