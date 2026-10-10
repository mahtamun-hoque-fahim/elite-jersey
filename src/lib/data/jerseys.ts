import "server-only";
import { connection } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { jerseys as jerseysTable } from "@/lib/db/schema";
import { NEUTRAL_COLORS, seedJerseys, type Category, type Jersey } from "@/data/jerseys";

type Row = typeof jerseysTable.$inferSelect;

export function toJersey(r: Row): Jersey {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    team: r.team,
    category: r.category as Category,
    season: r.season,
    version: r.version === "Fan" ? "Fan" : "Player",
    price: r.price,
    oldPrice: r.oldPrice ?? undefined,
    sizes: r.sizes,
    inStock: r.inStock,
    isNew: r.isNew,
    colors: NEUTRAL_COLORS,
    pattern: "solid",
    image: r.imageUrl ?? undefined,
    description: r.description,
  };
}

/* ---------- Public (rendered per request so dashboard edits show immediately) ---------- */

export async function listJerseys(): Promise<Jersey[]> {
  await connection();
  const db = getDb();
  if (!db) return seedJerseys;
  const rows = await db.select().from(jerseysTable).orderBy(desc(jerseysTable.createdAt)).limit(500);
  return rows.map(toJersey);
}

export async function getJerseyBySlug(slug: string): Promise<Jersey | null> {
  await connection();
  const db = getDb();
  if (!db) return seedJerseys.find((j) => j.slug === slug) ?? null;
  const [row] = await db.select().from(jerseysTable).where(eq(jerseysTable.slug, slug)).limit(1);
  return row ? toJersey(row) : null;
}

export function relatedFrom(all: Jersey[], j: Jersey, n = 4) {
  const pool = all.filter((x) => x.id !== j.id && (x.team === j.team || x.category === j.category));
  pool.sort((a, b) => Number(b.team === j.team) - Number(a.team === j.team));
  return pool.slice(0, n);
}

/* ---------- Admin (callers must run requireAdmin first) ---------- */

export async function adminListJerseys(): Promise<Jersey[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db.select().from(jerseysTable).orderBy(desc(jerseysTable.createdAt)).limit(500);
  return rows.map(toJersey);
}

export async function adminGetJersey(id: string): Promise<Jersey | null> {
  const db = getDb();
  if (!db) return null;
  const [row] = await db.select().from(jerseysTable).where(eq(jerseysTable.id, id)).limit(1);
  return row ? toJersey(row) : null;
}
