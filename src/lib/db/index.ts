import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function createDb(url: string) {
  return drizzle(neon(url), { schema });
}
export type Db = ReturnType<typeof createDb>;

/** null only when DATABASE_URL is missing (no env yet, or a build without env). */
export function getDb(): Db | null {
  const url = process.env.DATABASE_URL;
  return url ? createDb(url) : null;
}

/** For request-time code that must have a database. */
export function requireDb(): Db {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set");
  return db;
}
