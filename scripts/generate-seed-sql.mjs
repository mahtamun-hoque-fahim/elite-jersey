// Generates drizzle/seed.sql from src/data/seed-types.json. Run: npm run seed:sql
// The SQL is idempotent: safe to paste into the Neon SQL editor more than once.
import { readFileSync, writeFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../src/data/seed-types.json", import.meta.url), "utf8"));
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

const out = ["-- Seed: jersey types and their entries (clubs, countries, specials). Idempotent.", ""];
data.types.forEach((t, ti) => {
  out.push(`INSERT INTO jersey_types (name, slug, sort_order) VALUES (${q(t.name)}, ${q(t.slug)}, ${ti})`);
  out.push("ON CONFLICT (slug) DO NOTHING;", "");
  const values = t.groups
    .map((g, gi) => `  ((SELECT id FROM jersey_types WHERE slug = ${q(t.slug)}), ${q(g)}, ${q(slugify(g))}, ${gi})`)
    .join(",\n");
  out.push("INSERT INTO jersey_groups (type_id, name, slug, sort_order) VALUES", values);
  out.push("ON CONFLICT (type_id, slug) DO NOTHING;", "");
});
writeFileSync(new URL("../drizzle/seed.sql", import.meta.url), out.join("\n"));
console.log("wrote drizzle/seed.sql");
