# Elite Jersey — Design Guide

Implementation spec for the design system. Layout reference: jersey.com.bd (clean, minimal, white cards on light grey). No rationale, just tokens, patterns and constraints.

## Color tokens

Light only. Defined in `src/app/globals.css` with `@theme inline` (Tailwind v4, no `tailwind.config.ts`). The brand blue is a placeholder until a real CTA color is chosen: change `--color-brand*` only.

```css
@theme inline {
  --color-bg: #f5f6f8;          /* page */
  --color-card: #ffffff;        /* cards, header, panels */
  --color-line: #e5e7eb;        /* borders */
  --color-ink: #0b0b0c;         /* main text */
  --color-muted: #6b6b70;       /* secondary text */
  --color-brand: #2563eb;       /* primary buttons, active states, badges */
  --color-brand-dark: #1d4ed8;  /* hover, pressed */
  --color-brand-tint: #eaf1ff;  /* chips, highlighted sections */
  --color-brand-light: #4f8bff; /* hero gradient end */
  --color-wa: #25d366;          /* WhatsApp buttons only */
  --color-wa-dark: #1ebe5b;
}
```

Utilities: `bg-bg`, `bg-card`, `border-line`, `text-ink`, `text-muted`, `bg-brand`, `hover:bg-brand-dark`, `bg-brand-tint`, `bg-wa`. Destructive actions use Tailwind `red-600` / `red-50`.

## Typography

**Families** (`@fontsource`, mapped in `@theme inline`):
- Display (`font-display`): Poppins 500 / 600 / 700, then Noto Sans Bengali Variable
- Body (`font-sans`): Open Sans Variable, then Noto Sans Bengali Variable
- Noto Sans Bengali loads only when Bengali glyphs appear (unicode-range subsets)

**Size scale used:** `text-xs` badges and hints, `text-sm` body and labels, `text-base` card prices, `text-lg` and `text-xl` section titles, `text-2xl` and `text-3xl` page titles, `text-3xl` to `text-5xl` hero.

**Line height:** `leading-snug` for card and product titles, `leading-tight` for the hero, `leading-relaxed` for paragraphs.

## Spacing scale

Tailwind defaults. Page container: `max-w-7xl px-4`. Section gap on Home: `space-y-14`. Card padding `p-3`, panels `p-5` to `p-8`.

## Border radius

| Use | Class |
|---|---|
| Inputs, buttons, small controls | `rounded-lg` |
| Primary CTA, popup buttons | `rounded-xl` |
| Cards, product image, panels | `rounded-xl` |
| Hero, large panels, popup | `rounded-2xl` |
| Chips, size pills, icon buttons | `rounded-full` |

## Shadows

Almost none. Cards use a 1px `border-line`; hover adds `hover:shadow-md`. Popup `shadow-2xl`. Hero art `drop-shadow-lg`.

## Components

### Button — primary
```tsx
<button className="h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">Buy Now</button>
```

### Button — outline
```tsx
<a className="grid h-10 place-items-center rounded-lg border border-brand text-sm font-semibold text-brand transition-colors hover:bg-brand-tint">Details</a>
```

### Button — WhatsApp
```tsx
<a className="flex h-12 items-center justify-center gap-2 rounded-xl bg-wa font-semibold text-white transition-colors hover:bg-wa-dark">Continue to WhatsApp</a>
```
Disabled state: `bg-wa/40 pointer-events-none`.

### Input
```tsx
<input className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" />
```
Textarea uses the same classes with `py-2.5` and no fixed height. Shared in `src/components/FormField.tsx`.

### Product card
White card, `border-line`, `p-3`. Image on `bg-linear-to-b from-white to-zinc-200/70`, square. Blue badge top-right (`SAVE n%` or `NEW`). Title 2 lines, centered. Price bold with struck old price. Buttons: Buy Now (primary) + Details (outline). Stock out replaces buttons with a bordered `Stock Out` box.

### Photo placeholder
`src/components/PhotoPlaceholder.tsx`. Fills its parent (`size-full`), `bg-linear-to-b from-white to-zinc-200/70`, white circle with a lucide image icon (`size-14`, `size-8` when `compact`) and a `text-xs text-muted` label. Same box as a photo, so nothing shifts when a real image arrives. Used in cards, product page, home hero tiles, order popup thumbnail and the admin jersey list (compact).

### Badge
```tsx
<span className="absolute right-0 top-0 rounded-bl-lg bg-brand px-2 py-1 text-[11px] font-bold tracking-wide text-white">SAVE 21%</span>
```

### Size pill
`h-9 min-w-11 rounded-full border px-3 text-sm`; selected: `border-brand bg-brand text-white`.

### Section heading
Poppins 600, blue `h-0.5 w-10` underline, "View all items" link on the right in `text-xs uppercase text-brand`.

### Buy Now popup (OrderProvider)
Native `<dialog>`; centered `max-w-md`, bottom sheet on mobile. Jersey summary, size pills, 3 numbered steps, Download Photo (primary), Continue to WhatsApp (locked until downloaded), note line. A jersey with no photo skips the steps and the download button, shows a short notice, and Continue to WhatsApp is enabled immediately.

### Shop filters
Left sidebar `17rem` on desktop with collapsible groups (blue underline titles); bottom sheet on mobile. 4-column grid on desktop, 2 columns on mobile, 12 per page.

### Header and nav
Logo (black SVG, `public/logo.svg`) left, centered search, WhatsApp link, blue Custom Order button, language toggle; centered nav row below on large screens, hamburger on mobile. Active nav item is blue.

### Admin dashboard (`/admin`)
Same tokens. White sidebar (top bar on mobile), grey content area, white bordered cards. Tables scroll horizontally on small screens. Delete actions ask for confirmation. Pages: Overview, Jerseys, Add/Edit jersey, Inbox, Admins, plus centered Login and Setup cards. Stays English.

### Language toggle
Shows the other language ("বাং" or "EN") with a languages icon. Choice stored in the `lang` cookie; no cookie falls back to the browser language (Bengali if it starts with bn).

## Animation defaults

- Hover transitions: `transition-colors` (150-200ms, `--ease-subtle`)
- Card image hover: `transition-transform duration-300 ease-subtle`, scale 1.05
- Maximum UI animation: 300ms
- `prefers-reduced-motion: reduce` collapses all animation and transition durations (in `globals.css`)

## Light and dark notes

Light only. Dark mode is not planned.

## Rules

- No emojis. Icons are lucide-react, plus hand-rolled Facebook and Instagram SVGs (not in lucide).
- No cart, login, wishlist or checkout on the storefront.
- Jersey photos are Cloudinary URLs with transforms (`f_auto,q_auto,w_*`) in plain `<img>` with `object-contain` (Cloudflare has no image optimizer). Jerseys without a photo show `PhotoPlaceholder` (square, grey gradient, image icon, "Photo coming soon"); there is no drawn jersey art anywhere.
- All UI strings live in `src/i18n/dictionaries.ts` (en and bn); add both languages for every new string.
