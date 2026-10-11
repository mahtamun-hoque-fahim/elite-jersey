"use server";

import { count, gt } from "drizzle-orm";
import { getDb, type Db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { contactSchema, customOrderSchema } from "@/lib/validation/schemas";

export type FormResult = { ok: boolean; saved?: boolean; error?: string };

// Cheap flood guard without Redis: at most 20 stored messages in any 10 minutes, site-wide.
async function isFlooded(db: Db) {
  const since = new Date(Date.now() - 10 * 60 * 1000);
  const [r] = await db.select({ n: count() }).from(submissions).where(gt(submissions.createdAt, since));
  return (r?.n ?? 0) >= 20;
}

function fields(formData: FormData) {
  return Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
}

// A hidden "website" field catches simple bots. Real people never fill it.
function isBot(raw: Record<string, string>) {
  return Boolean(raw.website);
}

export async function submitCustomOrder(_prev: FormResult | undefined, formData: FormData): Promise<FormResult> {
  const raw = fields(formData);
  if (isBot(raw)) return { ok: true, saved: true };
  const parsed = customOrderSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const d = parsed.data;

  const db = getDb();
  if (!db) return { ok: true, saved: false };
  if (await isFlooded(db)) return { ok: false, error: "busy" };
  await db.insert(submissions).values({
    kind: "custom",
    name: d.contact,
    phone: d.phone,
    message: d.notes || null,
    payload: { team: d.team, quantity: String(d.quantity), style: d.style, sizes: d.sizes, deadline: d.deadline },
  });
  return { ok: true, saved: true };
}

export async function submitContact(_prev: FormResult | undefined, formData: FormData): Promise<FormResult> {
  const raw = fields(formData);
  if (isBot(raw)) return { ok: true, saved: true };
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const d = parsed.data;

  const db = getDb();
  if (!db) return { ok: true, saved: false };
  if (await isFlooded(db)) return { ok: false, error: "busy" };
  await db.insert(submissions).values({ kind: "contact", name: d.name, phone: d.phone || null, message: d.message });
  return { ok: true, saved: true };
}
