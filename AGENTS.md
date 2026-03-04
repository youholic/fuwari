# Agents Guide

This file contains essential information for agentic coding tools working on this codebase.

## Essential Commands

```bash
# Development
pnpm dev                    # Start dev server at localhost:4321
pnpm build                  # Build production site to ./dist/ (runs pagefind)
pnpm preview                # Preview production build locally

# Code Quality
pnpm check                  # Run Astro checks for errors
pnpm type-check             # Run TypeScript type checking (tsc --noEmit)
pnpm lint                   # Run Biome linter with auto-fix
pnpm format                 # Format code with Biome

# Utilities
pnpm new-post <filename>    # Create a new post in src/content/posts/
pnpm import-obsidian <path> # Import Obsidian vault to blog posts
pnpm fix-code-languages     # Fix unsupported code block languages
```

## Code Style & Conventions

### Formatting (Biome)
- **Indentation**: Tabs (not spaces)
- **Quotes**: Double quotes for JavaScript/TypeScript
- **Semicolons**: Required (standard JavaScript)
- **Line width**: Standard Biome defaults
- Run `pnpm format` before committing to ensure consistent formatting

### Import Organization
- Use path aliases defined in tsconfig.json:
  - `@components/*` → src/components/*
  - `@assets/*` → src/assets/*
  - `@constants/*` → src/constants/*
  - `@utils/*` → src/utils/*
  - `@i18n/*` → src/i18n/*
  - `@layouts/*` → src/layouts/*
  - `@/*` → src/*
- Separate type imports: `import type { ... }`
- Biome organizes imports automatically on save
- Local imports first, then third-party, then Node.js built-ins

### TypeScript
- **Strict mode**: Enabled (extends astro/tsconfigs/strict)
- **Type definitions**: Explicit types in src/types/config.ts
- **Interfaces**: Define Props interfaces in Astro components
- **Avoid**: `any` types - use proper typing or `unknown` when necessary
- **No JS files**: `allowJs: false` in tsconfig.json

### Naming Conventions
- **Components**: PascalCase (e.g., `PostCard.astro`, `Search.svelte`)
- **Functions/Variables**: camelCase (e.g., `formatDate`, `keywordDesktop`)
- **Constants**: UPPERCASE (e.g., `LIGHT_MODE`, `LinkPreset`)
- **Types/Interfaces**: PascalCase (e.g., `SiteConfig`, `BlogPostData`)
- **Files**: Match export name (kebab-case for utilities, PascalCase for components)

### Astro Components
- Frontmatter fence: `---` for script sections
- Destructure props explicitly: `const { title, url } = Astro.props;`
- Access class prop separately: `const className = Astro.props.class;`
- Use `client:` directives for Svelte components: `client:only="svelte"`, `client:load`
- CSS variables: Use `<style define:vars={{...}}>` for dynamic CSS
- Props interface: Define at top of frontmatter

### Svelte Components
- Lang attribute: `<script lang="ts">`
- Reactive statements: Use `$:` for derived values
- Lifecycle: Import `onMount` from svelte
- Props: Use `export let` syntax
- Type imports disabled by Biome override for .svelte files

### Error Handling
- Use try-catch for async operations with proper error logging
- Console errors: Provide context (e.g., `console.error("Search error:", error)`)
- Graceful degradation: Provide fallbacks when features unavailable
- Example: Search component handles missing Pagefind with mock data in dev

### Styling Conventions
- Tailwind CSS for utility-first styling
- CSS variables for theme colors: `var(--primary)`, `var(--card-bg)`, etc.
- Responsive: Mobile-first approach (use `md:`, `lg:` prefixes)
- Dark mode: Use `dark:` prefix for dark-mode specific styles
- Transitions: Add `transition` class for smooth animations
- Custom CSS: Minimal, prefer Tailwind utilities

### Linting Rules (Biome)
Biome enforces these rules (recommended + custom):
- No parameter reassignment
- Use as const assertions
- Single variable declarator
- Self-closing elements
- No unused template literals
- No inferrable types
- No useless else
- Number namespace
- **Exceptions for .svelte/.astro files**: unused vars/imports, const/let warnings disabled

### Git/Committing
- **Format**: Use [Conventional Commits](https://www.conventionalcommits.org/)
- **Pre-commit**: Run `pnpm check` and `pnpm format` before submitting
- **PR scope**: Keep focused on single purpose, avoid unrelated changes

### Testing
- **No test suite**: Project currently has no automated tests
- **Manual testing**: Use `pnpm build && pnpm preview` to test production build
- **Search**: Only works in production (pagefind disabled in dev)

### Project Structure
- `src/components/` - Reusable Astro and Svelte components
- `src/components/control/` - Button/link components
- `src/components/misc/` - Utility components (ImageWrapper, Markdown)
- `src/components/widget/` - Sidebar widgets (TOC, Categories, Profile)
- `src/config.ts` - Main configuration file
- `src/content/` - Markdown content (posts in src/content/posts/)
- `src/i18n/` - Internationalization (languages, translation logic)
- `src/layouts/` - Layout components
- `src/pages/` - Route pages
- `src/pages/series/` - Series collection pages
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions
- `src/constants/` - Constants and presets
- `src/plugins/` - Astro plugins (expressive-code customization)

### Important Notes
- Package manager: **pnpm** (enforced via preinstall hook)
- Node.js version: >= 18.20.8
- Build output: `./dist/` directory
- Pagefind: Automatically runs after build for search indexing
- Astro version: 5.13.10
- Svelte version: 5.39.8
- TypeScript: 5.9.3

## Feature-Specific Guidelines

### Series/Collection Feature
- Posts can be grouped into series using the `series` field in frontmatter
- Series pages use ArchivePanel for consistent styling
- Series can be merged on homepage by setting `MERGE_SERIES_ON_HOME = true` in constants
- Series cards show a special badge and article count
- Series posts are sorted by publication date (newest first)

### Obsidian Import
- Use `pnpm import-obsidian <vault-path> [series-name]` to import notes
- **Custom configuration supported** (optional):
  - `--date="YYYY-MM-DD"` - Set publish date for all posts
  - `--category="name"` - Set category for all posts
  - `--tags="tag1,tag2,tag3"` - Set tags for all posts (comma-separated)
- Wiki links `[[file]]` are automatically converted to web links
- Code blocks with unsupported languages are auto-mapped
- **Images automatically copied** - Supports PNG, JPG, GIF, SVG, WebP, BMP, ICO
- Preserves directory structure and existing frontmatter
- Skips `.obsidian`, `.git`, `node_modules` directories

#### Examples

```bash
# Basic import
pnpm import-obsidian ~/Notes "My Series"

# With custom date, category, and tags
pnpm import-obsidian ~/Notes "My Series" \
  --date="2025-01-15" \
  --category="Tech Docs" \
  --tags="JavaScript,React,Coding"

# With custom date only
pnpm import-obsidian ~/Notes "My Series" --date="2024-12-01"
```

#### Configuration Scope

- **Global application**: Custom values apply to all imported documents
- **Default values**:
  - Date: Today
  - Category: Series name
  - Tags: Series name

### Code Block Language Handling
- Expressive Code supports many but not all languages
- Unsupported languages (e.g., Verilog, VHDL) are mapped to supported alternatives
- Verilog → C (similar syntax)
- SystemVerilog → C
- VHDL → C
- Tcl → txt
- Run `pnpm fix-code-languages` to scan and fix all files

When making changes, always run `pnpm format` and `pnpm lint` to ensure code quality. Use existing components as templates for new features.
