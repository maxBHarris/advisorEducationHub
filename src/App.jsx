import { Routes, Route } from 'react-router-dom'
import { useArticles } from './hooks/useArticles'
import Layout from './components/Layout'
import HomePage from './components/HomePage'
import ArticleView from './components/ArticleView'
import ChatBot from './components/ChatBot'

export default function App() {
  const { articles, categories } = useArticles()

  return (
    <>
      <Layout articles={articles} categories={categories}>
        <Routes>
          <Route path="/" element={<HomePage categories={categories} />} />
          <Route
            path="/article/:id"
            element={<ArticleView articles={articles} />}
          />
        </Routes>
      </Layout>
      <ChatBot articles={articles} />
    </>
  )
}
