# 2025 Portfolio

A modern, fast personal portfolio showcasing projects, writing, and photography.

- **Live Demo**: [https://2025-portfolio-ivory-xi.vercel.app/](https://2025-portfolio-ivory-xi.vercel.app/)
- **Author**: Ben Aguirre

## Features

- **Projects**: Highlight selected work with clean cards and responsive layout
- **Blog**: Markdown-based posts from `content/blog` with frontmatter (`title`, `date`, `excerpt`)
- **Photography**: Supabase Storage backed gallery with public and private buckets
- **Dark mode**: Theme toggle with system preference support
- **Responsive & accessible**: Built with semantic HTML and accessible UI primitives

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components) + React 19
- **Styling**: Tailwind CSS 4, `@tailwindcss/typography`
- **UI Components**: shadcn/ui (Radix UI + `class-variance-authority`, `clsx`), `lucide-react`
- **State/Theme**: `next-themes`
- **Content**: Markdown via `gray-matter` and `react-markdown`
- **Data + Auth + Storage**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **Images**: Next.js Image, optional `sharp`
- **Utilities**: `date-fns`, `uuid`, `tailwind-merge`
- **Build & Lint**: Turbopack, ESLint (next/core-web-vitals)
- **Deployment**: Vercel

## Project Structure

```
src/
  app/
    api/
      photos/route.ts           # Photos API (signed URLs for private when admin)
      recent-posts/route.ts     # Recent blog posts API
    ...
  components/                   # UI components (shadcn)
  lib/
    blog.ts                     # Markdown loading utilities
    supabase.ts                 # Supabase client + helpers
content/
  blog/                         # Markdown posts (.md)
```

## Blog Authoring

- Add `.md` files to `content/blog` using frontmatter:

  ```md
  ---
  title: My New Post
  date: 2025-09-01
  excerpt: A short summary for previews.
  ---

  Your markdown content here.
  ```

- Commit posts to the repo. If the directory is empty, Git won’t track it; a `.gitkeep` is included.
