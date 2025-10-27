# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-language blog built with Eleventy v3 (11ty), a static site generator. The blog supports three languages: English (en), Swedish (se), and Romanian (ro). It's based on the eleventy-base-blog v9 starter template but has been heavily customized for multi-language support with client-side language switching and localStorage persistence.

The site features:
- Zero-JavaScript content rendering (except for language switching)
- Fully static output to `_site/` directory
- Client-side language preference persistence
- Smart page matching when switching languages
- Language-specific collections and URLs

## Build Commands

From package.json:

```bash
npm run build          # Production build to _site/
npm run start          # Development server with live reload
npm run debug          # Debug mode showing Eleventy internals
npm run debugstart     # Debug mode with dev server
npm run benchmark      # Benchmark build performance
```

## Multi-Language Architecture

### URL Structure

All content is organized by language code:
- English: `/en/`, `/en/blog/`, `/en/blog/post-name/`
- Swedish: `/se/`, `/se/blog/`, `/se/blog/post-name/`
- Romanian: `/ro/`, `/ro/blog/`, `/ro/blog/post-name/`

Root path (`/`) automatically redirects to user's preferred language (stored in localStorage, defaults to English).

### Directory Structure

```
content/
├── index.njk                    # Root redirect page (/)
├── en/                          # English content
│   ├── index.njk               # English home page
│   ├── blog.njk                # English blog archive
│   ├── about.md                # English about page
│   └── blog/                   # English blog posts
│       ├── blog.11tydata.js    # Blog post config (tags, permalink, layout)
│       └── *.md                # Individual blog posts
├── se/                          # Swedish content (same structure)
└── ro/                          # Romanian content (same structure)
```

### Language Collections

Defined in `/Users/alex/Projects/reading/eleventy.config.js` lines 123-139:

- `posts_en` - English blog posts from `content/en/blog/**/*.md`
- `posts_se` - Swedish blog posts from `content/se/blog/**/*.md`
- `posts_ro` - Romanian blog posts from `content/ro/blog/**/*.md`

Each collection is sorted by date and accessed via `collections.posts_[lang]` in templates.

### Language-Specific Data

Each language folder has blog posts with a `blog.11tydata.js` file that sets:
- `tags: ["posts", "posts_[lang]"]` - Adds post to both general and language-specific collections
- `layout: "layouts/post.njk"` - Uses the post layout
- `lang: "[lang]"` - Sets the language code
- `permalink: function(data)` - Generates language-prefixed URLs like `/en/blog/slug/`

Example from `/Users/alex/Projects/reading/content/en/blog/blog.11tydata.js`:
```javascript
export default {
  tags: ["posts", "posts_en"],
  layout: "layouts/post.njk",
  lang: "en",
  permalink: function(data) {
    return `/en/blog/${data.page.fileSlug}/`;
  }
};
```

## Translation System

### i18n Data File

Located at `/Users/alex/Projects/reading/_data/i18n.js` - exports an object with translations for each language:

```javascript
export default {
  en: { title: "My Blog", home: "Home", blog: "Blog", ... },
  se: { title: "Min Blogg", home: "Hem", blog: "Blogg", ... },
  ro: { title: "Blogul Meu", home: "Acasă", blog: "Blog", ... }
}
```

Accessed in templates via `i18n[currentLang].key`.

### Translation Keys Available

- `title`, `description` - Site metadata
- `home`, `blog`, `about`, `archive`, `tags`, `language` - Navigation
- `readMore`, `posts`, `latestPosts`, `allPosts` - Post listing UI
- `tagged`, `postsTagged` - Tag pages

## Language Switcher Implementation

### Client-Side Logic

Located at `/Users/alex/Projects/reading/public/js/language-switcher.js`:

**Features:**
- Stores language preference in `localStorage` under key `preferredLanguage`
- Updates "Home" link to point to user's preferred language
- When switching languages, attempts to show the same page in target language
- Falls back to language home page if target page doesn't exist
- Uses URL pattern matching to replace language code: `/(en|se|ro)/path` → `/target-lang/path`

