// Generates drizzle/seed.sql (types and entries) and drizzle/seed-jerseys.sql (starting jerseys)
// from src/data/seed-types.json and src/data/seed-jerseys.json. Run: npm run seed:sql
// Both files are idempotent: safe to paste into the Neon SQL editor more than once.
import { readFileSync, writeFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

// ---- types and entries
const types = read("../src/data/seed-types.json");
const out = ["-- Seed: jersey types and their entries (clubs, countries, specials, combos). Idempotent.", ""];
types.types.forEach((t, ti) => {
  out.push(`INSERT INTO jersey_types (name, slug, sort_order) VALUES (${q(t.name)}, ${q(t.slug)}, ${ti})`);
  out.push("ON CONFLICT (slug) DO NOTHING;", "");
  const values = t.groups
    .map((g, gi) => `  ((SELECT id FROM jersey_types WHERE slug = ${q(t.slug)}), ${q(g)}, ${q(slugify(g))}, ${gi})`)
    .join(",\n");
  out.push("INSERT INTO jersey_groups (type_id, name, slug, sort_order) VALUES", values);
  out.push("ON CONFLICT (type_id, slug) DO NOTHING;", "");
});
writeFileSync(new URL("../drizzle/seed.sql", import.meta.url), out.join("\n"));

// ---- jerseys (run after seed.sql). The first listed jersey is the newest.
const { jerseys } = read("../src/data/seed-jerseys.json");
const groupOf = (t, g) => `(SELECT g.id FROM jersey_groups g JOIN jersey_types t ON t.id = g.type_id WHERE t.slug = ${q(t)} AND g.slug = ${q(slugify(g))})`;
const slugs = new Set();
const rows = jerseys.map((j, i) => {
  const slug = slugify(j.name);
  if (slugs.has(slug)) throw new Error(`Duplicate jersey slug: ${slug}`);
  slugs.add(slug);
  return `  (${q(slug)}, ${q(j.name)}, ${groupOf(j.type, j.group)}, ${q(j.season ?? "")}, ${j.price}, now() - interval '${i} minutes')`;
});
const jerseySql = [
  "-- Seed: starting jerseys (names, club, season, price). No photos or Facebook links yet: add those in the dashboard. Idempotent.",
  "-- Run after seed.sql.",
  "",
  "INSERT INTO jerseys (slug, name, group_id, season, price, created_at) VALUES",
  rows.join(",\n"),
  "ON CONFLICT (slug) DO NOTHING;",
  "",
];
writeFileSync(new URL("../drizzle/seed-jerseys.sql", import.meta.url), jerseySql.join("\n"));
console.log(`wrote drizzle/seed.sql and drizzle/seed-jerseys.sql (${jerseys.length} jerseys)`);
