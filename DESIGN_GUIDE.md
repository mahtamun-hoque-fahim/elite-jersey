# Elite Jersey - Design Guide

Layout reference: jersey.com.bd (clean, minimal, white cards on light grey). Structure reference for about/footer: Jersey Museum BD.

## Tokens (src/app/globals.css)
- Background #f5f6f8, card #ffffff, line #e5e7eb
- Ink #0b0b0c, muted #6b6b70
- Brand (primary blue, temporary until a CTA color is chosen): #2563eb, hover #1d4ed8, tint #eaf1ff
- WhatsApp green #25d366, used only for WhatsApp buttons
- Logo: black SVG wordmark at public/logo.svg (also src/app/icon.svg as the favicon), rendered by src/components/Logo.tsx

## Type
- Display: Poppins 500/600/700. Body: Open Sans Variable. Both via @fontsource.

## Components
- Product card: soft grey gradient image, blue badge (SAVE % or NEW), 2-line name, price with struck old price, Buy Now (solid blue) + Details (outline). Stock Out replaces the buttons.
- Buy Now popup (OrderProvider): size chips, 3 steps, Download Photo, then Continue to WhatsApp (enabled after download), prefilled message.
- Shop: left filter sidebar on desktop, bottom sheet on mobile; 4-column grid; pagination.

## Rules
- No cart, login, wishlist or checkout. Orders happen on WhatsApp.
- No emojis. lucide-react icons only; hand-rolled SVG for Facebook and Instagram (not in lucide).
- Jersey images are SVG placeholders (JerseyArt) until real photos are uploaded.

## Admin dashboard (/admin)
- Same tokens as the public site. White sidebar (top bar on mobile), light-grey content area, white cards with thin borders.
- Pages: Overview (stats, latest requests), Jerseys (table, stock toggle, edit, delete), Add/Edit jersey (photo upload to Cloudinary, sizes, flags), Inbox (custom orders and contact messages, mark handled, WhatsApp/call shortcuts), Admins (add and remove).
- Login and first-admin setup pages are centered cards on the grey background.
- Destructive actions (delete jersey, message, admin) ask for confirmation.

## Language (English / Bengali)
- Toggle in the header (shows the other language: "বাং" or "EN"). Choice is stored in the `lang` cookie; with no cookie the browser language decides (Bengali if it starts with bn), else English.
- All UI strings live in `src/i18n/dictionaries.ts` (en and bn). Server components use `getT()` from `src/i18n/server.ts`, client components use `useI18n()`. Add every new string to both languages.
- Fonts: Poppins and Open Sans for Latin, Noto Sans Bengali Variable for Bengali (loaded only when Bengali glyphs appear).
- Jersey names and descriptions come from the dashboard and are shown as entered (single language). WhatsApp messages stay in English so the shop owner reads one format.
- Storefront chrome (header, footer, WhatsApp button, order popup) lives in `src/app/(site)/layout.tsx`. The admin dashboard has its own layout and stays English.
