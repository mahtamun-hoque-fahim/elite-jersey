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
4. Create tables (this file includes the per-jersey Facebook post link column): paste `drizzle/0000_init.sql` into the Neon SQL editor and run it. Then paste `drizzle/seed.sql` (the types and entries: Club, Country, Special and Combo) and after it `drizzle/seed-jerseys.sql` (the 30 starting jerseys with names, club, season and price; add photos and Facebook links in the dashboard). Both seeds are safe to run more than once
5. Run dev: `npm run dev`
6. Create the first admin at `/admin/setup` (needs `ADMIN_SETUP_KEY`), then remove that variable

## Env vars

See PLANNER.md → Env Vars for descriptions. Names only (exactly the names in `.env.example`):

```
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_PHONE
NEXT_PUBLIC_ADDRESS
NEXT_PUBLIC_FACEBOOK_URL
NEXT_PUBLIC_FACEBOOK_PAGE_USERNAME
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

## Messenger and Facebook posts

- Set `NEXT_PUBLIC_FACEBOOK_PAGE_USERNAME` to your page username (the part after facebook.com/). This turns on the Order via Messenger link (`https://m.me/<username>`); it stays hidden until set. Messenger cannot be prefilled from a website, so the link also copies the order message to the clipboard
- On each jersey in the dashboard you can paste the link to its Facebook post. The product page then shows View on Facebook post. Only https links to facebook.com, fb.com, fb.watch and fb.me are accepted
- WhatsApp stays the main Buy Now channel (prefilled message)

## Cloudinary (jersey photos)

1. Create a free account at cloudinary.com
2. In the Cloudinary dashboard open Settings, then API Keys, and copy the Cloud name, API Key and API Secret
3. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` (locally and on Vercel / Cloudflare), then redeploy
4. Open `/admin`: the Overview page checks the keys against Cloudinary and shows connected, rejected or missing
5. Add or edit a jersey and upload a square photo (at least 1000 px). Uploads go straight from the browser to the `elite-jersey` folder, signed by `/api/admin/upload-signature`

Until a photo is uploaded, a jersey shows a "Photo coming soon" placeholder.

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
npm run seed:sql     # regenerate drizzle/seed.sql and seed-jerseys.sql from src/data/seed-types.json and seed-jerseys.json
npm run test:db      # database logic tests on an in-memory Postgres (no Neon needed)
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
drizzle/          generated SQL (0000_init.sql tables, seed.sql types and entries)
scripts/          seed SQL generator, database tests
```

For the detailed structure, see PLANNER.md → Architecture.
