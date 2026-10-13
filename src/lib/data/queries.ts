// Pure database logic. No Next.js imports, so it can be tested against any Postgres driver.
import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";
import type * as schema from "@/lib/db/schema";
import { jerseyGroups, jerseyTypes, jerseys } from "@/lib/db/schema";
import { ALL_SIZES, slugify, type CatalogType, type Jersey } from "@/data/jerseys";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDb = PgDatabase<any, typeof schema>;
export type Result = { ok: true; id?: string } | { ok: false; error: string };

const fail = (error: string): Result => ({ ok: false, error });

/* ---------------- Reads ---------------- */

export async function fetchCatalog(db: AnyDb): Promise<CatalogType[]> {
  const [types, groups] = await Promise.all([
    db.select().from(jerseyTypes).orderBy(asc(jerseyTypes.sortOrder), asc(jerseyTypes.createdAt)),
    db.select().from(jerseyGroups).orderBy(asc(jerseyGroups.sortOrder), asc(jerseyGroups.name)),
  ]);
  return types.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    sortOrder: t.sortOrder,
    groups: groups
      .filter((g) => g.typeId === t.id)
      .map((g) => ({ id: g.id, name: g.name, slug: g.slug, sizes: g.sizes, sortOrder: g.sortOrder })),
  }));
}

function jerseySelect(db: AnyDb) {
  return db
    .select({ j: jerseys, g: jerseyGroups, t: jerseyTypes })
    .from(jerseys)
    .innerJoin(jerseyGroups, eq(jerseys.groupId, jerseyGroups.id))
    .innerJoin(jerseyTypes, eq(jerseyGroups.typeId, jerseyTypes.id));
}

type JoinRow = Awaited<ReturnType<ReturnType<typeof jerseySelect>["limit"]>>[number];

function toJersey({ j, g, t }: JoinRow): Jersey {
  return {
    id: j.id,
    slug: j.slug,
    name: j.name,
    typeSlug: t.slug,
    typeName: t.name,
    groupId: g.id,
    groupSlug: g.slug,
    groupName: g.name,
    season: j.season,
    version: j.version === "Fan" ? "Fan" : "Player",
    price: j.price,
    oldPrice: j.oldPrice ?? undefined,
    sizes: j.sizes && j.sizes.length ? j.sizes : g.sizes,
    sizesOverride: j.sizes && j.sizes.length ? j.sizes : null,
    inStock: j.inStock,
    isNew: j.isNew,
    image: j.imageUrl ?? undefined,
    fbPostUrl: j.fbPostUrl ?? undefined,
    description: j.description,
  };
}

export async function fetchJerseys(db: AnyDb, limit = 500): Promise<Jersey[]> {
  const rows = await jerseySelect(db).orderBy(desc(jerseys.createdAt)).limit(limit);
  return rows.map(toJersey);
}

export async function fetchJerseyBy(db: AnyDb, by: { slug: string } | { id: string }): Promise<Jersey | null> {
  const where = "slug" in by ? eq(jerseys.slug, by.slug) : eq(jerseys.id, by.id);
  const [row] = await jerseySelect(db).where(where).limit(1);
  return row ? toJersey(row) : null;
}

/* ---------------- Mutations ---------------- */

const cleanName = (s: string) => s.trim().replace(/\s+/g, " ");
const validName = (s: string) => s.length >= 2 && s.length <= 60;
const cleanSizes = (sizes: string[]) => ALL_SIZES.filter((s) => sizes.includes(s));

async function uniqueSlug(base: string, taken: (slug: string) => Promise<boolean>) {
  let slug = base || "item";
  for (let i = 2; await taken(slug); i++) slug = `${base || "item"}-${i}`;
  return slug;
}

/** Re-numbers sort_order 0..n-1 in the current order, then swaps the item with its neighbour. */
async function reorder<T extends { id: string }>(
  rows: T[],
  id: string,
  dir: "up" | "down",
  write: (id: string, order: number) => Promise<unknown>,
) {
  const i = rows.findIndex((r) => r.id === id);
  const k = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || k < 0 || k >= rows.length) return;
  const next = [...rows];
  [next[i], next[k]] = [next[k], next[i]];
  await Promise.all(next.map((r, order) => write(r.id, order)));
}