**Key Functions:**
- `getStoredLanguage()` - Retrieves preference from localStorage (defaults to 'en')
- `storeLanguage(lang)` - Saves preference to localStorage
- `getTargetUrl(targetLang)` - Calculates target URL by replacing language code
- `switchLanguage(e)` - Handles click on language switcher links
- `updateHomeLink()` - Updates home link href based on stored preference

### Template Integration

In `/Users/alex/Projects/reading/_includes/layouts/base.njk`:

**Language switcher UI (lines 54-59):**
```html
<li class="nav-item language-switcher">
  <span>🌐</span>
  <a href="#" data-lang="en" class="lang-switch">EN</a> |
  <a href="#" data-lang="se" class="lang-switch">SE</a> |
  <a href="#" data-lang="ro" class="lang-switch">RO</a>
</li>
```

**Data attributes for JS (lines 65-66):**
```html
document.documentElement.setAttribute('data-current-lang', '{{ lang or "en" }}');
document.documentElement.setAttribute('data-current-path', '{{ page.url }}');
```

These allow the JavaScript to know the current page's language and URL.

## Key Configuration Files

### eleventy.config.js

Main Eleventy configuration at `/Users/alex/Projects/reading/eleventy.config.js`:

**Important sections:**
- Lines 12-20: Draft content preprocessor (adds "(draft)" suffix, excludes from production builds)
- Lines 24-28: Passthrough copy (copies `public/` to output root)
- Lines 34-36: Watch targets for CSS and images
- Lines 40-53: CSS and JS bundle configuration
- Lines 56-86: Plugin configuration (syntax highlight, navigation, feeds, image optimization)
- Lines 109-110: Filters plugin
- Lines 123-139: Language-specific collections (`posts_en`, `posts_se`, `posts_ro`)
- Lines 150-187: Export config (input: `content/`, output: `_site/`, includes: `../_includes/`, data: `../_data/`)

### _config/filters.js

Custom Eleventy filters at `/Users/alex/Projects/reading/_config/filters.js`:

- `readableDate(dateObj, format, zone)` - Format dates using Luxon
- `htmlDateString(dateObj)` - Generate HTML5 date strings
- `head(array, n)` - Get first/last n elements of array
- `min(...numbers)` - Return minimum value
- `getKeys(target)` - Return object keys
- `filterTagList(tags)` - Remove "all" and "posts" from tag arrays
- `sortAlphabetically(strings)` - Sort strings alphabetically

### _data/metadata.js

Site metadata at `/Users/alex/Projects/reading/_data/metadata.js`:

```javascript
export default {
  title: "Eleventy Base Blog v9",
  url: "https://example.com/",
  language: "en",
  description: "...",
  author: { name: "...", email: "...", url: "..." }
}
```

Accessed in templates via `metadata` object.

### content/content.11tydata.js

Sets default layout for all content pages:

```javascript
export default {
  layout: "layouts/home.njk"
};
```

## Layout System

Located in `/Users/alex/Projects/reading/_includes/layouts/`:

### base.njk

Root HTML structure with:
- `<head>` with metadata, CSS bundles, image optimization
- `<header>` with navigation and language switcher
- `<main>` with content wrapped in `<heading-anchors>` for deep links
- `<footer>` with build info
- Language switcher script inclusion

### home.njk

Wraps into `base.njk`, used for home pages and general content pages.

### post.njk

Wraps into `base.njk`, used for individual blog posts. Includes post metadata and next/previous navigation.

## Reusable Components

### postslist.njk

Located at `/Users/alex/Projects/reading/_includes/postslist.njk`:

Displays a list of posts. Usage:
```njk
{% set postslist = collections.posts_en | head(-3) %}
{% set postslistCounter = collections.posts_en | length %}
{% include "postslist.njk" %}
```

Creates a reversed ordered list with post titles, dates, and links.

## Adding New Content

### Adding a Blog Post

Create a markdown file in the appropriate language's blog directory:

**File:** `content/[lang]/blog/my-new-post.md`

