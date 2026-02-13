import { useState, useCallback } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ articles, categories, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => setSidebarOpen(o => !o), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  return (
    <div className="app">
      <Header
        articles={articles}
        onToggleSidebar={toggleSidebar}
      />
      <div className={`overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar} />
      <div className="layout">
        <Sidebar
          categories={categories}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />
        <main className="main">
          {children}
        </main>
      </div>
    </div>
  )
}
