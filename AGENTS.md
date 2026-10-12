<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Elite Jersey

Football jersey catalog for Bangladeshi fans and local teams: orders finish on WhatsApp, admins manage jerseys and messages in a dashboard.

## Current State

- Updated: 2026-10-12
- Status: Feature complete, waiting on env vars and first deploy
- Works: types and entries (clubs, countries, specials) managed in the dashboard and driving the nav, shop filters and product pages, photo placeholders instead of drawn jerseys, dashboard Cloudinary connection check, storefront (home, shop with filters, type and entry pages and product pages, Buy Now popup to WhatsApp, custom order, contact), English / Bengali toggle, admin dashboard (login, first-admin setup, jersey CRUD with Cloudinary upload, inbox, admins), login rate limiting, Cloudflare Workers build verified on `wrangler dev`
- In progress: nothing half-built
- Next: fill env vars; in Neon run `drizzle/0000_init.sql` then `drizzle/seed.sql`; create the first admin; confirm Cloudinary on the dashboard Overview; add real jerseys with photos; `npm run preview`; deploy to Vercel and Cloudflare. Then legal pages (needs owner policies) and SEO
- Watch out:
  - Next.js is pinned to exactly 16.3.8: 16.4.0 returns 500 on every route on Cloudflare with `@opennextjs/cloudflare` 1.20.10 (`Unexpected loadManifest(preview-props.json)`, opennextjs-cloudflare#1355). Do not bump until OpenNext ships the fix, then run `npm run preview`
  - Nothing has run against a real Neon database yet: the schema and Better Auth were tested on local Postgres (PGlite) only
  - The site shows sample jerseys when `DATABASE_URL` is unset; never ship without it
  - Blue (`--color-brand`) is a placeholder until a CTA color is chosen
  - No BRAIN.md and no SITETREE.md exist (project skipped Singularity and tree-man)
  - Only automated tests: `npm run test:db` (database logic on in-memory Postgres). No UI tests
  - Jersey types are data, not code: `drizzle/seed.sql` (generated from `src/data/seed-types.json`) creates Club, Country and Special with their entries. Without `DATABASE_URL` the site falls back to the same seed list so it can be previewed

## Git Identity (Session Start — run before any commit, every session)

```
git config user.name "mahtamun-hoque-fahim"
git config user.email "mahtamunhoquefahim@gmail.com"
```

Execute automatically at the start of every session, before the first commit — never ask, never skip, never commit as Claude. This applies across every Claude account/session working this repo.

## Setup & Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Type check: `npx tsc --noEmit` (run `npx next typegen` first after adding routes)
- Lint: `npx eslint .`
- Cloudflare preview (Workers runtime): `npm run preview`
- Cloudflare deploy: `npm run deploy`
- SQL from schema: `npx drizzle-kit generate --name <name>`, then paste the file into the Neon SQL editor (no `migrate` or `push`)

## Conventions & Non-Negotiables

- No emojis anywhere in code or UI — lucide-react icons or inline SVG only (Facebook and Instagram are hand-rolled because lucide lacks them)
- Dual deploy target: Vercel + Cloudflare Workers via `@opennextjs/cloudflare`; `neon-http` driver only; no Node-only APIs, no filesystem writes; test with `npm run preview` before deploying
- Better Auth: session checked server side with `auth.api.getSession()` in `requireAdmin()`; `src/proxy.ts` is only a cookie-presence redirect. Public sign-up is closed in the auth route handler, admins are created server side with `autoSignIn` off
- Every admin Server Action starts with `requireAdmin()`; public Server Actions validate with Zod
- Public pages render per request (`connection()` in the data layer), no caching, so dashboard edits show immediately
- All UI strings live in the i18n dictionaries (English and Bengali): add both for every new string. Jersey data and WhatsApp messages stay single-language
- Photos are Cloudinary URLs in plain `<img>` with transform params (Cloudflare has no image optimizer)
- `DESIGN_GUIDE.md` is updated with every UI change; the other docs only on "update repo"
- Run `npx tsc --noEmit` and `npm run build` before every push

## Security Gotchas

- `.env.local` and `.dev.vars` are never committed. If a secret or a GitHub PAT appears in chat or git history, rotate it immediately
- `CLOUDINARY_API_SECRET` is server only; uploads are signed in `/api/admin/upload-signature` (session required, formats restricted)
- `ADMIN_SETUP_KEY` must be removed after the first admin exists
- Sign-in is rate limited (5 per minute per IP) through the `rate_limit` table; client IP comes from `cf-connecting-ip` or `x-forwarded-for`
- Public forms have a honeypot field and a site-wide flood guard (20 stored messages per 10 minutes)

## Session Log

### 2026-10-12 (types)
- Did: Jersey types are now fully data-driven. New tables `jersey_types` and `jersey_groups` (entries), jerseys link to an entry with `group_id`; the old `category` and `team` columns are gone. Only Home and Shop are hardcoded in the nav; every type shows as a dropdown with its entries. Dashboard Types section (add, rename, reorder, delete types and entries, set default sizes per entry). Jersey form picks type then entry and can override sizes for one jersey. New shop routes `/shop/[type]` and `/shop/[type]/[group]`. Seed SQL generated from `src/data/seed-types.json`. Added `npm run test:db` (20 checks on in-memory Postgres). Verified on `next start` and on `wrangler dev`
- Decided: the entry holds the default sizes; a jersey can override. Retro is an entry under Special. Deleting a type or entry that still has jerseys is blocked. Type and entry names are shown as typed (not translated); Home, Shop and Custom Order stay translated. Slugs never change on rename
- Next: unchanged (env vars, Neon SQL init then seed, first admin, real jerseys with photos, preview and deploy)

### 2026-10-12
- Did: Replaced the drawn SVG jerseys with a neutral PhotoPlaceholder everywhere a photo goes (cards, product page, hero tiles, order popup, admin list); removed `JerseyArt` and the color/pattern fields from the data model. Order popup now only downloads real photos (no-photo jerseys skip straight to WhatsApp). Added a Cloudinary connection check (ping with the three env keys) to the dashboard Overview, upload hints and clearer errors, README Cloudinary steps. Verified the upload signature algorithm against Cloudinary's documented example
- Decided: no fake or drawn product images; a missing photo is shown honestly as "Photo coming soon"
- Next: unchanged (env vars, Neon SQL, first admin, real jerseys with photos, preview and deploy)

### 2026-10-11
- Did: Built the whole project from scratch: storefront from the jersey.com.bd reference screenshots, Buy Now popup with photo download and WhatsApp handoff, admin dashboard (Better Auth, Neon/Drizzle, Cloudinary), English / Bengali toggle, real logo, Cloudflare Workers config, security and quality pass, docs sync. Pushed to `main`
- Decided: Orders finish on WhatsApp (no cart or checkout) instead of opening Facebook posts. Every account is an admin (no roles). Public pages are dynamic instead of cached. Raw SQL for Neon instead of drizzle-kit migrate. Next pinned to 16.3.8 because of the OpenNext bug above
- Next: env vars, Neon SQL, first admin, real jerseys, preview and deploy, then legal pages (needs owner policies) and SEO
