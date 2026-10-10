import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { AdminCreateForm } from "@/components/admin/AdminCreateForm";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { deleteAdmin } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/session";
import { listAdmins } from "@/lib/data/submissions";

export const metadata: Metadata = { title: "Admins" };

export default async function AdminsPage() {
  const session = await requireAdmin();
  const admins = await listAdmins();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Admins</h1>
      <AdminCreateForm />
      <ul className="divide-y divide-line rounded-xl border border-line bg-white">
        {admins.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-semibold">{a.name}{a.id === session.user.id && <span className="ml-2 text-xs font-normal text-muted">(you)</span>}</p>
              <p className="truncate text-sm text-muted">{a.email}</p>
            </div>
            {a.id !== session.user.id && (
              <ConfirmForm action={deleteAdmin} fields={{ id: a.id }} confirmText={`Remove ${a.name}? They will lose access immediately.`}>
                <button type="submit" aria-label={`Remove ${a.name}`} className="grid size-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="size-4" /></button>
              </ConfirmForm>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
