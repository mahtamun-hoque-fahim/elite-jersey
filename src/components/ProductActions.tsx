"use client";

import { useState } from "react";
import { Download, ExternalLink, MessageCircle } from "lucide-react";
import { FacebookIcon } from "./BrandIcons";
import { MessengerLink } from "./MessengerLink";
import { downloadPhoto } from "@/lib/order";
import { useOrder } from "./OrderProvider";
import { cn } from "@/lib/cn";
import { money, type Jersey } from "@/data/jerseys";
import { waLink } from "@/lib/site";
import { useI18n } from "@/i18n/client";

export function ProductActions({ jersey }: { jersey: Jersey }) {
  const { open } = useOrder();
  const { t } = useI18n();
  const [size, setSize] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveImage() {
    setSaving(true);
    try {
      await downloadPhoto(jersey);
    } finally {
      setSaving(false);
    }
  }

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

      {(jersey.image || jersey.fbPostUrl) && (
        <div className="flex flex-col gap-3 sm:flex-row">
          {jersey.image && (
            <button
              type="button"
              onClick={saveImage}
              disabled={saving}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
            >
              <Download className="size-4" />
              {t.product.downloadImage}
            </button>
          )}
          {jersey.fbPostUrl && (
            <a
              href={jersey.fbPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              <FacebookIcon className="size-4" />
              {t.product.viewPost}
              <ExternalLink className="size-3.5 text-muted" />
            </a>
          )}
        </div>
      )}

      <MessengerLink jersey={jersey} size={size} />
    </div>
  );
}
