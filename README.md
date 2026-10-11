# Elite Jersey

Football jersey catalog: browse, tap Buy Now, download the photo, continue on WhatsApp. Admin dashboard for jerseys and messages.

## Stack

- Next.js 16.3.8 (App Router, pinned) + TypeScript
- Tailwind CSS v4
- Neon (PostgreSQL) + Drizzle ORM (`neon-http`)
- Better Auth (admin only)
- Cloudinary (signed browser uploads)
- Vercel + Cloudflare Workers via OpenNext

## Prerequisites

- Node 20.9+ (22 recommended)
- A Neon project (pooled connection string; unpooled only for drizzle-kit)
- A Cloudinary account

## Local setup

1. Clone the repo: `git clone https://github.com/mahtamun-hoque-fahim/elite-jersey`
2. Install: `npm install`
3. Copy `.env.example` to `.env.local` and fill in values (see PLANNER.md → Env Vars). Without `DATABASE_URL` the site shows sample jerseys.
4. Create tables: paste `drizzle/0000_init.sql` into the Neon SQL editor and run it
5. Run dev: `npm run dev`
6. Create the first admin at `/admin/setup` (needs `ADMIN_SETUP_KEY`), then remove that variable

## Env vars

See PLANNER.md → Env Vars for descriptions. Names only (exactly the names in `.env.example`):

```
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_PHONE
NEXT_PUBLIC_ADDRESS
NEXT_PUBLIC_FACEBOOK_URL
NEXT_PUBLIC_INSTAGRAM_URL
DATABASE_URL
DATABASE_URL_UNPOOLED
BETTER_AUTH_SECRET
BETTER_AUTH_URL
ADMIN_SETUP_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

## Scripts

```bash
npm run dev          # local dev server
npm run build        # production build
npm run start        # serve production build
npm run lint         # ESLint
npm run preview      # OpenNext build + local Workers runtime (copy .dev.vars.example to .dev.vars)
npm run deploy       # OpenNext build + deploy to Cloudflare (npx wrangler login once)
npm run cf-typegen   # Cloudflare env types

npx drizzle-kit generate --name <name>   # generate SQL from the schema (paste into Neon, no migrate)
```

## Deploy

- Vercel: import the repo, add the env vars, deploy
- Cloudflare: `npm run deploy`. Secrets with `npx wrangler secret put NAME`; `NEXT_PUBLIC_*` and `DEPLOY_TARGET=cloudflare` must exist at build time (Workers Builds: add them as build variables)
- Keep the same env vars on both targets
- Next.js is pinned to 16.3.8 because 16.4.0 breaks OpenNext 1.20.10 on Cloudflare (see AGENTS.md)

Before promoting a deploy, run `npm run preview` and verify env vars on Vercel and Cloudflare.

## Folder structure

```
src/app/(site)/   storefront routes
src/app/admin/    dashboard routes and server actions
src/app/api/      auth and upload-signature handlers
src/components/   UI components (admin/ for the dashboard)
src/data/         types, helpers, sample data
src/i18n/         English and Bengali dictionaries
src/lib/          db, auth, data layer, validation
drizzle/          generated SQL
```

For the detailed structure, see PLANNER.md → Architecture.
