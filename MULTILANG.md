# Multi-Language Blog Setup

This blog supports three languages: English (en), Swedish (se), and Romanian (ro).

## Features

### Smart Language Switching
- Language preference is stored in browser localStorage
- When you switch languages, the system tries to show the same page in the new language
- If the page doesn't exist in the target language, you'll be redirected to that language's home page
- The "Home" link always takes you to your preferred language

### How It Works

1. **Root Path (`/`)**: Automatically redirects to your preferred language home page
2. **Language Switcher**: Click EN, SE, or RO to switch languages
3. **Persistent Preference**: Your language choice is remembered across visits
4. **Smart Page Matching**: Tries to show the current page in the selected language

## Directory Structure

```
content/
├── en/                  # English content
│   ├── index.njk       # English home page
│   ├── blog.njk        # English blog archive
│   └── blog/           # English blog posts
├── se/                  # Swedish content
│   ├── index.njk       # Swedish home page
│   ├── blog.njk        # Swedish blog archive
│   └── blog/           # Swedish blog posts
└── ro/                  # Romanian content
    ├── index.njk       # Romanian home page
    ├── blog.njk        # Romanian blog archive
    └── blog/           # Romanian blog posts
```

## Adding Content

### Adding a New Blog Post

Create a markdown file in the appropriate language folder:

**English** (`content/en/blog/my-post.md`):
```markdown
---
title: My Post Title
description: A short description
date: 2025-01-27
tags:
  - technology
---

Your content here...
```

**Swedish** (`content/se/blog/my-post.md`):
```markdown
---
title: Min artikeltitel
description: En kort beskrivning
date: 2025-01-27
tags:
  - teknologi
---

Ditt innehåll här...
```

**Romanian** (`content/ro/blog/my-post.md`):
```markdown
---
title: Titlul articolului meu
description: O scurtă descriere
date: 2025-01-27
tags:
  - tehnologie
---

Conținutul tău aici...
```

### Translations Data

UI translations are stored in [_data/i18n.js](_data/i18n.js). Add new translation keys there for any UI elements you need.

## Technical Details

### Language Detection
- Uses `localStorage` to remember user preference
- Falls back to English if no preference is set
- Updates preference whenever a user switches languages

### URL Structure
- English: `/en/`, `/en/blog/`, `/en/blog/post-name/`
- Swedish: `/se/`, `/se/blog/`, `/se/blog/post-name/`
- Romanian: `/ro/`, `/ro/blog/`, `/ro/blog/post-name/`

### Page Matching Algorithm
When you switch languages, the system:
1. Detects the current page path
2. Replaces the language code in the URL
3. Attempts to navigate to that URL
4. Falls back to language home if page doesn't exist

## Customization

### Adding a New Language

1. Create new language folders:
   ```bash
   mkdir -p content/xx/blog
   ```

2. Add language collections in [eleventy.config.js](eleventy.config.js):
   ```javascript
   eleventyConfig.addCollection("posts_xx", function(collectionApi) {
     return collectionApi.getFilteredByGlob("content/xx/blog/**/*.md").sort((a, b) => {
       return a.date - b.date;
     });
   });
   ```

3. Create home and blog pages (use existing ones as templates)

4. Add translations to [_data/i18n.js](_data/i18n.js)

5. Update language switcher in [_includes/layouts/base.njk](_includes/layouts/base.njk)

6. Update [public/js/language-switcher.js](public/js/language-switcher.js) to include new language code

## Deployment

The site is ready for GitHub Pages deployment with the included [.github/workflows/deploy.yml](.github/workflows/deploy.yml) workflow.
