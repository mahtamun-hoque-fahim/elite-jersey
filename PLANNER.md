# Elite Jersey — Planner

> Football jersey catalog for Bangladeshi fans and local teams: browse, tap Buy Now, download the photo, continue on WhatsApp. Admin dashboard manages jersey types and entries, jerseys, photos and a message inbox.

## Project Overview

**Purpose.** A clean, fast catalog for selling football jerseys where orders are finished manually on WhatsApp. No cart, checkout or payments on the site. The catalog structure is data, not code: the admin manages types (Club, Country, Special, or any new one) and the entries under them (each club, country or special), and the menu, filters and pages follow.

**Target user.** Football fans in Bangladesh buying a jersey, and local teams ordering custom kits. Admins: the owner (Fahim) first, more admins later.

**Key value.** From browsing to a WhatsApp order in three taps, with the jersey photo attached.

**Current phase.** Feature complete; waiting on env vars, database setup and first deploy.

---

## Architecture

**Stack:**
- Framework: Next.js 16.3.8 (pinned, see Notes), App Router, TypeScript, Tailwind CSS v4
- Content: types, entries, jerseys and messages in the database. Seed list in `src/data/seed-types.json` (and sample jerseys in `src/data/jerseys.ts`) is used only when `DATABASE_URL` is unset, so the site can be previewed
- Database: Neon PostgreSQL + Drizzle (`neon-http` driver)
- Auth: Better Auth (email + password, admin only)
- Images: Cloudinary, signed direct browser upload; jerseys without a photo show a neutral `PhotoPlaceholder`
- i18n: cookie-based English / Bengali dictionaries (UI only; type, entry and jersey names are shown as entered)
- Deployment: Vercel + Cloudflare Workers via OpenNext (`@opennextjs/cloudflare` 1.20.10)

**Deployment topology:**
- `main` → Vercel production
- `main` → Cloudflare Workers via `npm run deploy` (or Workers Builds)
- Both targets need the same env vars; `NEXT_PUBLIC_*` and `DEPLOY_TARGET=cloudflare` at build time on Cloudflare

**Rendering:** all public pages render per request (`connection()` in the data layer, catalog cached per request with React `cache`) so dashboard edits appear immediately. No ISR, no Cache Components, no KV/R2 binding.

**Navigation:** only Home and Shop are hardcoded. Every other menu item is a type from the database, with its entries in a dropdown. Custom Order is the header button. Public routes: `/shop`, `/shop/[type]`, `/shop/[type]/[group]`, `/jersey/[slug]`, `/custom-order`, `/contact`.

**Folder structure (summary):** see README.

---

## User Flows

### Flow 1: Fan orders a jersey
1. Lands on `/`, browses sections (latest, then one per type), or uses the menu: Shop, or a type and its entries (`/shop/{type}`, `/shop/{type}/{entry}`). Shop filters: entries grouped by type, season, size, price; search; sort
2. Opens a jersey (`/jersey/[slug]`) or taps Buy Now on a card
3. Order popup: picks a size, taps Download Photo (photo saved to the device)
4. Continue to WhatsApp unlocks; opens WhatsApp with a prefilled message (name, size, price, link). A jersey without a photo skips the download: Continue is available at once with a short notice
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
2. Jerseys: add (pick type then entry, photo upload to Cloudinary, optional own sizes, prices, flags), edit, toggle stock, delete. Overview shows a Cloudinary connection check
3. Inbox: reads requests, calls or WhatsApps the sender, marks handled, deletes
4. Admins: creates or removes other admins (cannot remove self)

### Flow 5: Admin manages types and entries
1. Opens `/admin/types`: adds a type, reorders types, deletes a type (blocked while any of its jerseys exist)
2. Opens a type: renames it (the menu link stays the same), adds entries (name + default sizes), edits an entry's name or sizes, reorders and deletes entries (blocked while jerseys use them)
3. The menu, dropdowns, shop filters, home sections and footer update immediately

### Flow 6: First admin setup (once)
1. Env has `DATABASE_URL` and `ADMIN_SETUP_KEY`; user table is empty
2. Opens `/admin/setup`, enters the setup key, name, email, password
3. Redirected to login; after the first user exists the setup page redirects to login

---

## DB Schema

Drizzle schema in `src/lib/db/schema.ts`. SQL to paste into the Neon SQL editor, in this order: `drizzle/0000_init.sql` (tables), then `drizzle/seed.sql` (starting types and entries; idempotent). Regenerate the tables SQL with `npx drizzle-kit generate --name <name>` after schema edits (as a new numbered file once the first one has been applied). Regenerate the seed with `npm run seed:sql` after editing `src/data/seed-types.json`.

Seed content: Club (17 clubs), Country (9 countries), Special (Retro, Brazil x Jordan, 125 Year Anniversary, Authentic Edition). No jerseys are seeded.

