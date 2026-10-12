import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { FlashError } from "@/components/admin/FlashError";
import { SizeChecks } from "@/components/admin/SizeChecks";
import { Field, inputCls } from "@/components/FormField";
import {
  createGroupAction,
  deleteGroupAction,
  moveGroupAction,
  renameTypeAction,
  updateGroupAction,
} from "@/app/admin/types-actions";
import { requireAdmin } from "@/lib/auth/session";
import { adminCatalog } from "@/lib/data/jerseys";

export const metadata: Metadata = { title: "Type entries" };

export default async function TypeDetailPage({ params, searchParams }: PageProps<"/admin/types/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const type = (await adminCatalog()).find((t) => t.id === id);
  if (!type) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/types" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
        <ArrowLeft className="size-4" /> All types
      </Link>

      <form action={renameTypeAction} className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={type.id} />
        <div className="min-w-56 flex-1">
          <Field label="Type name" htmlFor="type-name"><input id="type-name" name="name" defaultValue={type.name} required minLength={2} maxLength={60} className={`${inputCls} font-display text-lg font-semibold`} /></Field>
        </div>
        <button type="submit" className="h-11 rounded-xl border border-brand px-5 text-sm font-semibold text-brand hover:bg-brand-tint">Rename</button>
      </form>
      <p className="-mt-3 text-xs text-muted">Menu link: /shop/{type.slug} (the link stays the same when you rename).</p>

      <FlashError message={typeof error === "string" ? error : undefined} />

      <form action={createGroupAction} className="space-y-4 rounded-xl border border-line bg-white p-5">
        <input type="hidden" name="typeId" value={type.id} />
        <h2 className="font-display text-base font-semibold">Add an entry</h2>
        <Field label="Name" htmlFor="new-entry"><input id="new-entry" name="name" required minLength={2} maxLength={60} placeholder={`Example: a ${type.name.toLowerCase()} name`} className={inputCls} /></Field>
        <div>
          <p className="mb-2 text-sm font-semibold">Sizes available</p>
          <SizeChecks />
        </div>
        <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark">
          <Plus className="size-4" /> Add entry
        </button>
      </form>

      <section>
        <h2 className="mb-3 font-display text-base font-semibold">
          Entries <span className="font-normal text-muted">({type.groups.length})</span>
        </h2>
        {type.groups.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">No entries yet.</p>
        ) : (
          <ul className="space-y-3">
            {type.groups.map((g, i) => (
              <li key={g.id} className="rounded-xl border border-line bg-white p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <form action={updateGroupAction} className="min-w-64 flex-1 space-y-3">
                    <input type="hidden" name="id" value={g.id} />
                    <input type="hidden" name="typeId" value={type.id} />
                    <div className="flex flex-wrap items-center gap-2">
                      <label htmlFor={`n-${g.id}`} className="sr-only">Entry name</label>
                      <input id={`n-${g.id}`} name="name" defaultValue={g.name} required minLength={2} maxLength={60} className={`${inputCls} max-w-xs font-semibold`} />
                      <span className="text-xs text-muted">/shop/{type.slug}/{g.slug}</span>
                    </div>
                    <SizeChecks selected={g.sizes} />
                    <button type="submit" className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark">
                      <Save className="size-4" /> Save
                    </button>
                  </form>
                  <div className="flex items-center gap-1">
                    <ConfirmForm action={moveGroupAction} fields={{ id: g.id, typeId: type.id, dir: "up" }}>
                      <button type="submit" disabled={i === 0} aria-label={`Move ${g.name} up`} className="grid size-9 place-items-center rounded-lg hover:bg-bg disabled:opacity-30"><ArrowUp className="size-4" /></button>
                    </ConfirmForm>
                    <ConfirmForm action={moveGroupAction} fields={{ id: g.id, typeId: type.id, dir: "down" }}>
                      <button type="submit" disabled={i === type.groups.length - 1} aria-label={`Move ${g.name} down`} className="grid size-9 place-items-center rounded-lg hover:bg-bg disabled:opacity-30"><ArrowDown className="size-4" /></button>
                    </ConfirmForm>
                    <ConfirmForm action={deleteGroupAction} fields={{ id: g.id, typeId: type.id }} confirmText={`Delete "${g.name}"?`}>
                      <button type="submit" aria-label={`Delete ${g.name}`} className="grid size-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="size-4" /></button>
                    </ConfirmForm>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
