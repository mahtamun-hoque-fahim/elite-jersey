# Elite Jersey — Planner

> Football jersey catalog for Bangladeshi fans and local teams: browse, tap Buy Now, download the photo, continue on WhatsApp. Admin dashboard manages jerseys and a message inbox.

## Project Overview

**Purpose.** A clean, fast catalog for selling football jerseys (club, country, retro, special, replica, seasonal, custom) where orders are finished manually on WhatsApp. No cart, checkout or payments on the site.

**Target user.** Football fans in Bangladesh buying a jersey, and local teams ordering custom kits. Admins: the owner (Fahim) first, more admins later.

**Key value.** From browsing to a WhatsApp order in three taps, with the jersey photo attached.

**Current phase.** Building done, waiting on env vars and first deploy.

---

## Architecture

**Stack:**
- Framework: Next.js 16.3.8 (pinned, see Notes), App Router, TypeScript, Tailwind CSS v4
- Content: jerseys and messages in the database; sample data in `src/data/jerseys.ts` is used only when `DATABASE_URL` is unset
- Database: Neon PostgreSQL + Drizzle (`neon-http` driver)
- Auth: Better Auth (email + password, admin only)
- Images: Cloudinary, signed direct browser upload
- i18n: cookie-based English / Bengali dictionaries
- Deployment: Vercel + Cloudflare Workers via OpenNext (`@opennextjs/cloudflare` 1.20.10)

**Deployment topology:**
- `main` → Vercel production
- `main` → Cloudflare Workers via `npm run deploy` (or Workers Builds)
- Both targets need the same env vars; `NEXT_PUBLIC_*` and `DEPLOY_TARGET=cloudflare` at build time on Cloudflare

**Rendering:** all public pages render per request (`connection()` in the data layer) so dashboard edits appear immediately. No ISR, no Cache Components, no KV/R2 binding.

**Folder structure (summary):** see README.

---

## User Flows

### Flow 1: Fan orders a jersey
1. Lands on `/`, browses sections or opens `/shop` (filters: category, club/country, season, size, price; search; sort)
2. Opens a jersey (`/jersey/[slug]`) or taps Buy Now on a card
3. Order popup: picks a size, taps Download Photo (photo saved to the device)
4. Continue to WhatsApp unlocks; opens WhatsApp with a prefilled message (name, size, price, link)
5. Attaches the photo and sends; the owner confirms price, delivery and payment on WhatsApp

### Flow 2: Local team requests custom kits
1. Opens `/custom-order`, fills team, contact, phone, quantity, style, sizes, deadline, notes
2. Request is saved to the dashboard inbox (if the database is unavailable the form falls back to a WhatsApp message)
3. Success panel offers a WhatsApp shortcut for a faster reply

### Flow 3: Visitor contacts the shop
1. Opens `/contact`, sends name, optional phone, message
2. Saved to the inbox; success panel offers WhatsApp

### Flow 4: Admin manages the catalog
1. Opens `/admin/login` and signs in
2. Jerseys: add (photo upload to Cloudinary, sizes, prices, flags), edit, toggle stock, delete
3. Inbox: reads requests, calls or WhatsApps the sender, marks handled, deletes
4. Admins: creates or removes other admins (cannot remove self)

### Flow 5: First admin setup (once)
1. Env has `DATABASE_URL` and `ADMIN_SETUP_KEY`; user table is empty
2. Opens `/admin/setup`, enters the setup key, name, email, password
3. Redirected to login; after the first user exists the setup page redirects to login

---

## DB Schema

Drizzle schema in `src/lib/db/schema.ts`. SQL to paste into the Neon SQL editor: `drizzle/0000_init.sql` (regenerate with `npx drizzle-kit generate --name init` after schema edits, as a new numbered file once the first one has been applied).

### user / session / account / verification
Standard Better Auth tables (names and columns must match Better Auth). Every user is an admin; there is no role column. `session.user_id` and `account.user_id` cascade on delete.

### rate_limit
| column | type | notes |
|---|---|---|
| id | text PK | |
| key | text | Better Auth rate limit key (IP + path) |
| count | integer | |
| last_request | bigint | ms epoch |

### jerseys
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| slug | text unique | from name, suffix on conflict, never changes on edit |
| name, team, season | text | |
| category | text | club / national / retro / special |
| version | text | Player / Fan |
| price | integer | BDT |
| old_price | integer null | shows strike-through and SAVE % |
| sizes | text[] | default S to 3XL |
| in_stock, is_new | boolean | |
| image_url | text null | Cloudinary https URL |
| description | text | |
| created_at, updated_at | timestamp | |

Indexes: category, team, created_at.

### submissions
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| kind | text | custom / contact |
| name | text | |
| phone, message | text null | |
| payload | jsonb | custom-order fields (team, quantity, style, sizes, deadline) |
| status | text | new / handled |
| created_at | timestamp | |

Index: (status, created_at).

---

## API Routes

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET, POST | /api/auth/[...all] | Better Auth | Better Auth endpoints | POST `/sign-up*` returns 404 (public sign-up closed) |
| POST | /api/admin/upload-signature | session | none | `{ cloudName, apiKey, timestamp, folder, allowedFormats, signature }` (503 if Cloudinary unset, 401 without session) |

