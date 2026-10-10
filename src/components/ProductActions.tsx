"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useOrder } from "./OrderProvider";
import { cn } from "@/lib/cn";
import { money, type Jersey } from "@/data/jerseys";
import { waLink } from "@/lib/site";
import { useI18n } from "@/i18n/client";

export function ProductActions({ jersey }: { jersey: Jersey }) {
  const { open } = useOrder();
  const { t } = useI18n();
  const [size, setSize] = useState("");

  const ask = waLink(`Hi Elite Jersey, I have a question about: ${jersey.name} (${money(jersey.price)}).`);

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">{t.product.size}</legend>
        <div className="flex flex-wrap gap-2">
          {jersey.sizes.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              onClick={() => setSize(s)}
              className={cn(
                "h-10 min-w-12 rounded-full border px-4 text-sm font-medium transition-colors",
                size === s ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand hover:text-brand",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      {jersey.inStock ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => open(jersey, size || undefined)}
            className="h-12 flex-1 rounded-xl bg-brand px-6 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {t.card.buyNow}
          </button>
          <a
            href={ask}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-brand px-6 font-semibold text-brand transition-colors hover:bg-brand-tint"
          >
            <MessageCircle className="size-5" />
            {t.product.askWhatsapp}
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="grid h-12 place-items-center rounded-xl border border-line bg-white font-semibold text-muted">{t.card.stockOut}</p>
          <a href={waLink(`Hi Elite Jersey, is "${jersey.name}" coming back in stock?`)} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand hover:underline">
            {t.product.askBack}
          </a>
        </div>
      )}
    </div>
  );
}
