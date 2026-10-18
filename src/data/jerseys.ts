import seedTypes from "./seed-types.json";

export interface CatalogGroup {
  id: string;
  name: string;
  slug: string;
  /** default sizes for every jersey in this entry */
  sizes: string[];
  sortOrder: number;
}
export interface CatalogType {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  groups: CatalogGroup[];
}

export interface Jersey {
  id: string;
  slug: string;
  name: string;
  typeSlug: string;
  typeName: string;
  groupId: string;
  groupSlug: string;
  groupName: string;
  season: string;
  version: "Player" | "Fan";
  price: number;
  oldPrice?: number;
  /** sizes shown to buyers: the jersey's own list, or its entry's default */
  sizes: string[];
  /** the jersey's own list, or null when it uses the entry's default */
  sizesOverride: string[] | null;
  inStock: boolean;
  isNew?: boolean;
  image?: string;
  fbPostUrl?: string;
  description: string;
}

export const ALL_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Used only when DATABASE_URL is not set (local preview before env is filled in). */
export const seedCatalog: CatalogType[] = seedTypes.types.map((t, ti) => ({
  id: `seed-type-${t.slug}`,
  name: t.name,
  slug: t.slug,
  sortOrder: ti,
  groups: t.groups.map((g, gi) => ({ id: `seed-${t.slug}-${slugify(g)}`, name: g, slug: slugify(g), sizes: ALL_SIZES, sortOrder: gi })),
}));

/**
 * No sample jerseys are bundled: real jerseys (photo, price, Facebook link) are added in the dashboard.
 * Without DATABASE_URL the preview shows the seeded menu with an empty shop.
 */
export const seedJerseys: Jersey[] = [];

export const savePercent = (j: Jersey) =>
  j.oldPrice ? Math.round(((j.oldPrice - j.price) / j.oldPrice) * 100) : 0;
export const money = (n: number) => `৳${n.toLocaleString("en-US")}`;

/** Cloudinary delivery URL with transforms; other URLs pass through unchanged. */
export function img(url: string | undefined, transform = "f_auto,q_auto,w_600") {
  if (!url || !url.includes("/image/upload/")) return url;
  return url.replace("/image/upload/", `/image/upload/${transform}/`);
}
