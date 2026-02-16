import { useMemo } from 'react'

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { meta: {}, content: raw }

  const frontmatter = match[1]
  const content = match[2]
  const meta = {}

  for (const line of frontmatter.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
    if (key === 'order') val = parseInt(val, 10)
    meta[key] = val
  }

  return { meta, content }
}

const mdModules = import.meta.glob('/src/content/**/*.md', { eager: true, query: '?raw', import: 'default' })

export function useArticles() {
  return useMemo(() => {
    const articles = []
    const categories = {}

    for (const [path, raw] of Object.entries(mdModules)) {
      const { meta, content } = parseFrontmatter(raw)
      const filename = path.split('/').pop().replace('.md', '')
      const id = filename

      const article = {
        id,
        title: meta.title || filename,
        subtitle: meta.subtitle || '',
        category: meta.category || 'uncategorized',
        categoryTitle: meta.categoryTitle || meta.category || 'Other',
        order: meta.order || 99,
        content,
        searchText: (meta.title + ' ' + meta.subtitle + ' ' + content).toLowerCase(),
      }
      articles.push(article)

      if (!categories[article.category]) {
        categories[article.category] = {
          id: article.category,
          title: article.categoryTitle,
          articles: [],
        }
      }
      categories[article.category].articles.push(article)
    }

    // Sort articles within each category
    for (const cat of Object.values(categories)) {
      cat.articles.sort((a, b) => a.order - b.order)
    }

    // Order categories
    const categoryOrder = ['fundamentals', 'asset-classes', 'process', 'manager-research']
    const orderedCategories = categoryOrder
      .map(id => categories[id])
      .filter(Boolean)
      .concat(
        Object.values(categories).filter(c => !categoryOrder.includes(c.id))
      )

    return { articles, categories: orderedCategories }
  }, [])
}
