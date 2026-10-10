# Elite Jersey

Football jersey catalog. Visitors browse jerseys, tap Buy Now, download the photo and continue to WhatsApp. Custom order and contact forms land in the admin dashboard inbox.

Stack: Next.js 16 (App Router), TypeScript, Tailwind v4, Neon + Drizzle (neon-http), Better Auth, Cloudinary, lucide-react. Dual deploy: Vercel and Cloudflare (OpenNext).

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in later; the site shows sample jerseys until DATABASE_URL is set
npm run dev
```

## Setup checklist (when you fill in env)
1. Create a Neon project. Paste `drizzle/0000_init.sql` into the Neon SQL editor and run it.
2. Set `DATABASE_URL` (pooled), `BETTER_AUTH_SECRET` (long random string), `BETTER_AUTH_URL` (your site URL), `ADMIN_SETUP_KEY` (any secret).
3. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
4. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits only, with country code, for example 8801XXXXXXXXX) plus optional phone, address, Facebook and Instagram URLs.
5. Open `/admin/setup`, enter the setup key and create the first admin. Then remove `ADMIN_SETUP_KEY`.
6. Log in at `/admin/login`, add jerseys. More admins: Dashboard, Admins.

## Notes
- Public sign-up is blocked in `src/app/api/auth/[...all]/route.ts`. Admins are created from the dashboard only.
- Auth is validated in `requireAdmin()` (`src/lib/auth/session.ts`). `src/proxy.ts` is only a fast redirect.
- Jersey photos upload straight from the browser to Cloudinary with a signed request (`/api/admin/upload-signature`).
- Public pages render per request, so dashboard edits show immediately.
- No emojis. Icons are lucide-react, plus hand-rolled Facebook and Instagram SVGs.
