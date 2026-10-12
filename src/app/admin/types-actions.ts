"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { requireDb } from "@/lib/db";
import * as q from "@/lib/data/queries";

const str = (f: FormData, k: string) => String(f.get(k) ?? "");

/** Shows the message on the page the admin came from, using a ?error= flash. */
function back(path: string, r: q.Result, okPath = path): never {
  revalidatePath("/admin/types");
  revalidatePath(path);
  if (!r.ok) redirect(`${path}?error=${encodeURIComponent(r.error)}`);
  redirect(okPath);
}

export async function createTypeAction(formData: FormData) {
  await requireAdmin();
  const r = await q.createType(requireDb(), str(formData, "name"));
  back("/admin/types", r, r.ok && r.id ? `/admin/types/${r.id}` : "/admin/types");
}

export async function renameTypeAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  back(`/admin/types/${id}`, await q.renameType(requireDb(), id, str(formData, "name")));
}

export async function deleteTypeAction(formData: FormData) {
  await requireAdmin();
  back("/admin/types", await q.deleteType(requireDb(), str(formData, "id")));
}

export async function moveTypeAction(formData: FormData) {
  await requireAdmin();
  const dir = str(formData, "dir") === "up" ? "up" : "down";
  back("/admin/types", await q.moveType(requireDb(), str(formData, "id"), dir));
}

export async function createGroupAction(formData: FormData) {
  await requireAdmin();
  const typeId = str(formData, "typeId");
  back(`/admin/types/${typeId}`, await q.createGroup(requireDb(), typeId, str(formData, "name"), formData.getAll("sizes").map(String)));
}

export async function updateGroupAction(formData: FormData) {
  await requireAdmin();
  const typeId = str(formData, "typeId");
  back(`/admin/types/${typeId}`, await q.updateGroup(requireDb(), str(formData, "id"), str(formData, "name"), formData.getAll("sizes").map(String)));
}

export async function deleteGroupAction(formData: FormData) {
  await requireAdmin();
  back(`/admin/types/${str(formData, "typeId")}`, await q.deleteGroup(requireDb(), str(formData, "id")));
}

export async function moveGroupAction(formData: FormData) {
  await requireAdmin();
  const dir = str(formData, "dir") === "up" ? "up" : "down";
  back(`/admin/types/${str(formData, "typeId")}`, await q.moveGroup(requireDb(), str(formData, "id"), dir));
}
