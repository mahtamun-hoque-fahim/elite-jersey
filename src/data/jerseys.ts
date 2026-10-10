export type Category = "club" | "national" | "retro" | "special";
export type Pattern = "solid" | "stripes" | "hoops";

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
  colors: { body: string; sleeve: string; trim: string };
  pattern: Pattern;
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
  body: string;
  sleeve?: string;
  trim: string;
  pattern?: Pattern;
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
    colors: { body: s.body, sleeve: s.sleeve ?? s.body, trim: s.trim },
    pattern: s.pattern ?? "solid",
    description: `${s.team} ${s.season} ${s.kind.toLowerCase()} jersey. Sample listing: replace this text from the admin dashboard.`,
  };
}

const seeds: Seed[] = [
  { team: "Real Madrid", kind: "Away", category: "club", season: "26/27", body: "#0f5b4a", trim: "#d9c27a", isNew: true },
  { team: "FC Barcelona", kind: "Third", category: "club", season: "26/27", body: "#2cc4c7", sleeve: "#1b2a5c", trim: "#a50044", isNew: true },
  { team: "Manchester City", kind: "Home", category: "club", season: "26/27", body: "#6cabdd", trim: "#ffffff", isNew: true },
  { team: "Manchester City", kind: "Away", category: "club", season: "26/27", body: "#141414", trim: "#f5c400", isNew: true },
  { team: "Manchester City", kind: "Third", category: "club", season: "26/27", body: "#ffffff", sleeve: "#6cabdd", trim: "#1b2a5c", pattern: "stripes" },
  { team: "Manchester United", kind: "Home", category: "club", season: "26/27", body: "#c8102e", trim: "#111111", isNew: true },
  { team: "Manchester United", kind: "Away", category: "club", season: "26/27", body: "#1e4fc4", trim: "#ffd54a" },
  { team: "Liverpool", kind: "Home", category: "club", season: "26/27", body: "#b3202a", trim: "#ffffff", isNew: true },
  { team: "Arsenal", kind: "Home", category: "club", season: "26/27", body: "#d0202e", sleeve: "#ffffff", trim: "#ffffff" },
  { team: "Arsenal", kind: "Away", category: "club", season: "26/27", body: "#1b2c5c", trim: "#d9a441", isNew: true },
  { team: "Chelsea", kind: "Home", category: "club", season: "26/27", body: "#1e3fb8", trim: "#d9c27a" },
  { team: "Inter Miami", kind: "Away", category: "club", season: "26/27", body: "#141414", trim: "#f59ab5", inStock: false },
  { team: "AC Milan", kind: "Home", category: "club", season: "26/27", body: "#c8102e", sleeve: "#141414", trim: "#ffffff", pattern: "stripes" },
  { team: "Inter Milan", kind: "Home", category: "club", season: "26/27", body: "#0b3d91", sleeve: "#141414", trim: "#f5c400", pattern: "stripes" },
  { team: "Juventus", kind: "Home", category: "club", season: "26/27", body: "#ffffff", sleeve: "#141414", trim: "#c9a24b", pattern: "stripes" },
  { team: "FC Bayern Munchen", kind: "Home", category: "club", season: "26/27", body: "#d0021b", trim: "#ffffff" },
  { team: "Paris Saint-Germain", kind: "Home", category: "club", season: "26/27", body: "#0f2a6b", trim: "#d0021b" },
  { team: "Borussia Dortmund", kind: "Home", category: "club", season: "26/27", body: "#fde100", trim: "#141414" },
  { team: "Atletico Madrid", kind: "Away", category: "club", season: "26/27", body: "#151515", trim: "#c6ff2e" },
  { team: "Flamengo", kind: "Home", category: "club", season: "26/27", body: "#c8102e", sleeve: "#141414", trim: "#ffffff", pattern: "hoops" },
  { team: "Al-Nassr", kind: "Home", category: "club", season: "26/27", body: "#ffd600", trim: "#1b2c5c" },
  { team: "Al-Nassr", kind: "Third", category: "club", season: "26/27", body: "#f4f1e6", trim: "#c8a24b" },

  { team: "Argentina", kind: "Home", category: "national", season: "2026", body: "#ffffff", sleeve: "#75aadb", trim: "#d9b44a", pattern: "stripes", suffix: " Premium - Player Version (Imported)" },
  { team: "Argentina", kind: "Away", category: "national", season: "2026", body: "#1b2c5c", trim: "#75aadb", suffix: " Premium - Player Version (Imported)" },
  { team: "Brazil", kind: "Home", category: "national", season: "2026", body: "#ffdc00", trim: "#009c3b", price: 990, oldPrice: null, suffix: " Premium - Player Version (Imported)" },
  { team: "Brazil", kind: "Away", category: "national", season: "2026", body: "#1b3fa8", trim: "#ffdc00", suffix: " Premium - Player Version (Imported)" },
  { team: "Germany", kind: "Home", category: "national", season: "2026", body: "#ffffff", trim: "#141414", suffix: " Premium - Player Version (Imported)" },
  { team: "Germany", kind: "Away", category: "national", season: "2026", body: "#1b2c5c", trim: "#4fb3bf", oldPrice: null, suffix: " Premium - Player Version (Imported)" },
  { team: "France", kind: "Home", category: "national", season: "2026", body: "#1b3fa8", trim: "#ffffff", oldPrice: null, suffix: " Premium - Player Version (Imported)" },
  { team: "Spain", kind: "Home", category: "national", season: "2026", body: "#c8102e", trim: "#ffd54a", suffix: " Premium - Player Version (Imported)" },
  { team: "Spain", kind: "Away", category: "national", season: "2026", body: "#ffffff", trim: "#c8102e", oldPrice: null, suffix: " Premium - Player Version (Imported)" },
  { team: "Portugal", kind: "Home", category: "national", season: "2026", body: "#b3132b", trim: "#0b6b3a", suffix: " Premium - Player Version (Imported)" },
  { team: "Saudi Arabia", kind: "Home", category: "national", season: "2026", body: "#0b6b3a", trim: "#ffffff", suffix: " Premium - Player Version (Imported)" },
  { team: "Bangladesh", kind: "Home", category: "national", season: "2026", body: "#006a4e", trim: "#f42a41", suffix: " Premium - Fan Version" },

  { team: "AC Milan", kind: "Retro Home", category: "retro", season: "2007", body: "#c8102e", sleeve: "#141414", trim: "#ffffff", pattern: "stripes", price: 1190, oldPrice: 1490, suffix: " - Retro Edition" },
  { team: "Brazil", kind: "Retro Home", category: "retro", season: "1998", body: "#ffdc00", trim: "#009c3b", price: 1190, oldPrice: 1490, suffix: " - Retro Edition" },
  { team: "Manchester United", kind: "Retro Home", category: "retro", season: "1999", body: "#c8102e", trim: "#141414", price: 1190, oldPrice: 1490, suffix: " - Retro Edition" },
  { team: "Netherlands", kind: "Retro Home", category: "retro", season: "1988", body: "#f36c21", trim: "#ffffff", price: 1190, oldPrice: 1490, suffix: " - Retro Edition" },

  { team: "Brazil x Jordan", kind: "Special", category: "special", season: "2026", body: "#ffffff", sleeve: "#1f7a3a", trim: "#e0b52a", oldPrice: null, suffix: " White & Green - Special Edition (Imported)" },
  { team: "Germany", kind: "125 Year Anniversary", category: "special", season: "2026", body: "#f4efe0", sleeve: "#d9a441", trim: "#141414", pattern: "stripes", price: 1090, oldPrice: null, suffix: " Edition (Imported)" },
  { team: "Portugal", kind: "Special", category: "special", season: "25/26", body: "#141414", trim: "#c8a24b", suffix: " Authentic Edition" },
];

export const jerseys: Jersey[] = seeds.map(make);

export const getJersey = (slug: string) => jerseys.find((j) => j.slug === slug);
export const byCategory = (c: Category) => jerseys.filter((j) => j.category === c);
export const savePercent = (j: Jersey) =>
  j.oldPrice ? Math.round(((j.oldPrice - j.price) / j.oldPrice) * 100) : 0;
export const money = (n: number) => `৳${n.toLocaleString("en-US")}`;

export function related(j: Jersey, n = 4) {
  const same = jerseys.filter((x) => x.id !== j.id && (x.team === j.team || x.category === j.category));
  same.sort((a, b) => Number(b.team === j.team) - Number(a.team === j.team));
  return same.slice(0, n);
}
