import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronRight, Plus, Trash2 } from "lucide-react";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { FlashError } from "@/components/admin/FlashError";
import { Field, inputCls } from "@/components/FormField";
import { createTypeAction, deleteTypeAction, moveTypeAction } from "@/app/admin/types-actions";
import { requireAdmin } from "@/lib/auth/session";
import { adminCatalog } from "@/lib/data/jerseys";

export const metadata: Metadata = { title: "Types" };

export default async function TypesPage({ searchParams }: PageProps<"/admin/types">) {
  await requireAdmin();
  const { error } = await searchParams;
  const types = await adminCatalog();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Types</h1>
        <p className="mt-1 text-sm text-muted">
          Each type shows in the site menu, with its entries listed under it (for example Club with Real Madrid, Arsenal and so on). Home and Shop are always there.
        </p>
      </div>
      <FlashError message={typeof error === "string" ? error : undefined} />

      <form action={createTypeAction} className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-white p-5">
        <div className="min-w-56 flex-1">
          <Field label="New type" htmlFor="new-type"><input id="new-type" name="name" required minLength={2} maxLength={60} placeholder="Example: Replica" className={inputCls} /></Field>
        </div>
        <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark">
          <Plus className="size-4" /> Add type
        </button>
      </form>

      {types.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-semibold">No types yet</p>
          <p className="mt-1 text-sm text-muted">Run drizzle/seed.sql in Neon to add Club, Country and Special with their entries, or add a type above.</p>
        </div>
      ) : (
        <ul className="divide-y divide-line rounded-xl border border-line bg-white">
          {types.map((t, i) => (
            <li key={t.id} className="flex items-center gap-2 p-3 sm:p-4">
              <Link href={`/admin/types/${t.id}`} className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 hover:bg-bg">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{t.name}</p>
                  <p className="text-xs text-muted">{t.groups.length} {t.groups.length === 1 ? "entry" : "entries"} &middot; /shop/{t.slug}</p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted group-hover:text-brand" />
              </Link>
              <ConfirmForm action={moveTypeAction} fields={{ id: t.id, dir: "up" }}>
                <button type="submit" disabled={i === 0} aria-label={`Move ${t.name} up`} className="grid size-9 place-items-center rounded-lg hover:bg-bg disabled:opacity-30"><ArrowUp className="size-4" /></button>
              </ConfirmForm>
              <ConfirmForm action={moveTypeAction} fields={{ id: t.id, dir: "down" }}>
                <button type="submit" disabled={i === types.length - 1} aria-label={`Move ${t.name} down`} className="grid size-9 place-items-center rounded-lg hover:bg-bg disabled:opacity-30"><ArrowDown className="size-4" /></button>
              </ConfirmForm>
              <ConfirmForm action={deleteTypeAction} fields={{ id: t.id }} confirmText={`Delete the type "${t.name}" and its ${t.groups.length} entries?`}>
                <button type="submit" aria-label={`Delete ${t.name}`} className="grid size-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="size-4" /></button>
              </ConfirmForm>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
