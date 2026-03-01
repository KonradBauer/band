# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Polish wedding band website ("ARMAGEDON") built with **Next.js 16 + Payload CMS 3.75 + MongoDB**. The site is a CMS-driven marketing site with pages for gallery, audio, about, and contact. Content is managed through Payload's admin panel at `/admin`.

## Commands

```bash
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm test:int         # Integration tests (vitest)
pnpm test:e2e         # E2E tests (playwright, starts dev server automatically)
pnpm payload generate:types      # Regenerate payload-types.ts after schema changes
pnpm payload generate:importmap  # Regenerate import map after adding/modifying admin components
```

Run a single test file:
```bash
pnpm vitest run tests/int/api.int.spec.ts --config ./vitest.config.mts   # single integration test
pnpm playwright test tests/e2e/frontend.e2e.spec.ts                       # single E2E test
```

TypeScript validation: `npx tsc --noEmit`

## Architecture

- **Payload config**: `src/payload.config.ts` — registers all collections and globals, uses MongoDB adapter
- **Collections** (`src/collections/`): Users, Media, GalleryPhoto, AudioAlbum, AudioTrack, Member
- **Globals** (`src/globals/`): SiteSettings, HomePage, AboutPage, ContactPage, GalleryPage, AudioPage — each global corresponds to a frontend page's CMS content
- **Frontend routes** (`src/app/(frontend)/`): Next.js App Router pages that fetch from Payload globals using `getPayload({ config })`. All pages are server components with `force-dynamic`. Routes use Polish names: `/kim-jestesmy`, `/galeria`, `/kontakt`, `/audio`
- **Admin routes** (`src/app/(payload)/`): Payload admin panel, auto-generated
- **UI components** (`src/components/ui/`): shadcn/ui components (Radix + Tailwind + CVA)
- **Animations** (`src/components/animations/`): Motion (framer-motion) animation wrapper components
- **Styling**: Tailwind CSS v4 with dark mode forced on (`<html class="dark">`). Fonts: Inter (`--font-sans`) + Playfair Display (`--font-heading`). Gold accent color `#c9a84c` used as `--primary`
- **CSS utilities** (defined in `globals.css`): `glass-card` (frosted glass cards), `shimmer-gold` (animated gold headings), `gold-gradient-text` (static gold gradient), `glow-button` (hover glow on buttons), `cta-pulse` (pulsing CTA buttons)
- **Path aliases**: `@/*` → `src/*`, `@payload-config` → `src/payload.config.ts`
- **Client components**: Interactive components (audio player, photo gallery, animations) are client components in `src/components/`. Pages are server components that pass CMS data as props to client components

## Data Flow

Each frontend page follows the same pattern: server component fetches a Payload global (or collection), extracts sections, provides hardcoded defaults as fallbacks, then renders. Example from `page.tsx`:
```typescript
const payload = await getPayload({ config: configPromise })
const homePage = await payload.findGlobal({ slug: 'home-page' })
const hero = homePage?.heroSection
// Use fallback: hero?.heading ?? 'ARMAGEDON'
```

Media fields from Payload come as `string | MediaObject` — always check `typeof field === 'object'` before accessing `.url` or `.sizes.card.url`.

## Payload CMS Patterns

- All frontend pages get data via `getPayload({ config: configPromise })` then `payload.findGlobal()` or `payload.find()`
- After modifying collection/global schemas, run `pnpm payload generate:types` to update `src/payload-types.ts`
- After creating or modifying admin components, run `pnpm payload generate:importmap`
- Local API bypasses access control by default — when passing `user`, always set `overrideAccess: false`
- Always pass `req` to nested operations in hooks for transaction safety
- Custom admin components use file paths (not imports) in config; paths are relative to `src/` (the `importMap.baseDir`)

## Testing

- Integration tests: `tests/int/**/*.int.spec.ts` (vitest + jsdom)
- E2E tests: `tests/e2e/` (Playwright, Chromium only)
- Test helpers: `tests/helpers/`
- Environment: `test.env` for test-specific env vars

## Environment Variables

Required: `DATABASE_URL` (MongoDB connection string), `PAYLOAD_SECRET`
