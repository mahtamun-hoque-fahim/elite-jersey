# Elite Jersey - Design Guide

Layout reference: jersey.com.bd (clean, minimal, white cards on light grey). Structure reference for about/footer: Jersey Museum BD.

## Tokens (src/app/globals.css)
- Background #f5f6f8, card #ffffff, line #e5e7eb
- Ink #0b0b0c, muted #6b6b70
- Brand (primary blue, temporary until a CTA color is chosen): #2563eb, hover #1d4ed8, tint #eaf1ff
- WhatsApp green #25d366, used only for WhatsApp buttons
- Logo is black and white (text wordmark in src/components/Logo.tsx until the real logo is supplied)

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
