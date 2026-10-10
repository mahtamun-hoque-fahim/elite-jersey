import Link from "next/link";
import { Inbox, Plus, Shirt, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { adminListJerseys } from "@/lib/data/jerseys";
import { adminCount, listSubmissions } from "@/lib/data/submissions";

export default async function OverviewPage() {
  await requireAdmin();
  const [list, subs, admins] = await Promise.all([adminListJerseys(), listSubmissions(), adminCount()]);
  const inStock = list.filter((j) => j.inStock).length;
  const fresh = subs.filter((s) => s.status === "new");

  const stats = [
    { label: "Jerseys", value: list.length, icon: Shirt, href: "/admin/jerseys" },
    { label: "In stock", value: inStock, icon: Shirt, href: "/admin/jerseys" },
    { label: "New requests", value: fresh.length, icon: Inbox, href: "/admin/inbox" },
    { label: "Admins", value: admins, icon: Users, href: "/admin/admins" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Overview</h1>
        <Link href="/admin/jerseys/new" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          <Plus className="size-4" /> Add jersey
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-xl border border-line bg-white p-4 transition-shadow hover:shadow-md">
            <s.icon className="size-5 text-brand" />
            <p className="mt-3 font-display text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-line bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Latest requests</h2>
          <Link href="/admin/inbox" className="text-sm font-semibold text-brand hover:underline">Open inbox</Link>
        </div>
        {subs.length === 0 ? (
          <p className="text-sm text-muted">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {subs.slice(0, 5).map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="truncate">
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-muted"> &middot; {s.kind === "custom" ? "Custom order" : "Contact"}</span>
                </span>
                {s.status === "new" && <span className="rounded-full bg-brand-tint px-2 py-0.5 text-xs font-semibold text-brand">New</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
