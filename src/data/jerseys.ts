export type Category = "club" | "national" | "retro" | "special";

export interface Jersey {
  id: string;
  slug: string;
  name: string;
  team: string;
  category: Category;
  season: string;
  version: "Player" | "Fan";
  price: number;
  oldPrice?: number;
  sizes: string[];
  inStock: boolean;
  isNew?: boolean;
  image?: string;
  description: string;
}

export const categoryLabels: Record<Category, string> = {
  club: "Club Jersey",
  national: "Country Jersey",
  retro: "Retro Jerseys",
  special: "Special Edition",
};

export const ALL_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

type Seed = {
  team: string;
  kind: string;
  category: Category;
  season: string;
  price?: number;
  oldPrice?: number | null;
  inStock?: boolean;
  isNew?: boolean;
  suffix?: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function make(s: Seed, i: number): Jersey {
  const name = `${s.team} ${s.season} ${s.kind} Jersey${s.suffix ?? " - Player Version (Imported)"}`;
  return {
    id: String(i + 1),
    slug: slugify(name),
    name,
    team: s.team,
    category: s.category,
    season: s.season,
    version: "Player",
    price: s.price ?? 990,
    oldPrice: s.oldPrice === null ? undefined : (s.oldPrice ?? 1250),
    sizes: ALL_SIZES,
    inStock: s.inStock ?? true,
    isNew: s.isNew,
    description: `${s.team} ${s.season} ${s.kind.toLowerCase()} jersey. Sample listing: replace this text from the admin dashboard.`,
  };
}

const seeds: Seed[] = [
  { team: "Real Madrid", kind: "Away", category: "club", season: "26/27", isNew: true },
  { team: "FC Barcelona", kind: "Third", category: "club", season: "26/27", isNew: true },
  { team: "Manchester City", kind: "Home", category: "club", season: "26/27", isNew: true },
  { team: "Manchester City", kind: "Away", category: "club", season: "26/27", isNew: true },
  { team: "Manchester City", kind: "Third", category: "club", season: "26/27" },
  { team: "Manchester United", kind: "Home", category: "club", season: "26/27", isNew: true },
  { team: "Manchester United", kind: "Away", category: "club", season: "26/27" },
  { team: "Liverpool", kind: "Home", category: "club", season: "26/27", isNew: true },
  { team: "Arsenal", kind: "Home", category: "club", season: "26/27" },
  { team: "Arsenal", kind: "Away", category: "club", season: "26/27", isNew: true },
  { team: "Chelsea", kind: "Home", category: "club", season: "26/27" },
  { team: "Inter Miami", kind: "Away", category: "club", season: "26/27", inStock: false },
  { team: "AC Milan", kind: "Home", category: "club", season: "26/27" },
  { team: "Inter Milan", kind: "Home", category: "club", season: "26/27" },
  { team: "Juventus", kind: "Home", category: "club", season: "26/27" },
  { team: "FC Bayern Munchen", kind: "Home", category: "club", season: "26/27" },
  { team: "Paris Saint-Germain", kind: "Home", category: "club", season: "26/27" },
  { team: "Borussia Dortmund", kind: "Home", category: "club", season: "26/27" },
  { team: "Atletico Madrid", kind: "Away", category: "club", season: "26/27" },
  { team: "Flamengo", kind: "Home", category: "club", season: "26/27" },
  { team: "Al-Nassr", kind: "Home", category: "club", season: "26/27" },
  { team: "Al-Nassr", kind: "Third", category: "club", season: "26/27" },

  { team: "Argentina", kind: "Home", category: "national", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Argentina", kind: "Away", category: "national", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Brazil", kind: "Home", category: "national", season: "2026", price: 990, oldPrice: null, suffix: " Premium - Player Version (Imported)" },
  { team: "Brazil", kind: "Away", category: "national", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Germany", kind: "Home", category: "national", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Germany", kind: "Away", category: "national", season: "2026", oldPrice: null, suffix: " Premium - Player Version (Imported)" },
  { team: "France", kind: "Home", category: "national", season: "2026", oldPrice: null, suffix: " Premium - Player Version (Imported)" },
  { team: "Spain", kind: "Home", category: "national", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Spain", kind: "Away", category: "national", season: "2026", oldPrice: null, suffix: " Premium - Player Version (Imported)" },
  { team: "Portugal", kind: "Home", category: "national", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Saudi Arabia", kind: "Home", category: "national", season: "2026", suffix: " Premium - Player Version (Imported)" },
  { team: "Bangladesh", kind: "Home", category: "national", season: "2026", suffix: " Premium - Fan Version" },

  { team: "AC Milan", kind: "Retro Home", category: "retro", season: "2007", price: 1190, oldPrice: 1490, suffix: " - Retro Edition" },
  { team: "Brazil", kind: "Retro Home", category: "retro", season: "1998", price: 1190, oldPrice: 1490, suffix: " - Retro Edition" },
  { team: "Manchester United", kind: "Retro Home", category: "retro", season: "1999", price: 1190, oldPrice: 1490, suffix: " - Retro Edition" },
  { team: "Netherlands", kind: "Retro Home", category: "retro", season: "1988", price: 1190, oldPrice: 1490, suffix: " - Retro Edition" },

  { team: "Brazil x Jordan", kind: "Special", category: "special", season: "2026", oldPrice: null, suffix: " White & Green - Special Edition (Imported)" },
  { team: "Germany", kind: "125 Year Anniversary", category: "special", season: "2026", price: 1090, oldPrice: null, suffix: " Edition (Imported)" },
  { team: "Portugal", kind: "Special", category: "special", season: "25/26", suffix: " Authentic Edition" },
];

/** Sample data. Used only when DATABASE_URL is not set (local preview before env is filled in). */
export const seedJerseys: Jersey[] = seeds.map(make);

export const savePercent = (j: Jersey) =>
  j.oldPrice ? Math.round(((j.oldPrice - j.price) / j.oldPrice) * 100) : 0;
export const money = (n: number) => `৳${n.toLocaleString("en-US")}`;

export const NEUTRAL_COLORS = { trim: "#9aa1ad" };

/** Cloudinary delivery URL with transforms; other URLs pass through unchanged. */
export function img(url: string | undefined, transform = "f_auto,q_auto,w_600") {
  if (!url || !url.includes("/image/upload/")) return url;
  return url.replace("/image/upload/", `/image/upload/${transform}/`);
}
