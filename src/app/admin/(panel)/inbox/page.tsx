import type { Metadata } from "next";
import { Check, MessageCircle, Phone, RotateCcw, Trash2 } from "lucide-react";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { deleteSubmission, setSubmissionStatus } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/session";
import { listSubmissions } from "@/lib/data/submissions";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Inbox" };

const labels: Record<string, string> = {
  team: "Team",
  quantity: "Quantity",
  style: "Style",
  sizes: "Sizes",
  deadline: "Deadline",
};

export default async function InboxPage() {
  await requireAdmin();
  const subs = await listSubmissions();
  const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Inbox <span className="text-base font-normal text-muted">({subs.length})</span></h1>

      {subs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-semibold">No messages yet</p>
          <p className="mt-1 text-sm text-muted">Custom order requests and contact messages show up here.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {subs.map((s) => {
            const digits = (s.phone ?? "").replace(/\D/g, "");
            const details = Object.entries(s.payload).filter(([, v]) => v);
            return (
              <li key={s.id} className={cn("rounded-xl border bg-white p-5", s.status === "new" ? "border-brand/40" : "border-line")}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{s.name}</span>
                      <span className="rounded-full bg-bg px-2 py-0.5 text-xs font-semibold text-muted">{s.kind === "custom" ? "Custom order" : "Contact"}</span>
                      {s.status === "new" && <span className="rounded-full bg-brand-tint px-2 py-0.5 text-xs font-semibold text-brand">New</span>}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{when.format(s.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {digits && (
                      <>
                        <a href={`tel:+${digits}`} aria-label={`Call ${s.name}`} className="grid size-9 place-items-center rounded-lg hover:bg-bg"><Phone className="size-4" /></a>
                        <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${s.name}`} className="grid size-9 place-items-center rounded-lg text-wa-dark hover:bg-bg"><MessageCircle className="size-4" /></a>
                      </>
                    )}
                    <ConfirmForm action={setSubmissionStatus} fields={{ id: s.id, status: s.status === "new" ? "handled" : "new" }}>
                      <button type="submit" aria-label={s.status === "new" ? "Mark handled" : "Mark new"} className="grid size-9 place-items-center rounded-lg hover:bg-bg">
                        {s.status === "new" ? <Check className="size-4" /> : <RotateCcw className="size-4" />}
                      </button>
                    </ConfirmForm>
                    <ConfirmForm action={deleteSubmission} fields={{ id: s.id }} confirmText="Delete this message?">
                      <button type="submit" aria-label="Delete message" className="grid size-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="size-4" /></button>
                    </ConfirmForm>
                  </div>
                </div>

                {s.phone && <p className="mt-3 text-sm"><span className="font-semibold">Phone:</span> <span className="text-muted">{s.phone}</span></p>}
                {details.length > 0 && (
                  <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                    {details.map(([k, v]) => (
                      <div key={k} className="flex gap-2"><dt className="font-semibold">{labels[k] ?? k}:</dt><dd className="text-muted">{v}</dd></div>
                    ))}
                  </dl>
                )}
                {s.message && <p className="mt-3 whitespace-pre-wrap rounded-lg bg-bg p-3 text-sm">{s.message}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
