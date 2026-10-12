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

type Seed = {
  team: string;
  kind: string;
  type: "club" | "country" | "special";
  group?: string;
  season: string;
  price?: number;
  oldPrice?: number | null;
  inStock?: boolean;
  isNew?: boolean;
  suffix?: string;
};

function make(s: Seed, i: number): Jersey {
  const name = `${s.team} ${s.season} ${s.kind} Jersey${s.suffix ?? " - Player Version (Imported)"}`;
  const type = seedCatalog.find((t) => t.slug === s.type)!;
  const groupName = s.group ?? s.team;
  const group = type.groups.find((g) => g.slug === slugify(groupName))!;
  return {
    id: String(i + 1),
    slug: slugify(name),
    name,
    typeSlug: type.slug,
    typeName: type.name,
    groupId: group.id,
    groupSlug: group.slug,
    groupName: group.name,
    season: s.season,
    version: "Player",
    price: s.price ?? 990,
    oldPrice: s.oldPrice === null ? undefined : (s.oldPrice ?? 1250),
    sizes: group.sizes,
    sizesOverride: null,
    inStock: s.inStock ?? true,
    isNew: s.isNew,
    description: `${s.team} ${s.season} ${s.kind.toLowerCase()} jersey. Sample listing: replace this text from the admin dashboard.`,
  };
}

const seeds: Seed[] = [
  { team: "Real Madrid", kind: "Away", type: "club", season: "26/27", isNew: true },
  { team: "FC Barcelona", kind: "Third", type: "club", season: "26/27", isNew: true },
  { team: "Manchester City", kind: "Home", type: "club", season: "26/27", isNew: true },
  { team: "Manchester City", kind: "Away", type: "club", season: "26/27", isNew: true },
  { team: "Manchester City", kind: "Third", type: "club", season: "26/27" },
  { team: "Manchester United", kind: "Home", type: "club", season: "26/27", isNew: true },
  { team: "Manchester United", kind: "Away", type: "club", season: "26/27" },
  { team: "Liverpool", kind: "Home", type: "club", season: "26/27", isNew: true },
  { team: "Arsenal", kind: "Home", type: "club", season: "26/27" },
  { team: "Arsenal", kind: "Away", type: "club", season: "26/27", isNew: true },
  { team: "Chelsea", kind: "Home", type: "club", season: "26/27" },
  { team: "Inter Miami", kind: "Away", type: "club", season: "26/27", inStock: false },
  { team: "AC Milan", kind: "Home", type: "club", season: "26/27" },
  { team: "Inter Milan", kind: "Home", type: "club", season: "26/27" },
  { team: "Juventus", kind: "Home", type: "club", season: "26/27" },
  { team: "FC Bayern Munchen", kind: "Home", type: "club", season: "26/27" },
  { team: "Paris Saint-Germain", kind: "Home", type: "club", season: "26/27" },
  { team: "Borussia Dortmund", kind: "Home", type: "club", season: "26/27" },
  { team: "Atletico Madrid", kind: "Away", type: "club", season: "26/27" },
  { team: "Flamengo", kind: "Home", type: "club", season: "26/27" },
  { team: "Al-Nassr", kind: "Home", type: "club", season: "26/27" },
  { team: "Al-Nassr", kind: "Third", type: "club", season: "26/27" },

  { team: "Argentina", kind: "Home", type: "country", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Argentina", kind: "Away", type: "country", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Brazil", kind: "Home", type: "country", season: "2026", price: 990, oldPrice: null, suffix: " Premium - Player Version (Imported)" },
  { team: "Brazil", kind: "Away", type: "country", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Germany", kind: "Home", type: "country", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Germany", kind: "Away", type: "country", season: "2026", oldPrice: null, suffix: " Premium - Player Version (Imported)" },
  { team: "France", kind: "Home", type: "country", season: "2026", oldPrice: null, suffix: " Premium - Player Version (Imported)" },
  { team: "Spain", kind: "Home", type: "country", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Spain", kind: "Away", type: "country", season: "2026", oldPrice: null, suffix: " Premium - Player Version (Imported)" },
  { team: "Portugal", kind: "Home", type: "country", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Saudi Arabia", kind: "Home", type: "country", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Bangladesh", kind: "Home", type: "country", season: "2026", suffix: " Premium - Fan Version" },

  { team: "AC Milan", kind: "Retro Home", type: "special", group: "Retro", season: "2007", price: 1190, oldPrice: 1490, suffix: " - Retro Edition" },
  { team: "Brazil", kind: "Retro Home", type: "special", group: "Retro", season: "1998", price: 1190, oldPrice: 1490, suffix: " - Retro Edition" },
  { team: "Manchester United", kind: "Retro Home", type: "special", group: "Retro", season: "1999", price: 1190, oldPrice: 1490, suffix: " - Retro Edition" },
  { team: "Netherlands", kind: "Retro Home", type: "special", group: "Retro", season: "1988", price: 1190, oldPrice: 1490, suffix: " - Retro Edition" },

  { team: "Brazil x Jordan", kind: "Special", type: "special", group: "Brazil x Jordan", season: "2026", oldPrice: null, suffix: " White & Green - Special Edition (Imported)" },
  { team: "Germany", kind: "125 Year Anniversary", type: "special", group: "125 Year Anniversary", season: "2026", price: 1090, oldPrice: null, suffix: " Edition (Imported)" },
  { team: "Portugal", kind: "Special", type: "special", group: "Authentic Edition", season: "25/26", suffix: " Authentic Edition" },
];

/** Sample data. Used only when DATABASE_URL is not set (local preview before env is filled in). */
export const seedJerseys: Jersey[] = seeds.map(make);

export const savePercent = (j: Jersey) =>
  j.oldPrice ? Math.round(((j.oldPrice - j.price) / j.oldPrice) * 100) : 0;
export const money = (n: number) => `৳${n.toLocaleString("en-US")}`;

/** Cloudinary delivery URL with transforms; other URLs pass through unchanged. */
export function img(url: string | undefined, transform = "f_auto,q_auto,w_600") {
  if (!url || !url.includes("/image/upload/")) return url;
  return url.replace("/image/upload/", `/image/upload/${transform}/`);
}
