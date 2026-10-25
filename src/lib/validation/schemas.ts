import { z } from "zod";

export const sizeList = ["S", "M", "L", "XL", "2XL", "3XL"] as const;

function isFacebookUrl(v: string) {
  try {
    const u = new URL(v);
    const h = u.hostname.toLowerCase();
    const ok = (d: string) => h === d || h.endsWith(`.${d}`);
    return u.protocol === "https:" && (ok("facebook.com") || ok("fb.com") || h === "fb.watch" || h === "fb.me");
  } catch {
    return false;
  }
}

const money = z.coerce.number().int().min(0).max(1_000_000);

export const jerseySchema = z.object({
  name: z.string().trim().min(3).max(160),
  groupId: z.string().uuid("Pick a type and an entry"),
  season: z.string().trim().max(20), // optional: some kits (combos, undated retros) have no season
  version: z.enum(["Player", "Fan"]),
  price: money.refine((n) => n > 0, "Price is required"),
  oldPrice: z
    .union([z.literal(""), money])
    .transform((v) => (v === "" || v === 0 ? null : v)),
  // empty = use the entry's sizes
  sizes: z.array(z.enum(sizeList)).transform((v) => (v.length ? v : null)),
  inStock: z.boolean(),
  isNew: z.boolean(),
  imageUrl: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https:\/\//.test(v), "Image must be an https URL")
    .transform((v) => v || null),
  fbPostUrl: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || isFacebookUrl(v), "Facebook post link must be an https link to facebook.com")
    .transform((v) => v || null),
  description: z.string().trim().max(2000),
});

export const customOrderSchema = z.object({
  team: z.string().trim().min(2).max(100),
  contact: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  quantity: z.coerce.number().int().min(1).max(5000),
  style: z.string().trim().max(40).optional().default(""),
  sizes: z.string().trim().max(200).optional().default(""),
  deadline: z.string().trim().max(20).optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(30).optional().default(""),
  message: z.string().trim().min(3).max(3000),
});

export const adminSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(10, "Use at least 10 characters").max(128),
});
