# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm lint         # ESLint (core-web-vitals + typescript)
pnpm typecheck    # TypeScript check (tsc --noEmit)
pnpm format       # Prettier format all .ts/.tsx files
```

## Stack

- **Next.js 16** with App Router and React 19
- **Tailwind CSS v4** via `@tailwindcss/postcss` (config lives in `app/globals.css`, not a tailwind.config file)
- **shadcn/ui** (style: `base-luma`) built on **@base-ui/react** primitives — add components with `npx shadcn@latest add <name>`
- **Phosphor Icons** (`@phosphor-icons/react`) — this is the configured icon library for shadcn
- **next-themes** for dark mode (press `d` to toggle; class-based strategy)
- **pnpm** as package manager

## Code Conventions

- Path alias: `@/*` maps to project root
- Use `cn()` from `@/lib/utils` for merging Tailwind classes (clsx + tailwind-merge)
- Use `cva` from `class-variance-authority` for component variants
- Prettier: no semicolons, double quotes, 2-space indent, trailing commas (es5)
- Tailwind class sorting is enforced by `prettier-plugin-tailwindcss` (configured with `cn` and `cva` functions)
- Design tokens use CSS custom properties with oklch colors defined in `app/globals.css`

## Architecture

Single-page Next.js app using the App Router (`app/` directory). All UI components go in `components/ui/` following shadcn conventions. Custom hooks go in `hooks/`. Shared utilities go in `lib/`.

The root layout (`app/layout.tsx`) wraps everything in `ThemeProvider` and loads Geist/Geist Mono fonts.