```markdown
---
title: Post Title
description: Short description for SEO
date: 2025-10-27
tags:
  - technology
  - tutorial
---

Your content here in markdown...
```

The `blog.11tydata.js` file automatically applies the correct permalink, layout, and tags.

### Adding a Static Page

Create a file in the language directory:

**File:** `content/[lang]/my-page.md`

```markdown
---
title: Page Title
description: Page description
permalink: /[lang]/my-page/
---

Page content...
```

### Adding UI Translations

Edit `/Users/alex/Projects/reading/_data/i18n.js` and add the key to all language objects:

```javascript
export default {
  en: { newKey: "English text", ... },
  se: { newKey: "Swedish text", ... },
  ro: { newKey: "Romanian text", ... }
}
```

Access in templates: `{{ i18n[currentLang].newKey }}`

## Adding a New Language

1. **Create directory structure:**
   ```bash
   mkdir -p content/[lang]/blog
   ```

2. **Copy and translate home page:**
   ```bash
   cp content/en/index.njk content/[lang]/index.njk
   # Edit and translate content
   ```

3. **Copy and translate blog archive:**
   ```bash
   cp content/en/blog.njk content/[lang]/blog.njk
   # Update collection reference: collections.posts_[lang]
   ```

4. **Create blog data file:**
   ```bash
   cp content/en/blog/blog.11tydata.js content/[lang]/blog/blog.11tydata.js
   # Update tags, lang, and permalink function
   ```

5. **Add collection to eleventy.config.js:**
   ```javascript
   eleventyConfig.addCollection("posts_[lang]", function(collectionApi) {
     return collectionApi.getFilteredByGlob("content/[lang]/blog/**/*.md").sort((a, b) => {
       return a.date - b.date;
     });
   });
   ```

6. **Add translations to _data/i18n.js:**
   ```javascript
   [lang]: {
     title: "...",
     home: "...",
     // ... all keys
   }
   ```

7. **Update language switcher in _includes/layouts/base.njk:**
   - Add new language link to navigation
   - Add active class logic

8. **Update language-switcher.js:**
   - Add language code to `languages` array (line 6)

## Deployment

### GitHub Pages

The site includes a GitHub Actions workflow at `/Users/alex/Projects/reading/.github/workflows/deploy.yml` that:
- Triggers on push to `main` branch
- Installs Node.js 20
- Runs `npm ci` and `npm run build`
- Deploys `_site/` to GitHub Pages

To enable:
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main branch

### Other Platforms

The static output in `_site/` can be deployed to:
- Netlify: Connect repository, build command `npm run build`, publish directory `_site`
- Vercel: Same configuration as Netlify
- Cloudflare Pages: Same configuration
- Any static hosting: Upload contents of `_site/` after running `npm run build`

## Image Handling

Images are automatically optimized via `@11ty/eleventy-img` plugin:
- Generates AVIF, WebP, and fallback formats
- Adds responsive `srcset` attributes
- Includes `width`/`height` to prevent layout shift
- Lazy loads with `loading="lazy"`
- Images can be co-located with posts in blog directories

## Draft Posts

Add `draft: true` to post frontmatter:
```markdown
---
title: Draft Post
draft: true
---
```

Drafts are:
- Shown during development (`npm run start`)
- Excluded from production builds (`npm run build`)
- Marked with "(draft)" suffix in title

## Important Patterns

### Accessing Language-Specific Collections

In templates:
```njk
{% set currentLang = lang or "en" %}
{% set posts = collections["posts_" + currentLang] %}
```

### Language-Aware Navigation

Navigation links must include language prefix:
```njk
<a href="/{{ currentLang }}/about/">{{ i18n[currentLang].about }}</a>
```

### Root Redirect Logic

The `/Users/alex/Projects/reading/content/index.njk` file handles root path (`/`) by:
1. Reading `localStorage.getItem('preferredLanguage')`
2. Defaulting to 'en' if not set
3. Redirecting to `/{language}/` with JavaScript

This ensures users land on their preferred language version.
