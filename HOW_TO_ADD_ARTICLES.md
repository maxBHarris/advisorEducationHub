# How to Add New Articles to Altruist Alts Hub

This guide explains how to add new educational articles to the Altruist Alts Hub platform.

## Quick Start

Articles are automatically loaded from markdown (`.md`) files in the `/src/content/` directory. The system automatically:
- Scans all subdirectories in `/src/content/`
- Creates navigation sections based on folder names
- Loads articles with their metadata from frontmatter
- **Automatically hides the frontmatter** from the displayed content

**Note:** The YAML frontmatter (the section between `---` markers) is required but is automatically stripped before displaying content to users.

## Step-by-Step Guide

### 1. Choose or Create a Category

Navigate to an existing category folder in `/src/content/`, or create a new one:

**Existing categories:**
- `fundamentals/` - Core concepts about alternative investments
- `asset-classes/` - Specific asset class tear sheets (PE, RE, Infrastructure, etc.)
- `process/` - Investment process and operational guidance
- `manager-research/` - Manager profiles and educational resources

**To create a new category:**
Simply create a new folder in `/src/content/` (e.g., `tax-strategies/` or `compliance/`). The system will automatically:
- Convert the folder name to a title (e.g., `tax-strategies` → "Tax Strategies")
- Add it to the navigation and homepage
- No code changes required!

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

Every article must start with YAML frontmatter (metadata) between `---` markers. **This frontmatter is automatically hidden from users** - they will only see the content below it.

```markdown
---
title: "Article Title"
subtitle: "Brief description or tagline"
order: 1
---
```

**Frontmatter Fields:**

- `title` (required): The article's display title
- `subtitle` (required): A brief description shown in article cards
- `order` (optional, default: 99): Number to control article ordering within the category (lower numbers appear first)
- `category` (optional): Override the folder-based category
- `categoryTitle` (optional): Override the auto-generated category title

**Note:** The `category` and `categoryTitle` fields are optional. If not specified, the system automatically uses the folder name.

### 4. Write Your Content

After the frontmatter, write your article content using standard Markdown syntax:

```markdown
---
title: "Understanding Private Equity"
subtitle: "An introduction to PE investment structures and strategies"
order: 1
---

## Introduction

Private equity (PE) is a form of alternative investment...

**Note:** The frontmatter above will not be visible to users - only the content starting from "## Introduction" will be displayed.

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
- **iframes**: Embed videos, forms, and interactive content (see below)

### Embedding iframes

You can embed interactive content directly in articles using HTML iframe tags:

```html
<!-- YouTube video (automatically wrapped in responsive container) -->
<iframe src="https://www.youtube.com/embed/VIDEO_ID" width="560" height="315" frameborder="0" allowfullscreen></iframe>

<!-- Google Form -->
<iframe src="https://docs.google.com/forms/d/e/FORM_ID/viewform" width="100%" height="500"></iframe>

<!-- Other interactive content -->
<iframe src="https://example.com/calculator" width="100%" height="600"></iframe>
```

## Example Article Templates

### Asset Class Template

```markdown
---
title: "Private Credit"
subtitle: "Direct lending and private debt investment strategies"
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

1. **Create a new folder** in `/src/content/` (e.g., `risk-management/` or `tax-strategies/`)
2. **Add markdown files** to the folder with proper frontmatter
3. **Done!** The category will automatically appear in navigation and on the homepage

**Optional customizations:**
- To control category order, edit the `getCategoryOrder` function in `/src/hooks/useArticles.js`
- To add a custom icon, add it to the `categoryIcons` object in `/src/components/HomePage.jsx` and `/src/components/Sidebar.jsx`
- To add a custom description, add it to the `categoryDescriptions` object in `/src/components/HomePage.jsx`

The system provides sensible defaults for all of these, so customization is optional!

## Troubleshooting

**Article not showing up?**
- Check that frontmatter is properly formatted with `---` on separate lines
- Verify the file has a `.md` extension
- Ensure `title` and `subtitle` fields are present in frontmatter
- Check the browser console for any errors
- Restart the dev server if files were added while it was running

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
