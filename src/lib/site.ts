export const site = {
  name: "Elite Jersey",
  tagline: "Premium football jerseys. Club, country, retro and custom kits.",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  address: process.env.NEXT_PUBLIC_ADDRESS ?? "",
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  },
  nav: [
    { href: "/", key: "home" },
    { href: "/shop", key: "shop" },
    { href: "/shop/club", key: "club" },
    { href: "/shop/national", key: "national" },
    { href: "/shop/retro", key: "retro" },
    { href: "/shop/special", key: "special" },
    { href: "/custom-order", key: "custom" },
  ],
} as const;

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
