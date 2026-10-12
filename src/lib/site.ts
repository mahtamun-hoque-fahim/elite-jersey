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
} as const;

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
