import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { deleteJersey, toggleStock } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/session";
import { adminListJerseys } from "@/lib/data/jerseys";
import { img, money } from "@/data/jerseys";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Jerseys" };

export default async function JerseysAdminPage() {
  await requireAdmin();
  const list = await adminListJerseys();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Jerseys <span className="text-base font-normal text-muted">({list.length})</span></h1>
        <Link href="/admin/jerseys/new" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          <Plus className="size-4" /> Add jersey
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-semibold">No jerseys yet</p>
          <p className="mt-1 text-sm text-muted">Add your first jersey to show it on the site.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-176 text-left text-sm">
            <thead className="border-b border-line bg-bg text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="p-3 font-semibold">Jersey</th>
                <th className="p-3 font-semibold">Type / entry</th>
                <th className="p-3 font-semibold">Price</th>
                <th className="p-3 font-semibold">Stock</th>
                <th className="p-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((j) => (
                <tr key={j.id}>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-bg">
                        {j.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img(j.image, "f_auto,q_auto,w_120")} alt="" className="size-full object-contain" />
                        ) : (
                          <PhotoPlaceholder label="No photo" compact />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-semibold">{j.name}</p>
                        <p className="text-xs text-muted">{j.season} &middot; {j.sizes.join(", ")}{j.sizesOverride ? " (custom)" : ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted">{j.typeName} &middot; {j.groupName}</td>
                  <td className="p-3 font-semibold">{money(j.price)}</td>
                  <td className="p-3">
                    <form action={toggleStock}>
                      <input type="hidden" name="id" value={j.id} />
                      <button
                        type="submit"
                        aria-label={j.inStock ? "Mark out of stock" : "Mark in stock"}
                        className={cn("rounded-full px-3 py-1 text-xs font-semibold", j.inStock ? "bg-brand-tint text-brand" : "bg-bg text-muted")}
                      >
                        {j.inStock ? "In stock" : "Stock out"}
                      </button>
                    </form>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/jerseys/${j.id}`} aria-label={`Edit ${j.name}`} className="grid size-9 place-items-center rounded-lg text-ink hover:bg-bg">
                        <Pencil className="size-4" />
                      </Link>
                      <ConfirmForm action={deleteJersey} fields={{ id: j.id }} confirmText={`Delete "${j.name}"?`}>
                        <button type="submit" aria-label={`Delete ${j.name}`} className="grid size-9 place-items-center rounded-lg text-red-600 hover:bg-red-50">
                          <Trash2 className="size-4" />
                        </button>
                      </ConfirmForm>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
