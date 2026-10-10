import type { Metadata } from "next";
import { CustomOrderForm } from "@/components/CustomOrderForm";

export const metadata: Metadata = { title: "Custom Order", description: "Request custom football kits for your local team." };

export default function CustomOrderPage() {
  const steps = ["Send your team details", "Approve the design", "Receive your kit"];
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Custom kits for your team</h1>
      <p className="mt-2 text-muted">Tell us about your team and what you need. We reply on WhatsApp with the design and price.</p>
      <ol className="my-6 grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3 rounded-xl bg-brand-tint p-4 text-sm font-semibold">
            <span className="grid size-7 place-items-center rounded-full bg-brand text-xs text-white">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <CustomOrderForm />
    </div>
  );
}
