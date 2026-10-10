import "server-only";
import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { submissions, user } from "@/lib/db/schema";

export type Submission = typeof submissions.$inferSelect;

export async function listSubmissions(): Promise<Submission[]> {
  const db = getDb();
  if (!db) return [];
  return db.select().from(submissions).orderBy(desc(submissions.createdAt)).limit(300);
}

export async function newSubmissionCount(): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  const [r] = await db.select({ n: count() }).from(submissions).where(eq(submissions.status, "new"));
  return r?.n ?? 0;
}

export async function listAdmins() {
  const db = getDb();
  if (!db) return [];
  return db.select({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }).from(user).orderBy(user.createdAt).limit(100);
}

export async function adminCount(): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  const [r] = await db.select({ n: count() }).from(user);
  return r?.n ?? 0;
}
