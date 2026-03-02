# 🍥Fuwari
![Node.js >= 18.20.8](https://img.shields.io/badge/node.js-%3E%3D18.20.8-brightgreen)
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)
[![DeepWiki](https://img.shields.io/badge/DeepWiki-saicaca%2Ffuwari-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/saicaca/fuwari)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_shield&issueType=license)

A static blog template built with [Astro](https://astro.build).

[**🖥️ Live Demo**](https://fuwari.vercel.app)

![Preview Image](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)

🌏 README in
[**中文**](docs/README.zh-CN.md) /
[**日本語**](docs/README.ja.md) /
[**한국어**](docs/README.ko.md) /
[**Español**](docs/README.es.md) /
[**ไทย**](docs/README.th.md) /
[**Tiếng Việt**](docs/README.vi.md) /
[**Bahasa Indonesia**](docs/README.id.md)

## ✨ Features

### Core Features
- [x] Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- [x] Smooth animations and page transitions
- [x] Light / dark mode
- [x] Customizable theme colors & banner
- [x] Responsive design
- [x] Search functionality with [Pagefind](https://pagefind.app/)
- [x] [Markdown extended features](#-markdown-extended-syntax)
- [x] Table of contents
- [x] RSS feed

### 🆕 Enhanced Features
- [x] **Series / Collection Support** - Group related posts into series, displayed as a single card on homepage
- [x] **Obsidian Import Tool** - One-click import Obsidian vault with automatic Wiki link conversion
- [x] **Code Block Language Auto-Fix** - Automatically map unsupported languages to supported alternatives
- [x] **Smart Frontmatter Management** - Auto-add complete frontmatter when importing or creating posts

## 🚀 Getting Started

### Quick Start with Obsidian

If you have an Obsidian vault, import it directly:

```bash
# Install dependencies
pnpm install

# Import your Obsidian vault
pnpm import-obsidian /path/to/your/obsidian/vault

# Start development server
pnpm dev
```

### Standard Setup

1. **Create your blog repository:**
   - [Generate a new repository](https://github.com/saicaca/fuwari/generate) from this template
   - Or fork this repository

2. **Install dependencies:**
   ```bash
   pnpm install
   ```
   - Install [pnpm](https://pnpm.io) `npm install -g pnpm` if you haven't

3. **Customize your blog:**
   - Edit `src/config.ts` to configure site title, theme, navigation, etc.

4. **Create content:**
   ```bash
   # Create a new post
   pnpm new-post "Your Post Title"

   # Or import from Obsidian
   pnpm import-obsidian /path/to/vault "Series Name"
   ```

5. **Start development:**
   ```bash
   pnpm dev
   # Visit http://localhost:4321
   ```

6. **Deploy:**
   - Build: `pnpm build`
   - Deploy `dist/` directory to Vercel, Netlify, GitHub Pages, etc.
   - See [Astro deployment guides](https://docs.astro.build/en/guides/deploy/)

## 📝 Frontmatter of Posts

### Basic Frontmatter

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is my first post
image: ./cover.jpg
tags: [Tag1, Tag2]
category: Category Name
draft: false
lang: en      # Optional: set only if different from site's language
---
```

### Series/Collection Frontmatter

```yaml
---
title: JavaScript Tutorial Part 1
published: 2023-09-09
description: First post in the tutorial series
image: ./cover.jpg
tags: [JavaScript, Tutorial]
category: Front-end
series: JavaScript Tutorial  # New: Groups posts into a series
draft: false
---
```

When multiple posts share the same `series` field:
- They appear as a single card on the homepage (configurable)
- Clicking the card opens the series page showing all posts
- Posts are sorted by publication date (newest first)

**Configuration:** Set `MERGE_SERIES_ON_HOME` in `src/constants/constants.ts` to enable/disable series merging.

## 🧩 Markdown Extended Syntax

In addition to Astro's default support for [GitHub Flavored Markdown](https://github.github.com/gfm/), several extra Markdown features are included:

- **Admonitions** - Callout boxes for notes, tips, warnings, etc.
  [Preview and Usage](https://fuwari.vercel.app/posts/markdown-extended/#admonitions)
- **GitHub Repository Cards** - Embed GitHub repo cards
  [Preview and Usage](https://fuwari.vercel.app/posts/markdown-extended/#github-repository-cards)
- **Enhanced Code Blocks** - Syntax highlighting with Expressive Code
  [Preview](https://fuwari.vercel.app/posts/expressive-code/) / [Docs](https://expressive-code.com/)

## 🚀 Commands

All commands are run from the root of the project:

### Development & Building
| Command | Action |
|:---------------------------|:----------------------------------------------------|
| `pnpm install` | Installs dependencies |
| `pnpm dev` | Starts local dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` (runs pagefind) |
| `pnpm preview` | Preview production build locally |

### Content Management
| Command | Action |
|:---------------------------|:----------------------------------------------------|
| `pnpm new-post <filename>` | Create a new post in `src/content/posts/` |
| `pnpm import-obsidian <path> [series-name]` | Import Obsidian vault with auto-conversion |
| `pnpm fix-code-languages` | Fix unsupported code block languages |

### Code Quality
| Command | Action |
|:---------------------------|:----------------------------------------------------|
| `pnpm check` | Run Astro checks for errors |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm format` | Format code with Biome |
| `pnpm lint` | Check and fix code with Biome linter |

### Astro CLI
| Command | Action |
|:---------------------------|:----------------------------------------------------|
| `pnpm astro ...` | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro --help` | Get help using the Astro CLI |

## 📚 Obsidian Import Guide

The `import-obsidian` script provides powerful features:

### Features
- ✅ **Automatic Frontmatter** - Adds complete metadata (title, date, tags, category, series)
- ✅ **Wiki Link Conversion** - Converts `[[file]]` to web links `/posts/file/`
- ✅ **Directory Structure Preservation** - Maintains your Obsidian folder hierarchy
- ✅ **Code Block Language Mapping** - Auto-fixes unsupported languages
- ✅ **Existing Frontmatter Support** - Preserves your existing frontmatter

### Usage Examples

```bash
# Basic import (uses vault name as series)
pnpm import-obsidian ~/Documents/MyNotes

# Import with custom series name
pnpm import-obsidian ~/Documents/MyNotes "My Learning Notes"

# Import specific folder
pnpm import-obsidian ~/Documents/MyNotes/Folder "Series Name"
```

### Wiki Link Conversion

| Obsidian Format | Converted To |
|---------------|---------------|
| `[[Document]]` | `[Document](/posts/document/)` |
| `[[Document\|Display Text]]` | `[Display Text](/posts/document/)` |

### Code Block Language Handling

Automatically maps unsupported languages:

| Original | Mapped To |
|----------|-------------|
| Verilog | C (similar syntax) |
| SystemVerilog | C |
| VHDL | C |
| Tcl | txt |

**Note:** Only the language marker changes. Code content is preserved completely.

## 🎯 Series Feature

### Creating a Series

Add the `series` field to multiple posts:

```yaml
---
title: Part 1
series: "My Tutorial"
# ... other fields
---
```

```yaml
---
title: Part 2
series: "My Tutorial"
# ... other fields
---
```

### Series Display

- **Homepage**: Shows as "My Tutorial · X articles" card (if merged)
- **Series Page**: `/series/my-tutorial/` shows all posts sorted by date
- **Article Cards**: Display series badge and link
- **Metadata**: Shows series information in post details

### Configuration

Edit `src/constants/constants.ts`:

```typescript
export const MERGE_SERIES_ON_HOME = true; // true: merge, false: show individually
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clean and reinstall
rm -rf node_modules .astro dist
pnpm install
```

### Node.js Version
Required: Node.js >= 18.20.8

```bash
node --version
```

### Code Block Language Warnings
```bash
# Auto-fix all unsupported languages
pnpm fix-code-languages
```

### Type Checking
```bash
pnpm type-check
```

## 📖 Documentation

- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Command cheat sheet and common tasks
- **[Obsidian Import Guide](docs/OBSIDIAN_IMPORT.md)** - Detailed import documentation
- **[Code Language Fix](docs/CODE_LANGUAGE_FIX.md)** - Language mapping solutions
- **[AGENTS.md](AGENTS.md)** - Developer guide for AI coding assistants
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

## ✏️ Customization

### Site Configuration

Edit `src/config.ts`:

```typescript
export const siteConfig = {
  title: "Your Blog",
  subtitle: "Your subtitle",
  lang: "en",
  themeColor: { hue: 250, fixed: false },
  banner: {
    enable: true,
    src: "assets/images/banner.png",
    position: "top",
  },
  // ... more options
};
```

### Navigation

```typescript
export const navBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    { name: "GitHub", url: "https://github.com/username", external: true },
  ],
};
```

### Profile

```typescript
export const profileConfig = {
  avatar: "/favicon/avatar.png",
  name: "Your Name",
  bio: "Short bio",
  links: [
    { name: "Twitter", icon: "mdi:twitter", url: "https://twitter.com/..." },
    { name: "GitHub", icon: "mdi:github", url: "https://github.com/..." },
  ],
};
```

## ✏️ Contributing

Check out the [Contributing Guide](CONTRIBUTING.md) for details on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_large&issueType=license)

## 🙏 Acknowledgments

Built with:
- [Astro](https://astro.build) - The web framework for content-driven websites
- [Svelte](https://svelte.dev/) - Cybernetically enhanced web apps
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Expressive Code](https://expressive-code.com/) - Beautiful code blocks for documentation sites
- [Pagefind](https://pagefind.app/) - Static site search

Original template by [saicaca](https://github.com/saicaca).
