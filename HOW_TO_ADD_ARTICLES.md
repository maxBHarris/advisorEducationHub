# How to Add New Articles to Alts Hub

This guide explains how to add new educational articles to the Alts Hub platform.

## Quick Start

Articles are automatically loaded from markdown (`.md`) files in the `/src/content/` directory. The system scans all subdirectories and loads articles based on their frontmatter metadata.

## Step-by-Step Guide

### 1. Choose a Category

Navigate to the appropriate category folder in `/src/content/`:

- `fundamentals/` - Core concepts about alternative investments
- `asset-classes/` - Specific asset class tear sheets (PE, RE, Infrastructure, etc.)
- `process/` - Investment process and operational guidance
- `manager-research/` - Manager profiles and educational resources

### 2. Create a New Markdown File

Create a new `.md` file in your chosen category folder. The filename should be descriptive and use kebab-case (lowercase with hyphens):

```
good-examples:
- private-equity-fundamentals.md
- real-estate-investing.md
- due-diligence-checklist.md

avoid:
- Article1.md
- my article.md
- PRIVATE_EQUITY.md
```

### 3. Add Frontmatter

Every article must start with YAML frontmatter (metadata) between `---` markers:

```markdown
---
title: "Article Title"
subtitle: "Brief description or tagline"
category: "fundamentals"
categoryTitle: "Fundamentals"
order: 1
---
```

**Frontmatter Fields:**

- `title` (required): The article's display title
- `subtitle` (required): A brief description shown in article cards
- `category` (required): Must match the folder name (fundamentals, asset-classes, process, manager-research)
- `categoryTitle` (required): The display name for the category
- `order` (required): Number to control article ordering within the category (lower numbers appear first)

### 4. Write Your Content

After the frontmatter, write your article content using standard Markdown syntax:

```markdown
---
title: "Understanding Private Equity"
subtitle: "An introduction to PE investment structures and strategies"
category: "fundamentals"
categoryTitle: "Fundamentals"
order: 1
---

## Introduction

Private equity (PE) is a form of alternative investment...

## Key Concepts

### Investment Structure

Private equity funds typically operate as...

### Return Drivers

Returns in PE come from three main sources:
- Multiple expansion
- Operational improvements
- Financial engineering

## Conclusion

Understanding these fundamentals is essential for...
```

### 5. Save and Reload

1. Save your markdown file
2. The Vite dev server will automatically detect the new file
3. Refresh your browser to see the new article

**Note:** If running in production, you'll need to rebuild the application with `npm run build`

## Markdown Features Supported

The platform supports GitHub Flavored Markdown (GFM) including:

- **Headers**: `#`, `##`, `###` (avoid using `#` as it's reserved for article titles)
- **Bold**: `**text**` or `__text__`
- **Italic**: `*text*` or `_text_`
- **Lists**: Bulleted (`-`, `*`) and numbered (`1.`, `2.`)
- **Links**: `[text](url)`
- **Blockquotes**: `> quote text`
- **Code blocks**: Triple backticks with optional language
- **Tables**: Standard markdown table syntax
- **Inline code**: Single backticks

## Example Article Templates

### Asset Class Template

```markdown
---
title: "Private Credit"
subtitle: "Direct lending and private debt investment strategies"
category: "asset-classes"
categoryTitle: "Asset Classes"
order: 2
---

## Overview

Brief introduction to the asset class...

## Investment Characteristics

- **Return Profile**: Description
- **Risk Level**: Description
- **Liquidity**: Description
- **Minimum Investment**: Description

## Key Strategies

### Strategy 1
Details...

### Strategy 2
Details...

## Portfolio Fit

Where this asset class fits in a diversified portfolio...

## Due Diligence Considerations

Key factors to evaluate...
```

### Process Article Template

```markdown
---
title: "Manager Selection Process"
subtitle: "How to evaluate and select alternative investment managers"
category: "process"
categoryTitle: "The Investment Process"
order: 3
---

## Introduction

Why manager selection matters...

## Step 1: Initial Screening

Criteria for preliminary evaluation...

## Step 2: Deep Dive

Detailed analysis factors...

## Step 3: Final Selection

Making the decision...

## Ongoing Monitoring

Post-investment oversight...
```

## Adding a New Category

To add an entirely new category:

1. Create a new folder in `/src/content/` (e.g., `risk-management/`)
2. Add the category to the order array in `/src/hooks/useArticles.js`:

```javascript
const categoryOrder = ['fundamentals', 'asset-classes', 'process', 'manager-research', 'your-new-category']
```

3. Add an icon for the new category in:
   - `/src/components/HomePage.jsx` - in the `categoryIcons` object
   - `/src/components/Sidebar.jsx` - in the `categoryIcons` object

4. Add a description in `/src/components/HomePage.jsx` in the `category-desc` section

## Troubleshooting

**Article not showing up?**
- Check that frontmatter is properly formatted with `---` on separate lines
- Ensure the `category` field matches the folder name exactly
- Verify the file has a `.md` extension
- Check the browser console for any errors

**Article appears in wrong order?**
- Articles are sorted by the `order` field (lowest number first)
- Check that your `order` value is a number, not a string

**Images not loading?**
- Place images in `/public/images/`
- Reference them as `/images/your-image.png` in markdown
- Use relative paths for best compatibility

## Best Practices

1. **Descriptive Titles**: Use clear, specific titles that accurately describe the content
2. **Concise Subtitles**: Keep subtitles under 100 characters
3. **Logical Ordering**: Use order numbers with gaps (10, 20, 30) to allow easy insertion of new articles
4. **Consistent Formatting**: Follow the same markdown structure across similar articles
5. **Link Related Content**: Cross-reference related articles using markdown links
6. **Regular Updates**: Keep content current and accurate

## Getting Help

For questions or issues with adding articles, contact the development team or open an issue in the repository.