### Server Actions
| Action | File | Auth | Notes |
|---|---|---|---|
| submitCustomOrder, submitContact | `src/app/actions.ts` | public | Zod validated, honeypot field `website`, flood guard (20 stored messages per 10 minutes), returns `{ ok, saved, error }`; `saved: false` when no database |
| saveJersey, toggleStock, deleteJersey | `src/app/admin/actions.ts` | requireAdmin | |
| setSubmissionStatus, deleteSubmission | `src/app/admin/actions.ts` | requireAdmin | |
| createAdmin, deleteAdmin | `src/app/admin/actions.ts` | requireAdmin | uses `auth.api.signUpEmail` server side; `autoSignIn` is off so the current session is untouched |
| setupFirstAdmin | `src/app/admin/actions.ts` | setup key | needs `ADMIN_SETUP_KEY`, only while the user table is empty |

Rate limits: sign-in 5 per minute per IP, everything else 60 per minute, stored in `rate_limit`.

---

## Env Vars

Every row is also in `.env.example`.

| Name | Required | Description | Example |
|---|---|---|---|
| DATABASE_URL | yes | Neon pooled connection (app) | postgresql://...?sslmode=require |
| DATABASE_URL_UNPOOLED | only for drizzle-kit | Neon direct connection | postgresql://...?sslmode=require |
| BETTER_AUTH_SECRET | yes | Session signing secret, 32+ chars | (openssl rand -base64 32) |
| BETTER_AUTH_URL | yes | Public app URL | https://elitejersey.example |
| ADMIN_SETUP_KEY | first setup only | Gate for `/admin/setup`; remove after the first admin exists | any long random string |
| CLOUDINARY_CLOUD_NAME | yes | Cloudinary account | demo |
| CLOUDINARY_API_KEY | yes | Cloudinary key | 123456789012345 |
| CLOUDINARY_API_SECRET | yes | Cloudinary secret (server only) | |
| NEXT_PUBLIC_WHATSAPP_NUMBER | yes | Digits only with country code | 8801XXXXXXXXX |
| NEXT_PUBLIC_PHONE | optional | Shown in footer and contact page | +880 1XXX-XXXXXX |
| NEXT_PUBLIC_ADDRESS | optional | Shown in footer and contact page | |
| NEXT_PUBLIC_FACEBOOK_URL | optional | Footer icon is hidden when empty | https://facebook.com/... |
| NEXT_PUBLIC_INSTAGRAM_URL | optional | Footer icon is hidden when empty | https://instagram.com/... |
| DEPLOY_TARGET | Cloudflare builds | Set to `cloudflare` (the npm scripts do this) | cloudflare |

---

## Timeline / Phases

### Phase 1 — Foundation
Status: `[x]` done

- [x] Scaffold Next.js 16, Tailwind v4 tokens, fonts, logo and favicon
- [x] Storefront layout (header, footer, WhatsApp button)

### Phase 2 — Storefront
Status: `[x]` done

- [x] Home, Shop with filters / sort / search / pagination, category pages
- [x] Product page, Buy Now popup (size, photo download, WhatsApp handoff)
- [x] Custom Order and Contact forms

### Phase 3 — Dashboard
Status: `[x]` done

- [x] Better Auth, closed sign-up, first-admin setup, proxy redirect
- [x] Jersey CRUD with Cloudinary upload, stock toggle
- [x] Inbox, admins management
- [x] Drizzle schema and generated SQL

### Phase 4 — Language and deploy readiness
Status: `[x]` done

- [x] English / Bengali toggle (cookie, browser-language default, Noto Sans Bengali)
- [x] Cloudflare Workers config (OpenNext), Next pinned to 16.3.8, verified on `wrangler dev`
- [x] Security pass: DB-backed login rate limit, upload format restriction, flood guard, security headers

### Phase 5 — Go live
Status: `[ ]` pending

- [ ] Fill env vars (Vercel and Cloudflare), run `drizzle/0000_init.sql` in Neon
- [ ] Create first admin at `/admin/setup`, then remove `ADMIN_SETUP_KEY`
- [ ] Add real jerseys and photos
- [ ] `npm run preview`, then deploy to Vercel and Cloudflare

### Phase 6 — Polish
Status: `[ ]` pending

- [ ] Privacy, Terms, Delivery and Return pages (needs owner policies)
- [ ] SEO: metadata, Open Graph, schema, sitemap, robots
- [ ] Choose a real CTA color (blue is a placeholder)
- [ ] Accessibility audit, automated tests (none yet)

---

## Next Steps

In order:
1. Fill the env vars and run `drizzle/0000_init.sql` in the Neon SQL editor
2. Create the first admin, remove `ADMIN_SETUP_KEY`, add real jerseys
3. `npm run preview` (Workers runtime), then deploy to Vercel and Cloudflare with identical env
4. Send the owner policies so Privacy, Terms, Delivery and Return pages can be drafted
5. SEO pass once the domain and real products exist

---

## Notes & decisions

**2026-10-11.** Flow changed from "open the jersey's Facebook post" to "Buy Now popup, download photo, WhatsApp", because the owner wants to finish orders on WhatsApp. Facebook stays as a footer link only.

**2026-10-11.** Public sign-up is blocked in the auth route handler and admins are created server side, so there is no role system: every account is an admin.

**2026-10-11.** Public pages are dynamic (no caching) so dashboard edits show at once, which also avoids the Cloudflare ISR limits.

**2026-10-11.** Next.js is pinned to exactly 16.3.8. Next 16.4.0 returns 500 on every route on Cloudflare with `@opennextjs/cloudflare` 1.20.10 (`Unexpected loadManifest(preview-props.json)`, upstream opennextjs-cloudflare#1355). Upgrade only after OpenNext ships the fix, and run `npm run preview` first.

**2026-10-11.** WhatsApp messages and saved form data stay in English so the owner reads one format; jersey names and descriptions are shown as entered.
