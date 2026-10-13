"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Download, MessageCircle, X } from "lucide-react";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { cn } from "@/lib/cn";
import { img, money, type Jersey } from "@/data/jerseys";
import { MessengerLink } from "./MessengerLink";
import { downloadPhoto, orderMessage } from "@/lib/order";
import { waLink } from "@/lib/site";
import { useI18n } from "@/i18n/client";

type Ctx = { open: (jersey: Jersey, size?: string) => void };
const OrderContext = createContext<Ctx | null>(null);

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [jersey, setJersey] = useState<Jersey | null>(null);
  const [size, setSize] = useState<string>("");
  const [downloaded, setDownloaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback((j: Jersey, s?: string) => {
    setJersey(j);
    setSize(s ?? "");
    setDownloaded(false);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (jersey && !d.open) d.showModal();
    if (!jersey && d.open) d.close();
  }, [jersey]);

  async function download() {
    if (!jersey?.image) return;
    setBusy(true);
    try {
      if (await downloadPhoto(jersey)) setDownloaded(true);
    } finally {
      setBusy(false);
    }
  }

  const hasPhoto = Boolean(jersey?.image);
  // Without a photo there is nothing to download, so WhatsApp is available straight away.
  const ready = hasPhoto ? downloaded : true;

  const message = jersey ? orderMessage(jersey, size) : "";

  return (
    <OrderContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="order-title"
        onClose={() => setJersey(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setJersey(null);
        }}
        className="m-auto w-[min(92vw,28rem)] overflow-visible rounded-2xl bg-white p-0 text-ink shadow-2xl max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none"
      >
        {jersey && (
          <div className="relative p-5 sm:p-6">
            <button
              type="button"
              onClick={() => setJersey(null)}
              aria-label={t.shop.close}
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-muted hover:bg-bg hover:text-ink"
            >
              <X className="size-5" />
            </button>
            <h2 id="order-title" className="pr-8 font-display text-xl font-semibold">
              {t.order.title}
            </h2>

            <div className="mt-4 flex gap-4 rounded-xl bg-bg p-3">
              <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-white">
                {jersey.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img(jersey.image, "f_auto,q_auto,w_200")} alt={jersey.name} className="size-full object-contain" />
                ) : (
                  <PhotoPlaceholder label={t.common.photoSoon} compact />
                )}
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold leading-snug">{jersey.name}</p>
                <p className="mt-1 font-display text-lg font-bold">{money(jersey.price)}</p>
              </div>
            </div>

            <fieldset className="mt-4">
              <legend className="mb-2 text-sm font-semibold">{t.order.selectSize}</legend>
              <div className="flex flex-wrap gap-2">
                {jersey.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={size === s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-9 min-w-11 rounded-full border px-3 text-sm font-medium transition-colors",
                      size === s ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand hover:text-brand",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            {hasPhoto ? (
              <ol className="mt-5 space-y-2 text-sm text-muted">
                <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-bold text-brand">1</span>{t.order.s1}</li>
                <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-bold text-brand">2</span>{t.order.s2}</li>
                <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-bold text-brand">3</span>{t.order.s3}</li>
              </ol>
            ) : (
              <p className="mt-5 rounded-lg bg-brand-tint p-3 text-sm text-muted">{t.order.noPhoto}</p>
            )}

            <div className="mt-5 space-y-2.5">
              {hasPhoto && (
                <button
                  type="button"
                  onClick={download}
                  disabled={busy}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
                >
                  {downloaded ? <Check className="size-5" /> : <Download className="size-5" />}
                  {downloaded ? t.order.downloaded : busy ? t.order.preparing : t.order.download}
                </button>
              )}
              <a
                href={ready ? waLink(message) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!ready}
                tabIndex={ready ? 0 : -1}
                className={cn(
                  "flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold text-white transition-colors",
                  ready ? "bg-wa hover:bg-wa-dark" : "pointer-events-none bg-wa/40",
                )}
              >
                <MessageCircle className="size-5" />
                {t.order.cont}
              </a>
              <div className="text-center">
                <MessengerLink jersey={jersey} size={size} />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-muted">{t.order.note}</p>
          </div>
        )}
      </dialog>
    </OrderContext.Provider>
  );
}