export async function createType(db: AnyDb, nameIn: string): Promise<Result> {
  const name = cleanName(nameIn);
  if (!validName(name)) return fail("Name must be 2 to 60 characters.");
  const slug = await uniqueSlug(slugify(name), async (s) => {
    const [r] = await db.select({ id: jerseyTypes.id }).from(jerseyTypes).where(eq(jerseyTypes.slug, s)).limit(1);
    return Boolean(r);
  });
  const all = await db.select({ id: jerseyTypes.id }).from(jerseyTypes);
  const [row] = await db.insert(jerseyTypes).values({ name, slug, sortOrder: all.length }).returning({ id: jerseyTypes.id });
  return { ok: true, id: row.id };
}

export async function renameType(db: AnyDb, id: string, nameIn: string): Promise<Result> {
  const name = cleanName(nameIn);
  if (!validName(name)) return fail("Name must be 2 to 60 characters.");
  await db.update(jerseyTypes).set({ name }).where(eq(jerseyTypes.id, id));
  return { ok: true, id };
}

async function jerseyCount(db: AnyDb, groupIds: string[]) {
  if (!groupIds.length) return 0;
  const [r] = await db.select({ n: count() }).from(jerseys).where(inArray(jerseys.groupId, groupIds));
  return r?.n ?? 0;
}

export async function deleteType(db: AnyDb, id: string): Promise<Result> {
  const groups = await db.select({ id: jerseyGroups.id }).from(jerseyGroups).where(eq(jerseyGroups.typeId, id));
  const n = await jerseyCount(db, groups.map((g) => g.id));
  if (n > 0) return fail(`This type still has ${n} jersey${n === 1 ? "" : "s"}. Move or delete them first.`);
  await db.delete(jerseyTypes).where(eq(jerseyTypes.id, id));
  return { ok: true };
}

export async function moveType(db: AnyDb, id: string, dir: "up" | "down"): Promise<Result> {
  const rows = await db.select({ id: jerseyTypes.id }).from(jerseyTypes).orderBy(asc(jerseyTypes.sortOrder), asc(jerseyTypes.createdAt));
  await reorder(rows, id, dir, (rid, order) => db.update(jerseyTypes).set({ sortOrder: order }).where(eq(jerseyTypes.id, rid)));
  return { ok: true };
}

export async function createGroup(db: AnyDb, typeId: string, nameIn: string, sizesIn: string[]): Promise<Result> {
  const name = cleanName(nameIn);
  const sizes = cleanSizes(sizesIn);
  if (!validName(name)) return fail("Name must be 2 to 60 characters.");
  if (!sizes.length) return fail("Pick at least one size.");
  const slug = await uniqueSlug(slugify(name), async (s) => {
    const [r] = await db
      .select({ id: jerseyGroups.id })
      .from(jerseyGroups)
      .where(and(eq(jerseyGroups.typeId, typeId), eq(jerseyGroups.slug, s)))
      .limit(1);
    return Boolean(r);
  });
  const siblings = await db.select({ id: jerseyGroups.id }).from(jerseyGroups).where(eq(jerseyGroups.typeId, typeId));
  const [row] = await db
    .insert(jerseyGroups)
    .values({ typeId, name, slug, sizes, sortOrder: siblings.length })
    .returning({ id: jerseyGroups.id });
  return { ok: true, id: row.id };
}

export async function updateGroup(db: AnyDb, id: string, nameIn: string, sizesIn: string[]): Promise<Result> {
  const name = cleanName(nameIn);
  const sizes = cleanSizes(sizesIn);
  if (!validName(name)) return fail("Name must be 2 to 60 characters.");
  if (!sizes.length) return fail("Pick at least one size.");
  await db.update(jerseyGroups).set({ name, sizes }).where(eq(jerseyGroups.id, id));
  return { ok: true, id };
}

export async function deleteGroup(db: AnyDb, id: string): Promise<Result> {
  const n = await jerseyCount(db, [id]);
  if (n > 0) return fail(`This entry still has ${n} jersey${n === 1 ? "" : "s"}. Move or delete them first.`);
  await db.delete(jerseyGroups).where(eq(jerseyGroups.id, id));
  return { ok: true };
}

export async function moveGroup(db: AnyDb, id: string, dir: "up" | "down"): Promise<Result> {
  const [g] = await db.select({ typeId: jerseyGroups.typeId }).from(jerseyGroups).where(eq(jerseyGroups.id, id)).limit(1);
  if (!g) return fail("Entry not found.");
  const rows = await db
    .select({ id: jerseyGroups.id })
    .from(jerseyGroups)
    .where(eq(jerseyGroups.typeId, g.typeId))
    .orderBy(asc(jerseyGroups.sortOrder), asc(jerseyGroups.name));
  await reorder(rows, id, dir, (rid, order) => db.update(jerseyGroups).set({ sortOrder: order }).where(eq(jerseyGroups.id, rid)));
  return { ok: true };
}
