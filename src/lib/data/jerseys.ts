import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { getDb } from "@/lib/db";
import { seedCatalog, seedJerseys, type CatalogType, type Jersey } from "@/data/jerseys";
import { fetchCatalog, fetchJerseyBy, fetchJerseys } from "./queries";

/* ---------- Public (rendered per request so dashboard edits show immediately) ---------- */

/** Types and their entries, in the order set in the dashboard. Cached per request. */
export const getCatalog = cache(async (): Promise<CatalogType[]> => {
  await connection();
  const db = getDb();
  return db ? fetchCatalog(db) : seedCatalog;
});

export const listJerseys = cache(async (): Promise<Jersey[]> => {
  await connection();
  const db = getDb();
  return db ? fetchJerseys(db) : seedJerseys;
});

export async function getJerseyBySlug(slug: string): Promise<Jersey | null> {
  await connection();
  const db = getDb();
  if (!db) return seedJerseys.find((j) => j.slug === slug) ?? null;
  return fetchJerseyBy(db, { slug });
}

/** Same entry first, then same type. */
export function relatedFrom(all: Jersey[], j: Jersey, n = 4) {
  const pool = all.filter((x) => x.id !== j.id && (x.groupId === j.groupId || x.typeSlug === j.typeSlug));
  pool.sort((a, b) => Number(b.groupId === j.groupId) - Number(a.groupId === j.groupId));
  return pool.slice(0, n);
}

/* ---------- Admin (callers must run requireAdmin first) ---------- */

export async function adminCatalog(): Promise<CatalogType[]> {
  const db = getDb();
  return db ? fetchCatalog(db) : [];
}

export async function adminListJerseys(): Promise<Jersey[]> {
  const db = getDb();
  return db ? fetchJerseys(db) : [];
}

export async function adminGetJersey(id: string): Promise<Jersey | null> {
  const db = getDb();
  return db ? fetchJerseyBy(db, { id }) : null;
}
