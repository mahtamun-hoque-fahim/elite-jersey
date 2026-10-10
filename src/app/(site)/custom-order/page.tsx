import type { Metadata } from "next";
import { CustomOrderForm } from "@/components/CustomOrderForm";
import { getT } from "@/i18n/server";

export const metadata: Metadata = { title: "Custom Order", description: "Request custom football kits for your local team." };

export default async function CustomOrderPage() {
  const { t } = await getT();
  const steps = [t.custom.step1, t.custom.step2, t.custom.step3];
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t.custom.title}</h1>
      <p className="mt-2 text-muted">{t.custom.subtitle}</p>
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
