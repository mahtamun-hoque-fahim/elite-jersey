"use server";

import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth/session";
import { getDb, requireDb } from "@/lib/db";
import { jerseys, submissions, user } from "@/lib/db/schema";
import { adminCount } from "@/lib/data/submissions";
import { adminSchema, jerseySchema } from "@/lib/validation/schemas";

export type State = { error?: string; ok?: boolean } | undefined;

function firstIssue(e: { issues: { message: string; path: PropertyKey[] }[] }) {
  const i = e.issues[0];
  return i ? `${String(i.path[0] ?? "Form")}: ${i.message}` : "Invalid input";
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

/* ---------------- Jerseys ---------------- */

export async function saveJersey(_prev: State, formData: FormData): Promise<State> {
  await requireAdmin();
  const db = requireDb();
  const id = String(formData.get("id") ?? "");

  const parsed = jerseySchema.safeParse({
    name: formData.get("name"),
    groupId: formData.get("groupId"),
    season: formData.get("season"),
    version: formData.get("version"),
    price: formData.get("price"),
    oldPrice: formData.get("oldPrice") ?? "",
    sizes: formData.getAll("sizes"),
    inStock: formData.get("inStock") === "on",
    isNew: formData.get("isNew") === "on",
    imageUrl: formData.get("imageUrl") ?? "",
    fbPostUrl: formData.get("fbPostUrl") ?? "",
    description: formData.get("description") ?? "",
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const d = parsed.data;

  if (id) {
    await db.update(jerseys).set({ ...d, updatedAt: new Date() }).where(eq(jerseys.id, id));
  } else {
    let slug = slugify(d.name) || "jersey";
    const [taken] = await db.select({ id: jerseys.id }).from(jerseys).where(eq(jerseys.slug, slug)).limit(1);
    if (taken) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    await db.insert(jerseys).values({ ...d, slug });
  }
  revalidatePath("/admin/jerseys");
  redirect("/admin/jerseys");
}

export async function toggleStock(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const db = requireDb();
  const [row] = await db.select({ inStock: jerseys.inStock }).from(jerseys).where(eq(jerseys.id, id)).limit(1);
  if (row) await db.update(jerseys).set({ inStock: !row.inStock, updatedAt: new Date() }).where(eq(jerseys.id, id));
  revalidatePath("/admin/jerseys");
}

export async function deleteJersey(formData: FormData) {
  await requireAdmin();
  await requireDb().delete(jerseys).where(eq(jerseys.id, String(formData.get("id") ?? "")));
  revalidatePath("/admin/jerseys");
}

/* ---------------- Inbox ---------------- */

export async function setSubmissionStatus(formData: FormData) {
  await requireAdmin();
  const status = formData.get("status") === "handled" ? "handled" : "new";
  await requireDb().update(submissions).set({ status }).where(eq(submissions.id, String(formData.get("id") ?? "")));
  revalidatePath("/admin/inbox");
}

export async function deleteSubmission(formData: FormData) {
  await requireAdmin();
  await requireDb().delete(submissions).where(eq(submissions.id, String(formData.get("id") ?? "")));
  revalidatePath("/admin/inbox");
}

/* ---------------- Admins ---------------- */

export async function createAdmin(_prev: State, formData: FormData): Promise<State> {
  await requireAdmin();
  const parsed = adminSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  try {
    await auth.api.signUpEmail({ body: parsed.data });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not create the admin" };
  }
  revalidatePath("/admin/admins");
  return { ok: true };
}

export async function deleteAdmin(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id === session.user.id) return; // never delete yourself
  await requireDb().delete(user).where(and(eq(user.id, id), ne(user.id, session.user.id)));
  revalidatePath("/admin/admins");
}

/** First admin only. Needs ADMIN_SETUP_KEY and an empty user table. */
export async function setupFirstAdmin(_prev: State, formData: FormData): Promise<State> {
  if (!getDb()) return { error: "DATABASE_URL is not set yet." };
  const key = process.env.ADMIN_SETUP_KEY;
  if (!key) return { error: "ADMIN_SETUP_KEY is not set." };
  if (String(formData.get("setupKey") ?? "") !== key) return { error: "Wrong setup key." };
  if ((await adminCount()) > 0) return { error: "Setup is already done. Log in instead." };

  const parsed = adminSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  try {
    await auth.api.signUpEmail({ body: parsed.data });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not create the admin" };
  }
  redirect("/admin/login");
}