### user / session / account / verification
Standard Better Auth tables (names and columns must match Better Auth). Every user is an admin; there is no role column. `session.user_id` and `account.user_id` cascade on delete.

### rate_limit
| column | type | notes |
|---|---|---|
| id | text PK | |
| key | text | Better Auth rate limit key (IP + path) |
| count | integer | |
| last_request | bigint | ms epoch |

### jersey_types
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| name | text | shown in the menu |
| slug | text unique | from the name at creation, never changes on rename |
| sort_order | integer | menu order |
| created_at | timestamp | |

### jersey_groups
An entry under a type: one club, one country or one special.

| column | type | notes |
|---|---|---|
| id | uuid PK | |
| type_id | uuid FK → jersey_types | ON DELETE CASCADE |
| name | text | |
| slug | text | unique per type (`jersey_groups_type_slug_uq`) |
| sizes | text[] | default sizes for its jerseys, default S to 3XL |
| sort_order | integer | order inside the type |
| created_at | timestamp | |

Index: type_id. Deleting a type removes its entries, but only if no jersey uses them.

### jerseys
| column | type | notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| slug | text unique | from name, suffix on conflict, never changes on edit |
| name | text | |
| group_id | uuid FK → jersey_groups | ON DELETE RESTRICT |
| season | text | |
| version | text | Player / Fan |
| price | integer | BDT |
| old_price | integer null | shows strike-through and SAVE % |
| sizes | text[] null | own sizes; null means use the entry's sizes |
| in_stock, is_new | boolean | |
| image_url | text null | Cloudinary https URL; null shows the placeholder |
| description | text | |
| created_at, updated_at | timestamp | |

Indexes: group_id, created_at.

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
| saveJersey, toggleStock, deleteJersey | `src/app/admin/actions.ts` | requireAdmin | saveJersey validates with Zod; `sizes` empty means inherit from the entry |
| createTypeAction, renameTypeAction, deleteTypeAction, moveTypeAction | `src/app/admin/types-actions.ts` | requireAdmin | logic in `src/lib/data/queries.ts`; failures redirect back with a `?error=` banner |
| createGroupAction, updateGroupAction, deleteGroupAction, moveGroupAction | `src/app/admin/types-actions.ts` | requireAdmin | entries; delete blocked while jerseys use the entry |
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

- [x] Home, Shop with filters / sort / search / pagination, type and entry pages
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

### Phase 5 — Catalog structure and photos
Status: `[x]` done

- [x] Photo placeholders replace the drawn jerseys; Buy Now popup downloads real photos only
- [x] Cloudinary connection check on the dashboard Overview, upload hints and clear errors
- [x] Data-driven types and entries (tables, seed SQL, dashboard Types section, type dropdown nav, `/shop/[type]/[group]`)
- [x] Per-entry default sizes with optional per-jersey override
- [x] `npm run test:db` (20 checks on in-memory Postgres)

### Phase 6 — Go live
Status: `[ ]` pending

- [ ] Fill env vars (Vercel and Cloudflare); in Neon run `drizzle/0000_init.sql`, then `drizzle/seed.sql`
- [ ] Create first admin at `/admin/setup`, then remove `ADMIN_SETUP_KEY`
- [ ] Check Cloudinary on the dashboard Overview, add real jerseys with photos
- [ ] `npm run preview`, then deploy to Vercel and Cloudflare

### Phase 7 — Polish
Status: `[ ]` pending

- [ ] Privacy, Terms, Delivery and Return pages (needs owner policies)
- [ ] SEO: metadata, Open Graph, schema, sitemap, robots
- [ ] Choose a real CTA color (blue is a placeholder)
- [ ] Accessibility audit, UI tests (only `npm run test:db` exists)

---

## Next Steps

In order:
1. Fill the env vars; in the Neon SQL editor run `drizzle/0000_init.sql`, then `drizzle/seed.sql`
2. Create the first admin, remove `ADMIN_SETUP_KEY`, confirm Cloudinary on the Overview, add real jerseys with photos
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

**2026-10-12.** Drawn SVG jerseys removed. A missing photo is shown honestly as a neutral "Photo coming soon" tile; the popup never downloads a fake image.

**2026-10-12.** Types are data: the old fixed categories (club, national, retro, special) and the `team` column were replaced by `jersey_types` and `jersey_groups`. Retro became an entry under Special. Only Home and Shop stay hardcoded in the nav. The same seed list backs the no-database preview.

**2026-10-12.** Sizes live on the entry as the default, and a single jersey can override them (`jerseys.sizes` null means inherit). Deleting a type or entry that still has jerseys is blocked instead of cascading.

**2026-10-12.** Type, entry and jersey names are admin-typed and shown in one language; only Home, Shop and Custom Order in the menu are translated.
