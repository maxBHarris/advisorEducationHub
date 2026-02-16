import { useMemo } from 'react'

function parseFrontmatter(raw) {
  // Normalize line endings to Unix format first (handle Windows \r\n)
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Match YAML frontmatter between --- delimiters
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { meta: {}, content: normalized }

  const frontmatter = match[1]
  let content = match[2].trim() // Trim to remove leading/trailing whitespace
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

  // Remove any duplicate H1 title from content if it matches the frontmatter title
  if (meta.title) {
    const h1Regex = new RegExp(`^#\\s+${meta.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\n`, 'i')
    content = content.replace(h1Regex, '')
  }

  return { meta, content }
}

// Helper function to convert folder name to title
function folderToTitle(folderName) {
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper function to get category order (for consistent display)
function getCategoryOrder(categoryId) {
  const orderMap = {
    'fundamentals': 1,
    'asset-classes': 2,
    'process': 3,
    'manager-research': 4
  }
  return orderMap[categoryId] || 999
}

// Dynamically import all markdown files from content directory
const mdModules = import.meta.glob('/src/content/**/*.md', { eager: true, query: '?raw', import: 'default' })

export function useArticles() {
  return useMemo(() => {
    const articles = []
    const categories = {}

    // Process each markdown file
    for (const [path, raw] of Object.entries(mdModules)) {
      const { meta, content } = parseFrontmatter(raw)
      const filename = path.split('/').pop().replace('.md', '')
      const id = filename

      // Extract folder name from path (e.g., /src/content/asset-classes/article.md -> asset-classes)
      const pathParts = path.split('/')
      const contentIndex = pathParts.indexOf('content')
      const folderName = pathParts[contentIndex + 1]

      // Use folder name as category if not specified in frontmatter
      const category = meta.category || folderName
      const categoryTitle = meta.categoryTitle || folderToTitle(folderName)

      const article = {
        id,
        title: meta.title || filename,
        subtitle: meta.subtitle || '',
        category,
        categoryTitle,
        order: meta.order || 99,
        content,
        searchText: (meta.title + ' ' + meta.subtitle + ' ' + content).toLowerCase(),
      }
      articles.push(article)

      // Create category if it doesn't exist
      if (!categories[category]) {
        categories[category] = {
          id: category,
          title: categoryTitle,
          articles: [],
          order: getCategoryOrder(category)
        }
      }
      categories[category].articles.push(article)
    }

    // Sort articles within each category by their order
    for (const cat of Object.values(categories)) {
      cat.articles.sort((a, b) => a.order - b.order)
    }

    // Sort categories by their predefined order, then alphabetically
    const orderedCategories = Object.values(categories).sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order
      }
      return a.title.localeCompare(b.title)
    })

    return { articles, categories: orderedCategories }
  }, [])
}
